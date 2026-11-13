import type { LayerProps } from 'react-map-gl/mapbox'
import type { FeatureCollection } from 'geojson'
import { map } from '@/theme'
import { assetUrl } from '@/utils/baseUrl'
import { DELTA_START_VIEW, STORY_BOUNDS, STORY_MAX_BOUNDS, type MapBounds } from '../cameras'
import { HERO_MAP_STYLE } from '../mapStyles'
import { labelFontLayout } from '../offlineBasemapStyle'
import { flowArrows } from './flowArrows'
import { scenarioMarkerIds, scenarioPatternIds, type ScenarioPattern } from './patterns'

export type MapScope = 'delta' | 'statewide' | 'statewide-ecocultural'
export type { MapBounds }

export interface MapAnnotations {
  labels: Array<{
    text: string
    coordinates: [number, number]
    anchor: 'left' | 'right' | 'top-left'
    /** Solid white, for the labels that should draw the eye first. */
    solid?: boolean
    /** Pixel offset that keeps the label clear of its point or line feature. */
    offset?: [number, number]
  }>
}

export interface Config {
  interactive: boolean
  initialViewState: {
    longitude: number
    latitude: number
    zoom: number
  }
  maxBounds: MapBounds
  showNavigationControl?: boolean
  legendActivation: 'always' | 'adaptation'
  bounds: Partial<Record<MapScope, MapBounds>>
  /** Only for maps that zoom in on a selected feature; the others highlight it in place. */
  selectionBounds?: Record<string, MapBounds>
  /** Space kept free at the top of the view, for features that would sit under the legend. */
  legendClearance?: number
  annotations?: MapAnnotations
  /** Replaces the scenario narration basemap. */
  mapStyleUrl?: string
  /** Shows this frame of the home hero's salinity data under the scenario layers. */
  salinitySnapshotFrame?: number
  triggers?: {
    adaptationLayers?: string
    statewide?: string
    ecocultural?: string
  }
}

export interface LegendItem {
  label: string
  selectionKey: string
  kind?: 'fill' | 'line' | 'band' | 'point' | 'square'
  dashed?: boolean
  pattern?: ScenarioPattern
  color?: string
}

export interface SourceConfig {
  id: string
  type: 'vector' | 'raster-array' | 'geojson'
  url?: string
  data?: string | FeatureCollection
  offlineData?: string
  tileSize?: number
  layers: LayerProps[]
  activation?: 'adaptation'
  visibilityScope?: MapScope
  selectableProperty?: string
  selectionKey?: string
  /** Keeps Mapbox dash spacing stable by preserving the configured width when selected. */
  preserveLineWidthOnSelection?: boolean
  legend?: {
    title: string
    items: LegendItem[]
    gradient?: {
      colors: string[]
      startLabel: string
      endLabel: string
    }
  }
}

const ecoMachineLocationsLegend = {
  title: 'Restoration locations',
  items: [
    {
      label: 'Suisun Marsh',
      selectionKey: 'suisun-marsh',
      pattern: 'dots' as const,
    },
    {
      label: 'Franks Tract',
      selectionKey: 'franks-tract',
      pattern: 'diagonal' as const,
    },
  ],
}

function createEcoMachineLocation(
  id: string,
  regionId: 'suisun_marsh' | 'franks_tract',
  selectionKey: 'suisun-marsh' | 'franks-tract',
  pattern: ScenarioPattern,
  legend?: SourceConfig['legend'],
): SourceConfig {
  return {
    id,
    type: 'geojson',
    data: assetUrl('/data/geospatial-assets/shared/region-of-interest.geojson'),
    activation: 'adaptation',
    selectionKey,
    legend,
    layers: [
      {
        id: `${id}-fill`,
        type: 'fill',
        source: id,
        filter: ['==', ['get', 'region_id'], regionId],
        paint: {
          'fill-color': map.scenarios.cartography.mutedFeature,
          'fill-opacity': 0.42,
          'fill-outline-color': map.scenarios.cartography.outline,
        },
      },
      {
        id: `${id}-pattern`,
        type: 'fill',
        source: id,
        filter: ['==', ['get', 'region_id'], regionId],
        paint: {
          'fill-pattern': scenarioPatternIds[pattern],
          'fill-opacity': 0.72,
        },
      },
      {
        id: `${id}-line`,
        type: 'line',
        source: id,
        filter: ['==', ['get', 'region_id'], regionId],
        paint: {
          'line-color': map.scenarios.cartography.feature,
          'line-opacity': 0.95,
          'line-width': 2,
        },
      },
    ],
  }
}

