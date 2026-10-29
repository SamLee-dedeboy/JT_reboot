# Rankings reference

What each subteam ranks, what every ranking score is based on, the entities behind
it, and the periods and regions it covers. Compiled 19 Oct 2026 from the five "Story
Behind the Criterion" reports (Sept 2026), Ecology's "Sea Level Rise Scenario
Analysis" (15 Oct 2026) and the Bay-Delta Science Conference slides (Oct 2026). The
slides supersede the reports where they differ. Slide rank charts are PowerPoint
tables; their cell positions were read directly, so scores below are the published
positions, not estimates.

Scenario order throughout: **BAU · ECO · NGW · B&F · COR · TUN** (Business as Usual,
Eco Machine, New Green Watershed, Bolster & Fortify, Calling on Reserves, A Tunnel).
Every score is −5…+5 against Business as Usual (0) unless noted.

The breakout table (`src/features/scenarios/ranking/breakout/`) follows this document: ranking scores are the main
rows, and each one opens into the entities it is based on, in their own units.

## Overview

| Team         | Published criterion score              | Ranking scores                                          | Based on                                                           | Entities                                                                                      | Periods                                                            | Regions                                             |
| ------------ | -------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| Ecology      | No                                     | Landscape, Food webs, Species suitability (per species) | Acres; % of suitable days per species                              | 8 species / life stages                                                                       | WY 2019 (wet) and WY 2020 (dry), each Feb 1 – Jun 1                | 8 estuary regions, 145 points                       |
| Recreation   | Yes, mean of 4 parts (26 Oct)          | Salinity, Temperature; Restoration, Economy (apart)     | % of days over an activity threshold                               | 4 activities (salinity), 5 (temperature)                                                      | Whole run, wet season (Oct–Mar), dry season (Apr–Sep)              | Delta-wide + 4 regions, 32 points                   |
| Env. Justice | Yes, rounded mean of 3                 | Drinking water, Flood risk, Water age + temperature     | % of readings ≥ 1,050 µS/cm; qualitative judgement; water-age days | Drinking water: the 3 vulnerability classes (used as EJ's places); water age: 5 hotspot areas | Whole run, wet season, dry season; SLR runs by water year          | Moderate / High / Highest vulnerability (49 points) |
| Economy      | Yes, one score shared by its 3 metrics | Gross revenue, Jobs, Value added                        | Dollars and jobs against Business as Usual                         | None by land use (see below)                                                                  | WY 2019 (wet), WY 2020 (dry); land conversion annualised; SLR runs | Delta-wide + 4 zones                                |
| Eco-cultural | Yes, one overall score                 | Overall; Restoration (slide 55)                         | Restored acres + qualitative                                       | Habitat types (acres), not scored                                                             | None                                                               | In-Delta, upper watershed                           |

## Ecology

### Ranking scores

| Score                                  | Based on                                                                                                                              | Rule                                                                              | BAU         | ECO         | NGW          | B&F         | COR         | TUN     |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------- | ----------- | ------------ | ----------- | ----------- | ------- |
| Landscape (accessible aquatic habitat) | Added tidal wetland acres: ECO 53,000; NGW 80,000                                                                                     | +1 per ~16,000 ac                                                                 | 0           | +3          | +5           | 0           | 0           | 0       |
| Food webs                              | Index = (managed wetland − 5,100)×0.2 + added tidal×0.4 + (wet-soil ag − 17,178)×0.1. ECO 21,200; NGW 1/2/3: 80,743 / 69,661 / 60,270 | +1 per ~16,148                                                                    | 0           | +1          | +5 / +4 / +4 | 0           | 0           | 0       |
| Species suitability                    | % of days inside each species' salinity and temperature range (slides 12–13); suitable-day streaks (slides 14–15)                     | +1 per percentage point (or day); sign reversed for the three undesirable species | per species | per species | per species  | per species | per species | not run |
| _Criterion score (app only, ours)_     | _Mean of Landscape and Food webs_                                                                                                     |                                                                                   | _0_         | _2_         | _4.5_        | _0_         | _0_         | _0_     |

New Green Watershed versions: 1 = all managed wetland, 2 = 50% wetland / 50% rice
(the primary version, used where one NGW value is needed), 3 = 25% / 75%.

### Entities: species ranks for % of suitable days

Derived from the report's Table 16 with the slides' rule; they reproduce the dots on
slides 12–13. Unlisted cells are 0; Bolster & Fortify is 0 for every species.

| Species                               | WY 2019 (wet)  | WY 2020 (dry)          |
| ------------------------------------- | -------------- | ---------------------- |
| Longfin smelt, juvenile               | ECO +1, NGW +1 | 0                      |
| Longfin smelt, adult                  | 0              | 0                      |
| Chinook salmon, juvenile              | COR +1         | 0                      |
| Striped bass, juvenile                | 0              | 0                      |
| Striped bass, adult                   | 0              | 0                      |
| Largemouth bass (undesirable)         | 0              | ECO +2, NGW +2, TUN −2 |
| Overbite clam, juvenile (undesirable) | 0              | ECO −1, NGW −1, TUN +2 |
| Brazilian waterweed (undesirable)     | 0              | ECO +1, NGW +1, TUN −2 |

COR and TUN come from Ecology's 27 Oct 2026 rerun ("Adaptation Scenarios - New Base,
Calling on Reserves update, a tunnel"; `drilldown/ecologyRerun.ts`), read against the
rerun's own New CalSIM Base with the same rule. Every COR cell is now 0; the earlier
COR ranks (Chinook +1, largemouth bass +2, overbite clam −1, Brazilian waterweed +2)
came from the superseded run. These two columns' ranks are ours; the slides predate
the rerun. Their values are Delta-wide only: the rerun pools its regions over both years.

The streak grids (slides 14–15) mark most species as one "all others" group, do not
reproduce from either streak table in the report, and slide 15 uses a 0–10 scale; they
are not attributed to species here.

### Not ranked

Conceptual models (narrative); average suitable-day streak (report values); the acreage
inputs to Landscape and Food webs.

### Relationships

Species suitability feeds no Ecology score. Added tidal wetland acres feed both
Landscape and Food webs. Only Eco Machine and New Green Watershed change acreage; the
other scenarios are 0 by statement.

### Periods and regions

Species work covers **Feb 1 – Jun 1** of 2019 (wet water year) and 2020 (dry water
year), analysed separately; there is no whole run. SLR runs use the same windows and
pool the two for regions. Regions: North Delta 30 points, Central Delta 23, South
Delta 11, Confluence 16, Suisun Bay 25, San Pablo Bay 15, Central Bay 16, South Bay 9.

## Recreation

### Criterion score

"Recreation: the score" (Recreation The Score.xlsx, 26 Oct 2026, in
`research/criteria-stories/Recreation/data-2026-10-26/`):
(A + A SLR + B + B SLR) / 4, where A is the mean of the salinity activity scores and
B of the temperature ones, whole run, today and with sea level rise. The app
recomputes it from the activity scores and matches the sheet's Delta-wide and
regional tables exactly. Not rounded; the table shows one decimal.

| Place         | BAU | B&F     | ECO     | NGW     | COR vs CS | TUN vs CS |
| ------------- | --- | ------- | ------- | ------- | --------- | --------- |
| Delta-wide    | 0   | 0       | −0.375  | −0.375  | +0.0625   | −0.125    |
| Suisun Marsh  | 0   | 0       | −1.825  | −1.825  | +0.4375   | −0.3125   |
| Central Delta | 0   | −0.25   | +0.5625 | +0.5625 | +0.25     | −0.4125   |
| North Delta   | 0   | 0       | 0       | 0       | 0         | −0.1      |
| South Delta   | 0   | +0.0625 | +0.1875 | +0.125  | 0         | 0         |

Calling on Reserves and A Tunnel are CalSim runs, scored against CalSim's own
Business as Usual ("BAU CS"), in every workbook of the 26 Oct drop, today and with
sea level rise. Against RMA's Business as Usual they had been −2.5 and −4. Their
days over a threshold are shown as published, against that other baseline.

### Ranking scores (Delta-wide, whole run, today's climate)

1 point per percentage point of days over the threshold against Business as Usual,
±5 at five points or more. Scores also exist by region and season.

| Activity (entity)   | Salinity threshold | Salinity BAU · ECO · NGW · B&F · COR · TUN | Temperature threshold    | Temperature |
| ------------------- | ------------------ | ------------------------------------------ | ------------------------ | ----------- |
| Day use & boating   | 1,000 µS/cm        | 0 · 0 · 0 · 0 · 0 · 0                      | 19 °C (algal bloom risk) | all 0       |
| Birding             | 2,640 µS/cm        | 0 · −1 · −1 · 0 · 0 · −1                   | > 20 °C                  | all 0       |
| Waterfowl hunting   | 3,600 µS/cm        | 0 · −1 · −1 · 0 · 0 · 0                    | 23 °C                    | all 0       |
| Angling             | 9,130 µS/cm        | 0 · −2 · −2 · 0 · 0 · 0                    | 18.4 / 22.3 °C           | all 0       |
| Day use, cold water | —                  | —                                          | < 18 °C                  | all 0       |

Not ranked: days over the threshold (the % scores are read from), overall and
seasonal use (report), restoration acres, recreation economy. The scored workbook
merges day use and boating; the report and slides treat them separately.

Habitat restoration (C) and recreation economy (D) are scored apart from the
criterion (Recreation The Score.xlsx, table 3): restoration added on top of Business
as Usual's protected areas scores Eco Machine +5 and New Green Watershed +5 at every
bound, on both. Business as Usual, Bolster & Fortify, Calling on Reserves and A
Tunnel restore nothing and are 0 (scoring email, 22 Oct).

Restored acres beneath it, from the "Overall Restoration (Acres)" sheet (New Green
Watershed at its middle, 50%, bound; Business as Usual as existing protected areas).
Upland is not shown: it lies outside the Delta, so Delta-wide is the sum of the four
regions rather than the sheet's totals, which add it. Bolster & Fortify, Calling on
Reserves and A Tunnel read N/A:

| Scenario                  | Suisun | Central | North   | South   |
| ------------------------- | ------ | ------- | ------- | ------- |
| Business as Usual         | 18,139 | 23,826  | 56,014  | 10,322  |
| Eco Machine               | 41,720 | 1,380   | NA      | NA      |
| New Green Watershed (50%) | 41,720 | 66,947  | 283,904 | 277,681 |

Recreation economy ("Overall $"): four services, $M a year (2025), each scored by the
team against Business as Usual at 1 point per 1%, capped at ±5. Business as Usual is
existing protected land (CPAD). New Green Watershed (50%) scores +5 Delta-wide (the
sheet's score, which counts upland) and in every region but North (0, where the sheet
carries existing protected land). Eco Machine is Delta-wide only: Business as Usual
plus what its restoration adds (amenity +$16.1M, biodiversity +$7.0M, hunting +$4.0M, fishing +$12.3M), +5 on every service.

| Service (activity)               | Suisun (NGW / BAU) | Central        | North           | South          |
| -------------------------------- | ------------------ | -------------- | --------------- | -------------- |
| Amenity/recreation (day use)     | $15.6M / $6.8M     | $15.7M / $8.9M | $20.9M / $20.9M | $23.1M / $3.8M |
| Biodiversity (birding)           | $6.8M / $2.9M      | $6.8M / $3.9M  | $9.1M / $9.1M   | $10.1M / $1.7M |
| Recreational hunting (waterfowl) | $3.9M / $1.7M      | $3.9M / $2.2M  | $5.2M / $5.2M   | $5.8M / $1.0M  |
| Recreational fishing (angling)   | $11.9M / $5.1M     | $12.0M / $6.7M | $15.9M / $15.9M | $17.6M / $2.9M |

Periods: whole run 1 Oct 2018 – 1 Dec 2020; wet season 1 Oct – 31 Mar (the workbook
lists Oct 2018–Mar 2019, Oct 2019–Mar 2020 and Oct–Dec 2020 but counts 365 days, which
leaves the last out); dry season 1 Apr – 30 Sep of 2019 and 2020 (366 days).

Regions: Delta-wide 32 points, Suisun Marsh 8, Central Delta 9, North Delta 6, South
Delta 9.

## Environmental Justice

### Ranking scores

| Score                                                       | Based on                                                                     | BAU | ECO | NGW | B&F | COR     | TUN     |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------- | --- | --- | --- | --- | ------- | ------- |
| **Criterion** (Oct slides: rounded mean of the three below) |                                                                              | 0   | 0   | +1  | 0   | pending | pending |
| Drinking water, whole run                                   | % of readings ≥ 1,050 µS/cm: 9 / 7 / 7 / 9 / 11 / 12; +1 per point           | 0   | +2  | +2  | 0   | −2      | −3      |
| Flood risk                                                  | Delta-wide qualitative judgement                                             | 0   | 0   | +3  | +2  | 0       | +1      |
| Water age + temperature                                     | Monthly ladder per hotspot area, averaged (slides one step below the report) | 0   | −2  | −3  | −1  | pending | pending |

The Sept report averaged five inputs (wet and dry season added): ECO +1, COR −1.

### Drinking water by vulnerability class (EJ's places)

| Class (points) | Whole run % (BAU · ECO · NGW · B&F · COR · TUN) | Whole run                  | Wet season                 | Dry season                 |
| -------------- | ----------------------------------------------- | -------------------------- | -------------------------- | -------------------------- |
| All 49 points  | 9 · 7 · 7 · 9 · 11 · 12                         | 0 · +2 · +2 · 0 · −2 · −3  | 0 · +2 · +2 · −1 · −4 · −5 | 0 · +1 · 0 · 0 · 0 · 0     |
| Moderate (10)  | 6 · 4 · 4 · 5 · 11 · 13                         | 0 · +2 · +2 · +1 · −5 · −5 | 0 · +4 · +4 · +2 · −5 · −5 | 0 · +2 · +1 · +1 · +2 · +2 |
| High (36)      | 10 · 8 · 8 · 10 · 11 · 13                       | 0 · +2 · +2 · 0 · −1 · −3  | 0 · +2 · +2 · −1 · −3 · −5 | 0 · +1 · +1 · 0 · 0 · 0    |
| Highest (3)    | 0% everywhere                                   | not published              |                            |                            |

### Water age: change in average water-age days against BAU (slide 39)

| Hotspot area                        | B&F  | ECO  | NGW  |
| ----------------------------------- | ---- | ---- | ---- |
| Suisun Marsh & surrounding wetlands | +0.1 | +7.9 | +8.0 |
| Franks Tract                        | +2.2 | +5.2 | +5.3 |
| South Delta                         | −0.5 | +0.3 | +0.4 |
| Lindsey – Cache Slough              | 0    | +0.4 | +3.9 |
| McCormack-Williamson Tract          | 0    | +0.5 | +0.6 |

Periods: drinking water whole run 1 Oct 2018 – 1 Dec 2020 (793 days); wet season
1 Oct – 31 Mar (427 days); dry season 1 Apr – 30 Sep (366 days). The SLR workbook uses
the whole run and water years 2019 and 2020. Water age covers the 13 months with water
≥ 19 °C: Oct 2018, May–Oct 2019, May–Oct 2020 (Calling on Reserves: 7). Flood risk has
no period.

## Economy

Source: "The Story Behind the Criterion: Economy" v16 (Cai and Medellín-Azuara, UC
Merced, 25 Oct 2026) and its workbook `JT_Economy_results_for_dataviz_v16.xlsx`. v16
supersedes the Sept report and the Oct slides for this team: Calling on Reserves and
A Tunnel were rerun by RMA (current climate 22 Oct, 2 ft SLR 25 Oct) and every
scenario now has a 2 ft sea-level-rise run.

### Ranking scores (gross revenue, jobs and value added share one score)

| Scenario                     | Dominant effect | Based on (dry year 2020, current climate)               | Score (current and 2 ft SLR)    |
| ---------------------------- | --------------- | ------------------------------------------------------- | ------------------------------- |
| Business as Usual            | baseline        | $1.107B direct revenue, 7,720 jobs, $671M value added   | 0                               |
| Calling on Reserves          | salinity        | +$2,900 (dry) / −$300 (wet), vs its own base run        | 0                               |
| Bolster & Fortify            | salinity        | −$10,200 (dry), mostly Central Delta                    | −1                              |
| A Tunnel                     | salinity        | −$27,000 (dry), ~80% Central Delta, vs its own base run | −1                              |
| Eco Machine                  | land use        | Land conversion: −$0.29M to −$1.15M/yr                  | 0                               |
| NGW 25% / 50% / 100% wetland | land use        | −$212.4M / −$282.5M / −$504.5M direct revenue per year  | −3 / −4 / −5 (app uses 50%: −4) |

Calling on Reserves and A Tunnel are compared with the RMA base run delivered with
them (BaseCalSim); against Business as Usual the results change by under $1,000/yr.
The report gives no step size: −$10,000 and −$27,000 are both −1, +$2,900 is 0.

### Salinity pathway, Delta-wide (all six scenarios)

Farm gross revenue change, $/yr, against the same reference in the same climate
(sheets DeltaWide_vs_BAU and COR_Tunnel_DeltaWide). Wet 2019 / dry 2020.

| Scenario            | Current climate | 2 ft SLR         |
| ------------------- | --------------- | ---------------- |
| Business as Usual   | 0 / 0           | 0 / 0            |
| Eco Machine         | −650 / +3,534   | −1,107 / +24,425 |
| New Green Watershed | −824 / +967     | −1,359 / +16,573 |
| Bolster & Fortify   | +26 / −10,167   | −4 / −27,133     |
| Calling on Reserves | −262 / +2,880   | −348 / +5,674    |
| A Tunnel            | +339 / −26,953  | −183 / −18,626   |

The table also carries total jobs and total value added for the same cells. Sea level
rise itself (each scenario against itself today) costs $55,000–$93,000/yr in the dry
year and under $1,700/yr in the wet year. The zone row is dry-year total value added
from the ByZone sheet; its SLR rows are given against today's reference and are
rebased here on the reference's own SLR row, so the zones sum to the Delta-wide value.

The workbook's figures are first-order (yield change × OpenAg baseline revenue, then
IMPLAN ratios), not a new OpenAg run; a full OpenAg run gives 1.3–1.8× these, which
changes no score.

