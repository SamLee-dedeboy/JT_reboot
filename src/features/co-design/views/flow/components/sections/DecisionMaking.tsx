// Ported from JT_dashboard/src/lib/Flow/components/sections/DecisionMaking.svelte.
// handleMoveColumnLeft/Right had no callers and are dropped.
import type { BlockAggregator } from '../../renderers/BlockAggregator'
import type { tSectionMetadata } from '../../types'
import Column from './Column'

interface Props {
  section: tSectionMetadata
  block_aggregator: BlockAggregator
}

export default function DecisionMaking({ section, block_aggregator }: Props) {
  return (
    <div className="section-content">
      <div className="nodes-container flex h-full justify-center gap-x-4 rounded py-1 pl-[0rem] text-sm">
        {section.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            show_column_header={section.columns.length > 1}
            blocks={block_aggregator.decision_making_blocks.block_dict[column.id]}
            total_participants={block_aggregator.max_participants}
          />
        ))}
      </div>
    </div>
  )
}
