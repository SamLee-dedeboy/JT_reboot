// Every word the breakout page shows, in one place to edit.
//
// MEASURE_LABELS names the ranking scores and the entities under them. A name here
// is used everywhere the measure appears: the table row, the rail's checkbox and
// the map's tab. Delete a line to fall back to the name in the data.
//
// Two rules the page relies on:
//   - A species name ending ", juvenile" or ", adult" is shown as the species with
//     a life-stage chip, and the map groups the stages under one tab. Keep that
//     ending to keep the chip.
//   - The team-level names (bk-ecology, …) are also the team's "the score" row.
//
// UI holds the rest: rail headings, buttons, legend, notes and the words a cell
// shows when it has no number.

export const MEASURE_LABELS: Record<string, string> = {
  // Ecology
  'bk-ecology': 'Ecology',
  'bk-eco-habitat': 'Landscape',
  'bk-eco-habitat-acres': 'Added wetland',
  'bk-eco-foodweb': 'Food webs',
  'bk-eco-foodweb-managed': 'Managed wetland',
  'bk-eco-foodweb-tidal': 'Added wetland',
  'bk-eco-foodweb-wetsoil': 'Wet-soil agriculture',
  'bk-eco-species': 'Species suitability',
  'bk-eco-niche-longfinJuv': 'Longfin smelt, juvenile',
  'bk-eco-niche-longfinAdult': 'Longfin smelt, adult',
  'bk-eco-niche-chinook': 'Chinook salmon, juvenile',
  'bk-eco-niche-stripedBassJuv': 'Striped bass, juvenile',
  'bk-eco-niche-stripedBassAdult': 'Striped bass, adult',
  'bk-eco-niche-largemouthBass': 'Largemouth bass',
  'bk-eco-niche-overbiteClam': 'Overbite clam, juvenile',
  'bk-eco-niche-egeria': 'Brazilian waterweed',
  'bk-eco-conceptual': 'Conceptual models',

  // Recreation
  'bk-recreation': 'Recreation',
  'bk-rec-salinity': '% of days under Salinity Stress',
  'bk-rec-salinity-dayUseBoating': 'Day use and boating',
  'bk-rec-salinity-birding': 'Birding',
  'bk-rec-salinity-waterfowl': 'Waterfowl hunting',
  'bk-rec-salinity-angling': 'Angling',
  'bk-rec-temperature': '% of days under Temperature Stress',
  'bk-rec-temperature-dayUseBoating': 'Day use and boating',
  'bk-rec-temperature-birding': 'Birding',
  'bk-rec-temperature-waterfowl': 'Waterfowl hunting',
  'bk-rec-temperature-angling': 'Angling',
  'bk-rec-temperature-dayUseCold': 'Cold-water day use',
  'bk-rec-restoration': 'Habitat Restoration',
  'bk-rec-restoration-acres': 'Restored acres',
  'bk-rec-economy': 'Recreation economy',

  // Environmental justice
  'bk-environmentalJustice': 'Environmental Justice',
  'bk-ej-drinking': 'Salinity impacts to in-Delta drinking water',
  'bk-ej-drinking-pct': '% of days with unsuitable water quality',
  'bk-ej-flood': 'Flood risk attenuation',
  'bk-ej-waterage': 'Water age + temperature',
  'bk-ej-waterage-suisun': 'Suisun Marsh',
  'bk-ej-waterage-franksTract': 'Franks Tract',
  'bk-ej-waterage-southDelta': 'South Delta',
  'bk-ej-waterage-mcCormackWilliamson': 'McCormack-Williamson Tract',
  'bk-ej-waterage-lindseyCache': 'Lindsey-Cache Slough',

  // Economy
  'bk-economy': 'Economy',
  'bk-econ-revenue': 'Annual gross agricultural revenues',
  'bk-econ-revenue-salinity': 'Salinity effects across the Delta',
  'bk-econ-revenue-full': 'Full wetland restoration',
  'bk-econ-revenue-half': 'Medium restoration · 50/50 wetland and rice',
  'bk-econ-revenue-quarter': 'Low restoration · 25/75 wetland and rice',
  'bk-econ-jobs': 'Agriculture-supported Jobs',
  'bk-econ-jobs-salinity': 'Salinity effects across the Delta',
  'bk-econ-jobs-full': 'Full wetland restoration',
  'bk-econ-jobs-half': 'Medium restoration · 50/50 wetland and rice',
  'bk-econ-jobs-quarter': 'Low restoration · 25/75 wetland and rice',
  'bk-econ-value': 'Economic value added',
  'bk-econ-value-salinity': 'Salinity effects across the Delta',
  'bk-econ-value-full': 'Full wetland restoration',
  'bk-econ-value-half': 'Medium restoration · 50/50 wetland and rice',
  'bk-econ-value-quarter': 'Low restoration · 25/75 wetland and rice',
  'bk-econ-value-zones': 'Dry-year salinity effects by Delta area',

  // Eco-cultural
  'bk-ecoCultural': 'Eco-cultural',
  'bk-ec-restoration': 'Habitat restoration',
  'bk-ec-restoration-acres': 'Total restored area',
  'bk-ec-restoration-managed': 'Managed wetlands',
  'bk-ec-restoration-rice': 'Wet-soil agriculture (rice)',
  'bk-ec-restoration-tidal': 'Tidal wetlands',
  'bk-ec-restoration-uplandWetland': 'Upland wetlands',
  'bk-ec-restoration-meadow': 'Meadows',
  'bk-ec-restoration-floodplain': 'Floodplains',
  'bk-ec-access': 'Tribal land access',
  'bk-ec-tek': 'Indigenous science & Traditional Ecological Knowledge (TEK)',
  'bk-ec-sovereignty': 'Tribal sovereignty',
}

