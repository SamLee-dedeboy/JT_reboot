// Control panel for the KelpFusion overlay: tension slider, max-waterway-
// distance threshold, per-set legend, and developer toggles for inspecting
// the algorithm.

import { useState, type ReactNode } from 'react'
import { Box, IconButton, Slider, Switch, Tooltip, Typography } from '@mui/material'
import { tensionToT } from '../../internal/kelp/lib/tension'
import type { KelpSet, SetStat } from '../../internal/kelp/lib/types'
import type { KelpRenderMode } from './KelpOverlay'
import { palette } from '../../theme'

interface KelpControlsProps {
  tension: number
  onTensionChange: (value: number) => void
  sets: KelpSet[]
  onSetChange: (setId: string, patch: Partial<KelpSet>) => void
  renderMode: KelpRenderMode
  onRenderModeChange: (mode: KelpRenderMode) => void
  ensureConnected: boolean
  onEnsureConnectedChange: (value: boolean) => void
  /** Max waterway distance between two connected stations, in miles. */
  maxDistanceMiles: number
  onMaxDistanceMilesChange: (value: number) => void
  /** True when the channel-centerline mesh + pairwise routing finished loading. */
  routingReady: boolean
  /** Station indices that could not be snapped to the mesh within tolerance. */
  unsnappedStationIndices: number[]
  stats: SetStat[]
}

// NOTE (unsolved): the panel text still reads darker than the literal color
// values suggest. Bumping to theme-backed white, base.100, and primaryGreen
// below is a real change from the previous `grey.100` / `grey.300` /
// `brand.primaryGreen` tokens, but the perceived dimness in the screenshot
// hasn't been fully explained — no parent `opacity` or `filter` was found
// in KelpFusionMap, KelpDiagram, PageLayout, or global CSS, and MUI's
// `cssVariables: true` resolution checks out for these tokens. Possible
// remaining suspects: MUI Typography variant defaults, a stale Vite/HMR
// cache, or screenshot color compression. Revisit if it still reads dim.
// Host pages can override the top anchor by setting `--kelp-controls-top` on
// an ancestor (e.g. the Playground tab uses this to sit below its tab strip).
const panelSx = {
  position: 'absolute',
  top: 'var(--kelp-controls-top, 12px)',
  right: 12,
  zIndex: 30,
  pointerEvents: 'auto',
  width: 264,
  maxHeight: 'calc(100% - var(--kelp-controls-top, 12px) - 12px)',
  overflowY: 'auto',
  p: 1.75,
  borderRadius: 2,
  // Near-opaque + darker than before so light text reads at full contrast.
  backgroundColor: 'rgba(13, 15, 17, 0.97)',
  backdropFilter: 'blur(6px)',
  border: `1px solid ${palette.translucent.primaryGreen}`,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
  color: palette.common.white,
} as const

const collapsedSx = {
  position: 'absolute',
  top: 'var(--kelp-controls-top, 12px)',
  right: 12,
  zIndex: 30,
  pointerEvents: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  px: 1.25,
  py: 0.75,
  borderRadius: 2,
  backgroundColor: 'rgba(13, 15, 17, 0.97)',
  backdropFilter: 'blur(6px)',
  border: `1px solid ${palette.translucent.primaryGreen}`,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
  color: palette.common.white,
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    backgroundColor: 'rgba(20, 24, 27, 0.98)',
  },
} as const

const collapseBtnSx = {
  color: palette.brand.primaryGreen,
  p: 0.25,
  '&:hover': { backgroundColor: palette.translucent.primaryGreen },
} as const

// Muted-but-legible color for secondary labels (slider end caps, counts, etc.).
const mutedTextColor = palette.base[100]

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{
        display: 'block',
        textTransform: 'uppercase',
        letterSpacing: '0.09em',
        fontSize: 10.5,
        fontWeight: 700,
        color: palette.brand.primaryGreen,
        mb: 0.75,
      }}
    >
      {children}
    </Typography>
  )
}

const dividerSx = { my: 1.5, borderTop: `1px solid ${palette.base[300]}` } as const

const warningChipSx = {
  display: 'inline-block',
  mt: 0.5,
  px: 0.85,
  py: 0.25,
  borderRadius: 1,
  fontSize: 10.5,
  fontWeight: 600,
  backgroundColor: 'rgba(247, 124, 59, 0.18)',
  border: '1px solid rgba(247, 124, 59, 0.55)',
  color: '#ffb892',
} as const

const statusChipSx = {
  display: 'inline-block',
  mt: 0.5,
  px: 0.85,
  py: 0.25,
  borderRadius: 1,
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: '0.03em',
} as const

