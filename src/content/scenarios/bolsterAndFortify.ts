import { scenarioName, scenarioSlug } from '../names'
import type { ScenarioContent } from './types'

export const bolsterAndFortify: ScenarioContent = {
  slug: scenarioSlug('bf'),
  number: '03',
  title: scenarioName('bf', 'scenarioStory'),
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
      ],
    },
  ],
  mapFeatures: [
    'Proposed gates and reconstructed levees at Franks Tract',
    'The fortified Old River freshwater corridor',
    'Clifton Court Forebay and the southern pumping plants',
  ],
  closingParagraph:
    'Explore the modeling results and evaluation criteria to see where these effects fall and who they reach.',
}
