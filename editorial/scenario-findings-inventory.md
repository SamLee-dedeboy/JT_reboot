# Scenario findings map — candidate inventory

Candidates for a per-scenario "points of interest" map: each pin is a **place** and **what a team's
metric measured there** under that scenario. No scores, no rankings.

Revised 2026-11-18. Pins now **lead with the ranking takeaways** in
`src/features/scenario-ranking/data/` (each team's "Criterion takeaway" points and its per-scenario
takeaway card), and every team appears in every scenario. The teams' "Story Behind the Criterion"
reports in `docs/team-documents/` are used only to say *where* a takeaway happens, or as a marked
extra.

## How to read this

**Balance rule.** In every scenario, each of the five teams gets exactly one **lead** entry, taken
from its scenario takeaway:

- `PIN`: the takeaway names a place, so it goes on the map.
- `TRAY`: the takeaway is Delta-wide, off the map, or "no change", so it goes in a side tray beside
  the map. A team never just disappears from a scenario.

A team may add **one** `second` pin, only when its takeaway (lead, a point under it, or a criterion
takeaway) names a second place. `extra` lines come from the reports only, not the ranking. They're
here for reference and aren't recommended.

**Place kinds:** `point` (Franks Tract), `region` (Suisun Marsh, Central Delta), `footprint` (the
scenario's own works), `point set` (the 49 drinking-water systems), `pair` (two linked places that
show a shift from one to the other), `off-map` (upper watershed, Shasta).

**Source tags:** `[R lead]` is the ranking takeaway's first sentence, `[R point: label]` a point
under it, `[R criterion]` a team's criterion takeaway, `[R note]` a row or caveat note in the
ranking file, and `[report]` the team's report.

## Where the ranking and the reports disagree (ranking wins)

- **Environmental Justice, drinking water, Calling on Reserves and A Tunnel.** The report has
  both worse than Business as Usual; the ranking says Calling on Reserves does better in a dry year
  and A Tunnel doesn't differ. The ranking compares these two with CalSim's Business as Usual (the
  `csbau` entry), which is probably why.
- **Ecology, Calling on Reserves.** The report has the Confluence and North Delta more often
  suitable for Chinook; the ranking says it had fewer suitable points for longfin smelt and salmon in
  2019. I've left the report's line out.
- **Economy, Eco Machine.** The ranking's figures (≈43,120 acres, ≈$0.9M/yr, ≈10 jobs, ≈$1.3B
  construction, ≈$4.7M/yr credits) replace the report's older ones.

## What the criterion takeaways say the map should show

- **Ecology:** the middle of the estuary (Confluence, Suisun, San Pablo Bay) changes most;
  invasives and clams trade off; landscape conversion and new habitat matter most.
- **Environmental Justice:** **Franks Tract and Suisun Marsh** see the largest rises in water age;
  flood benefit is largest when a scenario covers the whole Delta. Its place note says it reports by
  *community vulnerability, not region*, so drinking-water pins should be the community points,
  colored by vulnerability.
- **Economy:** converting farmland to wetland is what matters; salinity changes are tiny next to a
  $1.1B farm economy.
- **Recreation:** the overall score hides **recreation moving from one region to another**, so
  `pair` pins (saltier here, fresher there) suit it.
- **Eco-cultural:** about who was included (Tribes, Traditional Ecological Knowledge) and the
  magnitude of restoration; no places.

---

## Eco Machine

| Team | Kind | Entry |
|---|---|---|
| Ecology | PIN | ★ **Franks Tract**: higher salinity in Franks Tract means **fewer suitable days for the freshwater invasives Brazilian waterweed and largemouth bass**, but more for overbite clams. `[R lead]` (the change shows in the Central Delta, 2019 `[report]`) |
| Environmental Justice | PIN | ★ **49 drinking-water systems**: the **largest drop in days over the drinking-water salinity threshold** (tied with New Green Watershed), in wet and dry years and over the whole run. `[R lead]` (9% → 7% of days `[report]`) |
| Economy | PIN | ★ **Suisun Marsh + Franks Tract**: about 43,120 acres of tidal marsh restored, but **almost none of it is farmed**: about $0.9M/yr of farm revenue and about 10 jobs. The main cost is construction, about $1.3B one time. `[R lead, R points]` |
| Recreation | PIN · pair | ★ **Central Delta → Suisun Marsh**: salinity **moves out of the Central Delta and into Suisun Marsh**; Suisun crosses the highest angling threshold (9,130 µS/cm) more often, affecting every activity there. `[R lead, R point: Angling]` |
| Eco-cultural | TRAY | ★ Second only to New Green Watershed, because it restores less; the same opportunities for Tribes to gather culturally important material and to gather as a community. `[R lead, R point]` |

**Second pins**
- [ ] Environmental Justice · **Franks Tract and Suisun Marsh**: water age rises in the restored
  areas, which makes conditions suitable for harmful algal blooms but doesn't mean blooms will form.
  `[R point: Water age; R criterion]`
- [ ] Ecology · **Confluence**: more suitable days for juvenile longfin smelt. `[R point: Longfin
  smelt]` (place from `[report]`, which mentions longer streaks there)
