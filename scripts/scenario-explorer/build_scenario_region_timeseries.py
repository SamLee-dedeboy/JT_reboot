import csv
import importlib.util
import json
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from statistics import median


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT.parent / "data"
OUT = ROOT / "public" / "data" / "suisun_scenario_ec_avg_avg_timeseries.json"
SUMMARY_SCRIPT = ROOT / "scripts" / "build_baseline_summary.py"
SCENARIOS = [
    ("Business as Usual", "baseline"),
    ("Bolster & Fortify", "bolster"),
    ("Eco Machine", "ecomachine"),
    ("New Green Watershed", "newgreen"),
    ("Calling on Reserves", "reserve"),
    ("A Tunnel", "tunnel"),
]

REGION_NAMES = {
    "central bay": "Central Bay",
    "central delta": "Central Delta",
    "confluence": "Confluence",
    "north delta": "North Delta",
    "san pablo bay": "San Pablo Bay",
    "south bay": "South Bay",
    "south delta": "South Delta",
    "suisun bay": "Suisun Bay",
}
EC_FLOOR = 1.0
START_DATE = "2018-10-01"


def load_helpers():
    spec = importlib.util.spec_from_file_location("baseline_summary", SUMMARY_SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def percentile(values, fraction):
    if not values:
        return None
    if len(values) == 1:
        return values[0]
    position = (len(values) - 1) * fraction
    lower = int(position)
    upper = min(lower + 1, len(values) - 1)
    weight = position - lower
    return values[lower] * (1 - weight) + values[upper] * weight


def main():
    helpers = load_helpers()
    station_path = DATA_DIR / "all_point_stations_finalized.csv"
    with station_path.open("r", newline="", encoding="utf-8-sig") as fh:
        station_rows = list(csv.DictReader(fh))

    station_regions = {
        helpers.norm_name(row["long name"]): REGION_NAMES.get(row["region"].strip().lower(), row["region"].strip().title())
        for row in station_rows
        if row["region"].strip()
    }
    station_labels = {
        helpers.norm_name(row["long name"]): row["long name"]
        for row in station_rows
        if row["long name"].strip()
    }
    station_coordinates = {
        helpers.norm_name(row["long name"]): {
            "lat": float(row["lat"]),
            "long": float(row["long"]),
        }
        for row in station_rows
        if row["long name"].strip() and row["lat"].strip() and row["long"].strip()
    }
    station_xy = {}
    crosswalk_path = DATA_DIR / "baseline_schism" / "shared_station_crosswalk.csv"
    if crosswalk_path.exists():
        with crosswalk_path.open("r", newline="", encoding="utf-8-sig") as fh:
            for row in csv.DictReader(fh):
                if row.get("station_in_x") and row.get("station_in_y"):
                    point = {"x": float(row["station_in_x"]), "y": float(row["station_in_y"])}
                    for name_field in ("long name", "station_in_name", "schism_csv_name"):
                        if row.get(name_field):
                            station_xy[helpers.norm_name(row[name_field])] = point
    region_names = sorted(set(station_regions.values()))

    region_scenarios = {region: [] for region in region_names}
    all_values = []
    all_deviation_values = []
    all_dates = set()
    scenario_station_daily = {}

    for label, directory in SCENARIOS:
        seen_stations = set()
        daily_max = defaultdict(lambda: defaultdict(dict))
        daily_mean_parts = defaultdict(lambda: defaultdict(lambda: defaultdict(lambda: [0.0, 0])))
        files = sorted((DATA_DIR / directory).glob("*_EC-AVG-AVG.csv"))

        for path in files:
            with path.open("r", newline="", encoding="utf-8-sig") as fh:
                reader = csv.reader(fh)
                header = next(reader)
                selected = []
                for index, station_name in enumerate(header[1:], 1):
                    key = helpers.norm_name(station_name)
                    region = station_regions.get(key)
                    if not region or key in seen_stations:
                        continue
                    seen_stations.add(key)
                    selected.append((index, key, region))

                for row in reader:
                    if not row:
                        continue
                    day = row[0][:10]
                    if day < START_DATE:
                        continue
                    for index, key, region in selected:
                        if index >= len(row) or not row[index]:
                            continue
                        value = float(row[index])
                        daily_max[region][day][key] = max(value, daily_max[region][day].get(key, value))
                        parts = daily_mean_parts[region][day][key]
                        parts[0] += value
                        parts[1] += 1

        daily_mean = defaultdict(lambda: defaultdict(dict))
        for region, region_days in daily_mean_parts.items():
            for day, station_parts in region_days.items():
                for key, (total, count) in station_parts.items():
                    if count:
                        daily_mean[region][day][key] = total / count

        scenario_station_daily[label] = daily_mean
        for region in region_names:
            all_dates.update(daily_max[region])
            region_scenarios[region].append({
                "name": label,
                "stationCount": sum(1 for key in seen_stations if station_regions.get(key) == region),
                "_dailyMax": daily_max[region],
                "_dailyMean": daily_mean[region],
            })

    dates = sorted(all_dates)
    typical_by_region_day_station = defaultdict(lambda: defaultdict(dict))
    for region in region_names:
        station_keys = sorted(key for key, station_region in station_regions.items() if station_region == region)
        for day in dates:
            for key in station_keys:
                scenario_values = [
                    scenario_station_daily[label].get(region, {}).get(day, {}).get(key)
                    for label, _directory in SCENARIOS
                ]
                scenario_values = [value for value in scenario_values if value is not None]
                if scenario_values:
                    typical_by_region_day_station[region][day][key] = median(scenario_values)

    regions = []
    for region in region_names:
        region_values = []
        region_deviation_values = []
        for scenario in region_scenarios[region]:
            values = []
            deviation_values = []
            deviation_p25_values = []
            deviation_p75_values = []
            share_positive_values = []
            daily_max = scenario.pop("_dailyMax")
            daily_mean = scenario.pop("_dailyMean")
            station_keys = sorted(
                {key for day_values in daily_mean.values() for key in day_values},
                key=lambda key: station_labels.get(key, key),
            )
            station_deviation_series = {key: [] for key in station_keys}
            for day in dates:
                station_max_map = daily_max.get(day, {})
                station_values = list(station_max_map.values())
                value = round(max(station_values), 3) if station_values else None
                values.append(value)
                if value is not None:
                    all_values.append(value)
                    region_values.append(value)
                deviations = []
                day_mean = daily_mean.get(day, {})
                for key in station_keys:
                    station_value = day_mean.get(key)
                    typical = typical_by_region_day_station[region][day].get(key)
                    if station_value is None or typical is None or typical < EC_FLOOR:
                        station_deviation_series[key].append(None)
                        continue
                    station_deviation = (station_value / typical - 1) * 100
                    deviations.append(station_deviation)
                    station_deviation_series[key].append(round(station_deviation, 3))
                if deviations:
                    deviations.sort()
                    deviation = round(median(deviations), 3)
                    p25 = round(percentile(deviations, 0.25), 3)
                    p75 = round(percentile(deviations, 0.75), 3)
                    share_positive = round(sum(1 for item in deviations if item > 0) / len(deviations), 3)
                else:
                    deviation = None
                    p25 = None
                    p75 = None
                    share_positive = None
                deviation_values.append(deviation)
                deviation_p25_values.append(p25)
                deviation_p75_values.append(p75)
                share_positive_values.append(share_positive)
                if deviation is not None:
                    all_deviation_values.append(deviation)
                    region_deviation_values.append(deviation)
            valid = [value for value in values if value is not None]
            valid_deviations = [value for value in deviation_values if value is not None]
            station_series = []
            for key, station_values in station_deviation_series.items():
                valid_station_values = [value for value in station_values if value is not None]
                station_series.append({
                    "key": key,
                    "name": station_labels.get(key, key),
                    "lat": station_coordinates.get(key, {}).get("lat"),
                    "long": station_coordinates.get(key, {}).get("long"),
                    "x": station_xy.get(key, {}).get("x"),
                    "y": station_xy.get(key, {}).get("y"),
                    "values": station_values,
                    "mean": round(sum(valid_station_values) / len(valid_station_values), 3) if valid_station_values else None,
                    "min": min(valid_station_values) if valid_station_values else None,
                    "max": max(valid_station_values) if valid_station_values else None,
                })
            scenario.update({
                "values": values,
                "mean": round(sum(valid) / len(valid), 3) if valid else None,
                "min": min(valid) if valid else None,
                "max": max(valid) if valid else None,
                "deviationValues": deviation_values,
                "deviationP25": deviation_p25_values,
                "deviationP75": deviation_p75_values,
                "sharePositive": share_positive_values,
                "stationDeviationSeries": station_series,
                "deviationMean": round(sum(valid_deviations) / len(valid_deviations), 3) if valid_deviations else None,
                "deviationMin": min(valid_deviations) if valid_deviations else None,
                "deviationMax": max(valid_deviations) if valid_deviations else None,
            })
        regions.append({
            "name": region,
            "min": min(region_values),
            "max": max(region_values),
            "deviationMin": min(region_deviation_values) if region_deviation_values else None,
            "deviationMax": max(region_deviation_values) if region_deviation_values else None,
            "scenarios": region_scenarios[region],
        })

    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "metric": "EC-AVG-AVG",
        "source": "Daily regional maxima from unique stations in each adaptation scenario's EC-AVG-AVG CSVs.",
        "startDate": START_DATE,
        "aggregation": "Raw view uses daily maximum across matched stations. Deviation view uses daily-mean station EC-AVG-AVG percent deviation from the six-scenario station median, then regional median across stations.",
        "units": "uS/cm",
        "deviationUnits": "%",
        "deviationReference": "For each station and day, the reference is the median of the six scenario daily mean EC-AVG-AVG values.",
        "deviationAggregation": "Median of station-level percent deviations within each region, scenario, and day.",
        "ecFloor": EC_FLOOR,
        "dates": dates,
        "min": min(all_values),
        "max": max(all_values),
        "deviationMin": min(all_deviation_values),
        "deviationMax": max(all_deviation_values),
        "regions": regions,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"{len(regions)} regions, {len(SCENARIOS)} scenarios, {len(dates)} days")


if __name__ == "__main__":
    main()