const ecoMachineSuisunMarsh = createEcoMachineLocation(
  'scenario-eco-machine-suisun-marsh',
  'suisun_marsh',
  'suisun-marsh',
  'dots',
  ecoMachineLocationsLegend,
)

const ecoMachineFranksTract = createEcoMachineLocation(
  'scenario-eco-machine-franks-tract',
  'franks_tract',
  'franks-tract',
  'diagonal',
)

interface ScenarioAssetOptions {
  id: string
  path: string
  selectionKey: string
  geometry: 'area' | 'line'
  pattern?: ScenarioPattern
  /** Fills the area with the feature color instead of a muted fill and pattern. */
  solid?: boolean
  lineDash?: number[]
  legend?: SourceConfig['legend']
  filter?: LayerProps['filter']
}

function createScenarioAsset({
  id,
  path,
  selectionKey,
  geometry,
  pattern,
  solid = false,
  lineDash,
  legend,
  filter,
}: ScenarioAssetOptions): SourceConfig {
  // Mapbox rejects a layer whose `filter` key is present but undefined, so set it only when given.
  const filterSpec = filter ? { filter } : {}
  return {
    id,
    type: 'geojson',
    data: assetUrl(path),
    activation: 'adaptation',
    selectionKey,
    legend,
    layers: [
      ...(geometry === 'area'
        ? [
            {
              id: `${id}-fill`,
              type: 'fill' as const,
              source: id,
              ...filterSpec,
              paint: {
                'fill-color': solid
                  ? map.scenarios.cartography.feature
                  : map.scenarios.cartography.mutedFeature,
                'fill-opacity': solid ? 0.95 : 0.42,
                'fill-outline-color': map.scenarios.cartography.outline,
              },
            },
            ...(pattern
              ? [
                  {
                    id: `${id}-pattern`,
                    type: 'fill' as const,
                    source: id,
                    ...filterSpec,
                    paint: {
                      'fill-pattern': scenarioPatternIds[pattern],
                      'fill-opacity': 0.72,
                    },
                  },
                ]
              : []),
          ]
        : []),
      {
        id: `${id}-line`,
        type: 'line',
        source: id,
        ...filterSpec,
        paint: {
          'line-color': map.scenarios.cartography.feature,
          'line-opacity': 0.95,
          'line-width': geometry === 'line' ? 6 : 3,
          ...(lineDash ? { 'line-dasharray': lineDash } : {}),
        },
      },
    ],
  }
}

function createScenarioPoints({
  id,
  selectionKey,
  shape,
  coordinates,
  legend,
}: {
  id: string
  selectionKey: string
  shape: 'circle' | 'square'
  coordinates: Array<[number, number]>
  legend?: SourceConfig['legend']
}): SourceConfig {
  return {
    id,
    type: 'geojson',
    activation: 'adaptation',
    selectionKey,
    legend,
    data: {
      type: 'FeatureCollection',
      features: coordinates.map((point) => ({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: point },
      })),
    },
    layers: [
      shape === 'circle'
        ? {
            id: `${id}-point`,
            type: 'circle',
            source: id,
            paint: {
              'circle-radius': 7,
              'circle-color': map.scenarios.cartography.feature,
              'circle-stroke-color': map.markers.stroke,
              'circle-stroke-width': 2,
            },
          }
        : {
            id: `${id}-point`,
            type: 'symbol',
            source: id,
            layout: {
              'icon-image': scenarioMarkerIds.square,
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
            },
          },
    ],
  }
}

