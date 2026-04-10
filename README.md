# Just Transitions in the Delta

A rebuild of the [Just Transitions in the Delta](https://delta-just-transitions-ucdavis.hub.arcgis.com/) website — a UC Davis research project on participatory scenario planning for equitable water management in the Sacramento–San Joaquin Delta.

Built with **React 19**, **TypeScript**, **Vite**, and **React Router**.

## Getting Started

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:5173
npm run build     # TypeScript check + production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Project Structure

```
src/
├── components/   # Reusable UI components (Navbar, Hero, InfoSection, Accordion, ...)
├── pages/        # Route pages wrapped in PageLayout
├── App.tsx       # Home page (linear composition of components)
├── main.tsx      # BrowserRouter + route definitions
└── index.css     # Global CSS variables (colors, fonts) + base styles

public/images/    # Static assets (hero images, scenario photos, logos)
```

## Routing

The app uses `react-router-dom` with the following routes:

| Path                              | Page                       |
| --------------------------------- | -------------------------- |
| `/`                               | Home (`App.tsx`)           |
| `/pages/adaptation-scenarios`     | Adaptation Scenarios       |
| `/pages/public-events`            | Public Events              |
| `/pages/scenario-planning`        | Participatory Scenario Planning |
| `/pages/contact-us`               | Contact Us                 |
| `/pages/project-documentation`    | Project Documentation      |
| `/pages/service-learning`         | Service Learning           |
| `/pages/resources`                | References & Resources     |

## Design System

All styling follows the project's brand guidelines (`JT_BRAND GUIDELINES_2025 (1).pdf` at the repo root).

**Primary colors** (defined as CSS variables in `src/index.css`):

- `--color-dark-blue` `#253439` — main background
- `--color-mid-blue` `#51a2bd` — accents
- `--color-accent-green` `#7ed957` — headings, buttons, highlights

**Fonts:**

- `--font-heading` — Hammersmith One (uppercase for section headers)
- `--font-body` — Proxima Nova

Each component owns its CSS file (`Component.tsx` + `Component.css`). Responsive breakpoint at 768px.

## Reference

This project recreates the original ArcGIS Hub site at:
https://delta-just-transitions-ucdavis.hub.arcgis.com/

The Adaptation Scenarios page recreates content from the ArcGIS StoryMap:
https://storymaps.arcgis.com/stories/c73fea2904ad400ea5a8e4d3d279650d
