# Bolster and Fortify pattern and station-sensitivity analysis prompt

I want you to evaluate salinity patterns for the **Bolster and Fortify** scenario during each of the three periods when the Franks Tract gates are closed. For every region, the analysis must attempt to identify and report a pattern for each closure period rather than selecting only the single strongest pattern across the complete simulation.

## Scenario and baseline

- Scenario: Bolster and Fortify (`bolster`)
- Baseline: Business as Usual
- Difference definition: scenario EC minus baseline EC; positive is saltier and negative is fresher under Bolster and Fortify.

## Gate-closure periods

Analyze these three closure periods separately:

1. **Closure 1:** 2018-10-01 through 2019-01-13
2. **Closure 2:** 2019-11-26 through 2019-12-10
3. **Closure 3 (provisional):** approximately 2020-07-15 through 2020-11-29

The first two periods come from the existing B&F gate-event assumptions. Closure 3 is visually inferred from the supplied gate-operation plot and must be treated as provisional unless an exact operational time series is available. For inferred transitions, test date sensitivity at ±2 days. If an exact gate-operation source is found, use its transition dates and document the replacement.

Do not substitute the existing shortlisted salinity-response dates for the gate-closure dates. A qualifying response may begin after closure starts, end before reopening, or persist after reopening. Report that relationship explicitly.

## Regions and station sets

### 1. Franks Tract

- Proposed core stations: `263, 265, 270, 274, 276, 281, 282, 283, 285`
- Previously tested expansion stations: `291, 292`
- Complete reviewed 11-station set: `263, 265, 270, 274, 276, 281, 282, 283, 285, 291, 292`
- Existing displayed selection: the 9-station core.

For Franks Tract, preserve the core-nine result as the current presentation reference, but evaluate all three closure periods. Compare the 9-station core with the complete reviewed 11-station set and report whether adding stations 291 and 292 individually or together materially changes the interpretation.

### 2. North of Franks Tract

- Reviewed station set: `111, 115, 116, 117, 119, 120, 124, 127, 129, 133, 134, 265, 266, 301, 307, 309`

Treat this 16-station set as the proposed complete regional unit. Evaluate all three closure periods. Unless otherwise requested, do not search arbitrary subsets. At minimum, report station-level agreement and identify any recurring dissenting or influential stations that warrant a later targeted sensitivity test.

### 3. Freshwater Corridor

- Required core stations: `132, 291, 292, 293, 294, 295, 296, 297, 298, 299, 302, 303, 304, 306, 356`
- Questionable stations to test individually: `355, 357`
- Complete proposed set: `132, 291, 292, 293, 294, 295, 296, 297, 298, 299, 302, 303, 304, 306, 355, 356, 357`
- Authorized sensitivity variants:
  1. Core only — exclude 355 and 357.
  2. Core plus station 355 only.
  3. Core plus station 357 only.
  4. Complete proposed set — core plus stations 355 and 357.

Run the full station-membership sensitivity analysis specified below and recommend a final defensible station set. Evaluate the recommended set during all three closure periods.

### 4. Clifton Court Forebay

- Required core stations: `359, 360`
- Questionable station groups:
  - Group A: `284, 288`
  - Group B: `355, 357`
  - Group C: `358, 362, 363`
- Complete proposed set: `284, 288, 355, 357, 358, 359, 360, 362, 363`
- Authorized group-level sensitivity variants: test all `2^3 = 8` inclusion/exclusion combinations of Groups A, B, and C while always retaining core stations 359 and 360.
- Authorized station-level leave-one-out tests: from the complete proposed set, remove each questionable station individually (`284`, `288`, `355`, `357`, `358`, `362`, and `363`) to distinguish a group effect from the influence of one station.

Run the full station-membership sensitivity analysis specified below and recommend a final defensible station set. Evaluate the recommended set during all three closure periods.

## Questions the analysis must answer

For each region and each closure period:

1. Is the region saltier, fresher, mixed, or without a qualifying regional pattern relative to Business as Usual?
2. What qualifying episode or episodes occur within the closure?
3. Does a response begin before the closure, emerge after closure begins, end before reopening, or persist after reopening?
4. How strong, long, and spatially consistent is the response?
5. If no pattern meets the standard criteria, say so explicitly. Do not relax the criteria merely to force one pattern per closure.

The working hypothesis is that gate operation may produce distinct regional salinity responses during the three closures. This is a hypothesis to test, not a conclusion to assume. Use language such as “during the closure” or “gate-associated timing”; do not claim that the gate caused a response.

## Analysis definitions

For every station and date:

- Compare scenario EC against Business as Usual EC.
- Calculate absolute scenario EC, absolute baseline EC, EC difference, and percent difference.
- Apply the established mature 7-day rolling-average method.
- Keep intensity, duration, consistency, and direction as separate dimensions.

Use the established qualifying criteria:

- Absolute difference is at least 50 µS/cm **or** percent difference is at least 10%.
- At least 60% of available stations agree on direction.
- The median station difference has the same direction as the regional mean.
- A sustained episode contains at least 7 qualifying days.
- Apply the existing gap-bridging rule consistently.
- Report both calendar duration and qualifying-day count.

Do not apply D-1641-inspired thresholds. This is a scenario-versus-baseline regional pattern analysis, not a regulatory-compliance determination.

## Required station-set tests

For Freshwater Corridor and Clifton Court Forebay, and for any explicitly identified sensitivity stations in the finalized instructions, calculate:

1. The complete proposed station set.
2. Each authorized leave-one-out variant.
3. Each authorized inclusion/exclusion combination.
4. If computationally reasonable, all combinations of only the specifically authorized sensitivity stations while always retaining the required core stations.

Do not silently search arbitrary subsets of all stations. Use station-level differences first and aggregate afterward; do not infer station agreement from the regional mean alone.

For every station-set variant, report the included and excluded station IDs, number of stations, detected direction, episode boundaries, calendar and qualifying duration, baseline and scenario EC, average absolute and percent difference, median station difference, upper-end station difference, average and minimum station agreement, and agreeing/disagreeing station IDs.

Flag whether a membership change alters direction, causes a pattern to appear or disappear, splits or joins an episode, changes duration by more than 7 days or 20%, changes average EC difference by more than 20%, or changes agreement by more than 10 percentage points.

## Final recommendations and outputs

For each region, recommend:

1. The most defensible station set.
2. The most inclusive set that still supports a coherent regional interpretation.
3. Any reasonable alternative.
4. A “do not combine” result if a stable regional interpretation does not exist.

For each region × closure period, provide a concise display-ready finding, including an explicit “no qualifying pattern” result where applicable.

Save outputs under a new B&F three-closure analysis directory without overwriting curated interface files:

- `station_set_sensitivity.csv`
- `station_influence.csv`
- `recommended_station_sets.json`
- `regional_patterns.json`
- `regional_ec_series_7d.json`
- `sensitivity_summary.md`

Preserve all tested variants. Document the exact gate dates used, their provenance and uncertainty, methodology and thresholds, recommended station sets, sensitivity findings, and whether any station exclusion is based on geography, behavior, data quality, or merely narrative convenience.
