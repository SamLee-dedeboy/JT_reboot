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
    Governance: palette.dataViz.orchid,
  },
  // Text drawn on category / centre colours; readableTextOn picks one.
  onColor: { light: palette.common.white, dark: palette.common.black },
  // Scenario picker buttons: resting pulse, hover lift and green active glow.
  scenarioButton: {
    width: '9rem',
    minHeight: '4rem',
    background: palette.surfaceStrong,
    text: palette.common.white,
    border: palette.brand.primaryBlue,
    activeBorder: palette.brand.primaryGreen,
    shadow: `0 2px 10px ${alpha(palette.brand.primaryBlue, 0.35)}`,
    hoverShadow: `0 8px 24px ${alpha(palette.brand.primaryBlue, 0.45)}`,
    pulseShadow: `0 4px 20px ${alpha(palette.brand.primaryBlue, 0.55)}, 0 0 15px ${alpha(palette.brand.primaryGreen, 0.25)}`,
    activeShadow: `0 4px 20px ${alpha(palette.brand.primaryGreen, 0.5)}, 0 0 15px ${alpha(palette.brand.primaryGreen, 0.35)}`,
  },
  // Frame around the scenario description and the code detail panel.
  descriptions: {
    border: `1px solid ${alpha(palette.brand.primaryGreen, 0.6)}`,
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
