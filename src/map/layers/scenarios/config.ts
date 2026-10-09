import type { LayerProps } from 'react-map-gl/mapbox'
import type { FeatureCollection } from 'geojson'
import { map } from '../../../theme'
import { assetUrl } from '../../../utils/baseUrl'

export type MapScope = 'delta' | 'statewide' | 'statewide-ecocultural'
export type MapBounds = [[number, number], [number, number]]

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
  highlightFallbackColor: string
  bounds: Partial<Record<MapScope, MapBounds>>
  selectionBounds?: Record<string, MapBounds>
  triggers?: {
    adaptationLayers?: string
    statewide?: string
    ecocultural?: string
  }
}

export interface SourceConfig {
  id: string
  type: 'vector' | 'raster-array' | 'geojson'
  url?: string
  data?: string | FeatureCollection
  tileSize?: number
  layers: LayerProps[]
  activation?: 'adaptation'
  visibilityScope?: MapScope
  selectableProperty?: string
  selectionKey?: string
  legend?: {
    title: string
    items: Array<{
      label: string
      color: string
      selectionKey: string
      kind?: 'fill' | 'line'
    }>
  }
}

const ecoMachineLocationsLegend = {
  title: 'Restoration locations',
  items: [
    {
      label: 'Suisun Marsh',
      color: map.scenarios.ecoMachineLocations.suisunMarsh,
      selectionKey: 'suisun-marsh',
    },
    {
      label: 'Franks Tract',
      color: map.scenarios.ecoMachineLocations.franksTract,
      selectionKey: 'franks-tract',
    },
  ],
}

function createEcoMachineLocation(
  id: string,
  regionId: 'suisun_marsh' | 'franks_tract',
  selectionKey: 'suisun-marsh' | 'franks-tract',
  color: string,
  legend?: SourceConfig['legend'],
): SourceConfig {
  return {
    id,
    type: 'geojson',
    data: assetUrl('/data/regional-summary/region-of-interest.geojson'),
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
          'fill-color': color,
          'fill-opacity': 0.55,
          'fill-outline-color': map.scenarios.ecoMachineLocations.outline,
        },
      },
      {
        id: `${id}-line`,
        type: 'line',
        source: id,
        filter: ['==', ['get', 'region_id'], regionId],
        paint: {
          'line-color': color,
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
  map.scenarios.ecoMachineLocations.suisunMarsh,
  ecoMachineLocationsLegend,
)

const ecoMachineFranksTract = createEcoMachineLocation(
  'scenario-eco-machine-franks-tract',
  'franks_tract',
  'franks-tract',
  map.scenarios.ecoMachineLocations.franksTract,
)

interface ScenarioAssetOptions {
  id: string
  path: string
  selectionKey: string
  color: string
  geometry: 'area' | 'line'
  legend?: SourceConfig['legend']
  filter?: LayerProps['filter']
}

function createScenarioAsset({
  id,
  path,
  selectionKey,
  color,
  geometry,
  legend,
  filter,
}: ScenarioAssetOptions): SourceConfig {
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
              filter,
              paint: {
                'fill-color': color,
                'fill-opacity': 0.62,
                'fill-outline-color': color,
              },
            },
          ]
        : []),
      {
        id: `${id}-line`,
        type: 'line',
        source: id,
        filter,
        paint: {
          'line-color': color,
          'line-opacity': 0.95,
          'line-width': geometry === 'line' ? 6 : 3,
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
      color: map.scenarios.bolsterAndFortify.gates,
      selectionKey: 'operable-gates',
    },
    {
      label: 'Reconstructed levees',
      color: map.scenarios.bolsterAndFortify.levees,
      selectionKey: 'reconstructed-levees',
    },
    {
      label: 'Freshwater corridor',
      color: map.scenarios.bolsterAndFortify.corridor,
      selectionKey: 'freshwater-corridor',
      kind: 'line' as const,
    },
  ],
}

