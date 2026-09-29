# Bolster & Fortify three-closure pattern and station-sensitivity analysis

**Status:** Exploratory gate-associated timing analysis. Not a regulatory compliance
determination. Language describes timing association only ("during the closure",
"gate-associated timing") — this analysis does not claim the gate caused any response.

**Scenario:** Bolster & Fortify vs. Business as Usual. **Regions:** Franks Tract, North Franks
Tract, Freshwater Corridor, Clifton Court Forebay. **Methodology reused unchanged** from
`JT_exploration/RMA/BDSC_regional_summary/internal/analysis/methodology_pilot` (mature 7-day
rolling average, direction-locked calendar-continuity episode detection with 1-day gap-bridging,
persistent-condition/strongest-subperiod reduction) via the same generic engine already built and
used for `JT_exploration`'s own station-set sensitivity studies
(`internal/analysis/bdsc-preparation/confluence_sensitivity.py`, imported cross-project — both are
local sibling directories). Qualifying criteria used exactly as specified, not relaxed: ≥50 µS/cm
or ≥10% difference, ≥60% station agreement, median station difference same direction as the mean,
≥7 qualifying days, existing 1-day gap-bridging rule. No D-1641 thresholds applied.

## Gate-closure dates: provenance and uncertainty

| Closure | Dates used | Provenance | Shiftable |
|---|---|---|---|
| 1 (long) | 2018-10-01 → 2019-01-13 | `bf_gate_event_scan/gate_event_assumptions.json` (JT_exploration): closure start = simulation start (not shiftable, no pre-closure comparison exists); reopen ≈ 2019-01-14, last closed day ≈ 2019-01-13. Inferred by visual inspection of the plotted gate-operation variable. | End only |
| 2 (short) | 2019-11-26 → 2019-12-10 | Same source: closure start ≈ 2019-11-26/27 (nominal = earlier date), reopen ≈ 2019-12-11, last closed day ≈ 2019-12-10. | Both |
| 3 (provisional) | 2020-07-15 → 2020-11-29 | **No exact operational gate time series was found** — searched both `JT_reboot` and `JT_exploration` for a gate/closure CSV or JSON source; none exists beyond the visual estimate in the prompt. Treated as provisional with the same ±2-day convention as closures 1–2. | Both |

All three closures carry ±2 days of dating uncertainty (per the existing gate-event-scan
convention) except closure 1's start, which coincides with simulation start.

## Required station-set tests run

- **Franks Tract:** core-9 / core+291 / core+292 / complete-11 (4 variants), each × 3 closures.
- **North Franks Tract:** complete 16-station set only (no membership search authorized), × 3
  closures — station-level agreement and recurring dissenters reported instead.
- **Freshwater Corridor:** the 4 authorized variants (core-only-15 / core+355 / core+357 /
  complete-17), × 3 closures.
- **Clifton Court Forebay:** full 2⁷ = 128-combination sweep over the 7 grouped stations (always
  retaining core 359/360) — this single sweep contains both the 8 authorized group-level
  combinations and the 7 authorized individual leave-one-out tests as specific subsets, × 3
  closures (384 rows).
- **Closure 3 date sensitivity:** ±2-day shift (start, end, and joint, each direction) applied to
  the complete proposed set of every region.

All variants are preserved in `station_set_sensitivity.csv` / `regional_patterns.json` regardless
of whether they were "named" for detailed reporting.

## Findings by region × closure

### Franks Tract

| Closure | Direction | Period (complete-11) | Qualifying days | Avg diff | Timing |
|---|---|---|---|---|---|
| 1 | **saltier** | 2018-11-30 → 2019-01-28 | 60 | +102.6 µS/cm (+13.2%) | emerges 60 days after closure begins; persists 15 days after reopening |
| 2 | **fresher** | 2019-11-30 → 2019-12-10 | 11 | −54.5 µS/cm (−13.6%) | emerges 4 days after closure begins; ends exactly at reopening |
| 3 | **saltier** | 2020-10-01 → 2020-11-29 (persistent condition, reduced) | 52 | +84.6 µS/cm (+7.5%) | emerges 78 days after closure begins; ends exactly at reopening |

