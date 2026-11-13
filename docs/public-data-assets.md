# Public data assets

This document is the source of truth for runtime files under `public/data/`.
Keep it synchronized when an asset is added, moved, tiled, or retired.

## Directory contract

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

## Current large assets

- `geospatial-assets/scenarios/new-green-watershed/habitats.geojson`: about 8.5 MB.
- `geospatial-assets/scenarios/new-green-watershed/watershed-region.geojson`: about 5.2 MB.
- Scenario Explorer salinity dashboards range up to about 27 MB.

The RMA/Scenario Explorer payload redesign is deferred. Revisit it after the asset
population work if project capacity remains.
