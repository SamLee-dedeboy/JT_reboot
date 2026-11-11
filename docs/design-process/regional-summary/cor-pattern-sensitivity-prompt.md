# Calling on Reserves regional-pattern and station-sensitivity analysis

I want you to run a reproducible regional salinity-pattern and station-membership sensitivity analysis for the **Calling on Reserves** scenario relative to **Business as Usual**.

Work in:

`D:/projects/JT_exploration/RMA/BDSC_regional_summary/internal/analysis/bdsc-preparation/`

Use the corrected salinity dashboard:

`D:/projects/JT_exploration/RMA/EDA/public/data/salinity_dashboard.json`

The scenario key is `reserve`; the baseline is `referenceStationValues`. Use the dashboard station indices exactly as supplied below. Do not use Tunnel and do not analyze the +30% Outflow SCHISM run in this task.

## Purpose

The analysis must answer two separate questions:

1. What coherent regional salinity responses occur during and after the inferred Calling on Reserves operating phases?
2. Are those interpretations stable when questionable stations or station groups are removed?

Do not assume that an operating phase causes a salinity response. Report timing as association only, and explicitly distinguish the inferred operating schedule from detected salinity-response periods.

## Inferred COR schedule and search windows

No authoritative daily reservoir-operation series has been located in the project. Treat the dates below as **inferred analysis windows**, derived from the scenario description and the broad timing shared by the prior discovery results. Preserve this uncertainty in every output.

Analyze these windows:

1. **Early water-year transition:** `2018-10-01` through `2019-03-05`
   - This broad window captures the early saltier-to-fresher transition seen in the prior exploratory scan.
   - Within it, detect coherent subperiods rather than averaging the entire window into one result.
2. **Reserve-building / reduced-downstream-release phase:** `2019-05-23` through `2019-12-20`
   - Prior discovery commonly found a sustained saltier response during this interval.
3. **Reserve-release / freshwater-response phase:** `2019-12-21` through `2020-01-27`
   - Prior discovery commonly found a fresher response beginning around December 24–25.
4. **Late dry-season response check:** `2020-08-01` through `2020-09-22`
   - Retain this as a separate check because several interior regions previously showed late-period freshening.

For every phase, also inspect:

- 30 days before the inferred phase;
- an immediate 14-day post-phase window;
- a delayed 31-day post-phase window; and
- the complete simulation timeline for any stronger qualifying pattern outside the inferred windows.

Report any lag from the inferred phase boundary to the detected salinity response. Do not silently clip a response at a schedule boundary.

## Regions and station-set variants

### 1. Lindsey–Cache Slough

Region ID: `lindsey_cache_slough`

The complete proposed set is the union of these five geographic groups:

- `group_A_calhoun_lindsey_hastings`: `[140, 141, 142, 145]`
- `group_B_lower_cache_liberty_prospect`: `[151, 154, 155, 156]`
- `group_C_cache_ulatis_haas_lookout`: `[143, 144, 146, 147, 148, 149, 150]`
- `group_D_transition_pair`: `[152, 153]`
- `group_E_extended_corridor`: `[187, 178, 175, 174, 172, 169, 168, 166, 159, 160, 162, 165]`

Run at minimum:

- the complete proposed set;
- one named variant removing each group in turn;
- leave-one-station-out variants for every station; and
- if computationally practical, all non-empty combinations of the five groups.

The five groups are not five alternative definitions. The complete set is the starting regional hypothesis; group-removal variants test whether one geographic segment controls or suppresses the interpretation.

The older 34-station exploratory Lindsey–Cache result is context only. Do not automatically carry its membership forward. Compare the new 28-station proposal against the old result and explain why the interpretation changes, if it does.

### 2. Sacramento River Corridor

Region ID: `sacramento_river_corridor`

Base proposed stations:

`[203, 188, 179, 163, 164, 161, 167, 170, 114, 118, 102, 104, 109, 110, 111]`

Questionable groups:

- `group_A_station_203`: `[203]`
- `group_B_sacramento_arm`: `[102, 104, 109, 110, 111]`
- `group_C_cache_connection`: `[151, 154, 155, 156]`

For this study, define the **complete proposed set** as the union of the base set and all questionable groups. This produces 19 unique stations. Then run:

- the complete 19-station set;
- the 15-station base set without the Cache-connection group;
- one named variant removing each questionable group from the complete set;
- variants removing every combination of the three questionable groups;
- leave-one-station-out variants for every station.

Pay special attention to overlap with Lindsey–Cache Slough. Do not reject a station merely because it appears in both regional hypotheses; instead report whether the overlapping Cache-connection group changes the Sacramento River Corridor interpretation.

### 3. Suisun Marsh

Reuse the current reviewed station hypothesis and sensitivity groups from:

- `suisun_marsh_config_ecomachine.json`
- `suisun_marsh_config_newgreen.json`

Use those files only for region membership, sensitivity-group definitions, thresholds, and methodology. Replace the scenario with `reserve` and use the COR analysis windows above. Do not include stations assigned exclusively to the standalone Montezuma Slough region if the revised configuration already excludes them.

