# Just Transitions in the Delta

A React rebuild of the [Just Transitions in the Delta](https://delta-just-transitions-ucdavis.hub.arcgis.com/) website, a UC Davis research project about participatory scenario planning for equitable water management in the Sacramento-San Joaquin Delta.

Built with React 19, TypeScript, Vite, React Router, MUI, Mapbox, D3, and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## How `src` Is Organized

The `src` folder is organized by website role rather than by file type. Components that are reused across pages live in shared folders, while route-level experiences live near the components they belong to.

```text
src/
  App.tsx
  LandingPage.tsx
  main.tsx
  index.css
  components/
    animation/
    common/
    home/
    internal/
    maps/
    repo/
    visualizations/
  data/
  design/
  lib/
  theme/
  utils/
```

## App Entry

`src/main.tsx` creates the React root, installs the MUI `ThemeProvider`, applies `CssBaseline`, and defines all routes.

Current routes:

| Path | Component |
| --- | --- |
| `/` | `App` / `LandingPage` |
| `/pages/project-documentation` | `components/repo/ProjectDocumentation` |
| `/pages/service-learning` | `components/repo/ServiceLearning` |
| `/pages/resources` | `components/repo/Resources` |
| `/pages/playground` | `components/internal/Playground` |
| `/pages/watershed` | `components/internal/Watershed` |
| `/pages/kelp-diagram` | `components/internal/KelpDiagram` |
| `/design-system` | `design/DesignSystem` |

`src/App.tsx` is intentionally small. It renders `LandingPage`, which composes the public home page from the home-section components.

## Components

### `components/common`

Reusable site primitives used across public pages, repository pages, internal tools, and the design system.

- `Navbar` and `Footer` provide the global site frame.
- `Logo`, `Icon`, `Eyebrow`, `Highlight`, `Section`, and `SectionHead` are shared presentation primitives.
- `NavRail` is a reusable scroll-spy side rail. It accepts section items and defaults to the home-page section list.

Use this folder for components that are self-contained and not tied to one page or feature area.

### `components/animation`

Animation-only UI wrappers.

- `ScrollReveal` wraps content in a Framer Motion viewport reveal while respecting reduced-motion preferences.

Use this folder for reusable animated components whose main purpose is motion behavior.

### `components/home`

Public landing-page sections.

- `Foundations`, `HowItWorks`, `MissionBand`, `OurApproachSection`, `Stakes`, and `WhatIfSectionEditorial` build the home page.
- `WhatIfSection` is a legacy animated prompt strip kept separate from the current editorial section.

These components are composed by `LandingPage.tsx` and should stay focused on the public home-page narrative.

### `components/repo`

Repository-facing pages and supporting components.

Route-level pages:

- `ProjectDocumentation`
- `ServiceLearning`
- `Resources`

Shared repository components:

- `RepoLayout`, `RepoHero`, and `RepoTabs` provide the repository page shell and navigation.
- `Timeline`, `StudioShowcase`, `DocCard`, `ReferenceCard`, and `ArticleAccordion` render repository content.

Use this folder for anything under the navbar's Repository menu.

### `components/internal`

Internal project tools and their shared shell.

- `Playground` combines the water-quality timeline with map views.
- `Watershed` shows the internal watershed scenario dashboard.
- `KelpDiagram` provides a standalone KelpFusion map view.
- `PageLayout` is the shared internal-tool page wrapper.

Use this folder for routes under the navbar's Internal menu.

### `components/maps`

Mapbox and map-overlay components.

- `HeroMap` renders the decorative landing-page map.
- `MapContainer` is the playground map container.
- `MapLayerOrchestrator` coordinates map layers for playground state.
- `KelpFusionMap` hosts the KelpFusion set visualization map.
- `layers/` contains Mapbox layer/source components and constants.
- `kelp/` contains KelpFusion overlay controls, SVG overlay drawing, and station-coordinate helpers.

### `components/visualizations`

Data visualizations that are not general-purpose UI.

- `GanttChart` renders the water-quality timeline, D3 status bars, brush selection, and related controls.

## Data

`src/data` contains static content consumed by the website:

- `homeContent.ts` drives repeated home-page copy and icon-backed content.
- `docYears.ts` provides repository document/timeline content.
- `resources.ts` provides references and articles.
- `studios.ts` provides service-learning studio content.

## Design System

`src/design` contains the in-app design-system reference at `/design-system`.

It documents and previews the current visual system, including color, typography, logo usage, numbering, cards, and common component examples. It is an internal reference route, not part of the public home-page flow.

## Theme

`src/theme` owns the MUI design system.

- `muiTheme.ts` defines palette tokens, spacing scales, typography variants, component overrides, numbering styles, and logo wordmark sizing.
- `muiTheme.d.ts` augments MUI TypeScript types for custom theme fields and typography variants.

Prefer theme values through MUI `sx` over local CSS or hardcoded spacing/color values.

## Libraries

`src/lib` contains non-React domain logic.

- `lib/kelp` contains the KelpFusion graph, topology, tension, and waterway-routing utilities used by map overlays.

Keep algorithmic or data-processing code here rather than inside React components when it can stand alone.

## Utilities

`src/utils` contains small shared helpers.

- `baseUrl.ts` builds asset URLs that respect the Vite base path.
- `highlightText.tsx` transforms text into highlighted React nodes using the common highlight component.

## Global Styles

`src/index.css` is intentionally limited to global concerns: font imports, root sizing, and document-level resets. Component styling should generally use MUI `sx` and the theme.

Static images and other public assets live in `public/` and are referenced with paths such as `/images/...`, usually through `assetUrl(...)`.
