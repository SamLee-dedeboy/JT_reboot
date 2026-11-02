# Rankings reference

What each team scores, what each score rests on, and what is still open. Rewritten
2 Nov 2026 from the ranking table workbooks the teams filled in, and read back from
the data the site uses, so these numbers are the site's numbers.

| Team                  | Source of the current values                                                               |
| --------------------- | ------------------------------------------------------------------------------------------ |
| Ecology               | `Ranking Table (5).xlsx`, Ecology tab; same as (2) and (4)                                 |
| Recreation            | `Ranking Table (6).xlsx`, Recreation tab, and `Restoration Scenarios NGW and ECO (2).xlsx` |
| Environmental Justice | `Ranking Table (5).xlsx`, Env Justice tab                                                  |
| Economy               | `Ranking Table (5).xlsx`, Economy tab, and the v16 report and workbook (25 Oct 2026)       |
| Eco-cultural          | `Ranking Table (5).xlsx`, Eco-cultural tab                                                 |

Tabs in other copies of the workbook are out of date: the Recreation tab in (5) is
old, and every tab except Recreation in (3) and (6) is old. Each workbook has values
the team wrote as their own numbers, but the breakout table
(`src/features/scenarios/ranking/breakout/`) shows **the difference from Business as
Usual**. The acres on the Food webs rows are the exception: they show the sheet's number with a plus sign, so managed wetland reads +5,100 and +120,814.
Scores run −5 to +5, with Business as Usual at 0.

Calling on Reserves and A Tunnel are read against their own CalSim baseline, not the
Business as Usual run, except where noted.

## Overall ranking

The by-scenario page averages the five team scores (`data.ts`). A `*` is our placeholder, not a team score. Equal weights:

| Rank | Scenario            | Ecology | Recreation | Env. Justice | Economy | Eco-cultural | Average |
| ---- | ------------------- | ------- | ---------- | ------------ | ------- | ------------ | ------- |
| 1    | New Green Watershed | +3.1    | 0          | +1           | −4      | +4           | +0.82   |
| 2    | Eco Machine         | +1.33   | 0          | 0            | 0       | +2           | +0.67   |
| 3    | Calling on Reserves | −0.33   | 0          | 0*           | 0       | +1           | +0.13   |
| 4    | Business as Usual   | 0       | 0          | 0            | 0       | 0            | +0.00   |
| 5    | Bolster & Fortify   | 0       | 0          | 0            | −1      | 0            | −0.20   |
| 6    | A Tunnel            | +0.33   | 0          | +0.5*        | −1      | −2           | −0.43   |

Environmental Justice has no published criterion score, so its whole column is ours:
Eco Machine 0, New Green Watershed +1 and Bolster & Fortify 0 are carried from the
earlier average, and Calling on Reserves 0 and A Tunnel +0.5 are the means of the two
metrics they have. The site rounds +0.5 to +1 where it shows whole points.

## Ecology

Published criterion score, Delta-wide. Species suitability is the team's own score too. How the three metrics combine is not published.

| Score                               | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ----------------------------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| **Ecology score**                   | +1.33       | +3.1                | 0                 | −0.33               | +0.33    |
| **Ecology score**, sea level rise   | +1.7        | +3.8                | 0                 | −0.7                | −0.3     |
| Landscape                           | +3          | +5                  | 0                 | 0                   | 0        |
| Landscape, sea level rise           | +3          | +5                  | 0                 | 0                   | 0        |
| Food webs                           | +1          | +4                  | 0                 | 0                   | 0        |
| Food webs, sea level rise           | +1          | +4                  | 0                 | 0                   | 0        |
| Species suitability                 | +0.34       | −0.08               | +0.08             | −1.57               | +1.1     |
| Species suitability, sea level rise | +1.1        | +1.5                | +0.39             | −2.82               | −1.07    |

Increased Delta outflow: Landscape and Food webs are N/A; the other two are forthcoming. Landscape and Food webs are the same under sea level rise.

### Acres behind Landscape and Food webs

As the sheet gives them, with Business as Usual alongside. The Food webs rows on the site show these numbers with a plus sign, not a difference from Business as Usual. Scenarios with no change therefore still read +5,100 and +17,178.

