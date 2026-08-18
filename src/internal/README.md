# Internal modules

This directory contains experimental, diagnostic, or unresolved application areas that are not currently part of the supported public feature structure.

Each module should eventually be promoted into `src/features`, extracted into shared infrastructure, or removed. A module is ready for promotion when its routes and purpose are established, its shared and feature-specific responsibilities are separated, it follows the shared MUI theme, and it passes build and lint checks.

Supported public features must not import from `src/internal`. Internal modules may import from `theme`, `ui`, `map`, `data`, `lib`, and `utils`.
