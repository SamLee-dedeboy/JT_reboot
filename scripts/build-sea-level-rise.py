#!/usr/bin/env python3
"""Generate drilldown/seaLevelRise.ts from the subteams' sea-level-rise runs.

Two sources, both outside the repo (research/ is untracked); pass their paths:

  python3 -I scripts/build-sea-level-rise.py \
      "research/criteria-stories/Ecology/Sea Level Rise Scenario Analysis - Eco - 10_15_2026.docx" \
      "research/criteria-stories/EJ and vulnerable communities/SLR COMM.xlsx"

Ecology (15 Oct 2026): proportion of suitable days per species under four
scenarios with sea level rise. Delta-wide it is split by water year; by region
the report gives one number pooled over 2019-2020, with the streak length
beneath it, and only the proportion is read here.

EJ ("SLR COMM", 19 Oct 2026): the OVERALL - SLR sheet, the share of SAFER
drinking-water points over 1,050 uS/cm by vulnerability class, for the whole
run and water years 2019 and 2020.

Recreation's SLR workbooks are not loaded yet; see TODO.md.
"""

import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

import openpyxl

OUT = "src/internal/rank-visualization/drilldown/seaLevelRise.ts"
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

SCENARIO = {
    "base": "bau",
    "bolster and fortify": "bf",
    "new green watershed": "ngw",
    "eco machine": "em",
}
SPECIES_COLUMN = {
    "lfs juv": "longfinJuv",
    "lfs adult": "longfinAdult",
    "egeria": "egeria",
    "overbite clam juv": "overbiteClam",
    "sb juv": "stripedBassJuv",
    "sb adult": "stripedBassAdult",
    "chinook": "chinook",
    "largemouth bass": "largemouthBass",
}
SPECIES_TITLE = {
    "longfin smelt juvenile": "longfinJuv",
    "longfin smelt adult": "longfinAdult",
    "egeria": "egeria",
    "juvenile overbite clams": "overbiteClam",
    "striped bass juvenile": "stripedBassJuv",
    "striped bass adult": "stripedBassAdult",
    "chinook juv": "chinook",
    "largemouth bass": "largemouthBass",
}
REGION = {
    "central bay": "centralBay",
    "central delta": "centralDelta",
    "confluence": "confluence",
    "north delta": "northDelta",
    "san pablo bay": "sanPabloBay",
    "south bay": "southBay",
    "south delta": "southDelta",
    "suisun bay": "suisunBay",
}
EJ_SCENARIO = {
    "BUSINESS AS USUAL (BASELINE)": "bau",
    "BOLSTER AND FORTIFY": "bf",
    "ECO MACHINE": "em",
    "NEW GREEN WATERSHED": "ngw",
}
EJ_CLASS = {
    "% moderate exceedances": "moderate",
    "% high exceedances": "high",
    "% highest exceedances": "highest",
    "% TOTAL EXCEEDANCES": "all",
}


def scenario_key(label: str) -> str:
    name = re.sub(r"\bslr\b", "", label.lower()).strip()
    if name not in SCENARIO:
        sys.exit(f"Unknown Ecology scenario label: {label!r}")
    return SCENARIO[name]


def ptext(p) -> str:
    return "".join(t.text or "" for t in p.iter(W + "t")).strip()


def cell_paragraphs(tc) -> list[str]:
    return [text for text in (ptext(p) for p in tc.findall(W + "p")) if text]


