// Illustrative voting data for the scenario-ranking wireframes.
// Scores run −5…+5 relative to Business as Usual, which is pinned at 0.
// Tuned so every design has something to show (checked for ties and
// near-zero scores under every preset):
//   - New Green Watershed is the consensus pick: small spread, #1 under every lens.
//   - Delta Tunnel is the split vote (Economy +5, everyone else against): the
//     widest spread, and Economy first flips it above today.
//   - Each "<team> first" lens reorders the middle differently: Ecology first
//     sinks Bolster & Fortify below today, Recreation first lifts Calling on
//     Reserves, Justice first lifts Bolster to #2, Economy first lifts the Tunnel.
import { alpha } from '@mui/material/styles'
import { chart } from '../../theme'

const voting = chart.voting

export interface Team {
  name: string
  color: string
}

export interface Scenario {
  name: string
  color: string
  /** One score per team, in TEAMS order. */
  scores: number[]
}

export type Weights = number[]

const SCORE_MAX = 5
export const WEIGHT_MAX = 3
export const WEIGHT_STEP = 0.5
/** Quick-pick values for the per-team stepper chips (2b). */
export const WEIGHT_CHIPS = [0, 0.5, 1, 2]
export const EQUAL_WEIGHTS: Weights = [1, 1, 1, 1]

export const TEAMS: Team[] = [
  { name: 'Ecology', color: voting.team.ecology },
  { name: 'Recreation', color: voting.team.recreation },
  { name: 'Env. Justice', color: voting.team.environmentalJustice },
  { name: 'Economy', color: voting.team.economy },
]

const SCENARIOS: Scenario[] = [
  {
    name: 'New Green Watershed',
    color: voting.scenario.newGreenWatershed,
    scores: [5, 4, 4, 3],
  },
  {
    name: 'Eco Machine',
    color: voting.scenario.ecoMachine,
    scores: [5, 3, 2, -1],
  },
  {
    name: 'Bolster & Fortify',
    color: voting.scenario.bolsterAndFortify,
    scores: [-3, 1, 4, 4],
  },
  {
    name: 'Calling on Reserves',
    color: voting.scenario.callingOnReserves,
    scores: [1, 4, -2, 0],
  },
  {
    name: 'Delta Tunnel',
    color: voting.scenario.deltaTunnel,
    scores: [-4, -3, -4, 5],
  },
  {
    name: 'Business as Usual',
    color: voting.scenario.businessAsUsual,
    scores: [0, 0, 0, 0],
  },
]

/** Short team names for the "<team> first" preset labels, in TEAMS order. */
const PRESET_TEAM_NAMES = ['Ecology', 'Recreation', 'Justice', 'Economy']
const FIRST_WEIGHT = 2
const OTHERS_WEIGHT = 0.5

/** Equal, plus one "<team> first" lens per team: that team ×2, everyone else ×½. */
export const WEIGHT_PRESETS: { name: string; weights: Weights }[] = [
  { name: 'Equal', weights: EQUAL_WEIGHTS },
  ...PRESET_TEAM_NAMES.map((name, teamIndex) => ({
    name: `${name} first`,
    weights: TEAMS.map((_, i) => (i === teamIndex ? FIRST_WEIGHT : OTHERS_WEIGHT)),
  })),
]

// ---------- formatting / scales ----------

/** Score (−5…+5) → percentage position along a centered track. */
export const toPct = (score: number) => 50 + (score / SCORE_MAX) * 50

/** Signed label with a typographic minus, rounded to one decimal. */
export function fmtScore(value: number): string {
  const rounded = Math.round(value * 10) / 10
  if (rounded === 0) return '0'
  return rounded > 0 ? `+${rounded}` : `−${Math.abs(rounded)}`
}

export const fmtWeight = (weight: number) => (weight === 0.5 ? '½' : `${weight}`)

/** Diverging cell fill: green above baseline, red below, grey at 0. */
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
  total: number
  avg: number
  /** Spread span: left edge and width, both in % of the −5…+5 track. */
  spanLeft: number
  spanWidth: number
}

function withStats(scenario: Scenario): ScenarioStats {
  const total = scenario.scores.reduce((a, b) => a + b, 0)
  const min = Math.min(...scenario.scores)
  const max = Math.max(...scenario.scores)
  return {
    ...scenario,
    total,
    avg: total / scenario.scores.length,
    spanLeft: toPct(min),
    spanWidth: Math.max(2, ((max - min) / SCORE_MAX) * 50),
  }
}

const SCENARIO_STATS: ScenarioStats[] = SCENARIOS.map(withStats)

/** Scenarios ranked by equal-weight total (highest first). */
export const RANKED: (ScenarioStats & { rank: number })[] = [...SCENARIO_STATS]
  .sort((a, b) => b.total - a.total)
  .map((scenario, i) => ({ ...scenario, rank: i + 1 }))

function weightedAverage(scores: number[], weights: Weights): number {
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1
  return scores.reduce((sum, score, i) => sum + score * weights[i], 0) / weightSum
}

export interface WeightedScenario extends ScenarioStats {
  wAvg: number
  rank: number
  /** Positive = moved up vs. the equal-weight order. */
  delta: number
}

/** Scenarios ranked by weighted average, with movement vs. the equal-weight order. */
export function weightedRanking(weights: Weights): WeightedScenario[] {
  const baseOrder = RANKED.map((s) => s.name)
  return SCENARIO_STATS.map((s) => ({ ...s, wAvg: weightedAverage(s.scores, weights) }))
    .sort((a, b) => b.wAvg - a.wAvg)
    .map((s, i) => ({ ...s, rank: i + 1, delta: baseOrder.indexOf(s.name) - i }))
}

/** Rank (1 = best) of every scenario under each preset lens, keyed by scenario name. */
export const PRESET_RANKS: { name: string; ranks: Record<string, number> }[] = WEIGHT_PRESETS.map(
  (preset) => ({
    name: preset.name,
    ranks: Object.fromEntries(weightedRanking(preset.weights).map((s) => [s.name, s.rank])),
  }),
)
