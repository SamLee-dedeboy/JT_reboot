"""Put the latest Calling on Reserves patterns on the Regional Summary page.

The page's Calling on Reserves set came from the September 2026 analysis of the earlier COR run
(compared with the historical BAU). This replaces it with the patterns from the latest COR run
against BAU (CalSim): the rule-selected set already in pattern-list-provisional.json
(`provisional_current_reserve`, from regional_pattern_refresh_2026-10-29). It rewrites, for
Calling on Reserves only:

- pattern-list.json: the places and patterns (still marked provisional; not yet team reviewed);
- pattern-evidence.json: station evidence for each pattern;
- pattern-ec-series-7d.json: each pattern region's 7-day mean EC, BAU (CalSim) and COR;
- pattern-surrounding-stations.json: every station's change over each pattern's window.

Station values come from public/data/salinity/scenario-explorer/salinity_dashboard.json (COR as
a difference from BAU CalSim, plus BAU CalSim itself); station membership and the regional daily
means come from the refresh.

    python scripts/regional-summary/promote-latest-cor-patterns.py [BDSC_regional_summary dir]
"""

import copy
import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RESEARCH = Path(
    sys.argv[1] if len(sys.argv) > 1 else ROOT.parent / "JT_exploration/RMA/BDSC_regional_summary"
)
REFRESH = RESEARCH / "internal/analysis/regional_pattern_refresh_2026-10-29"
PATTERNS = ROOT / "public/data/patterns"
DASHBOARD = ROOT / "public/data/salinity/scenario-explorer/salinity_dashboard.json"

SCENARIO = "reserve"
PROVISIONAL_KEY = "provisional_current_reserve"
BASE_LABEL = "Business as Usual (CalSim)"
# Refresh region ids that differ from the site's.
SITE_REGION = {"south_delta": "southern_delta", "freshwater_corridor": "bf_freshwater_pathway"}


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write(path: Path, payload, compact=False) -> None:
    if compact:
        text = json.dumps(payload, separators=(",", ":"), ensure_ascii=False)
    else:
        text = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    path.write_text(text, encoding="utf-8", newline="\n")


def mean(values):
    return sum(values) / len(values) if values else None


def rounded(value, places=3):
    return None if value is None else round(value, places)


