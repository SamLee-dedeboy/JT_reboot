# AGENTS.md

This file contains repository-specific instructions for Codex and other coding agents working on this project. Keep it synchronized with the codebase when architecture, commands, or design conventions change.

## Project Overview

Just Transitions in the Delta is a UC Davis research project website about participatory scenario planning for equitable water management in the Sacramento–San Joaquin Delta. This repository rebuilds the original ArcGIS Hub site at <https://delta-just-transitions-ucdavis.hub.arcgis.com/>.

The application uses React 19, TypeScript, Vite, React Router, MUI, Mapbox GL, D3, and Framer Motion. Vite is configured with the production base path `/JT_reboot/`.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite at http://localhost:5173
npm run build        # TypeScript project build + Vite production build
npm run lint         # Run ESLint
npm run format       # Format maintained files with Prettier
npm run format:check # Check formatting without modifying files
npm run audit:tokens # Check for disallowed raw theme values
npm run audit:tokens:repository # Check repository UI and its shared cards
npm run audit:tokens:changed # Check only the lines changed since HEAD (required for every change)
npm run preview      # Preview the production build
```

`npm run format` runs Prettier across the entire repository. In a dirty worktree, use
`npm exec prettier -- --write <edited-files...>` so unrelated user changes are not rewritten.

## Application Entry and Routing

- `src/main.tsx` creates the React root and renders `AppProviders` and `PublicSiteShell`.
- `src/app/providers.tsx` installs the MUI `ThemeProvider`, `CssBaseline`, and `BrowserRouter`. The router basename comes from `import.meta.env.BASE_URL`.
- `src/app/PublicSiteShell.tsx` provides global route-change scroll restoration and renders `AppRouter`.
- `src/app/AppRouter.tsx` is the single source of truth for routes. Do not add routes in `main.tsx`.
- Large interactive routes are lazy-loaded with `React.lazy` and `Suspense`.

Current route groups:

- Public home: `/`
- Scenarios: `/scenarios`, `/scenarios/background-context`, `/scenarios/key-parameters`, `/scenarios/:scenarioSlug`, the next steps `/scenarios/modeling`, `/scenarios/evaluation` (with the families overview at `/scenarios/evaluation/families` and criterion pages at `/scenarios/evaluation/:teamId`), and performance/ranking at `/scenarios/ranking` and `/scenarios/ranking/by-criterion`. Any URL with no route (including the retired `/scenarios/results` pages) redirects to `/`
- Repository: `/pages/project-documentation`, `/pages/service-learning`, and `/pages/resources`
- Data experiences: `/pages/scenario-explorer`, `/pages/scenario-explorer/internal`, `/pages/scenario-explorer/d1641`, `/pages/regional-summary`, `/pages/watershed`, and the co-design dashboard at `/pages/co-design-dashboard/*` (`flow`, `linking`, `mental-model`, `sunburst`, `sunburst-grid`)
- Internal tools: `/pages/playground`, `/pages/baseline-exploration`, `/pages/scenario-time-lapse`, `/pages/kelp-diagram`, `/pages/rank-visualization`, `/pages/breakout` (a kiosk route for the ranking feature's criterion table; one route, the team in `?team=`), `/pages/co-design-timeline`, `/pages/tribal-stewardship-spectrum`, `/pages/site-map`, `/pages/criteria-copy`, and `/design-system`

## Source Architecture

The `src` directory is organized by application role and feature:

- `src/app/`: providers, shared application shell, and route configuration.
- `src/features/home/`: public home page, its section components, and home content.
- The Future Scenarios pages are four features that import nothing from each other. Each is laid out like `src/features/home/`: every page the router opens sits at the feature's root (`*Page.tsx`) and only lays out its sections in order; the sections and the pieces they use live in `components/`, one subfolder per page when the feature has several (plus `shared/` for what its pages share). Keep a page file to its layout; put a new section in `components/`.
  - `src/features/scenario-narration/`: introducing the scenarios: `LandingPage`, `BackgroundPage`, `KeyParametersPage` and `StoryPage` (each scenario's story beside its map), with `components/landing/`, `components/background/` and `components/story/`. The landing and background words are in `src/content/landing.ts` and `src/content/background.ts`.
  - `src/features/scenario-modeling/`: `ModelingPage` (`/scenarios/modeling`): its sections (`HowModeledSection`, `BaselinesSection`, `OutflowVariationsSection`, `AdaptationScenariosSection`, `ModeledSalinitySection`, `NextStepSection`) and their maps, timelines and tables are in `components/`; the page's tables and lists are in `src/content/modeling.ts`. It embeds the regional summary's `RegionalSalinitySummary`.
  - `src/features/scenario-methodology/`: how each criterion evaluates the scenarios: `EvaluationPage`, `FamiliesPage` and `CriterionPage`, with `components/evaluation/`, `components/families/` and `components/criterion/` (one file per criterion-page section).
  - `src/features/scenario-ranking/`: `RankingPage` (the hero, then the By scenario or By criterion view) and `BreakoutPage` (the `/pages/breakout` kiosk), with `components/by-scenario/`, `components/by-criterion/` and `components/regions/`. It imports nothing from `src/internal/`; internal tools import from it. Every number and every team-specific sentence in the ranking tables lives in `scenario-ranking/data/`, one file per team (`ecology.ts`, `recreation.ts`, `environmentalJustice.ts`, `economy.ts`, `ecoCultural.ts`) in the shape of `data/types.ts`: the team's text, its rows, then `current` and `seaLevelRise`, each split by scenario into scores, measures, ranks, arrows and takeaways. Baselines carry absolute values only; their scores are 0 by definition and are filled in by `model/tables.ts`, which builds both tables from these files. General table wording is in `scenario-ranking/tableText.ts`; the By criterion table is under `scenario-ranking/components/by-criterion/`; `scenario-ranking/README.md` says where to change what.
- Content more than one feature reads lives in `src/content/`, imported through each folder's index: `scenarios/` (one file per scenario, `baseline.ts`, `tieredOutflows.ts` and the five adaptation scenarios such as `ecoMachine.ts`, each a `ScenarioContent` from `scenarios/types.ts`; the index lists them in site order), `criteria/` (one file per criterion, such as `ecology.ts` or `environmentalJustice.ts`, each a `Criterion` from `criteria/types.ts` holding, in order, its summary card, chips and metrics, `story` (the criterion page's text), `regions`, `references` and `report` (findings by scenario); the index gives `criteria` in site order and `criterionById`), `background.ts` (the Background and Key Parameters pages' copy), `modelRuns.ts` (the water years the salinity runs cover and the operating schedules the results pages share), `deltaRegions.ts` (the teams' Delta region outlines as SVG paths, generated by `scripts/build-subteam-regions.py`; don't edit by hand), and `routes.ts` (links one feature makes to another's pages, so features don't import each other for a URL). Content only one feature reads stays in that feature.
- Imports: `@/` is `src/` (set in `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts` and `vitest.config.ts`; `vite/siteMapPlugin.ts` follows it too). Outside a folder, import `ui`, `content`, `theme`, `map` and `utils` through it: components come from the `src/ui` index in one line (`import { Footer, Navbar, PageRail } from '@/ui'`), everything else by path (`@/content/names`, `@/theme`, `@/map/cameras`, `@/ui/teamStyle`). Inside one of those folders, and inside a feature, imports stay relative. Files in `src/ui` never import from `@/ui`, which would make them import each other in a loop. A new component in `src/ui` gets a line in `src/ui/index.ts`; style helpers (`actionStyles`, `focusRing`, `navigation`, `surfaceStyles`, `teamStyle`) stay out of the index. `src/internal/` keeps its relative imports.
- Shared page pieces in `src/ui/`: `PageHero` (the hero on modeling, evaluation, criterion and watershed pages), `NumberedHeading`, `RegionLabel`, `teamStyle` (each criterion's color and icon), and `surfaceStyles` (full-bleed band, choice card, bordered panel).
- `src/features/repository/`: repository routes, shared repository layout, cards, tabs, timelines, and data.
- `src/features/scenario-explorer/`: scenario explorer page, charts, controls, types, and feature-local utilities.
- `src/features/regional-summary/`: regional summary page, tutorials, controls, map UI, and feature-local types.
- `src/features/watershed/`: public upstream-restoration data experience and its generated outcomes.
- `src/features/co-design/`: the co-design dashboard, migrated from the Svelte JT_dashboard app. `CoDesignDashboard.tsx` is the shell with its own nested routes; each view lives under `views/`. There is no backend: `api.ts` serves static snapshots from `public/data/co-design/`, regenerated with `scripts/co-design/snapshot_api.py`. View tokens live in `src/theme/coDesign/` (`theme.coDesign`).
- `src/ui/`: reusable site-wide UI primitives, cards, animation components, Navbar, and Footer.
- `src/map/`: reusable Mapbox infrastructure, map instances, and layers. It imports from no feature and from nothing in `src/internal/`.
- `src/internal/`: internal-only tools, visualizations, KelpFusion (its logic and its map, under `internal/kelp/`), and the in-app Design System. Only `src/app/AppRouter.tsx` imports from it.
- `src/theme/`: MUI theme tokens, typography, spacing, component overrides, map/chart tokens, and TypeScript augmentation.
- `src/utils/`: small cross-feature helpers.
- `src/content/names.ts`: what the site calls every team (criterion) and scenario: full name, short name, chart code, URL slug, and per-place `variants` where one place words a name its own way. Never type a team or scenario name into a page; read it from here (`teamName`, `teamShortName`, `scenarioName`, `scenarioCodeForLabel`). To word a name differently in one place, add a `NamePlace` and a variant rather than a literal.

Keep route-specific code in its feature. Move code into `src/ui`, `src/map`, or `src/utils` only when it is genuinely reused across features.

Refactors, cleanups and consolidations (shared registries such as `src/content/names.ts` and `src/map/cameras.ts`, deduplication, renames) cover the public website only. Leave `src/internal/` out of scope: don't move their values into shared registries, don't restructure them, and only touch them where a public-site change would otherwise break them.

## Key Composition

- `src/features/home/HomePage.tsx` composes Navbar, the lazy-loaded sticky `HeroMap`, scrolling editorial panels, and Footer. `HeroMap` (`src/features/home/components/HeroMap.tsx`) places the title over `src/map/hero/HeroSalinityMap.tsx`, the hero camera plus salinity animation. Scenario narration maps can show one still frame of the same data by setting `salinitySnapshotFrame` in their config, as `tiered-outflows` does.
- The home page's words (hero, the four narrative panels, the photo panels, the rail labels) live in `src/content/home.ts`; `src/features/home` keeps only layout. Each narrative panel is the shared `HomePanel` frame (section, rail grid, `SectionHead`) plus its own body in `components/HomePanels.tsx`; a section's `id` in `HOME_SECTIONS` is both its anchor and its rail target.
- The hero and home panels share `--home-rail-inset`, defined by `HomePage`, so hero copy, the rail, and panel text line up on one gutter.
- Section rails: every page uses `src/ui/NavRail.tsx`. Its three variants are placements for three kinds of page, not styles: `fixed` (right edge, pages whose content fills the width, e.g. Background), `sticky` (pins over full-bleed colored panels: Home, the scenarios landing) and `page` (the "On this page" list, always through `PageRail`). Item typography, spacing, hover and `PageRail`'s top padding are the same everywhere; don't restyle a rail per page or add a variant. Nested items set `indent`. Pages that put a rail beside their content size its column with `navigation.railColumn`, or use `src/ui/RailGrid.tsx`, which does so.
- Link buttons use `src/ui/ActionLink.tsx`: `ActionButton` (contained or outlined, with an arrow) and `TextLink`. Either, given no `href`, shows disabled with the "Forthcoming" note; don't hand-write that note.
- Repository pages use `RepoLayout`, `RepoHero`, and `RepoTabs` from `src/features/repository/`.
- Internal tools can use `src/internal/PageLayout.tsx` for a shared Navbar/hero/Footer shell.
- `src/ui/Navbar.tsx` contains `DesktopNavbar` and `MobileNavbar`; the parent mounts exactly one based on the MUI `md` breakpoint. Its menu config lives in `src/ui/navigation.ts`.
- `/pages/site-map` (`src/internal/site-map/`) maps navigation from live code. The site map shows each Future Scenarios page's live UI sections plus the sections the visitor workflow still needs (`pageStructure.ts`; update both when a scenario page's sections change), and a second view traces the workflow from home through one team's criterion to the ranking (`journeyModel.ts`). `vite/siteMapPlugin.ts` serves `virtual:site-map` by parsing `AppRouter.tsx` (and nested `/*` routers) and scanning each route's imports for `to`/`href`/`navigate` links, including calls to path helpers declared as `export const name = (...) => \`/route/...\``. Keep route declarations in the `<Route path="..." element={<Component />} />` shape so the scan can read them. On Windows, never give two files in one folder names that differ only by case; the dev server can cache the wrong one.
- `/pages/criteria-copy` (`src/internal/criteria-copy/`) is the user's editor for each criterion's public text (its evaluation-page summary and every section of its criterion page). The text lives in `editorial/criteria-copy.json`, with columns `claude`, `gpt`, `yours` (the user's final text), and `note` (the user's instruction for that field). Claude writes only `claude` and GPT only `gpt`; never edit `yours` or `note`. When asked to update the site from it, run `npm run copy:criteria`, apply each listed field's `yours` text at its `source`, and act on any notes. Each section's source passages from the teams' "Story Behind the Criterion" reports are in `editorial/criteria-sources/<criterion>.json` (regenerate with `python scripts/extract-criterion-reports.py`, which lists the report paths); draft against them. The field structure comes from `fields.ts`; change sections there, not in the JSON. The dev server (`vite/criteriaCopyPlugin.ts`) saves the editor's changes; the same command re-syncs the file without it.
- `src/map/BaseMap.tsx` is the shared map component. Public map presentations are grouped by what they draw: `src/map/hero/` (the home page salinity animation), `src/map/background/` (the Background page) and `src/map/scenarios/` (the scenario story maps); `src/map/README.md` says what each file does. Maps used only by internal pages live under `src/internal/`. Every public camera position (starting views, fit bounds, fly-to views, zoom limits) lives in `src/map/cameras.ts`, grouped by page; pages decide when to move the camera, not where. Map styles live in `src/map/mapStyles.ts`.
- Scenario narration maps are configured per slug in `src/map/scenarios/config.ts`. Keep interaction controls, scroll-trigger IDs, layer scopes, legends, on-map annotations, and highlight colors in that configuration (its camera bounds come from `src/map/cameras.ts`) rather than branching on scenario slugs in `StoryPage`. Adaptation chapters carry a `role`, and `storyInReadingOrder` (`src/content/scenarios/chapterOrder.ts`) puts them in the shared order (key benefits, motivation, design approach, supporting strategy) and gives each a role anchor such as `design-approach`; scroll triggers name those anchors, not chapter positions.
- Scenario geometry under `public/data/geospatial-assets/scenarios/` is cataloged in its `manifest.json` and regenerated from the sibling `JT_exploration/website_map_assets` packages with `python scripts/populate-scenario-geospatial-assets.py`. Keep source provenance and the GeoJSON/vector-tile threshold recommendation in that manifest.

## Theme and Design System

`src/theme/` is the source of truth for shared visual decisions:

- `palette.ts`: brand, base, accent, salinity, translucent, border, and surface colors.
- `typography.ts`: font families and semantic MUI typography variants.
- `spacing.ts`: numeric MUI spacing multipliers and layout-width tokens.
- `components.ts`: global MUI component defaults and overrides.
- `theme.ts`: theme assembly plus semantic objects for navigation, numbering, highlighting, and logo sizing.
- `map.ts` and `chart.ts`: semantic visualization tokens.
- `theme.types.d.ts`: MUI TypeScript module augmentation for custom tokens and variants.
- `index.ts`: public theme exports.

The active breakpoints are `xs: 0`, `sm: 600`, `md: 900`, `lg: 1200`, and `xl: 1400`. Use theme breakpoints instead of introducing unrelated media-query values.

The internal design reference is `src/internal/design-system/DesignSystem.tsx` at `/design-system`. It must demonstrate production tokens and components, not maintain a separate set of visual values.

`typography.editorialEmphasis` is the semantic Proxima Nova bold treatment used for emphasized statements in the rebuilt home narrative.

## UI Implementation Rules

These are requirements for new UI and UI refactors.

### Semantic tokens and typography

- Use existing semantic theme tokens before raw colors, spacing, shadows, radii, or typography values.
- **All text uses the MUI typography variants in `src/theme/typography.ts`. This is a hard rule, not a preference.** Never set `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `lineHeight`, `letterSpacing`, or `textTransform` at a call site, in `sx`, in a shared style object, or in an inline `style`, not even to nudge one value of an otherwise-correct variant.
- When no variant fits, add a named semantic variant to `typography.ts` (and register it in `theme.types.d.ts` and the Design System's `typeSamples.ts`) rather than composing one locally. `captionProse` is an example: caption-size text that runs several lines needed looser leading, so it became a variant instead of a `lineHeight` override.
- Don't get weight or italics from HTML either: use `<Box component="span">` with a color for emphasis, not `<strong>`, `<b>`, or `<em>`, unless the variant itself carries that weight.
- Size icons with the `Icon` component's `size` prop (`src/ui/Icon.tsx`), or with `width`/`height` on an MUI icon, never with `fontSize`.
- Every change must pass `npm run audit:tokens:changed` with no violations. It checks only the lines you added or changed (and new files in full), so it stays strict for new work while the older backlog is fixed separately. Don't work around a violation by renaming a property or moving the value into a variable; fix it with a token or a new variant.
- Change shared typography decisions in `src/theme/typography.ts`. For example, navigation link weight belongs in `typography.navigationLabel`, not in `Navbar.tsx` or a Design System example.
- Consume variants with `<Typography variant="...">` or `typography: '...'` in `sx`.
- Hammersmith One (`fontHeading`) is always uppercase. Every variant that uses it sets `textTransform: 'uppercase'`; never override it with `textTransform: 'none'`. Text that must keep its case (units such as µS/cm) uses a Proxima Nova variant such as `chartUnit`.
- Do not add a local typography override just to make a production component match the approved shared design; fix the semantic variant.
- Change a global palette token only when all consumers should change. Otherwise use or introduce a purpose-specific semantic token.
- Run the narrowest applicable token audit. Repository work must pass `npm run audit:tokens:repository`; broader theme work should also run `npm run audit:tokens` and report any pre-existing backlog separately.

### Styling

- MUI `sx` and theme tokens are the default styling approach. `src/index.css` is limited to global concerns, and feature CSS is appropriate for third-party/map DOM that is awkward to target through `sx`.
- Reusable visual decisions belong in a shared style object, reusable component, or semantic theme token.
- Avoid duplicated internal/external or desktop/mobile declarations that can drift.
- Do not introduce CSS Modules or a preprocessor unless the project adopts them deliberately.

### Spacing

- `jtSpacing` and `navigation.spacing` values are numeric MUI spacing multipliers.
- Inside MUI `sx` spacing properties (`m`, `p`, `gap`, and directional aliases), pass numeric tokens directly. Do not redundantly wrap them in `theme.spacing()`.
- Use `theme.spacing()` when an actual CSS length string is required, including template strings, `calc()`, negative string values, or absolute-position calculations.
- Prefer existing semantic spacing tokens over unexplained literals. Add a named token when a value represents a repeated design decision.

### Responsive structure

- When desktop and mobile versions have meaningfully different markup or behavior, use clearly named components such as `DesktopNavbar` and `MobileNavbar`.
- Conditionally mount exactly one implementation at the shared parent breakpoint. Do not render both trees and hide one with CSS unless a documented hydration or layout constraint requires it.
- Responsive children own only their relevant state; the parent owns shared shell and layout concerns.
- Add concise one-line JSX comments before high-level return sections when their responsibility is not clear at a glance. Explain purpose rather than restating the element name.

### Interaction and fidelity

- When porting an approved Design System example into production, reproduce resting, hover, focus-visible, active, expanded, disabled, and responsive states as applicable.
- Preserve intentional geometry and motion exactly: width, height, radius, opacity, transform origin, duration, and easing are part of the design.
- Do not remove an interaction or animation during cleanup unless explicitly requested.
- Internal links use React Router `Link`. External links use anchors with `target="_blank"` and `rel="noopener noreferrer"` when opening a new tab.

### Home landing page

- Treat the current user-provided screenshots and explicit design decisions as authoritative for the landing-page rebuild. They supersede conflicting geometry, copy, navigation, or styling on the legacy ArcGIS site.
- Keep the map hero sticky while the introductory narrative is pulled over it, then continue with normal document scrolling.
- Preserve the shared home rail alignment through `--home-rail-inset`; do not introduce independent horizontal offsets in individual panels.
- The home rail is sticky within narrative panels. Do not reintroduce legacy global fixed-rail behavior on the rebuilt home.
- Angled panel boundaries must be opaque overlaps. Do not use a transparent clipped corner where the sticky map or another unintended layer can show through.
- Use feature-owned components under `src/features/home/` for panel-specific layouts and use `src/ui/` only for genuinely reusable primitives.
- Introduce editorial elements with restrained viewport motion and honor Framer Motion/reduced-motion behavior already established by shared animation components.

## Static Assets and Data

- `docs/team-documents/` holds each team's method document and latest data; it is gitignored and stays local. `docs/design-process/` holds design prototypes, canvases and prompt notes. Do not commit large raw sources (spreadsheets, decks) elsewhere in the repository.
- Static files live in `public/`, primarily under `public/images/`, `public/data/`, and `public/exports/`. Runtime data follows the directory contract in `docs/public-data-assets.md`: reusable and scenario geometry lives under `public/data/geospatial-assets/`, salinity outputs under `public/data/salinity/`, curated pattern outputs under `public/data/patterns/`, and internal-route-only inputs under `public/data/internal/`.
- Vite uses a non-root base path. Use `src/utils/baseUrl.ts` when constructing asset URLs that must respect `import.meta.env.BASE_URL`; do not assume deployment at `/`.
- Feature-owned static content lives near its feature, such as `src/features/repository/data/`.

## Validation

Before considering implementation work complete, validate in proportion to the change:

- Format edited files after changes. In a dirty worktree, use `npm exec prettier -- --write <edited-files...>` instead of the repository-wide `npm run format` command.
- Run `npm run build` for TypeScript or application changes.
- Run `npm run lint` when changes could affect lint rules or code quality.
- Run `npm run audit:tokens:changed` for every change to `src/`; it must report no violations. Also run `npm run audit:tokens` for theme, typography, palette, or component styling work, and report its pre-existing backlog separately.
- Inspect production components and their Design System examples for drift when both exist.
- Search for local overrides that bypass a semantic token changed by the task.
- For public-site fidelity work, use the legacy site at <https://delta-just-transitions-ucdavis.hub.arcgis.com/> only where it does not conflict with current user-provided references or approved rebuild decisions. Internal tools and new data experiences do not need to imitate pages that do not exist on the reference site.
- Check responsive behavior at the MUI `md` boundary and verify relevant interaction states.

Preserve unrelated work in a dirty worktree and avoid broad formatting or refactors outside the requested scope.
