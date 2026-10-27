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
export { criterionStories } from './criterionStories'
export type { CriterionStory, StoryTable } from './criterionStories'
export { criterionReferences } from './criterionReferences'
export { criterionRegions } from './criterionRegions'
export type { CriterionRegions } from './criterionRegions'
export { teamReports } from './evaluationReports'
export type { ScenarioFinding, TeamReport } from './evaluationReports'
export type { ChapterRole, ScenarioChapter, ScenarioContent } from './types'
export { chapterRoles, storyInReadingOrder } from './chapterOrder'
export type { OrderedChapter } from './chapterOrder'

export const scenarios = [baselineScenario, tieredOutflowsScenario, ...adaptationScenarios]

export const scenarioBySlug = Object.fromEntries(
  scenarios.map((scenario) => [scenario.slug, scenario]),
)
