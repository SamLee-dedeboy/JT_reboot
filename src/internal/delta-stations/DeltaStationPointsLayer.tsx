// Mapbox source/layer bundle for Delta monitoring stations and their status
// styling.
import { Layer, Source } from 'react-map-gl/mapbox'
import type { LayerProps } from 'react-map-gl/mapbox'
import { map, palette } from '../../theme'
import {
  DELTA_STATION_POINTS_LAYER_ID,
  DELTA_STATION_POINTS_HIGHLIGHT_LAYER_ID,
  DELTA_STATION_POINTS_SOURCE_ID,
  DELTA_STATION_POINTS_SOURCE_URL,
  DELTA_STATION_POINTS_SOURCE_LAYER,
  WATER_QUALITY_STATION_INDICES,
} from './deltaStationConstants'

interface DeltaStationPointsLayerProps {
  highlightedStationIndex?: number | null
  unacceptableOver75?: number[]
  goodOver75?: number[]
}

export default function DeltaStationPointsLayer({
  highlightedStationIndex = null,
  unacceptableOver75 = [],
  goodOver75 = [],
}: DeltaStationPointsLayerProps) {
  const baseLayer: LayerProps = {
    id: DELTA_STATION_POINTS_LAYER_ID,
    type: 'circle',
    'source-layer': DELTA_STATION_POINTS_SOURCE_LAYER,
    filter: ['in', ['get', 'index_'], ['literal', WATER_QUALITY_STATION_INDICES]],
    paint: {
      'circle-radius': 6,
      'circle-color': [
        'case',
        ['in', ['get', 'index_'], ['literal', unacceptableOver75]],
        map.markers.station,
        ['in', ['get', 'index_'], ['literal', goodOver75]],
        map.markers.comparison,
        palette.base[300],
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': map.markers.stroke,
    },
  }

  const highlightLayer: LayerProps = {
    id: DELTA_STATION_POINTS_HIGHLIGHT_LAYER_ID,
    type: 'circle',
    'source-layer': DELTA_STATION_POINTS_SOURCE_LAYER,
    filter: ['==', ['get', 'index_'], highlightedStationIndex ?? -999999],
    paint: {
      'circle-radius': 10,
      'circle-color': map.markers.selected,
      'circle-stroke-width': 3,
      'circle-stroke-color': map.markers.stroke,
      'circle-opacity': 0.95,
    },
  }

  return (
    <Source id={DELTA_STATION_POINTS_SOURCE_ID} type="vector" url={DELTA_STATION_POINTS_SOURCE_URL}>
      <Layer {...baseLayer} />
      <Layer {...highlightLayer} />
    </Source>
  )
}
