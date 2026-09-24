// Ported from JT_dashboard/src/lib/Flow/components/sections/FutureManagement.svelte.
import type { BlockAggregator } from '../../renderers/BlockAggregator'
import type { tSectionMetadata } from '../../types'
import Column from './Column'
import SectionContent from './SectionContent'

interface Props {
  section: tSectionMetadata
  block_aggregator: BlockAggregator
}

export default function FutureManagement({ section, block_aggregator }: Props) {
  return (
    <SectionContent centered>
      {section.columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          blocks={block_aggregator.future_management_blocks.strategy_blocks}
          total_participants={block_aggregator.max_participants}
        />
      ))}
    </SectionContent>
  )
}
