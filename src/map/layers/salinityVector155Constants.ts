// Shared identifiers for the 155-frame Water Year 2019 classified salinity
// vector animation. The dataset is published as 11 split tilesets
// (`salinity_vector_pair_00`..`_10`) rather than one combined tileset: the
// combined tileset was capped by Mapbox Tiling Service and had missing
// features at regional zooms. Kept in a non-component module so it can be
// imported without tripping the react-refresh "only export components" lint
// rule.

export const SALINITY_VECTOR_155_FRAME_COUNT = 155
export const SALINITY_VECTOR_155_SOURCE_LAYER = 'salinity'

export interface SalinityVectorPair {
  pairIndex: number
  /** First global frame (0-154) covered by this tileset, inclusive. */
  frameStart: number
  /** Last global frame (0-154) covered by this tileset, inclusive. */
  frameEnd: number
  tilesetUrl: string
  sourceId: string
  layerId: string
}

function pairSuffix(pairIndex: number): string {
  return String(pairIndex).padStart(2, '0')
}

function buildPair(pairIndex: number, frameStart: number, frameEnd: number): SalinityVectorPair {
  const suffix = pairSuffix(pairIndex)
  return {
    pairIndex,
    frameStart,
    frameEnd,
    tilesetUrl: `mapbox://justtransition.salinity_vector_pair_${suffix}`,
    sourceId: `salinity-vector-pair-${suffix}-source`,
    layerId: `salinity-vector-pair-${suffix}-fill`,
  }
}

/**
 * 11 split tilesets covering global frames 0-154 with no gaps or overlaps.
 * Frame ranges match the published tilesets exactly; do not renumber frames
 * into local 0-14 indexes — the vector feature properties carry global frame
 * IDs.
 */
export const SALINITY_VECTOR_PAIRS: readonly SalinityVectorPair[] = [
  buildPair(0, 0, 14),
  buildPair(1, 15, 28),
  buildPair(2, 29, 42),
  buildPair(3, 43, 56),
  buildPair(4, 57, 70),
  buildPair(5, 71, 84),
  buildPair(6, 85, 98),
  buildPair(7, 99, 112),
  buildPair(8, 113, 126),
  buildPair(9, 127, 140),
  buildPair(10, 141, 154),
]

/** Wraps a frame index into the valid [0, SALINITY_VECTOR_155_FRAME_COUNT) range. */
export function normalizeSalinityFrame(frame: number): number {
  return (
    ((frame % SALINITY_VECTOR_155_FRAME_COUNT) + SALINITY_VECTOR_155_FRAME_COUNT) %
    SALINITY_VECTOR_155_FRAME_COUNT
  )
}

/**
 * Finds the pair whose range contains `frame`. `frame` must already be a
 * normalized global frame (0-154); normalize it first if it may be
 * out-of-range or negative.
 */
export function getSalinityPairForFrame(frame: number): SalinityVectorPair {
  const pair = SALINITY_VECTOR_PAIRS.find(
    (candidate) => frame >= candidate.frameStart && frame <= candidate.frameEnd,
  )
  if (!pair) {
    throw new RangeError(
      `No salinity vector pair covers frame ${frame}; expected a normalized frame in [0, ${SALINITY_VECTOR_155_FRAME_COUNT}).`,
    )
  }
  return pair
}

/** The pair to preload next, wrapping from the last pair back to the first. */
export function getNextSalinityPair(pairIndex: number): SalinityVectorPair {
  const nextIndex = (pairIndex + 1) % SALINITY_VECTOR_PAIRS.length
  return SALINITY_VECTOR_PAIRS[nextIndex]
}
