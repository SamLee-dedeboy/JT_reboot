import { Box } from '@mui/material'

interface PanelSlantProps {
  color: string
  attachment?: 'before' | 'after'
  tilt?: 'up-right' | 'down-right'
}

// Change this single value to adjust the vertical difference across every slant.
export const PANEL_SLANT_HEIGHT = '4rem'

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
        sx={(theme) => ({
          position: 'absolute',
          right: 0,
          left: 0,
          top: attachment === 'before' ? `calc(-${PANEL_SLANT_HEIGHT} - 1px)` : '-1px',
          height: `calc(${PANEL_SLANT_HEIGHT} + 2px)`,
          bgcolor: color,
          clipPath: slantShape[attachment][tilt],
          [theme.breakpoints.down('md')]: { display: 'none' },
        })}
      />
    </Box>
  )
}
