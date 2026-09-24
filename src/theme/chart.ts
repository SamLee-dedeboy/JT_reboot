import { palette } from './palette'

export const chart = {
  axis: { text: palette.base[100], line: palette.base[300], grid: palette.translucent[400] },
  series: {
    primary: palette.brand.primaryGreen,
    secondary: palette.brand.primaryBlue,
    highlight: palette.accent.yellow,
    danger: palette.accent.orange,
  },
  tooltip: {
    background: palette.base[800],
    text: palette.common.white,
    border: palette.border.default,
  },
  // Scenario voting / ranking charts (internal rank visualization).
  voting: {
    // Teams use data-only hues so a team never reads as brand chrome or a score.
    team: {
      ecology: palette.dataViz.gold,
      recreation: palette.dataViz.orchid,
      environmentalJustice: palette.dataViz.clay,
      economy: palette.dataViz.cobalt,
    },
    // Selectable team palettes; each is validated against the score pair below.
    teamPalettes: {
      color: [
        palette.dataViz.gold,
        palette.dataViz.orchid,
        palette.dataViz.clay,
        palette.dataViz.cobalt,
      ],
      neutral: [
        palette.dataViz.neutral,
        palette.dataViz.neutral,
        palette.dataViz.neutral,
        palette.dataViz.neutral,
      ],
    },
    scenario: {
      newGreenWatershed: palette.brand.primaryPink,
      ecoMachine: palette.salinity.teal,
      bolsterAndFortify: palette.accent.yellow,
      callingOnReserves: palette.accent.indigo,
      deltaTunnel: palette.accent.red,
      businessAsUsual: palette.base[200],
    },
    // Diverging score scale, matching the site's Good / Unacceptable thresholds
    // (Playground): blue = better than today, orange = worse; grey = no change.
    // Hue by sign, alpha scaled by magnitude at the call site.
    above: palette.brand.primaryBlue,
    below: palette.accent.orange,
    baseline: palette.translucent[300],
    overall: palette.common.white,
    spread: palette.base[100],
    spreadSoft: palette.translucent[200],
    track: palette.border.default,
    zeroLine: palette.base[300],
    well: palette.translucent[500],
  },
} as const
