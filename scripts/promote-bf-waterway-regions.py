"""Promote the Bolster & Fortify waterway-region geometries into the curated runtime files.

Copies the supplied JT_exploration waterway regions into ``raw/`` and then updates
``pattern-list.json``, ``pattern-ec-series-7d.json`` and ``region-of-interest.geojson``:

- Clifton Court Forebay replaces its approximate station hull with the supplied polygon.
- The freshwater corridor (``bf_freshwater_pathway``) is added as a Bolster & Fortify place
  using its shortlisted fresher pattern and the matching raw 7-day event series.

Usage: promote-bf-waterway-regions.py <JT_exploration/RMA/BDSC_regional_summary/inputs/waterway_regions>
"""

from __future__ import annotations

import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "public/data/regional-summary"
RAW_DIR = DATA_DIR / "raw"

CORRIDOR_PATTERN_ID = "586a7d2d02653c70"
CLIFTON_STATION_IDS = [284, 288, 355, 357, 358, 360, 362, 363, 369]

REGIONS = {
    "clifton_court_forebay": {
        "source": "clifton_court_forebay.geojson",
        "name": "Clifton Court Forebay",
        "coordinates": [-121.574, 37.839],
        "note": "Uses the supplied candidate Clifton Court Forebay waterway-region geometry.",
    },
    "bf_freshwater_pathway": {
        "source": "freshwater_corridor_narrow.geojson",
        "raw": "freshwater_corridor.geojson",
        "name": "Freshwater Corridor",
        "coordinates": [-121.571, 37.955],
        "note": "Uses the supplied candidate freshwater corridor waterway-region geometry.",
    },
}


def drop_z(value: list) -> list:
    if value and isinstance(value[0], (int, float)):
        return value[:2]
    return [drop_z(item) for item in value]


def normalized_geometry(geometry: dict) -> dict:
    """Flatten single-type GeometryCollections and strip stray Z values for Mapbox."""
    if geometry["type"] == "GeometryCollection":
        polygons = [part for part in geometry["geometries"] if part["type"] == "Polygon"]
        geometry = (
            polygons[0]
            if len(polygons) == 1
            else {"type": "MultiPolygon", "coordinates": [part["coordinates"] for part in polygons]}
        )
    return {"type": geometry["type"], "coordinates": drop_z(geometry["coordinates"])}


def number(value: str) -> float | int | None:
    if value == "":
        return None
    parsed = float(value)
    return int(parsed) if parsed.is_integer() else parsed