const bolsterLegend = {
  title: 'Freshwater corridor strategies',
  items: [
    {
      label: 'Operable gates',
      selectionKey: 'operable-gates',
      kind: 'point' as const,
    },
    {
      label: 'Reconstructed levees',
      selectionKey: 'reconstructed-levees',
      kind: 'band' as const,
    },
    {
      label: 'Freshwater corridor',
      selectionKey: 'freshwater-corridor',
      kind: 'line' as const,
    },
  ],
}

const bolsterSources = [
  createScenarioAsset({
    id: 'scenario-bolster-reconstructed-levees',
    path: '/data/geospatial-assets/scenarios/bolster-and-fortify/levee-repair.geojson',
    selectionKey: 'reconstructed-levees',
    geometry: 'area',
    solid: true,
    legend: bolsterLegend,
  }),
  createScenarioAsset({
    id: 'scenario-bolster-freshwater-corridor',
    path: '/data/geospatial-assets/scenarios/bolster-and-fortify/freshwater-pathway.geojson',
    selectionKey: 'freshwater-corridor',
    geometry: 'line',
  }),
  {
    id: 'scenario-bolster-corridor-connector',
    type: 'geojson' as const,
    activation: 'adaptation' as const,
    selectionKey: 'freshwater-corridor',
    data: {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: [
              [-121.581838, 38.031886],
              [-121.581393, 38.032105],
            ],
          },
        },
      ],
    },
    layers: [
      {
        id: 'scenario-bolster-corridor-connector-line',
        type: 'line' as const,
        source: 'scenario-bolster-corridor-connector',
        paint: {
          'line-color': map.scenarios.cartography.feature,
          'line-opacity': 0.95,
          'line-width': 6,
        },
      },
    ],
  },
  createScenarioPoints({
    id: 'scenario-bolster-operable-gates',
    selectionKey: 'operable-gates',
    shape: 'circle',
    // Centers of the gate footprints in bolster-and-fortify/operable-gates.geojson.
    coordinates: [
      [-121.58494, 38.03057],
      [-121.58435, 38.06291],
    ],
  }),
]

const tunnelLegend = {
  title: 'Conveyance infrastructure',
  items: [
    {
      label: 'Northern Delta intakes',
      selectionKey: 'tunnel-intakes',
      kind: 'point' as const,
    },
    {
      label: 'Tunnel alignment',
      selectionKey: 'tunnel-alignment',
      kind: 'line' as const,
      dashed: true,
    },
    {
      label: 'Bethany pumping facilities',
      selectionKey: 'tunnel-pumping',
      kind: 'square' as const,
    },
  ],
}

