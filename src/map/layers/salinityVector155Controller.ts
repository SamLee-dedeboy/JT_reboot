// Imperative playback logic for the 155-frame salinity vector animation,
// split from SalinityVector155Layer.tsx so it can be unit tested against a
// plain fake map object instead of a real mapbox-gl/react-map-gl instance.
//
// All 11 pair sources/layers are added once (by the React component) and
// stay mounted for the component's lifetime. This module only ever calls
// setFilter/setPaintProperty/setLayoutProperty on the already-existing
// layers — it never adds or removes sources/layers itself.
import {
  SALINITY_VECTOR_PAIRS,
  getNextSalinityPair,
  getSalinityPairForFrame,
  normalizeSalinityFrame,
  type SalinityVectorPair,
} from './salinityVector155Constants'

/**
 * The subset of the mapbox-gl Map API the controller needs, so tests can
 * supply a fake. Declared with loose method-shorthand signatures (rather than
 * `Pick<MapboxMap, ...>`) so a real `mapbox-gl` `Map` is structurally
 * assignable without dragging in its full generic paint/layout overloads.
 */
export interface SalinityMapLike {
  getLayer(id: string): unknown
  getSource(id: string): unknown
  isSourceLoaded(id: string): boolean
  setFilter(layerId: string, filter: unknown): unknown
  setPaintProperty(layerId: string, name: string, value: unknown): unknown
  setLayoutProperty(layerId: string, name: string, value: unknown): unknown
}

export const SALINITY_ACTIVE_OPACITY = 0.85
export const SALINITY_INACTIVE_OPACITY = 0
/** After this many consecutive ticks where the next pair still isn't loaded, advance anyway rather than stall. */
export const SALINITY_MAX_BOUNDARY_RETRIES = 20

export interface SalinityAnimationState {
  currentGlobalFrame: number
  currentPairIndex: number
  boundaryRetryCount: number
}

export function createSalinityAnimationState(startFrame = 0): SalinityAnimationState {
  const currentGlobalFrame = normalizeSalinityFrame(startFrame)
  return {
    currentGlobalFrame,
    currentPairIndex: getSalinityPairForFrame(currentGlobalFrame).pairIndex,
    boundaryRetryCount: 0,
  }
}

function layerExists(map: SalinityMapLike, layerId: string): boolean {
  return Boolean(map.getLayer(layerId))
}

function sourceExists(map: SalinityMapLike, sourceId: string): boolean {
  return Boolean(map.getSource(sourceId))
}

/** All 11 pair layers must exist before the controller can safely run. */
export function areSalinityLayersReady(map: SalinityMapLike): boolean {
  return SALINITY_VECTOR_PAIRS.every((pair) => layerExists(map, pair.layerId))
}

function setFrameFilter(map: SalinityMapLike, pair: SalinityVectorPair, globalFrame: number) {
  if (!layerExists(map, pair.layerId)) return
  map.setFilter(pair.layerId, ['==', ['get', 'frame'], globalFrame])
}

function setActive(map: SalinityMapLike, pair: SalinityVectorPair) {
  if (!layerExists(map, pair.layerId)) return
  map.setLayoutProperty(pair.layerId, 'visibility', 'visible')
  map.setPaintProperty(pair.layerId, 'fill-opacity', SALINITY_ACTIVE_OPACITY)
}

/** Visible so Mapbox requests its tiles, but painted at zero opacity. */
function preload(map: SalinityMapLike, pair: SalinityVectorPair) {
  if (!layerExists(map, pair.layerId)) return
  setFrameFilter(map, pair, pair.frameStart)
  map.setLayoutProperty(pair.layerId, 'visibility', 'visible')
  map.setPaintProperty(pair.layerId, 'fill-opacity', SALINITY_INACTIVE_OPACITY)
}

function hide(map: SalinityMapLike, pair: SalinityVectorPair) {
  if (!layerExists(map, pair.layerId)) return
  map.setLayoutProperty(pair.layerId, 'visibility', 'none')
  map.setPaintProperty(pair.layerId, 'fill-opacity', SALINITY_INACTIVE_OPACITY)
}

/** True once the next pair's tiles have actually arrived (not just registered). */
function isPairLoaded(map: SalinityMapLike, pair: SalinityVectorPair): boolean {
  return sourceExists(map, pair.sourceId) && Boolean(map.isSourceLoaded(pair.sourceId))
}

/**
 * Applies the full visual state for `state`: the active pair painted at the
 * current frame, the next pair preloaded (hidden), and every other pair
 * hidden. Safe to call on mount and again after a style reload, since it
 * derives everything from `state` rather than resetting it.
 */
export function applySalinityAnimationState(map: SalinityMapLike, state: SalinityAnimationState) {
  const activePair = SALINITY_VECTOR_PAIRS[state.currentPairIndex]
  const nextPair = getNextSalinityPair(state.currentPairIndex)

  SALINITY_VECTOR_PAIRS.forEach((pair) => {
    if (pair.pairIndex === activePair.pairIndex || pair.pairIndex === nextPair.pairIndex) return
    hide(map, pair)
  })

  setFrameFilter(map, activePair, state.currentGlobalFrame)
  setActive(map, activePair)
  preload(map, nextPair)
}

/**
 * Advances `state` by exactly one global frame, mutating it in place.
 * Within a pair this only updates the active layer's filter. At a pair
 * boundary it waits (bounded) for the already-preloaded next pair's tiles to
 * be loaded before switching, so the map is never shown blank between pairs.
 */
export function advanceSalinityAnimationFrame(
  map: SalinityMapLike,
  state: SalinityAnimationState,
): void {
  const activePair = SALINITY_VECTOR_PAIRS[state.currentPairIndex]
  const candidateFrame = normalizeSalinityFrame(state.currentGlobalFrame + 1)
  const candidatePair = getSalinityPairForFrame(candidateFrame)

  if (candidatePair.pairIndex === activePair.pairIndex) {
    state.currentGlobalFrame = candidateFrame
    setFrameFilter(map, activePair, candidateFrame)
    return
  }

  if (
    !isPairLoaded(map, candidatePair) &&
    state.boundaryRetryCount < SALINITY_MAX_BOUNDARY_RETRIES
  ) {
    // Not ready yet: hold the last valid frame and retry on the next tick
    // rather than showing a blank map or skipping ahead.
    state.boundaryRetryCount += 1
    return
  }

  state.boundaryRetryCount = 0
  setFrameFilter(map, candidatePair, candidateFrame)
  setActive(map, candidatePair)
  hide(map, activePair)

  state.currentGlobalFrame = candidateFrame
  state.currentPairIndex = candidatePair.pairIndex
  preload(map, getNextSalinityPair(candidatePair.pairIndex))
}
