# Breakout table

The table behind **Scenario ranking › By criterion** (`/scenarios/ranking/by-criterion`) and the
offline kiosk (`/pages/breakout`). Both are the same components; `embedded` (the site) lays the
controls out as a row above the table and lets the page scroll, the kiosk fits one screen with the
controls in a column.

## Changing words

Everything the table says is in **`model/labels.ts`**, in this order:

| Section                       | What it names                                                            |
| ----------------------------- | ------------------------------------------------------------------------ |
| `TEAM_TAKEAWAYS`              | The paragraph under "How the score is built", one per criterion          |
| `SCENARIO_LABELS`             | A scenario's name in the heads, chips and sentence                       |
| `SCENARIO_GROUPS`             | "Changes to landscape" / "Changes to water flow"                         |
| `PLACE_LABELS`                | A place's name on its tab and in the sentence                            |
| `PLACE_TRAYS`                 | Which place tabs sit together, and each group's heading                  |
| `MEASURE_LABELS`              | Score and measure row names (Landscape, Added wetland, …)                |
| `UI`                          | Headings, buttons, legend, empty-cell words ("Forthcoming", N/A)         |
| `CRITERION_DEFINITIONS`       | A criterion score's info card: its metrics and how they combine          |
| `METRIC_DEFINITIONS`          | A metric's info card: what, how computed, what is considered, how scored |
| `PERIOD_WHY`, `PERIOD_MONTHS` | The TIME PERIOD info card: why, and each period's months                 |
| `PLACE_WHY`                   | The PLACE info card, above the map                                       |
| `SCENARIO_TAKEAWAYS`          | A team's takeaway in a score cell's card                                 |

Criterion names on the tabs (Ecology, Recreation, …) are shared with the whole site: `TEAMS` in
`src/internal/rank-visualization/data.ts`.

## Changing layout and look

| File                         | What is in it                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `BreakoutPage.tsx`           | The page shell: criterion tabs, "How the score is built", takeaway, controls + table |
| `components/Rail.tsx`        | The controls: conditions, time period, place tabs and info card, scenario chips      |
| `components/TableHeader.tsx` | The sentence over the table, the Table/Map switch, the legend                        |
| `components/Matrix.tsx`      | The table: heads, score rows, measure rows, cells, bars, best-in-row dot             |
| `components/CellCards.tsx`   | Cards opened by a click: a cell's numbers (lookup), a score's definition (explainer) |
| `components/Explainer.tsx`   | The one info-card shell: heading, sections, pairs, the −5…+5 scale                   |
| `components/Maps.tsx`        | The map view                                                                         |
| `components/Pins.tsx`        | Pinned views and notes (hidden: `SHOW_PINS` in `BreakoutPage.tsx`)                   |
| `components/controls.tsx`    | Shared pieces: criterion tabs, pill switch (`Segmented`), scenario chip, group title |
| `styles.ts`                  | Shared styles: page padding, focus ring, popover card                                |

Sizes, row heights and widths are theme tokens under `ranking` in `src/theme/theme.ts`; text styles
are variants in `src/theme/typography.ts`.

## Data and behaviour (rarely edited)

| File                                              | What is in it                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `useBreakout.ts`                                  | State: which scenarios, place, period, open rows; the two scenario groups    |
| `model/cells.ts`                                  | What a cell holds: a value, its difference from baseline, or why it is empty |
| `model/mapModel.ts`                               | Which measures the map can draw, and how they group into tabs                |
| `model/rankingModel.ts`                           | Each criterion's rows: scores and the measures under them                    |
| `model/outflowModel.ts`, `model/outflowColumn.ts` | The +30% outflow column                                                      |
