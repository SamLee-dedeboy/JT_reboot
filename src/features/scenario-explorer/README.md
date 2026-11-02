# Scenario Explorer

Interactive salinity comparison. The public route (`/pages/scenario-explorer`) offers four modes: 01 Adaptation Scenario Comparison, 02 Alternative Delta Outflow, 03 Sea Level Rise Adaptation Scenario Comparison, and 04 Sea Level Rise vs. Current Comparison. The internal and D-1641 routes also offer the model and run comparisons.

Append `?map=offline` to switch every map on the site to the network-free exhibit mode (`?offline=1` remains a compatibility alias). See `src/map/offlineBasemapStyle.ts` and the regional summary README for its data and rebuild steps.

## Station spread

The Station spread control decides which stations count on each date: all of them, or those inside the central 90% or 50% of that date's values. The timeline's line, its shaded band, and the current average deviation all use that set (`summarizeSpread` in `format.ts`). The percent reading still divides by the whole region's base-scenario mean unless a lasso is active.

The station distribution's axis fits the same set, always including the baseline; stations beyond the axis are not drawn.

## Layout

The visualizations are the last thing to shrink. The timeline plot has a minimum height (`MIN_PLOT_HEIGHT`) and is redrawn at its measured size rather than scaled, so a short window scrolls the page and controls compact first.

Between the `lg` and `xl` breakpoints, `useCompactExplorer` in `explorerType.ts` switches to a condensed layout: the top row holds the color scale, the spread and legend stack beside a two-column overlay grid, and the date row holds the reading. Every other width keeps the full layout. In that range `explorerType.ts` also steps the explorer's text down to 16, 14, and 12px. Chart axis and data labels stop at 14px. The steps apply through CSS variables on the page root, so popovers and menus keep the site's sizes, and SVG text follows them too.

## Scenario annotations

In mode 01, the timeline shades the operating windows of the selected scenario (`scenarioAnnotations.ts`): Bolster & Fortify's gate closures, from `public/data/operations/bolster-and-fortify-gate-schedule.json`, and Calling on Reserves' potential higher outflow, which is inferred and comes from `src/features/regional-summary`. They are not drawn for sea level rise modes, where B&F's salinity-triggered gates would close on other dates.

## Map lasso

The lasso icon on the map lets people draw around stations in the selected region. Until it is cleared, the timeline, its shaded band, and the current average deviation use only those stations, with Station spread applied inside that set, and the station distribution highlights them against any other stations inside its axis. The percent reading divides by those stations' base-scenario mean. Changing the region or the comparison clears the lasso.

## Provenance

Migrated on 2026-07-17 from the local project at `JT_exploration/RMA/EDA`. The source project was copied and left unchanged. The integration converts the React code to TypeScript, uses the JT website theme and route shell, and namespaces its runtime data.

Confirm the original code and dataset licensing before distributing this feature outside the project. Add the upstream repository, author, license, and source revision here when known.

## Data

The browser loads generated files from `public/data/salinity/scenario-explorer`. The internal route additionally exposes the full-range SCHISM comparison:

- `salinity_dashboard.json`
- `rma_schism_dashboard.json`
- `tiered_outflows_dashboard.json`
- `schism_runs_dashboard.json` (internal only)
- `d1641_schism.json` (internal only)
- `rma_calsim_dashboard.json` (internal only; mode 07)
- `calsim_scenarios_dashboard.json` (internal only; mode 08)
- `d1641_calsim.json` and `d1641_calsim_source/` (internal only)

The source preprocessing utilities are retained in `scripts/scenario-explorer`. They may contain source-machine paths and should be reviewed before regenerating data.

## CalSim boundary-condition reruns

Internal modes 07 and 08 use the October 21, 2026 RMA11 reruns in
`JT_exploration/RMA/data/{baseline_calsim,reserve_calsim,tunnel_calsim}`. Mode 07 compares each
rerun with its original RMA counterpart. Mode 08 compares COR and TUN with `baseline_calsim`; it
does not use the older `reserve` or `tunnel` results as its scenario inputs.

