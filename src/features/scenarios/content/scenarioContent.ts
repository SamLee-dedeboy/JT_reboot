export const evaluationCriteria = [
  { id: 'salinity', label: 'Salinity' },
  { id: 'ecology', label: 'Ecology' },
  { id: 'community', label: 'Community' },
  { id: 'economy', label: 'Economy' },
  { id: 'recreation', label: 'Recreation' },
  { id: 'tribes', label: 'Tribes' },
] as const

export const evaluationMetrics = {
  salinity: {
    heading: 'Salinity indicators',
    items: ['X2 position', 'Compliance stations', 'Monitoring stations'],
  },
  ecology: {
    heading: 'Valued species',
    items: ['Longfin Smelt', 'Chinook Salmon', 'Submerged Aquatic Vegetation'],
  },
  community: {
    heading: 'Community conditions',
    items: ['Drinking water access', 'Delta communities', 'Environmental justice locations'],
  },
  economy: {
    heading: 'Economic activities',
    items: ['Delta agriculture', 'Freshwater supply', 'Local livelihoods'],
  },
  recreation: {
    heading: 'Recreation values',
    items: ['Fishing', 'Boating access', 'Public recreation areas'],
  },
  tribes: {
    heading: 'Eco-cultural values',
    items: ['Land access', 'Cultural practices', 'Tribal stewardship'],
  },
} as const

export interface ScenarioChapter {
  title: string
  paragraphs: string[]
  highlights?: Array<{
    title: string
    summary: string
    paragraphs: string[]
    mapHabitatType?: 'soil' | 'transitional' | 'tidal'
    exploreHabitat?: 'forest' | 'meadow' | 'floodplain'
  }>
  endingParagraphs?: string[]
  subsections?: Array<{
    id?: string
    title: string
    paragraphs: string[]
    orderedItems?: string[]
  }>
  highlightsAction?: {
    label: string
    href: string
  }
  primaryAction?: {
    label: string
    href: string
  }
}

export interface ScenarioContent {
  slug: string
  number: string
  title: string
  image: string
  summary: string
  story: ScenarioChapter[]
  mapFeatures: string[]
  comparisonNote?: string
}

