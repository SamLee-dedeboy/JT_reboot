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

/** An edge of the shortest-path graph; weight is Euclidean pixel distance. */
export interface SpgEdge {
  u: number;
  v: number;
  weight: number;
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
