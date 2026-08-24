import { createTheme } from '@mui/material/styles'
import { chart } from './chart'
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
} as const

export const highlighter = {
  defaultColor: palette.translucent.primaryGreen,
  accentBlueBalanced: palette.translucent.accentBlueBalanced,
  accentBlueVibrant: palette.translucent.accentBlueVibrant,
  vibrancy: { subtle: 0.18, balanced: 0.32, vibrant: 0.52 },
} as const

export const navigation = {
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
})

export default theme
