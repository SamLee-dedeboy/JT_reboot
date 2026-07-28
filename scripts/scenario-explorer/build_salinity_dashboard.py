"""Build station coordinates and baseline-relative EC-AVG-AVG dashboard data."""

from __future__ import annotations

import csv
import json
import math
import os
import re
import zipfile
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from xml.etree import ElementTree as ET


PROJECT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = Path(os.environ.get("RMA_DATA_DIR", PROJECT_DIR.parent / "JT_exploration" / "RMA" / "data"))
UPDATE_DIR = Path(os.environ["RMA_UPDATE_DIR"]) if os.environ.get("RMA_UPDATE_DIR") else None
OUTPUT_DIR = Path(os.environ.get("SCENARIO_EXPLORER_OUTPUT_DIR", PROJECT_DIR / "public" / "data" / "scenario-explorer"))
WORKBOOK = DATA_DIR / "ALL POINT STATIONS_FINAL REVISION_MAY 2026.xlsx"
STATIONS_OUT = OUTPUT_DIR / "all_386_unique_stations.csv"
DASHBOARD_OUT = OUTPUT_DIR / "salinity_dashboard.json"
SHEET_NAME = "ALL POINT STATIONS FINALIZED"
START_DATE = "2018-10-01"

SCENARIOS = [
    ("baseline", "Baseline", "baseline"),
    ("bolster", "Bolster & Fortify", "bolster"),
    ("ecomachine", "Eco Machine", "ecomachine"),
    ("newgreen", "New Green Watershed", "newgreen"),
    ("reserve", "Calling on Reserves", "reserve"),
    ("tunnel", "A Tunnel", "tunnel"),
]
MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PACKAGE_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"


def normalize(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def canonical_region(value: str) -> str:
    return " ".join(part.capitalize() for part in value.split())


def column_index(reference: str) -> int:
    index = 0
    for char in re.sub(r"\d+", "", reference).upper():
        index = index * 26 + ord(char) - 64
    return index - 1


def read_sheet() -> list[list[str]]:
    with zipfile.ZipFile(WORKBOOK) as archive:
        shared = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            shared = ["".join(n.text or "" for n in item.iter(f"{{{MAIN_NS}}}t")) for item in root]
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        targets = {r.attrib["Id"]: r.attrib["Target"] for r in rels.findall(f"{{{PACKAGE_REL_NS}}}Relationship")}
        sheet_path = None
        for sheet in workbook.findall(f".//{{{MAIN_NS}}}sheet"):
            if sheet.attrib["name"] == SHEET_NAME:
                target = targets[sheet.attrib[f"{{{REL_NS}}}id"]].lstrip("/")
                sheet_path = target if target.startswith("xl/") else f"xl/{target}"
        if not sheet_path:
            raise RuntimeError(f"Worksheet not found: {SHEET_NAME}")
        root = ET.fromstring(archive.read(sheet_path))
        rows = []
        for row in root.findall(f".//{{{MAIN_NS}}}sheetData/{{{MAIN_NS}}}row"):
            values = {}
            for cell in row.findall(f"{{{MAIN_NS}}}c"):
                node = cell.find(f"{{{MAIN_NS}}}v")
                value = "" if node is None else node.text or ""
                if cell.attrib.get("t") == "s" and value:
                    value = shared[int(value)]
                values[column_index(cell.attrib.get("r", ""))] = value.strip()
            if values:
                rows.append([values.get(i, "") for i in range(max(values) + 1)])
        return rows


def utm10_to_latlon(easting: float, northing: float) -> tuple[float, float]:
    a, e2, k0 = 6378137.0, 0.0066943799901413165, 0.9996
    e1sq, x, y, lon0 = e2 / (1 - e2), easting - 500000.0, northing, math.radians(-123.0)
    m = y / k0
    mu = m / (a * (1 - e2 / 4 - 3 * e2**2 / 64 - 5 * e2**3 / 256))
    e1 = (1 - math.sqrt(1 - e2)) / (1 + math.sqrt(1 - e2))
    fp = mu + (3*e1/2-27*e1**3/32)*math.sin(2*mu) + (21*e1**2/16-55*e1**4/32)*math.sin(4*mu) + (151*e1**3/96)*math.sin(6*mu) + (1097*e1**4/512)*math.sin(8*mu)
    sinfp, cosfp, tanfp = math.sin(fp), math.cos(fp), math.tan(fp)
    c1, t1 = e1sq*cosfp**2, tanfp**2
    n1 = a / math.sqrt(1-e2*sinfp**2)
    r1 = a*(1-e2) / (1-e2*sinfp**2)**1.5
    d = x/(n1*k0)
    lat = fp-(n1*tanfp/r1)*(d**2/2-(5+3*t1+10*c1-4*c1**2-9*e1sq)*d**4/24+(61+90*t1+298*c1+45*t1**2-252*e1sq-3*c1**2)*d**6/720)
    lon = lon0+(d-(1+2*t1+c1)*d**3/6+(5-2*c1+28*t1-3*c1**2+8*e1sq+24*t1**2)*d**5/120)/cosfp
    return round(math.degrees(lat), 7), round(math.degrees(lon), 7)


def selected_station_ids() -> set[str]:
    ids = set()
    for path in (DATA_DIR / "baseline_station_lists").glob("Base_*_station_list.csv"):
        with path.open(newline="", encoding="utf-8-sig") as handle:
            ids.update(str(int(float(row["station #"]))) for row in csv.DictReader(handle))
    if len(ids) != 386:
        raise RuntimeError(f"Expected 386 unique stations, found {len(ids)}")
    return ids


def build_stations() -> list[dict]:
    rows = read_sheet()
    headers = [v.strip() for v in rows[0]]
    selected = selected_station_ids()
    stations = []
    for values in rows[1:]:
        row = {headers[i]: values[i].strip() if i < len(values) else "" for i in range(len(headers)) if headers[i]}
        if not row.get("STATION #"):
            continue
        station_id = str(int(float(row["STATION #"])))
        if station_id not in selected:
            continue
        x, y = float(row["X"]), float(row["Y"])
        lat, lon = utm10_to_latlon(x, y)
        stations.append({
            "station_id": station_id, "region": canonical_region(row.get("REGION", "")),
            "long_name": row.get("Long Name", "").strip(), "short_name": row.get("Short Name", "").strip(),
            "origin": row.get("ORIGIN", "").strip(), "archive_index": row.get("Archive Index", "").strip(),
            "x": x, "y": y, "latitude": lat, "longitude": lon,
        })
    stations.sort(key=lambda row: int(row["station_id"]))
    if len(stations) != 386:
        raise RuntimeError(f"Expected 386 workbook rows, found {len(stations)}")
    STATIONS_OUT.parent.mkdir(parents=True, exist_ok=True)
    with STATIONS_OUT.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(stations[0]))
        writer.writeheader(); writer.writerows(stations)
    return stations


