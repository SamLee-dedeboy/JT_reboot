// The Governance page's words. Scenario names come from src/content/names.ts.
import type { LeadKey, StrategyAreaKey } from './data/types'

export const GOVERNANCE_HERO = {
  title: 'Making Just Transitions a Reality',
  /** The summary in runs; an `em` run is set in italics. */
  summary: [
    'What does it take to make ',
    { em: 'Just Transitions Scenarios' },
    ' a reality? To begin to answer this, we studied how each adaptation scenario would be ',
    { em: 'governed' },
    '.',
  ],
} as const

export const PATH_SECTION = {
  id: 'shared-actions',
  eyebrow: 'Shared actions',
  title: 'Where each scenario branches off',
  topNote: (count: number) =>
    `Top actions are the governance team’s overall top actions: the ${count} actions whose scores, summed over all six scenarios, are in the top quarter of the plan’s 129 actions.`,
  pinLabel: 'Highlight a scenario',
  pinAll: 'All',
  /** The card beside an action. */
  actionCard: {
    ledBy: 'Led by',
    partners: (count: number) => `+ ${count} partner${count === 1 ? '' : 's'}`,
    average: (score: string, count: number) =>
      `Average ${score} over ${count} scenario${count === 1 ? '' : 's'}`,
    notConsidered: 'Not considered by',
  },
  leadCount: (name: string, count: number, scenario: string) =>
    `${name} leads ${count} of ${scenario}’s actions`,
  /** The card over a lead's count: how its actions in the highlighted scenario score. */
  leadCard: {
    leads: (count: number, scenario: string) =>
      `Leads ${count} of ${scenario}’s action${count === 1 ? '' : 's'}`,
    byScore: 'By alignment score, one dot per action',
  },
  /** The heads over the tree's scenario and lead actor zones. */
  zones: { scenarios: 'Scenarios', leads: 'Lead actors' },
  /** The axis title over the paths. */
  axisAverage: 'Average alignment score',
  axisScenario: (name: string) => `${name}’s alignment score`,
  hint: 'Hover or tap an action to read it. Tap again, or press Esc, to close.',
  shapes: {
    shared: 'Shared by two or more scenarios',
    single: 'Considered by one scenario only',
    band: (scenario: string) => `Actions considered only for ${scenario}`,
    /** The band's label beside the scenario names. */
    exclusive: 'Exclusive',
    top: 'Top action',
    lead: 'Lead actor',
  },
} as const

/** What each alignment score means, in the governance team's coding. */
export const SCORE_MEANING: Record<number, string> = {
  0: 'Not relevant',
  0.2: 'Broadly helpful, no direct tie-in',
  0.25: 'Supportive with changes',
  0.5: 'Likely precondition',
  0.75: 'Partly performed',
  1: 'Directly performed',
}

/**
 * Lead organizations, in lane order (most of the plan's actions led first). `lane` labels the
 * lane (the name without "California"; the abbreviation goes before it); `short` labels the highlight
 * control; `code` stands in on narrow screens.
 */
export const LEADS: {
  key: LeadKey
  name: string
  /** The organization's own abbreviation, where it has one. */
  abbr?: string
  lane: string
  short: string
  code: string
}[] = [
  {
    key: 'dwr',
    name: 'California Department of Water Resources',
    abbr: 'DWR',
    lane: 'Department of Water Resources',
    short: 'Water Resources',
    code: 'DWR',
  },
  {
    key: 'dsc',
    name: 'Delta Stewardship Council',
    abbr: 'DSC',
    lane: 'Delta Stewardship Council',
    short: 'Stewardship Council',
    code: 'DSC',
  },
  {
    key: 'cnra',
    name: 'California Natural Resources Agency',
    abbr: 'CNRA',
    lane: 'Natural Resources Agency',
    short: 'Natural Resources',
    code: 'CNRA',
  },
  {
    key: 'suppliers',
    name: 'Water suppliers, utilities and reservoir operators',
    lane: 'Water suppliers, utilities, operators',
    short: 'Water suppliers',
    code: 'Suppliers',
  },
  {
    key: 'swrcb',
    name: 'State Water Resources Control Board',
    abbr: 'SWRCB',
    lane: 'State Water Resources Control Board',
    short: 'Water Board',
    code: 'SWRCB',
  },
  {
    key: 'conservancy',
    name: 'Sacramento-San Joaquin Delta Conservancy',
    lane: 'Sacramento-San Joaquin Delta Conservancy',
    short: 'Delta Conservancy',
    code: 'Conservancy',
  },
  {
    key: 'cdfa',
    name: 'California Department of Food and Agriculture',
    abbr: 'CDFA',
    lane: 'Department of Food and Agriculture',
    short: 'Food & Agriculture',
    code: 'CDFA',
  },
  {
    key: 'deltaAgencies',
    name: 'Delta agencies',
    lane: 'Delta agencies',
    short: 'Delta agencies',
    code: 'Delta',
  },
]

export const STRATEGY_AREA_NAMES: Record<StrategyAreaKey, string> = {
  FL: 'Flood risk',
  ECO: 'Ecosystems',
  AG: 'Agriculture',
  WSR: 'Water supply reliability',
}