- [ ] Economy · **Franks Tract**: benefits not counted in the score, such as better water quality for
  exports from the Franks Tract redesign, and new habitat. `[R point: Not counted]`

**Tray lines** (no pin): Environmental Justice: no change in flood risk `[R point]`. Ecology:
habitat and food webs improve, but less than New Green Watershed `[R point]`. Economy: fresher
irrigation water adds about $3,500/yr in a dry year `[R point]`.

**Extras (report only):** Bethel Island: about half its jobs depend on boating and bass fishing in
Franks Tract; Suisun Marsh duck clubs lose hunting, which isn't measured.

---

## New Green Watershed

| Team | Kind | Entry |
|---|---|---|
| Ecology | PIN | ★ **Converted Delta islands**: species effects match Eco Machine, but **food-web contributions are much higher** because of the added managed wetland and wet-soil farming. `[R lead]` |
| Environmental Justice | PIN | ★ **Upper watershed** (off-map, edge marker): **the largest drop in flood risk of any scenario**, from restoration upstream that holds water back before it reaches the Delta. `[R point: Flood risk; R criterion]` |
| Economy | PIN | ★ **Converted Delta islands**: **the largest economic cost** of the scenarios, because farmland leaves production. Direct farm revenue falls 19–46% and total jobs 31–43%, depending on how much becomes wetland (at 50% wetland: −25.5% revenue, −34.2% jobs). `[R lead, R points]` |
| Recreation | PIN | ★ **Suisun Marsh**: **practically the same as Eco Machine**, with slightly more summer threshold days for birding at Suisun. `[R lead]` |
| Eco-cultural | TRAY | ★ **Performs best** of the adaptation scenarios because of how much it restores; restoration gives Tribes places to gather culturally important material and to gather as a community. `[R lead, R point]` |

**Second pins**
- [ ] Environmental Justice · **49 drinking-water systems**: the largest drop in days over the
  threshold (tied with Eco Machine). `[R lead]` If picked, it competes with the flood pin as lead;
  choose one.
- [ ] Environmental Justice · **Franks Tract and Suisun Marsh**: water age rises in many restored
  areas. `[R point: Water age; R criterion]`
- [ ] Ecology · **Lindsey–Cache Slough**: a larger area of habitat species can reach. `[R point:
  Habitat]` (place from `[report]`: about 27,000 acres restored in a known fish and food-web hotspot)
