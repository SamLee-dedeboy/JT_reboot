// Each team's criterion, condensed from its draft "The Story Behind the Criterion"
// report. Scenario results are left out on purpose; they live in
// evaluationReports.ts. Two lengths come from the same source:
//   - `brief`: what the criterion is and why it matters, for the results overview
//   - `what`, `why`, `construction`, `components`: a technical summary for the
//     team's own page, written for readers who will not open the full report
// The overview reuses each component's name and summary.
import type { evaluationTeams } from './results'

export interface StoryTable {
  caption: string
  columns: string[]
  rows: string[][]
}

export interface CriterionComponent {
  name: string
  summary: string
  /** The evaluation overview's wording, where it differs from `summary`. */
  overviewSummary?: string
  /** A page on this site that goes deeper, offered after the component's tables. */
  link?: { label: string; to: string }
  /** Label/value pairs: what is measured, its unit, and where. */
  spec: Array<{ label: string; value: string }>
  /** How the value is produced, in order. */
  method: string[]
  tables?: StoryTable[]
  /** Limits and assumptions a technical reader should know. */
  caveats?: string[]
}

export interface ConstructionStep {
  title: string
  /** When it happened, if the report dates it. */
  when?: string
  body?: string
  points?: string[]
}

export interface CriterionStory {
  source: string
  /** For the evaluation page: why the criterion is in the set, what it is, and why it matters. */
  brief: { rationale: string; what: string; why: string; chipsNote?: string }
  what: string[]
  why: {
    paragraphs: string[]
    stats?: Array<{ value: string; label: string }>
    /** Stack the stats in rows, for values too long to sit side by side. */
    statsInRows?: boolean
    quote?: string
  }
  construction: {
    intro: string
    /** Who was engaged or what was used; a value can be a word, like "Periodic". */
    facts: Array<{ value: string; label: string; dates?: string[] }>
    /** What that engagement yielded. */
    outcomes?: { intro: string; facts: Array<{ value: string; label: string }> }
    /** Prose after the intro, for a criterion told as narrative rather than steps. */
    points?: string[]
    paragraphs?: string[]
    steps: ConstructionStep[]
  }
  components: { intro?: string; items: CriterionComponent[] }
}

const ecology: CriterionStory = {
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
}

