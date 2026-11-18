import { Box } from '@mui/material'

interface PanelSlantProps {
  color: string
  attachment?: 'before' | 'after'
  tilt?: 'up-right' | 'down-right'
}

// Change these values to adjust the vertical difference across every slant: a shallow cut on
// a phone, where a 4rem drop over 390px would read as a wedge, and the full drop from md up.
const PANEL_SLANT_HEIGHT = { xs: '1.25rem', md: '4rem' } as const

/** One value per slant height breakpoint, built from that breakpoint's height. */
const bySlantHeight = (value: (height: string) => string) => ({
  xs: value(PANEL_SLANT_HEIGHT.xs),
  md: value(PANEL_SLANT_HEIGHT.md),
})

const slantShape = {
  before: {
    'up-right': 'polygon(0 100%, 100% 0, 100% 100%)',
    'down-right': 'polygon(0 0, 100% 100%, 0 100%)',
  },
  after: {
    'up-right': 'polygon(0 0, 100% 0, 0 100%)',
    'down-right': 'polygon(0 0, 100% 0, 100% 100%)',
  },
} as const

export default function PanelSlant({
  color,
  attachment = 'before',
  tilt = 'up-right',
}: PanelSlantProps) {
  return (
    <Box sx={{ position: 'relative', height: 0, zIndex: 5, pointerEvents: 'none' }} aria-hidden>
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          left: 0,
          top:
            attachment === 'before' ? bySlantHeight((height) => `calc(-${height} - 1px)`) : '-1px',
          height: bySlantHeight((height) => `calc(${height} + 2px)`),
          bgcolor: color,
          clipPath: slantShape[attachment][tilt],
        }}
      />
    </Box>
  )
}
