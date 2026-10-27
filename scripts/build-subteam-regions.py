#!/usr/bin/env python3
"""Build src/internal/rank-visualization/subteams/regionShapes.ts.

    python3 scripts/build-subteam-regions.py

Reads scripts/data/subteam-regions/subteam_regions.shp (WGS84) and the Delta
waterway outline in public/data/delta_waterway.geojson, simplifies both, projects
them once into one shared SVG frame, and writes the TypeScript module. No GDAL or
pyshp: the shapefile reader below handles the polygon subset this needs.

The whole point of the panel is to overlay four teams' boundaries, so everything
has to share a viewBox and a projection. Equirectangular with a cos(mid-latitude)
x correction is honest enough across a Delta-sized extent.

NAMES DO NOT MATCH THE APP'S DATA ARRAYS. The shapefile is a comparison set drawn
to show how the teams cut the Delta; its region names are not the keys the values
are stored under (see the mismatch table in the generated header). Treat the map
as a layer beside the numbers, not a join onto them, until the gaps are filled.
"""
import json
import math
import sqlite3
import struct
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHP = ROOT / "scripts/data/subteam-regions/subteam_regions"
WEST_DELTA = ROOT / "scripts/data/subteam-regions/west_delta_merged.gpkg"
ECO_BAYS = ROOT / "scripts/data/subteam-regions/eco-bay-polygons.geojson"
WATER = ROOT / "public/data/delta_waterway.geojson"
OUT = ROOT / "src/internal/rank-visualization/subteams/regionShapes.ts"

TEAM = {"ECO": "ecology", "ECON": "economy", "EJ": "environmentalJustice", "REC": "recreation"}
REGION_TOL, REGION_MIN_AREA = 0.002, 0.00002
WATER_TOL, WATER_MIN_AREA = 0.003, 0.00005
FRAME_HEIGHT = 1000.0
PAD = 0.01

# How each shapefile name relates to the key the app stores values under. `None`
# means the app has no values for that region; a key with no shapefile row means
# the app has values the map cannot place.
MISMATCH = """\
//   Ecology      all 8 data regions are mapped; "Central" ≈ centralDelta and
//                "Suisun Marsh" has no data key (the report folds it into
//                Suisun Bay).
//   Economy      the shapefile's 3 water-agency regions are supplemented by
//                the merged West Delta polygon; all 4 data zones are mapped.
//   Recreation   shapefile has Suisun Bay / Confluence / North / South Delta;
//                data has suisunMarsh / centralDelta / northDelta / southDelta,
//                and the activity values are not stored per place at all.
//   EJ           shapefile has the 3 vulnerability classes, which match the
//                drinking-water data exactly; the 5 water-age hotspot regions
//                are not here.
//   Eco-cultural absent by design: historic Tribal territory, and specific
//                cultural-practice sites are deliberately not mapped."""


def read_dbf(path):
    data = path.read_bytes()
    numrec, hdrlen, reclen = struct.unpack("<IHH", data[4:12])
    fields, pos = [], 32
    while data[pos] != 0x0D:
        raw = data[pos : pos + 32]
        fields.append((raw[:11].split(b"\0")[0].decode("utf8", "replace"), raw[16]))
        pos += 32
    rows = []
    for r in range(numrec):
        rec = data[hdrlen + r * reclen : hdrlen + (r + 1) * reclen]
        if not rec or rec[:1] == b"*":
            continue
        off, row = 1, {}
        for name, flen in fields:
            row[name] = rec[off : off + flen].decode("utf8", "replace").strip()
            off += flen
        rows.append(row)
    return rows


def read_shp(path):
    data = path.read_bytes()
    shapes, pos = [], 100
    while pos < len(data):
        _, clen = struct.unpack(">II", data[pos : pos + 8])
        body = data[pos + 8 : pos + 8 + clen * 2]
        pos += 8 + clen * 2
        stype = struct.unpack("<I", body[0:4])[0]
        if stype not in (5, 15, 25):
            raise SystemExit(f"unsupported shape type {stype}; this reader handles polygons only")
        nparts, npoints = struct.unpack("<II", body[36:44])
        parts = list(struct.unpack(f"<{nparts}I", body[44 : 44 + 4 * nparts]))
        start = 44 + 4 * nparts
        pts = struct.unpack(f"<{npoints * 2}d", body[start : start + 16 * npoints])
        rings = []
        for i, s in enumerate(parts):
            e = parts[i + 1] if i + 1 < len(parts) else npoints
            rings.append([(pts[2 * j], pts[2 * j + 1]) for j in range(s, e)])
        shapes.append(rings)
    return shapes


