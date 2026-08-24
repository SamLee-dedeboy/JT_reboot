// Shared identifiers and animation frames for the October–November 2018
// salinity raster-array pilot tileset. Kept in a non-component module so it
// can be imported without tripping the react-refresh "only export components"
// lint rule.

export const SALINITY_ANIMATION_SOURCE_ID = 'salinity-animation-source'
export const SALINITY_ANIMATION_LAYER_ID = 'salinity-animation-raster'
export const SALINITY_ANIMATION_TILESET_URL = 'mapbox://justtransition.salinity_waterway_mask_10m'
export const SALINITY_ANIMATION_SOURCE_LAYER = 'salinity'
export const SALINITY_ANIMATION_TILE_SIZE = 512
export const SALINITY_ANIMATION_VALUE_RANGE: [number, number] = [0, 35]

export interface SalinityFrame {
  /** Exact TileJSON band id; do not recompute from JS timestamps. */
  band: string
  date: string
  label: string
  t: number
}

/** October 1 – November 1, 2018, at roughly two-day intervals. */
export const SALINITY_FRAMES: SalinityFrame[] = [
  { band: '1538352000', date: '2018-10-01T00:00:00', label: 'October 1, 2018', t: 0 },
  {
    band: '1538543314.285714',
    date: '2018-10-03T05:08:34.285714',
    label: 'October 3, 2018',
    t: 0.0714285714,
  },
  {
    band: '1538734628.571428',
    date: '2018-10-05T10:17:08.571428',
    label: 'October 5, 2018',
    t: 0.1428571429,
  },
  {
    band: '1538925942.857142',
    date: '2018-10-07T15:25:42.857142',
    label: 'October 7, 2018',
    t: 0.2142857143,
  },
  {
    band: '1539117257.142857',
    date: '2018-10-09T20:34:17.142857',
    label: 'October 9, 2018',
    t: 0.2857142857,
  },
  {
    band: '1539308571.428571',
    date: '2018-10-12T01:42:51.428571',
    label: 'October 12, 2018',
    t: 0.3571428571,
  },
  {
    band: '1539499885.714285',
    date: '2018-10-14T06:51:25.714285',
    label: 'October 14, 2018',
    t: 0.4285714286,
  },
  { band: '1539691200', date: '2018-10-16T12:00:00', label: 'October 16, 2018', t: 0.5 },
  {
    band: '1539882514.285714',
    date: '2018-10-18T17:08:34.285714',
    label: 'October 18, 2018',
    t: 0.5714285714,
  },
  {
    band: '1540073828.571428',
    date: '2018-10-20T22:17:08.571428',
    label: 'October 20, 2018',
    t: 0.6428571429,
  },
  {
    band: '1540265142.857142',
    date: '2018-10-23T03:25:42.857142',
    label: 'October 23, 2018',
    t: 0.7142857143,
  },
  {
    band: '1540456457.142857',
    date: '2018-10-25T08:34:17.142857',
    label: 'October 25, 2018',
    t: 0.7857142857,
  },
  {
    band: '1540647771.428571',
    date: '2018-10-27T13:42:51.428571',
    label: 'October 27, 2018',
    t: 0.8571428571,
  },
  {
    band: '1540839085.714285',
    date: '2018-10-29T18:51:25.714285',
    label: 'October 29, 2018',
    t: 0.9285714286,
  },
  { band: '1541030400', date: '2018-11-01T00:00:00', label: 'November 1, 2018', t: 1 },
]
