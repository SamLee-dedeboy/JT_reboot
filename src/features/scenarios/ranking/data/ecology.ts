// Ecology: everything the ranking shows for this criterion, in one place.
// Change a number or a sentence here and the By criterion table, its info cards, its
// maps and the By scenario rankings all follow. See ./types.ts for how to read it.
import type { Facet, Source, TeamData } from './types'

/** data: Ranking table workbook, Ecology tab, Nov 2026 */
const SOURCE_1: Source = {
  doc: 'data',
  where: 'Ranking table workbook, Ecology tab, Nov 2026',
  quote: 'Values the Ecology team entered in the ranking table sheet.',
}

/** report: The total acreages of the three different landscape types are below */
const SOURCE_2: Source = {
  doc: 'report',
  where: 'The total acreages of the three different landscape types are below',
  quote:
    'New Green Watershed 2 (50% managed, 50% wet soil ag): managed wetland 120,814; additional tidal wetland 80,000; wet soil ag 128,001. Eco Machine: 5,100 (baseline); 53,000; 17,178 (baseline).',
}

/** slides: Bay-Delta Science Conference slides, Oct 2026 */
const SOURCE_3: Source = {
  doc: 'slides',
  where: 'Bay-Delta Science Conference slides, Oct 2026',
  quote: 'Rank charts read cell by cell; see RANKINGS.md.',
}

/** report: Species fundamental niches — region × water year tables */
const SOURCE_4: Source = {
  doc: 'report',
  where: 'Species fundamental niches — region × water year tables',
  quote:
    'Share of days inside each species’ salinity and temperature bracket, by region, for water years 2019 and 2020. A Tunnel is not in these tables; it was first run on the 27 Oct base.',
}

/** report: Ecology report · Adaptation Scenarios - New Base, Calling on Reserves update, a tunnel - October 27, 2026 */
const SOURCE_5: Source = {
  doc: 'report',
  where:
    'Ecology report · Adaptation Scenarios - New Base, Calling on Reserves update, a tunnel - October 27, 2026',
  quote: 'Proportion of Suitable Days Across Species of Interest, Year, and Scenario',
}

/** report: Ecology “Story Behind the Criterion” report, Oct 2026 · Results · Tiered Outflows, Tables 2–6 */
const SOURCE_6: Source = {
  doc: 'report',
  where:
    'Ecology “Story Behind the Criterion” report, Oct 2026 · Results · Tiered Outflows, Tables 2–6',
  quote: 'Proportion of suitable days … for each subregion, under 3 tiered outflow scenarios.',
}

const SOURCES_1_2: Source[] = [SOURCE_1, SOURCE_2]

const SOURCES_4_3_5: Source[] = [SOURCE_4, SOURCE_3, SOURCE_5]

const PLACES_all_southBay_centralBay_and6More: Facet[] = [
  { key: '*', label: 'All together' },
  { key: 'southBay', label: 'South Bay' },
  { key: 'centralBay', label: 'Central Bay' },
  { key: 'sanPabloBay', label: 'San Pablo Bay' },
  { key: 'suisunBay', label: 'Suisun Marsh' },
  { key: 'confluence', label: 'Confluence' },
  { key: 'northDelta', label: 'North Delta' },
  { key: 'centralDelta', label: 'Central Delta' },
  { key: 'southDelta', label: 'South Delta' },
]

const PERIODS_all_2019_2020: Facet[] = [
  { key: '*', label: 'Whole period' },
  { key: '2019', label: 'Wet Year' },
  { key: '2020', label: 'Dry Year' },
]

