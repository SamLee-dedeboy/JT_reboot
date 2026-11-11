// The two scenarios' operating schedules, read by the scenario explorer, the regional
// summary and the modeling page. The dates themselves are in public/data/operations/.
import gateSchedule from '../../../../public/data/operations/bolster-and-fortify-gate-schedule.json'
import releaseSchedule from '../../../../public/data/operations/calling-on-reserves-release-schedule.json'

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
