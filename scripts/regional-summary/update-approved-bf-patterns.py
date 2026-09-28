"""Idempotently add the reviewed B&F closure findings to approved_patterns.csv."""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ANALYSIS = ROOT / "public" / "data" / "regional-summary" / "raw" / "bf-three-closure-analysis"
SELECTIONS = {
    "franks_tract": {
        "variant_id": "both_groups_excluded_core_only",
        "closures": ("closure_1", "closure_2", "closure_3"),
        "membership_note": "Uses the nine-station Franks Tract core set; stations 291 and 292 remain sensitivity-only.",
    },
    "north_franks_tract": {
        "variant_id": "complete_proposed_set",
        "closures": ("closure_1", "closure_3"),
        "membership_note": "Uses the complete reviewed 16-station North of Franks Tract set.",
    },
    "freshwater_corridor": {
        "variant_id": "complete_proposed_set",
        "closures": ("closure_1", "closure_2", "closure_3"),
        "membership_note": "Uses the complete proposed 17-station Freshwater Corridor set; 355 and 357 were retained after sensitivity review.",
    },
    "clifton_court_forebay": {
        "variant_id": "complete_proposed_set",
        "closures": ("closure_1", "closure_3"),
        "membership_note": "Uses the complete proposed nine-station Clifton Court Forebay set; the short second closure is excluded because only the two-station core qualified.",
    },
}


def main() -> None:
    target = Path(sys.argv[1])
    analysis = json.loads((ANALYSIS / "regional_patterns.json").read_text(encoding="utf-8"))
    selected = {
        (region_id, selection["variant_id"], closure_id)
        for region_id, selection in SELECTIONS.items()
        for closure_id in selection["closures"]
    }
    variants = [
        row
        for row in analysis["variants"]
        if (row["region_id"], row["variant_id"], row["closure_id"]) in selected
    ]

    with target.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        fieldnames = reader.fieldnames
        existing = [row for row in reader if row["scenario_key"] != "bolster"]

    additions = []
    for row in variants:
        direction_label = "fresher" if row["detected_direction"] == "fresher" else "saltier"
        difference = row["avg_ec_difference"]
        percent = row["avg_percent_difference"]
        display = (
            f"{row['episode_start_date']} to {row['episode_end_date']}\n"
            f"In Bolster & Fortify, {row['region_name']} was {direction_label} than Business as Usual: "
            f"{difference:+.0f} µS/cm on average ({percent:+.1f}%), sustained for "
            f"{row['n_qualifying_days']} qualifying days."
        )
        selection = SELECTIONS[row["region_id"]]
        additions.append(
            {
                "region_id": row["region_id"],
                "region_name": row["region_name"],
                "scenario_key": "bolster",
                "scenario_label": "Bolster & Fortify",
                "pattern_type": row["pattern_type"],
                "period_start": row["episode_start_date"],
                "period_end": row["episode_end_date"],
                "requested_period_start": row["requested_period_start"],
                "requested_period_end": row["requested_period_end"],
                "station_set_variant_id": row["variant_id"],
                "station_set_label": row["label"],
                "n_stations": row["n_stations"],
                "included_station_ids": ";".join(map(str, row["included_station_ids"])),
                "direction": row["detected_direction"],
                "baseline_regional_ec": row["baseline_regional_ec"],
                "scenario_regional_ec": row["scenario_regional_ec"],
                "avg_ec_difference": row["avg_ec_difference"],
                "avg_percent_difference": row["avg_percent_difference"],
                "median_station_difference": row["median_station_difference"],
                "n_qualifying_days": row["n_qualifying_days"],
                "calendar_duration_days": row["calendar_duration_days"],
                "avg_station_agreement_fraction": row["avg_station_agreement_fraction"],
                "min_daily_station_agreement": row["min_daily_station_agreement"],
                "n_agreeing": row["n_agreeing"],
                "n_disagreeing": row["n_disagreeing"],
                "display_finding": display,
                "approved_date": "2026-09-26",
                "approved_by": "user (chat approval)",
                "notes": f"{selection['membership_note']} {row['timing_timing_relationship']}.",
            }
        )

    with target.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(existing + additions)
    print(f"Wrote {len(existing) + len(additions)} approvals ({len(additions)} B&F).")


if __name__ == "__main__":
    main()
