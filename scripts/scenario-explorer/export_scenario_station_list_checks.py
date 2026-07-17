import csv
import importlib.util
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT.parent / "data"
SUMMARY_SCRIPT = ROOT / "scripts" / "build_baseline_summary.py"
WORKBOOK = DATA_DIR / "ALL POINT STATIONS_FINAL REVISION_MAY 2026.xlsx"
OUT_DIR = DATA_DIR / "scenario_station_list_checks"

SCENARIOS = ["baseline", "reserve", "tunnel", "newgreen", "ecomachine", "bolster"]
TEAMS = {
    "Com": {"sheet": "RMA - EJ Community Locations", "label": "Community"},
    "Ecolo": {"sheet": "RMA - Ecology", "label": "Ecology"},
    "Econo": {"sheet": "RMA - Economy", "label": "Economy"},
    "EJdef": {"sheet": "RMA - EJ DEFAULT", "label": "EJ Default"},
    "Recr": {"sheet": "RMA - Recreation", "label": "Recreation"},
}


def load_summary_helpers():
    spec = importlib.util.spec_from_file_location("baseline_summary", SUMMARY_SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def read_header(path):
    with path.open("r", newline="", encoding="utf-8-sig") as fh:
        return next(csv.reader(fh))


def find_one(directory, pattern):
    matches = sorted(directory.glob(pattern))
    if len(matches) != 1:
        raise FileNotFoundError(f"Expected exactly one match for {directory / pattern}; found {len(matches)}")
    return matches[0]


def write_csv(path, rows, fieldnames):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def station_meta_by_norm(workbook_rows, helpers):
    return {helpers.norm_name(row["longName"]): row for row in workbook_rows}


def compare_sequence(xlsx_rows, ec_stations, avg_stations, helpers):
    xlsx_norms = [helpers.norm_name(row["longName"]) for row in xlsx_rows]
    ec_norms = [helpers.norm_name(name) for name in ec_stations]
    avg_norms = [helpers.norm_name(name) for name in avg_stations]
    xlsx_set = set(xlsx_norms)
    ec_set = set(ec_norms)

    return {
        "ec_avg_header_matches_ec": ec_norms == avg_norms,
        "same_station_set_as_xlsx": ec_set == xlsx_set,
        "same_station_order_as_xlsx": ec_norms == xlsx_norms,
        "xlsx_only_norms": [key for key in xlsx_norms if key not in ec_set],
        "data_only_norms": [key for key in ec_norms if key not in xlsx_set],
        "order_mismatch_count": sum(1 for idx, key in enumerate(xlsx_norms) if idx >= len(ec_norms) or ec_norms[idx] != key),
        "ec_avg_mismatch_count": sum(
            1
            for idx in range(max(len(ec_norms), len(avg_norms)))
            if (ec_norms[idx] if idx < len(ec_norms) else "") != (avg_norms[idx] if idx < len(avg_norms) else "")
        ),
    }


def main():
    helpers = load_summary_helpers()
    sheets = helpers.xlsx_sheets(WORKBOOK)
    workbook_by_team = {
        team_key: helpers.station_rows(sheets[config["sheet"]])
        for team_key, config in TEAMS.items()
    }
    workbook_meta = {
        team_key: station_meta_by_norm(rows, helpers)
        for team_key, rows in workbook_by_team.items()
    }

    summary_rows = []
    all_discrepancies = []

    for scenario in SCENARIOS:
        scenario_dir = DATA_DIR / scenario
        scenario_out = OUT_DIR / scenario
        for team_key, team_config in TEAMS.items():
            ec_path = find_one(scenario_dir, f"*_{team_key}_JT_*_EC_EC.csv")
            avg_path = find_one(scenario_dir, f"*_{team_key}_JT_*_EC_EC-AVG-AVG.csv")
            ec_stations = read_header(ec_path)[1:]
            avg_stations = read_header(avg_path)[1:]
            xlsx_rows = workbook_by_team[team_key]
            meta_by_norm = workbook_meta[team_key]
            result = compare_sequence(xlsx_rows, ec_stations, avg_stations, helpers)

            station_rows = []
            for idx in range(max(len(ec_stations), len(avg_stations))):
                ec_name = ec_stations[idx] if idx < len(ec_stations) else ""
                avg_name = avg_stations[idx] if idx < len(avg_stations) else ""
                norm = helpers.norm_name(ec_name or avg_name)
                meta = meta_by_norm.get(norm, {})
                station_rows.append(
                    {
                        "scenario": scenario,
                        "team": team_config["label"],
                        "team_key": team_key,
                        "data_column_index": idx + 1,
                        "station_name": ec_name or avg_name,
                        "ec_station_name": ec_name,
                        "ec_avg_avg_station_name": avg_name,
                        "ec_matches_ec_avg_avg": "yes" if helpers.norm_name(ec_name) == helpers.norm_name(avg_name) else "no",
                        "matches_xlsx_team_tab": "yes" if norm in meta_by_norm else "no",
                        "station #": meta.get("stationNumber", ""),
                        "region": meta.get("region", ""),
                        "long name": meta.get("longName", ""),
                        "short name": meta.get("shortName", ""),
                        "origin": meta.get("origin", ""),
                        "archive index": meta.get("archiveIndex", ""),
                    }
                )

            station_list_path = scenario_out / f"{scenario}_{team_key}_station_list.csv"
            write_csv(station_list_path, station_rows, list(station_rows[0].keys()))

            discrepancies = []
            for norm in result["xlsx_only_norms"]:
                meta = meta_by_norm[norm]
                discrepancies.append(
                    {
                        "scenario": scenario,
                        "team": team_config["label"],
                        "team_key": team_key,
                        "discrepancy": "xlsx_only",
                        "station_name": meta["longName"],
                        "station #": meta["stationNumber"],
                        "region": meta["region"],
                        "short name": meta["shortName"],
                        "origin": meta["origin"],
                        "archive index": meta["archiveIndex"],
                    }
                )
            data_meta = {helpers.norm_name(row["station_name"]): row for row in station_rows}
            for norm in result["data_only_norms"]:
                row = data_meta[norm]
                discrepancies.append(
                    {
                        "scenario": scenario,
                        "team": team_config["label"],
                        "team_key": team_key,
                        "discrepancy": "data_only",
                        "station_name": row["station_name"],
                        "station #": row["station #"],
                        "region": row["region"],
                        "short name": row["short name"],
                        "origin": row["origin"],
                        "archive index": row["archive index"],
                    }
                )

            discrepancy_path = scenario_out / f"{scenario}_{team_key}_xlsx_discrepancies.csv"
            discrepancy_fields = ["scenario", "team", "team_key", "discrepancy", "station_name", "station #", "region", "short name", "origin", "archive index"]
            write_csv(discrepancy_path, discrepancies, discrepancy_fields)
            all_discrepancies.extend(discrepancies)

            station_membership_exact_match = (
                result["ec_avg_header_matches_ec"]
                and result["same_station_set_as_xlsx"]
            )
            station_sequence_exact_match = (
                station_membership_exact_match
                and result["same_station_order_as_xlsx"]
            )
            summary_rows.append(
                {
                    "scenario": scenario,
                    "team": team_config["label"],
                    "team_key": team_key,
                    "xlsx_station_count": len(xlsx_rows),
                    "ec_station_count": len(ec_stations),
                    "ec_avg_avg_station_count": len(avg_stations),
                    "ec_avg_header_matches_ec": "yes" if result["ec_avg_header_matches_ec"] else "no",
                    "same_station_set_as_xlsx": "yes" if result["same_station_set_as_xlsx"] else "no",
                    "same_station_order_as_xlsx": "yes" if result["same_station_order_as_xlsx"] else "no",
                    "station_membership_exact_match": "yes" if station_membership_exact_match else "no",
                    "station_sequence_exact_match": "yes" if station_sequence_exact_match else "no",
                    "xlsx_only_count": len(result["xlsx_only_norms"]),
                    "data_only_count": len(result["data_only_norms"]),
                    "order_mismatch_count": result["order_mismatch_count"],
                    "ec_avg_mismatch_count": result["ec_avg_mismatch_count"],
                    "station_list_file": str(station_list_path.relative_to(ROOT)),
                    "discrepancy_file": str(discrepancy_path.relative_to(ROOT)),
                    "ec_file": str(ec_path.relative_to(ROOT)),
                    "ec_avg_avg_file": str(avg_path.relative_to(ROOT)),
                }
            )

    summary_path = OUT_DIR / "scenario_team_station_list_summary.csv"
    write_csv(summary_path, summary_rows, list(summary_rows[0].keys()))
    discrepancy_path = OUT_DIR / "all_scenario_team_xlsx_discrepancies.csv"
    discrepancy_fields = ["scenario", "team", "team_key", "discrepancy", "station_name", "station #", "region", "short name", "origin", "archive index"]
    write_csv(discrepancy_path, all_discrepancies, discrepancy_fields)

    print(f"Wrote summary to {summary_path}")
    print(f"Wrote discrepancies to {discrepancy_path}")
    exact_membership = sum(1 for row in summary_rows if row["station_membership_exact_match"] == "yes")
    exact_sequence = sum(1 for row in summary_rows if row["station_sequence_exact_match"] == "yes")
    print(f"Exact station membership matches: {exact_membership}/{len(summary_rows)} scenario-team pairs")
    print(f"Exact station order matches: {exact_sequence}/{len(summary_rows)} scenario-team pairs")
    for row in summary_rows:
        if row["station_membership_exact_match"] != "yes":
            print(
                f"{row['scenario']} / {row['team']}: membership={row['station_membership_exact_match']}, "
                f"set={row['same_station_set_as_xlsx']}, order={row['same_station_order_as_xlsx']}, "
                f"xlsx_only={row['xlsx_only_count']}, data_only={row['data_only_count']}, "
                f"ec_avg_mismatch={row['ec_avg_mismatch_count']}"
            )


if __name__ == "__main__":
    main()
