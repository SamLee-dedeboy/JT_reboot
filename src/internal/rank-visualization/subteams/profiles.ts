// The spine every subteam page repeats, as data.
//
// Scenario-first asks which future wins, and to answer it every criterion has to
// produce one commensurable number. That is where the page's inferred values and
// its asterisks come from. Subteam-first asks a different question — what did this
// team look at, and what did they find — which needs no commensurability at all.
// So each page carries the same six beats and differs only in the middle one.
//
// Every quote here is verbatim from the Oct 2026 conference slides or the Sept 2026
// "Story Behind the Criterion" reports in research/criteria-stories/.
import type { TeamKey } from '../data'
import type { ScenarioKey } from '../drilldown/model'

export interface Unscored {
  label: string
  why: string
}

export interface SubteamProfile {
  team: TeamKey
  /** The criterion in the subteam's own framing, not ours. */
  question: string
  /** The size of what they measured, and what survives into the score. */
  measured: string
  measuredNote: string
  reaches: string
  /** Their geography, and why its boundaries sit where they do. */
  places: { count: string; basis: string }
  /** How they turn measurements into a −5…+5 score, where they say. */
  rule?: string
  ruleWhere?: string
  /** The criterion score, as they publish it. Absent where they publish none. */
  verdict?: Partial<Record<ScenarioKey, number | null>>
  /** The thing they would tell you if you only had one sentence. */
  finding: string
  notScored: Unscored[]
}

