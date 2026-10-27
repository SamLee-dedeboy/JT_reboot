// The places each team reports its criterion by, for the "Which regions" section
// of the team's page. Region names match the outlines in the rank-visualization
// shapefile (src/internal/rank-visualization/subteams/regionShapes.ts) so the map
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
      'Ecology groups its 145 points into subregions drawn from a published clustering of average daily water temperature, so each region shares similar conditions for fish and the food they eat.',
    regions: [
      { name: 'South Bay', note: '9 points.' },
      { name: 'Central Bay', note: '16 points.' },
      { name: 'San Pablo Bay', note: '15 points.' },
      { name: 'North Delta', note: '30 points.' },
      { name: 'Central', note: '23 points.' },
      { name: 'South Delta', note: '11 points.' },
      { name: 'Confluence', note: '16 points.' },
      { name: 'Suisun Bay', note: '25 points, reported together with Suisun Marsh.' },
      { name: 'Suisun Marsh', note: 'Folded into Suisun Bay in the results.' },
    ],
  },
  'environmental-justice': {
    mapTeam: 'environmentalJustice',
    intro:
      'Environmental justice reads results by how vulnerable a community is, not by where it sits on a river. The Delta Stewardship Council rates every Delta community Moderate, High, or Highest across 14 indicators, and each drinking-water point takes the rating of the community it serves.',
    regions: [
      { name: 'Moderate', note: '10 drinking-water points.' },
      { name: 'High', note: '36 drinking-water points (33 in the outflow runs).' },
      { name: 'Highest', note: '3 drinking-water points.' },
    ],
  },
  recreation: {
    mapTeam: 'recreation',
    intro:
      'Recreation splits the Delta into four regions that follow tidal flow and conductivity zones from earlier studies, and the highways people take to reach recreation sites (Andrews et al., 2017; Delta Stewardship Council, 2013).',
    regions: [
      { name: 'North Delta', note: 'Sacramento River corridors and nearby recreation sites' },
      { name: 'Confluence', note: 'The meeting area of the Sacramento and San Joaquin rivers' },
      {
        name: 'South Delta',
        note: 'San Joaquin River corridors, Clifton Court Forebay, and nearby sites',
      },
      { name: 'Suisun Bay', note: 'Suisun, Grizzly, and Honker bays and Suisun Marsh' },
    ],
  },
  economy: {
    mapTeam: 'economy',
    intro:
      'A Delta-wide total can hide winners and losers, so Economy also reports by zone. North, Central, and South Delta are drawn by water agency; the fourth zone is the West Delta.',
    regions: [
      { name: 'North Delta' },
      { name: 'Central Delta' },
      { name: 'South Delta' },
      { name: 'West Delta' },
    ],
  },
}