| Acres                            | Business as Usual | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| -------------------------------- | ----------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| Added wetland (both metrics)     | 0                 | 53,000      | 80,000              | 0                 | 0                   | 0        |
| Managed wetland (Food webs)      | 5,100             | 5,100       | 120,814             | 5,100             | 5,100               | 5,100    |
| Wet-soil agriculture (Food webs) | 17,178            | 17,178      | 128,001             | 17,178            | 17,178              | 17,178   |

Food webs proxy from the Sept report: (managed wetland − 5,100) × 0.2 + added tidal
wetland × 0.4 + (wet-soil agriculture − 17,178) × 0.1. New Green Watershed is its 50/50
version. Its report line writes the wet-soil term as a subtraction but gives the sum;
subtracting gives 66,225 rather than 69,661, which probably leaves the +4 unchanged.

### Species: Delta-wide proportion of suitable days, with the rank

Wet Year is water year 2019 and Dry Year 2020, each 1 Feb – 1 Jun. Ranks are +1 per percentage point against the baseline, reversed for the three undesirable species. Calling on Reserves and A Tunnel come from the 27 Oct 2026 rerun against its New CalSIM Base, and their ranks are ours.

**Wet Year, current conditions**

| Species                  | Business as Usual | CalSIM base | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel  |
| ------------------------ | ----------------- | ----------- | ----------- | ------------------- | ----------------- | ------------------- | --------- |
| Longfin smelt, juvenile  | 5.3%              | 3.8%        | 6.0% (+1)   | 6.0% (+1)           | 5.3% (0)          | 3.6% (0)            | 3.9% (0)  |
| Longfin smelt, adult     | 13.3%             | 3.6%        | 13.3% (0)   | 13.2% (0)           | 13.3% (0)         | 3.6% (0)            | 3.7% (0)  |
| Chinook salmon, juvenile | 91.0%             | 90.6%       | 90.5% (0)   | 90.5% (0)           | 91.0% (0)         | 90.5% (0)           | 90.8% (0) |
| Striped bass, juvenile   | 67.5%             | 67.3%       | 67.4% (0)   | 67.4% (0)           | 67.5% (0)         | 67.3% (0)           | 67.3% (0) |
| Striped bass, adult      | 87.4%             | 85.8%       | 87.4% (0)   | 87.4% (0)           | 87.4% (0)         | 85.8% (0)           | 85.9% (0) |
| Largemouth bass          | 72.2%             | 90.8%       | 72.0% (0)   | 72.0% (0)           | 72.2% (0)         | 90.8% (0)           | 90.7% (0) |
| Overbite clam, juvenile  | 10.7%             | 3.6%        | 10.8% (0)   | 10.8% (0)           | 10.7% (0)         | 3.6% (0)            | 3.6% (0)  |
| Brazilian waterweed      | 72.5%             | 90.9%       | 72.3% (0)   | 72.3% (0)           | 72.5% (0)         | 90.9% (0)           | 90.8% (0) |

**Dry Year, current conditions**

| Species                  | Business as Usual | CalSIM base | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel   |
| ------------------------ | ----------------- | ----------- | ----------- | ------------------- | ----------------- | ------------------- | ---------- |
| Longfin smelt, juvenile  | 7.4%              | 9.3%        | 7.1% (0)    | 7.0% (0)            | 7.4% (0)          | 9.3% (0)            | 9.5% (0)   |
| Longfin smelt, adult     | 8.0%              | 2.8%        | 8.0% (0)    | 8.0% (0)            | 8.0% (0)          | 2.8% (0)            | 2.6% (0)   |
| Chinook salmon, juvenile | 75.9%             | 73.0%       | 75.5% (0)   | 75.5% (0)           | 75.9% (0)         | 73.0% (0)           | 72.7% (0)  |
| Striped bass, juvenile   | 86.7%             | 86.6%       | 86.5% (0)   | 86.5% (0)           | 86.7% (0)         | 86.6% (0)           | 86.6% (0)  |
| Striped bass, adult      | 96.5%             | 96.4%       | 96.2% (0)   | 96.2% (0)           | 96.6% (0)         | 96.5% (0)           | 96.5% (0)  |
| Largemouth bass          | 63.1%             | 79.3%       | 61.6% (+2)  | 61.6% (+2)          | 63.1% (0)         | 79.2% (0)           | 81.0% (−2) |
| Overbite clam, juvenile  | 13.4%             | 12.3%       | 14.3% (−1)  | 14.2% (−1)          | 13.4% (0)         | 12.3% (0)           | 10.5% (+2) |
| Brazilian waterweed      | 64.3%             | 79.9%       | 63.3% (+1)  | 63.3% (+1)          | 64.3% (0)         | 79.9% (0)           | 81.7% (−2) |

