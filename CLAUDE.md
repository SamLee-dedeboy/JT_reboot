# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Just Transitions in the Delta — a UC Davis research project website about participatory scenario planning for equitable water management in the Sacramento-San Joaquin Delta. Built with React 19, TypeScript, Vite, and React Router.
This project is a rebuild from https://delta-just-transitions-ucdavis.hub.arcgis.com/
## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint (flat config, v9)
npm run preview   # Preview production build
```

## Architecture

**Routing:** BrowserRouter in `src/main.tsx` with 8 routes — home (`/`) renders `App.tsx`, all subpages under `/pages/*` (adaptation-scenarios, public-events, scenario-planning, contact-us, project-documentation, service-learning, resources).

**Home page (`App.tsx`):** Linear layout of components — Navbar, Hero, WhatIf, multiple InfoSections, OurApproach, ProjectGoals, ProjectScope, Funding, Footer.

**Subpages (`src/pages/`):** All wrap content in `PageLayout`, which provides Navbar + dark hero header + Footer. Content uses `.card-grid` and `.card` CSS classes for consistent layouts.

**Key reusable components:**
- `InfoSection` — configurable content block with image/text grid, supports `imagePosition`, `dark` variant, and `children` slot
- `Accordion` — expandable item list, used by ProjectGoals and ProjectScope
- `PageLayout` — shared wrapper for all subpages (not the home page)

**Navbar:** Dropdown menus with internal `Link` (react-router-dom) for site pages and `<a target="_blank">` for external links (Related Projects). Responsive hamburger at 768px breakpoint.

## Design System

All design decisions follow `JT_BRAND GUIDELINES_2025 (1).pdf` at project root.

**CSS variables** defined in `src/index.css`:
- Primary: `--color-dark-blue` (#253439), `--color-mid-blue` (#51a2bd), `--color-accent-green` (#7ed957)
- Fonts: `--font-heading` (Hammersmith One, uppercase for section headers), `--font-body` (Proxima Nova)
- `--gradient-title` — blue-to-green gradient for decorative text

**Styling approach:** One CSS file per component (component-scoped). Responsive breakpoint at 768px. No CSS modules or preprocessors.

## Static Assets

Images in `public/images/` (e.g., `hero-title.png` for the hero banner). Referenced as `/images/filename` in components.


## Validation:
Always go back to https://delta-just-transitions-ucdavis.hub.arcgis.com/ and make sure the UIs are the same.