const environmentalJustice: CriterionStory = {
  source:
    'The Story Behind the Criterion: Environmental Justice & Vulnerable Communities. A. N. DePew, UC Davis, September 2026 (draft).',
  brief: {
    rationale:
      'Understanding where and how negative impacts to vulnerable communities occur is important for decision-makers assessing the equitable distribution of scenario benefits and trade-offs. The three metrics reflect priorities identified by Delta communities and local environmental justice organizations.',
    what: 'Environmental justice assesses whether scenario burdens fall unfairly on Delta communities, paying attention to community vulnerability to climate hazards. It compares scenarios through drinking-water quality, flood risk reduction, and harmful-algal-bloom conditions.',
    chipsNote:
      'Each community in the Delta has a vulnerability score of moderate, high, or highest vulnerability, derived from the Delta Stewardship Council’s [Vulnerability to Climate Change in the Delta interactive map](https://deltascience.shinyapps.io/Delta_vulnerability_map/).',
    why: '82.6% of the project’s interviewees said Delta decision-making is not equitable or fair. Every in-Delta community is vulnerable to some degree, so knowing where undue burdens may occur helps decision-makers avoid them.',
  },
  what: [
    'As defined by the [Delta Stewardship Council](https://deltacouncil.ca.gov/environmental-justice), environmental justice is “the fair treatment and meaningful involvement of all people, regardless of race, culture, national origin, or income, in environmental laws, regulations, and policies” (Delta Stewardship Council, n.d.). This criterion applies it through the lens of vulnerable communities.',
    '[Vulnerability](https://deltacouncil.ca.gov/pdf/delta-plan/2021-06-25-delta-adapts-vulnerability-assessment.pdf) combines exposure to climate hazards, sensitivity to them, and the capacity to recover and adapt (Delta Stewardship Council, 2021, p. xi). The Delta Stewardship Council’s [Vulnerability to Climate Change in the Delta interactive map](https://deltascience.shinyapps.io/Delta_vulnerability_map/) (Delta Stewardship Council, 2020) classifies every Delta community as Moderate, High, or Highest vulnerability, derived from 14 socioeconomic indicators, from poverty and linguistic isolation to asthma and food insecurity. The lowest rating anywhere in the Delta is Moderate: every in-Delta community is vulnerable to some degree.',
  ],
  why: {
    paragraphs: [
      'The overwhelming majority of interviewees think decision-making in the Delta is not equitable and fair. They pointed to power imbalances, the influence of money, and infringement of water rights.',
      'In general, the Just Transitions Project explores more inclusive and equitable planning approaches to salinity management. The Environmental Justice and Vulnerable Communities criterion specifically assesses Delta EJ community concerns as determined through the project’s EJ-specific outreach, workshops, and consultations. This outreach established the priorities and metrics that the team assessed.',
    ],
    stats: [
      {
        value: '82.6%',
        label: 'of interviewees think Delta decision-making is not equitable and fair',
      },
      { value: '8.7%', label: 'of interviewees said Delta decision-making is equitable and fair' },
      { value: '8.7%', label: 'of interviewees were unsure' },
    ],
  },
  construction: {
    intro:
      'While there is general consensus in the literature about what burdens EJ communities face, academic literature does not substitute for boots-on-the-ground, real, meaningful interaction with the community members and advocates this project intends to serve. The Just Transitions in the Delta team intentionally sought out perspectives from EJ communities as often as possible. In order to create the EJ criterion most consistently with the real priorities of our specific EJ community members and advocates, the Just Transitions in the Delta team engaged in the following ways:',
    facts: [
      { value: '49', label: 'interviews, ~20% with EJ and Tribal community members' },
      { value: '1', label: 'Environmental Justice Workshop', dates: ['December 2024'] },
      {
        value: '3',
        label: 'Tribal Workshops',
        dates: ['November 2024', 'June 2025', 'December 2025'],
      },
      { value: '2', label: 'Public Workshops', dates: ['June 2024', 'June 2025'] },
      { value: 'Periodic', label: 'Advisory Committee check-in and review' },
    ],
    outcomes: {
      intro: 'These engagement activities yielded:',
      facts: [
        { value: '6', label: 'value areas distilled from feedback' },
        { value: '3', label: 'metrics within project scope' },
      ],
    },
    steps: [
      {
        title: 'Invite less-often-heard voices',
        body: 'Interview invitations were sent intentionally to members and advocates of environmental justice and Tribal communities. Interview questions covered values, drivers of salinity change, management strategies to explore, and Delta governance; answers shaped the preliminary scenarios.',
      },
      {
        title: 'Spotlight EJ viewpoints',
        when: 'Public Workshop 1 · June 2024',
        body: 'Environmental justice perspectives were featured to the broader public workshop audience.',
      },
      {
        title: 'Environmental justice workshop',
        when: 'December 2024',
        body: 'Participants discussed the issues facing environmental justice and vulnerable communities. Their priorities became the first draft of the criterion.',
      },
      {
        title: 'Sort priorities by who can measure them',
        body: 'Feedback fell into six value areas: water quality and quantity, community and recreation, flood risk, ecological restoration and recovery, eco-cultural restoration and Indigenous sovereignty, and a sustainable economy.',
        points: [
          'Measured by EJ: drinking water, flood risk, and harmful algal bloom conditions.',
          'Measured by other criteria: recreation and ecology (Recreation, Ecology), agriculture (Economy), Indigenous sovereignty (Eco-cultural Restoration and Indigenous Sovereignty).',
          'Outside the project’s scope: pollutants, standard compliance, public health, revised water rights, energy generation, and water affordability.',
        ],
      },
      {
        title: 'Define thresholds based on literature',
        body: 'The threshold for acceptable salinity levels in drinking water was obtained from California’s secondary drinking-water standard for chloride (Title 22) (California State Water Resources Control Board, 2018), and the State Water Resources Control Board’s chloride objectives (California State Water Resources Control Board, 2004).',
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
        name: 'Salinity impacts to in-Delta drinking water',
        summary:
          'Whether **salinity** changes affect in-Delta **drinking-water** systems’ ability to meet safe standards, with attention to the vulnerability of the communities they serve.',
        spec: [
          {
            label: 'Measures',
            value:
              'Share of days whose average salinity is above the safe drinking-water threshold',
          },
          {
            label: 'Unit',
            value:
              'Percent of modeled days above a salinity threshold; salinity measured in microsiemens per centimeter (µS/cm)',
          },
          {
            label: 'Where',
            value: 'Whole Delta, with specific report-out for the vulnerability zones',
          },
        ],
        method: [
          'Locate in-Delta public water systems from the State Water Board’s SAFER program, including treated municipal systems, wells, and untreated surface-water systems, to identify locations of communities within the Delta.',
          'Point-drop: create a point for each inland location identified by the SAFER system into the closest channel to produce hydrodynamic modeling results for that location.',
          'Match each point to its respective vulnerability classification of the community it serves, from the Delta Stewardship Council’s Vulnerability Index.',
          'Count the number of daily means above the threshold of **1,050 µS/cm** and divide by the number of measurements.',
          'Score against baseline: change in each vulnerability zone’s percentage of threshold-exceedance days.',
        ],
        tables: [
          {
            caption: 'Points by vulnerability class',
            columns: ['Vulnerability', 'Adaptation runs', 'Tiered outflow runs'],
            rows: [
              ['Moderate', '10', '10'],
              ['High', '36', '33'],
              ['Highest', '3', '3'],
              ['Total', '49', '46'],
            ],
          },
        ],
        caveats: [
          'The 1,050 µS/cm threshold matches California’s secondary drinking-water standard for chloride (Title 22) (California State Water Resources Control Board, 2018), and the State Water Resources Control Board’s chloride objectives (California State Water Resources Control Board, 2004).',
        ],
      },
      {
        name: 'Flood risk attenuation',
        summary: 'Risk of **inundation** across the Delta.',
        spec: [
          {
            label: 'Measures',
            value: 'Direction and size of change in inundation risk from baseline',
          },
          {
            label: 'Unit',
            value:
              'Qualitative determination of change in flood risk from baseline: no change, slight decrease, moderate decrease, or significant decrease',
          },
          { label: 'Where', value: 'The Delta as a whole' },
        ],
        method: [
          'Review the measures built into each scenario that could affect flood risk (e.g., levee fortification, upland restoration, etc.).',
          'Judge the direction and size of the change in in-Delta flood risk against Business as Usual.',
          'Translate that judgement onto the −5 to +5 scale.',
        ],
        caveats: [
          'Not assessed for the tiered outflow runs, because they do not differ in landscape or land use, but only in the amount of outflow.',
          'Reservoir forecast-informed operations are not captured by the models.',
        ],
      },
      {
        name: 'Water Age + Water Temperature',
        summary: 'Conditions that favor **harmful algal blooms** in five bloom-prone regions.',
        spec: [
          {
            label: 'Measures',
            value: 'Change in water age from baseline while water is consistently at or above 19°C',
          },
          { label: 'Unit', value: 'Days of change from baseline' },
          {
            label: 'Where',
            value:
              'Suisun Marsh and surrounding wetlands, Franks Tract, South Delta, Lindsey–Cache Slough, McCormack–Williamson Tract',
          },
          {
            label: 'When',
            value:
              'May through October, when water temperature is consistently at or above 19°C, and harmful algal bloom likelihood rises',
          },
        ],
        method: [
          'Determine time periods when water is at or above 19°C, the temperature at which blooms begin to grow.',
          'Compare water age with Business as Usual in each region using heatmap output.',
          'Place each scenario on an 11-step scale from extreme decrease to extreme increase in water age.',
        ],
        caveats: [
          'This is not a prediction of if or when harmful algal blooms will occur under any given scenario, but merely an indicator of some conditions that are favorable for harmful algal bloom formation.',
          'Water age is one of several factors that make harmful algal blooms more likely; nutrient content in the water, a main driver, as well as other factors are not modeled in this project.',
          'Water age was not available for the outflow runs.',
        ],
      },
    ],
  },
}