Not ranked: direct vs total (regional ripple) effects, carbon offsets (7–11% of the
loss), construction (about $0.85–2.1B one-time), farmland salinity (acre-weighted
EC, acres above 700 and 1,000 µS/cm), applied water use and land-use change
(narrative).

Periods: salinity effects are annual results for WY 2019 (wet) and WY 2020 (dry); land
conversion is annualised (2024 dollars) with no year and is the same with SLR.
Regions: Delta-wide and four zones (North, Central, South, West Delta); Suisun Marsh
only within Eco Machine.

Entities: the results do not break down by land use; land use is a model input. The
breakdowns that exist are zones (a place), OpenAg regions (workbook ByRegion), the
three NGW versions and direct vs total.

## Eco-cultural

| Score                                     | Based on                                                                                                | BAU | ECO | NGW | B&F | COR | TUN |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
| **Overall** (one score for the criterion) | Restoration acres + flow + qualitative                                                                  | 0   | +2  | +4  | 0   | +1  | −2  |
| Restoration (slide 55)                    | Restored acres. ECO: Suisun 41,720 + Franks Tract 1,380. NGW: 248,815 in-Delta + upper-watershed ranges | 0   | +2  | +5  | 0   | 0   | 0   |

Not ranked: land access, Indigenous science / TEK, sovereignty & governance
(narrative). No time dimension; space is in-Delta vs upper watershed. Possible
entities: restored acres by habitat type (tidal wetland, managed wetland, wet-soil
agriculture; forests, meadows, floodplains), none scored.

