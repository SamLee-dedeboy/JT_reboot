// Routes and lookups for the evaluation pages.
import { evaluationTeams } from '../content'

export type EvaluationTeam = (typeof evaluationTeams)[number]

export const findTeam = (teamId: string | undefined) =>
  evaluationTeams.find((team) => team.id === teamId)

export const methodologyPath = (teamId: string) => `/scenarios/evaluation/${teamId}`
