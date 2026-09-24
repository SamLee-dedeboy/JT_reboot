// Ported from JT_dashboard/src/lib/Linking/renderers/CodeGraphRenderer.ts.
// The renderer draws into an <svg> element handed over by CodeGraph.tsx and
// gains a destroy() so React effects can tear it down (StrictMode remounts).
import * as d3 from 'd3'
import { bubble_color, contrastTextColor } from '../constants'

export type tCode = {
  name: string
  participants: string[]
  scenario_children: string[]
}

export type GraphNode = d3.SimulationNodeDatum & {
  id: string
  name: string
  radius: number
  participantCount: number
  depth: number
  isVisible: boolean
  isExpanded: boolean
  children: string[]
  hasChildren: boolean
  color: string
}

type GraphLink = d3.SimulationLinkDatum<GraphNode> & {
  source: string | GraphNode
  target: string | GraphNode
}

type RootAnchor = { region: [number, number]; outward: [number, number]; angle: number }

export class CodeGraphRenderer {
  svgElement: SVGSVGElement
  width: number = 600
  height: number = 600
  dispatchHover: (node: GraphNode | null) => void = () => {}
  onZoomChange: (scale: number) => void = () => {}
  private allNodes: GraphNode[] = []
  private allLinks: GraphLink[] = []
  private zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown> | null = null
  private simulation: d3.Simulation<GraphNode, GraphLink> | null = null
  // Per top-level id: where it sits inside the canvas (region), where its
  // descendants are pulled toward (outward, for the branch "splay" effect),
  // and the radial angle from the viewport center to both anchors.
  private anchorByRoot: Map<string, RootAnchor> = new Map()

  constructor(svgElement: SVGSVGElement, dispatchHover: (node: GraphNode | null) => void) {
    this.svgElement = svgElement
    this.dispatchHover = dispatchHover
  }

  private svg() {
    return d3.select<SVGSVGElement, unknown>(this.svgElement)
  }

