// Every scenario the site tells, one file each in the shape of ./types: the baseline,
// the tiered outflows, and the five adaptation scenarios.
import { aTunnel } from './aTunnel'
import { baseline } from './baseline'
import { bolsterAndFortify } from './bolsterAndFortify'
import { callingOnReserves } from './callingOnReserves'
import { ecoMachine } from './ecoMachine'
import { newGreenWatershed } from './newGreenWatershed'
import { tieredOutflows } from './tieredOutflows'
import type { ScenarioContent } from './types'

export { baseline, tieredOutflows }

/** The adaptation scenarios, in the site's order. */
export const adaptationScenarios: ScenarioContent[] = [
  ecoMachine,
  newGreenWatershed,
  callingOnReserves,
  bolsterAndFortify,
  aTunnel,
]

export const scenarios = [baseline, tieredOutflows, ...adaptationScenarios]

export const scenarioBySlug = Object.fromEntries(
  scenarios.map((scenario) => [scenario.slug, scenario]),
)

/** The adaptation scenarios that were also modeled with sea-level rise. */
export const slrScenarioSlugs = [
  'eco-machine',
  'new-green-watershed',
  'bolster-and-fortify',
] as const

export type { ChapterRole, ScenarioChapter, ScenarioContent } from './types'
export { chapterRoles, storyInReadingOrder } from './chapterOrder'
export type { OrderedChapter } from './chapterOrder'
