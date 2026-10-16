// Presets for 4c: one click to a configuration worth showing.
//
// Each one is a finding from the reports, chosen where the effect is large enough
// to see in the cells, and together they cover the shapes the pivot can take: a
// score grid, a period axis, places drawn on a map, parts of one metric, two
// measurements in one unit, places tabulated where there is no map, and criteria
// from several subteams in one view. A preset is only a selection; everything
// stays editable afterwards.
import type { ScenarioKey } from './model'

export interface PivotPreset {
  key: string
  label: string
  /** What the configuration shows, in one line, for whoever is presenting it. */
  finding: string
  criteria: string[]
  scenarios: ScenarioKey[]
  /** Empty means Delta-wide / not sliced. */
  places?: string[]
  periods?: string[]
  swapped?: boolean
}

export const PIVOT_PRESETS: PivotPreset[] = [
  {
    key: 'ballots',
    label: 'The five ballots',
    finding:
      'The chart shows every subteam’s score for every scenario. New Green Watershed draws the widest disagreement. Ecology gives it +4.5, while Economy gives it −4.',
    criteria: ['ecology', 'recreation', 'environmentalJustice', 'economy', 'ecoCultural'],
    scenarios: ['ngw', 'em', 'bf', 'cor', 'tunnel', 'bau'],
  },
  {
    key: 'ecology-year',
    label: 'Year beats scenario',
    finding:
      'Overbite clam finds suitable conditions in Suisun Bay on about 5% of days in the wet year under every scenario. That rises to about 50% in the dry year. The water year drives the number, while the scenario barely changes it.',
    criteria: ['eco-niche-overbiteClam'],
    scenarios: ['ngw', 'em', 'bf', 'cor', 'bau'],
    places: ['suisunBay'],
    periods: ['2019', '2020'],
    swapped: true,
  },
  {
    key: 'ecology-map',
    label: 'The middle estuary moves',
    finding:
      'In the dry year, Longfin smelt live only in Suisun Bay and the Confluence. The difference reading shows Calling on Reserves pushing them out of Suisun and into the Confluence.',
    criteria: ['eco-niche-longfinJuv'],
    scenarios: ['ngw', 'em', 'bf', 'cor', 'bau'],
    places: ['suisunBay', 'confluence', 'northDelta', 'centralDelta', 'southDelta'],
    periods: ['2020'],
  },
  {
    key: 'ej-classes',
    label: 'Who carries the exceedance',
    finding:
      'In the wet season, drinking water at the moderate-vulnerability points goes over the salinity threshold on about 5% to 9% of days under most scenarios. Under Calling on Reserves and A Tunnel that doubles, to 19% and 22%, which is worse. The highest-vulnerability points never go over at all.',
    criteria: ['ej-drinking-moderate', 'ej-drinking-high', 'ej-drinking-highest'],
    scenarios: ['ngw', 'em', 'bf', 'cor', 'tunnel', 'bau'],
    periods: ['wet'],
  },
  {
    key: 'economy-pathways',
    label: 'Salinity is not the story',
    finding:
      'Farm revenue losses in the dry year come mainly from land conversion, not salinity. Salinity costs at most tens of thousands of dollars. Under New Green Watershed, land conversion costs $282M.',
    criteria: ['econ-revenue-salinity', 'econ-revenue-half'],
    scenarios: ['ngw', 'bf', 'cor', 'bau'],
    periods: ['2020'],
  },
  {
    key: 'recreation-cor',
    label: 'Reserves cost recreation',
    finding:
      'Calling on Reserves puts the most days over the salinity limit for every activity. Birding is affected most. It goes from 38% of days today to 44% under Reserves.',
    criteria: [
      'rec-overall-birding',
      'rec-overall-angling',
      'rec-overall-boating',
      'rec-overall-dayUse',
      'rec-overall-waterfowl',
    ],
    scenarios: ['ngw', 'em', 'bf', 'cor', 'bau'],
    periods: ['run'],
  },
  {
    key: 'ej-water-age',
    label: 'Wetlands stagnate water',
    finding:
      'The wetland scenarios that make drinking water fresher also make it move more slowly. In Suisun, water sits about eight days longer. At Franks Tract, it sits five days longer.',
    criteria: ['ej-waterage-days'],
    scenarios: ['ngw', 'em', 'bf', 'bau'],
    places: ['suisun', 'franksTract', 'southDelta', 'mcCormackWilliamson', 'lindseyCache'],
  },
  {
    key: 'ngw-across',
    label: 'What New Green Watershed buys',
    finding:
      'Four subteams measure New Green Watershed in their own units. It restores 80,000 ac of tidal wetland, 102,982 ac for recreation and 248,815 ac in-Delta for eco-cultural. It costs $282M of farm revenue.',
    criteria: ['eco-habitat-acres', 'rec-restoration', 'ec-restoration', 'econ-revenue-half'],
    scenarios: ['ngw'],
  },
]
