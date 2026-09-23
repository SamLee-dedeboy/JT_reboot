"""Calculate D-1641 metrics for the delivered RMA sea-level-rise (SLR) runs.

Regulatory logic is not copied: the authoritative ``process_rma_d1641.py`` is loaded and only its
scenario list, output directory and file discovery are redirected to the SLR instantaneous EC files.
All-date display metrics reuse ``build_d1641_display_metrics.display_metric_rows``. The browser JSON
is assembled by a Python port of ``build-d1641-data.mjs``; the port is verified by rebuilding the live
current-condition ``d1641_rma.json`` from its intermediates and comparing byte for byte.

Usage:
    python scripts/scenario-explorer/build_d1641_slr.py \\
        --processor <RMA/scripts/process_rma_d1641.py> --slr-root <RMA/SLR_data>
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import os
import re
import sys
from collections import defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_d1641_display_metrics import DISPLAY_HEADER, display_metric_rows, load_processor  # noqa: E402
from build_slr_scenarios_dashboard import BOUNDARY_STATIONS, DUPLICATE_RESOLUTION  # noqa: E402


PROJECT_DIR = Path(__file__).resolve().parents[2]
DATA_OUTPUT_DIR = PROJECT_DIR / "public" / "data" / "scenario-explorer"
DEFAULT_DATA_DIR = PROJECT_DIR.parent / "JT_exploration" / "RMA" / "data"
SOURCE = "California State Water Resources Control Board Decision 1641"
GENERATED_FROM = "RMA/SLR_data/processed/d1641_rma_slr"
TEAMS = {"Com", "Ecolo", "Econo", "EJdef", "Recr"}
# (output key, SLR raw directory, current-condition scenario key)
SLR_SCENARIOS = [
    ("baseline-slr", "baseline", "baseline"),
    ("bolster-slr", "bolster", "bolster"),
    ("ecomachine-slr", "ecomachine", "ecomachine"),
    ("newgreen-slr", "newgreen", "newgreen"),
]
UNAVAILABLE = ["reserve-slr", "tunnel-slr"]
CSV_NAMES = {
    "mapping": "rma_d1641_station_mapping.csv",
    "coverage": "rma_d1641_daily_coverage.csv",
    "evaluations": "rma_d1641_metric_evaluations.csv",
    "intervals": "rma_d1641_exceedance_intervals.csv",
    "summary": "rma_d1641_scenario_summary.csv",
    "display": "rma_d1641_display_metrics.csv",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_csv(path: Path) -> list[dict]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


# --- Port of build-d1641-data.mjs -------------------------------------------------------------

def js_number(text: str) -> int | float:
    """Number(text) as JSON.stringify would print it."""
    value = float(text)
    return int(value) if value.is_integer() else value


def js_add_days(day: str, days: int) -> str:
    return (date.fromisoformat(day) + timedelta(days=days)).isoformat()


def merge_regulations(rows: list[dict]) -> dict[str, list[dict]]:
    """build-d1641-data.mjs regulation merge over evaluation-shaped rows."""
    by_station: dict[str, list[dict]] = {}
    for row in rows:
        regulations = by_station.setdefault(row["station_id"], [])
        previous = regulations[-1] if regulations else None
        signature = f"{row['objective']}|{row['metric']}|{row['window_days']}|{row['threshold_us_cm']}"
        if previous and previous["signature"] == signature and js_add_days(previous["end"], 1) == row["evaluation_date"]:
            previous["end"] = row["evaluation_date"]
        else:
            regulations.append({"signature": signature, "objective": row["objective"], "metric": row["metric"],
                                "windowDays": row["window_days"], "threshold": js_number(row["threshold_us_cm"]),
                                "start": row["evaluation_date"], "end": row["evaluation_date"]})
    return by_station


def schedule_rows(processor, stations: set[str]) -> list[dict]:
    """Regulatory schedule from processor.threshold, in the processor's evaluation-row order."""
    definitions = [("EMM", "agricultural", 14), ("JER", "agricultural", 14), ("STI", "agricultural", 14),
                   ("SAL", "agricultural", 14), ("SJR", "agricultural", 30), ("BDT", "agricultural", 30),
                   ("UNI", "agricultural", 30), ("OLD", "agricultural", 30), ("WCI", "agricultural", 0),
                   ("DMC", "agricultural", 0), ("JER", "ecosystem_14d", 14), ("PPT", "ecosystem_14d", 14)]
    rows = []
    for station, objective, window in definitions:
        if station not in stations:
            continue
        if window:
            day = processor.START
            while day <= processor.END:
                limit = processor.threshold(station, day, objective)
                if limit is not None:
                    rows.append({"station_id": station, "objective": objective, "metric": "running_average",
                                 "window_days": str(window), "threshold_us_cm": str(limit), "evaluation_date": day.isoformat()})
                day += timedelta(days=1)
        else:
            year, month = processor.START.year, processor.START.month
            while date(year, month, 1) <= processor.END:
                last = date(year + (month == 12), 1 if month == 12 else month + 1, 1) - timedelta(days=1)
                rows.append({"station_id": station, "objective": objective, "metric": "monthly_average",
                             "window_days": "calendar_month", "threshold_us_cm": "1000", "evaluation_date": last.isoformat()})
                year, month = year + (month == 12), 1 if month == 12 else month + 1
    return rows


