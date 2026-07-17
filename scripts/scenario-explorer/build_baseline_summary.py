import csv
import json
import math
import re
import statistics
import zipfile
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT.parent / "data"
BASELINE_DIR = DATA_DIR / "baseline"
OUT_DIR = ROOT / "public" / "data"
OUT_PATH = OUT_DIR / "baseline_summary.json"
WORKBOOK = DATA_DIR / "ALL POINT STATIONS_FINAL REVISION_MAY 2026.xlsx"

TEAM_CONFIG = {
    "Com": {"sheet": "RMA - EJ Community Locations", "label": "Community", "stem": "Base_Com"},
    "Ecolo": {"sheet": "RMA - Ecology", "label": "Ecology", "stem": "Base_Ecolo"},
    "Econo": {"sheet": "RMA - Economy", "label": "Economy", "stem": "Base_Econo"},
    "EJdef": {"sheet": "RMA - EJ DEFAULT", "label": "EJ Default", "stem": "Base_EJdef"},
    "Recr": {"sheet": "RMA - Recreation", "label": "Recreation", "stem": "Base_Recr"},
}


def norm_name(value):
    return re.sub(r"[^a-z0-9]+", "", str(value or "").strip().lower())


def clean(value):
    if value is None:
        return ""
    text = str(value).strip()
    if text.endswith(".0") and text[:-2].isdigit():
        return text[:-2]
    return re.sub(r"\s+", " ", text)


def xlsx_sheets(path):
    ns = {
        "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
        "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    }
    with zipfile.ZipFile(path) as zf:
        shared = []
        if "xl/sharedStrings.xml" in zf.namelist():
            root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
            for si in root.findall("a:si", ns):
                shared.append("".join(t.text or "" for t in si.findall(".//a:t", ns)))

        workbook = ET.fromstring(zf.read("xl/workbook.xml"))
        rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
        rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}
        sheets = {}

        for sheet in workbook.findall(".//a:sheet", ns):
            name = sheet.attrib["name"]
            rid = sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
            target = "xl/" + rel_map[rid].lstrip("/")
            rows = []
            root = ET.fromstring(zf.read(target))
            for row in root.findall(".//a:sheetData/a:row", ns):
                values = {}
                for cell in row.findall("a:c", ns):
                    ref = cell.attrib.get("r", "")
                    col = re.sub(r"\d+", "", ref)
                    idx = 0
                    for char in col:
                        idx = idx * 26 + ord(char.upper()) - 64
                    value_node = cell.find("a:v", ns)
                    value = "" if value_node is None else value_node.text
                    if cell.attrib.get("t") == "s" and value != "":
                        value = shared[int(value)]
                    values[idx - 1] = value
                if values:
                    rows.append([values.get(i, "") for i in range(max(values) + 1)])
            sheets[name] = rows
        return sheets


def utm10_to_latlon(easting, northing):
    # Inverse UTM, WGS84/NAD83 ellipsoid. Workbook X/Y values are Zone 10N meters.
    a = 6378137.0
    e2 = 0.0066943799901413165
    e1sq = e2 / (1 - e2)
    k0 = 0.9996
    x = float(easting) - 500000.0
    y = float(northing)
    lon0 = math.radians(-123.0)
    m = y / k0
    mu = m / (a * (1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2**3 / 256))
    e1 = (1 - math.sqrt(1 - e2)) / (1 + math.sqrt(1 - e2))
    j1 = 3 * e1 / 2 - 27 * e1**3 / 32
    j2 = 21 * e1 * e1 / 16 - 55 * e1**4 / 32
    j3 = 151 * e1**3 / 96
    j4 = 1097 * e1**4 / 512
    fp = mu + j1 * math.sin(2 * mu) + j2 * math.sin(4 * mu) + j3 * math.sin(6 * mu) + j4 * math.sin(8 * mu)
    sin_fp = math.sin(fp)
    cos_fp = math.cos(fp)
    tan_fp = math.tan(fp)
    c1 = e1sq * cos_fp * cos_fp
    t1 = tan_fp * tan_fp
    n1 = a / math.sqrt(1 - e2 * sin_fp * sin_fp)
    r1 = a * (1 - e2) / (1 - e2 * sin_fp * sin_fp) ** 1.5
    d = x / (n1 * k0)
    lat = fp - (n1 * tan_fp / r1) * (
        d * d / 2
        - (5 + 3 * t1 + 10 * c1 - 4 * c1 * c1 - 9 * e1sq) * d**4 / 24
        + (61 + 90 * t1 + 298 * c1 + 45 * t1 * t1 - 252 * e1sq - 3 * c1 * c1) * d**6 / 720
    )
    lon = lon0 + (
        d
        - (1 + 2 * t1 + c1) * d**3 / 6
        + (5 - 2 * c1 + 28 * t1 - 3 * c1 * c1 + 8 * e1sq + 24 * t1 * t1) * d**5 / 120
    ) / cos_fp
    return round(math.degrees(lat), 7), round(math.degrees(lon), 7)


