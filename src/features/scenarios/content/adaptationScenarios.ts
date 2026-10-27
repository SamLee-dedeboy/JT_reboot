import type { ScenarioContent } from './types'

export const adaptationScenarios: ScenarioContent[] = [
  {
    slug: 'eco-machine',
    number: '01',
    title: 'Eco Machine',
    image: '/images/scenarios/web/eco-machine-2.webp',
    summary:
      'Implementing tidal wetland restoration where it can reduce salinity intrusion, while also creating ecological, eco-cultural, recreational and community benefits.',
    story: [
      {
        role: 'motivation',
        title: 'Where can restoration be implemented in the Delta to help manage salinity?',
        paragraphs: [
          'Each day, tides carry salt water from San Francisco Bay into the Delta. Freshwater flowing downstream helps resist that movement, but drought and sea level rise can allow salinity to travel farther inland, affecting ecosystems, communities, agriculture, and freshwater supplies.',
          "The shape of the Delta's landscapes and waterways also heavily influence how tidal water moves and where salt travels. These flow patterns can be intentionally altered by reconnecting and rebuilding tidal wetlands within the Delta. The Eco Machine scenario explores where tidal restoration could be implemented to manage salinity while providing ecological and community benefits.",
        ],
      },
      {
        role: 'design',
        title: 'Two locations for multi-benefit restoration',
        paragraphs: [
          'Eco Machine explores restoration on Suisun Marsh and Franks Tract, two locations where changes to the landscape could influence tidal movement and salinity intrusion. Each location offers a different approach to managing salinity while supporting habitat restoration, recreation, and community use.',
        ],
        highlights: [
          {
            title: 'Suisun Marsh: Redirecting tidal energy',
            summary:
              'By restoring tidal connections in Suisun Marsh, tidal energy is directed more toward Suisun Marsh, rather than farther inland and into the central Delta. The scenario examines whether this marsh conversion (from managed wetlands to tidal wetlands) could reduce salinity intrusion while expanding marsh habitat and access to the landscape.',
            paragraphs: [],
            mapSelectionKey: 'suisun-marsh',
          },
          {
            title: 'Franks Tract: Reshaping water pathways',
            summary:
              'Franks Tract is a subsided and former Delta island that has been flooded since its levees failed in the 1930s. Today it is a unique State Park offering a variety of water-based recreational opportunities, such as boating and fishing. But given its location in the central Delta, this large open-water area is a primary source of salinity intrusion.',
            paragraphs: [
              'By building a set of landforms within the Tract, salty water would be mostly blocked from entering further into the Delta. These islands would be created by mounding up earth with the tract, primarily by dredging, which would also create deeper areas that are more navigable for boaters. The island masses would be built up to sea level to become tidal wetlands. These wetlands would be shaped and arranged in the center of the tract to preserve open water areas near adjacent homes on Bethel Island, and to create new recreational features (such as beaches and sheltered coves) while also diversifying and creating new habitat for a range of aquatic and terrestrial species.',
              'The scenario draws on Franks Tract Futures, a 2019–2020 public planning effort that brought together communities and experts to develop a multi-benefit restoration design.',
            ],
            mapSelectionKey: 'franks-tract',
          },
        ],
      },
      {
        role: 'ecocultural',
        title: 'Eco-cultural opportunities',
        paragraphs: [
          'The new wetlands and restored habitats for both Suisun Marsh and Franks Tract would also offer potential opportunities for eco-cultural restoration and Indigenous stewardship, which would be integrated into planning and design.',
        ],
      },
      {
        role: 'keyBenefits',
        title: 'More habitat, at the cost of a saltier Suisun Marsh',
        paragraphs: [
          'Eco Machine adds tens of thousands of acres of tidal wetland in Suisun Marsh and Franks Tract that aquatic species can reach, with a small gain for the food web that feeds them. That restoration also opens eco-cultural opportunities, and conditions for recreation improve slightly in the Central Delta. Because almost none of the restored land is farmed, the effect on the agricultural economy is close to neutral.',
          'The trade-offs are concentrated in Suisun Marsh, which becomes saltier and a little less suited to birding, waterfowl hunting, and angling. Conditions for harmful algal blooms are slightly worse than Business as Usual, and the restoration carries a one-time construction cost estimated at $0.85–1.5 billion.',
          'Explore the modeling results and evaluation criteria to see where these effects fall and who they reach.',
        ],
      },
    ],
    mapFeatures: ['Suisun Marsh and Grizzly Island', 'Franks Tract and its tidal connections'],
  },
  {
    slug: 'new-green-watershed',
    number: '02',
    title: 'New Green Watershed',
    image: '/images/scenarios/web/new-green-watershed.webp',
    summary:
      'The Delta and its watershed are restored as one connected system, allowing land and ecosystems to help manage water salinity, flooding, and climate risk.',
    story: [
      {
        role: 'motivation',
        title: 'What if the landscape could help manage water?',
        paragraphs: [
          'Much of the Delta has been managed by draining wetlands for agriculture and holding water behind levees. This approach has supported farms and communities, but it has also contributed to a growing problem: when peat is exposed to air, it decomposes and releases greenhouse gases. Losing drying soil to decomposition also causes the land to sink, leading to growing differences in elevation between the Delta channels and the land behind the levees.',
          'Some Delta islands are now 20 to 25 feet below sea level. Water moves through channels high above the land, increasing pressure on the levees that protect communities and farms. If a levee fails, water can rapidly flood the deeply subsided island. The resulting changes in Delta waterways can also draw saltier water farther inland, affecting agriculture, ecosystems, communities, and freshwater supplies across California.',
          'New Green Watershed asks whether restoring landscapes and adapting land uses could address these connected risks while supporting regenerative farming, habitat, cultural practices, and a more sustainable regional economy. The scenario explores the multi-benefit possibilities of restoration both within the Delta and its much larger watershed.',
        ],
      },
      {
        role: 'design',
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
        role: 'supporting',
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
        role: 'keyBenefits',
        title: 'The largest benefits, and the largest cost to farming',
        paragraphs: [
          'New Green Watershed delivers the largest gains of any scenario for the Delta’s ecosystem: about 80,000 acres of tidal wetland that aquatic species can reach, the biggest boost to the food web, and the most restoration, both in the Delta and in the upper watershed. Keeping peat soils wet helps reverse subsidence, and upstream restoration cuts flood risk more than any other scenario, alongside a small improvement in drinking water for vulnerable communities.',
          'Those benefits depend on converting farmland. Agricultural revenue falls by about $280 million a year in the version scored here, and by $210–500 million a year across the versions considered. Suisun Marsh also becomes saltier for birding, waterfowl hunting, and angling, and conditions for harmful algal blooms are moderately worse. As a long-term vision, it also asks the most of land use and governance.',
          'Explore the modeling results and evaluation criteria to see where these effects fall and who they reach.',
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
    image: '/images/scenarios/web/calling-on-reserves.webp',
    summary: 'Adjusting the timing and amount of water released from large dam reservoirs.',
    story: [
      {
        role: 'motivation',
        title: 'How can changes in reservoir operations help manage Delta salinity?',
        paragraphs: [
          'Upstream reservoirs capture and store freshwater for communities, agriculture, and ecosystems. Water managers decide when to hold that water and when to release it downstream, balancing immediate needs against future shortages. These decisions become especially difficult during prolonged droughts, when water supplies are limited and future conditions are uncertain.',
          'Holding water in reserve can help protect against future shortages. Releasing it can increase freshwater flows into the Delta, help resist salinity intrusion, and support species that depend on seasonal river flows.',
          'Calling on Reserves asks whether changing reservoir operations — the timing and amount of water released — could better balance these competing water needs.',
        ],
      },
      {
        role: 'design',
        title: 'Rethinking reservoir releases',
        paragraphs: [
          'Calling on Reserves focuses on modeling a specific reservoir as an example, which is Shasta Dam and Reservoir, the largest reservoir in the Sacramento River watershed with a capacity of 4,552,000 acre-feet.',
        ],
        subsections: [
          {
            title: 'When and how much water is released',
            paragraphs: [
              'The overall goal of this modeled scenario is to increase year-to-year carryover storage in Shasta Reservoir by 20% (from current standards) by reducing demand and timing releases in ways that most benefit fish. This is done through reductions to Central Valley Project (CVP) contractor allocations - including Settlement, Exchange, and ag service contractors north and south of the Delta. The model’s logic used for these reductions is based on the U.S. Bureau of Reclamation’s “modified natural hydrograph, Alt 3 scenario” to adjust CVP allocations in response to a target Shasta storage. The increase in carryover is considered a target and not a guarantee since there is inherent uncertainty in the hydrologic forecasts that are part of complex allocation procedures. Changing CVP allocations affects many other parts of the state’s water infrastructure delivery system as the balancing among reservoirs (Trinity, Shasta, and Folsom) will shift, the timing and volume of releases and river flows for deliveries will change, and the coordinating operating agreement (COA) balance between Central Valley Project and State Water Project may change.',
              'In addition, the higher Shasta storage leading into a wet winter season can lead to more frequent or larger (or both) flood releases from Shasta. These spills may show up as additional Delta inflow. Reduced allocations may show up as reduced export pumping. These factors together can affect salinity in different parts of the Delta.',
            ],
          },
        ],
      },
      {
        role: 'ecocultural',
        title: 'Eco-cultural benefits',
        paragraphs: [
          'Dam releases that attempt to functionally mimic more natural yearly flows and hydrographs can improve conditions and survival for migratory fish such as salmon, and additional reservoir storage can help support adequate river flows for fish during droughts.',
        ],
      },
      {
        role: 'keyBenefits',
        title: 'Modest gains without building anything new',
        paragraphs: [
          'Calling on Reserves changes how existing reservoirs are operated rather than building new facilities or altering the Delta’s landscape. Against its own baseline it is close to neutral for the agricultural economy and for recreation, and slightly better for eco-cultural values. In the wet year it adds suitable days for juvenile Chinook salmon, and in the dry year it reduces them for the undesirable largemouth bass and Brazilian waterweed.',
          'Drinking water is where it falls short: threshold exceedances rise for vulnerable communities, most of all in the wet season, and conditions for harmful algal blooms are slightly worse. It adds no habitat. Drawing on stored water also raises the question of whether more flexible releases can keep the long-term reliability that reservoirs provide.',
          'Explore the modeling results and evaluation criteria to see where these effects fall and who they reach.',
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
    image: '/images/scenarios/web/bolster-fortify-2.webp',
    summary:
      'Engineered gates and reinforced levees create a more controlled and reliable freshwater corridor through the Delta connected to the southern pumping plants.',
    story: [
      {
        role: 'motivation',
        title: 'What if we could create a more reliable freshwater corridor?',
        paragraphs: [
          'Freshwater supplies currently travel through a network of Delta channels, supplying water to in-Delta communities and for export to other regions and urban areas across California. During droughts, reduced river flows can allow salinity to move farther inland, impacting water quality as it moves through this system. Also, rising sea levels will continue to push tides and salty water further into the Delta.',
          'Much of the Delta’s leveed waterways run alongside deeply subsided islands, where water in the channels sits high above the surrounding land. A levee failure could flood communities and farmland, and threaten the pathways that move freshwater south.',
          'Bolster and Fortify explores whether targeted infrastructure improvements could make freshwater delivery more reliable while limiting salinity intrusion during drought.',
        ],
      },
      {
        role: 'design',
        title: 'Creating a managed freshwater corridor',
        paragraphs: [
          'Bolster and Fortify focuses on a proposed Through-Delta Corridor that guides freshwater from the San Joaquin River through Old River toward Clifton Court Forebay and the southern pumping plants.',
          'The corridor combines three interventions:',
        ],
        highlights: [
          {
            title: 'Reconstruct levees to hold back saltwater',
            summary:
              'Franks Tract has remained flooded since its levees failed in the 1930s and is a primary pathway for salinity intrusion into the Delta. Rebuilding the degraded levees on the eastern edges of the tract, together with operable gates, will effectively block salty tidal water from entering the freshwater corridor.',
            paragraphs: [],
            mapSelectionKey: 'reconstructed-levees',
          },
          {
            title: 'Install operable gates at Franks Tract',
            summary:
              'Two operable salinity-control gates are proposed near the northeastern and southeastern corners of Franks Tract. During drought, these gates could limit saltwater movement to protect freshwater quality along the corridor.',
            paragraphs: [],
            mapSelectionKey: 'operable-gates',
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
        role: 'keyBenefits',
        title: 'A protected corridor, with little change elsewhere',
        paragraphs: [
          'Bolster and Fortify gives operators more control over freshwater moving through the Delta. Islands along the fortified corridor see a moderate cut in flood risk, and drinking-water conditions for vulnerable communities hold steady.',
          'Beyond the corridor, little changes for habitat, species, recreation, or eco-cultural values, and the flood benefit reaches only the islands along it. Salinity costs agriculture a small amount in dry years, more with sea-level rise, and water in Franks Tract at times grows much older. Gates can also change circulation beyond the corridor and impede boating, and building and running them requires substantial investment.',
          'Explore the modeling results and evaluation criteria to see where these effects fall and who they reach.',
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
    image: '/images/scenarios/web/a-tunnel.webp',
    summary:
      'Some Sacramento River water is diverted in the northern Delta and carried beneath the Delta to Bethany Reservoir through a more direct, protected route.',
    story: [
      {
        role: 'motivation',
        title: 'What if some water traveled beneath the Delta?',
        paragraphs: [
          'Freshwater bound for other parts of California currently travels through Delta channels before reaching the southern pumping plants. Along the way, salinity intrusion can affect water quality, while levee failures or earthquakes could disrupt the delivery system.',
          'A Tunnel proposes a different approach. When conditions allow, some Sacramento River water would be diverted into an underground tunnel to the existing water delivery system in the south. This alternative route would make statewide water deliveries less vulnerable to changing conditions in Delta channels.',
          'However, diverting water upstream also means less Sacramento River water may flow through parts of the Delta. These changes could affect salinity, ecosystems, and communities that depend on Delta waterways.',
        ],
      },
      {
        role: 'design',
        title: 'Creating an underground freshwater route',
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
        role: 'keyBenefits',
        title: 'A comparison, not an endorsement',
        paragraphs: [
          'Many project participants requested that A Tunnel be included because of its scale and importance in California water debates, not necessarily because they support its construction.',
          'A Tunnel creates a conveyance route less exposed to salinity intrusion and levee failures within Delta channels. If its intakes intercept stormwater before it enters the Delta, it slightly cuts flood risk.',
          'Its drawbacks fall inside the Delta. In dry years the tunnel shifts salinity from the western to the central Delta, at a small cost to farms there, and it is slightly worse for recreation. It scores below Business as Usual for eco-cultural values and adds no habitat. The draft environmental justice evaluation found it the worst adaptation scenario for drinking water; those results are being revised.',
          'Explore the modeling results and evaluation criteria to see where these effects fall and who they reach.',
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
