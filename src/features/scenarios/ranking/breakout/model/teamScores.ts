// Each team's score for each scenario as the breakout table's first row shows it
// when it opens: the whole place, the headline period, today's climate. The overall
// ranking (1A) reads these, so the one number both views share is the same number:
// a value we inferred is not a ballot there, just as the table shows it as
// "awaiting subteam" rather than a number.
import type { TeamKey } from '../../../../../internal/rank-visualization/data'
import { valueAt } from '../../../../../internal/rank-visualization/drilldown/cellValue'
import { ANY } from '../../../../../internal/rank-visualization/drilldown/model'
import type { ScenarioKey } from '../../../../../internal/rank-visualization/drilldown/model'
import { BREAKOUT_TREE } from './rankingModel'

/** The team's published score, or null where the table has none or is awaiting the subteam. */
export function publishedTeamScore(team: TeamKey, scenario: ScenarioKey): number | null {
  const root = BREAKOUT_TREE.find((node) => node.team === team)
  if (!root) return null
  const cell = valueAt({ criterion: root.id, scenario, place: ANY, period: ANY })
  return cell.value === null || cell.inferred ? null : cell.value
}
