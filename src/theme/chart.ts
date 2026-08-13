import { palette } from './palette'

export const chart = {
  axis: { text: palette.base[100], line: palette.base[300], grid: palette.translucent[400] },
  series: {
    primary: palette.brand.primaryGreen,
    secondary: palette.brand.primaryBlue,
    highlight: palette.accent.yellow,
    danger: palette.accent.orange,
  },
  tooltip: {
    background: palette.base[800],
    text: palette.common.white,
    border: palette.border.default,
  },
} as const
