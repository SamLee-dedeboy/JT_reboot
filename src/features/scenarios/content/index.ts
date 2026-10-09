import { adaptationScenarios } from './adaptationScenarios'
import { baselineScenario } from './baseline'
import { tieredOutflowsScenario } from './tieredOutflows'

export { adaptationScenarios } from './adaptationScenarios'
export {
  baselineBackgroundChapters,
  baselineKeyTerms,
  baselineScenario,
  keyParametersIntroduction,
} from './baseline'
export {
  evaluationTeams,
  outflowResultVariations,
  resultFamilies,
  resultsOverviewSections,
  slrScenarioSlugs,
} from './results'
export { tieredOutflowsScenario } from './tieredOutflows'
export type { ScenarioChapter, ScenarioContent } from './types'

export const scenarios = [baselineScenario, tieredOutflowsScenario, ...adaptationScenarios]

export const scenarioBySlug = Object.fromEntries(
  scenarios.map((scenario) => [scenario.slug, scenario]),
)
