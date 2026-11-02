import { bolsterGateClosures } from '../regional-summary/bolsterGateClosures'
import { callingOnReservesReleasePeriods } from '../regional-summary/callingOnReservesReleasePeriods'
import type { DashboardMode } from './types'

export interface ScenarioAnnotation {
  /** Short enough to sit inside the timeline. */
  label: string
  legend: string
  note: string
  periods: ReadonlyArray<{ startDate: string; endDate: string; note?: string }>
}

/**
 * Operating windows drawn on the timeline for the selected scenario. They only describe the
 * current-condition runs: B&F's gates respond to salinity, so they would close on other dates
 * with sea level rise.
 */
export const getScenarioAnnotation = (
  mode: DashboardMode,
  scenarioKey: string,
): ScenarioAnnotation | null => {
  if (mode !== 'rma-scenarios') return null
  if (scenarioKey === 'bolster')
    return {
      label: 'Gates closed',
      legend: 'Gates closed',
      note: 'Franks Tract gate operations for Bolster & Fortify.',
      periods: bolsterGateClosures.map((closure) => ({
        ...closure,
        note: closure.reopens ? undefined : 'The gates stay closed through the end of the data.',
      })),
    }
  if (scenarioKey === 'reserve')
    return {
      label: 'Higher release',
      legend: 'Higher Keswick release',
      note: 'Keswick release above Business as Usual.',
      periods: callingOnReservesReleasePeriods.map((period) => ({
        ...period,
        note: `${period.monthlyDifferenceCfs
          .map((cfs) => `+${cfs.toLocaleString('en-US')}`)
          .join(' / ')} cfs at Keswick compared with Business as Usual.`,
      })),
    }
  return null
}
