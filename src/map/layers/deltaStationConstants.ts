// Shared identifiers and station list for the Delta station tileset.
// Kept in a non-component module so it can be imported without tripping the
// react-refresh "only export components" lint rule.

export const DELTA_STATION_POINTS_LAYER_ID = 'delta-station-points-circle'
export const DELTA_STATION_POINTS_HIGHLIGHT_LAYER_ID = 'delta-station-points-highlight'
export const DELTA_STATION_POINTS_SOURCE_ID = 'delta-station-points-source'
export const DELTA_STATION_POINTS_SOURCE_URL = 'mapbox://justtransition.2am7ol9m'
export const DELTA_STATION_POINTS_SOURCE_LAYER = 'Delta_Station_Locations_JT_Sa-20pbps'

/** Station indices covered by the water-quality dataset. */
export const WATER_QUALITY_STATION_INDICES: ReadonlyArray<number> = [
  13, 24, 86, 322, 323, 326, 175, 201, 200, 171, 320, 288, 319, 164, 66, 31, 88, 317, 318, 316, 2,
  37, 121, 145, 146, 192, 309, 310, 311, 312, 313, 314, 315, 7, 321, 324, 325, 328, 40, 176, 117,
  307, 308, 96, 173, 327,
]
