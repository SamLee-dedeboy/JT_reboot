// Ported from JT_dashboard/src/lib/Flow/renderers/CombinationController.ts.
import { participantState, combinationState } from '../flowStore'
import type { tBlock } from '../types'

const colors = [
  '#e6194b', // red
  '#f58231', // orange
  '#ffe119', // yellow
  '#bfef45', // lime
  '#3cb44b', // green
  '#42d4f4', // cyan
  '#4363d8', // blue
  '#911eb4', // purple
  '#f032e6', // magenta
  '#fabed4', // pink
  '#469990', // teal
  '#dcbeff', // lavender
  '#9a6324', // brown
  '#aaffc3', // mint
  '#ffd8b1', // apricot
]
export const combination_controller = {
  generateCombinations(target_blocks: tBlock[]) {
    const block_id_to_title_dict = target_blocks.reduce(
      (acc, block) => {
        acc[block.id] = block.title
        return acc
      },
      {} as { [key: string]: string },
    )
    const participant_blocks: { [key: string]: string[] } = {}
    target_blocks.forEach((block) => {
      const participants = block.participants
      participants.forEach((participant) => {
        if (!participant_blocks[participant]) participant_blocks[participant] = []
        participant_blocks[participant].push(block.id)
      })
    })

    const combinations_set: Set<string[]> = new Set()
    Object.values(participant_blocks).forEach((block_ids) => {
      let exists = false
      for (const existing_combination of combinations_set) {
        if (
          existing_combination.length === block_ids.length &&
          existing_combination.every((value) => block_ids.includes(value))
        ) {
          exists = true
          break
        }
      }
      if (!exists) combinations_set.add(block_ids)
    })

    const combinations_list = Array.from(combinations_set)
    const local_participant_combinations: { [key: string]: string } = {}
    const local_combination_content: { [key: string]: { id: string; title: string }[] } = {}
    Object.entries(participant_blocks).forEach(([participant, block_ids]) => {
      const combination_index = _get_set_index(combinations_list, block_ids)
      const combination = `c-${combination_index}`
      local_combination_content[combination] = combinations_list[combination_index].map((b_id) => {
        return {
          id: b_id,
          title: block_id_to_title_dict[b_id],
        }
      })
      local_participant_combinations[participant] = combination
    })
    combinationState.combination_content = local_combination_content
    participantState.participant_combinations = local_participant_combinations
    participantState.mentioned_participants = Object.keys(local_participant_combinations)
  },
  setParticipantColor(combinations: string[], participant_combinations: { [key: string]: string }) {
    const combination_to_participants = Object.entries(participant_combinations).reduce(
      (acc, [participant, combination]) => {
        if (!acc[combination]) acc[combination] = []
        acc[combination].push(participant)
        return acc
      },
      {} as { [key: string]: string[] },
    )
    const local_combination_colors: { [key: string]: string } = {}
    const local_participant_colors: { [key: string]: string } = {}
    const existing_combination_number = Object.keys(combinationState.combination_colors).length
    let new_combination_number = 0
    combinations.forEach((combination) => {
      let color = ''
      if (combinationState.combination_colors[combination]) {
        color = combinationState.combination_colors[combination]
      } else {
        new_combination_number++
        // set combinations colors by index
        color = colors[(existing_combination_number + new_combination_number) % colors.length]
      }
      local_combination_colors[combination] = color
      const participants = combination_to_participants[combination]
      participants.forEach((participant) => {
        local_participant_colors[participant] = color
      })
    })
    participantState.participant_colors = local_participant_colors
    combinationState.combination_colors = local_combination_colors
  },
}
function _get_set_index(set_list: string[][], target_set: string[]) {
  for (let i = 0; i < set_list.length; i++) {
    if (
      set_list[i].length === target_set.length &&
      [...set_list[i]].every((value) => target_set.includes(value))
    )
      return i
  }
  return -1
}