**Direction reverses between closures 1 and 3 (saltier) and closure 2 (fresher)** — a genuine
finding, not a data artifact (station agreement ≥83% in every case). Closure 1's response only
emerges ~2 months into the ~104-day closure and does not begin until late November — a materially
different timing relationship than a response that starts at closure onset.

**Does adding 291/292 change the interpretation?** Direction never changes, but **station
agreement and duration both degrade** as 291/292 are added — core-9 alone is the cleanest,
longest-sustained signal in every closure (e.g. closure 1: 116 qualifying days at 96.5% agreement
for core-9, vs. only 60 days at 83.0% agreement once both 291 and 292 are added; closure 3: +190
µS/cm at 96.7% agreement for core-9 vs. +84.6 µS/cm at 79.1% agreement for the complete set).
Adding either station individually has a smaller, intermediate effect. **This materially changes
the reported magnitude and duration (well past the 20%/7-day flags) without changing direction** —
291 and 292 are diluting, not contradicting, the core-9 signal.

**Recommendation:** keep the 9-station core as the presentation reference, consistent with the
current curated finding — it is the more defensible, more sustained, higher-agreement set. 291 and
292 remain documented sensitivity variants, not part of the recommended set.

### North Franks Tract

| Closure | Direction | Period | Qualifying days | Avg diff | Timing |
|---|---|---|---|---|---|
| 1 | **saltier** | 2018-10-12 → 2019-01-03 | 84 | +89.3 µS/cm (+11.7%) | emerges 11 days after closure begins; ends 10 days before reopening |
| 2 | **No qualifying pattern.** | — | 0 | — | not applicable |
| 3 | **saltier** | 2020-10-01 → 2020-11-29 (persistent condition, reduced) | 60 | +139.4 µS/cm (+15.5%) | emerges 78 days after closure begins; ends exactly at reopening |

Per the explicit instruction not to relax criteria to force a pattern: **closure 2 (11 days) is too
short and/or too weak for this 16-station region to sustain a qualifying 7-day episode**, and this
is reported plainly rather than papered over.

**Station-level agreement:** unanimous — **zero disagreeing stations in both closures where a
pattern was found** (closures 1 and 3). No recurring dissenting or influential station exists to
flag for targeted sensitivity testing; this region behaves as one coherent unit whenever it shows a
pattern at all.

### Freshwater Corridor

| Closure | Direction | Period (complete-17) | Qualifying days | Avg diff | Timing |
|---|---|---|---|---|---|
| 1 | **fresher** | 2018-10-07 → 2019-01-11 | 97 | −173.0 µS/cm (−25.3%) | emerges 6 days after closure begins; ends 2 days before reopening |
| 2 | **fresher** | 2019-12-02 → 2019-12-19 | 18 | −59.9 µS/cm (−19.5%) | emerges 6 days after closure begins; persists 9 days after reopening |
| 3 | **fresher** | 2020-10-01 → 2020-11-29 (persistent condition, reduced) | 60 | −286.2 µS/cm (−34.8%) | emerges 78 days after closure begins; ends exactly at reopening |

**Consistently fresher in all three closures** — the only region with the same direction every
time. **Extremely low station-membership sensitivity:** core-only (15), core+355, core+357, and
the complete 17-station set all agree within a few µS/cm and a few tenths of a percentage point of
agreement in every closure (e.g. closure 3 ranges only −286 to −294 µS/cm across all 4 variants).
No station or combination changes direction, duration, or qualification status.

**Recommendation:** the complete 17-station set is fully defensible; there is no basis to exclude
355 or 357 (their inclusion changes nothing meaningfully), but the tighter core-only set is an
equally valid, slightly more conservative alternative if a narrower footprint is preferred.

### Clifton Court Forebay

| Closure | Direction | Period (complete-9) | Qualifying days | Avg diff | Timing |
|---|---|---|---|---|---|
| 1 | **fresher** | 2018-10-07 → 2018-12-24 | 79 | −117.0 µS/cm (−19.2%) | emerges 6 days after closure begins; ends 20 days before reopening |
| 2 | **No qualifying pattern** for the complete 9-station set. | — | 0 | — | not applicable |
| 3 | **fresher** | 2020-10-01 → 2020-11-29 (persistent condition, reduced) | 60 | −168.3 µS/cm (−24.0%) | emerges 78 days after closure begins; ends exactly at reopening |

