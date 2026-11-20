// What each team found in each scenario, and where: the pins of the Scenario takeaways map.
// Drawn from the teams' ranking takeaways (scenario-ranking/data) and, where a takeaway names
// no place, their reports; editorial/scenario-findings-inventory.md records every choice.
// Places and what was measured there, never scores. A team whose finding has no one place
// goes in `acrossDelta` instead of on the map.
import { scenarioName, type ScenarioKey, type TeamKey } from '@/content/names'

/** [longitude, latitude] */
export type LngLat = [number, number]

export interface Finding {
  id: string
  team: TeamKey
  /** The place, as the card's title and the selected pin's label. */
  place: string
  /** What kind of place: one spot, two places, a community. */
  kind: string
  /** One pin per place; every pin shows the team's icon. */
  pins: LngLat[]
  /** The finding is a shift from the first place to the second: a dashed line joins them. */
  shift?: boolean
  lead: string
  /** What was measured there: [measure, value]. */
  measures: [string, string][]
  source: string
}

export interface ScenarioFindings {
  scenario: ScenarioKey
  findings: Finding[]
  /** Findings that hold across the Delta, with no one place to pin. */
  acrossDelta: { team: TeamKey; text: string }[]
}

const FROM_RANKING = 'From the team’s ranking takeaway.'
const FROM_REPORT = 'From the team’s report; the ranking has no takeaway for it.'
const DRINKING_WATER = 'Days at or above 1,050 µS/cm, the drinking-water threshold'

/* Places. Two teams at one place sit a little apart so both pins show. */
const FRANKS_TRACT: LngLat = [-121.595, 38.045]
const SUISUN_MARSH: LngLat = [-122.03, 38.19]
const CENTRAL_DELTA: LngLat = [-121.53, 37.99]
const CONFLUENCE: LngLat = [-121.85, 38.05]
const SHERMAN_ISLAND: LngLat = [-121.75, 38.045]
const WESTERN_ISLANDS: LngLat = [-121.69, 38.065]
const CENTRAL_ISLANDS: LngLat = [-121.44, 37.97]
const NORTH_DELTA_INTAKES: LngLat = [-121.53, 38.35]
const FRESHWATER_CORRIDOR: LngLat = [-121.57, 37.9]
/** The upper watershed is far off the map: its pin sits at the map's northern edge. */
const UPPER_WATERSHED_EDGE: LngLat = [-121.52, 38.39]
const CONVERTED_ISLANDS: LngLat = [-121.58, 38.17]

/**
 * Environmental Justice's drinking-water communities, each pin at the center of the modeling
 * stations it stands for, grouped by Delta Vulnerability Index class.
 */
const DRINKING_WATER_COMMUNITIES: LngLat = [-121.5483, 38.0944]
const MODERATE_VULNERABILITY: LngLat = [-121.5314, 38.0663]
const HIGH_VULNERABILITY: LngLat = [-121.5788, 38.1103]
const HIGHEST_VULNERABILITY: LngLat = [-121.3831, 37.9769]

const em = scenarioName('em')
const ngw = scenarioName('ngw')

