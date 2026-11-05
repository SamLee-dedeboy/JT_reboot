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
//   Economy      the +30% run only (v20): one score and its Delta-wide salinity effects
//   Eco-cultural one overall score
// Anything not yet published is `forthcoming`; a metric the runs cannot move
// (they change no landscape) is not applicable.
import type { TeamKey } from '../../../../../internal/rank-visualization/data'
import {
  ECOLOGY_REGIONS,
  ECOLOGY_SPECIES,
} from '../../../../../internal/rank-visualization/drilldown/ecologyNiche'
import type { EcologySpeciesKey } from '../../../../../internal/rank-visualization/drilldown/ecologyNiche'
import { applyOutflowScores } from './applyScores'
import { ECOLOGY_OUTFLOW } from '../../../../../internal/rank-visualization/drilldown/ecologyWorkbook'
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
import type { OutflowRun } from '../../../../../internal/rank-visualization/drilldown/recreationOutflow'
import {
  REC_OUTFLOW_SALINITY_DAYS,
  REC_OUTFLOW_SALINITY_SCORES,
  REC_OUTFLOW_TEMPERATURE_DAYS,
  REC_OUTFLOW_TEMPERATURE_SCORES,
} from '../../../../../internal/rank-visualization/drilldown/recreationWorkbook'
import type {
  RecActivityKey,
  RecTable as RecreationTable,
} from '../../../../../internal/rank-visualization/drilldown/recreationWorkbook'
import { NODE_INDEX } from '../../../../../internal/rank-visualization/drilldown/tree'

const NO_FACET: Facet[] = [{ key: ANY, label: 'Not broken out' }]
const RUNS = [...OUTFLOW_KEYS] as ScenarioKey[]
const outflowFlat = (hist: number, more: number) => ({
  hist: { [sliceKey(ANY, ANY)]: hist },
  more: { [sliceKey(ANY, ANY)]: more },
})

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

const ECO_OUTFLOW_SPECIES = ECOLOGY_SPECIES.map((species) => species.key)

const INVASIVE = new Set(['largemouthBass', 'overbiteClam', 'egeria'])

const ECO_PLACES: Facet[] = [
  { key: ANY, label: 'All together' },
  ...ECOLOGY_REGIONS.map((region) => ({ key: region.key, label: region.label })),
]
const ECO_PERIODS: Facet[] = [
  { key: ANY, label: 'Whole period' },
  { key: '2019', label: 'Wet Year' },
  { key: '2020', label: 'Dry Year' },
]

const ECO_SOURCE = report(
  'Ecology',
  'Results · Tiered Outflows, Tables 2–6',
  'Proportion of suitable days … for each subregion, under 3 tiered outflow scenarios.',
)

function ecoSpecies(key: EcologySpeciesKey): CriterionNode {
  return {
    id: `of-eco-${key}`,
    label: ECOLOGY_SPECIES.find((species) => species.key === key)?.label ?? key,
    level: 'entity',
    team: 'ecology',
    edge: 'measures',
    provenance: 'reported',
    unit: 'share',
    betterHigher: !INVASIVE.has(key),
    note: 'Proportion of days within the species’ salinity and temperature thresholds, as reported in the Ecology tab.',
    places: ECO_PLACES,
    periods: ECO_PERIODS,
    values: ECOLOGY_OUTFLOW[`bk-eco-niche-${key}`] ?? {},
    sources: [ECO_SOURCE],
  }
}

function ecologyTree(): CriterionNode {
  return {
    id: 'of-ecology',
    label: 'Ecology',
    level: 'team',
    team: 'ecology',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'Ecology scores reported in the Ecology tab of the ranking workbook.',
    places: NO_FACET,
    periods: NO_FACET,
    values: {}, // ranking/scores.ts
    sources: [ECO_SOURCE],
    children: [
      notApplicable(
        'of-eco-habitat',
        'ecology',
        'Habitat availability',
        'The outflow runs change Delta outflow only, not the landscape, so they add no habitat acres.',
      ),
      notApplicable(
        'of-eco-foodweb',
        'ecology',
        'Food webs',
        'The food-web proxy is weighted acres of wetland and wet-soil agriculture, which the outflow runs do not change.',
      ),
      {
        id: 'of-eco-species',
        label: 'Species suitability',
        level: 'metric',
        team: 'ecology',
        edge: 'beside',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The aggregate species-suitability score reported in the Ecology tab. Species rows beneath it show measures only, without individual scores.',
        places: NO_FACET,
        periods: NO_FACET,
        values: ECOLOGY_OUTFLOW['bk-eco-species'] ?? {},
        sources: [ECO_SOURCE],
        children: ECO_OUTFLOW_SPECIES.map(ecoSpecies),
      },
    ],
  }
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

type RecTable = RecreationTable<number | null>

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
    note: `Proportion of days over the activity’s ${metric} threshold at 19 points in 4 regions, with Recreation’s own score beside it: one point per percentage point against the Historical Baseline, ±5 at five or more.`,
    places: REC_PLACES,
    periods: SEASONS,
    values: recValues(days, activity),
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
    children: (Object.keys(scores) as RecActivityKey[]).flatMap((activity) => {
      const row = recActivity(metric, activity, days)
      if (activity !== 'dayUseBoating') return [row]
      const copyAs = (key: 'dayUse' | 'boating', label: string): CriterionNode => ({
        ...row,
        id: row.id.replace(/dayUseBoating$/, key),
        label,
      })
      return [copyAs('dayUse', 'Day use'), copyAs('boating', 'Boating')]
    }),
  }
}

