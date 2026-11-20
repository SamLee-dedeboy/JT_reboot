// Co-design dashboard: linking ("Designing") view tokens
// (src/features/co-design/views/linking). Built from the site palette.
import { alpha } from '@mui/material/styles'
import { palette } from '../palette'

const panelRadius = '6px'

export const linking = {
  // Code categories (graph bubbles and the detail-panel header). Mutually
  // distinct hues that each resolve to a legible label under readableTextOn.
  category: {
    Drivers: palette.accent.blue,
    Strategies: palette.accent.red,
    Value: palette.accent.yellow,
    Governance: palette.teams.recreation,
  },
  // Text drawn on category / centre colours; readableTextOn picks one.
  onColor: { light: palette.common.white, dark: palette.common.black },
  // Scenario picker: the site's choice cards (choiceCardSx), sized for one column.
  scenarioButton: {
    width: '9rem',
    minHeight: '4rem',
  },
  // Frame around the scenario description and the code detail panel.
  descriptions: {
    border: `1px solid ${palette.border.default}`,
    radius: panelRadius,
    minWidth: '18rem',
    // Scenario name + narrative card.
    card: palette.surface,
  },
  // Graph panel and the controls layered over it.
  graph: {
    background: palette.brand.base,
    border: `1px solid ${palette.border.subtle}`,
    radius: panelRadius,
    zoomControls: {
      background: alpha(palette.base[700], 0.85),
      border: `1px solid ${palette.border.default}`,
      radius: panelRadius,
      shadow: `0 4px 6px ${palette.translucent.blackShadow}`,
      hover: palette.translucent[100],
      levelMinWidth: '3rem',
    },
    infoPanel: {
      maxWidth: '22rem',
      background: alpha(palette.base[800], 0.92),
      border: `1px solid ${palette.border.default}`,
      radius: panelRadius,
      shadow: `0 2px 8px ${palette.translucent.cardShadow}`,
    },
  },
  // d3-drawn graph marks.
  svg: {
    centerFill: palette.brand.primaryGreen,
    centerStroke: palette.base[800],
    link: palette.base[200],
    nodeStroke: palette.base[800],
    nodeHoverStroke: palette.common.white,
  },
  error: palette.accent.pink,
} as const
