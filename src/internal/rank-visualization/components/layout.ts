// Shared chart geometry so every design lines up the same way. Widths and
// heights are px; gaps are MUI spacing multipliers.

/** Every card uses the same minimum width, so switching tabs doesn't resize it. */
export const CARD_WIDTH = 960
/** Scenario-name column (rank + name + ▲▼ or the 1A expand arrow). */
export const LABEL_COLUMN = 210
/** Trailing score column. */
export const VALUE_COLUMN = 60
/** Height of a −5…+5 track row. */
export const TRACK_HEIGHT = 28
/** Height of the overall-score bar drawn on a track. */
export const MARKER_HEIGHT = 22
/** Gap between label, track and value columns. */
export const COLUMN_GAP = 1.75
/** Gap between track rows. */
export const ROW_GAP = 0.75

/** label | track | value — the standard row for track-based designs. */
export const trackColumns = (valueWidth = VALUE_COLUMN) =>
  `${LABEL_COLUMN}px minmax(0, 1fr) ${valueWidth}px`
