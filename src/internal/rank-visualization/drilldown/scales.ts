// Scales, geometry and unit labels for the drill-down views. Kept out of
// DrillBits.tsx so that file exports components only.
import type { Score } from '../data'
import { ANY } from './model'
import type { CriterionNode, Facet, Unit } from './model'

/** Row grid: label · edge · bar · value · provenance. */
export const DRILL_ROW_COLUMNS = '1fr 118px minmax(140px, 2fr) 104px 86px'
/** Widest a drill-down card gets: wide enough for the control sidebar plus a table. */
export const DRILL_CARD_WIDTH = 1240
/** The control sidebar. Fixed so the table beside it never reflows as controls change. */
export const CONTROL_PANEL_WIDTH = 340
/** Top of the reports' slight → extreme ladder. */
export const LADDER_MAX = 5

/** Shared bar domain for one comparison, so rows in a view are on one scale. */
export interface Domain {
  unit: Unit
  /** Largest absolute value among the compared rows; ignored for scores and shares. */
  max: number
}

export function domainFor(unit: Unit, values: Score[]): Domain {
  const max = values.reduce<number>((a, v) => (v === null ? a : Math.max(a, Math.abs(v))), 0)
  return { unit, max: max || 1 }
}

/** A domain per unit, so rows with mixed units share a scale with their own kind. */
export function domainsByUnit(rows: { unit: Unit; value: Score }[]) {
  const byUnit = new Map<Unit, Score[]>()
  rows.forEach((row) => byUnit.set(row.unit, [...(byUnit.get(row.unit) ?? []), row.value]))
  return new Map([...byUnit].map(([unit, values]) => [unit, domainFor(unit, values)]))
}

export function labelOf(facets: Facet[], key: string) {
  return facets.find((facet) => facet.key === key)?.label ?? key
}

/** Column heading naming the units a view is in, since they change with depth. */
export function unitHeading(unit: Unit) {
  switch (unit) {
    case 'score':
      return 'Score, −5…+5'
    case 'share':
      return 'Share of days'
    case 'acres':
      return 'Acres'
    case 'dollars':
      return 'Change, $M/yr'
    case 'usd':
      return 'Change in value added, $'
    case 'jobs':
      return 'Change in jobs'
    case 'days':
      return 'Change in water age, days'
    default:
      return 'Qualitative ladder'
  }
}

/** Caption naming the slice a row's value came from, when the node required one. */
export function sliceCaption(
  node: CriterionNode,
  slice: { place: string; period: string; defaulted: boolean },
) {
  if (!slice.defaulted) return undefined
  const parts = [
    slice.place === ANY ? null : labelOf(node.places, slice.place),
    slice.period === ANY ? null : labelOf(node.periods, slice.period),
  ].filter(Boolean)
  return parts.length ? `${parts.join(' · ')} (default)` : undefined
}
