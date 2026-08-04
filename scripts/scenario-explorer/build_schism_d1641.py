"""Build D-1641 display/compliance data from full-range SCHISM daily EC."""

from __future__ import annotations

import csv
import json
import os
import re
from collections import defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = Path(os.environ.get("RMA_DATA_DIR", PROJECT_DIR.parent / "JT_exploration" / "RMA" / "data"))
BASE = DATA_DIR / "baseline_schism"
SCHISM_DIR = BASE / "ec_full_extent_all_stations"
CROSSWALK = BASE / "shared_station_crosswalk.csv"
OUTPUT_DIR = Path(os.environ.get("SCENARIO_EXPLORER_OUTPUT_DIR", PROJECT_DIR / "public" / "data" / "scenario-explorer"))
OUT = OUTPUT_DIR / "d1641_schism.json"
RUNS = {"run15": "15", "run30": "30", "run31": "31"}
DEFINITIONS = [
    ("EMM", "agricultural", 14), ("JER", "agricultural", 14), ("STI", "agricultural", 14), ("SAL", "agricultural", 14),
    ("SJR", "agricultural", 30), ("BDT", "agricultural", 30), ("UNI", "agricultural", 30), ("OLD", "agricultural", 30),
    ("WCI", "agricultural", 0), ("DMC", "agricultural", 0), ("JER", "ecosystem_14d", 14), ("PPT", "ecosystem_14d", 14),
]
CODE_BY_SHORT = {"emm2":"EMM", "sjj":"JER", "sti":"STI", "resal":"SAL", "vns":"SJR", "bdt":"BDT", "uni":"UNI", "old":"OLD", "wci":"WCI", "trp":"DMC", "ppt":"PPT", "cll":"CLL", "nsl":"NSL", "bdl":"BDL", "snc":"SNC", "vol":"VOL"}
MARSH = {"CLL", "NSL", "BDL", "SNC", "VOL"}


def threshold(station: str, day: date, objective: str) -> int | None:
    water_year = day.year + 1 if day.month >= 10 else day.year
    if objective == "ecosystem_14d":
        return 440 if day.month in (4, 5) else None
    if station in {"SJR", "BDT", "UNI", "OLD"}:
        return 700 if 4 <= day.month <= 8 else 1000
    if station in {"WCI", "DMC"}:
        return 1000
    if not (date(day.year, 4, 1) <= day <= date(day.year, 8, 15)):
        return None
    if water_year == 2020:
        if station == "EMM": return 450 if day <= date(2020, 6, 15) else 1670
        if station == "JER": return 450 if day <= date(2020, 6, 15) else 1350
        if station == "STI": return 450
        if station == "SAL": return 450 if day <= date(2020, 6, 25) else 580
    # Later western-Delta limits depend on an externally assigned water-year
    # type. Do not invent one; metrics remain visible without a compliance flag.
    return None


def collapse(days: set[date]) -> list[tuple[date, date]]:
    ordered = sorted(days)
    if not ordered: return []
    result, start, previous = [], ordered[0], ordered[0]
    for current in ordered[1:]:
        if current != previous + timedelta(days=1):
            result.append((start, previous)); start = current
        previous = current
    return result + [(start, previous)]


def station_map() -> tuple[dict[str, dict], dict[str, str]]:
    by_index, code_to_station = {}, {}
    with CROSSWALK.open("r", newline="", encoding="utf-8-sig") as handle:
        for row in csv.DictReader(handle):
            code = CODE_BY_SHORT.get(row.get("short name", "").strip().lower())
            if not code or not row.get("schism_index"): continue
            station_id = str(int(float(row["station #"])))
            by_index[str(int(float(row["schism_index"])))] = {"code": code, "station_id": station_id, "name": row["long name"]}
            code_to_station[code] = station_id
    return by_index, code_to_station


