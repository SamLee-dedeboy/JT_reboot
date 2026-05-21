// Shared types for the KelpFusion set-visualization overlay.

/** A set member projected to overlay screen-pixel coordinates. */
export interface KelpPoint {
  /** Station index (`index_` in the Mapbox tileset). */
  id: number;
  x: number;
  y: number;
}

/** A named set of stations to be enclosed by a fused boundary. */
export interface KelpSet {
  setId: string;
  label: string;
  stationIndices: number[];
  color: string;
  opacity: number;
  visible: boolean;
}

/**
 * An edge of the shortest-path graph.
 *
 * `weight` is the distance metric chosen by the caller — Euclidean pixels for
 * the legacy {@link computeSPG} entry point, or waterway-network meters for
 * the routing-aware {@link computeSPGFromDistanceMatrix} entry point.
 *
 * `path`, when present, is the lng/lat polyline that the rasterizer and the
 * `graph` debug renderer should follow instead of a straight u→v segment. It
 * always starts at points[u]'s lng/lat and ends at points[v]'s lng/lat.
 */
export interface SpgEdge {
  u: number;
  v: number;
  weight: number;
  path?: [number, number][];
}

/** Result of computing the shortest-path graph for one set. */
export interface SpgResult {
  points: KelpPoint[];
  edges: SpgEdge[];
  /** Number of connected components in the returned edge set. */
  componentCount: number;
}

/** Per-set diagnostics surfaced to the dev controls. */
export interface SetStat {
  setId: string;
  componentCount: number;
}

/**
 * The waterway-centerline graph used for routing kelp connections through
 * actual channels rather than along straight pixel lines.
 *
 * Nodes are lng/lat positions; `adj[i]` lists the neighbors of node i with
 * geodesic edge lengths in meters (Haversine). Built once at app startup
 * from `public/data/delta_waterway_lines.geojson` by
 * `buildWaterwayGraphFromGeoJSON`.
 */
export interface WaterwayGraph {
  nodes: [number, number][];
  adj: { to: number; weightMeters: number }[][];
}

/**
 * Precomputed pairwise shortest-path routing for one cohort of stations
 * over a {@link WaterwayGraph}.
 *
 * `stationIndices[i]` is the station id (the tileset `index_` value) for row
 * i of the matrix. `nodeIndex[i]` is the snapped graph-node id, or -1 if the
 * station fell outside the snap tolerance (unsnapped — it will be excluded
 * from kelp sets and surfaced in the controls).
 *
 * `distanceMeters[i][j]` is the shortest waterway distance between snapped
 * nodes; `Infinity` when unreachable or when either endpoint is unsnapped.
 * `path[i][j]` is the corresponding lng/lat polyline (including both
 * endpoints); `undefined` when distance is Infinity.
 */
export interface WaterwayRouting {
  stationIndices: number[];
  nodeIndex: number[];
  distanceMeters: number[][];
  path: ([number, number][] | undefined)[][];
  unsnappedStationIndices: number[];
}
