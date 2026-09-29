"""Bolster & Fortify three-closure sensitivity engine.

Reuses, unchanged, the region-agnostic sensitivity engine already built and used for
JT_exploration's own station-set sensitivity studies:
  - confluence_sensitivity.py (generate_variants, analyze_variant, summarize_period_for_variant,
    station_agree_disagree) - itself built on methodology_pilot's pilot_stats/pilot_episodes/
    pilot_patterns, imported unchanged.
  - run_confluence_analysis.classify_influence (leave-one-out materiality flags).

This is a genuine cross-project import: JT_reboot and JT_exploration are local sibling project
directories on the same machine, and this analysis is explicitly modeled on that prior work (per
the user's own request), so the already-tested engine is reused via sys.path rather than
duplicated. New logic in THIS file: (a) timing-relationship classification of a reported episode
against its closure window's start/end, and (b) closure-3 provisional-date +/-2-day sensitivity
testing (this analysis's own new requirement - no equivalent existed in the JT_exploration studies).
"""
from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

JT_EXPLORATION_PREP_DIR = Path(r"D:\projects\JT_exploration\RMA\BDSC_regional_summary\internal\analysis\bdsc-preparation")
for p in (JT_EXPLORATION_PREP_DIR,):
    if str(p) not in sys.path:
        sys.path.insert(0, str(p))

import confluence_sensitivity as cs  # noqa: E402  (reused unchanged, see module docstring)
from run_confluence_analysis import classify_influence  # noqa: E402  (reused unchanged)

# re-exported for callers that only need the engine, not the BF-specific additions below
generate_variants = cs.generate_variants
analyze_variant = cs.analyze_variant
summarize_period_for_variant = cs.summarize_period_for_variant


def classify_timing(result: dict, closure: dict) -> dict:
    """Where does the reported episode sit relative to the closure window? Never claims causality -
    purely a date-arithmetic comparison, phrased as "gate-associated timing"."""
    if not result.get("episode_start_date"):
        return {"timing_relationship": "not_applicable", "lag_start_days": None, "lag_end_days": None}
    ep_start = pd.Timestamp(result["episode_start_date"])
    ep_end = pd.Timestamp(result["episode_end_date"])
    cl_start = pd.Timestamp(closure["start_date"])
    cl_end = pd.Timestamp(closure["end_date"])
    lag_start = (ep_start - cl_start).days   # negative = begins before closure starts
    lag_end = (ep_end - cl_end).days         # negative = ends before reopening; positive = persists after reopening

    phrases = []
    if lag_start < 0:
        phrases.append(f"response begins {abs(lag_start)} day(s) before the closure starts")
    elif lag_start == 0:
        phrases.append("response begins exactly when the closure starts")
    else:
        phrases.append(f"response emerges {lag_start} day(s) after the closure begins")
    if lag_end < 0:
        phrases.append(f"ends {abs(lag_end)} day(s) before reopening")
    elif lag_end == 0:
        phrases.append("ends exactly at reopening")
    else:
        phrases.append(f"persists {lag_end} day(s) after reopening")

    return {
        "timing_relationship": "; ".join(phrases), "lag_start_days": lag_start, "lag_end_days": lag_end,
        "begins_before_closure": lag_start < 0, "begins_after_closure_start": lag_start > 0,
        "ends_before_reopening": lag_end < 0, "persists_after_reopening": lag_end > 0,
    }


def closure_date_variants(closure: dict, shift_days: int) -> dict:
    """All single-transition and joint +/-shift_days variants of a closure window, skipping any
    transition explicitly marked non-shiftable (Closure 1's start = simulation start)."""
    start, end = pd.Timestamp(closure["start_date"]), pd.Timestamp(closure["end_date"])
    variants = {"nominal": {"start_date": str(start.date()), "end_date": str(end.date())}}
    can_shift_start = closure.get("shiftable_start", True)
    can_shift_end = closure.get("shiftable_end", True)
    delta = pd.Timedelta(days=shift_days)
    if can_shift_start:
        variants["start_minus"] = {"start_date": str((start - delta).date()), "end_date": str(end.date())}
        variants["start_plus"] = {"start_date": str((start + delta).date()), "end_date": str(end.date())}
    if can_shift_end:
        variants["end_minus"] = {"start_date": str(start.date()), "end_date": str((end - delta).date())}
        variants["end_plus"] = {"start_date": str(start.date()), "end_date": str((end + delta).date())}
    if can_shift_start and can_shift_end:
        variants["both_minus"] = {"start_date": str((start - delta).date()), "end_date": str((end - delta).date())}
        variants["both_plus"] = {"start_date": str((start + delta).date()), "end_date": str((end + delta).date())}
    return variants


def date_sensitivity_materially_changes(nominal: dict, shifted: dict) -> dict:
    """Same materiality bar used throughout this line of studies (classify_influence's thresholds):
    direction flip, pattern appears/disappears, |avg diff| change > 20%, duration change > 7 days
    or 20%, agreement change > 10 points."""
    infl = classify_influence(nominal, shifted)
    return {"flags": infl["flags"], "materially_changes": infl["is_influential"]}
