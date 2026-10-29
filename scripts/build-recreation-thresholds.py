#!/usr/bin/env python3
"""Generate drilldown/recreationThresholds.ts from Recreation's analysed workbooks.

Reads the OVERALL sheet of the salinity and temperature workbooks Isaac Sanchez
sent on 26 Oct 2026 ("Activity Blind Data Recreation", the CalSim re-issue of
the 18 Oct drop). Each holds, per activity, the subteam's own -5..+5 score by
region and period, and the proportion of days
over that activity's threshold the score was read from. The workbooks live
outside the repo (research/ is untracked); pass their paths, and optionally the
sea-level-rise pair after them:

  python3 -I scripts/build-recreation-thresholds.py \
      "research/criteria-stories/Recreation/data-2026-10-26/RMA Salinity Scenarios Analyzed.xlsx" \
      "research/criteria-stories/Recreation/data-2026-10-26/RMA Temperature Scenarios Analyzed.xlsx" \
      "research/criteria-stories/Recreation/data-2026-10-26/RMA SLR Salinity Analyzed.xlsx" \
      "research/criteria-stories/Recreation/data-2026-10-26/RMA SLR Temperature Analyzed.xlsx"

The SLR workbooks share the OVERALL layout. Every workbook scores Calling on
Reserves and A Tunnel against CalSim's Business as Usual ("BAU CS").
"""
import json
import sys

import openpyxl

OUT = "src/internal/rank-visualization/drilldown/recreationThresholds.ts"

SCENARIO = {"BAU": "bau", "BAF": "bf", "B&F": "bf", "COR": "cor", "TUNNEL": "tunnel", "ECO": "em", "NGW": "ngw"}
# Since 26 Oct the workbooks score Calling on Reserves and A Tunnel against a CalSim
# Business as Usual ("BAU CS") rather than RMA's. That baseline scores 0 by
# construction and has no column of its own here, so it is skipped.
SCORE_SCENARIO = {**SCENARIO, "BAU CS": None, "COR VS CS": "cor", "TUNNEL VS CS": "tunnel"}
REGION = {
    "DELTA-WIDE": "delta",
    "SUISUN": "suisun",
    "CENTRAL": "centralDelta",
    "CENTRAL DELTA": "centralDelta",
    "NORTH": "northDelta",
    "NORTH DELTA": "northDelta",
    "SOUTH": "southDelta",
    "SOUTH DELTA": "southDelta",
}
ACTIVITY = {
    "SP DAY USE & BOATING": "dayUseBoating",
    "DAY USE & BOATING": "dayUseBoating",
    "BOATING & DAY USE": "dayUseBoating",
    "BIRDING": "birding",
    "WATERFOWL": "waterfowl",
    "ANGLING": "angling",
    "DAY USE": "dayUseCold",
    "DAY USE (<18C)": "dayUseCold",
}
PERIODS = ["run", "wet", "dry"]


def norm(value):
    return str(value).strip().upper() if value is not None else ""


