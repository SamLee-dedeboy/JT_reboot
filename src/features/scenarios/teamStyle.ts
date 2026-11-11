// Per-team identity across the scenario pages, keyed by the team's URL slug: icon key,
// short label and team color. Names come from src/content/names.ts.
import { chart } from '../../theme'
import { TEAM_NAMES } from '../../content/names'
import type { TeamKey } from '../../content/names'
import type { evaluationTeams } from './content'

export type EvaluationTeamId = (typeof evaluationTeams)[number]['id']

export const teamStyle = Object.fromEntries(
  Object.values(TEAM_NAMES).map((team) => [
    team.slug,
    { icon: team.key, shortLabel: team.shortName, color: chart.voting.team[team.key] },
  ]),
) as Record<EvaluationTeamId, { icon: TeamKey; shortLabel: string; color: string }>
