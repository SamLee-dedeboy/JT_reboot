import { excludedRegionalPatternIds } from './regionalPlaceContent'
import type { RegionalPattern, RegionalPlace } from './regionalSummaryData'

/* Date scale shared by the kiosk pattern timeline and the results-page stacked timeline. */

export const valueFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })
const defaultQuarterTicks = [
  ['2018-10-01', 'Oct 2018'],
  ['2019-01-01', 'Jan 2019'],
  ['2019-04-01', 'Apr 2019'],
  ['2019-07-01', 'Jul 2019'],
  ['2019-10-01', 'Oct 2019'],
  ['2020-01-01', 'Jan 2020'],
  ['2020-04-01', 'Apr 2020'],
  ['2020-07-01', 'Jul 2020'],
  ['2020-10-01', 'Oct 2020'],
] as const

const outflowQuarterTicks = [
  ['2020-08-01', 'Aug 2020'],
  ['2020-10-01', 'Oct 2020'],
  ['2021-01-01', 'Jan 2021'],
  ['2021-04-01', 'Apr 2021'],
  ['2021-07-01', 'Jul 2021'],
  ['2021-10-01', 'Oct 2021'],
  ['2022-01-01', 'Jan 2022'],
] as const

export interface TimelineDomain {
  start: number
  end: number
  ticks: readonly (readonly [string, string])[]
  isOutflowComparison: boolean
}

export function timelineDomain(scenarioSlug: string): TimelineDomain {
  const isOutflowComparison = scenarioSlug === 'alternative-delta-outflows'
  return {
    start: Date.parse(isOutflowComparison ? '2020-08-01T00:00:00Z' : '2018-10-01T00:00:00Z'),
    end: Date.parse(isOutflowComparison ? '2022-01-01T00:00:00Z' : '2020-11-29T00:00:00Z'),
    ticks: isOutflowComparison ? outflowQuarterTicks : defaultQuarterTicks,
    isOutflowComparison,
  }
}

export function datedEvents(place: RegionalPlace) {
  return place.patterns
    .filter(
      (pattern) =>
        pattern.startDate &&
        pattern.endDate &&
        pattern.candidateType !== 'threshold_consequence' &&
        !excludedRegionalPatternIds.has(pattern.id),
    )
    .toSorted((left, right) => (left.startDate ?? '').localeCompare(right.startDate ?? ''))
}

export function datePosition(date: string, domain: TimelineDomain) {
  const value = Date.parse(`${date}T00:00:00Z`)
  return Math.min(100, Math.max(0, ((value - domain.start) / (domain.end - domain.start)) * 100))
}

export function eventPlacement(pattern: RegionalPattern, domain: TimelineDomain) {
  const left = datePosition(pattern.startDate as string, domain)
  return {
    left,
    width: Math.max(0.7, datePosition(pattern.endDate as string, domain) - left),
  }
}
