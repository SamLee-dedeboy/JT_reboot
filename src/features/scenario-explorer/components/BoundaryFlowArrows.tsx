// The scenario's change in each Delta boundary flow, drawn over the salinity map as arrows in the
// direction the water moves: width is the size of the change, filled for more water than the
// base and outlined for less. Only Calling on Reserves and A Tunnel have boundary flows.
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Box, ButtonBase, Typography } from '@mui/material'
import type { Map as MapboxMap, Point } from 'mapbox-gl'
import { palette } from '@/theme'
import { focusRing } from '@/ui/focusRing'
import { boundaryFlowChanges } from '../boundaryFlows'

/** A change of this many cfs draws the widest arrow, `MAX_WIDTH` px; larger changes stay at that. */
const FULL_SCALE_CFS = 5000
const MAX_WIDTH = 30
const MIN_WIDTH = 3
/** Changes smaller than this read as no change. */
const MIN_CHANGE_CFS = 50

const cfs = (value: number) => `${Math.round(Math.abs(value)).toLocaleString('en-US')} cfs`
const signed = (value: number) => `${value > 0 ? '+' : '−'}${cfs(value)}`

/** An arrow from a to b, `width` px across, as one closed shape (shaft and head). */
function arrowPath(a: Point, b: Point, width: number) {
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1
  const ux = (b.x - a.x) / length
  const uy = (b.y - a.y) / length
  const nx = -uy
  const ny = ux
  const half = width / 2
  const headHalf = half + Math.max(5, width * 0.35)
  const headLength = Math.min(length * 0.5, Math.max(12, width * 0.8))
  const bx = b.x - ux * headLength
  const by = b.y - uy * headLength
  const points = [
    [a.x + nx * half, a.y + ny * half],
    [bx + nx * half, by + ny * half],
    [bx + nx * headHalf, by + ny * headHalf],
    [b.x, b.y],
    [bx - nx * headHalf, by - ny * headHalf],
    [bx - nx * half, by - ny * half],
    [a.x - nx * half, a.y - ny * half],
  ]
  return `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`
}

