"""Orchestrator for the Bolster & Fortify three-closure pattern and station-sensitivity analysis.
See bf-pattern-sensitivity-prompt.md (../../../src/features/regional-summary/) for the full brief.

    python run_bf_analysis.py
"""
from __future__ import annotations

import json
import time
from pathlib import Path

import numpy as np
import pandas as pd

import bf_data as bd
import bf_sensitivity as bs

SCRIPT_DIR = Path(__file__).resolve().parent
OUT = SCRIPT_DIR.parents[2] / "public" / "data" / "regional-summary" / "raw" / "bf-three-closure-analysis"
OUT.mkdir(parents=True, exist_ok=True)


def log(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def json_default(o):
    if isinstance(o, pd.Timestamp):
        return o.strftime("%Y-%m-%d")
    if isinstance(o, (np.integer,)):
        return int(o)
    if isinstance(o, (np.floating,)):
        return None if np.isnan(o) else float(o)
    if isinstance(o, (np.bool_,)):
        return bool(o)
    raise TypeError(f"not serializable: {type(o)}")


def main():
    cfg = bd.load_config()
    log("Loading + validating BF dataset (all 4 regions, 48 stations, bolster scenario)...")
    station_daily, data_validation, station_meta = bd.build_dataset(cfg)
    log(f"station_daily rows: {len(station_daily)}; missing rows: {data_validation['missing_values']['total_missing_rows']}")

    all_rows = []
    influence_rows = []
    ec_series_by_key = {}
    closure_date_sensitivity_rows = []
    recommended = {}

    region_ids = list(cfg["regions"].keys())
    for region_id in region_ids:
        region_cfg = bd.region_cfg_view(cfg, region_id)
        region_name = region_cfg["region"]["region_name"]
        variants = bs.generate_variants(region_cfg)
        log(f"[{region_name}] {len(variants)} station-set variant(s) ({sum(v['is_named_variant'] for v in variants)} named/fully-detailed)")

        by_variant_id = {}
        t0 = time.time()
        for i, variant in enumerate(variants):
            result = bs.analyze_variant(station_daily, variant, region_cfg, region_id, region_name)
            by_variant_id[variant["variant_id"]] = result
            for closure_id, closure in cfg["closures"].items():
                summary = bs.summarize_period_for_variant(result, variant, {"period_id": closure_id, **closure}, region_cfg)
                summary["region_id"] = region_id
                summary["region_name"] = region_name
                summary["closure_id"] = closure_id
                summary["closure_label"] = closure["label"]
                timing = bs.classify_timing(summary, closure)
                summary.update({f"timing_{k}": v for k, v in timing.items()})
                all_rows.append(summary)
            if variant["is_named_variant"] and not result.get("no_stations"):
                smoothed = result["smoothed"]
                ec_series_by_key[f"{region_id}__{variant['variant_id']}"] = {
                    "region_id": region_id, "variant_id": variant["variant_id"], "label": variant["label"],
                    "included_station_ids": variant["included_station_ids"],
                    "date": [str(d.date()) for d in smoothed["date"]],
                    "rolled_baseline_7d": [None if pd.isna(v) else round(float(v), 3) for v in smoothed["rolled_baseline"]],
                    "rolled_scenario_7d": [None if pd.isna(v) else round(float(v), 3) for v in smoothed["rolled_scenario"]],
                    "rolled_difference_7d": [None if pd.isna(v) else round(float(v), 3) for v in smoothed["rolled_difference"]],
                    "qualifies": [bool(v) for v in smoothed["qualifies"]],
                }
            if (i + 1) % 50 == 0:
                log(f"  {i + 1}/{len(variants)} variants analyzed ({time.time() - t0:.1f}s elapsed)")
        log(f"  {region_name} done in {time.time() - t0:.1f}s")

        # --- leave-one-out influence, per closure, for every explicitly authorized sensitivity station ---
        sensitivity_ids = sorted({sid for g in region_cfg["region"]["sensitivity_groups"].values() for sid in g})
        by_key = {(r["closure_id"], r["variant_id"]): r for r in all_rows if r["region_id"] == region_id}
        for closure_id in cfg["closures"]:
            full = by_key.get((closure_id, "complete_proposed_set"))
            if full is None:
                continue
            for sid in sensitivity_ids:
                loo = by_key.get((closure_id, f"leave_one_out_excl_{sid}"))
                if loo is None:
                    continue
                infl = bs.classify_influence(full, loo)
                influence_rows.append({
                    "region_id": region_id, "region_name": region_name, "closure_id": closure_id, "closure_label": cfg["closures"][closure_id]["label"],
                    "station_idx": sid, "station_name": station_meta[sid]["long_name"],
                    "full_set_direction": full["detected_direction"], "leave_one_out_direction": loo["detected_direction"],
                    "change_in_avg_ec_difference": infl["change_in_avg_ec_difference"], "change_in_avg_ec_difference_pct": infl["change_in_avg_ec_difference_pct"],
                    "change_in_qualifying_days": infl["change_in_qualifying_days"], "change_in_station_agreement": infl["change_in_station_agreement"],
                    "flags": ";".join(infl["flags"]), "is_influential": infl["is_influential"], "relationship_to_regional_interpretation": infl["relationship_to_regional_interpretation"],
                })

        # --- closure-3 provisional-date +/-2-day sensitivity, complete proposed set only ---
        complete_result = by_variant_id.get("complete_proposed_set")
        if complete_result is not None and not complete_result.get("no_stations"):
            closure3 = cfg["closures"]["closure_3"]
            nominal_summary = by_key.get(("closure_3", "complete_proposed_set"))
            for shift_name, shifted_period in bs.closure_date_variants(closure3, cfg["date_sensitivity_shift_days"]).items():
                if shift_name == "nominal":
                    continue
                complete_variant = next(v for v in variants if v["variant_id"] == "complete_proposed_set")
                shifted_summary = bs.summarize_period_for_variant(complete_result, complete_variant, {"period_id": shift_name, **shifted_period}, region_cfg)
                cmp = bs.date_sensitivity_materially_changes(nominal_summary, shifted_summary)
                closure_date_sensitivity_rows.append({
                    "region_id": region_id, "region_name": region_name, "shift_variant": shift_name,
                    "shifted_start": shifted_period["start_date"], "shifted_end": shifted_period["end_date"],
                    "nominal_direction": nominal_summary["detected_direction"], "shifted_direction": shifted_summary["detected_direction"],
                    "nominal_avg_ec_difference": nominal_summary.get("avg_ec_difference"), "shifted_avg_ec_difference": shifted_summary.get("avg_ec_difference"),
                    "nominal_qualifying_days": nominal_summary.get("n_qualifying_days"), "shifted_qualifying_days": shifted_summary.get("n_qualifying_days"),
                    "flags": ";".join(cmp["flags"]), "materially_changes": cmp["materially_changes"],
                })

        recommended[region_id] = {
            "region_name": region_name,
            "by_closure": {cid: by_key.get((cid, "complete_proposed_set")) for cid in cfg["closures"]},
            "n_variants_tested": len(variants),
            "sensitivity_stations_tested": sensitivity_ids,
        }

    # --- write outputs ---
    flat_rows = []
    for r in all_rows:
        row = dict(r)
        row["included_station_ids"] = ";".join(str(s) for s in row["included_station_ids"])
        row["excluded_station_ids"] = ";".join(str(s) for s in row["excluded_station_ids"])
        row["agreeing_station_ids"] = ";".join(str(s) for s in row.get("agreeing_station_ids", []))
        row["disagreeing_station_ids"] = ";".join(str(s) for s in row.get("disagreeing_station_ids", []))
        row["insufficient_data_station_ids"] = ";".join(str(s) for s in row.get("insufficient_data_station_ids", []))
        row.pop("other_overlapping_episodes", None)
        row.pop("full_detected_span", None)
        flat_rows.append(row)
    sensitivity_df = pd.DataFrame(flat_rows)
    sensitivity_df.to_csv(OUT / "station_set_sensitivity.csv", index=False)
    log(f"station_set_sensitivity.csv: {len(sensitivity_df)} rows")

    influence_df = pd.DataFrame(influence_rows)
    influence_df.to_csv(OUT / "station_influence.csv", index=False)
    log(f"station_influence.csv: {len(influence_df)} rows")

    with open(OUT / "recommended_station_sets.json", "w", encoding="utf-8") as f:
        json.dump({"closures": cfg["closures"], "scenario": cfg["scenario"], "regions": recommended,
                    "closure_3_date_sensitivity": closure_date_sensitivity_rows}, f, indent=2, default=json_default)
    log("recommended_station_sets.json written")

    with open(OUT / "regional_patterns.json", "w", encoding="utf-8") as f:
        json.dump({"scenario": cfg["scenario"], "closures": cfg["closures"], "variants": all_rows}, f, default=json_default)
    log(f"regional_patterns.json: {len(all_rows)} variant x closure results")

    with open(OUT / "regional_ec_series_7d.json", "w", encoding="utf-8") as f:
        json.dump({"series": ec_series_by_key}, f, default=json_default)
    log(f"regional_ec_series_7d.json: {len(ec_series_by_key)} variant series")

    return {"rows": all_rows, "influence_rows": influence_rows, "closure_date_sensitivity_rows": closure_date_sensitivity_rows, "recommended": recommended}


if __name__ == "__main__":
    main()
