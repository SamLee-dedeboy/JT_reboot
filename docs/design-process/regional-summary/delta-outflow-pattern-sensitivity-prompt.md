# +30% Delta Outflow regional-pattern and station-sensitivity analysis

Run a reproducible regional salinity-pattern and station-membership sensitivity analysis for the **+30% Delta Outflow** SCHISM scenario.

Work in:

`D:/projects/JT_exploration/RMA/BDSC_regional_summary/`

This task starts from the station mapping I reviewed in the station-mapping tool. **Do not create, revise, infer, or validate polygons.** Polygon work is out of scope.

## Comparison and source data

Compare:

- scenario: **Run 16, +30% Outflow**;
- baseline: **Run 15, Reference Outflow**; and
- difference: `Run 16 EC - Run 15 EC`, where positive is saltier and negative is fresher under +30% Outflow.

Before running the analysis, verify those labels in:

`D:/projects/JT_exploration/RMA/EDA/public/data/tiered_outflows_dashboard.json`

Record the verified run keys, labels, source paths, date range, and analysis timestamp in the output configuration. If the source no longer identifies Run 16 as +30% Outflow and Run 15 as Reference Outflow, stop and report the discrepancy rather than guessing.

The existing SCHISM comparison configuration is here:

`internal/analysis/schism_run_comparison/schism_config.json`

Reuse its input paths and mature analysis conventions where applicable, but do not overwrite its configuration or results.

## Authoritative station mapping

Use this reviewed export as the **only authority for regional membership**:

`internal/mapping/delta_outflow_station_review/delta_outflow_station_membership.json`

Also inspect these validation aids before analysis:

- `internal/mapping/delta_outflow_station_review/mapping_validation.json`
- `internal/mapping/delta_outflow_station_review/overlap_report.csv`
- `internal/mapping/delta_outflow_station_review/unassigned_stations.csv`

Use `schism_station_index` values, which are the 1-based SCHISM `station.in` order. Never substitute RMA station numbers.

At startup, assert that:

- the mapping has 405 unique station indices covering `1..405`;
- the mapping validation has no failures;
- each region's core, questionable, excluded, and removed memberships are internally disjoint; and
- every requested station index exists in the scenario and baseline data.

If an assertion fails, stop with a precise error. Do not repair the mapping silently.

## Regions

Analyze all nine reviewed regions, in this order:

1. Suisun Marsh
2. Montezuma Slough
3. Suisun Bay
4. Confluence Zone
5. Sacramento River Corridor
6. Lindsey–Cache Slough
7. Central Delta
8. Southern Delta
9. San Joaquin River Corridor

Read each core set directly from `regions.<region_id>.core_station_indices` in the mapping JSON. Do not copy memberships from older RMA/COR/NGW/Eco Machine configurations.

Treat `excluded_station_indices` and `removed_station_indices` as excluded from every analysis variant. Do not restore them during leave-one-out, group, or completeness tests.

Cross-region station overlap is intentional. Analyze every region independently and do not globally deduplicate shared stations. In the interpretation, note that overlapping regions are not statistically independent evidence.

## Questionable-station variants

Use the mapping JSON for the current questionable memberships and verify that it matches the following review structure:

- **Confluence Zone:** test stations `20` and `282` independently and together, in addition to core-only.
- **Sacramento River Corridor:** test station `282` in addition to core-only.
- **Central Delta:** test station `20` in addition to core-only.
- **Southern Delta:** test these geographic groups:
  - `discovery_bay`: `[7, 328, 340]`
  - `old_river_woodward`: `[19, 32, 104, 304, 305, 306, 373]`
  - `middle_river`: `[99, 153, 358]`
  - `manual_review_96`: `[96]`
  - `manual_review_344`: `[344]`

For Southern Delta, run core-only, core plus each group individually, core plus all groups, and all `2^5 = 32` group-inclusion combinations. The two individual manual-review stations must remain separately identifiable rather than being merged into one group.

For every other region with no questionable membership, use the reviewed core without inventing expansion stations.

If the saved mapping differs from the structure above, treat the saved mapping as authoritative but document the discrepancy prominently in the summary.

## Required analysis

Analyze the complete overlapping date range of Run 15 and Run 16. Do not restrict discovery to a preselected season or retain only the single strongest result.

For every station and date, calculate:

- baseline EC;
- +30% Outflow EC;
- absolute difference;
- percent difference; and
- paired-data availability.

For every region and station-set variant, calculate regional mean and median series with smoothing windows of 1, 7, 14, and 30 days. Use the 7-day series as the primary public-facing result.

Use the existing SCHISM screening conventions unless the source configuration documents a stricter rule:

- absolute EC-difference threshold: `50 µS/cm`;
- percent-difference threshold: `10%`;
- qualification: absolute **or** percent threshold;
- minimum directional station agreement: `60%`;
- minimum paired-station coverage: `70%`;
- mean and median must agree in direction;
- primary minimum episode duration: 7 qualifying days;
- test minimum durations of 1, 7, and 14 days;
- allow at most the existing one-day interruption rule without changing direction; and
- retain the existing denominator-floor sensitivity check for percent differences at low baseline EC.

