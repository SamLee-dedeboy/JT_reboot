// SVG overlay that draws KelpFusion set boundaries on top of the Mapbox map.
//
// The SPG topology is invariant under map pan and (approximately) uniform
// zoom, so it is computed once per set whenever membership, tension or the
// distance threshold change. The fused isocontour is rasterized when the
// map is settled ('idle'); during an active drag the cached contour is
// kept and an affine transform (derived from the pan/zoom delta) is
// applied so the shape tracks the map seamlessly.
//
// When a WaterwayRouting table is supplied, edges follow channel polylines
// (each SpgEdge.path is in lng/lat and re-projected per render) and the
// SPG selection uses waterway-network distance with a hard mileage
// threshold. With no routing, behavior reverts to the original Euclidean
// straight-line SPG so the map page stays usable even if the centerline
// mesh fails to load.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import {
  computeSPG,
  computeSPGFromDistanceMatrix,
} from '../../../lib/kelp/shortestPathGraph';
import {
  rasterizeSetField,
  fieldToPath,
  type KelpFieldConfig,
  type ProjectedEdge,
} from '../../../lib/kelp/kelpFusion';
import { tensionToT, tensionToThickness } from '../../../lib/kelp/tension';
import type {
  KelpPoint,
  KelpSet,
  SetStat,
  SpgEdge,
  WaterwayRouting,
} from '../../../lib/kelp/types';

export type KelpRenderMode = 'fused' | 'graph';

interface KelpOverlayProps {
  map: MapboxMap;
  sets: KelpSet[];
  lngLatByIndex: Map<number, [number, number]>;
  /** Slider value in [0, 1]. */
  tension: number;
  /** 'fused' draws the smooth contour; 'graph' draws the raw SPG (dev view). */
  renderMode: KelpRenderMode;
  /** When false, the SPG keeps no MST fallback and may be disconnected. */
  ensureConnected: boolean;
  /**
   * Precomputed pairwise routing over the channel-centerline mesh. When
   * `null`, the overlay falls back to Euclidean SPG with no threshold.
   */
  routing: WaterwayRouting | null;
  /** Max waterway distance allowed between two connected stations, in miles. */
  maxDistanceMiles: number;
  /** Reports per-set connected-component counts to the dev controls. */
  onStats?: (stats: SetStat[]) => void;
}

interface SetTopology {
  set: KelpSet;
  /** Station indices in a stable order; SPG edges reference these positions. */
  order: number[];
  edges: SpgEdge[];
  componentCount: number;
}

/** Map view captured when a fused contour was last rasterized. */
interface ReferenceView {
  anchorLngLat: [number, number];
  anchorScreen: { x: number; y: number };
  zoom: number;
}

const GRID_CELL = 8;
const GRID_PAD = 36;
const METERS_PER_MILE = 1609.344;

