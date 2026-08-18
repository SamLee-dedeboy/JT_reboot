import type { LayerProps } from 'react-map-gl/mapbox'
import { map } from '../../theme'

export interface ScenarioMapSourceConfig {
  id: string
  type: 'vector'
  url: string
  layers: LayerProps[]
  visibilityScope?: 'delta' | 'statewide' | 'statewide-ecocultural'
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

const newGreenWatershedHabitats: ScenarioMapSourceConfig = {
  id: 'scenario-ngw-delta-habitats',
  type: 'vector',
  url: 'mapbox://justtransition.i7mkqy',
  visibilityScope: 'delta',
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
        selectionKey: 'transitional',
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
  selectionKey: 'transitional',
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
    {
      id: 'statewide-watershed-regions-label',
      type: 'symbol',
      source: 'statewide-watershed-regions',
      'source-layer': 'watershed_region.zip-16ybkn',
      minzoom: 0,
      maxzoom: 22,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 12,
        'text-max-width': 10,
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
    statewideWatershedShade,
    statewideWatershedRegions,
    statewideIndigenousTerritories,
  ],
}
