"""Build the shared-station SCHISM-only comparison for runs 27, 30, and 31."""

from __future__ import annotations

import csv
import json
import math
import os
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = Path(os.environ.get("RMA_DATA_DIR", PROJECT_DIR.parent / "JT_exploration" / "RMA" / "data"))
BASE = DATA_DIR / "baseline_schism"
SCHISM_DIR = BASE / "ec_full_extent_all_stations"
MASTER = DATA_DIR / "all_point_stations_finalized.csv"
RUN27_STATIONS = BASE / "raw" / "station.in.run_27.txt"
OUTPUT_DIR = Path(os.environ.get("SCENARIO_EXPLORER_OUTPUT_DIR", PROJECT_DIR / "public" / "data" / "scenario-explorer"))
OUT = OUTPUT_DIR / "schism_runs_dashboard.json"
RUNS = [
    {"key": "run27", "label": "Business As Usual · Run 27", "run": "27"},
    {"key": "run30", "label": "Calling on Reserves · Run 30", "run": "30"},
    {"key": "run31", "label": "A Tunnel · Run 31", "run": "31"},
]


def clean(value: str) -> str:
    return " ".join(str(value or "").strip().split())


def normalize(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", clean(value).lower())


def utm10_to_lonlat(easting: float, northing: float) -> tuple[float, float]:
    """Convert NAD83 / UTM zone 10N station coordinates to WGS84."""
    a, ecc_sq, k0 = 6378137.0, 0.00669438002290, 0.9996
    ecc_prime_sq = ecc_sq / (1 - ecc_sq)
    x, y = easting - 500000.0, northing
    m = y / k0
    mu = m / (a * (1 - ecc_sq / 4 - 3 * ecc_sq**2 / 64 - 5 * ecc_sq**3 / 256))
    e1 = (1 - math.sqrt(1 - ecc_sq)) / (1 + math.sqrt(1 - ecc_sq))
    fp = mu + (3*e1/2 - 27*e1**3/32)*math.sin(2*mu) + (21*e1**2/16 - 55*e1**4/32)*math.sin(4*mu) + (151*e1**3/96)*math.sin(6*mu) + (1097*e1**4/512)*math.sin(8*mu)
    sin_fp, cos_fp, tan_fp = math.sin(fp), math.cos(fp), math.tan(fp)
    c1, t1 = ecc_prime_sq * cos_fp**2, tan_fp**2
    n1 = a / math.sqrt(1 - ecc_sq * sin_fp**2)
    r1 = a * (1 - ecc_sq) / (1 - ecc_sq * sin_fp**2) ** 1.5
    d = x / (n1 * k0)
    lat = fp - (n1*tan_fp/r1) * (d**2/2 - (5+3*t1+10*c1-4*c1**2-9*ecc_prime_sq)*d**4/24 + (61+90*t1+298*c1+45*t1**2-252*ecc_prime_sq-3*c1**2)*d**6/720)
    lon = (d - (1+2*t1+c1)*d**3/6 + (5-2*c1+28*t1-3*c1**2+8*ecc_prime_sq+24*t1**2)*d**5/120) / cos_fp
    return math.degrees(lon) - 123.0, math.degrees(lat)


def read_stations() -> list[dict]:
    master = list(csv.DictReader(MASTER.open("r", newline="", encoding="utf-8-sig")))
    by_name = {normalize(row["long name"]): row for row in master}
    by_short = {normalize(row["short name"]): row for row in master if row.get("short name")}
    known = [(float(row["long"]), float(row["lat"]), clean(row["region"]).title()) for row in master]
    lines = RUN27_STATIONS.read_text(encoding="utf-8", errors="replace").splitlines()
    count = int(lines[1].strip())
    pattern = re.compile(r'^\s*(\d+)\s+(\S+)\s+(\S+)\s+\S+\s+!\s*(\S+)\s+\S+\s+"?(.*?)"?\s*$')
    stations = []
    used_catalog_ids = set()
    for line in lines[2:2 + count]:
        match = pattern.match(line)
        if not match:
            raise ValueError(f"Cannot parse SCHISM station: {line}")
        index, x, y, short_name, long_name = match.groups()
        longitude, latitude = utm10_to_lonlat(float(x), float(y))
        catalog = by_short.get(normalize(short_name)) or by_name.get(normalize(long_name))
        catalog_id = str(int(float(catalog["station #"]))) if catalog else None
        if catalog and catalog_id not in used_catalog_ids:
            station_id, region = catalog_id, clean(catalog["region"]).title()
            used_catalog_ids.add(catalog_id)
        else:
            station_id = f"schism-{index}"
            region = min(known, key=lambda item: (item[0]-longitude)**2 + (item[1]-latitude)**2)[2]
        stations.append({"station_id": station_id, "region": region, "long_name": clean(long_name), "short_name": clean(short_name), "schism_index": index, "latitude": latitude, "longitude": longitude})
    if len(stations) != 408 or len({item["station_id"] for item in stations}) != 408:
        raise RuntimeError("Expected 408 uniquely identified stations shared by runs 27, 30, and 31")
    return stations


def read_run(run: str, by_schism: dict[str, dict]) -> tuple[dict, set[str]]:
    values = defaultdict(dict)
    dates = set()
    with (SCHISM_DIR / f"run_{run}_EC_daily_mean_full_extent.csv").open("r", newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        selected = []
        for column, name in enumerate(next(reader)[1:], 1):
            match = re.match(r"^(\d+)_", name)
            station = by_schism.get(str(int(match.group(1)))) if match else None
            if station: selected.append((column, station["station_id"]))
        for row in reader:
            if not row: continue
            day = row[0][:10]; dates.add(day)
            for column, station_id in selected:
                if column < len(row) and row[column]: values[station_id][day] = float(row[column])
    return values, dates


def main() -> None:
    stations = read_stations()
    by_schism = {station["schism_index"]: station for station in stations}
    run_values, date_sets = {}, []
    for config in RUNS:
        values, dates = read_run(config["run"], by_schism)
        run_values[config["key"]] = values; date_sets.append(dates)
    dates = sorted(set.intersection(*date_sets))
    regions = sorted({station["region"] for station in stations})
    region_indices = {region: [i for i, station in enumerate(stations) if station["region"] == region] for region in regions}
    scenarios = []
    for config in RUNS:
        station_values = [[run_values[config["key"]].get(station["station_id"], {}).get(day) for day in dates] for station in stations]
        region_values = {region: [round(sum(items)/len(items), 2) if (items := [station_values[i][d] for i in indices if station_values[i][d] is not None]) else None for d in range(len(dates))] for region, indices in region_indices.items()}
        scenarios.append({**config, "stationCount": len(stations), "stationValues": station_values, "regionValues": region_values})
    payload = {"generatedAt": datetime.now().isoformat(timespec="seconds"), "metric":"EC", "units":"uS/cm", "aggregation":"Daily station mean. The UI calculates selected SCHISM run minus base SCHISM run over the 408 stations and dates shared by runs 27, 30, and 31.", "startDate":dates[0], "endDate":dates[-1], "dates":dates, "regions":regions, "stations":stations, "scenarios":scenarios}
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {OUT}\nDates: {dates[0]} to {dates[-1]} ({len(dates)})\nShared stations: {len(stations)}")


if __name__ == "__main__": main()
