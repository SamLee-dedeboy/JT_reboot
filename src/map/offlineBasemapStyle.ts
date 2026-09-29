import type { ExpressionSpecification, StyleSpecification } from 'mapbox-gl'
import { map as mapTokens } from '../theme/map'
import { assetUrl } from '../utils/baseUrl'

/**
 * Kiosk builds (`npm run build:kiosk`) always use the offline basemap; any other
 * build can opt in per page with `?offline=1`.
 */
export function isOfflineMapEnabled(): boolean {
  if (import.meta.env.VITE_OFFLINE_MAP === '1') return true
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('offline') === '1'
}

const tokens = mapTokens.offlineBasemap
const symbolRank: ExpressionSpecification = ['get', 'symbolrank']
const isRoad: ExpressionSpecification = ['==', ['get', 'kind'], 'road']
const isPlace: ExpressionSpecification = ['==', ['get', 'kind'], 'place']

/**
 * Road classes Mapbox Streets reveals at each zoom (from the online road-simple
 * layer), limited to the classes bundled in offline-basemap.geojson.
 */
const visibleRoadClass: ExpressionSpecification = [
  'step',
  ['zoom'],
  ['match', ['get', 'class'], ['motorway', 'trunk'], true, false],
  6,
  ['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], true, false],
  8,
  ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary'], true, false],
  10,
  [
    'match',
    ['get', 'class'],
    ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'motorway_link', 'trunk_link'],
    true,
    false,
  ],
]

/**
 * Settlement label visibility, combining the online settlement-major/minor
 * symbolrank filters with the zoom at which Mapbox tiles first include each rank.
 */
const majorSettlement: ExpressionSpecification = [
  'step',
  ['zoom'],
  false,
  6,
  ['<', symbolRank, 8],
  7,
  ['<', symbolRank, 10],
  11,
  ['<', symbolRank, 13],
  12,
  ['<', symbolRank, 15],
]
const minorSettlement: ExpressionSpecification = [
  'step',
  ['zoom'],
  false,
  7,
  ['==', symbolRank, 10],
  8,
  ['match', symbolRank, [10, 11], true, false],
  9,
  ['match', symbolRank, [10, 11, 12], true, false],
  10,
  ['match', symbolRank, [10, 11, 12, 13], true, false],
  11,
  ['match', symbolRank, [13, 14], true, false],
  12,
  ['==', symbolRank, 15],
]

const settlementColor = (ramp: readonly [string, string, string]): ExpressionSpecification => [
  'step',
  symbolRank,
  ramp[0],
  11,
  ramp[1],
  16,
  ramp[2],
]

/**
 * Exhibit basemap assembled entirely from files bundled in public/, styled to
 * mirror the online Mapbox Studio basemaps. There are no remote tile, glyph,
 * sprite, or font requests.
 */