const tunnelSources: SourceConfig[] = [
  {
    ...createScenarioAsset({
      id: 'scenario-tunnel-alignment',
      path: '/data/geospatial-assets/scenarios/tunnel/alignment.geojson',
      selectionKey: 'tunnel-alignment',
      geometry: 'line',
      lineDash: [2, 2],
      legend: tunnelLegend,
    }),
    preserveLineWidthOnSelection: true,
  },
  {
    id: 'scenario-tunnel-alignment-connectors',
    type: 'geojson' as const,
    activation: 'adaptation' as const,
    selectionKey: 'tunnel-alignment',
    preserveLineWidthOnSelection: true,
    data: {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'MultiLineString' as const,
            coordinates: [
              [
                [-121.48851572196719, 37.92195796480499],
                [-121.48834406020461, 37.92222879388292],
              ],
              [
                [-121.45744819484005, 38.24917510577825],
                [-121.45744819484005, 38.24904029523464],
              ],
              [
                [-121.43457431640374, 38.19111618389779],
                [-121.43457431640374, 38.19108245455707],
              ],
            ],
          },
        },
      ],
    },
    layers: [
      {
        id: 'scenario-tunnel-alignment-connectors-line',
        type: 'line' as const,
        source: 'scenario-tunnel-alignment-connectors',
        layout: {
          'line-cap': 'round' as const,
          'line-join': 'round' as const,
        },
        paint: {
          'line-color': map.scenarios.cartography.feature,
          'line-dasharray': [2, 2],
          'line-opacity': 0.95,
          'line-width': 6,
        },
      },
    ],
  },
  // Centers of the Water Intake Shaft footprints in tunnel/sites.geojson.
  createScenarioPoints({
    id: 'scenario-tunnel-intakes',
    selectionKey: 'tunnel-intakes',
    shape: 'circle',
    coordinates: [
      [-121.5303, 38.34823],
      [-121.51801, 38.37795],
    ],
  }),
  // Center of the coinciding OBJECTID 7 and 28 footprints in tunnel/sites.geojson.
  createScenarioPoints({
    id: 'scenario-tunnel-pumping',
    selectionKey: 'tunnel-pumping',
    shape: 'square',
    coordinates: [[-121.57695, 37.8045]],
  }),
]

const newGreenWatershedSubsidence: SourceConfig = {
  id: 'scenario-ngw-land-subsidence-2017',
  type: 'raster-array',
  url: 'mapbox://justtransition.delta_land_subsidence_2017_res10',
  tileSize: 512,
  visibilityScope: 'delta',
  layers: [
    {
      id: 'scenario-ngw-land-subsidence-2017-raster',
      type: 'raster',
      source: 'scenario-ngw-land-subsidence-2017',
      'source-layer': 'masked_values',
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'raster-color-range': [-25, 0],
        'raster-emissive-strength': 1,
        'raster-color': [
          'interpolate',
          ['linear'],
          ['raster-value'],
          -25,
          map.scenarios.newGreenWatershedSubsidence.elevationMinus25,
          -20,
          map.scenarios.newGreenWatershedSubsidence.elevationMinus20,
          -15,
          map.scenarios.newGreenWatershedSubsidence.elevationMinus15,
          -10,
          map.scenarios.newGreenWatershedSubsidence.elevationMinus10,
          -5,
          map.scenarios.newGreenWatershedSubsidence.elevationMinus5,
          0,
          map.scenarios.newGreenWatershedSubsidence.elevation0,
        ],
        'raster-fade-duration': 0,
        'raster-resampling': 'nearest',
      },
    },
  ],
}

const newGreenWatershedHabitats: SourceConfig = {
  id: 'scenario-ngw-delta-habitats',
  type: 'vector',
  url: 'mapbox://justtransition.i7mkqy',
  offlineData: assetUrl('/data/geospatial-assets/scenarios/new-green-watershed/habitats.geojson'),
  visibilityScope: 'delta',
  activation: 'adaptation',
  selectableProperty: 'type',
  legend: {
    title: 'Delta habitats',
    items: [
      {
        label: 'Wet soil farming',
        selectionKey: 'soil',
        pattern: 'horizontal',
      },
      {
        label: 'Tidal wetlands',
        selectionKey: 'tidal',
        pattern: 'dots',
      },
      {
        label: 'Transitional habitats',
        selectionKey: 'transitional',
        pattern: 'crosshatch',
      },
      {
        label: 'Priority fish passage',
        selectionKey: 'riparian',
        kind: 'line',
      },
    ],
  },
  layers: [
    {
      id: 'scenario-ngw-delta-habitats-fill',
      type: 'fill',
      source: 'scenario-ngw-delta-habitats',
      'source-layer': 'scenario_ngw_delta_habitats.z-cxmuc4',
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'fill-color': map.scenarios.cartography.mutedFeature,
        'fill-opacity': 0.42,
        'fill-antialias': true,
      },
    },
    {
      id: 'scenario-ngw-delta-habitats-pattern',
      type: 'fill',
      source: 'scenario-ngw-delta-habitats',
      'source-layer': 'scenario_ngw_delta_habitats.z-cxmuc4',
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'fill-pattern': [
          'match',
          ['get', 'type'],
          'soil',
          scenarioPatternIds.horizontal,
          'transitional',
          scenarioPatternIds.crosshatch,
          'tidal',
          scenarioPatternIds.dots,
          scenarioPatternIds.diagonal,
        ],
        'fill-opacity': 0.72,
      },
    },
  ],
}

