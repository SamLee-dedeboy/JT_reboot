# Regional Summary

## Purpose

Regional Summary is a touchscreen-first experience for exploring where, when,
and by how much salinity changes under each adaptation scenario when compared
with Business as Usual.

The active route is `/pages/regional-summary`. Its entry point is
`RegionalSummaryPage.tsx`.

## Current experience

The landing screen presents six vertical scenario panels, numbered 00–05:

1. Alternative Delta Outflows
2. Eco Machine
3. New Green Watershed
4. Bolster and Fortify
5. Calling on Reserves
6. A Tunnel

Business as Usual is not presented as a selectable panel because it is the
comparison baseline for the five adaptation scenarios.

The current interaction is:

1. The visitor sees all six scenarios at once. A **What is Just Transitions in
   the Delta?** action in the header opens a concise, touchscreen-scaled
   introduction to the project, its participatory scenario-planning process,
   and the purpose of this salinity experience.
2. Tapping a scenario expands its panel and reduces the width of the others.
3. Inactive panels darken and temporarily hide their titles, leaving their
   numbers visible as touch targets so clipped text does not compete with the
   selected scenario.
4. The expanded panel presents the scenario introduction.
5. The visitor can return to the six-panel overview.
6. Selecting **Salinity Exploration** opens the map stage for the active
   scenario.

The expanded **A Tunnel** panel retains its scenario-overview action and states
that modeling results are coming soon beneath the action row.

## Map stage

`RegionalSalinityExplorer.tsx` implements the second stage as a touchscreen
mockup informed by the sibling `JT_exploration/RMA/artwork` project.

### Offline basemap

`npm run build:kiosk` builds the site with the offline basemap always on
(`.env.kiosk` sets `VITE_OFFLINE_MAP=1`); serve it with `npm run preview`. In other
builds, append `?offline=1` to `/pages/regional-summary` (or
`/pages/scenario-explorer`) to replace the remote Mapbox Studio style with the self-contained exhibit basemap in
`src/map/offlineBasemapStyle.ts`. Both pages share one style: the scenario
explorer's water color with the common land, road, and label specs. It copies the online land, landuse, road, water, and label specs, and load only
files served by this application:

- `public/data/delta_waterway*.geojson`: Delta and Bay water.
- `public/data/regional-summary/offline-basemap.geojson`: OpenStreetMap roads,
  settlement labels (with a Mapbox-style `symbolrank`), and bay labels.
- `public/data/regional-summary/offline-landuse.geojson`: OpenStreetMap
  farmland, wood, park, residential, and lake polygons.
- `public/fonts/`: glyph ranges for Proxima Nova Regular/Semibold, DIN Pro
  Regular, and the default `Open Sans Regular,Arial Unicode MS Regular` stack
  used by symbol layers that do not set `text-font` (including the ◆/◇ station
  markers).

All regional polygons, station evidence, and strategy-guide geometries continue
to use the existing bundled files. `BaseMap` requires a Mapbox token only when
its resolved style is a `mapbox://` URL.

To refresh the OpenStreetMap layers, run `node scripts/build-offline-basemap.mjs`.
It queries Overpass (`scripts/offline-basemap.overpassql` plus tiled landuse
queries), caches responses in `.cache/offline-basemap/`, and rewrites both
GeoJSON files.

- The explanation header occupies the top `15dvh`.
- The interactive map occupies the bottom `85dvh`.
- Entering the map from scenario selection opens a skippable, scenario-specific
  adaptation-strategy guide using the same fixed card interaction as the
  Scenario Explorer tutorial. A welcome card first repeats the selected
  scenario introduction while the map holds its scenario-specific regional
  overview, then asks the visitor to start or skip the guide. On larger screens,
  the welcome card is centered for emphasis and the overview camera is biased
  west so the relevant geography remains legible around it. Bolster and Fortify
  uses a dedicated wide Bay–Delta welcome bound matching the approved
  composition. This welcome camera is separate from the tighter regional
  overview restored after the guide is skipped or completed. Starting—not
  entering the map—triggers the first strategy camera. Each strategy is a
  numbered step with progress dots, Back/Next controls, a close button, and an
  immediate **Skip guide** action. The guide is portaled above the animated map
  so it cannot be clipped, and it does not reappear when returning from a
  regional pattern timeline. Numbered steps contain only the strategy title and
  description; the redundant “Why this matters on the map” block is omitted.
  On larger displays the card moves among map corners while each step flies the
  map camera to the strategy's intervention area. Finishing or skipping restores
  the scenario's regional overview, which fits the bounds of that scenario's
  place polygons and markers (falling back to the broad Bay–Delta view when a
  scenario has no places). Returning from a pattern timeline reopens the map at
  that same overview. Reduced-motion preferences remove camera travel time.
