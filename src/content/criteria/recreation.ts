// The recreation criterion: everything the site says about it, in the shape of ./types.
import { TEAM_NAMES } from '../names'
import { publishedScoresSource } from './publishedScores'
import type { Criterion } from './types'

const recreationNoCriterionScore = {
  score: null,
  summary:
    'Recreation publishes a Delta-wide salinity score for each activity rather than one criterion score.',
}
const recreationRule =
  'One point per percentage point of days over the activity’s salinity threshold, against Business as Usual.'

/** Delta-wide, whole-run salinity scores: day use & boating, birding, waterfowl hunting, angling. */
function recreationMetrics(
  [dayUse, birding, hunting, angling]: [number, number, number, number],
  temperature: { finding: string; score: number | null },
) {
  const activity = (name: string, threshold: string, score: number) => ({
    name,
    finding:
      score === 0
        ? `No change in days over ${threshold}.`
        : `About ${-score} percentage point${score === -1 ? '' : 's'} more days over ${threshold}.`,
    score,
  })
  return [
    activity('Day use & boating', '1,000 µS/cm', dayUse),
    activity('Birding', '2,640 µS/cm', birding),
    activity('Waterfowl hunting', '3,600 µS/cm', hunting),
    activity('Angling', '9,130 µS/cm', angling),
    { name: 'Water temperature', ...temperature },
  ]
}
const recreationTemperatureUnchanged = {
  finding: 'No change in days over any activity’s temperature threshold.',
  score: 0,
}
const recreationNoTemperatureRun = {
  finding: 'No temperature run for this scenario.',
  score: null,
}

