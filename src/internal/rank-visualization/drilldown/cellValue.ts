// The value at one coordinate, and the words for it. Pure functions, kept apart
// from the components that show them so React fast refresh keeps working.
import { labelOf } from './scales'
import {
  ANY,
  SCENARIO_NAME,
  cellProvenance,
  effectiveSlice,
  inClimate,
  resolve,
  sliceKey,
} from './model'
import type { Climate, CriterionNode, ScenarioKey, Unit } from './model'
import { NODE_INDEX } from './tree'
import type { Dim } from './usePivot'

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

/** Why a row or column came back empty; the reasons differ and both matter. */
export function emptyReason(dim: Dim, key: string): string {
  if (dim !== 'criterion') return 'nothing measured here'
  const node = NODE_INDEX.get(key)
  if (!node) return 'nothing measured here'
  if (node.children?.length) return `no value here; ${node.children.length} measurements inside`
  if (node.provenance === 'unscored') return 'never scored'
  return 'not in this analysis'
}

/** The full coordinate in words, since a cell on its own does not say where it sits. */
export function describeCoords(coords: Coords, node: CriterionNode): string {
  const slice = effectiveSlice(node, coords.place, coords.period)
  const parts = [SCENARIO_NAME[coords.scenario as ScenarioKey]]
  if (coords.climate === 'slr') parts.push('with sea level rise')
  if (slice.place !== ANY) parts.push(labelOf(node.places, slice.place))
  if (slice.period !== ANY) parts.push(labelOf(node.periods, slice.period))
  return parts.join(' · ')
}