## Tiered outflow runs (breakout table's outflow tab, `breakout/model/outflowModel.ts`)

SCHISM runs 15 (Historic Baseline), 16 (+30% outflow) and 17 (−10% outflow), Oct 2020 –
Jan 2022. Every score is −5…+5 against the Historic Baseline (0), never against
Business as Usual, so they are a separate set and never ranked with the adaptations.

| Team         | Criterion score (+30% / −10%) | Source                                                                                                                                |
| ------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Ecology      | forthcoming                   | Report Tables 2–6: suitable days for 5 species by region, no rank; "Overall rankings" is still a to-do                                |
| Recreation   | forthcoming                   | Workbooks `Tiered Outflows {Salinity,Temperature} Analyzed.xlsx` (26 Oct): every activity's score and days; report's ranking is empty |
| Env. Justice | +4 / −2                       | Report: drinking water only (flood and water age not assessed); −1 in every cut but stated −1.5 → −2                                  |
| Economy      | forthcoming                   | Report: "Tiered Outflows modeled from SCHISM: (not shown in the present analysis)"                                                    |
| Eco-cultural | +3 / −2                       | Report: one overall score; restoration not applicable                                                                                 |

Recreation's activity data are regenerated with `python -I scripts/build-recreation-outflow.py
"research/criteria-stories/Recreation/data-2026-10-26"`. Landscape, food webs, restoration,
recreation economy, flood risk and water age are N/A: the runs change flow only.

## Discrepancies found

1. Ecology species work covers Feb 1 – Jun 1, not whole water years; there is no whole run.
2. EJ methods say 11 moderate points; the list and tables have 10 (10 + 36 + 3 = 49).
3. Recreation's wet season lists Oct–Dec 2020 but counts 365 days, leaving it out.
4. Ecology Table 16: Bolster & Fortify largemouth bass 2019 reads 71.16%; the regional table implies 72.16% (equal to BAU).
5. Eco-cultural report: score table (ECO +2, COR +1) and rank grid (ECO +1, COR 0) disagree; slide 62 confirms the score table.
6. EJ water age: report −2 / −1 / 0 (NGW / ECO / B&F); slides −3 / −2 / −1. The app follows the slides.
7. Recreation report writes the waterfowl threshold as "3.6–10.1 µS/cm" (evidently mS/cm); slides say 3,600 µS/cm.
8. Economy: one NGW value is needed per scenario; the app uses the 50% version (−4). The salinity baseline is 7,720 direct / 11,860 total jobs, the NGW land-use run 7,650 / 11,814; v16 does not reconcile them.
9. EJ outflow: −10% scores −1 for the whole run, wet and dry seasons, yet the table's average reads −1.5 and the overall −2. The app uses the stated −2.
10. EJ outflow wet season, high vulnerability: 11% vs 27% (16 points less) maps to +4 on its own scale, but the report assigns +5. The app uses +5.
