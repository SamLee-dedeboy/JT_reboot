# Scenario Explorer

Interactive comparison of RMA scenarios, paired RMA/SCHISM output, and tiered-outflow SCHISM runs.

Append `?offline=1` to use the network-free exhibit basemap (`src/map/offlineBasemapStyle.ts`) instead of the online Mapbox Studio style. See the regional summary README for its data and rebuild steps.

## Provenance

Migrated on 2026-07-17 from the local project at `JT_exploration/RMA/EDA`. The source project was copied and left unchanged. The integration converts the React code to TypeScript, uses the JT website theme and route shell, and namespaces its runtime data.

Confirm the original code and dataset licensing before distributing this feature outside the project. Add the upstream repository, author, license, and source revision here when known.

## Data

The browser loads generated files from `public/data/scenario-explorer`. The internal route additionally exposes the full-range SCHISM comparison:

- `salinity_dashboard.json`
- `rma_schism_dashboard.json`
- `tiered_outflows_dashboard.json`
- `schism_runs_dashboard.json` (internal only)
- `d1641_schism.json` (internal only)

The source preprocessing utilities are retained in `scripts/scenario-explorer`. They may contain source-machine paths and should be reviewed before regenerating data.

## Sea-level-rise (SLR) scenarios

`slr_scenarios_dashboard.json` is generated alongside the live data but is not yet loaded by the UI. It keeps every `ScenarioDataset` field of `salinity_dashboard.json` and adds four delivered SLR runs.

```bash
python scripts/scenario-explorer/build_slr_scenarios_dashboard.py --slr-root <path to RMA/SLR_data>
```

`RMA_SLR_DATA_DIR` may be used in place of `--slr-root`. `RMA_DATA_DIR` (or `--current-data-dir`) points to the current-condition RMA data and defaults to the sibling `JT_exploration/RMA/data`. `SCENARIO_EXPLORER_OUTPUT_DIR` (or `--output-dir`) defaults to `public/data/scenario-explorer`.

Inputs:

- SLR: `raw/{baseline,bolster,ecomachine,newgreen}/ec-avg-avg/*_EC-AVG-AVG.csv`, five team files per run, from the September 2026 RMA SLR delivery (`SLR_EC.7z`, converted 2026-09-22). The instantaneous `ec/` files are not used.
- Current conditions: the live `salinity_dashboard.json` (stations, regions, dates, reference, and current offsets), plus `baseline`, `bolster`, `ecomachine`, and `newgreen` EC-AVG-AVG files under `RMA_DATA_DIR` for validation.

Representation:

- `referenceStationValues` is the current-condition BAU absolute daily EC, copied from the live file. The builder recomputes it from the raw baseline files and stops if any station-day differs.
- Every scenario value is an offset from that reference: `offset = scenario absolute − current BAU absolute`, and `absolute = reference + offset`. The current offsets (`bolster` … `tunnel`) are copied unchanged. The SLR keys are `baseline-slr`, `bolster-slr`, `ecomachine-slr`, and `newgreen-slr`. Two derived comparisons follow directly from this: SLR vs. current adaptation is `SLR offset − current offset`, and SLR B vs. SLR A is `B offset − A offset`.
- `baseline-slr` is the delivered SLR Base run. It is not the zero-valued synthetic `baseline` option in the UI.
- Each scenario carries `scenarioFamily`, `climateCondition` (`current` or `slr`), and `currentCounterpart`. `reserve-slr` and `tunnel-slr` are listed as unavailable under `slrAvailability` because they require reruns. They are never emitted as scenarios.
- Offsets are computed at full precision and rounded to two decimals when written. Region values are the mean of the available unrounded station offsets. Missing values are `null`.
- Station #247 and, in the EcoMach and NGW runs, #283 appear in more than one team file with different values. `DUPLICATE_RESOLUTION` in the builder uses the EJdef column for both, which is the same source the live dataset uses. Any other conflict in the SLR inputs stops the build. `provenance.inputFiles` records a SHA-256 hash for each input file.

`slr_scenarios_validation.json` reports input coverage, conflicts, distribution statistics, anomaly flags, date-alignment checks, and numerical identity checks. The builder exits non-zero if any check fails.

## D-1641 metrics for SLR scenarios

`d1641_rma_slr.json` uses the same `D1641Dataset` shape as `d1641_rma.json` and covers the four delivered SLR runs. `d1641_rma.json` is not modified.

```bash
python scripts/scenario-explorer/build_d1641_slr.py --processor <path to RMA/scripts/process_rma_d1641.py> --slr-root <path to RMA/SLR_data>
```

The environment variables `RMA_D1641_PROCESSOR`, `RMA_SLR_DATA_DIR`, `D1641_SLR_INTERMEDIATE_DIR`, and `D1641_SLR_OUTPUT` may be used in place of the flags. `RMA_DATA_DIR` (or `--station-data-dir`) supplies `all_point_stations_finalized.csv`.

- **Inputs:** `raw/{baseline,bolster,ecomachine,newgreen}/ec/*_EC.csv` from the SLR delivery. These are instantaneous EC files, five team files per run. D-1641 needs daily means built from exactly 96 valid 15-minute instantaneous samples per day, so the `ec-avg-avg/` files are never read.
- **Scenario keys:** `baseline` → `baseline-slr`, `bolster` → `bolster-slr`, `ecomachine` → `ecomachine-slr`, `newgreen` → `newgreen-slr`. SLR runs for Calling on Reserves and A Tunnel have not been delivered and are not emitted.
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
