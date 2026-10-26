export const evaluationTeams = [
  {
    id: 'ecology',
    number: '01',
    label: 'Ecology',
    summary:
      'Evaluates species suitability, newly accessible aquatic habitat, food-web contributions, and ecosystem-wide interactions.',
    entityGroups: [
      {
        label: 'Species',
        items: [
          'Egeria densa',
          'Largemouth Bass',
          'Overbite Clam',
          'Striped Bass',
          'Chinook Salmon',
          'Longfin Smelt',
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
          'Uses salinity and temperature thresholds to estimate the functional abiotic niche of stakeholder-selected species and species groups.',
        measurement:
          'Proportion of suitable days by region and average length of consecutive suitable-day streaks at each modeled point.',
      },
      {
        name: 'Habitat and food webs',
        definition:
          'Evaluates newly accessible acres for aquatic biota and acreage expected to make positive food-web contributions.',
        measurement:
          'Newly accessible acres and a food-web proxy calculated from relative contributions of each landscape type multiplied by new acreage.',
      },
      {
        name: 'Ecosystem relationships',
        definition:
          'Describes food-web changes, habitat accessibility, and ecosystem-wide interactions for each scenario.',
        measurement:
          'Comparative conceptual models that synthesize information and make differences between scenarios visible.',
      },
    ],
  },
  {
    id: 'environmental-justice',
    number: '02',
    label: 'Environmental Justice & Vulnerable Communities',
    summary:
      'Examines where water-quality, flood, and harmful-algal-bloom burdens may fall on in-Delta communities with different levels of vulnerability.',
    entityGroups: [
      {
        label: 'People and communities',
        items: [
          'Moderate-vulnerability communities',
          'High-vulnerability communities',
          'Highest-vulnerability communities',
        ],
      },
      {
        label: 'Community systems',
        items: ['In-Delta drinking-water systems'],
      },
      {
        label: 'Places',
        items: [
          'Suisun Marsh and surrounding wetlands',
          'Franks Tract',
          'South Delta',
          'Lindsey-Cache Slough',
          'McCormack-Williamson Tract',
        ],
      },
    ],
    metrics: [
      {
        name: 'Drinking water',
        definition:
          'Assesses whether salinity changes affect drinking-water systems’ ability to meet standards, with attention to community vulnerability.',
        measurement:
          'Percentage of the model run exceeding the drinking-water salinity threshold of 1,050 microsiemens per centimeter.',
      },
      {
        name: 'Flood risk',
        definition: 'Identifies changes in inundation likelihood across the Delta.',
        measurement:
          'Qualitative assessment of in-Delta inundation risk given the green and gray infrastructure included in each scenario.',
      },
      {
        name: 'Harmful algal bloom conditions',
        definition: 'Uses water age as a proxy for conditions favorable to harmful algal blooms.',
        measurement: 'Change in water age when water temperature is above 19°C.',
      },
    ],
  },
  {
    id: 'ecocultural-restoration',
    number: '03',
    label: 'Ecocultural Restoration & Indigenous Sovereignty',
    summary:
      'Assesses whether scenarios support reciprocal ecosystem repair, cultural practices, Tribal governance, and Indigenous stewardship.',
    entityGroups: [
      {
        label: 'People and communities',
        items: ['Tribal communities and governments', 'Indigenous Science and TEK practitioners'],
      },
      {
        label: 'Species and ecosystems',
        items: ['Native species and ecosystems'],
      },
      {
        label: 'Places and relationships',
        items: [
          'Culturally significant landscapes',
          'Stewardship and subsistence places',
          'Ceremonial and cultural-practice sites',
          'Tribal lands, waters, and resources',
        ],
      },
    ],
    metrics: [
      {
        name: 'Native ecosystem restoration',
        definition:
          'Evaluates recovery, protection, and enhancement of species and ecosystems that are Native to the Delta and culturally significant.',
        measurement: 'Change in the number of restored acres in each scenario.',
      },
      {
        name: 'Cultural landscape access',
        definition:
          'Considers returning land to Tribes or co-managing land with Tribes and Tribal governments for stewardship, subsistence, ceremony, and cultural practices.',
        measurement:
          'Types of agreements that can facilitate increased access to land for Tribal communities.',
      },
      {
        name: 'Indigenous Science and TEK',
        definition:
          'Considers how TEK can inform management, stewardship, and land-use decisions in partnership with Tribal representatives and practitioners.',
        measurement: 'Avenues through which TEK applications can be facilitated.',
      },
      {
        name: 'Tribal sovereignty and rights',
        definition:
          'Evaluates recognition of Indigenous peoples’ authority to govern themselves, their lands, and resources and maintain Traditional ways of life.',
        measurement:
          'Instances and mechanisms that recognize and apply Indigenous sovereignty, Tribal governance, and rights.',
      },
    ],
  },
  {
    id: 'recreation',
    number: '04',
    label: 'Recreation',
    summary:
      'Evaluates how salinity, temperature, access, restoration, and seasonal conditions affect water-dependent recreation and visitation.',
    entityGroups: [
      {
        label: 'People',
        items: [
          'Anglers',
          'Marina boaters',
          'Birdwatchers',
          'Waterfowl hunters',
          'State-park and day-use visitors',
        ],
      },
      {
        label: 'Places',
        items: ['Public parks and wildlife refuges', 'Wetland recreation areas'],
      },
    ],
    metrics: [
      {
        name: 'Recreation access and use',
        definition:
          'Establishes baseline water-dependent recreation opportunities at publicly accessible parks and refuges.',
        measurement:
          'Direct use includes angling, boat launches, and birding; indirect use includes waterfowl hunting and day use.',
      },
      {
        name: 'Seasonal recreation',
        definition:
          'Evaluates the timing and volume of recreation relative to yearly salinity and temperature.',
        measurement:
          'Quantitative and narrative comparison of activity peaks with temperature, salinity, and flow peaks.',
      },
      {
        name: 'Restored recreation acreage',
        definition: 'Evaluates accessible acreage gained through wetland restoration.',
        measurement:
          'Quantitative and narrative estimate of added acreage beyond current inventories.',
      },
      {
        name: 'Visitor economy',
        definition: 'Evaluates visitor spending and decadal shifts by activity.',
        measurement:
          'Narrative assessment grounded in macroeconomic theory and input-output visitor-spending models.',
      },
    ],
  },
  {
    id: 'economy',
    number: '05',
    label: 'Economy',
    summary:
      'Evaluates how salinity changes and land conversion affect Delta agricultural production and connected regional economic activity.',
    entityGroups: [
      {
        label: 'People and livelihoods',
        items: ['Farm workers'],
      },
      {
        label: 'Economic sectors',
        items: [
          'Delta farms and crops',
          'Packing houses',
          'Equipment dealers',
          'Trucking and farm-linked businesses',
        ],
      },
      {
        label: 'Places',
        items: ['North, Central, South, and West Delta zones', 'Suisun Marsh land uses'],
      },
    ],
    metrics: [
      {
        name: 'Farm revenue',
        definition:
          'Estimates changes in gross sales by sector, including the farm-gate value of crops.',
        measurement: 'Annualized 2024 US dollars.',
      },
      {
        name: 'Employment',
        definition: 'Estimates annual changes in employment by sector.',
        measurement: 'Full- and part-time jobs for a sector in one year.',
      },
      {
        name: 'Regional value added',
        definition:
          'Measures an amount close to gross domestic product: gross revenues minus non-labor business expenses.',
        measurement: 'Annualized 2024 US dollars.',
      },
    ],
  },
] as const

export const resultFamilies = [
  {
    id: 'overview',
    label: 'Overview',
    href: '/scenarios/results',
  },
  {
    id: 'outflow',
    label: 'Outflow Variations',
    href: '/scenarios/tiered-outflows/results',
  },
  {
    id: 'adaptation',
    label: 'Adaptation Scenarios',
    href: '/scenarios/eco-machine/results',
  },
  {
    id: 'adaptation-slr',
    label: 'Adaptation Scenarios with Sea-Level Rise',
    href: '/scenarios/eco-machine/results?seaLevelRise=true',
  },
] as const

export const outflowResultVariations = [
  {
    id: 'decrease',
    number: '01',
    label: '10% decrease in Delta outflow',
    title: '10% decrease in Delta outflow',
    summary:
      'Review how a more constrained freshwater outflow changes modeled salinity relative to baseline operations.',
    explorerKey: 'run17',
  },
  {
    id: 'increase',
    number: '02',
    label: '30% increase in Delta outflow',
    title: '30% increase in Delta outflow',
    summary:
      'Review how stronger freshwater outflow changes modeled salinity relative to baseline operations.',
    explorerKey: 'run16',
  },
] as const

export const resultsOverviewSections = [
  {
    number: '01',
    title: 'A shared baseline for comparison',
    body: 'Every result reports how a scenario differs from baseline operations. Baseline is the reference condition, not a separate future that visitors need to select.',
  },
  {
    number: '02',
    title: 'Modeled conditions and sea-level rise',
    body: 'The primary results use present-day sea-level conditions. Where data are available, adaptation scenarios can also be viewed under two feet of sea-level rise and compared with the corresponding baseline under that same condition.',
  },
  {
    number: '03',
    title: 'Outputs across time and place',
    body: 'Modeled salinity is examined through time and across monitoring locations so visitors can see where, when, and by how much each future differs from baseline operations.',
  },
] as const

export const slrScenarioSlugs = [
  'eco-machine',
  'new-green-watershed',
  'bolster-and-fortify',
] as const