**Sea level rise, Delta-wide**, values only (no ranks; Calling on Reserves and A Tunnel have no Delta-wide value)

| Species                       | Business as Usual | Eco Machine | New Green Watershed | Bolster & Fortify |
| ----------------------------- | ----------------- | ----------- | ------------------- | ----------------- |
| Longfin smelt, juvenile, wet  | 4.8%              | 5.8%        | 5.8%                | 4.8%              |
| Longfin smelt, juvenile, dry  | 9.7%              | 9.0%        | 9.0%                | 9.7%              |
| Longfin smelt, adult, wet     | 3.8%              | 3.8%        | 3.8%                | 3.8%              |
| Longfin smelt, adult, dry     | 2.7%              | 2.7%        | 2.7%                | 2.7%              |
| Chinook salmon, juvenile, wet | 90.0%             | 89.8%       | 89.8%               | 89.9%             |
| Chinook salmon, juvenile, dry | 73.2%             | 73.1%       | 73.0%               | 73.2%             |
| Striped bass, juvenile, wet   | 67.0%             | 67.0%       | 67.0%               | 67.0%             |
| Striped bass, juvenile, dry   | 86.1%             | 86.3%       | 96.5%               | 86.1%             |
| Striped bass, adult, wet      | 85.7%             | 85.7%       | 85.7%               | 85.7%             |
| Striped bass, adult, dry      | 96.4%             | 96.5%       | 96.5%               | 96.4%             |
| Largemouth bass, wet          | 90.7%             | 90.5%       | 90.5%               | 90.7%             |
| Largemouth bass, dry          | 79.2%             | 76.5%       | 76.5%               | 79.2%             |
| Overbite clam, juvenile, wet  | 3.6%              | 3.7%        | 3.7%                | 3.6%              |
| Overbite clam, juvenile, dry  | 12.1%             | 13.5%       | 13.5%               | 12.1%             |
| Brazilian waterweed, wet      | 90.8%             | 90.8%       | 90.8%               | 90.8%             |
| Brazilian waterweed, dry      | 80.2%             | 78.9%       | 78.9%               | 80.2%             |

Regional values are in `drilldown/ecologyNiche.ts` and `drilldown/seaLevelRise.ts`. A
full check on 2 Nov 2026 compared them with the workbook: every Eco Machine, New Green
Watershed and Bolster & Fortify value matches for wet and dry years, and every
sea-level-rise value matches.

The table has no time period control. It reads what the sheet calls its whole period,
which equals the Wet Year figures. The map has a Wet Year and Dry Year toggle under
current conditions, shows species only, and covers Eco Machine, New Green Watershed
and Bolster & Fortify. With sea level rise a region has one number for both years, so the map has no toggle.

Places: Delta-wide, South Bay, Central Bay, San Pablo Bay, Suisun Bay (the sheet says
Suisun Marsh), Confluence, North Delta, Central Delta, South Delta. Conceptual models
are narrative and unscored. Under sea level rise, regional values cover the two years
together.

## Recreation

Published criterion score by place, the same under sea level rise. Regions: Suisun Marsh, Central, North and South Delta.

| Place         | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel | Increased Delta outflow |
| ------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- | ----------------------- |
| All together  | 0           | 0                   | 0                 | 0                   | 0        | +1                      |
| Suisun Marsh  | −2          | −2                  | 0                 | 0                   | 0        | +2                      |
| Central Delta | +1          | +1                  | 0                 | 0                   | 0        | +3                      |
| North Delta   | 0           | 0                   | 0                 | 0                   | 0        | 0                       |
| South Delta   | 0           | 0                   | 0                 | 0                   | 0        | 0                       |

