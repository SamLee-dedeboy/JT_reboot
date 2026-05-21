// Waterway-mesh routing primitives for KelpFusion.
//
// Builds a routable graph from a FeatureCollection of LineString centerlines
// (see `public/data/delta_waterway_lines.geojson`, produced by
// `scripts/extract_centerlines.py`), snaps each station to the *nearest
// channel segment* and splits that segment by inserting a virtual node at
// the projection, then runs Dijkstra so kelp edges can use waterway
// distance and follow the actual channel polyline.
//
// Segment-snap (perpendicular distance to the nearest centerline segment)
// is the meaningful metric, not nearest-node distance: Delta channels are
// commonly 100–300 m wide, so a station on the bank can sit hundreds of
// meters from the nearest centerline vertex while being only a few meters
// from the centerline itself.
//
// All distances are geodesic meters (Haversine). Coordinates are lng/lat
// in WGS84. The graph is undirected and built once per app load; the
// pairwise routing for each cohort of stations is computed once and
// cached in the React tree.

import type { WaterwayGraph, WaterwayRouting } from './types';

/**
 * Default snap radius (meters) — the maximum perpendicular distance from a
 * station to the nearest centerline segment.
 *
 * Why 1000 m: the medial axis of a polygon runs down its middle, so a
 * station on the bank of a wide Delta channel sits roughly `channelWidth/2`
 * from the nearest centerline. The widest Delta cross-sections (Sacramento
 * at Mallard Island, the San Joaquin near San Andreas Landing) push that
 * geometric minimum well over 250 m — three of the curated 46 water-
 * quality stations measure 295 / 314 / 816 m from the centerline despite
 * sitting squarely inside the water polygon.
 *
 * The "right" fix is polygon-aware snapping (always snap if inside water),
 * but for this curated cohort — every station name is "X River at Y" — a
 * generous Euclidean tolerance is robust: there is no plausible station
 * coordinate that is both ≤ 1000 m from a centerline and not on the
 * waterway. If we ever expand to uncurated stations, switch to PIP-gated
 * snapping (ship a simplified `delta_waterway_polygon.geojson` and a
 * y-sorted-edge point-in-polygon test).
 */
export const DEFAULT_STATION_SNAP_METERS = 1000;

/** Earth radius used by the Haversine formula. */
const EARTH_RADIUS_METERS = 6_371_008.8;

/** Meters per degree of latitude — invariant. */
const METERS_PER_DEG_LAT = 111_320;

/**
 * Geodesic distance between two lng/lat coordinates in meters.
 * Standard Haversine; accurate to <0.5% across the Delta extent.
 */
export function haversineMeters(
  [lng1, lat1]: [number, number],
  [lng2, lat2]: [number, number],
): number {
  const toRad = Math.PI / 180;
  const phi1 = lat1 * toRad;
  const phi2 = lat2 * toRad;
  const dPhi = (lat2 - lat1) * toRad;
  const dLambda = (lng2 - lng1) * toRad;
  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(a)));
}

interface WaterwayFeature {
  type: 'Feature';
  geometry: { type: 'LineString'; coordinates: [number, number][] };
}
interface WaterwayCollection {
  type: 'FeatureCollection';
  features: WaterwayFeature[];
}

/**
 * Snap key used to coalesce floating-point-equivalent endpoints into a
 * single graph node. 6 decimals ≈ 0.11 m at 38°N — looser than the source
 * file's 5-decimal rounding so adjacent line endpoints collapse cleanly.
 */
const NODE_SNAP_DECIMALS = 6;
function nodeKey([lng, lat]: [number, number]): string {
  return `${lng.toFixed(NODE_SNAP_DECIMALS)},${lat.toFixed(NODE_SNAP_DECIMALS)}`;
}

/**
 * Build the waterway routing graph from a centerline FeatureCollection.
 *
 * Every consecutive vertex pair in every LineString becomes one undirected
 * edge. Endpoints from different features that round to the same lng/lat
 * (within ~0.1 m) merge into a single node, restoring topology that the
 * GeoJSON's per-feature structure obscures.
 */
