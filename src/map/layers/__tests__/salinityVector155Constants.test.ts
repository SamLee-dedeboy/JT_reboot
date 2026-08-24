import { describe, expect, it } from 'vitest'
import {
  SALINITY_VECTOR_155_FRAME_COUNT,
  SALINITY_VECTOR_PAIRS,
  getNextSalinityPair,
  getSalinityPairForFrame,
  normalizeSalinityFrame,
} from '../salinityVector155Constants'

describe('getSalinityPairForFrame', () => {
  it('resolves frame 0 to pair 0', () => {
    expect(getSalinityPairForFrame(0).pairIndex).toBe(0)
  })

  it('resolves frame 14 to pair 0 (its last frame)', () => {
    expect(getSalinityPairForFrame(14).pairIndex).toBe(0)
  })

  it('resolves frame 15 to pair 1 (its first frame)', () => {
    expect(getSalinityPairForFrame(15).pairIndex).toBe(1)
  })

  it('resolves frame 28 to pair 1 (its last frame)', () => {
    expect(getSalinityPairForFrame(28).pairIndex).toBe(1)
  })

  it('resolves frame 29 to pair 2 (its first frame)', () => {
    expect(getSalinityPairForFrame(29).pairIndex).toBe(2)
  })

  it('resolves frame 140 to pair 9 (its last frame)', () => {
    expect(getSalinityPairForFrame(140).pairIndex).toBe(9)
  })

  it('resolves frame 141 to pair 10 (its first frame)', () => {
    expect(getSalinityPairForFrame(141).pairIndex).toBe(10)
  })

  it('resolves frame 154 to pair 10 (the final global frame)', () => {
    expect(getSalinityPairForFrame(154).pairIndex).toBe(10)
  })
})

describe('normalizeSalinityFrame', () => {
  it('wraps frame 155 to frame 0', () => {
    expect(normalizeSalinityFrame(155)).toBe(0)
  })

  it('wraps negative frame indexes into range', () => {
    expect(normalizeSalinityFrame(-1)).toBe(154)
    expect(normalizeSalinityFrame(-155)).toBe(0)
    expect(normalizeSalinityFrame(-156)).toBe(154)
  })

  it('leaves in-range frames unchanged', () => {
    expect(normalizeSalinityFrame(0)).toBe(0)
    expect(normalizeSalinityFrame(77)).toBe(77)
    expect(normalizeSalinityFrame(154)).toBe(154)
  })
})

describe('getNextSalinityPair', () => {
  it('wraps pair 10 back to pair 0', () => {
    expect(getNextSalinityPair(10).pairIndex).toBe(0)
  })

  it('returns the following pair otherwise', () => {
    expect(getNextSalinityPair(0).pairIndex).toBe(1)
    expect(getNextSalinityPair(5).pairIndex).toBe(6)
  })
})

describe('SALINITY_VECTOR_PAIRS coverage', () => {
  it('has exactly 11 pairs', () => {
    expect(SALINITY_VECTOR_PAIRS).toHaveLength(11)
  })

  it('has every global frame 0-154 belonging to exactly one pair', () => {
    for (let frame = 0; frame < SALINITY_VECTOR_155_FRAME_COUNT; frame += 1) {
      const matches = SALINITY_VECTOR_PAIRS.filter(
        (pair) => frame >= pair.frameStart && frame <= pair.frameEnd,
      )
      expect(matches, `frame ${frame} should belong to exactly one pair`).toHaveLength(1)
    }
  })

  it('has pair ranges with no gaps or overlaps, covering 0-154 contiguously', () => {
    const sorted = [...SALINITY_VECTOR_PAIRS].sort((a, b) => a.frameStart - b.frameStart)
    expect(sorted[0].frameStart).toBe(0)
    expect(sorted[sorted.length - 1].frameEnd).toBe(SALINITY_VECTOR_155_FRAME_COUNT - 1)
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i].frameStart).toBe(sorted[i - 1].frameEnd + 1)
    }
  })

  it('has unique source and layer IDs across all pairs', () => {
    const sourceIds = SALINITY_VECTOR_PAIRS.map((pair) => pair.sourceId)
    const layerIds = SALINITY_VECTOR_PAIRS.map((pair) => pair.layerId)
    expect(new Set(sourceIds).size).toBe(sourceIds.length)
    expect(new Set(layerIds).size).toBe(layerIds.length)
    // Sources and layers also don't collide with each other.
    expect(new Set([...sourceIds, ...layerIds]).size).toBe(sourceIds.length + layerIds.length)
  })

  it('has a distinct tileset URL per pair', () => {
    const urls = SALINITY_VECTOR_PAIRS.map((pair) => pair.tilesetUrl)
    expect(new Set(urls).size).toBe(urls.length)
  })
})