```bash
python scripts/scenario-explorer/build_calsim_dashboards.py
python scripts/scenario-explorer/build_d1641_calsim.py \
  --processor ../JT_exploration/RMA/scripts/process_rma_d1641.py \
  --data-dir ../JT_exploration/RMA/data \
  --output-dir ../JT_exploration/RMA/derived/d1641_calsim_source \
  --json-output public/data/salinity/scenario-explorer/d1641_calsim.json
```

The dashboard builder reads the delivered `EC-AVG-AVG` files. The D-1641 builder reads the
instantaneous `EC` files, requires 96 valid 15-minute observations per complete day, writes all six
intermediate compliance tables, adds all-date display metrics, and assembles the runtime JSON.

## Sea-level-rise (SLR) scenarios

`slr_scenarios_dashboard.json` powers public modes 03 and 04. It keeps every `ScenarioDataset`
field of `salinity_dashboard.json` and includes both the original RMA-baseline family and the newer
CalSim-baseline COR/TUN family.

```bash
python scripts/scenario-explorer/build_slr_scenarios_dashboard.py --slr-root <path to RMA/SLR_data>
```

`RMA_SLR_DATA_DIR` may be used in place of `--slr-root`. `RMA_DATA_DIR` (or `--current-data-dir`) points to the current-condition RMA data and defaults to the sibling `JT_exploration/RMA/data`. `SCENARIO_EXPLORER_OUTPUT_DIR` (or `--output-dir`) defaults to `public/data/salinity/scenario-explorer`.

After that base build, update COR and TUN from the October 29, 2026 seven-scenario deliveries:

```bash
python scripts/scenario-explorer/update_cor_tun_dashboards.py
```

The updater defaults to `JT_exploration/RMA/EC_current_2018_2020_7scen` and
`JT_exploration/RMA/EC_SLR_2018_2020_7scen`; override them with `--current-root` and `--slr-root`.
It updates `salinity_dashboard.json` and `slr_scenarios_dashboard.json`. COR and TUN are always
represented relative to the matching `BaseCalSim` run. The UI consequently locks those scenarios
to `baseline-calsim` in public mode 01 and `baseline-calsim-slr` in public mode 03. Mode 01 shows
`baseline-calsim` only as that locked base, never as a choice or an overlay. Public mode 04
uses each scenario's current counterpart, so the common CalSim baseline cancels and the displayed
difference is SLR scenario minus current scenario.

Inputs:

- SLR: `raw/{baseline,bolster,ecomachine,newgreen}/ec-avg-avg/*_EC-AVG-AVG.csv`, five team files per run, from the September 2026 RMA SLR delivery (`SLR_EC.7z`, converted 2026-09-22). The instantaneous `ec/` files are not used.
- Current conditions: the live `salinity_dashboard.json` (stations, regions, dates, reference, and current offsets), plus `baseline`, `bolster`, `ecomachine`, and `newgreen` EC-AVG-AVG files under `RMA_DATA_DIR` for validation.

Representation:

- `referenceStationValues` is the current-condition BAU absolute daily EC, copied from the live file. The builder recomputes it from the raw baseline files and stops if any station-day differs.
- Original-family scenario values are offsets from the current RMA BAU reference. COR/TUN-family
  values use current `BaseCalSim` as their reference. The SLR keys additionally include
  `baseline-calsim-slr`, `reserve-slr`, and `tunnel-slr`. Within either family, SLR vs. current is
  `SLR offset − current offset`, and SLR B vs. SLR A is `B offset − A offset`.
- `baseline-slr` is the delivered SLR Base run. It is not the zero-valued synthetic `baseline` option in the UI.
- Each scenario carries `scenarioFamily`, `climateCondition` (`current` or `slr`), and, for SLR
  scenarios, `currentCounterpart`. `slrAvailability` now lists COR and TUN as delivered.
