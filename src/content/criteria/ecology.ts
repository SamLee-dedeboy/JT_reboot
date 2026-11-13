// The ecology criterion: everything the site says about it, in the shape of ./types.
import { TEAM_NAMES } from '../names'
import { publishedScoresSource } from './publishedScores'
import type { Criterion } from './types'

const ecologyNoCriterionScore = {
  score: null,
  summary: 'Ecology publishes a score for each component rather than one criterion score.',
}
const ecologyNoAcreage =
  'Only Eco Machine and New Green Watershed add wetland acreage, so Landscape and Food webs stay at baseline.'

export const ecology: Criterion = {
  id: 'ecology',
  number: TEAM_NAMES.ecology.number,
  label: TEAM_NAMES.ecology.name,
  summary:
    'Assesses how adaptation scenarios affect the Delta aquatic ecosystem through projected environmental conditions, food webs, and habitat availability.',
  entityGroups: [
    {
      label: 'Selected Species of Interest',
      items: [
        'Egeria densa',
        'Largemouth Bass',
        // "Name · qualifier": the chip sets the qualifier in a lighter weight.
        'Overbite Clam · juvenile',
        'Striped Bass · juvenile',
        'Chinook Salmon · fall-run, juvenile',
        'Longfin Smelt · juvenile, adult',
      ],
    },
    {
      label: 'Ecosystems',
      items: ['Aquatic habitat', 'Pelagic food webs'],
    },
  ],
  metrics: [
    {
      name: 'Species suitability',
      definition:
        'Evaluates where and how often conditions stay survivable for species of interest.',
      measurement:
        'Proportion of suitable days by region and average length of consecutive suitable-day streaks at each modeled point.',
    },
    {
      name: 'Food webs',
      definition: 'Evaluates how much food each scenario adds to Delta waterways.',
      measurement: 'Food production from added wetland and wet-soil farming acreage.',
    },
    {
      name: 'Habitat availability',
      definition:
        'Evaluates how many acres of new tidal wetland are incorporated in each scenario that aquatic species can reach.',
      measurement: 'New tidal wetland area compared with baseline.',
    },
  ],
  story: {
    source:
      'The Story Behind the Criterion: Delta Ecology. L. Williams Duman and E. Platzer, UC Davis, August 2026 (draft).',
    brief: {
      rationale:
        'Each future adaptation scenario will change salinity, water temperature, habitat conditions, and food webs, affecting the ability of native and introduced species to persist. The Delta’s current and future ecology is of broad concern for many.',
      what: 'The ecology criterion assesses how adaptation scenarios affect the Delta aquatic ecosystem by evaluating projected environmental conditions, food webs, and habitat availability.',
      why: 'The Delta has lost more than 90% of its historic wetlands. Several species of cultural and ecological importance are critically endangered, and others are declining. People rely on the Delta ecosystem for subsistence, cultural practice, and recreation, and a just transition must ensure a better future for its non-human species.',
    },
    what: [
      'A just transition means no one is left behind or pushed behind, and for ecology, that includes the Delta’s species, waterways, and habitats, and the people who rely on them.',
      'Scientists refer to the Delta as a novel ecosystem: since it has been dramatically transformed by land reclamation, habitat loss, and development, it requires creative management to make sure the ecosystem survives.',
      'This criterion examines how each scenario affects three primary ecological factors: where species can survive (environmental suitability), how much food is available in the Delta’s waterways, and how much tidal wetland habitat aquatic species can access.',
    ],
    why: {
      paragraphs: [
        'Dams, levees, water projects, and the draining of wetlands for farmland have cost the Delta more than 90% of its historic wetland habitat. Several species of cultural and ecological importance are now critically endangered, and others are declining.',
        'People depend on the Delta’s ecosystem for food, cultural practice, and recreation. The ecology criterion holds that a just transition must mean a better future for all of the species that call the Delta home.',
      ],
      stats: [
        { value: '90%+', label: 'of the Delta’s historic wetland habitat has been lost' },
        {
          value: '6',
          label: 'culturally and ecologically important species followed, chosen with the public',
        },
      ],
    },
    construction: {
      intro:
        'The criterion started from a conceptual model of how the Delta ecosystem responds to change, and chose six species to follow based on workshop participant feedback.',
      facts: [],
      steps: [
        {
          title: 'Build a conceptual model',
          body: 'After the preliminary scenarios were shared, the ecology criterion mapped how parts of the Delta ecosystem feed back on one another, to see which ones each scenario would affect.',
        },
        {
          title: 'Select simulated data for consideration',
          points: [
            'Salinity and temperature: where each species can physically survive.',
            'Scenario design and land use maps: acres of new wetland and wet-soil farming, for the food web and habitat metrics.',
            'Wetland types: tidal and managed wetlands contribute differently to food web production.',
          ],
        },
        {
          title: 'Species of interest',
          when: 'June 2025 public workshop',
          body: 'Participants selected the species they were most interested in following. Chinook salmon was highly prioritized, as a cultural resource and an endangered species. Other species of interest included longfin smelt, bass, and the invasive “ecosystem engineers” Brazilian waterweed and overbite clam.',
          points: [
            'Selection of species required a species to be sensitive to salinity or temperature, so that change in species suitability could be measured.',
            'The final six species span a wide range of tolerances, from strictly fresh (waterweed, largemouth bass) to brackish and marine (overbite clam, adult longfin smelt).',
            'Life stages were split where needs differ, and this criterion measured changes to the following: juvenile and adult longfin smelt and striped bass, juvenile fall-run Chinook, juvenile overbite clam.',
          ],
        },
        {
          title: 'Define thresholds based on literature',
          body: 'Published physiological studies give the salinity and temperature range thresholds, beyond which each species cannot survive. These limits define a species’ fundamental niche.',
        },
        {
          title: 'Divide the estuary into regions',
          body: 'Points were grouped into subregions from a published hierarchical clustering of average daily temperature (Pien et al., 2025), extended west of Suisun with known contraction points (Grimaldo et al., 2020). Suisun Bay and Suisun Marsh are combined.',
        },
        {
          title: 'Review and refine',
          when: 'Public Workshop 2 · June 2025, and ongoing',
          body: 'The draft criterion was reviewed and revised with workshop participants. Feedback on methods and assumptions shaped the final iteration of the criterion, and team members checked in periodically with the project’s Advisory Committee.',
        },
      ],
    },
    components: {
      items: [
        {
          name: 'Species Suitability',
          summary:
            'Where and how often conditions stay **survivable** for Chinook salmon, longfin smelt, striped bass, largemouth bass, overbite clam, and Brazilian waterweed.',
          spec: [
            {
              label: 'Measures',
              value:
                'Share of modeled days inside each species’ salinity and temperature limits, and the average run of consecutive suitable days',
            },
            { label: 'Unit', value: 'Proportion of days; days' },
            { label: 'Where', value: 'Whole Delta, with specific report-out for regions' },
          ],
          method: [
            'For each day at each location assign a classification of suitable or unsuitable for a given species, requiring both **salinity and temperature** measures to be inside the species’ limits.',
            'Divide suitable days by all days in the modeled run to get each point’s proportion of suitable days.',
            'Fit beta regression models (glmmTMB) of that proportion on scenario × subregion, with site as a random effect; fit 2019 and 2020 separately for each species.',
            'Count consecutive suitable days at each point and average the streak lengths across points.',
          ],
          tables: [
            {
              caption: 'Survival thresholds used for each species and life stage',
              columns: ['Species', 'Salinity (psu)', 'Temperature (°C)'],
              rows: [
                ['Brazilian waterweed (Egeria densa)', '< 5', '3–26'],
                ['Largemouth bass', '< 4', '3–28'],
                ['Overbite clam, juvenile', '5–25', '3–26'],
                ['Striped bass, juvenile', '0–35', '12–27'],
                ['Chinook salmon (fall-run), juvenile', '0–35', '10–25'],
                ['Longfin smelt, juvenile', '0.4–10', '9–15'],
                ['Longfin smelt, adult', '15–30', '9–18'],
              ],
            },
          ],
          caveats: [
            'Thresholds mark where a species can physically survive, not where it thrives: food, predators, and habitat structure are outside this metric.',
            'Streak lengths are averaged across all points, not reported by subregion.',
          ],
        },
        {
          name: 'Food Webs',
          summary:
            'How much **food** each scenario adds to Delta habitat, becoming available for species of interest.',
          spec: [
            {
              label: 'Measures',
              value: 'Food production from added wetland and wet-soil farming acreage',
            },
            { label: 'Unit', value: 'Acres, weighted by contribution' },
            { label: 'Where', value: 'Whole Delta, with specific report-out for each region' },
          ],
          method: [
            'Subtract what already exists: about 5,100 acres of managed wetland (Delta Stewardship Council, 2026) and 17,178 acres of rice (2022).',
            'Weight each habitat by its relative contribution to nearby waterways (table below).',
            'Result = (managed wetland − 5,100) × 0.2 + new tidal wetland × 0.4 + (wet-soil farming − 17,178) × 0.1. A term with no added acres counts as zero, not negative.',
            'Score on the −5 to +5 scale: baseline and scenarios without new wetland at 0; scenarios ranked proportionally based on the magnitude of their result relative to baseline.',
          ],
          tables: [
            {
              caption: 'Habitat weights for food web contribution',
              columns: ['Habitat', 'Weight', 'Rationale'],
              rows: [
                ['Tidal wetland', '0.4', 'Exports food steadily all year, without seasonal limits'],
                [
                  'Managed wetland',
                  '0.2',
                  'Can produce 11–22× the zooplankton of tidal wetland during managed flood pulses, but is closed off for much of the year',
                ],
                [
                  'Wet-soil farming (rice, paludiculture)',
                  '0.1',
                  'Pulses of food limited by water management and season; still far better than dry farming',
                ],
              ],
            },
          ],
        },
        {
          name: 'Habitat availability',
          summary:
            'How many acres of new **tidal wetland** fish and other aquatic species can access.',
          overviewSummary:
            'How many acres of new **tidal wetland** fish and other aquatic species can reach.',
          spec: [
            { label: 'Measures', value: 'New tidal wetland area, compared with baseline' },
            { label: 'Unit', value: 'Acres' },
            {
              label: 'Where',
              value: 'Whole Delta, with specific report-outs for each region',
            },
          ],
          method: [
            'Sum new tidal wetland acres in each scenario.',
            'Leave out managed wetland and wet-soil farming, which are drained for part of the year.',
            'Score on the −5 to +5 scale: baseline and scenarios without new wetland at 0; scenarios ranked proportionally based on the magnitude of their result relative to baseline.',
          ],
          caveats: [
            'Though managed wetlands and rice can still serve floodplain spawners, birds, mammals, and invertebrates, this metric deliberately counts only year-round aquatic access.',
            'New Green Watershed’s Cache–Lindsey Slough restoration does not change salinity; it is there for the aquatic community.',
          ],
        },
      ],
    },
  },
  regions: {
    mapTeam: 'ecology',
    intro:
      'For this criterion, the Delta is grouped into subregions based on average daily water temperature, such that each region shares similar conditions for fish and the food they eat. The regions follow Pien et al. (Pien et al., 2025), with Suisun Bay and Suisun Marsh combined into one region, shown here as Suisun Marsh. West of Suisun, where Pien et al. ends, they follow known points of contraction (Grimaldo et al., 2020).',
    regions: [
      { name: 'San Pablo Bay', note: '15 points' },
      { name: 'Central Bay', note: '16 points' },
      { name: 'South Bay', note: '9 points' },
      { name: 'Suisun Marsh', note: '25 points' },
      { name: 'Confluence', note: '16 points' },
      { name: 'North Delta', note: '30 points' },
      { name: 'Central', note: '23 points' },
      { name: 'South Delta', note: '11 points' },
    ],
  },
  references: [
    'Delta Stewardship Council. (2026). Delta Plan Performance Measures: Acres of Natural Communities Restored Dashboard. State of California.',
    'Agri-Pulse. (2026). Environmental group presses for more rice farming in the Delta. Agri-Pulse Communications, Inc.',
    'San Francisco Estuary Institute-Aquatic Science Center (SFEI-ASC). (2026). Delta Landscapes Primary Production Project. Richmond, CA.',
    'Pien, C., Hartman, R., Bush, E., Lehman, P., & Davis, B. (2025). Thermal Stress and Suitability for Aquatic Species in the San Francisco Estuary. San Francisco Estuary and Watershed Science, 23(2).',
    'Moyle, P. B. (2002). Inland Fishes of California (Revised and Expanded ed.). University of California Press.',
    'Boyer, K., & Sutula, M. (2015). Factors Controlling Submersed and Floating Macrophytes in the Sacramento-San Joaquin Delta. Southern California Coastal Water Research Project (Technical Report 870).',
    'Hardy, J. D. (1978). Development of fishes of the Mid-Atlantic Bight: An atlas of egg, larval and juvenile stages. U.S. Fish and Wildlife Service.',
    'Carlton, J. T., et al. (1990). Remarkable invasion of San Francisco Bay by the Asian clam Potamocorbula amurensis. Marine Ecology Progress Series.',
    'Parchaso, F., & Thompson, J. K. (2002). Influence of hydrologic processes on reproduction of the introduced bivalve Potamocorbula amurensis in the San Francisco Bay estuary. Marine Ecology Progress Series.',
    "Myrick, C. A., & Cech, J. J. (2004). Temperature effects on juvenile anadromous salmonids in California's central valley: what don't we know? Reviews in Fish Biology and Fisheries.",
    'Yanagitsiru, C. R., et al. (2021). Effects of Temperature and Salinity on the Physiological Performance and Growth of Larval and Juvenile Longfin Smelt. UC Davis / California Sea Grant Framework.',
    'Rosenfield, J. A., & Baxter, R. D. (2007). Population dynamics and distribution patterns of longfin smelt in the San Francisco Estuary. Transactions of the American Fisheries Society.',
  ],
  report: {
    status: 'final',
    source: publishedScoresSource,
    findings: {
      'eco-machine': {
        headline: 'More reachable tidal wetland and a small food-web gain',
        metrics: [
          {
            name: 'Landscape',
            finding: 'Adds about 53,000 acres of tidal wetland that aquatic species can reach.',
            score: 3,
          },
          {
            name: 'Food webs',
            finding: 'Food-web index of 21,200 from the wetland it adds.',
            score: 1,
          },
          {
            name: 'Species suitability',
            finding:
              'Wet year (2019): more suitable days for juvenile longfin smelt (+1). Dry year (2020): fewer suitable days for the undesirable largemouth bass (+2) and Brazilian waterweed (+1), more for the undesirable overbite clam (−1).',
            score: null,
          },
        ],
        overall: ecologyNoCriterionScore,
      },
      'new-green-watershed': {
        headline: 'The largest gains in reachable habitat and food webs',
        metrics: [
          {
            name: 'Landscape',
            finding: 'Adds about 80,000 acres of tidal wetland, the most of any scenario.',
            score: 5,
          },
          {
            name: 'Food webs',
            finding:
              'Food-web index of 69,661 in the 50% wetland / 50% rice version (+5 with all managed wetland, +4 at 25% / 75%).',
            score: 4,
          },
          {
            name: 'Species suitability',
            finding:
              'Wet year (2019): more suitable days for juvenile longfin smelt (+1). Dry year (2020): fewer suitable days for the undesirable largemouth bass (+2) and Brazilian waterweed (+1), more for the undesirable overbite clam (−1).',
            score: null,
          },
        ],
        overall: ecologyNoCriterionScore,
      },
      'bolster-and-fortify': {
        headline: 'No change from Business as Usual',
        metrics: [
          { name: 'Landscape', finding: ecologyNoAcreage, score: 0 },
          { name: 'Food webs', finding: ecologyNoAcreage, score: 0 },
          {
            name: 'Species suitability',
            finding: 'No change for any species in either year.',
            score: 0,
          },
        ],
        overall: ecologyNoCriterionScore,
      },
      'calling-on-reserves': {
        headline: 'No habitat change; mixed results by species',
        metrics: [
          { name: 'Landscape', finding: ecologyNoAcreage, score: 0 },
          { name: 'Food webs', finding: ecologyNoAcreage, score: 0 },
          {
            name: 'Species suitability',
            finding:
              'Wet year (2019): more suitable days for juvenile Chinook salmon (+1). Dry year (2020): fewer suitable days for the undesirable largemouth bass (+2) and Brazilian waterweed (+2), more for the undesirable overbite clam (−1).',
            score: null,
          },
        ],
        overall: ecologyNoCriterionScore,
      },
      'a-tunnel': {
        headline: 'No habitat change; species suitability not modeled',
        metrics: [
          { name: 'Landscape', finding: ecologyNoAcreage, score: 0 },
          { name: 'Food webs', finding: ecologyNoAcreage, score: 0 },
          {
            name: 'Species suitability',
            finding: 'Not modeled for A Tunnel.',
            score: null,
          },
        ],
        overall: ecologyNoCriterionScore,
      },
    },
  },
}
