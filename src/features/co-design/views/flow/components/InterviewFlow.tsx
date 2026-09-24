// Ported from JT_dashboard/src/lib/Flow/components/InterviewFlow.svelte.
// Dropped as dead code: the intro.js tour (setTour, never started), the
// comparison-mode path generator (behind `if (false)`), the combination
// highlighting that nothing triggers, the audio/recorder locals and the no-op
// click listener on .flow-container. The `data` / `category_metadata` props only
// fed the unused section-curation code and are no longer passed down.
import * as d3 from 'd3'
import { useCallback, useEffect, useRef } from 'react'
import * as Constants from '../constants'
import {
  blockState,
  combinationState,
  participantState,
  sectionState,
  useFlowState,
} from '../flowStore'
import type { BlockAggregator } from '../renderers/BlockAggregator'
import { combination_controller } from '../renderers/CombinationController'
import * as Utils from '../renderers/FlowRenderUtils'
import type { tBlock, tColumnMetadata, tPathData, tSectionMetadata } from '../types'
import Combinations from './Combinations'
import SectionWrapper from './SectionWrapper'
import './InterviewFlow.css'

interface Props {
  block_aggregator: BlockAggregator
}

function flatten_section_columns(sections: tSectionMetadata[]) {
  let column_orders: tColumnMetadata[] = []
  sections.forEach((section) => {
    column_orders = column_orders.concat(section.columns.filter((c) => !c.hidden))
  })
  return column_orders
}

function highlight_paths_by_clicked_blocks(
  leading_column_participants: string[],
  clicked_normal_blocks: tBlock[],
) {
  const clicked_block_participants = clicked_normal_blocks.map((b) => b.participants).flat()
  const clicked_block_participant_intersection = Utils.intersection(
    clicked_normal_blocks.map((b) => b.participants),
  )
  const highlight_participants = leading_column_participants.filter(
    (pid) =>
      clicked_block_participants.length === 0 ||
      clicked_block_participant_intersection.includes(pid),
  )
  const svg = d3.select('#sankey-svg')
  const paths = svg.selectAll<SVGPathElement, tPathData>('path.sankey')
  const clicked_columns = clicked_normal_blocks.map((b) => b.column_id)
  const clicked_categories = clicked_normal_blocks.map((b) => b.id)
  paths
    .classed('dismiss-path', false)
    .classed('semi-highlight-path', false)
    .classed('highlight-path', false)
    .each(function (d) {
      const participants = d.participants
      if (highlight_participants.filter((hp) => participants.includes(hp)).length === 0)
        return d3.select(this).classed('dismiss-path', true)
      let source_highlight = true
      let target_highlight = true
      if (clicked_columns.includes(d.source_column)) {
        source_highlight = clicked_categories.includes(d.source)
      }
      if (clicked_columns.includes(d.target_column)) {
        target_highlight = clicked_categories.includes(d.target)
      }
      if (source_highlight && target_highlight) {
        return d3.select(this).classed('highlight-path', true)
      } else {
        return d3.select(this).classed('semi-highlight-path', true)
      }
    })
  Utils.highlight_blocks_by_participants(highlight_participants)
}

function normal_mode_paths(
  filtered_column_orders: tColumnMetadata[],
  passthrough_blocks: tBlock[],
  block_participants: { [key: string]: string[] },
  block_aggregator: BlockAggregator,
) {
  const participant_combinations = participantState.participant_combinations
  const showed_column_ids = filtered_column_orders.map((c) => c.id)
  const passthrough_block_ids = passthrough_blocks
    .filter((b) =>
      showed_column_ids.includes(Constants.column_to_participant_data_key[b.column_id]),
    )
    .map((b) => b.id)

  // block combinations
  const block_combinations: { [key: string]: { [key: string]: string[] } } = {}
  Object.entries(block_participants).forEach(([block_id, participants]) => {
    block_combinations[block_id] = {}
    const _participant_combinations: [string, string | undefined][] = participants.map(
      (participant) => [participant, participant_combinations[participant]],
    )
    _participant_combinations.forEach(([participant, combination]) => {
      if (!combination) return
      if (!block_combinations[block_id][combination]) block_combinations[block_id][combination] = []
      block_combinations[block_id][combination].push(participant)
    })
  })
  // generate sankey paths by connected components
  let sankey_paths: tPathData[] = []
  const connected_components = Utils.connected_components(
    filtered_column_orders,
    passthrough_blocks,
  )
  connected_components.forEach((component: tColumnMetadata[]) => {
    const all_column_block_ids = component
      .map((column_order) => block_aggregator.get_blocks(column_order.section_id, column_order.id))
      .map((blocks) => blocks.map((b) => b.id))
    const all_combinations: string[][] = []
    all_column_block_ids.forEach((block_ids) => {
      block_ids = block_ids.filter((id) => passthrough_block_ids.includes(id))
      if (block_ids.length === 0) return
      const combinations = block_ids.map((id) => Object.keys(block_combinations[id])).flat()
      all_combinations.push(combinations)
    })
    const passthrough_combinations = Utils.intersection(all_combinations)
    for (let i = 0; i < component.length - 1; i++) {
      const src_blocks_ids = block_aggregator
        .get_blocks(component[i].section_id, component[i].id)
        .map((b) => b.id)
        .filter((id) => passthrough_block_ids.includes(id))
      const dst_blocks_ids = block_aggregator
        .get_blocks(component[i + 1].section_id, component[i + 1].id)
        .map((b) => b.id)
        .filter((id) => passthrough_block_ids.includes(id))
      const new_paths = Utils.paths_between_columns(
        '#sankey-svg',
        block_combinations,
        passthrough_combinations,
        src_blocks_ids,
        dst_blocks_ids,
        component[i].column_id_prefix,
        component[i + 1].column_id_prefix,
      )
      sankey_paths = sankey_paths.concat(new_paths)
    }
  })
  combinationState.rendered_combinations = Array.from(new Set(sankey_paths.map((p) => p.id)))
  combination_controller.setParticipantColor(
    combinationState.rendered_combinations,
    participant_combinations,
  )
  return sankey_paths
}

