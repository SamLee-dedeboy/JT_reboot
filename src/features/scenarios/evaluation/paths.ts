// Routes and lookups for the evaluation pages.
import { evaluationTeams, journeyScenarioSlugs } from './scenarioOrder'

export type EvaluationTeam = (typeof evaluationTeams)[number]

export const findTeam = (teamId: string | undefined) =>
  evaluationTeams.find((team) => team.id === teamId)

export const methodologyPath = (teamId: string) => `/scenarios/evaluation/${teamId}`

export const teamResultsPath = (slug: string, teamId: string) =>
  `/scenarios/${slug}/results/${teamId}`

export const isEvaluatedScenario = (slug: string | undefined) =>
  !!slug && (journeyScenarioSlugs as readonly string[]).includes(slug)
