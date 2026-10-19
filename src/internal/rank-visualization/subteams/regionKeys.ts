// Shapefile region name → the place key the criterion tree stores its values under.
//
// The five subteams drew different boundaries, so this is kept per team and no
// name is ever looked up across teams. A team missing here has outlines that do
// not correspond to any place facet (EJ's classes are criterion nodes) or no
// outline at all (eco-cultural, by design).
import type { TeamKey } from '../data'

/** Five of Ecology's eight data regions have an outline; "Suisun Marsh" has an
 *  outline and no key, because the report folds it into Suisun Bay. */
const ECOLOGY_REGION_KEY: Record<string, string> = {
  'Suisun Bay': 'suisunBay',
  Confluence: 'confluence',
  Central: 'centralDelta',
  'South Delta': 'southDelta',
  'North Delta': 'northDelta',
}

/** Shapefile agency → the zone key. West Delta has values and no outline yet. */
const ECONOMY_ZONE_KEY: Record<string, string> = {
  'North Delta Water Agency': 'north',
  'Central Delta Water Agency': 'central',
  'South Delta Water Agency': 'south',
}

/**
 * Recreation's four regions, now with values per region (18 Oct 2026 workbooks).
 * Three names match outright; "Confluence" is taken to be the workbook's Central
 * Delta, whose nine stations run from Pittsburg to Franks Tract. Unconfirmed.
 */
const RECREATION_REGION_KEY: Record<string, string> = {
  'Suisun Bay': 'suisun',
  Confluence: 'centralDelta',
  'North Delta': 'northDelta',
  'South Delta': 'southDelta',
}

export const REGION_DATA_KEY: Partial<Record<TeamKey, Record<string, string>>> = {
  ecology: ECOLOGY_REGION_KEY,
  recreation: RECREATION_REGION_KEY,
  economy: ECONOMY_ZONE_KEY,
}

/** True where a team's places can be drawn: it has outlines and they key into its data. */
export function hasRegionMap(team: TeamKey): boolean {
  return !!REGION_DATA_KEY[team]
}
