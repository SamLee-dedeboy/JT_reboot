// The shape of every team file in this folder. Each file holds one criterion: its
// words, its rows, then its numbers by climate and scenario.
//
//   text          what the table and its info cards say about the criterion as a whole
//   rows          the By criterion table's rows: names, units, notes, sources, info cards
//   outflowRows   the same for the tiered outflow table
//   current       today's sea level, one entry per scenario
//   seaLevelRise  the same scenarios with sea level rise ('sameAsCurrent' repeats today's)
//
// Each scenario entry holds what that scenario shows in the table:
//
//   takeaway     the card a score cell opens
//   scores       the −5…+5 rows, by row id
//   measures     the rows beneath them (acres, dollars, shares of days), by row id
//   ranks        a measure's own −5…+5 rank, shown beside its value
//   steps        a qualitative row's arrows: 2 is two arrows up, −1 is one arrow down
//   conditionsMet  the condition rows this scenario puts in place
//
// A value is one number, or a table of place, then period:
//
//   'econ-revenue-land': -281295055
//   'rec-salinity-dayUse': { delta: { run: 0.277, wet: 0.2792 }, suisun: { run: 0.801 } }
//
// `*` is all places or the whole period. null means the team has not published it yet.
//
// Baselines (`bau` Business as Usual, `csbau` CalSim's Business as Usual, `hist` the
// Historical Baseline of the outflow runs) list measures only: every one of their
// scores is 0 and is filled in for you.
import type { ClimateRun, CriterionNode, Facet, ScenarioKey, Source } from '../model/criteria'
import type { TeamKey } from '../model/teams'

export type Cell = number | null

/** One number, or place → period → number. */
export type Value = Cell | Record<string, Record<string, Cell>>

/** Text between ** ** is drawn in the team's colour; ++name++ marks a scenario name. */
export interface ScenarioTakeaway {
  lead: string
  points?: { label: string; text: string }[]
}

/** A metric's takeaway as its info card lays it out: a lead, what follows, any list. */
export interface MetricTakeaway {
  lead: string
  details?: string[]
  rows?: [string, string][]
}

/** A metric's info card: what it measures, how it is computed and scored. */
export interface MetricInfo {
  measures?: string
  computed?: string
  scored?: string
  scale?: {
    step?: string
    axis: string
    lowerBetter?: boolean
    bands?: string[]
    ends?: string[]
    scores?: number[]
  }
  /** Where results land on the scale: [name, the amount that earns it, its score]. */
  scoreRows?: { heading: string; rows: [string, string, number][] }
  takeaway?: MetricTakeaway
}

/** A criterion score's info card: the metrics it combines and how. */
export interface CriterionInfo {
  metrics: string[]
  combine: string
  outside?: string
}

export interface TeamText {
  /** The points under "Criterion takeaway". */
  takeaways?: string[]
  /** The "Caveats and Clarifications" notes. "Keyword: the rest" opens from its keyword. */
  caveats?: string[]
  /** The criterion score's info card. */
  criterion: CriterionInfo
  /** The TIME PERIOD info card: why these periods. */
  periodWhy?: string
  /** The months behind each period key, where this team's differ from the usual ones. */
  periodMonths?: Record<string, string>
  /** The PLACE info card, above the map. */
  placeWhy?: string
  /** A place's name on its tab, where it differs from the row's own facet label. */
  placeNames?: Record<string, string>
}

/** A table row without its numbers: those are under each scenario. */
export type Row = Omit<
  CriterionNode,
  'id' | 'team' | 'values' | 'ranks' | 'steps' | 'ngwLevels' | 'slr' | 'metBy' | 'children'
> & {
  id: string
  /** The row's note, sources and facets with sea level rise, where it has a run of its own. */
  seaLevelRise?: Omit<ClimateRun, 'values' | 'ranks'>
  /** The metric's info card. */
  info?: MetricInfo
  /** A condition under a qualitative row; `conditionsMet` says which scenarios put it in place. */
  condition?: true
  children?: Row[]
}

export interface ScenarioEntry {
  takeaway?: ScenarioTakeaway
  /** New Green Watershed only: the takeaway at 25%, 50% and 100% wetland. */
  wetlandTakeaways?: ScenarioTakeaway[]
  scores?: Record<string, Value>
  measures?: Record<string, Value>
  ranks?: Record<string, Value>
  steps?: Record<string, number>
  conditionsMet?: string[]
  /** New Green Watershed only: the row at 25% and 100% wetland; its own value is 50%. */
  wetlandLevels?: Record<string, { wetland25: Cell; wetland100: Cell }>
}

export type ScenarioEntries = Partial<Record<ScenarioKey, ScenarioEntry>>

export interface TeamData {
  team: TeamKey
  /** Whether the team's sea-level-rise results are in: 'pending' shows a notice. */
  seaLevelRiseStatus?: 'loaded' | 'pending'
  text: TeamText
  rows: Row
  outflowRows: Row
  current: ScenarioEntries
  seaLevelRise: ScenarioEntries | 'sameAsCurrent'
}

export type { Facet, Source }
