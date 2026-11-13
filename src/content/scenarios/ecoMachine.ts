import { scenarioName, scenarioSlug } from '../names'
import type { ScenarioContent } from './types'

export const ecoMachine: ScenarioContent = {
  slug: scenarioSlug('em'),
  number: '01',
  title: scenarioName('em', 'scenarioStory'),
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
        'The trade-offs are concentrated in Suisun Marsh, which becomes saltier and a little less suited to birding, waterfowl hunting, and angling. Conditions for harmful algal blooms are slightly worse than Business as Usual, and the restoration carries a one-time construction cost estimated at $1.34 billion.',
      ],
    },
  ],
  mapFeatures: ['Suisun Marsh and Grizzly Island', 'Franks Tract and its tidal connections'],
  closingParagraph:
    'Explore the modeling results and evaluation criteria to see where these effects fall and who they reach.',
}
