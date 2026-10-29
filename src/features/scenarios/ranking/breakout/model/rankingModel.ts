// The breakout table's model: ranking scores first, each opening into what it is
// based on. Every team reads the same way: the criterion score, then the scores it
// ranks scenarios by, and under each score the entities behind it (species,
// activities, vulnerability classes, habitat types…) in their own units, with an
// entity's own rank beside its value where it has one. RANKINGS.md documents every
// number here and where it came from.
//
// The tree reuses the 4C pivot's nodes (../drilldown/tree.ts) as copies with a
// `bk-` id, so this page can relabel periods, regroup rows and add ranks without
// changing the pivot or the by-subteam pages.
import type { EcologySpeciesKey } from '../../../../../internal/rank-visualization/drilldown/ecologyNiche'
import { ECOLOGY_RERUN_DELTA } from '../../../../../internal/rank-visualization/drilldown/ecologyRerun'
import type { RerunScenario } from '../../../../../internal/rank-visualization/drilldown/ecologyRerun'
import {
  ANY,
  CALSIM_BAU,
  sliceKey,
} from '../../../../../internal/rank-visualization/drilldown/model'
import type {
  CriterionNode,
  Facet,
  ScenarioKey,
  SliceValues,
  Source,
} from '../../../../../internal/rank-visualization/drilldown/model'
import { NODE_INDEX, sourcesFor } from '../../../../../internal/rank-visualization/drilldown/tree'
import { MEASURE_LABELS } from './labels'

const node = (id: string): CriterionNode => {
  const found = NODE_INDEX.get(id)
  if (!found) throw new Error(`rankingModel: no node ${id}`)
  return found
}

// ---------- periods: wet / dry seasons and water years, with their months ----------

const PERIOD_LABEL: Record<string, string> = {
  // The months are in the TIME PERIOD info card (PERIOD_MONTHS in labels.ts).
  run: 'Whole period',
  wet: 'Wet season',
  dry: 'Dry season',
  '2019': 'Wet Year',
  '2020': 'Dry Year',
  both: 'WY 2019 + 2020 together',
}

/**
 * Ecology's species work covers only Feb 1 – Jun 1 of each water year; the months
 * are in the TIME PERIOD info card (TEAM_PERIOD_MONTHS in labels.ts).
 */
const ECOLOGY_PERIOD_LABEL: Record<string, string> = {
  '2019': 'Wet Year',
  '2020': 'Dry Year',
  both: 'WY 2019 + 2020',
}

const relabel = (facets: Facet[], labels: Record<string, string>): Facet[] =>
  facets.map((facet) => ({
    ...facet,
    label: labels[facet.key] ?? PERIOD_LABEL[facet.key] ?? facet.label,
  }))

const SLIDES: Source = {
  doc: 'slides',
  where: 'Bay-Delta Science Conference slides, Oct 2026',
  quote: 'Rank charts read cell by cell; see RANKINGS.md.',
}

/**
 * A pivot node as this page shows it: a `bk-` id, its citations carried over (they
 * are looked up by the original id), periods relabelled with their months, and the
 * same done to its children and its sea-level-rise run.
 */
function adapt(
  base: CriterionNode,
  over: Partial<CriterionNode> = {},
  labels: Record<string, string> = {},
): CriterionNode {
  const sources = base.sources ?? sourcesFor(base.id)
  return {
    ...base,
    id: `bk-${base.id}`,
    sources: sources.length > 0 ? sources : undefined,
    periods: relabel(base.periods, labels),
    slr: base.slr && {
      ...base.slr,
      periods: base.slr.periods && relabel(base.slr.periods, labels),
    },
    children: base.children?.map((child) => adapt(child, {}, labels)),
    ...over,
  }
}

/** Same value for every slice: `{ ngw: 4, … }`. */
function flat(by: Partial<Record<ScenarioKey, number | null>>) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, value] of Object.entries(by))
    out[scenario as ScenarioKey] = { [sliceKey(ANY, ANY)]: value }
  return out
}

/** Values keyed by place and period: `{ bau: { moderate: { run: 0, wet: 0 } } }`. */
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