def read_overall(path):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    sheet = next(ws for ws in wb.worksheets if ws.title.strip().upper() == "OVERALL")
    rows = [list(r) for r in sheet.iter_rows(values_only=True)]
    scores, days, scenarios = {}, {}, []

    for i, row in enumerate(rows):
        cells = [norm(v) for v in row]
        # ---- score blocks: a header row with REGION in it, three times over
        if "REGION" in cells:
            starts = [k for k, v in enumerate(cells) if v == "REGION"]
            label = cells[starts[0] - 1] or norm(rows[i + 1][2])
            activity = ACTIVITY[label]
            for period, start in zip(PERIODS, starts):
                names = []
                for k in range(start + 1, len(cells)):
                    if not cells[k]:
                        break
                    names.append(SCORE_SCENARIO[cells[k]])
                scenarios = [name for name in names if name]
                for r in range(i + 1, i + 6):
                    region = REGION[norm(rows[r][start])]
                    for k, scenario in enumerate(names):
                        if scenario is None:
                            continue
                        value = rows[r][start + 1 + k]
                        scores.setdefault(activity, {}).setdefault(scenario, {}).setdefault(region, {})[
                            period
                        ] = None if value is None else int(value)
        # ---- exceedance blocks: "<SCENARIO> % EXCEEDANCES", regions two rows down.
        # The CalSim runs add "(CalSIM)", and their baseline ("BAU CS …" or
        # "BAU … (CalSIM)") is kept apart from RMA's Business as Usual as `csbau`:
        # the run Calling on Reserves and A Tunnel are read against.
        if "% EXCEEDANC" in cells[2]:
            scenario = SCENARIO[cells[2].split()[0]]
            calsim = "CALSIM" in cells[2] or cells[2].split()[1] == "CS"
            if scenario == "bau" and calsim:
                scenario = "csbau"
            regions = [REGION[v] for v in [norm(v) for v in rows[i + 2][3:18]] if v]
            r = i + 3
            while r < len(rows) and norm(rows[r][2]):
                activity = ACTIVITY[norm(rows[r][2])]
                for k, value in enumerate(rows[r][3:18]):
                    period = PERIODS[k // 5]
                    region = regions[k]
                    days.setdefault(activity, {}).setdefault(scenario, {}).setdefault(region, {})[
                        period
                    ] = None if value is None else round(float(value), 4)
                r += 1
    return scores, days, scenarios


def ts_object(obj, indent=0):
    return json.dumps(obj, indent=2)


def main(salinity_path, temperature_path, slr_salinity_path=None, slr_temperature_path=None):
    sal_scores, sal_days, sal_scen = read_overall(salinity_path)
    tmp_scores, tmp_days, tmp_scen = read_overall(temperature_path)
    slr = {"scores": {}, "days": {}, "tscores": {}, "tdays": {}}
    if slr_salinity_path and slr_temperature_path:
        slr["scores"], slr["days"], slr_sal_scen = read_overall(slr_salinity_path)
        slr["tscores"], slr["tdays"], slr_tmp_scen = read_overall(slr_temperature_path)
        print("SLR salinity scenarios:", slr_sal_scen, "| SLR temperature scenarios:", slr_tmp_scen)
    body = f"""// GENERATED by scripts/build-recreation-thresholds.py — do not edit by hand.
//
// Recreation's own analysis of the RMA scenario runs: for each activity, the
// subteam's −5…+5 score by region and period, and the proportion of days over the
// activity's threshold that the score was read from. Source: the OVERALL sheets of
// "RMA Salinity Scenarios Analyzed.xlsx" and "RMA Temperature Scenarios
// Analyzed.xlsx" (Isaac Sanchez, 26 Oct 2026), and of the matching "RMA SLR …
// Analyzed.xlsx" pair for the sea-level-rise runs. Scores follow the workbook's own
// scale: one point per percentage point of exceedance against Business as Usual,
// ±5 at five points or more. Calling on Reserves and A Tunnel are CalSim runs,
// scored against CalSim's own Business as Usual, so their days over a threshold
// compare with that baseline (`csbau` in the days tables) rather than with RMA's.
import type {{ ScenarioKey }} from './model'

export type RecActivityKey = 'dayUseBoating' | 'birding' | 'waterfowl' | 'angling' | 'dayUseCold'
export type RecRegionKey = 'delta' | 'suisun' | 'centralDelta' | 'northDelta' | 'southDelta'
export type RecPeriodKey = 'run' | 'wet' | 'dry'

/** activity → scenario → region → period. */
export type RecTable<T> = Partial<
  Record<RecActivityKey, Partial<Record<ScenarioKey, Record<RecRegionKey, Record<RecPeriodKey, T>>>>>
>

export const REC_SALINITY_SCORES: RecTable<number | null> = {ts_object(sal_scores)}

export const REC_SALINITY_DAYS: RecTable<number | null> = {ts_object(sal_days)}

export const REC_TEMPERATURE_SCORES: RecTable<number | null> = {ts_object(tmp_scores)}

export const REC_TEMPERATURE_DAYS: RecTable<number | null> = {ts_object(tmp_days)}

// Sea level rise: every scenario, each scored against the SLR run's own Business as
// Usual (CalSim's, for Calling on Reserves and A Tunnel).
export const REC_SLR_SALINITY_SCORES: RecTable<number | null> = {ts_object(slr["scores"])}

export const REC_SLR_SALINITY_DAYS: RecTable<number | null> = {ts_object(slr["days"])}

export const REC_SLR_TEMPERATURE_SCORES: RecTable<number | null> = {ts_object(slr["tscores"])}

export const REC_SLR_TEMPERATURE_DAYS: RecTable<number | null> = {ts_object(slr["tdays"])}
"""
    # The header holds "−" and "…": write UTF-8 whatever the platform's codepage.
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(body)
    print("wrote", OUT, "| salinity scenarios:", sal_scen, "| temperature scenarios:", tmp_scen)
    print("salinity activities:", list(sal_scores), "| temperature activities:", list(tmp_scores))


if __name__ == "__main__":
    if len(sys.argv) not in (3, 5):
        sys.exit(__doc__)
    main(*sys.argv[1:])