- For Bolster and Fortify, the three guide steps load the supplied intervention
  geometries in this exact order: Franks Tract operable gates, Franks Tract
  levee repair, then the through-Delta freshwater pathway. The active geometry
  is highlighted in primary green and each camera fits its actual bounds. The
  gates and levee repair remain visible together during the first two steps;
  both retain a green outline while only the active intervention receives a
  green fill. The web-ready WGS84 exports live in
  `public/data/regional-summary/gis/`; the pathway source is reprojected from
  Web Mercator during conversion by `scripts/convert-bf-strategy-gis.py`. The
  levee-repair layer has since been replaced with the narrower
  `levee_narrow.geojson` waterway region from `JT_exploration`, so rerunning
  the shapefile conversion would restore the older, wider levee geometry.
- The header keeps the selected scenario, the exploration question, concise
  instructions, a 64-pixel route back to scenario selection, and a persistent
  **Scenario guide** action that restarts the walkthrough from step one. The
  action first clears any selected region and its summary card so they do not
  compete with the guide or its camera movement. The
  question names **saltier** in pink and **fresher** in cyan so the directional
  map language is introduced before the visitor selects a region.
- The map uses a broad Bay–Delta extent and the artwork project's dark Mapbox
  style.
- The sibling artwork project's pin-and-label styling is retained, but labels
  are always visible instead of being revealed on hover. Markers animate in
  once, then use a persistent tap-selected state with a 56-pixel minimum target.
- Selecting a region opens its persistent summary beside the selected map
  marker, rather than in a distant viewport corner or a hover-only popup. Mapbox
  automatically chooses the card's anchor so the touchscreen-scaled summary
  remains inside the visible map. No empty “Choose a region” card covers the map
  before a region is selected, and scenarios without shortlisted patterns do
  not show an empty status card. The selected preview uses an unoutlined dark
  artwork-style surface with no drop shadow or decorative gradient. Its region
  title and framed key takeaway use pink for saltier findings and cyan for every
  other direction. A short **Why this place** explanation describes the
  location's role in the selected scenario and adaptation strategy, including
  potential infrastructure, habitat, flow-path, or community impacts. This
  contextual copy is intentionally separate from the modeled salinity result;
  the existing green exploration action remains unchanged.
  The region title, **Why this place**, and **Key takeaway** share one inset text
  column. The takeaway frame and emphasized finding retain the meaningful pink
  or cyan directional treatment.
  Summary cards are restricted to the left or right of their marker—never above
  or below it. Per-place placement is configured in
  `regionalPlaceContent.ts` through each entry's `cardSide`, while the condensed
  card width, padding, gap, and marker offset remain centralized in
  `regionalSummaryStyles.ts`.
  The responsive `previewWidth` is the card's minimum width. The card expands
  horizontally when a longer region title requires it, while titles remain on
  one line and the body/takeaway sections retain the original `previewWidth`
  instead of collapsing to their intrinsic minimum width.
  When a card opens, the map measures it against a touchscreen-safe viewport
  inset and pans only as far as needed to keep the complete card visible. The
  inset and motion scale are centralized with the other preview sizing values,
  and reduced-motion preferences make the correction immediate.
  Display names, **Why this place** copy, and editable key takeaways also live in
  `regionalPlaceContent.ts`. Each key takeaway is an ordered list of text
  segments; editors can mark individual segments as `saltier`, `fresher`,
  `primary`, `white`, or `muted`, and can independently enable bold emphasis.
  Franks Tract under Bolster and Fortify explicitly connects its pink “Generally
  saltier” finding to the white explanation that the gates are closed during the
  period.
