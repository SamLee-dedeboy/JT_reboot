# Claude prompt: Delta Outflow station-mapping and polygon-review tool

Work in:

`D:/projects/JT_exploration/RMA/BDSC_regional_summary/`

Build a durable, local interactive tool for reviewing and editing the station-to-region mapping used by the **Increase Delta Outflow (+30%)** SCHISM analysis. This scenario uses the 405-station SCHISM network, so do not reuse RMA station indices as though the two station networks were identical. Use geographic coordinates and the existing nearest-RMA crosswalk as the starting evidence.

## Primary objective

The tool must let me visually review and edit SCHISM station membership for these nine regions:

1. Suisun Marsh
2. Montezuma Slough
3. Suisun Bay
4. Confluence Zone
5. Sacramento River Corridor
6. Lindsey–Cache Slough
7. Central Delta
8. Southern Delta
9. San Joaquin River Corridor

It must also let me create or edit the final polygon for each region. Final reviewed polygons must be saved under:

`D:/projects/JT_exploration/RMA/BDSC_regional_summary/inputs/waterway_regions/`

Treat `inputs/waterway_regions/raw/` and `inputs/waterway_regions/versions/` as source/history directories. Do not overwrite files there. Final approved files belong directly in `inputs/waterway_regions/` and should use stable names such as `suisun_marsh.geojson`, `confluence_zone.geojson`, and `sacramento_river_corridor.geojson`.

## Existing source material

Inspect and reuse the project’s existing tooling and conventions before building anything new.

Use these sources:

- SCHISM station assignments and coordinates:
  `D:/projects/JT_exploration/RMA/EDA/config/schism_405_station_cluster_assignments.json`
- SCHISM station source:
  `D:/projects/JT_exploration/RMA/data/baseline_schism/station.in_2025_10_21_reformat.txt`
- Existing RMA regional definitions and the current Central/Southern boundary decision:
  `internal/analysis/bdsc-preparation/cor-regional-sensitivity/cor_config.json`
- Existing RMA station coordinates:
  `inputs/stations/rma_modeled_stations_386.geojson`
- SCHISM waterway reference:
  `inputs/reference/delta_waterway_schism.zip`
- Suisun Marsh reference:
  `inputs/reference/suisun_marsh.zip`
- Existing reviewed/candidate polygons:
  `inputs/waterway_regions/*.geojson`
- Broader polygon sources and previous footprints:
  `inputs/waterway_regions/raw/*.geojson`
- Existing mapping and explorer code under:
  `internal/mapping/`
  and
  `internal/tools/pattern_review_explorer/`

Do not modify the curated salinity-pattern ledger or approve any patterns as part of this task. This task creates reviewed station mappings and region polygons only.

## Initial station crosswalk

For each SCHISM station, use `nearest_rma_station_number` from `schism_405_station_cluster_assignments.json` to determine whether its nearest RMA station belongs to one or more of the nine current regional definitions in `cor_config.json`.

Create initial memberships using these rules:

- If the nearest RMA station belongs to a region and the SCHISM assignment method is `inside_region_polygon`, initialize it as that region’s **core** station.
- If the nearest RMA station belongs to a region and the SCHISM assignment method is `overlap_resolved_by_nearest_rma_station` or `nearest_rma_station_outside_regions`, initialize it as **questionable** for that region.
- If the nearest RMA station does not belong to any of the nine requested regions, leave it **unassigned**. Never force every station into a region.
- Preserve legitimate multi-region membership. Corridors and broader geographic regions may overlap. A station can belong to more than one region, but the UI and output must make every overlap explicit.

Use the current RMA assignment as the starting boundary decision:

- Central Delta includes RMA stations `113` and `121`.
- Southern Delta includes RMA stations `284`, `288`, and `359`.
- The following boundary groups currently belong to Southern Delta, but must remain easy to move during the final review:
  - Discovery Bay: `278, 279, 280, 289, 290`
  - Old River–Woodward: `297, 299, 302, 303, 304, 306, 356`
  - Middle River: `311, 312, 314, 319`

## Required map behavior

Build a practical editing interface, not a static QA plot.

The map must:

- display all 405 SCHISM stations;
- keep station symbols the same screen size while zooming;
- support pan and wheel/pinch zoom;
- let me toggle two, three, or more regions simultaneously;
- distinguish `core`, `questionable`, and `unassigned` stations clearly;
- expose stations skipped by the currently visible regions instead of hiding them;
- avoid permanently displaying all station-number labels, because they overlap badly;
- show station index, name, coordinates, nearest RMA station, crosswalk distance, assignment method, and all current region memberships on hover or selection;
- allow selection by click, Shift-click, box selection, and lasso/polygon selection if the chosen map library supports it reliably;
- allow bulk assignment of selected stations as `core`, `questionable`, or `excluded` for one or more regions;
- allow removal from one region without removing the station from its other regions;
- provide undo/redo for editing operations;
- warn before discarding unsaved edits;
- visually identify multi-region stations and list every overlapping membership;
- include filters for region, status, assignment provenance, nearest-RMA distance, and station index;
- include a “show only unresolved” mode covering questionable, conflicting, and unassigned stations.

