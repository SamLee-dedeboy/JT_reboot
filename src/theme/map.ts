import { palette } from './palette'

export const map = {
  markers: {
    station: palette.accent.orange,
    selected: palette.accent.yellow,
    comparison: palette.brand.primaryBlue,
    stroke: palette.common.white,
  },
  waterways: {
    sacramento: palette.brand.primaryGreen,
    sanJoaquin: palette.accent.blue,
  },
  labels: {
    text: palette.common.white,
    muted: palette.base[100],
    halo: palette.base[900],
  },
  background: palette.base[900],
  overlay: palette.translucent[800],
} as const