const newGreenWatershedRiparian: SourceConfig = {
  id: 'scenario-ngw-riparian',
  type: 'vector',
  url: 'mapbox://justtransition.esdnqq',
  offlineData: assetUrl('/data/geospatial-assets/scenarios/new-green-watershed/riparian.geojson'),
  visibilityScope: 'delta',
  activation: 'adaptation',
  selectionKey: 'riparian',
  layers: [
    {
      id: 'scenario-ngw-riparian-line',
      type: 'line',
      source: 'scenario-ngw-riparian',
      'source-layer': 'scenario_ngw_riparian.zip-lq1yis',
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'line-color': map.scenarios.cartography.feature,
        'line-opacity': 0.9,
        'line-width': 2,
      },
    },
  ],
}

const legalDeltaBoundary: SourceConfig = {
  id: 'legal-delta-boundary',
  type: 'vector',
  url: 'mapbox://justtransition.xprtiz',
  offlineData: assetUrl(
    '/data/geospatial-assets/scenarios/new-green-watershed/legal-delta-boundary.geojson',
  ),
  visibilityScope: 'delta',
  layers: [
    {
      id: 'legal-delta-boundary-fill',
      type: 'fill',
      source: 'legal-delta-boundary',
      'source-layer': 'legal_delta_boundary.zip-ht4jf0',
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'fill-color': map.boundaries.legalDelta,
        'fill-opacity': 0.15,
        'fill-outline-color': map.boundaries.legalDelta,
        'fill-antialias': true,
      },
    },
  ],
}

const statewideWatershedShade: SourceConfig = {
  id: 'statewide-watershed-shade',
  type: 'vector',
  url: 'mapbox://justtransition.cskd9m',
  offlineData: assetUrl(
    '/data/geospatial-assets/scenarios/new-green-watershed/watershed-shade.geojson',
  ),
  visibilityScope: 'statewide',
  layers: [
    {
      id: 'statewide-watershed-shade-fill',
      type: 'fill',
      source: 'statewide-watershed-shade',
      'source-layer': 'watershed_shade.zip-wkausq',
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'fill-color': map.boundaries.watershedShade.fill,
        'fill-opacity': 0.8,
        'fill-outline-color': map.boundaries.watershedShade.outline,
        'fill-antialias': true,
      },
    },
  ],
}

const statewideWatershedRegions: SourceConfig = {
  id: 'statewide-watershed-regions',
  type: 'vector',
  url: 'mapbox://justtransition.92mkk4',
  offlineData: assetUrl(
    '/data/geospatial-assets/scenarios/new-green-watershed/watershed-region.geojson',
  ),
  visibilityScope: 'statewide',
  layers: [
    {
      id: 'statewide-watershed-regions-line',
      type: 'line',
      source: 'statewide-watershed-regions',
      'source-layer': 'watershed_region.zip-16ybkn',
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'line-color': map.boundaries.watershedRegion,
        'line-opacity': 1,
        'line-width': 2,
      },
    },
  ],
}