const ecoculturalRestoration: CriterionStory = {
  source:
    'The Story Behind the Criterion: Eco-Cultural Restoration and Indigenous Sovereignty. Social Science Team, UC Davis, September 2026 (draft).',
  brief: {
    rationale:
      'Native Tribes were the original stewards of the Delta. A just transition should address the legacies of settler colonialism, genocide, forced removal, and land reclamation by respecting Tribal sovereignty, restoring eco-culturally valued habitats and species, increasing land access, and restoring Indigenous knowledge, stewardship, guardianship, and lifeways.',
    what: 'Eco-cultural restoration entails the restoration of ecosystems and Indigenous human cultures simultaneously as interconnected and reciprocal processes. It is the intentional inclusion of cultural restoration and reparation into ecological restoration planning, design, and stewardship. In the Delta, this entails engaging Indigenous people in ecological planning and design efforts so that eco-cultural restoration might occur in a collaborative, equitable, and self-determined manner.\n\nIndigenous sovereignty refers to the inherent, pre-existing right of Indigenous peoples to self-determine, govern themselves, manage their lands and resources, and maintain their unique cultures, languages, and legal systems independently of external nation-state dominion.\n\nThis criterion assesses if and how the project’s adaptation scenarios advance eco-cultural restoration and Indigenous sovereignty, as measured across four metrics: ecosystem restoration, land access, implementation and application of Indigenous science & Traditional Ecological Knowledge, and recognition and application of Tribal sovereignty.',
    why: 'The Delta was home to many Tribes long before colonization, and their ties to its land, water, and life run deep. A just transition in the Delta cannot happen without Indigenous leadership and inclusion in Delta decision-making.',
  },
  what: [
    'Leaving no one behind means accounting for past wrongs, including the exclusion of Tribal and Indigenous communities from Delta decisions. That makes eco-cultural restoration and Indigenous sovereignty pillars of a just transition.',
    'Eco-cultural restoration restores land and Indigenous cultures simultaneously as a connected and reciprocal process, with Indigenous people taking part in planning, design, and stewardship in a collaborative, self-determined way. Indigenous sovereignty is a nation’s inherent right to govern themselves and live their own way of life, free from interference. Two main pillars of this criterion are the concepts of intergenerational stewardship, and intergenerational prosperity and well-being.',
  ],
  why: {
    paragraphs: [
      'Prior to colonization, the Delta was home to many Tribes, including the Bay Miwok, Coast Miwok, Plains Miwok, Maidu, Nisenan, Ohlone, Patwin, Pomo, Wappo, Wintun, and Yokuts. Though most were relocated outside the Delta, their connections to the land, water, and the life the Delta supports remain deep. Indigenous communities’ values belong in Delta decisions. The Delta’s species, and the flow of water itself, are incredibly important to Indigenous worldviews.',
    ],
    statsInRows: true,
    stats: [
      {
        value: 'Original Stewards and Guardians',
        label: 'Native Tribes were the Delta’s first residents, long before colonization',
      },
      {
        value: '7.5 million acres',
        label:
          'California aims to bring 7.5+ million acres under Tribal stewardship (California Natural Resources Agency, 2026)',
      },
    ],
  },
  construction: {
    intro:
      'Because the inclusion and leadership of Indigenous community members and advocates is paramount to a just transition, the Just Transitions in the Delta team intentionally, consistently, and frequently checked in, applied feedback, and iterated upon this criterion through the following engagement opportunities:',
    facts: [
      {
        value: 'Invitation',
        label:
          'for initial interviews; these interviews served as the basis for the six future scenarios',
      },
      {
        value: '3',
        label: 'Tribal Workshops',
        dates: ['November 2024', 'June 2025', 'December 2025'],
      },
      { value: '2', label: 'Public Workshops', dates: ['June 2024', 'June 2025'] },
      { value: 'Periodic', label: 'Advisory Committee check-in and review' },
    ],
    outcomes: {
      intro: 'These engagement activities yielded:',
      facts: [
        {
          value: '14',
          label:
            'reciprocal and interconnected components of Eco-cultural Restoration and Indigenous Sovereignty',
        },
        {
          value: '2',
          label:
            'main pillars (Intergenerational Stewardship and Intergenerational Prosperity and Well-being)',
        },
        { value: '1', label: 'quantitative metric' },
        { value: '3', label: 'descriptive metrics' },
      ],
    },
    steps: [
      {
        title: 'Intentional outreach',
        body: 'Indigenous community members and advocates were specifically invited to semi-structured interviews so Tribal values and voices could inform this research from the beginning. Findings shaped the preliminary scenario narratives.',
      },
      {
        title: 'Spotlight Indigenous community viewpoints',
        when: 'Public Workshop 1 · June 2024',
        body: 'Indigenous community member and advocate perspectives were featured to the broader public workshop audience.',
      },
      {
        title: 'Draw the connections',
        when: 'Tribal Workshop 1 · November 2024',
        body: 'Insights from interview results, literature, and conversations with Indigenous Advisory Committee members helped create a diagram of how eco-cultural restoration and sovereignty reinforce each other through 14 reciprocal and interconnected components. Workshop participants reviewed this diagram, and it was distilled into four metrics.',
      },
      {
        title: 'Review and refine',
        when: 'Public Workshop 2 and Tribal Workshop 2 · June 2025 / Tribal Workshop 3 · December 2025, and ongoing',
        body: 'Participants reviewed the four distilled metrics, and expressed that they matter equally and depend on one another. Further feedback for additions to the metrics was incorporated.',
        points: [
          'Sovereignty additions: Food sovereignty, data sovereignty, and youth education on the legacies of colonialism.',
          'TEK additions: Privacy while practicing TEK, through Tribal site selection and/or buffer zones.',
        ],
      },
      {
        title: 'Ask which landscapes matter',
        when: 'Tribal Workshop 3 · December 2025',
        body: 'Tribal Workshop 3 participants described current land access, desired landscapes, and overall governance. These priorities set the habitat types included in the restoration scenarios.',
        points: [
          'Tidal wetlands: provide clean water, biodiversity, and grasses for basket-weaving.',
          'Upper watershed forests, meadows, and floodplains: provide opportunities for hunting, gathering of food and medicine, and fire risk reduction.',
        ],
      },
      {
        title: 'Research and iteratively refine the watershed restoration scenarios',
        body: 'The upper watershed restoration scenario and associated benefits were extensively researched and iteratively developed from the time of the first Tribal workshop throughout the rest of the project. The final result of this effort is a 3 × 3 matrix of nine potential sub-scenarios: minimal, medium, or maximal effort, each prioritizing forests, meadows, or floodplains. It is combined with in-Delta tidal wetland restoration.',
      },
    ],
  },
  components: {
    intro:
      'This criterion is composed of four interdependent metrics evaluated across all future scenarios: ecosystem restoration, land access, implementation and application of Indigenous science & Traditional Ecological Knowledge, and recognition and application of Tribal sovereignty.\n\nAlthough all four metrics are equally important and interdependent to meet this criterion, only the habitat restoration metric can be spatially and quantitatively evaluated across the scenarios. The other three metrics are envisioned and assumed in Eco Machine and New Green Watershed scenarios (the two scenarios that restore land and habitats) but cannot be prescribed within the scope of this project (e.g., assigning specific areas for land-back initiatives, or determining where access may be most desired and granted on private land). Thus the evaluation for Tribal land access, Tribal sovereignty, and application of Indigenous Science and Traditional Ecological Knowledge are expressed qualitatively, where the scenarios offer the increased potential to achieve these metrics.',
    items: [
      {
        name: 'Ecosystem Restoration',
        summary:
          'Recovering and protecting the Delta’s **native, culturally significant species and ecosystems** through habitat creation, restoration, and environmental flows.',
        spec: [
          { label: 'Measures', value: 'Change in restored acres in each scenario' },
          { label: 'Unit', value: 'Acres, by habitat type' },
          { label: 'Where', value: 'Whole Delta, plus the much larger Bay–Delta watershed' },
        ],
        method: [
          'Identify the restorable area of each upland habitat (forests, meadows, floodplains).',
          'Consider the mosaic of upland restoration options across habitat types, from minimal to maximal restoration effort.',
          'Consider in-Delta wetland restoration: tidal wetland restoration in Franks Tract and Suisun Marsh for both Eco Machine and New Green Watershed; additional tidal restoration and managed wetland restoration included in New Green Watershed.',
        ],
        link: { label: 'Read more about upland watershed restoration', to: '/pages/watershed' },
        caveats: [
          '30,000 acres of already-planned restoration (such as EcoRestore) is included in the Just Transitions baseline, the Business as Usual scenario, which is assumed in all scenarios. Only restoration in addition to this baseline is counted as restoration in the adaptation scenarios.',
        ],
        tables: [
          {
            caption: 'Restorable upland area in the Bay–Delta watershed',
            columns: [
              'Habitat',
              'Low upland restoration acreage',
              'Medium upland restoration acreage',
              'High upland restoration acreage',
              'Basis',
            ],
            rows: [
              [
                'Upland Forest',
                '468,000 acres',
                '2,574,000 acres',
                '4,680,000 acres',
                'CAL FIRE vegetation layer; Sierra Nevada Conservancy subregions',
              ],
              [
                'Montane Meadow',
                '11,600 acres',
                '63,750 acres',
                '115,900 acres',
                'UC Davis meadow compilation; Emmons et al. (2013) and expert input',
              ],
              [
                'Floodplain',
                '6,400 acres',
                '35,000 acres',
                '63,600 acres',
                'CAL FIRE vegetation layer; CVFPP conservation strategy',
              ],
            ],
          },
        ],
      },
      {
        name: 'Increased Land Access',
        summary:
          '**Returning land** to Tribes or **co-managing** it with Tribes and Tribal governments for stewardship, subsistence, ceremony, and cultural practice.',
        spec: [
          {
            label: 'Methods and techniques for increased land access',
            value:
              'Listing and description of the kinds of agreements that can open access to land to Tribal communities',
          },
          { label: 'Unit', value: 'Descriptive' },
          {
            label: 'Where',
            value:
              'The entire Delta watershed; expected alongside restoration in Eco Machine and New Green Watershed, but possible in any scenario',
          },
        ],
        method: [
          'Explore types of access agreements through literature review, Tribal and expert consultations.',
          'Listen to understand at three different Tribal Workshops (November 2024, June 2025, December 2025).',
          'Survey Tribal Workshop participants to determine their prioritized modes of land access.',
        ],
        caveats: [
          'Delta land is a mosaic of private and public ownership, so access cannot be prescribed to specific locations, or quantified in acreage in the scenarios.',
        ],
        tables: [
          {
            caption: 'Agreements that can expand Tribal access',
            columns: ['Agreement', 'What it does'],
            rows: [
              ['Tribal ownership', 'Returns full ownership, stewardship, and decision-making'],
              [
                'Land trust partnership',
                'A land trust buys land and agrees conservation, access, and stewardship terms with a Tribe',
              ],
              [
                'Conservation easement',
                'Legally binding limits on development that survive a sale; Tribes can hold them in California (SB 18)',
              ],
              [
                'Cultural conservation easement',
                'Explicitly protects ceremony and medicinal gathering and can guarantee access at set times',
              ],
              [
                'Memorandum of Understanding (MOU) and Memorandum of Agreement (MOA)',
                'Collaboration with agencies, landowners, or land trusts for gathering and TEK; an MOA is legally binding, an MOU is not',
              ],
            ],
          },
        ],
      },
      {
        name: 'Implementation and Application of Indigenous Science & Traditional Ecological Knowledge (TEK)',
        summary:
          'Bringing **Traditional Ecological Knowledge** into management and land use decisions in partnership with Tribal representatives and practitioners.',
        spec: [
          {
            label: 'Conditions and needs',
            value:
              'Listing of identified needs and preferred conditions through which TEK can be applied',
          },
          { label: 'Unit', value: 'Descriptive' },
          {
            label: 'Where',
            value: 'The whole Delta watershed; TEK should inform all planning decisions',
          },
        ],
        method: [
          'Understand what participants need in order to practice TEK through a literature review.',
          'Listen to understand at three different Tribal Workshops (November 2024, June 2025, December 2025).',
          'Pair each condition with examples that already exist in agreements or state policy.',
        ],
        tables: [
          {
            caption: 'Conditions needed and desired for applying TEK',
            columns: ['Condition', 'In practice'],
            rows: [
              [
                'Privacy',
                'Organizational partners do not ask why practices happen; Tribe-chosen sites or buffer zones keep community members unobserved and unphotographed',
              ],
              [
                'Unrestricted access',
                'Access without fear of trespass citations, written into agreements with landowners and land trusts',
              ],
              ['Site selection', 'Sites are accessible to elders and people with reduced mobility'],
              [
                'Tribal stewardship group collaboration',
                'Partnership with official groups that facilitate access',
              ],
            ],
          },
        ],
      },
      {
        name: 'Recognition and Application of Tribal Sovereignty',
        summary:
          'Advancing Indigenous peoples’ **inherent right to govern** themselves, their lands, and resources, and to maintain their cultures and ways of life.',
        spec: [
          {
            label: 'Domains and mechanisms',
            value: 'Identified key domains of sovereignty and mechanisms to achieve them',
          },
          { label: 'Unit', value: 'Descriptive' },
          { label: 'Where', value: 'The whole Delta watershed' },
        ],
        method: [
          'Understand what is needed for adequate recognition and application of Tribal sovereignty through a literature review.',
          'Listen to understand at three different Tribal Workshops (November 2024, June 2025, December 2025).',
          'Note how each connects to practical examples.',
        ],
        tables: [
          {
            caption: 'Domains of recognition',
            columns: ['Mechanism', 'Example'],
            rows: [
              [
                'Data sovereignty',
                'CARE principles; researchers return workshop notes so Tribal participants can correct, remove, or add',
              ],
              [
                'Education',
                'Materials for Tribal youth and the public on the history of colonization, made with Delta Tribes',
              ],
              [
                'Food sovereignty',
                'The ability to gather, prepare, and eat culturally important food produced sustainably',
              ],
              [
                'Water rights',
                'Federal reserved and state rights; the Tribal Nature-Based Solutions Program has supported return of about 103,000 acres (California Natural Resources Agency, 2025)',
              ],
            ],
          },
        ],
      },
    ],
  },
}