### 4. Montezuma Slough

Reuse the current reviewed station hypothesis and sensitivity groups from:

- `montezuma_slough_config_ecomachine.json`
- `montezuma_slough_config_newgreen.json`

Replace the scenario with `reserve` and use the COR analysis windows above.

### 5. Suisun Bay

Reuse the current reviewed station hypothesis and sensitivity groups from:

- `suisun_bay_config_ecomachine.json`
- `suisun_bay_config_newgreen.json`

Replace the scenario with `reserve` and use the COR analysis windows above.

### 6. Confluence Zone

Reuse the current reviewed station hypothesis and sensitivity groups from:

- `confluence_config.json`
- `confluence_config_newgreen.json`

Replace the scenario with `reserve` and use the COR analysis windows above.

### 7. Central Delta

Region ID: `central_delta`

This region replaces the narrower Franks Tract concept for Calling on Reserves. It should represent the connected Franks Tract, Big Break, Dutch Slough, Mildred Island, Venice Island, and central San Joaquin/Middle River network—not merely the B&F intervention footprint.

Use these geographic groups:

- `group_A_franks_tract_core`: `[263, 265, 270, 274, 276, 281, 282, 283, 285]`
- `group_B_north_of_franks`: `[111, 115, 116, 117, 119, 120, 124, 127, 129, 133, 134, 265, 266, 301, 307, 309]`
- `group_C_big_break`: `[106, 107, 108, 112]`
- `group_D_dutch_slough`: `[257, 258, 259, 260, 262]`
- `group_E_bethel_rock_slough`: `[261, 263, 264, 267, 268, 269, 271, 272, 273, 275, 277]`
- `group_F_old_river_holland`: `[132, 286, 291, 292, 293, 294, 295, 296, 298, 300, 305]`
- `group_G_middle_river_venice`: `[301, 307, 308, 309, 315, 316, 317, 318, 321, 322, 324]`
- `group_H_jersey_point_false_river`: `[113, 121]`

Deduplicate stations that occur in more than one group. The complete proposed set is the union of all eight groups.

Run:

- the complete proposed set;
- one named variant removing each group in turn;
- leave-one-station-out variants for every unique station;
- a `franks_only` reference using Groups A and B;
- a `western_central_delta` reference using Groups A through F; and
- an `eastern_central_delta` comparison using Group G plus the overlapping San Joaquin stations from Group B.

Also test the following three unresolved geographic groups as **Central-versus-South assignment candidates**. They are not part of either recommended core until this sensitivity analysis is reviewed:

- `candidate_group_1_discovery_bay`: `[278, 279, 280, 289, 290]`
- `candidate_group_2_old_river_woodward`: `[297, 299, 302, 303, 304, 306, 356]`
- `candidate_group_3_middle_river`: `[311, 312, 314, 319]`

For each candidate group, compare at minimum:

- excluded from both Central Delta and South Delta;
- assigned to Central Delta only; and
- assigned to South Delta only.

Also run all eight combinations in which each of the three groups is assigned either to Central Delta or South Delta. Report whether the assignment changes direction, detected timing, station agreement, coverage, or the public interpretation in either region. Do not silently place a candidate group in both regions.

The purpose of the subregion comparisons is to determine whether “Central Delta” is a coherent public region or whether the west/Franks and east/Middle River portions tell materially different stories.

### 8. South Delta

Region ID: `south_delta`

Use the existing reviewed `ngw_component_002` station hypothesis as context, but test the revised Central/South boundary defined here. The proposed South Delta core is:

`[284, 288, 358, 359, 360, 362, 363, 364, 365, 366, 367, 368, 373, 374, 375, 377, 378, 380, 381, 383, 384, 390, 392, 393, 395, 396, 397, 398, 400, 401, 402, 406, 407, 410, 411, 413, 414, 416, 417, 418, 419]`

Station 359 was already present in the earlier South Delta core and remains included. Stations 284 and 288 are now assigned to South Delta rather than boundary review. Station 412 moves from the earlier core into the first questionable group so its influence can be tested with the connected San Joaquin/Stockton transition stations.

Test these questionable groups:

- `group_A_stockton_san_joaquin_transition`: `[344, 347, 350, 353, 412]`
- `group_B_tom_paine_slough`: `[385, 389, 394, 399, 408, 409]`

Run:

- the 41-station proposed South Delta core;
- core plus Group A;
- core plus Group B;
- core plus both questionable groups;
- one variant removing each questionable group from the complete set;
- leave-one-station-out variants for the complete set.

Interpret the questionable-group variants explicitly:

- Group A spans the Stockton/San Joaquin transition and intentionally includes station 412, which was formerly treated as unambiguous South Delta. Test the five stations as one geographic unit and also run leave-one-out checks.
- Group B is the Tom Paine Slough cluster. Test whether it behaves coherently with the larger South Delta or forms a distinct local response.
- Recommend the narrower 41-station core if adding either questionable group changes direction, suppresses a coherent pattern, or merges distinct timing regimes.
- Recommend a broader South Delta only if direction, timing, and public interpretation remain stable.

