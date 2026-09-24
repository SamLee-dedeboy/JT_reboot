// One sunburst wheel with drill-down zoom and a hover panel of code
// definitions, ported from JT_dashboard/src/lib/Sunburst/SunburstChart.svelte.
// D3 computes the layout (sunburstLayout.ts); React renders the SVG.
import { useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { getSunburstCode } from '../../api'
import type { SunburstData } from './sunburstData'
import {
  computeSunburstLayout,
  createTextMeasurer,
  getContrastColor,
  getHierarchicalColor,
  sunburstViewBox,
} from './sunburstLayout'
import type { SunburstNode, ZoomTarget } from './sunburstLayout'
import './SunburstChart.css'

interface CodeData {
  name: string
  description?: string
  definition?: string
  parent?: string
  error?: string
  details?: string
}

interface SunburstChartProps {
  data: SunburstData
  title: string
  index: number
  colorPalette: string[]
  globalColorMap: Map<string, string>
  // Optional override for which side the hover tooltip opens on. When unset,
  // falls back to the alternating even/odd heuristic below.
  tooltipSide?: 'left' | 'right'
  // When true, label every arc regardless of how thin it is (instead of
  // suppressing labels on narrow slices). Used by the standalone grid.
  showAllLabels?: boolean
  // When true, the outer (leaf/code) ring is labelled with horizontal callout
  // labels + leader lines outside the wheel, and inner-ring labels get a halo.
  // Greatly reduces clutter on thin slices. Used by the standalone grid.
  outerCallouts?: boolean
  // When true, slices are ordered by size (largest first) instead of
  // alphabetically. Alphabetical keeps a category in the same angular slot
  // across charts; size order makes each individual wheel easier to read.
  sortBySize?: boolean
}

// Label wrapping measures text, so re-run the layout once web fonts finish
// loading (the Svelte version measured whatever font was active at render).
let fontsVersion = 0
function subscribeFonts(onChange: () => void) {
  const handler = () => {
    fontsVersion += 1
    onChange()
  }
  document.fonts.addEventListener('loadingdone', handler)
  return () => document.fonts.removeEventListener('loadingdone', handler)
}
const getFontsVersion = () => fontsVersion

// The static API rejects unknown codes; the original server answered those
// with an HTTP 500, which is what the error panel reported.
async function requestCodeDefinition(codeName: string): Promise<CodeData> {
  try {
    return await getSunburstCode<CodeData>(codeName)
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Code '")) {
      throw new Error('Failed to fetch code definition: 500')
    }
    throw error
  }
}