/** Move a series' place key: the pivot's `*|run` becomes this page's `moderate|run`. */
function atPlace(
  values: Partial<Record<ScenarioKey, SliceValues>>,
  place: string,
): Partial<Record<ScenarioKey, SliceValues>> {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, series] of Object.entries(values)) {
    const moved: SliceValues = {}
    for (const [key, value] of Object.entries(series ?? {})) {
      const [, period] = key.split('|')
      moved[sliceKey(place, period)] = value
    }
    out[scenario as ScenarioKey] = moved
  }
  return out
}

function merge(...parts: Partial<Record<ScenarioKey, SliceValues>>[]) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const part of parts)
    for (const [scenario, series] of Object.entries(part))
      out[scenario as ScenarioKey] = { ...out[scenario as ScenarioKey], ...series }
  return out
}

// ---------- Ecology ----------

/**
 * Per-species suitability ranks, Delta-wide, from the slides' rule (+1 per
 * percentage point of suitable days against Business as Usual, sign reversed for
 * the three undesirable species) applied to the report's Table 16. They reproduce
 * the dots on slides 12–13. Unlisted cells are 0. Calling on Reserves and A Tunnel
 * come from the 27 Oct rerun instead (RERUN_SCENARIOS).
 */
const SPECIES_RANKS: Record<string, Partial<Record<ScenarioKey, [number, number]>>> = {
  longfinJuv: { em: [1, 0], ngw: [1, 0] },
  longfinAdult: {},
  chinook: {},
  stripedBassJuv: {},
  stripedBassAdult: {},
  largemouthBass: { em: [0, 2], ngw: [0, 2] },
  overbiteClam: { em: [0, -1], ngw: [0, -1] },
  egeria: { em: [0, 1], ngw: [0, 1] },
}

/** The species whose ranks the slides reverse: less habitat for them is better. */
const INVASIVE = new Set(['largemouthBass', 'overbiteClam', 'egeria'])

/**
 * The scenarios Ecology reran on 27 Oct 2026 (an updated Calling on Reserves and A
 * Tunnel's first run), read against that rerun's own New CalSIM Base rather than
 * the Business as Usual column.
 */
const RERUN_SCENARIOS = ['cor', 'tunnel'] as const

/** The slides' rule on the rerun: percentage points against the New CalSIM Base, ±5 at most. */
function rerunRank(key: EcologySpeciesKey, scenario: RerunScenario, year: 0 | 1): number {
  const share = ECOLOGY_RERUN_DELTA[key]
  const points = (share[scenario][year] - share.base[year]) * 100
  const rank = Math.max(-5, Math.min(5, Math.round(points)))
  return (INVASIVE.has(key) ? -rank : rank) || 0
}

function speciesRanks(key: EcologySpeciesKey): Partial<Record<ScenarioKey, SliceValues>> {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const scenario of ['bau', 'em', 'ngw', 'bf'] as ScenarioKey[]) {
    const [wet, dry] = SPECIES_RANKS[key]?.[scenario] ?? [0, 0]
    out[scenario] = { [sliceKey('delta', '2019')]: wet, [sliceKey('delta', '2020')]: dry }
  }
  for (const scenario of RERUN_SCENARIOS)
    out[scenario] = {
      [sliceKey('delta', '2019')]: rerunRank(key, scenario, 0),
      [sliceKey('delta', '2020')]: rerunRank(key, scenario, 1),
    }
  return out
}

/**
 * A species' values with the rerun's Delta-wide shares for Calling on Reserves and
 * A Tunnel, and the rerun's New CalSIM Base as their baseline (CALSIM_BAU). The
 * rerun pools its regions over both years, so those scenarios have no regional
 * value by year; the superseded Calling on Reserves regions go.
 */
function speciesValues(
  key: EcologySpeciesKey,
  values: Partial<Record<ScenarioKey, SliceValues>>,
): Partial<Record<ScenarioKey, SliceValues>> {
  const out = { ...values }
  const rerun = ECOLOGY_RERUN_DELTA[key]
  for (const [scenario, run] of [
    ...RERUN_SCENARIOS.map((s) => [s, s] as const),
    [CALSIM_BAU, 'base'] as const,
  ]) {
    const [wet, dry] = rerun[run]
    out[scenario] = { [sliceKey('delta', '2019')]: wet, [sliceKey('delta', '2020')]: dry }
  }
  return out
}

