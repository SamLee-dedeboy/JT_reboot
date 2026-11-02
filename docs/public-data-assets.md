# Public data assets

This document is the source of truth for runtime files under `public/data/`.
Keep it synchronized when an asset is added, moved, tiled, or retired.

## Directory contract

- `geospatial-assets/basemap/`: bundled offline basemap geometry.
- `geospatial-assets/shared/`: geometry reused across public features.
- `geospatial-assets/scenarios/<scenario>/`: scenario-specific interventions.
- `geospatial-assets/subteams/`: subteam or criterion geography.
- `salinity/`: modeled salinity outputs, grouped by consuming experience.
- `patterns/`: curated regional-pattern findings, evidence, and chart series.
- `operations/`: scenario operating schedules shared across features.
- `watershed/`: public upstream-restoration metrics and change summaries.
- `co-design/`: public co-design dashboard snapshots.
- `internal/`: data used only by routes under `src/internal/`. This is intentionally
  isolated so those routes and assets can be retired later.

Do not put new runtime data directly at the root of `public/data/`.

## Size thresholds

- Below 500 KB: local GeoJSON is normally acceptable.
- 500 KB to 2 MB: simplify geometry and remove unused properties before adding it.
- Above 2 MB: prefer vector tiles or PMTiles unless there is a documented reason
  that the complete GeoJSON must load at once.
- Large time-series data should be divided by scenario, mode, or time window instead
  of growing a monolithic JSON response.

Record provenance, license, update date, CRS, feature count, routes, and loading
trigger for every new geospatial dataset. Any hosted tile solution must remain
usable within the project's free-distribution and cost constraints.

Scenario asset provenance, generated size, feature count, and delivery recommendation
are recorded in `public/data/geospatial-assets/scenarios/manifest.json`. Regenerate
the local WGS84 exports from the sibling research workspace with:

```bash
python scripts/populate-scenario-geospatial-assets.py
```

The converter requires `pyshp`. Source packages remain in
`../JT_exploration/website_map_assets`; do not copy shapefile sidecars into `public/`.

## Offline requirement

The kiosk build is required for the week of November 2, 2026. `npm run build:kiosk`
sets `VITE_MAP_MODE=offline`. This is the single global map-mode decision: every
`BaseMap` and the direct Scenario Explorer map resolve through it. A normal build
can exercise the same site-wide mode with `?map=offline`; `?offline=1` is retained
as a compatibility alias. The current offline style uses the two GeoJSON files in
`geospatial-assets/basemap/` and Proxima Nova glyphs in `public/fonts/`.

In offline mode, Mapbox-hosted thematic sources are not mounted, preventing hidden
network requests. The home salinity animation has a local replacement (below). The
others are still a follow-up: shared station points, the salinity snapshot on the
tiered-outflows narration map, and several New Green Watershed vector/raster layers
will be absent until equivalent bundled assets are populated. Moving the basemap
to local vector tiles or PMTiles is desirable after the exhibit because the current
two GeoJSON sources total about 36 MB before compression.

### Home salinity animation tiles

`salinity/home-animation/pair_00`..`pair_10` hold vector tiles (`{z}/{x}/{y}.pbf`,
uncompressed) for offline mode. Online mode still streams the Mapbox tilesets.

- Provenance: tiled from `../JT_exploration/schism_salinity_gradient/vector_mts_split_pairs/output`,
  the same 11 NDJSON files published as `justtransition.salinity_vector_pair_00`..`_10`.
  Regenerate with `python scripts/build-offline-salinity-tiles.py` (needs `tippecanoe`,
  from WSL on Windows).
- Contents: 930 features (155 frames of Water Year 2019 classified salinity, six classes
  each), source layer `salinity`, properties `frame` and `color`. Source CRS is WGS84.
- Coverage: z7-z10, overzoomed past z10. 572 tiles, about 24 MB. 0-byte tiles fill empty
  areas inside the bounds, because SPA fallbacks such as `vite preview` answer a missing
  tile with `index.html` and a 200, which the map cannot parse.
- Routes and loading: home hero and the site-wide screensaver, only in offline mode.
  Tiles load per pair as playback reaches them.
- License: not recorded in the source notes.

## Current large assets

- `salinity/home-animation/`: about 24 MB across 572 tiles.
- `geospatial-assets/basemap/offline-landuse.geojson`: about 21 MB.
- `geospatial-assets/basemap/offline-basemap.geojson`: about 15 MB.
- `geospatial-assets/scenarios/new-green-watershed/habitats.geojson`: about 8.5 MB.
- `geospatial-assets/scenarios/new-green-watershed/watershed-region.geojson`: about 5.2 MB.
- Scenario Explorer salinity dashboards range up to about 27 MB.

The RMA/Scenario Explorer payload redesign is deferred. Revisit it after the asset
population and offline-map work if project capacity remains.
