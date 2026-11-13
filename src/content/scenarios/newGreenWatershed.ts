import { scenarioName, scenarioSlug } from '../names'
import type { ScenarioContent } from './types'

export const newGreenWatershed: ScenarioContent = {
  slug: scenarioSlug('ngw'),
  number: '02',
  title: scenarioName('ngw', 'scenarioStory'),
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
            'Near sea level, restored tidal wetlands, such as areas of Suisun Marsh, could reshape water and salinity movement while creating habitat and spaces for recreation and cultural practices.',
          mapHabitatType: 'tidal',
          paragraphs: [],
        },
        {
          title: 'Keeping peat soils wet',
          summary:
            'Keeping water in peat soils can stop the ground from sinking while supporting farming, habitat, carbon storage, and cultural uses. In deeply to moderately subsided Delta areas that remain protected by levees, the central strategy is to keep peat soils wet, so they stop decomposing and sinking.',
          mapHabitatType: 'soil',
          paragraphs: [
            'These lands could support a flexible mosaic of wetter uses, including rice farming, paludiculture, floating wetlands, and managed wetlands. Different practices could be designed for different benefits, such as tule production or plankton maximization. These land uses may also store carbon, create habitat, and provide new recreational and eco-cultural opportunities.',
          ],
        },
        {
          title: 'Maximizing habitat diversity in transitional areas',
          summary:
            'Transitional areas vary from subtidal to supratidal elevations. Because many species use the ecotones between these habitats, restoring connections among tidal areas, river channels, floodplains, and higher ground could provide unusually high ecological value.',
          mapHabitatType: 'transitional',
          paragraphs: [
            'These connections would give plants and wildlife more room to move among habitats as water levels rise and could reconnect Delta channels with non-subsided floodplains along the Delta’s edges.',
          ],
        },
        {
          title: 'Restoring fish migration channels',
          summary:
            'Restored side channels and native vegetation along riverbanks could give fish places to feed, shelter, and rest along their preferred migration routes.',
          mapHabitatType: 'riparian',
          paragraphs: [],
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
        label: 'Explore Habitat Restoration Upstream of the Delta',
        href: '/pages/watershed',
      },
      subsections: [
        {
          id: 'ecocultural-stewardship',
          title: 'Advancing eco-cultural restoration and Indigenous stewardship',
          paragraphs: [
            'New Green Watershed considers more than hydrologic and ecological outcomes. It also examines how restoration could support Indigenous access, authority, knowledge, and stewardship across the watershed.',
            'Potential eco-cultural benefits include:',
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
        label: 'Explore the eco-cultural criterion',
        href: '/scenarios/evaluation/ecocultural-restoration',
      },
    },
    {
      role: 'keyBenefits',
      title: 'The largest benefits, and the largest cost to farming',
      paragraphs: [
        'New Green Watershed delivers the largest gains of any scenario for the Delta’s ecosystem: about 80,000 acres of tidal wetland that aquatic species can reach, the biggest boost to the food web, and the most restoration, both in the Delta and in the upper watershed. Keeping peat soils wet helps reverse subsidence, and upstream restoration cuts flood risk more than any other scenario, alongside a small improvement in drinking water for vulnerable communities.',
        'Those benefits depend on converting farmland. Agricultural revenue falls by about $280 million a year in the version scored here, and by $210–500 million a year across the versions considered. Suisun Marsh also becomes saltier for birding, waterfowl hunting, and angling, and conditions for harmful algal blooms are moderately worse. As a long-term vision, it also asks the most of land use and governance.',
      ],
    },
  ],
  mapFeatures: [
    'Land subsidence and wet-soil land uses',
    'Tidal, upland, fish-passage, and riparian restoration',
    'Upstream forests, wet meadows, and floodplains',
  ],
  closingParagraph:
    'Explore the modeling results and evaluation criteria to see where these effects fall and who they reach.',
}