def build_dataset(mapping_rows, interval_rows, evaluation_rows, display_rows, regulations_by_station, generated_from) -> dict:
    station_number = {(m["scenario"], m["d1641_station_id"]): m["rma_station_number"] for m in reversed(mapping_rows)}
    scenarios: dict[str, dict] = {}
    for mapping in mapping_rows:
        scenario = scenarios.setdefault(mapping["scenario"], {"stations": {}})
        scenario["stations"][mapping["rma_station_number"]] = {
            "d1641Id": mapping["d1641_station_id"], "fullName": mapping["rma_station_name"],
            "regulations": [{k: v for k, v in r.items() if k != "signature"}
                            for r in regulations_by_station.get(mapping["d1641_station_id"], [])],
            "judgments": {}, "metrics": {}, "objectives": [],
        }
    for row in interval_rows:
        number = station_number.get((row["scenario"], row["station_id"]))
        station = scenarios.get(row["scenario"], {}).get("stations", {}).get(number) if number else None
        if station is None:
            continue
        station["objectives"].append({"objective": row["objective"], "status": row["status"],
                                      **({"start": row["start_date"], "end": row["end_date"]} if row["start_date"] else {})})
    for row in evaluation_rows:
        if row["exceeded"] != "True" or row["data_status"] != "complete":
            continue
        station = scenarios.get(row["scenario"], {}).get("stations", {}).get(station_number.get((row["scenario"], row["station_id"])))
        if station is None:
            continue
        window = row["window_days"]
        start = js_add_days(row["evaluation_date"], -(int(window) - 1)) if window.isdigit() else f"{row['evaluation_date'][:7]}-01"
        value, limit = js_number(row["calculated_value_us_cm"]), js_number(row["threshold_us_cm"])
        day = start
        while day <= row["evaluation_date"]:
            existing = station["judgments"].get(day)
            if not existing or value / limit > existing["value"] / existing["threshold"]:
                station["judgments"][day] = {"objective": row["objective"], "metric": row["metric"], "windowDays": window,
                                             "value": value, "threshold": limit, "evaluationDate": row["evaluation_date"]}
            day = js_add_days(day, 1)
    for row in display_rows:
        if row["data_status"] != "complete" or not row["calculated_value_us_cm"]:
            continue
        station = scenarios.get(row["scenario"], {}).get("stations", {}).get(station_number.get((row["scenario"], row["station_id"])))
        if station is None:
            continue
        regulation = next((r for r in station["regulations"]
                           if r["objective"] == row["objective"] and r["start"] <= row["date"] <= r["end"]), None)
        candidate = {"objective": row["objective"], "metric": row["metric"], "windowDays": row["window_days"],
                     "value": js_number(row["calculated_value_us_cm"]),
                     **({"threshold": regulation["threshold"]} if regulation else {})}
        existing = station["metrics"].get(row["date"])
        if not existing or (regulation and "threshold" not in existing):
            station["metrics"][row["date"]] = candidate
    for scenario in scenarios.values():  # JS objects order integer-like keys numerically
        scenario["stations"] = dict(sorted(scenario["stations"].items(), key=lambda item: int(item[0])))
    return {"source": SOURCE, "generatedFrom": generated_from, "scenarios": scenarios}


def dump(dataset: dict) -> str:
    return json.dumps(dataset, indent=2, ensure_ascii=False, allow_nan=False) + "\n"


def load_intermediates(directory: Path) -> dict[str, list[dict]]:
    return {key: read_csv(directory / name) for key, name in CSV_NAMES.items()}


# --- Processing ---------------------------------------------------------------------------------

def slr_files(slr_root: Path, directory: str) -> list[Path]:
    return sorted((p for p in (slr_root / "raw" / directory / "ec").glob("*.csv") if "-AVG-AVG" not in p.name),
                  key=lambda p: p.name)