- Once a place is selected, its polygon and marker gain a stronger treatment
  without de-emphasizing the other regions. The preview replaces implementation
  metadata with a human-readable directional period. It names the full modeled
  span as the entire simulation period, October 2018–September 2019 as dry year
  (2019), and shorter October–March ranges as wet-season events.
- Drag and pinch gestures are enabled and explained inside the persistent
  bottom-left preview card so visitors do not have to scan multiple floating
  instructions.
- Polygon fills use the artwork project's layered treatment: a quiet color wash,
  seeded noise texture, and a clear outline. Approximate station footprints keep
  a dashed outline so the texture is never mistaken for a reviewed boundary.
- Regions that flip direction use alternating pink and cyan diagonal stripes
  instead of a solid yellow polygon, making the two-direction behavior visible
  without requiring the visitor to read the legend first.
- The same pink/cyan pairing continues through diagonally split pins and a thin
  two-color accent beneath a dark, readable location label. Flipping polygons
  have no outline, and yellow is not used for the flipping state.
- All location labels share that high-contrast treatment: saltier labels have a
  pink bottom accent, fresher labels have a cyan accent, and flipping labels use
  both. The flipping pin's color division follows the same diagonal as its
  polygon stripes.
- Supplied reviewed/candidate geometries render as filled map polygons. Places
  that only have station membership render as dashed convex hulls and retain the
  `approximate_station_footprint` label; they must not be described as reviewed
  boundaries.
- Each scenario/place pair receives a directional summary derived from its
  shortlisted patterns: generally saltier, generally fresher, flipping between
  directions, or unclear. Pink, teal, and yellow map treatments reinforce those
  states, and the selected-place card states the direction in text.

The runtime loads only the explicitly curated files kept directly in
`public/data/regional-summary/`:

- `pattern-list.json` contains approved places and findings.
- `pattern-ec-series-7d.json` contains chart series for those findings only.
- `region-of-interest.geojson` contains the approved or explicitly labeled
  approximate map geometries.

The current curated Bolster and Fortify set contains North Franks Tract,
Franks Tract, Clifton Court Forebay, and the Freshwater Corridor. The Clifton
Court Forebay and Freshwater Corridor polygons are the supplied candidate
waterway regions from
`JT_exploration/RMA/BDSC_regional_summary/inputs/waterway_regions/`
(`clifton_court_forebay.geojson` and `freshwater_corridor_narrow.geojson`).
`scripts/promote-bf-waterway-regions.py` copies them into `raw/` and promotes
them, along with the corridor's shortlisted fresher pattern and its 7-day chart
series, into the three runtime files.
Files under `public/data/regional-summary/raw/` preserve the broad discovery
shortlist, source selections, full event-series output, stations, and working
geometries. The application never loads the `raw/` directory. Future analysis
and shortlist generation should happen there; only explicitly approved records
and matching chart series and geometries should be promoted to the three runtime
files above. Superseded legacy exports live under
`public/data/regional-summary/archived/` and are also never loaded.

### Bolster and Fortify gate schedule

`bolsterGateClosures.ts` is the feature-owned source of truth for the inferred
Franks Tract gate-operation windows shown on the detailed timeline:

- Closure 1: October 1, 2018 through January 13, 2019.
- Closure 2: November 26 through December 10, 2019.
- Closure 3: approximately July 15 through November 29, 2020.

The dates describe gate operation, not the narrower qualifying salinity-response
episodes. All transitions were inferred from a plotted gate-operation variable
and carry approximately two days of uncertainty. Closure 3 is explicitly
provisional because no exact operational time series has been located. The
current recommended response window for closure 3 is October 1 through November
29, 2020; this is gate-associated timing and must not be described as proof that
the closure caused the response.

### Calling on Reserves release schedule

