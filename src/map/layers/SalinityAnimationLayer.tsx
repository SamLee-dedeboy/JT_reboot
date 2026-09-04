// Animated salinity raster-array layer for the hero pilot. Cycles through the
// tileset's exact bands by mutating a single layer's paint property, matching
// the imperative timer pattern MapLayerOrchestrator uses for its layer cycle.
import { useEffect } from 'react'
import type { ExpressionSpecification, Map as MapboxMap } from 'mapbox-gl'
import { Layer, Source } from 'react-map-gl/mapbox'
import type { LayerProps } from 'react-map-gl/mapbox'
import { map as mapTheme } from '../../theme'
import {
  SALINITY_ANIMATION_LAYER_ID,
  SALINITY_ANIMATION_SOURCE_ID,
  SALINITY_ANIMATION_SOURCE_LAYER,
  SALINITY_ANIMATION_TILESET_URL,
  SALINITY_ANIMATION_TILE_SIZE,
  SALINITY_ANIMATION_VALUE_RANGE,
  SALINITY_FRAMES,
} from './salinityAnimationConstants'

interface SalinityAnimationLayerProps {
  map?: MapboxMap | null
  playing?: boolean
  opacity?: number
}

// Sequential (continuous) scale: smoothly interpolates between the same
// anchor colors instead of the categorical 'step' classification, so PSU
// value differences within a class are still visible as color differences.
const salinityColorExpression: ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['raster-value'],
  0,
  mapTheme.salinityAnimation.fresh,
  0.5,
  mapTheme.salinityAnimation.oligohalineLow,
  2,
  mapTheme.salinityAnimation.oligohalineHigh,
  5,
  mapTheme.salinityAnimation.mesohaline,
  18,
  mapTheme.salinityAnimation.polyhaline,
  30,
  mapTheme.salinityAnimation.euhaline,
]

function useSalinityFrameCycle(map: MapboxMap | null | undefined, playing: boolean) {
  useEffect(() => {
    if (!map || !playing) return

    let frameIndex = 0
    let intervalId: number | undefined
    let frameId: number | undefined

    const showFrame = (index: number) => {
      if (!map.getLayer(SALINITY_ANIMATION_LAYER_ID)) return
      frameIndex =
        ((index % SALINITY_FRAMES.length) + SALINITY_FRAMES.length) % SALINITY_FRAMES.length
      map.setPaintProperty(
        SALINITY_ANIMATION_LAYER_ID,
        'raster-array-band',
        SALINITY_FRAMES[frameIndex].band,
      )
    }

    const start = () => {
      if (intervalId) return

      if (!map.getLayer(SALINITY_ANIMATION_LAYER_ID)) {
        frameId = window.requestAnimationFrame(start)
        return
      }

      showFrame(0)
      intervalId = window.setInterval(() => {
        showFrame(frameIndex + 1)
      }, mapTheme.salinityAnimation.frameIntervalMs)
    }

    map.on('styledata', start)
    start()

    return () => {
      if (intervalId) window.clearInterval(intervalId)
      if (frameId) window.cancelAnimationFrame(frameId)
      map.off('styledata', start)
    }
  }, [map, playing])
}

export default function SalinityAnimationLayer({
  map,
  playing = true,
  opacity = 0.85,
}: SalinityAnimationLayerProps) {
  useSalinityFrameCycle(map, playing)

  const layer: LayerProps = {
    id: SALINITY_ANIMATION_LAYER_ID,
    type: 'raster',
    source: SALINITY_ANIMATION_SOURCE_ID,
    'source-layer': SALINITY_ANIMATION_SOURCE_LAYER,
    paint: {
      'raster-array-band': SALINITY_FRAMES[0].band,
      'raster-color': salinityColorExpression,
      'raster-color-range': SALINITY_ANIMATION_VALUE_RANGE,
      'raster-opacity': opacity,
      'raster-opacity-transition': { duration: 0, delay: 0 },
      'raster-fade-duration': 0,
      'raster-resampling': 'linear',
    },
  }

  return (
    <Source
      id={SALINITY_ANIMATION_SOURCE_ID}
      type="raster-array"
      url={SALINITY_ANIMATION_TILESET_URL}
      tileSize={SALINITY_ANIMATION_TILE_SIZE}
    >
      <Layer {...layer} />
    </Source>
  )
}
