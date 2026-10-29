// The breakout table's outflow tab: the same five trees as ./rankingModel.ts, for
// the three SCHISM tiered outflow runs (15 Historic Baseline, 16 +30% outflow, 17
// −10% outflow; Oct 2020 – Jan 2022). Every team reads its outflow runs against the
// Historic Baseline, never against Business as Usual, so these rows sit in their
// own tree under `of-` ids and are never mixed with the adaptation scenarios.
//
// What each team has published for them (Oct 2026 reports and data):
//   Ecology      suitable days by region for five species; no rank, no score
//   Recreation   every activity's score and days over its threshold (workbooks);
//                no criterion score. Each stress row is the mean of its
//                activities, as the team scores the adaptations (ours, marked)
//   EJ           drinking-water scores and exceedances; the criterion score
//   Economy      nothing yet ("not shown in the present analysis")
//   Eco-cultural one overall score
// Anything not yet published is `forthcoming`; a metric the runs cannot move
// (they change no landscape) is not applicable.
import type { TeamKey } from '../../../../../internal/rank-visualization/data'
import {
  ECOLOGY_REGIONS,
  ECOLOGY_SPECIES,
} from '../../../../../internal/rank-visualization/drilldown/ecologyNiche'
import type {
  EcologyRegionKey,
  EcologySpeciesKey,
} from '../../../../../internal/rank-visualization/drilldown/ecologyNiche'
import {
  ANY,
  OUTFLOW_KEYS,
  sliceKey,
} from '../../../../../internal/rank-visualization/drilldown/model'
import type {
  CriterionNode,
  Facet,
  ScenarioKey,
  SliceValues,
  Source,
} from '../../../../../internal/rank-visualization/drilldown/model'
import {
  REC_OUTFLOW_SALINITY_DAYS,
  REC_OUTFLOW_SALINITY_SCORES,
  REC_OUTFLOW_TEMPERATURE_DAYS,
  REC_OUTFLOW_TEMPERATURE_SCORES,
} from '../../../../../internal/rank-visualization/drilldown/recreationOutflow'
import type { OutflowRun } from '../../../../../internal/rank-visualization/drilldown/recreationOutflow'
import type { RecActivityKey } from '../../../../../internal/rank-visualization/drilldown/recreationThresholds'
import { NODE_INDEX } from '../../../../../internal/rank-visualization/drilldown/tree'

const NO_FACET: Facet[] = [{ key: ANY, label: 'Not broken out' }]
const RUNS = [...OUTFLOW_KEYS] as ScenarioKey[]

const SEASONS: Facet[] = [
  { key: 'run', label: 'Whole run · Oct 2020 – Jan 2022' },
  { key: 'wet', label: 'Wet season · Oct – Mar' },
  { key: 'dry', label: 'Dry season · Apr – Sep' },
]

/** Same value for every slice. */
function flat(by: Partial<Record<ScenarioKey, number>>) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, value] of Object.entries(by))
    out[scenario as ScenarioKey] = { [sliceKey(ANY, ANY)]: value }
  return out
}

/** Values keyed by place and period: `{ more: { all: { run: 4 } } }`. */
function byPlacePeriod(
  by: Partial<Record<ScenarioKey, Record<string, Record<string, number | null>>>>,
) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, places] of Object.entries(by)) {
    const series: SliceValues = {}
    for (const [place, periods] of Object.entries(places ?? {}))
      for (const [period, value] of Object.entries(periods)) series[sliceKey(place, period)] = value
    out[scenario as ScenarioKey] = series
  }
  return out
}

/** A row with nothing published yet, under every run. */
function forthcoming(
  id: string,
  team: TeamKey,
  label: string,
  note: string,
  over: Partial<CriterionNode> = {},
): CriterionNode {
  return {
    id,
    label,
    level: 'metric',
    team,
    edge: 'averages',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note,
    places: NO_FACET,
    periods: NO_FACET,
    values: {},
    forthcoming: true,
    ...over,
  }
}

/** A metric the outflow runs cannot move: they change flow, not the landscape. */
function notApplicable(id: string, team: TeamKey, label: string, note: string): CriterionNode {
  return {
    id,
    label,
    level: 'metric',
    team,
    edge: 'averages',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note,
    places: NO_FACET,
    periods: NO_FACET,
    values: {},
    notApplicable: RUNS,
  }
}

const report = (team: string, where: string, quote: string): Source => ({
  doc: 'report',
  where: `${team} “Story Behind the Criterion” report, Oct 2026 · ${where}`,
  quote,
})

