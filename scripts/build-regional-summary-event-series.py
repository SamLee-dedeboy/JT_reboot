import csv
import json
import sqlite3
import sys
from datetime import date, timedelta
from pathlib import Path


def rolling_mean(values, window=7):
    result = []
    for index in range(len(values)):
        sample = [value for value in values[max(0, index - window + 1) : index + 1] if value is not None]
        result.append(round(sum(sample) / len(sample), 4) if len(sample) >= 5 else None)
    return result


if len(sys.argv) != 4:
    raise SystemExit(
        "Usage: build-regional-summary-event-series.py <selected-patterns.csv> <timeseries.db> <output.json>"
    )

patterns_path, database_path, output_path = map(Path, sys.argv[1:])
connection = sqlite3.connect(f"file:{database_path.as_posix()}?mode=ro", uri=True)
output = {}
north_franks_path = patterns_path.parent / "north_franks_tract.geojson"
north_franks_station_ids = json.loads(north_franks_path.read_text(encoding="utf-8"))["features"][0][
    "properties"
]["station_ids"]

with patterns_path.open(newline="", encoding="utf-8") as source:
    for pattern in csv.DictReader(source):
        if (
            pattern.get("candidate_type") == "threshold_consequence"
            or not pattern.get("start_date")
            or not pattern.get("end_date")
        ):
            continue

        event_start = date.fromisoformat(pattern["start_date"])
        event_end = date.fromisoformat(pattern["end_date"])
        display_start = event_start - timedelta(days=14)
        display_end = event_end + timedelta(days=14)
        query_start = display_start - timedelta(days=6)
        rows = connection.execute(
            """
            SELECT date, baseline_mean, scenario_mean
            FROM daily_regional
            WHERE geo_scale = ? AND geo_id = ? AND scenario_key = ?
              AND date BETWEEN ? AND ?
            ORDER BY date
            """,
            (
                pattern["geo_scale"],
                pattern["geo_id"],
                pattern["scenario_key"],
                query_start.isoformat(),
                display_end.isoformat(),
            ),
        ).fetchall()
        if not rows and pattern["geo_id"] == "north_franks_tract":
            station_placeholders = ",".join("?" for _ in north_franks_station_ids)
            rows = connection.execute(
                f"""
                SELECT date, AVG(baseline_ec), AVG(scenario_ec)
                FROM (
                    SELECT date, station_idx, AVG(baseline_ec) AS baseline_ec,
                           AVG(scenario_ec) AS scenario_ec
                    FROM daily_station
                    WHERE scenario_key = ? AND station_idx IN ({station_placeholders})
                      AND date BETWEEN ? AND ?
                    GROUP BY date, station_idx
                )
                GROUP BY date
                ORDER BY date
                """,
                [pattern["scenario_key"], *north_franks_station_ids, query_start.isoformat(), display_end.isoformat()],
            ).fetchall()

        dates = [row[0] for row in rows]
        baseline = rolling_mean([row[1] for row in rows])
        scenario = rolling_mean([row[2] for row in rows])
        if pattern["geo_id"] == "north_franks_tract":
            station_placeholders = ",".join("?" for _ in north_franks_station_ids)
            station_rows = connection.execute(
                f"""
                SELECT date, station_idx, AVG(scenario_ec)
                FROM daily_station
                WHERE scenario_key = ? AND station_idx IN ({station_placeholders})
                  AND date BETWEEN ? AND ?
                GROUP BY date, station_idx
                ORDER BY station_idx, date
                """,
                [pattern["scenario_key"], *north_franks_station_ids, query_start.isoformat(), display_end.isoformat()],
            ).fetchall()
        else:
            station_rows = connection.execute(
                """
                SELECT date, station_idx, scenario_ec
                FROM daily_station
                WHERE geo_scale = ? AND geo_id = ? AND scenario_key = ?
                  AND date BETWEEN ? AND ?
                ORDER BY station_idx, date
                """,
                (
                    pattern["geo_scale"],
                    pattern["geo_id"],
                    pattern["scenario_key"],
                    query_start.isoformat(),
                    display_end.isoformat(),
                ),
            ).fetchall()
        by_station = {}
        for row_date, station_idx, scenario_ec in station_rows:
            by_station.setdefault(station_idx, []).append((row_date, scenario_ec))
        station_values_by_date = {}
        for station_values in by_station.values():
            smoothed = rolling_mean([value for _, value in station_values])
            for (row_date, _), value in zip(station_values, smoothed):
                if value is not None:
                    station_values_by_date.setdefault(row_date, []).append(value)
        scenario_min = [
            min(station_values_by_date.get(row_date, []), default=None) for row_date in dates
        ]
        scenario_max = [
            max(station_values_by_date.get(row_date, []), default=None) for row_date in dates
        ]
        visible = [index for index, value in enumerate(dates) if value >= display_start.isoformat()]
        output[pattern["pattern_id"]] = {
            "dates": [dates[index] for index in visible],
            "baseline": [baseline[index] for index in visible],
            "scenario": [scenario[index] for index in visible],
            "scenarioMin": [scenario_min[index] for index in visible],
            "scenarioMax": [scenario_max[index] for index in visible],
        }

connection.close()
output_path.parent.mkdir(parents=True, exist_ok=True)
output_path.write_text(json.dumps(output, separators=(",", ":")), encoding="utf-8")
print(f"Wrote {len(output)} event series to {output_path}")
