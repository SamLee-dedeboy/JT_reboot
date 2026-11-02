// The Env Justice tab of the ranking table workbook (Nov 2026): drinking-water scores
// and shares of readings over 1,050 µS/cm by vulnerability class. The team's `wet` and
// `dry` tables are water years 2019 and 2020, kept under the wet and dry tabs.
//
// Two values are not in the sheet. Business as Usual's shares follow from the scores
// (one point per percentage point; with sea level rise they are "SLR COMM.xlsx", kept
// at its four places where the sheet rounds them). `csbau` is 0: Calling on Reserves
// and A Tunnel show their own shares rather than a difference.
type ByClass = Record<string, Record<string, number>>

export const EJ_DRINKING_SCORES: Record<string, ByClass> = {
  bau: {
    all: { run: 0, wet: 0, dry: 0 },
    moderate: { run: 0, wet: 0, dry: 0 },
    high: { run: 0, wet: 0, dry: 0 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  em: {
    all: { run: 2, wet: 1, dry: 1 },
    moderate: { run: 2, wet: 3, dry: 1 },
    high: { run: 2, wet: 1, dry: 2 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  ngw: {
    all: { run: 2, wet: 1, dry: 1 },
    moderate: { run: 2, wet: 3, dry: 1 },
    high: { run: 2, wet: 1, dry: 1 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  bf: {
    all: { run: 0, wet: -1, dry: 1 },
    moderate: { run: 1, wet: 1, dry: 1 },
    high: { run: 0, wet: -1, dry: 0 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  cor: {
    all: { run: 0, wet: 0, dry: 2 },
    moderate: { run: 0, wet: 0, dry: 1 },
    high: { run: 1, wet: 0, dry: 1 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  tunnel: {
    all: { run: 0, wet: 0, dry: 0 },
    moderate: { run: 1, wet: 3, dry: -1 },
    high: { run: -1, wet: -1, dry: 0 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
}

export const EJ_DRINKING_SCORES_SLR: Record<string, ByClass> = {
  bau: {
    all: { run: 0, wet: 0, dry: 0 },
    moderate: { run: 0, wet: 0, dry: 0 },
    high: { run: 0, wet: 0, dry: 0 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  em: {
    all: { run: 2, wet: 1, dry: 1 },
    moderate: { run: 4, wet: 4, dry: 3 },
    high: { run: 0, wet: 0, dry: 1 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  ngw: {
    all: { run: 1, wet: 1, dry: 1 },
    moderate: { run: 3, wet: 4, dry: 2 },
    high: { run: 0, wet: 0, dry: 1 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  bf: {
    all: { run: 1, wet: 1, dry: 1 },
    moderate: { run: 5, wet: 4, dry: 3 },
    high: { run: 0, wet: -1, dry: 0 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  cor: {
    all: { run: 1, wet: 0, dry: 2 },
    moderate: { run: 2, wet: 0, dry: 3 },
    high: { run: 0, wet: 0, dry: 1 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  tunnel: {
    all: { run: 0, wet: -1, dry: 1 },
    moderate: { run: 0, wet: -1, dry: 1 },
    high: { run: 0, wet: -1, dry: 1 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
}

export const EJ_DRINKING_SHARES: Record<string, ByClass> = {
  bau: {
    all: { run: 0.09, wet: 0.06, dry: 0.08 },
    moderate: { run: 0.06, wet: 0.06, dry: 0.03 },
    high: { run: 0.1, wet: 0.07, dry: 0.1 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  em: {
    all: { run: 0.07, wet: 0.05, dry: 0.07 },
    moderate: { run: 0.04, wet: 0.03, dry: 0.02 },
    high: { run: 0.08, wet: 0.06, dry: 0.08 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  ngw: {
    all: { run: 0.07, wet: 0.05, dry: 0.07 },
    moderate: { run: 0.04, wet: 0.03, dry: 0.02 },
    high: { run: 0.08, wet: 0.06, dry: 0.09 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  bf: {
    all: { run: 0.09, wet: 0.07, dry: 0.07 },
    moderate: { run: 0.05, wet: 0.05, dry: 0.02 },
    high: { run: 0.1, wet: 0.08, dry: 0.1 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  cor: {
    all: { run: 0.11, wet: 0.1, dry: 0.07 },
    moderate: { run: 0.11, wet: 0.14, dry: 0.02 },
    high: { run: 0.11, wet: 0.1, dry: 0.1 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  tunnel: {
    all: { run: 0.11, wet: 0.1, dry: 0.09 },
    moderate: { run: 0.1, wet: 0.11, dry: 0.04 },
    high: { run: 0.13, wet: 0.11, dry: 0.11 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  csbau: {
    all: { run: 0, wet: 0, dry: 0 },
    moderate: { run: 0, wet: 0, dry: 0 },
    high: { run: 0, wet: 0, dry: 0 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
}

export const EJ_DRINKING_SHARES_SLR: Record<string, ByClass> = {
  bau: {
    all: { run: 0.126, wet: 0.1076, dry: 0.1103 },
    moderate: { run: 0.1455, wet: 0.1515, dry: 0.0795 },
    high: { run: 0.131, wet: 0.1043, dry: 0.1281 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  em: {
    all: { run: 0.1149, wet: 0.0986, dry: 0.0964 },
    moderate: { run: 0.1122, wet: 0.1126, dry: 0.0522 },
    high: { run: 0.1252, wet: 0.103, dry: 0.1167 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  ngw: {
    all: { run: 0.1158, wet: 0.098, dry: 0.098 },
    moderate: { run: 0.1161, wet: 0.1107, dry: 0.0585 },
    high: { run: 0.1253, wet: 0.1026, dry: 0.1172 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  bf: {
    all: { run: 0.1175, wet: 0.1009, dry: 0.1046 },
    moderate: { run: 0.0967, wet: 0.1055, dry: 0.053 },
    high: { run: 0.1331, wet: 0.1081, dry: 0.1276 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  cor: {
    all: { run: 0.14, wet: 0.12, dry: 0.13 },
    moderate: { run: 0.16, wet: 0.17, dry: 0.1 },
    high: { run: 0.15, wet: 0.12, dry: 0.15 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  tunnel: {
    all: { run: 0.15, wet: 0.13, dry: 0.14 },
    moderate: { run: 0.18, wet: 0.18, dry: 0.12 },
    high: { run: 0.15, wet: 0.13, dry: 0.15 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
  csbau: {
    all: { run: 0, wet: 0, dry: 0 },
    moderate: { run: 0, wet: 0, dry: 0 },
    high: { run: 0, wet: 0, dry: 0 },
    highest: { run: 0, wet: 0, dry: 0 },
  },
}