// ---------- Ecology ----------

/** The five species Ecology ran on the outflow runs, in its own table order. */
const ECO_OUTFLOW_SPECIES: EcologySpeciesKey[] = [
  'overbiteClam',
  'longfinJuv',
  'longfinAdult',
  'egeria',
  'largemouthBass',
]
/** The regions of Ecology's outflow tables, in their order; Central Bay was omitted. */
const ECO_OUTFLOW_REGIONS: EcologyRegionKey[] = [
  'northDelta',
  'centralDelta',
  'southDelta',
  'confluence',
  'suisunBay',
  'sanPabloBay',
  'southBay',
]

/** Report Tables 2–6: proportion of suitable days per run, by region. */
const ECO_OUTFLOW: Record<string, Record<OutflowRun, number[]>> = {
  overbiteClam: {
    hist: [0, 0, 0, 0.056, 0.817, 0.332, 0.002],
    more: [0, 0, 0, 0.009, 0.523, 0.489, 0.006],
    less: [0, 0, 0, 0.062, 0.843, 0.378, 0],
  },
  longfinJuv: {
    hist: [0.029, 0.272, 0.467, 0.224, 0.439, 0, 0],
    more: [0.029, 0.076, 0.448, 0.277, 0.455, 0, 0],
    less: [0.029, 0.386, 0.471, 0.277, 0.422, 0, 0],
  },
  longfinAdult: {
    hist: [0, 0, 0, 0, 0.112, 0.708, 0.181],
    more: [0, 0, 0, 0, 0.075, 0.497, 0.609],
    less: [0, 0, 0, 0, 0.105, 0.546, 0.098],
  },
  egeria: {
    hist: [1, 1, 1, 0.943, 0.182, 0, 0],
    more: [1, 1, 1, 0.999, 0.476, 0, 0],
    less: [1, 1, 1, 0.938, 0.156, 0, 0],
  },
  largemouthBass: {
    hist: [1, 1, 1, 0.922, 0.09, 0, 0],
    more: [1, 1, 1, 0.978, 0.323, 0, 0],
    less: [1, 1, 1, 0.912, 0.068, 0, 0],
  },
}

const INVASIVE = new Set(['largemouthBass', 'overbiteClam', 'egeria'])

const ECO_PLACES: Facet[] = ECO_OUTFLOW_REGIONS.map((key) => ({
  key,
  label: ECOLOGY_REGIONS.find((region) => region.key === key)?.label ?? key,
}))

const ECO_SOURCE = report(
  'Ecology',
  'Results · Tiered Outflows, Tables 2–6',
  'Proportion of suitable days … for each subregion, under 3 tiered outflow scenarios.',
)

function ecoSpecies(key: EcologySpeciesKey): CriterionNode {
  const values: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const run of OUTFLOW_KEYS) {
    const series: SliceValues = {}
    ECO_OUTFLOW_REGIONS.forEach((region, i) => {
      series[sliceKey(region, ANY)] = ECO_OUTFLOW[key][run][i]
    })
    values[run] = series
  }
  return {
    id: `of-eco-${key}`,
    label: ECOLOGY_SPECIES.find((species) => species.key === key)?.label ?? key,
    level: 'entity',
    team: 'ecology',
    edge: 'measures',
    provenance: 'reported',
    unit: 'share',
    betterHigher: !INVASIVE.has(key),
    note: 'Proportion of days within the species’ salinity and temperature thresholds, by region, for each outflow run. Ecology reports no Delta-wide value and no rank for the outflow runs; Central Bay was left out.',
    places: ECO_PLACES,
    periods: NO_FACET,
    values,
    sources: [ECO_SOURCE],
  }
}

function ecologyTree(): CriterionNode {
  return forthcoming(
    'of-ecology',
    'ecology',
    'Ecology',
    'Ecology has not scored the outflow runs. Its report gives the proportion of suitable days for five species by region, and lists the overall ranking as a step still to do.',
    {
      level: 'team',
      edge: undefined,
      sources: [ECO_SOURCE],
      children: [
        notApplicable(
          'of-eco-habitat',
          'ecology',
          'Landscape',
          'The outflow runs change Delta outflow only, not the landscape, so they add no habitat acres.',
        ),
        notApplicable(
          'of-eco-foodweb',
          'ecology',
          'Food webs',
          'The food-web proxy is weighted acres of wetland and wet-soil agriculture, which the outflow runs do not change.',
        ),
        forthcoming(
          'of-eco-species',
          'ecology',
          'Species suitability',
          'Ecology has not ranked the species on the outflow runs. Open the row for each species’ proportion of suitable days by region: more outflow freshens the Confluence and Suisun Bay (more Brazilian waterweed and largemouth bass, fewer overbite clams there), less outflow does the reverse.',
          {
            edge: 'beside',
            sources: [ECO_SOURCE],
            children: ECO_OUTFLOW_SPECIES.map(ecoSpecies),
          },
        ),
      ],
    },
  )
}

