// Shared pieces of the breakout table that are not components: the point shape,
// the fade for switched-off scenarios and the axis for an entity block drawn as bars.
import type { ScenarioKey } from './criteria'

export interface Point {
  scenario: ScenarioKey
  period: string
  value: number | null
  why: string
}

/** A scenario that is switched off: kept in place, faded. */
export const FADED = 0.2