/** Ecology's 27 Oct rerun table, cited on every species row that now reads it. */
const ECOLOGY_RERUN_SOURCE: Source = {
  doc: 'report',
  where:
    'Ecology report · Adaptation Scenarios - New Base, Calling on Reserves update, a tunnel - October 27, 2026',
  quote: 'Proportion of Suitable Days Across Species of Interest, Year, and Scenario',
}

function ecologyTree(): CriterionNode {
  const niche = node('eco-niche')
  const species = (niche.children ?? []).map((base) => {
    const key = base.id.replace('eco-niche-', '') as EcologySpeciesKey
    return adapt(
      base,
      {
        values: speciesValues(key, base.values),
        ranks: speciesRanks(key),
        note: `${base.note.replace(/; A Tunnel was run only[^.]*\./, '.')} Calling on Reserves and A Tunnel are Ecology’s 27 Oct 2026 rerun, Delta-wide only and read against its own New CalSIM Base, not the Business as Usual column.`,
        sources: [...sourcesFor(base.id), SLIDES, ECOLOGY_RERUN_SOURCE],
        // For an invasive species, less suitable habitat is the better outcome.
        betterHigher: !INVASIVE.has(key),
      },
      ECOLOGY_PERIOD_LABEL,
    )
  })
  const suitability: CriterionNode = {
    ...adapt(niche, {}, ECOLOGY_PERIOD_LABEL),
    id: 'bk-eco-species',
    label: 'Species suitability',
    unit: 'score',
    edge: 'beside',
    provenance: 'reported',
    entityNoun: 'species',
    note: 'The slides rank each species on its proportion of suitable days (+1 per percentage point against Business as Usual, reversed for largemouth bass, overbite clam and Brazilian waterweed) and never combine them. Open the row to see each species’ value and rank. The ranks are Delta-wide; regions carry values only. Feb 1 – Jun 1 of each water year; there is no whole run. Calling on Reserves and A Tunnel come from Ecology’s 27 Oct 2026 rerun against its own New CalSIM Base; their ranks are ours, the same rule applied to that table. These ranks do not feed the Ecology score.',
    values: {},
    sources: [SLIDES, ...sourcesFor('eco-niche-')],
    slr: niche.slr && {
      ...niche.slr,
      periods: niche.slr.periods && relabel(niche.slr.periods, ECOLOGY_PERIOD_LABEL),
    },
    children: species,
  }
  const root = node('ecology')
  return adapt(root, {
    children: [
      adapt(node('eco-habitat')),
      adapt(node('eco-foodweb')),
      suitability,
      adapt(node('eco-conceptual')),
    ],
  })
}

// ---------- Recreation ----------

/** An activity: its days over the threshold, with its score as the rank beside them. */
function activity(activityNode: CriterionNode): CriterionNode {
  const days = activityNode.children?.[0] ?? activityNode
  return adapt(days, {
    id: `bk-${activityNode.id}`,
    label: activityNode.label,
    ranks: activityNode.values,
    sources: sourcesFor(activityNode.id),
    slr: days.slr && {
      ...days.slr,
      periods: days.slr.periods && relabel(days.slr.periods, {}),
      ranks: activityNode.slr?.values,
    },
  })
}

function thresholdRow(id: string, label: string, note: string): CriterionNode {
  const base = node(id)
  return adapt(base, {
    label,
    note,
    entityNoun: 'activity',
    children: (base.children ?? []).map(activity),
  })
}

const NOT_BROKEN_OUT: Facet[] = [{ key: ANY, label: 'Not broken out' }]

/** The scoring email that sets every scenario restoring nothing at 0. */
const SCORING_EMAIL: Source = {
  doc: 'ours',
  where: 'Recreation scoring email, 22 Oct 2026',
  quote:
    'BAU, BAF, COR, TUN → all will be scored at 0. Eco Machine and New Green Watershed (the 50-50 regime) are for Recreation to score.',
}

/** Recreation's restoration table: habitat (C) and economy (D), each kept apart from its score. */
const RESTORATION_SCORE: Source = {
  doc: 'data',
  where: 'Recreation The Score.xlsx (Recreation, 26 Oct 2026) · Recreation Score · table 3',
  quote:
    'C — Habitat (restored acres): BAU 0, ECO 5, NGW Lower/Middle/Upper 5. D — Economy ($): BAU 0, ECO 5, NGW 5. C and D treat restoration as added on top of BAU protected areas.',
}

