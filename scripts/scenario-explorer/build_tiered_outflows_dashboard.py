"""Build SCHISM Run 16/17 differences relative to Run 15."""

from __future__ import annotations

import csv
import json
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path


EDA_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = EDA_DIR.parent / "data"
SCHISM_DIR = DATA_DIR / "baseline_schism" / "ec_full_extent_all_stations"
CROSSWALK = DATA_DIR / "baseline_schism" / "shared_station_crosswalk.csv"
OUT = EDA_DIR / "public" / "data" / "tiered_outflows_dashboard.json"

RUNS = [
    {"key": "run15", "label": "Run 15 · Reference Outflow", "run": "15"},
    {"key": "run16", "label": "+30% Outflow · Run 16", "run": "16"},
    {"key": "run17", "label": "−10% Outflow · Run 17", "run": "17"},
]


def clean(value: str) -> str:
    return " ".join(str(value or "").strip().split())


def canonical_region(value: str) -> str:
    return " ".join(part.capitalize() for part in clean(value).split())


def read_crosswalk() -> list[dict]:
    stations = []
    for row in csv.DictReader(CROSSWALK.open("r", newline="", encoding="utf-8-sig")):
        if not row.get("schism_index") or not row.get("long name"):
            continue
        stations.append(
            {
                "station_id": str(int(float(row["station #"]))),
                "region": canonical_region(row.get("region", "")),
                "long_name": clean(row["long name"]),
                "short_name": clean(row.get("short name", "")),
                "origin": clean(row.get("origin", "")),
                "archive_index": str(int(float(row["archive index"]))),
                "schism_index": str(int(float(row["schism_index"]))),
                "latitude": float(row["lat"]),
                "longitude": float(row["long"]),
            }
        )
    stations.sort(key=lambda item: int(item["station_id"]))
    return stations


def read_run(run: str, stations_by_schism: dict[str, dict]) -> tuple[dict, set[str]]:
    path = SCHISM_DIR / f"run_{run}_EC_daily_mean_full_extent.csv"
    station_values = defaultdict(dict)
    dates = set()
    with path.open("r", newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        selected = []
        for column, name in enumerate(next(reader)[1:], 1):
            match = re.match(r"^(\d+)_", name)
            station = stations_by_schism.get(str(int(match.group(1)))) if match else None
            if station:
                selected.append((column, station["station_id"]))
        for row in reader:
            if not row:
                continue
            day = row[0][:10]
            dates.add(day)
            for column, station_id in selected:
                if column < len(row) and row[column]:
                    station_values[station_id][day] = float(row[column])
    return station_values, dates


def main() -> None:
    stations = read_crosswalk()
    stations_by_schism = {station["schism_index"]: station for station in stations}
    values_by_run = {}
    date_sets = []
    for config in RUNS:
        print(f"Reading SCHISM Run {config['run']}...", flush=True)
        values, dates = read_run(config["run"], stations_by_schism)
        values_by_run[config["key"]] = values
        date_sets.append(dates)

    dates = sorted(set.intersection(*date_sets))
    reference = values_by_run["run15"]
    valid_station_ids = set()
    for station in stations:
        station_id = station["station_id"]
        if any(
            reference.get(station_id, {}).get(day) is not None
            and values_by_run["run16"].get(station_id, {}).get(day) is not None
            and values_by_run["run17"].get(station_id, {}).get(day) is not None
            for day in dates
        ):
            valid_station_ids.add(station_id)

    output_stations = [station for station in stations if station["station_id"] in valid_station_ids]
    regions = sorted({station["region"] for station in output_stations})
    region_indices = {
        region: [index for index, station in enumerate(output_stations) if station["region"] == region]
        for region in regions
    }
    scenarios = []
    reference_station_values = [[reference.get(station["station_id"], {}).get(day) for day in dates] for station in output_stations]
    extent = 0.0
    for config in RUNS:
        station_values = []
        for station in output_stations:
            station_id = station["station_id"]
            values = []
            for day in dates:
                reference_value = reference.get(station_id, {}).get(day)
                run_value = values_by_run[config["key"]].get(station_id, {}).get(day)
                value = round(run_value - reference_value, 2) if run_value is not None and reference_value is not None else None
                values.append(value)
                if value is not None:
                    extent = max(extent, abs(value))
            station_values.append(values)

        region_values = {}
        for region, indices in region_indices.items():
            region_values[region] = [
                round(sum(values) / len(values), 2)
                if (values := [station_values[index][date_index] for index in indices if station_values[index][date_index] is not None])
                else None
                for date_index in range(len(dates))
            ]
        scenarios.append(
            {
                "key": config["key"],
                "label": config["label"],
                "run": config["run"],
                "stationCount": len(output_stations),
                "stationValues": station_values,
                "regionValues": region_values,
            }
        )

    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "metric": "EC",
        "units": "uS/cm",
        "aggregation": "Daily station mean. Difference = selected SCHISM outflow run minus SCHISM Run 15 over shared stations and dates.",
        "startDate": dates[0],
        "endDate": dates[-1],
        "dates": dates,
        "regions": regions,
        "deltaExtent": round(extent, 2),
        "stations": output_stations,
        "referenceStationValues": reference_station_values,
        "scenarios": scenarios,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {OUT}", flush=True)
    print(f"Dates: {dates[0]} to {dates[-1]} ({len(dates)})", flush=True)
    print(f"Shared stations: {len(output_stations)}", flush=True)


if __name__ == "__main__":
    main()
