// The futures each evaluation team reports on, in display order.
import { adaptationScenarios, evaluationTeams, tieredOutflowsScenario } from '../content'

export { evaluationTeams }

export const evaluatedScenarios = [...adaptationScenarios, tieredOutflowsScenario]

export const journeyScenarioSlugs = evaluatedScenarios.map((scenario) => scenario.slug)