def station_rows(rows):
    headers = [clean(v) for v in rows[0]]
    out = []
    for raw in rows[1:]:
        if not any(clean(v) for v in raw):
            continue
        row = {headers[i]: clean(raw[i]) if i < len(raw) else "" for i in range(len(headers))}
        if not row.get("Long Name"):
            continue
        lat = lon = None
        if row.get("X") and row.get("Y"):
            try:
                lat, lon = utm10_to_latlon(row["X"], row["Y"])
            except ValueError:
                pass
        out.append(
            {
                "stationNumber": row.get("STATION #", ""),
                "region": row.get("REGION", ""),
                "longName": row.get("Long Name", ""),
                "origin": row.get("ORIGIN", ""),
                "x": float(row["X"]) if row.get("X") else None,
                "y": float(row["Y"]) if row.get("Y") else None,
                "lat": lat,
                "lon": lon,
                "shortName": row.get("Short Name", ""),
                "archiveIndex": row.get("Archive Index", ""),
            }
        )
    return out


def csv_header(path):
    with path.open("r", newline="", encoding="utf-8-sig") as fh:
        return next(csv.reader(fh))[1:]


def percentile(values, pct):
    if not values:
        return None
    ordered = sorted(values)
    idx = int(round((len(ordered) - 1) * pct))
    return ordered[idx]


def compare_pair(team_key, ec_path, avg_path, shared_stations):
    with ec_path.open("r", newline="", encoding="utf-8-sig") as ec_fh, avg_path.open("r", newline="", encoding="utf-8-sig") as avg_fh:
        ec_reader = csv.reader(ec_fh)
        avg_reader = csv.reader(avg_fh)
        ec_header = next(ec_reader)
        avg_header = next(avg_reader)
        ec_cols = {name: idx for idx, name in enumerate(ec_header[1:], 1)}
        avg_cols = {name: idx for idx, name in enumerate(avg_header[1:], 1)}
        names = [name for name in shared_stations if name in ec_cols and name in avg_cols]
        stats = {
            name: {"n": 0, "sum": 0.0, "sumAbs": 0.0, "maxAbs": 0.0, "sampleAbs": []}
            for name in names
        }
        compared_timestamps = 0
        ec_only_timestamps = 0
        avg_only_timestamps = 0
        ec_row = next(ec_reader, None)
        avg_row = next(avg_reader, None)
        while ec_row is not None and avg_row is not None:
            ec_time = ec_row[0]
            avg_time = avg_row[0]
            if ec_time == avg_time:
                compared_timestamps += 1
                for name in names:
                    ec_val = ec_row[ec_cols[name]] if ec_cols[name] < len(ec_row) else ""
                    avg_val = avg_row[avg_cols[name]] if avg_cols[name] < len(avg_row) else ""
                    if ec_val == "" or avg_val == "":
                        continue
                    diff = float(ec_val) - float(avg_val)
                    abs_diff = abs(diff)
                    item = stats[name]
                    item["n"] += 1
                    item["sum"] += diff
                    item["sumAbs"] += abs_diff
                    item["maxAbs"] = max(item["maxAbs"], abs_diff)
                    if len(item["sampleAbs"]) < 2000:
                        item["sampleAbs"].append(abs_diff)
                    else:
                        slot = item["n"] % 2000
                        item["sampleAbs"][slot] = abs_diff
                ec_row = next(ec_reader, None)
                avg_row = next(avg_reader, None)
            elif ec_time < avg_time:
                ec_only_timestamps += 1
                ec_row = next(ec_reader, None)
            else:
                avg_only_timestamps += 1
                avg_row = next(avg_reader, None)
        while ec_row is not None:
            ec_only_timestamps += 1
            ec_row = next(ec_reader, None)
        while avg_row is not None:
            avg_only_timestamps += 1
            avg_row = next(avg_reader, None)

    station_stats = []
    for name, item in stats.items():
        n = item["n"]
        station_stats.append(
            {
                "name": name,
                "pairedCount": n,
                "meanDiff": round(item["sum"] / n, 4) if n else None,
                "meanAbsDiff": round(item["sumAbs"] / n, 4) if n else None,
                "maxAbsDiff": round(item["maxAbs"], 4) if n else None,
                "p95AbsDiff": round(percentile(item["sampleAbs"], 0.95), 4) if n else None,
            }
        )
    station_stats.sort(key=lambda row: (row["meanAbsDiff"] is None, -(row["meanAbsDiff"] or 0)))
    valid = [row["meanAbsDiff"] for row in station_stats if row["meanAbsDiff"] is not None]
    return {
        "team": team_key,
        "comparedTimestamps": compared_timestamps,
        "ecOnlyTimestamps": ec_only_timestamps,
        "avgOnlyTimestamps": avg_only_timestamps,
        "stationStats": station_stats,
        "summary": {
            "stationCount": len(station_stats),
            "medianMeanAbsDiff": round(statistics.median(valid), 4) if valid else None,
            "maxMeanAbsDiff": round(max(valid), 4) if valid else None,
        },
    }