For the public geography, use this provisional narrative cutoff: **Central Delta ends with the Franks–Mildred–Venice network; South Delta begins with the Old River/Middle River export network around Coney Island, Victoria Canal, and Union Point.** Treat this as a hypothesis to test, not an authoritative legal or regulatory boundary.

### 9. San Joaquin River Corridor

Region ID: `san_joaquin_river_corridor`

Core stations:

`[425, 423, 424, 421, 420, 418, 419, 413]`

Treat this as a separate longitudinal river-corridor hypothesis. Overlap with South Delta at stations 413, 418, and 419 is intentional and must not be removed merely because the stations occur in both public-region hypotheses.

Run:

- the complete eight-station core;
- leave-one-station-out variants for every station;
- an upstream segment `[425, 423, 424, 421, 420]`;
- a downstream/head-of-Old-River segment `[418, 419, 413]`; and
- a segment-removal comparison excluding each segment in turn.

Report whether the upstream and downstream segments share direction and timing. If they do not, flag the corridor as internally heterogeneous rather than forcing a single public pattern.

## Required method

Use the existing reusable analysis modules where possible:

- `confluence_data.py`
- `confluence_sensitivity.py`
- `run_confluence_analysis.py`
- `run_regional_sweep.py`

Do not overwrite the Eco Machine or New Green Watershed results. Create COR-specific configuration and output files.

Use the established screening rules unless a current reviewed config contains a documented region-specific override:

- regional statistic: mean station EC;
- smoothing windows: 1, 7, 14, and 30 days;
- representative public result: 7-day smoothing;
- minimum displayed duration: 7 days;
- absolute EC-difference threshold: 50 µS/cm;
- percent-difference threshold: 10%;
- threshold operator: absolute **or** percent;
- minimum directional station agreement: 60%;
- minimum paired-station coverage: 70%;
- mean and median must agree in direction;
- use interruption tolerance consistent with the existing scripts.

For low-EC regions, retain the existing denominator-floor sensitivity check. Report when a pattern qualifies only because of the percent criterion at a low baseline EC.

## Comparisons to preserve

The earlier exploratory scan reported these unapproved COR candidates. Use them as comparison targets, not as answers:

- Lindsey–Cache Slough: fresher, `2019-12-04` to `2020-06-01`;
- Suisun Marsh: saltier, approximately `2019-07-31` to `2019-12-19`, followed by fresher conditions around `2019-12-24` to `2020-01-22`;
- Suisun Bay: saltier, approximately `2019-08-01` to `2019-12-14`, followed by fresher conditions around `2019-01-05` to `2019-01-25` in the older full-timeline scan;
- Montezuma Slough/eastern-marsh legacy cluster: saltier, approximately `2019-05-23` to `2019-12-19`, followed by fresher conditions around `2019-12-25` to `2020-01-23`.

The old dates came from different provisional memberships. The new analysis must determine whether they remain valid under the reviewed regional definitions.

## Required outputs

Create a new directory:

`cor-regional-sensitivity/`

Write:

1. `cor_config.json`
   - scenario, inferred schedule, uncertainty statement, thresholds, and every region/group definition.
2. `station_set_sensitivity.csv`
   - one row per region × schedule phase × station-set variant.
3. `station_influence.csv`
   - leave-one-out effects and group-removal effects.
4. `regional_patterns.json`
   - complete structured results for all tested variants and periods.
5. `regional_ec_series_7d.json`
   - date, baseline regional EC, COR regional EC, difference, and qualification status for every named variant.
6. `recommended_station_sets.json`
   - recommended membership by region, with explicit inclusion/exclusion reasoning.
7. `sensitivity_summary.md`
   - concise human-readable findings and decisions still requiring review.
8. `public_pattern_candidates.csv`
   - only the strongest defensible patterns that you recommend for human approval; do not modify `approved_patterns.csv`.

## Reporting requirements

For each region and inferred phase, report:

- whether a qualifying pattern exists;
- saltier or fresher direction;
- detected start and end dates;
- lag relative to the inferred schedule;
- baseline EC, scenario EC, absolute difference, and percent difference;
- qualifying-day count and calendar duration;
- station count, agreement, and coverage;
- agreeing, disagreeing, and insufficient-data station IDs;
- whether the result survives each group-removal and leave-one-out test;
- whether mean, median, and maximum tell materially different stories;
- whether the complete-timeline scan found a stronger pattern outside the inferred window.

Recommend a station set only when the regional interpretation is stable. Flag a region as internally heterogeneous when removing a geographic group changes direction, removes the pattern, shifts its timing materially, or changes magnitude enough to alter the public interpretation.

Do not update the application, curated pattern list, or approval ledger. Finish by telling me which exact candidates you recommend approving and which should remain sensitivity-only.