def valid_sample(raw: str) -> float | None:
    """The processor's sample rule: skip blanks and dry/missing sentinels."""
    raw = raw.strip()
    if not raw:
        return None
    value = float(raw)
    return None if value in {-901, -902} or value <= -9000 else value


def inspect_sources(processor, files: list[Path], station_numbers: dict[str, str]) -> tuple[dict, dict]:
    """Every occurrence of each D-1641 station: identity checks, plus an independent daily series."""
    located = processor.locate_columns(files)
    occurrences, daily = {}, {}
    for sid, candidates in located.items():
        columns = []
        for path, index, name in candidates:
            raw, sums, counts = [], defaultdict(float), defaultdict(int)
            with path.open(newline="", encoding="utf-8-sig") as handle:
                reader = csv.reader(handle)
                next(reader)
                for row in reader:
                    day = datetime.strptime(row[0], "%Y-%m-%d %H:%M:%S").date()
                    if day < processor.START or day > processor.END:
                        continue
                    raw.append(row[index])
                    value = valid_sample(row[index])
                    if value is not None:
                        sums[day] += value
                        counts[day] += 1
            columns.append({"path": path, "team": path.name.split("_")[1], "column": name, "raw": raw,
                            "means": {d: sums[d] / counts[d] for d in counts if counts[d] == processor.EXPECTED_PER_DAY},
                            "counts": dict(counts)})
        first = columns[0]
        byte_identical = all(c["raw"] == first["raw"] for c in columns[1:])
        numeric_identical = all([valid_sample(x) for x in c["raw"]] == [valid_sample(x) for x in first["raw"]] for c in columns[1:])
        number = station_numbers[sid]
        if numeric_identical:
            decision = "identical duplicates; first file by name selected" if len(columns) > 1 else "single source"
        elif number in DUPLICATE_RESOLUTION:
            team = DUPLICATE_RESOLUTION[number][0]
            decision = f"conflict resolved to {team} per build_slr_scenarios_dashboard.DUPLICATE_RESOLUTION"
            columns.sort(key=lambda c: c["team"] != team)
        else:
            raise RuntimeError(f"Conflicting duplicate D-1641 source for {sid} (station {number}): "
                               f"{[c['path'].name for c in columns]}")
        occurrences[sid] = {"rmaStationNumber": number, "decision": decision, "byteIdentical": byte_identical,
                            "numericIdentical": numeric_identical, "selected": columns[0]["path"].name,
                            "sources": [{"file": c["path"].name, "team": c["team"], "column": c["column"]} for c in columns]}
        daily[sid] = columns[0]
    return occurrences, daily


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--processor", type=Path, default=os.environ.get("RMA_D1641_PROCESSOR"),
                        help="Authoritative process_rma_d1641.py (env RMA_D1641_PROCESSOR)")
    parser.add_argument("--slr-root", type=Path, default=os.environ.get("RMA_SLR_DATA_DIR"),
                        help="SLR delivery root containing raw/<scenario>/ec (env RMA_SLR_DATA_DIR)")
    parser.add_argument("--intermediate-dir", type=Path, default=os.environ.get("D1641_SLR_INTERMEDIATE_DIR"),
                        help="Intermediate CSV directory (env D1641_SLR_INTERMEDIATE_DIR; "
                             "default <slr-root>/processed/d1641_rma_slr)")
    parser.add_argument("--output", type=Path, default=os.environ.get("D1641_SLR_OUTPUT", DATA_OUTPUT_DIR / "d1641_rma_slr.json"),
                        help="Browser JSON path (env D1641_SLR_OUTPUT)")
    parser.add_argument("--station-data-dir", type=Path, default=os.environ.get("RMA_DATA_DIR", DEFAULT_DATA_DIR),
                        help="Directory holding all_point_stations_finalized.csv (env RMA_DATA_DIR)")
    parser.add_argument("--current-source", type=Path, default=DATA_OUTPUT_DIR / "update" / "d1641_source",
                        help="Intermediates behind the live d1641_rma.json (QA and port verification only)")
    parser.add_argument("--current-json", type=Path, default=DATA_OUTPUT_DIR / "d1641_rma.json",
                        help="Live current-condition D-1641 JSON (read only)")
    args = parser.parse_args()
    if not args.processor or not args.slr_root:
        parser.error("provide --processor and --slr-root (or RMA_D1641_PROCESSOR and RMA_SLR_DATA_DIR)")
    intermediate = args.intermediate_dir or args.slr_root / "processed" / "d1641_rma_slr"
    output = args.output
    validation_path = output.with_name(output.stem + "_validation.json")
    protected_dirs = {args.current_source.resolve(), (args.station_data_dir / "processed" / "d1641_rma").resolve()}
    if output.resolve() == args.current_json.resolve() or intermediate.resolve() in protected_dirs:
        raise RuntimeError("Refusing to overwrite current-condition D-1641 outputs")

    processor = load_processor(args.processor)
    processor.DATA = args.station_data_dir  # only all_point_stations_finalized.csv is read from here
    processor.OUT = intermediate
    processor.SCENARIOS = {key: directory for key, directory, _ in SLR_SCENARIOS}

    files_by_dir = {directory: slr_files(args.slr_root, directory) for _, directory, _ in SLR_SCENARIOS}
    for directory, files in files_by_dir.items():
        teams = [p.name.split("_")[1] for p in files]
        if len(files) != 5 or set(teams) != TEAMS:
            raise RuntimeError(f"{directory}/ec: expected one instantaneous EC file per team, found {teams}")

    # Record every CSV the processor opens, to prove no EC-AVG-AVG or current-condition file is read.
    opened: list[Path] = []
    original_locate, original_read = processor.locate_columns, processor.read_daily_series
    master_rows = read_csv(args.station_data_dir / "all_point_stations_finalized.csv")
    code_map = {"EMM": "emm2", "JER": "sjj", "STI": "sti", "SAL": "resal", "SJR": "vns", "BDT": "bdt", "UNI": "uni",
                "OLD": "old", "WCI": "wci", "DMC": "trp", "PPT": "ppt", "CLL": "cll", "NSL": "nsl", "BDL": "bdl",
                "SNC": "snc", "VOL": "vol"}
    master = {r["short name"].lower(): r for r in master_rows}
    station_numbers = {sid: master[code]["station #"] for sid, code in code_map.items()}

    occurrences, daily, preferred = {}, {}, {}
    for key, directory, _ in SLR_SCENARIOS:
        opened.extend(files_by_dir[directory])
        occurrences[key], daily[key] = inspect_sources(processor, files_by_dir[directory], station_numbers)
        folder = files_by_dir[directory][0].parent
        preferred[folder] = {sid: info["selected"] for sid, info in occurrences[key].items()}

    def locate_columns(files):
        opened.extend(files)
        found = original_locate(files)
        choice = preferred.get(Path(files[0]).parent, {}) if files else {}
        for sid, candidates in found.items():  # apply recorded duplicate decisions (no-op when identical)
            candidates.sort(key=lambda c: c[0].name != choice.get(sid))
        return found

    def read_daily_series(path, columns):
        opened.append(path)
        return original_read(path, columns)

    processor.locate_columns, processor.read_daily_series = locate_columns, read_daily_series
    processor.scenario_files = lambda directory: files_by_dir[directory]

    intermediate.mkdir(parents=True, exist_ok=True)
    processor.main()
    display = display_metric_rows(processor, processor.scenario_files)
    with (intermediate / CSV_NAMES["display"]).open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(DISPLAY_HEADER)
        writer.writerows(display)
    print(f"Wrote intermediates to {intermediate}")

    tables = load_intermediates(intermediate)
    computable = {row["d1641_station_id"] for row in tables["mapping"]
                  if row["scenario"] == SLR_SCENARIOS[0][0] and row["mapping_method"] == "identity/name mapping"}
    regulations = merge_regulations(schedule_rows(processor, computable & processor.MEAN_DAILY))
    dataset = build_dataset(tables["mapping"], tables["intervals"], tables["evaluations"], tables["display"],
                            regulations, GENERATED_FROM)
    text = dump(dataset)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(text, encoding="utf-8")
    print(f"Wrote {output}")

    validation = validate(processor, args, tables, dataset, text, occurrences, daily, files_by_dir, opened,
                          regulations, station_numbers, intermediate)
    validation_path.write_text(json.dumps(validation, indent=2, ensure_ascii=False, default=str) + "\n", encoding="utf-8")
    failed = [name for name, check in validation["checks"].items() if not check["pass"]]
    print(f"Wrote {validation_path}: {len(validation['checks']) - len(failed)} passed, {len(failed)} failed {failed}")
    if failed:
        raise SystemExit(1)