export default function SunburstChart({
  data,
  title,
  index,
  colorPalette,
  globalColorMap,
  tooltipSide,
  showAllLabels = false,
  outerCallouts = false,
  sortBySize = false,
}: SunburstChartProps) {
  // Zoom state (Svelte kept `zoomedParent` + `isZoomed`, always in sync)
  const [zoomedParent, setZoomedParent] = useState<ZoomTarget | null>(null)
  const isZoomed = zoomedParent !== null

  // Modal state for code definitions
  const [showModal, setShowModal] = useState(false)
  const [modalCodeData, setModalCodeData] = useState<CodeData | null>(null)
  const [isLoadingCode, setIsLoadingCode] = useState(false)
  // Used to ignore stale async responses when the user hovers quickly off or
  // onto another segment while a fetch is still in flight.
  const hoveredCode = useRef<string | null>(null)
  // Color of the currently hovered segment; used to tint the tooltip so it
  // reads as belonging to that slice.
  const [hoveredColor, setHoveredColor] = useState('var(--brand-primary)')
  // Arc under the pointer (d3 set opacity/stroke-width on it imperatively;
  // re-rendering the wheel on zoom dropped that highlight).
  const [hoveredArc, setHoveredArc] = useState<string | null>(null)

  // Every other chart in the row is on the right side of its row; offset the
  // hover tooltip to the side with more space. An explicit `tooltipSide` prop
  // overrides this (used by the standalone grid so edge charts open inward).
  const isLeftChart = tooltipSide ? tooltipSide === 'right' : index % 2 === 0

  // On-screen size of the <svg>: label wrapping is measured at this scale.
  const svgRef = useRef<SVGSVGElement>(null)
  const [svgSize, setSvgSize] = useState<{ width: number; height: number } | null>(null)
  const viewBox = sunburstViewBox(outerCallouts, isZoomed)
  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const update = () => {
      const { width, height } = svg.getBoundingClientRect()
      setSvgSize((size) =>
        size && size.width === width && size.height === height ? size : { width, height },
      )
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(svg)
    return () => observer.disconnect()
  }, [viewBox])

  const fontsReady = useSyncExternalStore(subscribeFonts, getFontsVersion)
  const layout = useMemo(() => {
    void fontsReady
    const measurer = svgSize && createTextMeasurer(viewBox, svgSize.width, svgSize.height)
    try {
      return computeSunburstLayout(
        {
          data,
          zoomed: zoomedParent,
          colorPalette,
          globalColorMap,
          showAllLabels,
          outerCallouts,
          sortBySize,
        },
        measurer ? measurer.measure : null,
      )
    } finally {
      measurer?.dispose()
    }
  }, [
    viewBox,
    svgSize,
    data,
    zoomedParent,
    colorPalette,
    globalColorMap,
    showAllLabels,
    outerCallouts,
    sortBySize,
    fontsReady,
  ])

  async function fetchCodeDefinition(codeName: string) {
    if (codeName === 'Eco Impacts (general)') {
      const def =
        'Effects that an action, event, or change has on ecosystems and the living organisms within them.'
      setModalCodeData({ name: codeName, definition: def })
      setShowModal(true)
      setIsLoadingCode(false)
      return
    }

    setIsLoadingCode(true)
    try {
      const codeData = await requestCodeDefinition(codeName)
      // Discard stale responses if the user has hovered off / onto a new segment.
      if (hoveredCode.current !== codeName) return
      setModalCodeData(codeData)
      setShowModal(true)
    } catch (error) {
      console.error('Error fetching code definition:', error)
      if (hoveredCode.current !== codeName) return
      setModalCodeData({
        name: codeName,
        error: 'Failed to load code definition',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
      setShowModal(true)
    } finally {
      if (hoveredCode.current === codeName) setIsLoadingCode(false)
    }
  }

  function handleMouseOver(id: string, d: SunburstNode) {
    setHoveredArc(id)
    if (d.depth > 1) {
      hoveredCode.current = d.data.name
      setHoveredColor(getHierarchicalColor(d, globalColorMap, colorPalette))
      setIsLoadingCode(true)
      setModalCodeData({ name: d.data.name })
      setShowModal(true)
      fetchCodeDefinition(d.data.name)
    }
  }

  function handleMouseOut(id: string, d: SunburstNode) {
    setHoveredArc((current) => (current === id ? null : current))
    if (d.depth > 1 && hoveredCode.current === d.data.name) {
      hoveredCode.current = null
      setShowModal(false)
      setModalCodeData(null)
      setIsLoadingCode(false)
    }
  }

  function zoomTo(target: ZoomTarget | null) {
    setZoomedParent(target)
    setHoveredArc(null)
  }

  function handleClick(d: SunburstNode) {
    if (!isZoomed && d.depth === 1 && d.children && d.children.length > 0) {
      zoomTo({ name: d.data.name, x0: d.x0, x1: d.x1, y0: d.y0, y1: d.y1 })
    } else if (isZoomed && d.data.name === zoomedParent?.name) {
      zoomTo(null)
    }
  }

  return (
    <div
      className="jtd-SunburstChart sunburst-container rounded-lg px-4 pb-4 pt-2 flex-1 flex flex-col items-center justify-center relative"
      style={showModal ? { zIndex: 9999 } : undefined}
    >
      <div className="sunburst-title text-lg mb-4 text-center flex items-center gap-3">
        {isZoomed && (
          <button
            type="button"
            className="back-button flex items-center gap-1 rounded px-2 py-0.5 text-sm"
            aria-label="Back to overview"
            onClick={() => zoomTo(null)}
          >
            ← Back
          </button>
        )}
        <span>{isZoomed ? `${title} - ${zoomedParent?.name || ''}` : title}</span>
      </div>

      <svg ref={svgRef} overflow="visible" viewBox={layout.viewBox}>
        <g transform={layout.translate}>
          {layout.arcs.map((item, i) => (
            <path
              key={`arc-${i}`}
              d={item.d}
              fill={item.fill}
              stroke="white"
              strokeWidth={1.5}
              style={{
                cursor: item.cursor,
                display: item.display,
                ...(hoveredArc === item.id ? { opacity: 0.8, strokeWidth: 3 } : null),
              }}
              onMouseOver={() => handleMouseOver(item.id, item.node)}
              onMouseOut={() => handleMouseOut(item.id, item.node)}
              onClick={() => handleClick(item.node)}
            />
          ))}
          {layout.outerArcs.map((item, i) => (
            <path
              key={`outer-${i}`}
              className="outer-arc"
              d={item.d}
              fill={item.fill}
              stroke="white"
              strokeWidth={1}
              style={{ opacity: 0.7, display: item.display }}
            />
          ))}
          {layout.labels.map((label, i) => (
            <text
              key={`label-${i}`}
              className="arc-text"
              transform={label.transform}
              dy="0.35em"
              style={{
                fontSize: label.fontSize,
                fill: label.fill,
                ...(label.halo
                  ? {
                      paintOrder: 'stroke',
                      stroke: label.halo,
                      strokeWidth: '2.5px',
                      strokeLinejoin: 'round',
                    }
                  : null),
                textAnchor: 'middle',
                pointerEvents: 'none',
                display: label.display,
              }}
            >
              {/* d3's wrap() also set text-anchor="bottom" on the first line, an
                  invalid value the browser ignored. */}
              {label.lines.map((line, j) => (
                <tspan
                  key={j}
                  x={line.first ? undefined : 0}
                  dy={line.dy}
                  dominantBaseline="central"
                >
                  {line.text}
                </tspan>
              ))}
            </text>
          ))}
          {layout.callouts.map((callout, i) => [
            <polyline
              key={`leader-${i}`}
              points={callout.points}
              fill="none"
              stroke={callout.color}
              strokeWidth={1}
              strokeOpacity={0.75}
            />,
            <text
              key={`callout-${i}`}
              x={callout.x}
              y={callout.y}
              dy="0.32em"
              style={{
                fontSize: '11px',
                fill: '#e6ebf0',
                textAnchor: callout.anchor,
                pointerEvents: 'none',
              }}
            >
              {callout.text}
            </text>,
          ])}
        </g>
      </svg>

      {/* Hover tooltip for code definitions; offset to the side with more space */}
      {showModal && (
        <div
          className={`hover-tooltip absolute top-1/2 -translate-y-1/2 z-50 pointer-events-none ${
            isLeftChart ? 'tooltip-right' : 'tooltip-left'
          }`}
        >
          <div className="bg-[var(--surface-elevated)] rounded-lg shadow-xl w-[22rem] max-h-[32rem] overflow-hidden flex flex-col">
            <div
              className="p-4"
              style={{ backgroundColor: hoveredColor, color: getContrastColor(hoveredColor) }}
            >
              <h4 className="text-lg">{modalCodeData?.name || 'Loading...'}</h4>
            </div>
            <div className="p-4 overflow-y-auto text-white space-y-3">
              {isLoadingCode ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span className="ml-2 text-gray-300 text-sm">Loading…</span>
                </div>
              ) : modalCodeData?.error ? (
                <div className="text-red-400">
                  <p className="font-semibold">Error: {modalCodeData.error}</p>
                  {modalCodeData.details && <p className="text-sm mt-2">{modalCodeData.details}</p>}
                </div>
              ) : modalCodeData ? (
                <>
                  {modalCodeData.description && (
                    <div>
                      <h4 className="mb-1 text-sm font-semibold opacity-80">Description</h4>
                      <p>{modalCodeData.description}</p>
                    </div>
                  )}
                  {modalCodeData.definition && (
                    <div>
                      <h4 className="mb-1 text-sm font-semibold opacity-80">Definition</h4>
                      <p>{modalCodeData.definition}</p>
                    </div>
                  )}
                  {modalCodeData.parent && (
                    <div>
                      <h4 className="mb-1 text-sm font-semibold opacity-80">Parent</h4>
                      <p>{modalCodeData.parent}</p>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
