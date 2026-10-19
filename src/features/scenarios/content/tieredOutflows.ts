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
      ],
    },
    {
      title: 'More outflow, a fresher Delta',
      navigationLabel: '30% increase in outflow',
      paragraphs: [
        'Increasing the amount of freshwater flowing through the Delta generally pushes saltwater farther toward the ocean, potentially reducing salinity in the Delta.',
        'We explored a 30% increase in Delta outflow relative to current operations, through reductions in exports. While increasing outflow could help reduce salinity in parts of the Delta, sustaining higher flows can be challenging and can have tradeoffs, especially during droughts when water is also needed elsewhere in California.',
      ],
    },
    {
      title: 'Less outflow, a saltier Delta',
      navigationLabel: '10% decrease in outflow',
      paragraphs: [
        'Reducing freshwater outflow allows saltwater to move farther inland, potentially intensifying existing challenges for Delta communities, ecosystems, and water users.',
        'We explored a 10% decrease in Delta outflow relative to current operations to understand how it would create saltier conditions in the Delta’s waterways. If Delta outflows are reduced in the future (via changes in policy, increased upstream uses, or reduced supplies), it will lead to increased salinity in the Delta.',
      ],
    },
    {
      title: 'Other Flow Changes to the Delta',
      paragraphs: [
        'Changing how much water flows through the Delta involves difficult trade-offs between competing water needs. Outcomes also depend on how water flows are increased, such as by changes in upstream uses and reservoir release, or by reductions in water exports from the Delta. Our modeled variations in Delta outflow were limited to changes in exports. Reductions in upstream uses to increase flows could be modelled in future efforts.',
        'The seasonal timing of changes in flows is also a critical factor for outcomes. Two of our other project scenarios also explore these timed changes in flow: A Tunnel and Calling on Reserves.',
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
