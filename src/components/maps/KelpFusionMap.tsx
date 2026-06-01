// Map page hosting the KelpFusion set-visualization overlay.
//
// Renders the Delta station tileset, derives one set per vulnerability group
// from the water-quality data, loads the channel-centerline mesh that
// powers waterway-aware routing, and draws fused KelpFusion boundaries on
// top of the basemap.

import { useEffect, useMemo, useState } from 'react';
import MapGL from 'react-map-gl/mapbox';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';
import DeltaStationPointsLayer from './layers/DeltaStationPointsLayer';
import { WATER_QUALITY_STATION_INDICES } from './layers/deltaStationConstants';
import KelpOverlay, { type KelpRenderMode } from './kelp/KelpOverlay';
import KelpControls from './kelp/KelpControls';
import { useStationCoords } from './kelp/useStationCoords';
import type {
  KelpSet,
  SetStat,
  WaterwayGraph,
  WaterwayRouting,
} from '../../lib/kelp/types';
import {
  buildWaterwayGraphFromGeoJSON,
  computeWaterwayRouting,
} from '../../lib/kelp/waterwayGraph';

interface RawRecord {
  station_index: string | number;
  vulnerability?: string;
}

interface RawWaterQualityData {
  records: RawRecord[];
}

type VulnerabilityGroup = 'HIGHEST' | 'HIGH' | 'MODERATE';

const VULNERABILITY_META: Record<VulnerabilityGroup, { label: string; color: string }> = {
  HIGHEST: { label: 'Highest', color: '#f77c3b' },
  HIGH: { label: 'High', color: '#51a2bd' },
  MODERATE: { label: 'Moderate', color: '#f2c820' },
};
const VULNERABILITY_ORDER: VulnerabilityGroup[] = ['HIGHEST', 'HIGH', 'MODERATE'];

const containerStyle = { position: 'relative', width: '100%', height: '100%' } as const;

/** Slider default for the max waterway-distance threshold. */
const DEFAULT_MAX_DISTANCE_MILES = 10;

interface KelpFusionMapProps {
  /**
   * Optional caller-supplied vulnerability sets. When provided, the map
   * skips the built-in fetch of `water_quality_run15.json` and renders these
   * sets directly. Use this to drive the overlay from live UI state (e.g.
   * threshold sliders) instead of a static dataset.
   *
   * Note: opacity/visible are controlled by KelpControls after mount, so the
   * caller's values are only used as initial defaults. Identity of `sets` is
   * what triggers a refresh — pass a stable reference for stable behavior.
   */
  externalSets?: KelpSet[] | null;
  /** Hide the overlay entirely without unmounting the map. */
  hidden?: boolean;
}

