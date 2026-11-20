"""Write the monthly CalSim boundary flows the scenario explorer draws on its map.

Reads tmp/bau-comparison/ops_flows_monthly.csv (extracted from the "BAU vs BAU (CalSim)"
analysis page; see that folder's README) and writes
public/data/operations/boundary-flows-monthly.json, keyed by the explorer's scenario keys.

    python scripts/scenario-explorer/build_boundary_flows.py
"""

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tmp" / "bau-comparison" / "ops_flows_monthly.csv"
TARGET = ROOT / "public" / "data" / "operations" / "boundary-flows-monthly.json"

SCENARIOS = {"BaseCalSim": "baseline-calsim", "COR": "reserve", "TUN": "tunnel"}
COLUMNS = {
    "sac": "sacramento",
    "sjr": "sanJoaquin",
    "net_outflow": "netDeltaOutflow",
    "swp": "swpExports",
    "cvp": "cvpExports",
    "tunnel": "tunnelDiversion",
}


def main() -> None:
    with SOURCE.open(newline="") as handle:
        rows = list(csv.DictReader(handle))
    months = sorted({row["month"] for row in rows})
    scenarios = {
        key: {field: [0] * len(months) for field in COLUMNS.values()} for key in SCENARIOS.values()
    }
    for row in rows:
        key = SCENARIOS.get(row["scenario"])
        if key is None:
            continue
        index = months.index(row["month"])
        for column, field in COLUMNS.items():
            scenarios[key][field][index] = round(float(row[column]) / 10) * 10
    payload = {
        "schemaVersion": 1,
        "title": "Delta boundary flows, monthly",
        "source": (
            "COEQWAL CalSim3 runs s0020 (BAU CalSim), s0044 (Calling on Reserves) and s0065 "
            "(A Tunnel), boundary series as delivered for the RMA runs in October 2026. Monthly "
            "means of the daily series, rounded to the nearest 10 cfs."
        ),
        "units": "cfs",
        "months": months,
        "scenarios": scenarios,
    }
    TARGET.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"Wrote {TARGET.relative_to(ROOT)} ({len(months)} months)")


if __name__ == "__main__":
    main()