const bolsterSources = [
  createScenarioAsset({
    id: 'scenario-bolster-operable-gates',
    path: '/data/regional-summary/gis/bf-franks-tract-operable-gates.geojson',
    selectionKey: 'operable-gates',
    color: map.scenarios.bolsterAndFortify.gates,
    geometry: 'area',
    legend: bolsterLegend,
  }),
  createScenarioAsset({
    id: 'scenario-bolster-reconstructed-levees',
    path: '/data/regional-summary/gis/bf-franks-tract-levee-repair.geojson',
    selectionKey: 'reconstructed-levees',
    color: map.scenarios.bolsterAndFortify.levees,
    geometry: 'area',
  }),
  createScenarioAsset({
    id: 'scenario-bolster-freshwater-corridor',
    path: '/data/regional-summary/gis/bf-through-delta-freshwater-pathway.geojson',
    selectionKey: 'freshwater-corridor',
    color: map.scenarios.bolsterAndFortify.corridor,
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
          'line-color': map.scenarios.bolsterAndFortify.corridor,
          'line-opacity': 0.95,
          'line-width': 6,
        },
      },
    ],
  },
]

const tunnelLegend = {
  title: 'Conveyance infrastructure',
  items: [
    {
      label: 'Northern Delta intakes',
      color: map.scenarios.tunnel.facilities,
      selectionKey: 'tunnel-intakes',
    },
    {
      label: 'Tunnel alignment',
      color: map.scenarios.tunnel.alignment,
      selectionKey: 'tunnel-alignment',
      kind: 'line' as const,
    },
    {
      label: 'Bethany pumping facilities',
      color: map.scenarios.tunnel.pumping,
      selectionKey: 'tunnel-pumping',
    },
  ],
}