export const SUBTEAM_PROFILES: Record<TeamKey, SubteamProfile> = {
  ecology: {
    team: 'ecology',
    question:
      'There is no perfect definition of ecosystem health, so ecosystem function was approached three ways: species fundamental niches, pelagic food web production, and newly accessible aquatic habitat.',
    measured: '≈847,000 suitability days',
    measuredNote:
      '145 points across the estuary × about 365 days × 2 water years × 8 species and life stages, each day scored 1 or 0 on whether salinity and temperature both sat inside that species’ tolerance.',
    reaches: 'two acreage ranks',
    places: {
      count: '8 estuarine subregions, 145 points',
      basis:
        'Adapted from Pien et al. 2025 and Grimaldo et al. 2020, with regions “grouped by temperature similarities, or by known regional divisions”.',
    },
    rule: 'Business as Usual anchored at 5 and New Green Watershed at 10, with 80,000 acres between them, so one step per 16,000 acres, rounded.',
    ruleWhere: 'Sept report, Results',
    finding:
      'Little variation between scenarios. The water year moves these numbers further than the scenario does, and what variation there is concentrates in Suisun, San Pablo and the Confluence.',
    notScored: [
      {
        label: 'Species-specific modeling',
        why: 'Ranked in the Oct slides, but per species across four grids rather than as one number, so it reaches no criterion score. It is also the deepest evidence anywhere in this project.',
      },
      {
        label: 'Conceptual models',
        why: 'Declared on the metrics slide as a way “to condense information and collate differences between scenarios”. Narrative by design, and not yet built.',
      },
    ],
  },

  recreation: {
    team: 'recreation',
    question:
      'How salinity and water temperature affect the volume and timing of visitors to water-dependent recreation, measured at parks and wildlife reserves across four Delta regions.',
    measured: '≈50,750 point-days, five times over',
    measuredNote:
      '32 points × 793 days × 2 parameters, temperature and salinity, repeated for each of five activities, each with its own threshold.',
    reaches: 'nothing yet',
    places: {
      count: '4 Delta regions, 32 points',
      basis:
        'Tidal geography, salinity and hydrological differences (Andrews et al. 2017); regional access and roads (Delta Plan 2013); and “natural regional aesthetic and winding waterways” (Olmsted Jr. 1929).',
    },
    rule: 'Score −5 to 5 = 5 − 10 × (days exceeding threshold ÷ total days in that period). Written on page 391 and never applied: the ranking sections beneath it are empty headings.',
    ruleWhere: 'Sept report, p.391',
    finding:
      'Every scenario is worse in winter than in summer. Calling on Reserves is worst in both, except for boating and day use, where it is the only scenario that beats today in winter.',
    notScored: [
      { label: 'Overall use', why: 'Percentages published for all five activities; no score run.' },
      { label: 'Seasonal use', why: 'Summer and winter percentages published; no score run.' },
      {
        label: 'Restoration',
        why: 'Accessible acreage against the CVJV 2020 deficits. New Green Watershed clears them by +483% at the 50/50 level, the one place Recreation clearly favours restoration, and it enters nothing.',
      },
      {
        label: 'Recreation economy',
        why: 'Visitor-sector earnings by water year type. Narrative by design: earnings run +20.3% in wet years and −27.5% in above-normal ones, so the sector does worst in the middle rather than at the extremes.',
      },
    ],
  },

  environmentalJustice: {
    team: 'environmentalJustice',
    question:
      'The fair treatment and meaningful involvement of all people in environmental decisions, read through exposure, sensitivity and the capacity to recover, with the focus on in-Delta communities.',
    measured: '39,659 daily measurements',
    measuredNote:
      '49 drinking-water points × 793 days, each classed moderate, high or highest vulnerability on 14 socioeconomic indicators, and split wet season against dry.',
    reaches: 'three numbers',
    places: {
      count: '49 points in 3 vulnerability classes; 5 water-age hotspots',
      basis:
        'The Delta Stewardship Council’s 2020 sub-regional map, so the boundaries are administrative and socioeconomic rather than hydrological.',
    },
    rule: 'Anchored at 0 for Business as Usual, with band width set to the spread of each analysis: one percentage point per step for the adaptation scenarios, five for the tiered outflow runs.',
    ruleWhere: 'Sept report, Comparative Scenario Performance Ranking',
    verdict: { ngw: 1, em: 0, bf: 0, cor: null, tunnel: null, bau: 0 },
    finding:
      'The highest-vulnerability zone never exceeds the drinking-water threshold under any scenario, in either season. The burden lands on the moderate and high classes instead.',
    notScored: [],
  },

  economy: {
    team: 'economy',
    question:
      'When the Delta’s water gets saltier, or when farmland is converted to something else, what happens to the Delta’s economy? Tracked as gross revenue, employment and value added, each against Business as Usual.',
    measured: '30 results',
    measuredNote:
      '3 metrics × 5 geographies, Delta-wide plus four zones, × 2 water years; New Green Watershed additionally across three restoration intensities.',
    reaches: 'one number',
    places: {
      count: '4 zones, plus Delta-wide',
      basis:
        'North, Central and South Delta on water agency boundaries, plus a West Delta section. Suisun Marsh sits outside them and enters only through the Eco Machine land-use estimate.',
    },
    rule: 'Scored on “whichever effect actually dominates for it, rather than forcing every scenario onto one percent-based scale”. The report names the dominant effect per scenario: salinity for Bolster & Fortify and Calling on Reserves, land conversion for the other two.',
    ruleWhere: 'Sept report, Comparative Scenario Performance Ranking',
    verdict: { ngw: -4, em: 0, bf: -1, cor: 0, tunnel: null, bau: 0 },
    finding:
      'Salinity moves gross revenue by less than 0.01% of a $1.107B farm economy in every scenario modelled. Land conversion is the whole criterion.',
    notScored: [
      {
        label: 'Applied water use and land-use change',
        why: 'Tracked narratively as the mechanism behind the three scored metrics rather than scored in its own right.',
      },
    ],
  },

  ecoCultural: {
    team: 'ecoCultural',
    question:
      'Whether a scenario can foster ecocultural restoration, the reciprocal repair of ecosystems and revitalization of cultural practices, and Tribal sovereignty, the inherent authority of Native American tribes to govern themselves.',
    measured: '6 habitat types',
    measuredNote:
      'Three in-Delta and three upland. New Green Watershed alone spans 9 upland by 3 in-Delta sub-scenarios, so one acreage figure stands for 27 possible futures.',
    reaches: 'one composite',
    places: {
      count: 'In-Delta and upper watershed',
      basis:
        'Historic Tribal territories, so the geography is cultural and historical rather than hydrological or administrative. Specific practice sites are deliberately not mapped.',
    },
    rule: 'Only metric A is measurable across scenarios, so “the scenarios are given one score for this criterion as a whole, rather than a score for each metric”, compared qualitatively.',
    ruleWhere: 'Sept report, Comparative Scenario Performance Ranking',
    verdict: { ngw: 4, em: 2, bf: 0, cor: 1, tunnel: -2, bau: 0 },
    finding:
      'Three of the four metrics are described and never scored, by design rather than omission. Restoration acreage carries the criterion almost on its own.',
    notScored: [
      {
        label: 'Access to landscapes',
        why: 'The ladder of agreements is itself the finding, from Tribal ownership down to a memorandum of understanding. It is not a quantity.',
      },
      {
        label: 'Indigenous science and TEK',
        why: 'Enabling conditions rather than outcomes: ensured privacy and freedom from outside observation, unrestricted access, and site selection that reaches Elders and people with restricted mobility.',
      },
      {
        label: 'Sovereignty, governance and rights',
        why: 'Instances and mechanisms, including Tribal water rights, data sovereignty under CARE, and an inter-Tribal council for the Delta. Workshop-derived content needs Tribal review before publication.',
      },
    ],
  },
}
