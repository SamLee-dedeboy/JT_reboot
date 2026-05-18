// Shortest-path graph (SPG) computation for KelpFusion.
//
// An edge (u, v) is kept iff no other set point w provides a 2-edge detour
// |uw| + |wv| shorter than t * |uv|, where the tension t interpolates between
// a sparse, MST-like graph (t = 1, line-based look) and a dense, hull-like
// graph (t = 2, hull-based look). To guarantee the boundary always spans the
// set, MST edges are added back if the kept edges leave the graph disconnected.

import type { KelpPoint, SpgEdge, SpgResult } from './types';

function distance(a: KelpPoint, b: KelpPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Minimal union-find for connectivity checks. */
class DisjointSet {
  private parent: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
  }

  find(i: number): number {
    while (this.parent[i] !== i) {
      this.parent[i] = this.parent[this.parent[i]];
      i = this.parent[i];
    }
    return i;
  }

  union(a: number, b: number): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    this.parent[ra] = rb;
    return true;
  }
}

/** Kruskal-style MST over the complete graph of points. */
function minimumSpanningTree(points: KelpPoint[]): SpgEdge[] {
  const candidates: SpgEdge[] = [];
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      candidates.push({ u: i, v: j, weight: distance(points[i], points[j]) });
    }
  }
  candidates.sort((a, b) => a.weight - b.weight);

  const dsu = new DisjointSet(points.length);
  const tree: SpgEdge[] = [];
  for (const edge of candidates) {
    if (dsu.union(edge.u, edge.v)) {
      tree.push(edge);
      if (tree.length === points.length - 1) break;
    }
  }
  return tree;
}

/**
 * Compute the shortest-path graph for a set of points.
 * @param points set members in screen-pixel coordinates
 * @param tension t in [1, 2]; higher keeps more edges (denser, hull-like)
 */
export function computeSPG(points: KelpPoint[], tension: number): SpgResult {
  const n = points.length;
  if (n < 2) {
    return { points, edges: [] };
  }

  const t = Math.max(1, tension);
  const edges: SpgEdge[] = [];
  const edgeKeys = new Set<string>();

  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const direct = distance(points[i], points[j]);
      let keep = true;
      for (let k = 0; k < n; k += 1) {
        if (k === i || k === j) continue;
        const detour = distance(points[i], points[k]) + distance(points[k], points[j]);
        if (detour < t * direct) {
          keep = false;
          break;
        }
      }
      if (keep) {
        edges.push({ u: i, v: j, weight: direct });
        edgeKeys.add(`${i}-${j}`);
      }
    }
  }

  // Guarantee connectivity: add MST edges for any missing links.
  const dsu = new DisjointSet(n);
  for (const edge of edges) {
    dsu.union(edge.u, edge.v);
  }
  for (const edge of minimumSpanningTree(points)) {
    if (dsu.find(edge.u) !== dsu.find(edge.v)) {
      dsu.union(edge.u, edge.v);
      const key = `${Math.min(edge.u, edge.v)}-${Math.max(edge.u, edge.v)}`;
      if (!edgeKeys.has(key)) {
        edges.push(edge);
        edgeKeys.add(key);
      }
    }
  }

  return { points, edges };
}