// ---------- Recreation ----------

const REC_PLACES: Facet[] = [
  { key: 'delta', label: 'Delta-wide' },
  { key: 'suisun', label: 'Suisun Marsh' },
  { key: 'centralDelta', label: 'Central Delta' },
  { key: 'northDelta', label: 'North Delta' },
  { key: 'southDelta', label: 'South Delta' },
]

const REC_ACTIVITY_LABEL: Record<RecActivityKey, string> = {
  dayUseBoating: 'Day use and boating',
  birding: 'Birding',
  waterfowl: 'Waterfowl hunting',
  angling: 'Angling',
  dayUseCold: 'Day use, cold water',
}

type RecTable = typeof REC_OUTFLOW_SALINITY_SCORES

const recValues = (table: RecTable, activity: RecActivityKey) =>
  byPlacePeriod(
    (table[activity] ?? {}) as Record<OutflowRun, Record<string, Record<string, number | null>>>,
  )

function recSource(metric: 'salinity' | 'temperature'): Source {
  const book =
    metric === 'salinity'
      ? 'Tiered Outflows Salinity Analyzed.xlsx · OVERALL'
      : 'Tiered Outflows Temperature Analyzed.xlsx · Overall'
  return {
    doc: 'data',
    where: `${book} (Recreation, 26 Oct 2026) · TOTAL RUN, WET SEASON and DRY SEASON SCORES; RUN 15/16/17 % EXCEEDANCES`,
    quote:
      'Ranking / Scale: 5 greater than or equal to 5% less; … 0 No change from baseline; … -5 greater than or equal to 5% more',
  }
}

/** An activity: its days over the threshold, with its score as the rank beside them. */
function recActivity(
  metric: 'salinity' | 'temperature',
  activity: RecActivityKey,
  scores: RecTable,
  days: RecTable,
): CriterionNode {
  return {
    id: `of-rec-${metric}-${activity}`,
    label: REC_ACTIVITY_LABEL[activity],
    level: 'entity',
    team: 'recreation',
    edge: 'averages',
    provenance: 'reported',
    unit: 'share',
    betterHigher: false,
    note: `Proportion of days over the activity’s ${metric} threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historic Baseline, ±5 at five or more.`,
    places: REC_PLACES,
    periods: SEASONS,
    values: recValues(days, activity),
    ranks: recValues(scores, activity),
    sources: [recSource(metric)],
  }
}

/**
 * The metric's score on each run, place and period: the unweighted mean of its
 * activities' scores, the rule Recreation uses for the adaptation scenarios. The
 * team has not published it for the outflow runs, so it is ours and marked so.
 */
function recMean(scores: RecTable) {
  const out: Record<string, Record<string, Record<string, number | null>>> = {}
  const tables = Object.values(scores)
  for (const run of RUNS as OutflowRun[])
    for (const [place, periods] of Object.entries(tables[0]?.[run] ?? {}))
      for (const period of Object.keys(periods)) {
        const held = tables
          .map((table) => table?.[run]?.[place]?.[period])
          .filter((v): v is number => v !== null && v !== undefined)
        ;((out[run] ??= {})[place] ??= {})[period] = held.length
          ? Math.round((held.reduce((a, b) => a + b, 0) / held.length) * 100) / 100
          : null
      }
  return byPlacePeriod(out)
}

const REC_MEAN_SOURCE: Source = {
  doc: 'ours',
  where: 'The mean of the activity scores on this run, place and period',
  quote:
    'Recreation scores the row as the mean of its activities for the adaptation scenarios; the same rule applied to the outflow runs, which the team has not combined.',
}

