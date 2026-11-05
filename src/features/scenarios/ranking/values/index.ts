// One file per team, each holding that team's measured values.
import type { TeamKey } from '../../../../internal/rank-visualization/data'
import { ECO_CULTURAL_VALUES } from './ecoCultural'
import { ECOLOGY_VALUES } from './ecology'
import { ECONOMY_VALUES } from './economy'
import { ENVIRONMENTAL_JUSTICE_VALUES } from './environmentalJustice'
import { RECREATION_VALUES } from './recreation'
import type { TeamValues } from './types'

export const TEAM_VALUES: Record<TeamKey, TeamValues> = {
  ecology: ECOLOGY_VALUES,
  recreation: RECREATION_VALUES,
  environmentalJustice: ENVIRONMENTAL_JUSTICE_VALUES,
  economy: ECONOMY_VALUES,
  ecoCultural: ECO_CULTURAL_VALUES,
}
