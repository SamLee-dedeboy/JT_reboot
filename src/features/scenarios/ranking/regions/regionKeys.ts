// Shapefile region name → the place key the criterion tree stores its values under.
//
// The five subteams drew different boundaries, so this is kept per team and no
// name is ever looked up across teams. A team missing here has outlines that do
// not correspond to any place facet (EJ's classes are criterion nodes) or no
// outline at all (eco-cultural, by design).
import type { TeamKey } from '../model/teams'

/** Shared reading order for region tabs, map numbers, and the map-view value table. */
export const REGION_DISPLAY_ORDER = [
  'North Delta',
  'Confluence',
  'Central',
  'Central Delta',
  'South Delta',
  'Suisun Marsh',
  'San Pablo Bay',
  'Central Bay',
  'South Bay',
] as const

/** All eight Ecology data regions have an outline; "Suisun Marsh" is Suisun Bay and
 *  Suisun Marsh combined, as the team assigned them, and keeps the suisunBay key. */
const ECOLOGY_REGION_KEY: Record<string, string> = {
  'South Bay': 'southBay',
  'Central Bay': 'centralBay',
  'San Pablo Bay': 'sanPabloBay',
  'Suisun Marsh': 'suisunBay',
  Confluence: 'confluence',
  Central: 'centralDelta',
  'South Delta': 'southDelta',
  'North Delta': 'northDelta',
}

/** Displayed Economy region → the zone key. */
const ECONOMY_ZONE_KEY: Record<string, string> = {
  'North Delta': 'north',
  'Central Delta': 'central',
  'South Delta': 'south',
  'West Delta': 'west',
}

/**
 * Recreation's four regions, now with values per region (18 Oct 2026 workbooks).
 * Displayed under the names in the team's report; the shapefile's "Suisun Bay" and
 * "Confluence" are renamed to its Suisun Marsh and Central Delta.
 */
const RECREATION_REGION_KEY: Record<string, string> = {
  'Suisun Marsh': 'suisun',
  'Central Delta': 'centralDelta',
  'North Delta': 'northDelta',
  'South Delta': 'southDelta',
}

export const REGION_DATA_KEY: Partial<Record<TeamKey, Record<string, string>>> = {
  ecology: ECOLOGY_REGION_KEY,
  recreation: RECREATION_REGION_KEY,
  economy: ECONOMY_ZONE_KEY,
}
