// Co-design dashboard shell (header, tutorial dialogs, info button) and the
// landing timeline. Built from the site palette; see src/features/co-design.
import { alpha, darken } from '@mui/material/styles'
import { palette } from '../palette'

export const shell = {
  pageBackground: palette.brand.base,
  headerBackground: palette.base[700],
  headerBorder: palette.border.subtle,
  dialog: {
    background: palette.base[800],
    border: `1px solid ${palette.translucent.primaryGreen}`,
    radius: '8px',
    backdrop: palette.translucent[700],
    maxWidth: 500,
  },
  infoButton: {
    size: 32,
    background: palette.translucent[500],
    border: `1px solid ${palette.border.default}`,
    shadow: `0 2px 8px ${palette.translucent.blackShadow}`,
  },
  timeline: {
    rail: palette.brand.primaryBlue,
    railWidth: 3,
    dot: palette.common.white,
    dotSize: 20,
    railColumn: 60,
    maxWidth: 1100,
    cardMaxWidth: 440,
    compactCardWidth: 340,
    // Horizontal layout: stem joining each card to its dot (room for the date label).
    stemHeight: 44,
    stemWidth: 2,
    // Horizontal card width in step columns; under 2 leaves a gap between
    // same-side neighbours.
    horizontalCardSpan: 1.5,
    // Tick marking the boundary between step groups on the horizontal rail.
    dividerHeight: 40,
    // Per-group emphasis: `muted` for background steps, `highlight` for the
    // steps the audience should focus on; `default` is the landing-page look.
    tones: {
      default: {
        rail: palette.brand.primaryBlue,
        dot: palette.common.white,
        date: palette.brand.primaryGreen,
        border: `2px solid ${palette.brand.primaryBlue}`,
        shadow: `0 2px 10px ${palette.translucent.primaryBlueStrong}`,
        title: palette.common.white,
        subtitle: palette.brand.primaryGreen,
        label: palette.brand.primaryBlue,
      },
      muted: {
        rail: palette.base[400],
        dot: palette.base[300],
        date: palette.base[200],
        border: `2px solid ${palette.base[400]}`,
        shadow: 'none',
        title: palette.base[100],
        subtitle: palette.base[200],
        label: palette.base[200],
      },
      // Brand green, dimmed over the dark page so the focus steps stand out
      // without glaring.
      highlight: {
        rail: alpha(palette.brand.primaryGreen, 0.55),
        dot: darken(palette.brand.primaryGreen, 0.25),
        date: alpha(palette.brand.primaryGreen, 0.8),
        border: `2px solid ${alpha(palette.brand.primaryGreen, 0.5)}`,
        shadow: `0 2px 12px ${alpha(palette.brand.primaryGreen, 0.15)}`,
        title: palette.common.white,
        subtitle: alpha(palette.brand.primaryGreen, 0.85),
        label: alpha(palette.brand.primaryGreen, 0.85),
      },
    },
    card: {
      background: palette.base[700],
      border: `2px solid ${palette.brand.primaryBlue}`,
      hoverBorder: palette.accent.blue,
      radius: '6px',
      shadow: `0 2px 10px ${palette.translucent.primaryBlueStrong}`,
      hoverShadow: `0 8px 24px ${palette.translucent.primaryBlueGlow}`,
      pulseShadow: `0 4px 20px ${palette.translucent.primaryBlueGlow}, 0 0 15px ${palette.translucent.primaryGreen}`,
    },
  },
} as const
