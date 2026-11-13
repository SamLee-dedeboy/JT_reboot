// The scenarios landing page's words: the hero, the four sticky panels, the adaptation
// scenario cards and the next steps. src/features/scenario-narration keeps only layout.
import { assetUrl } from '@/utils/baseUrl'
import { scenarioName } from './names'

export const LANDING_HERO = {
  title: 'Choose a future to explore',
  body: 'Start with current operations, then move through outflow variations and adaptation pathways to compare what different Delta futures ask of communities, ecosystems, and water systems.',
}

/** The page's sections, in order: each panel's anchor, rail label, heading, text and color. */
export const LANDING_PANELS = [
  {
    id: 'current-operations',
    railLabel: 'Current Operations',
    title: 'Understand Current Operations',
    body: 'Review the current operations and understand the key parameters that shape how we model the Delta.',
    bgcolor: 'base.700',
    image: '/images/scenarios/web/business-as-usual.webp',
  },
  {
    id: 'tiered-outflows',
    railLabel: 'Outflow Variations',
    title: 'Explore Outflow Variations',
    body: 'How does increasing or decreasing how much water flows through the Delta change salinity relative to current operations?',
    bgcolor: 'base.500',
  },
  {
    id: 'adaptation-scenarios',
    railLabel: 'Adaptation Scenarios',
    title: 'Explore Adaptation Scenarios',
    body: 'How do five potential adaptation strategies shape communities, ecosystems, and water systems across the Delta?',
    bgcolor: 'base.800',
  },
  {
    id: 'whats-next',
    railLabel: "What's Next?",
    title: "What's next?",
    body: 'Dive deeper into the scenarios — examine the modeling results for each future, review the criteria used to evaluate them, test how scenarios change with two feet of sea-level rise, and compare the scenarios from diverse perspectives through visualizations.',
    bgcolor: 'base.700',
  },
] as const

export const ADAPTATION_CARDS = [
  {
    title: scenarioName('em', 'scenarioStory'),
    image: assetUrl('/images/scenarios/web/eco-machine-2.webp'),
    eyebrow: '01',
    body: 'Where can tidal restoration be implemented in the Delta to strategically reduce salinity, while also creating ecological, eco-cultural, recreational, and community benefits?',
    href: '/scenarios/eco-machine',
  },
  {
    title: scenarioName('ngw', 'scenarioStory'),
    image: assetUrl('/images/scenarios/web/new-green-watershed.webp'),
    eyebrow: '02',
    body: 'In addition to tidal restoration, what if the Delta and larger watershed were holistically restored to reduce systemic risks to the Delta’s water infrastructure, transition to a more regenerative and sustainable economy, and advance Indigenous sovereignty?',
    href: '/scenarios/new-green-watershed',
  },
  {
    title: scenarioName('bf', 'scenarioStory'),
    image: assetUrl('/images/scenarios/web/bolster-fortify-2.webp'),
    eyebrow: '03',
    body: 'What if reinforced levees combined with operable gates created a more resilient freshwater corridor through the Delta?',
    href: '/scenarios/bolster-and-fortify',
  },
  {
    title: scenarioName('cor', 'scenarioStory'),
    image: assetUrl('/images/scenarios/web/calling-on-reserves.webp'),
    eyebrow: '04',
    body: 'What if the state’s major dams and reservoirs were operated differently \u2013 mainly by changing when and how water is stored and released \u2013 to improve drought resilience, manage salinity, and better support aquatic ecosystems?',
    href: '/scenarios/calling-on-reserves',
  },
  {
    title: scenarioName('tunnel', 'scenarioStory'),
    image: assetUrl('/images/scenarios/web/a-tunnel.webp'),
    eyebrow: '05',
    body: 'What if a large tunnel \u2014 the Delta Conveyance Project, or DCP—were constructed to divert freshwater from the Sacramento River during high storm flows and convey that water underground to export pumps in the South Delta?',
    href: '/scenarios/a-tunnel',
  },
]

export const NEXT_STEPS = [
  {
    number: '01',
    title: 'Modeling',
    body: 'See how each future is represented in the hydrodynamic model, then explore modeled salinity for the outflow variations, the adaptation scenarios, and the adaptation scenarios with two feet of sea-level rise.',
    label: 'Explore modeling',
    href: '/scenarios/modeling',
  },
  {
    number: '02',
    title: 'Evaluation',
    body: 'Review the five criteria used to evaluate each scenario (ecology, environmental justice, eco-cultural restoration, recreation, and the economy) and how one scenario looks across all of them.',
    label: 'Review evaluation',
    href: '/scenarios/evaluation',
  },
  {
    number: '03',
    title: 'Scenario ranking',
    body: 'Use the ranking visualization to compare overall scenario scores and see how different priorities and weighting choices affect which futures rise to the top.',
    label: 'Open ranking visualization',
    href: '/scenarios/ranking',
  },
] as const
