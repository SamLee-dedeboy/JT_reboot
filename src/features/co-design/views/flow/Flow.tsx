// Listening view, ported from JT_dashboard/src/lib/Flow/Flow.svelte.
// Dropped: the unused `transcripts` / `category_metadata` locals and the
// debug console.log calls.
import { useEffect, useState } from 'react'
import { getFlowData } from '../../api'
import InterviewFlow from './components/InterviewFlow'
import * as Constants from './constants'
import { blockState, participantState, sectionState } from './flowStore'
import { BlockAggregator } from './renderers/BlockAggregator'
import { combination_controller } from './renderers/CombinationController'
import type { tBlock, tDataset } from './types'
import './Flow.css'

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
    <div className="jtd-Flow loading-container">
      <div className="spinner"></div>
      <p>Loading data…</p>
    </div>
  )
}
