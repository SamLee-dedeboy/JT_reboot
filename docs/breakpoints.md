# Breakpoints

The site's responsive breakpoints, the three screen formats they define, and how to test them.
The values live in `src/theme/theme.ts`; the `xxl` key is registered in `src/theme/theme.types.d.ts`.

## Values

MUI's defaults, plus one custom key for 1080p-and-up monitors.

| Key   | Min width (CSS px) | Notes                    |
| ----- | ------------------ | ------------------------ |
| `xs`  | 0                  | MUI default              |
| `sm`  | 600                | MUI default              |
| `md`  | 900                | MUI default              |
| `lg`  | 1200               | MUI default              |
| `xl`  | 1536               | MUI default              |
| `xxl` | 1920               | Custom: desktop monitors |

## Three formats

| Format          | Range    | Keys             | Who lands here                                             |
| --------------- | -------- | ---------------- | ---------------------------------------------------------- |
| Phone           | < 900    | `xs`, `sm`       | Phones, portrait tablets                                   |
| Laptop / tablet | 900–1919 | `md`, `lg`, `xl` | Landscape tablets, every laptop, 1080p laptops at 125–150% |
| Desktop         | ≥ 1920   | `xxl`            | 1080p and 1200p monitors, 1440p, 4K at 150–200%            |

Within a format the in-between keys stay available for fine-tuning; MUI's own components rely on them.

## Widths are CSS pixels, not screen resolution

Media queries measure CSS pixels: the physical resolution divided by the OS display scaling.
The resolution on the box is not what the site sees.

| Screen                           | OS scaling  | CSS width          | Format          |
| -------------------------------- | ----------- | ------------------ | --------------- |
| 1920×1080 or 1920×1200 monitor   | 100%        | 1920               | Desktop         |
| 1920×1080 laptop                 | 125% / 150% | 1536 / 1280        | Laptop          |
| 2560×1440 monitor                | 100% / 125% | 2560 / 2048        | Desktop         |
| 4K monitor                       | 150% / 200% | 2560 / 1920        | Desktop         |
| MacBook Air 13 / Pro 14 / Pro 16 | default     | 1470 / 1512 / 1728 | Laptop          |
| iPad landscape                   | —           | 1024–1366          | Laptop / tablet |
| iPad portrait                    | —           | 744–1024           | Phone           |
| Phones                           | —           | 360–430            | Phone           |

1920×1080 and 1920×1200 differ only in height, so a width breakpoint treats them alike. Pages
pinned to the viewport's height (the scroll-driven panels) still need checking at short heights:
1366×768 and 1280×720 are the tightest common laptops.

## Rules

- Use `theme.breakpoints.up / down / between / only` in `sx` and `useMediaQuery`. Do not write raw
  `@media (max-width: …px)` values.
- `sx` breakpoint objects cascade upward: `{ lg: x }` also applies at `xl` and `xxl`. To change one
  range only, use `[theme.breakpoints.only('lg')]: { … }` so larger screens keep their design.
- When phone and laptop versions differ in markup, mount exactly one (see `AGENTS.md`,
  "Responsive structure").

## Known leftovers

These still use raw pixel queries and should move to `theme.breakpoints.down('xl')` /
`down('xxl')`:

- `src/theme/typography.ts`: the `button` variant's `1919.95px` and `1399.95px` steps
- `src/features/scenario-explorer/explorerType.ts`: the same two steps
- `src/features/scenario-explorer/components/DeltaMap.tsx`: six `1919.95px` queries
- `src/internal/BaselineExploration.tsx`: one `980px` query (internal page)

The `1399.95px` steps predate `xl` moving from 1400 to 1536, so they no longer line up with `xl`.

The page-level phone/laptop switches are not yet on one boundary: the navbar switches at `md`,
while Home, Story, Background and the scenario landing panels switch at `lg`.

## Testing in Chrome DevTools

Add these under DevTools → Settings → Devices → Add custom device. Fill in only the name, width,
height and device pixel ratio; set the type dropdown to **Desktop**; leave the user agent string
and every client-hint field empty.

| Device name        | Width | Height | DPR | Key · format  |
| ------------------ | ----- | ------ | --- | ------------- |
| Laptop 1080p @150% | 1280  | 720    | 1   | lg · laptop   |
| Laptop 1366×768    | 1366  | 768    | 1   | lg · laptop   |
| MacBook Air 13     | 1470  | 956    | 2   | lg · laptop   |
| Laptop 1080p @125% | 1536  | 864    | 1   | xl · laptop   |
| MacBook Pro 16     | 1728  | 1117   | 2   | xl · laptop   |
| Monitor 1080p      | 1920  | 1080   | 1   | xxl · desktop |
| Monitor 1200p      | 1920  | 1200   | 1   | xxl · desktop |
| Monitor 1440p      | 2560  | 1440   | 1   | xxl · desktop |

For phones and tablets, tick Chrome's built-in devices instead (they carry touch and the mobile
user agent): iPhone SE, the newest iPhone Pro Max, iPad Mini and iPad Air. Rotate the iPad Air for
landscape (1180×820).

The quickest check is three sizes: **1366×768** (short laptop), **1536×864** (the `xl` boundary)
and **1920×1080** (desktop). Set DevTools' zoom to 100%, not "Fit to window", when checking an
exact width.
