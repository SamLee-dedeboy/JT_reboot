// Small controls and legends for the region maps: a row of choices, an inline
// swatch, and the diverging −5…+5 ramp.
import { Box, Typography } from '@mui/material'
import { cellFill } from '../../model/teams'

/** A row of choices; the subteam pages all need one or two of these. */
export function Choice<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { key: T; label: string }[]
  value: T
  onChange: (key: T) => void
  label: string
}) {
  return (
    <Box
      role="radiogroup"
      aria-label={label}
      sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}
    >
      <Typography variant="body2" sx={{ color: 'base.100', mr: 0.5 }}>
        {label}
      </Typography>
      {options.map((option) => (
        <Box
          key={option.key}
          component="button"
          type="button"
          role="radio"
          onClick={() => onChange(option.key)}
          aria-checked={option.key === value}
          sx={{
            typography: 'controlLabel',
            px: 1.1,
            py: 0.5,
            borderRadius: 999,
            cursor: 'pointer',
            border: 1,
            borderColor: option.key === value ? 'primary.main' : 'border.strong',
            bgcolor: option.key === value ? 'primary.main' : 'transparent',
            color: option.key === value ? 'common.black' : 'base.50',
            '&:focus-visible': { outline: 2, outlineColor: 'primary.main', outlineOffset: 2 },
          }}
        >
          {option.label}
        </Box>
      ))}
    </Box>
  )
}

/** A swatch set inline with its label, on the text's own baseline. */
export function Swatch({
  tone,
  opacity = 1,
  dashed,
}: {
  tone?: string
  opacity?: number
  dashed?: boolean
}) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        width: 14,
        height: 14,
        borderRadius: 0.3,
        verticalAlign: '-2px',
        bgcolor: dashed ? 'transparent' : tone,
        opacity,
        border: dashed ? 1 : 0,
        borderStyle: 'dashed',
        borderColor: 'border.default',
      }}
    />
  )
}

/**
 * A continuous legend for a diverging fill: the same ramp the cells use, from the
 * deepest orange through neutral to the deepest blue, labelled at both ends and at
 * zero with the values those colours stand for.
 */
export function DivergingLegend({
  label,
  min,
  max,
  note,
}: {
  label: string
  min: string
  max: string
  note?: string
}) {
  const stops = [-5, -2.5, 0, 2.5, 5].map((step) => cellFill(step))
  return (
    <Box sx={{ display: 'grid', gap: 0.5 }}>
      <Typography variant="body2" sx={{ color: 'base.50' }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto minmax(160px, 320px) auto',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          {min}
        </Typography>
        <Box sx={{ display: 'grid', gap: 0.25 }}>
          <Box
            sx={{
              height: 12,
              borderRadius: 0.4,
              background: `linear-gradient(90deg, ${stops.join(', ')})`,
            }}
          />
          <Typography variant="body2" sx={{ color: 'base.100', textAlign: 'center' }}>
            0
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          {max}
        </Typography>
      </Box>
      {note && (
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          {note}
        </Typography>
      )}
    </Box>
  )
}
