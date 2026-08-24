import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SALINITY_VECTOR_PAIRS, getSalinityPairForFrame } from '../salinityVector155Constants'
import {
  SALINITY_ACTIVE_OPACITY,
  SALINITY_INACTIVE_OPACITY,
  SALINITY_MAX_BOUNDARY_RETRIES,
  advanceSalinityAnimationFrame,
  applySalinityAnimationState,
  areSalinityLayersReady,
  createSalinityAnimationState,
  type SalinityMapLike,
} from '../salinityVector155Controller'

const pair0 = SALINITY_VECTOR_PAIRS[0]
const pair1 = SALINITY_VECTOR_PAIRS[1]
const pair2 = SALINITY_VECTOR_PAIRS[2]
const pair9 = SALINITY_VECTOR_PAIRS[9]
const pair10 = SALINITY_VECTOR_PAIRS[10]

interface FakeMap {
  map: SalinityMapLike
  filters: Map<string, unknown>
  paint: Map<string, Map<string, unknown>>
  visibility: Map<string, string>
  loadedSources: Set<string>
}

function createFakeMap(
  options: { allLayersExist?: boolean; loadedSourceIds?: string[] } = {},
): FakeMap {
  const { allLayersExist = true, loadedSourceIds } = options
  const registeredSourceIds = new Set(SALINITY_VECTOR_PAIRS.map((pair) => pair.sourceId))
  const loadedSources = new Set(
    loadedSourceIds ?? SALINITY_VECTOR_PAIRS.map((pair) => pair.sourceId),
  )
  const filters = new Map<string, unknown>()
  const paint = new Map<string, Map<string, unknown>>()
  const visibility = new Map<string, string>()

  const map: SalinityMapLike = {
    getLayer: vi.fn(() => (allLayersExist ? ({} as never) : undefined)),
    getSource: vi.fn((id: string) => (registeredSourceIds.has(id) ? ({} as never) : undefined)),
    isSourceLoaded: vi.fn((id: string) => loadedSources.has(id)),
    setFilter: vi.fn((id: string, filter: unknown) => {
      filters.set(id, filter)
    }),
    setPaintProperty: vi.fn((id: string, name: string, value: unknown) => {
      if (name !== 'fill-opacity') return
      paint.set(id, (paint.get(id) ?? new Map()).set(name, value))
    }),
    setLayoutProperty: vi.fn((id: string, name: string, value: unknown) => {
      if (name !== 'visibility') return
      visibility.set(id, value as string)
    }),
  }

  return { map, filters, paint, visibility, loadedSources }
}

function opacityOf(fake: FakeMap, layerId: string): unknown {
  return fake.paint.get(layerId)?.get('fill-opacity')
}

describe('createSalinityAnimationState', () => {
  it('resolves the starting pair from the starting frame', () => {
    expect(createSalinityAnimationState(0).currentPairIndex).toBe(0)
    expect(createSalinityAnimationState(141).currentPairIndex).toBe(10)
  })
})

describe('applySalinityAnimationState', () => {
  it('paints only the active pair at 0.85 opacity', () => {
    const fake = createFakeMap()
    applySalinityAnimationState(fake.map, createSalinityAnimationState(0))

    expect(opacityOf(fake, pair0.layerId)).toBe(SALINITY_ACTIVE_OPACITY)
    for (const pair of SALINITY_VECTOR_PAIRS) {
      if (pair.pairIndex === pair0.pairIndex) continue
      expect(opacityOf(fake, pair.layerId)).toBe(SALINITY_INACTIVE_OPACITY)
    }
  })

  it('preloads the next pair visible at zero opacity, filtered to its first frame', () => {
    const fake = createFakeMap()
    applySalinityAnimationState(fake.map, createSalinityAnimationState(0))

    expect(fake.visibility.get(pair1.layerId)).toBe('visible')
    expect(opacityOf(fake, pair1.layerId)).toBe(SALINITY_INACTIVE_OPACITY)
    expect(fake.filters.get(pair1.layerId)).toEqual(['==', ['get', 'frame'], pair1.frameStart])
  })

  it('hides every pair besides the active and preload pairs', () => {
    const fake = createFakeMap()
    applySalinityAnimationState(fake.map, createSalinityAnimationState(0))

    expect(fake.visibility.get(pair2.layerId)).toBe('none')
  })

  it('wraps preloading pair 0 while pair 10 is active', () => {
    const fake = createFakeMap()
    applySalinityAnimationState(fake.map, createSalinityAnimationState(141))

    expect(fake.visibility.get(pair10.layerId)).toBe('visible')
    expect(opacityOf(fake, pair10.layerId)).toBe(SALINITY_ACTIVE_OPACITY)
    expect(fake.visibility.get(pair0.layerId)).toBe('visible')
    expect(opacityOf(fake, pair0.layerId)).toBe(SALINITY_INACTIVE_OPACITY)
  })

  it('uses numeric frame values in filters, never strings', () => {
    const fake = createFakeMap()
    applySalinityAnimationState(fake.map, createSalinityAnimationState(0))

    const activeFilter = fake.filters.get(pair0.layerId) as [string, unknown, number]
    expect(typeof activeFilter[2]).toBe('number')
  })
})

