"""Build station-level SCHISM minus RMA comparisons for runs 15, 30, and 31."""

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
UPDATE_DIR = Path(os.environ["RMA_UPDATE_DIR"]) if os.environ.get("RMA_UPDATE_DIR") else None
SCHISM_DIR = DATA_DIR / "baseline_schism" / "ec_full_extent_all_stations"
CROSSWALK = DATA_DIR / "baseline_schism" / "shared_station_crosswalk.csv"
OUTPUT_DIR = Path(os.environ.get("SCENARIO_EXPLORER_OUTPUT_DIR", PROJECT_DIR / "public" / "data" / "scenario-explorer"))
OUT = OUTPUT_DIR / "rma_schism_dashboard.json"

SCENARIOS = [
    {
        "key": "baseline",
        "label": "Baseline",
        "run": "15",
        "rma_dir": "baseline",
        "rma_glob": "Base_*_JT_BASE_EC_EC.csv",
    },
    {
        "key": "reserve",
        "label": "Calling on Reserves",
        "run": "30",
        "rma_dir": "reserve",
        "rma_glob": "COR_*_JT_COR_EC_EC.csv",
    },
    {
        "key": "tunnel",
        "label": "A Tunnel",
        "run": "31",
        "rma_dir": "tunnel",
        "rma_glob": "DCP_*_JT_DCP_EC_EC.csv",
    },
]


def clean(value: str) -> str:
    return " ".join(str(value or "").strip().split())


def normalize(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", clean(value).lower())


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


def read_schism(run: str, stations_by_schism: dict[str, dict]) -> tuple[dict, set[str]]:
    path = SCHISM_DIR / f"run_{run}_EC_daily_mean_full_extent.csv"
    values_by_station = defaultdict(dict)
    dates = set()
    with path.open("r", newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        header = next(reader)
        selected = []
        for column, name in enumerate(header[1:], 1):
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
                if column >= len(row) or not row[column]:
                    continue
                values_by_station[station_id][day] = float(row[column])
    return values_by_station, dates


def read_rma(config: dict, stations_by_name: dict[str, dict], allowed_dates: set[str]) -> tuple[dict, set[str]]:
    totals = defaultdict(lambda: defaultdict(lambda: [0.0, 0]))
    seen_stations = set()
    dates = set()
    paths_by_name = {path.name: path for path in (DATA_DIR / config["rma_dir"]).glob(config["rma_glob"])}
    if UPDATE_DIR:
        paths_by_name.update({path.name: path for path in UPDATE_DIR.glob(config["rma_glob"])})
    paths = sorted(paths_by_name.values(), key=lambda item: item.name)
    for path in paths:
        print(f"  Reading {path.name}", flush=True)
        with path.open("r", newline="", encoding="utf-8-sig") as handle:
            reader = csv.reader(handle)
            selected = []
            for column, name in enumerate(next(reader)[1:], 1):
                station = stations_by_name.get(normalize(name))
                if station and station["station_id"] not in seen_stations:
                    seen_stations.add(station["station_id"])
                    selected.append((column, station["station_id"]))

            for row in reader:
                if not row:
                    continue
                day = row[0][:10]
                if day not in allowed_dates:
                    continue
                dates.add(day)
                for column, station_id in selected:
                    if column >= len(row) or not row[column]:
                        continue
                    aggregate = totals[station_id][day]
                    aggregate[0] += float(row[column])
                    aggregate[1] += 1

    daily = {
        station_id: {day: total / count for day, (total, count) in days.items()}
        for station_id, days in totals.items()
    }
    return daily, dates


def main() -> None:
    stations = read_crosswalk()
    stations_by_name = {normalize(station["long_name"]): station for station in stations}
    stations_by_schism = {station["schism_index"]: station for station in stations}

    raw = {}
    paired_date_sets = []
    scenario_references = {}
    for config in SCENARIOS:
        print(f"Reading SCHISM Run {config['run']}...", flush=True)
        schism, schism_dates = read_schism(config["run"], stations_by_schism)
        print(f"Reading RMA {config['label']}...", flush=True)
        rma, rma_dates = read_rma(config, stations_by_name, schism_dates)
        paired_dates = schism_dates & rma_dates
        paired_date_sets.append(paired_dates)
        raw[config["key"]] = {"rma": rma, "schism": schism}
        print(f"  {len(paired_dates)} overlapping dates", flush=True)

    dates = sorted(set.intersection(*paired_date_sets))
    if not dates:
        raise RuntimeError("No dates overlap across all three RMA/SCHISM comparisons")

    scenario_differences = {}
    valid_station_ids = set()
    station_counts = {}
    for config in SCENARIOS:
        comparison = raw[config["key"]]
        station_values = {}
        reference_values = {}
        for station in stations:
            station_id = station["station_id"]
            values = []
            for day in dates:
                rma_value = comparison["rma"].get(station_id, {}).get(day)
                schism_value = comparison["schism"].get(station_id, {}).get(day)
                values.append(round(schism_value - rma_value, 2) if rma_value is not None and schism_value is not None else None)
            if any(value is not None for value in values):
                station_values[station_id] = values
                reference_values[station_id] = [comparison["rma"].get(station_id, {}).get(day) for day in dates]
                valid_station_ids.add(station_id)
        scenario_differences[config["key"]] = station_values
        scenario_references[config["key"]] = reference_values
        station_counts[config["key"]] = len(station_values)

    output_stations = [station for station in stations if station["station_id"] in valid_station_ids]
    regions = sorted({station["region"] for station in output_stations})
    region_indices = {
        region: [index for index, station in enumerate(output_stations) if station["region"] == region]
        for region in regions
    }

    scenarios = []
    extent = 0.0
    for config in SCENARIOS:
        difference_by_station = scenario_differences[config["key"]]
        station_values = [difference_by_station.get(station["station_id"], [None] * len(dates)) for station in output_stations]
        region_values = {}
        for region, indices in region_indices.items():
            region_values[region] = [
                round(sum(values) / len(values), 2)
                if (values := [station_values[index][date_index] for index in indices if station_values[index][date_index] is not None])
                else None
                for date_index in range(len(dates))
            ]
        for values in station_values:
            for value in values:
                if value is not None:
                    extent = max(extent, abs(value))
        scenarios.append(
            {
                "key": config["key"],
                "label": config["label"],
                "run": config["run"],
                "stationCount": station_counts[config["key"]],
                "stationValues": station_values,
                "referenceStationValues": [scenario_references[config["key"]].get(station["station_id"], [None] * len(dates)) for station in output_stations],
                "regionValues": region_values,
            }
        )

    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "metric": "EC",
        "units": "uS/cm",
        "aggregation": "Daily station mean. Difference = SCHISM minus RMA over shared stations and dates common to all three run comparisons.",
        "startDate": dates[0],
        "endDate": dates[-1],
        "dates": dates,
        "regions": regions,
        "deltaExtent": round(extent, 2),
        "stations": output_stations,
        "scenarios": scenarios,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {OUT}", flush=True)
    print(f"Dates: {dates[0]} to {dates[-1]} ({len(dates)})", flush=True)
    for scenario in scenarios:
        print(f"Run {scenario['run']} / {scenario['label']}: {scenario['stationCount']} paired stations", flush=True)


if __name__ == "__main__":
    main()
