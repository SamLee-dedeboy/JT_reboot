// Map page hosting the KelpFusion set-visualization overlay.
//
// Renders the Delta station tileset, derives one set per vulnerability group
// from the water-quality data, and draws fused KelpFusion boundaries on top.

import { useEffect, useMemo, useState } from 'react';
import MapGL from 'react-map-gl/mapbox';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';
import DeltaStationPointsLayer from './layers/DeltaStationPointsLayer';
import KelpOverlay from './kelp/KelpOverlay';
import KelpControls from './kelp/KelpControls';
import { useStationCoords } from './kelp/useStationCoords';
import type { KelpSet } from '../../lib/kelp/types';

interface RawRecord {
  station_index: string | number;
  vulnerability?: string;
}

interface RawWaterQualityData {
  records: RawRecord[];
}

type VulnerabilityGroup = 'HIGHEST' | 'HIGH' | 'MODERATE';

const VULNERABILITY_META: Record<VulnerabilityGroup, { label: string; color: string }> = {
  HIGHEST: { label: 'Highest Vulnerability', color: '#f77c3b' },
  HIGH: { label: 'High Vulnerability', color: '#51a2bd' },
  MODERATE: { label: 'Moderate Vulnerability', color: '#f2c820' },
};
const VULNERABILITY_ORDER: VulnerabilityGroup[] = ['HIGHEST', 'HIGH', 'MODERATE'];

const containerStyle = { position: 'relative', width: '100%', height: '100%' } as const;

export default function KelpFusionMap() {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const [mapObj, setMapObj] = useState<MapboxMap | null>(null);
  const [tension, setTension] = useState(0.4);
  const [sets, setSets] = useState<KelpSet[]>([]);

  const stationCoords = useStationCoords(mapObj);

  // Build one set per vulnerability group from the water-quality data.
  useEffect(() => {
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
  }, []);

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
    <div style={containerStyle}>
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
        />
      )}

      {sets.length > 0 && (
        <KelpControls
          tension={tension}
          onTensionChange={setTension}
          sets={sets}
          onSetChange={handleSetChange}
        />
      )}
    </div>
  );
}
