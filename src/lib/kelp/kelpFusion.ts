// KelpFusion "fusion" rendering: rasterize a union-of-capsules distance field
// from a shortest-path graph, then extract a smooth isocontour with d3-contour.
//
// Each SPG edge carries a polyline in overlay-pixel space (a single segment
// `[u_xy, v_xy]` for straight-line mode, or a multi-vertex polyline that
// follows the waterway-network shortest path in waterway-routing mode). The
// distance field is the minimum distance from a grid cell to any polyline
// segment, which generalizes the original single-segment-per-edge formula
// without changing the union-of-capsules look.

import * as d3 from 'd3';
import type { KelpPoint } from './types';

export interface KelpFieldConfig {
  /** Overlay width in px. */
  width: number;
  /** Overlay height in px. */
  height: number;
  /** Grid cell size in px (smaller = smoother but slower). */
  cell: number;
  /** Capsule half-width in px — how fat the fused boundary is. */
  thickness: number;
  /** Extra px sampled beyond the overlay so contours don't clip at the edge. */
  pad: number;
}

/**
 * An SPG edge prepared for rasterization. `polyline` is a sequence of
 * overlay-pixel coordinates `[x, y]`, with length ≥ 2; the first and last
 * vertices coincide with the edge's two endpoint stations.
 */
export interface ProjectedEdge {
  polyline: [number, number][];
}

export interface RasterizerInput {
  points: KelpPoint[];
  edges: ProjectedEdge[];
}

interface KelpField {
  values: Float32Array;
  gw: number;
  gh: number;
}

/** Distance from point (px,py) to segment (ax,ay)-(bx,by). */
function distToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/**
 * Minimum distance from a query point to any segment in a polyline.
 * Generalization of {@link distToSegment} that lets waterway-routed edges
 * follow channel polylines instead of straight lines.
 */
export function distToPolyline(
  px: number,
  py: number,
  polyline: [number, number][],
): number {
  let nearest = Infinity;
  for (let i = 1; i < polyline.length; i += 1) {
    const [ax, ay] = polyline[i - 1];
    const [bx, by] = polyline[i];
    const d = distToSegment(px, py, ax, ay, bx, by);
    if (d < nearest) nearest = d;
  }
  return nearest;
}

/**
 * Build a scalar field where value > 0 inside the fused boundary.
 * value = thickness − distance(cell, nearest polyline / point).
 *
 * Always considers both polylines and individual points. This ensures:
 *   1. Stations belonging to single-node components (no incident edge —
 *      e.g. threshold-isolated by the waterway distance cap) still get
 *      a disc, even when other components in the same set contribute
 *      edges.
 *   2. Connected stations whose snapped-mesh-node position differs from
 *      their tileset lng/lat (up to the station-snap tolerance, ~75 m)
 *      still sit inside the rendered blob — the polyline follows the
 *      centerline while the disc pulls the boundary to the dot's true
 *      pixel position.
 *
 * For a station that *is* on an incident polyline, the per-point distance
 * is already 0 from the polyline term, so the redundant check is cheap and
 * never makes the field smaller.
 */
export function rasterizeSetField(
  input: RasterizerInput,
  cfg: KelpFieldConfig,
): KelpField {
  const { width, height, cell, thickness, pad } = cfg;
  const gw = Math.max(1, Math.ceil((width + 2 * pad) / cell));
  const gh = Math.max(1, Math.ceil((height + 2 * pad) / cell));
  const values = new Float32Array(gw * gh);

  const { points, edges } = input;

  for (let row = 0; row < gh; row += 1) {
    const wy = -pad + (row + 0.5) * cell;
    for (let col = 0; col < gw; col += 1) {
      const wx = -pad + (col + 0.5) * cell;
      let nearest = Infinity;

      for (const edge of edges) {
        const d = distToPolyline(wx, wy, edge.polyline);
        if (d < nearest) nearest = d;
      }
      for (const p of points) {
        const d = Math.hypot(wx - p.x, wy - p.y);
        if (d < nearest) nearest = d;
      }

      values[row * gw + col] = thickness - nearest;
    }
  }

  return { values, gw, gh };
}

/**
 * Convert a scalar field to a smoothed SVG path 'd' string in overlay px.
 * Returns an empty string when the field is entirely outside the boundary.
 */
export function fieldToPath(field: KelpField, cfg: KelpFieldConfig): string {
  const { values, gw, gh } = field;
  const { cell, pad } = cfg;

  const contours = d3
    .contours()
    .size([gw, gh])
    .thresholds([0])(Array.from(values));

  if (contours.length === 0) return '';

  const toPx = (gridX: number, gridY: number): [number, number] => [
    -pad + (gridX + 0.5) * cell,
    -pad + (gridY + 0.5) * cell,
  ];

  const smooth = d3.line<[number, number]>().curve(d3.curveBasisClosed);

  let path = '';
  for (const polygon of contours[0].coordinates) {
    for (const ring of polygon) {
      const pts = ring.map(([gx, gy]) => toPx(gx, gy));
      const segment = smooth(pts);
      if (segment) path += `${segment}Z`;
    }
  }
  return path;
}
