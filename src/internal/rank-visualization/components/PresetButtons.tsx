import { Box, Button } from '@mui/material'
import { WEIGHT_PRESETS, sameWeights } from '../data'
import type { Weights } from '../data'

interface PresetButtonsProps {
  weights: Weights
  onSelect: (weights: Weights) => void
}

/** "Whose lens" presets; the matching preset is filled, the rest are outlined. */
export default function PresetButtons({ weights, onSelect }: PresetButtonsProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
      {WEIGHT_PRESETS.map((preset) => {
        const active = sameWeights(preset.weights, weights)
        return (
          <Button
            key={preset.name}
            size="small"
            variant={active ? 'contained' : 'outlined'}
            color="primary"
            aria-pressed={active}
            onClick={() => onSelect(preset.weights)}
            sx={{
              px: 1.75,
              py: 0.6,
              whiteSpace: 'nowrap',
              ...(!active && {
                color: 'common.white',
                borderColor: 'border.strong',
                bgcolor: 'surface',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'surfaceStrong' },
              }),
            }}
          >
            {preset.name}
          </Button>
        )
      })}
    </Box>
  )
}
