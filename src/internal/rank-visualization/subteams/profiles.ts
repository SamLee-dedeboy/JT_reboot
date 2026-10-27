// The spine every subteam page repeats, as data.
//
// Scenario-first asks which future wins, and to answer it every criterion has to
// produce one commensurable number. That is where the page's inferred values and
// its asterisks come from. Subteam-first asks a different question — what did this
// team look at, and what did they find — which needs no commensurability at all.
// So each page carries the same beats and differs only in the evidence section.
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
  /** What the subteam looked at, in a few words, for the tab under its name. */
  topic: string
  /** The criterion in the subteam's own framing, not ours. */
  question: string
  /** The size of what they measured, and the unit a reader needs before the charts. */
  measured: string
  measuredNote: string
  /** The part of the measurement that goes into the score, as a phrase and a sentence. */
  reaches: string
  reachesNote: string
  /** Their geography, and why its boundaries sit where they do. */
  places: {
    count: string
    basis: string
    /** The regions in geographic order, marking which have an outline on the map. */
    regions?: { name: string; drawn: boolean }[]
    order?: string
  }
  /** How they turn measurements into a −5…+5 score, where they say. */
  rule?: string
  ruleWhere?: string
  /** The criterion score, as they publish it. Absent where they publish none. */
  verdict?: Partial<Record<ScenarioKey, number | null>>
  /** The criterion node and the metric nodes beneath it, for the scoreboard. */
  scoreboard: { criterion: string; metrics: { label: string; id: string }[] }
  /** The thing they would tell you if you only had one sentence. */
  finding: string
  /** The rest of what they found, in their own order, each with a handle. */
  findings?: { label: string; text: string }[]
  notScored: Unscored[]
}