def ecology(path: Path):
    body = ET.fromstring(zipfile.ZipFile(path).read("word/document.xml")).find(W + "body")
    delta: dict[str, dict[str, list[float]]] = {}
    region: dict[str, dict[str, dict[str, float]]] = {}
    heading = ""
    for el in body:
        if el.tag == W + "p":
            heading = ptext(el) or heading
            continue
        if el.tag != W + "tbl":
            continue
        rows = [[cell_paragraphs(tc) for tc in tr.findall(W + "tc")] for tr in el.findall(W + "tr")]
        head = [" ".join(c) for c in rows[0]]
        if heading.lower().startswith("overall scenario proportions"):
            # Scenario | Year | species... | Total days; the scenario cell is blank on the 2020 row.
            species = [SPECIES_COLUMN[h.lower()] for h in head[2:-1]]
            current = ""
            for row in rows[1:]:
                label, year = " ".join(row[0]), " ".join(row[1])
                current = scenario_key(label) if label else current
                at = {"2019": 0, "2020": 1}[year]
                for key, cell in zip(species, row[2:]):
                    delta.setdefault(key, {}).setdefault(current, [0.0, 0.0])[at] = float(cell[0])
        elif heading.lower() in SPECIES_TITLE:
            # Region | one column per scenario; each cell is proportion over streak length.
            key = SPECIES_TITLE[heading.lower()]
            scenarios = [scenario_key(h) for h in head[1:]]
            for row in rows[1:]:
                place = REGION[" ".join(row[0]).lower()]
                for scenario, cell in zip(scenarios, row[1:]):
                    region.setdefault(key, {}).setdefault(scenario, {})[place] = float(cell[0])
    if len(delta) != 8 or len(region) != 8:
        sys.exit(f"Expected 8 species in both tables, got {len(delta)} and {len(region)}")
    return delta, region


def ej(path: Path):
    ws = openpyxl.load_workbook(path, data_only=True, read_only=True)["OVERALL - SLR"]
    grid = [list(row) for row in ws.iter_rows(values_only=True)]
    out: dict[str, dict[str, list[float]]] = {}
    for r, row in enumerate(grid):
        for c, value in enumerate(row):
            if value not in EJ_SCENARIO:
                continue
            scenario = EJ_SCENARIO[value]
            # Below the scenario name: a TOTAL / WY 19 / WY 20 header, then one row per class.
            for line in grid[r + 2 : r + 6]:
                label = line[c]
                numbers = line[c + 2 : c + 5]
                if label not in EJ_CLASS or any(n is None for n in numbers):
                    sys.exit(f"Unexpected EJ layout under {value!r}: {line[c:c + 5]}")
                out.setdefault(EJ_CLASS[label], {})[scenario] = [float(n) for n in numbers]
    if len(out) != 4 or any(len(by) != 4 for by in out.values()):
        sys.exit(f"Expected 4 classes x 4 scenarios, got {out}")
    return out


def ts(value, indent=0) -> str:
    pad = "  " * indent
    if isinstance(value, dict):
        lines = [f"{pad}  {k}: {ts(v, indent + 1).lstrip()}," for k, v in value.items()]
        return "{\n" + "\n".join(lines) + f"\n{pad}}}"
    if isinstance(value, list):
        return "[" + ", ".join(ts(v) for v in value) + "]"
    return repr(round(value, 4))


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    eco_delta, eco_region = ecology(Path(sys.argv[1]))
    ej_classes = ej(Path(sys.argv[2]))
    body = f"""// Generated by scripts/build-sea-level-rise.py — do not edit by hand.
//
// The subteams' runs with sea level rise. Each has its own Business as Usual
// ("Base SLR"), so a difference is read against that, never against today's run.
// Calling on Reserves and A Tunnel were not run with sea level rise by either team.
import type {{ EcologyRegionKey, EcologySpeciesKey }} from './ecologyNiche'

type SlrScenario = 'bau' | 'bf' | 'em' | 'ngw'

/** Ecology, Delta-wide: proportion of suitable days, [2019, 2020]. */
export const ECOLOGY_SLR_DELTA: Record<
  EcologySpeciesKey,
  Record<SlrScenario, [number, number]>
> = {ts(eco_delta)}

/** Ecology, by region: proportion of suitable days over 2019 and 2020 together. */
export const ECOLOGY_SLR_REGION: Record<
  EcologySpeciesKey,
  Record<SlrScenario, Record<EcologyRegionKey, number>>
> = {ts(eco_region)}

/** EJ: share of SAFER points over 1,050 µS/cm, [whole run, WY 2019, WY 2020]. */
export const EJ_SLR_DRINKING: Record<
  'all' | 'moderate' | 'high' | 'highest',
  Record<SlrScenario, [number, number, number]>
> = {ts(ej_classes)}
"""
    Path(OUT).write_text(body, encoding="utf-8")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
