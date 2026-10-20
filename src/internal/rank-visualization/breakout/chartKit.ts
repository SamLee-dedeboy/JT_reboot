// Shared pieces of the breakout charts that are not components: the point shape,
// the fade for switched-off scenarios, the period shades and which periods to draw.
import type { Theme } from '@mui/material'
import type { CSSProperties } from 'react'
import { ANY } from '../drilldown/model'
import type { CriterionNode, Facet, ScenarioKey } from '../drilldown/model'

export interface Point {
  scenario: ScenarioKey
  period: string
  value: number | null
  why: string
}

/** A scenario that is switched off: kept in place, faded. */
export const FADED = 0.2

/** Neutral shades for the periods inside a group: lightest first. */
export function periodShade(theme: Theme, index: number): string {
  const shades = [theme.palette.base[50], theme.palette.base[200], theme.palette.base[400]]
  return shades[index] ?? theme.palette.base[300]
}

/**
 * The periods a measure is drawn across. A chosen period is drawn alone; with none
 * chosen, every period the measure has a value for gets its own bar.
 */
export function periodGroups(
  node: CriterionNode,
  period: string,
  hasValue: (key: string) => boolean,
): Facet[] {
  const real = node.periods.filter((facet) => facet.key !== ANY)
  if (period !== ANY) return [real.find((f) => f.key === period) ?? { key: period, label: '' }]
  if (real.length < 2) return [{ key: ANY, label: '' }]
  const held = real.filter((facet) => hasValue(facet.key))
  return held.length > 0 ? held : real
}

/**
 * A theme typography variant as SVG text style, so chart labels use the same
 * tokens as the rest of the page instead of sizes set by hand.
 */
export function svgType(theme: Theme, variant: 'chartLabel' | 'chartValueLarge'): CSSProperties {
  return theme.typography[variant] as CSSProperties
}

/**
 * Short scenario codes for chart axes, where a dozen small charts cannot each
 * spell the names out. The legend gives the key; each bar's tooltip the full name.
 */
export const SCENARIO_SHORT: Record<ScenarioKey, string> = {
  bau: 'BAU',
  em: 'ECO',
  ngw: 'NGW',
  bf: 'B&F',
  cor: 'COR',
  tunnel: 'TUN',
}