function recreationTree(): CriterionNode {
  return forthcoming(
    'of-recreation',
    'recreation',
    'Recreation',
    'Recreation’s overall score for +30% outflow is 0. The team has not scored −10% outflow. The workbook supplies the background proportions against the Historical Baseline.',
    {
      level: 'team',
      edge: undefined,
      provenance: 'reported',
      forthcoming: false,
      forthcomingFor: ['less'],
      places: NO_FACET,
      values: {}, // ranking/scores.ts
      children: [
        {
          ...recThresholds(
            'salinity',
            REC_OUTFLOW_SALINITY_SCORES,
            REC_OUTFLOW_SALINITY_DAYS,
            'The Recreation team scores +30% outflow +1 for Salinity stress. Open the row for the workbook’s activity-level proportions and changes from Historical Baseline.',
          ),
          places: NO_FACET,
          periods: NO_FACET,
          values: outflowFlat(0, 1),
        },
        {
          ...recThresholds(
            'temperature',
            REC_OUTFLOW_TEMPERATURE_SCORES,
            REC_OUTFLOW_TEMPERATURE_DAYS,
            'The Recreation team scores +30% outflow 0 for Temperature stress. Open the row for the workbook’s activity-level proportions and changes from Historical Baseline.',
          ),
          places: NO_FACET,
          periods: NO_FACET,
          values: outflowFlat(0, 0),
        },
        notApplicable(
          'of-rec-restoration',
          'recreation',
          'Habitat Restoration',
          'The outflow run restores no habitat.',
        ),
        notApplicable(
          'of-rec-economy',
          'recreation',
          'Recreation economy',
          'The outflow run creates no recreation economy on restored land.',
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
  hist: { all: S(0, 0, 0), moderate: S(0, 0, 0), high: S(0, 0, 0), highest: S(0, 0, 0) },
  more: { all: S(4, 4, 4), moderate: S(5, 5, 5), high: S(4, 5, 4), highest: S(0, 0, 0) },
  less: { all: S(-1, -1, -1), moderate: S(-2, -2, -2), high: S(-1, -1, -1), highest: S(0, 0, 0) },
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
    values: {}, // ranking/scores.ts; +30% is the team's own, from the Nov 2026 workbook.
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
        note: 'One point per percentage point of readings over 1,050 µS/cm against the Historical Baseline, ±5 at 21 points or more, scored for all 46 points and for each class; the highest class never exceeds the threshold, so it scores 0.',
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
  'The +30% Sacramento River flow run (SCHISM run 16) against its Historical Baseline (run 15), water year 2021: a dry year, in a different model and year from the other scenarios, with no sea level rise run. Under 1% of the baseline scores 0, the same rule as every scenario. The team has not scored −10% outflow.'

const ECONOMY_SOURCE: Source = {
  doc: 'data',
  where: 'JT_Economy_takeaways_and_outflow__v20.xlsx (3 Nov 2026) · Increased_Delta_outflow',
  quote: 'A gain of about $20,000/yr is about 0.002% of Delta farm revenue, so the score is 0.',
}

const ECONOMY_SALINITY_LABEL = 'Salinity effects across the Delta'
const ECONOMY_LAND_LABEL = 'Change from converting farmland to wetland'
const ECONOMY_NO_LAND = 'The tiered outflow runs change flow, not the landscape.'

/** A row scored or measured for the +30% run alone; the team has not scored −10%. */
const economyMore = (
  id: string,
  label: string,
  more: number,
  over: Partial<CriterionNode> = {},
): CriterionNode =>
  forthcoming(id, 'economy', label, ECONOMY_NOTE, {
    forthcoming: false,
    forthcomingFor: ['less'],
    values: flat({ hist: 0, more }),
    sources: [ECONOMY_SOURCE],
    ...over,
  })

/** Its salinity effect, in the unit of the row it fills; land conversion cannot apply. */
function economyMetric(
  id: string,
  label: string,
  unit: 'usd' | 'jobs',
  salinity: number,
  extra: CriterionNode[] = [],
): CriterionNode {
  return economyMore(id, label, 0, {
    children: [
      notApplicable(`${id}-land`, 'economy', ECONOMY_LAND_LABEL, ECONOMY_NO_LAND),
      economyMore(`${id}-salinity`, ECONOMY_SALINITY_LABEL, salinity, {
        level: 'entity',
        edge: 'measures',
        unit,
      }),
      ...extra,
    ],
  })
}

function economyTree(): CriterionNode {
  // The 0 here is replaced by ranking/scores.ts.
  return economyMore('of-economy', 'Economy', 0, {
    level: 'team',
    edge: undefined,
    children: [
      economyMetric('of-econ-revenue', 'Gross revenues', 'usd', 19939, [
        notApplicable(
          'of-econ-revenue-carbon',
          'economy',
          'Carbon-offset revenue',
          ECONOMY_NO_LAND,
        ),
      ]),
      // +0.27 total jobs, shown as whole jobs like the team's other salinity effects.
      economyMetric('of-econ-jobs', 'Jobs', 'jobs', 0),
      economyMetric('of-econ-value', 'Value added', 'usd', 18772),
    ],
  })
}

// ---------- Eco-cultural ----------

function ecoCulturalTree(): CriterionNode {
  const ecoCulturalMore = (
    id: string,
    label: string,
    more: number,
    over: Partial<CriterionNode> = {},
  ): CriterionNode =>
    forthcoming(id, 'ecoCultural', label, 'Eco-cultural tiered-outflow ranking table.', {
      forthcoming: false,
      values: flat({ hist: 0, more, less: 0 }),
      ...over,
    })

  const restorationHabitats = [
    'tidal',
    'managed',
    'rice',
    'uplandWetland',
    'meadow',
    'floodplain',
  ].map((habitat) =>
    ecoCulturalMore(`of-ec-restoration-${habitat}`, '', 0, {
      level: 'entity',
      edge: 'measures',
      unit: 'acres',
    }),
  )

  return {
    id: 'of-ecoCultural',
    label: 'Eco-cultural',
    level: 'team',
    team: 'ecoCultural',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'One overall score: +30% outflow +3, −10% outflow −2. Flow matters to the Tribes the team heard from, and the 30% increase clearly outperforms the other two runs.',
    places: NO_FACET,
    periods: NO_FACET,
    values: {}, // ranking/scores.ts
    sources: [
      report(
        'Eco-cultural',
        'Comparative Scenario Performance Ranking, tiered outflow table',
        '30% Outflow Increase | 3 · 10% Outflow Decrease | -2',
      ),
    ],
    children: [
      ecoCulturalMore('of-ec-restoration', 'Restoration', 0, {
        children: [
          ...restorationHabitats,
          {
            ...ecoCulturalMore(
              'of-ec-restoration-functional-flow',
              'Potential for functional flow',
              3,
              { provenance: 'unscored', edge: 'measures' },
            ),
            steps: { hist: 0, more: 3, less: -2 },
          },
        ],
      }),
      {
        ...ecoCulturalMore('of-ec-access', 'Increased Land Access', 0, {
          provenance: 'unscored',
        }),
        steps: { hist: 0, more: 0, less: 0 },
      },
      {
        ...ecoCulturalMore(
          'of-ec-tek',
          'Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK)',
          0,
          { provenance: 'unscored' },
        ),
        steps: { hist: 0, more: 0, less: 0 },
      },
      {
        ...ecoCulturalMore(
          'of-ec-sovereignty',
          'Recognition and Application of Tribal Sovereignty',
          2,
          { provenance: 'unscored' },
        ),
        steps: { hist: 0, more: 2, less: 0 },
      },
    ],
  }
}

/** The five teams' outflow trees, in the tab bar's order. */
/** ranking/scores.ts sets each team's score and metric-row scores last, replacing any above. */
export const OUTFLOW_TREE: CriterionNode[] = [
  ecologyTree(),
  recreationTree(),
  ejTree(),
  economyTree(),
  ecoCulturalTree(),
].map(applyOutflowScores)

function register(n: CriterionNode) {
  NODE_INDEX.set(n.id, n)
  n.children?.forEach(register)
}
OUTFLOW_TREE.forEach(register)