export const recreation: Criterion = {
  id: 'recreation',
  number: TEAM_NAMES.recreation.number,
  label: TEAM_NAMES.recreation.name,
  summary:
    'Examines how each future scenario changes conditions for angling, boating, birding, waterfowl hunting, and day use at state parks.',
  entityGroups: [
    {
      label: 'People',
      items: ['Anglers', 'Birders', 'Boaters', 'Day-use visitors', 'Waterfowl hunters'],
    },
    {
      label: 'Places',
      items: ['Public parks and wildlife refuges', 'Wetland recreation areas'],
    },
  ],
  metrics: [
    {
      name: 'Salinity stress',
      definition:
        'Evaluates how often salinity crosses a threshold at which an activity is no longer accessible or safe.',
      measurement: 'Share of days whose average salinity is over an activity’s threshold.',
    },
    {
      name: 'Water temperature stress',
      definition:
        'Evaluates how often water temperature crosses a threshold that limits participation in an activity.',
      measurement: 'Share of days whose average water temperature is over an activity’s threshold.',
    },
    {
      name: 'Habitat restoration',
      definition: 'Evaluates restored habitat that improves recreation opportunities.',
      measurement: 'Amount of additional restored areas and landscapes.',
    },
    {
      name: 'Recreation economy',
      definition:
        'Evaluates the monetary value of restored wetlands for fishing, hunting, and amenity and recreation.',
      measurement: 'Annual value of wetland recreation services.',
    },
  ],
  story: {
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
              caption: 'Salinity thresholds and seasons by activity',
              columns: ['Activity', 'Threshold', 'Season', 'Why it matters'],
              rows: [
                ['Day use', 'Above 1,000 µS/cm', 'May–September', ''],
                ['Boating', 'Above 1,000 µS/cm', 'May–September', ''],
                [
                  'Birding',
                  'Above 2,640 µS/cm',
                  'Spring migration April–June; fall migration August–October; winter October–April',
                  'Avian botulism risk in wetlands',
                ],
                [
                  'Waterfowl hunting',
                  'Above 3,600 µS/cm, with graded effects to 19,200',
                  'Hunting October–February; brooding April–July (model data only)',
                  'Duckling growth, feathering, and survival',
                ],
                [
                  'Angling',
                  '9,130 µS/cm; 17,000 upper shared range; 19,000 water-quality objective',
                  'May–September',
                  'Habitat shared by white sturgeon and striped bass',
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
              value:
                'Share of days whose average water temperature is over an activity’s threshold',
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
  },
  regions: {
    mapTeam: 'recreation',
    intro:
      'This criterion splits the Delta into four regions that follow tidal flow and conductivity zones, and the highways people take to reach recreation sites (Andrews et al., 2017; Delta Stewardship Council, 2013).',
    regions: [
      { name: 'North Delta', note: '6 points' },
      { name: 'Central Delta', note: '9 points' },
      { name: 'South Delta', note: '9 points' },
      { name: 'Suisun Marsh', note: '8 points' },
    ],
  },
  references: [
    'Andrews, S. W., Gross, E. S., & Hutton, P. H. (2017). Modeling salt intrusion in the San Francisco Estuary prior to anthropogenic influence. Continental Shelf Research, 146, 58-81. https://doi.org/10.1016/j.csr.2017.07.010',
    'Delta Protection Commission. (2012). Economic sustainability plan for the Sacramento-San Joaquin Delta.',
    'Delta Protection Commission. (2021). Economic sustainability plan for the Sacramento-San Joaquin Delta: Recreation and tourism chapter (2020 update).',
    'Delta Stewardship Council. (2013). The Delta Plan: Chapter 5 – Protect and Enhance the Unique Cultural, Recreational, Natural Resource, and Agricutltural Values of the California Delta as an Evolving Place. https://cawaterlibrary.net/document/the-delta-plan/',
    'Ding, Y., Hayes, M. J., & Widhalm, M. (2011). Measuring economic impacts of drought: a review and discussion. Disaster Prevention and Management: An International Journal, 20(4): 434-446.',
    'Durand, J. R., Bombardelli, F., Fleenor, W. E., Henneberry, Y., Herman, J., Jeffres, C., Leinfelder-Miles, M., Lund, J.R., Lusardi, R., Manfree, A.D., Medellin-Azuara, J., Milligan, B., & Moyle, P. B. (2020). Drought and the Sacramento-San Joaquin Delta, 2012–2016: environmental review and lessons. San Francisco Estuary and Watershed Science, 18(2). https://doi.org/10.15447/sfews.2020v18iss2art2',
    'Fink, D., Auer, T., Johnston, A., Strimas-Mackey, M., Ligocki, S., Robinson, O., Hochachka, W., Jaromczyk, L., Crowley, C., Dunham, K., Stillman, A., Davis, C., Stokowski, M., Sharma, P., Pantoja, V., Burgin, D., Crowe, P., Bell, M., Ray, S., Davies, I., Ruiz-Gutierrez, V., Wood, C., & Rodewald, A. (2024). eBird Status and Trends, Data Version: 2023; Released: 2025. Cornell Lab of Ornithology, Ithaca, New York. https://doi.org/10.2173/WZTW8903 (accessed 16 Sep 2025).',
    'GreenInfo Network. (2025). California Protected Areas. https://greeninfo.org/',
    'GreenInfo Network. (2026). California Protected Areas Database (CPAD), version 2024 [GIS shapefile]. https://www.calands.org',
    'Hanak, Ellen, Jay Lund, Ariel Dinar, Brian Gray, Richard Howitt, Jeffrey Mount, Peter Moyle, Barton “Buzz” Thomson (2011). Managing California’s Water From Conflict to Reconciliation. https://watermanagement.ucdavis.edu/application/files/7514/5886/6517/Hanak_et_al_2011_Managing_Californias_Water_from_Conflict_to_Reconciliation.pdf',
    'Jenkins, J. S., Abatzoglou, J. T., Wilkins, E. J., & Perry, E. E. (2023). Visitation to national parks in California shows annual and seasonal change during extreme drought and wet years. PLoS Climate, 2(8), e0000260. https://doi.org/10.1371/journal.pclm.0000260',
    'Mosley, L. M. (2015). Drought impacts on the water quality of freshwater systems; review and integration. Earth-Science Reviews, 140, 203-214. https://doi.org/10.1016/j.earscirev.2014.11.010',
    'Rudnick, J., Heikkila, T., Koebele, E., Morrison, T., & Batavia, C. (2025). Assessing the State and Efficacy of Climate Governance Research and Practice in the Sacramento–San Joaquin Delta. San Francisco Estuary and Watershed Science, 23(1). https://doi.org/10.15447/sfews.2025v23iss1art2',
    'State Water Resources Control Board. (2025). Water Quality Control Plan for the San Francisco Bay/Sacramento-San Joaquin Delta Watershed. December 2025 Draft. https://www.waterboards.ca.gov/waterrights/water_issues/programs/bay_delta/docs/2025/h/dec2025-rev-draft-sacdelta-bdplan.pdf',
    'StreetLight Data, Inc. (2026). Destination Volume for select California Delta boat launch ramps: 2018 to 2022.',
    'Williams, L. (2026). Ecology Team: Wetland Restoration.',
    'Wlostowski, A. N., Jennings, K. S., Bash, R. E., Burkhardt, J., Wobus, C. W., & Aggett, G. (2022). Dry landscapes and parched economies: A review of how drought impacts nonagricultural socioeconomic sectors in the US Intermountain West. Wiley Interdisciplinary Reviews: Water, 9(1). https://doi.org/10.1002/wat2.1571',
  ],
  report: {
    status: 'final',
    source: `${publishedScoresSource} ${recreationRule}`,
    findings: {
      'eco-machine': {
        headline: 'Slightly saltier for anglers, birders, and hunters',
        metrics: recreationMetrics([0, -1, -1, -2], recreationTemperatureUnchanged),
        overall: recreationNoCriterionScore,
      },
      'new-green-watershed': {
        headline: 'Slightly saltier for anglers, birders, and hunters',
        metrics: recreationMetrics([0, -1, -1, -2], recreationTemperatureUnchanged),
        overall: recreationNoCriterionScore,
      },
      'bolster-and-fortify': {
        headline: 'No change in recreation conditions',
        metrics: recreationMetrics([0, 0, 0, 0], recreationTemperatureUnchanged),
        overall: recreationNoCriterionScore,
      },
      'calling-on-reserves': {
        headline: 'Saltier for every activity, most of all angling',
        metrics: recreationMetrics([-2, -2, -2, -4], recreationNoTemperatureRun),
        overall: recreationNoCriterionScore,
      },
      'a-tunnel': {
        headline: 'The largest salinity losses for every activity',
        metrics: recreationMetrics([-4, -4, -3, -5], recreationNoTemperatureRun),
        overall: recreationNoCriterionScore,
      },
    },
  },
}
