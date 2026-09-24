// Ported from JT_dashboard/src/lib/Flow/flow_store.svelte.ts.
// The module-level Svelte $state runes become one external store. The
// participantState/blockState/... objects keep the original getter/setter API
// (so the renderers port verbatim); components read it through useFlowState.
// Like the original, the state lives for the whole page session, so it
// survives navigating away from and back to the view.
import { useSyncExternalStore } from 'react'
import * as Columns from './constants'
import type { tBlock, tSectionMetadata } from './types'

type FlowState = {
  all_participants: string[]
  mentioned_participants: string[]
  participant_colors: { [key: string]: string }
  participant_combinations: { [key: string]: string }
  base_blocks: tBlock[]
  leading_blocks: tBlock[]
  leading_column: string
  clicked_normal_blocks: tBlock[]
  clicked_leading_blocks: tBlock[]
  clicked_block: tBlock | null
  combination_colors: { [key: string]: string }
  combination_content: { [key: string]: { id: string; title: string }[] }
  highlighted_combinations: string[]
  rendered_combinations: string[]
  view_mode: boolean
  category_options: { [key: string]: string[] }
  sections: tSectionMetadata[]
  // Bumped by flowActions.triggerRenderPaths(); InterviewFlow re-renders the
  // sankey paths after React commits the change (the original awaited tick()).
  render_paths_request: number
}

let state: FlowState = {
  all_participants: [],
  mentioned_participants: [],
  participant_colors: {},
  participant_combinations: {},
  base_blocks: [],
  leading_blocks: [],
  leading_column: '',
  clicked_normal_blocks: [],
  clicked_leading_blocks: [],
  clicked_block: null,
  combination_colors: {},
  combination_content: {},
  highlighted_combinations: [],
  rendered_combinations: [],
  view_mode: true,
  category_options: {},
  sections: [
    {
      id: 'future_management',
      title: 'What should future salinity management strategies focus on?',
      hidden: false,
      revealed: true,
      columns: [
        {
          id: 'strategies',
          title: 'Strategies',
          section_id: 'future_management',
          column_id_prefix: Columns.strategy_column_id,
          value_process_func: Columns.category_process_func,
          type: 'one',
          hidden: false,
        },
      ],
    },
    {
      id: 'drivers_of_change',
      title: 'What are the main drivers of change for Delta salinity',
      hidden: false,
      revealed: false,
      columns: [
        {
          id: 'factors',
          title: 'Factors',
          section_id: 'drivers_of_change',
          column_id_prefix: Columns.factor_column_id,
          value_process_func: Columns.category_process_func,
          type: 'many',
          hidden: false,
        },
      ],
    },
    {
      id: 'decision_making_2',
      title: 'Who is currently represented in Delta planning and decision making?',
      hidden: false,
      revealed: false,
      columns: [
        {
          id: 'represented_groups',
          title: 'Represented Groups',
          section_id: 'decision_making',
          column_id_prefix: Columns.represented_column_id,
          value_process_func: Columns.category_process_func,
          type: 'many',
          hidden: false,
        },
      ],
    },
    {
      id: 'decision_making_3',
      title: 'Who is currently not represented in Delta planning and decision making?',
      hidden: false,
      revealed: false,
      columns: [
        {
          id: 'not_represented_groups',
          title: 'Overlooked Groups',
          section_id: 'decision_making',
          column_id_prefix: Columns.not_represented_column_id,
          value_process_func: Columns.category_process_func,
          type: 'many',
          hidden: false,
        },
      ],
    },
    {
      id: 'decision_making',
      title: 'Is current decision making fair?',
      hidden: false,
      revealed: false,
      columns: [
        {
          id: 'fairness',
          title: 'Fair?',
          section_id: 'decision_making',
          column_id_prefix: Columns.fairness_column_id,
          value_process_func: (d) => d.toLowerCase(),
          type: 'one',
          hidden: false,
        },
      ],
    },
  ],
  render_paths_request: 0,
}

const listeners = new Set<() => void>()

function set<K extends keyof FlowState>(key: K, value: FlowState[K]) {
  state = { ...state, [key]: value }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Subscribe a component to one slice of the flow state. */
export function useFlowState<T>(selector: (s: FlowState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state))
}

export const flowActions = {
  triggerRenderPaths() {
    set('render_paths_request', state.render_paths_request + 1)
  },
}

export const participantState = {
  get all_participants() {
    return state.all_participants
  },
  set all_participants(participants: string[]) {
    set('all_participants', participants)
  },
  get mentioned_participants() {
    return state.mentioned_participants
  },
  set mentioned_participants(participants: string[]) {
    set('mentioned_participants', participants)
  },
  get participant_colors() {
    return state.participant_colors
  },
  set participant_colors(colors: { [key: string]: string }) {
    set('participant_colors', colors)
  },
  get participant_combinations() {
    return state.participant_combinations
  },
  set participant_combinations(combinations: { [key: string]: string }) {
    set('participant_combinations', combinations)
  },
}

export const blockState = {
  get base_blocks() {
    return state.base_blocks
  },
  set base_blocks(blocks: tBlock[]) {
    set('base_blocks', blocks)
  },
  get leading_blocks() {
    return state.leading_blocks
  },
  set leading_blocks(blocks: tBlock[]) {
    set('leading_blocks', blocks)
  },
  get leading_column() {
    return state.leading_column
  },
  set leading_column(column_id: string) {
    set('leading_column', column_id)
  },
  get clicked_normal_blocks() {
    return state.clicked_normal_blocks
  },
  set clicked_normal_blocks(blocks: tBlock[]) {
    set('clicked_normal_blocks', JSON.parse(JSON.stringify(blocks)))
    flowActions.triggerRenderPaths()
  },
  get clicked_leading_blocks() {
    return state.clicked_leading_blocks
  },
  set clicked_leading_blocks(blocks: tBlock[]) {
    set('clicked_leading_blocks', blocks)
  },
  get clicked_block() {
    return state.clicked_block
  },
  set clicked_block(block: tBlock | null) {
    set('clicked_block', block)
  },
}

export const combinationState = {
  get combination_colors() {
    return state.combination_colors
  },
  set combination_colors(colors: { [key: string]: string }) {
    set('combination_colors', colors)
  },
  get combination_content() {
    return state.combination_content
  },
  set combination_content(content: { [key: string]: { id: string; title: string }[] }) {
    set('combination_content', content)
  },
  get highlighted_combinations() {
    return state.highlighted_combinations
  },
  set highlighted_combinations(combinations: string[]) {
    set('highlighted_combinations', combinations)
  },
  get rendered_combinations() {
    return state.rendered_combinations
  },
  set rendered_combinations(combinations: string[]) {
    set('rendered_combinations', combinations)
  },
}

export const uiState = {
  get view_mode() {
    return state.view_mode
  },
  set view_mode(value: boolean) {
    set('view_mode', value)
  },
}

export const sectionState = {
  get category_options() {
    return state.category_options
  },
  set category_options(options: { [key: string]: string[] }) {
    set('category_options', options)
  },
  get sections() {
    return state.sections
  },
  set sections(s: tSectionMetadata[]) {
    set('sections', s)
  },
}