The outflow +1 follows Caveat 5: all together averages the regions, (2 + 3 + 0 + 0) / 4 = 1.25, rounded by the team. Its raw values are in "Tiered Outflow sheets (Updated)", which we do not have.

### Metric scores, whole period, all together

| Score                               | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ----------------------------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| Salinity stress                     | −1          | −1                  | 0                 | 0                   | −0.25    |
| Salinity stress, sea level rise     | −0.5        | −0.5                | 0                 | +0.25               | −0.25    |
| Temperature stress                  | 0           | 0                   | 0                 | 0                   | 0        |
| Temperature stress, sea level rise  | 0           | 0                   | 0                 | 0                   | 0        |
| Habitat restoration                 | +3          | +5                  | 0                 | −1                  | −3       |
| Habitat restoration, sea level rise | +3          | +5                  | 0                 | −1                  | −3       |
| Recreation economy                  | +3          | +5                  | 0                 | −1                  | −3       |
| Recreation economy, sea level rise  | +3          | +5                  | 0                 | −1                  | −3       |
| Infrastructure impact (qualitative) | N/A         | N/A                 | −1                | 0                   | −3       |

Eco Machine +3 is the team's assigned score. Bolster & Fortify 0, Calling on Reserves
−1 and A Tunnel −3 are deduced, with no acres behind them (Caveat 1). The outflow runs
score salinity +4.5 and temperature 0; restoration and economy are N/A for them.

### Share of days past each activity's threshold, whole period, all together, current conditions

| Activity                         | Business as Usual | CalSim baseline | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel   |
| -------------------------------- | ----------------- | --------------- | ----------- | ------------------- | ----------------- | ------------------- | ---------- |
| Salinity: Day use and boating    | 27.7%             | 33.6%           | 27.6% (0)   | 27.6% (0)           | 27.9% (0)         | 33.1% (0)           | 33.8% (0)  |
| Salinity: Birding                | 20.1%             | 26.1%           | 21.0% (−1)  | 21.0% (−1)          | 20.1% (0)         | 25.9% (0)           | 26.7% (−1) |
| Salinity: Waterfowl hunting      | 18.1%             | 24.3%           | 19.1% (−1)  | 19.1% (−1)          | 18.1% (0)         | 24.0% (0)           | 24.4% (0)  |
| Salinity: Angling                | 7.7%              | 15.8%           | 9.7% (−2)   | 9.7% (−2)           | 7.8% (0)          | 15.6% (0)           | 15.9% (0)  |
| Temperature: Day use and boating | 41.6%             | 40.8%           | 41.6% (0)   | 41.6% (0)           | 41.6% (0)         | 40.8% (0)           | 40.8% (0)  |
| Temperature: Birding             | 36.8%             | 36.0%           | 36.7% (0)   | 36.7% (0)           | 36.8% (0)         | 35.9% (0)           | 36.0% (0)  |
| Temperature: Waterfowl hunting   | 12.1%             | 11.5%           | 12.3% (0)   | 12.2% (0)           | 12.2% (0)         | 11.5% (0)           | 11.8% (0)  |
| Temperature: Angling             | 44.2%             | 43.3%           | 44.2% (0)   | 44.2% (0)           | 44.2% (0)         | 43.3% (0)           | 43.3% (0)  |
| Temperature: Cold-water day use  | 54.1%             | 54.7%           | 54.0% (0)   | 54.0% (0)           | 54.1% (0)         | 54.7% (0)           | 54.7% (0)  |

Periods: whole period 1 Oct 2018 – 1 Dec 2020, wet season 1 Oct – 31 Mar, dry season 1 Apr – 30 Sep.

### Restored acres and annual value of services

Restoration added on top of Business as Usual's protected land, so Business as Usual reads 0. New Green Watershed is the high-restoration version for acres and the medium version for dollars.

