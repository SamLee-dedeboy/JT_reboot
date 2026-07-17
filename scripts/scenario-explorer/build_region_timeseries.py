import csv
import importlib.util
import json
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT.parent / "data"
BASELINE_DIR = DATA_DIR / "baseline"
SCHISM_DIR = DATA_DIR / "baseline_schism"
SUMMARY_SCRIPT = ROOT / "scripts" / "build_baseline_summary.py"

TEAM_STEMS = ["Base_Com", "Base_Ecolo", "Base_Econo", "Base_EJdef", "Base_Recr"]
DATASETS = {
    "ec_avg_avg": {
        "label": "EC-AVG-AVG",
        "parameter": "EC-AVG-AVG",
        "suffix": "EC-AVG-AVG",
        "out": ROOT / "public" / "data" / "region_ec_avg_avg_timeseries.json",
    },
    "ec": {
        "label": "EC",
        "parameter": "EC",
        "suffix": "EC",
        "out": ROOT / "public" / "data" / "region_ec_timeseries.json",
    },
}
DIFF_OUT = ROOT / "public" / "data" / "region_ec_minus_avg_timeseries.json"
MODEL_DIFF_OUT = ROOT / "public" / "data" / "region_schism_minus_rma_ec_timeseries.json"
SCHISM_FULL_OUT = ROOT / "public" / "data" / "region_schism_ec_timeseries.json"
SCHISM_EC = SCHISM_DIR / "run_15_salinity_raw_Daily_Maximum_15_Minutes_Raw_processed_EC.csv"
SCHISM_CROSSWALK = SCHISM_DIR / "shared_station_crosswalk.csv"
SCHISM_ONLY = SCHISM_DIR / "schism_index_not_in_finalized_archive_index.csv"
START_DATE = "2018-10-01"


