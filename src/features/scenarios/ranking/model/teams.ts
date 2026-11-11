// The scenarios, teams and ranking arithmetic. Names come from src/content/names.ts;
// the scores from the team files in ../data/.
// Criterion scores from the five subteams' two sources in research/criteria-stories/:
// the "Story Behind the Criterion" reports (Sept 2026 drafts) and the Bay-Delta Science
// Conference slides (Oct 2026), which supersede them. Provenance, derivations, what the
// slides changed and the remaining gaps: research/criteria-stories/RANKINGS.md.
//
// Scale: −5…+5 with Business as Usual anchored at 0, as EJ, Eco-cultural and
// Economy all report it. Two caveats carried from the reports:
//   - Values the subteam did not publish as a criterion score are INFERRED, flagged
//     in `provisional` and marked with * on screen. Two kinds, one label, because a
//     reader needs the same warning from both: Ecology's whole column is the mean of
//     its two published metric ranks. None of these are the subteams' own numbers.
//     Recreation's column is its own score (26 Oct 2026), and EJ's is its own (Nov 2026).
// The six adaptation scenarios and the tiered outflow runs are separate sets: the
// outflow runs use a different increment and are never ranked with the adaptations.
import { alpha } from '@mui/material/styles'
import { chart } from '../../../../theme'
import { scenarioName, teamShortName } from '../../../../content/names'
import type { TeamKey } from '../../../../content/names'

const voting = chart.voting

export type { TeamKey }

export interface Team {
  key: TeamKey
  name: string
  color: string
}

/** A criterion score, or null where that subteam has not scored the scenario. */
export type Score = number | null

export interface Scenario {
  name: string
  color: string
  /** One score per team, in TEAMS order. */
  scores: Score[]
  /**
   * Per-team flags: true where the score is INFERRED rather than the subteam's own
   * (a placeholder). Internal views mark these with *; the public page does not.
   */
  provisional: boolean[]
}

export type Weights = number[]

const SCORE_MAX = 5
export const WEIGHT_MAX = 3
export const WEIGHT_STEP = 0.5
/** Quick-pick values for the per-team stepper chips (2b). */
export const WEIGHT_CHIPS = [0, 0.5, 1, 2]
export const EQUAL_WEIGHTS: Weights = [1, 1, 1, 1, 1]

/** The ranking's team order: score arrays follow it. */
const RANKING_ORDER: TeamKey[] = [
  'ecology',
  'recreation',
  'environmentalJustice',
  'economy',
  'ecoCultural',
]

export const TEAMS: Team[] = RANKING_ORDER.map((key) => ({
  key,
  name: teamShortName(key),
  color: voting.team[key],
}))

/** A scenario's name and color, before any scores. */
export type ScenarioIdentity = Pick<Scenario, 'name' | 'color'>

/**
 * The six adaptation scenarios, in declaration order; model/criteria.ts keys off it.
 * No scores here: they are in features/scenarios/ranking/scores.ts, and
 * ./scenarioScores.ts builds the ranked sets from the table that reads them.
 */
export const ADAPTATION_SCENARIOS: ScenarioIdentity[] = [
  { name: scenarioName('ngw'), color: voting.scenario.newGreenWatershed },
  { name: scenarioName('em'), color: voting.scenario.ecoMachine },
  { name: scenarioName('bf'), color: voting.scenario.bolsterAndFortify },
  { name: scenarioName('cor'), color: voting.scenario.callingOnReserves },
  { name: scenarioName('tunnel'), color: voting.scenario.deltaTunnel },
  { name: scenarioName('bau'), color: voting.scenario.businessAsUsual },
]

const NOT_INFERRED = [false, false, false, false, false]

/**
 * The tiered outflow runs (SCHISM runs 16 and 17) beside their own Historic
 * Baseline (run 15), which every team scores them against; Business as Usual is
 * the adaptation runs' baseline, not theirs. EJ and Eco-cultural publish an outflow
 * criterion score (Oct 2026 reports), and Economy scores +30% alone (v20). The rest
 * are null, forthcoming: Recreation scores each activity (breakout table) but not the
 * criterion, and Ecology reports suitable days but no rank.
 */
export const OUTFLOW_SCENARIOS: Scenario[] = [
  {
    // EJ: drinking water only (+4 in every cut); Eco-cultural: one overall score.
    name: scenarioName('more'),
    color: voting.scenario.moreOutflow,
    // Recreation: +1, the average of its regions (ranking table workbook, Nov 2026).
    // EJ: +4, the team's own score in that workbook.
    // Economy: 0 (v20, 3 Nov 2026): a gain of about $20,000 a year, about 0.002%.
    scores: [null, 1, 4, 0, 3],
    provisional: [false, false, false, false, false],
  },
  {
    // EJ publishes −1 for the whole run and both seasons, then an "average" of −1.5
    // rounded to −2; −2 is the overall score it states, so it is the one used.
    name: scenarioName('less'),
    color: voting.scenario.lessOutflow,
    scores: [null, null, -2, null, -2],
    provisional: NOT_INFERRED,
  },
  {
    name: scenarioName('hist'),
    color: voting.scenario.businessAsUsual,
    scores: [null, null, 0, null, 0],
    provisional: NOT_INFERRED,
  },
]

