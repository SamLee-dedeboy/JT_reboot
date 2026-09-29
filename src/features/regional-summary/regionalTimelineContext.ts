import { bolsterGateClosures } from './bolsterGateClosures'
import { callingOnReservesReleasePeriods } from './callingOnReservesReleasePeriods'

export interface RegionalTimelineContextPeriod {
  id: string
  label: string
  startDate: string
  endDate: string
}

const drySeasonPeriods: readonly RegionalTimelineContextPeriod[] = [
  {
    id: 'dry-season-2018-19',
    label: 'Dry Season',
    startDate: '2018-10-01',
    endDate: '2019-03-31',
  },
  {
    id: 'dry-season-2019-20',
    label: 'Dry Season',
    startDate: '2019-10-01',
    endDate: '2020-03-31',
  },
  {
    id: 'dry-season-2020-21',
    label: 'Dry Season',
    startDate: '2020-10-01',
    endDate: '2020-11-29',
  },
]

/** Edit the scenario-specific contextual bands displayed above the salinity events here. */
export function getRegionalTimelineContextPeriods(
  scenarioSlug: string,
): readonly RegionalTimelineContextPeriod[] {
  if (scenarioSlug === 'bolster-and-fortify') return bolsterGateClosures

  if (scenarioSlug === 'calling-on-reserves') {
    return callingOnReservesReleasePeriods.map((period) => ({
      ...period,
      label: 'Sacramento River outflow increase',
    }))
  }

  if (scenarioSlug === 'new-green-watershed' || scenarioSlug === 'eco-machine') {
    return drySeasonPeriods
  }

  return []
}