export function buildWaterwayGraphFromGeoJSON(
  fc: WaterwayCollection,
): WaterwayGraph {
  const nodes: [number, number][] = [];
  const adj: { to: number; weightMeters: number }[][] = [];
  const indexByKey = new Map<string, number>();

  const ensureNode = (pt: [number, number]): number => {
    const key = nodeKey(pt);
    let idx = indexByKey.get(key);
    if (idx === undefined) {
      idx = nodes.length;
      indexByKey.set(key, idx);
      nodes.push(pt);
      adj.push([]);
    }
    return idx;
  };

  for (const feat of fc.features) {
    const coords = feat.geometry?.coordinates;
    if (!coords || coords.length < 2) continue;
    let prev = ensureNode(coords[0]);
    for (let i = 1; i < coords.length; i += 1) {
      const cur = ensureNode(coords[i]);
      if (cur === prev) continue; // skip zero-length segments
      const w = haversineMeters(nodes[prev], nodes[cur]);
      // Undirected; both directions cost the same.
      adj[prev].push({ to: cur, weightMeters: w });
      adj[cur].push({ to: prev, weightMeters: w });
      prev = cur;
    }
  }

  return { nodes, adj };
}

// ---------------------------------------------------------------------------
// Segment-snap layer: each station is snapped to the nearest centerline
// segment (perpendicular distance) and then attached to the graph as a
// virtual node by splitting the segment at the projection point. This is
// strictly more permissive than nearest-node snapping (a station 5 m from
// a long edge between two vertices 600 m apart can be 300 m from either
// vertex but only 5 m from the segment) and gives Dijkstra a starting
// point that actually lies on the channel.
// ---------------------------------------------------------------------------

interface SegmentRef {
  u: number;
  v: number;
}

interface SegmentIndex {
  cellDeg: number;
  cells: Map<string, number[]>;
  /** Normalized segment list (`u < v`). Cell buckets hold indices into this. */
  segments: SegmentRef[];
}

/**
 * Uniform-grid spatial index over the graph's segments. Each segment is
 * added to every cell its bounding box intersects; queries fan out by the
 * snap radius rather than a fixed 3×3 neighborhood, so an oversized
 * tolerance still inspects every candidate segment.
 *
 * cellDeg = 0.005 ≈ 555 m of latitude / ~440 m of longitude at 38°N — a
 * size where most segments fall in a single cell and a 250-m snap query
 * still only needs to read a 3×3 neighborhood.
 */
