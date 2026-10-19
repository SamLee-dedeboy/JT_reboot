// Desktop site-map diagram: columns for navbar, menu sections, pages, and
// nested views, one row per page. Menu edges flow left to right; in-page
// links arc through a gutter on the right so they never cross a node.
import { useMemo, useState } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import type { SiteEdge, SiteGraph, SiteNode } from './siteMapModel'

const ROW = 46
const NODE_HEIGHT = 38
const TOP = 40
const INDENT = 16
const COLUMNS = [
  { x: 0, width: 104 },
  { x: 140, width: 176 },
  { x: 356, width: 264 },
  { x: 660, width: 248 },
]
// Room for pages and sections nested up to eight levels deep.
const GUTTER = COLUMNS[3].x + COLUMNS[3].width + 8 * INDENT + 24
const MAX_BULGE = 220

const rowY = (row: number) => TOP + row * ROW + NODE_HEIGHT / 2

function nodeBox(node: SiteNode) {
  const column = COLUMNS[node.column]
  const x = column.x + node.depth * INDENT
  return { x, y: rowY(node.row) - NODE_HEIGHT / 2, width: column.width, height: NODE_HEIGHT }
}

function flowPath(from: SiteNode, to: SiteNode) {
  const a = nodeBox(from)
  const b = nodeBox(to)
  // Nested views in the same column hang off their parent with an elbow.
  if (from.column === to.column) {
    const x = a.x + INDENT / 2
    return `M ${x} ${a.y + a.height} V ${rowY(to.row)} H ${b.x}`
  }
  const x1 = a.x + a.width
  const y1 = rowY(from.row)
  const x2 = b.x
  const y2 = rowY(to.row)
  const mid = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`
}

function arcPath(from: SiteNode, to: SiteNode) {
  const a = nodeBox(from)
  const b = nodeBox(to)
  const y1 = rowY(from.row)
  const y2 = rowY(to.row)
  const bulge = Math.min(MAX_BULGE, 28 + Math.abs(to.row - from.row) * 9)
  return [
    `M ${a.x + a.width} ${y1 - 4}`,
    `H ${GUTTER}`,
    `C ${GUTTER + bulge} ${y1 - 4}, ${GUTTER + bulge} ${y2 + 4}, ${GUTTER} ${y2 + 4}`,
    `H ${b.x + b.width + 6}`,
  ].join(' ')
}

interface SiteMapDiagramProps {
  graph: SiteGraph
  showLinks: boolean
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export default function SiteMapDiagram({
  graph,
  showLinks,
  selectedId,
  onSelect,
}: SiteMapDiagramProps) {
  const theme = useTheme()
  const colors = theme.chart.siteMap
  const [hoverId, setHoverId] = useState<string | null>(null)
  const focusId = hoverId ?? selectedId

  const byId = useMemo(() => new Map(graph.nodes.map((node) => [node.id, node])), [graph])
  const edges = graph.edges.filter((edge) => showLinks || edge.kind !== 'link')
  const connected = useMemo(() => {
    if (!focusId) return null
    const ids = new Set([focusId])
    for (const edge of edges) {
      if (edge.from === focusId) ids.add(edge.to)
      if (edge.to === focusId) ids.add(edge.from)
    }
    return ids
  }, [edges, focusId])

  const width = GUTTER + MAX_BULGE + 24
  const height = TOP + graph.rows * ROW

  const edgeColor = (edge: SiteEdge) => {
    const target = byId.get(edge.to)
    if (edge.planned) return colors.warning
    if (edge.kind === 'link') return edge.dynamic ? colors.dynamicEdge : colors.linkEdge
    if (target?.kind === 'planned') return colors.plannedEdge
    return colors.menuEdge
  }
  const edgeActive = (edge: SiteEdge) => !focusId || edge.from === focusId || edge.to === focusId

  return (
    <Box
      sx={{
        overflowX: 'auto',
        border: 1,
        borderColor: 'border.default',
        borderRadius: 1,
        bgcolor: 'translucent.50',
      }}
      onClick={() => onSelect(null)}
    >
      <Box sx={{ position: 'relative', width, height, m: 2.5 }}>
        {/* Edges */}
        <Box
          component="svg"
          width={width}
          height={height}
          sx={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
          aria-hidden
        >
          <defs>
            {[colors.linkEdge, colors.dynamicEdge, colors.warning].map((color, index) => (
              <marker
                key={color}
                id={`site-map-arrow-${index}`}
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill={color} />
              </marker>
            ))}
          </defs>
          {edges.map((edge) => {
            const from = byId.get(edge.from)
            const to = byId.get(edge.to)
            if (!from || !to) return null
            const active = edgeActive(edge)
            const isLink = edge.kind === 'link'
            return (
              <path
                key={edge.id}
                d={isLink ? arcPath(from, to) : flowPath(from, to)}
                fill="none"
                stroke={edgeColor(edge)}
                strokeWidth={active && focusId ? 2 : 1.25}
                strokeDasharray={
                  to.kind === 'planned' || edge.dynamic || edge.planned ? '4 4' : undefined
                }
                opacity={active ? (isLink && !focusId ? 0.55 : 0.9) : 0.08}
                markerEnd={
                  isLink
                    ? `url(#site-map-arrow-${edge.planned ? 2 : edge.dynamic ? 1 : 0})`
                    : undefined
                }
                style={{ transition: 'opacity 160ms ease' }}
              />
            )
          })}
        </Box>

        {/* Column headings */}
        {['Global', 'Menu', 'Pages', 'Nested views & page sections'].map((label, index) => (
          <Typography
            key={label}
            variant="chartLabel"
            sx={{
              position: 'absolute',
              left: COLUMNS[index].x,
              top: 0,
              color: 'base.200',
            }}
          >
            {label}
          </Typography>
        ))}

        {/* Nodes */}
        {graph.nodes.map((node) => (
          <DiagramNode
            key={node.id}
            node={node}
            dimmed={!!connected && !connected.has(node.id)}
            selected={node.id === selectedId}
            onHover={setHoverId}
            onSelect={onSelect}
          />
        ))}
      </Box>
    </Box>
  )
}

