"""Build the CalSim-boundary-condition scenario explorer datasets.

Outputs two views from the October 2026 RMA11 reruns:

* RMA vs. CalSim: paired CalSim minus original RMA values for BAU, COR, and TUN.
* COR and TUN: CalSim COR/TUN values relative to the CalSim BAU run.
"""

from __future__ import annotations

import argparse
import json
from collections import defaultdict
from datetime import datetime
from pathlib import Path

import build_salinity_dashboard as salinity


RUNS = [
    ("baseline-calsim", "Baseline (CalSim)", "baseline", "baseline_calsim"),
    ("reserve-calsim", "Calling on Reserves", "reserve", "reserve_calsim"),
    ("tunnel-calsim", "A Tunnel", "tunnel", "tunnel_calsim"),
]


def mean_regions(station_values, stations, regions, date_count):
    indices = {
        region: [index for index, station in enumerate(stations) if station["region"] == region]
        for region in regions
    }
    return {
        region: [
            round(sum(values) / len(values), 2)
            if (values := [
                station_values[index][date_index]
                for index in station_indices
                if station_values[index][date_index] is not None
            ])
            else None
            for date_index in range(date_count)
        ]
        for region, station_indices in indices.items()
    }


def difference(values, base_values, dates, station_count):
    result = []
    for station_index in range(station_count):
        result.append([
            round(current - base, 2)
            if (current := values.get(station_index, {}).get(day)) is not None
            and (base := base_values.get(station_index, {}).get(day)) is not None
            else None
            for day in dates
        ])
    return result


def absolute(values, dates, station_count):
    return [
        [
            round(value, 2) if (value := values.get(station_index, {}).get(day)) is not None else None
            for day in dates
        ]
        for station_index in range(station_count)
    ]


def write_payload(path, stations, dates, regions, scenarios, reference, aggregation):
    extent = max(
        (abs(value) for scenario in scenarios for series in scenario["stationValues"] for value in series if value is not None),
        default=0,
    )
    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "metric": "EC-AVG-AVG",
        "units": "µS/cm",
        "aggregation": aggregation,
        "startDate": dates[0],
        "endDate": dates[-1],
        "dates": dates,
        "regions": regions,
        "deltaExtent": round(extent, 2),
        "stations": stations,
        "scenarios": scenarios,
    }
    if reference is not None:
        payload["referenceStationValues"] = reference
    path.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {path} ({len(stations)} stations, {len(dates)} days)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, default=salinity.DATA_DIR)
    parser.add_argument("--output-dir", type=Path, default=salinity.OUTPUT_DIR)
    args = parser.parse_args()

    salinity.DATA_DIR = args.data_dir
    salinity.WORKBOOK = args.data_dir / "ALL POINT STATIONS_FINAL REVISION_MAY 2026.xlsx"
    salinity.STATIONS_OUT = args.output_dir / "all_386_unique_stations.csv"
    stations = salinity.build_stations()
    station_by_name = {salinity.normalize(row["long_name"]): index for index, row in enumerate(stations)}

    raw = {}
    for key, label, original_dir, calsim_dir in RUNS:
        print(f"Reading original and CalSim {label}...")
        raw[key] = {
            "label": label,
            "original": salinity.read_scenario(original_dir, station_by_name),
            "calsim": salinity.read_scenario(calsim_dir, station_by_name),
        }

    dates = sorted({
        day
        for run in raw.values()
        for model in (run["original"], run["calsim"])
        for station_days in model.values()
        for day in station_days
    })
    regions = sorted({station["region"] for station in stations})
    station_count = len(stations)

    model_scenarios = []
    for key, run in raw.items():
        station_values = difference(run["calsim"], run["original"], dates, station_count)
        model_scenarios.append({
            "key": key,
            "label": run["label"],
            "stationValues": station_values,
            "regionValues": mean_regions(station_values, stations, regions, len(dates)),
            "referenceStationValues": absolute(run["original"], dates, station_count),
        })

    calsim_reference = absolute(raw["baseline-calsim"]["calsim"], dates, station_count)
    scenario_scenarios = []
    for key in ("reserve-calsim", "tunnel-calsim"):
        run = raw[key]
        station_values = difference(run["calsim"], raw["baseline-calsim"]["calsim"], dates, station_count)
        scenario_scenarios.append({
            "key": key,
            "label": run["label"],
            "stationValues": station_values,
            "regionValues": mean_regions(station_values, stations, regions, len(dates)),
        })

    args.output_dir.mkdir(parents=True, exist_ok=True)
    write_payload(
        args.output_dir / "rma_calsim_dashboard.json",
        stations, dates, regions, model_scenarios, None,
        "Daily mean per station. Difference = CalSim-boundary-condition RMA11 rerun minus the original RMA run.",
    )
    write_payload(
        args.output_dir / "calsim_scenarios_dashboard.json",
        stations, dates, regions, scenario_scenarios, calsim_reference,
        "Daily mean per station; regional lines are the mean station delta. Delta = scenario − CalSim baseline.",
    )


if __name__ == "__main__":
    main()
