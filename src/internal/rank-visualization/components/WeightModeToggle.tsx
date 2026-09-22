import { Box, ButtonBase, Typography } from '@mui/material'

export type WeightMode = 'custom' | 'presets'

const MODES: { key: WeightMode; label: string }[] = [
  { key: 'custom', label: 'Custom' },
  { key: 'presets', label: 'Presets' },
]

/** Switches a weighted design between free per-team controls and preset lenses. */
export default function WeightModeToggle({
  value,
  onChange,
}: {
  value: WeightMode
  onChange: (mode: WeightMode) => void
}) {
  return (
    <Box
      role="radiogroup"
      aria-label="Weight controls"
      sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}
    >
      <Typography variant="chartColumnHead" sx={{ mr: 0.5 }}>
        Weights
      </Typography>
      {MODES.map((mode) => {
        const active = mode.key === value
        return (
          <ButtonBase
            key={mode.key}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(mode.key)}
            sx={(theme) => ({
              typography: 'chartLabel',
              px: 1.25,
              py: 0.6,
              borderRadius: 999,
              border: 1,
              borderColor: active ? 'primary.main' : 'border.strong',
              bgcolor: active ? theme.chart.voting.well : 'transparent',
              color: active ? 'common.white' : 'base.100',
              transition: 'border-color 150ms ease, background-color 150ms ease',
              '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main' },
            })}
          >
            {mode.label}
          </ButtonBase>
        )
      })}
    </Box>
  )
}
