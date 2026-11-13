import type { ScenarioContent } from './types'
import { scenarioName, scenarioSlug } from '../names'

export const baseline: ScenarioContent = {
  slug: scenarioSlug('bau'),
  number: '01',
  title: scenarioName('bau', 'scenarioStory'),
  image: '/images/scenarios/web/business-as-usual.webp',
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
}
