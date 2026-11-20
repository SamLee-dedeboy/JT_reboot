// Co-design dashboard shell (header, tutorial dialogs, info button) and the
// landing timeline. Built from the site palette; see src/features/co-design.
import { alpha, darken } from '@mui/material/styles'
import { palette } from '../palette'

// Raised-card values shared with src/ui/surfaceStyles.ts (raisedCardSx).
const cardRadius = '6px'
const raisedShadow = `0 12px 28px ${palette.translucent.cardShadow}`
const liftedShadow = `0 20px 48px ${palette.translucent.cardShadow}`

export const shell = {
  pageBackground: palette.brand.base,
  // View header: the dark band the data tools (salinity explorer) sit under.
  headerBackground: palette.base[800],
  headerBorder: palette.border.subtle,
  // Tutorial and welcome dialogs: the site's menu panel.
  dialog: {
    background: palette.base[800],
    border: `1px solid ${palette.translucent.primaryGreen}`,
    radius: '8px',
    shadow: liftedShadow,
    backdrop: palette.translucent[700],
    maxWidth: 500,
  },
  // Round "about this panel" toggle: a hairline ring that turns green on hover.
  infoButton: {
    size: 32,
    border: `1px solid ${palette.border.strong}`,
    hoverBackground: palette.translucent.primaryGreen,
    hoverBorder: palette.brand.primaryGreen,
  },
  timeline: {
    // The rail at rest; it fills with `railFill` as the reader scrolls past.
    rail: palette.border.default,
    railFill: palette.brand.primaryGreen,
    railWidth: 2,
    dotSize: 14,
    // Ring of page colour around each dot, breaking the rail either side of it.
    dotHalo: 6,
    railColumn: 60,
    maxWidth: 1100,
    cardMaxWidth: 440,
    compactCardWidth: 340,
    // Horizontal layout: stem joining each card to its dot (room for the date label).
    stemHeight: 44,
    stemWidth: 2,
    // Horizontal card width in step columns; under 2 leaves a gap between
    // same-side neighbours.
    horizontalCardSpan: 1.65,
    // Tick marking the boundary between step groups on the horizontal rail.
    dividerHeight: 40,
    // Per-group emphasis: `muted` for background steps, `highlight` for the
    // steps the audience should focus on; `default` is the landing-page look.
    tones: {
      // The site's raised card: surface fill, hairline edge, soft shadow.
      default: {
        rail: palette.brand.primaryGreen,
        dot: palette.brand.primaryGreen,
        date: palette.common.white,
        border: `1px solid ${palette.border.default}`,
        shadow: raisedShadow,
        title: palette.common.white,
        subtitle: palette.brand.primaryGreen,
        label: palette.brand.primaryGreen,
        cardBackground: palette.surface,
        tagBackground: palette.base[700],
        hollowDot: false,
        dashedRail: false,
      },
      muted: {
        rail: palette.base[400],
        dot: palette.base[300],
        date: palette.base[200],
        border: `1px solid ${palette.border.default}`,
        shadow: 'none',
        title: palette.base[100],
        subtitle: palette.base[200],
        label: palette.base[200],
        cardBackground: palette.base[700],
        tagBackground: palette.base[700],
        hollowDot: false,
        dashedRail: false,
      },
      // Brand green, dimmed over the dark page so the focus steps stand out
      // without glaring.
      highlight: {
        rail: alpha(palette.brand.primaryGreen, 0.55),
        dot: darken(palette.brand.primaryGreen, 0.25),
        date: alpha(palette.brand.primaryGreen, 0.8),
        border: `1px solid ${alpha(palette.brand.primaryGreen, 0.5)}`,
        shadow: raisedShadow,
        title: palette.common.white,
        subtitle: alpha(palette.brand.primaryGreen, 0.85),
        label: alpha(palette.brand.primaryGreen, 0.85),
        cardBackground: palette.base[700],
        tagBackground: palette.base[700],
        hollowDot: false,
        dashedRail: false,
      },
      // Planned work: the highlight green as an outline — dashed card border,
      // see-through card, hollow dot on a dashed rail.
      future: {
        rail: alpha(palette.brand.primaryGreen, 0.55),
        dot: alpha(palette.brand.primaryGreen, 0.8),
        date: alpha(palette.brand.primaryGreen, 0.8),
        border: `1px dashed ${alpha(palette.brand.primaryGreen, 0.5)}`,
        shadow: 'none',
        title: palette.common.white,
        subtitle: alpha(palette.brand.primaryGreen, 0.85),
        label: alpha(palette.brand.primaryGreen, 0.85),
        cardBackground: 'transparent',
        // See-through cards show the page behind the tag instead.
        tagBackground: palette.brand.base,
        hollowDot: true,
        dashedRail: true,
      },
    },
    // A step that opens a view lifts and takes a green edge on hover, as raisedCardSx does.
    card: {
      radius: cardRadius,
      hoverLift: 4,
      hoverBorder: palette.translucent.primaryGreen,
      hoverShadow: liftedShadow,
      divider: palette.border.subtle,
      body: palette.base[100],
      hint: palette.base[200],
      action: palette.brand.primaryGreen,
    },
  },
} as const
