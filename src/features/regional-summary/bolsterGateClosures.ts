export interface BolsterGateClosure {
  id: 'closure-1' | 'closure-2' | 'closure-3'
  label: string
  startDate: string
  endDate: string
  provisional: boolean
  uncertaintyDays: number
  provenance: string
}

/**
 * Franks Tract gate-closure windows used by the Bolster & Fortify regional analysis.
 *
 * These dates describe inferred gate operation, not the narrower salinity-response
 * episodes selected for display. The first two windows come from the established
 * gate-event assumptions. Closure 3 remains a visual estimate until an exact
 * operational time series is available.
 */
export const bolsterGateClosures: readonly BolsterGateClosure[] = [
  {
    id: 'closure-1',
    label: 'Gates closed',
    startDate: '2018-10-01',
    endDate: '2019-01-13',
    provisional: false,
    uncertaintyDays: 2,
    provenance:
      'Inferred from the plotted gate-operation variable. The simulation begins with the gate closed; reopening is inferred as January 14, 2019.',
  },
  {
    id: 'closure-2',
    label: 'Gates closed',
    startDate: '2019-11-26',
    endDate: '2019-12-10',
    provisional: false,
    uncertaintyDays: 2,
    provenance:
      'Inferred from the plotted gate-operation variable. Closure begins around November 26–27, 2019; reopening is inferred as December 11, 2019.',
  },
  {
    id: 'closure-3',
    label: 'Gates closed (provisional)',
    startDate: '2020-07-15',
    endDate: '2020-11-29',
    provisional: true,
    uncertaintyDays: 2,
    provenance:
      'Visually inferred from the supplied gate-operation plot. No exact operational time series has been located; replace these dates if one becomes available.',
  },
] as const

/** Recommended display window for the recurring closure-3 salinity response. */
export const bolsterClosure3DisplayWindow = {
  startDate: '2020-10-01',
  endDate: '2020-11-29',
  note: 'All four analyzed regions resolve to this Oct–Nov 2020 subperiod. Treat the apparent lag as gate-associated timing, not causal attribution.',
} as const