function recThresholds(
  metric: 'salinity' | 'temperature',
  scores: RecTable,
  days: RecTable,
  note: string,
): CriterionNode {
  return {
    id: `of-rec-${metric}`,
    label: metric === 'salinity' ? 'Salinity thresholds' : 'Temperature thresholds',
    level: 'metric',
    team: 'recreation',
    edge: 'averages',
    provenance: 'inferred',
    unit: 'score',
    betterHigher: true,
    note,
    places: REC_PLACES,
    periods: SEASONS,
    values: recMean(scores),
    entityNoun: 'activity',
    sources: [recSource(metric), REC_MEAN_SOURCE],
    children: (Object.keys(scores) as RecActivityKey[]).map((activity) =>
      recActivity(metric, activity, scores, days),
    ),
  }
}

function recreationTree(): CriterionNode {
  return forthcoming(
    'of-recreation',
    'recreation',
    'Recreation',
    'Recreation scores every activity on the outflow runs but has not combined them into a criterion score; the report’s “Tiered outflow analysis ranking” section is still empty. Its summary: more outflow helps, cutting salinity risk for birds and waterfowl by as much as 90% in a month, while less outflow barely moves the baseline.',
    {
      level: 'team',
      edge: undefined,
      children: [
        recThresholds(
          'salinity',
          REC_OUTFLOW_SALINITY_SCORES,
          REC_OUTFLOW_SALINITY_DAYS,
          'Each activity scored on its days over its salinity threshold against the Historic Baseline; the row is their mean, the rule Recreation uses for the adaptation scenarios (the team has not combined them for the outflow runs). Delta-wide, +30% outflow scores +4 to +5 on every activity and −10% scores −1 to −5. Open the row for each activity’s days and score.',
        ),
        recThresholds(
          'temperature',
          REC_OUTFLOW_TEMPERATURE_SCORES,
          REC_OUTFLOW_TEMPERATURE_DAYS,
          'The same construction against water temperature, the row again the mean of the activities. Outflow barely changes temperature: Delta-wide, every activity scores 0 for the whole run under both runs.',
        ),
        notApplicable(
          'of-rec-restoration',
          'recreation',
          'Habitat Restoration',
          'Scores restored acres; the outflow runs restore none.',
        ),
        notApplicable(
          'of-rec-economy',
          'recreation',
          'Recreation economy',
          'Values recreation services on restored land; the outflow runs restore none.',
        ),
      ],
    },
  )
}

// ---------- Environmental Justice ----------

/** EJ's outflow analysis uses 46 SAFER points, not the adaptation runs' 49. */
const EJ_CLASSES: Facet[] = [
  { key: 'all', label: 'All 46 points' },
  { key: 'moderate', label: 'Moderate vulnerability · 10' },
  { key: 'high', label: 'High vulnerability · 33' },
  { key: 'highest', label: 'Highest vulnerability · 3' },
]

const S = (run: number, wet: number, dry: number) => ({ run, wet, dry })

/** Report Tables 5–8 and the seasonal rankings that follow them. */
const EJ_SCORES = byPlacePeriod({
  hist: { all: S(0, 0, 0), moderate: S(0, 0, 0), high: S(0, 0, 0) },
  more: { all: S(4, 4, 4), moderate: S(5, 5, 5), high: S(4, 5, 4) },
  less: { all: S(-1, -1, -1), moderate: S(-2, -2, -2), high: S(-1, -1, -1) },
})

/** Report Tables 1 and 2: share of the run at or above 1,050 µS/cm. */
const EJ_EXCEEDANCE = byPlacePeriod({
  hist: {
    all: S(0.27, 0.28, 0.26),
    moderate: S(0.31, 0.37, 0.24),
    high: S(0.28, 0.27, 0.29),
    highest: S(0, 0, 0),
  },
  more: {
    all: S(0.08, 0.08, 0.09),
    moderate: S(0.01, 0.01, 0.02),
    high: S(0.11, 0.11, 0.12),
    highest: S(0, 0, 0),
  },
  less: {
    all: S(0.32, 0.33, 0.3),
    moderate: S(0.41, 0.45, 0.33),
    high: S(0.32, 0.32, 0.31),
    highest: S(0, 0, 0),
  },
})

const EJ_SOURCE = report(
  'EJ',
  'Overall Comparative Scenario Performance, tiered outflow table',
  '30% Outflow Increase | 4 | 4 | 4 | 4 | 4 · 10% Outflow Decrease | -1 | -1 | -1 | -1.5 | -2',
)

