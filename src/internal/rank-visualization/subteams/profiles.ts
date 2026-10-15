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
      'There is no perfect definition of ecosystem health, so the subteam studied ecosystem function in three ways: species fundamental niches, pelagic food web production, and newly accessible aquatic habitat.',
    measured: '≈847,000 suitability days',
    measuredNote:
      'The team studied 145 points across the estuary for about 365 days in each of 2 water years, covering 8 species and life stages. Each day scored 1 or 0 according to whether salinity and temperature were both within that species’ tolerance.',
    reaches: 'two acreage ranks',
    places: {
      count: '8 estuarine subregions, 145 points',
      basis:
        'The team adapted the regions from Pien et al. 2025 and Grimaldo et al. 2020. The regions were “grouped by temperature similarities, or by known regional divisions”.',
    },
    rule: 'Business as Usual is fixed at 5 and New Green Watershed at 10. The 80,000 acres between them set each step at 16,000 acres, rounded.',
    ruleWhere: 'Sept report, Results',
    finding:
      'The scenarios differ little because the variation between water years is greater than the variation among scenarios; most differences occur in Suisun, San Pablo and the Confluence.',
    notScored: [
      {
        label: 'Species-specific modeling',
        why: 'The Oct slides rank each species across four grids rather than as one value. These ranks do not enter the criterion score, although they are the most detailed evidence in the project.',
      },
      {
        label: 'Conceptual models',
        why: 'The metrics slide describes them as a way “to condense information and collate differences between scenarios”. This evidence is meant to be narrative and has not yet been built.',
      },
    ],
  },

  recreation: {
    team: 'recreation',
    question:
      'The subteam studied how salinity and water temperature affect the number and timing of visitors to water-dependent recreation, measuring these effects at parks and wildlife reserves across four Delta regions.',
    measured: '≈50,750 point-days, five times over',
    measuredNote:
      'The team studied 32 points for 793 days and measured 2 parameters, temperature and salinity, for five activities, each with its own threshold.',
    reaches: 'nothing yet',
    places: {
      count: '4 Delta regions, 32 points',
      basis:
        'The boundaries follow tidal geography, salinity and hydrological differences (Andrews et al. 2017). They also reflect regional access and roads (Delta Plan 2013) and “natural regional aesthetic and winding waterways” (Olmsted Jr. 1929).',
    },
    rule: 'Page 391 defines Score −5 to 5 = 5 − 10 × (days exceeding threshold ÷ total days in that period), but the team never applies the formula, and the ranking sections below it are empty headings.',
    ruleWhere: 'Sept report, p.391',
    finding:
      'Every scenario has higher threshold exceedance in winter than in summer. Calling on Reserves has the highest exceedance in both seasons except for boating and day use, where it is the only scenario with lower exceedance than the Business as Usual baseline in winter.',
    notScored: [
      {
        label: 'Overall use',
        why: 'The team published percentages for all five activities but did not calculate a score.',
      },
      {
        label: 'Seasonal use',
        why: 'The team published summer and winter percentages but did not calculate a score.',
      },
      {
        label: 'Restoration',
        why: 'The team compared accessible acreage with the CVJV 2020 deficits, which New Green Watershed clears by +483% at the 50/50 level. This is the one case where Recreation clearly favours restoration, but it does not enter a score.',
      },
      {
        label: 'Recreation economy',
        why: 'The team reports visitor-sector earnings by water year type but does not score them. Earnings change by +20.3% in wet years and −27.5% in above-normal ones, so they are lowest in the middle rather than at the extremes.',
      },
    ],
  },

  environmentalJustice: {
    team: 'environmentalJustice',
    question:
      'The subteam studied whether environmental decisions treat and involve all people fairly, focusing on in-Delta communities and examining their exposure, sensitivity and capacity to recover.',
    measured: '39,659 daily measurements',
    measuredNote:
      'The team studied 49 drinking-water points for 793 days and used 14 socioeconomic indicators to classify each point as moderate, high or highest vulnerability; it also compared the wet and dry seasons.',
    reaches: 'three numbers',
    places: {
      count: '49 points in 3 vulnerability classes; 5 water-age hotspots',
      basis:
        'The Delta Stewardship Council’s 2020 sub-regional map, so the boundaries are administrative and socioeconomic rather than hydrological.',
    },
    rule: 'Business as Usual is fixed at 0. The range in each analysis sets the band width: one percentage point per step for the adaptation scenarios and five for the tiered outflow runs.',
    ruleWhere: 'Sept report, Comparative Scenario Performance Ranking',
    verdict: { ngw: 1, em: 0, bf: 0, cor: null, tunnel: null, bau: 0 },
    finding:
      'The highest-vulnerability zone never exceeds the drinking-water threshold under any scenario in either season; the burden falls on the moderate and high classes instead.',
    notScored: [],
  },

  economy: {
    team: 'economy',
    question:
      'What happens to the Delta’s economy when its water gets saltier or farmland changes to another use? The team tracked differences in gross revenue, employment and value added from the Business as Usual baseline.',
    measured: '30 results',
    measuredNote:
      'The team measured 3 metrics across 5 geographies, the Delta as a whole and four zones, using 2 water years; for New Green Watershed, it also studied three restoration intensities.',
    reaches: 'one number',
    places: {
      count: '4 zones, plus Delta-wide',
      basis:
        'Water agency boundaries define the North, Central and South Delta zones. The team also uses a West Delta section. Suisun Marsh is outside these zones and appears only in the Eco Machine land-use estimate.',
    },
    rule: 'The team scored each scenario on “whichever effect actually dominates for it, rather than forcing every scenario onto one percent-based scale”. The report identifies the main effect in each scenario: salinity for Bolster & Fortify and Calling on Reserves, and land conversion for the other two.',
    ruleWhere: 'Sept report, Comparative Scenario Performance Ranking',
    verdict: { ngw: -4, em: 0, bf: -1, cor: 0, tunnel: null, bau: 0 },
    finding:
      'Salinity changes gross revenue by less than 0.01% of a $1.107B farm economy in every scenario modelled, so land conversion determines the criterion.',
    notScored: [
      {
        label: 'Applied water use and land-use change',
        why: 'The team describes this as the cause behind the three scored metrics but does not give it a separate score.',
      },
    ],
  },

  ecoCultural: {
    team: 'ecoCultural',
    question:
      'The subteam asked whether each scenario can support ecocultural restoration and Tribal sovereignty. Ecocultural restoration means repairing ecosystems while revitalizing cultural practices. Tribal sovereignty means the inherent authority of Native American tribes to govern themselves.',
    measured: '6 habitat types',
    measuredNote:
      'The team studied three in-Delta habitat types and three upland types. New Green Watershed alone spans 9 upland by 3 in-Delta sub-scenarios, so one acreage value represents 27 possible futures.',
    reaches: 'one composite',
    places: {
      count: 'In-Delta and upper watershed',
      basis:
        'Historic Tribal territories, so the geography is cultural and historical rather than hydrological or administrative. Specific practice sites are deliberately not mapped.',
    },
    rule: 'The team can measure only metric A across scenarios. It compares the scenarios qualitatively, so “the scenarios are given one score for this criterion as a whole, rather than a score for each metric”.',
    ruleWhere: 'Sept report, Comparative Scenario Performance Ranking',
    verdict: { ngw: 4, em: 2, bf: 0, cor: 1, tunnel: -2, bau: 0 },
    finding:
      'The team intentionally describes three of the four metrics without scoring them, so restoration acreage almost entirely determines the criterion.',
    notScored: [
      {
        label: 'Access to landscapes',
        why: 'The team’s finding is a ranked set of agreements, from Tribal ownership down to a memorandum of understanding. It is not a quantity.',
      },
      {
        label: 'Indigenous science and TEK',
        why: 'The team lists conditions that make this work possible: ensured privacy and freedom from outside observation, unrestricted access, and sites that Elders and people with restricted mobility can reach.',
      },
      {
        label: 'Sovereignty, governance and rights',
        why: 'The team lists examples and ways to support them. These include Tribal water rights, data sovereignty under CARE, and an inter-Tribal council for the Delta. Material from workshops needs Tribal review before publication.',
      },
    ],
  },
}
