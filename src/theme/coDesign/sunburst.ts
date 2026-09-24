// Co-design dashboard: sunburst "Comparing" gallery and sunburst grid tokens
// (src/features/co-design/views/sunburst). Built from the site palette; literal
// values appear only in the data-only category palette below.
import { palette } from '../palette'

const panelRadius = '8px'
const panelShadow = `0 4px 12px ${palette.translucent.cardShadow}`

export const sunburst = {
  // View background behind the rows (legacy --surface-elevated).
  surface: palette.surfaceStrong,
  text: palette.common.white,
  textMuted: palette.base[100],
  // One comparison row holding the charts (legacy --surface-page).
  row: {
    background: palette.brand.base,
    border: `1px solid ${palette.border.subtle}`,
    radius: panelRadius,
  },
  // Descriptive text card beside each gallery row.
  textPanel: {
    background: palette.surfaceStrong,
    border: `1px solid ${palette.border.subtle}`,
    radius: panelRadius,
    shadow: panelShadow,
    text: palette.base[50],
    // Underlined key phrases / population names in the row copy.
    underline: palette.brand.primaryGreen,
  },
  // Floating toggle panel (Top 5 / labels / order).
  controls: {
    background: palette.surfaceStrong,
    border: `1px solid ${palette.border.default}`,
    radius: panelRadius,
    shadow: panelShadow,
  },
  // On/off switch; geometry and timing match the original 48x24 slider.
  toggle: {
    width: 48,
    height: 24,
    thumb: 20,
    inset: 2,
    travel: 24,
    durationMs: 300,
    trackOff: palette.brand.base,
    trackOn: palette.brand.primaryGreen,
    thumbColor: palette.common.white,
    focusRing: palette.brand.primaryBlue,
  },
  // "← Back" button shown while a wheel is zoomed into a theme.
  backButton: {
    background: palette.base[300],
    text: palette.common.white,
    outline: `1px solid ${palette.border.subtle}`,
    focusRing: palette.brand.primaryGreen,
  },
  // Code-definition hover card (background/text/border from theme.chart.tooltip).
  tooltip: {
    width: '22rem',
    maxHeight: '32rem',
    radius: panelRadius,
    shadow: `0 20px 48px ${palette.translucent.cardShadow}`,
    // Header tint before any slice has been hovered.
    headerFallback: palette.brand.primaryGreen,
    sectionLabel: palette.base[100],
    error: palette.accent.pink,
    spinner: palette.common.white,
    spinnerSize: 24,
  },
  // SVG wheel chrome.
  wheel: {
    arcStroke: palette.common.white,
    // Text on a slice: light or dark depending on the slice colour.
    labelLight: palette.common.white,
    labelDark: palette.common.black,
    // Halo behind in-ring labels (opposite of the label colour).
    haloDark: palette.translucent[600],
    haloLight: palette.common.white,
    calloutText: palette.base[50],
    // Callout label size in viewBox units; the leader-line stacking (13 units
    // per label) is tuned to it.
    calloutFontSize: 11,
  },
  // Data-only categorical palette for the sunburst themes (shared across every
  // chart so a theme keeps its colour). Kept from the original dashboard: the
  // site accents are too light to also carry the brighter child-ring shades,
  // and there are not ten distinct site hues. Never use for UI chrome.
  categoryPalette: [
    '#637CEF',
    '#E3008C',
    '#2AA0A4',
    '#9373C0',
    '#13A10E',
    '#3A96DD',
    '#CA5010',
    '#57811B',
    '#B146C2',
    '#AE8C00',
  ],
} as const