export default function KelpFusionMap({ externalSets = null, hidden = false }: KelpFusionMapProps = {}) {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const [mapObj, setMapObj] = useState<MapboxMap | null>(null);
  const [tension, setTension] = useState(0.4);
  const [sets, setSets] = useState<KelpSet[]>([]);
  const [renderMode, setRenderMode] = useState<KelpRenderMode>('fused');
  const [ensureConnected, setEnsureConnected] = useState(true);
  const [stats, setStats] = useState<SetStat[]>([]);
  const [maxDistanceMiles, setMaxDistanceMiles] = useState(DEFAULT_MAX_DISTANCE_MILES);
  const [waterwayGraph, setWaterwayGraph] = useState<WaterwayGraph | null>(null);

  const stationCoords = useStationCoords(mapObj);

  // Build one set per vulnerability group from the water-quality data.
  // Skipped when the caller passes `externalSets` — that path drives the
  // overlay from live UI state instead.
  useEffect(() => {
    if (externalSets) return;
    let isMounted = true;

    async function loadSets() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}/data/water_quality_run15.json`,
        );
        if (!response.ok) throw new Error(`Failed to load data (${response.status})`);

        const payload = (await response.json()) as RawWaterQualityData;
        const byGroup = new Map<VulnerabilityGroup, number[]>();

        for (const record of payload.records) {
          const group = String(record.vulnerability ?? '').toUpperCase() as VulnerabilityGroup;
          if (!VULNERABILITY_META[group]) continue;
          const index = Number(record.station_index);
          if (!Number.isFinite(index)) continue;
          if (!byGroup.has(group)) byGroup.set(group, []);
          byGroup.get(group)!.push(index);
        }

        const nextSets: KelpSet[] = VULNERABILITY_ORDER.filter((group) =>
          byGroup.has(group),
        ).map((group) => ({
          setId: group,
          label: VULNERABILITY_META[group].label,
          stationIndices: byGroup.get(group)!,
          color: VULNERABILITY_META[group].color,
          opacity: 0.35,
          visible: true,
        }));

        if (isMounted) setSets(nextSets);
      } catch {
        if (isMounted) setSets([]);
      }
    }

    void loadSets();
    return () => {
      isMounted = false;
    };
  }, [externalSets]);

  // External-sets path: mirror the caller's sets into local state, preserving
  // user-edited visible/opacity per set across updates so toggling a checkbox
  // doesn't get reset every time the threshold slider tweaks membership.
  useEffect(() => {
    if (!externalSets) return;
    setSets((current) => {
      const prevById = new Map(current.map((s) => [s.setId, s]));
      return externalSets.map((incoming) => {
        const prev = prevById.get(incoming.setId);
        if (!prev) return incoming;
        return {
          ...incoming,
          visible: prev.visible,
          opacity: prev.opacity,
        };
      });
    });
  }, [externalSets]);

  // Load the channel-centerline mesh once and build the routing graph.
  // Failure is non-fatal: the overlay falls back to straight-line SPG.
  useEffect(() => {
    let isMounted = true;
    async function loadGraph() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}/data/delta_waterway_lines.geojson`,
        );
        if (!response.ok) throw new Error(`Failed to load mesh (${response.status})`);
        const fc = await response.json();
        const graph = buildWaterwayGraphFromGeoJSON(fc);
        if (isMounted) setWaterwayGraph(graph);
      } catch (err) {
        // Keep the overlay usable in straight-line mode if the mesh is absent.
        console.warn(
          '[KelpFusion] waterway graph unavailable, falling back to straight-line SPG:',
          err,
        );
        if (isMounted) setWaterwayGraph(null);
      }
    }
    void loadGraph();
    return () => {
      isMounted = false;
    };
  }, []);

  // Once both the graph and the station coordinates are loaded, compute one
  // global pairwise-routing table over every station the water-quality
  // dataset cares about. Per-set kelp overlays slice into this table by
  // station index — running Dijkstra once per station (~50) instead of once
  // per station per set keeps startup CPU sublinear in set count.
  const routing = useMemo<WaterwayRouting | null>(() => {
    if (!waterwayGraph || !stationCoords.ready) return null;
    return computeWaterwayRouting(
      waterwayGraph,
      stationCoords.lngLatByIndex,
      [...WATER_QUALITY_STATION_INDICES],
    );
  }, [waterwayGraph, stationCoords.ready, stationCoords.lngLatByIndex]);

  const handleSetChange = (setId: string, patch: Partial<KelpSet>) => {
    setSets((current) =>
      current.map((set) => (set.setId === setId ? { ...set, ...patch } : set)),
    );
  };

  const overlayReady = useMemo(
    () => mapObj && stationCoords.ready && sets.length > 0,
    [mapObj, stationCoords.ready, sets.length],
  );

  if (!mapboxToken) {
    return (
      <Box sx={{ ...containerStyle, display: 'grid', placeItems: 'center' }}>
        Add VITE_MAPBOX_TOKEN to render the map.
      </Box>
    );
  }

  return (
    <div style={{ ...containerStyle, display: hidden ? 'none' : 'block' }}>
      <MapGL
        initialViewState={{ longitude: -121.95, latitude: 37.95, zoom: 9.5 }}
        mapStyle="mapbox://styles/justtransition/cmo0kote1006j01st023g37ga"
        mapboxAccessToken={mapboxToken}
        style={{ width: '100%', height: '100%' }}
        onLoad={(evt) => setMapObj(evt.target as MapboxMap)}
      >
        <DeltaStationPointsLayer />
      </MapGL>

      {overlayReady && mapObj && (
        <KelpOverlay
          map={mapObj}
          sets={sets}
          lngLatByIndex={stationCoords.lngLatByIndex}
          tension={tension}
          renderMode={renderMode}
          ensureConnected={ensureConnected}
          routing={routing}
          maxDistanceMiles={maxDistanceMiles}
          onStats={setStats}
        />
      )}

      {sets.length > 0 && (
        <KelpControls
          tension={tension}
          onTensionChange={setTension}
          sets={sets}
          onSetChange={handleSetChange}
          renderMode={renderMode}
          onRenderModeChange={setRenderMode}
          ensureConnected={ensureConnected}
          onEnsureConnectedChange={setEnsureConnected}
          maxDistanceMiles={maxDistanceMiles}
          onMaxDistanceMilesChange={setMaxDistanceMiles}
          routingReady={routing !== null}
          unsnappedStationIndices={routing?.unsnappedStationIndices ?? []}
          stats={stats}
        />
      )}
    </div>
  );
}
