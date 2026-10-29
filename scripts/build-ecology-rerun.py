#!/usr/bin/env python3
"""Generate drilldown/ecologyRerun.ts from Ecology's 27 Oct 2026 rerun.

The source is the Ecology "Story Behind the Criterion" report (tmp/ is untracked);
pass its path:

  python3 -I scripts/build-ecology-rerun.py \
      "tmp/pdfs/Ecology/Copy of ECOLOGY_ The Story Behind the Criterion.docx"

The section "Adaptation Scenarios - New Base, Calling on Reserves update, a tunnel"
reruns the niche analysis on a new CalSIM baseline, with an updated Calling on
Reserves and A Tunnel for the first time. Delta-wide it gives the proportion of
suitable days and the average streak length per water year; by region it gives
both pooled over 2019-2020, as a (proportion, streak) pair per scenario.
"""

import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

OUT = "src/internal/rank-visualization/drilldown/ecologyRerun.ts"
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
# The 29 Oct 2026 report renames the section "Adaptation Scenario Analysis – New Baseline, …".
START = ("adaptation scenarios - new base", "adaptation scenario analysis – new baseline")
END = "adaptation scenarios - sea level rise"

SCENARIO = {
    "new calsim base": "base",
    "new base": "base",
    "calling on reserves": "cor",
    "a tunnel": "tunnel",
}
SPECIES_COLUMN = {
    "longfin smelt juv": "longfinJuv",
    "longfin smelt adult": "longfinAdult",
    "longfin adult": "longfinAdult",
    "egeria": "egeria",
    "juvenile overbite clam": "overbiteClam",
    "overbite clam": "overbiteClam",
    "striped bass juvenile": "stripedBassJuv",
    "striped bass adult": "stripedBassAdult",
    "chinook juv": "chinook",
    "largemouth bass": "largemouthBass",
}
SPECIES_TITLE = {
    "longfin smelt juvenile": "longfinJuv",
    "longfin smelt adult": "longfinAdult",
    "egeria": "egeria",
    "overbite clam": "overbiteClam",
    "striped bass juvenile": "stripedBassJuv",
    "striped bass adult": "stripedBassAdult",
    "chinook juvenile": "chinook",
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


def lookup(table: dict, label: str, what: str) -> str:
    key = label.lower().strip()
    if key not in table:
        sys.exit(f"Unknown Ecology {what}: {label!r}")
    return table[key]


def ptext(p) -> str:
    return "".join(t.text or "" for t in p.iter(W + "t")).strip()


def rows_of(tbl) -> list[list[str]]:
    return [
        [" ".join(ptext(p) for p in tc.findall(W + "p")).strip() for tc in tr.findall(W + "tc")]
        for tr in tbl.findall(W + "tr")
    ]


def by_year(rows: list[list[str]]) -> dict[str, dict[str, list[float]]]:
    """Scenario | Year | species...; the scenario cell is blank on the 2020 row."""
    species = [lookup(SPECIES_COLUMN, h, "species column") for h in rows[0][2:]]
    out: dict[str, dict[str, list[float]]] = {}
    current = ""
    for row in rows[1:]:
        current = lookup(SCENARIO, row[0], "scenario") if row[0] else current
        at = {"2019": 0, "2020": 1}[row[1]]
        for key, cell in zip(species, row[2:]):
            out.setdefault(key, {}).setdefault(current, [0.0, 0.0])[at] = float(cell)
    return out


def rerun(path: Path):
    body = ET.fromstring(zipfile.ZipFile(path).read("word/document.xml")).find(W + "body")
    inside, heading = False, ""
    delta = streak = None
    region: dict[str, dict[str, dict[str, float]]] = {}
    region_streak: dict[str, dict[str, dict[str, float]]] = {}
    for el in body:
        if el.tag == W + "p":
            text = ptext(el)
            if text.lower().startswith(START):
                inside = True
            elif text.lower().startswith(END):
                break
            heading = text or heading
            continue
        if not inside or el.tag != W + "tbl":
            continue
        rows = rows_of(el)
        if heading.lower().startswith("proportion of suitable days across"):
            delta = by_year(rows)
        elif heading.lower().startswith("average streak length"):
            streak = by_year(rows)
        else:
            # Region | then a (proportion, streak) pair per scenario, pooled over both years.
            species = lookup(SPECIES_TITLE, heading, "species title")
            scenarios = [lookup(SCENARIO, h, "scenario") for h in rows[0][1:]]
            for row in rows[1:]:
                place = lookup(REGION, row[0], "region")
                for i, scenario in enumerate(scenarios):
                    share, days = row[1 + 2 * i], row[2 + 2 * i]
                    region.setdefault(species, {}).setdefault(scenario, {})[place] = float(share)
                    region_streak.setdefault(species, {}).setdefault(scenario, {})[place] = float(days)
    if not (delta and streak and len(region) == 8):
        sys.exit("Did not find the rerun's two Delta-wide tables and eight regional tables.")
    return delta, streak, region, region_streak


def num(value: float, places: int) -> str:
    return f"{value:.{places}f}".rstrip("0").rstrip(".")


def emit_pairs(name: str, doc: str, data, places: int) -> str:
    lines = [f"/** {doc} */", f"export const {name}: Record<EcologySpeciesKey, Record<RerunScenario, [number, number]>> = {{"]
    for species in SPECIES_TITLE.values():
        lines.append(f"  {species}: {{")
        for scenario in ("base", "cor", "tunnel"):
            a, b = data[species][scenario]
            lines.append(f"    {scenario}: [{num(a, places)}, {num(b, places)}],")
        lines.append("  },")
    lines.append("}")
    return "\n".join(lines)


def emit_regions(name: str, doc: str, data, places: int) -> str:
    lines = [
        f"/** {doc} */",
        f"export const {name}: Record<",
        "  EcologySpeciesKey,",
        "  Record<RerunScenario, Record<EcologyRegionKey, number>>",
        "> = {",
    ]
    for species in SPECIES_TITLE.values():
        lines.append(f"  {species}: {{")
        for scenario in ("base", "cor", "tunnel"):
            cells = ", ".join(f"{place}: {num(data[species][scenario][place], places)}" for place in REGION.values())
            lines.append(f"    {scenario}: {{ {cells} }},")
        lines.append("  },")
    lines.append("}")
    return "\n".join(lines)


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    delta, streak, region, region_streak = rerun(Path(sys.argv[1]))
    out = "\n\n".join(
        [
            "// Generated by scripts/build-ecology-rerun.py — do not edit by hand.\n"
            "//\n"
            "// Ecology's 27 Oct 2026 rerun of the niche analysis: a new CalSIM baseline, an\n"
            "// updated Calling on Reserves, and A Tunnel for the first time. It has its own\n"
            "// baseline, so a difference is read against \"New CalSIM Base\", never against the\n"
            "// Business as Usual in ./ecologyNiche.ts.\n"
            "import type { EcologyRegionKey, EcologySpeciesKey } from './ecologyNiche'",
            "export type RerunScenario = 'base' | 'cor' | 'tunnel'",
            "export const ECOLOGY_RERUN_SCENARIOS: { key: RerunScenario; label: string }[] = [\n"
            "  { key: 'base', label: 'New CalSIM Base' },\n"
            "  { key: 'cor', label: 'Calling on Reserves, updated' },\n"
            "  { key: 'tunnel', label: 'A Tunnel' },\n"
            "]",
            emit_pairs("ECOLOGY_RERUN_DELTA", "Delta-wide proportion of suitable days, [2019, 2020].", delta, 4),
            emit_pairs("ECOLOGY_RERUN_STREAK", "Delta-wide average consecutive suitable days, [2019, 2020].", streak, 2),
            emit_regions(
                "ECOLOGY_RERUN_REGION",
                "Proportion of suitable days by region, pooled over 2019 and 2020.",
                region,
                4,
            ),
            emit_regions(
                "ECOLOGY_RERUN_REGION_STREAK",
                "Average consecutive suitable days by region, pooled over 2019 and 2020.",
                region_streak,
                2,
            ),
        ]
    )
    Path(OUT).write_text(out + "\n", encoding="utf-8", newline="\n")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
