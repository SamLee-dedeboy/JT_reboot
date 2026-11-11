// Routes and lookups for the evaluation pages.
import { evaluationTeams } from '../content'

export const findTeam = (teamId: string | undefined) =>
  evaluationTeams.find((team) => team.id === teamId)

export const methodologyPath = (teamId: string) => `/scenarios/evaluation/${teamId}`