/**
 * Habitat restoration as a ranking score, with Recreation's acres beneath it: +5 for
 * Eco Machine and New Green Watershed (every bound), 0 for the scenarios that
 * restore nothing.
 */
function habitatRestoration(): CriterionNode {
  const acres = node('rec-restoration')
  return adapt(acres, {
    label: 'Habitat Restoration',
    edge: 'beside',
    unit: 'score',
    places: NOT_BROKEN_OUT,
    values: flat({ bau: 0, bf: 0, cor: 0, tunnel: 0, em: 5, ngw: 5 }),
    ngwLevels: [5, 5, 5],
    sources: [RESTORATION_SCORE, SCORING_EMAIL, ...sourcesFor('rec-restoration')],
    note: 'Recreation scores restored acres added on top of Business as Usual’s protected areas: Eco Machine +5 and New Green Watershed +5 at every bound (25, 50 and 100%). Business as Usual, Bolster & Fortify, Calling on Reserves and A Tunnel restore nothing and score 0 (scoring email). Kept apart from the Recreation score. Open the row for the acres Recreation reports.',
    children: [
      adapt(acres, {
        id: 'bk-rec-restoration-acres',
        label: 'Restored acres',
        level: 'entity',
        edge: 'measures',
        notApplicable: ['bf', 'cor', 'tunnel'],
      }),
    ],
  })
}

/**
 * Recreation economy as a ranking score (Recreation's component D), with each
 * service's dollars and score beneath it: +5 for Eco Machine and New Green
 * Watershed, 0 for the scenarios that restore nothing.
 */
function recreationEconomy(): CriterionNode {
  const economy = node('rec-economy')
  return adapt(economy, {
    edge: 'beside',
    unit: 'score',
    places: NOT_BROKEN_OUT,
    values: flat({ bau: 0, bf: 0, cor: 0, tunnel: 0, em: 5, ngw: 5 }),
    ngwLevels: [5, 5, 5],
    entityNoun: 'service',
    sources: [RESTORATION_SCORE, SCORING_EMAIL, ...sourcesFor('rec-economy')],
    note: 'The yearly value of four recreation services on restored land, added on top of Business as Usual’s protected areas: Eco Machine +5 and New Green Watershed +5 at every bound; every service scores +5 for both. Business as Usual, Bolster & Fortify, Calling on Reserves and A Tunnel restore nothing and score 0 (scoring email). Kept apart from the Recreation score. Open the row for each service’s dollars, by region for New Green Watershed and Delta-wide for Eco Machine.',
    children: [
      ...(economy.children ?? []).map((service) => adapt(service, { edge: 'refines' })),
      qualitativeRow('bk-rec-economy-infrastructure', 'recreation'),
    ],
  })
}

function recreationTree(): CriterionNode {
  return adapt(node('recreation'), {
    children: [
      thresholdRow(
        'rec-salinity',
        'Salinity thresholds',
        'Each activity is scored on its proportion of days over its salinity threshold: day use & boating 1,000 µS/cm, birding 2,640, waterfowl hunting 3,600, angling 9,130. One point per percentage point against Business as Usual (CalSim’s, for Calling on Reserves and A Tunnel), ±5 at five or more. The mean of the four, today and with sea level rise, is half of the Recreation score. Open the row for each activity’s days over the threshold with its score beside it.',
      ),
      thresholdRow(
        'rec-temperature',
        'Temperature thresholds',
        'The same construction against water temperature: 19 °C for day use & boating, > 20 °C birding, 23 °C waterfowl, 18.4 / 22.3 °C angling, < 18 °C cold-water day use. The mean of the five activities, today and with sea level rise, is the other half of the Recreation score.',
      ),
      habitatRestoration(),
      recreationEconomy(),
    ],
  })
}

// ---------- Environmental Justice ----------

/** EJ's places are the Delta Vulnerability Index classes of its 49 drinking-water points. */
const EJ_CLASSES: Facet[] = [
  { key: 'all', label: 'All 49 points' },
  { key: 'moderate', label: 'Moderate vulnerability · 10' },
  { key: 'high', label: 'High vulnerability · 36' },
  { key: 'highest', label: 'Highest vulnerability · 3' },
]