interface DiagramNodeProps {
  node: SiteNode
  dimmed: boolean
  selected: boolean
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
}

function DiagramNode({ node, dimmed, selected, onHover, onSelect }: DiagramNodeProps) {
  const box = nodeBox(node)
  const planned = node.kind === 'planned'
  const isSection = node.kind === 'section' || node.kind === 'chrome'
  const isBlock = node.kind === 'block'
  const dashed = planned || !!node.proposed

  return (
    <Box
      component="button"
      type="button"
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      onClick={(event: React.MouseEvent) => {
        event.stopPropagation()
        onSelect(node.id)
      }}
      aria-pressed={selected}
      title={node.path ?? node.label}
      sx={(theme) => ({
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        px: 1.25,
        textAlign: 'left',
        cursor: 'pointer',
        color: planned ? 'base.300' : 'common.white',
        bgcolor: isSection
          ? 'translucent.200'
          : isBlock
            ? 'translucent.50'
            : theme.chart.siteMap.nodeSurface,
        border: 1,
        borderStyle: dashed ? 'dashed' : 'solid',
        borderColor: selected
          ? theme.chart.siteMap.selected
          : node.proposed
            ? theme.chart.siteMap.warning
            : theme.chart.siteMap.nodeBorder,
        borderLeftWidth: node.internal || isBlock ? 3 : 1,
        borderLeftStyle: 'solid',
        borderLeftColor: isBlock
          ? node.proposed
            ? theme.chart.siteMap.warning
            : theme.chart.siteMap.linkEdge
          : node.internal
            ? 'secondary.main'
            : undefined,
        borderRadius: 1,
        opacity: dimmed ? 0.28 : 1,
        transition: 'opacity 160ms ease, border-color 160ms ease, transform 160ms ease',
        '&:hover, &:focus-visible': {
          borderColor: theme.chart.siteMap.selected,
          transform: 'translateY(-1px)',
          outline: 'none',
        },
      })}
    >
      <Typography
        variant={isSection ? 'chartLabel' : 'controlLabel'}
        noWrap
        sx={{ maxWidth: '100%', color: 'inherit' }}
      >
        {node.label}
        {planned && ' · planned'}
        {node.proposed && node.kind === 'page' && ' · proposed'}
      </Typography>
      {(node.path ?? node.detail) && (
        <Typography variant="captionSmall" noWrap sx={{ maxWidth: '100%', color: 'base.200' }}>
          {node.path ?? node.detail}
        </Typography>
      )}
    </Box>
  )
}
