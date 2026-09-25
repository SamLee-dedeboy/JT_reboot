// Co-design dashboard shell (header, tutorial dialogs, info button) and the
// landing timeline. Built from the site palette; see src/features/co-design.
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
    stemHeight: 36,
    stemWidth: 2,
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
