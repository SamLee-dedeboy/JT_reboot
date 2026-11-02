"""Build the offline copy of the home salinity animation as local vector tiles.

Tiles the same 11 pair files that were published to Mapbox as
justtransition.salinity_vector_pair_00..10, keeping them as vector polygons and
keeping the `salinity` source layer and global `frame` property, so playback is
identical online and offline. Only `frame` and `color` are kept; the layer reads
nothing else. Requires tippecanoe, from WSL on Windows.

    python scripts/build-offline-salinity-tiles.py
"""
import json
import math
import shutil
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SOURCE_DIR = (
    REPO.parent
    / "JT_exploration/schism_salinity_gradient/vector_mts_split_pairs/output"
)
OUTPUT_DIR = REPO / "public/data/salinity/home-animation"

PAIR_COUNT = 11
MIN_ZOOM = 7
# The hero camera sits at z9.15-10.25. Past z10 the map overzooms these tiles.
MAX_ZOOM = 10


def tool_path(path: Path) -> str:
    if sys.platform != "win32":
        return str(path)
    resolved = path.resolve()
    return f"/mnt/{resolved.drive[0].lower()}{resolved.as_posix()[2:]}"


def run_tippecanoe(source: Path, output: Path) -> None:
    command = [
        "tippecanoe",
        "--quiet",
        f"--output-to-directory={tool_path(output)}",
        "--layer=salinity",
        f"--minimum-zoom={MIN_ZOOM}",
        f"--maximum-zoom={MAX_ZOOM}",
        "--include=frame",
        "--include=color",
        # Every frame shares each tile, so limits would drop whole frames.
        "--no-feature-limit",
        "--no-tile-size-limit",
        "--no-tiny-polygon-reduction",
        # Static hosts serve these as-is, with no Content-Encoding header.
        "--no-tile-compression",
        "--read-parallel",
        tool_path(source),
    ]
    if sys.platform == "win32":
        command = ["wsl", "--exec", *command]
    subprocess.run(command, check=True)


def tile_column(longitude: float, zoom: int) -> int:
    return int((longitude + 180) / 360 * 2**zoom)


def tile_row(latitude: float, zoom: int) -> int:
    radians = math.radians(latitude)
    return int((1 - math.asinh(math.tan(radians)) / math.pi) / 2 * 2**zoom)


def fill_empty_tiles(pair_dir: Path, bounds: list[float]) -> int:
    """Write 0-byte tiles for empty areas inside the bounds.

    A missing tile is not always a 404: single-page servers such as `vite preview`
    answer with index.html and a 200, which the map then fails to parse.
    """
    west, south, east, north = bounds
    filled = 0
    for zoom in range(MIN_ZOOM, MAX_ZOOM + 1):
        for x in range(tile_column(west, zoom), tile_column(east, zoom) + 1):
            for y in range(tile_row(north, zoom), tile_row(south, zoom) + 1):
                tile = pair_dir / str(zoom) / str(x) / f"{y}.pbf"
                if not tile.exists():
                    tile.parent.mkdir(parents=True, exist_ok=True)
                    tile.touch()
                    filled += 1
    return filled


def main() -> None:
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True)

    total_bytes = 0
    total_tiles = 0
    all_bounds = []
    for pair_index in range(PAIR_COUNT):
        name = f"pair_{pair_index:02d}"
        pair_dir = OUTPUT_DIR / name
        run_tippecanoe(SOURCE_DIR / f"salinity_vector_{name}.ndjson", pair_dir)

        metadata_path = pair_dir / "metadata.json"
        bounds = [float(v) for v in json.loads(metadata_path.read_text())["bounds"].split(",")]
        metadata_path.unlink()
        all_bounds.append(bounds)
        filled = fill_empty_tiles(pair_dir, bounds)

        tiles = list(pair_dir.rglob("*.pbf"))
        size = sum(tile.stat().st_size for tile in tiles)
        total_bytes += size
        total_tiles += len(tiles)
        print(f"{name}: {len(tiles)} tiles ({filled} empty), {size / 1e6:.1f} MB")

    union = [
        min(b[0] for b in all_bounds),
        min(b[1] for b in all_bounds),
        max(b[2] for b in all_bounds),
        max(b[3] for b in all_bounds),
    ]
    print(f"Total: {total_tiles} tiles, {total_bytes / 1e6:.1f} MB, bounds {union}")


if __name__ == "__main__":
    main()