export default function KelpOverlay({
  map,
  sets,
  lngLatByIndex,
  tension,
  renderMode,
  ensureConnected,
  routing,
  maxDistanceMiles,
  onStats,
}: KelpOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [, setTick] = useState(0);
  const [fusedPaths, setFusedPaths] = useState<Map<string, string>>(new Map());
  const [dragTransform, setDragTransform] = useState('');
  const renderGenRef = useRef(0);
  const refViewRef = useRef<ReferenceView | null>(null);

  // Track the overlay size.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () =>
      setSize({ width: element.clientWidth, height: element.clientHeight });
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // React to map movement.
  useEffect(() => {
    const onMoveStart = () => setIsMoving(true);

    const onMove = () => {
      setTick((t) => t + 1);
      // Track the cached contour with an affine transform of the pan/zoom delta.
      const ref = refViewRef.current;
      if (!ref) {
        setDragTransform('');
        return;
      }
      const scale = 2 ** (map.getZoom() - ref.zoom);
      const now = map.project(ref.anchorLngLat);
      const tx = now.x - scale * ref.anchorScreen.x;
      const ty = now.y - scale * ref.anchorScreen.y;
      setDragTransform(`translate(${tx} ${ty}) scale(${scale})`);
    };

    const onIdle = () => {
      setIsMoving(false);
      setDragTransform('');
      setTick((t) => t + 1);
    };

    map.on('movestart', onMoveStart);
    map.on('move', onMove);
    map.on('idle', onIdle);
    return () => {
      map.off('movestart', onMoveStart);
      map.off('move', onMove);
      map.off('idle', onIdle);
    };
  }, [map]);

  /**
   * Build a station-index → global-routing-row map so per-set SPG can
   * slice into the precomputed pairwise matrix. Independent of map view
   * so it only changes when the routing object itself changes.
   */
  const routingIndexByStationId = useMemo<Map<number, number> | null>(() => {
    if (!routing) return null;
    const m = new Map<number, number>();
    for (let i = 0; i < routing.stationIndices.length; i += 1) {
      m.set(routing.stationIndices[i], i);
    }
    return m;
  }, [routing]);

  // SPG topology — recomputed when membership, tension, connectivity option,
  // or distance threshold change. When waterway routing is available we use
  // waterway distance + mileage threshold; otherwise we fall back to
  // Euclidean SPG over screen-pixel positions.
  const topologies = useMemo<SetTopology[]>(() => {
    const t = tensionToT(tension);
    const maxMeters = Number.isFinite(maxDistanceMiles)
      ? maxDistanceMiles * METERS_PER_MILE
      : Infinity;

    return sets.map((set) => {
      // Filter to stations whose coordinates have actually loaded. When
      // routing is available we additionally drop stations that failed to
      // snap to the mesh (their global row exists but distances are all
      // Infinity, so they'd be filtered anyway — explicit drop keeps the
      // pixel point list and the matrix indices aligned).
      const order = set.stationIndices.filter((index) => {
        if (!lngLatByIndex.has(index)) return false;
        if (routing && routingIndexByStationId) {
          const gIdx = routingIndexByStationId.get(index);
          if (gIdx === undefined) return false;
          if (routing.nodeIndex[gIdx] < 0) return false;
        }
        return true;
      });

      const points: KelpPoint[] = order.map((index) => {
        const [lng, lat] = lngLatByIndex.get(index)!;
        const projected = map.project([lng, lat]);
        return { id: index, x: projected.x, y: projected.y };
      });

      if (routing && routingIndexByStationId) {
        const n = order.length;
        // Per-set sub-distance-matrix, sliced from the global routing table.
        const subMatrix: number[][] = Array.from({ length: n }, () =>
          new Array<number>(n).fill(Infinity),
        );
        for (let i = 0; i < n; i += 1) subMatrix[i][i] = 0;
        const globalIdx = order.map((stationId) => routingIndexByStationId.get(stationId)!);
        for (let i = 0; i < n; i += 1) {
          for (let j = i + 1; j < n; j += 1) {
            const d = routing.distanceMeters[globalIdx[i]][globalIdx[j]];
            subMatrix[i][j] = d;
            subMatrix[j][i] = d;
          }
        }

        const { edges, componentCount } = computeSPGFromDistanceMatrix(
          points,
          subMatrix,
          t,
          { ensureConnected, maxDistanceMeters: maxMeters },
        );

        // Attach the lng/lat polyline that the rasterizer + graph renderer
        // need. Every kept edge has a finite weight by construction, so
        // `path[i][j]` is guaranteed to be defined.
        const edgesWithPaths: SpgEdge[] = edges.map((edge) => ({
          ...edge,
          path: routing.path[globalIdx[edge.u]][globalIdx[edge.v]],
        }));

        return { set, order, edges: edgesWithPaths, componentCount };
      }

      // Fallback: original straight-line Euclidean SPG.
      const { edges, componentCount } = computeSPG(points, t, { ensureConnected });
      return { set, order, edges, componentCount };
    });
  }, [
    sets,
    tension,
    ensureConnected,
    lngLatByIndex,
    map,
    routing,
    routingIndexByStationId,
    maxDistanceMiles,
  ]);

  // Surface per-set connectivity diagnostics to the dev controls.
  useEffect(() => {
    onStats?.(
      topologies.map((topology) => ({
        setId: topology.set.setId,
        componentCount: topology.componentCount,
      })),
    );
  }, [topologies, onStats]);

  /** Re-project a topology's points at the current map view. */
  const projectPoints = (order: number[]): KelpPoint[] =>
    order.map((index) => {
      const [lng, lat] = lngLatByIndex.get(index)!;
      const projected = map.project([lng, lat]);
      return { id: index, x: projected.x, y: projected.y };
    });

  /**
   * Project a topology's SPG edges to overlay-pixel polylines.
   * Each waterway-routed edge follows its precomputed lng/lat path; a
   * straight-line fallback edge becomes a 2-vertex polyline so the
   * rasterizer's per-segment loop still works without a special case.
   */
  const projectEdges = (points: KelpPoint[], edges: SpgEdge[]): ProjectedEdge[] =>
    edges.map((edge) => {
      if (edge.path && edge.path.length >= 2) {
        const polyline: [number, number][] = edge.path.map(([lng, lat]) => {
          const p = map.project([lng, lat]);
          return [p.x, p.y];
        });
        return { polyline };
      }
      const a = points[edge.u];
      const b = points[edge.v];
      return { polyline: [[a.x, a.y], [b.x, b.y]] };
    });

  // Full fused render when the map is settled.
  useEffect(() => {
    if (isMoving || size.width === 0 || size.height === 0) return;

    renderGenRef.current += 1;
    const generation = renderGenRef.current;

    const handle = requestAnimationFrame(() => {
      if (generation !== renderGenRef.current) return;

      const cfg: KelpFieldConfig = {
        width: size.width,
        height: size.height,
        cell: GRID_CELL,
        thickness: tensionToThickness(tension),
        pad: GRID_PAD,
      };

      const next = new Map<string, string>();
      for (const topology of topologies) {
        if (!topology.set.visible || topology.order.length === 0) continue;
        const points = projectPoints(topology.order);
        const projected = projectEdges(points, topology.edges);
        const field = rasterizeSetField({ points, edges: projected }, cfg);
        next.set(topology.set.setId, fieldToPath(field, cfg));
      }
      setFusedPaths(next);

      // Capture the view this contour was rasterized at, so drags can
      // transform it instead of re-rasterizing every frame.
      const center = map.getCenter();
      const anchorLngLat: [number, number] = [center.lng, center.lat];
      const anchorScreen = map.project(anchorLngLat);
      refViewRef.current = {
        anchorLngLat,
        anchorScreen: { x: anchorScreen.x, y: anchorScreen.y },
        zoom: map.getZoom(),
      };
    });

    return () => cancelAnimationFrame(handle);
    // projectPoints / projectEdges are stable enough; deps below cover every input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMoving, size.width, size.height, tension, topologies]);

  // Sort largest set last so smaller sets stay readable on top.
  const drawOrder = [...topologies].sort(
    (a, b) => b.order.length - a.order.length,
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <svg width={size.width} height={size.height} style={{ display: 'block' }}>
        {drawOrder.map((topology) => {
          const { set } = topology;
          if (!set.visible || topology.order.length === 0) return null;

          if (renderMode === 'graph') {
            // Dev view: raw shortest-path graph — thin polylines + station dots.
            const points = projectPoints(topology.order);
            const projected = projectEdges(points, topology.edges);
            return (
              <g key={set.setId}>
                {projected.map((edge, i) => (
                  <polyline
                    key={i}
                    points={edge.polyline.map(([x, y]) => `${x},${y}`).join(' ')}
                    fill="none"
                    stroke={set.color}
                    strokeWidth={1.5}
                  />
                ))}
                {points.map((p) => (
                  <circle
                    key={p.id}
                    cx={p.x}
                    cy={p.y}
                    r={3.5}
                    fill={set.color}
                    stroke="#161616"
                    strokeWidth={1}
                  />
                ))}
              </g>
            );
          }

          const path = fusedPaths.get(set.setId);

          if (!path) {
            // First-load fallback: no contour rasterized yet. Render the SPG
            // skeleton as thick rounded strokes so the boundary "shape" is
            // visible immediately, then swap to the smoothed contour once
            // rasterization completes on the next 'idle'.
            const points = projectPoints(topology.order);
            const projected = projectEdges(points, topology.edges);
            return (
              <g key={set.setId}>
                {projected.map((edge, i) => (
                  <polyline
                    key={i}
                    points={edge.polyline.map(([x, y]) => `${x},${y}`).join(' ')}
                    fill="none"
                    stroke={set.color}
                    strokeWidth={tensionToThickness(tension) * 1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={set.opacity * 0.85}
                  />
                ))}
                {points.map((p) => (
                  <circle
                    key={p.id}
                    cx={p.x}
                    cy={p.y}
                    r={tensionToThickness(tension) * 0.7}
                    fill={set.color}
                    opacity={set.opacity * 0.85}
                  />
                ))}
              </g>
            );
          }

          return (
            <g key={set.setId} transform={isMoving ? dragTransform : undefined}>
              <path
                d={path}
                fill={set.color}
                fillOpacity={set.opacity}
                stroke={set.color}
                strokeOpacity={Math.min(1, set.opacity + 0.3)}
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
