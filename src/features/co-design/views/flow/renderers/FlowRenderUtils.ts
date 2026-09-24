// Ported from JT_dashboard/src/lib/Flow/renderers/FlowRenderUtils.ts.
// Dropped as unreachable: highlight_blocks_by_combinations, _addLink,
// generate_center_path, first_column_paths and generate_overlapping_paths
// (only used by the disabled comparison mode / combination highlighting).
import * as d3 from 'd3'
import type {
  tBlock,
  tPathData,
  tLink,
  tDecisionMakingBlockContent,
  tColumnMetadata,
} from '../types'

type Coordinate = {
  x: number
  y: number
}

export function update_blocks(original_blocks: tBlock[], new_block: tBlock) {
  const original_block_ids = original_blocks.map((d) => d.id)
  if (original_block_ids.includes(new_block.id)) {
    const index = original_block_ids.indexOf(new_block.id)
    const original_participants = original_blocks[index].participants
    original_blocks[index].participants = original_participants.concat(new_block.participants)
    original_blocks[index].content = (original_blocks[index].content || []).concat(
      new_block.content || [],
    )
  } else {
    original_blocks.push(new_block)
  }
  return original_blocks
}

export function highlight_blocks_by_participants(highlight_participants: string[]) {
  const blocks = [...document.querySelectorAll<HTMLElement>('.block-container')].filter(
    (ele) => !ele.classList.contains('leading'),
  )
  blocks.forEach((block) => {
    block.classList.remove('highlight-block')
    block.classList.remove('dismiss-block')
    const block_data_str = String(block.dataset.json)
    if (block_data_str !== 'undefined') {
      const block_data = JSON.parse(block_data_str)
      const block_participants: string[] = block_data.participants
      if (block_participants.some((participant) => highlight_participants.includes(participant))) {
        block.classList.remove('dismiss-block')
        block.classList.add('highlight-block')
      } else {
        block.classList.remove('highlight-block')
        block.classList.add('dismiss-block')
      }
    }
  })
}

export function aggregate_blocks(
  categories: string[],
  category_participants: { [key: string]: string[] },
  category_content: tDecisionMakingBlockContent,
  column_id: string,
  category_process_func: (category: string) => string,
) {
  let blocks: tBlock[] = []
  categories.forEach((category) => {
    const original_category = category
    category = category_process_func(category)
    const participants = [...new Set<string>(category_participants[column_id + category])]
    update_blocks(blocks, {
      id: column_id + category,
      column_id: column_id,
      title: original_category,
      participants: participants,
      content:
        category_content[column_id + category]?.map(
          (participant_categories) =>
            [participant_categories.participant, participant_categories.name] as [string, string],
        ) || [],
    })
  })
  blocks = blocks.sort((a, b) => {
    return (
      (b.participants.length || 0) - (a.participants.length || 0) || a.title.localeCompare(b.title)
    )
  })
  return blocks
}

export function generate_flow(
  source_start: Coordinate,
  target_end: Coordinate,
  source_height: number,
  target_height: number,
) {
  const path = d3.path()
  const mid_x = (source_start.x + target_end.x) / 2
  const vertical_offset = 0
  path.moveTo(source_start.x, source_start.y + vertical_offset)
  path.bezierCurveTo(
    mid_x,
    source_start.y + vertical_offset,
    mid_x,
    target_end.y + vertical_offset,
    target_end.x,
    target_end.y + vertical_offset,
  )
  path.lineTo(target_end.x, target_end.y + target_height - vertical_offset)
  path.bezierCurveTo(
    mid_x,
    target_end.y + target_height - vertical_offset,
    mid_x,
    source_start.y + source_height - vertical_offset,
    source_start.x,
    source_start.y + source_height - vertical_offset,
  )
  path.lineTo(source_start.x, source_start.y)
  path.closePath()
  return path
}

export function block_participants_to_dict(block_participant_list: [string, string[]][]) {
  const res: { [key: string]: string[] } = {}
  block_participant_list.forEach((block) => {
    res[block[0]] = block[1]
  })
  return res
}

export function compute_block_offset(
  block_id: string,
  combination_offset: [number, number],
  svg_bbox: { x: number; y: number },
  isStart: boolean,
) {
  const node = d3.select(`#${block_id}`).node() as HTMLElement | null
  if (!node) return null
  const block_position = node.getBoundingClientRect()
  const offset = block_position.height * combination_offset[0]
  const height = block_position.height * (combination_offset[1] - combination_offset[0])
  const pos = {
    x: block_position.x + (isStart ? 1 : 0) * block_position.width - svg_bbox.x,
    y: block_position.y + offset - svg_bbox.y,
  }
  return { pos, height }
}

export function update_block_totals(block_totals: { [key: string]: number }, blocks: tBlock[]) {
  blocks.forEach((block) => {
    const block_id = block.id
    block_totals[block_id] = block.participants.length
  })
  return block_totals
}

