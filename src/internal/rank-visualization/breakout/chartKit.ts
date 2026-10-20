// Shared pieces of the breakout table that are not components: the point shape,
// the fade for switched-off scenarios and the axis for an entity block drawn as bars.
import type { ScenarioKey } from '../drilldown/model'

export interface Point {
  scenario: ScenarioKey
  period: string
  value: number | null
  why: string
}

/** A scenario that is switched off: kept in place, faded. */
export const FADED = 0.2

/**
 * A bar chart's axis: the values' extent widened by one round step at each end,
 * so 0.1 – 0.4 draws on 0 – 0.5. It never crosses zero that the values do not,
 * and a proportion never runs past 100% (`ceiling` 1).
 */
export function relaxedExtent(values: number[], ceiling?: number): { lo: number; hi: number } {
  if (values.length === 0) return { lo: 0, hi: 1 }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || Math.abs(max) || 1
  const magnitude = 10 ** Math.floor(Math.log10(span))
  const ratio = span / magnitude
  const step = (ratio >= 5 ? 2 : ratio >= 2.5 ? 1 : ratio >= 1.2 ? 0.5 : 0.2) * magnitude
  const lo = Math.floor(min / step) * step - step
  const hi = Math.ceil(max / step) * step + step
  const capped = ceiling !== undefined && max <= ceiling ? Math.min(ceiling, hi) : hi
  const out = { lo: min >= 0 ? Math.max(0, lo) : lo, hi: max <= 0 ? Math.min(0, capped) : capped }
  // All zeros: an axis one step wide, so the bars sit at its start.
  return out.hi > out.lo ? out : { lo: out.lo, hi: out.lo + step }
}
