"""Convert the three Bolster & Fortify tutorial shapefiles to web GeoJSON."""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

import shapefile


WEB_MERCATOR_LIMIT = 20_037_508.342789244


def web_mercator_to_wgs84(point: list[float]) -> list[float]:
    x, y, *rest = point
    longitude = x / WEB_MERCATOR_LIMIT * 180
    latitude = math.degrees(
        2 * math.atan(math.exp(y / WEB_MERCATOR_LIMIT * math.pi)) - math.pi / 2
    )
    return [round(longitude, 6), round(latitude, 6), *rest]


def map_coordinates(value: list, transform) -> list:
    if value and isinstance(value[0], (int, float)):
        return transform(value)
    return [map_coordinates(item, transform) for item in value]


def convert(source: Path, destination: Path, *, web_mercator: bool = False) -> None:
    collection = shapefile.Reader(str(source)).__geo_interface__
    for feature in collection["features"]:
        geometry = feature.get("geometry")
        if geometry and web_mercator:
            geometry["coordinates"] = map_coordinates(
                geometry["coordinates"], web_mercator_to_wgs84
            )

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        json.dumps(collection, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_root", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()

    layers = (
        (
            "gates/scenario_bf_franks_tract_operable_gates.shp",
            "bf-franks-tract-operable-gates.geojson",
            False,
        ),
        (
            "levee/scenario_bf_franks_tract_levee_repair.shp",
            "bf-franks-tract-levee-repair.geojson",
            False,
        ),
        (
            "pathway/scenario_bf_through_delta_freshwater_pathway.shp",
            "bf-through-delta-freshwater-pathway.geojson",
            True,
        ),
    )

    for source, destination, web_mercator in layers:
        convert(
            args.source_root / source,
            args.output_dir / destination,
            web_mercator=web_mercator,
        )


if __name__ == "__main__":
    main()
