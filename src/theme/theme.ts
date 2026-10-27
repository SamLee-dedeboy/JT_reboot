import { createTheme } from '@mui/material/styles'
import { chart } from './chart'
import { coDesign } from './coDesign'
import { components } from './components'
import { map } from './map'
import { palette } from './palette'
import { jtSpacing } from './spacing'
import { typography } from './typography'

export const numbering = {
  color: { primary: palette.brand.primaryGreen, ghost: palette.base[100] },
  grid: { inlineTemplate: '1.85rem minmax(0, 1fr)', inlineGap: '0.65rem' },
  badge: {
    size: '1.9rem',
    border: `1px solid ${palette.translucent.primaryGreen}`,
    radius: '999px',
  },
  article: { width: { xs: 'auto', sm: '2.4rem' } },
  rank: { width: { xs: '2.25rem', sm: '2.75rem' } },
} as const

export const highlighter = {
  defaultColor: palette.translucent.primaryGreen,
  accentBlueBalanced: palette.translucent.accentBlueBalanced,
  accentBlueVibrant: palette.translucent.accentBlueVibrant,
  vibrancy: { subtle: 0.18, balanced: 0.32, vibrant: 0.52 },
} as const

const navigationBarHeight = { xs: 72, md: 76 } as const

export const navigation = {
  /** Navbar height in px; also where sticky elements below the navbar pin. */
  barHeight: navigationBarHeight,
  /** A length less the navbar, per breakpoint, e.g. a viewport-filling panel under it. */
  belowBar: (length: string) => ({
    xs: `calc(${length} - ${navigationBarHeight.xs}px)`,
    md: `calc(${length} - ${navigationBarHeight.md}px)`,
  }),
  /** Where an in-page "On this page" rail pins: below the navbar and a sticky tab bar. */
  pageRailTop: 148,
  desktopButtonMinWidth: 140,
  activeBorder: `1px solid ${palette.translucent.primaryGreen}`,
  activeBackground: palette.translucent.primaryGreen,
  menuPanelBackground: palette.base[800],
  drawerPanelBackground: palette.base[900],
  panelBorder: `1px solid ${palette.translucent.primaryGreen}`,
  panelRadius: '8px',
  dropdownShadow: `0 20px 48px ${palette.translucent.cardShadow}`,
  drawerShadow: `-18px 0 46px ${palette.translucent.blackShadow}`,
  spacing: {
    menuItemInline: 1.75,
    menuItemBlock: 1.2,
    mobileButtonInline: 1.5,
    mobileButtonBlock: 1.25,
    subItemInline: 1.25,
    subItemBlock: 1,
  },
} as const

// Scenario performance and ranking charts (/scenarios/ranking). Heights and widths are px
// numbers because the link lines are SVG drawn from them; grid tracks are CSS strings.
const rankWidth = numbering.rank.width
const linkWidth = 96
export const ranking = {
  /** A scenario row; the link lines land on its vertical center. */
  rowHeight: 58,
  /** A team row inside an expanded scenario, and the −5…+5 track it draws on. */
  trackHeight: 34,
  /** One team's priority control: name, slider, weight. */
  controlHeight: 44,
  /** Score bar; an illustrative (inferred) score is drawn as a dashed outline instead. */
  bar: { height: 16, zeroMarkWidth: 4, outlineWidth: 2 },
  zeroLine: { width: 2, color: palette.base[300] },
  teamIconSize: 18,
  legend: { swatchWidth: 28, swatchHeight: 6 },
  links: {
    width: linkWidth,
    /** Where the line leaves its row and where it reaches the other, as a share of width. */
    bend: [0.3, 0.7],
    strokeWidth: { resting: 1.5, moved: 2.5 },
    opacity: { resting: 0.35, moved: 1 },
    color: palette.base[50],
  },
  motion: { rerankSeconds: 0.25, expandMs: 180 },
  columns: {
    /** Priorities beside the linked rankings. */
    layout: { xs: '1fr', lg: 'minmax(300px, .55fr) minmax(0, 1.45fr)' },
    control: '128px minmax(0, 1fr) 40px',
    overall: {
      xs: `${rankWidth.xs} minmax(120px, .8fr) 64px`,
      md: `${rankWidth.sm} 240px minmax(320px, 1fr) 72px`,
    },
    team: { xs: 'minmax(130px, 1fr) 72px', md: '240px minmax(320px, 1fr) 72px' },
    current: {
      xs: `${rankWidth.xs} minmax(0, 1fr) 56px`,
      sm: `${rankWidth.sm} minmax(150px, 190px) minmax(80px, 1fr) 56px`,
    },
    linked: { xs: 'minmax(0, 1fr)', md: `minmax(0, 1fr) ${linkWidth}px minmax(180px, 230px)` },
    equal: `${rankWidth.sm} minmax(0, 1fr)`,
  },
} as const

export const logoWordmark = {
  desktopMinWidth: 220,
  containerLineHeight: 1.05,
  fontSize: {
    mobile: 'clamp(1.05rem, 4vw, 1.2rem)',
    tablet: 'clamp(1.1rem, 2.4vw, 1.25rem)',
    desktop: { md: 'clamp(0.9rem, 1.2vw, 1.05rem)', lg: 'clamp(1.35rem, 1.35vw, 1.5rem)' },
  },
  footerFontSize: 'clamp(1.05rem, 1.4vw, 1.35rem)',
} as const

const theme = createTheme({
  cssVariables: true,
  colorSchemes: { light: false, dark: true },
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1400 } },
  palette: {
    mode: 'dark',
    ...palette,
    secondary: {
      main: palette.brand.primaryBlue,
      dark: '#2f6f85',
      light: '#8bc4d4',
      contrastText: palette.common.white,
    },
    primary: {
      main: palette.brand.primaryGreen,
      light: '#b9ec9a',
      contrastText: palette.common.black,
    },
    background: { default: palette.brand.base, paper: palette.base[200] },
    text: { primary: palette.common.white },
    info: { main: palette.brand.primaryBlue },
    success: { main: palette.brand.primaryGreen },
    divider: palette.base[400],
  },
  shape: { borderRadius: 3 },
  typography,
  components,
  jtSpacing,
  numbering,
  highlighter,
  navigation,
  logoWordmark,
  map,
  chart,
  coDesign,
  ranking,
})

export default theme
