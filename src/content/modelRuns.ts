// What the salinity model runs share, read by the scenario explorer, the regional summary
// and the modeling page: the water years they cover and the two scenarios' operating
// schedules (the dates themselves are in public/data/operations/).
import gateSchedule from '../../public/data/operations/bolster-and-fortify-gate-schedule.json'
import releaseSchedule from '../../public/data/operations/calling-on-reserves-release-schedule.json'

// The water years the salinity runs cover, by the date each begins. A water year runs from
// 1 October to 30 September and is named for the year it ends in.
export const WATER_YEAR_START = {
  wet2019: '2018-10-01',
  dry2020: '2019-10-01',
  critical2021: '2020-10-01',
  critical2022: '2021-10-01',
} as const

export interface BolsterGateClosure {
  id: string
  label: string
  startDate: string
  endDate: string
  /** False when the gates are still closed at the end of the data. */
  reopens: boolean
}

/**
 * Franks Tract gate closures within the analysis period, from the schedule in
 * `public/data/operations/`. Change the dates there. They describe gate operation, not the narrower salinity-response episodes selected for
 * display.
 */
export const bolsterGateClosures: readonly BolsterGateClosure[] = gateSchedule.closures.map(
  ({ id, startDate, endDate, reopens }) => ({
    id,
    label: 'Gates closed',
    startDate,
    endDate,
    reopens,
  }),
)

export interface CallingOnReservesReleasePeriod {
  id: string
  label: string
  startDate: string
  endDate: string
  /** One value per calendar month, relative to Business as Usual at Shasta Dam. */
  monthlyDifferenceCfs: readonly number[]
}

/**
 * Periods when Calling on Reserves releases more than Business as Usual at Shasta Dam, from the
 * schedule in `public/data/operations/`. Change the dates there.
 */
export const callingOnReservesReleasePeriods: readonly CallingOnReservesReleasePeriod[] =
  releaseSchedule.moreThanBau.map(({ id, startDate, endDate, monthlyDifferenceCfs }) => ({
    id,
    label: 'Higher release',
    startDate,
    endDate,
    monthlyDifferenceCfs,
  }))
