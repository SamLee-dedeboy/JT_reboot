import type { ScenarioKey } from '@/content/names'

/** The four strategy areas of the Delta Adapts Adaptation Plan. */
export type StrategyAreaKey = 'FL' | 'ECO' | 'AG' | 'WSR'

/** The adaptation scenarios the governance team scored the plan's actions against. */
export type GovernanceScenarioKey = Extract<
  ScenarioKey,
  'tunnel' | 'cor' | 'bf' | 'more' | 'em' | 'ngw'
>

/**
 * One Adaptation Plan action. A score is the team's alignment code for one scenario:
 * A 1.00 directly performed, B 0.75 partly, C 0.50 a likely precondition, D 0.25
 * supportive with changes, E 0.20 broadly helpful with no tie-in, X 0 irrelevant.
 */
export interface GovernanceAction {
  /** FL-1-1, ECO-3-2, ... */
  id: string
  /** The strategy the action belongs to: FL-1, ECO-3, ... */
  strategy: string
  area: StrategyAreaKey
  text: string
  scores: Record<GovernanceScenarioKey, number>
  /** The lead organizations the plan names for the action's strategy. */
  leads: LeadKey[]
  /** How many partner organizations the strategy names. */
  partners: number
}

/**
 * The organizations that lead the plan's strategies. Water suppliers, water utilities
 * and reservoir operators are groups rather than agencies and share `suppliers`.
 */
export type LeadKey =
  'cnra' | 'dsc' | 'dwr' | 'swrcb' | 'conservancy' | 'cdfa' | 'suppliers' | 'deltaAgencies'
