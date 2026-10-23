"""Run the complete D-1641 pipeline for the three CalSim RMA reruns."""

from __future__ import annotations

import argparse
import csv
import subprocess
import sys
from pathlib import Path

from build_d1641_display_metrics import DISPLAY_HEADER, display_metric_rows, load_processor


SCENARIOS = {
    "baseline-calsim": "baseline_calsim",
    "reserve-calsim": "reserve_calsim",
    "tunnel-calsim": "tunnel_calsim",
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--processor", type=Path, required=True)
    parser.add_argument("--data-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--json-output", type=Path, required=True)
    args = parser.parse_args()

    processor = load_processor(args.processor)
    processor.DATA = args.data_dir
    processor.OUT = args.output_dir
    processor.SCENARIOS = SCENARIOS
    processor.main()

    rows = display_metric_rows(processor, processor.scenario_files)
    display_path = args.output_dir / "rma_d1641_display_metrics.csv"
    with display_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(DISPLAY_HEADER)
        writer.writerows(rows)
    print(f"Wrote {display_path} ({len(rows)} rows)")

    builder = Path(__file__).with_name("build-d1641-data.mjs")
    subprocess.run(
        [
            "node",
            str(builder),
            str(args.output_dir),
            str(args.json_output),
            "RMA/data/{baseline_calsim,reserve_calsim,tunnel_calsim}",
        ],
        check=True,
    )


if __name__ == "__main__":
    sys.exit(main())
