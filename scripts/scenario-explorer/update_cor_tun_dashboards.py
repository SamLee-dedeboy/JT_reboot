"""Add the latest COR/TUN CalSim-family runs to the public explorer dashboards.

COR and TUN use ``BaseCalSim`` as their baseline. The other adaptation scenarios retain their
existing RMA baseline. This updates the current-condition dashboard and the shared SLR dashboard
used by public modes 01, 03, and 04.
"""

from __future__ import annotations

import argparse
import json
from concurrent.futures import ProcessPoolExecutor
from datetime import datetime
from pathlib import Path

import build_slr_scenarios_dashboard as builder


PROJECT_DIR = Path(__file__).resolve().parents[2]
DEFAULT_CURRENT_ROOT = PROJECT_DIR.parent / "JT_exploration" / "RMA" / "EC_current_2018_2020_7scen"
DEFAULT_SLR_ROOT = PROJECT_DIR.parent / "JT_exploration" / "RMA" / "EC_SLR_2018_2020_7scen"
DEFAULT_OUTPUT_DIR = PROJECT_DIR / "public" / "data" / "salinity" / "scenario-explorer"
PREFIXES = {"baseline": "BaseCalSim", "reserve": "COR", "tunnel": "DCP"}


def files_for(root: Path, prefix: str) -> list[Path]:
    files = sorted(root.glob(f"{prefix}_*_EC-AVG-AVG.csv"), key=lambda path: path.name)
    teams = {path.name.split("_")[1] for path in files}
    if len(files) != 5 or teams != builder.TEAMS:
        raise RuntimeError(
            f"{root}: expected one EC-AVG-AVG file for each team under {prefix}; "
            f"found {[path.name for path in files]}"
        )
    return files


def load_family(root: Path, stations: list[dict], station_by_name: dict[str, int]) -> dict:
    jobs = {
        key: files_for(root, prefix)
        for key, prefix in PREFIXES.items()
    }
    paths = [path for group in jobs.values() for path in group]
    with ProcessPoolExecutor(max_workers=min(10, len(paths))) as executor:
        results = list(executor.map(builder.read_file, map(str, paths), [station_by_name] * len(paths)))
    by_path = {Path(result["path"]): result for result in results}
    report = {}
    absolute = {
        key: builder.merge_scenario(
            f"{root.name}:{key}", [by_path[path] for path in paths], stations, report, strict=True
        )
        for key, paths in jobs.items()
    }
    return {"absolute": absolute, "report": report}


def full_series(values: dict, dates: list[str], station_count: int) -> list[list[float | None]]:
    return [
        [builder.rounded(values.get(station_index, {}).get(day)) for day in dates]
        for station_index in range(station_count)
    ]


def difference(
    values: dict, baseline: dict, dates: list[str], station_count: int
) -> list[list[float | None]]:
    return [
        [
            builder.rounded(current - base)
            if (current := values.get(station_index, {}).get(day)) is not None
            and (base := baseline.get(station_index, {}).get(day)) is not None
            else None
            for day in dates
        ]
        for station_index in range(station_count)
    ]


