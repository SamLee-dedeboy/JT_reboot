// Identity colors, labels and number formats shared by the upstream restoration charts.
import * as d3 from 'd3'
import type { Landscape, PriorityLandscape, RestorationLevel } from './types'

export const RESTORATION_LEVELS: RestorationLevel[] = ['min', 'med', 'max']
export const PRIORITIES: PriorityLandscape[] = ['forest', 'meadow', 'floodplain']
export const LANDSCAPES: Landscape[] = ['forests', 'meadows', 'floodplains']

export const LEVEL_LABELS: Record<RestorationLevel, string> = {
  min: 'Minimal',
  med: 'Medium',
  max: 'Maximum',
}

export const HABITAT_META: Record<
  Landscape,
  { label: string; priority: PriorityLandscape; baseColor: string; shadeRange: [string, string] }
> = {
  forests: {
    label: 'Forests',
    priority: 'forest',
    baseColor: '#4fb06f',
    shadeRange: ['#b7d6bd', '#4fb06f'],
  },
  meadows: {
    label: 'Meadows',
    priority: 'meadow',
    baseColor: '#d8bf42',
    shadeRange: ['#eee59a', '#d8bf42'],
  },
  floodplains: {
    label: 'Floodplains',
    priority: 'floodplain',
    baseColor: '#62b6d9',
    shadeRange: ['#b9ddec', '#62b6d9'],
  },
}

export const landscapeOf = (priority: PriorityLandscape): Landscape => `${priority}s`

/** A prioritized landscape's color, lighter for minimal and full for maximum restoration. */
export function levelShade(priority: PriorityLandscape, level: RestorationLevel) {
  const [light, full] = HABITAT_META[landscapeOf(priority)].shadeRange
  return d3.interpolateRgb(light, full)(RESTORATION_LEVELS.indexOf(level) / 2)
}

export const formatNumber = (value: number) => d3.format(',.0f')(value)

/** Three significant figures with a unit suffix: 7,020,000 → 7.02M, 115,864 → 116K. */
export const formatCompact = (value: number) =>
  d3.format('.3~s')(value).replace('k', 'K').replace('G', 'B')

export function formatValue(value: number, unit = '') {
  const absolute = Math.abs(value)
  const formatted =
    absolute >= 1000
      ? d3.format('.3~s')(value).replace('G', 'B')
      : absolute >= 10
        ? d3.format(',.1f')(value)
        : d3.format(',.2~f')(value)
  return unit ? `${formatted} ${unit}` : formatted
}
