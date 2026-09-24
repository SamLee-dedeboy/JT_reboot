// Ported from JT_dashboard/src/lib/MentalModel/renderers/MentalModelRenderer.ts.
// Algorithms are unchanged. Added `destroy()` so React (StrictMode) can tear the
// SVG down and stop every simulation; the never-called drag helpers and
// highlightSelectBubble() were dropped. Colours and fonts come from the theme
// via `MentalModelRendererTokens` (built in AllMMs).
import * as d3 from 'd3'
import { readableTextOn } from '../../../shared/contrast'
import { colorForNode } from '../constants'
import type { CodebookEntry, NodeColors } from '../constants'

const center = 1.6 / 3

export type MMNode = [string, number] &
  d3.SimulationNodeDatum & {
    r?: number
    is_top?: boolean
    is_bottom?: boolean
  }

export type HoverHandler = (node: [string, number] | null, clientY?: number) => void

// Theme values the renderer paints with; see theme.coDesign.mentalModel.
export type MentalModelRendererTokens = {
  nodeColors: NodeColors
  centerFill: string
  stroke: string
  hoverStroke: string
  lightText: string
  darkText: string
  link: string
  linkOpacity: number
  arrow: string
  regionTop: string
  regionBottom: string
  regionOpacity: number
  labelFontFamily: string
  labelFontWeight: string | number
  centerFontFamily: string
  centerFontWeight: string | number
}

export class MentalModelRenderer {
  svgId: string
  width: number = 1000
  height: number = 1000
  dispatchHover: HoverHandler
  tokens: MentalModelRendererTokens
  simulation: d3.Simulation<MMNode, undefined> | undefined
  // Every update() starts a new simulation without stopping the previous one
  // (as the original did); keep them all so destroy() can stop them.
  private simulations: d3.Simulation<MMNode, undefined>[] = []

  constructor(svgId: string, dispatchHover: HoverHandler, tokens: MentalModelRendererTokens) {
    this.svgId = svgId
    this.dispatchHover = dispatchHover
    this.tokens = tokens
  }

  private textOn(fill: string) {
    return readableTextOn(fill, this.tokens.lightText, this.tokens.darkText)
  }

