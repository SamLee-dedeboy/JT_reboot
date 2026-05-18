// SVG overlay that draws KelpFusion set boundaries on top of the Mapbox map.
//
// The SPG topology is invariant under map pan and (approximately) uniform
// zoom, so it is computed once per set whenever membership or tension change.
// The fused isocontour is rasterized when the map is settled ('idle'); during
// an active drag the cached contour is kept and an affine transform (derived
// from the pan/zoom delta) is applied so the shape tracks the map seamlessly.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import { computeSPG } from '../../../lib/kelp/shortestPathGraph';
import { rasterizeSetField, fieldToPath, type KelpFieldConfig } from '../../../lib/kelp/kelpFusion';
import type { KelpPoint, KelpSet, SpgEdge } from '../../../lib/kelp/types';

interface KelpOverlayProps {
  map: MapboxMap;
  sets: KelpSet[];
  lngLatByIndex: Map<number, [number, number]>;
  /** Slider value in [0, 1]. */
  tension: number;
}

interface SetTopology {
  set: KelpSet;
  /** Station indices in a stable order; SPG edges reference these positions. */
  order: number[];
  edges: SpgEdge[];
}

/** Map view captured when a fused contour was last rasterized. */
interface ReferenceView {
  anchorLngLat: [number, number];
  anchorScreen: { x: number; y: number };
  zoom: number;
}

const GRID_CELL = 8;
const GRID_PAD = 36;

/** Map the [0,1] slider to SPG tension t (1 = line-based, 2 = hull-based). */
function tensionToT(value: number): number {
  return 1 + Math.max(0, Math.min(1, value));
}

/** Map the [0,1] slider to capsule thickness in px (fatter when denser). */
function tensionToThickness(value: number): number {
  return 14 + Math.max(0, Math.min(1, value)) * 16;
}

export default function KelpOverlay({ map, sets, lngLatByIndex, tension }: KelpOverlayProps) {
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

  // SPG topology — recomputed only when membership or tension change.
  const topologies = useMemo<SetTopology[]>(() => {
    const t = tensionToT(tension);
    return sets.map((set) => {
      const order = set.stationIndices.filter((index) => lngLatByIndex.has(index));
      const points: KelpPoint[] = order.map((index) => {
        const [lng, lat] = lngLatByIndex.get(index)!;
        const projected = map.project([lng, lat]);
        return { id: index, x: projected.x, y: projected.y };
      });
      const { edges } = computeSPG(points, t);
      return { set, order, edges };
    });
  }, [sets, tension, lngLatByIndex, map]);

  /** Re-project a topology's points at the current map view. */
  const projectPoints = (order: number[]): KelpPoint[] =>
    order.map((index) => {
      const [lng, lat] = lngLatByIndex.get(index)!;
      const projected = map.project([lng, lat]);
      return { id: index, x: projected.x, y: projected.y };
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
        const field = rasterizeSetField({ points, edges: topology.edges }, cfg);
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
    // projectPoints is stable enough; deps below cover every input.
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

          const path = fusedPaths.get(set.setId);

          if (!path) {
            // First-load fallback: no contour rasterized yet.
            const points = projectPoints(topology.order);
            return (
              <g key={set.setId}>
                {topology.edges.map((edge, i) => {
                  const a = points[edge.u];
                  const b = points[edge.v];
                  return (
                    <line
                      key={i}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={set.color}
                      strokeWidth={tensionToThickness(tension) * 1.4}
                      strokeLinecap="round"
                      opacity={set.opacity * 0.85}
                    />
                  );
                })}
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
