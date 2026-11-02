import releaseSchedule from '../../../public/data/operations/calling-on-reserves-release-schedule.json'

export interface CallingOnReservesReleasePeriod {
  id: string
  label: string
  startDate: string
  endDate: string
  /** One value per calendar month, relative to Business as Usual at Keswick. */
  monthlyDifferenceCfs: readonly number[]
}

/**
 * Periods when Calling on Reserves releases more than Business as Usual at Keswick, from the
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
