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
        navigationLabel: 'Motivation',
        paragraphs: [
          'Tides naturally carry salt water from San Francisco Bay into the Delta. Freshwater flowing downstream helps resist that movement, but drought and sea level rise can allow salinity to travel farther inland, affecting ecosystems, communities, agriculture, and freshwater supplies.',
          "Restoration is often discussed as a way to rebuild habitat. But the shape of the Delta's landscape also influences how tidal water moves and where salt travels. Eco Machine asks whether strategically designed restoration could help manage salinity while providing ecological and community benefits.",
        ],
      },
      {
        title: 'Two locations for multi-benefit restoration',
        navigationLabel: 'Design Approach',
        paragraphs: [
          'Eco Machine explores restoration on Suisun Marsh and Franks Tract, two locations where changes to the landscape could influence tidal movement and salinity intrusion. Each location offers a different approach to managing salinity while supporting habitat restoration, recreation, and community use.',
        ],
        highlights: [
          {
            title: 'Suisun Marsh: Redirecting tidal energy',
            summary:
              'Around Grizzly Island, restored tidal wetlands could direct more tidal energy toward Suisun Bay rather than farther inland. The scenario examines whether this change could reduce salinity intrusion while expanding marsh habitat and access to the landscape.',
            paragraphs: [],
            mapSelectionKey: 'suisun-marsh',
          },
          {
            title: 'Franks Tract: Reshaping water pathways',
            summary:
              'Franks Tract is a former Delta island that has remained flooded since its levees failed in the 1930s. Located in the central Delta, this large open-water area plays an important role in salinity intrusion. Vegetated landforms based on a community-informed restoration design could interrupt a pathway for salinity intrusion while supporting recreation and community use.',
            paragraphs: [
              'The scenario draws on Franks Tract Futures, a 2019–2020 public planning effort that brought together communities and experts to develop a multi-benefit restoration design.',
            ],
            mapSelectionKey: 'franks-tract',
          },
        ],
      },
      {
        title: 'Restoration as Working Green Infrastructure',
        navigationLabel: 'Key Takeaway',
        paragraphs: [
          'Restoration could do more than rebuild habitat. By changing how tidal water moves through the Delta, strategically designed wetlands and landforms could complement existing water infrastructure and help manage salinity.',
          'By examining these possibilities in Suisun Marsh and Franks Tract, Eco Machine explores how restoration could contribute to salinity management while supporting ecological, recreational, and cultural goals.',
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
      'Adjusting when and how much water is released from upstream reservoirs could help manage Delta salinity and preserve water supplies for future droughts.',
    story: [
      {
        title: 'What if reservoir release timing can help manage Delta salinity?',
        navigationLabel: 'Motivation',
        paragraphs: [
          'Upstream reservoirs capture and store freshwater for communities, agriculture, and ecosystems. Water managers decide when to hold that water and when to release it downstream, balancing immediate needs against future shortages. These decisions become especially difficult during prolonged droughts, when water supplies are limited and future conditions are uncertain.',
          'Holding water in reserve can help protect against future shortages. Releasing it can increase freshwater flows into the Delta, help resist salinity intrusion, and support habitats that depend on seasonal river flows.',
          'Calling on Reserves asks whether changing reservoir operations — the timing and amount of water released — could better balance these competing water needs.',
        ],
      },
      {
        title: 'Rethinking reservoir releases',
        navigationLabel: 'Design Approach',
        paragraphs: [
          'Calling on Reserves focuses on Shasta Reservoir, a major reservoir in the Sacramento River watershed.',
        ],
      },
      {
        title: 'Balancing today’s needs with tomorrow’s uncertainty',
        navigationLabel: 'Key Takeaway',
        paragraphs: [
          "Calling on Reserves explores a different approach to adaptation: changing how existing water infrastructure is operated rather than constructing new facilities or altering the Delta's physical landscape.",
          'The scenario asks whether more flexible reservoir operations can make better use of limited freshwater resources while maintaining the long-term reliability that stored water provides.',
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
        title: 'What if we could create a more reliable freshwater corridor?',
        navigationLabel: 'Motivation',
        paragraphs: [
          'Freshwater travels through a network of Delta channels toward the southern pumping plants, supplying water to communities and agriculture across California. During drought, reduced river flows can allow salinity to move farther inland, threatening the quality of water moving through this system.',
          'Much of this network also runs alongside deeply subsided islands, where water in the channels sits high above the surrounding land. A levee failure could flood communities and farmland, and threaten the pathways that move freshwater south.',
          'Bolster and Fortify explores whether targeted infrastructure improvements could make freshwater delivery more reliable while limiting salinity intrusion during drought.',
        ],
      },
      {
        title: 'Creating a controlled freshwater corridor',
        navigationLabel: 'Design Approach',
        paragraphs: [
          'Bolster and Fortify focuses on a proposed Through-Delta Corridor that guides freshwater from the San Joaquin River through Old River toward Clifton Court Forebay and the southern pumping plants.',
          'The corridor combines three interventions:',
        ],
        highlights: [
          {
            title: 'Operable gates at Franks Tract',
            summary:
              'Two operable salinity-control gates are proposed near the northeastern and southeastern corners of Franks Tract. During drought, these gates could limit saltwater movement to protect freshwater quality along the corridor.',
            paragraphs: [],
            mapSelectionKey: 'operable-gates',
          },
          {
            title: 'Reconstructed levees to direct freshwater',
            summary:
              'Franks Tract has remained flooded since its levees failed in the 1930s. Reconstructing selected levees within the tract, together with the operable gates, could help establish a more defined freshwater pathway.',
            paragraphs: [],
            mapSelectionKey: 'reconstructed-levees',
          },
          {
            title: 'Fortify the Old River corridor',
            summary:
              'Farther south, existing levees along Old River would be repaired and reinforced to strengthen the freshwater route toward Clifton Court Forebay. These improvements could reduce the risk of levee failure and help maintain a reliable connection to the southern pumping plants.',
            paragraphs: [],
            mapSelectionKey: 'freshwater-corridor',
          },
        ],
      },
      {
        title: 'A more engineered Delta',
        navigationLabel: 'Key Takeaway',
        paragraphs: [
          'Bolster and Fortify explores a future in which engineered infrastructure provides greater control over freshwater movement through the Delta.',
          'However, greater control comes with trade-offs. Gates and levees can change water circulation and conditions beyond the protected corridor, while construction, maintenance, and long-term operations require substantial investment.',
          'The scenario asks whether that control can provide lasting reliability — and whether the benefits justify the costs, disruptions, and unequal effects that a protected corridor could create elsewhere in the Delta.',
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
        navigationLabel: 'Motivation',
        paragraphs: [
          'Freshwater bound for other parts of California currently travels through Delta channels before reaching the southern pumping plants. Along the way, salinity intrusion can affect water quality, while levee failures or earthquakes could disrupt the delivery system.',
          'A Tunnel proposes a different approach. When conditions allow, some Sacramento River water would be diverted into an underground tunnel to the existing water delivery system in the south. This alternative route would make statewide water deliveries less vulnerable to changing conditions in Delta channels.',
          'However, diverting water upstream also means less Sacramento River water may flow through parts of the Delta. These changes could affect salinity, ecosystems, and communities that depend on Delta waterways.',
        ],
      },
      {
        title: 'Creating an underground freshwater route',
        navigationLabel: 'Design Approach',
        paragraphs: [
          'A Tunnel is based on the Bethany Reservoir Alignment of the proposed Delta Conveyance Project. The design would create a new underground route connecting the Sacramento River in the northern Delta to Bethany Reservoir in the south, where water would enter the existing statewide conveyance system.',
        ],
        highlights: [
          {
            title: 'Intake facilities in the Northern Delta',
            summary:
              'New intake facilities along the Sacramento River would divert water into the proposed conveyance system when conditions allow. These facilities would control how much water enters the tunnel, while the remaining river flow continues downstream through the Delta.',
            paragraphs: [],
            mapSelectionKey: 'tunnel-intakes',
          },
          {
            title: 'A tunnel to carry water beneath the Delta',
            summary:
              "A roughly 45-mile underground tunnel would transport diverted water south, bypassing much of the Delta's network of channels and levees. Construction would require access shafts and other facilities along the alignment, creating temporary and potentially lasting changes to nearby landscapes and communities.",
            paragraphs: [],
            mapSelectionKey: 'tunnel-alignment',
          },
          {
            title: 'Pumping facilities to connect to existing system',
            summary:
              'At the southern end, a new pumping facility would move water into Bethany Reservoir. From there, the diverted water would connect with existing infrastructure that delivers freshwater to other parts of California.',
            paragraphs: [],
            mapSelectionKey: 'tunnel-pumping',
          },
        ],
      },
      {
        title: 'A comparison, not an endorsement',
        navigationLabel: 'Key Takeaway',
        paragraphs: [
          'Many project participants requested that A Tunnel be included because of its scale and importance in California water debates, not necessarily because they support its construction.',
          'While A Tunnel creates an alternative conveyance route that is less directly exposed to salinity intrusion and levee failures within Delta channels, it also asks: Could bypassing parts of the Delta improve statewide water delivery reliability, and what consequences might that create for the Delta?',
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