function ejTree(): CriterionNode {
  return {
    id: 'of-environmentalJustice',
    label: 'Environmental Justice',
    level: 'team',
    team: 'environmentalJustice',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'Only drinking water is assessed on the outflow runs, so it is the whole EJ score: +30% outflow +4, −10% outflow −2. The report’s table gives −1 for the whole run and both seasons, then an average of −1.5 rounded to −2; −2 is the score it states.',
    places: NO_FACET,
    periods: NO_FACET,
    values: flat({ hist: 0, more: 4, less: -2 }),
    sources: [EJ_SOURCE],
    children: [
      {
        id: 'of-ej-drinking',
        label: 'Salinity impacts to in-Delta drinking water',
        level: 'metric',
        team: 'environmentalJustice',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'One point per percentage point of readings over 1,050 µS/cm against the Historic Baseline, ±5 at 21 points or more, scored for all 46 points and for the moderate and high classes; the highest class never exceeds the threshold.',
        places: EJ_CLASSES,
        periods: SEASONS,
        values: EJ_SCORES,
        sources: [
          report(
            'EJ',
            'Comparative ranking, Tables 5–8 and the seasonal rankings',
            'With Historic Baseline anchored at 0, the 30% Outflow Increase run scored 4, while the 10% Outflow Decrease run scored -1.',
          ),
        ],
        children: [
          {
            id: 'of-ej-drinking-pct',
            label: 'Readings over 1,050 µS/cm',
            level: 'entity',
            team: 'environmentalJustice',
            edge: 'derives',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Share of daily mean readings at or above 1,050 µS/cm at the 46 SAFER points, Oct 1 2020 – Jan 1 2022, all together or by Delta Vulnerability Index class.',
            places: EJ_CLASSES,
            periods: SEASONS,
            values: EJ_EXCEEDANCE,
            sources: [
              report(
                'EJ',
                'Tiered Outflow Analysis, Tables 1 and 2',
                'Percentage of run exceeding 1,050 µ/cm in each tiered outflow run.',
              ),
            ],
          },
        ],
      },
      notApplicable(
        'of-ej-flood',
        'environmentalJustice',
        'Flood risk attenuation',
        'The report: there is no tiered outflow analysis for this metric, because every outflow run uses the same landscape and varies only Delta outflow.',
      ),
      notApplicable(
        'of-ej-waterage',
        'environmentalJustice',
        'Water age + temperature',
        'The report: water age data was not available for the tiered outflow runs, so this metric assesses the adaptation scenarios only.',
      ),
    ],
  }
}

// ---------- Economy ----------

const ECONOMY_NOTE =
  'Economy lists the tiered outflow runs (modeled in SCHISM) as “not shown in the present analysis”.'

function economyTree(): CriterionNode {
  return forthcoming('of-economy', 'economy', 'Economy', ECONOMY_NOTE, {
    level: 'team',
    edge: undefined,
    children: [
      forthcoming('of-econ-revenue', 'economy', 'Gross revenues', ECONOMY_NOTE),
      forthcoming('of-econ-jobs', 'economy', 'Jobs', ECONOMY_NOTE),
      forthcoming('of-econ-value', 'economy', 'Value added', ECONOMY_NOTE),
    ],
  })
}

// ---------- Eco-cultural ----------

function ecoCulturalTree(): CriterionNode {
  return {
    id: 'of-ecoCultural',
    label: 'Eco-cultural',
    level: 'team',
    team: 'ecoCultural',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'One overall score: +30% outflow +3, −10% outflow −2. Flow matters to the Tribes the team heard from, and the 30% increase clearly outperforms the other two runs. The runs change no landscape, so restoration does not apply.',
    places: NO_FACET,
    periods: NO_FACET,
    values: flat({ hist: 0, more: 3, less: -2 }),
    sources: [
      report(
        'Eco-cultural',
        'Comparative Scenario Performance Ranking, tiered outflow table',
        '30% Outflow Increase | 3 · 10% Outflow Decrease | -2',
      ),
    ],
    children: [
      notApplicable(
        'of-ec-restoration',
        'ecoCultural',
        'Restoration',
        'The report: the tiered outflow scenarios include no landscape-level interventions, so they have no score for Metric A, restoration of native ecosystems.',
      ),
    ],
  }
}

/** The five teams' outflow trees, in the tab bar's order. */
export const OUTFLOW_TREE: CriterionNode[] = [
  ecologyTree(),
  recreationTree(),
  ejTree(),
  economyTree(),
  ecoCulturalTree(),
]

function register(n: CriterionNode) {
  NODE_INDEX.set(n.id, n)
  n.children?.forEach(register)
}
OUTFLOW_TREE.forEach(register)
