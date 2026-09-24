// D3 layout for one sunburst wheel, extracted from `renderSunburst()` in
// JT_dashboard/src/lib/Sunburst/SunburstChart.svelte. D3 computes the
// partition, arcs, label transforms, word-wrapped label lines and callout
// positions; SunburstChart.tsx renders the result declaratively.
import * as d3 from 'd3'
import { rgb as parseColor } from 'd3'
import { getConsistentColor } from './sunburstData'
import type { CategoryPalette, SunburstData } from './sunburstData'

export type SunburstNode = d3.HierarchyRectangularNode<SunburstData>

// The slice the chart is zoomed into. Holds the node's geometry from the
// render it was clicked in, exactly as the Svelte `zoomedParent` did.
export interface ZoomTarget {
  name: string
  x0: number
  x1: number
  y0: number
  y1: number
}

export interface ArcItem {
  // Stable id (ancestor names) so hover state survives a font-triggered re-layout.
  id: string
  node: SunburstNode
  d: string
  fill: string
  cursor: 'pointer' | 'default'
  display: 'block' | 'none'
}

export interface OuterArcItem {
  d: string
  fill: string
  display: 'block' | 'none'
}

export interface LabelLine {
  text: string
  first: boolean
  dy: string
}

export interface LabelItem {
  transform: string
  // CSS font size, computed from the slice's angular width.
  textSize: string
  fill: string
  halo: string | null
  display: 'block' | 'none'
  lines: LabelLine[]
}

export interface CalloutItem {
  points: string
  color: string
  x: number
  y: number
  anchor: 'start' | 'end'
  text: string
}

export interface SunburstLayout {
  viewBox: string
  translate: string
  arcs: ArcItem[]
  outerArcs: OuterArcItem[]
  labels: LabelItem[]
  callouts: CalloutItem[]
}

// Theme colours for text drawn on slices (theme.coDesign.sunburst.wheel).
export interface LabelColors {
  labelLight: string
  labelDark: string
  haloLight: string
  haloDark: string
}

// Font the labels are rendered (and therefore measured) in.
export interface LabelFont {
  family: string
  weight: string | number
}

export interface LayoutOptions {
  data: SunburstData
  zoomed: ZoomTarget | null
  colorPalette: CategoryPalette
  labelColors: LabelColors
  globalColorMap: Map<string, string>
  showAllLabels: boolean
  outerCallouts: boolean
  sortBySize: boolean
}

type MeasureText = (text: string, textSize: string) => number

