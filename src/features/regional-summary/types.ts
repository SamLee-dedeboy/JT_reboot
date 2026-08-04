export const SCENARIOS = [
  'A Tunnel',
  'Bolster & Fortify',
  'Calling on Reserves',
  'Eco Machine',
  'New Green Watershed',
] as const

export type RegionalScenario = (typeof SCENARIOS)[number]

export const DISABLED_SCENARIOS: readonly RegionalScenario[] = ['A Tunnel']

export type ComparisonFilterMode = 'either' | 'both'

export interface ComparisonFilter {
  mode: ComparisonFilterMode
  showUsCm: boolean
  showPercent: boolean
  minimumUsCm: number
  minimumPercent: number
  startMonth: string | null
  endMonth: string | null
}

export interface SelectedComparisonPeriod {
  comparisonId: string
  direction: 'saltier' | 'fresher'
  endDate: string
  place: string
  startDate: string
}

export interface SelectedRegionTimeline {
  periods: SelectedComparisonPeriod[]
  place: string
}
