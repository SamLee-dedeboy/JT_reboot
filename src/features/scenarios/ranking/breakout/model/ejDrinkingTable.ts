// The Env Justice tab of the ranking table workbook (Nov 2026): drinking-water scores
// and shares of readings over 1,050 µS/cm by vulnerability class, for the whole period
// and water years 2019 and 2020 (the team moved from wet and dry seasons to water years).
//
// Business as Usual's shares are not in the sheet, and the table does not show them.
// They follow from the scores (one point per percentage point; with sea level rise
// they are "SLR COMM.xlsx", rounded to two places like the sheet).
type ByClass = Record<string, Record<string, number>>

export const EJ_DRINKING_SCORES: Record<string, ByClass> = {
  bau: {
    all: { run: 0, '2019': 0, '2020': 0 },
    moderate: { run: 0, '2019': 0, '2020': 0 },
    high: { run: 0, '2019': 0, '2020': 0 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  em: {
    all: { run: 2, '2019': 1, '2020': 1 },
    moderate: { run: 2, '2019': 3, '2020': 1 },
    high: { run: 2, '2019': 1, '2020': 2 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  ngw: {
    all: { run: 2, '2019': 1, '2020': 1 },
    moderate: { run: 2, '2019': 3, '2020': 1 },
    high: { run: 2, '2019': 1, '2020': 1 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  bf: {
    all: { run: 0, '2019': -1, '2020': 1 },
    moderate: { run: 1, '2019': 1, '2020': 1 },
    high: { run: 0, '2019': -1, '2020': 0 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  cor: {
    all: { run: 0, '2019': 0, '2020': 2 },
    moderate: { run: 0, '2019': 0, '2020': 1 },
    high: { run: 1, '2019': 0, '2020': 1 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  tunnel: {
    all: { run: 0, '2019': 0, '2020': 0 },
    moderate: { run: 1, '2019': 3, '2020': -1 },
    high: { run: -1, '2019': -1, '2020': 0 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
}

export const EJ_DRINKING_SCORES_SLR: Record<string, ByClass> = {
  bau: {
    all: { run: 0, '2019': 0, '2020': 0 },
    moderate: { run: 0, '2019': 0, '2020': 0 },
    high: { run: 0, '2019': 0, '2020': 0 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  em: {
    all: { run: 2, '2019': 1, '2020': 1 },
    moderate: { run: 4, '2019': 4, '2020': 3 },
    high: { run: 0, '2019': 0, '2020': 1 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  ngw: {
    all: { run: 1, '2019': 1, '2020': 1 },
    moderate: { run: 3, '2019': 4, '2020': 2 },
    high: { run: 0, '2019': 0, '2020': 1 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  bf: {
    all: { run: 1, '2019': 1, '2020': 1 },
    moderate: { run: 5, '2019': 4, '2020': 3 },
    high: { run: 0, '2019': -1, '2020': 0 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  cor: {
    all: { run: 1, '2019': 0, '2020': 2 },
    moderate: { run: 2, '2019': 0, '2020': 3 },
    high: { run: 0, '2019': 0, '2020': 1 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  tunnel: {
    all: { run: 0, '2019': -1, '2020': 1 },
    moderate: { run: 0, '2019': -1, '2020': 1 },
    high: { run: 0, '2019': -1, '2020': 1 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
}

export const EJ_DRINKING_SHARES: Record<string, ByClass> = {
  bau: {
    all: { run: 0.09, '2019': 0.06, '2020': 0.08 },
    moderate: { run: 0.06, '2019': 0.06, '2020': 0.03 },
    high: { run: 0.1, '2019': 0.07, '2020': 0.1 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  em: {
    all: { run: 0.07, '2019': 0.05, '2020': 0.07 },
    moderate: { run: 0.04, '2019': 0.03, '2020': 0.02 },
    high: { run: 0.08, '2019': 0.06, '2020': 0.08 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  ngw: {
    all: { run: 0.07, '2019': 0.05, '2020': 0.07 },
    moderate: { run: 0.04, '2019': 0.03, '2020': 0.02 },
    high: { run: 0.08, '2019': 0.06, '2020': 0.09 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  bf: {
    all: { run: 0.09, '2019': 0.07, '2020': 0.07 },
    moderate: { run: 0.05, '2019': 0.05, '2020': 0.02 },
    high: { run: 0.1, '2019': 0.08, '2020': 0.1 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  cor: {
    all: { run: 0.11, '2019': 0.1, '2020': 0.07 },
    moderate: { run: 0.11, '2019': 0.14, '2020': 0.02 },
    high: { run: 0.11, '2019': 0.1, '2020': 0.1 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  tunnel: {
    all: { run: 0.11, '2019': 0.1, '2020': 0.09 },
    moderate: { run: 0.1, '2019': 0.11, '2020': 0.04 },
    high: { run: 0.13, '2019': 0.11, '2020': 0.11 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
}

export const EJ_DRINKING_SHARES_SLR: Record<string, ByClass> = {
  bau: {
    all: { run: 0.13, '2019': 0.11, '2020': 0.11 },
    moderate: { run: 0.15, '2019': 0.15, '2020': 0.08 },
    high: { run: 0.13, '2019': 0.1, '2020': 0.13 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  em: {
    all: { run: 0.11, '2019': 0.1, '2020': 0.1 },
    moderate: { run: 0.11, '2019': 0.11, '2020': 0.05 },
    high: { run: 0.13, '2019': 0.1, '2020': 0.12 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  ngw: {
    all: { run: 0.12, '2019': 0.1, '2020': 0.1 },
    moderate: { run: 0.12, '2019': 0.11, '2020': 0.06 },
    high: { run: 0.13, '2019': 0.1, '2020': 0.12 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  bf: {
    all: { run: 0.12, '2019': 0.1, '2020': 0.1 },
    moderate: { run: 0.1, '2019': 0.11, '2020': 0.05 },
    high: { run: 0.13, '2019': 0.11, '2020': 0.13 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  cor: {
    all: { run: 0.14, '2019': 0.12, '2020': 0.13 },
    moderate: { run: 0.16, '2019': 0.17, '2020': 0.1 },
    high: { run: 0.15, '2019': 0.12, '2020': 0.15 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
  tunnel: {
    all: { run: 0.15, '2019': 0.13, '2020': 0.14 },
    moderate: { run: 0.18, '2019': 0.18, '2020': 0.12 },
    high: { run: 0.15, '2019': 0.13, '2020': 0.15 },
    highest: { run: 0, '2019': 0, '2020': 0 },
  },
}
