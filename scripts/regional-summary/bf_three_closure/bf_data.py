"""Load, validate, and reconstruct the paired Business-as-Usual/Bolster-and-Fortify EC dataset for
the three-closure pattern and station-sensitivity analysis.

Source data is never modified. Reads only:
  - public/data/scenario-explorer/salinity_dashboard.json (daily mean EC, baseline + scenario deltas)

Reuses the SAME reconstruction approach as JT_exploration's
RMA/BDSC_regional_summary/internal/analysis/bdsc-preparation/confluence_data.py (station_daily
long-format table shape consumed by the reused pilot_stats/pilot_episodes/pilot_patterns modules),
adapted to build ONE table covering the union of stations across all 4 regions defined in
bf_config.json (each region is sliced from this shared table downstream - see bf_sensitivity.py).
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd

REPO = Path(__file__).resolve().parents[3]  # .../JT_reboot
SCRIPT_DIR = Path(__file__).resolve().parent


def load_config() -> dict:
    with open(SCRIPT_DIR / "bf_config.json", encoding="utf-8") as f:
        return json.load(f)


def load_dashboard(cfg: dict) -> dict:
    with open(REPO / cfg["inputs"]["salinity_dashboard"], encoding="utf-8") as f:
        return json.load(f)


def water_year(date: pd.Timestamp, start_month: int = 10) -> int:
    return date.year + 1 if date.month >= start_month else date.year


def all_station_ids(cfg: dict) -> list[int]:
    ids = set()
    for region in cfg["regions"].values():
        ids |= set(region["core_always_station_ids"])
        for group in region["sensitivity_groups"].values():
            ids |= set(group)
    return sorted(ids)


def region_cfg_view(cfg: dict, region_id: str) -> dict:
    """A per-region cfg dict shaped exactly like confluence_sensitivity.py expects
    (cfg["region"] + the shared threshold/window/classification blocks)."""
    shared = {k: v for k, v in cfg.items() if k != "regions"}
    shared["region"] = {"region_id": region_id, **cfg["regions"][region_id]}
    return shared


def build_dataset(cfg: dict | None = None):
    """Returns (station_daily_df, validation_report, station_meta) for the union of all stations
    across every region in bf_config.json, for the single Bolster & Fortify scenario."""
    if cfg is None:
        cfg = load_config()

    station_ids = all_station_ids(cfg)
    dash = load_dashboard(cfg)
    dates = pd.to_datetime(dash["dates"])
    n_dates = len(dates)
    sid_index = {s["station_id"]: i for i, s in enumerate(dash["stations"])}
    station_meta_all = {s["station_id"]: s for s in dash["stations"]}
    skey = cfg["scenario"]["key"]
    scenarios_by_key = {s["key"]: s for s in dash["scenarios"]}

    validation: dict = {"errors": [], "warnings": []}

    missing = [sid for sid in station_ids if str(sid) not in sid_index]
    validation["station_existence_check"] = {
        "n_proposed_stations": len(station_ids), "missing_from_dashboard": missing, "all_present": len(missing) == 0,
    }
    if missing:
        validation["errors"].append(f"Station(s) {missing} are absent from salinity_dashboard.json")
    if skey not in scenarios_by_key:
        validation["errors"].append(f"scenario key '{skey}' not found in salinity_dashboard.json scenarios")

    ref_len = len(dash["referenceStationValues"])
    ref_inner_lens = {len(arr) for arr in dash["referenceStationValues"]}
    scen = scenarios_by_key.get(skey)
    scen_ok = scen is not None and len(scen["stationValues"]) == len(dash["stations"]) and {len(a) for a in scen["stationValues"]} == {n_dates}
    validation["array_dimension_check"] = {
        "reference_ok": ref_len == len(dash["stations"]) and ref_inner_lens == {n_dates}, "scenario_ok": scen_ok, "n_dates": n_dates,
    }
    if not (validation["array_dimension_check"]["reference_ok"] and scen_ok):
        validation["errors"].append("Array dimension mismatch in salinity_dashboard.json")

    if validation["errors"]:
        raise RuntimeError("BF three-closure data validation failed before analysis could proceed: " + "; ".join(validation["errors"]))

    records = []
    station_meta = {}
    for sid in station_ids:
        sid_str = str(sid)
        idx = sid_index[sid_str]
        base = np.array([np.nan if v is None else v for v in dash["referenceStationValues"][idx]], dtype=float)
        delta = np.array([np.nan if v is None else v for v in scen["stationValues"][idx]], dtype=float)
        scen_abs = base + delta
        is_paired = (~np.isnan(base)) & (~np.isnan(delta))
        diff = np.where(is_paired, scen_abs - base, np.nan)
        station_meta[sid] = station_meta_all[sid_str]
        for i in range(n_dates):
            records.append((sid, dates[i], base[i], scen_abs[i], diff[i], bool(is_paired[i])))

    df = pd.DataFrame.from_records(records, columns=["station_idx", "date", "baseline_ec", "scenario_ec", "station_difference", "is_paired"])
    df["scenario_key"] = skey
    df["scenario_label"] = cfg["scenario"]["label"]
    df["calendar_month"] = df["date"].dt.month
    df["water_year"] = df["date"].apply(lambda d: water_year(d, cfg["water_year"]["start_month"]))

    spot_sid = str(station_ids[0])
    spot_i = 0
    expected = (np.nan if dash["referenceStationValues"][sid_index[spot_sid]][spot_i] is None else dash["referenceStationValues"][sid_index[spot_sid]][spot_i]) + \
               (np.nan if scen["stationValues"][sid_index[spot_sid]][spot_i] is None else scen["stationValues"][sid_index[spot_sid]][spot_i])
    got = df[(df.station_idx == int(spot_sid)) & (df.date == dates[spot_i])]["scenario_ec"].iloc[0]
    validation["reconstruction_spotcheck"] = {"station_idx": int(spot_sid), "date": str(dates[spot_i].date()),
                                               "expected": float(expected), "got": float(got), "match": bool(np.isclose(expected, got, equal_nan=True))}

    miss = df[~df.is_paired]
    validation["missing_values"] = {"total_missing_rows": int(len(miss)), "imputation_performed": False}
    validation["ok"] = True
    return df, validation, station_meta


if __name__ == "__main__":
    cfg = load_config()
    df, validation, station_meta = build_dataset(cfg)
    print("station_daily rows:", len(df))
    print(json.dumps({k: v for k, v in validation.items() if k != "missing_values"}, indent=2, default=str))
    print("missing_values.total_missing_rows:", validation["missing_values"]["total_missing_rows"])
