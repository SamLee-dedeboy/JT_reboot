// The Background and Key Parameters pages: how the Delta works before any scenario.
export const baselineBackgroundChapters = [
  {
    id: '01',
    kicker: 'Two Rivers',
    title: 'California has two major river systems shaping the Delta',
    body: 'The Sacramento River flows south from Northern California, while the San Joaquin River flows north through the Central Valley. They meet in the Sacramento-San Joaquin Delta, where freshwater moves toward Suisun Bay, San Francisco Bay, and the Pacific Ocean.',
    mapStep: 'rivers',
  },
  {
    id: '02',
    kicker: 'The Push and Pull',
    title: 'Freshwater outflow pushes west while ocean water pushes inland',
    body: 'Delta management is shaped by a tug of war: river outflow helps repel salty ocean water, while tides and sea level pressure can move saltwater inland. At the same time, major state and federal water projects export drinking and agricultural water from the southern Delta to communities and farms farther south.',
    mapStep: 'flow',
  },
  {
    id: '03',
    kicker: 'X2 Distance',
    title: 'X2 helps measure where that tug of war is happening',
    body: 'The X2 salinity index tracks how far the low-salinity zone extends inland from the Golden Gate. In the StoryMap baseline, this distance is shown along the Sacramento and San Joaquin rivers in five-kilometer increments, making X2 a useful shorthand for understanding where freshwater outflow and ocean inflow are meeting.',
    mapStep: 'x2',
  },
] as const

export const baselineKeyTerms = [
  ['Outflow', 'Freshwater moving from the rivers through the Delta toward the Bay.'],
  [
    'Salinity intrusion',
    'Saltier Bay water moving inland when tides, sea level, or low river flows allow it.',
  ],
  [
    'Exports',
    'Water diverted from the southern Delta for farms and drinking water in other parts of California.',
  ],
  ['X2', 'A distance-based salinity marker used to track the low-salinity zone.'],
] as const

export const keyParametersIntroduction =
  'Placeholder page for the baseline scenario parameters. This will hold the modeling assumptions, boundary conditions, and comparison inputs for the baseline scenario.'
