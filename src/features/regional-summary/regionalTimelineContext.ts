import {
  bolsterGateClosures,
  callingOnReservesReleasePeriods,
  WATER_YEAR_START,
} from '../scenarios/content'

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
    startDate: WATER_YEAR_START.wet2019,
    endDate: '2019-03-31',
  },
  {
    id: 'dry-season-2019-20',
    label: 'Dry Season',
    startDate: WATER_YEAR_START.dry2020,
    endDate: '2020-03-31',
  },
  {
    id: 'dry-season-2020-21',
    label: 'Dry Season',
    startDate: WATER_YEAR_START.critical2021,
    endDate: '2020-11-29',
  },
]

/** Edit the scenario-specific contextual bands displayed above the salinity events here. */
export function getRegionalTimelineContextPeriods(
  scenarioSlug: string,
  seaLevelRise = false,
): readonly RegionalTimelineContextPeriod[] {
  // Like the explorer's sea level rise modes: the operating dates describe current conditions.
  if (
    seaLevelRise &&
    (scenarioSlug === 'bolster-and-fortify' || scenarioSlug === 'calling-on-reserves')
  ) {
    return []
  }

  if (scenarioSlug === 'bolster-and-fortify') return bolsterGateClosures

  if (scenarioSlug === 'calling-on-reserves') {
    // September–October's small increase sits too close to December's for both labels to fit.
    return callingOnReservesReleasePeriods.map((period) =>
      period.id === 'higher-2019-09' ? { ...period, label: '' } : period,
    )
  }

  if (scenarioSlug === 'new-green-watershed' || scenarioSlug === 'eco-machine') {
    return drySeasonPeriods
  }

  return []
}
