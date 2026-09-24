// Ported from JT_dashboard/src/lib/Flow/components/sections/DecisionMaking.svelte.
// handleMoveColumnLeft/Right had no callers and are dropped.
import { Box } from '@mui/material'
import type { BlockAggregator } from '../../renderers/BlockAggregator'
import type { tSectionMetadata } from '../../types'
import Column from './Column'
import SectionContent from './SectionContent'

interface Props {
  section: tSectionMetadata
  block_aggregator: BlockAggregator
}

export default function DecisionMaking({ section, block_aggregator }: Props) {
  return (
    <SectionContent>
      <Box
        sx={{ display: 'flex', height: '100%', justifyContent: 'center', columnGap: 2, py: 0.5 }}
      >
        {section.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            show_column_header={section.columns.length > 1}
            blocks={block_aggregator.decision_making_blocks.block_dict[column.id]}
            total_participants={block_aggregator.max_participants}
          />
        ))}
      </Box>
    </SectionContent>
  )
}
