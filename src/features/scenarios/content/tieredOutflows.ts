import type { ScenarioContent } from './types'

export const tieredOutflowsScenario: ScenarioContent = {
  slug: 'tiered-outflows',
  number: 'Outflow variations',
  title: 'Delta Outflow Variations',
  image: '/images/scenarios/outflow.jpg',
  summary:
    'How could increasing or reducing the amount of freshwater moving through the Delta change salinity, ecosystems, communities, and water uses?',
  story: [
    {
      title: 'Why Delta outflow matters',
      paragraphs: [
        'The Sacramento and San Joaquin Rivers carry freshwater into the Delta, where it meets salty ocean water from San Francisco Bay. The balance between these water flows decides how far saltwater reaches inland.',
        'Changes in Delta freshwater outflow can affect water quality, habitat conditions, and freshwater availability, creating competing needs among different water users and ecosystems.',
      ],
    },
    {
      title: 'Less outflow, a saltier Delta',
      navigationLabel: '10% decrease in outflow',
      paragraphs: [
        'Reducing freshwater outflow allows saltwater to move farther inland, potentially intensifying existing challenges for Delta communities, ecosystems, and water users.',
        'We explore a 10% decrease in Delta outflow relative to current operations. While reducing outflow may leave more water available for other parts of California, it could worsen salinity conditions in parts of the Delta.',
      ],
    },
    {
      title: 'More outflow, a fresher Delta',
      navigationLabel: '30% increase in outflow',
      paragraphs: [
        'Increasing freshwater outflow generally pushes saltwater farther toward the ocean, potentially improving salinity conditions in the Delta.',
        'We explore a 30% increase in Delta outflow relative to current operations. While increasing outflow could help reduce salinity in parts of the Delta, sustaining higher flows can be challenging, especially during droughts when water is also needed elsewhere in California.',
      ],
    },
    {
      title: 'Beyond changing outflow',
      paragraphs: [
        'Changing Delta outflow involves difficult trade-offs between competing water needs.',
        'What other strategies could help manage salinity and protect ecosystems, communities, and water users in the Delta? Explore alternative scenarios to see how different approaches might reshape salinity conditions in the Delta.',
      ],
    },
  ],
  mapFeatures: [
    'Sacramento and San Joaquin freshwater pathways',
    'Salinity compliance and monitoring stations',
    'Places where modeled salinity differs from current operations',
  ],
}