| Measure        | Eco Machine, all | Eco Machine, Suisun | Eco Machine, Central | Eco Machine, North | Eco Machine, South | New Green Watershed, all | New Green Watershed, Suisun | New Green Watershed, Central | New Green Watershed, North | New Green Watershed, South |
| -------------- | ---------------- | ------------------- | -------------------- | ------------------ | ------------------ | ------------------------ | --------------------------- | ---------------------------- | -------------------------- | -------------------------- |
| Restored acres | 43,100           | 41,720              | 1,380                | —                  | —                  | 458,948                  | 41,720                      | 32,692                       | 186,769                    | 197,767                    |

| Service, $/yr                                | Eco Machine, all | Eco Machine, Suisun | Eco Machine, Central | Eco Machine, North | Eco Machine, South | New Green Watershed, all | New Green Watershed, Suisun | New Green Watershed, Central | New Green Watershed, North | New Green Watershed, South |
| -------------------------------------------- | ---------------- | ------------------- | -------------------- | ------------------ | ------------------ | ------------------------ | --------------------------- | ---------------------------- | -------------------------- | -------------------------- |
| Amenity and recreation (day use and boating) | $16,126,624      | $15,612,588         | $514,036             | —                  | —                  | $75,351,071              | $15,612,588                 | $15,746,642                  | $20,864,682                | $23,127,159                |
| Biodiversity (birding)                       | $7,014,512       | $6,790,924          | $223,588             | —                  | —                  | $32,775,055              | $6,790,924                  | $6,849,233                   | $9,075,400                 | $10,059,498                |
| Recreational hunting (waterfowl)             | $4,031,548       | $3,903,042          | $128,506             | —                  | —                  | $18,837,263              | $3,903,042                  | $3,936,555                   | $5,216,031                 | $5,781,635                 |
| Recreational fishing (angling)               | $12,258,728      | $11,867,981         | $390,747             | —                  | —                  | $57,278,466              | $11,867,981                 | $11,969,883                  | $15,860,385                | $17,580,217                |

Each service scores +5 for both scenarios in the sheet, beneath a row that scores Eco Machine +3. The site uses the corrected $6,790,924 birding (Suisun) and $128,506 hunting (Franks Tract), where the sheet still has the typos.

## Environmental Justice

No criterion score yet: the row reads Forthcoming until the water-age re-run. Places are vulnerability classes.

**Drinking water, Whole period, Current conditions**: score, then share of readings ≥ 1,050 µS/cm

| Class         | Business as Usual | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ------------- | ----------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| All 49 points | 9%                | +2 (7%)     | +2 (7%)             | 0 (9%)            | 0 (11%)             | 0 (11%)  |
| Moderate (10) | 6%                | +2 (4%)     | +2 (4%)             | +1 (5%)           | 0 (11%)             | +1 (10%) |
| High (36)     | 10%               | +2 (8%)     | +2 (8%)             | 0 (10%)           | +1 (11%)            | −1 (13%) |
| Highest (3)   | 0%                | 0 (0%)      | 0 (0%)              | 0 (0%)            | 0 (0%)              | 0 (0%)   |

**Drinking water, Wet tab (water year 2019), Current conditions**: score, then share of readings ≥ 1,050 µS/cm

| Class         | Business as Usual | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ------------- | ----------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| All 49 points | 6%                | +1 (5%)     | +1 (5%)             | −1 (7%)           | 0 (10%)             | 0 (10%)  |
| Moderate (10) | 6%                | +3 (3%)     | +3 (3%)             | +1 (5%)           | 0 (14%)             | +3 (11%) |
| High (36)     | 7%                | +1 (6%)     | +1 (6%)             | −1 (8%)           | 0 (10%)             | −1 (11%) |
| Highest (3)   | 0%                | 0 (0%)      | 0 (0%)              | 0 (0%)            | 0 (0%)              | 0 (0%)   |

**Drinking water, Dry tab (water year 2020), Current conditions**: score, then share of readings ≥ 1,050 µS/cm

| Class         | Business as Usual | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ------------- | ----------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| All 49 points | 8%                | +1 (7%)     | +1 (7%)             | +1 (7%)           | +2 (7%)             | 0 (9%)   |
| Moderate (10) | 3%                | +1 (2%)     | +1 (2%)             | +1 (2%)           | +1 (2%)             | −1 (4%)  |
| High (36)     | 10%               | +2 (8%)     | +1 (9%)             | 0 (10%)           | +1 (10%)            | 0 (11%)  |
| Highest (3)   | 0%                | 0 (0%)      | 0 (0%)              | 0 (0%)            | 0 (0%)              | 0 (0%)   |

