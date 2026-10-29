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
      ecology: palette.teams.ecology,
      recreation: palette.teams.recreation,
      environmentalJustice: palette.teams.envJustice,
      economy: palette.teams.economy,
      ecoCultural: palette.teams.ecoCultural,
    },
    // Selectable team palettes; each is validated against the score pair below.
    teamPalettes: {
      color: [
        palette.teams.ecology,
        palette.teams.recreation,
        palette.teams.envJustice,
        palette.teams.economy,
        palette.teams.ecoCultural,
      ],
      neutral: [
        palette.visualization.neutral,
        palette.visualization.neutral,
        palette.visualization.neutral,
        palette.visualization.neutral,
        palette.visualization.neutral,
      ],
    },
    scenario: {
      newGreenWatershed: palette.brand.primaryPink,
      ecoMachine: palette.salinity.teal,
      bolsterAndFortify: palette.accent.yellow,
      callingOnReserves: palette.accent.indigo,
      deltaTunnel: palette.accent.red,
      businessAsUsual: palette.base[200],
      // Tiered outflow runs: fresher (more outflow) and saltier (less outflow).
      moreOutflow: palette.accent.blue,
      lessOutflow: palette.accent.pink,
    },
    // Diverging score scale, matching the site's Good / Unacceptable thresholds
    // (Playground): blue = better than today, brick red = worse; grey = no change.
    // Hue by sign, alpha scaled by magnitude at the call site. `belowText` is the
    // red lightened for numbers on the dark ground.
    above: palette.brand.primaryBlue,
    below: palette.accent.brick,
    belowText: palette.accent.brickText,
    baseline: palette.translucent[300],
    overall: palette.common.white,
    spread: palette.base[100],
    spreadSoft: palette.translucent[200],
    track: palette.border.default,
    // Drill-down views (step 4). A measurement is not a score, so it never uses the
    // blue/orange pair: one neutral ink, plus a flag color per edge kind so a child
    // row says how it relates to its parent.
    drill: {
      measure: palette.base[100],
      measureTrack: palette.translucent[200],
      gap: palette.base[400],
      edge: {
        averages: palette.base[50],
        measures: palette.base[100],
        derives: palette.base[100],
        // Its own hue: a sub-scenario is the one edge that does not flow upward,
        // so it should not read as a quieter version of the ones that do.
        refines: palette.accent.indigo,
        duplicates: palette.accent.purple,
        beside: palette.accent.yellow,
        unscored: palette.base[300],
      },
    },
    zeroLine: palette.base[300],
    well: palette.translucent[500],
  },
  // Internal site map: navbar menu edges vs. in-page links between routes.
  siteMap: {
    menuEdge: palette.base[300],
    linkEdge: palette.accent.blue,
    dynamicEdge: palette.accent.purple,
    plannedEdge: palette.base[400],
    selected: palette.brand.primaryGreen,
    warning: palette.accent.orange,
    nodeSurface: palette.base[700],
    nodeBorder: palette.border.default,
  },
} as const
