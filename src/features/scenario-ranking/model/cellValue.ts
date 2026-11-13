// The value at one coordinate, and the words for it. Pure functions, kept apart
// from the components that show them so React fast refresh keeps working.
import { cellProvenance, effectiveSlice, inClimate, resolve, sliceKey } from './criteria'
import type { Climate, CriterionNode, ScenarioKey, Unit } from './criteria'
import { NODE_INDEX } from './nodeIndex'

/** The four axes a cell sits on. */
export type Dim = 'scenario' | 'criterion' | 'place' | 'period'

export interface Cell {
  value: number | null
  missing: boolean
  unit: Unit
  node?: CriterionNode
  /** True where this number is ours rather than the subteam's. */
  inferred?: boolean
}

/** A cell's coordinate. Without `climate` it is today's run, as everywhere before SLR. */
export type Coords = Record<Dim, string> & { climate?: Climate }

export function valueAt(coords: Coords): Cell {
  const found = NODE_INDEX.get(coords.criterion)
  if (!found) return { value: null, missing: true, unit: 'score' }
  const node = inClimate(found, coords.climate ?? 'current')
  // Every node resolves the slice on its own terms. Without this a criterion keyed
  // by region and year never matches the unsliced lookup, so every cell read as a
  // dash and changing Where or When appeared to do nothing.
  const slice = effectiveSlice(node, coords.place, coords.period)
  const scenario = coords.scenario as ScenarioKey
  const resolved = resolve(node, scenario, slice.place, slice.period)
  return {
    value: resolved.value,
    missing: resolved.missing,
    unit: node.unit,
    node,
    inferred:
      cellProvenance(node, scenario, resolved.value, sliceKey(slice.place, slice.period)) ===
      'inferred',
  }
}

/**
 * An entity's own −5…+5 rank at one coordinate, where it has one: the rank sits
 * beside the value, so it resolves the slice on the rank series alone.
 */
export function rankAt(coords: Coords): number | null {
  const found = NODE_INDEX.get(coords.criterion)
  if (!found) return null
  const node = inClimate(found, coords.climate ?? 'current')
  if (!node.ranks) return null
  const view = { ...node, values: node.ranks }
  const slice = effectiveSlice(view, coords.place, coords.period)
  return resolve(view, coords.scenario as ScenarioKey, slice.place, slice.period).value ?? null
}