Detect and preserve **all qualifying coherent saltier and fresher episodes** across the full timeline. Merge or split episodes only according to explicit, reproducible gap rules. Report when an episode qualifies only through the percent criterion at a low baseline.

Also summarize the chronology by month and water year so we can see whether a region changes direction over time. Do not claim that increased outflow caused a response; describe scenario association and timing.

## Sensitivity tests

For every region:

1. Run the reviewed core set.
2. Run every authorized questionable-group combination described above.
3. Run leave-one-station-out tests on the core set.
4. Report station influence on direction, episode timing, magnitude, agreement, and coverage.
5. Compare mean, median, and upper-end station behavior so localized extremes are not hidden by the regional average.

### Co-located stations

The mapping intentionally preserves multiple SCHISM indices at some physical locations. Keep the station-index analysis as the primary result, but add a second weighting sensitivity in which stations with identical coordinates are collapsed to one equally weighted physical site before regional aggregation.

Do not delete or renumber any station. Report:

- the co-located groups used;
- index-weighted and site-weighted results side by side; and
- whether site weighting changes direction, creates/removes an episode, shifts a boundary by more than 7 days, changes average magnitude by more than 20%, or changes agreement by more than 10 percentage points.

## Robustness and recommendation rules

Call a candidate **robust** only when its direction and practical interpretation survive:

- core leave-one-out tests;
- relevant questionable-group variants;
- index-weighted versus co-located-site-weighted aggregation;
- 7-day versus 14-day smoothing; and
- reasonable mean-versus-median comparison.

Flag a candidate as sensitivity-only if membership or weighting changes its direction, makes it appear or disappear, shifts timing materially, or changes magnitude enough to alter the public story. It is acceptable to report no qualifying regional pattern.

Assign stable candidate IDs in chronological order using these prefixes:

- `OUTFLOW-SM-##` — Suisun Marsh
- `OUTFLOW-MS-##` — Montezuma Slough
- `OUTFLOW-SB-##` — Suisun Bay
- `OUTFLOW-CZ-##` — Confluence Zone
- `OUTFLOW-SRC-##` — Sacramento River Corridor
- `OUTFLOW-LCS-##` — Lindsey–Cache Slough
- `OUTFLOW-CD-##` — Central Delta
- `OUTFLOW-SD-##` — Southern Delta
- `OUTFLOW-SJRC-##` — San Joaquin River Corridor

IDs must remain attached to the same region, direction, and episode dates throughout all output files.

## Output directory and files

Create a new directory without overwriting existing work:

`internal/analysis/delta_outflow_regional_sensitivity/`

Write at minimum:

1. `analysis_config.json` — verified run metadata, source paths, thresholds, date range, region order, exact station-set variants, and mapping revision.
2. `regional_daily_statistics.csv` — daily baseline/scenario EC, difference, percent difference, agreement, coverage, smoothing window, region, and variant.
3. `regional_patterns.json` — every qualifying episode for every tested variant, not merely the strongest.
4. `pattern_candidates.csv` — one row per stable candidate ID and variant, with dates, direction, magnitude, agreement, coverage, and robustness fields.
5. `station_set_sensitivity.csv` — comparison of core and questionable-group variants.
6. `station_influence.csv` — leave-one-out effects for every core station.
7. `colocated_station_sensitivity.csv` — index-weighted versus physical-site-weighted results.
8. `regional_ec_series_7d.json` — plot-ready 7-day baseline, scenario, difference, agreement, coverage, and qualification series.
9. `recommended_station_sets.json` — recommended memberships and explicit reasoning, without changing the reviewed mapping.
10. `validation_report.json` — input, index, membership, row-count, date-range, and output consistency checks.
11. `sensitivity_summary.md` — concise findings, strongest defensible candidates, fragile results, and decisions requiring human review.

For each reported episode include:

- candidate ID;
- region and station-set variant;
- saltier or fresher direction;
- start and end dates;
- calendar duration and qualifying-day count;
- baseline EC, scenario EC, absolute difference, and percent difference;
- station count, agreement, and coverage;
- agreeing, disagreeing, and insufficient-data station indices;
- smoothing and duration settings;
- whether it survives leave-one-out, group, and co-location tests;
- whether it is robust, sensitivity-only, or rejected; and
- a short display-ready interpretation that avoids causal claims.

## Guardrails

- Do not do any polygon work.
- Do not modify the station-mapping export or its review state.
- Do not change `approved_patterns.csv`, curated application data, or the JT_reboot interface.
- Do not overwrite prior SCHISM, COR, NGW, Eco Machine, or B&F analyses.
- Do not promote candidates automatically.
- Do not hide null, mixed, fragile, or non-qualifying results.
- Preserve scripts and configuration needed to reproduce the run.

Finish by reporting:

1. which exact candidate IDs you recommend for human approval;
2. which candidates should remain sensitivity-only and why;
3. the recommended station set for each region;
4. any region that is internally heterogeneous or lacks a defensible pattern; and
5. the exact commands needed to reproduce the analysis.
