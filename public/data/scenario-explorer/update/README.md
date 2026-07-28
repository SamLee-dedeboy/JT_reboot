# Scenario Explorer data update — 2026-07-24

Temporary regenerated data snapshot for review before replacing the files in the
parent directory.

## Inputs

- Base dataset: `JT_exploration/RMA/data`
- Replacement overlay: `JT_exploration/RMA/data/final_full_EC_update_0724`
- The overlay replaces matching COR, DCP, and NGW CSVs by filename.
- COR Economy continues to use the existing `reserve` source because the update
  intentionally excludes the mislabeled COR Economy delivery.

## Outputs

- `salinity_dashboard.json` — regenerated with revised EC-AVG-AVG data
- `rma_schism_dashboard.json` — regenerated with revised instantaneous EC data
- `tiered_outflows_dashboard.json` — regenerated from unchanged SCHISM inputs
- `d1641_rma.json` — regenerated from unchanged processed D-1641 inputs
- `all_386_unique_stations.csv` — station metadata emitted during salinity build

The application continues to load the files in the parent directory. Nothing in
this folder is live until the reviewed JSON files are promoted.