def write_json(path: Path, value: object, *, compact: bool = False) -> None:
    text = (
        json.dumps(value, ensure_ascii=False, separators=(",", ":"))
        if compact
        else json.dumps(value, ensure_ascii=False, indent=2)
    )
    path.write_text(f"{text}\n", encoding="utf-8")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    source_dir = Path(sys.argv[1])

    # Preserve normalized working copies alongside the other raw geometries.
    geometries: dict[str, dict] = {}
    for region_id, region in REGIONS.items():
        collection = json.loads((source_dir / region["source"]).read_text(encoding="utf-8"))
        feature = collection["features"][0]
        feature["geometry"] = normalized_geometry(feature["geometry"])
        geometries[region_id] = feature["geometry"]
        write_json(RAW_DIR / region.get("raw", region["source"]), collection, compact=True)

    with (RAW_DIR / "selected-patterns.csv").open(newline="", encoding="utf-8") as source:
        corridor = next(row for row in csv.DictReader(source) if row["pattern_id"] == CORRIDOR_PATTERN_ID)
    corridor_station_ids = sorted(
        json.loads(corridor["agreeing_station_ids"]) + json.loads(corridor["disagreeing_station_ids"])
    )

    # Region-of-interest geometries.
    region_path = DATA_DIR / "region-of-interest.geojson"
    region_collection = json.loads(region_path.read_text(encoding="utf-8"))
    station_ids = {
        "clifton_court_forebay": CLIFTON_STATION_IDS,
        "bf_freshwater_pathway": corridor_station_ids,
    }
    region_collection["features"] = [
        feature
        for feature in region_collection["features"]
        if feature["properties"].get("region_id") not in REGIONS
    ] + [
        {
            "type": "Feature",
            "properties": {
                "region_id": region_id,
                "region_name": region["name"],
                "kind": "candidate_waterway_region",
                "station_ids": station_ids[region_id],
            },
            "geometry": geometries[region_id],
        }
        for region_id, region in REGIONS.items()
    ]
    write_json(region_path, region_collection)

    # Curated places.
    pattern_path = DATA_DIR / "pattern-list.json"
    dataset = json.loads(pattern_path.read_text(encoding="utf-8"))
    places = dataset["scenarios"]["bolster"]["places"]
    places[:] = [place for place in places if place["id"] != "bf_freshwater_pathway"]
    places.append(
        {
            "id": "bf_freshwater_pathway",
            "name": REGIONS["bf_freshwater_pathway"]["name"],
            "coordinates": REGIONS["bf_freshwater_pathway"]["coordinates"],
            "geographyScale": corridor["geo_scale"],
            "geometryStatus": "candidate_polygon",
            "geometryNote": REGIONS["bf_freshwater_pathway"]["note"],
            "geometry": None,
            "patterns": [
                {
                    "id": CORRIDOR_PATTERN_ID,
                    "candidateType": corridor["candidate_type"],
                    "direction": corridor["direction"] or None,
                    "patternType": corridor["pattern_type"] or None,
                    "startDate": corridor["start_date"] or None,
                    "endDate": corridor["end_date"] or None,
                    "durationDays": number(corridor["calendar_duration_days"]),
                    "qualifyingDays": number(corridor["n_qualifying_days"]),
                    "baselineEc": number(corridor["avg_baseline_value"]),
                    "scenarioEc": number(corridor["avg_scenario_value"]),
                    "differenceEc": number(corridor["avg_absolute_difference"]),
                    "differencePct": number(corridor["avg_percent_difference"]),
                    "stationCount": number(corridor["n_stations"]),
                    "stationAgreement": number(corridor["avg_station_agreement"]),
                    "stationCoverage": number(corridor["avg_paired_station_coverage"]),
                    "thresholdEc": None,
                    "additionalThresholdDays": None,
                    "sustainedReversals": None,
                    "reversalsPerYear": None,
                    "reviewStatus": "selected",
                    "reviewNote": "Persistent critical-dry-year freshening along the through-Delta freshwater corridor.",
                    "proposedDisplayRegion": REGIONS["bf_freshwater_pathway"]["name"],
                    "broaderStoryGroup": "Bolster & Fortify spatial redistribution",
                }
            ],
            "trend": "fresher",
        }
    )
    for place in places:
        region = REGIONS.get(place["id"])
        if not region:
            continue
        place.update(
            name=region["name"],
            coordinates=region["coordinates"],
            geometryStatus="candidate_polygon",
            geometryNote=region["note"],
            geometry=geometries[place["id"]],
        )
    dataset["generatedAt"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    dataset["sourceRecordCount"] = sum(
        len(place["patterns"]) for scenario in dataset["scenarios"].values() for place in scenario["places"]
    )
    write_json(pattern_path, dataset)

    # Chart series for the promoted corridor pattern.
    series_path = DATA_DIR / "pattern-ec-series-7d.json"
    series = json.loads(series_path.read_text(encoding="utf-8"))
    raw_series = json.loads((RAW_DIR / "event-series-7d.json").read_text(encoding="utf-8"))
    series[CORRIDOR_PATTERN_ID] = raw_series[CORRIDOR_PATTERN_ID]
    write_json(series_path, series, compact=True)

    print(f"Promoted {', '.join(REGIONS)} into {DATA_DIR}")


if __name__ == "__main__":
    main()
