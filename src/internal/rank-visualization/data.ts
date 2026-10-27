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
//     its two published metric ranks. EJ's Calling on Reserves and A Tunnel are
//     marked pending by their subteam and carry stand-ins here. None of these are
//     the subteams' own numbers. Recreation's column is its own score (26 Oct 2026).
// Only the six adaptation scenarios are shown; the tiered outflow runs use a
// different increment and are not comparable with them.
import { alpha } from '@mui/material/styles'
import { chart } from '../../theme'

const voting = chart.voting

/** Stable id per subteam: keys icons and palettes, independent of display name. */
export type TeamKey = 'ecology' | 'recreation' | 'environmentalJustice' | 'economy' | 'ecoCultural'

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
  /** Per-team flags: true where the score is INFERRED rather than the subteam's own. */
  provisional: boolean[]
}

export type Weights = number[]

const SCORE_MAX = 5
export const WEIGHT_MAX = 3
export const WEIGHT_STEP = 0.5
/** Quick-pick values for the per-team stepper chips (2b). */
export const WEIGHT_CHIPS = [0, 0.5, 1, 2]
export const EQUAL_WEIGHTS: Weights = [1, 1, 1, 1, 1]

export const TEAMS: Team[] = [
  { key: 'ecology', name: 'Ecology', color: voting.team.ecology },
  { key: 'recreation', name: 'Recreation', color: voting.team.recreation },
  { key: 'environmentalJustice', name: 'Env. Justice', color: voting.team.environmentalJustice },
  { key: 'economy', name: 'Economy', color: voting.team.economy },
  { key: 'ecoCultural', name: 'Eco-cultural', color: voting.team.ecoCultural },
]

/** The six adaptation scenarios, in declaration order; drilldown/model.ts keys off it. */
export const SCENARIOS: Scenario[] = [
  {
    // Ecology: landscape +5 and food web +4 (NGW2). EJ: the only scenario above 0.
    // Economy: −4 at the 50/50 primary sub-scenario (−3 to −5 across intensities).
    // Recreation: −0.375, its own score (26 Oct 2026): salinity and temperature,
    // today and with sea level rise, averaged; the Suisun Marsh salinity losses
    // outweigh Central Delta gains. Restoration and its economy (+5 each) are scored
    // apart from it.
    name: 'New Green Watershed',
    color: voting.scenario.newGreenWatershed,
    scores: [4.5, -0.375, 1, -4, 4],
    provisional: [true, false, false, false, false],
  },
  {
    // Ecology: landscape +3, food web +1. EJ fell from +1 to 0 when the Oct 2026
    // slides dropped the two seasonal drinking-water scores from its average.
    // Recreation: the same activity scores as NGW, so the same −0.375.
    name: 'Eco Machine',
    color: voting.scenario.ecoMachine,
    scores: [2, -0.375, 0, 0, 2],
    provisional: [true, false, false, false, false],
  },
  {
    // Recreation: 0 on every activity, Delta-wide.
    name: 'Bolster & Fortify',
    color: voting.scenario.bolsterAndFortify,
    scores: [0, 0, 0, -1, 0],
    provisional: [true, false, false, false, false],
  },
  {
    // Economy: 0 in both water years and with sea level rise (v16, 25 Oct 2026),
    // against RMA's own base run for this scenario.
    // Recreation: +0.0625 against CalSim's Business as Usual (26 Oct 2026), the only
    // scenario above 0; it had been −2.5 against RMA's.
    // EJ*: now "pending" for want of a water-age result; −1 is the mean of the two
    // metrics it has (drinking water −2, flood risk 0), which is also what the
    // Sept report published.
    name: 'Calling on Reserves',
    color: voting.scenario.callingOnReserves,
    scores: [0, 0.0625, -1, 0, 1],
    provisional: [true, false, true, false, false],
  },
  {
    // Unscored almost everywhere, and it went backwards: the Oct 2026 slides
    // withdrew the drinking-water numbers the Sept report published for it.
    // Recreation: −0.125 against CalSim's Business as Usual (26 Oct 2026); it had
    // been −4 against RMA's. EJ*: mean of the four metric scores the Sept report gave
    // (−3, −5, 0, +1). Economy: −1 (v16, 25 Oct 2026), from a dry-year salinity
    // loss of about $27,000, mostly in the Central Delta; −1 with sea level rise too.
    name: 'A Tunnel',
    color: voting.scenario.deltaTunnel,
    scores: [0, -0.125, -2, -1, -2],
    provisional: [true, false, true, false, false],
  },
  {
    name: 'Business as Usual',
    color: voting.scenario.businessAsUsual,
    scores: [0, 0, 0, 0, 0],
    provisional: [true, false, false, false, false],
  },
]

/** Short team names for the "<team> first" preset labels, in TEAMS order. */
const PRESET_TEAM_NAMES = ['Ecology', 'Recreation', 'Justice', 'Economy', 'Eco-cultural']
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
  // Unrounded, as the subteams give them (0.0625 stays 0.0625); four places only
  // trims floating-point noise from weighted means.
  const rounded = Math.round(value * 10000) / 10000
  if (rounded === 0) return '0'
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
  const min = Math.min(...values)
  const max = Math.max(...values)
  return {
    ...scenario,
    total,
    avg: values.length ? total / values.length : 0,
    spanLeft: toPct(min),
    spanWidth: Math.max(2, ((max - min) / SCORE_MAX) * 50),
  }
}

const SCENARIO_STATS: ScenarioStats[] = SCENARIOS.map(withStats)

/** Scenarios ranked by equal-weight total (highest first). */
export const RANKED: (ScenarioStats & { rank: number })[] = [...SCENARIO_STATS]
  .sort((a, b) => b.total - a.total)
  .map((scenario, i) => ({ ...scenario, rank: i + 1 }))

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