export const scenarios: ScenarioContent[] = [
  {
    slug: 'business-as-usual',
    number: '01',
    title: 'Business as Usual',
    image: '/images/scenarios/business-as-usual.jpg',
    summary:
      'If current conditions and familiar water-management responses continue, how will the Delta change—and who will feel those changes first?',
    story: [
      {
        title: 'Following the current path',
        paragraphs: [
          'Business as Usual carries today’s approach to Delta water management into the future. Freshwater continues to enter from the Sacramento and San Joaquin rivers, while managers work to limit the distance that ocean salinity moves inland and to maintain water-quality requirements at compliance stations throughout the Delta.',
          'During difficult drought conditions, the system can continue to rely on familiar emergency responses, including temporary salinity barriers, Temporary Urgency Change Petitions, and exceptions to water-quality standards. The scenario asks what happens as those temporary measures are needed more often.',
        ],
      },
      {
        title: 'A shared point of comparison',
        paragraphs: [
          'This scenario does not introduce a new adaptation. Its purpose is to establish the condition against which the other five scenarios can be understood. Existing and proposed barriers, gates, dams, levee fortifications, and freshwater pathways remain visible because they show the choices available when current operations come under pressure.',
          'The comparison focuses attention on consequences that can be easy to hide inside system-wide averages. Scarcer drinking water may fall unevenly on communities, while changing salinity and flows can reduce habitat for fish and other species. Business as Usual makes those expectations explicit before testing a different path.',
        ],
      },
    ],
    mapFeatures: [
      'Sacramento and San Joaquin river pathways',
      'X2, salinity compliance, and monitoring stations',
      'Implemented and proposed barriers, gates, levees, and freshwater pathways',
    ],
  },
  {
    slug: 'eco-machine',
    number: '02',
    title: 'Eco Machine',
    image: '/images/scenarios/eco-machine-2.JPG',
    summary:
      'Tidal restoration becomes working green infrastructure—reshaping water movement while creating habitat, recreation, and eco-cultural opportunities.',
    story: [
      {
        title: 'Working with tides instead of only resisting them',
        paragraphs: [
          'Climate change increases the risk that salt water will move farther into the Delta. Eco Machine responds by asking whether strategically placed tidal restoration can reshape that movement. Instead of treating restoration as separate from water infrastructure, the scenario treats restored landforms and marshes as part of the salinity-management system.',
          'The central idea is that location and design matter. A restoration project can change how tidal energy moves through connected channels, so the team will compare where restoration reduces salinity, where it could make conditions worse, and how projects should be phased rather than assuming that every restored acre has the same effect.',
        ],
      },
      {
        title: 'Two landscapes put the idea to work',
        paragraphs: [
          'In Suisun Marsh, tidal restoration around Grizzly Island could direct more tidal energy toward Suisun Bay and help reduce inland salinity. In Franks Tract—a former island that has remained flooded since levee failure—vegetated landforms based on the Franks Tract Futures design could interrupt a major pathway for salinity intrusion.',
          'The model tests how these physical changes affect water movement and salinity. The same projects are also considered for the habitat, recreation, community, and eco-cultural opportunities they could create, including improved tribal and Indigenous access to the Delta.',
        ],
      },
    ],
    mapFeatures: ['Suisun Marsh and Grizzly Island', 'Franks Tract and its tidal connections'],
  },
  {
    slug: 'new-green-watershed',
    number: '03',
    title: 'New Green Watershed',
    image: '/images/scenarios/new-green-watershed.jpg',
    summary:
      'The Delta and its watershed are restored as one connected system, allowing land and ecosystems to help manage water salinity, flooding, and climate risk.',
    story: [
      {
        title: 'What if the landscape could help manage water?',
        paragraphs: [
          'Much of the Delta has been managed by draining wetlands for agriculture and holding water behind levees. This approach has supported farms and communities, but it has also contributed to a growing problem: when peat is exposed to air, it decomposes and releases greenhouse gases. Losing drying soil to decomposition also causes the land to sink, leading to growing differences in elevation between the Delta channels and the land behind the levees.',
          'Some Delta islands are now 20 to 25 feet below sea level. Water moves through channels high above the land, increasing pressure on the levees that protect communities and farms. If a levee fails, water can rapidly flood the deeply subsided island. The resulting changes in Delta waterways can also draw saltier water farther inland, affecting agriculture, ecosystems, communities, and freshwater supplies across California.',
          'New Green Watershed asks whether restoring landscapes and adapting land uses could address these connected risks while supporting regenerative farming, habitat, cultural practices, and a more sustainable regional economy. The scenario explores the multi-benefit possibilities of restoration both within the Delta and its much larger watershed.',
        ],
      },
      {
        title: 'Adapting Delta lands by elevation',
        paragraphs: [
          'Land subsidence can be stopped and reversed through a variety of adaptive land-use strategies. No single intervention is appropriate everywhere. ',
          'The Delta Islands Adaptations research project demonstrates techniques that may be applied across the Delta to support this reversal. These strategies are incorporated into the New Green Watershed scenario, based on their current elevation.',
        ],
        highlights: [
          {
            title: 'Keeping peat soils wet',
            summary:
              'Keeping water in peat soils can stop the ground from sinking while supporting farming, habitat, carbon storage, and cultural uses.',
            mapHabitatType: 'soil',
            paragraphs: [
              'In deeply to moderately subsided Delta areas that remain protected by levees, the central strategy is to keep peat soils wet, so they stop decomposing and sinking.',
              'These lands could support a flexible mosaic of wetter uses, including rice farming, paludiculture, floating wetlands, and managed wetlands. Different practices could be designed for different benefits, such as tule production or plankton maximization. These land uses may also store carbon, create habitat, and provide new recreational and ecocultural opportunities.',
            ],
          },
          {
            title: 'Restoring tidal wetlands',
            summary:
              'Near sea level, restored tidal wetlands could reshape water and salinity movement while creating habitat and spaces for recreation and cultural practices.',
            mapHabitatType: 'tidal',
            paragraphs: [
              'Near sea level, tidal wetlands are proposed if levees are breached, such as areas of Suisun Marsh.',
              'Restored tidal wetlands could change how tides and salinity move through the Delta while creating habitat and supporting recreation and cultural uses.',
            ],
          },
          {
            title: 'Connecting water to higher ground',
            summary:
              'Transitional habitats can connect channels, floodplains, and uplands so fish, plants, and wildlife have room to move as water levels rise.',
            mapHabitatType: 'transitional',
            paragraphs: [
              'Along the Delta’s edges, transitional habitats could connect tidal areas and river channels with floodplains and higher ground. These connections would give plants and wildlife more room to move as water levels rise.',
              'Restored side channels and native vegetation along riverbanks could also give fish places to feed, shelter, and rest along their migration routes. Together, these habitats create a more continuous transition from open water to riverbanks, floodplains, and uplands.',
            ],
          },
        ],
        endingParagraphs: [
          'The appropriate combination would differ among islands and tracts. New Green Watershed does not envision one land use covering the entire Delta. It explores how each place could transition according to its elevation, soils, communities, ecological potential, and economic needs.',
        ],
      },
      {
        title: 'Restoring the watershed upstream',
        paragraphs: [
          "Adaptation does not stop at the Delta's boundary.",
          'The Bay-Delta watershed covers nearly half of California. Water reaching the Delta has already traveled through forests, meadows, rivers, floodplains, farms, and communities. How these upstream landscapes are managed affects how quickly water moves downstream and how much water the landscape can temporarily hold.',
          'Restoration and land-stewardship practices could help water spread out, infiltrate the soil, and move downstream more slowly rather than arriving all at once. The project team has compiled existing research on the potential downstream benefits of upstream land management and restoration, focusing on three key landscape types.',
        ],
        highlights: [
          {
            title: 'Forest restoration',
            summary:
              'Forest stewardship can reduce severe wildfire risk and create healthier conditions for habitat, meadows, and the wider watershed.',
            exploreHabitat: 'forest',
            paragraphs: [
              'Forest thinning, mastication of trees, prescribed and cultural burning, and other stewardship practices can remove excess fuels and create a more varied forest structure. Existing research indicates that these changes can reduce the risk of severe wildfire, improve habitat, and create conditions that support nearby meadow and watershed restoration.',
            ],
          },
          {
            title: 'Meadow restoration',
            summary:
              'Repairing eroded mountain meadows helps them hold and slowly release water while rebuilding wetland habitat.',
            exploreHabitat: 'meadow',
            paragraphs: [
              'Eroded stream channels can drain mountain meadows and lower their water tables. Restoration techniques—including filling incised channels, constructing beaver dam analogs, and removing encroaching conifers—can slow and spread streamflow across the meadow. Studies show that these techniques create barriers to streamflow, thereby allowing more water to soak into the soil, supporting wetland plant communities, and creating habitat for diverse species.',
            ],
          },
          {
            title: 'Floodplain restoration',
            summary:
              'Reconnected floodplains give high flows more room to spread out, easing pressure on levees while restoring shallow-water habitat.',
            exploreHabitat: 'floodplain',
            paragraphs: [
              'Floodplains give high river flows room to spread out, slow down, and create shallow-water habitat. Reconnecting them could reduce pressure on existing levees and nearby upstream communities while restoring wetlands and riverbank habitat.',
              'One approach is a levee setback: a new levee is constructed farther from the river, and portions of the original levee are then removed or opened. This gives the river more space during floods while maintaining protection for developed and agricultural areas behind the setback levee.',
            ],
          },
        ],
        highlightsAction: {
          label: "Explore (lead to Maggie's work)",
          href: '/pages/watershed',
        },
        subsections: [
          {
            id: 'ecocultural-stewardship',
            title: 'Advancing ecocultural restoration and Indigenous stewardship',
            paragraphs: [
              'New Green Watershed considers more than hydrologic and ecological outcomes. It also examines how restoration could support Indigenous access, authority, knowledge, and stewardship across the watershed.',
              'Potential ecocultural benefits include:',
            ],
            orderedItems: [
              'Restoring native ecosystems and ecosystem functions through land-use changes and improved environmental flows',
              'Expanding access to landscapes for stewardship, subsistence, ceremony, and cultural practices',
              'Supporting the application of Indigenous science and Traditional Ecological Knowledge',
              'Recognizing and advancing Indigenous sovereignty, Tribal governance, and rights in decisions about land and water.',
            ],
          },
        ],
        endingParagraphs: [
          'These goals require more than introducing particular restoration techniques. They concern who has access to land, whose knowledge guides management, and who holds decision-making authority.',
        ],
        primaryAction: {
          label: 'Explore ecocultural results',
          href: '/scenarios/new-green-watershed/results#tribes',
        },
      },
      {
        title: 'One watershed, many connected strategies',
        paragraphs: [
          'New Green Watershed is a long-term vision, not a claim that every proposed intervention will work everywhere.',
          'The scenario connects actions across several scales: keeping Delta peat soils wet, matching land uses to elevation, reconnecting habitats from channels to uplands, and considering how upstream landscape restoration affects how water moves downstream. The scenario explores how landscape adaptation and restoration can reduce subsidence and flood risk, influence salinity, support habitat and cultural practices, and create new economic opportunities.',
          'Rather than asking levees and other infrastructure to carry the entire burden, New Green Watershed considers how the landscape itself could become part of the region’s adaptation strategy.',
        ],
      },
    ],
    mapFeatures: [
      'Land subsidence and wet-soil land uses',
      'Tidal, upland, fish-passage, and riparian restoration',
      'Upstream forests, wet meadows, and floodplains',
    ],
  },
  {
    slug: 'calling-on-reserves',
    number: '04',
    title: 'Calling on Reserves',
    image: '/images/scenarios/calling-on-reserves.jpg',
    summary:
      'Reservoirs are operated differently to balance drought reserves with freshwater flows that support Delta salinity management and aquatic ecosystems.',
    story: [
      {
        title: 'The tension between storing and releasing water',
        paragraphs: [
          'Shasta Reservoir captures Sacramento River water and controls when much of that water moves downstream. Holding water back can preserve a reserve for future drought. Releasing it can increase freshwater inflow to the Delta, help resist salinity intrusion, and provide flows that benefit aquatic habitat.',
          'Calling on Reserves focuses on that tension. The scenario asks whether the timing and amount of reservoir releases can change without trading away the drought resilience that stored water is meant to provide.',
        ],
      },
      {
        title: 'Changing operations, then tracing the effects',
        paragraphs: [
          'The implementation is operational rather than a new piece of in-Delta infrastructure: reoperate Shasta Reservoir, send a different pattern of releases down the Sacramento River, and follow the resulting changes into the Delta.',
          'The model tests how those release patterns change freshwater inflow and salinity. It also helps the ecological team examine where better-timed flows could support important species and habitats, while keeping the central tradeoff with reservoir storage visible.',
        ],
      },
    ],
    mapFeatures: [
      'Shasta Reservoir and the Sacramento River',
      'Freshwater inflow to the Delta',
      'Habitats connected to changing flow conditions',
    ],
  },
  {
    slug: 'bolster-and-fortify',
    number: '05',
    title: 'Bolster and Fortify',
    image: '/images/scenarios/bolster-fortify-2.JPG',
    summary:
      'Engineered gates and reinforced levees create a more controlled freshwater corridor through the Delta toward the southern pumping plants.',
    story: [
      {
        title: 'Protecting a vulnerable freshwater route',
        paragraphs: [
          'Freshwater currently travels through Delta channels toward the southern pumping plants. Drought can allow salinity to degrade that water along the way, while deeply subsided islands increase the risk that levee failure will disrupt communities, agriculture, waterways, and the conveyance route itself.',
          'Bolster and Fortify responds by concentrating engineered improvements along a selected pathway. The aim is to control where freshwater moves, limit drought-time salinity intrusion, and reinforce the channel edges that keep the route operating.',
        ],
      },
      {
        title: 'Building a corridor through Franks Tract and Old River',
        paragraphs: [
          'Two operable salinity-control gates would be placed at the northeastern and southeastern corners of Franks Tract and used during drought. Reconstructed levees inside the tract would help direct San Joaquin River water south into Old River, where repaired and strengthened levees would carry the corridor toward Clifton Court Forebay.',
          'The model combines the gates, reclaimed levees, and fortified channel to test whether this route can deliver freshwater more reliably. The inspection also keeps distributional questions in view: infrastructure that protects one place or activity can redirect water, risk, or disruption toward another community.',
        ],
      },
    ],
    mapFeatures: [
      'Proposed gates and reconstructed levees at Franks Tract',
      'The fortified Old River freshwater corridor',
      'Clifton Court Forebay and the southern pumping plants',
    ],
  },
  {
    slug: 'a-tunnel',
    number: '06',
    title: 'A Tunnel',
    image: '/images/scenarios/a-tunnel.jpg',
    summary:
      'Some Sacramento River water is diverted in the northern Delta and carried beneath the Delta to Bethany Reservoir through a more direct, protected route.',
    story: [
      {
        title: 'Moving water around Delta-channel risks',
        paragraphs: [
          'Freshwater exports now move through Delta channels to the southern pumping plants, where salinity intrusion and levee failures can interrupt or degrade the route. A Tunnel would intercept some Sacramento River water in the northern Delta and carry it underground to Bethany Reservoir.',
          'That protected route could make statewide deliveries less dependent on conditions within Delta channels. At the same time, removing water upstream would change the freshwater left to move through the Delta, with consequences for salinity, aquatic conditions, and communities.',
        ],
      },
      {
        title: 'Comparing a different conveyance system',
        paragraphs: [
          'The scenario follows the proposed pathway from northern intake locations through the underground alignment to Bethany Reservoir. The model asks how tunnel operations change the amount and timing of freshwater flowing through the Delta and how those changes appear across communities and ecosystems.',
          'The purpose is comparison: to place a major conveyance project beside the restoration, reservoir-operation, and fortified-corridor scenarios and make their different system-wide effects easier to evaluate.',
        ],
      },
    ],
    mapFeatures: [
      'Northern Delta water intakes',
      'The underground conveyance pathway',
      'Bethany Reservoir',
    ],
    comparisonNote:
      'This scenario is included for comparison and evaluation, not because project participants necessarily consider it desirable.',
  },
]

export const scenarioBySlug = Object.fromEntries(
  scenarios.map((scenario) => [scenario.slug, scenario]),
)
