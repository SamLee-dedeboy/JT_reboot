// What a table cell holds: a published value, its difference from a baseline, or
// the reason there is none. No drawing here; Matrix.tsx draws what this returns.
import { valueAt } from '../../../../../internal/rank-visualization/drilldown/cellValue'
import { CALSIM_BAU, fmtValue } from '../../../../../internal/rank-visualization/drilldown/model'
import type {
  Climate,
  CriterionNode,
  ScenarioKey,
} from '../../../../../internal/rank-visualization/drilldown/model'
import type { Point } from './chartKit'
import { UI } from './labels'
import type { Breakout } from '../useBreakout'

export const PLACEHOLDER = UI.awaiting

/**
 * Measures where less is better, so a fall reads blue: days under salinity or
 * temperature stress (Recreation), and water age and salinity in drinking water
 * (Environmental Justice). Every other measure reads blue when it rises.
 */
const LOWER_IS_BETTER = [
  'bk-rec-salinity',
  'bk-rec-temperature',
  'bk-ej-drinking',
  'bk-ej-waterage',
]

export function lowerIsBetter(id: string) {
  return LOWER_IS_BETTER.some((root) => id === root || id.startsWith(`${root}-`))
}

// ---------- the result ----------

/** What a cell shows: a published number, or the reason there is none. */
export function read(
  node: CriterionNode,
  scenario: ScenarioKey,
  place: string,
  period: string,
  climate: Climate,
) {
  const cell = valueAt({ criterion: node.id, scenario, place, period, climate })
  // A row scored per species or per activity has no number of its own: its
  // entities carry the ranks, and the row says so.
  // When every entity is a version of one scenario, the other columns are that, not pending.
  if (cell.value === null && node.entityNoun && Object.keys(node.values).length === 0) {
    const versionOnly = (node.children ?? []).every(
      (child) => child.edge === 'refines' && child.values[scenario] === undefined,
    )
    return {
      value: null as number | null,
      why: versionOnly ? UI.versionOnly : UI.forthcoming,
    }
  }
  if (node.notApplicable?.includes(scenario) || node.notApplicableAt?.[scenario]?.includes(place))
    return { value: null as number | null, why: UI.notApplicable }
  if (cell.value === null && (node.forthcoming || node.forthcomingFor?.includes(scenario)))
    return { value: null as number | null, why: UI.forthcoming }
  if (cell.value === null) {
    // Under sea level rise a scenario with no run at all is a different gap from a
    // number never scored: Calling on Reserves and A Tunnel were not run with it.
    // Ecology's SLR regions exist only for both years together, so a single year
    // there is a slice the run does not split, not a missing score.
    // A measure with no SLR result at all is a gap in the measure, not the scenario.
    const series = cell.node?.values[scenario]
    const anySlr = Object.keys(cell.node?.values ?? {}).length > 0
    // A version of one scenario (New Green Watershed's restoration levels) has no
    // value under the others by design, not because a run is missing.
    const versionOnly = node.edge === 'refines' && series === undefined
    const why = versionOnly
      ? UI.versionOnly
      : climate !== 'slr'
        ? series === undefined && Object.keys(cell.node?.values ?? {}).length > 0
          ? UI.notRun
          : UI.notScored
        : !series
          ? anySlr
            ? UI.notRunWithSlr
            : UI.noSlrResult
          : Object.keys(series).some((key) => key.startsWith(`${place}|`))
            ? UI.bothYearsOnly
            : UI.notScored
    return { value: null as number | null, why }
  }
  if (cell.inferred) return { value: null as number | null, why: PLACEHOLDER }
  return { value: cell.value, why: '' }
}

/** A measure's unit, said once: the Show switch and the sentence say when it is a difference. */
export function unitWord(node: CriterionNode): string {
  switch (node.unit) {
    case 'score':
      return 'score, −5 to +5'
    case 'share':
      // EJ counts water-quality readings; everyone else counts days.
      return /^readings/i.test(node.label) ? 'share of readings' : 'proportion of days'
    case 'usd':
    case 'dollars':
      return 'dollars'
    case 'ladder':
      return 'change in water age'
    default:
      return node.unit
  }
}

/** Ranking scores sit on the −5…+5 scale; everything else is a detail beneath them. */
const isScore = (node: CriterionNode) => node.unit === 'score'

/** The selected measures in two groups, ranking scores first, each keeping its order. */
export function splitRows(nodes: CriterionNode[]) {
  return { scores: nodes.filter(isScore), details: nodes.filter((node) => !isScore(node)) }
}

/**
 * A difference in the row's own unit, with an explicit sign. A difference that
 * rounds to nothing reads as the unit's plain zero ("0%"), never "+0%" or "−0%".
 */
export function signed(value: number, unit: CriterionNode['unit']): string {
  const strip = (text: string) => text.replace(/^[+\-−]\s*/, '')
  const zero = strip(fmtValue(0, unit))
  const text = strip(fmtValue(Math.abs(value), unit))
  return text === zero ? zero : `${value > 0 ? '+' : '−'}${text}`
}

/**
 * A measure the team publishes as a change against its own baseline (every ranking
 * score, Economy's dollars, added acres): Business as Usual reads zero throughout,
 * so any baseline does, CalSim's included.
 */
function isChange(node: CriterionNode): boolean {
  const bau = Object.values(node.values.bau ?? {})
  return bau.length > 0 && bau.every((value) => value === 0)
}

/** The run one column is read against, and its value there. */
interface Base {
  scenario: ScenarioKey
  value: number | null
}

function baselineAt(
  state: Breakout,
  node: CriterionNode,
  scenario: ScenarioKey,
  period: string,
): Base {
  const key = state.baselineOf(scenario)
  const base = read(node, key, state.place, period, state.climate)
  if (base.value !== null) return { scenario: key, value: base.value }
  if (key !== CALSIM_BAU) return { scenario: key, value: null }
  // Land cover is no hydrology output: CalSim's Business as Usual has RMA's acres.
  if (node.unit === 'acres')
    return { scenario: key, value: read(node, 'bau', state.place, period, state.climate).value }
  return { scenario: key, value: isChange(node) ? 0 : null }
}

/** A cell: what the Show switch asks for, plus the two raw values behind a difference. */
export interface CellPoint extends Point {
  raw: number | null
  base: Base | null
}

/** One value as the Show switch asks for it: as published, or less its own baseline. */
export function pointAt(
  state: Breakout,
  node: CriterionNode,
  scenario: ScenarioKey,
  period: string,
): CellPoint {
  const here = read(node, scenario, state.place, period, state.climate)
  if (here.value === null) return { scenario, period, ...here, raw: null, base: null }
  const base = baselineAt(state, node, scenario, period)
  const raw = here.value
  if (state.reading !== 'change') return { scenario, period, ...here, raw, base }
  if (base.value === null)
    return { scenario, period, value: null, why: UI.baselineForthcoming, raw, base }
  return { scenario, period, value: raw - base.value, why: '', raw, base }
}

/** A score as text with an explicit sign: "+2", "−1", "0". */
export const scoreText = (value: number) =>
  value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '0'

/** "Longfin smelt, juvenile" → the species and its life stage; other labels pass through. */
export function lifeStage(label: string): { name: string; stage?: string } {
  const match = /^(.*), (juvenile|adult)$/i.exec(label)
  return match ? { name: match[1], stage: match[2].toLowerCase() } : { name: label }
}

export const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