const S = (run: number, wet: number, dry: number) => ({ run, wet, dry })

/** The report's drinking-water scores by class and season (Tables 12 and 15). */
const DRINKING_SCORES = byPlacePeriod({
  bau: { all: S(0, 0, 0), moderate: S(0, 0, 0), high: S(0, 0, 0) },
  em: { all: S(2, 2, 1), moderate: S(2, 4, 2), high: S(2, 2, 1) },
  ngw: { all: S(2, 2, 0), moderate: S(2, 4, 1), high: S(2, 2, 1) },
  bf: { all: S(0, -1, 0), moderate: S(1, 2, 1), high: S(0, -1, 0) },
  cor: { all: S(-2, -4, 0), moderate: S(-5, -5, 2), high: S(-1, -3, 0) },
  tunnel: { all: S(-3, -5, 0), moderate: S(-5, -5, 2), high: S(-3, -5, 0) },
})

function ejTree(): CriterionNode {
  const classNode = (key: string) => node(`ej-drinking-${key}`)
  const keys = ['all', 'moderate', 'high', 'highest']
  const exceedance: CriterionNode = {
    ...adapt(classNode('all')),
    id: 'bk-ej-drinking-pct',
    label: 'Readings over 1,050 µS/cm',
    edge: 'derives',
    places: EJ_CLASSES,
    values: merge(...keys.map((key) => atPlace(classNode(key).values, key))),
    note: 'The share of daily readings at or above 1,050 µS/cm, the drinking-water threshold, at the 49 SAFER drinking-water points: all together or by Delta Vulnerability Index class. The highest-vulnerability class never exceeds it in any scenario.',
    slr: classNode('all').slr && {
      ...classNode('all').slr!,
      places: EJ_CLASSES,
      periods: relabel(classNode('all').slr!.periods ?? [], {}),
      values: merge(...keys.map((key) => atPlace(classNode(key).slr?.values ?? {}, key))),
    },
  }
  const drinking: CriterionNode = {
    ...adapt(node('ej-drinking')),
    places: EJ_CLASSES,
    values: DRINKING_SCORES,
    note: 'One point per percentage point of readings over 1,050 µS/cm against Business as Usual, ±5 at five or more. Scored for all 49 points and for the moderate and high classes; the highest class is always 0% and has no score. Only the whole-run, all-points score enters the EJ criterion (Oct 2026); the seasonal and class scores are the report’s.',
    children: [exceedance],
  }
  const waterAge = node('ej-waterage')
  const days = node('ej-waterage-days')
  const areas: CriterionNode[] = days.places.map((place) => {
    const values: Partial<Record<ScenarioKey, SliceValues>> = {}
    for (const [scenario, series] of Object.entries(days.values))
      values[scenario as ScenarioKey] = {
        [sliceKey(ANY, ANY)]: series?.[sliceKey(place.key, ANY)] ?? null,
      }
    return {
      ...adapt(days),
      id: `bk-ej-waterage-${place.key}`,
      label: place.label,
      level: 'entity',
      places: [{ key: ANY, label: 'Not broken out' }],
      values,
      note: 'Change in average water age (days) against Business as Usual during the months with water at or above 19 °C: Oct 2018, May – Oct 2019 and May – Oct 2020. Older water favours algal blooms.',
    }
  })
  return adapt(node('environmentalJustice'), {
    children: [
      drinking,
      adapt(node('ej-flood'), {
        children: [qualitativeRow('bk-ej-flood-judgement', 'environmentalJustice')],
      }),
      {
        ...adapt(waterAge),
        entityNoun: undefined,
        note: `${waterAge.note} Open the row for the change in water age at each of the five hotspot areas.`,
        children: areas,
      },
    ],
  })
}

// ---------- Economy ----------

/**
 * One score shared by the three metrics, the same in both water years and both
 * climates (v16). The scores carry the water years anyway so the When control
 * reaches the salinity rows beneath them.
 */
const WATER_YEARS: Facet[] = relabel(
  [
    { key: '2019', label: '' },
    { key: '2020', label: '' },
  ],
  {},
)

