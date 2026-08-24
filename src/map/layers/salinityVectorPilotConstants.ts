// Shared identifiers for the 3-frame classified salinity vector pilot
// (`salinity_vector_pilot`). Kept in a non-component module so it can be
// imported without tripping the react-refresh "only export components" lint
// rule.

export const SALINITY_VECTOR_PILOT_SOURCE_ID = 'salinity-vector-pilot-source'
export const SALINITY_VECTOR_PILOT_TILESET_URL = 'mapbox://justtransition.salinity_vector_pilot'
export const SALINITY_VECTOR_PILOT_SOURCE_LAYER = 'salinity'

export interface SalinityVectorPilotFrame {
  /** Matches the `frame` feature property in the vector tileset. */
  frame: number
  label: string
  layerId: string
}

/** Only frames 0, 7, and 14 were published: October 1, ~16, and November 1, 2018. */
export const SALINITY_VECTOR_PILOT_FRAMES: SalinityVectorPilotFrame[] = [
  { frame: 0, label: 'October 1, 2018', layerId: 'salinity-vector-pilot-frame-0' },
  { frame: 7, label: 'October 16, 2018', layerId: 'salinity-vector-pilot-frame-7' },
  { frame: 14, label: 'November 1, 2018', layerId: 'salinity-vector-pilot-frame-14' },
]
