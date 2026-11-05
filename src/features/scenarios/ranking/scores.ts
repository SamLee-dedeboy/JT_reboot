// Every team's scores, for every scenario, in one place. Change a number here and it
// changes everywhere: the By criterion table and the By scenario rankings.
//
// Each team has its criterion score, then its metric rows. Scores run −5 to +5.
//
//   ngw     New Green Watershed      bau   Business as Usual (their baseline, 0)
//   em      Eco Machine              more  More outflow (+30%)
//   bf      Bolster & Fortify        less  Less outflow (−10%)
//   cor     Calling on Reserves      hist  Historical Baseline (the outflow baseline, 0)
//   tunnel  A Tunnel
//
//   current       the adaptation scenarios at today's sea level
//   seaLevelRise  the same scenarios with sea level rise
//   outflow       the tiered outflow runs
//   ngwLevels     New Green Watershed at 25% and 100% wetland; `ngw` itself is the 50% level
//
// Use null for a score that is still forthcoming; the site then says so, and the rankings
// average the team's other criteria without it. A scenario left out of a metric row keeps
// whatever the table already shows there, usually N/A or forthcoming.
//
// Measures beneath the metrics (acres, dollars, days) stay in the breakout model, and
// written notes that quote a score do not update on their own. Provenance is in
// src/internal/rank-visualization/RANKINGS.md.
import type { TeamKey } from '../../../internal/rank-visualization/data'

type Score = number | null

interface AdaptationScores {
  ngw?: Score
  em?: Score
  bf?: Score
  cor?: Score
  tunnel?: Score
  bau?: Score
}

interface OutflowScores {
  more?: Score
  less?: Score
  hist?: Score
}

export interface RowScores {
  current: AdaptationScores
  seaLevelRise?: AdaptationScores
  outflow?: OutflowScores
  ngwLevels?: { wetland25: number; wetland100: number }
}

export interface TeamScores extends RowScores {
  /** The metric rows under the team's score, by id. */
  metrics: Record<string, RowScores>
}

