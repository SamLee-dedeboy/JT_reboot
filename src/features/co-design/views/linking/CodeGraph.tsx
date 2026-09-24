// Force-directed code graph with zoom controls, ported from
// JT_dashboard/src/lib/Linking/CodeGraph.svelte.
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import { readableTextOn } from '../../shared/contrast'
import { categoryColorScale } from './constants'
import { CodeGraphRenderer } from './renderers/CodeGraphRenderer'
import type { CodeGraphTokens, GraphNode, tCode } from './renderers/CodeGraphRenderer'

interface CodeGraphProps {
  codes: tCode[]
  // Replaces the bindable `selected_code`: called with the hovered node.
  onSelectCode: (code: GraphNode | undefined) => void
}

function graphTokens(theme: Theme): CodeGraphTokens {
  const { linking } = theme.coDesign
  const categoryColor = categoryColorScale(linking.category)
  return {
    categoryColor: (category) => categoryColor(category),
    labelColorOn: (background) =>
      readableTextOn(background, linking.onColor.light, linking.onColor.dark),
    centerFill: linking.svg.centerFill,
    centerStroke: linking.svg.centerStroke,
    centerText: readableTextOn(linking.svg.centerFill, linking.onColor.light, linking.onColor.dark),
    link: linking.svg.link,
    nodeStroke: linking.svg.nodeStroke,
    nodeHoverStroke: linking.svg.nodeHoverStroke,
    labelFontFamily: String(theme.typography.chartValue.fontFamily),
    centerFontFamily: String(theme.typography.chartValueLarge.fontFamily),
    centerFontSize: String(theme.typography.chartValueLarge.fontSize),
    centerFontWeight: theme.typography.chartValueLarge.fontWeight ?? 'normal',
  }
}

const GraphSvg = styled('svg')(({ theme }) => ({
  display: 'block',
  overflow: 'hidden',
  marginTop: theme.spacing(1),
  width: '100%',
  height: '100%',
}))

// Hover treatment shared by the zoom toolbar's buttons.
const zoomButtonSx = (theme: Theme) => ({
  color: 'common.white',
  '&:hover': { bgcolor: theme.coDesign.linking.graph.zoomControls.hover },
})

export default function CodeGraph({ codes, onSelectCode }: CodeGraphProps) {
  const theme = useTheme()
  const tokens = useMemo(() => graphTokens(theme), [theme])
  const svgRef = useRef<SVGSVGElement>(null)
  const rendererRef = useRef<CodeGraphRenderer | null>(null)
  const onSelectCodeRef = useRef(onSelectCode)
  const [zoomLevel, setZoomLevel] = useState(0.6)

  useEffect(() => {
    onSelectCodeRef.current = onSelectCode
  }, [onSelectCode])

  useEffect(() => {
    const renderer = new CodeGraphRenderer(svgRef.current!, tokens, (node) => {
      // Svelte wrapped each assigned node in a fresh $state proxy, so even
      // re-hovering the same node re-ran the tooltip's summary {#await}
      // (pending, then slide-in). A shallow copy keeps that behaviour.
      onSelectCodeRef.current(node ? { ...node } : undefined)
    })
    renderer.onZoomChange = (scale) => {
      setZoomLevel(scale)
    }
    renderer.init()
    renderer.update(codes)
    rendererRef.current = renderer
    return () => {
      renderer.destroy()
      rendererRef.current = null
    }
  }, [codes, tokens])

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: 0,
        pb: 1,
      }}
    >
      <GraphSvg ref={svgRef} />
      {/* Zoom toolbar floating at the bottom centre of the graph */}
      <Box
        sx={(theme) => {
          const controls = theme.coDesign.linking.graph.zoomControls
          return {
            position: 'absolute',
            bottom: theme.spacing(1.5),
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 0.75,
            py: 0.5,
            bgcolor: controls.background,
            border: controls.border,
            borderRadius: controls.radius,
            boxShadow: controls.shadow,
          }
        }}
      >
        <IconButton
          size="small"
          aria-label="Zoom out"
          onClick={() => rendererRef.current?.zoomOut()}
          sx={zoomButtonSx}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Button
          size="small"
          aria-label="Reset zoom"
          onClick={() => rendererRef.current?.resetZoom()}
          sx={(theme) => ({ ...zoomButtonSx(theme), minWidth: 0, px: 1.25, py: 0.5 })}
        >
          Reset
        </Button>
        <Typography
          variant="controlLabel"
          aria-live="polite"
          sx={(theme) => ({
            minWidth: theme.coDesign.linking.graph.zoomControls.levelMinWidth,
            px: 0.75,
            color: 'base.50',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          {Math.round(zoomLevel * 100)}%
        </Typography>
        <IconButton
          size="small"
          aria-label="Zoom in"
          onClick={() => rendererRef.current?.zoomIn()}
          sx={zoomButtonSx}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}