`callingOnReservesReleasePeriods.ts` records the two provisional, month-scale
release windows used to organize the curated Calling on Reserves chronology:

- Potential release 1: January 1 through February 28, 2019.
- Potential release 2: December 1, 2019 through January 31, 2020.

These are working ranges inferred from the supplied COR-versus-baseline flow
hydrograph and the timing of coherent regional EC responses. They are not
confirmed reservoir-operation dates. Curated COR patterns carry a
`releaseTimingLabel` and `relatedReleaseIds` so the interface can distinguish
responses occurring before, during, across, or after each inferred release.

The broad discovery builder is `scripts/build-regional-summary-interface-data.mjs`.
The reproducible selection step is `scripts/select-regional-summary-patterns.mjs`.
Their inputs and outputs should remain under `raw/` unless a reviewed subset is
being deliberately promoted to the curated runtime files.

Selecting a place enables **View regional patterns**. The next screen presents
dated detected events as a Gantt timeline across the shared October
2018–November 2020 simulation period. Each pink bar starts and ends with its
event and therefore encodes duration directly. Quarter ticks structure the
axis, while annotations identify the October 2018–September 2019 wet year, the
October 2019–September 2020 dry year, and the October–November 2020 critical
dry-year period. The water-year bands share
one row above a centered, full-width axis. Event bars sit directly on that axis,
with leader-line annotations reporting duration, percent and/or absolute EC
change from baseline, and the baseline-to-scenario EC values. Threshold-frequency
patterns and the selected-pattern detail dock are intentionally omitted from
this overview. A Tunnel currently shows an explicit empty state because the
supplied shortlist contains no Tunnel patterns.

Tapping an event bar reveals a zoomed comparison above the timeline. The chart
uses real regional daily values from the pattern review explorer, smoothed to a
7-day rolling average: baseline is white, while the scenario line uses pink for
saltier events and teal for fresher events. It uses the full upper plotting
region with no card background or title, retaining only labeled date and
electrical-conductivity axes, ticks, reference gridlines, and the series key.
The translucent scenario envelope shows the daily minimum-to-maximum 7-day
rolling value across stations in the selected region. Event bars remain fixed
in place and communicate hover, keyboard focus, and selection through glow.
The timeline sits at 70% of the view; only the selected event's
vertical detail card appears below it, clamped inside the viewport. The compact
static event slices are generated by
`scripts/build-regional-summary-event-series.py`; its checked-in runtime output is `public/data/regional-summary/pattern-ec-series-7d.json`; the full SQLite time-series
database is never shipped to the browser.

The detailed map colors both selected-region and surrounding stations for the active event window.
Run `node scripts/build-regional-summary-surrounding-stations.mjs` after changing the curated
patterns or scenario dashboard data. It writes the checked-in runtime file
`public/data/regional-summary/pattern-surrounding-stations.json` from the daily station baseline and
scenario-difference series.

The detailed view's **Stations within the region** map renders immediately,
before an event is selected. It uses the active region geometry with a primary
green gradient fill and no outline stroke; regional station points are solid
white. Once evidence loads, the default station membership comes from the first
available event for that region, while selecting another event can update the
membership shown.

The map and timeline exchange through the directional full-screen wipe used by
the sibling artwork exploration: the incoming view reveals from the right and
the outgoing view clears toward the left with the same emphasized easing.
Reduced-motion preferences replace the wipe with an immediate opacity change.

The detailed dashboard leads with a titled **Salinity Pattern Timeline** before
the evidence workspace. That workspace is a two-column grid: the station map is
always visible on the left, while the right column uses two chart columns above
the event interpretation. Until an event is selected, the complete right column
is replaced by a single “Select a pattern to see its details” prompt. The row and
column proportions remain centralized in `regionalSummaryDetailGrid`.
The timeline receives additional vertical space, keeps its October 2018 origin
label inside the left edge, and uses taller strategy-event bands. Those bands
sit eight pixels above the water-year row so the related annotations read as a
single group rather than two disconnected layers.