# --- Validation ---------------------------------------------------------------------------------

def validate(processor, args, tables, dataset, text, occurrences, daily, files_by_dir, opened,
             regulations, station_numbers, intermediate) -> dict:
    keys = [key for key, *_ in SLR_SCENARIOS]
    start, end = processor.START.isoformat(), processor.END.isoformat()
    checks: dict[str, dict] = {}

    def check(name, passed, **details):
        checks[name] = {"pass": bool(passed), **details}

    ev, iv, cov, mapping, display = (tables[k] for k in ("evaluations", "intervals", "coverage", "mapping", "display"))
    scenarios = dataset["scenarios"]

    check("01_scenarioKeysAndOrder", list(scenarios) == keys, keys=list(scenarios))
    emitted = set(scenarios) | {r["scenario"] for t in tables.values() for r in t}
    check("02_noUnavailableScenarios", not emitted & set(UNAVAILABLE), unavailable=UNAVAILABLE)
    check("03_fiveInstantaneousFilesPerScenario", all(len(f) == 5 for f in files_by_dir.values()),
          files={d: [p.name for p in f] for d, f in files_by_dir.items()})
    opened_names = sorted({Path(p).resolve().as_posix() for p in opened})
    slr_raw = (args.slr_root / "raw").resolve().as_posix()
    check("04_noEcAvgAvgRead", not any("AVG-AVG" in p for p in opened_names)
          and all(p.startswith(slr_raw) and "/ec/" in p for p in opened_names), filesOpened=len(opened_names))
    inputs = [{"path": p.relative_to(args.slr_root).as_posix(), "sha256": sha256(p)}
              for files in files_by_dir.values() for p in files]
    station_csv = args.station_data_dir / "all_point_stations_finalized.csv"
    check("05_inputHashesRecorded", len(inputs) == 20 and all(len(i["sha256"]) == 64 for i in inputs), inputs=inputs,
          stationMetadata={"path": "RMA/data/all_point_stations_finalized.csv", "sha256": sha256(station_csv)},
          processor={"path": "RMA/scripts/process_rma_d1641.py", "sha256": sha256(args.processor)})

    mapping_ok, not_present = True, defaultdict(list)
    for key in keys:
        rows = {r["d1641_station_id"]: r for r in mapping if r["scenario"] == key}
        mapping_ok &= set(rows) == set(processor.STATIONS)
        for sid, row in rows.items():
            if row["mapping_method"] != "identity/name mapping":
                not_present[key].append(sid)
            mapping_ok &= row["rma_station_number"] == station_numbers[sid]
    check("06_stationIdentityMapping", mapping_ok, notPresentInExports=dict(not_present))
    occ_ok = all(set(occurrences[k]) == {sid for sid in processor.STATIONS if sid not in not_present[k]}
                 and all(int(r["source_file_occurrences"]) == len(occurrences[k].get(r["d1641_station_id"], {}).get("sources", []))
                         for r in mapping if r["scenario"] == k) for k in keys)
    check("07_sourceOccurrencesAndDecisions", occ_ok, occurrences=occurrences)

    # 8. Coverage recomputed independently from raw samples.
    coverage_detail, coverage_ok = {}, True
    all_days = [processor.START + timedelta(days=i) for i in range((processor.END - processor.START).days + 1)]
    for key in keys:
        coverage_detail[key] = {}
        for row in (r for r in cov if r["scenario"] == key):
            sid = row["station_id"]
            counts = daily[key][sid]["counts"]
            incomplete = [d for d in all_days if counts.get(d, 0) != processor.EXPECTED_PER_DAY]
            spans = [[a.isoformat(), b.isoformat()] for a, b in processor.collapse(incomplete)]
            coverage_ok &= (int(row["complete_days"]) == len(all_days) - len(incomplete)
                            and row["expected_samples_per_day"] == "96")
            coverage_detail[key][sid] = {"completeDays": int(row["complete_days"]), "incompleteDays": len(incomplete),
                                         "incompleteSpans": spans}
    check("08_dailyCoverage96", coverage_ok, expectedSamplesPerDay=processor.EXPECTED_PER_DAY, coverage=coverage_detail)

    outside = [r for r in ev if not start <= r["evaluation_date"] <= end]
    check("09_evaluationDatesInInterval",
          all(r["data_status"] == "insufficient_data" and r["window_days"] == "calendar_month"
              and r["evaluation_date"] == "2020-11-30" for r in outside)
          and all(start <= day <= end for s in scenarios.values() for st in s["stations"].values()
                  for day in list(st["judgments"]) + list(st["metrics"])),
          outsideInterval=len(outside),
          note="Only the partial Nov 2020 calendar-month rows (WCI, DMC) are labelled 2020-11-30 by the authoritative "
               "processor; they are insufficient_data and never judged. Behavior preserved from process_rma_d1641.py.")

    # 10/11. Recompute running and monthly metrics from the independent daily series.
    means = {k: {sid: v["means"] for sid, v in daily[k].items()} for k in keys}
    running_bad, monthly_bad, running_n, monthly_n = [], [], 0, 0
    for r in ev:
        series = means[r["scenario"]].get(r["station_id"], {})
        day = date.fromisoformat(r["evaluation_date"])
        if r["window_days"].isdigit():
            window = [day - timedelta(days=i) for i in range(int(r["window_days"]))]
            obs = [series.get(d) for d in window]
            full = all(v is not None for v in obs)
            running_n += 1
            if (r["data_status"] == "complete") != full or (full and abs(round(sum(obs) / len(obs), 3) - float(r["calculated_value_us_cm"])) > 1e-9):
                running_bad.append(r)
        else:
            first = day.replace(day=1)
            month_days = [first + timedelta(days=i) for i in range(day.day)]
            full = all(start <= d.isoformat() <= end and d in series for d in month_days)
            monthly_n += 1
            if (r["data_status"] == "complete") != full or (full and abs(round(sum(series[d] for d in month_days) / len(month_days), 3)
                                                                 - float(r["calculated_value_us_cm"])) > 1e-9):
                monthly_bad.append(r)
    check("10_runningWindowsComplete", not running_bad, evaluations=running_n, mismatches=running_bad[:10])
    check("11_monthlyCompleteCalendarMonths", not monthly_bad, evaluations=monthly_n, mismatches=monthly_bad[:10])

    # 12/13. Judgments.
    ev_index = {(r["scenario"], r["station_id"], r["objective"], r["evaluation_date"]): r for r in ev}
    judgment_bad, judgment_count = [], 0
    for key, scenario in scenarios.items():
        for number, st in scenario["stations"].items():
            for day, j in st["judgments"].items():
                judgment_count += 1
                row = ev_index.get((key, st["d1641Id"], j["objective"], j["evaluationDate"]))
                active = any(r["objective"] == j["objective"] and r["threshold"] == j["threshold"]
                             and r["start"] <= j["evaluationDate"] <= r["end"] for r in st["regulations"])
                if not (row and row["data_status"] == "complete" and row["exceeded"] == "True"
                        and j["value"] > j["threshold"] and active
                        and js_number(row["calculated_value_us_cm"]) == j["value"]):
                    judgment_bad.append({"scenario": key, "station": number, "date": day, **j})
    check("12_judgmentsExceededCompleteActive", not judgment_bad, judgments=judgment_count, failures=judgment_bad[:10])
    not_exceeded = [(key, n, day) for key, s in scenarios.items() for n, st in s["stations"].items()
                    for day, j in st["judgments"].items()
                    if j["value"] <= j["threshold"] or ev_index[(key, st["d1641Id"], j["objective"], j["evaluationDate"])]["exceeded"] != "True"]
    check("13_noNonExceededJudgments", not not_exceeded, failures=not_exceeded[:10])

    # 14. Intervals = collapse of affected dates recomputed from evaluations.
    affected = defaultdict(set)
    for r in ev:
        if r["data_status"] != "complete" or r["exceeded"] != "True":
            continue
        day = date.fromisoformat(r["evaluation_date"])
        if r["window_days"].isdigit():
            days = [day - timedelta(days=i) for i in range(int(r["window_days"]))]
        else:
            days = [day.replace(day=1) + timedelta(days=i) for i in range(day.day)]
        affected[(r["scenario"], r["station_id"], r["objective"])].update(d for d in days if processor.START <= d <= processor.END)
    expected = sorted((k[0], k[1], k[2], a.isoformat(), b.isoformat()) for k, days in affected.items() for a, b in processor.collapse(days))
    actual = sorted((r["scenario"], r["station_id"], r["objective"], r["start_date"], r["end_date"])
                    for r in iv if r["status"] == "calculated_exceedance")
    json_intervals = sorted((key, st["d1641Id"], o["objective"], o["start"], o["end"]) for key, s in scenarios.items()
                            for st in s["stations"].values() for o in st["objectives"] if o["status"] == "calculated_exceedance")
    check("14_intervalsMatchEvaluations", expected == actual == json_intervals, intervals=len(actual))

    marsh_ok = all(
        [o["status"] for o in st["objectives"]] == ["not_computable_high_tide_data_required"]
        and not st["regulations"] and not st["judgments"] and not st["metrics"]
        for s in scenarios.values() for st in s["stations"].values() if st["d1641Id"] in processor.MARSH
    ) and all(sum(st["d1641Id"] in processor.MARSH for st in s["stations"].values()) == 5 for s in scenarios.values())
    check("15_highTideNotComputable", marsh_ok, stations=sorted(processor.MARSH))
    check("16_noNanOrInfinity", not re.search(r"\bNaN\b|Infinity", text))

    salinity = json.loads((DATA_OUTPUT_DIR / "salinity_dashboard.json").read_text(encoding="utf-8"))
    map_ids = {s["station_id"] for s in salinity["stations"]}
    current = json.loads(args.current_json.read_text(encoding="utf-8"))
    current_ids = set(current["scenarios"]["baseline"]["stations"])
    json_ids = {n for s in scenarios.values() for n in s["stations"]}
    check("17_stationIdsMatchMap", all(set(s["stations"]) == current_ids for s in scenarios.values())
          and {n for n in json_ids if scenarios[keys[0]]["stations"][n]["d1641Id"] not in ("UNI", "OLD")} <= map_ids,
          stationIds=sorted(json_ids, key=int), notInMapStations=sorted(json_ids - map_ids, key=int))

    # 18. Plausibility of the daily series used for evaluation.
    flags = []
    for key in keys:
        for sid, info in daily[key].items():
            values = list(info["means"].values())
            if not values:
                flags.append({"scenario": key, "station": sid, "flag": "noCompleteDays"})
                continue
            if min(values) < 0:
                flags.append({"scenario": key, "station": sid, "flag": "negativeEC", "min": min(values)})
            if max(values) - min(values) < 1e-6:
                flags.append({"scenario": key, "station": sid, "flag": "constantSeries"})
            if coverage_detail.get(key, {}).get(sid, {}).get("incompleteSpans"):
                flags.append({"scenario": key, "station": sid, "flag": "missingSpans",
                              "spans": coverage_detail[key][sid]["incompleteSpans"]})
    identical = []
    for i, a in enumerate(keys):
        for b in keys[i + 1:]:
            same = [sid for sid in daily[a] if sid in daily[b] and daily[a][sid]["means"] == daily[b][sid]["means"]]
            if len(same) == len(daily[a]):
                flags.append({"scenario": a, "flag": f"identicalScenarioTo:{b}"})
            elif same:
                identical.append({"scenarios": [a, b], "identicalStations": same})
    explained = {sid for sid, number in station_numbers.items() if number in BOUNDARY_STATIONS}
    unexplained_identical = [p for p in identical if set(p["identicalStations"]) - explained]
    check("18_seriesPlausibility", not flags and not unexplained_identical, flags=flags,
          identicalStationSeries=identical,
          explanation={sid: BOUNDARY_STATIONS[station_numbers[sid]] for sid in explained})

    # Cross-checks against current-condition results (structure only).
    current_tables = load_intermediates(args.current_source)
    cur_map = {r["d1641_station_id"]: r for r in current_tables["mapping"] if r["scenario"] == "baseline"}
    fields = ("rma_station_name", "rma_short_name", "rma_station_number", "archive_index", "latitude", "longitude", "mapping_method")
    same_mapping = all(all(r[f] == cur_map[r["d1641_station_id"]][f] for f in fields) for r in mapping)
    schedule = lambda rows, scen: sorted((r["station_id"], r["objective"], r["evaluation_date"], r["window_days"], r["metric"], r["threshold_us_cm"])
                                         for r in rows if r["scenario"] == scen)
    cur_schedule = schedule(current_tables["evaluations"], "baseline")
    same_schedule = all(schedule(ev, k) == cur_schedule for k in keys)
    cur_regs = {st["d1641Id"]: st["regulations"] for st in current["scenarios"]["baseline"]["stations"].values()}
    same_regs = all(st["regulations"] == cur_regs[st["d1641Id"]] for s in scenarios.values() for st in s["stations"].values())
    same_dates = sorted({r["date"] for r in display}) == sorted({r["date"] for r in current_tables["display"]})
    same_marsh = all([o for o in st["objectives"]] == [o for o in cur_st["objectives"]]
                     for s in scenarios.values() for n, st in s["stations"].items()
                     for cur_st in [current["scenarios"]["baseline"]["stations"][n]] if st["d1641Id"] in processor.MARSH)
    current_hashes = {sha256(p) for p in args.station_data_dir.glob("*/*_EC.csv")}
    reused_files = [i["path"] for i in inputs if i["sha256"] in current_hashes]
    reuse = {}
    for key, _, family in SLR_SCENARIOS:
        fam = {(r["station_id"], r["objective"], r["evaluation_date"]): r["calculated_value_us_cm"]
               for r in current_tables["evaluations"] if r["scenario"] == family and r["data_status"] == "complete"}
        per_station = defaultdict(lambda: [0, 0])
        for r in ev:
            k = (r["station_id"], r["objective"], r["evaluation_date"])
            if r["scenario"] == key and r["data_status"] == "complete" and k in fam:
                per_station[r["station_id"]][0] += 1
                per_station[r["station_id"]][1] += fam[k] == r["calculated_value_us_cm"]
        reuse[key] = {sid: f"{same}/{n} identical" for sid, (n, same) in per_station.items() if same == n}
    unexplained_reuse = {k: v for k, v in reuse.items() if set(v) - explained}
    check("cross_identicalStationMapping", same_mapping)
    check("cross_identicalObjectiveSchedule", same_schedule and same_regs, evaluationRowsPerScenario=len(cur_schedule))
    check("cross_identicalAnalysisDates", same_dates and (start, end) == ("2018-10-01", "2020-11-29"), start=start, end=end)
    check("cross_identicalHighTideTreatment", same_marsh)
    check("cross_noCurrentConditionReuse", not reused_files and not unexplained_reuse,
          identicalInputFiles=reused_files, stationsIdenticalToCurrentCounterpart=reuse)

    # Port verification: rebuild the live current JSON from its intermediates.
    rebuilt = build_dataset(current_tables["mapping"], current_tables["intervals"], current_tables["evaluations"],
                            current_tables["display"], merge_regulations([r for r in current_tables["evaluations"] if r["scenario"] == "baseline"]),
                            "RMA/data/processed/d1641_rma")
    check("port_reproducesLiveCurrentJson", dump(rebuilt) == args.current_json.read_text(encoding="utf-8"),
          note="Python port of build-d1641-data.mjs, byte-for-byte against d1641_rma.json.")

    # QA comparison (context only).
    def qa(tables_, dataset_, scen):
        evs = [r for r in tables_["evaluations"] if r["scenario"] == scen]
        ints = [r for r in tables_["intervals"] if r["scenario"] == scen and r["status"] == "calculated_exceedance"]
        ratios = [float(r["calculated_value_us_cm"]) / float(r["threshold_us_cm"]) for r in evs if r["data_status"] == "complete"]
        exceeded = [x for x, r in zip(ratios, [r for r in evs if r["data_status"] == "complete"]) if r["exceeded"] == "True"]
        stations_ = dataset_["scenarios"][scen]["stations"].values()
        return {"completeStationDays": sum(int(r["complete_days"]) for r in tables_["coverage"] if r["scenario"] == scen),
                "metricEvaluations": len(evs), "completeEvaluations": len(ratios),
                "exceededEvaluations": len(exceeded), "exceedanceIntervals": len(ints),
                "exceedanceIntervalDays": sum(int(r["days"]) for r in ints),
                "stationsWithExceedance": sorted({r["station_id"] for r in ints}),
                "judgmentDates": sum(len(st["judgments"]) for st in stations_),
                "maxExceedanceRatio": round(max(exceeded), 4) if exceeded else None,
                "maxValueToThresholdRatio": round(max(ratios), 4) if ratios else None}
    comparison = {family: {"current": qa(current_tables, current, family), "slr": qa(tables, dataset, key)}
                  for key, _, family in SLR_SCENARIOS}
    summary_scenarios = [r["scenario"] for r in tables["summary"]]

    return {
        "generatedAt": datetime.now().isoformat(timespec="seconds"), "dataset": args.output.name,
        "generatedFrom": GENERATED_FROM, "analysisInterval": [start, end],
        "intermediates": {name: {"path": f"{GENERATED_FROM}/{name}", "sha256": sha256(intermediate / name)} for name in CSV_NAMES.values()},
        "unavailableScenarios": {k: "Requires an RMA rerun; not delivered under SLR." for k in UNAVAILABLE},
        "knownLimitations": [
            "UNI and OLD are not present in any RMA export (current or SLR); their objectives are reported as "
            "not_computable_station_not_in_scenario_export.",
            "The five high-tide marsh objectives (CLL, NSL, BDL, SNC, VOL) require high-tide data and are not computed.",
            f"rma_d1641_scenario_summary.csv lists only scenarios with at least one exceedance (processor behavior); "
            f"rows present: {summary_scenarios}.",
            "Partial Nov 2020 monthly WCI/DMC evaluations are dated 2020-11-30 (month end) by the processor and marked insufficient_data.",
        ],
        "currentVersusSlr": comparison,
        "checks": checks,
    }


if __name__ == "__main__":
    main()