export function addLink(
  links: tLink[],
  source: string,
  target: string,
  source_column: string,
  target_column: string,
  combination: string,
  participants: string[],
) {
  for (let i = 0; i < links.length; i++) {
    if (
      links[i].source === source &&
      links[i].target === target &&
      links[i].combination === combination
    ) {
      links[i].value += 1
      return
    }
  }
  links.push({
    source: source,
    target: target,
    source_column: source_column,
    target_column: target_column,
    value: 1,
    combination: combination,
    participants: participants,
  })
  return links
}

export function generate_paths(
  svgId: string,
  links: tLink[],
  block_combinations: { [key: string]: { [key: string]: string[] } },
) {
  const svg = d3.select<SVGSVGElement, unknown>(svgId)
  const svg_bbox = svg.node()!.getBoundingClientRect()
  const paths: tPathData[] = []
  const block_offset_ratios = _block_offset_ratios(block_combinations)
  links.forEach((link) => {
    // source
    const source_block_combination_offset = block_offset_ratios[link.source][link.combination]
    const source_computation = compute_block_offset(
      link.source,
      source_block_combination_offset,
      svg_bbox,
      true,
    )
    if (!source_computation) return
    const source_end = source_computation.pos
    const source_height = source_computation.height
    // target
    const target_block_combination_offset = block_offset_ratios[link.target][link.combination]
    const target_computation = compute_block_offset(
      link.target,
      target_block_combination_offset,
      svg_bbox,
      false,
    )
    if (!target_computation) return
    const target_start = target_computation.pos
    const target_height = target_computation.height
    // render path
    const path = generate_flow(source_end, target_start, source_height, target_height)
    paths.push({
      id: link.combination,
      participants: link.participants,
      source: link.source,
      target: link.target,
      source_column: link.source_column,
      target_column: link.target_column,
      class: 'flow',
      path: path,
    })
  })
  return paths
}

function _block_offset_ratios(block_combinations: { [key: string]: { [key: string]: string[] } }) {
  const block_offset_ratios: {
    [key: string]: { [key: string]: [number, number] }
  } = {}
  Object.keys(block_combinations).forEach((block_id) => {
    block_offset_ratios[block_id] = {}
    const combinations = block_combinations[block_id]
    // total participants
    let total_participants = 0
    Object.values(combinations).forEach((participants) => {
      total_participants += participants.length
    })
    // ratios
    let accumulative_ratio = 0
    Object.entries(combinations).forEach(([combination, participants]) => {
      const new_ratio = participants.length / total_participants
      block_offset_ratios[block_id][combination] = [
        accumulative_ratio,
        accumulative_ratio + new_ratio,
      ]
      accumulative_ratio += new_ratio
    })
  })
  return block_offset_ratios
}

export function paths_between_columns(
  svgId: string,
  block_combinations: { [key: string]: { [key: string]: string[] } },
  passthrough_combinations: string[],
  src_block_ids: string[],
  dst_block_ids: string[],
  src_column_id_prefix: string,
  dst_column_id_prefix: string,
) {
  const links: tLink[] = []

  // connect blocks
  src_block_ids.forEach((src_block_id) => {
    const src_block_combinations = Object.keys(block_combinations[src_block_id]).filter((value) =>
      passthrough_combinations.includes(value),
    )
    dst_block_ids.forEach((dst_block_id) => {
      const dst_block_combinations = Object.keys(block_combinations[dst_block_id]).filter((value) =>
        passthrough_combinations.includes(value),
      )
      const src_dst_intersect_combinations = src_block_combinations.filter((value) =>
        dst_block_combinations.includes(value),
      )
      src_dst_intersect_combinations.forEach((combination) => {
        const intersect_src_block_participants = block_combinations[src_block_id][combination]
        const intersect_dst_block_participants = block_combinations[dst_block_id][combination]
        const intersect_participants = intersect_src_block_participants.filter((p) =>
          intersect_dst_block_participants.includes(p),
        )
        addLink(
          links,
          src_block_id,
          dst_block_id,
          src_column_id_prefix,
          dst_column_id_prefix,
          combination,
          intersect_participants,
        )
      })
    })
  })
  return generate_paths(svgId, links, block_combinations)
}

export function intersection<T>(list_of_arrays: T[][]) {
  if (list_of_arrays.length === 0) return [] as T[]
  let intersection: T[] = list_of_arrays[0]
  list_of_arrays.forEach((array) => {
    intersection = array.filter((value) => intersection.includes(value))
  })
  return intersection
}

export function connected_components(ordered_columns: tColumnMetadata[], clicked_blocks: tBlock[]) {
  const clicked_columns = clicked_blocks.map((block) => block.column_id)
  const connected_components: tColumnMetadata[][] = []
  let current_components: tColumnMetadata[] = []
  ordered_columns.forEach((column) => {
    if (clicked_columns.includes(column.column_id_prefix)) {
      current_components.push(column)
    } else {
      if (current_components.length > 0) {
        connected_components.push(current_components)
        current_components = []
      }
    }
  })
  if (current_components.length > 0) {
    connected_components.push(current_components)
    current_components = []
  }
  return connected_components
}
