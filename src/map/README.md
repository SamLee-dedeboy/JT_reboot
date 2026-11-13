# Maps

The Mapbox maps the public site draws. Nothing here imports from a feature or from
`src/internal/`; internal-only maps (the drinking-water station map, KelpFusion) live in
`src/internal/delta-stations/` and `src/internal/kelp/`.

## Shared pieces

| File           | What it does                                                                  |
| -------------- | ----------------------------------------------------------------------------- |
| `BaseMap.tsx`  | The one Mapbox map component every map starts from: access token and style    |
| `cameras.ts`   | Every camera position on the public site, grouped by page. Change a view here |
| `mapStyles.ts` | The Mapbox styles: Delta, hero, salinity results                              |

## `hero/`: the home page's animated salinity map

| File                       | What it does                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| `HeroSalinityMap.tsx`      | The map behind the home page title: Suisun Bay camera plus the animation                        |
| `HeroSalinityLayer.tsx`    | Plays Water Year 2019's 155 salinity frames, crossfading one tileset into the next              |
| `heroSalinityFrames.ts`    | Which frames sit in which of the 11 tilesets, and their source and layer ids                    |
| `heroSalinityAnimation.ts` | The playback steps (ready check, apply a frame, advance), kept apart so they can be unit tested |

## `background/`: the Background page's map

| File                            | What it does                                                            |
| ------------------------------- | ----------------------------------------------------------------------- |
| `ScenariosBackgroundMap.tsx`    | The map on /scenarios/background-context, with its info overlay         |
| `ScenariosBackgroundLayers.tsx` | The layers each step of that page turns on (overview, rivers, flow, X2) |

## `scenarios/`: the scenario story maps

Used by each scenario's story page (`IntroductionPage`) and the modeling overview.

| File                   | What it does                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `config.ts`            | Per scenario: layers, legend, annotations, highlight colors, and which bounds from `cameras.ts` |
| `Layers.tsx`           | Draws a scenario's layers                                                                       |
| `Camera.tsx`           | Moves the camera as the reader scrolls                                                          |
| `Annotations.tsx`      | On-map labels                                                                                   |
| `Legend.tsx`           | The map key                                                                                     |
| `SalinitySnapshot.tsx` | One still frame of the hero salinity data, for a scenario that sets `salinitySnapshotFrame`     |
| `flowArrows.ts`        | The arrows showing water movement                                                               |
| `patterns.ts`          | Hatch and marker images registered with the map                                                 |
| `symbolSwatch.ts`      | A legend swatch's look, shared with the scenario chips                                          |