// Perceived-luma test from the original dashboard: dark text above 0.5,
// light text below. Kept (rather than the shared WCAG-luminance helper) because
// it picks the higher-contrast text colour on the mid-tone category shades.
export function isLightColor(backgroundColor: string) {
  const { r, g, b } = parseColor(backgroundColor)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

export function getContrastColor(backgroundColor: string, lightText: string, darkText: string) {
  return isLightColor(backgroundColor) ? darkText : lightText
}

export function getHierarchicalColor(
  d: SunburstNode,
  globalColorMap: Map<string, string>,
  colorPalette: CategoryPalette,
) {
  let parentColor: string | null = null
  if (d.parent && d.parent.data.name) {
    parentColor = getConsistentColor(globalColorMap, colorPalette, d.parent.data.name, d.depth - 1)
  }
  return getConsistentColor(globalColorMap, colorPalette, d.data.name, d.depth, parentColor)
}

// Callout mode places leaf labels outside the wheel; it needs a wider viewBox
// for the side labels and is disabled while zoomed.
export const sunburstViewBox = (outerCallouts: boolean, isZoomed: boolean) =>
  outerCallouts && !isZoomed ? '-190 -30 780 460' : '0 0 400 400'

// Measures SVG text with a throwaway <svg> that has the chart's viewBox,
// on-screen size and label font: Chrome lays text out at its screen scale, so
// this matches the Svelte version measuring the label's own <tspan> with
// getComputedTextLength.
export function createTextMeasurer(
  viewBox: string,
  width: number,
  height: number,
  font: LabelFont,
): { measure: MeasureText; dispose: () => void } {
  const host = document.body
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('font-family', font.family)
  svg.setAttribute('font-weight', String(font.weight))
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('viewBox', viewBox)
  svg.style.position = 'absolute'
  svg.style.left = '0'
  svg.style.top = '0'
  svg.style.width = `${width}px`
  svg.style.height = `${height}px`
  svg.style.visibility = 'hidden'
  svg.style.pointerEvents = 'none'
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
  text.appendChild(tspan)
  svg.appendChild(text)
  host.appendChild(svg)
  return {
    measure: (value, textSize) => {
      text.style.fontSize = textSize
      tspan.textContent = value
      return tspan.getComputedTextLength()
    },
    dispose: () => svg.remove(),
  }
}

// Port of the d3 `wrap(text, width)` helper for transformed (rotated) labels:
// greedy word wrap, 1.1em line height, first line shifted up to centre the block.
function wrap(label: string, width: number, textSize: string, measure: MeasureText): LabelLine[] {
  const lineHeight = 1.1 // ems
  const dy = 0
  const words = label.split(/\s+/).reverse()
  const lines: string[] = []
  let line: string[] = []
  let word: string | undefined
  while ((word = words.pop())) {
    line.push(word)
    if (measure(line.join(' '), textSize) > width && line.length > 1) {
      line.pop()
      lines.push(line.join(' '))
      line = [word]
    }
  }
  lines.push(line.join(' '))

  const lineNum = lines.length
  const centerOffset = lineNum > 1 ? (-(lineNum - 1) * lineHeight) / 2 : dy
  return lines.map((text, i) => ({
    text,
    first: i === 0,
    dy: i === 0 ? centerOffset + 'em' : lineHeight + 'em',
  }))
}

export function computeSunburstLayout(
  {
    data,
    zoomed,
    colorPalette,
    labelColors,
    globalColorMap,
    showAllLabels,
    outerCallouts,
    sortBySize,
  }: LayoutOptions,
  // null until the chart's <svg> has been measured; labels are skipped then.
  measure: MeasureText | null,
): SunburstLayout {
  const width = 400
  const height = 400
  const radius = Math.min(width, height) / 2 - 10
  const isZoomed = zoomed !== null
  const colorOf = (d: SunburstNode) => getHierarchicalColor(d, globalColorMap, colorPalette)

  const useCallouts = outerCallouts && !isZoomed
  const viewBox = sunburstViewBox(outerCallouts, isZoomed)

  // Children of parents outside the top 5 are hidden (only matters when the
  // parent view is not already filtered to its top 5).
  const hiddenChildren = new Set<string>()
  if (data.children) {
    const top5Parents = data.children
      .map((parent) => ({
        name: parent.name,
        totalValue: parent.children ? d3.sum(parent.children, (d) => d.value || 0) : 0,
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5)
      .map((p) => p.name)

    data.children.forEach((parent) => {
      if (!top5Parents.includes(parent.name) && parent.children) {
        parent.children.forEach((child) => {
          hiddenChildren.add(`${parent.name}_${child.name}`)
        })
      }
    })
  }
  const isHidden = (d: SunburstNode) => {
    const parentName = d.parent?.data.name
    return !!parentName && hiddenChildren.has(`${parentName}_${d.data.name}`)
  }
  const displayOf = (d: SunburstNode): 'block' | 'none' => {
    if (d.depth <= 1) return 'block'
    // When zoomed, never hide children
    if (isZoomed) return 'block'
    return isHidden(d) ? 'none' : 'block'
  }

  const arc = d3
    .arc<SunburstNode>()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1)

  const outerArc = d3
    .arc<SunburstNode>()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y1 + 72)
    .outerRadius((d) => d.y1 + 75)

  const hierarchy = d3
    .hierarchy(data)
    .sum((d) => d.value || 0)
    // Size order (largest first) reads more naturally within a single wheel;
    // alphabetical instead keeps the same top-level category in the same
    // angular slot across every sunburst in the gallery.
    .sort((a, b) =>
      sortBySize
        ? (b.value ?? 0) - (a.value ?? 0)
        : d3.ascending(a.data?.name ?? '', b.data?.name ?? ''),
    )
  const root = d3.partition<SunburstData>().size([2 * Math.PI, radius])(hierarchy)

  // If we're zoomed, adjust only the radii to focus on the selected parent
  if (zoomed) {
    const scaleFactor = 1.65
    const scaledInnerRadius = zoomed.y0 * scaleFactor
    const scaledOuterRadius = zoomed.y1 * scaleFactor

    // Keep original angles (x0, x1) unchanged for all nodes
    root.descendants().forEach((node) => {
      if (node.data.name === zoomed.name) {
        // Parent becomes the inner donut
        node.y0 = scaledInnerRadius
        node.y1 = scaledOuterRadius
      } else if (node.parent?.data.name === zoomed.name) {
        // Children fill the outer area, starting after the parent
        node.y0 = scaledOuterRadius
        node.y1 = node.y1 * scaleFactor
      }
    })
  }

  // Calculate the new origin when zoomed: slide the wheel centre towards the
  // canvas border, away from the zoomed slice.
  let translateX = width / 2
  let translateY = height / 2
  if (zoomed) {
    const arcCenterAngle = (zoomed.x0 + zoomed.x1) / 2
    const arcCenterRadius = (zoomed.y0 + zoomed.y1) / 2

    // Arc center position relative to original SVG center
    const arcCenterX = Math.sin(arcCenterAngle) * arcCenterRadius + width / 2
    const arcCenterY = -Math.cos(arcCenterAngle) * arcCenterRadius + height / 2

    // Normalized direction vector from arc center to SVG center
    const directionX = width / 2 - arcCenterX
    const directionY = height / 2 - arcCenterY
    const directionLength = Math.sqrt(directionX * directionX + directionY * directionY)
    const normalizedDirX = directionX / directionLength
    const normalizedDirY = directionY / directionLength

    // Find the closest intersection with the canvas border
    const intersections: { x: number; y: number; distance: number }[] = []
    if (normalizedDirX < 0) {
      const t = -arcCenterX / normalizedDirX
      const y = arcCenterY + t * normalizedDirY
      if (y >= 0 && y <= height) intersections.push({ x: 0, y, distance: t })
    }
    if (normalizedDirX > 0) {
      const t = (width - arcCenterX) / normalizedDirX
      const y = arcCenterY + t * normalizedDirY
      if (y >= 0 && y <= height) intersections.push({ x: width, y, distance: t })
    }
    if (normalizedDirY < 0) {
      const t = -arcCenterY / normalizedDirY
      const x = arcCenterX + t * normalizedDirX
      if (x >= 0 && x <= width) intersections.push({ x, y: 0, distance: t })
    }
    if (normalizedDirY > 0) {
      const t = (height - arcCenterY) / normalizedDirY
      const x = arcCenterX + t * normalizedDirX
      if (x >= 0 && x <= width) intersections.push({ x, y: height, distance: t })
    }

    if (intersections.length > 0) {
      const closestIntersection = intersections.reduce((closest, current) =>
        current.distance < closest.distance ? current : closest,
      )
      const offsetFactor = 1
      translateX = arcCenterX + offsetFactor * (closestIntersection.x - arcCenterX)
      translateY = arcCenterY + (offsetFactor * (closestIntersection.y - arcCenterY)) / 1.25
    }
  }

  const descendants = root.descendants()
  const inZoom = (d: SunburstNode) =>
    zoomed !== null && (d.data.name === zoomed.name || d.parent?.data.name === zoomed.name)

  const arcs: ArcItem[] = descendants
    .filter((d) => (zoomed ? inZoom(d) : d.depth > 0))
    .map((d) => ({
      id: d
        .ancestors()
        .map((n) => n.data.name)
        .join('\u0000'),
      node: d,
      d: arc(d) ?? '',
      fill: colorOf(d),
      // In zoomed mode, the parent (inner circle) is clickable for zoom out
      // and children are hoverable for code definitions
      cursor: (
        zoomed
          ? d.data.name === zoomed.name || d.depth > 1
          : d.depth === 1 && d.children && d.children.length > 0
      )
        ? 'pointer'
        : 'default',
      display: displayOf(d),
    }))

  const outerArcs: OuterArcItem[] = descendants
    .filter(
      (d) => !isZoomed && !useCallouts && d.depth === 1 && d.children && d.children.length > 0,
    )
    .map((d) => {
      const baseColor = colorOf(d)
      const darkColor = d3.color(baseColor)
      const hasVisibleChildren = (d.children ?? []).some(
        (child) => !hiddenChildren.has(`${d.data.name}_${child.data.name}`),
      )
      return {
        d: outerArc(d) ?? '',
        fill: darkColor ? darkColor.darker(0.3).toString() : baseColor,
        display: hasVisibleChildren ? 'block' : 'none',
      }
    })

  // In-ring label transform: centered at the slice mid-point, rotated to run
  // radially and flipped on the bottom half so it stays upright.
  const inRingTransform = (d: SunburstNode) => {
    const angle = (d.x0 + d.x1) / 2
    const r = (d.y0 + d.y1) / 2
    const x = Math.sin(angle) * r
    const y = -Math.cos(angle) * r
    let rotationAngle = (angle * 180) / Math.PI - 90
    if (rotationAngle > 90) rotationAngle -= 180
    else if (rotationAngle < -90) rotationAngle += 180
    return `translate(${x},${y}) rotate(${rotationAngle})`
  }
  const fontScale = d3
    .scaleLinear()
    .domain([0, Math.PI * 2])
    .range([8, 16])
    .clamp(true)
  const inRingFontSize = (d: SunburstNode) => `${fontScale(d.x1 - d.x0)}px`
  // Halo colour: opposite of the text fill, so labels stay legible even when
  // they overrun their slice onto a neighbour.
  const haloFor = (d: SunburstNode) =>
    isLightColor(colorOf(d)) ? labelColors.haloLight : labelColors.haloDark

  const makeLabel = (
    d: SunburstNode,
    wrapWidth: number,
    withHalo: boolean,
    measureText: MeasureText,
  ): LabelItem => {
    const textSize = inRingFontSize(d)
    return {
      transform: inRingTransform(d),
      textSize,
      fill: getContrastColor(colorOf(d), labelColors.labelLight, labelColors.labelDark),
      halo: withHalo ? haloFor(d) : null,
      display: displayOf(d),
      lines: wrap(d.data.name, wrapWidth, textSize, measureText),
    }
  }

  let labels: LabelItem[] = []
  const callouts: CalloutItem[] = []
  if (useCallouts) {
    // Inner ring (themes): in-ring radial text with a halo for legibility.
    if (measure)
      labels = descendants
        .filter((d) => d.depth === 1 && d.x1 - d.x0 > 0.02)
        .map((d) => makeLabel(d, 72, true, measure))

    // Outer ring (codes): callout labels + leader lines outside the wheel,
    // with per-side vertical collision avoidance.
    const elbowGap = 12 // radial gap from wheel edge to the leader elbow
    const labelGap = 44 // horizontal gap from wheel edge to the label column
    const lineH = 13 // minimum vertical spacing between stacked labels
    const bound = 236 // max |y| of the label column

    const leaves = descendants.filter((d) => d.depth === 2 && !!d.parent?.data.name && !isHidden(d))

    for (const side of [1, -1]) {
      const items = leaves
        .map((d) => {
          const a = (d.x0 + d.x1) / 2
          return {
            d,
            a,
            side: Math.sin(a) >= 0 ? 1 : -1,
            y: -Math.cos(a) * (radius + elbowGap),
          }
        })
        .filter((e) => e.side === side)
        .sort((p, q) => p.y - q.y)

      // Push labels apart downward so consecutive ones clear `lineH`.
      let prev = -Infinity
      for (const e of items) {
        if (e.y < prev + lineH) e.y = prev + lineH
        prev = e.y
      }
      // If the column ran past the bottom, shift everything up.
      const overflow = prev - bound
      if (overflow > 0) for (const e of items) e.y -= overflow
      // Clamp the top edge too.
      if (items.length && items[0].y < -bound) {
        const shift = -bound - items[0].y
        for (const e of items) e.y += shift
      }

      const colX = side * (radius + labelGap)
      for (const e of items) {
        const ax = Math.sin(e.a) * radius
        const ay = -Math.cos(e.a) * radius
        const ex = Math.sin(e.a) * (radius + elbowGap)
        const ey = -Math.cos(e.a) * (radius + elbowGap)
        callouts.push({
          points: `${ax},${ay} ${ex},${ey} ${colX},${e.y} ${colX + side * 6},${e.y}`,
          color: colorOf(e.d),
          x: colX + side * 9,
          y: e.y,
          anchor: side === 1 ? 'start' : 'end',
          text: e.d.data.name,
        })
      }
    }
  } else if (measure) {
    labels = descendants
      .filter((d) =>
        // In zoomed mode, show labels for the zoomed parent and its children
        zoomed ? inZoom(d) : d.depth > 0 && d.depth <= 2 && (showAllLabels || d.x1 - d.x0 > 0.1),
      )
      .map((d) => makeLabel(d, isZoomed ? 100 : 60, false, measure))
  }

  return {
    viewBox,
    translate: `translate(${translateX}, ${translateY})`,
    arcs,
    outerArcs,
    labels,
    callouts,
  }
}
