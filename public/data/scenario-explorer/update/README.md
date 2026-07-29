# Scenario Explorer data update — 2026-07-28

Temporary regenerated data snapshot for review before replacing the files in the
parent directory.

## Inputs

- Base dataset: `JT_exploration/RMA/data`
- Replacement overlay: `JT_exploration/RMA/data/final_full_EC_update_0724`
- The overlay replaces matching COR, DCP, and NGW CSVs by filename.
- COR Economy uses the corrected instantaneous EC and EC-AVG-AVG files added to
  the overlay on July 28.

## Outputs

- `salinity_dashboard.json` — regenerated with revised EC-AVG-AVG data
- `rma_schism_dashboard.json` — regenerated with revised instantaneous EC data
- `tiered_outflows_dashboard.json` — regenerated from unchanged SCHISM inputs
- `d1641_rma.json` — regenerated from the overlaid absolute RMA inputs, including
  all-date display metrics and D-1641 compliance judgments
- `d1641_source/` — intermediate compliance tables used to build `d1641_rma.json`
- `all_386_unique_stations.csv` — station metadata emitted during salinity build

The matching JSON files in the parent directory are the promoted live versions.
`pre_economy_0728/` preserves the immediately preceding generated snapshot.
