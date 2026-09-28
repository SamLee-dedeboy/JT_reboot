import type { RegionalPlace } from './regionalSummaryData'

export type RegionalPlaceCardSide = 'left' | 'right'
export type RegionalTextHighlight = 'saltier' | 'fresher' | 'primary' | 'white' | 'muted'

export interface RegionalTextSegment {
  text: string
  highlight?: RegionalTextHighlight
  strong?: boolean
}

interface RegionalPlaceEditorialContent {
  displayName?: string
  cardSide: RegionalPlaceCardSide
  whyThisPlace: string
  keyTakeaway?: RegionalTextSegment[]
}

/**
 * Edit regional map-card copy here.
 *
 * keyTakeaway accepts any number of ordered text segments. Each segment can
 * select a semantic highlight and bold treatment without editing the UI.
 */
const regionalPlaceContent: Record<string, Record<string, RegionalPlaceEditorialContent>> = {
  'bolster-and-fortify': {
    north_franks_tract: {
      displayName: 'North of Franks Tract',
      cardSide: 'left',
      whyThisPlace:
        'Just upstream of the new gates and reinforced levees, this area shows where these interventions could affect nearby channels.',
      keyTakeaway: [
        { text: 'Generally saltier', highlight: 'saltier', strong: true },
        { text: ' when the gates are closed during dry seasons in 2018 and 2020.' },
      ],
    },
    franks_tract: {
      cardSide: 'left',
      whyThisPlace:
        'Franks Tract is the scenario’s focal intervention area, where new operable gates and levee repairs could reshape drought-time water movement.',
      keyTakeaway: [
        { text: 'Generally saltier', highlight: 'saltier', strong: true },
        { text: ' when the gates are closed during dry seasons in 2018 and 2020.' },
      ],
    },
    bf_freshwater_pathway: {
      cardSide: 'right',
      whyThisPlace:
        'This fortified corridor is intended to carry freshwater toward the southern pumping plants while keeping the route operable during drought.',
      keyTakeaway: [
        { text: 'Generally fresher', highlight: 'fresher', strong: true },
        { text: ' during the critical dry period in October–November 2020.' },
      ],
    },
    clifton_court_forebay: {
      cardSide: 'left',
      whyThisPlace:
        'Clifton Court Forebay is the corridor’s southern destination and shows how upstream interventions could affect water reaching the export system.',
      keyTakeaway: [
        { text: 'Generally fresher', highlight: 'fresher', strong: true },
        { text: ' during gate-closure periods in late 2018 and 2020.' },
      ],
    },
  },
}

/**
 * Edit the row order in the detailed regional timeline here.
 * Place IDs not listed remain at the end in their source-data order.
 */
export const regionalPlaceOrder: Record<string, string[]> = {
  'bolster-and-fortify': [
    'north_franks_tract',
    'franks_tract',
    'bf_freshwater_pathway',
    'clifton_court_forebay',
  ],
}

/**
 * Pattern IDs intentionally omitted from the public regional-summary experience.
 * Keep the source evidence intact and curate unusually short or misleading events here.
 */
export const excludedRegionalPatternIds = new Set(['franks_tract_bf_closure_2'])

export function sortRegionalPlaces(scenarioSlug: string, places: RegionalPlace[]) {
  const order = regionalPlaceOrder[scenarioSlug]
  if (!order) return places

  const rank = new Map(order.map((placeId, index) => [placeId, index]))
  return places
    .map((place, sourceIndex) => ({ place, sourceIndex }))
    .sort(
      (a, b) =>
        (rank.get(a.place.id) ?? order.length + a.sourceIndex) -
        (rank.get(b.place.id) ?? order.length + b.sourceIndex),
    )
    .map(({ place }) => place)
}

const scenarioContextFallback: Record<string, string> = {
  'eco-machine':
    'This place shows where restored tidal landscapes could influence nearby waterways, habitat, and communities as part of the Delta’s water-management system.',
  'new-green-watershed':
    'This place connects landscape restoration and adapted land uses to their potential local effects on habitat, agriculture, and Delta communities.',
  'calling-on-reserves':
    'This place shows where changing reservoir-release timing could affect Delta ecosystems, water users, and communities while preserving drought reserves.',
  'alternative-delta-outflows':
    'This place highlights potential waterway and community tradeoffs from changing the amount and timing of freshwater leaving the Delta.',
  'a-tunnel':
    'This place helps show how the proposed conveyance route could redistribute environmental and community impacts across the Delta.',
}

export function getRegionalPlaceContent(scenarioSlug: string, place: RegionalPlace) {
  const content = regionalPlaceContent[scenarioSlug]?.[place.id]
  return {
    displayName: content?.displayName ?? place.name,
    cardSide: content?.cardSide ?? ('left' as RegionalPlaceCardSide),
    whyThisPlace:
      content?.whyThisPlace ??
      scenarioContextFallback[scenarioSlug] ??
      'This place connects the scenario’s adaptation strategy to potential effects on nearby waterways and communities.',
    keyTakeaway: content?.keyTakeaway,
  }
}
