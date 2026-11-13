// The ranking charts' score scale (−5 to +5) and how they write ranks and missing scores.

/** Ordinal ranks (1st, 2nd…), kept apart from the 01/02 numbering used elsewhere on the site. */
export const rankLabel = (rank: number) => `${rank}${['th', 'st', 'nd', 'rd'][rank] ?? 'th'}`

/** Rank and score text for a scenario no criterion has scored yet. */
export const UNRANKED = '—'

export const SCORE_MIN = -5

export const SCORE_MAX = 5

export const scorePosition = (score: number) =>
  `${((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100}%`

/** Every whole point on the track, −5…+5: a gridline and a label each. */
export const TICKS = Array.from({ length: SCORE_MAX - SCORE_MIN + 1 }, (_, i) => SCORE_MIN + i)

export const NOT_SCORED = 'Forthcoming'

/** What a score of zero means by default; a chart on another baseline names its own. */
export const TODAY = 'today'