const monthLabel = (month: string) =>
  new Date(`${month}-15T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

interface BoundaryFlowArrowsProps {
  map: MapboxMap
  scenario: string
  baseScenario: string
  baseScenarioLabel: string
  /** The explorer's date, `YYYY-MM-DD`; the flows are monthly means. */
  date: string
}

export default function BoundaryFlowArrows({
  map,
  scenario,
  baseScenario,
  baseScenarioLabel,
  date,
}: BoundaryFlowArrowsProps) {
  const [visible, setVisible] = useState(true)
  // Redraw as the camera moves: the arrows are placed in screen pixels.
  const [, setCameraTick] = useState(0)
  useEffect(() => {
    const redraw = () => setCameraTick((tick) => tick + 1)
    map.on('move', redraw)
    map.on('resize', redraw)
    return () => {
      map.off('move', redraw)
      map.off('resize', redraw)
    }
  }, [map])

  const month = date.slice(0, 7)
  const changes = boundaryFlowChanges(scenario, baseScenario, month)
  if (!changes) return null

  const arrows = changes.map(({ boundary, base, change, emphasized, note }) => {
    const from = map.project(boundary.from)
    const to = map.project(boundary.to)
    const moved = Math.abs(change) >= MIN_CHANGE_CFS
    const width = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, (Math.abs(change) / FULL_SCALE_CFS) * MAX_WIDTH),
    )
    const share =
      base > 0 ? ` (${change > 0 ? '+' : '−'}${Math.round((Math.abs(change) / base) * 100)}%)` : ''
    // The label sits beside the arrow's middle, or just past its tip, its near edge clear of
    // the arrow either way.
    const length = Math.hypot(to.x - from.x, to.y - from.y) || 1
    const ux = (to.x - from.x) / length
    const uy = (to.y - from.y) / length
    const atEnd = boundary.labelAt === 'end'
    const side = boundary.labelAt === 'side-right' ? -1 : 1
    const [dx, dy] = atEnd ? [ux, uy] : [-uy * side, ux * side]
    const offset = atEnd ? 8 : width / 2 + 8
    const [ax, ay] = atEnd ? [to.x, to.y] : [(from.x + to.x) / 2, (from.y + to.y) / 2]
    const horizontal = Math.abs(dx) >= Math.abs(dy)
    const shiftX = horizontal ? (dx > 0 ? '0%' : '-100%') : '-50%'
    const shiftY = horizontal ? '-50%' : dy > 0 ? '0%' : '-100%'
    return {
      key: boundary.key,
      label: boundary.label,
      emphasized,
      note,
      path: moved ? arrowPath(from, to, width) : null,
      increase: change > 0,
      value: moved ? `${signed(change)}${share}` : 'No change',
      x: ax + dx * offset,
      y: ay + dy * offset,
      transform: `translate(${shiftX}, ${shiftY})`,
      // A label left of its arrow lines its note up on the right, so the note runs away from it.
      noteAnchor: shiftX === '-100%' ? 'right' : 'left',
    }
  })

  const arrowLayer = (
    <>
      <Box
        component="svg"
        aria-hidden="true"
        sx={{
          height: '100%',
          inset: 0,
          pointerEvents: 'none',
          position: 'absolute',
          width: '100%',
        }}
      >
        {arrows.map(
          (arrow) =>
            arrow.path && (
              <path
                key={arrow.key}
                d={arrow.path}
                fill={arrow.emphasized ? palette.brand.primaryGreen : palette.brand.primaryBlue}
                fillOpacity={arrow.increase ? 0.9 : 0.12}
                stroke={arrow.emphasized ? palette.brand.primaryGreen : palette.brand.primaryBlue}
                strokeWidth={arrow.increase ? 0 : 2}
                strokeLinejoin="round"
              />
            ),
        )}
      </Box>
      {arrows.map((arrow) => (
        <Box
          key={arrow.key}
          sx={{
            bgcolor: 'translucent.800',
            borderRadius: 0.5,
            display: 'grid',
            left: arrow.x,
            pointerEvents: 'none',
            position: 'absolute',
            px: 0.75,
            py: 0.25,
            top: arrow.y,
            transform: arrow.transform,
            whiteSpace: 'nowrap',
          }}
        >
          <Typography
            variant={arrow.emphasized ? 'mapLabelStrong' : 'captionSmall'}
            sx={{ color: arrow.emphasized ? 'brand.primaryGreen' : 'text.secondary' }}
          >
            {arrow.label}
          </Typography>
          <Typography
            variant={arrow.emphasized ? 'mapLabelStrong' : 'captionSmall'}
            sx={{
              color: !arrow.path
                ? 'text.secondary'
                : arrow.emphasized
                  ? 'brand.primaryGreen'
                  : 'brand.primaryBlue',
            }}
          >
            {arrow.value}
          </Typography>
          {/* Hangs under the label box, so the box itself stays where it is. */}
          {arrow.note && (
            <Typography
              variant="captionSmall"
              sx={{
                bgcolor: 'translucent.800',
                borderRadius: 0.5,
                color: 'common.white',
                [arrow.noteAnchor]: 0,
                mt: 0.5,
                position: 'absolute',
                px: 0.75,
                py: 0.25,
                top: '100%',
              }}
            >
              {arrow.note}
            </Typography>
          )}
        </Box>
      ))}
    </>
  )

  const swatch = (outlined: boolean) => (
    <Box component="svg" aria-hidden="true" viewBox="0 0 28 12" sx={{ height: 12, width: 28 }}>
      <path
        d={
          outlined
            ? 'M1 3 L18 3 L18 1 L26 6 L18 11 L18 9 L1 9 Z'
            : 'M1 3 L18 3 L18 0 L27 6 L18 12 L18 9 L1 9 Z'
        }
        fill={palette.brand.primaryBlue}
        fillOpacity={outlined ? 0.12 : 1}
        stroke={palette.brand.primaryBlue}
        strokeWidth={outlined ? 1.5 : 0}
      />
    </Box>
  )

  // The legend and its on/off switch: top left, under the D-1641 legend. Two short lines: what
  // the arrows are (a monthly mean, for the month on the timeline) and how to read them.
  const legend = (
    <Box
      sx={(theme) => ({
        bgcolor: 'base.700',
        border: 1,
        borderColor: 'border.default',
        borderRadius: 1,
        display: 'grid',
        gap: 0.5,
        left: theme.jtSpacing.component.sm,
        px: theme.jtSpacing.component.xs,
        py: 0.75,
        position: 'absolute',
        top: theme.spacing(7),
        zIndex: 2,
      })}
    >
      <Box
        sx={{ alignItems: 'baseline', display: 'flex', gap: 1.5, justifyContent: 'space-between' }}
      >
        <Typography variant="captionSmall" sx={{ color: 'common.white' }}>
          {monthLabel(month)} boundary conditions
        </Typography>
        <ButtonBase
          aria-pressed={visible}
          aria-label={visible ? 'Hide boundary flow arrows' : 'Show boundary flow arrows'}
          onClick={() => setVisible((shown) => !shown)}
          sx={{ borderRadius: 0.5, '&.Mui-focusVisible': focusRing }}
        >
          <Typography variant="captionSmall" sx={{ color: 'brand.primaryBlue' }}>
            {visible ? 'Hide' : 'Show'}
          </Typography>
        </ButtonBase>
      </Box>
      {visible && (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 1.5,
            rowGap: 0.25,
          }}
        >
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
            {swatch(false)}
            <Typography variant="captionSmall">More</Typography>
          </Box>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
            {swatch(true)}
            <Typography variant="captionSmall">Less</Typography>
          </Box>
          <Typography variant="captionSmall">than {baseScenarioLabel}</Typography>
        </Box>
      )}
      {visible && (
        <Typography variant="captionSmall" sx={{ color: 'text.secondary' }}>
          <Box component="span" sx={{ typography: 'mapLabelStrong', color: 'common.white' }}>
            Monthly
          </Box>{' '}
          mean values
        </Typography>
      )}
    </Box>
  )

  // Arrows and labels go in the canvas container, under station popups; the legend goes in the
  // map's own container, outside the layer that pans the map, so its button only toggles.
  return (
    <>
      {visible && createPortal(arrowLayer, map.getCanvasContainer())}
      {createPortal(legend, map.getContainer())}
    </>
  )
}
