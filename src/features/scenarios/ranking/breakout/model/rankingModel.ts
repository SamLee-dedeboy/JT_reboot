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
import {
  EJ_DRINKING_SCORES,
  EJ_DRINKING_SCORES_SLR,
  EJ_DRINKING_SHARES,
  EJ_DRINKING_SHARES_SLR,
} from './ejDrinkingTable'
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

/** The Ecology tab of the ranking table workbook the team filled in, Nov 2026. */
const ECOLOGY_WORKBOOK_SOURCE: Source = {
  doc: 'data',
  where: 'Ranking table workbook, Ecology tab, Nov 2026',
  quote: 'Values the Ecology team entered in the ranking table sheet.',
}

/** A row the team reports the same under sea level rise, with its children. */
function sameUnderSlr(row: CriterionNode): CriterionNode {
  return {
    ...row,
    sources: [ECOLOGY_WORKBOOK_SOURCE, ...(row.sources ?? [])],
    slr: {
      values: row.values,
      note: 'The Ecology team reports the same value under sea level rise.',
      sources: [ECOLOGY_WORKBOOK_SOURCE],
    },
    children: row.children?.map(sameUnderSlr),
  }
}

/** A Delta-wide, whole-period score on every period tab; the regions have none. */
function speciesScore(by: Partial<Record<ScenarioKey, number>>, periods: string[]) {
  const out: Partial<Record<ScenarioKey, SliceValues>> = {}
  for (const [scenario, value] of Object.entries(by))
    out[scenario as ScenarioKey] = Object.fromEntries(
      periods.map((period) => [sliceKey('delta', period), value]),
    )
  return out
}

/** Food webs with the team's acres as its sheet gives them: the baseline reads zero. */
function foodWebs(): CriterionNode {
  const row = adapt(node('eco-foodweb'), { inferredFor: undefined })
  return {
    ...row,
    children: row.children?.map((acres) => ({ ...acres, values: addedToBaseline(acres.values) })),
  }
}

