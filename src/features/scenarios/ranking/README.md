# Scenario ranking

The views behind **Scenario ranking** (`/scenarios/ranking`): **By scenario**
(`ByScenarioRankings.tsx`) and **By criterion** (`/scenarios/ranking/by-criterion`, under
`criterion-table/`). The By criterion table also runs as an offline kiosk at `/pages/breakout`.
Both are the same components; `embedded` (the site) lays the controls out as a row above the table
and lets the page scroll, while the kiosk fits one screen with the controls in a column.

This folder is standalone: nothing in it imports from `src/internal/`.

## Changing numbers and team text: `data/`

There is one file per criterion: `ecology.ts`, `recreation.ts`, `environmentalJustice.ts`,
`economy.ts` and `ecoCultural.ts`. Every file has the same shape (`data/types.ts`):

| Field                | What it holds                                                                      |
| -------------------- | ---------------------------------------------------------------------------------- |
| `text`               | Criterion takeaway, caveats, the score's info card, period/place info, place names |
| `rows`               | The adaptation table's rows: names, units, notes, sources, each metric's info card |
| `outflowRows`        | The same for the tiered outflow table                                              |
| `current`            | Today's climate, by scenario (`bau`, `em`, `ngw`, …, `hist`, `more`, `less`)       |
| `seaLevelRise`       | The same with sea level rise, or `'sameAsCurrent'`                                 |
| `seaLevelRiseStatus` | `'pending'` shows the "results not in yet" notice                                  |

Under each scenario, values are keyed by row id:

| Field                               | What it holds                                                        |
| ----------------------------------- | -------------------------------------------------------------------- |
| `takeaway`                          | The takeaway in a score cell's card: a lead, then labelled points    |
| `scores`                            | −5…+5 scores                                                         |
| `measures`                          | Measured values; a number, `null`, or `{ place: { period: value } }` |
| `ranks`, `steps`                    | Ranks, and the arrows drawn beside a cell                            |
| `conditionsMet`                     | Which condition rows this scenario puts in place                     |
| `wetlandLevels`, `wetlandTakeaways` | New Green Watershed only: the 25% and 100% wetland variants          |

Baselines (`bau`, `csbau`, `hist`) hold absolute measures only. Their scores are 0 by definition;
`model/tables.ts` fills them in, so do not write them.

Criterion names and colors on the tabs (Ecology, Recreation, …) are in `model/teams.ts`.

## Changing general words: `tableText.ts`

| Section           | What it names                                                    |
| ----------------- | ---------------------------------------------------------------- |
| `scenarioName`    | A scenario's name in the table (wording: `src/content/names.ts`) |
| `SCENARIO_GROUPS` | "Changes to landscape" / "Changes to water flow"                 |
| `PLACE_TRAYS`     | Which place tabs sit together, and each group's heading          |
| `UI`              | Headings, buttons, legend, empty-cell words ("Forthcoming", N/A) |
| `PERIOD_MONTHS`   | Each period's months in the TIME PERIOD info card                |

## Changing layout and look: `criterion-table/`

| File                         | What is in it                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `CriterionTablePage.tsx`     | The page shell: criterion tabs, takeaway + caveats, heading, controls + table        |
| `components/Rail.tsx`        | The controls: conditions, time period, place tabs and info card, scenario chips      |
| `components/TableHeader.tsx` | The sentence over the table, the Table/Map switch, the legend                        |
| `components/Matrix.tsx`      | The table: heads, score rows, measure rows, cells, bars, best-in-row dot             |
| `components/CellCards.tsx`   | Cards opened by a click: a cell's numbers (lookup), a score's definition (explainer) |
| `components/Explainer.tsx`   | The one info-card shell: heading, sections, pairs, the −5…+5 scale                   |
| `components/Maps.tsx`        | The map view                                                                         |
| `components/Pins.tsx`        | Pinned views and notes (hidden: `SHOW_PINS` in `CriterionTablePage.tsx`)             |
| `components/controls.tsx`    | Shared pieces: criterion tabs, scenario chip, measure row, group title               |
| `styles.ts`                  | Shared styles: page padding, popover card                                            |

The pill switch (`Segmented`) and focus ring are site-wide, in `src/ui/`. Sizes, row heights and
widths are theme tokens under `ranking` in `src/theme/theme.ts`; text styles are variants in
`src/theme/typography.ts`.

## Behaviour (rarely edited)

| File                                   | What is in it                                                                |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `criterion-table/useCriterionTable.ts` | State: which scenarios, place, period, open rows; the two scenario groups    |
| `model/tables.ts`                      | Builds both tables from `data/`, fills baseline zeros, adds the +30% column  |
| `model/criteria.ts`                    | The row model (`CriterionNode`) and scenario keys                            |
| `model/cells.ts`, `model/cellValue.ts` | What a cell holds: a value, its difference from baseline, or why it is empty |
| `model/mapModel.ts`                    | Which measures the map can draw, and how they group into tabs                |
| `model/scenarioScores.ts`              | Each scenario's criterion scores, for By scenario                            |
| `regions/`                             | Region shapes, keys, labels and legends for the map views                    |
