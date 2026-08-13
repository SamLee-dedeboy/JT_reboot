export const evaluationCriteria = [
  { id: 'salinity', label: 'Salinity' },
  { id: 'ecology', label: 'Ecology' },
  { id: 'community', label: 'Community' },
  { id: 'economy', label: 'Economy' },
  { id: 'recreation', label: 'Recreation' },
  { id: 'tribes', label: 'Tribes' },
] as const

export interface ScenarioContent {
  slug: string
  number: string
  title: string
  image: string
  summary: string
  narrative: string[]
  keyParameters: Array<{ label: string; value: string }>
  mapFeatures: string[]
}

export const scenarios: ScenarioContent[] = [
  {
    slug: 'business-as-usual',
    number: '01',
    title: 'Business as Usual',
    image: '/images/scenarios/business-as-usual.jpg',
    summary:
      'Current operations continue forward, providing a shared point of comparison for every adaptation pathway.',
    narrative: [
      'This scenario carries current water-management practices into the future.',
      'Use it as the reference condition for understanding how each adaptation changes Delta outcomes.',
    ],
    keyParameters: [
      { label: 'Operations', value: 'Current practice' },
      { label: 'Adaptation focus', value: 'Reference condition' },
      { label: 'Comparison role', value: 'Baseline' },
    ],
    mapFeatures: [
      'Existing water infrastructure',
      'Current habitat footprint',
      'Communities and monitoring locations',
    ],
  },
  {
    slug: 'eco-machine',
    number: '02',
    title: 'Eco Machine',
    image: '/images/scenarios/eco-machine-2.JPG',
    summary:
      'A nature-based future that works with wetlands, habitat, and water flows as living infrastructure.',
    narrative: [
      'Eco Machine asks what restoration can do as infrastructure.',
      'It explores how connected habitat and managed water flows could support people and ecosystems together.',
    ],
    keyParameters: [
      { label: 'Primary strategy', value: 'Nature-based infrastructure' },
      { label: 'Landscape focus', value: 'Wetlands and habitat' },
      { label: 'Water approach', value: 'Managed ecological flows' },
    ],
    mapFeatures: [
      'Restoration opportunity areas',
      'Wetland and habitat connections',
      'Water-quality monitoring locations',
    ],
  },
  {
    slug: 'new-green-watershed',
    number: '03',
    title: 'New Green Watershed',
    image: '/images/scenarios/new-green-watershed.jpg',
    summary:
      'A watershed-scale path focused on upstream change, regenerative landscapes, and green infrastructure.',
    narrative: [
      'This pathway connects Delta outcomes to land and water choices across the wider watershed.',
      'It emphasizes coordinated ecological restoration and land-use adaptation.',
    ],
    keyParameters: [
      { label: 'Primary strategy', value: 'Green infrastructure' },
      { label: 'Planning scale', value: 'Watershed' },
      { label: 'Land-use focus', value: 'Regenerative transition' },
    ],
    mapFeatures: [
      'Watershed interventions',
      'Restoration and land-use areas',
      'Delta inflow connections',
    ],
  },
  {
    slug: 'calling-on-reserves',
    number: '04',
    title: 'Calling on Reserves',
    image: '/images/scenarios/calling-on-reserves.jpg',
    summary:
      'A future that leans on stored capacity and emergency reserves to respond to periods of stress.',
    narrative: [
      'Calling on Reserves explores reliability when backup systems play a larger role.',
      'It highlights where added flexibility can reduce risk and where it may create new tradeoffs.',
    ],
    keyParameters: [
      { label: 'Primary strategy', value: 'Stored reserves' },
      { label: 'Operating mode', value: 'Responsive deployment' },
      { label: 'Planning focus', value: 'Reliability and risk' },
    ],
    mapFeatures: [
      'Storage and reserve locations',
      'Conveyance connections',
      'Communities exposed to shortage',
    ],
  },
  {
    slug: 'bolster-and-fortify',
    number: '05',
    title: 'Bolster and Fortify',
    image: '/images/scenarios/bolster-fortify-2.JPG',
    summary:
      'A protection-focused path built around stronger edges, defenses, and critical infrastructure.',
    narrative: [
      'Bolster and Fortify asks what can be secured through stronger physical defenses.',
      'It also makes visible the places and values that remain beyond those protections.',
    ],
    keyParameters: [
      { label: 'Primary strategy', value: 'Structural protection' },
      { label: 'Infrastructure focus', value: 'Levees and edges' },
      { label: 'Planning focus', value: 'Flood resilience' },
    ],
    mapFeatures: [
      'Priority levee reaches',
      'Protected assets and communities',
      'Residual flood-risk areas',
    ],
  },
  {
    slug: 'a-tunnel',
    number: '06',
    title: 'A Tunnel',
    image: '/images/scenarios/a-tunnel.jpg',
    summary:
      'A conveyance-centered future that moves water differently through and around the Delta.',
    narrative: [
      'A Tunnel explores the system-wide effects of a major new conveyance pathway.',
      'It supports comparison of water, habitat, and community outcomes across the Delta.',
    ],
    keyParameters: [
      { label: 'Primary strategy', value: 'New conveyance' },
      { label: 'Infrastructure focus', value: 'Tunnel system' },
      { label: 'Planning focus', value: 'System-wide effects' },
    ],
    mapFeatures: [
      'Proposed conveyance alignment',
      'Intake and outlet areas',
      'Affected waterways and communities',
    ],
  },
]

export const scenarioBySlug = Object.fromEntries(
  scenarios.map((scenario) => [scenario.slug, scenario]),
)
