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
      { name: 'North Delta', note: '30 points.' },
      { name: 'Central', note: '23 points.' },
      { name: 'South Delta', note: '11 points.' },
      { name: 'Confluence', note: '16 points.' },
      { name: 'Suisun Bay', note: '25 points, reported together with Suisun Marsh.' },
      { name: 'Suisun Marsh', note: 'Folded into Suisun Bay in the results.' },
    ],
    mapNote:
      'San Pablo Bay, Central Bay, and South Bay are also scored, so range shifts of migratory species show up, but they sit outside this map.',
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
      'Recreation splits the Delta into four regions that follow tidal flow and conductivity zones from earlier studies, and the highways people take to reach recreation sites.',
    regions: [
      { name: 'North Delta' },
      { name: 'Confluence', note: 'The report’s Central Delta.' },
      { name: 'South Delta' },
      { name: 'Suisun Bay', note: 'The report’s Suisun Marsh region.' },
    ],
  },
  economy: {
    mapTeam: 'economy',
    intro:
      'A Delta-wide total can hide winners and losers, so Economy also reports by zone. North, Central, and South Delta are drawn by water agency; the fourth zone is the West Delta.',
    regions: [
      { name: 'North Delta Water Agency', note: 'North Delta zone' },
      { name: 'Central Delta Water Agency', note: 'Central Delta zone' },
      { name: 'South Delta Water Agency', note: 'South Delta zone' },
    ],
    mapNote: 'The West Delta zone has results but no published outline yet, so it is not drawn.',
  },
}
