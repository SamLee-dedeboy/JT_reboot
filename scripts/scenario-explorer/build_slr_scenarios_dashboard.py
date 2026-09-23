"""Build sea-level-rise (SLR) EC-AVG-AVG Scenario Explorer data and its validation report.

Every SLR run is expressed as an offset from the same current-condition BAU reference used by
``salinity_dashboard.json``; the current adaptation offsets are retained unchanged from that file:

    SLR offset = SLR absolute daily EC - current BAU absolute daily EC

Usage:
    python scripts/scenario-explorer/build_slr_scenarios_dashboard.py --slr-root <SLR_data>
    RMA_SLR_DATA_DIR=<SLR_data> python scripts/scenario-explorer/build_slr_scenarios_dashboard.py
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import os
import random
import re
from collections import defaultdict
from concurrent.futures import ProcessPoolExecutor
from datetime import date, datetime
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parents[2]
DEFAULT_DATA_DIR = PROJECT_DIR.parent / "JT_exploration" / "RMA" / "data"
DEFAULT_OUTPUT_DIR = PROJECT_DIR / "public" / "data" / "scenario-explorer"
DASHBOARD_NAME = "slr_scenarios_dashboard.json"
VALIDATION_NAME = "slr_scenarios_validation.json"
LIVE_NAME = "salinity_dashboard.json"
START_DATE = "2018-10-01"
METRIC = "EC-AVG-AVG"
TEAMS = {"Com", "Ecolo", "Econo", "EJdef", "Recr"}
EXPECTED_STATIONS = 386
TOLERANCE = 0.0151  # two independently rounded 2-decimal values plus float noise

# (key, label, family, SLR raw directory, current-condition data directory)
SLR_SCENARIOS = [
    ("baseline-slr", "Baseline (SLR)", "baseline", "baseline", "baseline"),
    ("bolster-slr", "Bolster & Fortify (SLR)", "bolster", "bolster", "bolster"),
    ("ecomachine-slr", "Eco Machine (SLR)", "ecomachine", "ecomachine", "ecomachine"),
    ("newgreen-slr", "New Green Watershed (SLR)", "newgreen", "newgreen", "newgreen"),
]
UNAVAILABLE_SLR = [
    ("reserve-slr", "Calling on Reserves (SLR)", "reserve"),
    ("tunnel-slr", "A Tunnel (SLR)", "tunnel"),
]
# Stations whose normalized long name appears in several team files with different values.
# Any conflict not listed here fails the build. Each choice matches the source column used by
# the live salinity_dashboard.json (verified below against its reference and offsets).
DUPLICATE_RESOLUTION = {
    "247": ("EJdef", "Econo's same-named column is station 248 (ECON 61891), which shares this long "
                     "name but is outside the 386-station set; EJdef carries station 247 (EJ44)."),
    "283": ("EJdef", "Econo's Franks Tract output diverges in EcoMach/NGW runs; EJdef, Ecolo and "
                     "Recr agree, and the live dataset uses EJdef."),
}
# Stations whose SLR offset is expected to be zero because the model prescribes their EC.
BOUNDARY_STATIONS = {
    "425": "San Joaquin River near Vernalis is the RMA San Joaquin inflow boundary; its EC is prescribed, "
           "so it is unchanged by sea level (current Bolster, Eco Machine and NGW offsets are also zero).",
}


def normalize(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def rounded(value: float | None) -> float | None:
    return None if value is None else round(value, 2)


def read_file(path: str, station_by_name: dict[str, int]) -> dict:
    """Aggregate one EC-AVG-AVG CSV to daily (sum, count) per canonical station column."""
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    totals: dict[int, dict[str, list]] = defaultdict(dict)
    rows_per_day: dict[str, int] = defaultdict(int)
    info = {"rows": 0, "analysisRows": 0, "nonFinite": 0, "blank": 0, "negative": 0,
            "firstTimestamp": None, "lastTimestamp": None, "unordered": 0}
    with open(path, newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        header = next(reader)
        selected, unmatched, repeated = [], [], []
        seen_here = set()
        for index, name in enumerate(header[1:], 1):
            station_index = station_by_name.get(normalize(name))
            if station_index is None:
                unmatched.append(name)
            elif station_index in seen_here:
                repeated.append(name)
            else:
                seen_here.add(station_index)
                selected.append((index, station_index, name))
        previous = ""
        for row in reader:
            if not row:
                continue
            info["rows"] += 1
            stamp = row[0]
            info["firstTimestamp"] = info["firstTimestamp"] or stamp
            info["lastTimestamp"] = stamp
            if stamp <= previous:
                info["unordered"] += 1
            previous = stamp
            day = stamp[:10]
            if day < START_DATE:
                continue
            info["analysisRows"] += 1
            rows_per_day[day] += 1
            for column, station_index, _ in selected:
                cell = row[column] if column < len(row) else ""
                if not cell:
                    info["blank"] += 1
                    continue
                value = float(cell)
                if not math.isfinite(value):
                    info["nonFinite"] += 1
                    continue
                if value < 0:
                    info["negative"] += 1
                part = totals[station_index].get(day)
                if part is None:
                    totals[station_index][day] = [value, 1]
                else:
                    part[0] += value
                    part[1] += 1
    return {
        "path": path, "sha256": digest.hexdigest(), "info": info, "rowsPerDay": dict(rows_per_day),
        "columns": [(station_index, name) for _, station_index, name in selected],
        "unmatched": unmatched, "repeated": repeated,
        "daily": {i: {day: (s, c) for day, (s, c) in days.items()} for i, days in totals.items()},
    }


def discover(directory: Path) -> list[Path]:
    files = sorted(directory.glob(f"*_{METRIC}.csv"), key=lambda path: path.name)
    teams = [path.name.split("_")[1] for path in files]
    if len(files) != 5 or set(teams) != TEAMS:
        raise RuntimeError(f"{directory}: expected one {METRIC} file per team {sorted(TEAMS)}, found {teams}")
    return files


def merge_scenario(label: str, results: list[dict], stations: list[dict], report: dict,
                   strict: bool) -> dict[int, dict[str, float]]:
    """Combine team files into one daily-mean series per station.

    Strict (SLR inputs): unlisted conflicts fail. Otherwise (current-condition validation inputs) the
    first file by name wins, exactly as build_salinity_dashboard.py does, and conflicts are reported.
    """
    candidates: dict[int, list[tuple[str, str, dict]]] = defaultdict(list)
    for result in sorted(results, key=lambda item: Path(item["path"]).name):
        team = Path(result["path"]).name.split("_")[1]
        for station_index, name in result["columns"]:
            candidates[station_index].append((team, name, result["daily"].get(station_index, {})))
    daily, conflicts, duplicates = {}, [], 0
    for station_index, entries in sorted(candidates.items()):
        station_id = stations[station_index]["station_id"]
        if len(entries) > 1:
            duplicates += 1
        variants = {json.dumps(sorted(entry[2].items())) for entry in entries}
        chosen = entries[0]
        if len(variants) > 1:
            if not strict and station_id not in DUPLICATE_RESOLUTION:
                conflicts.append({"stationId": station_id, "longName": stations[station_index]["long_name"],
                                  "teams": [entry[0] for entry in entries], "chosenTeam": chosen[0],
                                  "reason": "First file by name (live builder rule)."})
                daily[station_index] = {day: s / c for day, (s, c) in chosen[2].items()}
                continue
            if station_id not in DUPLICATE_RESOLUTION:
                raise RuntimeError(f"{label}: conflicting duplicate coverage for station {station_id} "
                                   f"({stations[station_index]['long_name']}) across {[e[0] for e in entries]}")
            team, reason = DUPLICATE_RESOLUTION[station_id]
            matches = [entry for entry in entries if entry[0] == team]
            if not matches:
                raise RuntimeError(f"{label}: resolution team {team} missing for station {station_id}")
            chosen = matches[0]
            chosen_means = {day: s / c for day, (s, c) in chosen[2].items()}
            differences = {}
            for other in entries:
                if other[0] == team:
                    continue
                gaps = [abs(s / c - chosen_means[day]) for day, (s, c) in other[2].items() if day in chosen_means]
                differences[other[0]] = {"maxAbsDailyDifference": rounded(max(gaps, default=0.0)),
                                         "meanAbsDailyDifference": rounded(sum(gaps) / len(gaps) if gaps else 0.0)}
            conflicts.append({"stationId": station_id, "longName": stations[station_index]["long_name"],
                              "teams": [entry[0] for entry in entries], "chosenTeam": team, "reason": reason,
                              "differenceFromChosen": differences})
        daily[station_index] = {day: s / c for day, (s, c) in chosen[2].items()}
    missing = [stations[i]["station_id"] for i in range(len(stations)) if i not in daily]
    report[label] = {
        "files": [Path(result["path"]).name for result in results],
        "matchedStations": len(daily), "missingStationIds": missing,
        "duplicateStations": duplicates, "resolvedConflicts": conflicts,
        "unmatchedColumns": sorted({name for result in results for name in result["unmatched"]}),
        "repeatedColumnsWithinFile": sorted({name for result in results for name in result["repeated"]}),
        "rows": sorted({result["info"]["rows"] for result in results}),
        "span": [min(r["info"]["firstTimestamp"] for r in results), max(r["info"]["lastTimestamp"] for r in results)],
        "blankCells": sum(r["info"]["blank"] for r in results),
        "nonFiniteCells": sum(r["info"]["nonFinite"] for r in results),
        "negativeCells": sum(r["info"]["negative"] for r in results),
        "unorderedTimestamps": sum(r["info"]["unordered"] for r in results),
        "partialDays": sorted({day for r in results for day, n in r["rowsPerDay"].items() if n != 96}),
    }
    if missing:
        raise RuntimeError(f"{label}: stations missing from every team file: {missing}")
    return daily


def quantiles(values: list[float]) -> dict:
    if not values:
        return {"count": 0}
    ordered = sorted(values)
    pick = lambda q: ordered[min(len(ordered) - 1, max(0, round(q * (len(ordered) - 1))))]
    return {"count": len(ordered), "min": rounded(ordered[0]), "max": rounded(ordered[-1]),
            "mean": rounded(math.fsum(ordered) / len(ordered)),
            **{f"p{int(q * 100):02d}": rounded(pick(q)) for q in (0.01, 0.05, 0.25, 0.5, 0.75, 0.95, 0.99)}}


def relative(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--slr-root", default=os.environ.get("RMA_SLR_DATA_DIR"),
                        help="SLR delivery root containing raw/<scenario>/ec-avg-avg (env RMA_SLR_DATA_DIR)")
    parser.add_argument("--current-data-dir", default=os.environ.get("RMA_DATA_DIR", str(DEFAULT_DATA_DIR)),
                        help="Current-condition RMA data directory (env RMA_DATA_DIR)")
    parser.add_argument("--output-dir", default=os.environ.get("SCENARIO_EXPLORER_OUTPUT_DIR", str(DEFAULT_OUTPUT_DIR)),
                        help="Scenario Explorer data directory (env SCENARIO_EXPLORER_OUTPUT_DIR)")
    parser.add_argument("--workers", type=int, default=min(8, os.cpu_count() or 1))
    args = parser.parse_args()
    if not args.slr_root:
        parser.error("provide --slr-root or set RMA_SLR_DATA_DIR")
    slr_root, current_dir, output_dir = Path(args.slr_root), Path(args.current_data_dir), Path(args.output_dir)
    live_path = output_dir / LIVE_NAME

    live = json.loads(live_path.read_text(encoding="utf-8"))
    stations, regions, dates = live["stations"], live["regions"], live["dates"]
    reference_live = live["referenceStationValues"]
    station_by_name = {normalize(row["long_name"]): i for i, row in enumerate(stations)}
    if len(station_by_name) != len(stations):
        raise RuntimeError("Live station long names are not unique after normalization")
    date_index = {day: i for i, day in enumerate(dates)}
    region_indices = {region: [i for i, row in enumerate(stations) if row["region"] == region] for region in regions}

    # Read every input file (SLR runs plus current BAU and current counterparts) in parallel.
    jobs = {}
    for key, _, family, slr_dir, current_family in SLR_SCENARIOS:
        jobs[key] = discover(slr_root / "raw" / slr_dir / "ec-avg-avg")
        jobs[f"current:{current_family}"] = discover(current_dir / current_family)
    paths = [path for files in jobs.values() for path in files]
    print(f"Reading {len(paths)} {METRIC} files...")
    with ProcessPoolExecutor(max_workers=args.workers) as pool:
        parsed = dict(zip(paths, pool.map(read_file, map(str, paths), [station_by_name] * len(paths))))
    input_report: dict = {}
    absolute = {label: merge_scenario(label, [parsed[p] for p in files], stations, input_report,
                                      strict=not label.startswith("current:"))
                for label, files in jobs.items()}

    # The recomputed current BAU must reproduce the live reference before it can anchor SLR offsets.
    reference = absolute["current:baseline"]
    reference_mismatch = [(stations[i]["station_id"], day)
                          for i in range(len(stations)) for d, day in enumerate(dates)
                          if rounded(reference[i].get(day)) != reference_live[i][d]]
    if reference_mismatch:
        raise RuntimeError(f"Recomputed current BAU differs from live reference at {len(reference_mismatch)} "
                           f"station-days, e.g. {reference_mismatch[:5]}")

    slr_payload, extent = [], float(live["deltaExtent"])
    offsets_full: dict[str, list[list[float | None]]] = {}
    for key, label, family, _, _ in SLR_SCENARIOS:
        station_full = [[(slr - base) if (slr := absolute[key][i].get(day)) is not None
                         and (base := reference[i].get(day)) is not None else None for day in dates]
                        for i in range(len(stations))]
        offsets_full[key] = station_full
        region_values = {
            region: [rounded(math.fsum(vals) / len(vals))
                     if (vals := [station_full[i][d] for i in indices if station_full[i][d] is not None]) else None
                     for d in range(len(dates))]
            for region, indices in region_indices.items()
        }
        station_values = [[rounded(value) for value in series] for series in station_full]
        extent = max([extent] + [abs(v) for series in station_values for v in series if v is not None])
        slr_payload.append({
            "key": key, "label": label, "scenarioFamily": family, "climateCondition": "slr",
            "currentCounterpart": family,
            "sourceFiles": [relative(p, slr_root) for p in jobs[key]],
            "stationValues": station_values, "regionValues": region_values,
        })

    current_payload = [{**item, "scenarioFamily": item["key"], "climateCondition": "current",
                        "currentCounterpart": item["key"]} for item in live["scenarios"]]
    keys = [item["key"] for item in current_payload + slr_payload]
    if len(keys) != len(set(keys)) or "baseline" in keys:
        raise RuntimeError(f"Scenario keys must be unique and must not reuse 'baseline': {keys}")

    input_files = [{"scope": "slr", "path": relative(p, slr_root), "sha256": parsed[p]["sha256"]}
                   for key, *_ in SLR_SCENARIOS for p in jobs[key]]
    input_files += [{"scope": "current", "path": relative(p, current_dir), "sha256": parsed[p]["sha256"]}
                    for label, files in jobs.items() if label.startswith("current:") for p in files]
    output = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"), "metric": METRIC, "units": live["units"],
        "aggregation": ("Daily mean per station; regional lines are the mean of available station offsets. "
                        "Every offset = scenario absolute EC − current-condition BAU absolute EC "
                        "(referenceStationValues)."),
        "startDate": START_DATE, "dates": dates, "regions": regions, "deltaExtent": round(extent, 2),
        "stations": stations, "scenarios": current_payload + slr_payload,
        "referenceStationValues": reference_live,
        "reference": {
            "key": "baseline", "label": "Baseline", "scenarioFamily": "baseline", "climateCondition": "current",
            "description": "Current-condition BAU absolute daily EC. Absolute scenario EC = reference + offset. "
                           "baseline-slr is a delivered SLR run, not this zero-offset reference.",
        },
        "slrAvailability": {
            "delivered": [key for key, *_ in SLR_SCENARIOS],
            "unavailable": [{"key": key, "label": label, "scenarioFamily": family,
                             "reason": "Requires an RMA rerun; not included in the September 2026 SLR delivery."}
                            for key, label, family in UNAVAILABLE_SLR],
        },
        "provenance": {
            "slrDelivery": "RMA sea-level-rise EC delivery converted 2026-09-22 (SLR_EC.7z); EC-AVG-AVG files only.",
            "currentScenarios": f"Offsets and reference copied unchanged from {LIVE_NAME} (generatedAt {live['generatedAt']}).",
            "currentReferenceRecomputedFrom": "RMA data baseline/*_EC-AVG-AVG.csv; matches the live reference at every station-day.",
            "duplicateResolution": [{"stationId": sid, "team": team, "reason": reason}
                                    for sid, (team, reason) in DUPLICATE_RESOLUTION.items()],
            "inputFiles": input_files,
        },
    }
    output_dir.mkdir(parents=True, exist_ok=True)
    dashboard_path = output_dir / DASHBOARD_NAME
    dashboard_path.write_text(json.dumps(output, separators=(",", ":"), allow_nan=False, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {dashboard_path} ({len(dates)} days, {len(output['scenarios'])} scenarios)")

    validation = validate(dashboard_path, live, absolute, offsets_full, input_report, jobs, region_indices, date_index)
    validation_path = output_dir / VALIDATION_NAME
    validation_path.write_text(json.dumps(validation, indent=2, ensure_ascii=False), encoding="utf-8")
    failed = [name for name, check in validation["checks"].items() if not check["pass"]]
    print(f"Wrote {validation_path}: {len(validation['checks']) - len(failed)} passed, {len(failed)} failed {failed}")
    if failed:
        raise SystemExit(1)


def validate(dashboard_path, live, absolute, offsets_full, input_report, jobs, region_indices, date_index) -> dict:
    """Validate the emitted JSON (re-read from disk) against live metadata and independent raw absolutes."""
    text = dashboard_path.read_text(encoding="utf-8")
    data = json.loads(text, parse_constant=lambda token: (_ for _ in ()).throw(ValueError(token)))
    stations, dates, regions = data["stations"], data["dates"], data["regions"]
    scenarios = {item["key"]: item for item in data["scenarios"]}
    reference = data["referenceStationValues"]
    slr_keys = [key for key, *_ in SLR_SCENARIOS]
    checks: dict[str, dict] = {}

    def check(name: str, passed: bool, **details) -> None:
        checks[name] = {"pass": bool(passed), **details}

    check("stationCountAndOrder", len(stations) == EXPECTED_STATIONS and
          [s["station_id"] for s in stations] == [s["station_id"] for s in live["stations"]] and stations == live["stations"],
          stations=len(stations))
    check("regionsAndAssignments", regions == live["regions"] and
          all(a["region"] == b["region"] for a, b in zip(stations, live["stations"])), regions=regions)
    parsed_dates = [date.fromisoformat(day) for day in dates]
    gaps = [[a.isoformat(), b.isoformat()] for a, b in zip(parsed_dates, parsed_dates[1:]) if (b - a).days != 1]
    check("datesSortedUniqueContiguous", dates == sorted(set(dates)) and not gaps and dates == live["dates"]
          and dates[0] == START_DATE, first=dates[0], last=dates[-1], count=len(dates), calendarGaps=gaps)
    lengths_ok = all(len(series) == len(dates) for series in reference) and all(
        len(item["stationValues"]) == len(stations) and all(len(s) == len(dates) for s in item["stationValues"])
        and set(item["regionValues"]) == set(regions) and all(len(s) == len(dates) for s in item["regionValues"].values())
        for item in scenarios.values())
    check("seriesLengths", lengths_ok)
    check("finiteJson", not re.search(r"NaN|Infinity", text), note="Missing values are JSON null.")
    check("uniqueScenarioKeys", len(scenarios) == len(data["scenarios"]), keys=list(scenarios))
    check("fiveTeamFilesPerSlrScenario", all(len(jobs[key]) == 5 for key in slr_keys),
          files={key: [p.name for p in jobs[key]] for key in slr_keys})
    check("slrUnavailableNotEmitted", not {"reserve-slr", "tunnel-slr"} & set(scenarios)
          and [u["key"] for u in data["slrAvailability"]["unavailable"]] == ["reserve-slr", "tunnel-slr"])
    check("currentOffsetsRetained", all(scenarios[item["key"]]["stationValues"] == item["stationValues"]
                                        and scenarios[item["key"]]["regionValues"] == item["regionValues"]
                                        for item in live["scenarios"]))
    check("inputColumns", all(not r["unmatchedColumns"] and not r["missingStationIds"] and not r["repeatedColumnsWithinFile"]
                              and r["nonFiniteCells"] == 0 for r in input_report.values()),
          resolvedConflicts={label: [c["stationId"] for c in r["resolvedConflicts"]] for label, r in input_report.items()})

    # Paired coverage per scenario and region.
    coverage = {}
    for key in slr_keys:
        item = scenarios[key]
        coverage[key] = {region: {"paired": (n := sum(v is not None for i in idx for v in item["stationValues"][i])),
                                  "possible": len(idx) * len(dates), "fraction": round(n / (len(idx) * len(dates)), 4)}
                         for region, idx in region_indices.items()}
        coverage[key]["_regionDaysMissing"] = sum(v is None for s in item["regionValues"].values() for v in s)
    check("pairedCoverage", all(c["fraction"] == 1 for cov in coverage.values() for r, c in cov.items() if r != "_regionDaysMissing"),
          coverage=coverage)

    # Distribution statistics.
    stats = {"currentBauAbsolute": quantiles([v for s in reference for v in s if v is not None])}
    for key, *_ in SLR_SCENARIOS:
        family = scenarios[key]["scenarioFamily"]
        slr_abs = [v for i in range(len(stations)) for v in absolute[key][i].values()]
        diffs = [a - c for i in range(len(stations)) for day, a in absolute[key][i].items()
                 if (c := absolute[f"current:{family}"][i].get(day)) is not None]
        stats[key] = {"absolute": quantiles(slr_abs),
                      "offsetFromCurrentBau": quantiles([v for s in offsets_full[key] for v in s if v is not None]),
                      "minusCurrentCounterpart": quantiles(diffs),
                      "regionOffsetMeans": {region: quantiles([v for v in scenarios[key]["regionValues"][region] if v is not None])["mean"]
                                            for region in regions}}

    # Series anomalies: all-zero, constant, identical-to-counterpart, negative absolute.
    anomalies = []
    for key, *_ in SLR_SCENARIOS:
        family = scenarios[key]["scenarioFamily"]
        for i, station in enumerate(stations):
            offsets = [v for v in scenarios[key]["stationValues"][i] if v is not None]
            series = [absolute[key][i][day] for day in dates if day in absolute[key][i]]
            current = [absolute[f"current:{family}"][i].get(day) for day in dates if day in absolute[key][i]]
            flags = []
            if offsets and all(v == 0 for v in offsets):
                flags.append("allZeroOffset")
            if series and max(series) - min(series) < 1e-6:
                flags.append("constantAbsolute")
            if series == current:
                flags.append("identicalToCurrentCounterpart")
            if any(v < 0 for v in series):
                flags.append("negativeAbsolute")
            if flags:
                anomalies.append({"scenario": key, "stationId": station["station_id"], "longName": station["long_name"],
                                  "region": station["region"], "flags": flags,
                                  "absoluteRange": [rounded(min(series)), rounded(max(series))] if series else None})
        others = [k for k in slr_keys if k != key]
        for other in others:
            if key < other and scenarios[key]["stationValues"] == scenarios[other]["stationValues"]:
                anomalies.append({"scenario": key, "flags": [f"identicalScenarioTo:{other}"]})
    for anomaly in anomalies:
        if anomaly.get("stationId") in BOUNDARY_STATIONS and set(anomaly["flags"]) <= {"allZeroOffset", "identicalToCurrentCounterpart"}:
            anomaly["explanation"] = BOUNDARY_STATIONS[anomaly["stationId"]]
    unexplained = [a for a in anomalies if "explanation" not in a]
    check("seriesAnomalies", not unexplained, flagged=anomalies, unexplained=unexplained)

    # Date-shift check: lag of maximum correlation between day-over-day changes of SLR and current
    # counterpart region-mean absolutes. Levels are too smooth for this (Central Delta level correlation
    # is nearly flat across lags in current adaptation scenarios too); changes pin the alignment.
    def correlation(xs, ys):
        n = len(xs)
        if n < 3:
            return None
        mx, my = sum(xs) / n, sum(ys) / n
        vx, vy = sum((x - mx) ** 2 for x in xs), sum((y - my) ** 2 for y in ys)
        return None if vx == 0 or vy == 0 else sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / math.sqrt(vx * vy)

    lags = {}
    for key in slr_keys:
        family = scenarios[key]["scenarioFamily"]
        lags[key] = {}
        for region, idx in region_indices.items():
            slr_level = [sum(absolute[key][i][d] for i in idx) / len(idx) for d in dates]
            cur_level = [sum(absolute[f"current:{family}"][i][d] for i in idx) / len(idx) for d in dates]
            slr_mean = [b - a for a, b in zip(slr_level, slr_level[1:])]
            cur_mean = [b - a for a, b in zip(cur_level, cur_level[1:])]
            n = len(slr_mean)
            scores = {lag: correlation(slr_mean[max(0, lag):n + min(0, lag)],
                                       cur_mean[max(0, -lag):n - max(0, lag)]) for lag in range(-3, 4)}
            best = max((lag for lag in scores if scores[lag] is not None), key=lambda lag: scores[lag])
            lags[key][region] = {"bestLagDays": best, "correlationAtZero": round(scores[0], 5)}
    check("noDateShift", all(r["bestLagDays"] == 0 for s in lags.values() for r in s.values()), lags=lags)

    # Numerical identities on sampled and boundary station-days, against independent raw absolutes.
    rng = random.Random(20260923)
    samples = [(i, d) for i in (0, len(stations) - 1) for d in (0, len(dates) - 1)]
    samples += [(rng.randrange(len(stations)), rng.randrange(len(dates))) for _ in range(2000)]
    worst = defaultdict(float)
    count = defaultdict(int)
    for i, d in samples:
        day, base_abs = dates[d], absolute["current:baseline"][i].get(dates[d])
        for key in slr_keys:
            family = scenarios[key]["scenarioFamily"]
            offset = scenarios[key]["stationValues"][i][d]
            slr_abs = absolute[key][i].get(day)
            if offset is None or slr_abs is None or base_abs is None:
                continue
            worst["slrOffset=slrAbs-bauAbs"] = max(worst["slrOffset=slrAbs-bauAbs"], abs(offset - (slr_abs - base_abs)))
            count["slrOffset=slrAbs-bauAbs"] += 1
            if family != "baseline":
                cur_offset, cur_abs = scenarios[family]["stationValues"][i][d], absolute[f"current:{family}"][i].get(day)
                if cur_offset is not None and cur_abs is not None:
                    name = "slrOffset-currentOffset=slrAbs-currentAbs"
                    worst[name] = max(worst[name], abs((offset - cur_offset) - (slr_abs - cur_abs)))
                    count[name] += 1
            for other in slr_keys:
                if other <= key:
                    continue
                other_offset, other_abs = scenarios[other]["stationValues"][i][d], absolute[other][i].get(day)
                if other_offset is not None and other_abs is not None:
                    name = "slrBOffset-slrAOffset=slrBAbs-slrAAbs"
                    worst[name] = max(worst[name], abs((other_offset - offset) - (other_abs - slr_abs)))
                    count[name] += 1
    identities = {name: {"samples": count[name], "maxAbsError": round(worst[name], 6)} for name in worst}
    check("numericIdentities", all(v["maxAbsError"] <= TOLERANCE for v in identities.values()) and len(identities) == 3,
          tolerance=TOLERANCE, sampledStationDays=len(samples), identities=identities)

    # Region values = mean of available station offsets (checked at full precision).
    region_error = 0.0
    for key in slr_keys:
        for region, idx in region_indices.items():
            for d in range(0, len(dates), 7):
                vals = [offsets_full[key][i][d] for i in idx if offsets_full[key][i][d] is not None]
                region_error = max(region_error, abs(scenarios[key]["regionValues"][region][d] - sum(vals) / len(vals)))
    check("regionMeans", region_error <= 0.0051, maxAbsError=round(region_error, 6))

    # Retained current offsets vs. offsets recomputed from today's current-condition data.
    drift = {}
    for key, _, family, *_ in SLR_SCENARIOS:
        if family == "baseline":
            continue
        diffs = [abs(v - (absolute[f"current:{family}"][i][dates[d]] - absolute["current:baseline"][i][dates[d]]))
                 for i in range(len(stations)) for d, v in enumerate(scenarios[family]["stationValues"][i]) if v is not None]
        drift[family] = {"compared": len(diffs), "maxAbsDifference": round(max(diffs), 6),
                         "over0.01": sum(x > 0.0101 for x in diffs)}
    check("currentOffsetsMatchCurrentData", all(v["over0.01"] == 0 for v in drift.values()), drift=drift)

    return {"generatedAt": data["generatedAt"], "dashboard": dashboard_path.name, "startDate": START_DATE,
            "inputs": input_report, "statistics": stats, "checks": checks}


if __name__ == "__main__":
    main()