export const CRITERION_SCORES: Record<TeamKey, TeamScores> = {
  ecology: {
    current: { ngw: 3.1, em: 1.33, bf: 0, cor: -0.33, tunnel: 0.33, bau: 0 },
    seaLevelRise: { ngw: 3.8, em: 1.7, bf: 0, cor: -0.7, tunnel: -0.3, bau: 0 },
    outflow: { more: 0.44, less: null, hist: 0 },
    metrics: {
      // Habitat availability
      'eco-habitat': {
        current: { ngw: 5, em: 3, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        seaLevelRise: { ngw: 5, em: 3, bf: 0, cor: 0, tunnel: 0, bau: 0 },
      },
      // Food webs
      'eco-foodweb': {
        current: { ngw: 4, em: 1, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        seaLevelRise: { ngw: 4, em: 1, bf: 0, cor: 0, tunnel: 0, bau: 0 },
      },
      // Species suitability
      'eco-species': {
        current: { ngw: -0.08, em: 0.34, bf: 0.08, cor: -1.57, tunnel: 1.1 },
        seaLevelRise: { ngw: 1.5, em: 1.1, bf: 0.39, cor: -2.82, tunnel: -1.07 },
        outflow: { more: 0.44 },
      },
    },
  },
  recreation: {
    current: { ngw: 3, em: 2, bf: 0, cor: 0, tunnel: -1, bau: 0 },
    seaLevelRise: { ngw: 3, em: 2, bf: 0, cor: 0, tunnel: -1, bau: 0 },
    outflow: { more: 0, less: null, hist: 0 },
    metrics: {
      // Salinity stress
      'rec-salinity': {
        current: { ngw: 0, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        seaLevelRise: { ngw: 0, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        outflow: { more: 1, hist: 0 },
      },
      // Temperature stress
      'rec-temperature': {
        current: { ngw: 0, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        seaLevelRise: { ngw: 0, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        outflow: { more: 0, hist: 0 },
      },
      // Habitat Restoration
      'rec-restoration': {
        current: { ngw: 5, em: 3, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        seaLevelRise: { ngw: 5, em: 3, bf: 0, cor: 0, tunnel: 0, bau: 0 },
      },
      // Recreation economy
      'rec-economy': {
        current: { ngw: 5, em: 3, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        seaLevelRise: { ngw: 5, em: 3, bf: 0, cor: 0, tunnel: 0, bau: 0 },
      },
    },
  },
  environmentalJustice: {
    current: { ngw: 1, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
    // Temporary numbers, until the team's sea-level-rise score is final.
    seaLevelRise: { ngw: 5, em: 5, bf: 5, cor: 5, tunnel: 5, bau: 0 },
    outflow: { more: 4, less: -2, hist: 0 },
    metrics: {
      // Drinking water: all points, whole period. Each vulnerability class and water year
      // is its own number in breakout/model/ejDrinkingTable.ts.
      'ej-drinking': {
        current: { ngw: 2, em: 2, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        seaLevelRise: { ngw: 1, em: 2, bf: 1, cor: 1, tunnel: 0, bau: 0 },
        outflow: { more: 4, less: -1, hist: 0 },
      },
      // Flood risk attenuation
      'ej-flood': {
        current: { ngw: 3, em: 0, bf: 2, cor: 0, tunnel: 1, bau: 0 },
        seaLevelRise: { ngw: 3, em: 0, bf: 2, cor: 0, tunnel: 1, bau: 0 },
      },
      // Water age + temperature
      'ej-waterage': {
        current: { ngw: -3, em: -2, bf: -1, cor: 0, tunnel: 0, bau: 0 },
        seaLevelRise: { ngw: -4, em: -3, bf: -1, cor: 0, tunnel: 0, bau: 0 },
      },
    },
  },
  economy: {
    current: { ngw: -4, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
    seaLevelRise: { ngw: -4, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
    outflow: { more: 0, less: null, hist: 0 },
    ngwLevels: { wetland25: -3, wetland100: -5 },
    metrics: {
      // Annual gross agricultural revenues
      'econ-revenue': {
        current: { ngw: -4, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        seaLevelRise: { ngw: -4, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        outflow: { more: 0, hist: 0 },
        ngwLevels: { wetland25: -3, wetland100: -5 },
      },
      // Agriculture-supported jobs
      'econ-jobs': {
        current: { ngw: -4, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        seaLevelRise: { ngw: -4, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        outflow: { more: 0, hist: 0 },
        ngwLevels: { wetland25: -4, wetland100: -5 },
      },
      // Economic value added
      'econ-value': {
        current: { ngw: -3, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        seaLevelRise: { ngw: -3, em: 0, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        outflow: { more: 0, hist: 0 },
        ngwLevels: { wetland25: -3, wetland100: -5 },
      },
    },
  },
  ecoCultural: {
    // Eco-cultural has no sea-level-rise rows: every number here repeats under sea level rise.
    current: { ngw: 4, em: 2, bf: 0, cor: 1, tunnel: -2, bau: 0 },
    outflow: { more: 3, less: -2, hist: 0 },
    metrics: {
      // Ecosystem restoration
      'ec-restoration': {
        current: { ngw: 5, em: 2, bf: 0, cor: 0, tunnel: 0, bau: 0 },
        outflow: { more: 0, less: 0, hist: 0 },
      },
      // Increased land access (arrows)
      'ec-access': {
        current: { ngw: 4, em: 1, bf: 0, cor: 0, tunnel: 0 },
        outflow: { more: 0, less: 0, hist: 0 },
      },
      // Indigenous science and Traditional Ecological Knowledge (arrows)
      'ec-tek': {
        current: { ngw: 4, em: 1, bf: 0, cor: 0, tunnel: 0 },
        outflow: { more: 0, less: 0, hist: 0 },
      },
      // Tribal sovereignty (arrows)
      'ec-sovereignty': {
        current: { ngw: 4, em: 1, bf: 0, cor: 2, tunnel: 0 },
        outflow: { more: 2, less: 0, hist: 0 },
      },
    },
  },
}
