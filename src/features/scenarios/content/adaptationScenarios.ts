import type { ScenarioContent } from './types'

export const adaptationScenarios: ScenarioContent[] = [
  {
    slug: 'eco-machine',
    number: '01',
    title: 'Eco Machine',
    image: '/images/scenarios/eco-machine-2.JPG',
    summary:
      'Tidal restoration becomes working green infrastructure—reshaping water movement while creating habitat, recreation, and eco-cultural opportunities.',
    story: [
      {
        title: 'What if restoration could help manage salinity?',
        paragraphs: [
          'Tides naturally carry salt water from San Francisco Bay into the Delta. Freshwater flowing downstream helps resist that movement, but drought and sea level rise can allow salinity to travel farther inland, affecting ecosystems, communities, agriculture, and freshwater supplies.',
          'Restoration is often discussed as a way to rebuild habitat. Eco Machine asks whether it could also help manage how water and salinity move through the Delta. Strategically placed tidal wetlands and vegetated landforms could redirect tidal energy, slow saltwater movement, and work alongside existing water infrastructure.',
          'The scenario treats restoration as working green infrastructure. It explores where nature-based projects could improve salinity conditions while also creating habitat and new opportunities for recreation, cultural practices, and community use.',
        ],
      },
      {
        title: 'Restoring two connected landscapes',
        paragraphs: [
          'Eco Machine focuses on Suisun Marsh and Franks Tract, two places where restoration could meaningfully influence tidal movement. Their locations and histories create different opportunities for shaping water while supporting a wider range of benefits.',
          'Around Grizzly Island in Suisun Marsh, restored tidal wetlands could direct more tidal energy toward Suisun Bay rather than farther inland. The scenario examines whether this change could reduce salinity intrusion while expanding marsh habitat and access to the landscape.',
          'Franks Tract is a former Delta island that has remained flooded since its levees failed. Vegetated landforms based on the community-informed Franks Tract Futures design could interrupt a pathway for salinity intrusion while creating a richer mix of shallow-water habitat and recreational spaces.',
        ],
      },
      {
        title: 'Designing restoration for multiple benefits',
        paragraphs: [
          'A restoration project can change the way tides move through connected channels, so its location and form matter. A project that improves conditions in one place could have little effect—or create new challenges—somewhere else. Eco Machine therefore does not assume that every restored acre will affect salinity in the same way.',
          'The scenario also asks what restoration should provide beyond salinity management. New wetlands and landforms could support fish and wildlife, strengthen connections to culturally important places, and create opportunities for boating, fishing, and other forms of recreation.',
          'These benefits depend on how projects are designed and whose priorities shape them. Eco Machine considers salinity performance alongside ecological, recreational, community, and ecocultural outcomes rather than treating restoration as a single-purpose intervention.',
        ],
      },
      {
        title: 'Restoration as working infrastructure',
        paragraphs: [
          'Eco Machine tests a focused proposition: selected landscapes may be able to perform some of the work usually assigned to engineered water infrastructure.',
          'Its success depends on placement, design, and sequence. The scenario compares where tidal restoration could reduce salinity intrusion, where it could make conditions worse, and how projects might build on one another over time.',
          'Rather than separating ecosystem restoration from water management, Eco Machine asks what becomes possible when the same landscape is designed to support both.',
        ],
      },
    ],
    mapFeatures: ['Suisun Marsh and Grizzly Island', 'Franks Tract and its tidal connections'],
  },
  {
    slug: 'new-green-watershed',
    number: '02',
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
            title: 'Maximizing habitat diversity in transitional areas',
            summary:
              'Transitional areas span the elevations between subtidal waters and uplands, creating rare opportunities for diverse, connected habitats.',
            mapHabitatType: 'transitional',
            paragraphs: [
              'Transitional areas vary from subtidal to supratidal elevations. Because many species use the ecotones between these habitats, restoring connections among tidal areas, river channels, floodplains, and higher ground could provide unusually high ecological value.',
              'These connections would give plants and wildlife more room to move among habitats as water levels rise and could reconnect Delta channels with non-subsided floodplains along the Delta’s edges.',
            ],
          },
          {
            title: 'Restoring fish migration channels',
            summary:
              'Restored side channels and riverbank habitat can give native fish more places to feed, shelter, and rest along key migration routes.',
            mapHabitatType: 'riparian',
            paragraphs: [
              'Restored side channels and native vegetation along riverbanks could give fish places to feed, shelter, and rest along their preferred migration routes.',
              'Because fish-passage opportunities depend on channel conditions and known migration corridors rather than elevation alone, this strategy is considered separately from transitional habitats.',
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
        title: 'When should water be held, and when should it be released?',
        paragraphs: [
          'Reservoirs store water when it is available and release it over time for communities, farms, ecosystems, and water-quality needs. These choices become more difficult during long droughts, when there is less water to meet competing needs and greater uncertainty about what the following years will bring.',
          'Holding water in reserve can protect against future shortages. Releasing it can increase freshwater flowing into the Delta, help resist salinity intrusion, and support aquatic habitats that depend on the timing and pattern of river flows.',
          'Calling on Reserves asks whether reservoirs can be operated differently to balance these needs. It focuses on the tension between keeping water for an uncertain future and using it when freshwater flows could provide important benefits downstream.',
        ],
      },
      {
        title: 'Changing the timing of reservoir releases',
        paragraphs: [
          'Shasta Reservoir captures water from the upper Sacramento River and influences when much of that water moves downstream. The scenario changes the timing and amount of releases from the reservoir, then follows those flows along the Sacramento River and into the Delta.',
          'Instead of constructing new infrastructure within the Delta, Calling on Reserves works differently with an existing system. Releases could be timed to provide freshwater when it is especially valuable for salinity management or ecological conditions while preserving reserves when future drought risk is greater.',
          'The central question is not simply whether more water should be released. It is whether different release patterns can make better use of a limited supply without weakening the protection that stored water provides.',
        ],
      },
      {
        title: 'Following freshwater benefits downstream',
        paragraphs: [
          'Water released from Shasta travels down the Sacramento River before reaching the Delta. Along that route, the timing of flows can affect river and floodplain habitats as well as the amount of freshwater available to push back against salinity.',
          'Better-timed flows could improve conditions for native fish and other species whose life cycles depend on seasonal changes in rivers. In the Delta, additional freshwater could help protect water quality for communities, agriculture, ecosystems, and statewide supplies.',
          'These potential benefits remain connected to the amount of water left in reserve. A release that helps during one period could reduce flexibility later, so the scenario keeps ecological and Delta benefits in view alongside drought resilience.',
        ],
      },
      {
        title: 'Balancing present needs with future uncertainty',
        paragraphs: [
          'Calling on Reserves explores adaptation through choices about when water moves rather than through a new physical pathway or barrier.',
          'The scenario tests whether more responsive reservoir operations can improve Delta salinity conditions and ecological flows while retaining enough stored water to respond to prolonged drought.',
          'Its central challenge is one shared across California water management: using water when it can provide the greatest benefit without assuming that the next wet year will arrive in time.',
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
    number: '03',
    title: 'Bolster and Fortify',
    image: '/images/scenarios/bolster-fortify-2.JPG',
    summary:
      'Engineered gates and reinforced levees create a more controlled freshwater corridor through the Delta toward the southern pumping plants.',
    story: [
      {
        title: 'What if the freshwater route through the Delta were reinforced?',
        paragraphs: [
          'Freshwater currently travels through a network of Delta channels toward the southern pumping plants. During drought, reduced river flows can allow salinity to move farther inland and affect the quality of water traveling through this system.',
          'The route also passes deeply subsided islands where water in the channels sits high above the surrounding land. A levee failure could flood communities and farms, reshape connected waterways, and disrupt the path used to move freshwater south.',
          'Bolster and Fortify asks whether targeted engineering could make this route more reliable. It concentrates gates, reconstructed levees, and levee improvements along one corridor to guide freshwater through the central Delta while limiting drought-time salinity intrusion.',
        ],
      },
      {
        title: 'Creating a controlled freshwater corridor',
        paragraphs: [
          'The proposed corridor begins around Franks Tract, where operable gates would help limit salinity movement during drought. Reconstructed levees within the flooded tract would help direct freshwater from the San Joaquin River toward Old River.',
          'Farther south, repaired and reinforced levees would strengthen the selected channel route toward Clifton Court Forebay and the southern pumping plants. Together, these interventions would turn an existing waterway into a more deliberately managed freshwater pathway.',
          'Each element depends on the others. Gates can influence where water moves, but the corridor also relies on levees that remain strong enough to separate the channel from deeply subsided land.',
        ],
      },
      {
        title: 'Examining who is protected—and who bears the impacts',
        paragraphs: [
          'A fortified corridor could improve the reliability of freshwater moving through the Delta and reduce exposure to salinity along the selected route. Stronger levees could also lower flood risk for some nearby lands, communities, and economic activities.',
          'Those benefits may not be shared evenly. Gates and levees change how water moves, and protecting one pathway can shift salinity, ecological effects, construction impacts, or flood risk toward other places.',
          'Bolster and Fortify therefore considers more than whether the corridor works. It also asks which communities and activities benefit from the investment, which experience disruption or new risks, and how those consequences compare with other adaptation strategies.',
        ],
      },
      {
        title: 'A more engineered Delta',
        paragraphs: [
          'Bolster and Fortify responds to uncertainty by increasing physical control over a selected part of the Delta’s channel network.',
          'Unlike restoration scenarios that work by expanding natural processes, this scenario relies on gates and levees to maintain a dependable freshwater route through a changing landscape.',
          'The scenario asks whether that control can provide lasting reliability—and whether the benefits justify the costs, disruptions, and unequal effects that a protected corridor could create elsewhere in the Delta.',
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
    number: '05',
    title: 'A Tunnel',
    image: '/images/scenarios/a-tunnel.jpg',
    summary:
      'Some Sacramento River water is diverted in the northern Delta and carried beneath the Delta to Bethany Reservoir through a more direct, protected route.',
    story: [
      {
        title: 'What if some water traveled beneath the Delta?',
        paragraphs: [
          'Freshwater bound for other parts of California currently travels through Delta channels before reaching the southern pumping plants. Along the way, salinity intrusion can affect water quality, and a major levee failure or earthquake could interrupt the route.',
          'A Tunnel proposes a different pathway. When conditions allow, some Sacramento River water would be diverted in the northern Delta and carried underground to Bethany Reservoir, where it would connect with the existing system that moves water farther south.',
          'The protected route could make statewide deliveries less dependent on conditions within Delta channels. It would also leave less Sacramento River water moving through parts of the Delta, potentially changing salinity, aquatic habitat, and conditions for Delta communities.',
        ],
      },
      {
        title: 'Creating a more direct water route',
        paragraphs: [
          'New intake facilities along the Sacramento River would direct water into an underground route beneath the Delta. At its southern end, a new pumping facility would move that water into Bethany Reservoir and connect it to existing conveyance infrastructure.',
          'Moving water underground separates part of the delivery system from the Delta’s changing channels and levees. The route is designed primarily to protect water deliveries rather than to manage salinity or restore landscapes within the Delta.',
          'Because the tunnel begins upstream, its effects cannot be understood only by looking at where the water arrives. The scenario follows what happens to the river and Delta after some freshwater takes the underground route instead.',
        ],
      },
      {
        title: 'Tracing changes within the Delta',
        paragraphs: [
          'The amount and timing of freshwater flowing through the Delta help shape salinity and aquatic conditions. Diverting water in the north could change those conditions downstream, especially during dry periods when freshwater is already limited.',
          'These changes could affect fish and other species, agriculture, recreation, and communities that depend on Delta waterways. Communities near the proposed alignment could also experience years of construction and lasting changes to the surrounding landscape.',
          'The scenario weighs those in-Delta consequences against the potential for a more reliable statewide water-delivery route. It asks who receives the benefits of greater reliability and who experiences the environmental and community impacts.',
        ],
      },
      {
        title: 'A comparison, not an endorsement',
        paragraphs: [
          'Many project participants asked to include A Tunnel because of its scale and importance to California water debates, not because they necessarily support building it.',
          'Including it allows the same questions to be asked of a major conveyance project as of restoration, reservoir-operation, and levee-fortification strategies: how does it affect salinity, ecosystems, communities, recreation, Tribal interests, and the economy?',
          'A Tunnel provides a point of comparison for understanding whether protecting the movement of water around the Delta also creates a just and resilient future within it.',
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
  }
]