- [ ] Economy · **Converted Delta islands**: converting to rice instead of wetland keeps more revenue
  but fewer jobs; carbon credits replace about 8–12% of lost revenue; construction is about
  $1.6–1.9B. `[R points]` (Could sit on the same pin's card instead.)

**Tray lines:** Recreation: with sea-level rise, salinity eases in Suisun and birding improves in the
Central Delta `[R point]`. Economy: subsidence reversal, lower levee and flood costs, and habitat
aren't counted `[R point]`.

---

## Bolster & Fortify

| Team | Kind | Entry |
|---|---|---|
| Ecology | TRAY | ★ **No differences** from Business as Usual. `[R lead]` |
| Environmental Justice | PIN | ★ **Freshwater corridor**: **flood risk falls only along the corridor**, not across the Delta. `[R point: Flood risk]` |
| Economy | PIN | ★ **Central Delta**: affects farming only through salinity: in a dry year, slightly saltier irrigation water, mostly in the Central Delta, about −$10,000/yr (−$27,000 with 2 ft sea-level rise). `[R lead, R point]` Card must say this is under 0.003% of farm revenue. |
| Recreation | TRAY | ★ **Very similar** to Business as Usual for salinity and temperature. `[R lead]` |
| Eco-cultural | TRAY | No restoration; no change. *(No ranking takeaway for this scenario; wording from `[report]`. Needs a line from the team.)* |

**Second pins**
- [ ] ★ Environmental Justice · **South Delta → Franks Tract** (pair): along the corridor, water age
  falls slightly in the South Delta in some months but rises in Franks Tract. `[R point: Water age]`
  Recommended: it's this scenario's clearest map story.
- [ ] Recreation · **Franks Tract**: the team expects salinity gates around Franks Tract to block
  boaters' access during dry periods. `[R note: infrastructure impacts]` This is the team's judgement,
  not modeled. Upgrade it to the lead if you want Recreation on the map here.

**Tray lines:** Environmental Justice: drinking water unchanged over the whole run; slightly fewer
exceedances in a wet year, slightly more in a dry year `[R point]`.

---

## Calling on Reserves

| Team | Kind | Entry |
|---|---|---|
| Ecology | TRAY | ★ **Only small differences** from baseline: in 2019, fewer suitable points for longfin smelt and salmon; in 2020, slightly fewer for freshwater invasives and slightly more for overbite clams. `[R lead, R points]` |
| Environmental Justice | PIN | ★ **49 drinking-water systems**: no change over the whole run or the wet year, but **fewer exceedances than Business as Usual in a dry year**. `[R lead]` |
| Economy | PIN | ★ **Western islands**: irrigation salinity and farm income **stay about where they are**; in a dry year, slightly fresher water on some western islands, a gain of a few thousand dollars a year. `[R lead, R point]` (Sherman, Bradford, Hotchkiss, Holland `[report]`) |
| Recreation | PIN | ★ **Central Delta**: **better than Business as Usual for salinity**, most of all for winter day use in the Central Delta. `[R lead]` |
| Eco-cultural | TRAY | Holding flows upstream for fish: a slight positive. *(No ranking takeaway for this scenario; wording from `[report]`. Needs a line from the team.)* |

**Second pins:** none named in the takeaways.

**Tray lines:** Environmental Justice: no change in flood risk `[R point]`. Shasta and upstream
reservoirs could be an off-map marker for the scenario itself.

**Extras (report only):** Lindsey–Cache Slough water age rises sharply in some 2019 months
(Environmental Justice table). Not in the ranking takeaway; leave out unless the team wants it.

---

## A Tunnel

| Team | Kind | Entry |
|---|---|---|
| Ecology | TRAY | ★ **Affects the most species** of any scenario: in 2020, fewer suitable points for juvenile longfin smelt and overbite clams, more for Brazilian waterweed and largemouth bass; mixed effects on Chinook salmon. No food-web estimate. `[R lead, R points]` |
| Environmental Justice | PIN | ★ **North Delta intakes**: **a slight drop in flood risk**, assuming the two northern intakes capture stormwater before it reaches the Delta. `[R point: Flood risk]` |
| Economy | PIN · pair | ★ **Western islands → central islands**: **dry-year salt shifts from the western to the central Delta**; saltier on Rindge Tract, Roberts Island, McDonald Island and Jones Tract, fresher on western islands; farm revenue about −$27,000/yr (−$19,000 with sea-level rise). `[R lead, R point]` |
| Recreation | PIN | ★ **Suisun Marsh and Central Delta**: **the only scenario that pushes more salinity** into both. `[R lead]` |
| Eco-cultural | TRAY | A "double hit": the landscape change, and taking more water in winter. *(No ranking takeaway for this scenario; wording from `[report]`. Needs a line from the team.)* |

**Second pins:** none named in the takeaways.

**Tray lines:** Environmental Justice: drinking-water exceedances **don't differ** from baseline
`[R lead]`. Recreation: warmer brooding-season conditions for waterfowl `[R point]`.

**Extras (report only):** South Delta boating and day use crossing thresholds in the wet season
(84%), and Delta towns' recreation economies. Both unverified; leave out.

---

## Increased Delta outflow (optional: the Tiered Outflows story page)

The ranking has takeaways for this run, so it can have its own map if the Tiered Outflows page
should get one.

| Team | Kind | Entry |
|---|---|---|
| Ecology | PIN | **Confluence and Suisun** get fresher: fewer suitable days for overbite clams, more for Brazilian waterweed and largemouth bass; juvenile longfin smelt gain in the Confluence and North Delta. *(No ranking scenario takeaway; from `[report]`, consistent with the criterion takeaway about the middle of the estuary.)* |
| Environmental Justice | PIN | ★ **49 drinking-water systems**: **the largest drop in exceedances of any scenario**. `[R lead; R criterion]` |
| Economy | PIN | ★ **Central Delta and Sherman Island**: **fresher irrigation water**, about +$20,000/yr in a dry year (a different model and year from the others). `[R lead, R points]` |
| Recreation | PIN · pair | ★ **Central Delta and Suisun**: conditions improve, mainly through lower salinity where exceedances are most frequent; the North and South Delta are unchanged. `[R lead, R point]` |
| Eco-cultural | TRAY | ★ More flow lowers salinity, and people described flows as the "soul" of the rivers. `[R lead, R point]` |

---

## Balance check (lead entries)

| Scenario | Ecology | Environmental Justice | Economy | Recreation | Eco-cultural | Pins on map |
|---|---|---|---|---|---|---|
| Eco Machine | PIN | PIN | PIN | PIN | TRAY | 4 (+ up to 3 second) |
| New Green Watershed | PIN | PIN (off-map) | PIN | PIN | TRAY | 4 (+ up to 4 second) |
| Bolster & Fortify | TRAY | PIN | PIN | TRAY | TRAY | 2 (+ the EJ pair) |
| Calling on Reserves | TRAY | PIN | PIN | PIN | TRAY | 3 |
| A Tunnel | TRAY | PIN | PIN | PIN | TRAY | 3 |
| Increased Delta outflow | PIN | PIN | PIN | PIN | TRAY | 4 |

Every team has a lead entry in every scenario. The map has between 3 and about 7 pins per
scenario, so no scenario gets crowded. Where a team is in the tray, its own takeaway says the
effect is Delta-wide or "no change", and the tray says so in the team's words.

## Still open

1. **Eco-cultural** has no ranking takeaway for Bolster & Fortify, Calling on Reserves or A Tunnel;
   those three tray lines come from the report and need the team's wording.
2. **Environmental Justice drinking-water pins**: one pin for "the 49 systems", or the 49 points
   themselves, colored by vulnerability as the team's place note asks.
3. **New Green Watershed's lead for Environmental Justice**: flood risk (off-map) or drinking water
   (point set). Both are in the takeaway.