/** Economy's score for New Green Watershed at 25%, 50% and 100% wetland (v16). */
const ECONOMY_NGW_LEVELS: [number, number, number] = [-3, -4, -5]

/**
 * The report gives land conversion once per restoration level, as three rows that
 * each hold New Green Watershed alone. Here they are one row: its 50% value in the
 * column, and all three as levels the table can open into.
 */
function landConversion(metricId: string): CriterionNode {
  const base = node(metricId)
  const level = (key: string) =>
    (base.children ?? []).find((child) => child.id === `${metricId}-${key}`)
  const at = (key: string) => level(key)?.values.ngw?.[sliceKey(ANY, ANY)] ?? null
  const half = level('half')
  if (!half) throw new Error(`No 50/50 restoration level under ${metricId}`)
  // A change against Business as Usual, which converts nothing: its zero is the baseline.
  const values = {
    ngw: { [sliceKey(ANY, ANY)]: at('half') },
    bau: { [sliceKey(ANY, ANY)]: 0 },
  }
  return adapt(half, {
    id: `bk-${metricId}-land`,
    edge: 'measures',
    values,
    ngwLevels: [at('quarter'), at('half'), at('full')],
    // Only New Green Watershed converts farmland at these scales; Eco Machine's small
    // farmed share of Suisun Marsh is not broken out here.
    notApplicable: ['bf', 'cor', 'tunnel'],
    forthcomingFor: ['em'],
    note: 'New Green Watershed’s change from converting farmland to wetland, at 25%, 50% and 100% wetland restoration. The 50% level is the one the score uses. Land conversion is the same with sea level rise.',
    slr: half.slr && { ...half.slr, values },
  })
}

/**
 * Economy's jobs from salinity alone are fractions of a job (−0.01, at most about
 * half a job). The team counts these as no change, so they show as whole jobs: 0.
 */
function wholeJobs(child: CriterionNode): CriterionNode {
  if (child.unit !== 'jobs') return child
  const round = (values: CriterionNode['values']) =>
    Object.fromEntries(
      Object.entries(values).map(([scenario, slices]) => [
        scenario,
        Object.fromEntries(
          Object.entries(slices ?? {}).map(([slice, v]) => [
            slice,
            typeof v === 'number' ? Math.round(v) || 0 : v,
          ]),
        ),
      ]),
    ) as CriterionNode['values']
  return {
    ...child,
    values: round(child.values),
    slr: child.slr && { ...child.slr, values: round(child.slr.values) },
  }
}

function economyTree(): CriterionNode {
  const metric = (id: string) => {
    const base = node(id)
    return adapt(base, {
      periods: WATER_YEARS,
      ngwLevels: ECONOMY_NGW_LEVELS,
      children: [
        ...(base.children ?? [])
          .filter((child) => child.edge !== 'refines')
          .map((child) => adapt(wholeJobs(child))),
        landConversion(id),
      ],
    })
  }
  return adapt(node('economy'), {
    periods: WATER_YEARS,
    ngwLevels: ECONOMY_NGW_LEVELS,
    note: `${node('economy').note} New Green Watershed uses 50% wetland restoration (−4; −3 at 25%, −5 at 100%).`,
    children: [metric('econ-revenue'), metric('econ-jobs'), metric('econ-value')],
  })
}

// ---------- Eco-cultural ----------

/**
 * A qualitative row under a scored metric, in the team's steps. None is published
 * yet, so every scenario reads as forthcoming until `steps` is filled in.
 */
function qualitativeRow(id: string, team: CriterionNode['team']): CriterionNode {
  return {
    id,
    label: id,
    level: 'entity',
    team,
    edge: 'measures',
    provenance: 'unscored',
    unit: 'score',
    betterHigher: true,
    note: 'A judgement the team gives in steps rather than as a score.',
    places: NOT_BROKEN_OUT,
    periods: NOT_BROKEN_OUT,
    values: {},
    steps: {},
  }
}

/**
 * Eco-cultural's three described metrics, as the breakout design gives them (Oct
 * 2026): steps of gain per scenario, and the conditions behind each, marked where a
 * scenario puts them in place. The team's report does not assign these to scenarios
 * itself, so confirm them with the team before publishing. Names are in labels.ts.
 */