  init() {
    const svg = this.svg().attr('viewBox', `0 0 ${this.width} ${this.height}`)

    // Zoomable group: center-group sits behind links and nodes.
    const zoomGroup = svg.append('g').attr('class', 'zoom-group')
    zoomGroup.append('g').attr('class', 'center-group')
    zoomGroup.append('g').attr('class', 'link-group')
    zoomGroup.append('g').attr('class', 'node-group')
    zoomGroup.append('g').attr('class', 'label-group')

    this.zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        zoomGroup.attr('transform', event.transform.toString())
        this.onZoomChange(event.transform.k)
      })
    svg.call(this.zoomBehavior)
    const k0 = 0.6
    const cx = this.width / 2,
      cy = this.height / 2
    svg.call(
      this.zoomBehavior.transform,
      d3.zoomIdentity.translate(cx * (1 - k0), cy * (1 - k0)).scale(k0),
    )
  }

  // Undo init()/update(): stop the simulation and running transitions,
  // detach the zoom listeners and empty the svg.
  destroy() {
    this.simulation?.stop()
    this.simulation = null
    const svg = this.svg()
    svg.interrupt()
    svg.on('.zoom', null)
    svg.selectAll('*').interrupt().remove()
    this.zoomBehavior = null
  }

  zoomIn() {
    if (!this.zoomBehavior) return
    this.svg().transition().duration(250).call(this.zoomBehavior.scaleBy, 1.4)
  }

  zoomOut() {
    if (!this.zoomBehavior) return
    this.svg()
      .transition()
      .duration(250)
      .call(this.zoomBehavior.scaleBy, 1 / 1.4)
  }

  resetZoom() {
    if (!this.zoomBehavior) return
    const k0 = 0.6
    const cx = this.width / 2,
      cy = this.height / 2
    this.svg()
      .transition()
      .duration(350)
      .call(
        this.zoomBehavior.transform,
        d3.zoomIdentity.translate(cx * (1 - k0), cy * (1 - k0)).scale(k0),
      )
  }

  // Evenly spaced angles shaped per top-level-node count:
  //   1 -> center, 2 -> horizontal, 3 -> Y (one top arm, two below),
  //   4 -> X (four diagonals), N>=5 -> evenly spaced starting at top.
  private anglesForN(n: number): number[] {
    if (n === 1) return [0]
    if (n === 2) return [Math.PI, 0]
    if (n === 3) return [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]
    if (n === 4) return [-(3 * Math.PI) / 4, -Math.PI / 4, (3 * Math.PI) / 4, Math.PI / 4]
    return Array.from({ length: n }, (_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / n)
  }

  private computeRootAnchors(
    codes: tCode[],
    nodeDepths: Map<string, number>,
  ): Map<string, RootAnchor> {
    const topLevelIds = codes
      .filter((c) => c.name !== 'root' && (nodeDepths.get(c.name) || 0) === 1)
      .map((c) => c.name)
      .sort((a, b) => a.localeCompare(b))

    const angles = this.anglesForN(topLevelIds.length)
    const cx = this.width / 2
    const cy = this.height / 2
    const regionR = Math.min(this.width, this.height) * 0.1
    const outwardR = Math.max(this.width, this.height) * 0.1

    const map = new Map<string, RootAnchor>()
    topLevelIds.forEach((id, i) => {
      if (topLevelIds.length === 1) {
        map.set(id, { region: [cx, cy], outward: [cx, cy], angle: 0 })
        return
      }
      const theta = angles[i]
      map.set(id, {
        region: [cx + regionR * Math.cos(theta), cy + regionR * Math.sin(theta)],
        outward: [cx + outwardR * Math.cos(theta), cy + outwardR * Math.sin(theta)],
        angle: theta,
      })
    })
    return map
  }

  private calculateNodeDepths(codes: tCode[]): Map<string, number> {
    const depths = new Map<string, number>()
    const visited = new Set<string>()

    // Create a map of parent -> children relationships
    const parentToChildren = new Map<string, string[]>()
    codes.forEach((code) => {
      parentToChildren.set(code.name, code.scenario_children)
    })

    // Root nodes are the top-level codes (no "\\" separator in the name).
    // Using the path shape directly keeps this correct even when the
    // synthetic "root" entry has been filtered out upstream.
    const rootNodes = codes.filter((code) => code.name !== 'root' && !code.name.includes('\\'))

    // Perform BFS to calculate depths. Top-level codes (the "roots" in
    // our filtered graph) are assigned depth 1 so downstream code that
    // treats depth-1 as the top tier (e.g. computeRootAnchors) keeps
    // working regardless of whether the synthetic "root" sentinel is
    // present.
    const queue: { name: string; depth: number }[] = rootNodes.map((node) => ({
      name: node.name,
      depth: 1,
    }))

    while (queue.length > 0) {
      const { name, depth } = queue.shift()!

      if (visited.has(name)) continue
      visited.add(name)
      depths.set(name, depth)

      const children = parentToChildren.get(name) || []
      children.forEach((child) => {
        if (!visited.has(child)) {
          queue.push({ name: child, depth: depth + 1 })
        }
      })
    }

    return depths
  }

  update(rawCodes: tCode[]) {
    // Restrict to the four canonical top-level categories and anything
    // reachable from them via scenario_children. Stray codes with different
    // prefixes or disconnected from these roots are dropped so the graph
    // stays stable across scenarios.
    const ALLOWED_ROOTS = new Set(['Drivers', 'Value', 'Strategies', 'Governance'])
    const parentToChildrenAll = new Map<string, string[]>()
    rawCodes.forEach((code) => {
      parentToChildrenAll.set(code.name, code.scenario_children)
    })
    const reachable = new Set<string>()
    const queue: string[] = []
    ALLOWED_ROOTS.forEach((root) => {
      if (rawCodes.some((c) => c.name === root)) {
        reachable.add(root)
        queue.push(root)
      }
    })
    while (queue.length > 0) {
      const name = queue.shift()!
      const children = parentToChildrenAll.get(name) || []
      children.forEach((child) => {
        if (!reachable.has(child)) {
          reachable.add(child)
          queue.push(child)
        }
      })
    }
    const codes = rawCodes.filter((c) => reachable.has(c.name))

    // Calculate node depths
    const nodeDepths = this.calculateNodeDepths(codes)

    // Compute one region/outward anchor per top-level node based on how
    // many there are: 4 -> X shape, 3 -> Y, 2 -> horizontal split, etc.
    this.anchorByRoot = this.computeRootAnchors(codes, nodeDepths)

    const scaleRadius = d3
      .scalePow()
      .exponent(1 / 2)
      .domain([0, d3.max(codes, (d) => d.participants.length) || 1])
      .range([30, 70])
    const cx = this.width / 2
    const cy = this.height / 2
    const minDim = Math.min(this.width, this.height)
    const regionR = minDim * 0.1
    const stepR = minDim * 0.4

    // Assign each node a deterministic index within its (root, depth)
    // sibling group, sorted alphabetically, so we can fan them angularly
    // around the root's angle instead of stacking them at a single point.
    const siblingCount = new Map<string, number>()
    const siblingIndex = new Map<string, number>()
    ;[...codes]
      .filter((c) => c.name !== 'root')
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((c) => {
        const rootId = c.name.split('\\')[0]
        const d = nodeDepths.get(c.name) || 1
        const key = `${rootId}|${d}`
        const idx = siblingCount.get(key) ?? 0
        siblingIndex.set(c.name, idx)
        siblingCount.set(key, idx + 1)
      })

    // Construct graph data structure. Initial position is seeded along the
    // root's angle with a radius that scales linearly with depth and an
    // angular offset per sibling so same-level siblings don't overlap.
    const nodes: GraphNode[] = codes
      .filter((code) => code.name !== 'root')
      .map((code) => {
        const rootId = code.name.split('\\')[0]
        const anchor = this.anchorByRoot.get(rootId)
        const depth = nodeDepths.get(code.name) || 1
        let baseX = cx
        let baseY = cy
        if (anchor) {
          const r = regionR + stepR * (depth - 1)
          const key = `${rootId}|${depth}`
          const count = siblingCount.get(key) ?? 1
          const idx = siblingIndex.get(code.name) ?? 0
          // Spread 90° around the root's angle; wider for deeper levels
          // which typically have more siblings.
          const spread = Math.PI / 2
          const frac = count <= 1 ? 0 : idx / (count - 1) - 0.5 // [-0.5, 0.5]
          const theta = anchor.angle + frac * spread
          baseX = anchor.region[0] + r * Math.cos(theta)
          baseY = anchor.region[1] + r * Math.sin(theta)
        }
        return {
          id: code.name,
          name: code.name.split('\\').at(-1)!,
          radius: scaleRadius(code.participants.length),
          participantCount: code.participants.length,
          depth,
          isVisible: true,
          isExpanded: true,
          children: code.scenario_children,
          hasChildren: code.scenario_children.length > 0,
          x: baseX,
          y: baseY,
          color: bubble_color(code.name.split('\\')[0]),
        }
      })

    // Store all nodes and links for later reference
    this.allNodes = nodes

    // Create links from scenario_children relationships
    const links: GraphLink[] = []
    codes.forEach((code) => {
      code.scenario_children.forEach((childName) => {
        // Check if child exists in our codes array
        if (codes.some((c) => c.name === childName)) {
          links.push({
            source: code.name,
            target: childName,
          })
        }
      })
    })
    this.allLinks = links

    // Render only visible nodes and their connections
    this.renderVisibleGraph()
  }

  private renderVisibleGraph() {
    const svg = this.svg()

    // Filter visible nodes and links
    const visibleNodes = this.allNodes.filter((node) => node.isVisible)
    const visibleLinks = this.allLinks.filter((link) => {
      const sourceNode = this.allNodes.find(
        (n) => n.id === (typeof link.source === 'string' ? link.source : link.source.id),
      )
      const targetNode = this.allNodes.find(
        (n) => n.id === (typeof link.target === 'string' ? link.target : link.target.id),
      )
      return sourceNode?.isVisible && targetNode?.isVisible
    })

    const anchorByRoot = this.anchorByRoot

    // Set up D3 force simulation with visible nodes
    this.simulation?.stop()
    const simulation = d3
      .forceSimulation<GraphNode, GraphLink>(visibleNodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(visibleLinks)
          .id((d) => d.id)
          .distance((d) => {
            // Scale distance by the radius of connected nodes
            const sourceNode =
              typeof d.source === 'object' ? d.source : visibleNodes.find((n) => n.id === d.source)
            const targetNode =
              typeof d.target === 'object' ? d.target : visibleNodes.find((n) => n.id === d.target)

            // Depth-1 → depth-2 edges use a tighter range so second-level
            // clusters hug their category root.
            const isTopToSecond =
              sourceNode &&
              targetNode &&
              ((sourceNode.depth === 1 && targetNode.depth === 2) ||
                (sourceNode.depth === 2 && targetNode.depth === 1))
            const baseDistance = isTopToSecond ? 20 : 100
            const minDistance = isTopToSecond ? 60 : 140
            const maxDistance = isTopToSecond ? 100 : 500

            if (sourceNode && targetNode) {
              // Distance is base distance plus sum of radii with a multiplier
              const calculatedDistance =
                baseDistance + (sourceNode.radius + targetNode.radius) * 1.5
              // Clamp the distance between min and max values
              return Math.max(minDistance, Math.min(maxDistance, calculatedDistance))
            }
            return Math.max(minDistance, baseDistance)
          })
          .strength(1),
      )
      // Top-level nodes are pulled strongly toward their own position, and
      // deeper nodes more loosely, so the seeded radial layout holds.
      .force(
        'x',
        d3
          .forceX<GraphNode>()
          .x((d) => {
            const rootId = d.id.split('\\')[0]
            const anchor = anchorByRoot.get(rootId)
            if (!anchor) return this.width / 2
            return d.x!
          })
          .strength((d) => (d.depth === 1 ? 2 : 0.5)),
      )
      .force(
        'y',
        d3
          .forceY<GraphNode>()
          .y((d) => {
            const rootId = d.id.split('\\')[0]
            const anchor = anchorByRoot.get(rootId)
            if (!anchor) return this.height / 2
            return d.y!
          })
          .strength((d) => (d.depth === 1 ? 2 : 0.5)),
      )
      .force(
        'collision',
        d3
          .forceCollide<GraphNode>()
          .radius((d) => d.radius + 5)
          .strength(1),
      )
    this.simulation = simulation

    // Center circle + arrows to top-level nodes
    const cx = this.width / 2,
      cy = this.height / 2
    const centerR = 48
    const topNodes = visibleNodes.filter((n) => n.depth === 1)

    const centerGroup = svg.select('.center-group')

    centerGroup
      .selectAll('circle.center-circle')
      .data([null])
      .join('circle')
      .attr('class', 'center-circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', centerR)
      .attr('fill', '#a3d977')
      .attr('stroke', '#333')
      .attr('stroke-width', 3)

    centerGroup
      .selectAll('text.center-label')
      .data([null])
      .join('text')
      .attr('class', 'center-label')
      .attr('x', cx)
      .attr('y', cy)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-family', "'Hammersmith One', sans-serif")
      .attr('font-weight', '700')
      .attr('font-size', '16px')
      .attr('fill', '#111')
      .attr('pointer-events', 'none')
      .text('SALINITY')

    const arrows = centerGroup
      .selectAll<SVGLineElement, GraphNode>('line.center-arrow')
      .data(topNodes, (d) => d.id)
      .join('line')
      .attr('class', 'center-arrow')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5)

    function updateArrows() {
      arrows
        .attr('x1', (d) => {
          const dx = (d.x ?? cx) - cx,
            dy = (d.y ?? cy) - cy
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          return cx + (dx / dist) * centerR
        })
        .attr('y1', (d) => {
          const dx = (d.x ?? cx) - cx,
            dy = (d.y ?? cy) - cy
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          return cy + (dy / dist) * centerR
        })
        .attr('x2', (d) => {
          const dx = (d.x ?? cx) - cx,
            dy = (d.y ?? cy) - cy
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          return cx + (dx / dist) * Math.max(0, dist - d.radius - 4)
        })
        .attr('y2', (d) => {
          const dx = (d.x ?? cx) - cx,
            dy = (d.y ?? cy) - cy
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          return cy + (dy / dist) * Math.max(0, dist - d.radius - 4)
        })
    }
    updateArrows()

    // Render links
    const link = svg
      .select('.link-group')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(visibleLinks)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)

    // Render nodes
    const node = svg
      .select('.node-group')
      .selectAll<SVGCircleElement, GraphNode>('circle')
      .data(visibleNodes, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('cx', (d) => (d.x = d.x!))
            .attr('cy', (d) => (d.y = d.y!))
            .attr('r', (d) => d.radius)
            .attr('fill', (d) => d.color)
            .attr('stroke', '#333')
            .attr('stroke-width', 1.5)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
              d3.select(event.currentTarget as SVGCircleElement)
                .attr('stroke', '#fff')
                .attr('stroke-width', 3)
              this.dispatchHover(d)
            })
            .on('mouseleave', (event) => {
              d3.select(event.currentTarget as SVGCircleElement)
                .attr('stroke', '#333')
                .attr('stroke-width', 1.5)
            }),
        (update) => update.attr('cx', (d) => (d.x = d.x!)).attr('cy', (d) => (d.y = d.y!)),
      )

    // Add labels. Font-size is scaled from the node radius so the text
    // always reads at a similar weight relative to its bubble; `wrap` then
    // breaks it over multiple lines using the node's diameter as the line
    // width, and a final shrink pass catches anything that still overflows
    // (e.g. a single long word that wrap can't split).
    const label = svg
      .select('.label-group')
      .selectAll<SVGTextElement, GraphNode>('text')
      .data(visibleNodes)
      .join('text')
      .text((d) => (d.depth <= 1 ? d.name.toUpperCase() : d.name))
      .attr('font-size', (d) => Math.max(6, Math.min(14, d.radius * 0.35)) + 'px')
      .attr('font-family', "'Hammersmith One', sans-serif")
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('pointer-events', 'none')
      .style('fill', (d) => contrastTextColor(d.color))
      .call(wrap)

    // Add drag behavior
    const drag = d3
      .drag<SVGCircleElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    node.call(drag)

    // Update positions on simulation tick
    simulation.on('tick', () => {
      updateArrows()
      link.each(function (d) {
        const s = d.source as GraphNode,
          t = d.target as GraphNode
        const dx = (t.x ?? 0) - (s.x ?? 0)
        const dy = (t.y ?? 0) - (s.y ?? 0)
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const ux = dx / dist,
          uy = dy / dist
        d3.select(this)
          .attr('x1', (s.x ?? 0) + ux * s.radius)
          .attr('y1', (s.y ?? 0) + uy * s.radius)
          .attr('x2', (t.x ?? 0) - ux * (t.radius + 4))
          .attr('y2', (t.y ?? 0) - uy * (t.radius + 4))
      })

      node.attr('cx', (d) => (d.x = d.x!)).attr('cy', (d) => (d.y = d.y!))

      label
        .selectAll<SVGTSpanElement, GraphNode>('tspan')
        .attr('x', (d) => (d.x = d.x!))
        .attr('y', (d) => (d.y = d.y!))
    })
  }
}

