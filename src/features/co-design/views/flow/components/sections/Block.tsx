// Ported from JT_dashboard/src/lib/Flow/components/sections/Block.svelte.
// The BlockContent popup (and its handleNavigate) was commented out in the
// original, so BlockContent.svelte is not ported; the hidden expand icon is
// kept and still toggles `showing-content`.
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { assetUrl } from '../../../../../../utils/baseUrl'
import * as Constants from '../../constants'
import { blockState, useFlowState } from '../../flowStore'
import type { tBlock } from '../../types'
import './Block.css'

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
  const missing_style: CSSProperties =
    block_combinations.length > 0
      ? {}
      : { opacity: 0.2, height: '5%', flexGrow: 0, pointerEvents: 'none' }

  const data_json = JSON.stringify({
    column: block.column_id,
    combinations: block_combinations,
    participants: block.participants,
  })

  const className = [
    'jtd-Block block-container pointer-events-auto relative flex w-32 justify-center text-[0.9rem] outline-1',
    grow ? 'grow' : 'flex-none',
    show_content ? 'showing-content' : '',
    clicked ? 'clicked' : '',
    leading ? 'leading' : '',
  ]

  return (
    <div
      role="button"
      tabIndex={0}
      className={className.join(' ')}
      style={{ height, ...missing_style, outlineColor: 'var(--jt-blue-dark)' }}
      onClick={(e) => {
        if (!e.defaultPrevented) {
          e.preventDefault()
          blockState.clicked_normal_blocks = update_blocks(blockState.clicked_normal_blocks, block)
        }
      }}
      data-json={data_json}
    >
      {view_mode && show_icon_list && (
        <div className="icon-list absolute right-0 top-0 z-10 hidden">
          <div className="flex">
            <div
              role="button"
              tabIndex={0}
              className="icon-container"
              onClick={(e) => {
                e.preventDefault()
                if (block.content) setShowContent((v) => !v)
              }}
            >
              {/* maximize.svg does not exist in the original's public/ either. */}
              <img src={assetUrl('images/co-design/maximize.svg')} alt="[]" />
            </div>
          </div>
        </div>
      )}
      <div
        id={block.id}
        className="block-element relative flex w-full flex-col items-center justify-center p-1 text-center text-white"
        style={{ backgroundColor: '#506a74' }}
        data-json={data_json}
      >
        <div
          className="w-full select-none"
          style={{
            fontSize: block.participants.length > 5 ? '0.9rem' : '0.7rem',
            lineHeight: block.participants.length > 5 ? '1.2' : '1',
          }}
        >
          {block.title}{' '}
          {block.column_id !== Constants.fairness_column_id && (
            <div className="opacity-70 text-[0.75em] leading-tight">
              ({block.participants.length})
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
