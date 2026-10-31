export type RestorationLevel = 'min' | 'med' | 'max'
export type PriorityLandscape = 'forest' | 'meadow' | 'floodplain'
export type Landscape = 'forests' | 'meadows' | 'floodplains'

export type WatershedOutcomeMetric =
  | 'et'
  | 'runoff'
  | 'gwRecharge'
  | 'forestCover'
  | 'meadowWetland'
  | 'riparian'
  | 'marsh'
  | 'carbonAnnual'
  | 'carbonVegetation'

/** One scenario's low and high total for one metric (the workbook's TABLE 2). */
export interface WatershedOutcome {
  level: RestorationLevel
  priority: PriorityLandscape
  metric: WatershedOutcomeMetric
  low: number
  high: number
}
