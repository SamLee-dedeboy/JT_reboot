// The value at one coordinate, and the words for it. Pure functions, kept apart
// from the components that show them so React fast refresh keeps working.
import { labelOf } from './scales'
import { ANY, SCENARIO_NAME, cellProvenance, effectiveSlice, resolve, sliceKey } from './model'
import type { CriterionNode, ScenarioKey, Unit } from './model'
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

export function valueAt(coords: Record<Dim, string>): Cell {
  const node = NODE_INDEX.get(coords.criterion)
  if (!node) return { value: null, missing: true, unit: 'score' }
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

/** Why a row or column came back empty; the reasons differ and both matter. */
export function emptyReason(dim: Dim, key: string): string {
  if (dim !== 'criterion') return 'nothing measured here'
  const node = NODE_INDEX.get(key)
  if (!node) return 'nothing measured here'
  if (node.children?.length) return `no number of its own · ${node.children.length} inside`
  if (node.provenance === 'unscored') return 'never scored'
  return 'not in this analysis'
}

/** The full coordinate in words, since a cell on its own does not say where it sits. */
export function describeCoords(coords: Record<Dim, string>, node: CriterionNode): string {
  const slice = effectiveSlice(node, coords.place, coords.period)
  const parts = [SCENARIO_NAME[coords.scenario as ScenarioKey]]
  if (slice.place !== ANY) parts.push(labelOf(node.places, slice.place))
  if (slice.period !== ANY) parts.push(labelOf(node.periods, slice.period))
  return parts.join(' · ')
}
