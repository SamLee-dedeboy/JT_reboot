"""Build a full-date-range SCHISM-only comparison for runs 15, 30, and 31."""

from __future__ import annotations

import csv
import json
import os
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = Path(os.environ.get("RMA_DATA_DIR", PROJECT_DIR.parent / "JT_exploration" / "RMA" / "data"))
SCHISM_DIR = DATA_DIR / "baseline_schism" / "ec_full_extent_all_stations"
CROSSWALK = DATA_DIR / "baseline_schism" / "shared_station_crosswalk.csv"
OUTPUT_DIR = Path(os.environ.get("SCENARIO_EXPLORER_OUTPUT_DIR", PROJECT_DIR / "public" / "data" / "scenario-explorer"))
OUT = OUTPUT_DIR / "schism_runs_dashboard.json"
RUNS = [
    {"key": "run15", "label": "Business As Usual · Run 15", "run": "15"},
    {"key": "run30", "label": "Calling on Reserves · Run 30", "run": "30"},
    {"key": "run31", "label": "A Tunnel · Run 31", "run": "31"},
]


def clean(value: str) -> str:
    return " ".join(str(value or "").strip().split())


def read_stations() -> list[dict]:
    stations = []
    with CROSSWALK.open("r", newline="", encoding="utf-8-sig") as handle:
        for row in csv.DictReader(handle):
            if not row.get("schism_index") or not row.get("long name"):
                continue
            stations.append({
                "station_id": str(int(float(row["station #"]))),
                "region": clean(row.get("region", "")).title(),
                "long_name": clean(row["long name"]),
                "short_name": clean(row.get("short name", "")),
                "schism_index": str(int(float(row["schism_index"]))),
                "latitude": float(row["lat"]),
                "longitude": float(row["long"]),
            })
    return sorted(stations, key=lambda item: int(item["station_id"]))


def read_run(run: str, by_schism: dict[str, dict]) -> tuple[dict, set[str]]:
    values = defaultdict(dict)
    dates = set()
    path = SCHISM_DIR / f"run_{run}_EC_daily_mean_full_extent.csv"
    with path.open("r", newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        selected = []
        for column, name in enumerate(next(reader)[1:], 1):
            match = re.match(r"^(\d+)_", name)
            station = by_schism.get(str(int(match.group(1)))) if match else None
            if station:
                selected.append((column, station["station_id"]))
        for row in reader:
            if not row:
                continue
            day = row[0][:10]
            dates.add(day)
            for column, station_id in selected:
                if column < len(row) and row[column]:
                    values[station_id][day] = float(row[column])
    return values, dates


def main() -> None:
    stations = read_stations()
    by_schism = {station["schism_index"]: station for station in stations}
    run_values, date_sets = {}, []
    for config in RUNS:
        values, dates = read_run(config["run"], by_schism)
        run_values[config["key"]] = values
        date_sets.append(dates)
    dates = sorted(set.union(*date_sets))
    stations = [station for station in stations if any(run_values[c["key"]].get(station["station_id"]) for c in RUNS)]
    regions = sorted({station["region"] for station in stations})
    region_indices = {region: [i for i, station in enumerate(stations) if station["region"] == region] for region in regions}
    scenarios = []
    for config in RUNS:
        station_values = [[run_values[config["key"]].get(station["station_id"], {}).get(day) for day in dates] for station in stations]
        region_values = {region: [
            round(sum(items) / len(items), 2) if (items := [station_values[i][d] for i in indices if station_values[i][d] is not None]) else None
            for d in range(len(dates))
        ] for region, indices in region_indices.items()}
        scenarios.append({**config, "stationCount": len(stations), "stationValues": station_values, "regionValues": region_values})
    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"), "metric": "EC", "units": "uS/cm",
        "aggregation": "Daily station mean. The UI calculates selected SCHISM run minus base SCHISM run; the union of all run dates is retained.",
        "startDate": dates[0], "endDate": dates[-1], "dates": dates, "regions": regions,
        "stations": stations, "scenarios": scenarios,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {OUT}\nDates: {dates[0]} to {dates[-1]} ({len(dates)})\nStations: {len(stations)}")


if __name__ == "__main__":
    main()