const recreation: CriterionStory = {
  source:
    'The Story Behind the Criterion: Water Dependent Recreation in the Sacramento-San Joaquin Delta. I. T. Sanchez and J. S. Jenkins, UC Merced, 2026 (draft).',
  brief: {
    rationale:
      'Changes in water, habitat, and access shape when and where people can boat, fish, hunt, watch birds, and spend time in the Delta.',
    what: 'Recreation examines how each future scenario changes conditions for five water-dependent recreational activities in the Delta: angling, boating, birding, waterfowl hunting, and day use at state parks.',
    why: 'Recreation in the Delta is diverse, popular, and highly valued. It supports individual and community well-being and is the Delta’s second-largest economic sector. Drought, water temperature, and salinity can alter recreation’s safety, timing, and quality, while ecological restoration and new facilities can expand and improve opportunities.',
  },
  what: [
    'This criterion assesses how each future scenario improves or impacts opportunities for 5 key recreational activities in the Delta: angling, boating, birding, waterfowl hunting, and day use at state parks. Many of these activities are water-dependent. Some depend on the water directly, such as boating, angling, and birding. Others depend on the species and habitats the water supports, such as waterfowl hunting and day use: picnicking, camping, and historical and cultural visits.',
  ],
  why: {
    paragraphs: [
      'Delta recreation and tourism have averaged about 12 million visitor days a year (Delta Protection Commission, 2012, 2021). Over the 2010s, the jobs they support fell from about 3,000 to 2,300, a drop that coincides with periods of prolonged drought and extreme swings between dry and wet years (Delta Protection Commission, 2021; Ding et al., 2011; Wlostowski et al., 2022).',
      'Low flows are generally associated with lower water quality; this includes warmer water temperature and higher salinity. Above 19°C, harmful algal blooms can spread and close waterways, as they did near Delta Meadows and the Cosumnes in 2016 (Hanak et al., 2011; Durand et al., 2020; Rudnick et al., 2025). Shifting conditions not only affect when people visit the Delta (Jenkins et al., 2023), but also affect how, and if, people can recreate in the Delta in general.',
    ],
    stats: [
      { value: '12 million', label: 'annual recreation and tourism activity days in the Delta' },
      { value: '26%', label: 'fewer Delta recreation and tourism jobs over the 2010s' },
    ],
  },
  construction: {
    intro:
      'This criterion was based on the existing recreational assessment literature to extrapolate main recreational activities of the Delta, thresholds associated with facilitation of those activities, and patterns across them.',
    facts: [],
    steps: [
      {
        title: 'Identify major recreational activities',
        body: 'Decades of surveys and existing literature point to five main pastimes: angling, birding, boating, day use at state parks, and waterfowl hunting. Visitors come from the Bay Area–Sacramento corridor and as far as Merced, Monterey, and Mendocino (Delta Protection Commission, 2021).',
        points: [
          '**Directly water-dependent**: Boating, angling, and birding.',
          '**Indirectly water-dependent**: Waterfowl hunting and day use are associated with water-dependent species and habitat.',
        ],
      },
      {
        title: 'Define thresholds informed by literature',
        body: 'Each activity gets the temperature and salinity limits tied to known shifts in participation or in the species it depends on. Habitat and restoration rank first in the criterion’s hierarchy, then temperature, then salinity.',
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
        name: 'Salinity Stress',
        summary:
          'How often **salinity** crosses a threshold that reflects the level at which participation in a given activity is no longer accessible or safe.',
        overviewSummary:
          'How often **salinity** crosses a threshold that reflects the level at which participation in an activity is no longer accessible or safe.',
        spec: [
          {
            label: 'Measures',
            value: 'Share of days whose average salinity is over an activity’s threshold',
          },
          {
            label: 'Unit',
            value:
              'Percent of modeled days above a salinity threshold; salinity measured in microsiemens per centimeter (µS/cm)',
          },
          {
            label: 'Where',
            value: 'Whole Delta, with specific report-out for the four recreation regions',
          },
        ],
        method: [
          'Flag each day when the average salinity is above **literature-based thresholds** for each activity.',
          'Divide flagged days by all days in the scenario-year, then again by in-season days only.',
          'Score against baseline: change in each activity’s percentage of threshold-exceedance days.',
        ],
        tables: [
          {
            caption: 'Salinity thresholds by activity',
            columns: ['Activity', 'Threshold', 'Why it matters'],
            rows: [
              ['Day use', 'Above 1,000 µS/cm', ''],
              ['Boating', 'Above 1,000 µS/cm', ''],
              ['Birding', 'Above 2,640 µS/cm', 'Avian botulism risk in wetlands'],
              [
                'Waterfowl hunting',
                'Above 3,600 µS/cm, with graded effects to 19,200',
                'Duckling growth, feathering, and survival',
              ],
              [
                'Angling',
                '9,130 µS/cm; 17,000 upper shared range; 19,000 water-quality objective',
                'Habitat shared by white sturgeon and striped bass',
              ],
            ],
          },
          {
            caption: 'Seasons used for each activity',
            columns: ['Activity', 'Season'],
            rows: [
              ['Angling', 'May–September'],
              [
                'Birding',
                'Spring migration April–June; fall migration August–October; winter October–April',
              ],
              ['Day use', 'May–September'],
              ['Boating', 'May–September'],
              [
                'Waterfowl hunting',
                'Hunting October–February; brooding April–July (model data only)',
              ],
            ],
          },
        ],
      },
      {
        name: 'Water Temperature Stress',
        summary:
          'How often **water temperature** crosses a threshold that limits participation in a given activity.',
        overviewSummary:
          'How often **water temperature** crosses a threshold that limits participation in an activity.',
        spec: [
          {
            label: 'Measures',
            value: 'Share of days whose average water temperature is over an activity’s threshold',
          },
          {
            label: 'Unit',
            value:
              'Percent of modeled days above a temperature threshold; temperature in degrees Celsius (°C)',
          },
          {
            label: 'Where',
            value: 'Whole Delta, with specific report-out for the four recreation regions',
          },
        ],
        method: [
          'Define the peak season for each activity from visitation patterns and ecological timing.',
          'Flag each day whose average water temperature is above literature-based thresholds for each activity.',
          'Divide flagged days by all days in the scenario-year, then again by in-season days only.',
          'Score against baseline: change in each activity’s percentage of threshold-exceedance days.',
        ],
        tables: [
          {
            caption: 'Water temperature thresholds by activity',
            columns: ['Activity', 'Threshold', 'Why it matters'],
            rows: [
              [
                'Day use',
                '19°C or warmer, held for about 14 days',
                'Conditions for harmful algal blooms',
              ],
              [
                'Boating',
                '19°C or warmer, held for about 14 days',
                'Conditions for harmful algal blooms',
              ],
              ['Cold-water day use', 'Below 18°C', 'Water too cold to swim'],
              ['Birding', 'Above 20°C', 'Avian botulism risk in wetlands'],
              ['Waterfowl hunting', 'Above 23°C', 'Duckling stress in Suisun Marsh'],
              [
                'Angling',
                '18.4°C average; 22.3°C suboptimal',
                'Across Chinook, splittail, steelhead, striped bass, and sturgeon',
              ],
            ],
          },
        ],
      },
      {
        name: 'Habitat Restoration',
        summary:
          'Restored habitat that provides increased opportunities for different recreation activities.',
        overviewSummary:
          'Restored habitat that provides increased opportunities for recreation activities.',
        spec: [
          {
            label: 'Measures',
            value: 'Amount of additional restored areas and landscapes',
          },
          { label: 'Unit', value: 'Acres' },
          {
            label: 'Where',
            value:
              'Assessed across the Delta, and upstream of the Delta for scenarios where upstream and watershed-scale restoration is proposed',
          },
        ],
        method: [
          'Sum acreage of restoration in each scenario beyond current baseline (baseline measured as publicly accessible land already in the California Protected Areas Database) (GreenInfo Network, 2026).',
        ],
      },
      {
        name: 'Recreation economy',
        summary:
          'Monetary value of acres of restored wetlands, in terms of value to fishing, hunting, and amenity and recreation.',
        overviewSummary:
          'What restored wetlands could be worth to recreation: fishing, hunting, and amenity and recreation.',
        spec: [
          { label: 'Measures', value: 'Annual value of wetland recreation services' },
          { label: 'Unit', value: 'Dollars per year' },
          { label: 'Where', value: 'Whole Delta' },
        ],
        method: [
          'Value restored wetland acres with per-acre estimates for wetland services (about $1,325 per acre per year across all services).',
          'Report the recreation services on their own: recreational fishing, recreational hunting, and amenity and recreation.',
        ],
        caveats: [
          'Water conditions are only part of the picture: bird viewing and hunting opportunities depend on habitat, management, migration, and regulations, as well as water conditions.',
        ],
      },
    ],
  },
}

