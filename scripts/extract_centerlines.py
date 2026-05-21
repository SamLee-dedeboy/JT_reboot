"""
Extract a routable channel-centerline network from the Delta waterway polygon.

Input:  public/data/delta_waterway.geojson    (a single MultiPolygon / Polygon
                                               representing the open-water
                                               surface, WGS84)
Output: public/data/delta_waterway_lines.geojson
                                              (FeatureCollection of LineStrings
                                               along the medial axis of the
                                               polygon, WGS84, coords rounded
                                               to 5 decimals ~ 1.1 m at 38°N)

Pipeline
--------
1. Reproject to UTM Zone 10N so all tolerances are in meters.
2. Simplify the polygon at 5 m to cut boundary vertex count without
   losing channel topology.
3. Run a Voronoi-based medial-axis extraction (`centerline` package) at
   50 m boundary-sampling distance.
4. linemerge into long polylines, then iteratively prune leaf segments
   shorter than 100 m (Voronoi spurs that don't represent real channels).
5. simplify(10 m) each line.
6. Reproject back to WGS84, round to 5 decimals, drop duplicate consecutive
   vertices, write as a compact GeoJSON FeatureCollection.

Re-run whenever `delta_waterway.geojson` changes.

Requirements: shapely, centerline, pyproj. Create a venv for this so the
project's runtime stays JS-only:

    python3 -m venv .venv-centerline
    source .venv-centerline/bin/activate
    pip install shapely centerline pyproj
    python scripts/extract_centerlines.py
"""

from __future__ import annotations

import json
import os
import time
from collections import defaultdict
from typing import Iterable

from shapely.geometry import LineString, MultiLineString, mapping, shape
from shapely.ops import linemerge, transform
from pyproj import Transformer
from centerline.geometry import Centerline


SRC = "public/data/delta_waterway.geojson"
DST = "public/data/delta_waterway_lines.geojson"

POLY_SIMPLIFY_M = 5.0       # polygon boundary cleanup
INTERP_DIST_M = 50.0         # Voronoi boundary sampling spacing
LEAF_PRUNE_M = 100.0         # drop leaf segments shorter than this
LINE_SIMPLIFY_M = 10.0       # final per-line shape simplification
COORD_DECIMALS = 5           # ~1.1 m precision at 38°N


def endpoint_key(pt: Iterable[float], snap_m: float = 0.5) -> tuple[int, int]:
    """Quantize an endpoint to a small grid so floating-point endpoints match."""
    x, y = pt
    return (round(x / snap_m), round(y / snap_m))


def build_endpoint_index(lines: list[LineString]) -> dict[tuple[int, int], list[tuple[int, int]]]:
    eidx: dict[tuple[int, int], list[tuple[int, int]]] = defaultdict(list)
    for i, ln in enumerate(lines):
        cs = list(ln.coords)
        eidx[endpoint_key(cs[0])].append((i, 0))
        eidx[endpoint_key(cs[-1])].append((i, 1))
    return eidx


def prune_short_leaves(lines: list[LineString], threshold_m: float) -> list[LineString]:
    """Iteratively drop leaf edges shorter than threshold; relinemerge between passes."""
    total_pruned = 0
    for iteration in range(20):
        eidx = build_endpoint_index(lines)
        drop: set[int] = set()
        for i, ln in enumerate(lines):
            cs = list(ln.coords)
            deg_start = len(eidx[endpoint_key(cs[0])])
            deg_end = len(eidx[endpoint_key(cs[-1])])
            is_leaf = (deg_start == 1) or (deg_end == 1)
            both_leaf = (deg_start == 1) and (deg_end == 1)
            # Preserve isolated (both-leaf) lines — they might be real short ponds.
            if is_leaf and not both_leaf and ln.length < threshold_m:
                drop.add(i)
        if not drop:
            print(f"  iter {iteration}: stable")
            break
        total_pruned += len(drop)
        lines = [ln for i, ln in enumerate(lines) if i not in drop]
        merged = linemerge(MultiLineString(lines))
        lines = (
            [merged] if merged.geom_type == "LineString" else list(merged.geoms)
        )
        print(f"  iter {iteration}: pruned {len(drop)} leaves -> {len(lines)} lines")
    print(f"total leaves pruned: {total_pruned}")
    return lines


def main() -> None:
    t_total = time.time()

    # 1. Load + reproject + clean polygon ----------------------------------
    with open(SRC) as f:
        gj = json.load(f)
    poly = shape(gj["features"][0]["geometry"])

    to_utm = Transformer.from_crs("EPSG:4326", "EPSG:26910", always_xy=True).transform
    to_wgs = Transformer.from_crs("EPSG:26910", "EPSG:4326", always_xy=True).transform

    poly_utm = transform(to_utm, poly).simplify(POLY_SIMPLIFY_M, preserve_topology=True)
    print(f"polygon simplified to {len(poly_utm.exterior.coords)} exterior verts, {len(poly_utm.interiors)} holes")

    # 2. Centerline (Voronoi medial axis) ---------------------------------
    t0 = time.time()
    mls = Centerline(poly_utm, interpolation_distance=INTERP_DIST_M).geometry
    print(f"Centerline({INTERP_DIST_M}m): {time.time() - t0:.1f}s, {len(mls.geoms)} raw segments")

    # 3. linemerge to coalesce long polylines -----------------------------
    merged = linemerge(mls)
    lines = [merged] if merged.geom_type == "LineString" else list(merged.geoms)
    print(f"after linemerge: {len(lines)} lines, {sum(ln.length for ln in lines):.0f}m total")

    # 4. Prune short leaf spurs -------------------------------------------
    lines = prune_short_leaves(lines, LEAF_PRUNE_M)

    # 5. Per-line shape simplification ------------------------------------
    lines = [ln.simplify(LINE_SIMPLIFY_M, preserve_topology=False) for ln in lines]
    lines = [ln for ln in lines if ln.length > 0 and len(ln.coords) >= 2]
    v_total = sum(len(ln.coords) for ln in lines)
    print(f"after simplify({LINE_SIMPLIFY_M}m): {len(lines)} lines, {v_total} vertices")

    # 6. Reproject + round + write ----------------------------------------
    features = []
    for ln in lines:
        ln_wgs = transform(to_wgs, ln)
        coords = [[round(x, COORD_DECIMALS), round(y, COORD_DECIMALS)] for x, y in ln_wgs.coords]
        # Drop duplicate consecutive vertices created by rounding.
        cleaned = [coords[0]]
        for c in coords[1:]:
            if c != cleaned[-1]:
                cleaned.append(c)
        if len(cleaned) >= 2:
            features.append(
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {"type": "LineString", "coordinates": cleaned},
                }
            )

    out = {
        "type": "FeatureCollection",
        "name": "delta_waterway_lines",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features,
    }
    with open(DST, "w") as f:
        json.dump(out, f, separators=(",", ":"))

    size_kb = os.path.getsize(DST) / 1024
    print(f"\nwrote {DST}: {size_kb:.1f} KB, {len(features)} features (total {time.time() - t_total:.1f}s)")


if __name__ == "__main__":
    main()