def read_scenario(directory: str, station_by_name: dict[str, int]) -> dict[int, dict[str, float]]:
    totals = defaultdict(lambda: defaultdict(lambda: [0.0, 0]))
    seen = set()
    paths = {path.name: path for path in (DATA_DIR / directory).glob("*_EC-AVG-AVG.csv")}
    if UPDATE_DIR:
        scenario_prefix = {"reserve": "COR_", "tunnel": "DCP_", "newgreen": "NGW_"}.get(directory)
        if scenario_prefix:
            paths.update({path.name: path for path in UPDATE_DIR.glob(f"{scenario_prefix}*_EC-AVG-AVG.csv")})
    for path in sorted(paths.values(), key=lambda item: item.name):
        with path.open(newline="", encoding="utf-8-sig") as handle:
            reader = csv.reader(handle)
            selected = []
            for index, name in enumerate(next(reader)[1:], 1):
                station_index = station_by_name.get(normalize(name))
                if station_index is not None and station_index not in seen:
                    seen.add(station_index); selected.append((index, station_index))
            for row in reader:
                if not row or row[0][:10] < START_DATE:
                    continue
                day = row[0][:10]
                for column, station_index in selected:
                    if column < len(row) and row[column]:
                        part = totals[station_index][day]
                        part[0] += float(row[column]); part[1] += 1
    return {i: {day: total/count for day, (total, count) in days.items()} for i, days in totals.items()}


def main() -> None:
    stations = build_stations()
    station_by_name = {normalize(row["long_name"]): i for i, row in enumerate(stations)}
    scenario_daily = {}
    for key, label, directory in SCENARIOS:
        print(f"Reading {label}...")
        scenario_daily[key] = read_scenario(directory, station_by_name)
    dates = sorted({day for data in scenario_daily.values() for days in data.values() for day in days})
    baseline = scenario_daily["baseline"]
    regions = sorted({row["region"] for row in stations})
    region_indices = {region: [i for i, row in enumerate(stations) if row["region"] == region] for region in regions}
    scenario_payload = []
    reference_station_values = [
        [round(value, 2) if (value := baseline.get(i, {}).get(day)) is not None else None for day in dates]
        for i in range(len(stations))
    ]
    extent = 0.0
    for key, label, _ in SCENARIOS[1:]:
        station_values = []
        for i in range(len(stations)):
            values = []
            for day in dates:
                current, base = scenario_daily[key].get(i, {}).get(day), baseline.get(i, {}).get(day)
                delta = round(current-base, 2) if current is not None and base is not None else None
                values.append(delta)
                if delta is not None: extent = max(extent, abs(delta))
            station_values.append(values)
        region_values = {}
        for region, indices in region_indices.items():
            region_values[region] = [
                round(sum(vals)/len(vals), 2) if (vals := [station_values[i][d] for i in indices if station_values[i][d] is not None]) else None
                for d in range(len(dates))
            ]
        scenario_payload.append({"key": key, "label": label, "stationValues": station_values, "regionValues": region_values})
    output = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"), "metric": "EC-AVG-AVG", "units": "µS/cm",
        "aggregation": "Daily mean per station; regional lines are the mean station delta. Delta = scenario − baseline.",
        "startDate": START_DATE, "dates": dates, "regions": regions, "deltaExtent": round(extent, 2),
        "stations": stations, "scenarios": scenario_payload,
        "referenceStationValues": reference_station_values,
    }
    DASHBOARD_OUT.parent.mkdir(parents=True, exist_ok=True)
    DASHBOARD_OUT.write_text(json.dumps(output, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {STATIONS_OUT} ({len(stations)} rows)")
    print(f"Wrote {DASHBOARD_OUT} ({len(dates)} days)")


if __name__ == "__main__":
    main()
