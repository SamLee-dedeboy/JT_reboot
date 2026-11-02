export const evaluationTeams = [
  {
    id: 'ecology',
    number: '01',
    label: 'Ecology',
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
  },
  {
    id: 'environmental-justice',
    number: '02',
    label: 'Environmental Justice & Vulnerable Communities',
    summary:
      'Assesses whether scenario burdens fall unfairly on Delta communities through drinking-water quality, flood risk reduction, and harmful-algal-bloom conditions.',
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
        name: 'Salinity impacts to in-Delta drinking water',
        definition:
          'Assesses whether salinity changes affect drinking-water systems’ ability to meet standards, with attention to community vulnerability.',
        measurement:
          'Percentage of the model run exceeding the drinking-water salinity threshold of 1,050 microsiemens per centimeter.',
      },
      {
        name: 'Flood risk attenuation',
        definition: 'Identifies the risk of inundation across the Delta.',
        measurement:
          'Qualitative assessment of in-Delta inundation risk given the green and gray infrastructure included in each scenario.',
      },
      {
        name: 'Water age + water temperature',
        definition: 'Uses water age as a proxy for conditions favorable to harmful algal blooms.',
        measurement: 'Change in water age when water temperature is above 19°C.',
      },
    ],
  },
  {
    id: 'ecocultural-restoration',
    number: '03',
    label: 'Eco-cultural Restoration & Indigenous Sovereignty',
    summary:
      'Assesses whether scenarios advance eco-cultural restoration and Indigenous sovereignty through ecosystem restoration, land access, Indigenous science and Traditional Ecological Knowledge, and Tribal sovereignty.',
    entityGroups: [
      {
        label: 'People and communities',
        items: [
          'Indigenous people, communities and advocates',
          'Tribal nations',
          'Indigenous Science and Traditional Ecological Knowledge (TEK) practitioners',
        ],
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
        name: 'Ecosystem restoration',
        definition:
          'Evaluates recovery, protection, and enhancement of species and ecosystems that are Native to the Delta and culturally significant.',
        measurement: 'Change in the number of restored acres in each scenario.',
      },
      {
        name: 'Increased land access',
        definition:
          'Considers returning land to Tribes or co-managing land with Tribes and Tribal governments for stewardship, subsistence, ceremony, and cultural practices.',
        measurement:
          'Types of agreements that can facilitate increased access to land for Tribal communities.',
      },
      {
        name: 'Implementation and application of Indigenous Science & TEK',
        definition:
          'Considers how TEK can inform management, stewardship, and land-use decisions in partnership with Tribal representatives and practitioners.',
        measurement: 'Avenues through which TEK applications can be facilitated.',
      },
      {
        name: 'Recognition and application of Tribal sovereignty',
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
        measurement:
          'Share of days whose average water temperature is over an activity’s threshold.',
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
  },
  {
    id: 'economy',
    number: '05',
    label: 'Economy',
    summary:
      'Examines what happens to the Delta agricultural economy when salinity and landscape conditions change by tracking gross revenue, employment, and value added.',
    entityGroups: [
      {
        label: 'People and livelihoods',
        items: ['Farm workers'],
      },
      {
        label: 'Economic Status Indicators',
        items: ['Gross revenue', 'Employment', 'Economic value added'],
      },
      {
        label: 'Places',
        items: ['North, Central, South, and West Delta zones', 'Suisun Marsh land uses'],
      },
    ],
    metrics: [
      {
        name: 'Annual gross agricultural revenues',
        definition:
          'Estimates changes in gross sales by sector, including the farm-gate value of crops.',
        measurement: 'Annualized 2024 US dollars.',
      },
      {
        name: 'Agriculture-supported jobs',
        definition: 'Estimates annual changes in employment by sector.',
        measurement: 'Full- and part-time jobs for a sector in one year.',
      },
      {
        name: 'Economic value added',
        definition:
          'Measures an amount close to gross domestic product: gross revenues minus non-labor business expenses.',
        measurement: 'Annualized 2024 US dollars.',
      },
    ],
  },
] as const

export const outflowResultVariations = [
  {
    id: 'decrease',
    label: '10% decrease in Delta outflow',
    explorerKey: 'run17',
  },
  {
    id: 'increase',
    label: '30% increase in Delta outflow',
    explorerKey: 'run16',
  },
] as const

export const slrScenarioSlugs = [
  'eco-machine',
  'new-green-watershed',
  'bolster-and-fortify',
] as const
