# Scenario Explorer

Interactive comparison of RMA scenarios, paired RMA/SCHISM output, and tiered-outflow SCHISM runs.

## Provenance

Migrated on 2026-07-17 from the local project at `JT_exploration/RMA/EDA`. The source project was copied and left unchanged. The integration converts the React code to TypeScript, uses the JT website theme and route shell, and namespaces its runtime data.

Confirm the original code and dataset licensing before distributing this feature outside the project. Add the upstream repository, author, license, and source revision here when known.

## Data

The browser loads three generated files from `public/data/scenario-explorer`:

- `salinity_dashboard.json`
- `rma_schism_dashboard.json`
- `tiered_outflows_dashboard.json`

The source preprocessing utilities are retained in `scripts/scenario-explorer`. They may contain source-machine paths and should be reviewed before regenerating data.