export function createOfflineBasemapStyle(): StyleSpecification {
  const water = tokens.water

  return {
    version: 8,
    name: 'Offline Delta exhibit basemap',
    glyphs: assetUrl('/fonts/{fontstack}/{range}.pbf'),
    sources: {
      'offline-reference': {
        type: 'geojson',
        data: assetUrl('/data/regional-summary/offline-basemap.geojson'),
        attribution: '© OpenStreetMap contributors',
      },
      'offline-landuse': {
        type: 'geojson',
        data: assetUrl('/data/regional-summary/offline-landuse.geojson'),
        attribution: '© OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: 'offline-land',
        type: 'background',
        paint: { 'background-color': tokens.land },
      },
      {
        // Farmland, wood, and neighborhoods darken the land as the camera zooms in.
        id: 'offline-landuse',
        type: 'fill',
        source: 'offline-landuse',
        minzoom: 5,
        filter: [
          'match',
          ['get', 'class'],
          ['agriculture', 'wood', 'grass', 'scrub', 'park', 'airport', 'pitch', 'sand'],
          true,
          'residential',
          ['step', ['zoom'], true, 12, false],
          false,
        ],
        paint: {
          'fill-color': tokens.landuse,
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8,
            ['match', ['get', 'class'], ['residential', 'airport'], 0.8, 0.2],
            12,
            ['match', ['get', 'class'], 'residential', 0, 1],
          ],
        },
      },
      {
        // Above landuse so offshore reserves and parks never tint the ocean.
        id: 'offline-ocean',
        type: 'fill',
        source: 'offline-reference',
        filter: ['==', ['get', 'kind'], 'ocean'],
        paint: { 'fill-color': water },
      },
      {
        id: 'offline-island',
        type: 'fill',
        source: 'offline-reference',
        filter: ['==', ['get', 'kind'], 'island'],
        paint: { 'fill-color': tokens.land },
      },
      {
        // Named rivers, as lines where OSM has no water polygon for them.
        id: 'offline-river',
        type: 'line',
        source: 'offline-reference',
        filter: ['==', ['get', 'kind'], 'waterway'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': water,
          'line-width': ['interpolate', ['exponential', 1.3], ['zoom'], 7, 0.3, 10, 1, 13, 3],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.45, 10, 1],
        },
      },
      {
        // Delta channels, sloughs, lakes, and reservoirs (OSM natural=water).
        id: 'offline-lake',
        type: 'fill',
        source: 'offline-landuse',
        filter: ['==', ['get', 'class'], 'water'],
        paint: { 'fill-color': water },
      },
      {
        id: 'offline-regional-lake',
        type: 'fill',
        source: 'offline-reference',
        filter: ['==', ['get', 'kind'], 'lake'],
        paint: { 'fill-color': water },
      },
      {
        id: 'offline-road',
        type: 'line',
        source: 'offline-reference',
        filter: ['all', isRoad, visibleRoadClass],
        layout: {
          'line-cap': ['step', ['zoom'], 'butt', 14, 'round'],
          'line-join': ['step', ['zoom'], 'miter', 14, 'round'],
        },
        paint: {
          'line-color': tokens.road,
          'line-width': [
            'interpolate',
            ['exponential', 1.5],
            ['zoom'],
            5,
            [
              'match',
              ['get', 'class'],
              ['motorway', 'trunk', 'primary'],
              0.45,
              ['secondary', 'tertiary'],
              0.06,
              0,
            ],
            13,
            [
              'match',
              ['get', 'class'],
              ['motorway', 'trunk', 'primary'],
              2.4,
              ['secondary', 'tertiary'],
              1.5,
              0.6,
            ],
            18,
            [
              'match',
              ['get', 'class'],
              ['motorway', 'trunk', 'primary'],
              19.2,
              ['secondary', 'tertiary'],
              15.6,
              10.8,
            ],
          ],
        },
      },
      {
        id: 'offline-road-label',
        type: 'symbol',
        source: 'offline-reference',
        minzoom: 12,
        filter: [
          'all',
          isRoad,
          ['!=', ['get', 'name'], ''],
          [
            'match',
            ['get', 'class'],
            ['motorway', 'trunk', 'primary', 'secondary', 'tertiary'],
            true,
            false,
          ],
        ],
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-font': ['DIN Pro Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 10, 10, 18, 16],
          'text-max-angle': 30,
          'text-padding': 1,
          'text-rotation-alignment': 'map',
          'text-pitch-alignment': 'viewport',
          'text-letter-spacing': 0.01,
        },
        paint: {
          'text-color': tokens.roadLabel,
          'text-halo-color': tokens.labelHalo,
          'text-halo-width': 1,
        },
      },
      {
        id: 'offline-water-label',
        type: 'symbol',
        source: 'offline-reference',
        filter: ['==', ['get', 'kind'], 'water-label'],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Proxima Nova Semibold'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 12, 18, 18],
          'text-letter-spacing': 0.15,
          'text-line-height': 1.3,
          'text-max-width': 7,
        },
        paint: {
          'text-color': tokens.waterLabel,
          'text-halo-color': tokens.waterLabelHalo,
        },
      },
      {
        // Large named lakes such as Shasta Lake, placed inside their polygons.
        id: 'offline-lake-label',
        type: 'symbol',
        source: 'offline-reference',
        minzoom: 7.5,
        filter: ['all', ['==', ['get', 'kind'], 'lake'], ['has', 'name']],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Proxima Nova Semibold'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 8, 11, 13, 12, 18, 18],
          'text-letter-spacing': 0.01,
          'text-max-width': 7,
        },
        paint: {
          'text-color': tokens.waterLabel,
          'text-halo-color': tokens.waterLabelHalo,
        },
      },
      {
        id: 'offline-waterway-label',
        type: 'symbol',
        source: 'offline-reference',
        minzoom: 7.5,
        filter: ['==', ['get', 'kind'], 'waterway'],
        layout: {
          'symbol-placement': 'line',
          'symbol-spacing': 400,
          'text-field': ['get', 'name'],
          'text-font': ['Proxima Nova Semibold'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 8, 11, 12, 14, 16, 18],
          'text-letter-spacing': 0.08,
          'text-max-angle': 30,
          'text-pitch-alignment': 'viewport',
        },
        paint: {
          'text-color': tokens.waterwayLabel,
          'text-halo-color': tokens.waterLabelHalo,
          'text-halo-width': 1,
        },
      },
      {
        id: 'offline-settlement-minor-label',
        type: 'symbol',
        source: 'offline-reference',
        filter: ['all', isPlace, minorSettlement],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Proxima Nova Regular'],
          'text-size': [
            'interpolate',
            ['cubic-bezier', 0.2, 0, 0.9, 1],
            ['zoom'],
            3,
            ['step', symbolRank, 11, 9, 10],
            6,
            ['step', symbolRank, 14, 9, 12, 12, 10],
            8,
            ['step', symbolRank, 16, 9, 14, 12, 12, 15, 10],
            13,
            ['step', symbolRank, 22, 9, 20, 12, 16, 15, 14],
          ],
          'text-line-height': 1.1,
          'text-max-width': 7,
          'symbol-sort-key': symbolRank,
        },
        paint: {
          'text-color': settlementColor(tokens.settlementMinorLabel),
          'text-halo-color': tokens.labelHalo,
          'text-halo-blur': 1,
        },
      },
      {
        id: 'offline-settlement-major-label',
        type: 'symbol',
        source: 'offline-reference',
        filter: ['all', isPlace, majorSettlement],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Proxima Nova Semibold'],
          'text-size': [
            'interpolate',
            ['cubic-bezier', 0.2, 0, 0.9, 1],
            ['zoom'],
            3,
            ['step', symbolRank, 13, 6, 11],
            6,
            ['step', symbolRank, 18, 6, 16, 7, 14],
            8,
            ['step', symbolRank, 20, 9, 16, 10, 14],
            15,
            ['step', symbolRank, 24, 9, 20, 12, 16, 15, 14],
          ],
          'text-line-height': 1.1,
          'text-max-width': 7,
          'symbol-sort-key': symbolRank,
        },
        paint: {
          'text-color': settlementColor(tokens.settlementMajorLabel),
          'text-halo-color': tokens.labelHalo,
          'text-halo-blur': 1,
        },
      },
    ],
  }
}