  init() {
    const t = this.tokens
    const svg = d3.select<SVGSVGElement, unknown>(`#${this.svgId}`)
    svg
      .append('defs')
      .append('marker')
      .attr('id', `mm-arrow-${this.svgId}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', t.arrow)
    const regions = svg.append('g').attr('class', 'region')
    svg.append('g').attr('class', 'links_group')
    svg.append('g').attr('class', 'bubble_group')
    svg.append('g').attr('class', 'labels_group')
    svg.append('g').attr('class', 'contour-path-group')
    this.width = +svg.node()!.getBoundingClientRect().width
    this.height = +svg.node()!.getBoundingClientRect().height
    svg.attr('viewBox', `0 0 ${this.width} ${this.height}`)
    regions
      .append('rect')
      .attr('class', 'top_region')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width)
      .attr('height', this.height * center)
      .attr('fill', t.regionTop)
      .attr('opacity', t.regionOpacity)
    regions
      .append('rect')
      .attr('class', 'bottom_region')
      .attr('x', 0)
      .attr('y', this.height * center)
      .attr('width', this.width)
      .attr('height', this.height * (1 - center))
      .attr('fill', t.regionBottom)
      .attr('opacity', t.regionOpacity)
    svg
      .append('circle')
      .attr('class', 'bubble')
      .classed('is_center', true)
      .attr('fill', t.centerFill)
      .attr('stroke', t.stroke)
      .attr('stroke-width', 1.5)
      .attr('cx', this.width / 2)
      .attr('cy', this.height * center)
      .attr('r', 55)
    svg
      .append('text')
      .attr('class', 'bubble_label')
      .attr('x', this.width / 2)
      .attr('y', this.height * center)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-family', t.centerFontFamily)
      .attr('font-weight', t.centerFontWeight)
      .attr('font-size', Math.max(8, Math.min(16, 65 * 0.3)))
      .attr('pointer-events', 'none')
      .attr('fill', this.textOn(t.centerFill))
      .text('SALINITY')
  }

  update(
    _nodes_data: Record<string, number>,
    codebook: CodebookEntry[],
    code_tsne: Record<string, number>,
  ) {
    const t = this.tokens
    const nodes_data = Object.entries(_nodes_data) as MMNode[]
    const node_types = codebook.reduce<Record<string, string>>((acc, item) => {
      acc[item.name] = item.type
      return acc
    }, {})
    const svg = d3.select<SVGSVGElement, unknown>(`#${this.svgId}`)
    const bubble_group = svg.select('g.bubble_group')
    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(nodes_data, (d) => d[1]) as number])
      .range([20, 65])
    const nodes = nodes_data.concat([['Salinity', 80] as MMNode])
    const classification_force_position_y: Record<string, number> = {
      'impacts salinity': (this.height * center) / 2,
      'impacted by salinity': this.height * center + (this.height * (1 - center)) / 2,
    }
    const circles = bubble_group
      .selectAll<SVGCircleElement, MMNode>('circle')
      .data(nodes, (d) => d[0])
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('class', 'bubble')
            .classed('is_center', (d) => d[0] === 'Salinity')
            .attr('fill', (d) =>
              d[0] === 'Salinity' ? t.centerFill : colorForNode(node_types[d[0]], t.nodeColors),
            )
            .attr('stroke', t.stroke)
            .attr('stroke-width', 1.5)
            .attr('cursor', 'pointer')
            .on('mouseover', (event: MouseEvent, d) => {
              const target = event.currentTarget as SVGCircleElement
              d3.select(target).style('stroke', t.hoverStroke).style('stroke-width', '3px')
              const rect = target.getBoundingClientRect()
              this.dispatchHover(d, rect.top + rect.height / 2)
            })
            .on('mouseout', (event: MouseEvent) => {
              d3.select(event.currentTarget as SVGCircleElement)
                .style('stroke', t.stroke)
                .style('stroke-width', '1.5px')
              this.dispatchHover(null)
            })
            .attr('cx', (d) => (d.x = code_tsne[d[0]] * this.width || this.width / 2))
            .attr(
              'cy',
              (d) =>
                (d.y = classification_force_position_y[node_types[d[0]]] || this.height * center),
            )
            .attr('r', 0)
            .call((sel) =>
              sel
                .transition()
                .duration(300)
                .delay(300)
                .attr('r', (d) => (d.r = d[0] === 'Salinity' ? 55 : radiusScale(d[1]))),
            ),
        (update) =>
          update
            .attr('fill', (d) =>
              d[0] === 'Salinity' ? t.centerFill : colorForNode(node_types[d[0]], t.nodeColors),
            )
            .call((sel) =>
              sel
                .transition()
                .duration(100)
                .attr('cx', (d) => (d.x = code_tsne[d[0]] * this.width || this.width / 2))
                .attr(
                  'cy',
                  (d) =>
                    (d.y =
                      classification_force_position_y[node_types[d[0]]] || this.height * center),
                )
                .attr('r', (d) => (d.r = d[0] === 'Salinity' ? 55 : radiusScale(d[1]))),
            ),
        (exit) => exit.call((sel) => sel.transition().duration(300).attr('r', 0).remove()),
      )
    const node_labels = svg
      .select('g.labels_group')
      .selectAll<SVGTextElement, MMNode>('text')
      .data(nodes, (d) => d[0])
      .join('text')
      .attr('class', 'bubble_label')
      .attr('x', (d) => d.x!)
      .attr('y', (d) => d.y!)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-family', t.labelFontFamily)
      .attr('font-weight', t.labelFontWeight)
      .attr('font-size', (d) => {
        const r = d[0] === 'Salinity' ? 55 : radiusScale(d[1])
        return Math.max(8, Math.min(20, r * 0.25)) + 'px'
      })
      .attr('fill', (d) =>
        this.textOn(
          d[0] === 'Salinity' ? t.centerFill : colorForNode(node_types[d[0]], t.nodeColors),
        ),
      )
      .attr('pointer-events', 'none')
      .text((d) => d[0])
      .each(function (d) {
        wrap(d3.select(this), d.r!)
        const line_num = d3.select(this).selectAll('tspan').nodes().length
        d3.select(this)
          .append('tspan')
          .text(`(${d[1]})`)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('x', d.x!)
          .attr('y', d.y!)
          .attr('dy', `${((line_num + 1) / 2) * 1.2}em`)
      })

    const links = svg
      .select('g.links_group')
      .selectAll<SVGPathElement, MMNode>('path.link')
      .data(
        nodes_data.filter((d) => d[0] !== 'Salinity'),
        (d) => d[0],
      )
      .join('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('stroke', t.link)
      .attr('stroke-opacity', t.linkOpacity)
      .attr('marker-mid', `url(#mm-arrow-${this.svgId})`)
    const canvasRadiusScale = d3
      .scalePow()
      .exponent(1 / 2)
      .domain([
        d3.min(nodes_data, (d) => d[1]) as number,
        d3.max(nodes_data, (d) => d[1]) as number,
      ])
      .range([120, this.height])
    // update force
    const forceNode = d3.forceManyBody<MMNode>()
    this.simulation = d3
      .forceSimulation<MMNode>(nodes)
      .alphaMin(0.001)
      .force(
        'clf_y',
        d3
          .forceY<MMNode>(
            (d) => classification_force_position_y[node_types[d[0]]] || this.height * center,
          )
          .strength(0.1),
      )
      .force(
        'frequency_y',
        d3
          .forceRadial<MMNode>(0, this.width / 2, this.height * center)
          .radius((d) => canvasRadiusScale(d[1]) + 130)
          .strength(0.2),
      )
      .force('charge', forceNode.distanceMin(20))
      .force('collide', d3.forceCollide<MMNode>((d) => 1.1 * d.r!).strength(0.5))
      // Boundary force: keep "impacts salinity" nodes above the center line
      // and "impacted by salinity" nodes below it. On each tick, clamp any
      // node that has crossed and zero out its y velocity so it doesn't
      // bounce. The Salinity center node is pinned to the line.
      .force('boundary', () => {
        const line = this.height * center
        nodes.forEach((d) => {
          const r = d.r ?? 0
          if (d[0] === 'Salinity') return
          const type = node_types[d[0]]
          if (type === 'impacts salinity') {
            const maxY = line - r * 1.2
            if ((d.y ?? 0) > maxY) {
              d.y = maxY
              if (d.vy && d.vy > 0) d.vy = 0
            }
          } else if (type === 'impacted by salinity') {
            const minY = line + r * 1.2
            if ((d.y ?? 0) < minY) {
              d.y = minY
              if (d.vy && d.vy < 0) d.vy = 0
            }
          }
        })
      })
      .on('tick', () => {
        circles
          .attr(
            'cx',
            (d) => (d.x = clip(d.x!, [0 + radiusScale(d[1]), this.width - radiusScale(d[1])])),
          )
          .attr(
            'cy',
            (d) =>
              (d.y = clip(d.y!, [
                0 + radiusScale(d[1]) + 30, // 5 is for the label
                this.height - radiusScale(d[1]) - 30,
              ])),
          )
          .classed('is_top', (d) => (d.is_top = d.y! < this.height * center))
          .classed('is_bottom', (d) => (d.is_bottom = d.y! > this.height * center))
        circles
          .filter((d) => d[0] === 'Salinity')
          .classed('is_top', false)
          .classed('is_bottom', false)
          .attr('cx', (d) => (d.x = this.width / 2))
          .attr('cy', (d) => (d.y = this.height * center))
        node_labels
          .selectAll<SVGTSpanElement, MMNode>('tspan')
          .attr('x', (d) => d.x!)
          .attr('y', (d) => d.y!)
        const salinityCx = this.width / 2,
          salinityCy = this.height * center,
          salinityR = 55
        links
          .each(function (d) {
            const nx = d.x || salinityCx,
              ny = d.y || salinityCy
            const dx = salinityCx - nx,
              dy = salinityCy - ny
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            const ux = dx / dist,
              uy = dy / dist
            const nodeR = d.r || 12
            const nodeEdgeX = nx + ux * nodeR,
              nodeEdgeY = ny + uy * nodeR
            const salEdgeX = salinityCx - ux * (salinityR + 4),
              salEdgeY = salinityCy - uy * (salinityR + 4)
            const isDriver = node_types[d[0]] === 'impacts salinity'
            const x1 = isDriver ? nodeEdgeX : salEdgeX
            const y1 = isDriver ? nodeEdgeY : salEdgeY
            const x2 = isDriver ? salEdgeX : nodeEdgeX
            const y2 = isDriver ? salEdgeY : nodeEdgeY
            const mx = (x1 + x2) / 2,
              my = (y1 + y2) / 2
            d3.select(this).attr('d', `M${x1},${y1} L${mx},${my} L${x2},${y2}`)
          })
          .classed('is_top', (d) => (d.is_top = d.y! < this.height * center))
          .classed('is_bottom', (d) => (d.is_bottom = d.y! > this.height * center))
      })
    this.simulations.push(this.simulation)
  }

  // Stops all simulations/transitions and empties the SVG so init() can run
  // again on the same element (React StrictMode remounts effects).
  destroy() {
    this.simulations.forEach((simulation) => simulation.stop())
    this.simulations = []
    this.simulation = undefined
    const svg = d3.select<SVGSVGElement, unknown>(`#${this.svgId}`)
    svg.selectAll('*').interrupt()
    svg.selectAll('*').remove()
    svg.attr('viewBox', null)
  }
}

