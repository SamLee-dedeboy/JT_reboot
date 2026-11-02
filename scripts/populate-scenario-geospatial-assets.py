"""Populate offline scenario GeoJSON from the source packages in JT_exploration.

Requires the small `pyshp` package. All outputs are WGS84 GeoJSON. The converter
handles the one Web Mercator source currently in the library without requiring
GDAL or a desktop GIS installation.
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
from typing import Any

import shapefile


ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SOURCE = ROOT.parent / "JT_exploration" / "website_map_assets"
DEFAULT_OUTPUT = ROOT / "public" / "data" / "geospatial-assets" / "scenarios"
WEB_MERCATOR_LIMIT = 180.0
CALIFORNIA_ASSET_BOUNDS = (-125.0, 32.0, -114.0, 43.0)

PACKAGES = {
    "new-green-watershed/legal-delta-boundary.geojson": "legal_delta_boundary.zip",
    "new-green-watershed/riparian.geojson": "NGW/scenario_ngw_riparian.zip",
    "new-green-watershed/indigenous-territories.geojson": (
        "NGW/scenario_ngw_indigenous_territories.zip"
    ),
    "new-green-watershed/watershed-shade.geojson": "NGW/watershed_shade.zip",
    "calling-on-reserves/shasta-dam-reservoir.geojson": (
        "COR/scenario_cor_cvp_dams_website_in_use.zip"
    ),
}

PROPERTY_ALLOWLIST = {
    "new-green-watershed/riparian.geojson": {"OBJECTID", "title"},
    "new-green-watershed/indigenous-territories.geojson": {
        "TRIBE_NAME",
        "ALT_NAME",
        "SOURCE",
        "LINGUISTIC",
    },
    "calling-on-reserves/shasta-dam-reservoir.geojson": {
        "assetname",
        "facilityna",
        "assettype",
    },
}

FEATURE_FILTERS = {
    "calling-on-reserves/shasta-dam-reservoir.geojson": lambda properties: (
        properties.get("assetname") == "Shasta Dam"
    ),
}

EXISTING_PROVENANCE = {
    "bolster-and-fortify/freshwater-pathway.geojson": (
        "JT_exploration website_map_assets/B&F and curated narrow waterway export"
    ),
    "bolster-and-fortify/levee-repair.geojson": "JT_exploration curated levee_narrow export",
    "bolster-and-fortify/operable-gates.geojson": (
        "JT_exploration website_map_assets/B&F/scenario_bf_franks_tract_operable_gates.zip"
    ),
    "calling-on-reserves/sacramento-river-mainstem.geojson": (
        "JT_exploration website_map_assets/COR/scenario_cor_major_rivers_tributaries.zip"
    ),
    "new-green-watershed/habitats.geojson": (
        "JT_exploration website_map_assets/NGW/scenario_ngw_delta_habitats.zip"
    ),
    "new-green-watershed/watershed-region.geojson": (
        "JT_exploration website_map_assets/NGW/watershed_region.zip"
    ),
    "new-green-watershed/watershed-region-labels.geojson": "curated runtime label points",
    "tiered-outflows/rivers.geojson": (
        "public/data/geospatial-assets/basemap/offline-basemap.geojson named waterways, "
        "clipped to the Bay-Delta"
    ),
    "tiered-outflows/sacramento-river-mainstem.geojson": (
        "coeqwal-website packages/data/src/gis/sacramento_river_mainstem.geojson"
    ),
    "tiered-outflows/san-joaquin-river-mainstem.geojson": (
        "coeqwal-website packages/data/src/gis/san_joaquin_river_mainstem.geojson"
    ),
    "tunnel/alignment.geojson": "JT_exploration BDSC regional-summary tunnel input",
    "tunnel/sites.geojson": "JT_exploration BDSC regional-summary tunnel-sites input",
}


def mercator_to_wgs84(point: list[float]) -> list[float]:
    lon = point[0] * 180.0 / 20037508.34
    lat = math.degrees(2 * math.atan(math.exp(point[1] / 6378137.0)) - math.pi / 2)
    return [lon, lat]


def transform_coordinates(value: Any, projected: bool) -> Any:
    if value and isinstance(value[0], (int, float)):
        point = list(value[:2])
        return mercator_to_wgs84(point) if projected else point
    return [transform_coordinates(item, projected) for item in value]


def coordinate_points(value: Any):
    if value and isinstance(value[0], (int, float)):
        yield value
        return
    for item in value:
        yield from coordinate_points(item)


def intersects_bounds(coordinates: Any, bounds: tuple[float, float, float, float]) -> bool:
    points = list(coordinate_points(coordinates))
    west, south, east, north = bounds
    return any(west <= point[0] <= east and south <= point[1] <= north for point in points)


def convert_package(source: Path, destination: Path, relative_output: str) -> dict[str, Any]:
    reader = shapefile.Reader(str(source))
    projected = abs(reader.bbox[0]) > WEB_MERCATOR_LIMIT or abs(reader.bbox[2]) > WEB_MERCATOR_LIMIT
    allowed = PROPERTY_ALLOWLIST.get(relative_output)
    features = []

    for shape_record in reader.iterShapeRecords():
        geometry = dict(shape_record.shape.__geo_interface__)
        geometry["coordinates"] = transform_coordinates(geometry["coordinates"], projected)
        if relative_output.startswith("calling-on-reserves/") and not intersects_bounds(
            geometry["coordinates"], CALIFORNIA_ASSET_BOUNDS
        ):
            continue
        properties = dict(shape_record.record.as_dict())
        feature_filter = FEATURE_FILTERS.get(relative_output)
        if feature_filter is not None and not feature_filter(properties):
            continue
        if allowed is not None:
            properties = {key: value for key, value in properties.items() if key in allowed}
        features.append({"type": "Feature", "properties": properties, "geometry": geometry})

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        json.dumps({"type": "FeatureCollection", "features": features}, separators=(",", ":")),
        encoding="utf-8",
    )
    return {
        "path": relative_output,
        "source": str(source.relative_to(source.parents[2])).replace("\\", "/"),
        "features": len(features),
        "bytes": destination.stat().st_size,
        "delivery": delivery_class(destination.stat().st_size),
    }


def delivery_class(size: int) -> str:
    if size < 500_000:
        return "geojson"
    if size <= 2_000_000:
        return "simplify-or-geojson"
    return "vector-tiles-candidate"


def subset_eco_machine(shared_roi: Path, output_root: Path) -> list[dict[str, Any]]:
    collection = json.loads(shared_roi.read_text(encoding="utf-8"))
    outputs = []
    for region_id, filename in (
        ("suisun_marsh", "suisun-marsh.geojson"),
        ("franks_tract", "franks-tract.geojson"),
    ):
        features = [
            feature
            for feature in collection["features"]
            if feature.get("properties", {}).get("region_id") == region_id
        ]
        destination = output_root / "eco-machine" / filename
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(
            json.dumps({"type": "FeatureCollection", "features": features}, separators=(",", ":")),
            encoding="utf-8",
        )
        relative = f"eco-machine/{filename}"
        outputs.append(
            {
                "path": relative,
                "source": "public/data/geospatial-assets/shared/region-of-interest.geojson",
                "features": len(features),
                "bytes": destination.stat().st_size,
                "delivery": delivery_class(destination.stat().st_size),
            }
        )
    return outputs


def existing_assets(output_root: Path) -> list[dict[str, Any]]:
    generated = set(PACKAGES) | {
        "eco-machine/suisun-marsh.geojson",
        "eco-machine/franks-tract.geojson",
    }
    records = []
    for path in sorted(output_root.rglob("*.geojson")):
        relative = path.relative_to(output_root).as_posix()
        if relative in generated:
            continue
        collection = json.loads(path.read_text(encoding="utf-8"))
        records.append(
            {
                "path": relative,
                "source": EXISTING_PROVENANCE.get(relative, "pre-existing curated runtime asset"),
                "features": len(collection.get("features", [])),
                "bytes": path.stat().st_size,
                "delivery": delivery_class(path.stat().st_size),
            }
        )
    return records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-root", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    records = []
    shared_roi = ROOT / "public/data/geospatial-assets/shared/region-of-interest.geojson"
    records.extend(subset_eco_machine(shared_roi, args.output_root))
    for relative_output, relative_source in PACKAGES.items():
        source = args.source_root / relative_source
        if not source.exists():
            raise FileNotFoundError(source)
        records.append(convert_package(source, args.output_root / relative_output, relative_output))
    records.extend(existing_assets(args.output_root))

    manifest = {
        "schemaVersion": 1,
        "sourceRoot": Path("../JT_exploration/website_map_assets").as_posix(),
        "thresholdsBytes": {"geojson": 500_000, "vectorTiles": 2_000_000},
        "assets": sorted(records, key=lambda item: item["path"]),
    }
    (args.output_root / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    for record in manifest["assets"]:
        print(
            f'{record["path"]}: {record["features"]} features, '
            f'{record["bytes"] / 1_000_000:.2f} MB, {record["delivery"]}'
        )


if __name__ == "__main__":
    main()