const FIRST_WEIGHT = 2
const OTHERS_WEIGHT = 0.5

/** Equal, plus one "<team> first" lens per team: that team ×2, everyone else ×½. */
export const WEIGHT_PRESETS: { name: string; weights: Weights }[] = [
  { name: 'Equal', weights: EQUAL_WEIGHTS },
  ...TEAMS.map(({ key }, teamIndex) => ({
    name: `${teamShortName(key, 'weightPresets')} first`,
    weights: TEAMS.map((_, i) => (i === teamIndex ? FIRST_WEIGHT : OTHERS_WEIGHT)),
  })),
]

// ---------- formatting / scales ----------

/** Score (−5…+5) → percentage position along a centered track. */
export const toPct = (score: number) => 50 + (score / SCORE_MAX) * 50

/**
 * Scores display as whole points: the nearest one, halves away from zero
 * (+4.5 → +5, −0.375 → 0). Ranking and positions keep the decimals.
 */
export const roundScore = (value: number): number => Math.sign(value) * Math.round(Math.abs(value))

/** Signed whole-point label with a typographic minus. */
export function fmtScore(value: number): string {
  const rounded = roundScore(value)
  if (rounded === 0) return '0' // also catches −0
  return rounded > 0 ? `+${rounded}` : `−${Math.abs(rounded)}`
}

export const fmtWeight = (weight: number) => (weight === 0.5 ? '½' : `${weight}`)

/** Diverging cell fill: blue above baseline, orange below, grey at 0. */
export function cellFill(score: number): string {
  if (score === 0) return voting.baseline
  const opacity = 0.18 + (Math.abs(score) / SCORE_MAX) * 0.62
  return alpha(score > 0 ? voting.above : voting.below, opacity)
}

/**
 * Opacity for a ballot cell given its team's weight. Only a muted team (×0)
 * ghosts out; any other weight stays fully opaque so a cell's shade encodes the
 * score alone (weight is shown by column width / the weight labels instead).
 */
export const weightOpacity = (weight: number) => (weight === 0 ? 0.15 : 1)

/** Dot diameter (px) that encodes a team's weight. */
export const weightDotSize = (weight: number) => 6 + weight * 5

export const sameWeights = (a: Weights, b: Weights) => a.every((v, i) => v === b[i])

// ---------- derived stats ----------

export interface ScenarioStats extends Scenario {
  /** False until at least one criterion has scored the scenario. */
  hasScores: boolean
  total: number
  avg: number
  /** Spread span: left edge and width, both in % of the −5…+5 track. */
  spanLeft: number
  spanWidth: number
}

/** Scores a scenario actually has; unscored criteria are left out of every stat. */
export const scored = (scores: Score[]): number[] => scores.filter((s) => s !== null)

function withStats(scenario: Scenario): ScenarioStats {
  const values = scored(scenario.scores)
  const total = values.reduce((a, b) => a + b, 0)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  return {
    ...scenario,
    hasScores: values.length > 0,
    total,
    avg: values.length ? total / values.length : 0,
    spanLeft: toPct(min),
    spanWidth: Math.max(2, ((max - min) / SCORE_MAX) * 50),
  }
}

/** The runs every other scenario is read against. */
export const BASELINES = new Set(['Business as Usual', 'Historical Baseline'])

/** On a tied score the baseline comes first: matching it is not beating it. */
const baselineFirst = (a: Scenario, b: Scenario) =>
  Number(BASELINES.has(b.name)) - Number(BASELINES.has(a.name))

/** Weighted mean over the scored criteria only, renormalized to their weights. */
function weightedAverage(scores: Score[], weights: Weights): number {
  const weightSum = scores.reduce<number>(
    (sum, score, i) => (score === null ? sum : sum + weights[i]),
    0,
  )
  if (!weightSum) return 0
  const weighted = scores.reduce<number>(
    (sum, score, i) => (score === null ? sum : sum + score * weights[i]),
    0,
  )
  return weighted / weightSum
}

export interface WeightedScenario extends ScenarioStats {
  wAvg: number
  rank: number
  /** Positive = moved up vs. the equal-weight order. */
  delta: number
}

/** Scored scenarios by weighted average, highest first; unscored ones follow in set order. */
function byWeightedAverage(stats: ScenarioStats[], weights: Weights) {
  return stats
    .map((s) => ({ ...s, wAvg: weightedAverage(s.scores, weights) }))
    .sort(
      (a, b) => Number(b.hasScores) - Number(a.hasScores) || b.wAvg - a.wAvg || baselineFirst(a, b),
    )
}

/** One set of scenarios ranked by weighted average, with movement vs. its equal-weight order. */
export function weightedRanking(weights: Weights, scenarios: Scenario[]): WeightedScenario[] {
  const stats = scenarios.map(withStats)
  const baseOrder = byWeightedAverage(stats, EQUAL_WEIGHTS).map((s) => s.name)
  return byWeightedAverage(stats, weights).map((s, i) => ({
    ...s,
    rank: i + 1,
    delta: baseOrder.indexOf(s.name) - i,
  }))
}