const economy: CriterionStory = {
  source:
    'Economy criterion results for data visualization, v19. WSM Lab, UC Merced, 1 November 2026.',
  brief: {
    rationale:
      'Agriculture is currently the primary land use and primary economic sector in the Delta and thus is important to consider in any future transition. Increased salinity in the Delta can reduce agricultural production (since crops require fresh water). Changes in land use (such as wetland restoration) can also affect the Delta’s economy. This criterion assesses impacts of these potential changes across all scenarios.',
    what: 'Economy examines what happens to the Delta’s agricultural economy when salinity and landscape conditions in the Delta change. It does this by tracking changes in gross revenue (production), employment, and income.',
    why: 'Nearly 500,000 acres of irrigated farmland, and the packing houses, equipment dealers, and trucking tied to them, make up a working economy. Every scenario affects the economy, and the effects show up in paychecks and farm budgets.',
  },
  what: [
    'This criterion examines effects of each scenario on Delta agriculture in three ways: how much money farms bring in from what they grow, how many jobs depend on that activity and the businesses tied to it, and how much value is added to the regional economy once wages and business income are counted.',
  ],
  why: {
    paragraphs: [
      'The Delta supports close to 500,000 acres of irrigated farmland, plus packing houses, equipment dealers, trucking, and tourism on the water. Some scenarios affect agriculture through salt water on farm fields; others convert farmland to wetland outright.',
      'Measuring the size of those effects, and where they land, is a basic way to compare the scenarios, and one of the few counted directly in dollars and jobs.',
    ],
    stats: [
      { value: '500K', label: 'acres of irrigated farmland in the Delta, approximately' },
      { value: '$1.1B', label: 'in direct farm revenue annually at baseline' },
    ],
  },
  construction: {
    intro:
      'The six scenarios change the Delta economy in two different ways. Because of this, the criterion uses two modeling chains and reports both through the same regional economic model.',
    facts: [],
    points: [
      'Changes to the **salinity field** in the Delta affect farmland and irrigation.',
      '**Land use changes** affect if agricultural production is viable, and if so, what crops can be harvested.',
    ],
    paragraphs: [
      'Every scenario changes water salinity to some degree, which can reduce crop yields, and all six scenarios were assessed for that salinity effect.',
      'Resource Management Associates (RMA) simulated salinity for all six scenarios under current climate and with 2 feet of sea-level rise (A Tunnel and Calling on Reserves together with their own base run). That salinity effect was estimated by running the RMA salinity through crop salt-tolerance functions (yield loss), applying the yield loss to OpenAg farm revenue, and then applying IMPLAN regional economic ratios to get jobs and value added.',
      'New Green Watershed goes further: it converts subsided Delta farmland itself to wetland, rice, or paludiculture at three restoration intensities, which removes that land’s revenue outright regardless of salinity. That land-use effect was modeled separately by Cai et al. (Cai et al., in preparation) in a manuscript in preparation — the DAP basecase’s official Delta-wide crop acreage and revenue data, matched island-by-island to each restoration level’s footprint, adjusted into a modified regional economic base case, and then run through IMPLAN directly to get Direct and Total (regional-multiplier) Revenue, Employment, and Value Added effects for all three restoration levels.',
      'Eco Machine’s own land conversion (Suisun Marsh and the Franks Tract Futures’ design) was estimated separately: farm revenue lost on the converted land (from DWR’s 2024 land use and corresponding OpenAg revenue per acre), jobs and value added from the same IMPLAN ratios and multipliers as the New Green Watershed runs, carbon offset revenue from the Delta Island Adaptation greenhouse-gas rates, and one-time construction cost. It was not run through IMPLAN directly, but so little of that land is farmed that a direct run is unlikely to change the scenario score.',
    ],
    steps: [],
  },
  components: {
    items: [
      {
        name: 'Annual gross agricultural revenues',
        summary: 'Change in total **dollar sales** from Delta farms.',
        spec: [
          {
            label: 'Measures',
            value: 'Change in gross farm revenue relative to Business as Usual',
          },
          { label: 'Unit', value: 'Annualized 2024 US dollars' },
          { label: 'Where', value: 'Whole Delta, with specific report-out for each region' },
        ],
        method: [
          'Apply each scenario’s April–September **salinity** to determine **crop-yield loss** and apply it to OpenAg baseline revenue.',
          'Remove revenue associated with land that is converted from farmland to wetland in a given scenario.',
          'Add revenue associated with land that is converted to rice in a given scenario.',
          'Report direct on-farm revenue.',
        ],
        caveats: [
          'Carbon-offset revenue is a possibility: its rates come from four deeply subsided central-Delta islands and assume peat soils across the whole footprint.',
          'The Economy scores for Eco Machine and New Green Watershed measure only the losses in farm revenue, jobs and value added from land conversion, offset in part by carbon-offset revenue: credits sold for the greenhouse gas emissions the converted land avoids, at $15 per metric ton of CO2. They do not include the other benefits of restoration (subsidence reversal, lower flood risk and levee costs, water-supply and water-quality gains from Franks Tract, habitat, and recreation), so these scores show the cost side of the two scenarios, not their net economic effect.',
          'Seasonal salinity averages hide short peaks, which could matter more for salt-sensitive crops such as stone fruit, almonds, and strawberries.',
        ],
      },
      {
        name: 'Agriculture-supported Jobs',
        summary:
          'Change in **full- and part-time jobs** tied to farm activity, directly and through supporting businesses.',
        spec: [
          { label: 'Measures', value: 'Full- and part-time jobs in a sector, annually' },
          { label: 'Unit', value: 'Number of jobs' },
          { label: 'Where', value: 'Whole Delta, with specific report-out for each region' },
        ],
        method: [
          'Apply the annual gross agricultural revenue change determined in the first metric to an indicator of jobs through the IMPLAN model, by region.',
          'Assess the changes to land use through the IMPLAN model.',
          'Report direct jobs and total jobs, which add IMPLAN’s regional multipliers (table below).',
        ],
        tables: [
          {
            caption: 'What IMPLAN’s effects include',
            columns: ['Effect', 'Includes'],
            rows: [
              ['Direct', 'Activity and jobs on the farm or island itself'],
              ['Indirect', 'Supporting businesses such as packing, equipment, and trucking'],
              ['Induced', 'Household spending as farm income circulates'],
              ['Total', 'Direct + indirect + induced'],
            ],
          },
        ],
      },
      {
        name: 'Economic value added',
        summary:
          'Change in **wages, business income, and taxes** once revenue works through the regional economy, close to regional GDP.',
        spec: [
          { label: 'Measures', value: 'Gross revenue minus non-labor business expenses' },
          { label: 'Unit', value: 'Annualized 2024 US dollars' },
          { label: 'Where', value: 'Whole Delta, with specific report-out for each region' },
        ],
        method: [
          'Use value added from the same IMPLAN runs as employment.',
          'Report direct and total value added for each scenario and restoration level.',
        ],
      },
    ],
  },
}

/** Criterion stories by team id, matching `evaluationTeams`. */
export const criterionStories: Record<(typeof evaluationTeams)[number]['id'], CriterionStory> = {
  ecology,
  'environmental-justice': environmentalJustice,
  'ecocultural-restoration': ecoculturalRestoration,
  recreation,
  economy,
}
