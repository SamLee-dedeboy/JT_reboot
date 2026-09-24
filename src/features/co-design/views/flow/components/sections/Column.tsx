// Ported from JT_dashboard/src/lib/Flow/components/sections/Column.svelte.
// `bind:column` is dropped: nothing inside the column can change it (the
// header's hide toggle is commented out in the original).
import { useFlowState } from '../../flowStore'
import type { tBlock, tColumnMetadata } from '../../types'
import Block from './Block'
import ColumnHeader from './ColumnHeader'

interface Props {
  column: tColumnMetadata
  blocks: tBlock[]
  show_column_header?: boolean
  total_participants: number
}

function sum(array: number[]) {
  return array.reduce((a, b) => a + b, 0)
}

function _sorted_blocks(
  column: tColumnMetadata,
  _blocks: tBlock[],
  leading_column: string,
  base_blocks: tBlock[],
) {
  if (column.id !== leading_column) return _blocks
  const base_block_length1_index = _blocks.indexOf(base_blocks[0])
  const base_block_length2_index = _blocks.indexOf(base_blocks[1])
  const filtered_blocks = _blocks.filter(
    (_, index) => index !== base_block_length1_index && index !== base_block_length2_index,
  )
  const block_participant_lengths = filtered_blocks.map((b) => b.participants.length)
  // find a cutoff such that left and right are most balanced
  let diff = 1000
  let pivot_index = 0
  // this works only if block_participant_lengths is sorted
  for (let i = 0; i < block_participant_lengths.length; i++) {
    const left = block_participant_lengths.slice(0, i)
    const right = block_participant_lengths.slice(i)
    if (Math.abs(sum(left) - sum(right)) < diff) {
      diff = Math.abs(sum(left) - sum(right))
      pivot_index = i
    } else {
      break
    }
  }
  return filtered_blocks
    .slice(0, pivot_index)
    .concat(base_blocks)
    .concat(filtered_blocks.slice(pivot_index))
}

export default function Column({
  column,
  blocks,
  show_column_header = false,
  total_participants,
}: Props) {
  const leading_column = useFlowState((s) => s.leading_column)
  const base_blocks = useFlowState((s) => s.base_blocks)
  const sorted_blocks = _sorted_blocks(column, blocks, leading_column, base_blocks)

  return (
    <div className="question-container flex h-full w-fit flex-col items-center justify-start">
      {show_column_header && <ColumnHeader title={column.title} />}
      <div
        className="mt-1 flex grow flex-col items-center justify-around gap-y-2 px-1"
        style={column.hidden ? { display: 'none' } : undefined}
      >
        {sorted_blocks.map((block) => (
          <Block
            key={block.id}
            block={block}
            total_participants={total_participants}
            base_space={95}
          />
        ))}
      </div>
    </div>
  )
}
