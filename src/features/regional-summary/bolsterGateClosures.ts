import gateSchedule from '../../../public/data/operations/bolster-and-fortify-gate-schedule.json'

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

/** Recommended display window for the recurring closure-3 salinity response. */
export const bolsterClosure3DisplayWindow = {
  startDate: '2020-10-01',
  endDate: '2020-11-29',
  note: 'All four analyzed regions resolve to this Oct–Nov 2020 subperiod. Treat the apparent lag as gate-associated timing, not causal attribution.',
} as const
