// Control panel for the KelpFusion overlay: tension slider + per-set legend.

import { Box, Checkbox, Slider, Typography } from '@mui/material';
import type { KelpSet } from '../../../lib/kelp/types';

interface KelpControlsProps {
  tension: number;
  onTensionChange: (value: number) => void;
  sets: KelpSet[];
  onSetChange: (setId: string, patch: Partial<KelpSet>) => void;
}

const panelSx = {
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 30,
  pointerEvents: 'auto',
  width: 240,
  p: 1.5,
  borderRadius: 1.5,
  backgroundColor: 'rgba(22, 22, 22, 0.92)',
  border: '1px solid rgba(126, 217, 87, 0.4)',
  color: 'grey.100',
} as const;

export default function KelpControls({
  tension,
  onTensionChange,
  sets,
  onSetChange,
}: KelpControlsProps) {
  return (
    <Box sx={panelSx}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        KelpFusion Tension
      </Typography>
      <Typography variant="caption" sx={{ color: 'grey.400' }}>
        line-based ↔ hull-based
      </Typography>
      <Slider
        size="small"
        min={0}
        max={1}
        step={0.05}
        value={tension}
        onChange={(_, value) => onTensionChange(value as number)}
        sx={{ mt: 0.5, color: 'brand.primaryGreen' }}
      />

      <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>
        Vulnerability Sets
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {sets.map((set) => (
          <Box key={set.setId}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Checkbox
                size="small"
                checked={set.visible}
                onChange={(e) => onSetChange(set.setId, { visible: e.target.checked })}
                sx={{ p: 0.25, color: 'grey.400', '&.Mui-checked': { color: set.color } }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '3px',
                  backgroundColor: set.color,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {set.label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.500' }}>
                {set.stationIndices.length}
              </Typography>
            </Box>
            <Slider
              size="small"
              min={0.1}
              max={0.8}
              step={0.05}
              value={set.opacity}
              disabled={!set.visible}
              onChange={(_, value) => onSetChange(set.setId, { opacity: value as number })}
              sx={{ ml: 4, width: 150, color: set.color, py: 0.5 }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