**Drinking water, Whole period, Sea level rise**: score, then share of readings ≥ 1,050 µS/cm

| Class         | Business as Usual | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ------------- | ----------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| All 49 points | 13%               | +2 (11%)    | +1 (12%)            | +1 (12%)          | +1 (14%)            | 0 (15%)  |
| Moderate (10) | 15%               | +4 (11%)    | +3 (12%)            | +5 (10%)          | +2 (16%)            | 0 (18%)  |
| High (36)     | 13%               | 0 (13%)     | 0 (13%)             | 0 (13%)           | 0 (15%)             | 0 (15%)  |
| Highest (3)   | 0%                | 0 (0%)      | 0 (0%)              | 0 (0%)            | 0 (0%)              | 0 (0%)   |

**Drinking water, Wet tab (water year 2019), Sea level rise**: score, then share of readings ≥ 1,050 µS/cm

| Class         | Business as Usual | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ------------- | ----------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| All 49 points | 11%               | +1 (10%)    | +1 (10%)            | +1 (10%)          | 0 (12%)             | −1 (13%) |
| Moderate (10) | 15%               | +4 (11%)    | +4 (11%)            | +4 (11%)          | 0 (17%)             | −1 (18%) |
| High (36)     | 10%               | 0 (10%)     | 0 (10%)             | −1 (11%)          | 0 (12%)             | −1 (13%) |
| Highest (3)   | 0%                | 0 (0%)      | 0 (0%)              | 0 (0%)            | 0 (0%)              | 0 (0%)   |

**Drinking water, Dry tab (water year 2020), Sea level rise**: score, then share of readings ≥ 1,050 µS/cm

| Class         | Business as Usual | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ------------- | ----------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| All 49 points | 11%               | +1 (10%)    | +1 (10%)            | +1 (10%)          | +2 (13%)            | +1 (14%) |
| Moderate (10) | 8%                | +3 (5%)     | +2 (6%)             | +3 (5%)           | +3 (10%)            | +1 (12%) |
| High (36)     | 13%               | +1 (12%)    | +1 (12%)            | 0 (13%)           | +1 (15%)            | +1 (15%) |
| Highest (3)   | 0%                | 0 (0%)      | 0 (0%)              | 0 (0%)            | 0 (0%)              | 0 (0%)   |

The sheet's new "wet" and "dry" tables are water years 2019 and 2020, not true seasons,
and we were asked to keep the wet and dry tabs. The values replaced the old seasonal ones
and the info card gives the months: Oct 2018 – Sep 2019 and Oct 2019 – Sep 2020.
The CalSim baseline is set to 0, so Calling on Reserves and A Tunnel show their own
share. Business as Usual's current-climate shares are worked back from the scores.

**Other metrics**

| Score                                                      | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ---------------------------------------------------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| Flood risk attenuation (arrows on the site)                | 0           | +3                  | +2                | 0                   | +1       |
| Water age + temperature (old slide values, re-run pending) | −2          | −3                  | −1                | —                   | —        |

Change in water age, days, against Business as Usual (slide 39):

| Hotspot area               | Eco Machine | New Green Watershed | Bolster & Fortify |
| -------------------------- | ----------- | ------------------- | ----------------- |
| Suisun Marsh               | +7.9        | +8                  | +0.1              |
| Franks Tract               | +5.2        | +5.3                | +2.2              |
| South Delta                | +0.3        | +0.4                | −0.5              |
| McCormack-Williamson Tract | +0.5        | +0.6                | 0                 |
| Lindsey-Cache Slough       | +0.4        | +3.9                | 0                 |

Increased Delta outflow: drinking water +4 (provisional) and a placeholder for the
criterion. Flood risk and water age are N/A for outflow. The reduced-outflow run keeps
its criterion score of −2.

## Economy

One published score shared by gross revenue, jobs and value added, the same under sea level rise. New Green Watershed uses its 50/50 version (−3 / −4 / −5 across 25%, 50%, 100% wetland).

| Score       | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ----------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| **Economy** | 0           | −4                  | −1                | 0                   | −1       |