export const UI = {
  // The sentence over the table.
  comparing: 'Comparing ',
  comparingChange: 'Difference from Business as Usual for ',
  allScenarios: 'all 6 scenarios',
  withSeaLevelRise: 'with sea level rise',
  openingPlaceholder: 'Opening paragraph for this table: awaiting subteam.',

  // The rail.
  seaLevel: 'CONDITIONS',
  current: 'Current',
  seaLevelRise: 'Sea level rise',
  seaLevelNotLoaded: 'This team’s sea-level-rise runs are not loaded yet.',
  scenarios: 'SCENARIOS',
  allOn: 'All',
  baselineLocked:
    'Business as Usual is the baseline every deviation is measured from, so it stays off while deviations are shown.',
  show: 'SHOW',
  absoluteValues: 'Absolute values',
  deviation: 'Deviation from Business as Usual',
  places: 'PLACES',
  allPlaces: 'All together',
  timePeriods: 'TIME PERIODS',
  wholeRun: 'Whole run · Oct 2018 – Dec 2020',
  metrics: 'METRICS',
  /** A team's own row, "Ecology: the score". */
  teamScore: (team: string) => `${team}: the score`,

  // The view switch and legend.
  table: 'Table',
  map: 'Map',
  legendScores: 'Scores',
  legendDetails: 'Details \u2014',
  bestInRow: 'Best in row',
  noValue: 'No value',
  switchedOff: 'scenario switched off',

  // The table.
  rankingHeading: 'Ranking scores · −5 to +5',
  showAsBars: 'Show as bars',
  showValues: 'Show values',
  footnote: 'Open a score to see what it is based on. Click a number for its source.',
  footnotePlaceholder: ' “awaiting subteam” marks a number the team has not published yet.',
  footnoteSeaLevelRise:
    ' These are the sea-level-rise runs, compared with their own Business as Usual.',

  // What a cell shows without a number.
  awaiting: 'awaiting subteam',
  notRun: 'not run',
  /** A row that is one version of New Green Watershed, under the other scenarios. */
  versionOnly: 'NGW only',
  /** A scenario the subteam marks N/A for this row. */
  notApplicable: 'N/A',
  notScored: 'not scored',
  notRunWithSlr: 'not run with SLR',
  noSlrResult: 'no SLR result',
  bothYearsOnly: 'both years only',
  /** A row scored per entity: "per species", "per activity". */
  perEntity: (noun: string) => `per ${noun}`,

  // The map.
  /** The tab for a score's own map, beside its entities' tabs (Recreation, Economy). */
  mapScoreTab: 'The score',
  mapScorePicker: 'Ranking score',
  mapMeasurePicker: 'Measure on the map',
  lifeStagePicker: 'Life stage',

  // A ranking score's info card.
  aboutScore: (score: string) => `How ${score} is ranked`,
  basedOn: 'Based on',
  howScored: 'How it is scored',
} as const

