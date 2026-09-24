// Ported from JT_dashboard/src/lib/Flow/components/sections/DriversOfChange.svelte.
import type { BlockAggregator } from '../../renderers/BlockAggregator'
import type { tSectionMetadata } from '../../types'
import Column from './Column'
import SectionContent from './SectionContent'

interface Props {
  section: tSectionMetadata
  block_aggregator: BlockAggregator
}

export default function DriversOfChange({ section, block_aggregator }: Props) {
  return (
    <SectionContent centered>
      {section.columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          blocks={block_aggregator.driver_blocks.factor_category_blocks}
          total_participants={block_aggregator.max_participants}
        />
      ))}
    </SectionContent>
  )
}