Salinity effect across the Delta, $/yr, against the same reference in the same climate:

| Measure                            | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ---------------------------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| Gross revenue, wet                 | −650        | −824                | +26               | −262                | +339     |
| Gross revenue, wet, sea level rise | −1,107      | −1,359              | −4                | −348                | −183     |
| Gross revenue, dry                 | +3,534      | +967                | −10,167           | +2,880              | −26,953  |
| Gross revenue, dry, sea level rise | +24,425     | +16,573             | −27,133           | +5,674              | −18,626  |
| Value added, wet                   | −577        | −736                | +23               | −237                | +276     |
| Value added, wet, sea level rise   | −965        | −1,194              | −3                | −324                | −244     |
| Value added, dry                   | +4,236      | +1,911              | −8,056            | +2,665              | −23,990  |
| Value added, dry, sea level rise   | +26,196     | +19,052             | −20,933           | +5,361              | −15,870  |

Land conversion, New Green Watershed 50/50: −$282.5M a year in gross revenue, −4,121
jobs and −$141M in value added (Eco Machine is forthcoming; N/A elsewhere). The workbook's figures
are first-order, not a new OpenAg run; a full run gives 1.3–1.8 times these, which
changes no score. Calling on Reserves and A Tunnel are compared with their base run
(BaseCalSim). Economy has no results by land use or for outflow yet.

## Eco-cultural

One published score. Land access, Indigenous science and sovereignty are qualitative arrows and do not feed a number. Neither period nor sea level rise applies.

| Score                               | Eco Machine | New Green Watershed | Bolster & Fortify | Calling on Reserves | A Tunnel |
| ----------------------------------- | ----------- | ------------------- | ----------------- | ------------------- | -------- |
| **Eco-cultural**                    | +2          | +4                  | 0                 | +1                  | −2       |
| Habitat restoration                 | +2          | +5                  | 0                 | 0                   | 0        |
| Tribal land access (arrows)         | +1          | +4                  | 0                 | 0                   | 0        |
| Indigenous science and TEK (arrows) | +1          | +4                  | 0                 | 0                   | 0        |
| Tribal sovereignty (arrows)         | +1          | +4                  | 0                 | +2                  | 0        |

Restored acres, in-Delta: Eco Machine 43,100 tidal wetlands; New Green Watershed 102,982 managed wetlands and 145,833 wet-soil agriculture. Upper watershed, New Green Watershed: 48,213 wetlands, 11,586 meadows, 6,360 floodplains. Tidal wetland (New Green Watershed) and transitional habitat are not given.

## Tiered outflow runs

Under sea level rise, everything in the Increased Delta outflow column reads N/A, for every team.

SCHISM runs 15 (Historic Baseline), 16 (+30%) and 17 (−10%), Oct 2020 – Jan 2022, scored
against the Historic Baseline, never Business as Usual. So they are a separate set
and do not join the adaptation ranking.

| Team                  | +30%           | −10%        | Note                                                                         |
| --------------------- | -------------- | ----------- | ---------------------------------------------------------------------------- |
| Ecology               | forthcoming    | forthcoming | Suitable days by region reported; no scores. Landscape and Food webs are N/A |
| Recreation            | +1             | forthcoming | Salinity +4.5, temperature 0; restoration and economy are N/A                |
| Environmental Justice | +4 provisional | −2          | Drinking water only; the report states −2 although its table averages −1.5   |
| Economy               | forthcoming    | forthcoming | Not run                                                                      |
| Eco-cultural          | +3             | −2          | One overall score; restoration is N/A                                        |

## Open items

### Ecology

1. **Calling on Reserves and A Tunnel by region.** N/A on the site, because the team will not report
   these two scenarios by region. The sheet still holds regional values for them, which the site does not use.
2. **Whole-period table repeats the wet year.** For Eco Machine, New Green Watershed and Bolster
   & Fortify, every value in the sheet's whole-period table equals its Wet Year table, so it is
   not a real whole period. The table now reads these values, with no year named.
3. **Likely typos in that sheet.** Longfin smelt adult, Central Bay, wet: Eco Machine 0.012 beside
   0.564 and 0.560. Longfin smelt juvenile, San Pablo Bay, wet: Bolster & Fortify 0 beside 0.138 and
   0.139. The site carries these values too.
