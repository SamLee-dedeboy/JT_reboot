// The modeling page's words and facts: its sections, the three baselines, how each future is
// built, the models' outputs and simulation periods. src/features/scenario-modeling keeps layout.
import { scenarioName, scenarioSlug } from './names'

export const overviewNavigation = [
  { id: 'how-modeled', label: 'How are scenarios modeled?' },
  { id: 'shared-baseline', label: 'Three baselines', indent: true },
  { id: 'outflow-variations', label: 'Outflow variations', indent: true },
  { id: 'adaptation-scenarios', label: 'Adaptation scenarios', indent: true },
  { id: 'modeled-salinity', label: 'Where salinity changes' },
  { id: 'next-step', label: 'How scenarios are evaluated' },
] as const

export const outflowVariations = [
  { id: 'plus30', group: 'outflow', label: '+30% Delta outflow' },
  { id: 'minus10', group: 'outflow', label: '−10% Delta outflow' },
] as const

export const implementationDetails = [
  {
    id: 'eco',
    group: 'landscape',
    slug: scenarioSlug('em'),
    label: scenarioName('em', 'scenarioStory'),
    detailTitle: 'Two areas restored',
    lead: 'The model reshapes the landscape at two places.',
  },
  {
    id: 'ngw',
    group: 'landscape',
    slug: scenarioSlug('ngw'),
    label: scenarioName('ngw', 'scenarioStory'),
    detailTitle: 'Six areas restored',
    lead: 'The model keeps both Eco Machine areas and adds four more.',
  },
  {
    id: 'bolster',
    group: 'landscape',
    slug: scenarioSlug('bf'),
    label: scenarioName('bf', 'scenarioStory'),
    detailTitle: 'When the Franks Tract gates close',
    lead: 'Two operable gates at Franks Tract close three times in the run, limiting saltwater movement along the freshwater corridor.',
  },
  {
    id: 'tunnel',
    group: 'flow',
    slug: scenarioSlug('tunnel'),
    label: scenarioName('tunnel', 'scenarioStory'),
    detailTitle: 'A new route beneath the Delta',
    lead: 'A Tunnel is based on the Bethany Reservoir Alignment of the proposed Delta Conveyance Project.',
  },
  {
    id: 'reserves',
    group: 'flow',
    slug: scenarioSlug('cor'),
    label: scenarioName('cor', 'scenarioStory'),
    detailTitle: 'How Shasta Dam releases change',
    lead: 'Each bar is one month’s release at Shasta Dam, in cubic feet per second (cfs), compared with CalSim Baseline. Shading marks periods of higher flow above the line and lower flow below it.',
  },
] as const

export const implementationGroups = [
  {
    id: 'landscape',
    title: 'Changes to landscape, compared with the Baseline',
    options: implementationDetails.filter(({ group }) => group === 'landscape'),
  },
  {
    id: 'flow',
    title: 'Changes to water flow, compared with CalSim Baseline',
    options: implementationDetails.filter(({ group }) => group === 'flow'),
  },
]

export const ecoMachineAreas = [
  {
    name: 'Suisun Marsh',
    body: 'Managed wetlands become tidal wetlands, directing tidal energy toward the marsh.',
  },
  {
    name: 'Franks Tract',
    body: 'Landforms built inside the tract, following the Franks Tract Futures design, mostly block salty water from moving farther into the Delta.',
  },
] as const

export const newGreenWatershedAreas = [
  { name: 'Suisun Marsh', inEcoMachine: true },
  { name: 'Franks Tract', inEcoMachine: true },
  { name: 'Dutch Slough', inEcoMachine: false },
  { name: 'Egbert Tract', inEcoMachine: false },
  { name: 'Hastings Tract', inEcoMachine: false },
  { name: 'Northern Cache Slough Complex', inEcoMachine: false },
] as const

export const baselineRows = [
  {
    baseline: scenarioName('hist'),
    description: 'Current conditions modeled in SCHISM.',
    model: 'SCHISM',
    changes: ['Amount of Delta outflow', 'through changes in exports'],
    group: 'outflow',
    scenarios: '2 outflow variations',
  },
  {
    baseline: 'Baseline',
    description:
      'Current conditions modeled in RMA, including planned restoration at sites such as Little Egbert Tract and Prospect Island.',
    model: 'RMA',
    changes: ['Landscape'],
    group: 'landscape',
    scenarios: '3 adaptation scenarios',
  },
  {
    baseline: 'CalSim Baseline',
    description:
      'Current conditions modeled in RMA on the same landscape as Baseline, driven by CalSim flows.',
    model: 'RMA',
    changes: ['Water flow'],
    group: 'flow',
    scenarios: '2 adaptation scenarios',
  },
] as const

// Water age sits last: unlike the other two, it exists only as snapshots, and only in RMA.
export const modeledOutputs = [
  {
    title: 'Salinity',
    body: 'Electrical conductivity (EC) shows how salty or fresh the water is and how the salinity boundary moves through the Delta.',
  },
  {
    title: 'Water temperature',
    body: 'Modeled temperature helps identify when and where conditions may support or stress temperature-sensitive species.',
  },
  {
    title: 'Water age',
    body: 'The time since water entered an area helps identify slow-moving conditions that may favor harmful algal blooms.',
    availability: 'We only have snapshots of water age, not a full time series.',
    adaptationOnly: true,
  },
] as const

/** Each model's run on its own axis, sized in days from the start of spin-up. */
export const simulationTimelines = {
  schism: {
    ariaLabel:
      'SCHISM timeline: spin-up from August 11 to September 30, 2020, then critical water year 2021 and the start of critical water year 2022, ending January 1, 2022.',
    days: 508,
    spinUpLabel: 'Spin-up, Aug 11–Sep 30, 2020',
    // Too narrow to hold its own label, so the last period is named above it.
    endLabel: 'Critical water year 2022',
    periods: [
      { days: 51, tone: 'spinUp' },
      { days: 365, label: 'Critical water year 2021', tone: 'critical' },
      { days: 92, tone: 'critical', divided: true },
    ],
    ticks: [
      { day: 51, label: 'Oct 2020' },
      { day: 416, label: 'Oct 2021' },
      { day: 508, label: 'Jan 2022' },
    ],
  },
  rma: {
    ariaLabel:
      'RMA timeline: spin-up in August and September 2018, wet water year 2019, dry water year 2020, then critical water year 2021 for October and November 2020.',
    days: 853,
    spinUpLabel: 'Spin-up, Aug–Sep 2018',
    endLabel: 'Critical water year 2021, Oct–Nov 2020',
    periods: [
      { days: 61, tone: 'spinUp' },
      { days: 365, label: 'Wet water year 2019', tone: 'wet' },
      { days: 366, label: 'Dry water year 2020', tone: 'dry' },
      { days: 61, tone: 'critical', divided: true },
    ],
    ticks: [
      { day: 61, label: 'Oct 2018' },
      { day: 426, label: 'Oct 2019' },
      { day: 792, label: 'Oct 2020' },
    ],
  },
} as const

export type OverviewSectionId = (typeof overviewNavigation)[number]['id']

export type Implementation = (typeof implementationDetails)[number]

export type ImplementationId = Implementation['id']

export type Future = (typeof outflowVariations)[number] | Implementation

export type StationModel = keyof typeof simulationTimelines

export type SimulationPeriodData = (typeof simulationTimelines)[StationModel]['periods'][number]
