export interface CallingOnReservesReleasePeriod {
  id: 'release-1' | 'release-2'
  label: string
  startDate: string
  endDate: string
  provisional: true
  provenance: string
}

/**
 * Working Calling on Reserves release windows used to organize curated patterns.
 *
 * These are inferred month-scale windows, not confirmed reservoir-operation dates.
 * They combine the visible COR-versus-baseline flow departures in the supplied
 * hydrograph with the onset and persistence of coherent regional EC responses.
 */
export const callingOnReservesReleasePeriods: readonly CallingOnReservesReleasePeriod[] = [
  {
    id: 'release-1',
    label: 'Potential release 1',
    startDate: '2019-01-01',
    endDate: '2019-02-28',
    provisional: true,
    provenance:
      'Inferred from the early-2019 COR-versus-baseline flow departure and the January–February onset of shared fresher regional responses.',
  },
  {
    id: 'release-2',
    label: 'Potential release 2',
    startDate: '2019-12-01',
    endDate: '2020-01-31',
    provisional: true,
    provenance:
      'Inferred from the late-2019/early-2020 COR-versus-baseline flow departure and the December–January onset of shared fresher regional responses.',
  },
] as const