export default function KelpControls({
  tension,
  onTensionChange,
  sets,
  onSetChange,
  renderMode,
  onRenderModeChange,
  ensureConnected,
  onEnsureConnectedChange,
  maxDistanceMiles,
  onMaxDistanceMilesChange,
  routingReady,
  unsnappedStationIndices,
  stats,
}: KelpControlsProps) {
  const componentCountById = new Map(stats.map((stat) => [stat.setId, stat.componentCount]))
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <Box sx={collapsedSx} onClick={() => setCollapsed(false)} role="button" tabIndex={0}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: palette.brand.primaryGreen,
          }}
        >
          Kelp Controls
        </Typography>
        <Tooltip title="Show controls" placement="left">
          <IconButton size="small" sx={collapseBtnSx} aria-label="Show kelp controls">
            {/* Chevron-left glyph — purely decorative; click target is the wrapper. */}
            <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>
              ‹
            </span>
          </IconButton>
        </Tooltip>
      </Box>
    )
  }

  return (
    <Box sx={panelSx}>
      {/* Header with collapse toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 0.75,
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: palette.brand.primaryGreen,
          }}
        >
          Kelp Controls
        </Typography>
        <Tooltip title="Hide controls" placement="left">
          <IconButton
            size="small"
            sx={collapseBtnSx}
            aria-label="Hide kelp controls"
            onClick={() => setCollapsed(true)}
          >
            <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>
              ›
            </span>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Tension */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <SectionLabel>Tension</SectionLabel>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: palette.brand.primaryGreen,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          t = {tensionToT(tension).toFixed(2)}
        </Typography>
      </Box>
      <Slider
        size="small"
        min={0}
        max={1}
        step={0.05}
        value={tension}
        onChange={(_, value) => onTensionChange(value as number)}
        sx={{ color: 'brand.primaryGreen' }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 10.5, color: mutedTextColor }}>line-based</Typography>
        <Typography sx={{ fontSize: 10.5, color: mutedTextColor }}>hull-based</Typography>
      </Box>

      <Box sx={dividerSx} />

      {/* Max waterway distance — controls when two stations stay connected. */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <SectionLabel>Max waterway distance</SectionLabel>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: palette.brand.primaryGreen,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {maxDistanceMiles.toFixed(1)} mi
        </Typography>
      </Box>
      <Slider
        size="small"
        min={0.5}
        max={30}
        step={0.5}
        value={maxDistanceMiles}
        onChange={(_, value) => onMaxDistanceMilesChange(value as number)}
        disabled={!routingReady}
        sx={{ color: 'brand.primaryGreen' }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 10.5, color: mutedTextColor }}>0.5 mi</Typography>
        <Typography sx={{ fontSize: 10.5, color: mutedTextColor }}>30 mi</Typography>
      </Box>
      {!routingReady && (
        <Box
          sx={{
            ...statusChipSx,
            backgroundColor: palette.base[800],
            border: `1px solid ${palette.base[300]}`,
            color: mutedTextColor,
          }}
        >
          loading waterway mesh…
        </Box>
      )}
      {routingReady && unsnappedStationIndices.length > 0 && (
        <Box sx={warningChipSx}>
          {unsnappedStationIndices.length} station
          {unsnappedStationIndices.length === 1 ? '' : 's'} off-mesh: #
          {unsnappedStationIndices.slice(0, 6).join(', #')}
          {unsnappedStationIndices.length > 6 ? '…' : ''}
        </Box>
      )}

      <Box sx={dividerSx} />

      {/* Vulnerability sets */}
      <SectionLabel>Vulnerability Sets</SectionLabel>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {sets.map((set) => {
          const groups = componentCountById.get(set.setId)
          const isSplit = (groups ?? 0) > 1
          return (
            <Box
              key={set.setId}
              sx={{
                p: 1,
                borderRadius: 1.5,
                backgroundColor: palette.base[800],
                border: `1px solid ${palette.base[300]}`,
                opacity: set.visible ? 1 : 0.5,
                transition: 'opacity 0.15s',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  onClick={() => onSetChange(set.setId, { visible: !set.visible })}
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '4px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    backgroundColor: set.visible ? set.color : 'transparent',
                    border: `2px solid ${set.color}`,
                    boxSizing: 'border-box',
                  }}
                />
                <Typography sx={{ fontSize: 13, fontWeight: 600, flexGrow: 1 }} noWrap>
                  {set.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: isSplit ? '#ffb892' : mutedTextColor,
                    flexShrink: 0,
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: isSplit ? 700 : 400,
                  }}
                >
                  {set.stationIndices.length} pts · {groups ?? '–'} grp
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                <Typography
                  sx={{ fontSize: 10.5, color: mutedTextColor, width: 44, flexShrink: 0 }}
                >
                  Opacity
                </Typography>
                <Slider
                  size="small"
                  min={0.1}
                  max={0.8}
                  step={0.05}
                  value={set.opacity}
                  disabled={!set.visible}
                  onChange={(_, value) => onSetChange(set.setId, { opacity: value as number })}
                  sx={{ color: set.color, py: 0.75 }}
                />
              </Box>
            </Box>
          )
        })}
      </Box>

      <Box sx={dividerSx} />

      {/* Developer */}
      <SectionLabel>Developer</SectionLabel>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 13 }}>Show SPG graph</Typography>
          <Switch
            size="small"
            checked={renderMode === 'graph'}
            onChange={(e) => onRenderModeChange(e.target.checked ? 'graph' : 'fused')}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 13 }}>MST connectivity</Typography>
          <Switch
            size="small"
            checked={ensureConnected}
            onChange={(e) => onEnsureConnectedChange(e.target.checked)}
          />
        </Box>
      </Box>
    </Box>
  )
}