def read_gpkg_polygon(path, table):
    """Read the first Polygon from a GeoPackage without requiring GDAL."""
    with sqlite3.connect(path) as connection:
        column = connection.execute(
            "SELECT column_name FROM gpkg_geometry_columns WHERE table_name = ?", (table,)
        ).fetchone()[0]
        blob = connection.execute(f'SELECT "{column}" FROM "{table}" LIMIT 1').fetchone()[0]

    flags = blob[3]
    envelope_doubles = (0, 4, 6, 6, 8)[(flags >> 1) & 0b111]
    data = memoryview(blob)[8 + envelope_doubles * 8 :]
    endian = "<" if data[0] == 1 else ">"
    geometry_type, ring_count = struct.unpack_from(f"{endian}II", data, 1)
    if geometry_type != 3:
        raise SystemExit(f"unsupported GeoPackage geometry type {geometry_type}; expected Polygon")
    offset, rings = 9, []
    for _ in range(ring_count):
        point_count = struct.unpack_from(f"{endian}I", data, offset)[0]
        offset += 4
        coords = struct.unpack_from(f"{endian}{point_count * 2}d", data, offset)
        offset += point_count * 16
        rings.append([(coords[i], coords[i + 1]) for i in range(0, len(coords), 2)])
    return rings


def perp(p, a, b):
    (x, y), (x1, y1), (x2, y2) = p, a, b
    dx, dy = x2 - x1, y2 - y1
    if dx == 0 and dy == 0:
        return math.hypot(x - x1, y - y1)
    t = max(0.0, min(1.0, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
    return math.hypot(x - (x1 + t * dx), y - (y1 + t * dy))


def douglas_peucker(pts, tol):
    """Iterative, so a 13,000-point ring does not hit the recursion limit."""
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        s, e = stack.pop()
        dmax, idx = 0.0, s
        for i in range(s + 1, e):
            d = perp(pts[i], pts[s], pts[e])
            if d > dmax:
                dmax, idx = d, i
        if dmax > tol:
            keep[idx] = True
            stack.append((s, idx))
            stack.append((idx, e))
    return [p for p, k in zip(pts, keep) if k]


def inside(px, py, ring):
    hit = False
    for i in range(len(ring) - 1):
        (x1, y1), (x2, y2) = ring[i], ring[i + 1]
        if (y1 > py) != (y2 > py) and px < x1 + (py - y1) * (x2 - x1) / (y2 - y1):
            hit = not hit
    return hit


def pole(ring, grid=28):
    """The interior point farthest from any edge, on a coarse grid.

    A centroid lands outside a concave shape and on the boundary of a thin one;
    this lands in the fattest part, which is where a name belongs.
    """
    xs, ys = [p[0] for p in ring], [p[1] for p in ring]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    best, bestd = ((x0 + x1) / 2, (y0 + y1) / 2), -1.0
    for i in range(grid):
        for j in range(grid):
            px, py = x0 + (i + 0.5) * (x1 - x0) / grid, y0 + (j + 0.5) * (y1 - y0) / grid
            if not inside(px, py, ring):
                continue
            d = min(perp((px, py), ring[k], ring[k + 1]) for k in range(len(ring) - 1))
            if d > bestd:
                best, bestd = (px, py), d
    return round(best[0], 1), round(best[1], 1)


def ring_area(r):
    return abs(sum(r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1] for i in range(len(r) - 1))) / 2


def simplify(rings, tol, min_area):
    out = [douglas_peucker(r, tol) for r in rings if ring_area(r) >= min_area]
    return [r for r in out if len(r) >= 4]


def main():
    rows, shapes = read_dbf(SHP.with_suffix(".dbf")), read_shp(SHP.with_suffix(".shp"))
    regions = [
        {"team": TEAM[r["team"]], "name": r["type"], "rings": simplify(s, REGION_TOL, REGION_MIN_AREA)}
        for r, s in zip(rows, shapes)
    ]
    economy_names = {
        "North Delta Water Agency": "North Delta",
        "Central Delta Water Agency": "Central Delta",
        "South Delta Water Agency": "South Delta",
    }
    for region in regions:
        if region["team"] == "economy":
            region["name"] = economy_names.get(region["name"], region["name"])
    regions.append(
        {
            "team": "economy",
            "name": "West Delta",
            "rings": simplify(
                read_gpkg_polygon(WEST_DELTA, "west_delta_merged"),
                REGION_TOL,
                REGION_MIN_AREA,
            ),
        }
    )
    bay_features = json.loads(ECO_BAYS.read_text(encoding="utf-8"))["features"]
    for feature in bay_features:
        geometry = feature["geometry"]
        polygon_rings = (
            geometry["coordinates"]
            if geometry["type"] == "Polygon"
            else [ring for polygon in geometry["coordinates"] for ring in polygon]
        )
        regions.append(
            {
                "team": "ecology",
                "name": feature["properties"]["title"],
                "rings": simplify(
                    [[tuple(point[:2]) for point in ring] for ring in polygon_rings],
                    REGION_TOL,
                    REGION_MIN_AREA,
                ),
            }
        )
    geom = json.loads(WATER.read_text())["features"][0]["geometry"]
    wrings = geom["coordinates"] if geom["type"] == "Polygon" else [r for p in geom["coordinates"] for r in p]
    water = simplify([[tuple(p[:2]) for p in r] for r in wrings], WATER_TOL, WATER_MIN_AREA)

    xs = [p[0] for g in regions for r in g["rings"] for p in r]
    ys = [p[1] for g in regions for r in g["rings"] for p in r]
    lon0, lon1, lat0, lat1 = min(xs) - PAD, max(xs) + PAD, min(ys) - PAD, max(ys) + PAD
    k = math.cos(math.radians((lat0 + lat1) / 2))
    scale = FRAME_HEIGHT / (lat1 - lat0)
    width = round((lon1 - lon0) * k * scale, 1)

    def project(lon, lat):
        return round((lon - lon0) * k * scale, 1), round((lat1 - lat) * scale, 1)

    def path(svg_rings):
        return "".join("M" + "L".join(f"{x} {y}" for x, y in r) + "Z" for r in svg_rings)

    projected_regions = [
        {**region, "svg_rings": [[project(*point) for point in ring] for ring in region["rings"]]}
        for region in regions
    ]
    team_viewboxes = {}
    for team in TEAM.values():
        points = [
            point
            for region in projected_regions
            if region["team"] == team
            for ring in region["svg_rings"]
            for point in ring
        ]
        if not points:
            continue
        team_xs, team_ys = zip(*points)
        inset = 20
        x, y = min(team_xs) - inset, min(team_ys) - inset
        team_viewboxes[team] = {
            "x": round(x, 1),
            "y": round(y, 1),
            "width": round(max(team_xs) - min(team_xs) + inset * 2, 1),
            "height": round(max(team_ys) - min(team_ys) + inset * 2, 1),
        }

    lines = [
        "// GENERATED by scripts/build-subteam-regions.py — do not edit by hand.",
        "//",
        "// Source: scripts/data/subteam-regions/subteam_regions.shp plus the merged West Delta",
        "// GeoPackage and Ecology Bay polygons (WGS84, Oct 2026), and",
        "// the Delta waterway outline in public/data/delta_waterway.geojson, both",
        "// Douglas-Peucker simplified and projected once into one shared frame.",
        "//",
        "// The region names here are NOT the keys the app stores values under. This is a",
        "// comparison layer showing how each team cut the Delta, not a join onto the data:",
        MISMATCH,
        "",
        "import type { TeamKey } from '../data'",
        "",
        "export interface RegionShape {",
        "  team: TeamKey",
        "  name: string",
        "  /** SVG path in REGION_VIEWBOX coordinates. */",
        "  d: string",
        "  /** Where the name goes: inside the largest ring, as far from its edges as possible. */",
        "  label: [number, number]",
        "}",
        "",
        f"export const REGION_VIEWBOX = {{ width: {width}, height: {int(FRAME_HEIGHT)} }}",
        f"export const REGION_TEAM_VIEWBOX = {json.dumps(team_viewboxes)} as const",
        "",
        "/** The Delta channels, as context behind the boundaries. */",
        f"export const WATERWAY_PATH = {json.dumps(path([[project(*p) for p in r] for r in water]))}",
        "",
        "export const REGION_SHAPES: RegionShape[] = [",
    ]
    for g in projected_regions:
        svg_rings = g["svg_rings"]
        label = pole(max(svg_rings, key=ring_area))
        lines.append(
            f"  {{ team: {json.dumps(g['team'])}, name: {json.dumps(g['name'])}, d: {json.dumps(path(svg_rings))}, label: [{label[0]}, {label[1]}] }},"
        )
    lines.append("]")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    npts = sum(len(r) for g in regions for r in g["rings"]) + sum(len(r) for r in water)
    print(f"wrote {OUT.relative_to(ROOT)}: {len(regions)} regions, {len(water)} water rings, {npts} points, frame {width}×{int(FRAME_HEIGHT)}")


if __name__ == "__main__":
    main()