const statewideWatershedRegionLabels: SourceConfig = {
  id: 'statewide-watershed-region-labels',
  type: 'geojson',
  visibilityScope: 'statewide',
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'SACRAMENTO\nSUB REGION' },
        geometry: { type: 'Point', coordinates: [-121.55, 39.15] },
      },
      {
        type: 'Feature',
        properties: { name: 'SAN FRANCISCO\nBAY SUB REGION' },
        geometry: { type: 'Point', coordinates: [-122.2, 37.9] },
      },
      {
        type: 'Feature',
        properties: { name: 'SAN JOAQUIN\nSUB REGION' },
        geometry: { type: 'Point', coordinates: [-120.65, 37.55] },
      },
      {
        type: 'Feature',
        properties: { name: 'TULARE BASIN\nSUB REGION' },
        geometry: { type: 'Point', coordinates: [-119.25, 36.25] },
      },
    ],
  },
  layers: [
    {
      id: 'statewide-watershed-region-labels-symbol',
      type: 'symbol',
      source: 'statewide-watershed-region-labels',
      minzoom: 0,
      maxzoom: 22,
      layout: {
        'text-field': ['get', 'name'],
        ...labelFontLayout(),
        'text-size': 12,
        'text-max-width': 12,
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': map.boundaries.watershedRegion,
        'text-halo-color': map.labels.halo,
        'text-halo-width': 1.5,
      },
    },
  ],
}

const statewideIndigenousTerritories: SourceConfig = {
  id: 'statewide-indigenous-territories',
  type: 'vector',
  url: 'mapbox://justtransition.5q5r23',
  offlineData: assetUrl(
    '/data/geospatial-assets/scenarios/new-green-watershed/indigenous-territories.geojson',
  ),
  visibilityScope: 'statewide-ecocultural',
  layers: [
    {
      id: 'statewide-indigenous-territories-line',
      type: 'line',
      source: 'statewide-indigenous-territories',
      'source-layer': 'scenario_ngw_indigenous_terri-ecyvm2',
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'line-color': map.boundaries.indigenousTerritory,
        'line-opacity': 1,
        'line-width': 2,
      },
    },
    {
      id: 'statewide-indigenous-territories-label',
      type: 'symbol',
      source: 'statewide-indigenous-territories',
      'source-layer': 'scenario_ngw_indigenous_terri-ecyvm2',
      minzoom: 0,
      maxzoom: 22,
      layout: {
        'text-field': ['get', 'TRIBE_NAME'],
        ...labelFontLayout(),
        'text-size': 12,
        'text-max-width': 10,
      },
      paint: {
        'text-color': map.boundaries.indigenousTerritory,
        'text-halo-color': map.labels.halo,
        'text-halo-width': 1.5,
      },
    },
  ],
}

const callingOnReservesLegend = {
  title: 'Modeled system',
  items: [
    {
      label: 'Sacramento River',
      selectionKey: 'cor-rivers',
      kind: 'line' as const,
      color: map.markers.comparison,
    },
    {
      label: 'Shasta Dam',
      selectionKey: 'cor-facilities',
      kind: 'point' as const,
      color: map.markers.comparison,
    },
  ],
}

const callingOnReservesSources: SourceConfig[] = [
  {
    id: 'scenario-cor-sacramento-river',
    type: 'geojson',
    data: assetUrl(
      '/data/geospatial-assets/scenarios/calling-on-reserves/sacramento-river-mainstem.geojson',
    ),
    activation: 'adaptation',
    selectionKey: 'cor-rivers',
    legend: callingOnReservesLegend,
    layers: [
      {
        id: 'scenario-cor-sacramento-river-line',
        type: 'line',
        source: 'scenario-cor-sacramento-river',
        paint: {
          'line-color': map.markers.comparison,
          'line-opacity': 0.95,
          'line-width': 5,
        },
      },
    ],
  },
  {
    id: 'scenario-cor-shasta',
    type: 'geojson',
    data: assetUrl(
      '/data/geospatial-assets/scenarios/calling-on-reserves/shasta-dam-reservoir.geojson',
    ),
    activation: 'adaptation',
    selectionKey: 'cor-facilities',
    layers: [
      {
        id: 'scenario-cor-shasta-point',
        type: 'circle',
        source: 'scenario-cor-shasta',
        paint: {
          'circle-radius': 7,
          'circle-color': map.markers.comparison,
          'circle-stroke-color': map.markers.stroke,
          'circle-stroke-width': 2,
        },
      },
    ],
  },
]