- Offsets are computed at full precision and rounded to two decimals when written. Region values are the mean of the available unrounded station offsets. Missing values are `null`.
- Station #247 and, in the EcoMach and NGW runs, #283 appear in more than one team file with different values. `DUPLICATE_RESOLUTION` in the builder uses the EJdef column for both, which is the same source the live dataset uses. Any other conflict in the SLR inputs stops the build. `provenance.inputFiles` records a SHA-256 hash for each input file.

`slr_scenarios_validation.json` reports input coverage, conflicts, distribution statistics, anomaly flags, date-alignment checks, and numerical identity checks. The builder exits non-zero if any check fails.

## D-1641 metrics for SLR scenarios

`d1641_rma_slr.json` uses the same `D1641Dataset` shape as `d1641_rma.json` and covers the four
original SLR runs. The seven-scenario update supplies EC-AVG-AVG explorer series only; it does not
yet add COR/TUN D-1641 compliance calculations. `d1641_rma.json` is not modified.

```bash
python scripts/scenario-explorer/build_d1641_slr.py --processor <path to RMA/scripts/process_rma_d1641.py> --slr-root <path to RMA/SLR_data>
```

The environment variables `RMA_D1641_PROCESSOR`, `RMA_SLR_DATA_DIR`, `D1641_SLR_INTERMEDIATE_DIR`, and `D1641_SLR_OUTPUT` may be used in place of the flags. `RMA_DATA_DIR` (or `--station-data-dir`) supplies `all_point_stations_finalized.csv`.

- **Inputs:** `raw/{baseline,bolster,ecomachine,newgreen}/ec/*_EC.csv` from the SLR delivery. These are instantaneous EC files, five team files per run. D-1641 needs daily means built from exactly 96 valid 15-minute instantaneous samples per day, so the `ec-avg-avg/` files are never read.
- **Scenario keys:** `baseline` → `baseline-slr`, `bolster` → `bolster-slr`, `ecomachine` →
  `ecomachine-slr`, `newgreen` → `newgreen-slr`. COR and TUN are absent from this D-1641 file
  because its pipeline has not yet processed the newer seven-scenario instantaneous-EC delivery.
- **Method:** the authoritative `process_rma_d1641.py` is loaded unchanged. Only its scenario list, file discovery, and output directory are redirected, so station identity, thresholds, windows, completeness rules, and exceedance semantics come from that file. All-date tooltip metrics come from `display_metric_rows` in `build_d1641_display_metrics.py`. Regulations are generated from the processor's threshold schedule. The JSON is assembled by a Python port of `build-d1641-data.mjs`, which the validator checks by rebuilding the live `d1641_rma.json` byte for byte.
- **Intermediate files:** the six `rma_d1641_*.csv` tables are written to `RMA/SLR_data/processed/d1641_rma_slr/`.
- **Final files:** `d1641_rma_slr.json` and `d1641_rma_slr_validation.json` in this directory.
- **Duplicate sources:** every occurrence of each D-1641 station across the five team files is recorded. In the SLR delivery all duplicates are byte-identical, so the first file by name is used. A conflicting duplicate stops the build unless it is listed in `DUPLICATE_RESOLUTION` in `build_slr_scenarios_dashboard.py`.
- **Validation:** 24 checks cover the required list plus cross-checks against the current-condition results (same station mapping, objective schedule, analysis dates, and high-tide treatment, and no reuse of current-condition data). The validation file also includes a QA table comparing current and SLR results. The builder exits non-zero if any check fails.
- **Known limitations:**
  - UNI and OLD are absent from every RMA export and are reported as not computable.
  - The five high-tide marsh objectives (CLL, NSL, BDL, SNC, VOL) are not computed.
  - SJR (Vernalis) is a prescribed inflow boundary, so its results are identical across the SLR runs and to their current-condition counterparts.
  - The processor dates the partial Nov 2020 WCI/DMC month as `2020-11-30`, marks it `insufficient_data`, and never judges it.
  - `rma_d1641_scenario_summary.csv` omits any scenario with zero exceedances.
