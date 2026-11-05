// How to read a team's values file.
//
// Each row is one line beneath a metric in the By criterion table, with a comment giving
// its metric, its name and its unit:
//
//   values        each scenario at today's sea level (under `outflow`, each outflow run)
//   seaLevelRise  each scenario with sea level rise
//   steps         a qualitative row's arrows: 2 is two arrows up, −1 is one arrow down
//   ngwLevels     New Green Watershed at 25%, 50% and 100% wetland
//
// A scenario's value is one number when it has one value, or a table of place, then period:
//
//   ngw: 80000
//   ngw: { delta: { run: 0.12, wet: 0.09, dry: 0.15 }, suisun: { run: 0.2, wet: 0.1, dry: 0.3 } }
//
// `*` means no particular place or period. Scenario names are listed in ../scores.ts, and
// `csbau` is CalSim's own Business as Usual, the baseline for Calling on Reserves and A Tunnel.
//
// These are the numbers as stored. Where the table reads as a difference from Business as
// Usual, it works that out from them, so a share here can differ from the one on screen.

export type Cell = number | null

/** One number, or place → period → number. */
export type SeriesValue = Cell | Record<string, Record<string, Cell>>

export type ScenarioValues = Record<string, SeriesValue>

export interface MeasureRow {
  values?: ScenarioValues
  seaLevelRise?: ScenarioValues
  steps?: Record<string, number>
  ngwLevels?: [number, number, number]
}

export interface TeamValues {
  /** The adaptation scenarios. */
  adaptation: Record<string, MeasureRow>
  /** The tiered outflow runs. */
  outflow: Record<string, MeasureRow>
}