// The salinity data's ocean stops south of Half Moon Bay. This carries it on down the coast,
// traced from the basemap's water, so the frame never shows an empty corner.
const tieredOutflowsOceanExtension: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-123.4, 37.46],
            [-122.444, 37.46],
            [-122.444, 37.44],
            [-122.432, 37.42],
            [-122.42, 37.4],
            [-122.412, 37.38],
            [-122.4, 37.36],
            [-122.4, 37.32],
            [-122.408, 37.28],
            [-122.416, 37.24],
            [-122.404, 37.2],
            [-122.376, 37.18],
            [-122.34, 37.14],
            [-122.336, 37.12],
            [-122.28, 37.1],
            [-122.252, 37.06],
            [-122.208, 37.02],
            [-122.152, 36.98],
            [-122.108, 36.96],
            [-122.108, 36.84],
            [-123.4, 36.84],
            [-123.4, 37.46],
          ],
        ],
      },
    },
  ],
}

const tieredOutflowsRivers: SourceConfig[] = [
  {
    id: 'scenario-tiered-outflows-ocean-extension',
    type: 'geojson',
    data: tieredOutflowsOceanExtension,
    legend: {
      title: 'Illustrative salinity',
      items: [],
      gradient: {
        colors: [
          map.salinityAnimation.euhaline,
          map.salinityAnimation.polyhaline,
          map.salinityAnimation.mesohaline,
          map.salinityAnimation.oligohalineHigh,
          map.salinityAnimation.oligohalineLow,
          map.salinityAnimation.fresh,
        ],
        startLabel: 'Ocean water',
        endLabel: 'Freshwater',
      },
    },
    layers: [
      {
        id: 'scenario-tiered-outflows-ocean-extension-fill',
        type: 'fill',
        source: 'scenario-tiered-outflows-ocean-extension',
        paint: { 'fill-color': map.scenarios.tieredOutflows.oceanExtension },
      },
    ],
  },
  {
    id: 'scenario-tiered-outflows-sacramento-river',
    type: 'geojson',
    data: assetUrl(
      '/data/geospatial-assets/scenarios/tiered-outflows/sacramento-river-mainstem.geojson',
    ),
    layers: [
      {
        id: 'scenario-tiered-outflows-sacramento-river-line',
        type: 'line',
        source: 'scenario-tiered-outflows-sacramento-river',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': map.scenarios.tieredOutflows.rivers,
          'line-width': 3,
        },
      },
    ],
  },
  {
    id: 'scenario-tiered-outflows-san-joaquin-river',
    type: 'geojson',
    data: assetUrl(
      '/data/geospatial-assets/scenarios/tiered-outflows/san-joaquin-river-mainstem.geojson',
    ),
    layers: [
      {
        id: 'scenario-tiered-outflows-san-joaquin-river-line',
        type: 'line',
        source: 'scenario-tiered-outflows-san-joaquin-river',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': map.scenarios.tieredOutflows.rivers,
          'line-width': 3,
        },
      },
    ],
  },
  {
    id: 'scenario-tiered-outflows-flow-arrows',
    type: 'geojson',
    data: flowArrows,
    layers: [
      {
        id: 'scenario-tiered-outflows-flow-arrows-fill',
        type: 'fill',
        source: 'scenario-tiered-outflows-flow-arrows',
        paint: { 'fill-color': map.scenarios.tieredOutflows.flowMarks },
      },
    ],
  },
]

const tieredOutflowsAnnotations: MapAnnotations = {
  labels: [
    { text: 'Sacramento River', coordinates: [-121.62, 38.4], anchor: 'right', solid: true },
    { text: 'San Joaquin River', coordinates: [-121.38, 37.8], anchor: 'right', solid: true },
    { text: 'Ocean inflow', coordinates: [-122.6, 37.768], anchor: 'top-left' },
  ],
}

