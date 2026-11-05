// Environmental Justice's measured values: the rows beneath each metric in the By criterion table.
// Change a number here and the table and its maps follow. The scores on the metric rows
// themselves are in ../scores.ts. See ./types.ts for how to read this file.
import type { TeamValues } from './types'

export const ENVIRONMENTAL_JUSTICE_VALUES: TeamValues = {
  adaptation: {
    // Salinity impacts to in-Delta drinking water › % of days with unsuitable water quality (share of days or readings, 0 to 1)
    'ej-drinking-pct': {
      values: {
        bau: {
          all: { '2019': 0.06, '2020': 0.08, run: 0.09 },
          moderate: { '2019': 0.06, '2020': 0.03, run: 0.06 },
          high: { '2019': 0.07, '2020': 0.1, run: 0.1 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        csbau: {
          all: { '2019': 0.1, '2020': 0.09, run: 0.11 },
          moderate: { '2019': 0.14, '2020': 0.03, run: 0.11 },
          high: { '2019': 0.1, '2020': 0.11, run: 0.12 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        em: {
          all: { '2019': 0.05, '2020': 0.07, run: 0.07 },
          moderate: { '2019': 0.03, '2020': 0.02, run: 0.04 },
          high: { '2019': 0.06, '2020': 0.08, run: 0.08 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        ngw: {
          all: { '2019': 0.05, '2020': 0.07, run: 0.07 },
          moderate: { '2019': 0.03, '2020': 0.02, run: 0.04 },
          high: { '2019': 0.06, '2020': 0.09, run: 0.08 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        bf: {
          all: { '2019': 0.07, '2020': 0.07, run: 0.09 },
          moderate: { '2019': 0.05, '2020': 0.02, run: 0.05 },
          high: { '2019': 0.08, '2020': 0.1, run: 0.1 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        cor: {
          all: { '2019': 0.1, '2020': 0.07, run: 0.11 },
          moderate: { '2019': 0.14, '2020': 0.02, run: 0.11 },
          high: { '2019': 0.1, '2020': 0.1, run: 0.11 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        tunnel: {
          all: { '2019': 0.1, '2020': 0.09, run: 0.11 },
          moderate: { '2019': 0.11, '2020': 0.04, run: 0.11 },
          high: { '2019': 0.11, '2020': 0.11, run: 0.13 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
      },
      seaLevelRise: {
        bau: {
          all: { '2019': 0.11, '2020': 0.11, run: 0.13 },
          moderate: { '2019': 0.15, '2020': 0.08, run: 0.15 },
          high: { '2019': 0.1, '2020': 0.13, run: 0.13 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        csbau: {
          all: { '2019': 0.12, '2020': 0.15, run: 0.15 },
          moderate: { '2019': 0.17, '2020': 0.13, run: 0.18 },
          high: { '2019': 0.12, '2020': 0.16, run: 0.15 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        em: {
          all: { '2019': 0.1, '2020': 0.1, run: 0.11 },
          moderate: { '2019': 0.11, '2020': 0.05, run: 0.11 },
          high: { '2019': 0.1, '2020': 0.12, run: 0.13 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        ngw: {
          all: { '2019': 0.1, '2020': 0.1, run: 0.12 },
          moderate: { '2019': 0.11, '2020': 0.06, run: 0.12 },
          high: { '2019': 0.1, '2020': 0.12, run: 0.13 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        bf: {
          all: { '2019': 0.1, '2020': 0.1, run: 0.12 },
          moderate: { '2019': 0.11, '2020': 0.05, run: 0.1 },
          high: { '2019': 0.11, '2020': 0.13, run: 0.13 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        cor: {
          all: { '2019': 0.12, '2020': 0.13, run: 0.14 },
          moderate: { '2019': 0.17, '2020': 0.1, run: 0.16 },
          high: { '2019': 0.12, '2020': 0.15, run: 0.15 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
        tunnel: {
          all: { '2019': 0.13, '2020': 0.14, run: 0.15 },
          moderate: { '2019': 0.18, '2020': 0.12, run: 0.18 },
          high: { '2019': 0.13, '2020': 0.15, run: 0.15 },
          highest: { '2019': 0, '2020': 0, run: 0 },
        },
      },
    },
    // Flood risk attenuation › Flood risk descriptive change from Business as Usual (arrows or score)
    'ej-flood-judgement': { steps: { bau: 0, em: 0, ngw: 3, bf: 2, cor: 0, tunnel: 1 } },
    // Water age + temperature › Suisun Marsh (days)
    'ej-waterage-suisun': {
      values: { bau: 0, em: 3.4, bf: 0.1, ngw: 3.3, cor: 0, tunnel: 0.1 },
      seaLevelRise: { bau: 0, em: 5.2, bf: 0.1, ngw: 5.2, cor: 0, tunnel: 0 },
    },
    // Water age + temperature › Franks Tract (days)
    'ej-waterage-franksTract': {
      values: { bau: 0, em: -0.9, bf: 2.4, ngw: -0.9, cor: -0.1, tunnel: -0.1 },
      seaLevelRise: { bau: 0, em: 0.7, bf: 2.4, ngw: 0.7, cor: 0, tunnel: -0.1 },
    },
    // Water age + temperature › South Delta (days)
    'ej-waterage-southDelta': {
      values: { bau: 0, em: -4.9, bf: -1.1, ngw: -4.9, cor: 0.1, tunnel: 0.5 },
      seaLevelRise: { bau: 0, em: -4.1, bf: -0.9, ngw: -4.1, cor: 0.2, tunnel: 0.3 },
    },
    // Water age + temperature › McCormack-Williamson Tract (days)
    'ej-waterage-mcCormackWilliamson': {
      values: { bau: 0, em: 0.4, bf: 0, ngw: 0.5, cor: 0.1, tunnel: 0.2 },
      seaLevelRise: { bau: 0, em: 0.5, bf: 0, ngw: 0.7, cor: 0.1, tunnel: 0.2 },
    },
    // Water age + temperature › Lindsey-Cache Slough (days)
    'ej-waterage-lindseyCache': {
      values: { bau: 0, em: 0, bf: 0, ngw: 3.6, cor: 0, tunnel: -0.4 },
      seaLevelRise: { bau: 0, em: -0.3, bf: 0, ngw: 3.6, cor: 0, tunnel: -0.3 },
    },
  },
  outflow: {
    // Salinity impacts to in-Delta drinking water › Readings over 1,050 µS/cm (share of days or readings, 0 to 1)
    'ej-drinking-pct': {
      values: {
        hist: {
          all: { run: 0.27, wet: 0.28, dry: 0.26 },
          moderate: { run: 0.31, wet: 0.37, dry: 0.24 },
          high: { run: 0.28, wet: 0.27, dry: 0.29 },
          highest: { run: 0, wet: 0, dry: 0 },
        },
        more: {
          all: { run: 0.08, wet: 0.08, dry: 0.09 },
          moderate: { run: 0.01, wet: 0.01, dry: 0.02 },
          high: { run: 0.11, wet: 0.11, dry: 0.12 },
          highest: { run: 0, wet: 0, dry: 0 },
        },
        less: {
          all: { run: 0.32, wet: 0.33, dry: 0.3 },
          moderate: { run: 0.41, wet: 0.45, dry: 0.33 },
          high: { run: 0.32, wet: 0.32, dry: 0.31 },
          highest: { run: 0, wet: 0, dry: 0 },
        },
      },
    },
  },
}