export const scenarioFindings: ScenarioFindings[] = [
  {
    scenario: 'em',
    findings: [
      {
        id: 'em-ecology',
        team: 'ecology',
        place: 'Franks Tract',
        kind: 'One place',
        pins: [FRANKS_TRACT],
        lead: 'A saltier Franks Tract means fewer suitable days for the freshwater invasives, and more for overbite clams.',
        measures: [
          ['Brazilian waterweed', 'Fewer suitable days'],
          ['Largemouth bass', 'Fewer suitable days'],
          ['Overbite clam', 'More suitable days'],
        ],
        source: FROM_RANKING,
      },
      {
        id: 'em-environmental-justice',
        team: 'environmentalJustice',
        place: 'Drinking-water communities',
        kind: 'Drinking-water systems across the Delta',
        pins: [DRINKING_WATER_COMMUNITIES],
        lead: `The largest drop in days over the drinking-water salinity threshold, tied with ${ngw}, in wet and dry years alike.`,
        measures: [
          ['All communities', '9% → 7% of days'],
          ['Moderate vulnerability', '6% → 4%'],
          ['High vulnerability', '10% → 8%'],
          ['Highest vulnerability', 'Never over'],
        ],
        source: `${DRINKING_WATER}, whole run, against ${scenarioName('bau')}. ${FROM_RANKING}`,
      },
      {
        id: 'em-economy',
        team: 'economy',
        place: 'Suisun Marsh and Franks Tract',
        kind: 'Land restored to tidal marsh',
        pins: [
          [-122.0, 38.155],
          [-121.64, 38.02],
        ],
        lead: 'About 43,120 acres of tidal marsh restored, but almost none of it was farmed. The main cost is building it.',
        measures: [
          ['Marsh restored', '≈ 43,120 acres'],
          ['Farm revenue lost', '≈ $0.9M a year'],
          ['Farm jobs lost', '≈ 10'],
          ['Construction, one time', '≈ $1.3B'],
        ],
        source: FROM_RANKING,
      },
      {
        id: 'em-recreation',
        team: 'recreation',
        place: 'Central Delta → Suisun Marsh',
        kind: 'A shift from one place to another',
        pins: [CENTRAL_DELTA, [-122.07, 38.215]],
        shift: true,
        lead: 'Salinity moves out of the Central Delta and into Suisun Marsh, where it crosses the highest angling threshold more often.',
        measures: [
          ['Central Delta', 'Fresher'],
          ['Suisun Marsh', 'Saltier'],
          ['Highest angling threshold', '9,130 µS/cm, crossed more often at Suisun'],
          ['Activities affected at Suisun', 'All of them'],
        ],
        source: FROM_RANKING,
      },
    ],
    acrossDelta: [
      {
        team: 'ecoCultural',
        text: `Second only to ${ngw}, because it restores less: the same chances for Tribes to gather culturally important material, and to gather as a community.`,
      },
      { team: 'environmentalJustice', text: 'No change in flood risk.' },
      { team: 'ecology', text: `Habitat and food webs improve, though less than in ${ngw}.` },
      { team: 'economy', text: 'Fresher irrigation water adds about $3,500 a year in a dry year.' },
    ],
  },
  {
    scenario: 'ngw',
    findings: [
      {
        id: 'ngw-ecology',
        team: 'ecology',
        place: 'Converted Delta islands',
        kind: 'Farmland turned to wetland',
        pins: [[-121.7, 38.13]],
        lead: `Species respond as in ${em}, but food webs gain much more, from the added managed wetland and wet-soil farming.`,
        measures: [
          ['Species', `As in ${em}`],
          ['Food-web contribution', 'Much higher'],
        ],
        source: FROM_RANKING,
      },
      {
        id: 'ngw-environmental-justice',
        team: 'environmentalJustice',
        place: 'Upper watershed',
        kind: 'Upstream, beyond the map’s edge',
        pins: [UPPER_WATERSHED_EDGE],
        lead: 'The largest drop in flood risk of any scenario: restoration upstream holds water back before it reaches the Delta.',
        measures: [['Flood risk', 'The largest drop of any scenario']],
        source: FROM_RANKING,
      },
      {
        id: 'ngw-economy',
        team: 'economy',
        place: 'Converted Delta islands',
        kind: 'Farmland turned to wetland',
        pins: [CONVERTED_ISLANDS],
        lead: 'The largest economic cost of the scenarios, because farmland leaves production.',
        measures: [
          ['Farm revenue', '−19% to −46%'],
          ['Jobs', '−31% to −43%'],
          ['At 50% wetland', '−25.5% revenue, −34.2% jobs'],
        ],
        source: `The range depends on how much becomes wetland. ${FROM_RANKING}`,
      },
      {
        id: 'ngw-recreation',
        team: 'recreation',
        place: 'Suisun Marsh',
        kind: 'One place',
        pins: [SUISUN_MARSH],
        lead: `Practically the same as ${em}, with slightly more summer threshold days for birding at Suisun.`,
        measures: [['Birding at Suisun, summer', 'Slightly more threshold days']],
        source: FROM_RANKING,
      },
    ],
    acrossDelta: [
      {
        team: 'ecoCultural',
        text: 'Performs best of the adaptation scenarios, because of how much it restores: places for Tribes to gather culturally important material, and to gather as a community.',
      },
      {
        team: 'environmentalJustice',
        text: `The largest drop in days over the drinking-water threshold, tied with ${em}.`,
      },
      {
        team: 'economy',
        text: 'Subsidence reversal, lower levee and flood costs, and new habitat aren’t counted.',
      },
    ],
  },
  {
    scenario: 'bf',
    findings: [
      {
        id: 'bf-environmental-justice',
        team: 'environmentalJustice',
        place: 'The freshwater corridor',
        kind: 'Along the scenario’s corridor',
        pins: [FRESHWATER_CORRIDOR],
        lead: 'Flood risk falls only along the corridor, not across the Delta.',
        measures: [['Flood risk', 'Lower along the corridor only']],
        source: FROM_RANKING,
      },
      {
        id: 'bf-economy',
        team: 'economy',
        place: 'Central Delta',
        kind: 'Farmland',
        pins: [CENTRAL_DELTA],
        lead: 'Affects farming only through salinity: slightly saltier irrigation water in a dry year, mostly in the Central Delta.',
        measures: [
          ['Farm revenue, dry year', '≈ −$10,000 a year'],
          ['With 2 ft of sea level rise', '≈ −$27,000 a year'],
          ['Share of farm revenue', 'Under 0.003%'],
        ],
        source: FROM_RANKING,
      },
    ],
    acrossDelta: [
      { team: 'ecology', text: `No differences from ${scenarioName('bau')}.` },
      {
        team: 'recreation',
        text: `Very similar to ${scenarioName('bau')} for salinity and temperature.`,
      },
      { team: 'ecoCultural', text: 'No restoration, so no change.' },
      {
        team: 'environmentalJustice',
        text: 'Drinking water is unchanged over the whole run: slightly fewer exceedances in a wet year, slightly more in a dry one.',
      },
    ],
  },
  {
    scenario: 'cor',
    findings: [
      {
        id: 'cor-environmental-justice',
        team: 'environmentalJustice',
        place: 'Drinking-water communities',
        kind: 'Drinking-water systems across the Delta',
        pins: [DRINKING_WATER_COMMUNITIES],
        lead: 'No change over the whole run or the wet year, but fewer days over the drinking-water threshold in a dry year.',
        measures: [
          ['All communities, dry year', '9% → 7% of days'],
          ['Moderate vulnerability', '3% → 2%'],
          ['High vulnerability', '11% → 10%'],
          ['Highest vulnerability', 'Never over'],
        ],
        source: `${DRINKING_WATER}, against ${scenarioName('csbau')}. ${FROM_RANKING}`,
      },
      {
        id: 'cor-economy',
        team: 'economy',
        place: 'Western islands',
        kind: 'Farmland',
        pins: [WESTERN_ISLANDS],
        lead: 'Irrigation salinity and farm income stay about where they are; in a dry year, slightly fresher water on some western islands.',
        measures: [['Farm revenue, dry year', 'A gain of a few thousand dollars a year']],
        source: FROM_RANKING,
      },
      {
        id: 'cor-recreation',
        team: 'recreation',
        place: 'Central Delta',
        kind: 'One place',
        pins: [CENTRAL_DELTA],
        lead: `Better than ${scenarioName('bau')} for salinity, most of all for winter day use in the Central Delta.`,
        measures: [['Winter day use', 'Fewer days over the salinity threshold']],
        source: FROM_RANKING,
      },
    ],
    acrossDelta: [
      {
        team: 'ecology',
        text: 'Only small differences: fewer suitable points for longfin smelt and salmon in 2019; slightly fewer for freshwater invasives and slightly more for overbite clams in 2020.',
      },
      { team: 'ecoCultural', text: 'Holding flows upstream for fish: a slight positive.' },
      { team: 'environmentalJustice', text: 'No change in flood risk.' },
    ],
  },
  {
    scenario: 'tunnel',
    findings: [
      {
        id: 'tunnel-environmental-justice',
        team: 'environmentalJustice',
        place: 'North Delta intakes',
        kind: 'The scenario’s works',
        pins: [NORTH_DELTA_INTAKES],
        lead: 'A slight drop in flood risk, assuming the two northern intakes capture stormwater before it reaches the Delta.',
        measures: [['Flood risk', 'Slightly lower']],
        source: FROM_RANKING,
      },
      {
        id: 'tunnel-economy',
        team: 'economy',
        place: 'Western islands → central islands',
        kind: 'A shift from one place to another',
        pins: [WESTERN_ISLANDS, CENTRAL_ISLANDS],
        shift: true,
        lead: 'In a dry year, salt shifts from the western to the central Delta: saltier on Rindge Tract, Roberts Island, McDonald Island and Jones Tract, fresher on the western islands.',
        measures: [
          ['Farm revenue, dry year', '≈ −$27,000 a year'],
          ['With sea level rise', '≈ −$19,000 a year'],
        ],
        source: FROM_RANKING,
      },
      {
        id: 'tunnel-recreation',
        team: 'recreation',
        place: 'Suisun Marsh and Central Delta',
        kind: 'Two places',
        pins: [SUISUN_MARSH, [-121.56, 37.94]],
        lead: 'The only scenario that pushes more salinity into both.',
        measures: [
          ['Suisun Marsh', 'Saltier'],
          ['Central Delta', 'Saltier'],
        ],
        source: FROM_RANKING,
      },
    ],
    acrossDelta: [
      {
        team: 'ecology',
        text: 'Affects the most species of any scenario: in 2020, fewer suitable points for juvenile longfin smelt and overbite clams, more for Brazilian waterweed and largemouth bass, and mixed effects on Chinook salmon.',
      },
      {
        team: 'ecoCultural',
        text: 'A “double hit”: the change to the landscape, and taking more water in winter.',
      },
      {
        team: 'environmentalJustice',
        text: `Days over the drinking-water threshold don’t differ from ${scenarioName('csbau')}.`,
      },
      { team: 'recreation', text: 'Warmer brooding-season conditions for waterfowl.' },
    ],
  },
  {
    scenario: 'more',
    findings: [
      {
        id: 'more-ecology',
        team: 'ecology',
        place: 'Confluence and Suisun',
        kind: 'Two places',
        pins: [CONFLUENCE, [-121.99, 38.165]],
        lead: 'Both get fresher: fewer suitable days for overbite clams, more for the freshwater invasives.',
        measures: [
          ['Overbite clam', 'Fewer suitable days'],
          ['Brazilian waterweed', 'More suitable days'],
          ['Largemouth bass', 'More suitable days'],
          ['Juvenile longfin smelt', 'Gains in the Confluence and North Delta'],
        ],
        source: FROM_REPORT,
      },
      {
        id: 'more-environmental-justice-moderate',
        team: 'environmentalJustice',
        place: 'Moderate-vulnerability communities',
        kind: 'Community, from the North to the South Delta',
        pins: [MODERATE_VULNERABILITY],
        lead: 'They nearly stop going over the drinking-water threshold.',
        measures: [
          ['This community', '31% → 1% of days'],
          ['All communities', '27% → 8%'],
        ],
        source: `${DRINKING_WATER}, whole run, against the ${scenarioName('hist')}. The pin sits at the center of the community’s drinking-water systems. ${FROM_RANKING}`,
      },
      {
        id: 'more-environmental-justice-high',
        team: 'environmentalJustice',
        place: 'High-vulnerability communities',
        kind: 'Community, from Suisun Bay to Vernalis',
        pins: [HIGH_VULNERABILITY],
        lead: 'Over the drinking-water threshold far less often, but still about one day in nine.',
        measures: [
          ['This community', '28% → 11% of days'],
          ['All communities', '27% → 8%'],
        ],
        source: `${DRINKING_WATER}, whole run, against the ${scenarioName('hist')}. The pin sits at the center of the community’s drinking-water systems. ${FROM_RANKING}`,
      },
      {
        id: 'more-environmental-justice-highest',
        team: 'environmentalJustice',
        place: 'Highest-vulnerability communities',
        kind: 'Community, around Stockton',
        pins: [HIGHEST_VULNERABILITY],
        lead: 'Never over the drinking-water threshold, with or without more outflow.',
        measures: [
          ['This community', '0% → 0% of days'],
          ['All communities', '27% → 8%'],
        ],
        source: `${DRINKING_WATER}, whole run, against the ${scenarioName('hist')}. The pin sits at the center of the community’s drinking-water systems. ${FROM_RANKING}`,
      },
      {
        id: 'more-economy',
        team: 'economy',
        place: 'Central Delta and Sherman Island',
        kind: 'Farmland',
        pins: [SHERMAN_ISLAND, [-121.6, 37.965]],
        lead: 'Fresher irrigation water raises farm revenue a little in a dry year.',
        measures: [
          ['Farm revenue, dry year', '≈ +$20,000 a year'],
          ['Model', 'SCHISM, a different model and year from the other scenarios'],
        ],
        source: FROM_RANKING,
      },
      {
        id: 'more-recreation',
        team: 'recreation',
        place: 'Central Delta and Suisun Marsh',
        kind: 'Two places',
        pins: [
          [-121.47, 38.0],
          [-122.07, 38.215],
        ],
        lead: 'Conditions improve, mainly through lower salinity where exceedances were most frequent.',
        measures: [
          ['Central Delta', 'Fresher'],
          ['Suisun Marsh', 'Fresher'],
          ['North and South Delta', 'No change'],
        ],
        source: FROM_RANKING,
      },
    ],
    acrossDelta: [
      {
        team: 'ecoCultural',
        text: 'More flow lowers salinity, and people described flows as the “soul” of the rivers.',
      },
    ],
  },
]
