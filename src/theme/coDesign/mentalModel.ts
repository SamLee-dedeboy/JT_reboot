// Co-design dashboard: mentalModel view tokens (src/features/co-design/views).
// Reference palette entries; literal values belong only to data-only palettes.
import { palette } from '../palette'

export const mentalModel = {
  // Bubble fills by codebook `type`. Drivers ("impacts salinity") sit above the
  // Salinity hub, impacts ("impacted by salinity") below it. Shared by the
  // renderer, the Drivers/Impacts legend chips and the tooltip header.
  node: {
    driver: palette.accent.blue,
    impact: palette.accent.pink,
    // Codes with any other type (none in the current codebook).
    other: palette.accent.yellow,
    center: palette.brand.primaryGreen,
    stroke: palette.base[800],
    hoverStroke: palette.common.white,
  },
  // Candidate text colours for labels on coloured fills (see readableTextOn).
  text: {
    light: palette.common.white,
    dark: palette.brand.base,
  },
  link: {
    stroke: palette.base[100],
    opacity: 0.5,
    arrow: palette.base[100],
  },
  // Faint bands behind the drivers (top) and impacts (bottom) halves.
  region: {
    drivers: palette.base[100],
    impacts: palette.common.white,
    opacity: 0.1,
  },
  legendRadius: '4px',
  tooltip: {
    // Ease time (ms) as the tooltip follows the hovered bubble.
    moveDuration: 200,
    radius: '6px',
    shadow: `0 8px 24px ${palette.translucent.cardShadow}`,
  },
} as const
