import { scenarioName, scenarioSlug } from '../names'
import type { ScenarioContent } from './types'

export const aTunnel: ScenarioContent = {
  slug: scenarioSlug('tunnel'),
  number: '05',
  title: scenarioName('tunnel', 'scenarioStory'),
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
  closingParagraph:
    'Explore the modeling results and evaluation criteria to see where these effects fall and who they reach.',
}
