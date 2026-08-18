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
npm run preview      # Preview the production build
```

## Application Entry and Routing

- `src/main.tsx` creates the React root and renders `AppProviders` and `PublicSiteShell`.
- `src/app/providers.tsx` installs the MUI `ThemeProvider`, `CssBaseline`, and `BrowserRouter`. The router basename comes from `import.meta.env.BASE_URL`.
- `src/app/PublicSiteShell.tsx` provides global route-change scroll restoration and renders `AppRouter`.
- `src/app/AppRouter.tsx` is the single source of truth for routes. Do not add routes in `main.tsx`.
- Large interactive routes are lazy-loaded with `React.lazy` and `Suspense`.

Current route groups:

- Public home: `/`
- Scenarios: `/scenarios`, `/scenarios/background-context`, `/scenarios/key-parameters`, and `/scenarios/:scenarioSlug`
- Repository: `/pages/project-documentation`, `/pages/service-learning`, and `/pages/resources`
- Data experiences: `/pages/scenario-explorer`, `/pages/scenario-explorer/internal`, and `/pages/regional-summary`
- Internal tools: `/pages/playground`, `/pages/baseline-exploration`, `/pages/watershed`, `/pages/kelp-diagram`, and `/design-system`

## Source Architecture

The `src` directory is organized by application role and feature:

- `src/app/`: providers, shared application shell, and route configuration.
- `src/features/home/`: public home page, its section components, and home content.
- `src/features/scenarios/`: scenario landing, background, parameter, template pages, plots, and scenario content.
- `src/features/repository/`: repository routes, shared repository layout, cards, tabs, timelines, and data.
- `src/features/scenario-explorer/`: scenario explorer page, charts, controls, types, and feature-local utilities.
- `src/features/regional-summary/`: regional summary page, tutorials, controls, map UI, and feature-local types.
- `src/ui/`: reusable site-wide UI primitives, cards, animation components, Navbar, and Footer.
- `src/map/`: reusable Mapbox infrastructure, map instances, layers, and KelpFusion overlays.
- `src/internal/`: internal-only tools, visualizations, KelpFusion domain logic, and the in-app Design System.
- `src/theme/`: MUI theme tokens, typography, spacing, component overrides, map/chart tokens, and TypeScript augmentation.
- `src/utils/`: small cross-feature helpers.

Keep route-specific code in its feature. Move code into `src/ui`, `src/map`, or `src/utils` only when it is genuinely reused across features.

## Key Composition

- `src/features/home/HomePage.tsx` composes Navbar, the lazy-loaded `HeroMap`, editorial home sections, and Footer.
- Repository pages use `RepoLayout`, `RepoHero`, and `RepoTabs` from `src/features/repository/`.
- Internal tools can use `src/internal/PageLayout.tsx` for a shared Navbar/hero/Footer shell.
- `src/ui/Navbar.tsx` contains `DesktopNavbar` and `MobileNavbar`; the parent mounts exactly one based on the MUI `md` breakpoint.
- `src/map/BaseMap.tsx` and `src/map/MapLayerOrchestrator.tsx` provide shared map infrastructure. Specialized map presentations live under `src/map/instances/` or within their owning feature.

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

## UI Implementation Rules

These are requirements for new UI and UI refactors.

### Semantic tokens and typography

- Use existing semantic theme tokens before raw colors, spacing, shadows, radii, or typography values.
- Never hardcode typography at a component call site when a semantic variant applies. This includes `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, and `textTransform`.
- Change shared typography decisions in `src/theme/typography.ts`. For example, navigation link weight belongs in `typography.navigationLabel`, not in `Navbar.tsx` or a Design System example.
- Consume variants with `<Typography variant="...">` or `typography: '...'` in `sx`.
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

## Static Assets and Data

- Static files live in `public/`, primarily under `public/images/`, `public/data/`, and `public/exports/`.
- Vite uses a non-root base path. Use `src/utils/baseUrl.ts` when constructing asset URLs that must respect `import.meta.env.BASE_URL`; do not assume deployment at `/`.
- Feature-owned static content lives near its feature, such as `src/features/home/content/`, `src/features/scenarios/content/`, and `src/features/repository/data/`.

## Validation

Before considering implementation work complete, validate in proportion to the change:

- Run `npm run format` after editing maintained files.
- Run `npm run build` for TypeScript or application changes.
- Run `npm run lint` when changes could affect lint rules or code quality.
- Run `npm run audit:tokens` for theme, typography, palette, or component styling work.
- Inspect production components and their Design System examples for drift when both exist.
- Search for local overrides that bypass a semantic token changed by the task.
- For public-site fidelity work, compare the rendered UI with <https://delta-just-transitions-ucdavis.hub.arcgis.com/>. Internal tools and new data experiences do not need to imitate pages that do not exist on the reference site.
- Check responsive behavior at the MUI `md` boundary and verify relevant interaction states.

Preserve unrelated work in a dirty worktree and avoid broad formatting or refactors outside the requested scope.