function clip(x: number, range: [number, number]) {
  return Math.max(Math.min(x, range[1]), range[0])
}

function wrap(text: d3.Selection<SVGTextElement, MMNode, null, undefined>, radius: number) {
  text.each(function (d) {
    const node = d3.select(this)
    const fullText = node.text()
    const words = fullText.split(/[\s-]+/).filter(Boolean)
    const x = d.x!
    const y = d.y!
    const lineHeight = 1.1 // ems
    const padding = 5 // px reserved on each chord
    const fontSizePx = parseFloat(node.attr('font-size') || '12') || 12
    const lineHeightPx = fontSizePx * lineHeight

    // Width of the horizontal chord at vertical offset `dyPx` from circle center
    const chordWidth = (dyPx: number) => {
      const r2 = radius * radius - dyPx * dyPx
      return r2 > 0 ? 2 * Math.sqrt(r2) - padding : 0
    }

    // Hidden tspan used purely for measurement
    const measureTspan = node.text(null).append('tspan').attr('visibility', 'hidden')
    const measure = (s: string) => {
      measureTspan.text(s)
      return measureTspan.node()!.getComputedTextLength()
    }

    // Break a single word into chunks that each fit in `maxWidth`.
    // Always emits at least one char per chunk to guarantee progress.
    const breakWord = (word: string, maxWidth: number): string[] => {
      const chunks: string[] = []
      let current = ''
      for (const ch of word) {
        const trial = current + ch
        if (current.length > 0 && measure(trial) > maxWidth) {
          chunks.push(current)
          current = ch
        } else {
          current = trial
        }
      }
      if (current) chunks.push(current)
      return chunks.length > 0 ? chunks : [word]
    }

    // Greedy layout assuming `assumedLineCount` total lines (so we know
    // each line's vertical offset and thus its chord width). Returns the
    // resulting lines, or null if the text didn't fit in that many.
    const tryLayout = (assumedLineCount: number): string[] | null => {
      const lines: string[] = []
      const remaining = [...words]
      for (let i = 0; i < assumedLineCount; i++) {
        const yOffset = (i - (assumedLineCount - 1) / 2) * lineHeightPx
        const maxWidth = chordWidth(Math.abs(yOffset) + lineHeightPx / 2)
        if (maxWidth <= 0) return null

        let line = ''
        while (remaining.length > 0) {
          const next = remaining[0]
          const trial = line ? line + ' ' + next : next
          if (measure(trial) <= maxWidth) {
            line = trial
            remaining.shift()
          } else if (!line) {
            // Single word exceeds chord width — break it character-wise
            const chunks = breakWord(next, maxWidth)
            line = chunks[0]
            const leftover = next.slice(chunks[0].length)
            if (leftover) remaining[0] = leftover
            else remaining.shift()
            break
          } else {
            break
          }
        }
        lines.push(line)
        if (remaining.length === 0) return lines
      }
      return null
    }

    const maxLines = Math.max(1, Math.floor((2 * radius) / lineHeightPx))
    let lines: string[] | null = null
    for (let n = 1; n <= maxLines && !lines; n++) {
      lines = tryLayout(n)
    }
    // Fallback: take whatever fits in maxLines, dropping any leftover
    if (!lines) {
      lines = tryLayout(maxLines) || [fullText]
    }

    measureTspan.remove()
    node.text(null)
    const total = lines.length
    lines.forEach((line, i) => {
      const dyEm = (i - (total - 1) / 2) * lineHeight
      node
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dyEm + 'em')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(line)
    })
  })
}