function ecologyTree(): CriterionNode {
  const niche = node('eco-niche')
  // The team reports Calling on Reserves and A Tunnel Delta-wide only.
  const regions = niche.places.map((place) => place.key).filter((place) => place !== 'delta')
  const species = (niche.children ?? []).map((base) => {
    const key = base.id.replace('eco-niche-', '') as EcologySpeciesKey
    return adapt(
      base,
      {
        values: speciesValues(key, base.values),
        ranks: speciesRanks(key),
        note: `${base.note.replace(/; A Tunnel was run only[^.]*\./, '.')} Calling on Reserves and A Tunnel are Ecology’s 27 Oct 2026 rerun, Delta-wide only and read against its own CalSim Baseline, not the Business as Usual column.`,
        sources: [...sourcesFor(base.id), SLIDES, ECOLOGY_RERUN_SOURCE],
        // For an invasive species, less suitable habitat is the better outcome.
        betterHigher: !INVASIVE.has(key),
        notApplicableAt: { cor: regions, tunnel: regions },
        // Their Delta-wide numbers under sea level rise are still to come.
        forthcomingFor: ['cor', 'tunnel'],
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
    note: 'This score is the Ecology team’s own, reported Delta-wide for the whole period, so it reads the same on each period tab. Open the row to see each species’ value and rank: the slides rank each species on its proportion of suitable days (+1 per percentage point against Business as Usual, reversed for largemouth bass, overbite clam and Brazilian waterweed). The species ranks are Delta-wide; regions carry values only. Calling on Reserves and A Tunnel come from Ecology’s 27 Oct 2026 rerun against its own CalSim Baseline; their species ranks are ours, the same rule applied to that table.',
    values: speciesScore({ bau: 0, em: 0.34, ngw: -0.08, bf: 0.08, cor: -1.57, tunnel: 1.1 }, [
      '2019',
      '2020',
    ]),
    notApplicableAt: Object.fromEntries(
      (['bau', 'em', 'ngw', 'bf', 'cor', 'tunnel'] as ScenarioKey[]).map((scenario) => [
        scenario,
        niche.places.map((place) => place.key).filter((place) => place !== 'delta'),
      ]),
    ),
    sources: [ECOLOGY_WORKBOOK_SOURCE, SLIDES, ...sourcesFor('eco-niche-')],
    slr: niche.slr && {
      ...niche.slr,
      periods: niche.slr.periods && relabel(niche.slr.periods, ECOLOGY_PERIOD_LABEL),
      values: speciesScore({ bau: 0, em: 1.1, ngw: 1.5, bf: 0.39, cor: -2.82, tunnel: -1.07 }, [
        '2019',
        '2020',
        'both',
      ]),
      sources: [ECOLOGY_WORKBOOK_SOURCE, ...(niche.slr.sources ?? [])],
    },
    children: species,
  }
  const root = node('ecology')
  return adapt(root, {
    provenance: 'reported',
    note: 'The Ecology team’s own criterion score, from the ranking table workbook. How Landscape, Food webs and Species suitability combine is still to be published.',
    sources: [ECOLOGY_WORKBOOK_SOURCE],
    values: flat({ bau: 0, em: 1.33, ngw: 3.1, bf: 0, cor: -0.33, tunnel: 0.33 }),
    slr: {
      values: flat({ bau: 0, em: 1.7, ngw: 3.8, bf: 0, cor: -0.7, tunnel: -0.3 }),
      note: 'The Ecology team’s own criterion score under sea level rise, from the ranking table workbook.',
      sources: [ECOLOGY_WORKBOOK_SOURCE],
    },
    children: [
      sameUnderSlr(adapt(node('eco-habitat'))),
      // The team's sheet now gives these zeros itself, so none of them is ours.
      sameUnderSlr(foodWebs()),
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

/** Show the workbook's shared day-use/boating result as two identical public rows. */
function splitDayUseAndBoating(rows: CriterionNode[]): CriterionNode[] {
  return rows.flatMap((row) => {
    if (!row.id.endsWith('-dayUseBoating')) return [row]

    const copyAs = (activityId: string, label: string): CriterionNode => ({
      ...row,
      id: row.id.replace(/dayUseBoating$/, activityId),
      label,
      children: row.children?.map((child) => ({
        ...child,
        id: child.id.replace('dayUseBoating', activityId),
      })),
    })

    return [copyAs('dayUse', 'Day use'), copyAs('boating', 'Boating')]
  })
}

function thresholdRow(id: string, label: string, note: string): CriterionNode {
  const base = node(id)
  return adapt(base, {
    label,
    note,
    entityNoun: 'activity',
    children: splitDayUseAndBoating((base.children ?? []).map(activity)),
  })
}

const NOT_BROKEN_OUT: Facet[] = [{ key: ANY, label: 'Not broken out' }]

/** The Recreation tab of the ranking table workbook the team filled in, Nov 2026. */
const RECREATION_WORKBOOK_SOURCE: Source = {
  doc: 'data',
  where: 'Ranking table workbook, Recreation tab, Nov 2026',
  quote: 'Values the Recreation team entered in the ranking table sheet.',
}

/** Habitat restoration and recreation economy score alike in the team's sheet. */
const REC_RESTORATION_SCORES = { bau: 0, em: 3, ngw: 5 }

/** A row the team reports the same under sea level rise, with its children. */
function recSameUnderSlr(row: CriterionNode): CriterionNode {
  return {
    ...row,
    slr: {
      values: row.values,
      ranks: row.ranks,
      note: 'The Recreation team reports the same value under sea level rise.',
      sources: [RECREATION_WORKBOOK_SOURCE],
    },
    children: row.children?.map(recSameUnderSlr),
  }
}

/**
 * The team's restored acres and dollars are what restoration adds on top of Business
 * as Usual's protected land, so they read as they stand: its baseline here is zero.
 */
function addedToBaseline(values: CriterionNode['values']): CriterionNode['values'] {
  const bau = Object.keys(values.bau ?? {}).map((slice) => [slice, 0])
  return { ...values, bau: Object.fromEntries(bau) }
}

/**
 * Habitat restoration as a ranking score, with Recreation's acres beneath it: +3 for
 * Eco Machine and +5 for New Green Watershed. The scenarios with no acres attached
 * are N/A here; Infrastructure impact scores them instead.
 */
function habitatRestoration(): CriterionNode {
  const acres = node('rec-restoration')
  return adapt(acres, {
    label: 'Habitat Restoration',
    edge: 'beside',
    unit: 'score',
    places: NOT_BROKEN_OUT,
    values: flat(REC_RESTORATION_SCORES),
    notApplicable: ['bf', 'cor', 'tunnel'],
    ngwLevels: [5, 5, 5],
    sources: [RECREATION_WORKBOOK_SOURCE, ...sourcesFor('rec-restoration')],
    note: 'Recreation scores restored acres added on top of Business as Usual’s protected areas: Eco Machine +3 and New Green Watershed +5. Bolster & Fortify, Calling on Reserves and A Tunnel have no acres attached, so they are N/A here and scored under Infrastructure impact. Kept apart from the Recreation score. Open the row for the acres Recreation reports.',
    children: [
      adapt(acres, {
        id: 'bk-rec-restoration-acres',
        label: 'Restored acres',
        level: 'entity',
        edge: 'measures',
        values: addedToBaseline(acres.values),
        notApplicable: ['bf', 'cor', 'tunnel'],
      }),
    ],
  })
}

/**
 * Recreation economy as a ranking score (Recreation's component D), with each
 * service's dollars and score beneath it: +3 for Eco Machine and +5 for New Green
 * Watershed. The scenarios with no acres attached are N/A here; Infrastructure impact
 * scores them instead.
 */
function recreationEconomy(): CriterionNode {
  const economy = node('rec-economy')
  return adapt(economy, {
    edge: 'beside',
    unit: 'score',
    places: NOT_BROKEN_OUT,
    values: flat(REC_RESTORATION_SCORES),
    notApplicable: ['bf', 'cor', 'tunnel'],
    ngwLevels: [5, 5, 5],
    entityNoun: 'service',
    sources: [RECREATION_WORKBOOK_SOURCE, ...sourcesFor('rec-economy')],
    note: 'The yearly value of four recreation services on restored land, added on top of Business as Usual’s protected areas: Eco Machine +3 and New Green Watershed +5. Day use and boating share one amenity/recreation row. Bolster & Fortify, Calling on Reserves and A Tunnel have no acres attached, so they are N/A here and scored under Infrastructure impact. Kept apart from the Recreation score. Open the row for each service’s dollars, by region for New Green Watershed and Delta-wide for Eco Machine.',
    children: [
      ...(economy.children ?? []).map((service) =>
        adapt(service, {
          edge: 'refines',
          values: addedToBaseline(service.values),
          notApplicable: ['bf', 'cor', 'tunnel'],
          notApplicableAt: { em: ['northDelta', 'southDelta'] },
        }),
      ),
      {
        ...qualitativeRow('bk-rec-economy-infrastructure', 'recreation'),
        steps: { bau: 0, bf: -1, cor: -1, tunnel: -3 },
        notApplicable: ['em', 'ngw'],
      },
    ],
  })
}

/**
 * Recreation reports restoration levels only for restoration and its recreation
 * economy; every other row comes from the one New Green Watershed water run, so its
 * value is the same at 25%, 50% and 100% wetland.
 */
function sameAtAllLevels(row: CriterionNode): CriterionNode {
  return {
    ...row,
    levelsSame: row.ngwLevels ? undefined : true,
    children: row.children?.map(sameAtAllLevels),
  }
}

function recreationTree(): CriterionNode {
  return sameAtAllLevels(recreationRoot())
}

function recreationRoot(): CriterionNode {
  return adapt(node('recreation'), {
    children: [
      thresholdRow(
        'rec-salinity',
        'Salinity thresholds',
        'Each activity is scored on its proportion of days over its salinity threshold: day use and boating share the same 1,000 µS/cm source values, birding 2,640, waterfowl hunting 3,600, and angling 9,130. Day use and boating are shown as separate rows with their shared values repeated. One point per percentage point against Business as Usual (CalSim’s, for Calling on Reserves and A Tunnel), ±5 at five or more. The reported mean still treats the shared day-use/boating result as one of four inputs; today and with sea level rise, it is half of the Recreation score. Open the row for each activity’s days over the threshold with its score beside it.',
      ),
      thresholdRow(
        'rec-temperature',
        'Temperature thresholds',
        'The same construction against water temperature: day use and boating share the same 19 °C source values and are shown as separate repeated rows, > 20 °C birding, 23 °C waterfowl, 18.4 / 22.3 °C angling, and < 18 °C cold-water day use. The reported mean still treats the shared day-use/boating result as one of five inputs; today and with sea level rise, it is the other half of the Recreation score.',
      ),
      recSameUnderSlr(habitatRestoration()),
      recSameUnderSlr(recreationEconomy()),
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

/** EJ reports water years, not the wet and dry seasons its base tree still carries. */
const EJ_PERIODS: Facet[] = relabel(
  [
    { key: 'run', label: '' },
    { key: '2019', label: '' },
    { key: '2020', label: '' },
  ],
  {},
)

/** The +30% outflow run covers a different span, so it has no value for these water years. */
const EJ_OUTFLOW_NO_WATER_YEARS = { more: ['2019', '2020'] }

/** The Env Justice tab of the ranking table workbook the team filled in, Nov 2026. */
const EJ_WORKBOOK_SOURCE: Source = {
  doc: 'data',
  where: 'Ranking table workbook, Env Justice tab, Nov 2026',
  quote: 'Values the Environmental Justice team entered in the ranking table sheet.',
}

function ejTree(): CriterionNode {
  const classNode = (key: string) => node(`ej-drinking-${key}`)
  const exceedance: CriterionNode = {
    ...adapt(classNode('all')),
    id: 'bk-ej-drinking-pct',
    label: 'Readings over 1,050 µS/cm',
    edge: 'derives',
    // Business as Usual's shares are not in the team's sheet, so the row shows the sheet's.
    asPublished: true,
    places: EJ_CLASSES,
    periods: EJ_PERIODS,
    notApplicableIn: EJ_OUTFLOW_NO_WATER_YEARS,
    values: byPlacePeriod(EJ_DRINKING_SHARES),
    sources: [EJ_WORKBOOK_SOURCE, ...(classNode('all').sources ?? [])],
    note: 'The share of daily readings at or above 1,050 µS/cm, the drinking-water threshold, at the 49 SAFER drinking-water points: all together or by Delta Vulnerability Index class. The highest-vulnerability class never exceeds it in any scenario.',
    slr: {
      places: EJ_CLASSES,
      periods: EJ_PERIODS,
      values: byPlacePeriod(EJ_DRINKING_SHARES_SLR),
      note: 'With sea level rise, against its own Business as Usual.',
      sources: [EJ_WORKBOOK_SOURCE],
    },
  }
  const drinking: CriterionNode = {
    ...adapt(node('ej-drinking')),
    places: EJ_CLASSES,
    periods: EJ_PERIODS,
    notApplicableIn: EJ_OUTFLOW_NO_WATER_YEARS,
    values: byPlacePeriod(EJ_DRINKING_SCORES),
    sources: [EJ_WORKBOOK_SOURCE, ...(adapt(node('ej-drinking')).sources ?? [])],
    note: 'One point per percentage point of readings over 1,050 µS/cm against Business as Usual (CalSim’s, for Calling on Reserves and A Tunnel), ±5 at five or more. Scored for all 49 points and for each class; the highest class is always 0%, so it scores 0.',
    slr: {
      places: EJ_CLASSES,
      periods: EJ_PERIODS,
      values: byPlacePeriod(EJ_DRINKING_SCORES_SLR),
      note: 'With sea level rise, against its own Business as Usual.',
      sources: [EJ_WORKBOOK_SOURCE],
    },
    children: [exceedance],
  }
  const waterAge = node('ej-waterage')
  const days = node('ej-waterage-days')
  // The team is re-running the days at each area, so the sheet leaves them empty (Nov 2026).
  const areas: CriterionNode[] = days.places.map((place) => ({
    ...adapt(days),
    id: `bk-ej-waterage-${place.key}`,
    label: place.label,
    level: 'entity',
    places: [{ key: ANY, label: 'Not broken out' }],
    values: {},
    forthcoming: true,
    sources: [EJ_WORKBOOK_SOURCE],
    note: 'Change in average water age (days) against Business as Usual during the months with water at or above 19 °C: Oct 2018, May – Oct 2019 and May – Oct 2020. Older water favours algal blooms. The team is re-running these values.',
  }))
  const flood = node('ej-flood')
  return adapt(node('environmentalJustice'), {
    values: flat({ bau: 0, em: 0, ngw: 1, bf: 0, cor: 0, tunnel: 0 }),
    // Sea level rise waits on the water-age re-run.
    forthcoming: true,
    note: 'The unweighted mean of three metric scores, rounded to a whole point: drinking water (whole period), flood risk, and water age.',
    sources: [EJ_WORKBOOK_SOURCE],
    children: [
      drinking,
      adapt(flood, {
        slr: {
          values: flood.values,
          note: 'The Environmental Justice team reports the same value under sea level rise.',
          sources: [EJ_WORKBOOK_SOURCE],
        },
        children: [
          {
            ...qualitativeRow('bk-ej-flood-judgement', 'environmentalJustice'),
            note: 'The team’s judgement of the change in flood risk: one arrow for a slight decrease, two for a moderate decrease, three for a significant decrease.',
            steps: { bau: 0, em: 0, ngw: 3, bf: 2, cor: 0, tunnel: 1 },
          },
        ],
      }),
      {
        ...adapt(waterAge),
        entityNoun: undefined,
        values: flat({ bau: 0, em: -2, ngw: -3, bf: -1, cor: 0, tunnel: 0 }),
        // Sea level rise waits on the water-age re-run.
        forthcoming: true,
        note: 'Water at or above 19 °C and older than 14 days is a harmful-algal-bloom proxy across five hotspot areas. These are the team’s scores; the days at each area are being re-run.',
        sources: [EJ_WORKBOOK_SOURCE],
        children: areas,
      },
    ],
  })
}

// ---------- Economy ----------

/**
 * The team scores each metric on its dry-year net change, the same in both climates
 * (v20). The scores carry the water years anyway so the When control reaches the
 * salinity rows beneath them.
 */
const WATER_YEARS: Facet[] = relabel(
  [
    { key: '2019', label: '' },
    { key: '2020', label: '' },
  ],
  {},
)

type NgwLevels = [number, number, number]

/** Each metric's score for New Green Watershed at 25%, 50% and 100% wetland (v20). */
const ECONOMY_METRIC_NGW_LEVELS: Record<string, NgwLevels> = {
  'econ-revenue': [-3, -4, -5],
  'econ-jobs': [-4, -4, -5],
  'econ-value': [-3, -3, -5],
}

/** The team gives no combined score, so the criterion row is the metrics' rounded mean. */
const ECONOMY_NGW_LEVELS: NgwLevels = [-3, -4, -5]

/** Land conversion and carbon are reported Delta-wide only, so a zone has no value for them. */
const ECONOMY_ZONE_KEYS = ['north', 'central', 'south', 'west']
const DELTA_WIDE_ONLY = { em: ECONOMY_ZONE_KEYS, ngw: ECONOMY_ZONE_KEYS }

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
    em: level('em')?.values.em ?? {},
    bau: { [sliceKey(ANY, ANY)]: 0 },
  }
  return adapt(half, {
    id: `bk-${metricId}-land`,
    edge: 'measures',
    values,
    ngwLevels: [at('quarter'), at('half'), at('full')],
    // Only Eco Machine and New Green Watershed convert farmland.
    notApplicable: ['bf', 'cor', 'tunnel'],
    notApplicableAt: DELTA_WIDE_ONLY,
    note: 'The change from converting farmland to wetland: Eco Machine’s tidal wetland in Suisun Marsh and Franks Tract, and New Green Watershed at 25%, 50% and 100% wetland restoration, each including Eco Machine’s footprint. The 50% level is the one the score uses. Land conversion is the same with sea level rise.',
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
      ngwLevels: ECONOMY_METRIC_NGW_LEVELS[id],
      children: [
        ...(base.children ?? [])
          .filter((child) => child.id === `${id}-salinity`)
          .map((child) =>
            // The +30% outflow run is one dry year (2021), reported Delta-wide only.
            adapt(wholeJobs(child), {
              notApplicableAt: { more: ECONOMY_ZONE_KEYS },
              // With no period picked the salinity rows read the wet year, so it reads N/A there too.
              notApplicableIn: { more: [ANY, '2019'] },
            }),
          ),
        wholeJobs(landConversion(id)),
        ...(base.children ?? [])
          .filter((child) => child.id === `${id}-carbon`)
          .map((child) =>
            adapt(child, {
              notApplicable: ['bf', 'cor', 'tunnel'],
              notApplicableAt: DELTA_WIDE_ONLY,
            }),
          ),
      ],
    })
  }
  return adapt(node('economy'), {
    periods: WATER_YEARS,
    ngwLevels: ECONOMY_NGW_LEVELS,
    note: `${node('economy').note} New Green Watershed uses 50% wetland restoration (−4; −3 at 25%, −5 at 100%, each the rounded mean of its metrics).`,
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
  const habitat = (id: string) => {
    const found = restoration.children?.find((child) => child.id === `ec-restoration-${id}`)
    if (!found) throw new Error(`rankingModel: no eco-cultural restoration habitat ${id}`)
    return found
  }
  // A New Green Watershed habitat with no acreage yet; no other scenario restores it.
  const transitional = adapt(habitat('managed'), {
    id: 'bk-ec-restoration-transitional',
    label: 'Transitional habitats',
    values: { ...habitat('managed').values, ngw: { [sliceKey('inDelta', ANY)]: null } },
    forthcomingFor: ['ngw'],
    sources: undefined,
    note: 'The habitat type is confirmed, but its acreage and source are still to be provided.',
  })
  return adapt(node('ecoCultural'), {
    children: [
      adapt(restoration, {
        label: 'Restoration',
        unit: 'score',
        places: [{ key: ANY, label: 'Not broken out' }],
        inferredSlices: undefined,
        values: flat({ bau: 0, em: 2, ngw: 5, bf: 0, cor: 0, tunnel: 0 }),
        sources: [SLIDES, ...sourcesFor('ec-restoration')],
        note: 'Slide 55 ranks restored acres: Eco Machine +2, New Green Watershed +5, every other scenario 0. Open the row for the habitat types and the qualitative functional-flow outcome.',
        children: [
          adapt(habitat('tidal')),
          adapt(habitat('managed')),
          adapt(habitat('rice')),
          transitional,
          adapt(habitat('uplandWetland')),
          adapt(habitat('meadow')),
          adapt(habitat('floodplain')),
          qualitativeRow('bk-ec-restoration-functional-flow', 'ecoCultural'),
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