Station agreement is **100% in every single one of the 128 tested combinations**, in every closure
where a pattern qualifies — the cleanest, most unanimous region in this study.

**Group-level and leave-one-out sensitivity (closures 1 and 3):** direction never changes under any
of the 8 group combinations or 7 individual-station removals. Magnitude shifts modestly (roughly
±10–15% of the complete set's value in most cases). **Group C (358, 362, 363) is the one
borderline-influential group**: excluding it in closure 1 changes duration from 79 to 97 qualifying
days (+22.8%, crossing the 20% flag) and shifts the average difference from −117.0 to −128.7 µS/cm
— suggesting Group C's stations introduce some of the interruptions that shorten the detected
episode, without changing its direction or overall conclusion.

**A notable, closure-specific finding: the 2-station core alone (359, 360) DOES find a qualifying
fresher pattern in closure 2** (9 qualifying days, −36.7 µS/cm), **while every larger combination —
including the complete 9-station set — does not.** This is a real membership effect: additional
stations dilute the short closure-2 signal below the qualifying threshold for this region.

**Recommendation:** the complete 9-station set remains defensible for closures 1 and 3 (unanimous
agreement, stable direction). For closure 2 specifically, only the 2-station core shows a
qualifying pattern — worth noting as a genuine station-count-dependent result, not a reason to
change the standing recommended set.

## Closure 3 date-sensitivity (±2 days)

**Every region shows zero change under every single-transition and joint ±2-day shift** (direction,
magnitude, and qualifying-day count all identical to the nominal window, to the precision reported).

**This result needs an honest caveat, not a clean bill of health.** Closure 3's response in every
region is classified as a **persistent condition** whose reported subperiod is reduced (per the
existing methodology) to the water year with the highest qualifying-day fraction — which happens to
run through the very end of the modeled record (2020-10-01 to 2020-11-29) regardless of small shifts
to the requested closure window. A ±2-day nudge to a provisional closure boundary cannot move a
result that is already anchored to "the rest of the available data," so this test is **not actually
probing the boundary uncertainty in a meaningful way for closure 3** as currently defined. It
confirms the *reported number* is stable, but does not confirm the *closure-3 window itself* is
well-dated. Combined with the fact that Oct–Nov 2020 is also documented elsewhere in this project as
the "critical dry-year period," the persistent, system-wide character of the closure-3 response
raises a real question of whether it reflects gate-specific operation or a broader dry-year
salinity effect — this is exactly the kind of causal claim the analysis brief asks not to make, and
it is flagged here rather than glossed over.

## Final recommendations

| Region | Most defensible set | Most inclusive coherent set | Alternative | Do-not-combine? |
|---|---|---|---|---|
| Franks Tract | Core-9 (current presentation reference) | Core-9 | Core+291 or core+292 individually, documented as sensitivity variants only | No |
| North Franks Tract | Complete 16-station set | Complete 16-station set | None needed — no membership search authorized or warranted | No |
| Freshwater Corridor | Complete 17-station set | Complete 17-station set | Core-only 15-station set (equally valid, marginally more conservative) | No |
| Clifton Court Forebay | Complete 9-station set | Complete 9-station set | 2-station core (359, 360) — the only set that resolves a closure-2 pattern | No |

No region requires a "do not combine" verdict. All four station sets are geographically coherent
regional units whose sensitivity results reflect real, explicable membership effects (dilution from
291/292 in Franks Tract; Group C's interruption effect in Clifton Court) rather than incoherence —
no exclusion recommended here is based on narrative convenience; each is tied to a specific,
reported geographic/behavioral reason.

## Files

`station_set_sensitivity.csv` (411 rows, all variants × all closures), `station_influence.csv` (33
leave-one-out rows), `recommended_station_sets.json` (per-region recommendation + closure-3 date
sensitivity), `regional_patterns.json` (complete machine-readable results), `regional_ec_series_7d.json`
(21 named-variant 7-day series), this file.