export const SUBTEAM_PROFILES: Record<TeamKey, SubteamProfile> = {
  ecology: {
    team: 'ecology',
    topic: 'Where fish can live, and restored habitat',
    question:
      'There is no perfect definition of ecosystem health, so the subteam studied ecosystem function in three ways: **species fundamental niches**, **pelagic food web production**, and **newly accessible aquatic habitat**.',
    measured: 'Suitability days',
    measuredNote:
      'A ==suitability day== is one day, at one point in the estuary, on which both the salinity and the water temperature were inside the range one species can tolerate. The team checked this for **8 species and life stages** at **145 points**, every day of a **wet water year (2019)** and a **dry one (2020)**. The charts below report these days as a **proportion**: the share of days in the water year on which a region was suitable.',
    reaches: 'two acreage ranks',
    reachesNote:
      'The score is the ==mean of two ranks==, one for **newly accessible habitat** and one for **food-web production**, both worked out from acreage. The **species results above do not enter it**.',
    places: {
      count: '8 estuarine subregions, 145 points',
      basis:
        'The team adapted the regions from Pien et al. 2025 and Grimaldo et al. 2020, “grouped by temperature similarities, or by known regional divisions”, and **analysed all eight**, from South Bay in the west to the South Delta in the east. The map draws all eight regions. It also draws Suisun Marsh separately, which the report counts within Suisun Bay.',
      regions: [
        { name: 'South Bay', drawn: true },
        { name: 'Central Bay', drawn: true },
        { name: 'San Pablo Bay', drawn: true },
        { name: 'Suisun Bay', drawn: true },
        { name: 'Confluence', drawn: true },
        { name: 'North Delta', drawn: true },
        { name: 'Central Delta', drawn: true },
        { name: 'South Delta', drawn: true },
      ],
      order: 'West to east',
    },
    rule: 'Business as Usual is fixed at **5** and New Green Watershed at **10**. The **80,000 acres** between them set each step at **16,000 acres**, rounded.',
    ruleWhere: 'Sept report, Results',
    finding:
      '==The scenarios differ little== because the variation between **water years** is greater than the variation among scenarios; most differences occur in **Suisun, San Pablo and the Confluence**.',
    findings: [
      {
        label: 'Where the estuary moves',
        text: 'The middle of the estuary, the ==Confluence, Suisun Bay and San Pablo Bay==, saw the most variation in species niches. The Delta stayed consistently fresh and the Bay consistently salty under every scenario, so the species that respond are the ones whose tolerance sits in the brackish middle.',
      },
      {
        label: 'Wet year against dry year',
        text: 'In ==2020, the dry year==, overbite clam gained suitable days in every subregion except San Pablo Bay, and adult longfin smelt gained in every subregion. **Chinook salmon lost** suitable days in the South Delta, the Confluence, Suisun Bay and San Pablo Bay. Largemouth bass and Brazilian waterweed lost ground in Suisun as it turned saltier. This happened regardless of scenario.',
      },
      {
        label: 'Bolster & Fortify',
        text: '==Varied little from Business as Usual.== No significant change in any species niche, and no expansion of wetland habitat.',
      },
      {
        label: 'Calling on Reserves',
        text: 'The ==most variable scenario==, with “unexpectedly positive effects”: more suitable days for **Chinook salmon and longfin smelt**, two species of concern, than under Business as Usual. Mixed for overbite clam, which gained habitat in Suisun Marsh in the dry year and lost it in San Pablo Bay. The scenario makes the mid-estuary saltier, which benefits both the invasive clam and the anadromous fishes, “a tradeoff to consider”. It adds no habitat acres, so its effect on food webs and habitat access is minimal.',
      },
      {
        label: 'Eco Machine',
        text: '==Contracted the suitable habitat of freshwater invasives==, Brazilian waterweed and largemouth bass, because Frank’s Tract Futures raised salinity in the Central Delta. Its 53,000 new tidal acres slightly raise food production, but without the seasonal wetlands of New Green Watershed the effect is weaker, and without tidal restoration in the North Delta it opens less habitat.',
      },
      {
        label: 'New Green Watershed',
        text: 'The same effect on freshwater invasives as Eco Machine, plus slightly more suitable days for ==juvenile longfin smelt==. Its biggest benefits are **food-web production and accessible habitat**: it multiplies the managed wetland acreage of the Delta and Suisun by at least 10×, depending on sub-scenario, and restores about 27,000 acres of the Cache–Lindsay Slough complex in the North Delta, “a known hotspot for fish and food web activity”.',
      },
      {
        label: 'In their words',
        text: '“Restoration does matter but we are limited in where it can happen.”',
      },
    ],
    scoreboard: {
      criterion: 'ecology',
      metrics: [
        { label: 'Newly accessible habitat', id: 'eco-habitat' },
        { label: 'Food-web production', id: 'eco-foodweb' },
        { label: 'Species niches', id: 'eco-niche' },
      ],
    },
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
    topic: 'Days too salty or too warm for recreation',
    question:
      'The subteam studied how **salinity and water temperature** affect the **number and timing of visitors** to water-dependent recreation, measuring these effects at parks and wildlife reserves across four Delta regions.',
    measured: 'Days over an activity’s limit',
    measuredNote:
      'The team took daily salinity and temperature at ==32 points== for **793 days**. For each of **four activities** (day use and boating share a limit) it set a **salinity limit** above which the water is no longer suitable, then counted the **proportion of days over that limit**, with a separate temperature limit per activity. Salinity is given in **µS/cm**, a measure of how salty water is: higher is saltier, and the drinking-water threshold used elsewhere on this site is 1,050 µS/cm. A higher proportion means more days lost, so **lower is better**.',
    reaches: 'four activity scores',
    reachesNote:
      'Since 18 Oct 2026 the team scores ==each activity itself==, by region and by season, on its own scale: one point per percentage point of days over the threshold against Business as Usual. It still publishes no criterion score, so the comparison page uses the **mean of the four salinity activity scores**, which we calculate.',
    places: {
      count: '4 Delta regions + Delta-wide, 32 points',
      regions: [
        { name: 'Suisun Marsh', drawn: true },
        { name: 'Central Delta', drawn: true },
        { name: 'North Delta', drawn: true },
        { name: 'South Delta', drawn: true },
      ],
      order: 'West to south',
      basis:
        'The boundaries follow tidal geography, salinity and hydrological differences (Andrews et al. 2017). They also reflect regional access and roads (Delta Plan 2013) and “natural regional aesthetic and winding waterways” (Olmsted Jr. 1929). The team’s 18 Oct 2026 workbooks give every activity’s score and exceedance **by region**: Delta-wide, Suisun Marsh, Central Delta, North Delta and South Delta.',
    },
    rule: 'The 18 Oct 2026 workbooks score every activity, region and season: **one point per percentage point** of days over the limit against Business as Usual, **±5 at five points or more**. The Sept report’s earlier formula (5 − 10 × the proportion of days over) was never applied.',
    ruleWhere: 'RMA Salinity Scenarios Analyzed.xlsx, OVERALL (18 Oct 2026)',
    finding:
      'Exceedance is concentrated in ==Suisun Marsh and the Central Delta==; the North and South Delta sit at 0% for every activity. **A Tunnel** scores worst, −2 to −5 across Suisun Marsh and the Central Delta, with **Calling on Reserves** second, while Bolster & Fortify is effectively Business as Usual. Wet seasons cross the limits more often than dry ones.',
    findings: [
      {
        label: 'Business as Usual',
        text: 'Today’s Delta “rising and falling with the water year”: boaters and swimmers face ==warm-water risk every summer==, and waterfowl habitat tracks the salinity thresholds the team adopted. The team treats it as a fair baseline.',
      },
      {
        label: 'Bolster & Fortify',
        text: '“Essentially locks in current conditions through infrastructure rather than improving them.” Its numbers ==track Business as Usual across every activity==: “a scenario about stability, not improvement”, and one the team expects cannot keep up with mid-century flow losses.',
      },
      {
        label: 'Eco Machine',
        text: 'More wetland acreage should mean ==fewer stressed waterfowl and birds== in dry and wet years alike, with Franks Tract Futures helping to attenuate salinity and keep access more consistent year-round. In drier years its flows follow the wider seasonal pattern.',
      },
      {
        label: 'New Green Watershed',
        text: '“A wetter, more resilient Delta on paper, with real gains for birds and habitat, but gains that our ==threshold-day counts do not yet show clearly==.” Wetlands persisting through summer help fall migrants and reduce avian disease spread.',
      },
      {
        label: 'Calling on Reserves',
        text: 'The ==second-worst performer==. Leaning on stored water in dry years extends risk for birds and swimmers past the baseline; it was “the scenario most associated with unpredictable, late season arriving cold water and salinity stress lingering past when it normally clears”.',
      },
      {
        label: 'A Tunnel',
        text: '“Performed the worst of all six scenarios in what we measured, with salinity-driven ==botulism risk lingering into January and February== when every other scenario has already cleared.” The 18 Oct workbooks bear it out: −3 to −5 Delta-wide on every activity, and the only scenario that pushes South Delta day use and boating over the limit in wet seasons.',
      },
      {
        label: 'Two stories',
        text: 'Choices that lean on engineering and restriction, a tunnel or drawing down reserves, ==extend salinity risk further into the calendar== than doing nothing; restoration choices track the baseline and truncate summer spikes. And simply adding water helps: a **30% outflow increase** cut salinity-related risk for birds “sometimes by 90% in a single month”.',
      },
    ],
    scoreboard: {
      criterion: 'recreation',
      metrics: [
        { label: 'Salinity thresholds', id: 'rec-salinity' },
        { label: 'Temperature thresholds', id: 'rec-temperature' },
        { label: 'Restoration', id: 'rec-restoration' },
        { label: 'Recreation economy', id: 'rec-economy' },
      ],
    },
    notScored: [
      {
        label: 'Temperature thresholds',
        why: 'The team scores these the same way as salinity, but every Delta-wide score is 0 and only Suisun Marsh moves, by a point either way. Calling on Reserves and A Tunnel are still pending, so the metric sits beside the criterion score rather than in it.',
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
    topic: 'Drinking-water salinity by community vulnerability',
    question:
      'The subteam studied whether environmental decisions **treat and involve all people fairly**, focusing on in-Delta communities and examining their **exposure, sensitivity and capacity to recover**.',
    measured: 'Days over the drinking-water threshold',
    measuredNote:
      'The team took daily salinity at ==49 drinking-water intake points== for **793 days**. It sorted each point into a **vulnerability class**, moderate, high or highest, using 14 socioeconomic indicators about the community it serves. For each class it then counted the **proportion of days over 1,050 µS/cm**, the salinity above which water is no longer fit to drink; **lower is better**. It did this for the whole run and separately for the wet and dry seasons.',
    reaches: 'three numbers',
    reachesNote:
      '==Three metric scores==, one each for **drinking water, flood risk and water age**, are averaged into the criterion score. **Everything the team measured feeds one of them.**',
    places: {
      count: '49 points in 3 vulnerability classes; 5 water-age hotspots',
      basis:
        'The Delta Stewardship Council’s 2020 sub-regional map, so the boundaries are administrative and socioeconomic rather than hydrological. The three shapes are the **three vulnerability classes, not places**: a class gathers every intake point whose community scores alike.',
    },
    rule: 'Business as Usual is fixed at **0**. The range in each analysis sets the band width: **one percentage point per step** for the adaptation scenarios and five for the tiered outflow runs.',
    ruleWhere: 'Sept report, Comparative Scenario Performance Ranking',
    verdict: { ngw: 1, em: 0, bf: 0, cor: null, tunnel: null, bau: 0 },
    finding:
      'The ==highest-vulnerability class never exceeds== the drinking-water threshold under any scenario in either season; the burden falls on the **moderate and high classes** instead.',
    findings: [
      {
        label: 'Scenarios move in pairs',
        text: '==Bolster & Fortify tracks Business as Usual==; **Eco Machine and New Green Watershed** move together; **Calling on Reserves and A Tunnel** move together. The two “green infrastructure” scenarios were the only interventions with a salinity-reducing effect.',
      },
      {
        label: 'Drinking water',
        text: 'Only ==New Green Watershed and Eco Machine improve on today==, by about one percentage point of the run and the wet season; in the dry season only Eco Machine moves at all. Bolster & Fortify is unchanged. Calling on Reserves and A Tunnel are worse, so “replacement water is more necessary during the wet months”.',
      },
      {
        label: 'Flood risk',
        text: 'New Green Watershed is “undoubtedly the forerunner”, because ==upland restoration stops water before it reaches the Delta==. Bolster & Fortify helps moderately, but only residents on fortified islands benefit directly. A Tunnel helps slightly, on the assumption its intakes intercept storm water. Eco Machine and Calling on Reserves change nothing.',
      },
      {
        label: 'Water age and temperature',
        text: 'The proxy for harmful algal blooms. ==Bolster & Fortify is the only scenario not scored worse== than today: Franks Tract sees extreme increases, offset by a consistent decrease along the fortified South Delta corridor. Eco Machine and Calling on Reserves are slightly worse, New Green Watershed moderately worse.',
      },
      {
        label: 'Flow matters most',
        text: 'The salinity field responds more to ==how much water flows through the Delta== than to any landscape, infrastructure or operational change. A 30% outflow increase keeps exceedances in single digits everywhere; a 10% decrease raises them everywhere. “An increase in volume of water within the Delta can have the most positive effect.”',
      },
    ],
    scoreboard: {
      criterion: 'environmentalJustice',
      metrics: [
        { label: 'Drinking water', id: 'ej-drinking' },
        { label: 'Flood risk', id: 'ej-flood' },
        { label: 'Water age and temperature', id: 'ej-waterage' },
      ],
    },
    notScored: [],
  },

  economy: {
    team: 'economy',
    topic: 'Farm revenue, jobs and value added',
    question:
      'What happens to the Delta’s economy when its water gets saltier or farmland changes to another use? The team tracked differences in **gross revenue, employment and value added** from the Business as Usual baseline.',
    measured: 'Differences from today’s farm economy',
    measuredNote:
      'The team measured ==3 metrics==, gross revenue, jobs and value added, across **5 geographies**, the Delta as a whole and four zones, in **2 water years** and **2 climates** (today and 2 ft of sea level rise); for New Green Watershed it also studied three restoration intensities. Every result is a **difference from today**: the Delta’s farm economy earns about **$1.107 billion a year** under Business as Usual, and each number says how far a scenario moves it, in dollars or jobs.',
    reaches: 'one number',
    reachesNote:
      '==One number per scenario==: its revenue change on **whichever of the two pathways dominates** that scenario. The other pathway and the other metrics do not enter it.',
    places: {
      count: '4 zones, plus Delta-wide',
      basis:
        'Water agency boundaries define the **North, Central and South Delta** zones. The team also uses a **West Delta** section, now shown with its merged boundary. Suisun Marsh is outside these zones and appears only in the Eco Machine land-use estimate.',
      regions: [
        { name: 'West Delta', drawn: true },
        { name: 'North Delta', drawn: true },
        { name: 'Central Delta', drawn: true },
        { name: 'South Delta', drawn: true },
      ],
      order: 'West to south',
    },
    rule: 'The team scored each scenario on **“whichever effect actually dominates for it, rather than forcing every scenario onto one percent-based scale”**. The report identifies the main effect in each scenario: **salinity** for Bolster & Fortify, Calling on Reserves and A Tunnel, and **land conversion** for Eco Machine and New Green Watershed. The scores are the same with 2 ft of sea level rise.',
    ruleWhere: 'v16 report (25 Oct 2026), Comparative Scenario Performance Ranking',
    verdict: { ngw: -4, em: 0, bf: -1, cor: 0, tunnel: -1, bau: 0 },
    finding:
      'Salinity changes gross revenue by ==less than 0.01%== of a $1.107B farm economy in every scenario modelled, so **land conversion determines the criterion**.',
    findings: [
      {
        label: 'Four futures the farm economy barely notices',
        text: 'Doing nothing, fortifying levees, calling on reserves and building a tunnel: for these four “the Delta’s farm economy barely notices the difference, in dollars, jobs, or regional value added, in either a wet or dry year”, and that holds with 2 ft of sea level rise. A Tunnel moves dry-year salinity from the western to the central Delta and costs about $27,000 a year, the largest salinity loss. The team calls this ==“a genuinely reassuring finding”==.',
      },
      {
        label: 'New Green Watershed',
        text: '“A different story entirely, and not because of water quality.” It converts productive farmland to wetland and rice at scale. Delta-wide, at full managed wetland, ==employment falls about 43%, value added 46% and revenue 46%==; the 50/50 and 25/75 levels are smaller but still substantial. Carbon-offset revenue recovers roughly **7 to 10%** of the on-farm loss, “a real but partial benefit, not a rescue”. The team adds that this “is not a reason to avoid restoration”: it is the trade-off, stated.',
      },
      {
        label: 'Eco Machine',
        text: 'Converts about 14,000 to 54,000 acres to tidal marsh, ==almost none of it farmed==, so farm revenue moves by at most about $1.2M a year. Its real economics sit elsewhere: a one-time construction cost of **$0.85 to 1.5 billion**, carbon revenue of $1.6 to 5.9M a year, and an unmeasured loss of duck-club activity in Suisun Marsh. Its largest benefits, from the Franks Tract redesign, fall under water supply, water quality and recreation.',
      },
      {
        label: 'Still open',
        text: 'Confirm how much of Suisun Marsh Eco Machine restores and what that does to duck clubs; rerun the IMPLAN model directly on the rice-converted acreage; decide how to project ecotourism revenue.',
      },
    ],
    scoreboard: {
      criterion: 'economy',
      metrics: [
        { label: 'Gross revenue', id: 'econ-revenue' },
        { label: 'Jobs', id: 'econ-jobs' },
        { label: 'Value added', id: 'econ-value' },
      ],
    },
    notScored: [
      {
        label: 'Applied water use and land-use change',
        why: 'The team describes this as the cause behind the three scored metrics but does not give it a separate score.',
      },
    ],
  },

  ecoCultural: {
    team: 'ecoCultural',
    topic: 'Restored habitat and Tribal access',
    question:
      'The subteam asked whether each scenario can support **ecocultural restoration** and **Tribal sovereignty**. Ecocultural restoration means repairing ecosystems while revitalizing cultural practices. Tribal sovereignty means the inherent authority of Native American tribes to govern themselves.',
    measured: 'Restored habitat, in acres',
    measuredNote:
      'The team set ==four metrics==. Only the first, **restored habitat**, is a quantity: **acres** of three in-Delta habitat types and three upland types that a scenario would restore. The other three, access to landscapes, Indigenous science, and sovereignty, are **described rather than counted**. New Green Watershed alone spans 9 upland by 3 in-Delta sub-scenarios, so one acreage value represents **27 possible futures**.',
    reaches: 'one composite',
    reachesNote:
      '==One score for the whole criterion.== The team compares the scenarios qualitatively, so **restoration acreage** almost entirely determines it.',
    places: {
      count: 'In-Delta and upper watershed',
      basis:
        'Historic Tribal territories, so the geography is cultural and historical rather than hydrological or administrative. Specific practice sites are deliberately not mapped.',
    },
    rule: 'The team can measure only metric A across scenarios. It compares the scenarios qualitatively, so “the scenarios are given one score for this criterion as a whole, rather than a score for each metric”.',
    ruleWhere: 'Sept report, Comparative Scenario Performance Ranking',
    verdict: { ngw: 4, em: 2, bf: 0, cor: 1, tunnel: -2, bau: 0 },
    finding:
      'The team intentionally describes ==three of the four metrics without scoring them==, so **restoration acreage** almost entirely determines the criterion.',
    findings: [
      {
        label: 'New Green Watershed',
        text: 'Performs best “due to the magnitude of restoration included”. A future with increased Tribal land ownership, stewardship and leadership “portrays many of the same qualities as the New Green Watershed Scenario”, and it creates ==the most opportunities for TEK implementation and future land ownership==. The team flags that this scenario assumes far more Tribal involvement, politically and culturally, than the others, which assume the status quo.',
      },
      {
        label: 'Eco Machine and Calling on Reserves',
        text: 'Eco Machine sits above the rest because of its restoration in Suisun and at Franks Tract, though ==nowhere near the scale of New Green Watershed==. Calling on Reserves is a slight positive: it holds flows upstream for the benefit of fish.',
      },
      {
        label: 'A Tunnel',
        text: 'The only negative score. It is counted against twice, for its ==landscape and its flow implications==: it would draw more water in winter that would otherwise flow through the Delta, and the team does not know how large that effect is.',
      },
      {
        label: 'Flow is “the soul” of the rivers',
        text: 'Tribal members told the team the ==status quo is not desirable== and that increased flows matter alongside restoration. The 30% flow-increase run “very clearly outperforms” both the baseline and the 10% decrease, and the meaning of flow runs deeper than salinity: people described it as “the soul” of the rivers.',
      },
      {
        label: 'What the team will not prescribe',
        text: 'It has clear feedback on how Tribes prefer to gain land access, but will not assign those agreements to scenarios, so there is no per-scenario score for access. It “advocates for Tribal ownership and rights restoration”, and states that for a just transition ==Indigenous communities must be at the forefront of decision-making, stewardship, and land ownership==.',
      },
    ],
    scoreboard: {
      criterion: 'ecoCultural',
      metrics: [{ label: 'Restored habitat', id: 'ec-restoration' }],
    },
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