export const ECOLOGY: TeamData = {
  team: 'ecology',
  seaLevelRiseStatus: 'loaded',
  text: {
    takeaways: [
      'Estuarine subregions, particularly those in the middle of the estuary (the Confluence, Suisun Marsh, and San Pablo Bay regions) — **saw the most variation in species fundamental niche.** The Delta remained consistently fresh across adaptation and tiered outflow scenarios, and the Bay consistently salty.',
      'In general, the adaptation scenarios have a far more minimal impact on the functional niche of specific species of interest than water year type and region.',
      'In terms of suitability for less desirable species, **some tradeoffs were apparent across scenarios.** Decreases in nuisance freshwater species consistently coincided with increases in overbite clam suitability, and vice versa.',
      'The most impactful way an adaptation scenario, like the ones presented in this exercise, can influence a system likely lies in **landscape-level conversion and habitat creation.**',
    ],
    caveats: [
      'Regional Maps: In our regional maps, we included three regions within the greater Bay **(the North Bay, Central Bay, and South Bay)**, despite the adaptation scenarios not being particularly impactful in these regions **(they maintain stable temperatures and salinities).**\n\nThe incorporation of bay regions was to demonstrate that for many euryhaline species, alterations in salinities do not necessarily mean that those species decrease from the system as whole, and rather they move throughout the system, including into the San Pablo Bay and West.',
      'Species of Interest Selection: We received many responses, and specific species, from stakeholders, during our June 2025 workshop. We could not incorporate many of the species of interest for our analysis because many would have required data that was out of the scope of this project.',
      'Data Limitations for Adaptation Scenarios: We chose to approach this from the perspective of functional abiotic niches, specifically where conditions meet the minimum requirements for a species not to experience physiological stress. When a species does experience physiological stress it will likely move until it either perishes, or finds an area that does meet its physiological needs. The data we are working with are **daily maximum temperatures and salinities during the spring pulse flows and key spawning periods** for our focal species of interest. Despite having acreage data regarding additional tidal wetland habitat per different adaptation scenarios, the details regarding this new wetland habitat were beyond the scope of this project.',
      'Residence Time in Food Web Models: Our food web modeling takes the most conservative but informative approach that we could design. The modeling outputs do include residence time (measured by change from baseline run water ages), but those results were difficult to interpret in a quantitative way to incorporate into our general food webs model. Specifically, matching up residence time variations spatially with a generalized food web model involved too many assumptions to be incorporated in the final version of our model.',
      'Upstream restoration: Our evaluation metrics are primarily based on **conditions within the Delta proper, and its downstream waterways.** However, the ++New Green Watershed++ scenario incorporates restoration throughout the entire watershed, including montane meadows, floodplains, and forests in the Sierra. These upstream alterations would likely increase the flows entering the estuary, and might also extend new habitat to anadromous and migratory species of concern, like salmon. Our models were not able to incorporate these hydrological or land-related effects. Collaborators have assessed the general benefits of expanding upstream habitat, but their evaluations are not reliant on hydrological model outputs.',
    ],
    criterion: {
      metrics: ['Habitat availability', 'Food webs', 'Species suitability'],
      combine: 'The **unweighted mean** of the three, rounded to a whole point.',
    },
    periodWhy:
      'For species fundamental niches, we chose to use values in spring, since we are looking at both juvenile and adult stages for some species. Most native fish species spawn in spring, and that is when they are in their juvenile stages.',
    periodMonths: {
      '2019': 'Feb 1 – Jun 1, 2019',
      '2020': 'Feb 1 – Jun 1, 2020',
      both: 'Feb 1 – Jun 1 of both years',
    },
    placeWhy:
      'We compared sub-regions within and outside the Delta, stretching all the way through Suisun Marsh, San Pablo, and out into San Francisco Bay. We wanted to include downstream regions of the estuary because aquatic species are mobile (especially anadromous fishes like salmon), and can relocate if conditions in the upper estuary are not favorable. It is more informative for the entire population of those species to show where their fundamental niches are available throughout the estuary.',
    placeNames: { 'Delta-wide': 'All together' },
  },
  // The By criterion table's rows, top to bottom
  rows: {
    id: 'ecology',
    label: 'Ecology',
    level: 'team',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'The Ecology team’s own criterion score, from the ranking table workbook. How Landscape, Food webs and Species suitability combine is still to be published.',
    places: [{ key: '*', label: 'All together' }],
    periods: [{ key: '*', label: 'Whole period' }],
    sources: [SOURCE_1],
    seaLevelRise: {
      note: 'Values reported in the Ecology tab under sea level rise.',
      sources: [SOURCE_1],
    },
    children: [
      {
        id: 'eco-habitat',
        label: 'Habitat availability',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The Sept report calls this "Accessible Aquatic Habitat" and counts only added accessible wetland acres. Managed wetlands and rice drain at times, so neither counts as accessible; the Oct 2026 slides retain the scores.',
        places: [{ key: '*', label: 'All together' }],
        periods: [{ key: '*', label: 'Whole period' }],
        sources: [
          SOURCE_1,
          {
            doc: 'slides',
            where: 'PERFORMANCE: LANDSCAPE — additional accessible wetland acres',
            quote:
              'Business As Usual 0; Eco Machine +3; New Green Watershed +5; Bolster & Fortify 0; Calling On Reserves 0; A Tunnel 0',
          },
        ],
        seaLevelRise: {
          note: 'Values reported in the Ecology tab under sea level rise.',
          sources: [SOURCE_1],
        },
        info: {
          takeaway: {
            lead: 'The increase in **accessible aquatic habitat**, within the Delta, against ++Business as Usual++.',
          },
          computed: 'Acres of added tidal wetland within the Delta against Business as Usual.',
          scale: {
            axis: 'Acres added against Business as Usual. About 16,000 acres scores +1, rising to +5 at about 80,000 acres.',
            scores: [0, 1, 2, 3, 4, 5],
            bands: ['0', '16k', '32k', '48k', '64k', '80k+'],
            ends: ['Acres added against Business as Usual'],
          },
          scoreRows: {
            heading: 'Where the scenarios land',
            rows: [
              ['Eco Machine', '43,100 acres', 3],
              ['New Green Watershed', '67,000 acres', 4],
            ],
          },
          scored: '+1 for every 16,000 acres added against Business as Usual, up to +5.',
        },
        children: [
          {
            id: 'eco-habitat-acres',
            label: 'Tidal wetlands',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'This metric has one acreage and no breakdown by place or period, making it the only scenario-level detail behind Ecology’s score. The three Eco Machine values use three different assumptions: Economy’s 53,614 restores all 52,244 leveed Suisun acres plus 1,370 at Franks Tract; Eco-cultural’s 43,100 restores about 80% of Suisun (41,720) plus 1,380; and Ecology’s 53,000 follows Economy and assumes full restoration. Economy says the scenario “does not yet fix how much is restored”, so each criterion scores a different version of the scenario. The app uses 53,000 until the fraction is settled.',
            places: [{ key: '*', label: 'All together' }],
            periods: [{ key: '*', label: 'Whole period' }],
            sources: [
              SOURCE_1,
              {
                doc: 'report',
                where: 'The total acreages of the three different landscape types are below',
                quote:
                  'Total additional tidal wetland acreage — New Green Watershed 80,000; Eco Machine 53,000.',
              },
            ],
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
        ],
      },
      {
        id: 'eco-foodweb',
        label: 'Food webs',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The Sept report calls this "Pelagic Food Webs" and uses an acre-weighted proxy (tidal wetland 0.4, managed wetland 0.2, wet-soil ag 0.1). The baseline has 5,100 managed wetland acres and 17,178 wet-soil ag acres; only Eco Machine and New Green Watershed change the landscape, so only their scores change. The Oct 2026 slides retain these scores and group this with Landscape as one metric, although they rank the two separately. The report’s 50/50 line writes the wet-soil-ag term as 128,001 − 17,178 but gives 14,518, the result of adding the two. Subtracting gives a proxy of 66,225 rather than 69,661, while the 25/75 line subtracts correctly. This probably does not change the +4 because the corrected value still falls between the other two sub-scenarios.',
        places: [{ key: '*', label: 'All together' }],
        periods: [{ key: '*', label: 'Whole period' }],
        sources: [
          SOURCE_1,
          {
            doc: 'slides',
            where: 'PERFORMANCE: FOOD WEBS',
            quote:
              'Business As Usual 0; Eco Machine +1; New Green Watershed #1 +5, #2 +4, #3 +4. "Only evaluating Eco-Machine and NGW (landscape changes)."',
          },
          {
            doc: 'report',
            where: 'Results — pelagic food web proxy',
            quote:
              'Total baseline managed wetland acres-5100*(0.2) + additional tidal wetland acres*(0.4)+ total wet soil ag acres-17,178*(0.1) = Proxy for food web production',
          },
        ],
        seaLevelRise: {
          note: 'Values reported in the Ecology tab under sea level rise.',
          sources: [SOURCE_1],
        },
        info: {
          takeaway: {
            lead: 'The increase in **productive habitats** (tidal wetlands, managed wetlands, wet-soil agriculture) that have the capacity to contribute to food webs, relative to ++Business as Usual++.',
          },
          computed: 'managed wetland × 0.2 + tidal wetland × 0.4 + wet-soil agriculture × 0.1.',
          scale: {
            axis: 'Food web index points against Business as Usual. About 16,148 points scores +1, rising to +5 at about 80,740 points.',
            scores: [0, 1, 2, 3, 4, 5],
            bands: ['0', '16.1k', '32.3k', '48.4k', '64.6k', '80.7k+'],
            ends: ['Index points against Business as Usual'],
          },
          scoreRows: {
            heading: 'Where the scenarios land',
            rows: [
              ['Eco Machine', '17,240 points', 1],
              ['New Green Watershed', '61,980 points', 3],
            ],
          },
          scored: '+1 for about every 16,148 points against Business as Usual, up to +5.',
        },
        children: [
          {
            id: 'eco-foodweb-managed',
            label: 'Managed wetland',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'The Ecology report gives New Green Watershed’s 50/50 primary sub-scenario as a TOTAL, including the 5,100 acres already there that the report’s own food-web formula then subtracts. The other teams measure something different: Eco-cultural’s 102,982 counts only restored acres, while Economy’s 85,523 converts farmland within a 207,004-acre footprint rather than splitting the 248,815 mapped Delta islands. After removing the baseline, Ecology still gives 115,714, so the gap with eco-cultural remains.',
            places: [{ key: '*', label: 'All together' }],
            periods: [{ key: '*', label: 'Whole period' }],
            sources: SOURCES_1_2,
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'eco-foodweb-tidal',
            label: 'Tidal wetlands',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'This has the highest weight, 0.4 per acre, and Eco Machine’s 53,000 assumes full restoration of Suisun; see the Landscape metric’s note.',
            places: [{ key: '*', label: 'All together' }],
            periods: [{ key: '*', label: 'Whole period' }],
            sources: SOURCES_1_2,
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'eco-foodweb-wetsoil',
            label: 'Wet-soil agriculture',
            level: 'entity',
            edge: 'derives',
            provenance: 'reported',
            unit: 'acres',
            betterHigher: true,
            note: 'This has the lowest weight, at 0.1 per acre.',
            places: [{ key: '*', label: 'All together' }],
            periods: [{ key: '*', label: 'Whole period' }],
            sources: SOURCES_1_2,
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
        ],
      },
      {
        id: 'eco-species',
        label: 'Species suitability',
        level: 'metric',
        edge: 'beside',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'This score is the Ecology team’s own, reported Delta-wide for the whole period, so it reads the same on each period tab. Open the row to see each species’ value and rank: the slides rank each species on its proportion of suitable days (+1 per percentage point against Business as Usual, reversed for largemouth bass, overbite clam and Brazilian waterweed). The species ranks are Delta-wide; regions carry values only. Calling on Reserves and A Tunnel come from Ecology’s 27 Oct 2026 rerun against its own CalSim Baseline; their species ranks are ours, the same rule applied to that table.',
        places: PLACES_all_southBay_centralBay_and6More,
        periods: [{ key: '*', label: 'Whole period' }],
        sources: [SOURCE_1, SOURCE_3, SOURCE_4],
        entityNoun: 'species',
        seaLevelRise: {
          note: 'Values reported in the Ecology tab under sea level rise.',
          sources: [SOURCE_1],
        },
        info: {
          takeaway: {
            lead: 'The proportion of time and/or length of consecutive days that conditions remain **within a species’ fundamental tolerance limits** for water temperature and salinity.',
            details: [
              'This does not necessarily mean species are more abundant at the given location, only that **water quality conditions are favorable for their survival**.',
            ],
          },
          computed: 'Each species’ proportion of days inside its salinity and temperature range.',
          scored:
            'Each 1-percentage-point change in suitable days from Business as Usual changes the species score by 1, capped at ±5; increases score positively for desired species and negatively for invasive species.',
          scale: { step: '%', axis: 'Days in range vs Business as Usual' },
        },
        children: [
          {
            id: 'eco-niche-longfinJuv',
            label: 'Longfin smelt, juvenile',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: true,
            note: 'Proportion of days within 0.4–10 psu and 9–15 °C. Calling on Reserves and A Tunnel are Ecology’s 27 Oct 2026 rerun, Delta-wide only and read against its own CalSim Baseline, not the Business as Usual column.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: SOURCES_4_3_5,
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'eco-niche-longfinAdult',
            label: 'Longfin smelt, adult',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: true,
            note: 'Proportion of days within 15–30 psu and 9–18 °C. Calling on Reserves and A Tunnel are Ecology’s 27 Oct 2026 rerun, Delta-wide only and read against its own CalSim Baseline, not the Business as Usual column.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: SOURCES_4_3_5,
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'eco-niche-chinook',
            label: 'Chinook salmon, juvenile',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: true,
            note: 'Proportion of days within 0–35 psu and 10–25 °C. Calling on Reserves and A Tunnel are Ecology’s 27 Oct 2026 rerun, Delta-wide only and read against its own CalSim Baseline, not the Business as Usual column.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: SOURCES_4_3_5,
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'eco-niche-stripedBassJuv',
            label: 'Striped bass, juvenile',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: true,
            note: 'Proportion of days within 0–35 psu and 12–27 °C. Calling on Reserves and A Tunnel are Ecology’s 27 Oct 2026 rerun, Delta-wide only and read against its own CalSim Baseline, not the Business as Usual column.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: SOURCES_4_3_5,
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'eco-niche-stripedBassAdult',
            label: 'Striped bass, adult',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: true,
            note: 'Proportion of days within 0–35 psu and 12–27 °C. Calling on Reserves and A Tunnel are Ecology’s 27 Oct 2026 rerun, Delta-wide only and read against its own CalSim Baseline, not the Business as Usual column.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: SOURCES_4_3_5,
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'eco-niche-largemouthBass',
            label: 'Largemouth bass',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days within < 4 psu and 3–28 °C. Calling on Reserves and A Tunnel are Ecology’s 27 Oct 2026 rerun, Delta-wide only and read against its own CalSim Baseline, not the Business as Usual column.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: SOURCES_4_3_5,
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'eco-niche-overbiteClam',
            label: 'Overbite clam, juvenile',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days within 5–25 psu and 3–26 °C. Calling on Reserves and A Tunnel are Ecology’s 27 Oct 2026 rerun, Delta-wide only and read against its own CalSim Baseline, not the Business as Usual column.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: SOURCES_4_3_5,
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
          {
            id: 'eco-niche-egeria',
            label: 'Brazilian waterweed',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days within < 5 psu and 3–26 °C. Calling on Reserves and A Tunnel are Ecology’s 27 Oct 2026 rerun, Delta-wide only and read against its own CalSim Baseline, not the Business as Usual column.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: SOURCES_4_3_5,
            seaLevelRise: {
              note: 'Values reported in the Ecology tab under sea level rise.',
              sources: [SOURCE_1],
            },
          },
        ],
      },
      {
        id: 'eco-conceptual',
        label: 'Conceptual models',
        level: 'metric',
        edge: 'unscored',
        provenance: 'unscored',
        unit: 'score',
        betterHigher: true,
        note: 'The Oct 2026 metrics slide adds conceptual models that are absent from the Sept report; they describe ecosystem-wide interactions and summarize food-web and habitat changes for each scenario. These models are narrative by design, so no scenario receives a score.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        sources: [
          {
            doc: 'slides',
            where: 'Ecology Metrics — Conceptual models',
            quote:
              'To describe the food web changes and changes in habitat accessibility for each scenario, we will create a series of conceptual models describing ecosystem-wide interactions.',
          },
        ],
      },
    ],
  },
  // The tiered outflow table's rows
  outflowRows: {
    id: 'ecology',
    label: 'Ecology',
    level: 'team',
    provenance: 'reported',
    unit: 'score',
    betterHigher: true,
    note: 'Ecology scores reported in the Ecology tab of the ranking workbook.',
    places: [{ key: '*', label: 'Not broken out' }],
    periods: [{ key: '*', label: 'Not broken out' }],
    sources: [SOURCE_6],
    children: [
      {
        id: 'eco-habitat',
        label: 'Habitat availability',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The outflow runs change Delta outflow only, not the landscape, so they add no habitat acres.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        notApplicable: ['more', 'less', 'hist'],
      },
      {
        id: 'eco-foodweb',
        label: 'Food webs',
        level: 'metric',
        edge: 'averages',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The food-web proxy is weighted acres of wetland and wet-soil agriculture, which the outflow runs do not change.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        notApplicable: ['more', 'less', 'hist'],
      },
      {
        id: 'eco-species',
        label: 'Species suitability',
        level: 'metric',
        edge: 'beside',
        provenance: 'reported',
        unit: 'score',
        betterHigher: true,
        note: 'The aggregate species-suitability score reported in the Ecology tab. Species rows beneath it show measures only, without individual scores.',
        places: [{ key: '*', label: 'Not broken out' }],
        periods: [{ key: '*', label: 'Not broken out' }],
        sources: [SOURCE_6],
        children: [
          {
            id: 'eco-longfinJuv',
            label: 'Longfin smelt, juvenile',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: true,
            note: 'Proportion of days within the species’ salinity and temperature thresholds, as reported in the Ecology tab.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: [SOURCE_6],
          },
          {
            id: 'eco-longfinAdult',
            label: 'Longfin smelt, adult',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: true,
            note: 'Proportion of days within the species’ salinity and temperature thresholds, as reported in the Ecology tab.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: [SOURCE_6],
          },
          {
            id: 'eco-chinook',
            label: 'Chinook salmon, juvenile',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: true,
            note: 'Proportion of days within the species’ salinity and temperature thresholds, as reported in the Ecology tab.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: [SOURCE_6],
          },
          {
            id: 'eco-stripedBassJuv',
            label: 'Striped bass, juvenile',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: true,
            note: 'Proportion of days within the species’ salinity and temperature thresholds, as reported in the Ecology tab.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: [SOURCE_6],
          },
          {
            id: 'eco-stripedBassAdult',
            label: 'Striped bass, adult',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: true,
            note: 'Proportion of days within the species’ salinity and temperature thresholds, as reported in the Ecology tab.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: [SOURCE_6],
          },
          {
            id: 'eco-largemouthBass',
            label: 'Largemouth bass',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days within the species’ salinity and temperature thresholds, as reported in the Ecology tab.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: [SOURCE_6],
          },
          {
            id: 'eco-overbiteClam',
            label: 'Overbite clam, juvenile',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days within the species’ salinity and temperature thresholds, as reported in the Ecology tab.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: [SOURCE_6],
          },
          {
            id: 'eco-egeria',
            label: 'Brazilian waterweed',
            level: 'entity',
            edge: 'measures',
            provenance: 'reported',
            unit: 'share',
            betterHigher: false,
            note: 'Proportion of days within the species’ salinity and temperature thresholds, as reported in the Ecology tab.',
            places: PLACES_all_southBay_centralBay_and6More,
            periods: PERIODS_all_2019_2020,
            sources: [SOURCE_6],
          },
        ],
      },
    ],
  },
  // Today's sea level
  current: {
    // Business as Usual
    bau: {
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 0,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 0,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '2019': 0.0530963432582361, '2020': 0.0738266337300696, '*': 0.0635041434128192 },
          southBay: { '2019': 0, '2020': 0, '*': 0 },
          centralBay: { '2019': 0.00638617580766341, '2020': 0, '*': 0.00317994762439207 },
          sanPabloBay: { '2019': 0, '2020': 0.0579234972677596, '*': 0.0290809327846365 },
          suisunBay: {
            '2019': 0.00560802833530106,
            '2020': 0.00526932084309133,
            '*': 0.00543797766019988,
          },
          confluence: { '2019': 0.28099173553719, '2020': 0, '*': 0.139917695473251 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: {
            '2019': 0.0616078136739294,
            '2020': 0.0722801788375559,
            '*': 0.0669659558548447,
          },
          southDelta: {
            '2019': 0.143105698129622,
            '2020': 0.401639344262295,
            '*': 0.272904483430799,
          },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '2019': 0.132910675874561, '2020': 0.0795531102627442, '*': 0.106122103838998 },
          southBay: {
            '2019': 0.449586776859504,
            '2020': 0.0327868852459016,
            '*': 0.240329218106996,
          },
          centralBay: { '2019': 0, '2020': 0, '*': 0 },
          sanPabloBay: { '2019': 0, '2020': 0, '*': 0 },
          suisunBay: { '2019': 0, '2020': 0, '*': 0 },
          confluence: {
            '2019': 0.292011019283747,
            '2020': 0.69672131147541,
            '*': 0.49519890260631,
          },
          northDelta: { '2019': 0.644628099173554, '2020': 0, '*': 0.320987654320988 },
          centralDelta: { '2019': 0, '2020': 0, '*': 0 },
          southDelta: { '2019': 0, '2020': 0.0181190681622088, '*': 0.00909681611435997 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '2019': 0.909543756368164, '2020': 0.758589714799011, '*': 0.833756130559783 },
          southBay: { '2019': 1, '2020': 1, '*': 1 },
          centralBay: {
            '2019': 0.806160781367393,
            '2020': 0.955663189269747,
            '*': 0.735690235690236,
          },
          sanPabloBay: {
            '2019': 0.955371900826446,
            '2020': 0.99344262295082,
            '*': 0.834019204389575,
          },
          suisunBay: {
            '2019': 0.876328217237308,
            '2020': 0.963407494145199,
            '*': 0.805261610817166,
          },
          confluence: { '2019': 0.997245179063361, '2020': 1, '*': 0.958847736625514 },
          northDelta: { '2019': 1, '2020': 1, '*': 0.967078189300412 },
          centralDelta: {
            '2019': 0.930127723516153,
            '2020': 0.938897168405365,
            '*': 0.780770669659559,
          },
          southDelta: {
            '2019': 0.90691605045672,
            '2020': 0.946074201898188,
            '*': 0.825644357808101,
          },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '2019': 0.67457262538209, '2020': 0.866775207725129, '*': 0.771069395118101 },
          southBay: { '2019': 0.758677685950413, '2020': 0.89344262295082, '*': 0.826337448559671 },
          centralBay: {
            '2019': 0.682569496619083,
            '2020': 0.863263785394933,
            '*': 0.773288439955107,
          },
          sanPabloBay: {
            '2019': 0.635261707988981,
            '2020': 0.849726775956284,
            '*': 0.742935528120713,
          },
          suisunBay: {
            '2019': 0.641086186540732,
            '2020': 0.877341920374707,
            '*': 0.759700176366843,
          },
          confluence: {
            '2019': 0.666666666666667,
            '2020': 0.852459016393443,
            '*': 0.759945130315501,
          },
          northDelta: {
            '2019': 0.661157024793388,
            '2020': 0.89344262295082,
            '*': 0.777777777777778,
          },
          centralDelta: {
            '2019': 0.773102930127723,
            '2020': 0.901639344262295,
            '*': 0.837635615413393,
          },
          southDelta: {
            '2019': 0.675511091779034,
            '2020': 0.83779119930975,
            '*': 0.756985055230669,
          },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '2019': 0.873655609645647, '2020': 0.965472715023579, '*': 0.919753086419753 },
          southBay: { '2019': 1, '2020': 1, '*': 1 },
          centralBay: {
            '2019': 0.849361382419234,
            '2020': 0.955663189269747,
            '*': 0.902731013842125,
          },
          sanPabloBay: {
            '2019': 0.821487603305785,
            '2020': 0.99344262295082,
            '*': 0.907818930041152,
          },
          suisunBay: {
            '2019': 0.816115702479339,
            '2020': 0.963407494145199,
            '*': 0.890064667842446,
          },
          confluence: { '2019': 0.889807162534435, '2020': 1, '*': 0.945130315500686 },
          northDelta: { '2019': 1, '2020': 1, '*': 1 },
          centralDelta: {
            '2019': 0.958677685950413,
            '2020': 0.938897168405365,
            '*': 0.948746726524504,
          },
          southDelta: {
            '2019': 0.846020008699435,
            '2020': 0.946074201898188,
            '*': 0.896252978124323,
          },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '2019': 0.72161213630703, '2020': 0.631259824837188, '*': 0.676250070466204 },
          southBay: { '2019': 0, '2020': 0, '*': 0 },
          centralBay: { '2019': 1, '2020': 1, '*': 1 },
          sanPabloBay: { '2019': 1, '2020': 1, '*': 1 },
          suisunBay: { '2019': 1, '2020': 0.997365339578454, '*': 0.998677248677249 },
          confluence: { '2019': 0.0247933884297521, '2020': 0, '*': 0.0123456790123457 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 1, '2020': 0.997019374068554, '*': 0.99850355405911 },
          southDelta: {
            '2019': 0.975206611570248,
            '2020': 0.462036238136324,
            '*': 0.717565518735109,
          },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '2019': 0.10715498698064, '*': 0.120694514910648 },
          southBay: {
            '2019': 0.105785123966942,
            '2020': 0.134123063103525,
            '*': 0.0526748971193416,
          },
          centralBay: { '2019': 0, '2020': 0, '*': 0 },
          sanPabloBay: { '2019': 0, '2020': 0, '*': 0 },
          suisunBay: { '2019': 0, '2020': 0, '*': 0 },
          confluence: { '2019': 0.933884297520661, '2020': 0, '*': 0.791495198902606 },
          northDelta: { '2019': 0, '2020': 0.650273224043716, '*': 0 },
          centralDelta: { '2019': 0, '2020': 0, '*': 0 },
          southDelta: { '2019': 0.0134841235319704, '2020': 0, '*': 0.213125406107862 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '2019': 0.725234914525076, '2020': 0.411130284728214, '*': 0.684029539432888 },
          southBay: { '2019': 0.449586776859504, '2020': 0, '*': 0 },
          centralBay: { '2019': 0, '2020': 0.989940387481371, '*': 0.994949494949495 },
          sanPabloBay: { '2019': 0, '2020': 1, '*': 1 },
          suisunBay: { '2019': 0, '2020': 0.990925058548009, '*': 0.995002939447384 },
          confluence: { '2019': 0.292011019283747, '2020': 0, '*': 0.0288065843621399 },
          northDelta: { '2019': 0.644628099173554, '2020': 0, '*': 0 },
          centralDelta: { '2019': 0, '2020': 0.978390461997019, '*': 0.988028432472877 },
          southDelta: { '2019': 0, '2020': 0.57290767903365, '*': 0.773662551440329 },
        },
      },
    },

    // Business as Usual (CalSim)
    csbau: {
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 0,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 0,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '*': 0.0658436213991769 },
          southBay: { '*': 0 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0.114207650273224 },
          suisunBay: { '*': 0.00702576112412178 },
          confluence: { '*': 0 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.0715350223546945 },
          southDelta: { '*': 0.368852459016393 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '*': 0.0319325735992403 },
          southBay: { '*': 0 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.702185792349727 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.041846419327006 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '*': 0.817861665083887 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.668032786885246 },
          sanPabloBay: { '*': 0.715300546448087 },
          suisunBay: { '*': 0.737412177985948 },
          confluence: { '*': 0.920765027322404 },
          northDelta: { '*': 0.934426229508197 },
          centralDelta: { '*': 0.641579731743666 },
          southDelta: { '*': 0.742018981880932 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '*': 0.769586894586895 },
          southBay: { '*': 0.895081967213115 },
          centralBay: { '*': 0.860283159463487 },
          sanPabloBay: { '*': 0.849180327868852 },
          suisunBay: { '*': 0.879391100702576 },
          confluence: { '*': 0.852459016393443 },
          northDelta: { '*': 0.89344262295082 },
          centralDelta: { '*': 0.900894187779434 },
          southDelta: { '*': 0.837359792924935 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '*': 0.911166508388731 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.955290611028316 },
          sanPabloBay: { '*': 0.995628415300546 },
          suisunBay: { '*': 0.970433255269321 },
          confluence: { '*': 1 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.940387481371088 },
          southDelta: { '*': 0.937877480586713 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '*': 0.850071225071225 },
          southBay: { '*': 0 },
          centralBay: { '*': 1 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.997658079625293 },
          confluence: { '*': 0 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.996274217585693 },
          southDelta: { '*': 0.343830888697153 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '*': 0.0796138018360241 },
          southBay: { '*': 0 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.628415300546448 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.572044866264021 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '*': 0.853869895536562 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.990312965722802 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.990632318501171 },
          confluence: { '*': 0 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.978390461997019 },
          southDelta: { '*': 0.411993097497843 },
        },
      },
    },

    // Eco Machine
    em: {
      takeaway: {
        lead: 'Eco Machine increased salinity in Franks Tract, **reducing suitability for freshwater invasives like Brazilian waterweed and largemouth bass** but increasing suitability for overbite clams.',
        points: [
          {
            label: 'Longfin smelt',
            text: 'Juvenile longfin smelt also saw an increase in proportion of suitable days.',
          },
          {
            label: 'Habitat and food webs',
            text: 'It does expand habitat and improve food web contributions relative to baseline, but not as much as New Green Watershed.',
          },
        ],
      },
      scores: {
        // Ecology (score)
        ecology: 1.33,

        // Habitat availability (score)
        'eco-habitat': 2,

        // Food webs (score)
        'eco-foodweb': 1,

        // Species suitability (score)
        'eco-species': 0,
      },
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 43100,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 43100,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '2019': 0.06, '2020': 0.071, '*': 0.06 },
          southBay: { '2019': 0, '2020': 0, '*': 0 },
          centralBay: { '2019': 0.007, '2020': 0, '*': 0.007 },
          sanPabloBay: { '2019': 0, '2020': 0.044, '*': 0 },
          suisunBay: { '2019': 0.005, '2020': 0.005, '*': 0.005 },
          confluence: { '2019': 0.138, '2020': 0, '*': 0.138 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 0.062, '2020': 0.073, '*': 0.062 },
          southDelta: { '2019': 0.228, '2020': 0.347, '*': 0.228 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '2019': 0.133, '2020': 0.08, '*': 0.133 },
          southBay: { '2019': 0.012, '2020': 0.012, '*': 0.012 },
          centralBay: { '2019': 0, '2020': 0, '*': 0 },
          sanPabloBay: { '2019': 0, '2020': 0, '*': 0 },
          suisunBay: { '2019': 0, '2020': 0, '*': 0 },
          confluence: { '2019': 0.415, '2020': 0.649, '*': 0.415 },
          northDelta: { '2019': 0.508, '2020': 0, '*': 0.508 },
          centralDelta: { '2019': 0, '2020': 0, '*': 0 },
          southDelta: { '2019': 0.001, '2020': 0.067, '*': 0.001 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '2019': 0.905, '2020': 0.755, '*': 0.905 },
          southBay: { '2019': 0.987, '2020': 0.952, '*': 0.987 },
          centralBay: { '2019': 0.797, '2020': 0.65, '*': 0.797 },
          sanPabloBay: { '2019': 0.957, '2020': 0.717, '*': 0.957 },
          suisunBay: { '2019': 0.888, '2020': 0.741, '*': 0.888 },
          confluence: { '2019': 0.984, '2020': 0.894, '*': 0.984 },
          northDelta: { '2019': 0.872, '2020': 0.715, '*': 0.872 },
          centralDelta: { '2019': 0.932, '2020': 0.632, '*': 0.932 },
          southDelta: { '2019': 0.932, '2020': 0.756, '*': 0.932 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '2019': 0.674, '2020': 0.865, '*': 0.674 },
          southBay: { '2019': 0.715, '2020': 0.893, '*': 0.715 },
          centralBay: { '2019': 0.684, '2020': 0.861, '*': 0.684 },
          sanPabloBay: { '2019': 0.635, '2020': 0.85, '*': 0.635 },
          suisunBay: { '2019': 0.63, '2020': 0.874, '*': 0.63 },
          confluence: { '2019': 0.673, '2020': 0.867, '*': 0.673 },
          northDelta: { '2019': 0.679, '2020': 0.871, '*': 0.679 },
          centralDelta: { '2019': 0.773, '2020': 0.902, '*': 0.773 },
          southDelta: { '2019': 0.674, '2020': 0.839, '*': 0.674 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '2019': 0.874, '2020': 0.962, '*': 0.874 },
          southBay: { '2019': 0.996, '2020': 0.939, '*': 0.996 },
          centralBay: { '2019': 0.852, '2020': 0.939, '*': 0.852 },
          sanPabloBay: { '2019': 0.821, '2020': 0.993, '*': 0.821 },
          suisunBay: { '2019': 0.808, '2020': 0.964, '*': 0.808 },
          confluence: { '2019': 0.887, '2020': 0.984, '*': 0.887 },
          northDelta: { '2019': 0.964, '2020': 0.925, '*': 0.964 },
          centralDelta: { '2019': 0.959, '2020': 0.939, '*': 0.959 },
          southDelta: { '2019': 0.855, '2020': 0.95, '*': 0.855 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '2019': 0.72, '2020': 0.616, '*': 0.72 },
          southBay: { '2019': 0, '2020': 0, '*': 0 },
          centralBay: { '2019': 0.99, '2020': 0.981, '*': 0.99 },
          sanPabloBay: { '2019': 1, '2020': 1, '*': 1 },
          suisunBay: { '2019': 1, '2020': 0.998, '*': 1 },
          confluence: { '2019': 0.006, '2020': 0, '*': 0.006 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 1, '2020': 0.997, '*': 1 },
          southDelta: { '2019': 0.927, '2020': 0.34, '*': 0.927 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '2019': 0.108, '2020': 0.143, '*': 0.108 },
          southBay: { '2019': 0.041, '2020': 0, '*': 0.041 },
          centralBay: { '2019': 0, '2020': 0, '*': 0 },
          sanPabloBay: { '2019': 0, '2020': 0, '*': 0 },
          suisunBay: { '2019': 0, '2020': 0, '*': 0 },
          confluence: { '2019': 0.93, '2020': 0.52, '*': 0.93 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 0, '2020': 0, '*': 0 },
          southDelta: { '2019': 0.046, '2020': 0.522, '*': 0.046 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '2019': 0.723, '2020': 0.633, '*': 0.723 },
          southBay: { '2019': 0, '2020': 0, '*': 0 },
          centralBay: { '2019': 0.986, '2020': 0.97, '*': 0.986 },
          sanPabloBay: { '2019': 1, '2020': 1, '*': 1 },
          suisunBay: { '2019': 0.999, '2020': 0.991, '*': 0.999 },
          confluence: { '2019': 0.02, '2020': 0, '*': 0.02 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 0.997, '2020': 0.978, '*': 0.997 },
          southDelta: { '2019': 0.947, '2020': 0.466, '*': 0.947 },
        },
      },
    },

    // New Green Watershed
    ngw: {
      takeaway: {
        lead: 'The effects on species fundamental niches were the same as Eco Machine, but **contributions to food webs were much higher,** due to the expansion of managed wetlands and wet soil agriculture within the Delta.',
        points: [
          { label: 'Habitat', text: 'It also contributed a larger area of accessible habitat.' },
        ],
      },
      scores: {
        // Ecology (score)
        ecology: 2.34,

        // Habitat availability (score)
        'eco-habitat': 4,

        // Food webs (score)
        'eco-foodweb': 3,

        // Species suitability (score)
        'eco-species': 0,
      },
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 67000,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 102982,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 67000,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 145833,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '2019': 0.06, '2020': 0.07, '*': 0.06 },
          southBay: { '2019': 0, '2020': 0, '*': 0 },
          centralBay: { '2019': 0.006, '2020': 0, '*': 0.006 },
          sanPabloBay: { '2019': 0, '2020': 0.044, '*': 0 },
          suisunBay: { '2019': 0.005, '2020': 0.003, '*': 0.005 },
          confluence: { '2019': 0.139, '2020': 0, '*': 0.139 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 0.062, '2020': 0.073, '*': 0.062 },
          southDelta: { '2019': 0.227, '2020': 0.347, '*': 0.227 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '2019': 0.133, '2020': 0.08, '*': 0.133 },
          southBay: { '2019': 0.564, '2020': 0.012, '*': 0.564 },
          centralBay: { '2019': 0, '2020': 0, '*': 0 },
          sanPabloBay: { '2019': 0, '2020': 0, '*': 0 },
          suisunBay: { '2019': 0, '2020': 0, '*': 0 },
          confluence: { '2019': 0.415, '2020': 0.65, '*': 0.415 },
          northDelta: { '2019': 0.507, '2020': 0, '*': 0.507 },
          centralDelta: { '2019': 0, '2020': 0, '*': 0 },
          southDelta: { '2019': 0.001, '2020': 0.067, '*': 0.001 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '2019': 0.905, '2020': 0.755, '*': 0.905 },
          southBay: { '2019': 0.987, '2020': 0.952, '*': 0.987 },
          centralBay: { '2019': 0.797, '2020': 0.65, '*': 0.797 },
          sanPabloBay: { '2019': 0.958, '2020': 0.717, '*': 0.958 },
          suisunBay: { '2019': 0.887, '2020': 0.74, '*': 0.887 },
          confluence: { '2019': 0.984, '2020': 0.894, '*': 0.984 },
          northDelta: { '2019': 0.872, '2020': 0.715, '*': 0.872 },
          centralDelta: { '2019': 0.931, '2020': 0.632, '*': 0.931 },
          southDelta: { '2019': 0.903, '2020': 0.757, '*': 0.903 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '2019': 0.674, '2020': 0.865, '*': 0.674 },
          southBay: { '2019': 0.715, '2020': 0.893, '*': 0.715 },
          centralBay: { '2019': 0.684, '2020': 0.861, '*': 0.684 },
          sanPabloBay: { '2019': 0.635, '2020': 0.85, '*': 0.635 },
          suisunBay: { '2019': 0.63, '2020': 0.874, '*': 0.63 },
          confluence: { '2019': 0.673, '2020': 0.867, '*': 0.673 },
          northDelta: { '2019': 0.679, '2020': 0.871, '*': 0.679 },
          centralDelta: { '2019': 0.773, '2020': 0.902, '*': 0.773 },
          southDelta: { '2019': 0.674, '2020': 0.839, '*': 0.674 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '2019': 0.874, '2020': 0.962, '*': 0.874 },
          southBay: { '2019': 0.996, '2020': 0.997, '*': 0.996 },
          centralBay: { '2019': 0.852, '2020': 0.939, '*': 0.852 },
          sanPabloBay: { '2019': 0.821, '2020': 0.993, '*': 0.821 },
          suisunBay: { '2019': 0.808, '2020': 0.964, '*': 0.808 },
          confluence: { '2019': 0.887, '2020': 0.984, '*': 0.887 },
          northDelta: { '2019': 0.964, '2020': 0.925, '*': 0.964 },
          centralDelta: { '2019': 0.959, '2020': 0.939, '*': 0.959 },
          southDelta: { '2019': 0.855, '2020': 0.951, '*': 0.855 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '2019': 0.72, '2020': 0.616, '*': 0.72 },
          southBay: { '2019': 0, '2020': 0, '*': 0 },
          centralBay: { '2019': 0.99, '2020': 1, '*': 0.99 },
          sanPabloBay: { '2019': 1, '2020': 1, '*': 1 },
          suisunBay: { '2019': 1, '2020': 0.998, '*': 1 },
          confluence: { '2019': 0.006, '2020': 0, '*': 0.006 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 1, '2020': 0.996, '*': 1 },
          southDelta: { '2019': 0.928, '2020': 0.342, '*': 0.928 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '2019': 0.108, '2020': 0.142, '*': 0.108 },
          southBay: { '2019': 0.041, '2020': 0, '*': 0.041 },
          centralBay: { '2019': 0, '2020': 0, '*': 0 },
          sanPabloBay: { '2019': 0, '2020': 0, '*': 0 },
          suisunBay: { '2019': 0, '2020': 0, '*': 0 },
          confluence: { '2019': 0.928, '2020': 0.516, '*': 0.928 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 0, '2020': 0, '*': 0 },
          southDelta: { '2019': 0.046, '2020': 0.521, '*': 0.046 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '2019': 0.723, '2020': 0.633, '*': 0.723 },
          southBay: { '2019': 0, '2020': 0, '*': 0 },
          centralBay: { '2019': 0.986, '2020': 0.97, '*': 0.986 },
          sanPabloBay: { '2019': 1, '2020': 1, '*': 1 },
          suisunBay: { '2019': 0.999, '2020': 0.992, '*': 0.999 },
          confluence: { '2019': 0.02, '2020': 0, '*': 0.02 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 0.997, '2020': 0.978, '*': 0.997 },
          southDelta: { '2019': 0.947, '2020': 0.468, '*': 0.947 },
        },
      },
    },

    // Bolster & Fortify
    bf: {
      takeaway: {
        lead: 'We detected **no differences** between Bolster and Fortify and the baseline, Business as Usual.',
      },
      scores: {
        // Ecology (score)
        ecology: 0,

        // Habitat availability (score)
        'eco-habitat': 0,

        // Food webs (score)
        'eco-foodweb': 0,

        // Species suitability (score)
        'eco-species': 0,
      },
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 0,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 0,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '2019': 0.053, '2020': 0.074, '*': 0.053 },
          southBay: { '2019': 0, '2020': 0, '*': 0 },
          centralBay: { '2019': 0.006, '2020': 0, '*': 0.006 },
          sanPabloBay: { '2019': 0, '2020': 0.057, '*': 0 },
          suisunBay: { '2019': 0.005, '2020': 0.004, '*': 0.005 },
          confluence: { '2019': 0, '2020': 0, '*': 0 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 0.062, '2020': 0.072, '*': 0.062 },
          southDelta: { '2019': 0.188, '2020': 0.358, '*': 0.188 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '2019': 0.133, '2020': 0.08, '*': 0.133 },
          southBay: { '2019': 0.56, '2020': 0.01, '*': 0.56 },
          centralBay: { '2019': 0, '2020': 0, '*': 0 },
          sanPabloBay: { '2019': 0, '2020': 0, '*': 0 },
          suisunBay: { '2019': 0, '2020': 0, '*': 0 },
          confluence: { '2019': 0.424, '2020': 0.651, '*': 0.424 },
          northDelta: { '2019': 0.507, '2020': 0, '*': 0.507 },
          centralDelta: { '2019': 0, '2020': 0, '*': 0 },
          southDelta: { '2019': 0.001, '2020': 0.067, '*': 0.001 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '2019': 0.91, '2020': 0.759, '*': 0.91 },
          southBay: { '2019': 0.987, '2020': 0.952, '*': 0.987 },
          centralBay: { '2019': 0.811, '2020': 0.667, '*': 0.811 },
          sanPabloBay: { '2019': 0.955, '2020': 0.714, '*': 0.955 },
          suisunBay: { '2019': 0.888, '2020': 0.741, '*': 0.888 },
          confluence: { '2019': 0.984, '2020': 0.894, '*': 0.984 },
          northDelta: { '2019': 0.872, '2020': 0.714, '*': 0.872 },
          centralDelta: { '2019': 0.93, '2020': 0.632, '*': 0.93 },
          southDelta: { '2019': 0.914, '2020': 0.763, '*': 0.914 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '2019': 0.675, '2020': 0.867, '*': 0.675 },
          southBay: { '2019': 0.715, '2020': 0.893, '*': 0.715 },
          centralBay: { '2019': 0.684, '2020': 0.861, '*': 0.684 },
          sanPabloBay: { '2019': 0.635, '2020': 0.85, '*': 0.635 },
          suisunBay: { '2019': 0.63, '2020': 0.874, '*': 0.63 },
          confluence: { '2019': 0.673, '2020': 0.867, '*': 0.673 },
          northDelta: { '2019': 0.679, '2020': 0.871, '*': 0.679 },
          centralDelta: { '2019': 0.773, '2020': 0.902, '*': 0.773 },
          southDelta: { '2019': 0.674, '2020': 0.839, '*': 0.674 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '2019': 0.874, '2020': 0.966, '*': 0.874 },
          southBay: { '2019': 0.996, '2020': 0.996, '*': 0.996 },
          centralBay: { '2019': 0.855, '2020': 0.959, '*': 0.855 },
          sanPabloBay: { '2019': 0.821, '2020': 0.993, '*': 0.821 },
          suisunBay: { '2019': 0.808, '2020': 0.964, '*': 0.808 },
          confluence: { '2019': 0.889, '2020': 0.984, '*': 0.889 },
          northDelta: { '2019': 0.964, '2020': 0.925, '*': 0.964 },
          centralDelta: { '2019': 0.959, '2020': 0.94, '*': 0.959 },
          southDelta: { '2019': 0.852, '2020': 0.95, '*': 0.852 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '2019': 0.722, '2020': 0.631, '*': 0.722 },
          southBay: { '2019': 0, '2020': 0, '*': 0 },
          centralBay: { '2019': 1, '2020': 1, '*': 1 },
          sanPabloBay: { '2019': 1, '2020': 1, '*': 1 },
          suisunBay: { '2019': 1, '2020': 0.998, '*': 1 },
          confluence: { '2019': 0.004, '2020': 0, '*': 0.004 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 1, '2020': 0.997, '*': 1 },
          southDelta: { '2019': 0.931, '2020': 0.411, '*': 0.931 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '2019': 0.107, '2020': 0.134, '*': 0.107 },
          southBay: { '2019': 0.036, '2020': 0, '*': 0.036 },
          centralBay: { '2019': 0, '2020': 0, '*': 0 },
          sanPabloBay: { '2019': 0, '2020': 0, '*': 0 },
          suisunBay: { '2019': 0, '2020': 0, '*': 0 },
          confluence: { '2019': 0.929, '2020': 0.502, '*': 0.929 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 0, '2020': 0, '*': 0 },
          southDelta: { '2019': 0.046, '2020': 0.482, '*': 0.046 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '2019': 0.725, '2020': 0.643, '*': 0.725 },
          southBay: { '2019': 0, '2020': 0, '*': 0 },
          centralBay: { '2019': 1, '2020': 0.991, '*': 1 },
          sanPabloBay: { '2019': 1, '2020': 1, '*': 1 },
          suisunBay: { '2019': 0.999, '2020': 0.991, '*': 0.999 },
          confluence: { '2019': 0.018, '2020': 0, '*': 0.018 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 0.997, '2020': 0.978, '*': 0.997 },
          southDelta: { '2019': 0.946, '2020': 0.505, '*': 0.946 },
        },
      },
    },

    // Calling on Reserves
    cor: {
      takeaway: {
        lead: 'Calling on Reserves **only had small differences from the baseline.**',
        points: [
          {
            label: '2019',
            text: 'It decreased the proportion of suitable points for longfin smelt and salmon, two desirable species, in 2019.',
          },
          {
            label: '2020',
            text: 'In 2020, it slightly decreased the suitability for freshwater invasives, and slightly increased suitability for overbite clam.',
          },
        ],
      },
      scores: {
        // Ecology (score)
        ecology: -0.33,

        // Habitat availability (score)
        'eco-habitat': 0,

        // Food webs (score)
        'eco-foodweb': 0,

        // Species suitability (score)
        'eco-species': -2,
      },
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 0,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 0,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '2019': 0.036, '2020': 0.093, '*': 0.036 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.004863 },
          sanPabloBay: { '*': 0.05679 },
          suisunBay: { '*': 0.006467 },
          confluence: { '*': 0.168724 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.0647 },
          southDelta: { '*': 0.2313 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '2019': 0.036, '2020': 0.028, '*': 0.036 },
          southBay: { '*': 0.22469 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.49657 },
          northDelta: { '*': 0.28395 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.02123 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '2019': 0.905, '2020': 0.73, '*': 0.905 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.7282 },
          sanPabloBay: { '*': 0.8529 },
          suisunBay: { '*': 0.8239 },
          confluence: { '*': 0.9588 },
          northDelta: { '*': 0.9671 },
          centralDelta: { '*': 0.7789 },
          southDelta: { '*': 0.8265 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '2019': 0.673, '2020': 0.866, '*': 0.673 },
          southBay: { '*': 0.8247 },
          centralBay: { '*': 0.7636 },
          sanPabloBay: { '*': 0.7457 },
          suisunBay: { '*': 0.761 },
          confluence: { '*': 0.7599 },
          northDelta: { '*': 0.7819 },
          centralDelta: { '*': 0.838 },
          southDelta: { '*': 0.757 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '2019': 0.858, '2020': 0.965, '*': 0.858 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.9072 },
          sanPabloBay: { '*': 0.907 },
          suisunBay: { '*': 0.8923 },
          confluence: { '*': 0.9465 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.9525 },
          southDelta: { '*': 0.8911 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '2019': 0.909, '2020': 0.792, '*': 0.909 },
          southBay: { '*': 0 },
          centralBay: { '*': 1 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.9986 },
          confluence: { '*': 0.01235 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.9981 },
          southDelta: { '*': 0.6528 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '2019': 0.036, '2020': 0.123, '*': 0.036 },
          southBay: { '*': 0.06091 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.78326 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.29825 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '2019': 0.909, '2020': 0.799, '*': 0.909 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.9953 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.995 },
          confluence: { '*': 0.0329 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.9877 },
          southDelta: { '*': 0.6885 },
        },
      },
    },

    // A Tunnel
    tunnel: {
      takeaway: {
        lead: 'A Tunnel **affected the most number of species** of all the adaptation scenarios.',
        points: [
          {
            label: 'Species',
            text: 'It decreased the proportion of suitable points for longfin smelt juveniles and overbite clams, while increasing proportions of suitable points for Brazilian waterweed and largemouth bass in 2020.',
          },
          {
            label: 'Chinook salmon',
            text: 'It had variable effects for Chinook salmon across the two years.',
          },
          {
            label: 'Food webs',
            text: 'We do not have a way to estimate how A Tunnel would affect food webs.',
          },
        ],
      },
      scores: {
        // Ecology (score)
        ecology: 0.33,

        // Habitat availability (score)
        'eco-habitat': 0,

        // Food webs (score)
        'eco-foodweb': 0,

        // Species suitability (score)
        'eco-species': 1,
      },
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 0,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 0,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '2019': 0.039, '2020': 0.095, '*': 0.039 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.00486 },
          sanPabloBay: { '*': 0.0573388 },
          suisunBay: { '*': 0.0064668 },
          confluence: { '*': 0.16049 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.065095 },
          southDelta: { '*': 0.245397 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '2019': 0.037, '2020': 0.026, '*': 0.037 },
          southBay: { '*': 0.223868 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.525377 },
          northDelta: { '*': 0.271605 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.015378 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '2019': 0.909, '2020': 0.727, '*': 0.909 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.73176 },
          sanPabloBay: { '*': 0.84883 },
          suisunBay: { '*': 0.82378 },
          confluence: { '*': 0.9588477 },
          northDelta: { '*': 0.967078 },
          centralDelta: { '*': 0.778526 },
          southDelta: { '*': 0.825644 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '2019': 0.673, '2020': 0.866, '*': 0.673 },
          southBay: { '*': 0.824691 },
          centralBay: { '*': 0.763749 },
          sanPabloBay: { '*': 0.745679 },
          suisunBay: { '*': 0.7602881 },
          confluence: { '*': 0.759945 },
          northDelta: { '*': 0.78189 },
          centralDelta: { '*': 0.8395062 },
          southDelta: { '*': 0.7565519 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '2019': 0.859, '2020': 0.965, '*': 0.859 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.907782 },
          sanPabloBay: { '*': 0.9061728 },
          suisunBay: { '*': 0.8921223 },
          confluence: { '*': 0.947874 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.95361 },
          southDelta: { '*': 0.892138 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '2019': 0.907, '2020': 0.81, '*': 0.907 },
          southBay: { '*': 0 },
          centralBay: { '*': 1 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.998677 },
          confluence: { '*': 0.0068587 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.998504 },
          southDelta: { '*': 0.6982889 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '2019': 0.036, '2020': 0.105, '*': 0.036 },
          southBay: { '*': 0.049383 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.794239 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.249946 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '2019': 0.908, '2020': 0.817, '*': 0.908 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.99495 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.995003 },
          confluence: { '*': 0.021948 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.987654 },
          southDelta: { '*': 0.736842 },
        },
      },
    },

    // Historical Baseline
    hist: {
      measures: {
        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-longfinJuv': {
          '*': { '*': 0.257118729944266 },
          centralBay: { '*': 0.272862086010875 },
          sanPabloBay: { '*': 0.224179994578477 },
          suisunBay: { '*': 0.0290718890645907 },
          confluence: { '*': 0 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.467680068191504 },
          southDelta: { '*': 0.439614855570839 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-longfinAdult': {
          '*': { '*': 0.0280695828407364 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.707983193277311 },
          northDelta: { '*': 0.180672268907563 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.112242090784044 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-chinook': {
          '*': { '*': 0.874615774362439 },
          centralBay: { '*': 0.795023891909705 },
          sanPabloBay: { '*': 0.875576036866359 },
          suisunBay: { '*': 0.844301179905121 },
          confluence: { '*': 1 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.902542974854383 },
          southDelta: { '*': 0.988170563961486 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-stripedBassJuv': {
          '*': { '*': 0.676811349434217 },
          centralBay: { '*': 0.700444883835887 },
          sanPabloBay: { '*': 0.700189753320683 },
          suisunBay: { '*': 0.699306653691765 },
          confluence: { '*': 0.653361344537815 },
          northDelta: { '*': 0.701680672268908 },
          centralDelta: { '*': 0.610882227589146 },
          southDelta: { '*': 0.690233837689133 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-stripedBassAdult': {
          '*': { '*': 0.959398750211113 },
          centralBay: { '*': 0.955841159993409 },
          sanPabloBay: { '*': 0.962591488208187 },
          suisunBay: { '*': 0.97494222114098 },
          confluence: { '*': 1 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.925699673249041 },
          southDelta: { '*': 0.981568088033012 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-largemouthBass': {
          '*': { '*': 0.846377301131566 },
          centralBay: { '*': 1 },
          sanPabloBay: { '*': 0.921658986175115 },
          suisunBay: { '*': 1 },
          confluence: { '*': 0 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 1 },
          southDelta: { '*': 0.0902338376891334 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-overbiteClam': {
          '*': { '*': 0.112717446377301 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0.0563838438601247 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.331932773109244 },
          northDelta: { '*': 0.00210084033613445 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.817056396148556 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-egeria': {
          '*': { '*': 0.860496537747002 },
          centralBay: { '*': 1 },
          sanPabloBay: { '*': 0.943616156139875 },
          suisunBay: { '*': 1 },
          confluence: { '*': 0 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 1 },
          southDelta: { '*': 0.182943603851444 },
        },
      },
    },

    // Increased Delta outflow
    more: {
      scores: {
        // Ecology (score)
        ecology: 0,

        // Species suitability (score)
        'eco-species': 0,
      },
      measures: {
        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-longfinJuv': {
          '*': { '*': 0.197964909908387 },
          centralBay: { '2019': 0.076, '2020': 0.076, '*': 0.076 },
          sanPabloBay: { '2019': 0.277, '2020': 0.277, '*': 0.277 },
          suisunBay: { '2019': 0.029, '2020': 0.029, '*': 0.029 },
          confluence: { '2019': 0, '2020': 0, '*': 0 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 0.448, '2020': 0.448, '*': 0.448 },
          southDelta: { '2019': 0.455, '2020': 0.455, '*': 0.455 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-longfinAdult': {
          '*': { '*': 0.02701058112 },
          centralBay: { '2019': 0, '2020': 0, '*': 0 },
          sanPabloBay: { '2019': 0, '2020': 0, '*': 0 },
          suisunBay: { '2019': 0, '2020': 0, '*': 0 },
          confluence: { '2019': 0.497, '2020': 0.497, '*': 0.497 },
          northDelta: { '2019': 0.609, '2020': 0.609, '*': 0.609 },
          centralDelta: { '2019': 0, '2020': 0, '*': 0 },
          southDelta: { '2019': 0.075, '2020': 0.075, '*': 0.075 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-chinook': {
          '*': { '*': 0.866806395997431 },
          centralBay: { '*': 0.796177294447191 },
          sanPabloBay: { '*': 0.860395771211711 },
          suisunBay: { '*': 0.840126536074948 },
          confluence: { '*': 0.714285714285714 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.902504981497296 },
          southDelta: { '*': 0.9853833425262 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-stripedBassJuv': {
          '*': { '*': 0.694094182076333 },
          centralBay: { '*': 0.69962102488054 },
          sanPabloBay: { '*': 0.708864190837625 },
          suisunBay: { '*': 0.704586932716876 },
          confluence: { '*': 1 },
          northDelta: { '*': 0.792016806722689 },
          centralDelta: { '*': 0.608311984059209 },
          southDelta: { '*': 0.759238830667402 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-stripedBassAdult': {
          '*': { '*': 0.958960143335249 },
          centralBay: { '*': 0.954193442082715 },
          sanPabloBay: { '*': 0.969639468690702 },
          suisunBay: { '*': 0.978951210609563 },
          confluence: { '*': 0.997899159663866 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.915029888983775 },
          southDelta: { '*': 0.9853833425262 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-largemouthBass': {
          '*': { '*': 0.882221696359149 },
          centralBay: { '2019': 1, '2020': 1, '*': 1 },
          sanPabloBay: { '2019': 0.978, '2020': 0.978, '*': 0.978 },
          suisunBay: { '2019': 1, '2020': 1, '*': 1 },
          confluence: { '2019': 0, '2020': 0, '*': 0 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 1, '2020': 1, '*': 1 },
          southDelta: { '2019': 0.323, '2020': 0.323, '*': 0.323 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-overbiteClam': {
          '*': { '*': 0.0733917041344106 },
          centralBay: { '2019': 0, '2020': 0, '*': 0 },
          sanPabloBay: { '2019': 0.009, '2020': 0.009, '*': 0.009 },
          suisunBay: { '2019': 0, '2020': 0, '*': 0 },
          confluence: { '2019': 0.489, '2020': 0.489, '*': 0.489 },
          northDelta: { '2019': 0.006, '2020': 0.006, '*': 0.006 },
          centralDelta: { '2019': 0, '2020': 0, '*': 0 },
          southDelta: { '2019': 0.523, '2020': 0.523, '*': 0.523 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-egeria': {
          '*': { '*': 0.902403569859031 },
          centralBay: { '2019': 1, '2020': 1, '*': 1 },
          sanPabloBay: { '2019': 0.999, '2020': 0.999, '*': 0.999 },
          suisunBay: { '2019': 1, '2020': 1, '*': 1 },
          confluence: { '2019': 0, '2020': 0, '*': 0 },
          northDelta: { '2019': 0, '2020': 0, '*': 0 },
          centralDelta: { '2019': 1, '2020': 1, '*': 1 },
          southDelta: { '2019': 0.476, '2020': 0.476, '*': 0.476 },
        },
      },
    },
  },
  // With sea level rise
  seaLevelRise: {
    // Business as Usual
    bau: {
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 0,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 0,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,
      },
    },

    // Business as Usual (CalSim)
    csbau: {
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 0,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 0,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '*': 0.0816318455207344 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.0574261129816685 },
          sanPabloBay: { '*': 0.089437585733882 },
          suisunBay: { '*': 0.00455614344503233 },
          confluence: { '*': 0.156378600823045 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.0692106247661803 },
          southDelta: { '*': 0.238249945852285 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '*': 0.0346232985121874 },
          southBay: { '*': 0.221399176954733 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.547325102880658 },
          northDelta: { '*': 0.275720164609054 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.0303227203811999 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '*': 0.82181861348528 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.735129068462402 },
          sanPabloBay: { '*': 0.0658436213991769 },
          suisunBay: { '*': 0.82554379776602 },
          confluence: { '*': 0.969821673525377 },
          northDelta: { '*': 0.967078189300412 },
          centralDelta: { '*': 0.783763561541339 },
          southDelta: { '*': 0.834957764782326 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '*': 0.766263057929725 },
          southBay: { '*': 0.816460905349794 },
          centralBay: { '*': 0.757388701833146 },
          sanPabloBay: { '*': 0.742661179698217 },
          suisunBay: { '*': 0.759700176366843 },
          confluence: { '*': 0.753086419753086 },
          northDelta: { '*': 0.777777777777778 },
          centralDelta: { '*': 0.836887392442948 },
          southDelta: { '*': 0.748321420836041 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '*': 0.909979423868313 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.902543958099514 },
          sanPabloBay: { '*': 0.906447187928669 },
          suisunBay: { '*': 0.89212228101117 },
          confluence: { '*': 0.947873799725652 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.954358398802843 },
          southDelta: { '*': 0.887589343729695 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '*': 0.839466603355492 },
          southBay: { '*': 0 },
          centralBay: { '*': 1 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.998677248677249 },
          confluence: { '*': 0.00411522633744856 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.999251777029555 },
          southDelta: { '*': 0.596707818930041 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '*': 0.0889917695473251 },
          southBay: { '*': 0.0510288065843621 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.780521262002744 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.350444011262725 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '*': 0.844966761633428 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.997007108118219 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.995296884185773 },
          confluence: { '*': 0.0137174211248285 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.992891881780771 },
          southDelta: { '*': 0.637426900584795 },
        },
      },
    },

    // Eco Machine
    em: {
      scores: {
        // Ecology (score)
        ecology: 1.33,

        // Habitat availability (score)
        'eco-habitat': 2,

        // Food webs (score)
        'eco-foodweb': 1,

        // Species suitability (score)
        'eco-species': 1,
      },
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 43100,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 43100,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '2019': 0.058, '2020': 0.09, '*': 0.058 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.01 },
          sanPabloBay: { '*': 0.048 },
          suisunBay: { '*': 0.003 },
          confluence: { '*': 0.124 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.066 },
          southDelta: { '*': 0.295 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '2019': 0.038, '2020': 0.027, '*': 0.038 },
          southBay: { '*': 0.228 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.524 },
          northDelta: { '*': 0.329 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.017 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '2019': 0.898, '2020': 0.731, '*': 0.898 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.741 },
          sanPabloBay: { '*': 0.839 },
          suisunBay: { '*': 0.808 },
          confluence: { '*': 0.969 },
          northDelta: { '*': 0.967 },
          centralDelta: { '*': 0.789 },
          southDelta: { '*': 0.824 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '2019': 0.671, '2020': 0.863, '*': 0.671 },
          southBay: { '*': 0.816 },
          centralBay: { '*': 0.764 },
          sanPabloBay: { '*': 0.739 },
          suisunBay: { '*': 0.758 },
          confluence: { '*': 0.754 },
          northDelta: { '*': 0.778 },
          centralDelta: { '*': 0.836 },
          southDelta: { '*': 0.755 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '2019': 0.857, '2020': 0.965, '*': 0.857 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.904 },
          sanPabloBay: { '*': 0.907 },
          suisunBay: { '*': 0.888 },
          confluence: { '*': 0.949 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.954 },
          southDelta: { '*': 0.897 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '2019': 0.905, '2020': 0.765, '*': 0.905 },
          southBay: { '*': 0 },
          centralBay: { '*': 1 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.999 },
          confluence: { '*': 0.007 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.999 },
          southDelta: { '*': 0.568 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '2019': 0.037, '2020': 0.135, '*': 0.037 },
          southBay: { '*': 0.053 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.798 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.333 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '2019': 0.908, '2020': 0.789, '*': 0.908 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.997 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.995 },
          confluence: { '*': 0.018 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.99 },
          southDelta: { '*': 0.656 },
        },
      },
    },

    // New Green Watershed
    ngw: {
      scores: {
        // Ecology (score)
        ecology: 3,

        // Habitat availability (score)
        'eco-habitat': 4,

        // Food webs (score)
        'eco-foodweb': 3,

        // Species suitability (score)
        'eco-species': 2,
      },
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 67000,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 102982,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 67000,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 145833,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '2019': 0.058, '2020': 0.09, '*': 0.058 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.01 },
          sanPabloBay: { '*': 0.047 },
          suisunBay: { '*': 0.003 },
          confluence: { '*': 0.128 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.066 },
          southDelta: { '*': 0.295 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '2019': 0.038, '2020': 0.027, '*': 0.038 },
          southBay: { '*': 0.229 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.524 },
          northDelta: { '*': 0.329 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.017 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '2019': 0.898, '2020': 0.73, '*': 0.898 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.741 },
          sanPabloBay: { '*': 0.838 },
          suisunBay: { '*': 0.805 },
          confluence: { '*': 0.97 },
          northDelta: { '*': 0.967 },
          centralDelta: { '*': 0.788 },
          southDelta: { '*': 0.824 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '2019': 0.671, '2020': 0.965, '*': 0.671 },
          southBay: { '*': 0.816 },
          centralBay: { '*': 0.764 },
          sanPabloBay: { '*': 0.739 },
          suisunBay: { '*': 0.758 },
          confluence: { '*': 0.754 },
          northDelta: { '*': 0.778 },
          centralDelta: { '*': 0.836 },
          southDelta: { '*': 0.756 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '2019': 0.857, '2020': 0.965, '*': 0.857 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.905 },
          sanPabloBay: { '*': 0.907 },
          suisunBay: { '*': 0.887 },
          confluence: { '*': 0.949 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.954 },
          southDelta: { '*': 0.898 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '2019': 0.905, '2020': 0.765, '*': 0.905 },
          southBay: { '*': 0 },
          centralBay: { '*': 1 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.999 },
          confluence: { '*': 0.008 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.999 },
          southDelta: { '*': 0.569 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '2019': 0.037, '2020': 0.135, '*': 0.037 },
          southBay: { '*': 0.052 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.798 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.332 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '2019': 0.908, '2020': 0.789, '*': 0.908 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.997 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.994 },
          confluence: { '*': 0.018 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.99 },
          southDelta: { '*': 0.657 },
        },
      },
    },

    // Bolster & Fortify
    bf: {
      scores: {
        // Ecology (score)
        ecology: 0,

        // Habitat availability (score)
        'eco-habitat': 0,

        // Food webs (score)
        'eco-foodweb': 0,

        // Species suitability (score)
        'eco-species': 0,
      },
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 0,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 0,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '2019': 0.048, '2020': 0.097, '*': 0.048 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.008 },
          sanPabloBay: { '*': 0.058 },
          suisunBay: { '*': 0.003 },
          confluence: { '*': 0.122 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.064 },
          southDelta: { '*': 0.281 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '2019': 0.038, '2020': 0.027, '*': 0.038 },
          southBay: { '*': 0.226 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.525 },
          northDelta: { '*': 0.333 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.017 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '2019': 0.899, '2020': 0.732, '*': 0.899 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.739 },
          sanPabloBay: { '*': 0.838 },
          suisunBay: { '*': 0.807 },
          confluence: { '*': 0.97 },
          northDelta: { '*': 0.967 },
          centralDelta: { '*': 0.788 },
          southDelta: { '*': 0.833 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '2019': 0.67, '2020': 0.861, '*': 0.67 },
          southBay: { '*': 0.817 },
          centralBay: { '*': 0.765 },
          sanPabloBay: { '*': 0.739 },
          suisunBay: { '*': 0.758 },
          confluence: { '*': 0.752 },
          northDelta: { '*': 0.778 },
          centralDelta: { '*': 0.836 },
          southDelta: { '*': 0.749 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '2019': 0.857, '2020': 0.964, '*': 0.857 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.903 },
          sanPabloBay: { '*': 0.908 },
          suisunBay: { '*': 0.888 },
          confluence: { '*': 0.949 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.954 },
          southDelta: { '*': 0.897 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '2019': 0.907, '2020': 0.792, '*': 0.907 },
          southBay: { '*': 0 },
          centralBay: { '*': 1 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.999 },
          confluence: { '*': 0.004 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.999 },
          southDelta: { '*': 0.651 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '2019': 0.036, '2020': 0.121, '*': 0.036 },
          southBay: { '*': 0.046 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.798 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.293 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '2019': 0.909, '2020': 0.802, '*': 0.909 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.997 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.995 },
          confluence: { '*': 0.017 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.99 },
          southDelta: { '*': 0.695 },
        },
      },
    },

    // Calling on Reserves
    cor: {
      scores: {
        // Ecology (score)
        ecology: -0.7,

        // Habitat availability (score)
        'eco-habitat': 0,

        // Food webs (score)
        'eco-foodweb': 0,

        // Species suitability (score)
        'eco-species': -3,
      },
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 0,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 0,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '*': 0.0723330167774612 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.02038908 },
          sanPabloBay: { '*': 0.0839506 },
          suisunBay: { '*': 0.00455614 },
          confluence: { '*': 0.1604938 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.0695847 },
          southDelta: { '*': 0.233702 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '*': 0.0346628679962013 },
          southBay: { '*': 0.2230453 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.5418381 },
          northDelta: { '*': 0.2798354 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.0307559 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '*': 0.821422918645141 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.7334456 },
          sanPabloBay: { '*': 0.854321 },
          suisunBay: { '*': 0.8255438 },
          confluence: { '*': 0.9698217 },
          northDelta: { '*': 0.9670782 },
          centralDelta: { '*': 0.7841377 },
          southDelta: { '*': 0.8347412 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '*': 0.765629946185502 },
          southBay: { '*': 0.8164609 },
          centralBay: { '*': 0.7572016 },
          sanPabloBay: { '*': 0.7423868 },
          suisunBay: { '*': 0.760582 },
          confluence: { '*': 0.7530864 },
          northDelta: { '*': 0.7778 },
          centralDelta: { '*': 0.8368874 },
          southDelta: { '*': 0.7478882 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '*': 0.909742006964229 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.9019828 },
          sanPabloBay: { '*': 0.9067215 },
          suisunBay: { '*': 0.8827102 },
          confluence: { '*': 0.9437586 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.9547325 },
          southDelta: { '*': 0.8862898 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '*': 0.841722063944286 },
          southBay: { '*': 0 },
          centralBay: { '*': 1 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.9987 },
          confluence: { '*': 0.00548697 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.9993 },
          southDelta: { '*': 0.608837 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '*': 0.0891500474833808 },
          southBay: { '*': 0.05514403 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.7791495 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.350444 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '*': 0.84508547008547 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.997007 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.99529688 },
          confluence: { '*': 0.01920439 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.99251778 },
          southDelta: { '*': 0.6374269 },
        },
      },
    },

    // A Tunnel
    tunnel: {
      scores: {
        // Ecology (score)
        ecology: -0.3,

        // Habitat availability (score)
        'eco-habitat': 0,

        // Food webs (score)
        'eco-foodweb': 0,

        // Species suitability (score)
        'eco-species': -1,
      },
      measures: {
        // Habitat availability › Tidal wetlands (acres)
        'eco-habitat-acres': 0,

        // Food webs › Managed wetland (acres)
        'eco-foodweb-managed': 0,

        // Food webs › Tidal wetlands (acres)
        'eco-foodweb-tidal': 0,

        // Food webs › Wet-soil agriculture (acres)
        'eco-foodweb-wetsoil': 0,

        // Species suitability › Longfin smelt, juvenile (share of days, 0 to 1)
        'eco-niche-longfinJuv': {
          '*': { '*': 0.0867363089585312 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.074635 },
          sanPabloBay: { '*': 0.089986 },
          suisunBay: { '*': 0.004556 },
          confluence: { '*': 0.1522634 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.071829 },
          southDelta: { '*': 0.2449642 },
        },

        // Species suitability › Longfin smelt, adult (share of days, 0 to 1)
        'eco-niche-longfinAdult': {
          '*': { '*': 0.034267173156062 },
          southBay: { '*': 0.215638 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.569273 },
          northDelta: { '*': 0.2674897 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.0268573 },
        },

        // Species suitability › Chinook salmon, juvenile (share of days, 0 to 1)
        'eco-niche-chinook': {
          '*': { '*': 0.821422918645141 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.73868 },
          sanPabloBay: { '*': 0.851303 },
          suisunBay: { '*': 0.824368 },
          confluence: { '*': 0.9698 },
          northDelta: { '*': 0.9671 },
          centralDelta: { '*': 0.78376 },
          southDelta: { '*': 0.83301 },
        },

        // Species suitability › Striped bass, juvenile (share of days, 0 to 1)
        'eco-niche-stripedBassJuv': {
          '*': { '*': 0.765748654637543 },
          southBay: { '*': 0.817284 },
          centralBay: { '*': 0.7570146 },
          sanPabloBay: { '*': 0.7429355 },
          suisunBay: { '*': 0.759994 },
          confluence: { '*': 0.753086 },
          northDelta: { '*': 0.7778 },
          centralDelta: { '*': 0.83764 },
          southDelta: { '*': 0.74854 },
        },

        // Species suitability › Striped bass, adult (share of days, 0 to 1)
        'eco-niche-stripedBassAdult': {
          '*': { '*': 0.909860715416271 },
          southBay: { '*': 1 },
          centralBay: { '*': 0.90292 },
          sanPabloBay: { '*': 0.906447 },
          suisunBay: { '*': 0.891534 },
          confluence: { '*': 0.947874 },
          northDelta: { '*': 1 },
          centralDelta: { '*': 0.95511 },
          southDelta: { '*': 0.88694 },
        },

        // Species suitability › Largemouth bass (share of days, 0 to 1)
        'eco-niche-largemouthBass': {
          '*': { '*': 0.843225704336815 },
          southBay: { '*': 0 },
          centralBay: { '*': 1 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.998677 },
          confluence: { '*': 0.0013717 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.99925 },
          southDelta: { '*': 0.617717 },
        },

        // Species suitability › Overbite clam, juvenile (share of days, 0 to 1)
        'eco-niche-overbiteClam': {
          '*': { '*': 0.0815527065527065 },
          southBay: { '*': 0.04609053 },
          centralBay: { '*': 0 },
          sanPabloBay: { '*': 0 },
          suisunBay: { '*': 0 },
          confluence: { '*': 0.79972565 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0 },
          southDelta: { '*': 0.30799 },
        },

        // Species suitability › Brazilian waterweed (share of days, 0 to 1)
        'eco-niche-egeria': {
          '*': { '*': 0.852524533080089 },
          southBay: { '*': 0 },
          centralBay: { '*': 0.9968 },
          sanPabloBay: { '*': 1 },
          suisunBay: { '*': 0.995297 },
          confluence: { '*': 0.0068587 },
          northDelta: { '*': 0 },
          centralDelta: { '*': 0.993266 },
          southDelta: { '*': 0.6798787 },
        },
      },
    },
  },
}
