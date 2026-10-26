// Per-team identity across the scenario pages: icon key, short label, and team color.
import { chart } from '../../theme'
import type { TeamKey } from '../../ui/TeamIcon'
import type { evaluationTeams } from './content'

export type EvaluationTeamId = (typeof evaluationTeams)[number]['id']

export const teamStyle: Record<
  EvaluationTeamId,
  { icon: TeamKey; shortLabel: string; color: string }
> = {
  ecology: { icon: 'ecology', shortLabel: 'Ecology', color: chart.voting.team.ecology },
  'environmental-justice': {
    icon: 'environmentalJustice',
    shortLabel: 'Env. Justice',
    color: chart.voting.team.environmentalJustice,
  },
  'ecocultural-restoration': {
    icon: 'ecoCultural',
    shortLabel: 'Eco-cultural',
    color: chart.voting.team.ecoCultural,
  },
  recreation: { icon: 'recreation', shortLabel: 'Recreation', color: chart.voting.team.recreation },
  economy: { icon: 'economy', shortLabel: 'Economy', color: chart.voting.team.economy },
}