def region_means(
    station_values: list[list[float | None]], stations: list[dict], regions: list[str], date_count: int
) -> dict[str, list[float | None]]:
    indices = {
        region: [index for index, station in enumerate(stations) if station["region"] == region]
        for region in regions
    }
    return {
        region: [
            builder.rounded(sum(values) / len(values))
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


def scenario(
    *, key: str, label: str, family: str, climate: str, counterpart: str | None,
    station_values: list[list[float | None]], reference_key: str,
    stations: list[dict], regions: list[str], date_count: int,
) -> dict:
    result = {
        "key": key,
        "label": label,
        "scenarioFamily": family,
        "climateCondition": climate,
        "referenceKey": reference_key,
        "stationValues": station_values,
        "regionValues": region_means(station_values, stations, regions, date_count),
    }
    if counterpart:
        result["currentCounterpart"] = counterpart
    return result


def replace_scenarios(data: dict, replacements: dict[str, dict], append_order: list[str]) -> None:
    data["scenarios"] = [item for item in data["scenarios"] if item["key"] not in replacements]
    data["scenarios"].extend(replacements[key] for key in append_order)
    data["generatedAt"] = datetime.now().isoformat(timespec="seconds")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--current-root", type=Path, default=DEFAULT_CURRENT_ROOT)
    parser.add_argument("--slr-root", type=Path, default=DEFAULT_SLR_ROOT)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    args = parser.parse_args()

    current_path = args.output_dir / "salinity_dashboard.json"
    slr_path = args.output_dir / "slr_scenarios_dashboard.json"
    current = json.loads(current_path.read_text(encoding="utf-8"))
    slr = json.loads(slr_path.read_text(encoding="utf-8"))
    if current["stations"] != slr["stations"] or current["dates"] != slr["dates"]:
        raise RuntimeError("Current and SLR dashboards do not share the same station/date grid")

    stations, dates, regions = current["stations"], current["dates"], current["regions"]
    station_by_name = {builder.normalize(station["long_name"]): index for index, station in enumerate(stations)}
    current_family = load_family(args.current_root, stations, station_by_name)
    slr_family = load_family(args.slr_root, stations, station_by_name)
    current_abs, slr_abs = current_family["absolute"], slr_family["absolute"]
    station_count, date_count = len(stations), len(dates)
    current_reference = full_series(current_abs["baseline"], dates, station_count)

    zero = [[0.0] * date_count for _ in range(station_count)]
    current_replacements = {
        "baseline-calsim": scenario(
            key="baseline-calsim", label="Business as Usual (CalSim)", family="baseline-calsim",
            climate="current", counterpart=None, station_values=zero, reference_key="calsim",
            stations=stations, regions=regions, date_count=date_count,
        ),
        "reserve": scenario(
            key="reserve", label="Calling on Reserves", family="reserve", climate="current",
            counterpart=None,
            station_values=difference(current_abs["reserve"], current_abs["baseline"], dates, station_count),
            reference_key="calsim", stations=stations, regions=regions, date_count=date_count,
        ),
        "tunnel": scenario(
            key="tunnel", label="A Tunnel", family="tunnel", climate="current", counterpart=None,
            station_values=difference(current_abs["tunnel"], current_abs["baseline"], dates, station_count),
            reference_key="calsim", stations=stations, regions=regions, date_count=date_count,
        ),
    }
    replace_scenarios(current, current_replacements, ["baseline-calsim", "reserve", "tunnel"])
    current["referenceStationValuesByKey"] = {"calsim": current_reference}
    current["aggregation"] = (
        "Daily mean per station; regional lines are mean station differences. Eco Machine, New Green "
        "Watershed, and Bolster & Fortify use the RMA baseline; Calling on Reserves and A Tunnel use "
        "Baseline_Calsim."
    )

    slr_replacements = {
        **current_replacements,
        "baseline-calsim-slr": scenario(
            key="baseline-calsim-slr", label="Business as Usual (CalSim, SLR)",
            family="baseline-calsim", climate="slr", counterpart="baseline-calsim",
            station_values=difference(slr_abs["baseline"], current_abs["baseline"], dates, station_count),
            reference_key="calsim", stations=stations, regions=regions, date_count=date_count,
        ),
        "reserve-slr": scenario(
            key="reserve-slr", label="Calling on Reserves (SLR)", family="reserve", climate="slr",
            counterpart="reserve",
            station_values=difference(slr_abs["reserve"], current_abs["baseline"], dates, station_count),
            reference_key="calsim", stations=stations, regions=regions, date_count=date_count,
        ),
        "tunnel-slr": scenario(
            key="tunnel-slr", label="A Tunnel (SLR)", family="tunnel", climate="slr",
            counterpart="tunnel",
            station_values=difference(slr_abs["tunnel"], current_abs["baseline"], dates, station_count),
            reference_key="calsim", stations=stations, regions=regions, date_count=date_count,
        ),
    }
    replace_scenarios(
        slr,
        slr_replacements,
        [
            "baseline-calsim",
            "reserve",
            "tunnel",
            "baseline-calsim-slr",
            "reserve-slr",
            "tunnel-slr",
        ],
    )
    slr["referenceStationValuesByKey"] = {"calsim": current_reference}
    slr["slrAvailability"] = {
        "delivered": [item["key"] for item in slr["scenarios"] if item.get("climateCondition") == "slr"],
        "unavailable": [],
    }
    slr.setdefault("provenance", {})["corTunSevenScenarioUpdate"] = {
        "currentRoot": str(args.current_root),
        "slrRoot": str(args.slr_root),
        "comparisonBaseline": "BaseCalSim",
        "currentInputs": current_family["report"],
        "slrInputs": slr_family["report"],
    }

    current_path.write_text(json.dumps(current, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")
    slr_path.write_text(json.dumps(slr, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {current_path}")
    print(f"Wrote {slr_path}")


if __name__ == "__main__":
    main()