export default function InterviewFlow({ block_aggregator }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sections = useFlowState((s) => s.sections)
  const render_paths_request = useFlowState((s) => s.render_paths_request)

  const render_paths = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const svgWidth = container.clientWidth
    const svgHeight = container.clientHeight

    const svg = d3.select('#sankey-svg').attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)

    const block_participants = Utils.block_participants_to_dict(
      block_aggregator.get_all_block_participants(),
    )

    const filtered_column_orders = flatten_section_columns(
      sectionState.sections.filter((section) => !section.hidden && section.revealed),
    )

    const clicked_normal_blocks = blockState.clicked_normal_blocks
    const sankey_paths = normal_mode_paths(
      filtered_column_orders,
      clicked_normal_blocks,
      block_participants,
      block_aggregator,
    )
    const combination_colors = combinationState.combination_colors
    svg
      .selectAll<SVGPathElement, tPathData>('path.sankey')
      .data(sankey_paths, (d) => d.id)
      .join('path')
      .attr('class', (d) => d.class)
      .classed('dismiss-path', false)
      .classed('highlight-path', false)
      .classed('sankey', true)
      .attr('d', (d) => d.path.toString())
      .attr('fill', (d) => combination_colors[d.id])
      .attr('opacity', 0.7)
      .raise()
      .on('click', function (e: MouseEvent, d) {
        e.preventDefault()
        d3.selectAll<SVGPathElement, tPathData>('path.sankey')
          .filter((_d) => _d.id === d.id)
          .raise()
      })
    const highlighted_participants = blockState.clicked_leading_blocks
      .map((b) => b.participants)
      .flat()
    if (highlighted_participants.length > 0) {
      highlight_paths_by_clicked_blocks(highlighted_participants, clicked_normal_blocks)
    }
  }, [block_aggregator])

  // onMount: reset the selection, draw, then reveal the remaining sections
  // one by one.
  useEffect(() => {
    blockState.clicked_normal_blocks = []
    render_paths()
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i < sectionState.sections.length; i++) {
      timers.push(
        setTimeout(() => {
          const next = [...sectionState.sections]
          next[i] = { ...next[i], revealed: true }
          sectionState.sections = next
        }, i * 300),
      )
    }
    return () => timers.forEach(clearTimeout)
  }, [render_paths])

  // flowActions.triggerRenderPaths(): redraw once React has committed the new
  // selection (the Svelte store awaited tick() before calling render_paths).
  useEffect(() => {
    if (render_paths_request > 0) render_paths()
  }, [render_paths_request, render_paths])

  const total_columns = sections.reduce((acc, section) => acc + section.columns.length, 0)
  const total_sections = sections.length

  const updateSection = (index: number, section: tSectionMetadata) => {
    const next = [...sectionState.sections]
    next[index] = section
    sectionState.sections = next
  }

  return (
    <div className="jtd-InterviewFlow upper-page main-content flex gap-5 h-full w-full">
      <div className="flex flex-col gap-2">
        <h4 className="!font-[500]">Interview Questions and Responses</h4>
        <div className="flex flex-1 h-ful w-full">
          <div ref={containerRef} className="flow-container relative flex grow">
            {sections.map(
              (section, index) =>
                section.revealed && (
                  <SectionWrapper
                    key={section.id}
                    section={section}
                    onSectionChange={(s) => updateSection(index, s)}
                    index={index}
                    total_sections={total_sections}
                    total_columns={total_columns}
                    block_aggregator={block_aggregator}
                  />
                ),
            )}
            <svg id="sankey-svg" className="sankey-svg"></svg>
          </div>
        </div>
      </div>
      <div className="control-panel flex w-[20rem] md:w-[18rem] lg:w-[22rem] xl:w-[28rem] flex-col gap-2.5 pb-2">
        <h4 className="!font-[500]">Shared Values and Concerns</h4>
        <div
          className="statistics-panel flex h-1 grow flex-col outline-2"
          style={{ outlineColor: 'var(--border-accent)' }}
        >
          <div className="flex grow flex-col gap-8 pb-4">
            <Combinations />
          </div>
        </div>
      </div>
    </div>
  )
}