/** Economy's shared score rule (v16 report), the same for all three metrics. */
const ECONOMY_RULE =
  'Each scenario is scored on whichever pathway dominates for it: Business as Usual 0; Calling on Reserves 0 (salinity, very small); Bolster & Fortify −1 and A Tunnel −1 (salinity, small); Eco Machine 0 (land use, little farmland); New Green Watershed −4 (land use; the 50/50 version, −3 at 25/75, −5 all wetland).'
const ECONOMY_RULE_NOTE =
  'The same in both water years and with 2 ft of sea level rise. Calling on Reserves and A Tunnel are compared with their own RMA base run.'

/**
 * What each ranking score is based on and how the team turns that into −5…+5,
 * from the teams' documentation (see ../RANKINGS.md). Shown in the card behind the
 * info button beside the score; a score with no entry has no button.
 */
export const RANKING_DEFINITIONS: Record<string, { basedOn: string; rule: string; note?: string }> =
  {
    // Ecology
    'bk-ecology': {
      basedOn: 'Landscape and Food webs, the two scores that roll up.',
      rule: 'Ecology publishes no single score, so the table shows none until the team sets one.',
      note: 'Species suitability does not feed it.',
    },
    'bk-eco-habitat': {
      basedOn:
        'Accessible aquatic habitat: acres of added tidal wetland (Eco Machine 53,000; New Green Watershed 80,000).',
      rule: '+1 for about every 16,000 acres added against Business as Usual, up to +5.',
    },
    'bk-eco-foodweb': {
      basedOn:
        'A food-web index in acres: (managed wetland − 5,100) × 0.2 + added tidal wetland × 0.4 + (wet-soil agriculture − 17,178) × 0.1.',
      rule: '+1 for about every 16,148 index points against Business as Usual, up to +5.',
    },
    'bk-eco-species': {
      basedOn:
        'Each species’ proportion of days inside its salinity and temperature range, Feb 1 – Jun 1 of WY 2019 (wet) and WY 2020 (dry).',
      rule: '+1 per percentage point against Business as Usual, ±5 at most. Reversed for largemouth bass, overbite clam and Brazilian waterweed, where less habitat is better. Each species is ranked on its own; the ranks are never combined.',
      note: 'Does not feed the Ecology score.',
    },

    // Recreation
    'bk-recreation': {
      basedOn: 'The activities’ salinity and temperature scores.',
      rule: 'Recreation publishes no single score, so the table shows none until the team sets one.',
    },
    'bk-rec-salinity': {
      basedOn:
        'Each activity’s proportion of days over its salinity threshold: day use and boating 1,000 µS/cm, birding 2,640, waterfowl hunting 3,600, angling 9,130.',
      rule: '−1 per percentage point more days over the threshold than Business as Usual, +1 per point fewer; ±5 at five points or more. Each activity is scored on its own.',
    },
    'bk-rec-temperature': {
      basedOn:
        'Each activity’s proportion of days over its temperature threshold: 19 °C day use and boating, 20 °C birding, 23 °C waterfowl hunting, 18.4 / 22.3 °C angling, below 18 °C cold-water day use.',
      rule: '−1 per percentage point more days over the threshold than Business as Usual, +1 per point fewer; ±5 at five points or more. Each activity is scored on its own.',
      note: 'Calling on Reserves and A Tunnel have no temperature runs.',
    },
    'bk-rec-restoration': {
      basedOn:
        'Restored acres from Recreation’s “Overall Restoration (Acres)” sheet, by Delta region: Eco Machine 41,720 in Suisun Marsh and 1,380 in the Central Delta; New Green Watershed at its 50% bound 41,720, 66,947, 283,904 and 277,681 (Suisun, Central, North, South).',
      rule: 'Scenarios that restore nothing score 0 (scoring email, 22 Oct 2026). Recreation scores Eco Machine and New Green Watershed.',
      note: 'Eco Machine and New Green Watershed are awaiting Recreation’s scores.',
    },
    'bk-rec-economy': {
      basedOn:
        'The yearly value of four recreation services (amenity and recreation, biodiversity, recreational hunting, recreational fishing) for New Green Watershed at 50% restoration and for Business as Usual’s existing protected land, by Delta region (Recreation’s “Overall $” sheet).',
      rule: '+1 per 1% more value than Business as Usual, ±5 at most. Each service is scored on its own; the team publishes no single economy score.',
      note: 'Eco Machine, Bolster & Fortify, Calling on Reserves and A Tunnel are awaiting Recreation.',
    },

    // Environmental justice
    'bk-environmentalJustice': {
      basedOn: 'Drinking water, flood risk, and water age + temperature.',
      rule: 'The rounded mean of the three (October slides).',
    },
    'bk-ej-drinking': {
      basedOn:
        'The share of salinity readings at or above 1,050 µS/cm at in-Delta drinking-water points, over the whole run.',
      rule: '−1 per percentage point more readings over the line than Business as Usual, +1 per point fewer; ±5 at most.',
      note: 'Scored for all 49 points and for the moderate and high vulnerability classes; the highest class is always 0% and has no score.',
    },
    'bk-ej-flood': {
      basedOn: 'A Delta-wide qualitative judgement of flood risk.',
      rule: 'Set by the team on the −5 to +5 scale; there is no published formula.',
    },
    'bk-ej-waterage': {
      basedOn:
        'The change in average water age, in days, against Business as Usual at five hotspot areas, with water temperature.',
      rule: 'Each area is placed on a monthly ladder (slight, moderate, significant, major, extreme) and the areas are averaged; older water scores lower.',
    },

    // Economy
    'bk-economy': {
      basedOn: 'Gross revenue, jobs and value added.',
      rule: 'One score that the three metrics share, set by whichever pathway (salinity or land use) dominates for each scenario.',
      note: 'The same with 2 ft of sea level rise.',
    },
    'bk-econ-revenue': {
      basedOn: 'Direct gross revenue against Business as Usual ($1.107B a year).',
      rule: `One score shared with jobs and value added. ${ECONOMY_RULE}`,
      note: ECONOMY_RULE_NOTE,
    },
    'bk-econ-jobs': {
      basedOn: 'Jobs against Business as Usual (7,720 direct, 11,860 total).',
      rule: `One score shared with gross revenue and value added. ${ECONOMY_RULE}`,
      note: ECONOMY_RULE_NOTE,
    },
    'bk-econ-value': {
      basedOn: 'Value added against Business as Usual ($671M direct, $999M total a year).',
      rule: `One score shared with gross revenue and jobs. ${ECONOMY_RULE}`,
      note: ECONOMY_RULE_NOTE,
    },

    // Eco-cultural
    'bk-ecoCultural': {
      basedOn: 'Restoration acres, flow and qualitative judgement.',
      rule: 'One overall score, set by the team.',
    },
    'bk-ec-restoration': {
      basedOn:
        'Restored acres: Eco Machine 41,720 in Suisun and 1,380 at Franks Tract; New Green Watershed 248,815 in the Delta, plus upper-watershed ranges.',
      rule: 'Set by the team on the −5 to +5 scale (slide 55); there is no published rule per acre.',
    },
  }
