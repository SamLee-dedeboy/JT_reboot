"""Rebuild RMA D-1641 compliance and all-date display metrics.

The authoritative sibling processor evaluates compliance only while an objective
is legally active. This wrapper preserves that behavior, applies the July 24
replacement overlay, and additionally calculates rolling/monthly metrics for
historical tooltip context on every date with complete inputs.
"""

from __future__ import annotations

import argparse
import csv
import importlib.util
from collections import defaultdict
from datetime import timedelta
from pathlib import Path


ROLLING_DEFINITIONS = [
    ("EMM", "agricultural", 14),
    ("JER", "agricultural", 14),
    ("STI", "agricultural", 14),
    ("SAL", "agricultural", 14),
    ("SJR", "agricultural", 30),
    ("BDT", "agricultural", 30),
    ("UNI", "agricultural", 30),
    ("OLD", "agricultural", 30),
    ("JER", "ecosystem_14d", 14),
    ("PPT", "ecosystem_14d", 14),
]
MONTHLY_DEFINITIONS = [("WCI", "agricultural"), ("DMC", "agricultural")]
DISPLAY_HEADER = [
    "scenario", "station_id", "objective", "date", "window_days",
    "metric", "calculated_value_us_cm", "data_status",
]
UPDATE_PREFIX = {"reserve": "COR_", "tunnel": "DCP_", "newgreen": "NGW_"}


def load_processor(path: Path):
    spec = importlib.util.spec_from_file_location("rma_d1641_processor", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load processor: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def display_metric_rows(processor, scenario_files) -> list[list]:
    """All-date rolling and calendar-month metrics for every processor scenario."""
    rows = []
    for scenario, folder in processor.SCENARIOS.items():
        files = scenario_files(folder)
        located = processor.locate_columns(files)
        selected = {
            station: candidates[0][:2]
            for station, candidates in located.items()
            if candidates and station in processor.MEAN_DAILY
        }
        grouped = defaultdict(dict)
        for station, (path, column) in selected.items():
            grouped[path][station] = column
        values = defaultdict(dict)
        for path, columns in grouped.items():
            partial, _ = processor.read_daily_series(path, columns)
            for station, series in partial.items():
                values[station].update(series)

        for station, objective, window in ROLLING_DEFINITIONS:
            series = values.get(station)
            if not series:
                continue
            current = processor.START
            while current <= processor.END:
                window_dates = [current - timedelta(days=offset) for offset in range(window)]
                observations = [series.get(day) for day in window_dates]
                if all(value is not None for value in observations):
                    metric = sum(observations) / window
                    rows.append([
                        scenario, station, objective, current, window,
                        "running_average", round(metric, 3), "complete",
                    ])
                current += timedelta(days=1)

        for station, objective in MONTHLY_DEFINITIONS:
            series = values.get(station)
            if not series:
                continue
            months = defaultdict(list)
            for day, value in series.items():
                months[(day.year, day.month)].append((day, value))
            for (year, month), observations in sorted(months.items()):
                first = processor.date(year, month, 1)
                next_month = processor.date(year + (month == 12), 1 if month == 12 else month + 1, 1)
                last = next_month - timedelta(days=1)
                if len(observations) != (last - first).days + 1:
                    continue
                metric = sum(value for _, value in observations) / len(observations)
                for day, _ in observations:
                    rows.append([
                        scenario, station, objective, day, "calendar_month",
                        "monthly_average", round(metric, 3), "complete",
                    ])
    return rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--processor", type=Path, required=True)
    parser.add_argument("--update-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    processor = load_processor(args.processor)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    processor.OUT = args.output_dir

    def overlaid_scenario_files(folder: str):
        paths = {
            path.name: path
            for path in (processor.DATA / folder).glob("*.csv")
            if "-AVG-AVG" not in path.name
        }
        prefix = UPDATE_PREFIX.get(folder)
        if prefix:
            paths.update({
                path.name: path
                for path in args.update_dir.glob(f"{prefix}*_EC.csv")
            })
        return sorted(paths.values(), key=lambda path: path.name)

    processor.scenario_files = overlaid_scenario_files
    processor.main()
    rows = display_metric_rows(processor, overlaid_scenario_files)

    output = args.output_dir / "rma_d1641_display_metrics.csv"
    with output.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(DISPLAY_HEADER)
        writer.writerows(rows)
    print(f"Wrote {output} ({len(rows)} rows)")


if __name__ == "__main__":
    main()
