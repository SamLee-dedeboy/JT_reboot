import { scenarioName, scenarioSlug } from '../names'
import type { ScenarioContent } from './types'

export const callingOnReserves: ScenarioContent = {
  slug: scenarioSlug('cor'),
  number: '04',
  title: scenarioName('cor', 'scenarioStory'),
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
      ],
    },
  ],
  mapFeatures: [
    'Shasta Reservoir and the Sacramento River',
    'Freshwater inflow to the Delta',
    'Habitats connected to changing flow conditions',
  ],
  closingParagraph:
    'Explore the modeling results and evaluation criteria to see where these effects fall and who they reach.',
}
