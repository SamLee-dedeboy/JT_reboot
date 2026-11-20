// Co-design dashboard: flow ("Listening") view tokens
// (src/features/co-design/views/flow). Built from the site palette; literal
// values belong only to data-only palettes.
import { palette } from '../palette'

export const flow = {
  // View surface behind the interview flow and the combinations panel.
  surface: palette.brand.base,
  text: palette.common.white,
  loading: {
    text: palette.base[50],
    track: palette.border.subtle,
    indicator: palette.brand.primaryGreen,
    size: '2.5rem',
    thickness: 3,
  },
  // Right-hand "Shared Values and Concerns" panel; widths in px per breakpoint.
  controlPanel: {
    width: { xs: 320, md: 288, lg: 352, xl: 448 },
    outline: `1px solid ${palette.border.default}`,
    background: palette.translucent[100],
    radius: '6px',
  },
  sectionHeader: {
    background: palette.brand.primaryGreen,
    text: palette.common.black,
    shadow: `0 0 1px ${palette.translucent.blackShadow}`,
    // Tall enough for the longest question (five lines at 1440px) so every band matches.
    titleHeight: '9.5rem',
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
    width: 200,
    background: palette.surfaceStrong,
    text: palette.common.white,
    // "people" after the count; the number itself is `text`.
    count: palette.base[100],
    outline: `1px solid ${palette.border.strong}`,
    // Chosen blocks take the site's selection green.
    clickedOutline: `3px solid ${palette.brand.primaryGreen}`,
    clickedShadow: `0 0 0 6px ${palette.translucent.primaryGreen}`,
    clickedText: palette.brand.primaryGreen,
    focusOutline: `2px solid ${palette.accent.blue}`,
    radius: '4px',
    iconHoverBackground: palette.base[300],
  },
  // d3 sankey paths between blocks (fill comes from combinationPalette).
  path: { opacity: 0.7 },
  combinations: {
    subtitle: palette.brand.primaryGreen,
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
  // Data-only: hues for strategy combinations (sankey bands and combination rows).
  // Muted, mid-light colors that sit calmly on the dark ground, each >= 4.5:1 on
  // base.700. Every combination gets one, largest group first; they repeat.
  combinationPalette: [
    '#6fb8d0', // river
    '#e3a857', // ochre
    '#5a8fd8', // bay
    '#a497e8', // lavender
    '#63b98c', // tule
    '#e8806f', // coral
    '#d8cb72', // straw
    '#cc8dbc', // mauve
  ],
} as const