function wrap(text: d3.Selection<SVGTextElement, GraphNode, d3.BaseType, unknown>) {
  text.each(function (d) {
    const textSel = d3.select(this)
    // Available width inside the circle, with small padding.
    const width = d.radius * 2 * 0.85
    const lineHeight = 1.1 // ems
    const words = textSel
      .text()
      .split(/[\s-]+/)
      .reverse()
    let word: string | undefined
    let line: string[] = []
    let lineNumber = 0
    const x = d.x!,
      y = d.y!,
      dy = 0
    let tspan = textSel
      .text(null)
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', dy + 'em')
      .attr('text-anchor', 'bottom')
      .attr('dominant-baseline', 'central')
    while ((word = words.pop())) {
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node()!.getComputedTextLength() > width && line.length > 1) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = textSel
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .attr('dominant-baseline', 'central')
          .text(word)
      }
    }
    const line_num = textSel.selectAll('tspan').nodes().length
    if (line_num > 1) {
      const offset = (lineHeight * (line_num - 1)) / 2
      textSel.selectAll<SVGTSpanElement, unknown>('tspan').attr('dy', function () {
        const dy = parseFloat(d3.select(this).attr('dy'))
        return dy - offset + 'em'
      })
    }
    // Post-fit: if any single line (e.g. an unsplittable long word) or
    // the total stack height still overflows the circle, shrink the
    // font-size uniformly to make it fit.
    const currentSize = parseFloat(textSel.attr('font-size')) || 10
    let maxLen = 0
    textSel.selectAll<SVGTSpanElement, unknown>('tspan').each(function () {
      maxLen = Math.max(maxLen, this.getComputedTextLength())
    })
    const availableHeight = d.radius * 2 * 0.85
    const stackHeight = line_num * currentSize * lineHeight
    const widthRatio = maxLen > width ? width / maxLen : 1
    const heightRatio = stackHeight > availableHeight ? availableHeight / stackHeight : 1
    const shrink = Math.min(widthRatio, heightRatio)
    if (shrink < 1) {
      textSel.attr('font-size', currentSize * shrink + 'px')
    }
  })
}