describe('advanceSalinityAnimationFrame within a pair', () => {
  it('only updates the active layer filter, without switching pairs', () => {
    const fake = createFakeMap()
    const state = createSalinityAnimationState(0)
    applySalinityAnimationState(fake.map, state)
    fake.filters.clear()

    advanceSalinityAnimationFrame(fake.map, state)

    expect(state.currentGlobalFrame).toBe(1)
    expect(state.currentPairIndex).toBe(0)
    expect(fake.filters.get(pair0.layerId)).toEqual(['==', ['get', 'frame'], 1])
    expect(fake.filters.has(pair1.layerId)).toBe(false)
  })
})

describe('advanceSalinityAnimationFrame at a pair boundary', () => {
  let fake: FakeMap
  let state: ReturnType<typeof createSalinityAnimationState>

  beforeEach(() => {
    fake = createFakeMap()
    state = createSalinityAnimationState(14)
    applySalinityAnimationState(fake.map, state)
  })

  it('switches pair 00 -> 01 when frame 14 advances to frame 15', () => {
    advanceSalinityAnimationFrame(fake.map, state)

    expect(state.currentGlobalFrame).toBe(15)
    expect(state.currentPairIndex).toBe(1)
  })

  it('activates the new pair at 0.85 opacity and hides the previous pair', () => {
    advanceSalinityAnimationFrame(fake.map, state)

    expect(opacityOf(fake, pair1.layerId)).toBe(SALINITY_ACTIVE_OPACITY)
    expect(fake.visibility.get(pair1.layerId)).toBe('visible')
    expect(opacityOf(fake, pair0.layerId)).toBe(SALINITY_INACTIVE_OPACITY)
    expect(fake.visibility.get(pair0.layerId)).toBe('none')
  })

  it('preloads the following pair (02) after switching to 01', () => {
    advanceSalinityAnimationFrame(fake.map, state)

    expect(fake.visibility.get(pair2.layerId)).toBe('visible')
    expect(opacityOf(fake, pair2.layerId)).toBe(SALINITY_INACTIVE_OPACITY)
    expect(fake.filters.get(pair2.layerId)).toEqual(['==', ['get', 'frame'], pair2.frameStart])
  })
})

describe('advanceSalinityAnimationFrame wrap-around', () => {
  it('switches pair 10 -> 00 when frame 154 advances to frame 0', () => {
    const fake = createFakeMap()
    const state = createSalinityAnimationState(154)
    applySalinityAnimationState(fake.map, state)

    advanceSalinityAnimationFrame(fake.map, state)

    expect(state.currentGlobalFrame).toBe(0)
    expect(state.currentPairIndex).toBe(0)
    expect(opacityOf(fake, pair0.layerId)).toBe(SALINITY_ACTIVE_OPACITY)
    expect(opacityOf(fake, pair10.layerId)).toBe(SALINITY_INACTIVE_OPACITY)
    // Preloads pair 1 as the following pair after wrapping back to pair 0.
    expect(fake.visibility.get(pair1.layerId)).toBe('visible')
  })
})

describe('advanceSalinityAnimationFrame boundary readiness', () => {
  it('holds the last valid frame while the next pair is not yet loaded', () => {
    const fake = createFakeMap({
      loadedSourceIds: SALINITY_VECTOR_PAIRS.filter((p) => p.pairIndex !== 1).map(
        (p) => p.sourceId,
      ),
    })
    const state = createSalinityAnimationState(14)
    applySalinityAnimationState(fake.map, state)

    advanceSalinityAnimationFrame(fake.map, state)

    expect(state.currentGlobalFrame).toBe(14)
    expect(state.currentPairIndex).toBe(0)
    expect(opacityOf(fake, pair0.layerId)).toBe(SALINITY_ACTIVE_OPACITY)
  })

  it('advances anyway after exceeding the max boundary retries, rather than stalling forever', () => {
    const fake = createFakeMap({
      loadedSourceIds: SALINITY_VECTOR_PAIRS.filter((p) => p.pairIndex !== 1).map(
        (p) => p.sourceId,
      ),
    })
    const state = createSalinityAnimationState(14)
    applySalinityAnimationState(fake.map, state)

    for (let i = 0; i < SALINITY_MAX_BOUNDARY_RETRIES + 1; i += 1) {
      advanceSalinityAnimationFrame(fake.map, state)
    }

    expect(state.currentGlobalFrame).toBe(15)
    expect(state.currentPairIndex).toBe(1)
  })
})

describe('areSalinityLayersReady', () => {
  it('is false until every pair layer exists', () => {
    const fake = createFakeMap({ allLayersExist: false })
    expect(areSalinityLayersReady(fake.map)).toBe(false)
  })

  it('is true once every pair layer exists', () => {
    const fake = createFakeMap({ allLayersExist: true })
    expect(areSalinityLayersReady(fake.map)).toBe(true)
  })
})

describe('sanity: pair lookups used by the controller', () => {
  it('agrees with getSalinityPairForFrame at the boundaries exercised above', () => {
    expect(getSalinityPairForFrame(140).pairIndex).toBe(pair9.pairIndex)
    expect(getSalinityPairForFrame(141).pairIndex).toBe(pair10.pairIndex)
  })
})
