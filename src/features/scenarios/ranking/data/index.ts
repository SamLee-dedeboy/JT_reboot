// The five criteria's data files, and the lookups the table and its cards read.
import type { ScenarioKey } from '../model/criteria'
import type { TeamKey } from '../model/teams'
import { ECO_CULTURAL } from './ecoCultural'
import { ECOLOGY } from './ecology'
import { ECONOMY } from './economy'
import { ENVIRONMENTAL_JUSTICE } from './environmentalJustice'
import { RECREATION } from './recreation'
import type { ScenarioTakeaway, TeamData, TeamText } from './types'

export const TEAM_DATA: Record<TeamKey, TeamData> = {
  ecology: ECOLOGY,
  recreation: RECREATION,
  environmentalJustice: ENVIRONMENTAL_JUSTICE,
  economy: ECONOMY,
  ecoCultural: ECO_CULTURAL,
}

/** The criterion's own words: takeaways, caveats, info cards. */
export const teamText = (team: TeamKey): TeamText => TEAM_DATA[team].text

/** A team's takeaway for one scenario, the card its score cells open. */
export const scenarioTakeaway = (team: TeamKey, scenario: ScenarioKey) =>
  TEAM_DATA[team].current[scenario]?.takeaway

/** New Green Watershed's takeaway at 25%, 50% or 100% wetland (level 0, 1 or 2). */
export const wetlandTakeaway = (team: TeamKey, level: number): ScenarioTakeaway | undefined =>
  TEAM_DATA[team].current.ngw?.wetlandTakeaways?.[level]

export type * from './types'
