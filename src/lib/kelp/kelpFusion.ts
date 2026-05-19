// KelpFusion "fusion" rendering: rasterize a union-of-capsules distance field
// from a shortest-path graph, then extract a smooth isocontour with d3-contour.

import * as d3 from 'd3';
import type { SpgResult } from './types';

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
 * Build a scalar field where value > 0 inside the fused boundary.
 * value = thickness - distance(cell, nearest SPG segment/point).
 */
export function rasterizeSetField(
  spg: Pick<SpgResult, 'points' | 'edges'>,
  cfg: KelpFieldConfig,
): KelpField {
  const { width, height, cell, thickness, pad } = cfg;
  const gw = Math.max(1, Math.ceil((width + 2 * pad) / cell));
  const gh = Math.max(1, Math.ceil((height + 2 * pad) / cell));
  const values = new Float32Array(gw * gh);

  const { points, edges } = spg;

  for (let row = 0; row < gh; row += 1) {
    const wy = -pad + (row + 0.5) * cell;
    for (let col = 0; col < gw; col += 1) {
      const wx = -pad + (col + 0.5) * cell;
      let nearest = Infinity;

      if (edges.length > 0) {
        for (const edge of edges) {
          const a = points[edge.u];
          const b = points[edge.v];
          const d = distToSegment(wx, wy, a.x, a.y, b.x, b.y);
          if (d < nearest) nearest = d;
        }
      } else {
        // Isolated point(s): treat each as a disc.
        for (const p of points) {
          const d = Math.hypot(wx - p.x, wy - p.y);
          if (d < nearest) nearest = d;
        }
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
