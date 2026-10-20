# Rank visualization — working notes

Tracker for the internal rank-visualization page (`/pages/rank-visualization`).
Status: `[ ]` not started · `[~]` in progress · `[x]` done.

## Source material

Two sources in `research/criteria-stories/`, the second superseding the first:

1. Subteam reports ("The Story Behind the Criterion", **Sept 2026**) — `<subteam>/*.docx`
2. **`BDSC 2026 slides/`** — the Bay-Delta Science Conference deck, **Oct 2026**

Extracted numbers, provenance, what the slides changed and the remaining gaps:
**`research/criteria-stories/RANKINGS.md`**.

| Subteam                     | Author(s)                                                     | Has scenario scores? (Oct 2026)                              |
| --------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| Ecology                     | Lynette Williams, Elsie Platzer, John Durand                  | two metric ranks, no overall; species now ranked per species |
| Economy                     | Yu Cai, Josué Medellín-Azuara                                 | yes (−5…+5), A Tunnel pending                                |
| Recreation                  | Jeff Jenkins, Isaac Sanchez                                   | **results but no score** — % over threshold per activity     |
| EJ & vulnerable communities | Ashley N. DePew, Brett Milligan                               | yes (−5…+5); COR and A Tunnel now pending                    |
| Eco-cultural                | Ashley N. DePew, Ana Zepeda, Maggie Gallagher, Brett Milligan | yes (−5…+5), table conflict resolved                         |

Both are preliminary: the numbers move, the stories are settled.

### Oct 2026 update, applied

- [x] Recreation column re-derived from the slides' per-activity threshold percentages —
      **it flips sign**: Eco Machine and NGW now read marginally worse than today, not
      better. B&F 0, Eco Machine −1, NGW −1, COR −3, A Tunnel −3 (prose only).
- [x] EJ now averages three metrics instead of five; Eco Machine falls +1 → 0
- [x] EJ water age moved a step worse for everyone (B&F −1, Eco Machine −2, NGW −3)
- [x] EJ withdrew Calling on Reserves and A Tunnel — both now stand-ins (−1\*, −2\*)
- [x] Eco-cultural's table conflict settled in favour of the values already used
- [x] Eco-cultural upland restoration rebased (montane forests dropped)
- [x] Economy zone-level value added added to the tree; scores unchanged
- [x] Ecology scores unchanged; species metric is now ranked per species
- [x] Recreation now publishes a −5…+5 score per activity, region and season (Isaac's
      18 Oct 2026 workbooks); the criterion column is the mean of the four salinity
      activity scores: B&F 0, Eco Machine −1, NGW −1, COR −2.5, A Tunnel −4. Still
      ours at the criterion level; ask whether they want that mean or something else
- [ ] Ask EJ whether dropping the seasonal drinking-water scores was intended; it is the
      only reason Eco Machine moved
- [ ] Ecology's slide ranks use a Feb 1 – Jun 1 window; `ecologyNiche.ts` holds the
      report's whole-water-year cube. Get the spring-window data or label the mismatch
      in the UI
- [ ] Three sources still give three different managed-wetland acreages for NGW 50/50
      (85,523 · 102,982 · 120,814)

## 1. Subteam icons

- [x] One line-art icon per subteam on a shared 24px grid (`components/TeamIcon.tsx`):
      fish (ecology), sailboat (recreation), home + droplet (EJ, its drinking-water
      metric), wheat (economy), tule reeds at the waterline (eco-cultural)
- [x] Shown wherever a subteam is named: 1A ballots, 2A headers, 2B cards, legend
- [x] Eco-cultural icon stays on landscape/access, not ceremonial imagery
- [ ] Check the icons with the subteams — especially eco-cultural

## 2. Eco-cultural subteam

- [x] Fifth team in `data.ts`, with a stable `key` per team
- [x] Fifth palette color (violet `#b255b6`), checked against the other four and the
      score blue/orange; see the caveat in `theme/palette.ts`
- [x] Weights, presets and the "Eco-cultural first" lens now run on five teams
- [x] Layouts that assumed four columns (2A header, 2B cards, 2C grid) follow TEAMS