def read_run(run: str, by_index: dict[str, dict]) -> tuple[dict[str, dict[date, float]], list[date]]:
    values = defaultdict(dict)
    path = SCHISM_DIR / f"run_{run}_EC_daily_mean_full_extent.csv"
    with path.open("r", newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle); columns = []
        for column, name in enumerate(next(reader)[1:], 1):
            match = re.match(r"^(\d+)_", name); station = by_index.get(str(int(match.group(1)))) if match else None
            if station: columns.append((column, station["code"]))
        dates = []
        for row in reader:
            if not row: continue
            day = datetime.strptime(row[0][:10], "%Y-%m-%d").date(); dates.append(day)
            for column, code in columns:
                if column < len(row) and row[column]: values[code][day] = float(row[column])
    return values, dates


def main() -> None:
    by_index, code_to_station = station_map(); scenarios = {}
    for scenario_key, run in RUNS.items():
        values, dates = read_run(run, by_index)
        stations = {}
        for index_data in by_index.values():
            code, station_id = index_data["code"], index_data["station_id"]
            stations[station_id] = {"d1641Id": code, "fullName": index_data["name"], "regulations": [], "judgments": {}, "metrics": {}, "objectives": []}
        for code in MARSH:
            stations[code_to_station[code]]["objectives"].append({"objective":"ecosystem_high_tide_monthly", "status":"not_computable_high_tide_data_required"})
        for code, objective, window in DEFINITIONS:
            series = values.get(code, {}); station = stations[code_to_station[code]]; affected = set()
            if window:
                for day in dates:
                    observations = [series.get(day - timedelta(days=offset)) for offset in range(window)]
                    if all(value is not None for value in observations):
                        metric = sum(observations) / window
                        station["metrics"][str(day)] = {"objective": objective, "metric":"running_average", "windowDays":str(window), "value":round(metric, 3)}
                        limit = threshold(code, day, objective)
                        if limit is not None:
                            station["metrics"][str(day)]["threshold"] = limit
                            station["regulations"].append({"objective":objective, "metric":"running_average", "windowDays":str(window), "threshold":limit, "start":str(day), "end":str(day)})
                            if metric > limit:
                                for offset in range(window):
                                    affected.add(day - timedelta(days=offset))
                                    station["judgments"][str(day - timedelta(days=offset))] = {"objective":objective, "metric":"running_average", "windowDays":str(window), "value":round(metric,3), "threshold":limit, "evaluationDate":str(day)}
            else:
                months = defaultdict(list)
                for day, value in series.items(): months[(day.year, day.month)].append((day, value))
                for observations in months.values():
                    first = min(day for day, _ in observations); next_month = date(first.year + (first.month == 12), 1 if first.month == 12 else first.month + 1, 1)
                    if len(observations) != (next_month - first).days: continue
                    metric = sum(value for _, value in observations) / len(observations); limit = 1000
                    for day, _ in observations: station["metrics"][str(day)] = {"objective":objective, "metric":"monthly_average", "windowDays":"calendar_month", "value":round(metric,3), "threshold":limit}
                    station["regulations"].append({"objective":objective, "metric":"monthly_average", "windowDays":"calendar_month", "threshold":limit, "start":str(first), "end":str(next_month - timedelta(days=1))})
                    if metric > limit:
                        for day, _ in observations:
                            affected.add(day); station["judgments"][str(day)] = {"objective":objective, "metric":"monthly_average", "windowDays":"calendar_month", "value":round(metric,3), "threshold":limit, "evaluationDate":str(next_month - timedelta(days=1))}
            for start, end in collapse({day for day in affected if day in set(dates)}):
                station["objectives"].append({"objective":objective, "status":"calculated_exceedance", "start":str(start), "end":str(end)})
        scenarios[scenario_key] = {"stations": stations}
    OUT.write_text(json.dumps({"source":"California State Water Resources Control Board Decision 1641", "generatedFrom":"SCHISM full-extent daily EC runs 15, 30, and 31", "scenarios":scenarios}, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__": main()
