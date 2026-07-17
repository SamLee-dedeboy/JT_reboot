export type NullableNumber = number | null;
export type ValueSeries = NullableNumber[];
export type HistogramBrush = [number, number] | null;

export interface Station {
  station_id: string;
  long_name: string;
  region: string;
  longitude: number;
  latitude: number;
  [key: string]: string | number | null;
}

export interface Scenario {
  key: string;
  label: string;
  stationValues: ValueSeries[];
  regionValues: Record<string, ValueSeries>;
  referenceStationValues?: ValueSeries[];
}

export interface ScenarioDataset {
  dates: string[];
  stations: Station[];
  regions: string[];
  scenarios: Scenario[];
  referenceStationValues?: ValueSeries[];
  units?: string;
}

export interface ScenarioDatasets {
  rmaScenarios: ScenarioDataset;
  rmaSchism: ScenarioDataset;
  tieredOutflows: ScenarioDataset;
}

export type DashboardMode = 'rma-scenarios' | 'rma-schism' | 'tiered-outflows';
export type ValueMode = 'raw' | 'percent';
export type ModelKey = 'rma' | 'schism';
export type RangeMode = 'minmax' | 'p90' | 'iqr';