const tunnelSources = [
  createScenarioAsset({
    id: 'scenario-tunnel-intakes',
    path: '/data/regional-summary/gis/delta-tunnel-sites.geojson',
    selectionKey: 'tunnel-intakes',
    color: map.scenarios.tunnel.facilities,
    geometry: 'area',
    legend: tunnelLegend,
    filter: ['==', ['get', 'title'], 'Water Intake Shaft'],
  }),
  createScenarioAsset({
    id: 'scenario-tunnel-alignment',
    path: '/data/regional-summary/gis/delta-tunnel.geojson',
    selectionKey: 'tunnel-alignment',
    color: map.scenarios.tunnel.alignment,
    geometry: 'line',
  }),
  {
    id: 'scenario-tunnel-alignment-connectors',
    type: 'geojson' as const,
    activation: 'adaptation' as const,
    selectionKey: 'tunnel-alignment',
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
          'line-color': map.scenarios.tunnel.alignment,
          'line-opacity': 0.95,
          'line-width': 6,
        },
      },
    ],
  },
  createScenarioAsset({
    id: 'scenario-tunnel-pumping',
    path: '/data/regional-summary/gis/delta-tunnel-sites.geojson',
    selectionKey: 'tunnel-pumping',
    color: map.scenarios.tunnel.pumping,
    geometry: 'area',
    filter: ['in', ['get', 'OBJECTID'], ['literal', [7, 28]]],
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
  visibilityScope: 'delta',
  activation: 'adaptation',
  selectableProperty: 'type',
  legend: {
    title: 'Delta habitats',
    items: [
      {
        label: 'Wet soil farming',
        color: map.scenarios.newGreenWatershedHabitats.soil,
        selectionKey: 'soil',
      },
      {
        label: 'Tidal wetlands',
        color: map.scenarios.newGreenWatershedHabitats.tidal,
        selectionKey: 'tidal',
      },
      {
        label: 'Transitional habitats',
        color: map.scenarios.newGreenWatershedHabitats.transitional,
        selectionKey: 'transitional',
      },
      {
        label: 'Priority fish passage',
        color: map.scenarios.newGreenWatershedHabitats.riparian,
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
        'fill-color': [
          'match',
          ['get', 'type'],
          'soil',
          map.scenarios.newGreenWatershedHabitats.soil,
          'transitional',
          map.scenarios.newGreenWatershedHabitats.transitional,
          'tidal',
          map.scenarios.newGreenWatershedHabitats.tidal,
          map.scenarios.newGreenWatershedHabitats.fallback,
        ],
        'fill-opacity': 0.8,
        'fill-antialias': true,
      },
    },
  ],
}

const newGreenWatershedRiparian: SourceConfig = {
  id: 'scenario-ngw-riparian',
  type: 'vector',
  url: 'mapbox://justtransition.esdnqq',
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
        'line-color': map.scenarios.newGreenWatershedHabitats.riparian,
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

export const layersBySlug: Record<string, SourceConfig[]> = {
  'eco-machine': [ecoMachineSuisunMarsh, ecoMachineFranksTract],
  'bolster-and-fortify': bolsterSources,
  'a-tunnel': tunnelSources,
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

const deltaBounds: MapBounds = [
  [-122.25, 37.55],
  [-121.25, 38.65],
]

const watershedOverviewBounds: MapBounds = [
  [-123.6, 33.4],
  [-119.1, 42.1],
]

const defaultConfig: Config = {
  interactive: false,
  initialViewState: { longitude: -121.73, latitude: 38.04, zoom: 8.75 },
  maxBounds: [
    [-124.6, 32.4],
    [-114, 42.1],
  ],
  legendActivation: 'always',
  highlightFallbackColor: map.boundaries.legalDelta,
  bounds: { delta: deltaBounds },
}

export const configBySlug: Record<string, Config> = {
  'eco-machine': {
    ...defaultConfig,
    interactive: true,
    showNavigationControl: true,
    legendActivation: 'adaptation',
    highlightFallbackColor: map.scenarios.ecoMachineLocations.suisunMarsh,
    triggers: { adaptationLayers: 'chapter-2' },
    selectionBounds: {
      'suisun-marsh': [
        [-122.22, 38.02],
        [-121.82, 38.34],
      ],
      'franks-tract': [
        [-121.68, 37.96],
        [-121.52, 38.12],
      ],
    },
  },
  'bolster-and-fortify': {
    ...defaultConfig,
    interactive: true,
    showNavigationControl: true,
    legendActivation: 'adaptation',
    highlightFallbackColor: map.scenarios.bolsterAndFortify.gates,
    triggers: { adaptationLayers: 'chapter-2' },
    selectionBounds: {
      'operable-gates': [
        [-121.61, 38.01],
        [-121.56, 38.08],
      ],
      'reconstructed-levees': [
        [-121.61, 38.01],
        [-121.56, 38.08],
      ],
      'freshwater-corridor': [
        [-121.64, 37.82],
        [-121.5, 38.1],
      ],
    },
  },
  'a-tunnel': {
    ...defaultConfig,
    interactive: true,
    showNavigationControl: true,
    legendActivation: 'adaptation',
    highlightFallbackColor: map.scenarios.tunnel.facilities,
    triggers: { adaptationLayers: 'chapter-2' },
    selectionBounds: {
      'tunnel-intakes': [
        [-121.58, 38.31],
        [-121.47, 38.41],
      ],
      'tunnel-alignment': [
        [-121.64, 37.74],
        [-121.38, 38.43],
      ],
      'tunnel-pumping': [
        [-121.62, 37.77],
        [-121.53, 37.84],
      ],
    },
  },
  'new-green-watershed': {
    interactive: true,
    initialViewState: { longitude: -121.73, latitude: 38.04, zoom: 8.75 },
    maxBounds: [
      [-124.6, 32.4],
      [-114, 42.1],
    ],
    showNavigationControl: true,
    legendActivation: 'adaptation',
    highlightFallbackColor: map.boundaries.watershedRegion,
    bounds: {
      delta: deltaBounds,
      statewide: watershedOverviewBounds,
      'statewide-ecocultural': watershedOverviewBounds,
    },
    triggers: {
      adaptationLayers: 'chapter-2',
      statewide: 'chapter-3',
      ecocultural: 'ecocultural-stewardship',
    },
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
