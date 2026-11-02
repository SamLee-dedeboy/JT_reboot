import { useMediaQuery } from '@mui/material'
import type { Theme } from '@mui/material/styles'

const LABEL = '--explorer-font-label'
const VALUE = '--explorer-font-value'
const SMALL = '--explorer-font-small'
const CHART = '--explorer-font-chart'

const scaled = (variable: string, size: unknown) => `var(${variable}, ${String(size)})`

/**
 * The explorer's variants read their size from variables on its root, so one step down applies
 * to controls and SVG text alike. Anything outside the root, like a popover, keeps the site's size.
 */
export const explorerTypographyTheme = (outer: Theme): Theme => {
  const { button, captionSmall, chartTitle, controlValue } = outer.typography
  const buttonMedia = button as unknown as Record<
    string,
    { fontSize: string; letterSpacing: string }
  >
  const wide = '@media (max-width: 1919.95px)'
  const narrow = '@media (max-width: 1399.95px)'
  return {
    ...outer,
    typography: {
      ...outer.typography,
      chartTitle: { ...chartTitle, fontSize: scaled(LABEL, chartTitle.fontSize) },
      controlValue: { ...controlValue, fontSize: scaled(VALUE, controlValue.fontSize) },
      captionSmall: { ...captionSmall, fontSize: scaled(SMALL, captionSmall.fontSize) },
      button: {
        ...button,
        fontSize: scaled(SMALL, button.fontSize),
        [wide]: { ...buttonMedia[wide], fontSize: scaled(SMALL, buttonMedia[wide].fontSize) },
        [narrow]: { ...buttonMedia[narrow], fontSize: scaled(SMALL, buttonMedia[narrow].fontSize) },
      },
    },
  }
}

/** Large screens' smaller end, where the side-by-side layout is tightest: 16, 14, and 12px. */
export const explorerFontSizes = (theme: Theme) => ({
  [theme.breakpoints.between('lg', 'xl')]: {
    [LABEL]: '1rem',
    [VALUE]: '0.875rem',
    [SMALL]: '0.75rem',
    [CHART]: '0.875rem',
  },
})

/** Axis and data labels stay a step above the controls' smallest text. */
export const chartTextSize = (theme: Theme) => scaled(CHART, theme.typography.captionSmall.fontSize)

/** The side-by-side layout at its tightest, where controls condense so the charts keep their room. */
export const useCompactExplorer = () =>
  useMediaQuery((theme: Theme) => theme.breakpoints.between('lg', 'xl'), { noSsr: true })