Use stable colors by region, plus a separate visual encoding for membership status. Do not make point radius grow with zoom.

## Polygon editing

For each region, load an existing final polygon from `inputs/waterway_regions/<region_id>.geojson` when one exists. Otherwise build an explicitly labeled **draft** starting geometry from the best available source:

1. relevant reviewed/raw waterway polygons;
2. the SCHISM waterway reference;
3. the selected station footprint only as a fallback.

Do not silently treat a convex hull or buffered station footprint as a reviewed waterway polygon.

The interface must let me:

- select the active region polygon;
- draw a new polygon or multipolygon;
- move, add, and delete vertices;
- split or merge polygon parts where supported;
- compare the edited polygon with the original/draft geometry;
- show which SCHISM stations fall inside, outside, or near the edited boundary;
- optionally propose membership changes from the polygon without applying them automatically;
- validate and repair geometry where possible;
- prevent export of an empty or invalid final geometry;
- save a final WGS84 GeoJSON (`EPSG:4326`) Feature or FeatureCollection with stable metadata.

Every final polygon should include properties similar to:

```json
{
  "region_id": "sacramento_river_corridor",
  "region_name": "Sacramento River Corridor",
  "status": "reviewed",
  "geometry_source": "interactive_station_mapping_review",
  "station_network": "SCHISM 405",
  "reviewed_at": "ISO-8601 timestamp",
  "notes": "User-editable notes"
}
```

Preserve the previous final polygon before overwriting it by copying it into `inputs/waterway_regions/versions/` with a timestamped filename.

## Editable region state and saved outputs

Keep the application’s editable state separate from the final exports. Save drafts frequently to a working directory under `internal/mapping/`, not under `inputs/`.

Create a dedicated output directory such as:

`internal/mapping/delta_outflow_station_review/`

At minimum, produce:

1. `delta_outflow_station_membership.json`
2. `delta_outflow_station_membership.csv`
3. `region_review_status.json`
4. `overlap_report.csv`
5. `unassigned_stations.csv`
6. `mapping_validation.json`
7. a README documenting how to launch, edit, save, and export;
8. final reviewed polygons in `inputs/waterway_regions/` only when I explicitly click a finalization/export action.

The JSON membership output should use a structure that supports multiple memberships and sensitivity groups. For example:

```json
{
  "station_network": "SCHISM 405",
  "scenario": "schism_plus30pct_outflow",
  "regions": {
    "suisun_marsh": {
      "region_name": "Suisun Marsh",
      "core_station_indices": [],
      "questionable_station_groups": {
        "nearest_rma_boundary": []
      },
      "excluded_station_indices": [],
      "polygon_path": "inputs/waterway_regions/suisun_marsh.geojson",
      "review_status": "draft"
    }
  }
}
```

Do not discard provenance. For every station-region membership, retain:

- SCHISM station index;
- station name and coordinates;
- membership status;
- nearest RMA station number and name;
- nearest-RMA distance;
- original SCHISM assignment method;
- whether the membership was generated, user-added, user-removed, or restored;
- timestamp of the most recent manual edit;
- optional user note.

## Validation

The tool and export process must verify:

- all 405 SCHISM stations remain present in the master inventory;
- station indices are unique and never confused with RMA station numbers;
- every region contains unique station indices within each membership category;
- core, questionable, and excluded sets do not overlap within the same region;
- cross-region overlaps are allowed but explicitly reported;
- no station disappears merely because it is unassigned;
- every exported polygon is valid WGS84 geometry;
- every finalized polygon path exists;
- generated defaults can be distinguished from manual decisions;
- saving and reloading produces identical membership and polygon state;
- the tool does not modify COR, B&F, NGW, Eco Machine, or approved-pattern outputs.

Add focused automated tests for crosswalk creation, multi-region membership, category transitions, round-trip persistence, polygon validation, and versioned final export.

## Deliverable and stopping condition

Implement and run the tool locally, populate its initial crosswalk, and report:

- the launch command and local URL;
- files created or changed;
- initial core/questionable/unassigned counts for every region;
- all multi-region overlaps;
- any source-data inconsistencies;
- which polygons were loaded as existing reviewed candidates versus generated as drafts;
- validation and test results.

Do not make final geographic decisions for me. Stop with the initialized editor ready for manual review. Do not finalize polygons and do not run the Delta Outflow sensitivity analysis until I have reviewed and saved the station mappings.