Scenario titles, summaries, and images come from
`../scenarios/content/scenarioContent.ts` so this experience stays aligned with
the main scenario pages.

## Touchscreen requirements

- This tool is a self-contained touchscreen installation and does not need to
  reproduce the public website's design system or page hierarchy.
- Feature-specific typography lives in `regionalSummaryStyles.ts`. Adjust that
  local scale for viewing distance, legibility, and touch use instead of changing
  shared website typography tokens.
- All regional-summary typography, touch targets, surface widths, marker sizes,
  spacing, and chart-label sizing are consolidated in
  `regionalSummaryStyles.ts`. Its `clamp()` ranges scale through 4K landscape
  displays while retaining usable minima at the `md` boundary.
- Button icon wrappers share explicit optical alignment and responsive sizing.
  Directional arrows and the project-introduction icon use the larger
  `prominentIconSize`, while other controls retain `controlIconSize`; outlined
  primary actions use a four-pixel stroke.
- The detailed pattern page uses the named `regionalSummaryDetailGrid` in that
  same file. Its `header`, `evidence`, `interpretation`, `timeline`, and
  `regions` areas define the complete row/column composition; edit that one
  object to rearrange or resize the detailed view.
- Detailed-view typography is isolated in
  `regionalSummaryDetailTypography`: `eyebrow`, `title`, `lead`,
  `sectionTitle`, `body`, `supporting`, `action`, and `timelineLabel`. The
  evidence screen does not borrow the landing page's `pagePrompt` or generic
  map `instruction` styles.
- The interface explicitly uses Nunito Sans through
  `regionalSummaryStyles.ts`; it must not inherit the public site's Proxima Nova
  body font.
- Basic brand continuity, such as the existing palette, may be retained where it
  helps, but it must not limit the installation's usability.
- Touch is the primary interaction; nothing essential may depend on hover.
- Region polygons and their visible labels are equivalent touch targets; either
  one selects the region and opens its preview.
- Primary actions should have a minimum height of 64 pixels.
- The selected scenario must remain visually obvious after the visitor lifts
  their finger.
- Visitors must always have a prominent way to return to the scenario overview.
- Motion should explain the change in state without delaying interaction.
- Reduced-motion preferences must be honored.
- Controls must remain usable near the MUI `md` breakpoint and on smaller
  portrait screens.
- Avoid dense filters, small map markers, and precision gestures on the landing
  screen.

## Planned exploration flow

The methodology reference deck defines the intended progression:

1. Select a scenario.
2. Read the scenario introduction.
3. Start regional exploration.
4. Show a map with a small set of hand-picked regions relevant to that scenario.
5. Summarize two or three significant salinity patterns before asking the
   visitor to go deeper.
6. Open a regional timeline containing the useful patterns identified for that
   region.
7. Support each pattern with dates, salinity change, station agreement, optional
   charts, and concise methodological context.

Reference deck: [BDSC Methodology](https://docs.google.com/presentation/d/1iWD3dmuhWf6b0YBAa6Ox4idKDrtmKaExJRnh4Ib9SjY/edit)

The map and region-selection mockup are now implemented. Findings and timeline
screens have not yet been rebuilt. Do not reconnect the archived prototype as a
shortcut; continue designing the replacement around touch interaction and the
exploratory flow above.

## Archived prototype

The previous Regional Summary implementation is preserved in `archived/`. It
contains the old map, threshold controls, station toggle, station-maximum view,
tutorial, methodology dialog, regional reports, and time-series UI.

Archived TypeScript files have an additional `.archive` suffix so TypeScript and
Vite do not include them in the application build. Remove only that final suffix
when intentionally restoring a file for reference or reuse.

The archive is historical source material, not the design specification for the
new experience.

## Validation

For changes to this feature:

- Check the six-panel overview and expanded state with touch input.
- Check keyboard activation and visible focus states.
- Check portrait and landscape layouts around the `md` breakpoint.
- Check reduced-motion behavior.
- Verify that asset URLs use `assetUrl` and work under the `/JT_reboot/` base
  path.
- Run `npm run build` before considering implementation complete.
