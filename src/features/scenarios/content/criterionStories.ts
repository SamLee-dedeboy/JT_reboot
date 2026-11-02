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
  body: string
  points?: string[]
}

export interface CriterionStory {
  source: string
  /** For the evaluation page: why the criterion is in the set, what it is, and why it matters. */
  brief: { rationale: string; what: string; why: string }
  what: string[]
  why: { paragraphs: string[]; stats?: Array<{ value: string; label: string }>; quote?: string }
  construction: {
    intro: string
    facts: Array<{ value: string; label: string }>
    steps: ConstructionStep[]
  }
  components: { intro?: string; items: CriterionComponent[] }
}

const ecology: CriterionStory = {
  source:
    'The Story Behind the Criterion: Delta Ecology. L. Williams Duman and E. Platzer, UC Davis, August 2026 (draft).',
  brief: {
    rationale:
      'Each future adaptation scenario will change salinity, water temperature, habitat conditions, and food webs, affecting the ability of native and introduced species to persist. The Delta’s current and future ecology is of broad concern.',
    what: 'The ecology criterion assesses how adaptation scenarios affect the Delta aquatic ecosystem by evaluating projected environmental conditions, food webs, and habitat availability.',
    why: 'The Delta has lost more than 90% of its historic wetlands. Several species of cultural and ecological importance are critically endangered, and others are declining. People rely on the Delta ecosystem for subsistence, cultural practice, and recreation, and a just transition must ensure a better future for its non-human species.',
  },
  what: [
    'A just transition means no one is left behind or pushed behind and, for ecology, that includes the Delta’s species, waterways, and habitats, and the people who rely on them.',
    'Scientists refer to the Delta as a novel ecosystem: since it has been dramatically transformed by land reclamation, habitat loss, and development, it requires creative management to make sure the ecosystem survives. This criterion examines how each scenario affects three primary ecological factors: where species can survive, how much food is available in the Delta’s waterways, and how much tidal wetland habitat aquatic species can access.',
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
      'The criterion started from a conceptual model of how the Delta ecosystem responds to change and chose six species to follow based on workshop participant feedback.',
    facts: [
      { value: '6', label: 'species, eight life stages' },
      { value: '145', label: 'model points' },
      { value: '8', label: 'estuary subregions' },
    ],
    steps: [
      {
        title: 'Build a conceptual model',
        body: 'After the preliminary scenarios were shared, the ecology criterion mapped how parts of the Delta ecosystem feed back on one another, to see which ones each scenario would affect.',
      },
      {
        title: 'Select simulated data for consideration',
        body: 'The criterion selected the simulated and scenario-design data that could describe ecological change.',
        points: [
          'Salinity and temperature: where each species can physically survive.',
          'Scenario design and land-use maps: acres of new wetland and wet-soil farming, for the food-web and habitat metrics.',
          'Wetland types: tidal and managed wetlands contribute differently to food-web production.',
        ],
      },
      {
        title: 'Species of interest',
        when: 'June 2025 public workshop',
        body: 'Participants selected the species they were most interested in following. Chinook salmon was highly prioritized as a cultural resource and an endangered species. Other species of interest included longfin smelt, bass, and the invasive “ecosystem engineers” Brazilian waterweed and overbite clam.',
        points: [
          'Selection also required sensitivity to salinity or temperature, so the models could say something useful.',
          'The final six span a wide range of tolerances, from strictly fresh (waterweed, largemouth bass) to brackish and marine (overbite clam, adult longfin smelt).',
          'Life stages are split where needs differ: juvenile and adult longfin smelt and striped bass, juvenile fall-run Chinook, juvenile overbite clam.',
        ],
      },
      {
        title: 'Define thresholds based on literature',
        body: 'Published physiological studies give the salinity and temperature range thresholds beyond which each species cannot survive. These limits define a species’ fundamental niche.',
      },
      {
        title: 'Divide the estuary into regions',
        body: 'Points are grouped into subregions from a published hierarchical clustering of average daily temperature (Pien et al.), extended west of Suisun with known contraction points (Grimaldo et al. 2020). Suisun Bay and Suisun Marsh are combined.',
        points: [
          'North Delta 30 · Central Delta 23 · South Delta 11 · Confluence 16',
          'Suisun 25 · San Pablo Bay 15 · Central Bay 16 · South Bay 9',
          'Points outside the legal Delta are kept so range shifts of migratory species show up.',
        ],
      },
      {
        title: 'Review and refine',
        when: 'Public Workshop 2 · June 2025, and ongoing',
        body: 'The draft criterion was reviewed and revised with workshop participants. Feedback on methods and assumptions shaped the final iteration, and team members checked in periodically with the project’s Advisory Committee.',
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
          'For each day at each location, assign a classification of suitable or unsuitable for a given species, requiring both **salinity and temperature** to be inside the species’ limits.',
          'Divide suitable days by all days in the modeled run to get each point’s proportion of suitable days.',
          'Fit beta regression models (glmmTMB) of that proportion on scenario × subregion, with site as a random effect; fit 2019 and 2020 separately for each species.',
          'Count consecutive suitable days at each point and average the streak lengths across points.',
        ],
        tables: [
          {
            caption: 'Survival limits used for each species and life stage',
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
          'Limits mark where a species can physically survive, not where it thrives: food, predators, and habitat structure are outside this metric.',
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
          { label: 'Unit', value: 'Weighted acres' },
          { label: 'Where', value: 'Whole Delta, with specific report-out for each region' },
        ],
        method: [
          'Subtract what already exists: about 5,100 acres of managed wetland (Delta Stewardship Council) and 17,178 acres of rice (2022).',
          'Weight each habitat by its relative contribution to nearby waterways (table below).',
          'Result = (managed wetland − 5,100) × 0.2 + new tidal wetland × 0.4 + (wet-soil farming − 17,178) × 0.1. A term with no added acres counts as zero, not negative.',
          'Score on the −5 to +5 scale: baseline and scenarios without new wetland at 0; rank scenarios proportionally based on the magnitude of their result relative to baseline.',
        ],
        tables: [
          {
            caption: 'Habitat weights for food-web contribution',
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
          'Score on the −5 to +5 scale: baseline and scenarios without new wetland at 0; rank scenarios proportionally based on the magnitude of their result relative to baseline.',
        ],
        caveats: [
          'Though managed wetlands and rice can still serve floodplain spawners, birds, mammals, and invertebrates, this metric deliberately counts only year-round aquatic access.',
          'New Green Watershed’s Cache–Lindsey Slough restoration does not change salinity; it is there for the aquatic community.',
        ],
      },
      {
        name: 'Conceptual Model',
        summary:
          'How each scenario shifts **food webs, habitat access**, and the wider relationships across the Delta ecosystem.',
        spec: [
          {
            label: 'Describes',
            value: 'Food-web changes, habitat accessibility, and ecosystem-wide interactions',
          },
          { label: 'Form', value: 'Comparative conceptual models, one per scenario' },
          { label: 'Where', value: 'The Delta ecosystem as a whole' },
        ],
        method: [
          'Map how parts of the Delta ecosystem feed back on one another.',
          'Mark which of those parts each scenario could move.',
          'Synthesize the results into comparative models that make differences between scenarios visible.',
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
    why: '82.6% of the project’s interviewees said Delta decision-making is not equitable or fair. Every in-Delta community is vulnerable to some degree, so knowing where undue burdens may occur helps decision-makers avoid them.',
  },
  what: [
    'As defined by the Delta Stewardship Council, environmental justice is “the fair treatment and meaningful involvement of all people, regardless of race, culture, national origin, or income, in environmental laws, regulations, and policies” (Delta Stewardship Council, n.d.). This criterion applies it through the lens of vulnerable communities.',
    'Vulnerability combines exposure to climate hazards, sensitivity to them, and the capacity to recover and adapt (Delta Stewardship Council, 2021, p. xi). The Delta Stewardship Council’s Vulnerability to Climate Change in the Delta interactive map classifies every Delta community as Moderate, High, or Highest vulnerability, derived from 14 socioeconomic indicators, from poverty and linguistic isolation to asthma and food insecurity. The lowest rating anywhere in the Delta is Moderate: every in-Delta community is vulnerable to some degree.',
  ],
  why: {
    paragraphs: [
      'The overwhelming majority of interviewees think decision-making in the Delta is not equitable and fair. They pointed to power imbalances, the influence of money, and infringement of water rights.',
      'The Just Transitions Project explores more inclusive and equitable planning approaches to salinity management. The Environmental Justice and Vulnerable Communities criterion specifically assesses Delta environmental justice community concerns identified through the project’s outreach, workshops, and consultations. This outreach established the priorities and metrics the team assessed.',
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
      'While literature provides general agreement about the burdens environmental justice communities face, it does not substitute for meaningful interaction with community members and advocates. The project intentionally sought environmental justice perspectives and narrowed their priorities to what the project could measure.',
    facts: [
      { value: '49', label: 'interviews, ~20% with EJ and Tribal community members' },
      { value: '1', label: 'Environmental Justice Workshop, December 2024' },
      { value: '3', label: 'Tribal Workshops, November 2024 to December 2025' },
      { value: '6', label: 'value areas distilled from feedback' },
      { value: '3', label: 'metrics within project scope' },
      { value: '14', label: 'indicators behind each vulnerability rating' },
    ],
    steps: [
      {
        title: 'Invite less-often-heard voices',
        body: 'Interview invitations went intentionally to members and advocates of environmental justice and Tribal communities. Questions covered values, drivers of salinity change, management strategies to explore, and Delta governance; answers shaped the preliminary scenarios.',
      },
      {
        title: 'Spotlight EJ viewpoints',
        when: 'Public Workshop 1 · June 2024',
        body: 'Environmental justice perspectives were featured to the broader public workshop audience.',
      },
      {
        title: 'Hold an environmental justice workshop',
        when: 'December 2024',
        body: 'Participants discussed the issues facing environmental justice and vulnerable communities. Their priorities became the first draft of the criterion.',
      },
      {
        title: 'Sort priorities by who can measure them',
        body: 'Feedback fell into six value areas: water quality and quantity, community and recreation, flood risk, ecological restoration and recovery, ecocultural restoration and Indigenous sovereignty, and a sustainable economy.',
        points: [
          'Measured here: drinking water, flood risk, and harmful algal bloom conditions.',
          'Measured by other criteria: recreation and ecology (Recreation, Ecology), agriculture (Economy), Indigenous sovereignty (its own criterion).',
          'Outside the project’s scope: pollutants, standard compliance, public health, revised water rights, energy generation, and water affordability.',
        ],
      },
      {
        title: 'Review and refine',
        when: 'Public Workshop 2 · June 2025, and ongoing',
        body: 'The draft criterion was reviewed and revised with workshop participants and checked periodically with the project’s Advisory Committee.',
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
          'Locate in-Delta public water systems from the State Water Board’s SAFER program, including treated municipal systems, wells, and untreated surface-water systems.',
          'Move each inland location into the closest channel so the hydrodynamic model reports salinity there.',
          'Give each point the vulnerability class of the community it serves, from the Delta Stewardship Council’s Vulnerability Index.',
          'Count daily means above **1,050 µS/cm** and divide by the number of measurements.',
          'Score against baseline: change in each vulnerability zone’s percentage of threshold-exceedance days.',
        ],
        tables: [
          {
            caption: 'Points by vulnerability class',
            columns: ['Vulnerability', 'Adaptation runs', 'Outflow runs'],
            rows: [
              ['Moderate', '10', '10'],
              ['High', '36', '33'],
              ['Highest', '3', '3'],
              ['Total', '49', '46'],
            ],
          },
        ],
        caveats: [
          'The 1,050 µS/cm threshold matches California’s secondary drinking-water standard for chloride (Title 22) and the State Board’s chloride objectives.',
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
            value: 'Qualitative: no change, slight, moderate, or significant decrease or increase',
          },
          { label: 'Where', value: 'The Delta as a whole' },
        ],
        method: [
          'Review the measures built into each scenario that could affect flood risk, such as levee fortification and upland restoration.',
          'Judge the direction and size of the change in in-Delta flood risk against Business as Usual.',
          'Translate that judgement onto the −5 to +5 scale.',
        ],
        caveats: [
          'Not assessed for the outflow runs, which share one landscape and change only the amount of outflow.',
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
          { label: 'When', value: 'May through October, when bloom likelihood rises' },
        ],
        method: [
          'Determine time periods when water is at or above 19°C, the temperature at which blooms begin to grow.',
          'Compare water age with Business as Usual in each region using heatmap output.',
          'Place each scenario on an 11-step scale from extreme decrease to extreme increase in water age.',
        ],
        caveats: [
          'This is not a prediction of if or when harmful algal blooms will occur under any scenario, but an indicator of some conditions favorable for bloom formation.',
          'Water age is one of several factors that make blooms more likely; nutrients and other drivers are not modeled here.',
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
      'Native Tribes were the original stewards of the Delta. A just transition should address the legacies of settler colonialism, genocide, forced removal, and land reclamation by respecting Tribal sovereignty, restoring ecoculturally valued habitats and species, increasing land access, and restoring Indigenous knowledge, stewardship, guardianship, and lifeways.',
    what: 'Ecocultural restoration restores ecosystems and Indigenous cultures simultaneously as interconnected and reciprocal processes. This criterion assesses whether scenarios advance ecosystem restoration, land access, Indigenous science and Traditional Ecological Knowledge, and Tribal sovereignty.',
    why: 'The Delta was home to many Tribes long before colonization, and their ties to its land, water, and life run deep. A just transition in the Delta cannot happen without Indigenous leadership and inclusion in Delta decision-making.',
  },
  what: [
    'Leaving no one behind means accounting for past wrongs, including the exclusion of Tribal and Indigenous communities from Delta decisions. That makes ecocultural restoration and Indigenous sovereignty pillars of a just transition.',
    'Ecocultural restoration restores land and Indigenous cultures simultaneously as a connected and reciprocal process, with Indigenous people taking part in planning, design, and stewardship in a collaborative, self-determined way. Indigenous sovereignty is a nation’s inherent right to govern themselves and live their own way of life, free from interference. Two main pillars of this criterion are intergenerational stewardship, and intergenerational prosperity and well-being.',
  ],
  why: {
    paragraphs: [
      'Prior to colonization, the Delta was home to many Tribes, including the Bay Miwok, Coast Miwok, Plains Miwok, Maidu, Nisenan, Ohlone, Patwin, Pomo, Wappo, Wintun, and Yokuts. Though most were relocated outside the Delta, their connections to the land, water, and the life the Delta supports remain deep. Indigenous communities’ values belong in Delta decisions. The Delta’s species, and the flow of water itself, are incredibly important to Indigenous worldviews.',
    ],
    stats: [
      {
        value: 'Original stewards and guardians',
        label: 'Native Tribes were the Delta’s first residents, long before colonization',
      },
      {
        value: '7.5M',
        label: 'acres California aims to bring under Tribal stewardship (2026 state policy)',
      },
    ],
  },
  construction: {
    intro:
      'Because Indigenous community leadership is paramount to a just transition, the project intentionally, consistently, and frequently checked in, applied feedback, and iterated on this criterion through interviews, Tribal workshops, public workshops, and Advisory Committee review.',
    facts: [
      { value: '3', label: 'Tribal workshops, Nov 2024 to Dec 2025' },
      { value: '14', label: 'reciprocal and interconnected components' },
      {
        value: '2',
        label:
          'pillars: intergenerational stewardship and intergenerational prosperity and well-being',
      },
      { value: '1', label: 'quantitative metric' },
      { value: '3', label: 'descriptive metrics' },
    ],
    steps: [
      {
        title: 'Intentional outreach',
        body: 'Indigenous community members and advocates were specifically invited to semi-structured interviews so Tribal values and voices could inform the research from the beginning. Findings shaped the preliminary scenario narratives.',
      },
      {
        title: 'Spotlight Indigenous community viewpoints',
        when: 'Public Workshop 1 · June 2024',
        body: 'Indigenous community member and advocate perspectives were featured to the broader public workshop audience.',
      },
      {
        title: 'Draw the connections',
        when: 'Tribal Workshop 1 · November 2024',
        body: 'Interview results, literature, and conversations with Indigenous Advisory Committee members became a diagram of how ecocultural restoration and sovereignty reinforce each other. Workshop participants reviewed it, and it was distilled into four metrics.',
      },
      {
        title: 'Review and refine',
        when: 'Public Workshop 2 and Tribal Workshop 2 · June 2025; Tribal Workshop 3 · December 2025; and ongoing',
        body: 'Participants said the four metrics matter equally and depend on one another, and asked for additions that were then incorporated.',
        points: [
          'Food sovereignty, data sovereignty, and youth education on the legacies of colonialism, under sovereignty.',
          'Privacy while practicing TEK, through Tribal site selection or buffer zones, under TEK.',
        ],
      },
      {
        title: 'Ask which landscapes matter',
        when: 'Tribal Workshop 3 · December 2025',
        body: 'Respondents described current land access, desired landscapes, and governance. These priorities set the habitat types restored in Eco Machine and New Green Watershed.',
        points: [
          'Tidal wetlands: clean water, biodiversity, and grasses for basket-weaving.',
          'Upper watershed forests, meadows, and floodplains: hunting, food and medicine gathering, and reducing fire risk.',
        ],
      },
      {
        title: 'Research and iteratively refine the watershed restoration scenarios',
        body: 'The upper-watershed restoration scenario and associated benefits were researched and iteratively developed from the first Tribal workshop through the rest of the project. The final result is a 3 × 3 matrix of nine potential sub-scenarios: minimal, medium, or maximal effort, each prioritizing forests, meadows, or floodplains, combined with in-Delta tidal wetland restoration.',
      },
    ],
  },
  components: {
    intro:
      'The four metrics are equally important and interdependent. Only habitat restoration can be evaluated spatially and quantitatively across scenarios. Land access, Tribal sovereignty, and Indigenous Science and Traditional Ecological Knowledge are expressed qualitatively as potential advanced by restoration scenarios.',
    items: [
      {
        name: 'Restoration of Native Ecosystems and Ecosystem Functions',
        summary:
          'Recovering and protecting the Delta’s **native, culturally significant** species and ecosystems through habitat creation, restoration, and environmental flows.',
        spec: [
          { label: 'Measures', value: 'Change in restored acres in each scenario' },
          { label: 'Unit', value: 'Acres, by habitat type' },
          { label: 'Where', value: 'Whole Delta, plus the much larger Bay–Delta watershed' },
        ],
        method: [
          'Find the restorable area of each upland habitat (table below).',
          'Apply the nine upland scenarios, from minimal to maximal effort, each weighted toward forests, meadows, or floodplains.',
          'Add in-Delta tidal wetland restoration: Suisun Marsh and Franks Tract in Eco Machine; in-Delta plus upper watershed in New Green Watershed.',
          'Leave out the 30,000 acres of already-planned restoration (EcoRestore), which every scenario including Business as Usual shares.',
        ],
        tables: [
          {
            caption: 'Restorable upland area in the Bay–Delta watershed',
            columns: [
              'Habitat',
              'Low restoration acreage',
              'Medium restoration acreage',
              'High restoration acreage',
              'Basis',
            ],
            rows: [
              [
                'Upland forest',
                '468,000 acres',
                '2,574,000 acres',
                '4,680,000 acres',
                'CAL FIRE vegetation layer; Sierra Nevada Conservancy subregions',
              ],
              [
                'Montane meadow',
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
        name: 'Increased Access to Landscapes for Stewardship, Subsistence, Ceremony, and Cultural Practices',
        summary:
          '**Returning land** to Tribes or **co-managing** it with them for stewardship, subsistence, ceremony, and cultural practice.',
        spec: [
          {
            label: 'Measures',
            value: 'The kinds of agreements that can open land to Tribal communities',
          },
          { label: 'Unit', value: 'Descriptive' },
          {
            label: 'Where',
            value:
              'The whole Delta watershed; expected alongside restoration in Eco Machine and New Green Watershed, but possible in any scenario',
          },
        ],
        method: [
          'Not counted in acres: Delta land is a mosaic of private and public ownership, so access cannot be modeled.',
          'Compile the agreement types that can deliver access, from strongest to most flexible (table below).',
        ],
        tables: [
          {
            caption: 'Agreements that can expand Tribal access',
            columns: ['Agreement', 'What it does'],
            rows: [
              [
                'Tribal ownership',
                'Returns full ownership, stewardship, and decision-making; land trusts can hold land while a Tribe secures funding',
              ],
              [
                'Land trust partnership',
                'A trust buys land and agrees conservation, access, and stewardship terms with a Tribe',
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
                'MOU / MOA',
                'Collaboration with agencies, landowners, or trusts for gathering and TEK; an MOA is binding, an MOU is not',
              ],
            ],
          },
        ],
      },
      {
        name: 'Implementation of Indigenous Science & Traditional Ecological Knowledge (TEK)',
        summary:
          'Bringing **Traditional Ecological Knowledge** into management and land-use decisions in partnership with Tribal representatives and practitioners.',
        spec: [
          { label: 'Measures', value: 'Avenues through which TEK can be applied' },
          { label: 'Unit', value: 'Descriptive' },
          {
            label: 'Where',
            value: 'The whole Delta watershed; TEK should inform all planning decisions',
          },
        ],
        method: [
          'Compile what participants said TEK needs in order to be practiced (table below).',
          'Pair each need with mechanisms that already exist in agreements or state policy.',
        ],
        tables: [
          {
            caption: 'Conditions for applying TEK',
            columns: ['Condition', 'In practice'],
            rows: [
              [
                'Privacy',
                'Partners do not ask why practices happen; Tribe-chosen sites or buffer zones keep them unobserved and unphotographed',
              ],
              [
                'Unrestricted access',
                'Access without fear of trespass citations, written into agreements with landowners and trusts',
              ],
              ['Site selection', 'Sites that elders and people with reduced mobility can reach'],
              [
                'Tribal stewardship groups',
                'Collaboration such as under the state’s Tribal Stewardship Policy, aiming at 7.5 million acres',
              ],
            ],
          },
        ],
      },
      {
        name: 'Recognition and Application of Indigenous Sovereignty, Tribal Governance, and Rights',
        summary:
          'Advancing Indigenous peoples’ **inherent right to govern** themselves, their lands, and resources, and to maintain their cultures and ways of life.',
        spec: [
          {
            label: 'Measures',
            value: 'Instances and mechanisms that recognize and apply sovereignty',
          },
          { label: 'Unit', value: 'Descriptive' },
          { label: 'Where', value: 'The whole Delta watershed' },
        ],
        method: [
          'Compile mechanisms that participants and the literature identify (table below).',
          'Note how each connects to the scenarios, for example water rights that follow returned land.',
        ],
        tables: [
          {
            caption: 'Mechanisms of recognition',
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
                'Federal reserved and state rights; the Tribal Nature-Based Solutions Program has supported return of about 103,000 acres',
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
    'This criterion assesses how each future scenario improves or affects opportunities for five key recreational activities in the Delta: angling, boating, birding, waterfowl hunting, and day use at state parks. Many are water-dependent. Some depend on the water directly, such as boating, angling, and birding. Others depend on the species and habitats the water supports, such as waterfowl hunting and day use: picnicking, camping, and historical and cultural visits.',
  ],
  why: {
    paragraphs: [
      'Delta recreation and tourism have averaged about 12 million visitor days a year (Delta Protection Commission, 2012, 2021). Over the 2010s, the jobs they support fell from about 3,000 to 2,300, a drop that coincides with periods of prolonged drought and extreme swings between dry and wet years (Delta Protection Commission, 2021; Ding et al., 2011; Wlostowski et al., 2022).',
      'Low flows are generally associated with lower water quality, including warmer water temperature and higher salinity. Above 19°C, harmful algal blooms can spread and close waterways, as they did near Delta Meadows and the Cosumnes in 2016 (Hanak et al., 2011; Durand et al., 2020; Rudnick et al., 2025). Shifting conditions affect not only when people visit the Delta (Jenkins et al., 2023), but also how, and whether, people can recreate there.',
    ],
    stats: [
      { value: '12 million', label: 'annual recreation and tourism activity days in the Delta' },
      { value: '26%', label: 'fewer Delta recreation and tourism jobs over the 2010s' },
    ],
  },
  construction: {
    intro:
      'This criterion was based on existing recreational assessment literature to identify the Delta’s main recreational activities, thresholds associated with those activities, and patterns across them.',
    facts: [],
    steps: [
      {
        title: 'Identify major recreational activities',
        body: 'Decades of surveys and literature point to five main pastimes: angling, birding, boating, day use at state parks, and waterfowl hunting. Visitors come from the Bay Area–Sacramento corridor and as far as Merced, Monterey, and Mendocino (Delta Protection Commission, 2021).',
        points: [
          'Boating, angling, and birding directly depend on the water.',
          'Waterfowl hunting and day use are associated with water-dependent species and habitat.',
        ],
      },
      {
        title: 'Define thresholds informed by literature',
        body: 'Each activity gets the temperature and salinity limits tied to known shifts in participation or in the species it depends on. Habitat and restoration rank first in the criterion’s hierarchy, then temperature, then salinity.',
      },
      {
        title: 'Review and refine',
        when: 'Public Workshop 2 · June 2025, and ongoing',
        body: 'The draft criterion was reviewed and revised with workshop participants. Feedback on methods and assumptions shaped the final iteration, and team members checked in periodically with the project’s Advisory Committee.',
      },
    ],
  },
  components: {
    items: [
      {
        name: 'Salinity Stress',
        summary:
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
          { label: 'Where', value: 'Whole Delta and the four recreation regions' },
        ],
        method: [
          'Flag each day whose average salinity is above **literature-based thresholds** for each activity.',
          'Divide flagged days by all days in the scenario-year, then again by in-season days only.',
          'Score against baseline: change in each activity’s percentage of threshold-exceedance days.',
        ],
        tables: [
          {
            caption: 'Salinity thresholds by activity',
            columns: ['Activity', 'Threshold', 'Why it matters'],
            rows: [
              ['Day use', 'Above 1,000 µS/cm', 'Landscape quality for recreation'],
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
              ['Angling', 'May to September'],
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
          { label: 'Where', value: 'Whole Delta and the four recreation regions' },
        ],
        method: [
          'Define the peak season for each activity from visitation patterns and ecological timing.',
          'Flag each day whose average water temperature is above literature-based thresholds for each activity.',
          'Divide flagged days by all days in the scenario-year, then again by in-season days only.',
          'Score against baseline: change in each activity’s percentage of threshold-exceedance days.',
        ],
        tables: [
          {
            caption: 'Temperature thresholds by activity',
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
              'Across the Delta, and upstream where scenarios propose upstream and watershed-scale restoration',
          },
        ],
        method: [
          'Sum restoration acreage in each scenario beyond the current baseline, measured as publicly accessible land already in the California Protected Areas Database (GreenInfo Network, 2026).',
        ],
      },
      {
        name: 'Recreation economy',
        summary:
          'What restored wetlands could be worth to recreation: fishing, hunting, and amenity and recreation.',
        spec: [
          { label: 'Measures', value: 'Annual value of wetland recreation services' },
          { label: 'Unit', value: 'Dollars per year' },
          { label: 'Where', value: 'Whole Delta' },
        ],
        method: [
          'Value restored wetland acres with per-acre estimates for wetland services (about $1,325 per acre per year across all ten).',
          'Report the recreation services on their own: recreational fishing, recreational hunting, and amenity and recreation.',
        ],
        caveats: [
          'Water conditions are only part of the picture: bird viewing and hunting opportunities depend on habitat, management, migration, and regulations as well as water conditions.',
        ],
      },
    ],
  },
}

const economy: CriterionStory = {
  source:
    'The Story Behind the Criterion: Economy, v16. Y. Cai and J. Medellín-Azuara, UC Merced, 25 October 2026.',
  brief: {
    rationale:
      'Agriculture is the Delta’s primary land use and economic sector. Increased salinity can reduce agricultural production, while land-use changes such as wetland restoration can also affect the economy. This criterion assesses those potential changes across all scenarios.',
    what: 'Economy examines what happens to the Delta’s agricultural economy when salinity and landscape conditions change. It tracks gross revenue, employment, and value added.',
    why: 'Nearly 500,000 acres of irrigated farmland, and the packing houses, equipment dealers, and trucking tied to them, make up a working economy. Every scenario affects the economy, and the effects show up in paychecks and farm budgets.',
  },
  what: [
    'This criterion examines the effects of each scenario on Delta agriculture in three ways: how much money farms bring in from what they grow, how many jobs depend on that activity and the businesses tied to it, and how much value is added to the regional economy once wages and business income are counted.',
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
    facts: [
      { value: '$1.1B', label: 'baseline direct farm revenue a year' },
      { value: '~7,650', label: 'baseline direct farm jobs' },
      { value: '4', label: 'Delta zones' },
      { value: '3', label: 'New Green Watershed restoration levels' },
    ],
    steps: [
      {
        title: 'Salinity pathway',
        body: 'Every future changes salinity, so all six run through this chain. Each farm field takes the April–September average of RMA’s modeled salinity at its station; crop salt-tolerance curves turn that into yield loss, which is applied to OpenAg baseline farm revenue by region and crop. IMPLAN ratios by region then convert revenue into jobs and value added.',
        points: [
          'Yield loss uses the van Genuchten–Hoffman salt-tolerance function with crop-specific coefficients, assuming standard Delta irrigation (root-zone salinity 1.5 times irrigation-water salinity).',
          'Run for a wet year (2019) and a dry year (2020), under current climate and with 2 feet of sea-level rise.',
          'Calling on Reserves and A Tunnel are compared with the base run RMA delivered with them; against Business as Usual the results differ by under $1,000 a year.',
          'A full OpenAg run, which also lets farmers shift land among crops, gives effects about 1.3 to 1.8 times these; no score changes.',
        ],
      },
      {
        title: 'Land-use pathway',
        body: 'New Green Watershed converts subsided farmland to managed and floating wetland, rice, or paludiculture, which removes that land’s revenue regardless of salinity.',
        points: [
          'Three levels: full restoration (all targeted farmland), ~50% wetland and 50% rice, ~25% wetland and 75% rice.',
          'Crop acreage and revenue from the DAP base case (432,547 acres) are matched island by island to each footprint.',
          'The adjusted base case is run through IMPLAN for direct and total effects.',
        ],
      },
      {
        title: 'Eco Machine’s conversions',
        body: 'Revenue lost on converted land in Suisun Marsh and Franks Tract is estimated from DWR’s 2024 land use and OpenAg revenue per acre, with New Green Watershed’s job and value-added ratios.',
        points: [
          'Restores 25%, 50%, or 100% of the 52,244 leveed acres in Suisun Marsh, plus about 1,370 acres at Franks Tract; only about 2,000 Suisun acres are farmed.',
          'Carbon-offset revenue from Delta Island Adaptations greenhouse-gas rates at $15 per tonne CO₂e, less 14% for market and verification risk.',
          'One-time construction cost of about $0.85–1.5 billion: about $17,000 per acre to breach Suisun levees and $633 million for the Franks Tract Futures design. It sits outside the three scored metrics.',
        ],
      },
      {
        title: 'Score the dominant effect',
        body: 'Scenarios are scored from −5 to +5 with Business as Usual at 0. Salinity effects are tiny next to land conversion, so each scenario is scored on whichever effect dominates for it, and one score covers revenue, jobs, and value added.',
        points: [
          'Land use decides New Green Watershed (−3 to −5 by restoration level) and Eco Machine (0).',
          'Salinity decides Bolster and Fortify (−1), A Tunnel (−1), and Calling on Reserves (0).',
          'Scores are the same with 2 feet of sea-level rise, which lowers every scenario by a similar small amount.',
        ],
      },
      {
        title: 'Report by zone',
        body: 'A Delta-wide total can hide winners and losers, so results are also split into four zones: North, Central, and South Delta, drawn by water agency, and the West Delta. Suisun Marsh land use comes from CDFW 2021 vegetation and DWR 2024 crop mapping.',
      },
    ],
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
          {
            label: 'Where',
            value: 'Whole Delta, with specific report-out for each region',
          },
        ],
        method: [
          'Apply each scenario’s April–September **salinity** to determine **crop-yield loss** and apply it to OpenAg baseline revenue.',
          'Remove revenue associated with land converted from farmland to wetland in a scenario.',
          'Add revenue associated with land converted to rice in a scenario.',
          'Report direct on-farm revenue.',
        ],
        caveats: [
          'Carbon-offset revenue is an upper-end possibility: its rates come from four deeply subsided central-Delta islands and assume peat soils across the whole footprint.',
          'Seasonal salinity averages hide short peaks, which could matter more for salt-sensitive crops such as stone fruit, almonds, and strawberries.',
        ],
      },
      {
        name: 'Agriculture-supported Jobs',
        summary:
          'Change in **full- and part-time jobs** tied to farm activity, directly and through supporting businesses.',
        spec: [
          { label: 'Measures', value: 'Full- and part-time jobs in a sector annually' },
          { label: 'Unit', value: 'Number of jobs' },
          { label: 'Where', value: 'Whole Delta, with specific report-out for each region' },
        ],
        method: [
          'Apply the annual gross agricultural revenue change from the first metric to an indicator of jobs through the IMPLAN model, by region.',
          'Assess land-use changes through the IMPLAN model.',
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
          'Take value added from the same IMPLAN runs as employment.',
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