def main():
    sheets = xlsx_sheets(WORKBOOK)
    all_sheet_rows = station_rows(sheets["ALL POINT STATIONS FINALIZED"])
    by_norm_all = {}
    for station in all_sheet_rows:
        by_norm_all.setdefault(norm_name(station["longName"]), station)

    teams = {}
    station_union = {}
    for key, config in TEAM_CONFIG.items():
        excel_stations = station_rows(sheets[config["sheet"]])
        ec_path = BASELINE_DIR / f"{config['stem']}_JT_BASE_EC_EC.csv"
        avg_path = BASELINE_DIR / f"{config['stem']}_JT_BASE_EC_EC-AVG-AVG.csv"
        ec_names = csv_header(ec_path)
        avg_names = csv_header(avg_path)
        excel_by_norm = {norm_name(row["longName"]): row for row in excel_stations}
        ec_norms = {norm_name(name): name for name in ec_names}
        avg_norms = {norm_name(name): name for name in avg_names}
        shared_csv = [name for name in ec_names if norm_name(name) in avg_norms]

        missing_in_excel = [name for name in shared_csv if norm_name(name) not in excel_by_norm]
        excel_missing_in_csv = [
            row["longName"] for row in excel_stations if norm_name(row["longName"]) not in ec_norms and norm_name(row["longName"]) not in avg_norms
        ]
        ec_avg_mismatch = {
            "onlyInEc": [name for name in ec_names if norm_name(name) not in avg_norms],
            "onlyInAverage": [name for name in avg_names if norm_name(name) not in ec_norms],
        }

        divergence = compare_pair(key, ec_path, avg_path, shared_csv)
        teams[key] = {
            "key": key,
            "label": config["label"],
            "sheet": config["sheet"],
            "files": {"ec": ec_path.name, "average": avg_path.name},
            "excelStationCount": len(excel_stations),
            "ecStationCount": len(ec_names),
            "averageStationCount": len(avg_names),
            "stationMismatches": {
                "csvMissingFromExcel": missing_in_excel,
                "excelMissingFromCsv": excel_missing_in_csv,
                "ecVsAverage": ec_avg_mismatch,
            },
            "divergence": divergence,
        }

        for name in shared_csv:
            normalized = norm_name(name)
            station = excel_by_norm.get(normalized) or by_norm_all.get(normalized)
            if not station:
                station = {"longName": name, "lat": None, "lon": None, "region": "", "shortName": "", "stationNumber": "", "x": None, "y": None, "origin": "", "archiveIndex": ""}
            item = station_union.setdefault(
                normalized,
                {
                    **station,
                    "displayName": station.get("longName") or name,
                    "csvNames": sorted({name}),
                    "teams": [],
                    "divergence": {},
                },
            )
            item["teams"].append(key)
            item["csvNames"] = sorted(set(item["csvNames"]) | {name})

        for stat in divergence["stationStats"]:
            normalized = norm_name(stat["name"])
            if normalized in station_union:
                station_union[normalized]["divergence"][key] = stat

    stations = sorted(station_union.values(), key=lambda row: row["displayName"])
    payload = {
        "generatedAt": __import__("datetime").datetime.now().isoformat(timespec="seconds"),
        "coordinateSystem": "Workbook X/Y converted as UTM Zone 10N meters to lat/lon.",
        "teams": teams,
        "stations": stations,
        "bounds": {
            "minLat": min(row["lat"] for row in stations if row["lat"] is not None),
            "maxLat": max(row["lat"] for row in stations if row["lat"] is not None),
            "minLon": min(row["lon"] for row in stations if row["lon"] is not None),
            "maxLon": max(row["lon"] for row in stations if row["lon"] is not None),
        },
    }
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH} with {len(stations)} stations across {len(teams)} teams.")


if __name__ == "__main__":
    main()
