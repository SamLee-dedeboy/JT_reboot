"""Promote reviewed Bolster & Fortify closure findings into dashboard data."""

from __future__ import annotations

import json
from datetime import date, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "public" / "data" / "regional-summary"
ANALYSIS = DATA / "raw" / "bf-three-closure-analysis"

SELECTIONS = {
    "franks_tract": {
        "place_id": "franks_tract",
        "variant_id": "both_groups_excluded_core_only",
        "closures": ("closure_1", "closure_2", "closure_3"),
        "membership_note": "Uses the nine-station Franks Tract core set; stations 291 and 292 remain sensitivity-only.",
    },
    "north_franks_tract": {
        "place_id": "north_franks_tract",
        "variant_id": "complete_proposed_set",
        "closures": ("closure_1", "closure_3"),
        "membership_note": "Uses the complete reviewed 16-station North of Franks Tract set.",
    },
    "freshwater_corridor": {
        "place_id": "bf_freshwater_pathway",
        "variant_id": "complete_proposed_set",
        "closures": ("closure_1", "closure_2", "closure_3"),
        "membership_note": "Uses the complete proposed 17-station Freshwater Corridor set; 355 and 357 were retained after sensitivity review.",
    },
    "clifton_court_forebay": {
        "place_id": "clifton_court_forebay",
        "variant_id": "complete_proposed_set",
        "closures": ("closure_1", "closure_3"),
        "membership_note": "Uses the complete proposed nine-station Clifton Court Forebay set; the short second closure is excluded because only the two-station core qualified.",
    },
}


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value) -> None:
    path.write_text(json.dumps(value, separators=(",", ":")), encoding="utf-8")


def rounded(value):
    return None if value is None else round(value, 4)


def main() -> None:
    analysis = read_json(ANALYSIS / "regional_patterns.json")
    source_series = read_json(ANALYSIS / "regional_ec_series_7d.json")["series"]
    pattern_list = read_json(DATA / "pattern-list.json")
    event_series = read_json(DATA / "pattern-ec-series-7d.json")

    rows = {
        (row["region_id"], row["variant_id"], row["closure_id"]): row
        for row in analysis["variants"]
    }
    places = {place["id"]: place for place in pattern_list["scenarios"]["bolster"]["places"]}
    promoted_ids = []

    for region_id, selection in SELECTIONS.items():
        variant_id = selection["variant_id"]
        series = source_series[f"{region_id}__{variant_id}"]
        patterns = []
        for closure_id in selection["closures"]:
            row = rows[(region_id, variant_id, closure_id)]
            pattern_id = f"{region_id}_bf_{closure_id}"
            promoted_ids.append(pattern_id)
            patterns.append(
                {
                    "id": pattern_id,
                    "candidateType": f"gate_{closure_id}_curated_response",
                    "direction": row["detected_direction"],
                    "patternType": row["pattern_type"],
                    "startDate": row["episode_start_date"],
                    "endDate": row["episode_end_date"],
                    "durationDays": row["calendar_duration_days"],
                    "qualifyingDays": row["n_qualifying_days"],
                    "baselineEc": rounded(row["baseline_regional_ec"]),
                    "scenarioEc": rounded(row["scenario_regional_ec"]),
                    "differenceEc": rounded(row["avg_ec_difference"]),
                    "differencePct": rounded(row["avg_percent_difference"]),
                    "stationCount": row["n_stations"],
                    "stationAgreement": rounded(row["avg_station_agreement_fraction"]),
                    "stationCoverage": 1,
                    "thresholdEc": None,
                    "additionalThresholdDays": None,
                    "sustainedReversals": None,
                    "reversalsPerYear": None,
                    "reviewStatus": "selected",
                    "reviewNote": f"{selection['membership_note']} {row['timing_timing_relationship']}.",
                    "proposedDisplayRegion": row["region_name"],
                    "broaderStoryGroup": "Bolster & Fortify gate-closure response",
                }
            )

            start = date.fromisoformat(row["episode_start_date"]) - timedelta(days=7)
            end = date.fromisoformat(row["episode_end_date"]) + timedelta(days=7)
            indexes = [
                index
                for index, value in enumerate(series["date"])
                if start <= date.fromisoformat(value) <= end
            ]
            event_series[pattern_id] = {
                "dates": [series["date"][index] for index in indexes],
                "baseline": [series["rolled_baseline_7d"][index] for index in indexes],
                "scenario": [series["rolled_scenario_7d"][index] for index in indexes],
                "scenarioMin": [None for _ in indexes],
                "scenarioMax": [None for _ in indexes],
            }

        places[selection["place_id"]]["patterns"] = patterns
        directions = {pattern["direction"] for pattern in patterns}
        places[selection["place_id"]]["trend"] = (
            next(iter(directions)) if len(directions) == 1 else "flipping"
        )

    active_ids = {
        pattern["id"]
        for scenario in pattern_list["scenarios"].values()
        for place in scenario["places"]
        for pattern in place["patterns"]
    }
    event_series = {key: value for key, value in event_series.items() if key in active_ids}
    pattern_list["sourceRecordCount"] = len(active_ids)

    write_json(DATA / "pattern-list.json", pattern_list)
    write_json(DATA / "pattern-ec-series-7d.json", event_series)
    print(f"Promoted {len(promoted_ids)} B&F findings: {', '.join(promoted_ids)}")


if __name__ == "__main__":
    main()
