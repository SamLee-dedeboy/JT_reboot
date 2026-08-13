export type NullableNumber = number | null
export type ValueSeries = NullableNumber[]
export type HistogramBrush = [number, number] | null

export interface Station {
  station_id: string
  long_name: string
  region: string
  longitude: number
  latitude: number
  [key: string]: string | number | null
}

export interface Scenario {
  key: string
  label: string
  stationValues: ValueSeries[]
  regionValues: Record<string, ValueSeries>
  referenceStationValues?: ValueSeries[]
}

export interface ScenarioDataset {
  dates: string[]
  stations: Station[]
  regions: string[]
  scenarios: Scenario[]
  referenceStationValues?: ValueSeries[]
  units?: string
}

export interface ScenarioDatasets {
  rmaScenarios: ScenarioDataset
  rmaSchism: ScenarioDataset
  tieredOutflows: ScenarioDataset
  schismRuns: ScenarioDataset
}

export type DashboardMode = 'rma-scenarios' | 'rma-schism' | 'tiered-outflows' | 'schism-runs'
export type ValueMode = 'raw' | 'percent'
export type ModelKey = 'rma' | 'schism'
export type RangeMode = 'minmax' | 'p90' | 'iqr'

export type D1641ObjectiveStatus =
  | 'calculated_exceedance'
  | 'not_computable_high_tide_data_required'
  | 'not_computable_station_not_in_scenario_export'

export interface D1641Objective {
  objective: string
  status: D1641ObjectiveStatus
  start?: string
  end?: string
}

export interface D1641Regulation {
  objective: string
  metric: string
  windowDays: string
  threshold: number
  start: string
  end: string
}

export interface D1641Judgment {
  objective: string
  metric: string
  windowDays: string
  value: number
  threshold: number
  evaluationDate: string
}

export interface D1641Metric {
  objective: string
  metric: string
  windowDays: string
  value: number
  threshold?: number
}

export interface D1641StationCompliance {
  d1641Id: string
  fullName: string
  regulations: D1641Regulation[]
  judgments: Record<string, D1641Judgment>
  metrics: Record<string, D1641Metric>
  objectives: D1641Objective[]
}

export interface D1641ScenarioCompliance {
  stations: Record<string, D1641StationCompliance>
}

export interface D1641Dataset {
  source: string
  generatedFrom: string
  scenarios: Record<string, D1641ScenarioCompliance>
}
