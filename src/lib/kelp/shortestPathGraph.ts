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

/** Count connected components of `n` nodes given an edge list. */
function countComponents(n: number, edges: SpgEdge[]): number {
  if (n === 0) return 0;
  const dsu = new DisjointSet(n);
  for (const edge of edges) {
    dsu.union(edge.u, edge.v);
  }
  const roots = new Set<number>();
  for (let i = 0; i < n; i += 1) {
    roots.add(dsu.find(i));
  }
  return roots.size;
}

export interface ComputeSPGOptions {
  /** When false, skip the MST fallback — the graph may be disconnected. */
  ensureConnected?: boolean;
}

/**
 * Compute the shortest-path graph for a set of points using Euclidean
 * pixel-space distance. This is the original KelpFusion entry point and
 * remains the fallback when no waterway routing is available.
 *
 * @param points set members in screen-pixel coordinates
 * @param tension t in [1, 2]; higher keeps fewer edges (sparser, line-like)
 * @param options set `ensureConnected: false` to inspect the raw graph
 */
export function computeSPG(
  points: KelpPoint[],
  tension: number,
  options: ComputeSPGOptions = {},
): SpgResult {
  const { ensureConnected = true } = options;
  const n = points.length;
  if (n < 2) {
    return { points, edges: [], componentCount: n };
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
  if (ensureConnected) {
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
  }

  return { points, edges, componentCount: countComponents(n, edges) };
}

export interface ComputeSPGFromMatrixOptions extends ComputeSPGOptions {
  /**
   * Drop candidate edges whose precomputed distance exceeds this many
   * meters. Stations whose pairwise distance is `Infinity` (unreachable or
   * unsnapped) are always dropped regardless of the threshold.
   *
   * When `ensureConnected` is true, MST fallback edges also respect this
   * threshold — if a cohort is split by the threshold, it stays split.
   */
  maxDistanceMeters?: number;
}

/**
 * Shortest-path graph variant that uses a precomputed pairwise distance
 * matrix instead of Euclidean point-to-point distance.
 *
 * Edge weights stored on the result are the matrix distance (typically
 * waterway-network meters from {@link computeWaterwayRouting}). The detour
 * check, threshold filter, and MST fallback all operate on the same matrix
 * so "shortest" really means shortest through the network — not as the
 * crow flies.
 *
 * `points` is retained for the renderer (it still needs screen-pixel
 * positions for the contour rasterizer); they have no influence on
 * topology here.
 */
export function computeSPGFromDistanceMatrix(
  points: KelpPoint[],
  distanceMatrix: number[][],
  tension: number,
  options: ComputeSPGFromMatrixOptions = {},
): SpgResult {
  const { ensureConnected = true, maxDistanceMeters = Infinity } = options;
  const n = points.length;
  if (n < 2) {
    return { points, edges: [], componentCount: n };
  }
  if (distanceMatrix.length !== n) {
    throw new Error(
      `distanceMatrix size (${distanceMatrix.length}) does not match point count (${n})`,
    );
  }

  const t = Math.max(1, tension);

  // Quick accessor that treats unreachable / out-of-threshold pairs uniformly.
  const reach = (i: number, j: number): number => {
    const d = distanceMatrix[i][j];
    if (!Number.isFinite(d) || d > maxDistanceMeters) return Infinity;
    return d;
  };

  const edges: SpgEdge[] = [];
  const edgeKeys = new Set<string>();

  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const direct = reach(i, j);
      if (!Number.isFinite(direct)) continue; // hard-filtered by threshold/unreach
      let keep = true;
      for (let k = 0; k < n; k += 1) {
        if (k === i || k === j) continue;
        const leg1 = reach(i, k);
        if (!Number.isFinite(leg1)) continue;
        const leg2 = reach(k, j);
        if (!Number.isFinite(leg2)) continue;
        if (leg1 + leg2 < t * direct) {
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

  // Threshold-respecting MST fallback. If a cohort splits because all
  // bridging pairs exceed the threshold, we leave it split — that matches
  // the user-intent of "disconnect if waterway distance > threshold."
  if (ensureConnected) {
    const dsu = new DisjointSet(n);
    for (const edge of edges) {
      dsu.union(edge.u, edge.v);
    }

    const candidates: SpgEdge[] = [];
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const w = reach(i, j);
        if (Number.isFinite(w)) {
          candidates.push({ u: i, v: j, weight: w });
        }
      }
    }
    candidates.sort((a, b) => a.weight - b.weight);

    for (const edge of candidates) {
      if (dsu.find(edge.u) !== dsu.find(edge.v)) {
        dsu.union(edge.u, edge.v);
        const key = `${Math.min(edge.u, edge.v)}-${Math.max(edge.u, edge.v)}`;
        if (!edgeKeys.has(key)) {
          edges.push(edge);
          edgeKeys.add(key);
        }
      }
    }
  }

  return { points, edges, componentCount: countComponents(n, edges) };
}
