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
  brief: { what: string; why: string }
  what: string[]
  why: { paragraphs: string[]; stat?: { value: string; label: string }; quote?: string }
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
    what: 'Ecology looks at how well each future supports the Delta’s species, the food produced in its open water, and the wetland habitat fish can reach.',
    why: 'The Delta has lost more than 90% of its historic wetlands, and several culturally and ecologically important species are now endangered. A just transition has to leave the Delta’s non-human residents better off too.',
  },
  what: [
    'A just transition means no one is left behind or pushed behind. For ecology, that includes the Delta’s species, waterways, and habitats, and the people who rely on them.',
    'Scientists call the Delta a novel ecosystem: so changed by land reclamation and water development that returning it to a historic state is no longer realistic. It still works and still supports many species, but getting those benefits takes creative management. This criterion asks how each future changes three things: where species can survive, how much food open water produces, and how much wetland habitat aquatic species can reach.',
  ],
  why: {
    paragraphs: [
      'Dams, levees, water projects, and the draining of wetlands for farmland have cost the Delta more than 90% of its historic wetland habitat. Several species of cultural and ecological importance are now critically endangered, and others are declining.',
      'People depend on the Delta’s ecosystem for food, cultural practice, and recreation. The ecology team also holds that a just transition must mean a better future for the species that call the Delta home.',
    ],
    stat: { value: '90%+', label: 'of the Delta’s historic wetland habitat has been lost' },
  },
  construction: {
    intro:
      'The team started from a conceptual model of how the Delta ecosystem responds to change, matched each question to an output the hydrodynamic models could supply, and let workshop participants choose the species to follow.',
    facts: [
      { value: '6', label: 'species, eight life stages' },
      { value: '145', label: 'model points' },
      { value: '8', label: 'estuary subregions' },
    ],
    steps: [
      {
        title: 'Build a conceptual model',
        body: 'After the preliminary scenarios were shared, the team mapped how parts of the Delta ecosystem feed back on one another, to see which ones each future could move.',
      },
      {
        title: 'Match questions to model outputs',
        body: 'The hydrodynamic models report salinity, temperature, and water age at points across the estuary. The team assigned each output a role.',
        points: [
          'Salinity and temperature: where each species can physically survive.',
          'Scenario land-use maps: acres of new wetland and wet-soil farming, for the food web and habitat metrics.',
          'Water age was considered for the food web, but open-water food is hard to measure directly, so the final proxy uses the wetland types each future adds.',
        ],
      },
      {
        title: 'Let the public choose the species',
        when: 'June 2025 public workshop',
        body: 'Participants marked the species they most wanted to follow. Chinook salmon led, as a cultural resource and an endangered species; others named longfin smelt, bass, and the invasive “ecosystem engineers” Brazilian waterweed and overbite clam.',
        points: [
          'Selection also required sensitivity to salinity or temperature, so the models could say something useful.',
          'The final six span a wide range of tolerances, from strictly fresh (waterweed, largemouth bass) to brackish and marine (overbite clam, adult longfin smelt).',
          'Life stages are split where needs differ: juvenile and adult longfin smelt and striped bass, juvenile fall-run Chinook, juvenile overbite clam.',
        ],
      },
      {
        title: 'Set survival limits from the literature',
        body: 'Published physiological studies give the salinity and temperature range beyond which each species cannot survive. These limits define a species’ fundamental niche.',
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
        title: 'Put every metric on one scale',
        body: 'Scores run from 0 to 10 with baseline fixed at 5. The scenario with the largest gain is anchored at 10, and the others fall in equal steps between, rounded to the nearest whole score.',
      },
    ],
  },
  components: {
    items: [
      {
        name: 'Species suitability',
        summary:
          'Where and how often conditions stay survivable for Chinook salmon, longfin smelt, striped bass, largemouth bass, overbite clam, and Brazilian waterweed.',
        spec: [
          {
            label: 'Measures',
            value:
              'Share of modeled days inside each species’ salinity and temperature limits, and the average run of consecutive suitable days',
          },
          { label: 'Unit', value: 'Proportion of days; days' },
          { label: 'Where', value: '145 points in eight subregions, North Delta to South Bay' },
        ],
        method: [
          'Score each point on each day 1 (suitable) or 0, requiring both salinity and temperature to be inside the species’ limits.',
          'Divide suitable days by days in the run to get each point’s proportion of suitable days.',
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
        name: 'Food webs',
        summary:
          'How much food each future adds to open water, where the plankton that feed fish have been declining.',
        spec: [
          {
            label: 'Measures',
            value: 'A proxy for open-water food production from added wetland and wet-soil farming',
          },
          { label: 'Unit', value: 'Weighted acres' },
          { label: 'Where', value: 'Scenario land-use footprints in the Delta and Suisun Marsh' },
        ],
        method: [
          'Subtract what already exists: about 5,100 acres of managed wetland (Delta Stewardship Council) and 17,178 acres of rice (2022).',
          'Weight each habitat by its relative contribution to nearby waterways (table below).',
          'Proxy = (managed wetland − 5,100) × 0.2 + new tidal wetland × 0.4 + (wet-soil farming − 17,178) × 0.1. A term with no added acres counts as zero, not negative.',
          'Score on the 0–10 scale: baseline and futures without new wetland at 5, the largest proxy at 10.',
        ],
        tables: [
          {
            caption: 'Habitat weights in the food-web proxy',
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
        name: 'Landscape',
        summary: 'How many acres of new tidal wetland fish and other aquatic species can reach.',
        spec: [
          { label: 'Measures', value: 'New tidal wetland area, compared with baseline' },
          { label: 'Unit', value: 'Acres' },
          {
            label: 'Where',
            value:
              'Restoration footprints, including the Cache–Lindsey Slough Complex in New Green Watershed',
          },
        ],
        method: [
          'Sum new tidal wetland acres in each future.',
          'Leave out managed wetland and wet-soil farming, which are drained for part of the year.',
          'Score on the 0–10 scale: baseline at 5, the largest gain at 10, equal acre steps between.',
        ],
        caveats: [
          'Managed wetlands and rice can still serve floodplain spawners, birds, mammals, and invertebrates; this metric deliberately counts only year-round aquatic access.',
          'New Green Watershed’s Cache–Lindsey Slough restoration does not change salinity; it is there for the aquatic community.',
        ],
      },
      {
        name: 'Conceptual Model',
        summary:
          'How each future shifts food webs, habitat access, and the wider relationships across the Delta ecosystem.',
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
          'Mark which of those parts each future could move.',
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
    what: 'Environmental justice looks at whether the burdens of each future fall unfairly on Delta communities, paying attention to how vulnerable each community is to climate hazards.',
    why: '82.6% of the project’s interviewees said Delta decision-making is not equitable or fair. Every in-Delta community is vulnerable to some degree, so knowing where harm lands helps decision-makers avoid it.',
  },
  what: [
    'Environmental justice is the fair treatment and meaningful involvement of all people, regardless of race, culture, national origin, or income, in environmental laws, regulations, and policies. This criterion applies it through the lens of vulnerable communities.',
    'Vulnerability combines exposure to climate hazards, sensitivity to them, and the capacity to recover and adapt. The Delta Stewardship Council rates every Delta community Moderate, High, or Highest across 14 indicators, from poverty and linguistic isolation to asthma and food insecurity. The lowest rating anywhere in the Delta is Moderate: every in-Delta community is vulnerable to some degree.',
  ],
  why: {
    paragraphs: [
      'Only 8.7% of interviewees said Delta decision-making is equitable and fair. They pointed to power imbalances, the influence of money, and infringement of water rights.',
      'Tribes, the Delta’s original stewards, were forcibly removed from its land and water and barred from legal claim to them; Tribal and Indigenous communities are inherently environmental justice communities. The criterion looks for undue burdens, harms that fall disproportionately by place, race and ethnicity, or income, so they can be avoided before they happen.',
    ],
    stat: {
      value: '82.6%',
      label: 'of interviewees think Delta decision-making is not equitable and fair',
    },
    quote:
      'The decision-makers are coming from different agencies with different missions, different agendas, different levels of resources. So is it equitable? No.',
  },
  construction: {
    intro:
      'Literature can’t stand in for hearing from the people a criterion is meant to serve, so this one was built with environmental justice community members and advocates, then narrowed to what the models can measure.',
    facts: [
      { value: '49', label: 'interviews, ~20% with EJ and Tribal community members' },
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
          'Measured by other teams: recreation and ecology (Recreation, Ecology), agriculture (Economy), Indigenous sovereignty (its own criterion).',
          'Outside the project’s scope: pollutants, water rights, and water affordability, for which accessible data is lacking.',
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
    intro: 'Scores run from −5 to +5 relative to baseline.',
    items: [
      {
        name: 'Salinity impacts to in-Delta drinking water',
        summary:
          'Whether salinity changes affect in-Delta drinking-water systems’ ability to meet safe standards, with attention to the vulnerability of the communities they serve.',
        spec: [
          {
            label: 'Measures',
            value: 'Share of daily salinity values above the drinking-water threshold',
          },
          { label: 'Unit', value: 'Electrical conductivity (µS/cm); percent of measurements' },
          {
            label: 'Where',
            value:
              '49 in-Delta drinking-water system locations (46 for the outflow runs), each moved into the nearest channel',
          },
          {
            label: 'Reported for',
            value: 'Whole run, wet season, dry season, and each vulnerability class',
          },
        ],
        method: [
          'Locate in-Delta public water systems from the State Water Board’s SAFER program, including treated municipal systems, wells, and untreated surface-water systems.',
          'Move each inland location into the closest channel so the hydrodynamic model reports salinity there.',
          'Give each point the vulnerability class of the community it serves, from the Delta Stewardship Council’s Vulnerability Index.',
          'Count daily means above 1,050 µS/cm and divide by the number of measurements.',
          'Score against baseline: adaptation scenarios in 1% steps of exceedance against Business as Usual; outflow runs in 5% steps against the historic baseline, because flow moves salinity far more.',
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
          'The two sets of runs use slightly different points and step sizes, so their scores are not directly comparable.',
        ],
      },
      {
        name: 'Flood risk attenuation',
        summary: 'How likely inundation is across the Delta.',
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
          'Review the flood-reduction measures built into each scenario.',
          'Judge the direction and size of the change in in-Delta flood risk against Business as Usual.',
          'Translate that judgement onto the −5 to +5 scale.',
        ],
        caveats: [
          'Not assessed for the outflow runs, which share one landscape and change only the amount of outflow.',
          'Reservoir forecast-informed operations are not captured by the models.',
        ],
      },
      {
        name: 'Water age + temperature',
        summary: 'Conditions that favor harmful algal blooms in five bloom-prone regions.',
        spec: [
          {
            label: 'Measures',
            value: 'Change in water age from baseline while water is at or above 19°C',
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
          'Keep only days when water is at or above 19°C, the temperature at which blooms begin to grow.',
          'Compare water age with Business as Usual in each region using heatmap output.',
          'Place each scenario on an 11-step scale from extreme decrease to extreme increase in water age.',
        ],
        caveats: [
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
    what: 'Ecocultural restoration and Indigenous sovereignty asks whether each future helps restore ecosystems and Indigenous cultures together, and supports Tribes’ right to govern their lands, waters, and ways of life.',
    why: 'The Delta was home to many Tribes long before colonization, and their ties to its land, water, and life run deep. A just transition in the Delta cannot happen without Indigenous leadership and inclusion.',
  },
  what: [
    'Leaving no one behind means accounting for past wrongs, including the exclusion of Tribal and Indigenous communities from Delta decisions. That makes ecocultural restoration and Indigenous sovereignty pillars of a just transition.',
    'Ecocultural restoration restores ecosystems and Indigenous cultures at the same time, as connected and reciprocal processes, with Indigenous people taking part in planning, design, and stewardship in a collaborative, self-determined way. Indigenous sovereignty is a nation’s inherent power to govern itself and live its own way of life free from interference.',
  ],
  why: {
    paragraphs: [
      'Before colonization, the Delta was home to many Tribes, including the Bay Miwok, Coast Miwok, Plains Miwok, Maidu, Nisenan, Ohlone, Patwin, Pomo, Wappo, Wintun, and Yokuts. Their connections to the land, the water, and the life it supports remain deep.',
      'As independent rightsholders, Indigenous communities’ values belong in Delta decisions. The Delta’s species, and the flow of water itself, are bound up with Indigenous worldviews.',
    ],
  },
  construction: {
    intro:
      'The team set out to hear from people usually left out of Delta decision-making, and shaped the criterion with them over two years of interviews, Tribal workshops, and surveys.',
    facts: [
      { value: '3', label: 'Tribal workshops, Nov 2024 to Dec 2025' },
      { value: '4', label: 'interdependent metrics' },
      { value: '9', label: 'upland restoration scenarios' },
      { value: '1', label: 'metric counted in acres; three described' },
    ],
    steps: [
      {
        title: 'Reach people usually left out',
        body: 'The team reviewed attendees and public comments from past Delta processes, including the 2019 WaterFix hearing and the 2023 Temporary Urgency Change Petitions, and held meetings with Indigenous communities to build trust.',
      },
      {
        title: 'Bring TEK in from the start',
        body: 'Indigenous community members were specifically invited to semi-structured interviews so Traditional Ecological Knowledge (TEK) informed the research from the beginning. Findings shaped the preliminary scenario narratives.',
      },
      {
        title: 'Draw the connections',
        when: 'Tribal Workshop 1 · November 2024',
        body: 'Interview results, literature, and conversations with Indigenous Advisory Committee members became a diagram of how ecocultural restoration and sovereignty reinforce each other. Workshop participants reviewed it, and it was distilled into four metrics.',
      },
      {
        title: 'Test it with Tribes and the public',
        when: 'Public and Tribal workshops · June 2025',
        body: 'Participants said the four metrics matter equally and depend on one another, and asked for additions that were then incorporated.',
        points: [
          'Food sovereignty, data sovereignty, and youth education on the legacies of colonialism, under sovereignty.',
          'Privacy while practicing TEK, through Tribal site selection or buffer zones, under TEK.',
        ],
      },
      {
        title: 'Ask which landscapes matter',
        when: 'COEQWAL Tribal workshop survey · December 2025',
        body: 'Respondents described current land access, desired landscapes, and governance. These priorities set the habitat types restored in Eco Machine and New Green Watershed.',
        points: [
          'Tidal wetlands: clean water, biodiversity, and grasses for basket-weaving.',
          'Upper watershed forests, meadows, and floodplains: hunting, food and medicine gathering, and reducing fire risk.',
        ],
      },
      {
        title: 'Build the restoration scenarios',
        body: 'Upper-watershed restoration is a 3 × 3 matrix: minimal, medium, or maximal effort, each prioritizing forests, meadows, or floodplains. It is combined with in-Delta tidal wetland restoration.',
      },
    ],
  },
  components: {
    intro:
      'Only restoration can be counted across scenarios. The other three describe how access, knowledge, and sovereignty can be advanced in any future, so the overall comparison is qualitative and its assumptions are stated.',
    items: [
      {
        name: 'Habitat restoration',
        summary:
          'Recovering and protecting the Delta’s native, culturally significant species and ecosystems through habitat creation, restoration, invasive-species control, and environmental flows.',
        spec: [
          { label: 'Measures', value: 'Change in restored acres in each scenario' },
          { label: 'Unit', value: 'Acres, by habitat type' },
          { label: 'Where', value: 'In-Delta plus the upper Bay–Delta watershed' },
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
            columns: ['Habitat', 'Area', 'Basis'],
            rows: [
              [
                'Upland forest',
                '11.7M acres; 2.4M in the Southern Sierra',
                'CAL FIRE vegetation layer; Sierra Nevada Conservancy subregions',
              ],
              [
                'Montane meadow',
                '193,100 acres; ~60% (115,860) restorable',
                'UC Davis meadow compilation; Emmons et al. 2013 and expert input',
              ],
              [
                'Floodplain and riparian',
                '780,000 acres; 60,600 opportunity, 303,000 need',
                'CAL FIRE vegetation layer; CVFPP conservation strategy',
              ],
            ],
          },
        ],
      },
      {
        name: 'Tribal land access',
        summary:
          'Returning land to Tribes or co-managing it with them for stewardship, subsistence, ceremony, and cultural practice.',
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
        name: 'Indigenous science & Traditional Ecological Knowledge (TEK)',
        summary:
          'Bringing Traditional Ecological Knowledge into management and land-use decisions in partnership with Tribal representatives and practitioners.',
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
        name: 'Tribal sovereignty',
        summary:
          'Advancing Indigenous peoples’ inherent right to govern themselves, their lands, and resources, and to maintain their cultures and ways of life.',
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
    what: 'Recreation looks at how each future changes the water conditions behind five Delta pastimes: angling, boating, birding, waterfowl hunting, and day use at state parks.',
    why: 'Recreation brings millions of visitor days to the Delta and supports thousands of jobs, but drought and swings between wet and dry years have already cost the region marinas, restaurants, and visitors.',
  },
  what: [
    'Water-dependent recreation is any activity that relies on the Delta’s water. Some depend on the water directly, such as boating, angling, and birding. Others depend on the species and habitats the water supports, such as waterfowl hunting and day use: picnicking, camping, and historical and cultural visits.',
    'When water warms or salinity creeps inland, fish, birds, and waterfowl respond first, and the people who fish, hunt, or watch them respond in turn. Recreation becomes a public-facing signal of habitat health.',
  ],
  why: {
    paragraphs: [
      'Delta recreation and tourism have averaged about 12 million visitor days a year. Over the 2010s the jobs they support fell from about 3,000 to 2,300, a drop that tracks prolonged drought and extreme swings between dry and wet years.',
      'Low flows bring warmer, saltier water and more pollutants. Above 19°C, harmful algal blooms can spread and close waterways, as they did near Delta Meadows and the Cosumnes in 2016. Shifting conditions also push people to visit at different times of year.',
    ],
    stat: { value: '26%', label: 'fewer Delta recreation and tourism jobs over the 2010s' },
  },
  construction: {
    intro:
      'The team picked the Delta’s main pastimes, gathered visitor records for each, and tested each against the temperature and salinity limits that matter to it, across the year and in its own peak season.',
    facts: [
      { value: '5', label: 'activities' },
      { value: '16', label: 'public boat launches' },
      { value: '8', label: 'public hunting units' },
      { value: '4', label: 'recreation regions' },
    ],
    steps: [
      {
        title: 'Choose the activities',
        body: 'Decades of surveys and literature point to five main pastimes: angling, birding, boating, day use at state parks, and waterfowl hunting. Visitors come from the Bay Area–Sacramento corridor and as far as Merced, Monterey, and Mendocino.',
        points: [
          'Direct: boating, angling, and birding depend on the water itself.',
          'Indirect: waterfowl hunting and day use depend on water-dependent species and habitat.',
        ],
      },
      {
        title: 'Gather visitor records',
        body: 'Each activity has its own dataset, mostly covering 2018 to 2022.',
        points: [
          'Angling: Central Valley Angler Survey (CDFW), Delta locations; Chinook salmon and striped bass recur most.',
          'Boating: cell and vehicle counts at 16 public motorized boat launches (StreetLight Data).',
          'Birding: eBird observations at publicly accessible protected areas, from Antioch Dunes to the Yolo Bypass.',
          'Day use: monthly State Parks counts at Brannan Island and Delta Meadows; Franks Tract left out to avoid double-counting boaters.',
          'Waterfowl hunting: CDFW harvest records at eight public wetland units, including Yolo, Grizzly Island, and Twitchell.',
        ],
      },
      {
        title: 'Set limits from the literature',
        body: 'Each activity gets the temperature and salinity limits tied to known shifts in participation or in the species it depends on. Habitat and restoration rank first in the team’s hierarchy, then temperature, then salinity.',
      },
      {
        title: 'Prepare the model output',
        body: 'Conductivity is converted to µS/cm, and the model’s 15-minute values are averaged to one value per day. A brief spike above a limit does not count unless the daily average crosses it, a deliberately conservative choice.',
      },
      {
        title: 'Divide the Delta into recreation regions',
        body: 'Suisun Marsh, Central, North, and South Delta follow tidal flow and conductivity regions from earlier studies and the highways people use to reach recreation sites.',
      },
    ],
  },
  components: {
    items: [
      {
        name: '% of days under Salinity Stress',
        summary:
          'How often salinity crosses the limit that matters to each activity, over the year and in its peak season.',
        spec: [
          {
            label: 'Measures',
            value: 'Share of days whose average salinity is over an activity’s threshold',
          },
          { label: 'Unit', value: 'Percent of days' },
          { label: 'Where', value: 'Whole Delta and the four recreation regions' },
        ],
        method: [
          'Flag each day whose average salinity is over the activity’s threshold (table below).',
          'Divide flagged days by all days in the scenario-year, then again by in-season days only (seasons table).',
          'Score each activity on its own: −1 per percentage point more days over the threshold than Business as Usual, +1 per point fewer, ±5 at most.',
        ],
        tables: [
          {
            caption: 'Salinity thresholds by activity',
            columns: ['Activity', 'Threshold', 'Why it matters'],
            rows: [
              ['Day use and boating', 'Above 1,000 µS/cm', 'Landscape quality for recreation'],
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
              ['Day use and boating', 'May to September'],
              [
                'Waterfowl hunting',
                'Hunting October–February; brooding April–July (model data only)',
              ],
            ],
          },
        ],
        caveats: [
          'The outflow runs cover October 2020 to January 2022, one full year including critically dry 2021.',
          'Some season windows start before or end after the model runs and are shortened accordingly.',
        ],
      },
      {
        name: '% of days under Temperature Stress',
        summary:
          'How often water temperature crosses the limit that matters to each activity, over the year and in its peak season.',
        spec: [
          {
            label: 'Measures',
            value: 'Share of days whose average water temperature is over an activity’s threshold',
          },
          { label: 'Unit', value: 'Percent of days' },
          { label: 'Where', value: 'Whole Delta and the four recreation regions' },
        ],
        method: [
          'Flag each day whose average water temperature crosses the activity’s threshold (table below).',
          'Divide flagged days by all days in the scenario-year, then again by in-season days only.',
          'Score each activity on its own, with the same ±1 per percentage point rule as salinity.',
        ],
        tables: [
          {
            caption: 'Temperature thresholds by activity',
            columns: ['Activity', 'Threshold', 'Why it matters'],
            rows: [
              [
                'Day use and boating',
                '19°C held for about 14 days',
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
        caveats: ['No temperature output exists for A Tunnel, so it has no temperature scores.'],
      },
      {
        name: 'Habitat Restoration',
        summary:
          'Wetland acreage opened to recreation by restoration, ranked first because most Delta islands sit 10 to 30 feet below sea level.',
        spec: [
          {
            label: 'Measures',
            value: 'Restored acres open to recreation, beyond current inventories',
          },
          { label: 'Unit', value: 'Acres' },
          {
            label: 'Where',
            value:
              'New Green Watershed at full restoration, 50/50, and 25/75 wetland and rice; Eco Machine',
          },
        ],
        method: [
          'Sum the restored acres in each scenario that would be open to recreation.',
          'Report New Green Watershed at each restoration level, with 50/50 as the primary case.',
          'Weigh the result alongside the salinity and temperature metrics, with restoration ranked first.',
        ],
      },
      {
        name: 'Recreation economy',
        summary:
          'What restored wetlands could be worth to recreation: fishing, hunting, and amenity and recreation.',
        spec: [
          { label: 'Measures', value: 'Annual value of wetland recreation services' },
          { label: 'Unit', value: 'Dollars per year' },
          { label: 'Where', value: 'New Green Watershed restoration footprints' },
        ],
        method: [
          'Value restored wetland acres with per-acre estimates for wetland services (about $1,325 per acre per year across all ten).',
          'Report the recreation services on their own: recreational fishing, recreational hunting, and amenity and recreation.',
        ],
        caveats: [
          'Visitor spending gives context: about $38.56 per person per day for boating, fishing, and camping, and $82.44 for hunting (2020 dollars).',
        ],
      },
    ],
  },
}

const economy: CriterionStory = {
  source:
    'The Story Behind the Criterion: Economy, v16. Y. Cai and J. Medellín-Azuara, UC Merced, 25 October 2026.',
  brief: {
    what: 'Economy asks what happens to the Delta’s farm economy when its water gets saltier or farmland is converted to something else.',
    why: 'Nearly 500,000 acres of irrigated farmland, and the packing houses, equipment dealers, and trucking tied to them, make up a working economy. Every future touches it, and the effects show up in paychecks and farm budgets.',
  },
  what: [
    'This criterion follows Delta agriculture three ways: how much money farms bring in from what they grow, how many jobs depend on that activity and the businesses tied to it, and how much it adds to the regional economy once wages and business income are counted.',
  ],
  why: {
    paragraphs: [
      'The Delta supports close to 500,000 acres of irrigated farmland, plus packing houses, equipment dealers, trucking, and tourism on the water. Some futures reach it through salt water on farm fields; others convert farmland to wetland outright.',
      'Measuring the size of those effects, and where they land, is a basic way to compare the futures, and one of the few counted directly in dollars and jobs.',
    ],
  },
  construction: {
    intro:
      'The six futures change the Delta economy in two different ways, through saltier water or through converted land, so the team built two modeling chains and reports both through the same regional economic model.',
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
    intro:
      'Changes in applied water and land use are tracked in the narrative rather than scored, since they drive the three scored metrics.',
    items: [
      {
        name: 'Annual gross agricultural revenues',
        summary: 'Change in total dollar sales from Delta farms.',
        spec: [
          {
            label: 'Measures',
            value: 'Change in gross farm revenue relative to Business as Usual',
          },
          { label: 'Unit', value: 'Annualized 2024 US dollars' },
          {
            label: 'Where',
            value: 'Delta-wide and four zones; New Green Watershed island by island',
          },
        ],
        method: [
          'Salinity pathway: turn each field’s April–September salinity into crop-yield loss and apply it to OpenAg baseline revenue.',
          'Land-use pathway: remove revenue on converted acres and add revenue from new rice, at each restoration level.',
          'Report direct on-farm revenue; total effects follow in the IMPLAN metrics.',
        ],
        caveats: [
          'Carbon-offset revenue is an upper-end possibility: its rates come from four deeply subsided central-Delta islands and assume peat soils across the whole footprint.',
          'Seasonal salinity averages hide short peaks, which could matter more for salt-sensitive crops such as stone fruit, almonds, and strawberries.',
        ],
      },
      {
        name: 'Agriculture-supported Jobs',
        summary:
          'Change in full- and part-time jobs tied to farm activity, directly and through supporting businesses.',
        spec: [
          { label: 'Measures', value: 'Full- and part-time jobs in a sector in one year' },
          { label: 'Unit', value: 'Jobs' },
          { label: 'Where', value: 'Delta-wide and four zones' },
        ],
        method: [
          'Salinity pathway: convert each revenue change to jobs with IMPLAN ratios by region.',
          'Land-use pathway: run New Green Watershed’s adjusted regional base case through IMPLAN directly.',
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
        caveats: ['New Green Watershed’s land-use results are first-order and preliminary.'],
      },
      {
        name: 'Economic value added',
        summary:
          'Change in wages, business income, and taxes once revenue works through the regional economy, close to regional GDP.',
        spec: [
          { label: 'Measures', value: 'Gross revenue minus non-labor business expenses' },
          { label: 'Unit', value: 'Annualized 2024 US dollars' },
          { label: 'Where', value: 'Delta-wide and four zones' },
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
