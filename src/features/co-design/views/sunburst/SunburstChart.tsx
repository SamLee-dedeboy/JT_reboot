// One sunburst wheel with drill-down zoom and a hover panel of code
// definitions, ported from JT_dashboard/src/lib/Sunburst/SunburstChart.svelte.
// D3 computes the layout (sunburstLayout.ts); React renders the SVG.
import { Box, ButtonBase, Stack, Typography } from '@mui/material'
import { keyframes, useTheme } from '@mui/material/styles'
import { useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { getSunburstCode } from '../../api'
import type { CategoryPalette, SunburstData } from './sunburstData'
import {
  computeSunburstLayout,
  createTextMeasurer,
  getContrastColor,
  getHierarchicalColor,
  sunburstViewBox,
} from './sunburstLayout'
import type { LabelColors, LabelFont, SunburstNode, ZoomTarget } from './sunburstLayout'

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
  colorPalette: CategoryPalette
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

// Label wrapping measures text in the site body font, so re-run the layout
// once web fonts finish loading (the Svelte version measured whatever font was
// active at render).
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
  const theme = useTheme()
  const tokens = theme.coDesign.sunburst
  // SVG labels use the chart-label family at regular weight; sizes stay
  // data-driven (computed per slice in sunburstLayout.ts).
  const labelFont: LabelFont = useMemo(
    () => ({
      family: theme.typography.chartAxis.fontFamily ?? theme.typography.fontFamily ?? '',
      weight: theme.typography.fontWeightRegular ?? 'normal',
    }),
    [theme],
  )
  const labelColors: LabelColors = tokens.wheel

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
  const [hoveredColor, setHoveredColor] = useState<string>(tokens.tooltip.headerFallback)
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
    const measurer =
      svgSize && createTextMeasurer(viewBox, svgSize.width, svgSize.height, labelFont)
    try {
      return computeSunburstLayout(
        {
          data,
          zoomed: zoomedParent,
          colorPalette,
          labelColors,
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
    labelColors,
    labelFont,
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

  const headerText = getContrastColor(hoveredColor, tokens.wheel.labelLight, tokens.wheel.labelDark)

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        pt: 1,
        pb: 2,
        [theme.breakpoints.down('md')]: { maxWidth: '100%' },
        ...(showModal ? { zIndex: 9999 } : null),
      })}
    >
      {/* Chart title; while zoomed it names the theme and offers a way back */}
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2, textAlign: 'center' }}>
        {isZoomed && (
          <ButtonBase
            aria-label="Back to overview"
            onClick={() => zoomTo(null)}
            sx={(theme) => ({
              typography: 'meta',
              px: 1,
              py: 0.25,
              gap: 0.5,
              color: tokens.backButton.text,
              bgcolor: tokens.backButton.background,
              outline: tokens.backButton.outline,
              borderRadius: 1,
              cursor: 'pointer',
              transition: theme.transitions.create('filter', { duration: 150 }),
              '&:hover': { filter: 'brightness(1.15)' },
              '&.Mui-focusVisible': {
                outline: `2px solid ${tokens.backButton.focusRing}`,
                outlineOffset: 2,
              },
            })}
          >
            ← Back
          </ButtonBase>
        )}
        <Typography variant="chartTitle" component="h3">
          {isZoomed ? `${title} - ${zoomedParent?.name || ''}` : title}
        </Typography>
      </Stack>

      <svg
        ref={svgRef}
        overflow="visible"
        viewBox={layout.viewBox}
        fontFamily={labelFont.family}
        fontWeight={labelFont.weight}
        style={{ display: 'block', verticalAlign: 'middle' }}
      >
        <g transform={layout.translate}>
          {layout.arcs.map((item, i) => (
            <path
              key={`arc-${i}`}
              d={item.d}
              fill={item.fill}
              stroke={tokens.wheel.arcStroke}
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
              d={item.d}
              fill={item.fill}
              stroke={tokens.wheel.arcStroke}
              strokeWidth={1}
              style={{ opacity: 0.7, display: item.display }}
            />
          ))}
          {layout.labels.map((label, i) => (
            <text
              key={`label-${i}`}
              transform={label.transform}
              dy="0.35em"
              fontSize={label.textSize}
              style={{
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
              fontSize={tokens.wheel.calloutFontSize}
              style={{
                fill: tokens.wheel.calloutText,
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
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 50,
            pointerEvents: 'none',
            ...(isLeftChart ? { left: '100%', ml: 1.5 } : { right: '100%', mr: 1.5 }),
          }}
        >
          <Box
            sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              width: tokens.tooltip.width,
              maxHeight: tokens.tooltip.maxHeight,
              overflow: 'hidden',
              color: theme.chart.tooltip.text,
              bgcolor: theme.chart.tooltip.background,
              border: `1px solid ${theme.chart.tooltip.border}`,
              borderRadius: tokens.tooltip.radius,
              boxShadow: tokens.tooltip.shadow,
            })}
          >
            <Box sx={{ p: 2, bgcolor: hoveredColor, color: headerText }}>
              <Typography variant="cardTitle" component="h4">
                {modalCodeData?.name || 'Loading...'}
              </Typography>
            </Box>
            <Stack sx={{ p: 2, gap: 1.5, overflowY: 'auto' }}>
              {isLoadingCode ? (
                <Stack
                  direction="row"
                  sx={{ alignItems: 'center', justifyContent: 'center', py: 2 }}
                >
                  <Box
                    sx={{
                      width: tokens.tooltip.spinnerSize,
                      height: tokens.tooltip.spinnerSize,
                      borderRadius: '50%',
                      borderBottom: `2px solid ${tokens.tooltip.spinner}`,
                      animation: `${spin} 1s linear infinite`,
                    }}
                  />
                  <Typography variant="meta" sx={{ ml: 1, color: tokens.textMuted }}>
                    Loading…
                  </Typography>
                </Stack>
              ) : modalCodeData?.error ? (
                <Box sx={{ color: tokens.tooltip.error }}>
                  <Typography variant="cardTitle" component="p">
                    Error: {modalCodeData.error}
                  </Typography>
                  {modalCodeData.details && (
                    <Typography variant="meta" component="p" sx={{ mt: 1 }}>
                      {modalCodeData.details}
                    </Typography>
                  )}
                </Box>
              ) : modalCodeData ? (
                <>
                  {modalCodeData.description && (
                    <CodeSection label="Description">{modalCodeData.description}</CodeSection>
                  )}
                  {modalCodeData.definition && (
                    <CodeSection label="Definition">{modalCodeData.definition}</CodeSection>
                  )}
                  {modalCodeData.parent && (
                    <CodeSection label="Parent">{modalCodeData.parent}</CodeSection>
                  )}
                </>
              ) : null}
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  )
}

// Matches the original Tailwind `animate-spin` (one turn per second, linear).
const spin = keyframes`
  to { transform: rotate(360deg); }
`

// One labelled field (description / definition / parent) of the code tooltip.
function CodeSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box>
      <Typography
        variant="chartColumnHead"
        component="h4"
        sx={(theme) => ({ mb: 0.5, color: theme.coDesign.sunburst.tooltip.sectionLabel })}
      >
        {label}
      </Typography>
      <Typography variant="cardBody" component="p">
        {children}
      </Typography>
    </Box>
  )
}
