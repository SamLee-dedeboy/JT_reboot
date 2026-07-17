import csv
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT.parent / "data"
SCHISM_DIR = DATA_DIR / "baseline_schism"
FINALIZED_CSV = DATA_DIR / "all_point_stations_finalized.csv"
SCHISM_CSV = SCHISM_DIR / "run_15_salinity_raw_Daily_Maximum_15_Minutes_Raw_processed_EC.csv"
STATION_IN = SCHISM_DIR / "station.in_2025_10_21_reformat.txt"
OUT_SHARED = SCHISM_DIR / "shared_station_crosswalk.csv"
OUT_EXCEL_ONLY = SCHISM_DIR / "finalized_archive_index_not_in_schism.csv"
OUT_SCHISM_ONLY = SCHISM_DIR / "schism_index_not_in_finalized_archive_index.csv"
OUT_NAME_AUDIT = SCHISM_DIR / "shared_station_name_audit.csv"


def clean(value):
    return " ".join(str(value or "").strip().split())


def norm_name(value):
    return re.sub(r"[^a-z0-9]+", "", str(value or "").lower())


def parse_schism_header():
    with SCHISM_CSV.open("r", newline="", encoding="utf-8-sig") as fh:
        header = next(csv.reader(fh))
    out = {}
    for column in header[1:]:
        match = re.match(r"^(\d+)_(.*)$", column)
        if not match:
            continue
        index = str(int(match.group(1)))
        out[index] = {"schism_index": index, "schism_csv_name": clean(match.group(2)), "schism_csv_column": column}
    return out


def parse_station_in():
    out = {}
    with STATION_IN.open("r", encoding="utf-8-sig") as fh:
        lines = fh.readlines()
    for line in lines[2:]:
        line = line.strip()
        if not line:
            continue
        match = re.match(
            r"^(\d+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+!\s+(\S+)\s+(\S+)\s+\"(.*)\"",
            line,
        )
        if not match:
            continue
        index, x, y, z, short_name, layer, long_name = match.groups()
        out[str(int(index))] = {
            "station_in_x": x,
            "station_in_y": y,
            "station_in_z": z,
            "station_in_short_name": clean(short_name),
            "station_in_layer": clean(layer),
            "station_in_name": clean(long_name),
        }
    return out


def main():
    finalized_rows = list(csv.DictReader(FINALIZED_CSV.open("r", encoding="utf-8-sig")))
    schism_columns = parse_schism_header()
    station_in = parse_station_in()

    finalized_by_archive = {}
    duplicate_archive_rows = []
    for row in finalized_rows:
        archive_index = clean(row.get("archive index"))
        if not archive_index:
            continue
        archive_index = str(int(float(archive_index)))
        normalized = {key: clean(value) for key, value in row.items()}
        normalized["archive index"] = archive_index
        if archive_index in finalized_by_archive:
            duplicate_archive_rows.append(normalized)
        else:
            finalized_by_archive[archive_index] = normalized

    shared_indices = sorted(set(finalized_by_archive) & set(schism_columns), key=lambda value: int(value))
    excel_only_indices = sorted(set(finalized_by_archive) - set(schism_columns), key=lambda value: int(value))
    schism_only_indices = sorted(set(schism_columns) - set(finalized_by_archive), key=lambda value: int(value))

    shared_fields = [
        "station #",
        "region",
        "long name",
        "short name",
        "origin",
        "archive index",
        "lat",
        "long",
        "schism_index",
        "schism_csv_name",
        "schism_csv_column",
        "station_in_name",
        "station_in_short_name",
        "station_in_layer",
        "station_in_x",
        "station_in_y",
        "station_in_z",
    ]
    with OUT_SHARED.open("w", newline="", encoding="utf-8-sig") as fh:
        writer = csv.DictWriter(fh, fieldnames=shared_fields)
        writer.writeheader()
        for index in shared_indices:
            row = {**finalized_by_archive[index], **schism_columns[index], **station_in.get(index, {})}
            writer.writerow({field: row.get(field, "") for field in shared_fields})

    audit_fields = ["archive index", "long name", "schism_csv_name", "station_in_name", "note"]
    audit_rows = []
    for index in shared_indices:
        row = {**finalized_by_archive[index], **schism_columns[index], **station_in.get(index, {})}
        finalized_name = norm_name(row.get("long name"))
        schism_name = norm_name(row.get("schism_csv_name"))
        station_in_name = norm_name(row.get("station_in_name"))
        if (
            finalized_name
            and schism_name
            and finalized_name not in schism_name
            and schism_name not in finalized_name
            and finalized_name not in station_in_name
            and station_in_name not in finalized_name
        ):
            audit_rows.append(
                {
                    "archive index": index,
                    "long name": row.get("long name", ""),
                    "schism_csv_name": row.get("schism_csv_name", ""),
                    "station_in_name": row.get("station_in_name", ""),
                    "note": "Name differs after simple normalization; many are abbreviation-only, but review before treating archive-index join as authoritative.",
                }
            )
    with OUT_NAME_AUDIT.open("w", newline="", encoding="utf-8-sig") as fh:
        writer = csv.DictWriter(fh, fieldnames=audit_fields)
        writer.writeheader()
        writer.writerows(audit_rows)

    with OUT_EXCEL_ONLY.open("w", newline="", encoding="utf-8-sig") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(finalized_rows[0].keys()))
        writer.writeheader()
        for index in excel_only_indices:
            writer.writerow(finalized_by_archive[index])

    schism_only_fields = ["schism_index", "schism_csv_name", "schism_csv_column", "station_in_name", "station_in_short_name", "station_in_layer", "station_in_x", "station_in_y", "station_in_z"]
    with OUT_SCHISM_ONLY.open("w", newline="", encoding="utf-8-sig") as fh:
        writer = csv.DictWriter(fh, fieldnames=schism_only_fields)
        writer.writeheader()
        for index in schism_only_indices:
            row = {**schism_columns[index], **station_in.get(index, {})}
            writer.writerow({field: row.get(field, "") for field in schism_only_fields})

    print(f"Finalized stations: {len(finalized_rows)}")
    print(f"Finalized stations with archive index: {len(finalized_by_archive)}")
    print(f"SCHISM CSV station columns: {len(schism_columns)}")
    print(f"SCHISM station.in rows: {len(station_in)}")
    print(f"Shared archive/SCHISM indices: {len(shared_indices)}")
    print(f"Finalized archive indices not in SCHISM CSV: {len(excel_only_indices)}")
    print(f"SCHISM CSV indices not in finalized archive index: {len(schism_only_indices)}")
    print(f"Duplicate archive index rows in finalized CSV: {len(duplicate_archive_rows)}")
    print(f"Potential shared-name audit rows: {len(audit_rows)}")
    print(f"Wrote {OUT_SHARED}")
    print(f"Wrote {OUT_EXCEL_ONLY}")
    print(f"Wrote {OUT_SCHISM_ONLY}")
    print(f"Wrote {OUT_NAME_AUDIT}")


if __name__ == "__main__":
    main()
