import csv
import importlib.util
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT.parent / "data"
SUMMARY_SCRIPT = ROOT / "scripts" / "build_baseline_summary.py"
WORKBOOK = DATA_DIR / "ALL POINT STATIONS_FINAL REVISION_MAY 2026.xlsx"
BASELINE_LIST_DIR = DATA_DIR / "baseline_station_lists"
EXCEL_ONLY_UNION = ROOT / "public" / "data" / "stations_in_excel_not_baseline_union.csv"

TEAM_CONFIG = {
    "Base_Com": {"sheet": "RMA - EJ Community Locations", "label": "Community"},
    "Base_Ecolo": {"sheet": "RMA - Ecology", "label": "Ecology"},
    "Base_Econo": {"sheet": "RMA - Economy", "label": "Economy"},
    "Base_EJdef": {"sheet": "RMA - EJ DEFAULT", "label": "EJ Default"},
    "Base_Recr": {"sheet": "RMA - Recreation", "label": "Recreation"},
}


def load_summary_helpers():
    spec = importlib.util.spec_from_file_location("baseline_summary", SUMMARY_SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def read_baseline_list(stem, helpers):
    path = BASELINE_LIST_DIR / f"{stem}_station_list.csv"
    rows = []
    with path.open("r", newline="", encoding="utf-8-sig") as fh:
        for row in csv.DictReader(fh):
            row["normalized"] = helpers.norm_name(row.get("station_name"))
            rows.append(row)
    return rows


def compact_team_names(team_names):
    return "; ".join(sorted(team_names))


def main():
    helpers = load_summary_helpers()
    sheets = helpers.xlsx_sheets(WORKBOOK)
    all_discrepancies = []
    summary_rows = []
    excel_team_lookup = defaultdict(set)

    for stem, config in TEAM_CONFIG.items():
        excel_rows = helpers.station_rows(sheets[config["sheet"]])
        baseline_rows = read_baseline_list(stem, helpers)
        excel_by_norm = {helpers.norm_name(row["longName"]): row for row in excel_rows}
        baseline_by_norm = {row["normalized"]: row for row in baseline_rows}
        for key in excel_by_norm:
            excel_team_lookup[key].add(config["label"])

        discrepancies = []
        for key in sorted(set(excel_by_norm) - set(baseline_by_norm), key=lambda item: excel_by_norm[item]["longName"]):
            row = excel_by_norm[key]
            discrepancies.append(
                {
                    "team": config["label"],
                    "team_stem": stem,
                    "discrepancy": "xlsx_only",
                    "station_name": row["longName"],
                    "station #": row["stationNumber"],
                    "region": row["region"],
                    "short name": row["shortName"],
                    "origin": row["origin"],
                    "archive index": row["archiveIndex"],
                    "lat": row["lat"],
                    "long": row["lon"],
                }
            )

        for key in sorted(set(baseline_by_norm) - set(excel_by_norm), key=lambda item: baseline_by_norm[item]["station_name"]):
            row = baseline_by_norm[key]
            discrepancies.append(
                {
                    "team": config["label"],
                    "team_stem": stem,
                    "discrepancy": "baseline_only",
                    "station_name": row["station_name"],
                    "station #": row["station #"],
                    "region": row["region"],
                    "short name": row["short name"],
                    "origin": row["origin"],
                    "archive index": row["archive index"],
                    "lat": row["lat"],
                    "long": row["long"],
                }
            )

        out_path = BASELINE_LIST_DIR / f"{stem}_xlsx_discrepancies.csv"
        with out_path.open("w", newline="", encoding="utf-8") as fh:
            fieldnames = ["team", "team_stem", "discrepancy", "station_name", "station #", "region", "short name", "origin", "archive index", "lat", "long"]
            writer = csv.DictWriter(fh, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(discrepancies)

        all_discrepancies.extend(discrepancies)
        summary_rows.append(
            {
                "team": config["label"],
                "team_stem": stem,
                "xlsx_station_count": len(excel_rows),
                "baseline_station_count": len(baseline_rows),
                "xlsx_only_count": sum(1 for row in discrepancies if row["discrepancy"] == "xlsx_only"),
                "baseline_only_count": sum(1 for row in discrepancies if row["discrepancy"] == "baseline_only"),
                "discrepancy_file": str(out_path.relative_to(ROOT)),
            }
        )

    all_path = BASELINE_LIST_DIR / "all_team_xlsx_discrepancies.csv"
    with all_path.open("w", newline="", encoding="utf-8") as fh:
        fieldnames = ["team", "team_stem", "discrepancy", "station_name", "station #", "region", "short name", "origin", "archive index", "lat", "long"]
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_discrepancies)

    summary_path = BASELINE_LIST_DIR / "team_xlsx_comparison_summary.csv"
    with summary_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(summary_rows[0].keys()))
        writer.writeheader()
        writer.writerows(summary_rows)

    if EXCEL_ONLY_UNION.exists():
        mapped_rows = []
        with EXCEL_ONLY_UNION.open("r", newline="", encoding="utf-8-sig") as fh:
            for row in csv.DictReader(fh):
                key = helpers.norm_name(row.get("long name"))
                row["xlsx_team_tabs"] = compact_team_names(excel_team_lookup.get(key, set()))
                mapped_rows.append(row)

        mapped_path = BASELINE_LIST_DIR / "stations_in_excel_not_baseline_union_by_team.csv"
        with mapped_path.open("w", newline="", encoding="utf-8") as fh:
            fieldnames = list(mapped_rows[0].keys())
            writer = csv.DictWriter(fh, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(mapped_rows)

    print(f"Wrote comparison summary to {summary_path}")
    for row in summary_rows:
        print(
            f"{row['team']}: xlsx={row['xlsx_station_count']}, baseline={row['baseline_station_count']}, "
            f"xlsx_only={row['xlsx_only_count']}, baseline_only={row['baseline_only_count']}"
        )
    print(f"Wrote all discrepancies to {all_path}")


if __name__ == "__main__":
    main()