function buildSegmentIndex(graph: WaterwayGraph, cellDeg = 0.005): SegmentIndex {
  const segments: SegmentRef[] = [];
  const cells = new Map<string, number[]>();
  const seen = new Set<string>();

  for (let u = 0; u < graph.nodes.length; u += 1) {
    for (const { to: v } of graph.adj[u]) {
      const lo = Math.min(u, v);
      const hi = Math.max(u, v);
      const key = `${lo}-${hi}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const segIdx = segments.length;
      segments.push({ u: lo, v: hi });
      const [aLng, aLat] = graph.nodes[lo];
      const [bLng, bLat] = graph.nodes[hi];
      const cxMin = Math.floor(Math.min(aLng, bLng) / cellDeg);
      const cxMax = Math.floor(Math.max(aLng, bLng) / cellDeg);
      const cyMin = Math.floor(Math.min(aLat, bLat) / cellDeg);
      const cyMax = Math.floor(Math.max(aLat, bLat) / cellDeg);
      for (let cx = cxMin; cx <= cxMax; cx += 1) {
        for (let cy = cyMin; cy <= cyMax; cy += 1) {
          const cellKey = `${cx},${cy}`;
          let bucket = cells.get(cellKey);
          if (!bucket) {
            bucket = [];
            cells.set(cellKey, bucket);
          }
          bucket.push(segIdx);
        }
      }
    }
  }

  return { cellDeg, cells, segments };
}

/**
 * Project a point onto a segment using a local equirectangular frame.
 * Returns the clamped parameter `t ∈ [0, 1]`, the projected lng/lat, and
 * the perpendicular distance in meters. Accurate to sub-meter across the
 * Delta extent — the equirectangular distortion is negligible at <1° spans.
 */
function projectPointOnSegment(
  p: [number, number],
  a: [number, number],
  b: [number, number],
): { t: number; distMeters: number; point: [number, number] } {
  const mPerDegLng = METERS_PER_DEG_LAT * Math.cos((a[1] * Math.PI) / 180);
  const ax = 0;
  const ay = 0;
  const bx = (b[0] - a[0]) * mPerDegLng;
  const by = (b[1] - a[1]) * METERS_PER_DEG_LAT;
  const px = (p[0] - a[0]) * mPerDegLng;
  const py = (p[1] - a[1]) * METERS_PER_DEG_LAT;
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  const distMeters = Math.hypot(px - cx, py - cy);
  const point: [number, number] = [
    a[0] + t * (b[0] - a[0]),
    a[1] + t * (b[1] - a[1]),
  ];
  return { t, distMeters, point };
}

interface SegmentSnap {
  segmentIdx: number;
  t: number;
  point: [number, number];
  distMeters: number;
}

/**
 * Find the nearest centerline segment to a lng/lat within `maxMeters`.
 * Returns `null` if no segment is within tolerance.
 */
function snapPointToSegment(
  pt: [number, number],
  graph: WaterwayGraph,
  index: SegmentIndex,
  maxMeters: number,
): SegmentSnap | null {
  const [lng, lat] = pt;
  const cellMeters = index.cellDeg * METERS_PER_DEG_LAT;
  const pad = Math.max(1, Math.ceil(maxMeters / cellMeters));
  const cxBase = Math.floor(lng / index.cellDeg);
  const cyBase = Math.floor(lat / index.cellDeg);

  let best: SegmentSnap | null = null;
  const seen = new Set<number>();
  for (let dx = -pad; dx <= pad; dx += 1) {
    for (let dy = -pad; dy <= pad; dy += 1) {
      const bucket = index.cells.get(`${cxBase + dx},${cyBase + dy}`);
      if (!bucket) continue;
      for (const segIdx of bucket) {
        if (seen.has(segIdx)) continue;
        seen.add(segIdx);
        const { u, v } = index.segments[segIdx];
        const proj = projectPointOnSegment(pt, graph.nodes[u], graph.nodes[v]);
        if (proj.distMeters > maxMeters) continue;
        if (!best || proj.distMeters < best.distMeters) {
          best = {
            segmentIdx: segIdx,
            t: proj.t,
            point: proj.point,
            distMeters: proj.distMeters,
          };
        }
      }
    }
  }
  return best;
}

interface AttachResult {
  extendedGraph: WaterwayGraph;
  /** Position i in stationIndices → virtual node id in extendedGraph (or -1). */
  stationNodeIdx: number[];
  unsnappedStationIndices: number[];
}

/**
 * Snap every station to the nearest centerline segment and rebuild the
 * graph with one virtual node per snap. Each affected segment is replaced
 * by a chain `u → snap₁ → snap₂ → … → v` whose Haversine-weighted edges
 * preserve total path length.
 *
 * Returns the extended graph plus, for each station, the id of its newly
 * inserted virtual node (or -1 if the station fell outside the snap
 * tolerance).
 */
function attachStationsAsVirtualNodes(
  graph: WaterwayGraph,
  stationLngLatByIndex: Map<number, [number, number]>,
  stationIndices: number[],
  maxMeters: number,
): AttachResult {
  const segIndex = buildSegmentIndex(graph);

  interface Snap {
    stationPos: number;
    segmentIdx: number;
    t: number;
    point: [number, number];
  }
  const snaps: Snap[] = [];
  const stationNodeIdx = new Array<number>(stationIndices.length).fill(-1);
  const unsnapped: number[] = [];

  for (let i = 0; i < stationIndices.length; i += 1) {
    const lngLat = stationLngLatByIndex.get(stationIndices[i]);
    if (!lngLat) {
      unsnapped.push(stationIndices[i]);
      continue;
    }
    const snap = snapPointToSegment(lngLat, graph, segIndex, maxMeters);
    if (!snap) {
      unsnapped.push(stationIndices[i]);
      continue;
    }
    snaps.push({
      stationPos: i,
      segmentIdx: snap.segmentIdx,
      t: snap.t,
      point: snap.point,
    });
  }

  // Deep-copy the graph; we'll mutate only the segments that received snaps.
  const nodes: [number, number][] = graph.nodes.slice();
  const adj: { to: number; weightMeters: number }[][] = graph.adj.map((list) =>
    list.map((edge) => ({ ...edge })),
  );

  const snapsBySegment = new Map<number, Snap[]>();
  for (const snap of snaps) {
    let bucket = snapsBySegment.get(snap.segmentIdx);
    if (!bucket) {
      bucket = [];
      snapsBySegment.set(snap.segmentIdx, bucket);
    }
    bucket.push(snap);
  }

  for (const [segIdx, segSnaps] of snapsBySegment) {
    const { u, v } = segIndex.segments[segIdx];
    segSnaps.sort((a, b) => a.t - b.t);

    // Strip the original u↔v edge from both adjacency lists; we rebuild it
    // as a chain of shorter edges through the virtual nodes below. The
    // centerline graph has no parallel edges between the same pair of
    // nodes, so this `filter` removes exactly one entry per side.
    adj[u] = adj[u].filter((e) => e.to !== v);
    adj[v] = adj[v].filter((e) => e.to !== u);

    let prev = u;
    let prevPos: [number, number] = nodes[u];
    for (const snap of segSnaps) {
      const newIdx = nodes.length;
      nodes.push(snap.point);
      adj.push([]);
      const w = haversineMeters(prevPos, snap.point);
      adj[prev].push({ to: newIdx, weightMeters: w });
      adj[newIdx].push({ to: prev, weightMeters: w });
      stationNodeIdx[snap.stationPos] = newIdx;
      prev = newIdx;
      prevPos = snap.point;
    }
    const wFinal = haversineMeters(prevPos, nodes[v]);
    adj[prev].push({ to: v, weightMeters: wFinal });
    adj[v].push({ to: prev, weightMeters: wFinal });
  }

  return {
    extendedGraph: { nodes, adj },
    stationNodeIdx,
    unsnappedStationIndices: unsnapped,
  };
}

// ---------------------------------------------------------------------------
// Dijkstra + path reconstruction over the extended graph.
// ---------------------------------------------------------------------------

/**
 * Binary min-heap keyed on a numeric priority (Dijkstra distance).
 * Hand-rolled to avoid an external dependency for a ~50-line component.
 */
class MinHeap {
  private heap: { key: number; prio: number }[] = [];

  size(): number {
    return this.heap.length;
  }

  push(key: number, prio: number): void {
    this.heap.push({ key, prio });
    this.siftUp(this.heap.length - 1);
  }

  pop(): { key: number; prio: number } | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.heap[parent].prio <= this.heap[i].prio) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < n && this.heap[l].prio < this.heap[smallest].prio) smallest = l;
      if (r < n && this.heap[r].prio < this.heap[smallest].prio) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

/** Single-source Dijkstra returning distance[] and predecessor[]. */
function dijkstra(
  graph: WaterwayGraph,
  source: number,
): { dist: Float64Array; pred: Int32Array } {
  const n = graph.nodes.length;
  const dist = new Float64Array(n).fill(Infinity);
  const pred = new Int32Array(n).fill(-1);
  dist[source] = 0;
  const heap = new MinHeap();
  heap.push(source, 0);
  while (heap.size() > 0) {
    const { key: u, prio } = heap.pop()!;
    // Stale entry — a shorter path to u was already finalized.
    if (prio > dist[u]) continue;
    for (const { to, weightMeters } of graph.adj[u]) {
      const nd = prio + weightMeters;
      if (nd < dist[to]) {
        dist[to] = nd;
        pred[to] = u;
        heap.push(to, nd);
      }
    }
  }
  return { dist, pred };
}

/** Reconstruct the node-id path from source to target via the predecessor array. */
function reconstructPath(pred: Int32Array, source: number, target: number): number[] {
  if (target === source) return [source];
  if (pred[target] < 0) return [];
  const path: number[] = [];
  let cur = target;
  while (cur !== -1) {
    path.push(cur);
    if (cur === source) break;
    cur = pred[cur];
  }
  if (path[path.length - 1] !== source) return []; // unreachable
  path.reverse();
  return path;
}

export interface ComputeRoutingOptions {
  /**
   * Maximum perpendicular distance (m) between a station and the nearest
   * centerline segment. Stations beyond this distance are reported as
   * unsnapped and excluded from kelp sets.
   */
  stationSnapMeters?: number;
}

/**
 * Precompute pairwise waterway routing for a cohort of stations.
 *
 * Stations are first snapped to the nearest centerline segment (within
 * `stationSnapMeters`) and inserted into the graph as virtual nodes by
 * splitting the host segments. Any station that fails to snap appears in
 * `unsnappedStationIndices` and gets an `Infinity` row/column.
 *
 * For each successfully-snapped station we run a single Dijkstra against
 * the extended graph (O((V+E) log V)) and lift the resulting distances
 * and reconstructed paths into the j-th column. Polyline paths are
 * returned in lng/lat so the renderer can re-project on every map view.
 */
export function computeWaterwayRouting(
  graph: WaterwayGraph,
  stationLngLatByIndex: Map<number, [number, number]>,
  stationIndices: number[],
  options: ComputeRoutingOptions = {},
): WaterwayRouting {
  const { stationSnapMeters = DEFAULT_STATION_SNAP_METERS } = options;
  const n = stationIndices.length;

  const { extendedGraph, stationNodeIdx, unsnappedStationIndices } =
    attachStationsAsVirtualNodes(
      graph,
      stationLngLatByIndex,
      stationIndices,
      stationSnapMeters,
    );

  // Allocate result matrices (Infinity / undefined by default).
  const distanceMeters: number[][] = Array.from({ length: n }, () =>
    new Array<number>(n).fill(Infinity),
  );
  const path: ([number, number][] | undefined)[][] = Array.from({ length: n }, () =>
    new Array<[number, number][] | undefined>(n).fill(undefined),
  );
  for (let i = 0; i < n; i += 1) {
    distanceMeters[i][i] = 0;
  }

  // One Dijkstra per snapped station; fill the i-th row and (by symmetry)
  // the i-th column. We still populate both halves so callers can index
  // either way without worrying about ordering.
  for (let i = 0; i < n; i += 1) {
    const srcNode = stationNodeIdx[i];
    if (srcNode < 0) continue;
    const { dist, pred } = dijkstra(extendedGraph, srcNode);
    for (let j = 0; j < n; j += 1) {
      if (j === i) continue;
      const dstNode = stationNodeIdx[j];
      if (dstNode < 0) continue;
      const d = dist[dstNode];
      if (!Number.isFinite(d)) continue; // unreachable: leave at Infinity
      distanceMeters[i][j] = d;
      if (path[i][j] !== undefined) continue;
      const nodePath = reconstructPath(pred, srcNode, dstNode);
      if (nodePath.length === 0) continue;
      const polyline = nodePath.map((nid) => extendedGraph.nodes[nid]);
      path[i][j] = polyline;
      // Symmetric: reuse the reversed polyline for the opposite direction.
      if (path[j][i] === undefined) {
        path[j][i] = [...polyline].reverse();
        distanceMeters[j][i] = d;
      }
    }
  }

  return {
    stationIndices: [...stationIndices],
    nodeIndex: stationNodeIdx,
    distanceMeters,
    path,
    unsnappedStationIndices,
  };
}
