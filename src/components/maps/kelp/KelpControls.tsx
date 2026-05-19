// Control panel for the KelpFusion overlay: tension slider, per-set legend,
// and developer toggles for inspecting the algorithm.

import type { ReactNode } from 'react';
import { Box, Slider, Switch, Typography } from '@mui/material';
import { tensionToT } from '../../../lib/kelp/tension';
import type { KelpSet, SetStat } from '../../../lib/kelp/types';
import type { KelpRenderMode } from './KelpOverlay';

interface KelpControlsProps {
  tension: number;
  onTensionChange: (value: number) => void;
  sets: KelpSet[];
  onSetChange: (setId: string, patch: Partial<KelpSet>) => void;
  renderMode: KelpRenderMode;
  onRenderModeChange: (mode: KelpRenderMode) => void;
  ensureConnected: boolean;
  onEnsureConnectedChange: (value: boolean) => void;
  stats: SetStat[];
}

// NOTE (unsolved): the panel text still reads darker than the literal color
// values suggest. Bumping to `#ffffff` / `rgba(255,255,255,0.9)` / `#9be870`
// below is a real change from the previous `grey.100` / `grey.300` /
// `brand.primaryGreen` tokens, but the perceived dimness in the screenshot
// hasn't been fully explained — no parent `opacity` or `filter` was found
// in KelpFusionMap, KelpDiagram, PageLayout, or global CSS, and MUI's
// `cssVariables: true` resolution checks out for these tokens. Possible
// remaining suspects: MUI Typography variant defaults, a stale Vite/HMR
// cache, or screenshot color compression. Revisit if it still reads dim.
const panelSx = {
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 30,
  pointerEvents: 'auto',
  width: 264,
  maxHeight: 'calc(100% - 24px)',
  overflowY: 'auto',
  p: 1.75,
  borderRadius: 2,
  // Near-opaque + darker than before so light text reads at full contrast.
  backgroundColor: 'rgba(13, 15, 17, 0.97)',
  backdropFilter: 'blur(6px)',
  border: '1px solid rgba(126, 217, 87, 0.35)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
  color: '#ffffff',
} as const;

// Muted-but-legible color for secondary labels (slider end caps, counts, etc.).
const mutedTextColor = 'rgba(255, 255, 255, 0.9)';

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{
        display: 'block',
        textTransform: 'uppercase',
        letterSpacing: '0.09em',
        fontSize: 10.5,
        fontWeight: 700,
        color: '#9be870',
        mb: 0.75,
      }}
    >
      {children}
    </Typography>
  );
}

const dividerSx = { my: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.09)' } as const;

export default function KelpControls({
  tension,
  onTensionChange,
  sets,
  onSetChange,
  renderMode,
  onRenderModeChange,
  ensureConnected,
  onEnsureConnectedChange,
  stats,
}: KelpControlsProps) {
  const componentCountById = new Map(stats.map((stat) => [stat.setId, stat.componentCount]));

  return (
    <Box sx={panelSx}>
      {/* Tension */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <SectionLabel>Tension</SectionLabel>
        <Typography
          sx={{ fontSize: 12, fontWeight: 700, color: '#9be870', fontVariantNumeric: 'tabular-nums' }}
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

      {/* Vulnerability sets */}
      <SectionLabel>Vulnerability Sets</SectionLabel>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {sets.map((set) => {
          const groups = componentCountById.get(set.setId);
          return (
            <Box
              key={set.setId}
              sx={{
                p: 1,
                borderRadius: 1.5,
                backgroundColor: 'rgba(255, 255, 255, 0.045)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
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
                  sx={{ fontSize: 11, color: mutedTextColor, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
                >
                  {set.stationIndices.length} pts · {groups ?? '–'} grp
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                <Typography sx={{ fontSize: 10.5, color: mutedTextColor, width: 44, flexShrink: 0 }}>
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
          );
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
  );
}
