// Each team's score for each scenario as the breakout table's first row shows it: the
// whole place, the headline period. Every ranking reads these, so a score is held once,
// in ranking/scores.ts, and changing it there changes the table and the rankings together.
// A value we inferred is not a ballot, just as the table shows it as "awaiting subteam"
// rather than a number.
import {
  EQUAL_WEIGHTS,
  TEAMS,
  WEIGHT_PRESETS,
  weightedRanking,
} from '../../../../../internal/rank-visualization/data'
import type { Scenario, TeamKey } from '../../../../../internal/rank-visualization/data'
import { valueAt } from '../../../../../internal/rank-visualization/drilldown/cellValue'
import { ANY, DRILL_SCENARIOS } from '../../../../../internal/rank-visualization/drilldown/model'
import type {
  Climate,
  ScenarioKey,
} from '../../../../../internal/rank-visualization/drilldown/model'
import { BREAKOUT_TREE } from './rankingModel'

/** The team's published score, or null where the table has none or is awaiting the subteam. */
export function publishedTeamScore(
  team: TeamKey,
  scenario: ScenarioKey,
  climate: Climate = 'current',
): number | null {
  const root = BREAKOUT_TREE.find((node) => node.team === team)
  if (!root) return null
  const cell = valueAt({
    criterion: root.id,
    scenario,
    place: ANY,
    period: ANY,
    climate,
  })
  return cell.value === null || cell.inferred ? null : cell.value
}

const scenariosIn = (climate: Climate): Scenario[] =>
  DRILL_SCENARIOS.map(({ key, name, color }) => ({
    name,
    color,
    scores: TEAMS.map((team) => publishedTeamScore(team.key, key, climate)),
    provisional: TEAMS.map(() => false),
  }))

/** The six adaptation scenarios with today's sea level, against today's Business as Usual. */
export const SCENARIOS = scenariosIn('current')

/** The same six with sea level rise, each read against that run's own Business as Usual. */
export const SLR_SCENARIOS = scenariosIn('slr')

/** The adaptation scenarios at equal weights, highest first. */
export const RANKED = weightedRanking(EQUAL_WEIGHTS, SCENARIOS)

/** Rank (1 = best) of every scenario under each preset lens, keyed by scenario name. */
export const PRESET_RANKS: { name: string; ranks: Record<string, number> }[] = WEIGHT_PRESETS.map(
  (preset) => ({
    name: preset.name,
    ranks: Object.fromEntries(
      weightedRanking(preset.weights, SCENARIOS).map((s) => [s.name, s.rank]),
    ),
  }),
)
