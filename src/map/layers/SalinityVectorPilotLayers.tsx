// Three classified salinity polygon frames (vector tileset), one per
// published frame. Cycled by MapLayerOrchestrator's existing layerCycle
// opacity crossfade — the same mechanism the hero previously used for its
// PNG mockup layers — rather than a new imperative timer.
import { Layer, Source } from 'react-map-gl/mapbox'
import type { LayerProps } from 'react-map-gl/mapbox'
import {
  SALINITY_VECTOR_PILOT_FRAMES,
  SALINITY_VECTOR_PILOT_SOURCE_ID,
  SALINITY_VECTOR_PILOT_SOURCE_LAYER,
  SALINITY_VECTOR_PILOT_TILESET_URL,
} from './salinityVectorPilotConstants'

export default function SalinityVectorPilotLayers() {
  return (
    <Source
      id={SALINITY_VECTOR_PILOT_SOURCE_ID}
      type="vector"
      url={SALINITY_VECTOR_PILOT_TILESET_URL}
    >
      {SALINITY_VECTOR_PILOT_FRAMES.map(({ frame, layerId }) => {
        const layer: LayerProps = {
          id: layerId,
          type: 'fill',
          source: SALINITY_VECTOR_PILOT_SOURCE_ID,
          'source-layer': SALINITY_VECTOR_PILOT_SOURCE_LAYER,
          filter: ['==', ['get', 'frame'], frame],
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': 0,
          },
        }
        return <Layer key={layerId} {...layer} />
      })}
    </Source>
  )
}
