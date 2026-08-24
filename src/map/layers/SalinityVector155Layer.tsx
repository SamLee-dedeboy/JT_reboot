// 155-frame classified salinity polygon animation (vector tilesets), split
// across 11 pair tilesets (salinity_vector_pair_00..10) instead of one
// combined tileset — the combined tileset was capped by Mapbox Tiling
// Service and had missing features at regional zooms.
//
// All 11 pairs are rendered as stable Source/Layer JSX once; playback never
// swaps a layer's source or creates/removes layers. Per-frame updates are
// applied imperatively (setFilter/setPaintProperty/setLayoutProperty) via
// salinityVector155Controller, driven by refs rather than React state so
// advancing a frame never triggers a re-render.
import { useEffect, useRef } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import { Layer, Source } from 'react-map-gl/mapbox'
import type { LayerProps } from 'react-map-gl/mapbox'
import {
  SALINITY_VECTOR_155_SOURCE_LAYER,
  SALINITY_VECTOR_PAIRS,
  getNextSalinityPair,
  type SalinityVectorPair,
} from './salinityVector155Constants'
import {
  SALINITY_ACTIVE_OPACITY,
  SALINITY_INACTIVE_OPACITY,
  advanceSalinityAnimationFrame,
  applySalinityAnimationState,
  areSalinityLayersReady,
  createSalinityAnimationState,
} from './salinityVector155Controller'

interface SalinityVector155LayerProps {
  map?: MapboxMap | null
  playing?: boolean
  intervalMs?: number
}

const INITIAL_PAIR_INDEX = 0
const INITIAL_PRELOAD_PAIR = getNextSalinityPair(INITIAL_PAIR_INDEX)

function buildInitialLayer(pair: SalinityVectorPair): LayerProps {
  const isActive = pair.pairIndex === INITIAL_PAIR_INDEX
  const isPreload = pair.pairIndex === INITIAL_PRELOAD_PAIR.pairIndex
  const initialFrame = isActive ? 0 : pair.frameStart

  return {
    id: pair.layerId,
    type: 'fill',
    source: pair.sourceId,
    'source-layer': SALINITY_VECTOR_155_SOURCE_LAYER,
    filter: ['==', ['get', 'frame'], initialFrame],
    layout: { visibility: isActive || isPreload ? 'visible' : 'none' },
    paint: {
      'fill-color': ['get', 'color'],
      'fill-opacity': isActive ? SALINITY_ACTIVE_OPACITY : SALINITY_INACTIVE_OPACITY,
      'fill-antialias': true,
      'fill-opacity-transition': { duration: 0, delay: 0 },
    },
  }
}

function useSalinityVector155Playback(
  map: MapboxMap | null | undefined,
  playing: boolean,
  intervalMs: number,
) {
  const stateRef = useRef(createSalinityAnimationState(0))
  const intervalRef = useRef<number | undefined>(undefined)
  const requestAnimationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!map || !playing) return

    // A style reload resets every paint/layout override to what react-map-gl
    // last declared; reassert the in-progress frame/pair/preload instead of
    // restarting from frame 0. `style.load` fires once per reload (unlike
    // `styledata`, which fires continuously as tiles stream in), so this
    // stays cheap and this listener is only ever registered once per effect
    // run — no duplicates accumulate across renders.
    const reapplyCurrentState = () => {
      if (!areSalinityLayersReady(map)) return
      applySalinityAnimationState(map, stateRef.current)
    }

    const start = () => {
      if (intervalRef.current !== undefined) return

      if (!areSalinityLayersReady(map)) {
        requestAnimationFrameRef.current = window.requestAnimationFrame(start)
        return
      }

      applySalinityAnimationState(map, stateRef.current)
      intervalRef.current = window.setInterval(() => {
        advanceSalinityAnimationFrame(map, stateRef.current)
      }, intervalMs)
    }

    map.on('style.load', reapplyCurrentState)
    start()

    return () => {
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
      if (requestAnimationFrameRef.current !== undefined) {
        window.cancelAnimationFrame(requestAnimationFrameRef.current)
        requestAnimationFrameRef.current = undefined
      }
      map.off('style.load', reapplyCurrentState)
    }
  }, [map, playing, intervalMs])
}

export default function SalinityVector155Layer({
  map,
  playing = true,
  intervalMs = 100,
}: SalinityVector155LayerProps) {
  useSalinityVector155Playback(map, playing, intervalMs)

  return (
    <>
      {SALINITY_VECTOR_PAIRS.map((pair) => (
        <Source key={pair.sourceId} id={pair.sourceId} type="vector" url={pair.tilesetUrl}>
          <Layer {...buildInitialLayer(pair)} />
        </Source>
      ))}
    </>
  )
}
