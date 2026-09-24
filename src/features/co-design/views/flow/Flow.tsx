// Listening view, ported from JT_dashboard/src/lib/Flow/Flow.svelte.
// Dropped: the unused `transcripts` / `category_metadata` locals and the
// debug console.log calls.
import { Box, Typography } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { getFlowData } from '../../api'
import InterviewFlow from './components/InterviewFlow'
import * as Constants from './constants'
import { blockState, participantState, sectionState } from './flowStore'
import { BlockAggregator } from './renderers/BlockAggregator'
import { combination_controller } from './renderers/CombinationController'
import type { tBlock, tDataset } from './types'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

function setParticipantColor(comparison_mode: boolean, leading_blocks: tBlock[]) {
  updateDefaultBaseBlocks(leading_blocks)
  if (!comparison_mode) {
    combination_controller.generateCombinations(leading_blocks)
  }
}

function updateDefaultBaseBlocks(leading_blocks: tBlock[]) {
  const middle_block_index = Math.floor(leading_blocks.length / 2)
  blockState.base_blocks = [
    leading_blocks[middle_block_index],
    leading_blocks[middle_block_index + 1],
  ]
}

export default function Flow() {
  const [loaded, setLoaded] = useState<BlockAggregator | null>(null)

  useEffect(() => {
    let cancelled = false
    getFlowData<tDataset>().then((res) => {
      if (cancelled) return
      // blocks
      const block_aggregator = new BlockAggregator(res)
      blockState.leading_blocks = block_aggregator.future_management_blocks.strategy_blocks
      blockState.leading_column = Constants.strategy_column_id

      // set participant colors
      setParticipantColor(false, blockState.leading_blocks)

      // set store (copy so the cached API payload is not mutated)
      sectionState.category_options = {
        ...res.metadata,
        [Constants.fairness_column_id]: ['fair', 'unfair'],
      }
      participantState.all_participants = Object.keys(res.participant_data)
      setLoaded(block_aggregator)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (loaded) {
    return <InterviewFlow block_aggregator={loaded} />
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={(theme) => ({
          width: theme.coDesign.flow.loading.size,
          height: theme.coDesign.flow.loading.size,
          border: `${theme.coDesign.flow.loading.thickness}px solid ${theme.coDesign.flow.loading.track}`,
          borderTopColor: theme.coDesign.flow.loading.indicator,
          borderRadius: '50%',
          animation: `${spin} 0.8s linear infinite`,
        })}
      />
      <Typography variant="meta" sx={(theme) => ({ color: theme.coDesign.flow.loading.text })}>
        Loading data…
      </Typography>
    </Box>
  )
}
