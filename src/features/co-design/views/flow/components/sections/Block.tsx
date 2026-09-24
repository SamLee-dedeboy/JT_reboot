// Ported from JT_dashboard/src/lib/Flow/components/sections/Block.svelte.
// The BlockContent popup (and its handleNavigate) was commented out in the
// original, so BlockContent.svelte is not ported; the hidden expand icon is
// kept and still toggles `showing-content`.
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { assetUrl } from '../../../../../../utils/baseUrl'
import * as Constants from '../../constants'
import { blockState, useFlowState } from '../../flowStore'
import type { tBlock } from '../../types'

interface Props {
  block: tBlock
  total_participants: number
  base_space: number
  grow?: boolean
  show_icon_list?: boolean
}

function update_blocks(existing_blocks: tBlock[], new_block: tBlock) {
  const existing_ids = existing_blocks.map((b) => b.id)
  if (existing_ids.includes(new_block.id)) {
    return existing_blocks.filter((b) => b.id !== new_block.id)
  } else {
    return [...existing_blocks, new_block]
  }
}

export default function Block({
  block,
  total_participants,
  base_space,
  grow = false,
  show_icon_list = true,
}: Props) {
  const participant_combinations = useFlowState((s) => s.participant_combinations)
  const view_mode = useFlowState((s) => s.view_mode)
  const clicked_normal_blocks = useFlowState((s) => s.clicked_normal_blocks)
  const clicked_leading_blocks = useFlowState((s) => s.clicked_leading_blocks)

  const clicked =
    clicked_leading_blocks.map((b) => b.id).includes(block.id) ||
    clicked_normal_blocks.map((b) => b.id).includes(block.id)
  const leading = view_mode && block.column_id === Constants.strategy_column_id

  const block_combinations = block.participants.map((pid) => participant_combinations[pid])

  const [show_content, setShowContent] = useState(false)

  const height =
    (block.participants && block.participants.length > 0
      ? (base_space * block.participants.length) / total_participants
      : 0) + '%'
  // Categories nobody mentioned collapse to a faded, non-interactive stub.
  const missing = block_combinations.length === 0
  const dense = block.participants.length > 5

  const data_json = JSON.stringify({
    column: block.column_id,
    combinations: block_combinations,
    participants: block.participants,
  })

  // `block-container` / `leading` are DOM hooks for highlight_blocks_by_participants.
  const className = [
    'block-container',
    show_content ? 'showing-content' : '',
    clicked ? 'clicked' : '',
    leading ? 'leading' : '',
  ].join(' ')

  return (
    <Box
      role="button"
      tabIndex={0}
      className={className}
      sx={(theme) => {
        const tokens = theme.coDesign.flow.block
        return {
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          width: 128,
          flex: grow ? '1 1 auto' : 'none',
          pointerEvents: 'auto',
          color: clicked ? tokens.clickedText : undefined,
          outline: clicked ? tokens.clickedOutline : tokens.outline,
          borderRadius: clicked ? tokens.radius : 0,
          boxShadow: clicked ? tokens.clickedShadow : 'none',
          '&:focus-visible': { outline: tokens.focusOutline },
          ...(leading && { maxWidth: '12rem' }),
          ...(missing && { opacity: 0.2, flexGrow: 0, pointerEvents: 'none' }),
        }
      }}
      style={{ height: missing ? '5%' : height }}
      onClick={(e) => {
        if (!e.defaultPrevented) {
          e.preventDefault()
          blockState.clicked_normal_blocks = update_blocks(blockState.clicked_normal_blocks, block)
        }
      }}
      data-json={data_json}
    >
      {view_mode && show_icon_list && (
        // Expand toggle; hidden in the original too.
        <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 10, display: 'none' }}>
          <Box sx={{ display: 'flex' }}>
            <Box
              role="button"
              tabIndex={0}
              sx={(theme) => ({
                display: 'flex',
                width: 16,
                height: 16,
                alignItems: 'center',
                justifyContent: 'center',
                p: 0.25,
                '&:hover': { bgcolor: theme.coDesign.flow.block.iconHoverBackground },
              })}
              onClick={(e) => {
                e.preventDefault()
                if (block.content) setShowContent((v) => !v)
              }}
            >
              {/* maximize.svg does not exist in the original's public/ either. */}
              <img src={assetUrl('images/co-design/maximize.svg')} alt="[]" />
            </Box>
          </Box>
        </Box>
      )}
      <Box
        id={block.id}
        sx={(theme) => ({
          position: 'relative',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0.5,
          textAlign: 'center',
          color: theme.coDesign.flow.block.text,
          bgcolor: theme.coDesign.flow.block.background,
        })}
        data-json={data_json}
      >
        <Typography
          variant={dense ? 'controlLabel' : 'chartAxis'}
          component="div"
          sx={{ width: '100%', userSelect: 'none', color: 'inherit' }}
        >
          {block.title}{' '}
          {block.column_id !== Constants.fairness_column_id && (
            <Typography variant="chartAxis" component="div" sx={{ opacity: 0.7, color: 'inherit' }}>
              ({block.participants.length})
            </Typography>
          )}
        </Typography>
      </Box>
    </Box>
  )
}
