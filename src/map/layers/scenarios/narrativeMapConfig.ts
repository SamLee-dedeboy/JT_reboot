import type { LayerProps } from 'react-map-gl/mapbox'
import type { FeatureCollection, Point } from 'geojson'
import { map } from '../../../theme'

export type NarrativeMapScope = 'delta' | 'statewide' | 'statewide-ecocultural'
export type NarrativeMapBounds = [[number, number], [number, number]]

export interface NarrativeMapConfig {
  interactive: boolean
  initialViewState: {
    longitude: number
    latitude: number
    zoom: number
  }
  maxBounds: NarrativeMapBounds
  showNavigationControl?: boolean
  legendActivation: 'always' | 'adaptation'
  highlightFallbackColor: string
  bounds: Partial<Record<NarrativeMapScope, NarrativeMapBounds>>
  triggers?: {
    adaptationLayers?: string
    statewide?: string
    ecocultural?: string
  }
}

export interface ScenarioMapSourceConfig {
  id: string
  type: 'vector' | 'raster-array' | 'geojson'
  url?: string
  data?: FeatureCollection<Point>
  tileSize?: number
  layers: LayerProps[]
  activation?: 'adaptation'
  visibilityScope?: NarrativeMapScope
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

const newGreenWatershedSubsidence: ScenarioMapSourceConfig = {
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

const newGreenWatershedHabitats: ScenarioMapSourceConfig = {
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

const newGreenWatershedRiparian: ScenarioMapSourceConfig = {
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

const legalDeltaBoundary: ScenarioMapSourceConfig = {
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

const statewideWatershedShade: ScenarioMapSourceConfig = {
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

const statewideWatershedRegions: ScenarioMapSourceConfig = {
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

const statewideWatershedRegionLabels: ScenarioMapSourceConfig = {
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

const statewideIndigenousTerritories: ScenarioMapSourceConfig = {
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

export const scenarioMapLayersBySlug: Record<string, ScenarioMapSourceConfig[]> = {
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

const deltaBounds: NarrativeMapBounds = [
  [-122.25, 37.55],
  [-121.25, 38.65],
]

const watershedOverviewBounds: NarrativeMapBounds = [
  [-123.6, 33.4],
  [-119.1, 42.1],
]

const defaultNarrativeMapConfig: NarrativeMapConfig = {
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

export const narrativeMapConfigBySlug: Record<string, NarrativeMapConfig> = {
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

export function getNarrativeMapConfig(scenarioSlug: string) {
  return narrativeMapConfigBySlug[scenarioSlug] ?? defaultNarrativeMapConfig
}

export function getNarrativeMapLegendItem(scenarioSlug: string, selectionKey: string) {
  return scenarioMapLayersBySlug[scenarioSlug]
    ?.flatMap((source) => source.legend?.items ?? [])
    .find((item) => item.selectionKey === selectionKey)
}