def main() -> None:
    provisional = load(PATTERNS / "pattern-list-provisional.json")["scenarios"][PROVISIONAL_KEY]
    review = {row["pattern_id"]: row for row in load(REFRESH / "review_patterns.json")}
    dashboard = load(DASHBOARD)
    cor = next(s for s in dashboard["scenarios"] if s["key"] == SCENARIO)
    reference = dashboard["referenceStationValuesByKey"][cor["referenceKey"]]
    dates = dashboard["dates"]
    date_index = {day: index for index, day in enumerate(dates)}
    station_index = {int(s["station_id"]): index for index, s in enumerate(dashboard["stations"])}

    places = copy.deepcopy(provisional["places"])
    for place in places:
        for pattern in place["patterns"]:
            pattern["broaderStoryGroup"] = "Calling on Reserves"
    pattern_ids = [p["id"] for place in places for p in place["patterns"]]
    missing = [pid for pid in pattern_ids if pid not in review]
    if missing:
        raise SystemExit(f"Not in the refresh: {missing}")

    def station_change(index, start, end, direction):
        pairs = [
            (b, d)
            for b, d in zip(reference[index][start : end + 1], cor["stationValues"][index][start : end + 1])
            if b is not None and d is not None
        ]
        if not pairs:
            return None
        station = dashboard["stations"][index]
        baseline = mean([b for b, _ in pairs])
        difference = mean([d for _, d in pairs])
        change = "fresher" if difference < 0 else "saltier"
        return {
            "stationId": int(station["station_id"]),
            "name": station["long_name"],
            "shortName": station["short_name"],
            "longitude": station["longitude"],
            "latitude": station["latitude"],
            "baselineMean": rounded(baseline),
            "scenarioMean": rounded(baseline + difference),
            "differenceEc": rounded(difference),
            "differencePct": None if baseline == 0 else rounded(difference / baseline * 100),
            "direction": change,
            "agreesWithPattern": change == direction,
        }

    # pattern-list.json
    pattern_list = load(PATTERNS / "pattern-list.json")
    old_ids = {
        p["id"] for place in pattern_list["scenarios"][SCENARIO]["places"] for p in place["patterns"]
    }
    pattern_list["scenarios"][SCENARIO]["places"] = places
    pattern_list["generatedAt"] = datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
    pattern_list["sourceRecordCount"] = sum(
        len(place["patterns"]) for s in pattern_list["scenarios"].values() for place in s["places"]
    )
    write(PATTERNS / "pattern-list.json", pattern_list)

    # pattern-evidence.json
    evidence = load(PATTERNS / "pattern-evidence.json")
    evidence["patterns"] = {k: v for k, v in evidence["patterns"].items() if k not in old_ids}
    evidence["scenarios"][SCENARIO]["regionOrder"] = [place["id"] for place in places]
    for place in places:
        for pattern in place["patterns"]:
            start, end = date_index[pattern["startDate"]], date_index[pattern["endDate"]]
            ids = review[pattern["id"]]["included_station_ids"]
            stations = [
                change
                for sid in ids
                if sid in station_index
                and (change := station_change(station_index[sid], start, end, pattern["direction"]))
            ]
            agreeing = sum(s["agreesWithPattern"] for s in stations)
            plain = pattern["direction"]
            evidence["patterns"][pattern["id"]] = {
                "patternId": pattern["id"],
                "scenarioKey": SCENARIO,
                "regionId": place["id"],
                "regionName": place["name"],
                "eventWindow": {"startDate": pattern["startDate"], "endDate": pattern["endDate"]},
                "stationEvidence": {
                    "provenance": "derived-from-scenario-explorer-daily-stations",
                    "membershipSource": "regional_pattern_refresh_2026-10-29",
                    "stationCount": len(stations),
                    "stations": stations,
                },
                "narrative": {
                    "headline": f"{plain.capitalize()} conditions persisted for {pattern['durationDays']} days.",
                    "description": (
                        f"{place['name']} was {plain} than {BASE_LABEL} from {pattern['startDate']} to "
                        f"{pattern['endDate']}, by about {abs(pattern['differencePct']):.0f}%."
                        + (f" {round(agreeing / len(stations) * 100)}% of included stations changed in the same direction." if stations else "")
                    ),
                    "provenance": "regional_pattern_refresh_2026-10-29",
                    "reviewStatus": "provisional",
                },
            }
    evidence["generatedAt"] = pattern_list["generatedAt"]
    write(PATTERNS / "pattern-evidence.json", evidence)

    # pattern-ec-series-7d.json: each region's daily mean, as a trailing 7-day mean.
    daily = {}
    with (REFRESH / "runs/current__reserve/daily_regional_statistics.csv").open(encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            region = SITE_REGION.get(row["region_id"], row["region_id"])
            daily.setdefault(region, {})[row["date"]] = (
                float(row["baseline_mean"]) if row["baseline_mean"] else None,
                float(row["scenario_mean"]) if row["scenario_mean"] else None,
            )

    def trailing(values):
        out = []
        for index in range(len(values)):
            window = [v for v in values[max(0, index - 6) : index + 1] if v is not None]
            out.append(round(sum(window) / len(window), 3) if window else None)
        return out

    series = load(PATTERNS / "pattern-ec-series-7d.json")
    series = {k: v for k, v in series.items() if k not in old_ids}
    for place in places:
        region = daily[place["id"]]
        base = [region.get(day, (None, None))[0] for day in dates]
        scen = [region.get(day, (None, None))[1] for day in dates]
        entry = {
            "dates": dates,
            "baseline": trailing(base),
            "scenario": trailing(scen),
            "scenarioMin": [None] * len(dates),
            "scenarioMax": [None] * len(dates),
        }
        for pattern in place["patterns"]:
            series[pattern["id"]] = entry
    write(PATTERNS / "pattern-ec-series-7d.json", series, compact=True)

    # pattern-surrounding-stations.json
    surrounding = load(PATTERNS / "pattern-surrounding-stations.json")
    surrounding["patterns"] = {k: v for k, v in surrounding["patterns"].items() if k not in old_ids}
    for place in places:
        for pattern in place["patterns"]:
            start, end = date_index[pattern["startDate"]], date_index[pattern["endDate"]]
            surrounding["patterns"][pattern["id"]] = [
                change
                for index in range(len(dashboard["stations"]))
                if (change := station_change(index, start, end, pattern["direction"]))
            ]
    write(PATTERNS / "pattern-surrounding-stations.json", surrounding, compact=True)

    print(f"Replaced {len(old_ids)} earlier COR patterns with {len(pattern_ids)} from the latest run.")


if __name__ == "__main__":
    main()