const callingOnReservesAnnotations: MapAnnotations = {
  labels: [
    {
      text: 'Sacramento River',
      coordinates: [-121.86, 39.37],
      anchor: 'left',
      solid: true,
      offset: [12, 0],
    },
    {
      text: 'Shasta Dam',
      coordinates: [-122.4192, 40.7186],
      anchor: 'left',
      solid: true,
      offset: [12, 0],
    },
  ],
}

export const layersBySlug: Record<string, SourceConfig[]> = {
  'tiered-outflows': tieredOutflowsRivers,
  'eco-machine': [ecoMachineSuisunMarsh, ecoMachineFranksTract],
  'bolster-and-fortify': bolsterSources,
  'a-tunnel': tunnelSources,
  'calling-on-reserves': callingOnReservesSources,
  'new-green-watershed': [
    legalDeltaBoundary,
    newGreenWatershedHabitats,
    newGreenWatershedRiparian,
    newGreenWatershedSubsidence,
    statewideWatershedShade,
    statewideWatershedRegions,
    statewideWatershedRegionLabels,
    statewideIndigenousTerritories,
  ],
}

const legendClearance = 170

const defaultConfig: Config = {
  interactive: false,
  initialViewState: DELTA_START_VIEW,
  maxBounds: STORY_MAX_BOUNDS,
  legendActivation: 'always',
  bounds: { delta: STORY_BOUNDS.delta },
}

export const configBySlug: Record<string, Config> = {
  'tiered-outflows': {
    ...defaultConfig,
    bounds: { delta: STORY_BOUNDS.bayDelta },
    annotations: tieredOutflowsAnnotations,
    // The hero style has no water of its own, so the salinity colors read as on the home page.
    mapStyleUrl: HERO_MAP_STYLE,
    // October 1, 2018: the first frame of the Water Year 2019 data.
    salinitySnapshotFrame: 0,
  },
  'eco-machine': {
    ...defaultConfig,
    interactive: true,
    showNavigationControl: true,
    bounds: { delta: STORY_BOUNDS.ecoMachine },
  },
  'bolster-and-fortify': {
    ...defaultConfig,
    interactive: true,
    showNavigationControl: true,
    bounds: { delta: STORY_BOUNDS.bolster },
    legendClearance,
    selectionBounds: {
      'operable-gates': STORY_BOUNDS.bolsterSelection,
      'reconstructed-levees': STORY_BOUNDS.bolsterSelection,
    },
  },
  'a-tunnel': {
    ...defaultConfig,
    interactive: true,
    showNavigationControl: true,
    bounds: { delta: STORY_BOUNDS.tunnel },
    legendClearance,
  },
  'new-green-watershed': {
    interactive: true,
    initialViewState: DELTA_START_VIEW,
    maxBounds: STORY_MAX_BOUNDS,
    showNavigationControl: true,
    legendActivation: 'adaptation',
    bounds: {
      delta: STORY_BOUNDS.newGreenWatershed,
      statewide: STORY_BOUNDS.watershedOverview,
      'statewide-ecocultural': STORY_BOUNDS.watershedOverview,
    },
    triggers: {
      adaptationLayers: 'design-approach',
      statewide: 'supporting-strategy',
      ecocultural: 'ecocultural-stewardship',
    },
  },
  'calling-on-reserves': {
    ...defaultConfig,
    interactive: true,
    showNavigationControl: true,
    bounds: { delta: STORY_BOUNDS.callingOnReserves },
    legendClearance,
    annotations: callingOnReservesAnnotations,
  },
}

export function getConfig(scenarioSlug: string) {
  return configBySlug[scenarioSlug] ?? defaultConfig
}

export function getLegendItem(scenarioSlug: string, selectionKey: string) {
  return layersBySlug[scenarioSlug]
    ?.flatMap((source) => source.legend?.items ?? [])
    .find((item) => item.selectionKey === selectionKey)
}
