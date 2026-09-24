// Co-design dashboard: flow ("Listening") view tokens
// (src/features/co-design/views/flow). Built from the site palette; literal
// values belong only to data-only palettes.
import { palette } from '../palette'

export const flow = {
  // View surface behind the interview flow and the combinations panel.
  surface: palette.surfaceStrong,
  text: palette.common.white,
  loading: {
    text: palette.base[50],
    track: palette.border.subtle,
    indicator: palette.brand.primaryBlue,
    size: '2.5rem',
    thickness: 3,
  },
  // Right-hand "Shared Values and Concerns" panel; widths in px per breakpoint.
  controlPanel: {
    width: { xs: 320, md: 288, lg: 352, xl: 448 },
    outline: `2px solid ${palette.translucent.primaryGreen}`,
    background: palette.translucent[50],
    radius: '8px',
  },
  sectionHeader: {
    background: palette.brand.primaryGreen,
    text: palette.common.black,
    shadow: `0 0 1px ${palette.translucent.blackShadow}`,
    titleHeight: '4.5rem',
  },
  columnHeader: {
    text: palette.common.white,
    shadow: `0 0 1px ${palette.translucent.blackShadow}`,
    radius: '4px',
  },
  hiddenSectionToggle: {
    size: '1.5rem',
    hoverBackground: palette.base[300],
  },
  block: {
    background: palette.base[400],
    text: palette.common.white,
    outline: `1px solid ${palette.brand.primaryBlue}`,
    clickedOutline: `4px solid ${palette.brand.primaryBlue}`,
    clickedShadow: `0 0 2px 2px ${palette.base[300]}`,
    clickedText: palette.brand.primaryBlue,
    focusOutline: `2px solid ${palette.accent.blue}`,
    radius: '4px',
    iconHoverBackground: palette.base[300],
  },
  // d3 sankey paths between blocks (fill comes from combinationPalette).
  path: { opacity: 0.7 },
  combinations: {
    subtitle: palette.brand.primaryBlue,
    optionLabel: palette.base[200],
    optionLabelActive: palette.common.white,
    connector: `2px dotted ${palette.base[200]}`,
    circleFill: palette.common.white,
    circleStrokeSelected: palette.base[600],
    circleStrokeUnselected: palette.base[100],
    rowHoverShadow: `0 4px 6px -1px ${palette.translucent.cardShadow}, 0 2px 4px -2px ${palette.translucent.cardShadow}`,
    rowHighlightOutline: `1px solid ${palette.common.black}`,
    rowFocusOutline: `2px solid ${palette.common.white}`,
    count: palette.common.white,
  },
  helpPopover: {
    background: palette.base[800],
    text: palette.common.white,
    border: `1px solid ${palette.border.strong}`,
    shadow: `0 4px 12px ${palette.translucent.cardShadow}`,
    radius: '8px',
    close: palette.base[100],
    closeHover: palette.common.white,
    swatchFill: palette.common.white,
    swatchBorderSelected: palette.base[300],
    swatchBorderUnselected: palette.base[100],
    swatchSize: '1.1rem',
  },
  // Data-only: categorical hues for strategy combinations (sankey paths and
  // combination rows); the site palette has no 15 mutually distinct hues.
  combinationPalette: [
    '#e6194b',
    '#f58231',
    '#ffe119',
    '#bfef45',
    '#3cb44b',
    '#42d4f4',
    '#4363d8',
    '#911eb4',
    '#f032e6',
    '#fabed4',
    '#469990',
    '#dcbeff',
    '#9a6324',
    '#aaffc3',
    '#ffd8b1',
  ],
} as const