const EC_STEPS: Record<string, Partial<Record<ScenarioKey, number>>> = {
  access: { em: 1, ngw: 4, bf: 0, cor: 0, tunnel: 0 },
  tek: { em: 1, ngw: 4, bf: 0, cor: 0, tunnel: 0 },
  sovereignty: { em: 1, ngw: 4, bf: 0, cor: 2, tunnel: 0 },
}

const EC_CONDITIONS: Record<string, { key: string; metBy: ScenarioKey[] }[]> = {
  // Strongest form of access first: the order is the team's finding.
  access: [
    { key: 'ownership', metBy: ['em', 'ngw'] },
    { key: 'landTrust', metBy: ['em', 'ngw'] },
    { key: 'conservationEasement', metBy: ['em', 'ngw'] },
    { key: 'culturalEasement', metBy: ['em', 'ngw'] },
    { key: 'mou', metBy: ['em', 'ngw'] },
  ],
  tek: [
    { key: 'privacy', metBy: ['em', 'ngw'] },
    { key: 'unrestrictedAccess', metBy: ['em', 'ngw'] },
    { key: 'siteAccess', metBy: ['em', 'ngw'] },
    { key: 'stewardshipGroups', metBy: ['em', 'ngw'] },
  ],
  sovereignty: [
    { key: 'dataSovereignty', metBy: [] },
    { key: 'education', metBy: [] },
    { key: 'foodSovereignty', metBy: [] },
    { key: 'waterRights', metBy: ['em', 'ngw', 'cor'] },
  ],
}

/** One of Eco-cultural's described metrics: its steps, and its conditions beneath. */
function describedMetric(metric: CriterionNode): CriterionNode {
  const key = metric.id.replace(/^ec-/, '')
  return adapt(metric, {
    steps: EC_STEPS[key] ?? {},
    children: (EC_CONDITIONS[key] ?? []).map((condition) => ({
      id: `bk-${metric.id}-${condition.key}`,
      label: condition.key,
      level: 'entity',
      team: 'ecoCultural',
      edge: 'measures',
      provenance: 'unscored',
      unit: 'score',
      betterHigher: true,
      note: 'A condition behind this metric, marked where a scenario puts it in place.',
      places: NOT_BROKEN_OUT,
      periods: NOT_BROKEN_OUT,
      values: {},
      metBy: condition.metBy,
    })),
  })
}

function ecoCulturalTree(): CriterionNode {
  const restoration = node('ec-restoration')
  return adapt(node('ecoCultural'), {
    children: [
      adapt(restoration, {
        label: 'Restoration',
        unit: 'score',
        places: [{ key: ANY, label: 'Not broken out' }],
        inferredSlices: undefined,
        values: flat({ bau: 0, em: 2, ngw: 5, bf: 0, cor: 0, tunnel: 0 }),
        sources: [SLIDES, ...sourcesFor('ec-restoration')],
        note: 'Slide 55 ranks restored acres: Eco Machine +2, New Green Watershed +5, every other scenario 0. Open the row for the acres themselves, by habitat type.',
        children: [
          adapt(restoration, {
            id: 'bk-ec-restoration-acres',
            label: 'Restored acres, all habitats',
            children: undefined,
            level: 'entity',
          }),
          ...(restoration.children ?? []).map((child) => adapt(child)),
        ],
      }),
      ...(node('ecoCultural').children ?? []).slice(1).map(describedMetric),
    ],
  })
}

/** The five teams, in the order the tab bar shows them. */
export const BREAKOUT_TREE: CriterionNode[] = [
  ecologyTree(),
  recreationTree(),
  ejTree(),
  economyTree(),
  ecoCulturalTree(),
]

// Register every row so the shared value lookup, the cell detail and the maps can
// find them by id like any pivot node.
function register(n: CriterionNode) {
  n.label = MEASURE_LABELS[n.id] ?? n.label
  NODE_INDEX.set(n.id, n)
  n.children?.forEach(register)
}
BREAKOUT_TREE.forEach(register)

/** Whether a row is a ranking score rather than a narrative metric: it is scored. */
export const isRanked = (n: CriterionNode) => n.provenance !== 'unscored' && n.edge !== 'unscored'
