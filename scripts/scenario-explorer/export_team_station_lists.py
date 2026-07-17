import csv
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT.parent / "data"
BASELINE_DIR = DATA_DIR / "baseline"
FINALIZED_CSV = DATA_DIR / "all_point_stations_finalized.csv"
OUT_DIR = DATA_DIR / "baseline_station_lists"

TEAMS = [
    ("Base_Com", "Community"),
    ("Base_Ecolo", "Ecology"),
    ("Base_Econo", "Economy"),
    ("Base_EJdef", "EJ Default"),
    ("Base_Recr", "Recreation"),
]


def norm_name(value):
    return re.sub(r"[^a-z0-9]+", "", str(value or "").strip().lower())


def read_header(path):
    with path.open("r", newline="", encoding="utf-8-sig") as fh:
        return next(csv.reader(fh))


def load_finalized_stations():
    by_norm = {}
    with FINALIZED_CSV.open("r", newline="", encoding="utf-8-sig") as fh:
        for row in csv.DictReader(fh):
            key = norm_name(row.get("long name"))
            if key and key not in by_norm:
                by_norm[key] = row
    return by_norm


def export_team(stem, label, finalized):
    ec_path = BASELINE_DIR / f"{stem}_JT_BASE_EC_EC.csv"
    avg_path = BASELINE_DIR / f"{stem}_JT_BASE_EC_EC-AVG-AVG.csv"
    ec_header = read_header(ec_path)
    avg_header = read_header(avg_path)
    ec_stations = ec_header[1:]
    avg_stations = avg_header[1:]
    max_len = max(len(ec_stations), len(avg_stations))
    rows = []

    for idx in range(max_len):
        ec_name = ec_stations[idx] if idx < len(ec_stations) else ""
        avg_name = avg_stations[idx] if idx < len(avg_stations) else ""
        station_name = ec_name or avg_name
        meta = finalized.get(norm_name(station_name), {})
        rows.append(
            {
                "team": label,
                "team_stem": stem,
                "data_column_index": idx + 1,
                "station_name": station_name,
                "ec_station_name": ec_name,
                "ec_avg_avg_station_name": avg_name,
                "ec_matches_ec_avg_avg": "yes" if ec_name == avg_name else "no",
                "station #": meta.get("station #", ""),
                "region": meta.get("region", ""),
                "long name": meta.get("long name", ""),
                "short name": meta.get("short name", ""),
                "origin": meta.get("origin", ""),
                "archive index": meta.get("archive index", ""),
                "lat": meta.get("lat", ""),
                "long": meta.get("long", ""),
                "matched_finalized_station": "yes" if meta else "no",
            }
        )

    out_path = OUT_DIR / f"{stem}_station_list.csv"
    with out_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    mismatch_count = sum(1 for row in rows if row["ec_matches_ec_avg_avg"] == "no")
    unmatched_count = sum(1 for row in rows if row["matched_finalized_station"] == "no")
    return {
        "team": label,
        "team_stem": stem,
        "station_count": len(rows),
        "ec_station_count": len(ec_stations),
        "ec_avg_avg_station_count": len(avg_stations),
        "ec_avg_avg_header_matches_ec": "yes" if mismatch_count == 0 and len(ec_stations) == len(avg_stations) else "no",
        "name_or_order_mismatch_count": mismatch_count,
        "unmatched_finalized_station_count": unmatched_count,
        "output_file": str(out_path.relative_to(ROOT)),
    }


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    finalized = load_finalized_stations()
    summary = [export_team(stem, label, finalized) for stem, label in TEAMS]
    summary_path = OUT_DIR / "team_station_list_summary.csv"
    with summary_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(summary[0].keys()))
        writer.writeheader()
        writer.writerows(summary)

    print(f"Wrote {len(summary)} team station lists to {OUT_DIR}")
    for row in summary:
        print(
            f"{row['team']}: {row['station_count']} stations, "
            f"EC/EC-AVG-AVG match={row['ec_avg_avg_header_matches_ec']}, "
            f"unmatched finalized={row['unmatched_finalized_station_count']}"
        )


if __name__ == "__main__":
    main()