4. **Delta-wide with sea level rise.** The sheet leaves Calling on Reserves and A Tunnel blank for the
   species, so those cells read Forthcoming.
5. **Outflow.** No scores; the takeaway for it is blank.
6. **Place name.** The team says Suisun Marsh; the site's tab says Suisun Bay.
7. **Combining rule.** How the three metrics make the criterion score is not published.

### Recreation

1. **Possible swap.** Economy scores Bolster & Fortify 0 and Calling on Reserves −1, while infrastructure
   scores them −1 and 0. Caveat 2 says infrastructure affects only Bolster & Fortify and A Tunnel.
2. **Outflow +1.** It sits above salinity +4.5 and temperature 0, and "averages regions" doesn't
   explain those Delta-wide rows.
3. **Eco Machine +3.** On the site as told, with no public explanation, and the services beneath it
   score +5.
4. **Typos in their sheet.** Birding (Suisun) and hunting (Franks Tract), corrected on the site.
5. **New Green Watershed mismatch.** Acres from the high version, dollars from the medium. North Delta
   dollars equal the existing-land figure.
6. **Wording.** "About 1 degree" is unverified, the economy takeaway says "five activities" but lists
   four, and salinity says "four out of five".
7. **Sign-off.** Caveat 3 was reworded for the public, and the raw outflow sheets are not on file.

### Environmental Justice

1. **No final scores.** Criterion blank, water-age re-run pending, old slide values still showing;
   placeholders drive the overall ranking.
2. **Season labels.** The tabs say wet and dry season; the numbers are water years.
3. **Takeaways against the data.** Bolster & Fortify has wet and dry reversed; Eco Machine and New Green
   Watershed are "most in both years" although Calling on Reserves is +2 in the dry year; Bolster &
   Fortify is "the only scenario to decrease water age"; the Calling on Reserves and A Tunnel takeaways
   leave out water age.
4. **No caveats published.** Caveat 1 is a note to Yun-Hsin asking for a text document.
5. **Baseline side effect.** With the CalSim baseline at 0, those scenarios' share rows show values like
   +11% beside a score of 0, which reads as an increase.
6. **Inferred shares.** Business as Usual's current-climate shares come from the scores.
7. **Outflow.** Seasonal values are kept though the sheet says N/A under water years. Sea level rise shows
   "not run with SLR" where the sheet says N/A. The −10% run is not in the sheet.
8. **Our wording.** "Change in flood risk" is our row name, and arrows replace their written descriptions.

### Across the site

1. Recreation notes and definitions still cite the old +5/0 scores, old acres, 25/50/100% and the
   scoring email (`labels.ts`, `drilldown/tree.ts`).
2. The label `versionOnly: 'NGW only'` still uses an abbreviation (`labels.ts`).
3. Team scores sit in both `data.ts` and the breakout tree, so both must change together when a team
   updates a score. Recreation's had drifted apart until 2 Nov 2026.

## Source discrepancies

From reading the reports; none changes a score above.

1. Ecology Table 16: Bolster & Fortify largemouth bass 2019 reads 71.16%; the regional table implies 72.16%.
2. Environmental Justice methods say 11 moderate points; the lists and tables have 10 (10 + 36 + 3 = 49).
3. Recreation's wet season lists Oct–Dec 2020 but counts 365 days, leaving it out.
4. Recreation report writes the waterfowl threshold as "3.6–10.1 µS/cm" (evidently mS/cm); slides say 3,600 µS/cm.
5. Eco-cultural report: score table (Eco Machine +2, Calling on Reserves +1) and rank grid (+1, 0) disagree; slide 62 confirms the score table.
6. Environmental Justice water age: report −2 / −1 / 0 (New Green Watershed / Eco Machine / Bolster & Fortify); slides −3 / −2 / −1. The site follows the slides.
7. Environmental Justice outflow, wet season, high vulnerability: 16 points less maps to +4, but the report assigns +5. The site uses +5.
8. Economy: the salinity baseline is 7,720 direct / 11,860 total jobs, the land-use run 7,650 / 11,814; v16 does not reconcile them.