## 3. Real rankings from the reports

- [x] Extract each criterion's scores verbatim → `research/criteria-stories/RANKINGS.md`
- [x] Replace the illustrative scores in `data.ts`
- [x] Support "not scored yet" (`null`): shown as "—", left out of averages and spread
- [x] Provisional stand-ins fill today's gaps; see the table in RANKINGS.md
- [x] Keep tiered outflow runs out of the page (different increments, not comparable)
- [x] Recreation now carries provisional stand-ins inferred from its prose ordering,
      marked * and dashed on screen — replace when the subteam scores
- [x] Recreation stand-ins replaced with values derived from its own published numbers
- [x] A Tunnel now carries provisional values for Recreation, EJ and Economy (EJ's is the
      mean of its four reported metric scores; Economy's 0 follows its "negligible
      salinity effect" finding)
- [ ] Confirm A Tunnel's stand-ins, or wait for Economy's pending estimate
- [ ] Ecology: confirm the derivation (mean of its two 0–10 ranks, minus baseline 5)
      or ask the subteam for one overall score
- [x] Eco-cultural: Eco Machine 2 and Calling on Reserves 1 confirmed by the Oct 2026 slides
- [x] Economy: Calling on Reserves is 0 in the dry year, +1 in the wet; app uses 0
- [ ] NGW depends on sub-scenario (Economy −3/−4/−5; Ecology food web 9 vs 10) — app
      uses the 50/50 primary. Worth exposing the sub-scenarios instead?
- [ ] Ties: Calling on Reserves and BAU both sit at 0 under equal weights; rank order
      between them is arbitrary

## 4. Going deeper into each subteam's story

- [~] Understand the five narratives first (see "What each story is about" below)
- [ ] Decide what "deeper" means per subteam — the reports do not offer the same
      depth, so one drill-down pattern will not fit all five
- [~] Drill-down intent model (from the design conversation, 2026-10-02): four intents —
  scenario-driven, subteam-driven, metric-driven, entity-driven — switchable in any
  order. Assessment: they reduce to **two axes** (scenario; the criterion tree
  subteam → metric → entity), so "intent" = which axis is pinned while the other
  varies. Two primitives cover all four: **profile** (pin a scenario, vary criteria)
  and **comparison** (pin a criterion node at any depth, vary scenarios).
- [ ] Add **place/time as a third axis**, not a tree level — it cross-cuts every subteam
      and is the headline in at least three reports (Ecology: water year > scenario;
      Recreation: how late in the calendar stress lingers; EJ: wet vs dry). Blocker for
      entity-driven across subteams: the five geographies are different partitions
      (Ecology 8 estuarine regions · Recreation 4 recreation regions · EJ 5 regions +
      49 points in 3 vulnerability classes · Economy Delta-wide + 4 zones · Eco-cultural
      in-Delta vs upper watershed). A shared place selector needs a crosswalk that does
      not exist yet.
- [ ] Type the edges in the hierarchy — a drill-down step is not always "what is inside
      this number": _averages into_ (EJ's 3 metrics → score), _derived from_ (rank ←
      acreage), _identical to_ (Economy's 3 metrics carry one score), _beside, not
      inside_ (Ecology metric 1 vs its score), _not scored_ (Recreation; eco-cultural
      B–D). Labelling the edge turns the uneven depth into content instead of a gap.
- [ ] Stress-test any drill-down pattern on three cases, not five: EJ (only full
      scenario → metric → entity chain with values), Ecology (deepest data, disconnected
      from the score), Recreation (entities defined, no values at all).
- [x] Two designs built as step 4 on the page, both on the same selection state and the
      same criterion tree (`drilldown/`): **4a Three axes** puts place/time top-level with
      a third focus option; **4b Detail inside the view** keeps two focus options and
      moves place/time into a panel under the current criterion.
- [x] Criterion tree carries real report numbers at every level, including Ecology's
      8 species × 8 regions × 2 water years cube and EJ's 5 regions × 13 months water-age
      grid (`drilldown/ecologyNiche.ts`, `drilldown/ejWaterAge.ts`, both generated from
      the .docx tables)
- [x] Control panel rebuilt (Oct 2026 review): the old bar was five identical rows of
      pills, with no way to tell current state from navigation. Now: a **View** switcher
      named by what it produces, a **Now showing** readout (one sentence + the full
      scenario / criterion / slice coordinate with the pinned one marked), then controls
      split into **You are at** (path crumbs + Subteam › Metric › Measurement depth trail)
      and **Drill into** (where you can go next). Every control row states on its right
      whether it affects the current view; one that does nothing is greyed and says so.
      The "Any" pill is gone — a slice control now shows the facet the view actually
      resolved, so it can never disagree with the table. The panel then moved into a
      sticky left sidebar (340px) with the table beside it, so changing a control and
      seeing what it did no longer takes a scroll; "Drill into" became a vertical menu,
      and the layout stacks below `md`.
- [x] Subteam icons made consistent across the drill-down. One shared `TeamMark`
      (icon in the team's palette colour) now appears everywhere a subteam is named:
      sidebar menu, breadcrumb, the Now showing criterion chip, and every table block
      header — previously the icons stopped at the sidebar, so nothing tied "Ecology"
      on the left to the ECOLOGY block on the right. Rows carry the mark only where a
      block mixes subteams, so a column of siblings does not repeat one icon.
- [x] Provenance vocabulary cut from four labels to three: `reported` · `inferred` ·
      `not scored`, plus `pending` computed per cell. `derived` (arithmetic on published
      scores) and `stand-in` (a mapping nobody published) both told the reader the same
      thing — this is not the subteam's number — so they merged. Step 1's `*` now means
      the same thing, which adds it to Ecology's column: its score is the mean of two
      metric ranks, not a number Ecology publishes.
- [x] "Now showing" rewritten from a headline plus three labelled chips into one
      structured sentence ("Comparing ALL SIX SCENARIOS on SPECIES FUNDAMENTAL NICHES
      across DELTA-WIDE in 2019 · WET"). One grammar covers every view and every
      combination: verb + what varies + "on" the criterion + "across" the place + "in"
      the period, with clauses dropped when they do not apply. Chips could not say how
      the dimensions related to each other; a verb can. New `chartSentenceValue`
      typography token for the inline emphasis.
- [x] Metric names realigned to each subteam's Oct 2026 metrics slide, which renames
      several against the Sept report. Ecology: "Species fundamental niches" →
      **Species-specific modeling**, "Pelagic food web" → **Food webs**, "Accessible
      aquatic habitat" → **Landscape**, plus a new unscored **Conceptual models** metric
      that the slides declare and the report never had. Economy: → **Gross revenues /
      Jobs / Value added**. EJ: → **Salinity impacts to in-Delta drinking water**.
      Eco-cultural: A/B/C/D lettering dropped, full metric titles restored. Recreation
      was already on the slides' names. Old names kept in each node's note.
- [ ] Ecology's two slides disagree with each other: the metrics slide groups Landscape
      and Food webs as one metric ("Landscape and food web modeling"), the ranking slides
      rank them separately. The tree keeps them as two siblings, because the criterion
      score is the mean of the two ranks. Worth confirming with the subteam.
- [ ] Eco-cultural's full metric titles run to ~90 characters, which wraps hard in the
      340px sidebar and in the Now-showing sentence. Add short labels for the UI?
- [x] Swept the control panel programmatically rather than by hand: walked all 68
      criterion nodes × 3 views × every place/period combination (381 states in 4a) and
      asserted no state renders an unexplained empty table and no sentence is malformed.
      Four classes of bug came out of it, all fixed: 1. **Leaf dead ends** in the profile view — options that open nothing are now
      closed off, and when every option is closed the list is replaced by one line. 2. **Depth ladder over-promised** — it drew a Measurement step the profile view
      can never reach; it now shows only the levels a view can stand on. 3. **Unscored metrics rendered six identical empty rows** — now an explicit panel
      saying whether the metric was never scored or whether its numbers live one
      level down. 4. **Cross-geography contamination** — a selected slice carried into a subteam
      that does not share it, so upland habitats resolved at "In-Delta" (every row
      empty) and an eco-cultural acreage printed a raw water-age key, "in 2020-10".
      `effectiveSlice` now returns ANY for an axis a node is not cut along, never
      keeps a key from another subteam's geography, and prefers a facet the node
      actually holds data for.
- [x] **4c rebuilt (Oct 2026) against its actual purpose: navigate the tree of
      configurations and jump cheaply between subtrees.** An independent audit plus a
      trace of the app confirmed one root cause — 4c had a _current node_, and compared
      that node's children. Everything else followed from it: a lateral jump
      (Ecology › Food webs → EJ › Water age) cost 3 clicks through the root and tore
      the selection down at each step (3 of 3 → 5 of 5 → 3 of 3 → 2 of 2), the root
      crumb wiped the history you would use to get back, and two criteria from
      different subtrees could **never** share a table. The audit also counted ~70 live
      click targets in one sidebar column, four parallel narrations of one state, two
      concurrent path displays (spatial and temporal), and a `swap` control that existed
      only because the axis order came from `Object.keys`.
      **The fix was to delete the current node.** The selection is now a set of node ids
      from anywhere in the tree; the whole tree stays on screen with a filter that
      flattens it to matches. Gone: `nodeId`, `goTo`, `candidatesFor`, `crossLevel`,
      `history`, `rewind`, and four sidebar blocks (You are at, Drill into, Depth, How
      you got here). Axis order is now intentional (criterion takes the rows, since its
      labels are the long ones), so swap is a choice rather than a workaround.
      Lateral jump is now: type, tick. The two criteria coexist — "Comparing FOOD WEBS
      and WATER AGE + TEMPERATURE under all 6 scenarios" — which the old model could not
      express at all. ~330 lines lighter.
- [x] Two bugs the rebuild introduced, both found by the user within minutes:
      **Where and When did nothing.** `valueAt` called `resolve` directly where 4a/4b
      wrap it in `effectiveSlice`, so a criterion keyed by `region|year` never matched
      the unsliced lookup and every cell read as a dash — identical before and after
      picking a place, which is why it looked inert. Fixed, plus the slice controls now
      seed themselves with a facet the data resolves, so the control and the table can
      never disagree.
      **A ticked child sat at the bottom of the table**, detached from its subteam.
      Criteria are now stored in tree order and indented by how many of their ancestors
      are also ticked, so Species-specific modeling nests under Ecology. Subteam
      grouping headers are suppressed when a subteam is itself ticked — that row is
      the heading.
- [x] 4c won (16 Oct 2026). 4a and 4b removed, with `useDrill.ts` and the DrillBits
      pieces only they used. Step 4 is a single design now.
- [x] 4c redesigned to the 10 Oct geography notes: places are offered only while every
      ticked criterion belongs to one subteam (the row says why otherwise), and where
      that subteam has outlines (Ecology, Economy) several places are drawn as one map
      per scenario instead of taking a table axis. `subteams/regionKeys.ts` holds the
      shapefile-name → place-key map both modes share.
- [ ] EJ's three drinking-water classes are criterion nodes, not places, so 4c cannot
      map them; the by-subteam page does. Fold them into a place facet, or leave it.
- [ ] Then: design options for drilling into a subteam or a scenario
- [ ] Check what can be shown publicly (see eco-cultural note below)

### What each story is about

- **Ecology** — Water year beats scenario: 2019 vs 2020 differences dwarf anything the
  scenarios do, and most are statistically indistinguishable from BAU. The action is in
  the middle estuary (Confluence, Suisun, San Pablo); the Delta stays fresh, the Bay
  stays salty. Calling on Reserves is the interesting case: saltier mid-estuary helps
  anadromous fish _and_ the invasive overbite clam. Restoration wins on habitat and
  food web, but "we are limited in where it can happen".
  _Depth available:_ 8 species/life stages × 8 regions × 2 water years, plus streak
  lengths — by far the richest per-place data.
- **Recreation** — Recreation is the public-facing edge of water management, and what
  matters is how far into the calendar stress lingers. Engineering-led options (A Tunnel,
  Calling on Reserves) push salinity risk later into the year; simply adding water helps
  most. Bolster & Fortify "locks in current conditions... a scenario about stability,
  not improvement."
  _Depth available:_ five activities × thresholds × seasons, but **no scores yet**.
- **EJ & vulnerable communities** — Flow volume dwarfs every landscape or infrastructure
  fix: tiered outflow swings exceedance 8%→32% while every adaptation scenario sits in a
  7–12% band. The highest-vulnerability zone never exceeds the threshold; the burden lands
  in moderate and high zones. Green infrastructure wins on drinking water but loses on
  water age — the wetlands that freshen water also stagnate it.
  _Depth available:_ 49 drinking-water points by vulnerability class, wet/dry season,
  plus flood risk and water age by region and month.
- **Economy** — Two-part story: salinity is a non-story for the economy (at most a few
  hundred thousand dollars against ~$1.1B), land conversion is the whole story. NGW costs
  $212–505M/yr in farm revenue and 2,800–3,250 direct jobs; carbon offsets repay only
  7–10%. Framed as "the actual economic tradeoff that restoration entails".
  _Depth available:_ revenue/jobs/value-added, direct vs total, by Delta zone, by
  restoration intensity, wet vs dry year.
- **Eco-cultural** — Restoration scale and flow both carry cultural meaning; flows were
  described as the "soul" of the rivers. NGW leads on sheer restoration magnitude;
  A Tunnel is a "double hit" on landscape and flow. Only one of four metrics (restored
  acres) is quantifiable — access, TEK and sovereignty are described, not scored, and
  the access ladder (ownership > land trust > easement > MOU) is itself a finding.
  _Depth available:_ restoration acreage by habitat type and sub-scenario; the rest is
  qualitative by design.

### Care needed before anything eco-cultural goes public

- The report records Tribal requests for privacy and non-photography, and site selection
  for privacy. Do not map or identify specific cultural-practice sites.
- It endorses CARE principles and a commitment that Tribal participants review workshop
  notes about them. Workshop-derived content needs Tribal review before publishing.
- Its RANK grid reads as internal working notes ("needs to be flagged", "Lay out the
  assumptions to validate/justify the scoring") — pre-decisional, not publishable.

### What the two designs exposed

- **"Any" cannot mean "aggregate".** A node that only exists per region and water year
  has no Delta-wide number to show, so both designs fall back to the node's first facet
  and label it `(default)`. Worth deciding whether a real aggregate should be computed
  for those, or whether the fallback label is the honest answer.
- **Region is a place in one report and an entity in another.** 4a always treats it as a
  place; 4b always nests it. Ecology's 8 estuarine regions and EJ's 5 water-age regions
  read naturally either way, which is why the two designs diverge here.
- **Restoration intensity is a sub-scenario, not an entity.** Economy's Full/0.5/0.25 MW
  levels and eco-cultural's 27 upland combinations are finer _scenarios_. The tree files
  them under entity for now and says so in each node's note; a fourth axis may be needed.
- **Two reports count the same acreage differently.** Ecology gives New Green Watershed
  120,814 managed-wetland acres at the 50/50 sub-scenario and eco-cultural gives 102,982,
  but these are not rival readings: Ecology's is a total including the 5,100-acre baseline,
  eco-cultural's counts restored acres, and Economy's 85,523 splits a 207,004-acre farmland
  footprint rather than the 248,815 mapped Delta islands. Net of baseline a real gap of
  115,714 vs 102,982 survives. See research/criteria-stories/MEETING-QUESTIONS-2026-10-09.md.

## Open questions

- [ ] Scenario identity colors still use brand colors in 3A/3B; neutralize?
- [ ] Team palette choice resets on reload — should it persist?
- [ ] Should the tiered outflow runs get their own view? EJ and eco-cultural both score
      them, and for EJ they are the biggest effect in the whole criterion.
- [ ] Eco-cultural scoring is qualitative in places — how to show that next to modeled
      numbers without implying false precision?
- [ ] "A Tunnel" is the reports' name; the page previously said "Delta Tunnel".

## Decisions

- Scores use the site's Good/Unacceptable pair: brand blue above today, orange below.
- Team colors avoid the heavily used brand families (green, blue/teal/cyan, magenta).
- All prose for a step sits in one text block; charts carry only data labels.
- 2C (hybrid) and 3C (rank across lenses) are built but hidden.
- Only adaptation scenarios are on the page; tiered outflow runs are excluded.

## Parked: geography and narrative — 10 Oct 2026

- **Do not offer region comparison across subteams.** The five drew different boundaries,
  so a region in one criterion is not a region in another and putting them in one column
  would invent a comparison nobody made.
- **Within a criterion, regional comparison does make sense**, and a map would probably
  serve it better than a table. Ecology has 8 estuarine regions, EJ 5 water-age hotspots,
  Recreation 4, Economy 4 zones.
- **The boundaries are a story, not an inconvenience.** Checked against the Oct 2026
  slides: four of the five already state a rationale, and each is a different kind of
  reasoning.
  - Ecology — temperature similarity and known regional divisions, adapted from Pien et
    al. 2025 and Grimaldo et al. 2020.
  - Recreation — tidal geography, salinity and hydrology (Andrews et al. 2017), plus
    recreational access and roads (Delta Plan 2013) and landscape aesthetics (Olmsted
    1929).
  - EJ — the Delta Stewardship Council's 2020 sub-regional map, so administrative and
    socioeconomic.
  - Economy — water-agency boundaries (North, Central, South Delta Water Agencies) plus a
    West Delta section.
  - Eco-cultural — historic Tribal territories.

  So the rationales exist; what is missing is them being collected in one place and set
  side by side. Five ways of cutting the same estuary, each defensible, is a finding about
  how differently the criteria see the Delta.

- **Get the GIS maps from Yun-Hsin.**
- **Try a subteam- or metric-driven narrative in parallel with the scenario-driven one**,
  and let the reader choose which thread to follow rather than fixing the order.

## Region outlines vs data keys — 15 Oct 2026

The by-subteam map draws `subteam_regions.shp` (Yun-Hsin, Oct 2026) as a comparison
layer. Its names are **not** the keys the values sit under, so nothing is joined yet:

| Team         | Shapefile                                           | Data keys                                                       | Lines up                             |
| ------------ | --------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------ |
| Ecology      | Suisun Bay, Suisun Marsh, Confluence, Central, N, S | 8 `ECOLOGY_REGIONS` incl. South/Central/San Pablo Bay           | 5 of 8 (Marsh has no key)            |
| Recreation   | Suisun Bay, Confluence, North, South                | suisun, centralDelta, northDelta, southDelta (18 Oct workbooks) | 4 of 4 if Confluence = Central Delta |
| EJ           | Moderate, High, Highest                             | the three drinking-water classes                                | **all 3, exactly**                   |
| Economy      | North, Central, South Delta Water Agency            | north, central, south, west                                     | 3 of 4 (no West Delta)               |
| Eco-cultural | absent by design                                    | inDelta, upper                                                  | n/a                                  |

- [ ] Ask Yun-Hsin for: West Delta; EJ's 5 water-age hotspots; Ecology's three bay regions;
      and which shapefile name maps to which data key.
- [ ] Regenerate with `python3 scripts/build-subteam-regions.py` after the shapefile changes.

## Recreation data drop — 19 Oct 2026

Isaac Sanchez's "Activity Blind Data Recreation" (18 Oct): eight workbooks, copied to
`research/criteria-stories/Recreation/data-2026-10-18/` (untracked). Loaded into the
page via `scripts/build-recreation-thresholds.py` → `drilldown/recreationThresholds.ts`:

- **RMA Salinity**: per activity (day use & boating, birding, waterfowl, angling) a −5…+5
  score and the % of days over threshold, by region (Delta-wide, Suisun, Central, North,
  South) and period (whole run, wet, dry), all six scenarios including A Tunnel. In the
  tree as `rec-salinity` → activity → `…-days`.
- **RMA Temperature**: same shape, five activity rows (cold-water day use added), four
  scenarios; COR and A Tunnel pending. In the tree as `rec-temperature`, beside the score.
- **RMA SLR Salinity / Temperature**: loaded 19 Oct (same OVERALL layout, four scenarios,
  scored against the SLR Business as Usual); see the sea-level-rise section below.
- **Not loaded**: the tiered-outflow pair (excluded by decision).
- **Not loaded, under discussion**: "NGW – In Delta Land Uses" values ecosystem benefits
  per island in $/acre/yr for three restoration sub-scenarios. Jeff Jenkins (18 Oct)
  questions the Suisun Marsh figure (one total across categories, low for its acreage);
  Isaac flags a ~150-acre gap against BDSC slide 56 for Brett to rule on. Hold until
  the thread settles.
- [ ] Confirm the shapefile's "Confluence" is the workbook's Central Delta (nine stations,
      Pittsburg to Franks Tract). `subteams/regionKeys.ts` assumes it.
- [ ] `RecreationView` still draws the Oct slides' summer/winter activity table from its
      own hard-coded arrays; move it onto `rec-salinity-*` (whole run / wet / dry).
- [ ] Rerun the generator when Isaac sends the pending temperature runs or revised data.

## Sea level rise — 19 Oct 2026

The breakout table (`/pages/breakout/:team`) has a **Sea level** switch, Current / Sea
level rise. A node's SLR run lives on `node.slr` (values, and facets where they differ);
`inClimate()` in `drilldown/model.ts` swaps it in. A node without one reads "no SLR
result"; a scenario missing from a node's run reads "not run with SLR". Differences are
read against the SLR run's own Business as Usual
("Base SLR"). Calling on Reserves and A Tunnel were not run with SLR by any team.
`SLR_STATUS` in `drilldown/tree.ts` says which teams get the switch.

Generated by `scripts/build-sea-level-rise.py` → `drilldown/seaLevelRise.ts` from:

- **Ecology** — "Sea Level Rise Scenario Analysis - Eco - 10_15_2026.docx": proportion of
  suitable days per species. Delta-wide by water year; by region only pooled over
  2019–20, shown as its own "2019–20 together" period. The streak lengths are not loaded.
- **EJ** — "SLR COMM.xlsx", sheet OVERALL - SLR: share of SAFER points over
  1,050 µS/cm by vulnerability class, whole run and WY 2019 / WY 2020. Its non-SLR sheet
  matches the loaded Table 3 values once rounded. The workbook splits by water year, not
  by season, so the SLR periods are years. No score was published for the SLR runs.

Recreation's SLR pair goes through its own generator,
`scripts/build-recreation-thresholds.py`, which takes it as two optional extra paths and
writes `REC_SLR_*` beside the current tables in `drilldown/recreationThresholds.ts`:

- **Recreation** — "RMA SLR Salinity Analyzed.xlsx" and "RMA SLR Temperature
  Analyzed.xlsx" (in `research/criteria-stories/Recreation/data-2026-10-18/`): every
  activity, region and period for Business as Usual, Bolster & Fortify, Eco Machine and
  New Green Watershed, with no gaps. The temperature book labels cold-water day use
  "DAY USE (<18C)". Our activity means and the criterion score are rebuilt from the SLR
  scores the same way, so they stay ours ("awaiting subteam" on the breakout screen).

- [ ] Copy the Ecology and EJ sources into `research/criteria-stories/` so
      `build-sea-level-rise.py` can be rerun (Recreation's are already there).
- [ ] Ask Ecology about two likely typos in the overall table: New Green Watershed SLR
      2020 juvenile striped bass reads 0.9645, the same as adult striped bass (the other
      scenarios read ~0.86); Bolster and Fortify SLR 2020 juvenile longfin streak reads
      6.6070 against Base 6.070. Both are loaded as published.
- [x] **Recreation**: SLR pair loaded and `SLR_STATUS.recreation` set to `'loaded'`.
