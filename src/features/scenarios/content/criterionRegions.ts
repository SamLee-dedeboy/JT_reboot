// The places each team reports its criterion by, for the "Which regions" section
// of the team's page. Region names match the outlines in the ranking
// shapefile (src/features/scenarios/ranking/regions/regionShapes.ts) so the map
// can label them. Eco-cultural has no entry: its geography is historic Tribal
// territory, and specific cultural-practice sites are deliberately not mapped.
import type { evaluationTeams } from './results'

export interface CriterionRegions {
  /** The shapefile's team key for these outlines. */
  mapTeam: 'ecology' | 'environmentalJustice' | 'recreation' | 'economy'
  intro: string
  /** One entry per outline on the map, in reading order. */
  regions: Array<{ name: string; note?: string }>
  /** What the map leaves out, where it does. */
  mapNote?: string
}

type TeamId = (typeof evaluationTeams)[number]['id']

export const criterionRegions: Partial<Record<TeamId, CriterionRegions>> = {
  ecology: {
    mapTeam: 'ecology',
    intro:
      'For this criterion, the Delta is grouped into subregions based on average daily water temperature, such that each region shares similar conditions for fish and the food they eat. The regions follow Pien et al. (Pien et al., 2025), with Suisun Bay and Suisun Marsh combined into one region, shown here as Suisun Marsh. West of Suisun, where Pien et al. ends, they follow known points of contraction (Grimaldo et al., 2020).',
    regions: [
      { name: 'San Pablo Bay', note: '15 points' },
      { name: 'Central Bay', note: '16 points' },
      { name: 'South Bay', note: '9 points' },
      { name: 'Suisun Marsh', note: '25 points' },
      { name: 'Confluence', note: '16 points' },
      { name: 'North Delta', note: '30 points' },
      { name: 'Central', note: '23 points' },
      { name: 'South Delta', note: '11 points' },
    ],
  },
  'environmental-justice': {
    mapTeam: 'environmentalJustice',
    intro:
      'This criterion explores results by how vulnerable a community is, not by where it sits geographically. Therefore, instead of a regional breakdown of results, results are communicated per vulnerability zone:',
    regions: [
      { name: 'Moderate', note: '10 drinking-water points' },
      { name: 'High', note: '36 drinking-water points (33 in the tiered outflow runs)' },
      { name: 'Highest', note: '3 drinking-water points' },
    ],
  },
  recreation: {
    mapTeam: 'recreation',
    intro:
      'This criterion splits the Delta into four regions that follow tidal flow and conductivity zones, and the highways people take to reach recreation sites (Andrews et al., 2017; Delta Stewardship Council, 2013).',
    regions: [
      { name: 'North Delta', note: '6 points' },
      { name: 'Central Delta', note: '9 points' },
      { name: 'South Delta', note: '9 points' },
      { name: 'Suisun Marsh', note: '8 points' },
    ],
  },
  economy: {
    mapTeam: 'economy',
    intro:
      'This criterion divides the Delta into subregions of North, Central, and South Delta by water agency; the remaining fourth zone is the West Delta by default (no official agency).',
    regions: [
      // Estimated, not from the team: its 157 RMA stations placed by location in the zone
      // they fall within, or the nearest zone for the 30 outside all four outlines.
      { name: 'North Delta', note: '63 points' },
      { name: 'Central Delta', note: '23 points' },
      { name: 'South Delta', note: '40 points' },
      { name: 'West Delta', note: '31 points' },
    ],
  },
}