def load_summary_helpers():
    spec = importlib.util.spec_from_file_location("baseline_summary", SUMMARY_SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def canonical_region(value):
    text = " ".join(str(value or "").split())
    if not text:
        return ""
    known = {
        "central bay": "Central Bay",
        "central delta": "Central Delta",
        "confluence": "Confluence",
        "north delta": "North Delta",
        "san pablo bay": "San Pablo Bay",
        "south bay": "South Bay",
        "south delta": "South Delta",
        "suisun bay": "Suisun Bay",
    }
    return known.get(text.lower(), text.title())


def build_dataset(helpers, station_regions, station_labels, config):
    seen_stations = set()
    region_station_names = defaultdict(set)
    region_station_keys = defaultdict(set)
    station_meta = {}
    station_daily = defaultdict(dict)
    daily = defaultdict(dict)
    unmatched = set()

    for stem in TEAM_STEMS:
        file_name = f"{stem}_JT_BASE_EC_{config['suffix']}.csv"
        path = BASELINE_DIR / file_name
        with path.open("r", newline="", encoding="utf-8-sig") as fh:
            reader = csv.reader(fh)
            header = next(reader)
            selected = []
            for idx, station_name in enumerate(header[1:], 1):
                key = helpers.norm_name(station_name)
                if key in seen_stations:
                    continue
                region = station_regions.get(key)
                if not region:
                    unmatched.add(station_name)
                    continue
                label = station_labels.get(key, station_name)
                seen_stations.add(key)
                region_station_names[region].add(label)
                region_station_keys[region].add(key)
                station_meta[key] = {"name": label, "region": region}
                selected.append((idx, region, key))

            for row in reader:
                if not row:
                    continue
                day = row[0][:10]
                if day < START_DATE:
                    continue
                for idx, region, key in selected:
                    if idx >= len(row) or row[idx] == "":
                        continue
                    value = float(row[idx])
                    daily[day][region] = max(value, daily[day].get(region, value))
                    station_daily[key][day] = max(value, station_daily[key].get(day, value))

    dates = sorted(daily.keys())
    regions = sorted(region_station_names.keys())
    region_payload = []
    all_values = []
    for region in regions:
        values = []
        station_series = []
        for key in sorted(region_station_keys[region], key=lambda item: station_meta[item]["name"]):
            station_values = []
            for day in dates:
                value = station_daily[key].get(day)
                value = round(value, 3) if value is not None else None
                station_values.append(value)
                if value is not None:
                    all_values.append(value)
            valid_station_values = [value for value in station_values if value is not None]
            station_series.append(
                {
                    "name": station_meta[key]["name"],
                    "values": station_values,
                    "mean": round(sum(valid_station_values) / len(valid_station_values), 3) if valid_station_values else None,
                    "min": min(valid_station_values) if valid_station_values else None,
                    "max": max(valid_station_values) if valid_station_values else None,
                }
            )
        station_series.sort(key=lambda row: (row["mean"] is None, row["mean"] or 0, row["name"]))
        for day in dates:
            value = daily[day].get(region)
            value = round(value, 3) if value is not None else None
            values.append(value)
            if value is not None:
                all_values.append(value)
        valid_values = [value for value in values if value is not None]
        region_payload.append(
            {
                "name": region,
                "stationCount": len(region_station_names[region]),
                "stations": sorted(region_station_names[region]),
                "stationSeries": station_series,
                "values": values,
                "mean": round(sum(valid_values) / len(valid_values), 3) if valid_values else None,
                "min": min(valid_values) if valid_values else None,
                "max": max(valid_values) if valid_values else None,
            }
        )

    region_payload.sort(key=lambda row: (row["mean"] is None, -(row["mean"] or 0)))
    payload = {
        "generatedAt": __import__("datetime").datetime.now().isoformat(timespec="seconds"),
        "metric": config["label"],
        "source": f"Daily regional maxima from unique stations in all {config['parameter']} baseline CSVs, grouped by ALL POINT STATIONS FINALIZED region.",
        "startDate": START_DATE,
        "units": "uS/cm",
        "dates": dates,
        "min": min(all_values),
        "max": max(all_values),
        "regions": region_payload,
        "stationCount": len(seen_stations),
        "unmatchedStations": sorted(unmatched),
    }
    config["out"].parent.mkdir(parents=True, exist_ok=True)
    config["out"].write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {config['out']}")
    print(f"{config['label']}: {len(regions)} regions, {len(dates)} days, {len(seen_stations)} unique matched baseline stations")
    if unmatched:
        print(f"{len(unmatched)} unmatched stations skipped: {', '.join(sorted(unmatched)[:8])}")
    return payload


def build_difference_dataset(ec_payload, avg_payload):
    common_dates = sorted(set(ec_payload["dates"]) & set(avg_payload["dates"]))
    ec_date_index = {day: idx for idx, day in enumerate(ec_payload["dates"])}
    avg_date_index = {day: idx for idx, day in enumerate(avg_payload["dates"])}
    avg_regions = {region["name"]: region for region in avg_payload["regions"]}
    region_payload = []
    all_values = []

    for ec_region in ec_payload["regions"]:
        region_name = ec_region["name"]
        avg_region = avg_regions.get(region_name)
        if not avg_region:
            continue
        avg_station_map = {station["name"]: station for station in avg_region["stationSeries"]}
        station_series = []
        for ec_station in ec_region["stationSeries"]:
            avg_station = avg_station_map.get(ec_station["name"])
            if not avg_station:
                continue
            values = []
            for day in common_dates:
                ec_value = ec_station["values"][ec_date_index[day]]
                avg_value = avg_station["values"][avg_date_index[day]]
                value = round(ec_value - avg_value, 3) if ec_value is not None and avg_value is not None else None
                values.append(value)
                if value is not None:
                    all_values.append(value)
            valid_values = [value for value in values if value is not None]
            station_series.append(
                {
                    "name": ec_station["name"],
                    "values": values,
                    "mean": round(sum(valid_values) / len(valid_values), 3) if valid_values else None,
                    "min": min(valid_values) if valid_values else None,
                    "max": max(valid_values) if valid_values else None,
                }
            )

        station_series.sort(key=lambda row: (row["mean"] is None, abs(row["mean"] or 0), row["name"]))
        region_values = []
        for idx in range(len(common_dates)):
            day_values = [station["values"][idx] for station in station_series if station["values"][idx] is not None]
            value = round(max(day_values), 3) if day_values else None
            region_values.append(value)
            if value is not None:
                all_values.append(value)
        valid_region_values = [value for value in region_values if value is not None]
        region_payload.append(
            {
                "name": region_name,
                "stationCount": len(station_series),
                "stations": [station["name"] for station in station_series],
                "stationSeries": station_series,
                "values": region_values,
                "mean": round(sum(valid_region_values) / len(valid_region_values), 3) if valid_region_values else None,
                "min": min(valid_region_values) if valid_region_values else None,
                "max": max(valid_region_values) if valid_region_values else None,
            }
        )

    region_payload.sort(key=lambda row: (row["mean"] is None, abs(row["mean"] or 0), row["name"]))
    payload = {
        "generatedAt": __import__("datetime").datetime.now().isoformat(timespec="seconds"),
        "metric": "EC - EC-AVG-AVG",
        "source": "Daily station maximum difference: EC daily max minus EC-AVG-AVG daily max, grouped by ALL POINT STATIONS FINALIZED region.",
        "startDate": START_DATE,
        "units": "uS/cm",
        "dates": common_dates,
        "min": min(all_values),
        "max": max(all_values),
        "regions": region_payload,
        "stationCount": sum(len(region["stationSeries"]) for region in region_payload),
        "unmatchedStations": [],
    }
    DIFF_OUT.parent.mkdir(parents=True, exist_ok=True)
    DIFF_OUT.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {DIFF_OUT}")
    print(f"EC - EC-AVG-AVG: {len(region_payload)} regions, {len(common_dates)} days, {payload['stationCount']} station differences")
    return payload


def build_schism_rma_difference(ec_payload, helpers):
    rma_station_map = {}
    for region in ec_payload["regions"]:
        for station in region["stationSeries"]:
            rma_station_map[helpers.norm_name(station["name"])] = station

    crosswalk_rows = list(csv.DictReader(SCHISM_CROSSWALK.open("r", encoding="utf-8-sig")))
    with SCHISM_EC.open("r", newline="", encoding="utf-8-sig") as fh:
        reader = csv.reader(fh)
        header = next(reader)
        column_indices = {name: idx for idx, name in enumerate(header)}
        selected = []
        for row in crosswalk_rows:
            rma_station = rma_station_map.get(helpers.norm_name(row["long name"]))
            column_idx = column_indices.get(row["schism_csv_column"])
            if not rma_station or column_idx is None:
                continue
            selected.append(
                {
                    "region": row["region"],
                    "name": row["long name"],
                    "rma_station": rma_station,
                    "column_idx": column_idx,
                }
            )

        schism_by_day = defaultdict(dict)
        for values in reader:
            if not values:
                continue
            day = values[0][:10]
            if day < START_DATE:
                continue
            for item in selected:
                idx = item["column_idx"]
                if idx >= len(values) or values[idx] == "":
                    continue
                schism_by_day[day][item["name"]] = float(values[idx])

    common_dates = sorted(set(ec_payload["dates"]) & set(schism_by_day))
    rma_date_index = {day: idx for idx, day in enumerate(ec_payload["dates"])}
    stations_by_region = defaultdict(list)
    all_values = []

    for item in selected:
        station_values = []
        for day in common_dates:
            schism_value = schism_by_day.get(day, {}).get(item["name"])
            rma_value = item["rma_station"]["values"][rma_date_index[day]]
            value = round(schism_value - rma_value, 3) if schism_value is not None and rma_value is not None else None
            station_values.append(value)
            if value is not None:
                all_values.append(value)
        valid_values = [value for value in station_values if value is not None]
        if not valid_values:
            continue
        stations_by_region[item["region"]].append(
            {
                "name": item["name"],
                "values": station_values,
                "mean": round(sum(valid_values) / len(valid_values), 3),
                "min": min(valid_values),
                "max": max(valid_values),
            }
        )

    region_payload = []
    for region, station_series in stations_by_region.items():
        station_series.sort(key=lambda row: (row["mean"] is None, abs(row["mean"] or 0), row["name"]))
        region_values = []
        for idx in range(len(common_dates)):
            day_values = [station["values"][idx] for station in station_series if station["values"][idx] is not None]
            value = round(max(day_values), 3) if day_values else None
            region_values.append(value)
            if value is not None:
                all_values.append(value)
        valid_region_values = [value for value in region_values if value is not None]
        region_payload.append(
            {
                "name": region,
                "stationCount": len(station_series),
                "stations": [station["name"] for station in station_series],
                "stationSeries": station_series,
                "values": region_values,
                "mean": round(sum(valid_region_values) / len(valid_region_values), 3) if valid_region_values else None,
                "min": min(valid_region_values) if valid_region_values else None,
                "max": max(valid_region_values) if valid_region_values else None,
            }
        )

    region_payload.sort(key=lambda row: (row["mean"] is None, abs(row["mean"] or 0), row["name"]))
    payload = {
        "generatedAt": __import__("datetime").datetime.now().isoformat(timespec="seconds"),
        "metric": "SCHISM Run 15 - RMA EC",
        "source": "Daily maximum difference over overlapping dates and shared stations: SCHISM Run 15 EC minus RMA EC.",
        "startDate": START_DATE,
        "units": "uS/cm",
        "dates": common_dates,
        "min": min(all_values) if all_values else None,
        "max": max(all_values) if all_values else None,
        "regions": region_payload,
        "stationCount": sum(len(region["stationSeries"]) for region in region_payload),
        "unmatchedStations": [],
    }
    MODEL_DIFF_OUT.parent.mkdir(parents=True, exist_ok=True)
    MODEL_DIFF_OUT.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {MODEL_DIFF_OUT}")
    print(
        f"SCHISM Run 15 - RMA EC: {len(region_payload)} regions, {len(common_dates)} days, "
        f"{payload['stationCount']} shared station differences"
    )
    return payload


def build_schism_dataset():
    def as_float(value):
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    def nearest_region(x, y, candidates):
        if x is None or y is None or not candidates:
            return None, None
        nearest = min(candidates, key=lambda item: (item["x"] - x) ** 2 + (item["y"] - y) ** 2)
        distance = ((nearest["x"] - x) ** 2 + (nearest["y"] - y) ** 2) ** 0.5
        return nearest["region"], round(distance, 3)

    station_meta = {}
    nearest_candidates = []
    for row in csv.DictReader(SCHISM_CROSSWALK.open("r", encoding="utf-8-sig")):
        column = row.get("schism_csv_column", "")
        region = canonical_region(row.get("region"))
        x = as_float(row.get("station_in_x"))
        y = as_float(row.get("station_in_y"))
        if region and x is not None and y is not None:
            nearest_candidates.append({"region": region, "x": x, "y": y})
        if not column:
            continue
        station_meta[column] = {
            "name": row.get("long name") or row.get("schism_csv_name") or column,
            "region": region or "Unmapped SCHISM Stations",
            "assignment": "archive-index match" if region else "unmapped",
        }

    inferred_assignments = []
    if SCHISM_ONLY.exists():
        for row in csv.DictReader(SCHISM_ONLY.open("r", encoding="utf-8-sig")):
            column = row.get("schism_csv_column", "")
            if not column:
                continue
            x = as_float(row.get("station_in_x"))
            y = as_float(row.get("station_in_y"))
            region, distance = nearest_region(x, y, nearest_candidates)
            name = row.get("schism_csv_name") or row.get("station_in_name") or column
            if region:
                inferred_assignments.append(
                    {
                        "station": name,
                        "schismColumn": column,
                        "assignedRegion": region,
                        "nearestDistance": distance,
                    }
                )
            station_meta[column] = {
                "name": name,
                "region": region or "Unmapped SCHISM Stations",
                "assignment": "nearest-neighbor coordinates" if region else "unmapped",
            }

    station_daily = defaultdict(dict)
    daily = defaultdict(dict)
    region_station_names = defaultdict(set)
    region_station_keys = defaultdict(set)
    all_values = []

    with SCHISM_EC.open("r", newline="", encoding="utf-8-sig") as fh:
        reader = csv.reader(fh)
        header = next(reader)
        selected = []
        for idx, column in enumerate(header[1:], 1):
            meta = station_meta.get(column)
            if not meta:
                name = column.split("_", 1)[1] if "_" in column else column
                meta = {"name": name, "region": "Unmapped SCHISM Stations", "assignment": "unmapped"}
                station_meta[column] = meta
            selected.append((idx, column, meta["region"]))
            region_station_names[meta["region"]].add(meta["name"])
            region_station_keys[meta["region"]].add(column)

        for row in reader:
            if not row:
                continue
            day = row[0][:10]
            if day < START_DATE:
                continue
            for idx, column, region in selected:
                if idx >= len(row) or row[idx] == "":
                    continue
                value = float(row[idx])
                daily[day][region] = max(value, daily[day].get(region, value))
                station_daily[column][day] = max(value, station_daily[column].get(day, value))

    dates = sorted(daily.keys())
    region_payload = []
    for region in sorted(region_station_names):
        station_series = []
        for column in sorted(region_station_keys[region], key=lambda key: station_meta[key]["name"]):
            values = []
            for day in dates:
                value = station_daily[column].get(day)
                value = round(value, 3) if value is not None else None
                values.append(value)
                if value is not None:
                    all_values.append(value)
            valid_values = [value for value in values if value is not None]
            station_series.append(
                {
                    "name": station_meta[column]["name"],
                    "assignment": station_meta[column].get("assignment", ""),
                    "values": values,
                    "mean": round(sum(valid_values) / len(valid_values), 3) if valid_values else None,
                    "min": min(valid_values) if valid_values else None,
                    "max": max(valid_values) if valid_values else None,
                }
            )

        station_series.sort(key=lambda row: (row["mean"] is None, row["mean"] or 0, row["name"]))
        region_values = []
        for day in dates:
            value = daily[day].get(region)
            value = round(value, 3) if value is not None else None
            region_values.append(value)
            if value is not None:
                all_values.append(value)
        valid_region_values = [value for value in region_values if value is not None]
        region_payload.append(
            {
                "name": region,
                "stationCount": len(station_series),
                "stations": [station["name"] for station in station_series],
                "stationSeries": station_series,
                "values": region_values,
                "mean": round(sum(valid_region_values) / len(valid_region_values), 3) if valid_region_values else None,
                "min": min(valid_region_values) if valid_region_values else None,
                "max": max(valid_region_values) if valid_region_values else None,
            }
        )

    region_payload.sort(key=lambda row: (row["mean"] is None, -(row["mean"] or 0), row["name"]))
    payload = {
        "generatedAt": __import__("datetime").datetime.now().isoformat(timespec="seconds"),
        "metric": "SCHISM Run 15 EC",
        "source": "Daily maximum EC from all SCHISM Run 15 station columns; archive-index matched stations are grouped by finalized region and SCHISM-only stations are assigned by nearest archive-matched station_in x/y coordinates.",
        "startDate": START_DATE,
        "units": "uS/cm",
        "dates": dates,
        "min": min(all_values) if all_values else None,
        "max": max(all_values) if all_values else None,
        "regions": region_payload,
        "stationCount": sum(len(region["stationSeries"]) for region in region_payload),
        "unmatchedStations": sorted(region_station_names.get("Unmapped SCHISM Stations", [])),
        "inferredRegionAssignments": inferred_assignments,
    }
    SCHISM_FULL_OUT.parent.mkdir(parents=True, exist_ok=True)
    SCHISM_FULL_OUT.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {SCHISM_FULL_OUT}")
    print(f"SCHISM Run 15 EC: {len(region_payload)} groups, {len(dates)} days, {payload['stationCount']} station columns")
    print(f"Assigned {len(inferred_assignments)} SCHISM-only station columns by nearest-neighbor coordinates")
    return payload


def main():
    helpers = load_summary_helpers()
    sheets = helpers.xlsx_sheets(DATA_DIR / "ALL POINT STATIONS_FINAL REVISION_MAY 2026.xlsx")
    station_rows = helpers.station_rows(sheets["ALL POINT STATIONS FINALIZED"])
    station_regions = {helpers.norm_name(row["longName"]): canonical_region(row["region"]) for row in station_rows if row["region"]}
    station_labels = {helpers.norm_name(row["longName"]): row["longName"] for row in station_rows}

    payloads = {}
    for key, config in DATASETS.items():
        payloads[key] = build_dataset(helpers, station_regions, station_labels, config)
    build_difference_dataset(payloads["ec"], payloads["ec_avg_avg"])
    build_schism_dataset()
    build_schism_rma_difference(payloads["ec"], helpers)


if __name__ == "__main__":
    main()
