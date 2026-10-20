// The regional pattern behind a score: one small map per scenario.
//
// A rank has no geography. It is one number per scenario, Delta-wide, so it
// cannot be drawn onto a map. What can be drawn is the metric it rolled up from,
// region by region, with the rank as the caption. One row, one scale, is what
// makes that collapse visible: the eye reads the pattern across the row and then
// the number each pattern became.
//
// Three rules hold throughout. Colour is value, never identity (outlines stay
// neutral). Regions with nothing to place stay in the frame as dashed outlines,
// because dropping them would change the frame between maps. And a region click
// is a cell: it has a criterion, a scenario, a place and a period, which is
// exactly what the provenance modal takes.
import { Box, Typography, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { cellFill } from '../data'
import type { TeamKey } from '../data'
import { CellDetail } from '../drilldown/CellDetail'
import { valueAt } from '../drilldown/cellValue'
import type { Cell, Coords } from '../drilldown/cellValue'
import { SCENARIO_NAME, fmtValue, isSigned } from '../drilldown/model'
import type { ScenarioKey } from '../drilldown/model'
import { REGION_SHAPES, REGION_VIEWBOX, WATERWAY_PATH } from './regionShapes'
import { Choice, DivergingLegend, Swatch } from './SubteamFrame'

type Reading = 'level' | 'change'

export interface RegionValuesProps {
  team: TeamKey
  scenarios: ScenarioKey[]
  /** The cell behind a shapefile region under one scenario; null where nothing lines up. */
  coordsFor: (region: string, scenario: ScenarioKey) => Coords | null
  /** The subteam's own score under each map. Omit where the maps feed no score. */
  caption?: (scenario: ScenarioKey) => string
  /** What the fill measures, for the legend. */
  unitLabel: string
  /** Offer the difference-from-baseline reading as well as the value. */
  changeToggle?: boolean
  /** Treat a value we inferred as no value: for screens the public sees. */
  hideInferred?: boolean
  /** Set the reading from outside (the breakout's Show switch) instead of offering a toggle. */
  reading?: Reading
  /** Scenarios kept in place but faded, so the row of maps never reshuffles. */
  dimmed?: ScenarioKey[]
  /** Leave the legend to the caller, which draws one for the whole panel. */
  hideLegend?: boolean
  /** Fill the height the caller gives, maps shrinking to fit, instead of growing with width. */
  fit?: boolean
  /** Shade a difference the way a value is shaded, the sign left to the number. */
  sameStyleForChange?: boolean
  /** Print each region's number on it, so the map reads without hovering. */
  showValues?: boolean
}

const SCORE_SPAN = 5

/** A formatted magnitude with no sign, so a legend can add its own. */
const unsigned = (text: string) => text.replace(/^[+\-−]\s*/, '')
const SWATCH_STEPS = [0.2, 0.4, 0.6, 0.8, 1]

export function RegionValues({
  team,
  scenarios,
  coordsFor,
  caption,
  unitLabel,
  changeToggle,
  hideInferred,
  reading: readingProp,
  dimmed = [],
  hideLegend,
  fit,
  sameStyleForChange,
  showValues,
}: RegionValuesProps) {
  const theme = useTheme()
  const shapes = REGION_SHAPES.filter((shape) => shape.team === team)
  const [readingState, setReading] = useState<Reading>('level')
  const reading = readingProp ?? readingState
  const [inspect, setInspect] = useState<Coords | null>(null)

  // Every cell in the panel, so one scale serves every map.
  const grid = useMemo(() => {
    const out = new Map<string, { coords: Coords; cell: Cell } | null>()
    for (const scenario of scenarios) {
      for (const shape of shapes) {
        const coords = coordsFor(shape.name, scenario)
        const cell = coords ? valueAt(coords) : null
        const shown = cell && hideInferred && cell.inferred ? { ...cell, value: null } : cell
        out.set(`${scenario}|${shape.name}`, coords && shown ? { coords, cell: shown } : null)
      }
    }
    return out
  }, [coordsFor, scenarios, shapes, hideInferred])

  const at = (scenario: ScenarioKey, region: string) => grid.get(`${scenario}|${region}`)
  const reads = (scenario: ScenarioKey, region: string): number | null => {
    const here = at(scenario, region)?.cell.value ?? null
    if (reading === 'level') return here
    const base = at('bau', region)?.cell.value ?? null
    return here === null || base === null ? null : here - base
  }

  const sample = [...grid.values()].find((entry) => entry?.cell.node)?.cell
  const node = sample?.node
  const unit = sample?.unit ?? 'score'
  const diverging = reading === 'change' || (node ? isSigned(node) : false)
  const direction = node?.betterHigher === false ? -1 : 1
  const max = Math.max(
    0.000001,
    ...scenarios.flatMap((scenario) =>
      shapes.map((shape) => Math.abs(reads(scenario, shape.name) ?? 0)),
    ),
  )

  // A difference from Business as Usual is coloured by its direction alone: the
  // teams put no scale on differences, so none is invented here. A level keeps the
  // team's own unit: a signed metric uses the score palette at its value, a
  // proportion fills from 0 to its maximum.
  // A score is already on the −5…+5 scale, so it takes that palette directly; a
  // difference or a measurement is placed against the largest value shown.
  const isScore = unit === 'score'
  const anyValue = scenarios.some((scenario) =>
    shapes.some((shape) => reads(scenario, shape.name) !== null),
  )
  const fillFor = (value: number | null): { fill: string; opacity: number } | null => {
    if (value === null) return null
    if (isScore && (reading === 'level' || sameStyleForChange))
      return { fill: cellFill(value), opacity: 1 }
    if (sameStyleForChange) {
      const share = Math.min(1, Math.abs(value) / max)
      return { fill: theme.palette.salinity.teal, opacity: 0.12 + share * 0.88 }
    }
    const strength = Math.min(1, Math.abs(value) / max)
    if (diverging) {
      return { fill: cellFill(direction * Math.sign(value) * strength * SCORE_SPAN), opacity: 1 }
    }
    return { fill: theme.palette.salinity.teal, opacity: 0.12 + strength * 0.88 }
  }

  /** A region's number as printed on it: as published, or signed against the baseline. */
  const mapText = (value: number) => {
    if (reading !== 'change') return fmtValue(value, unit)
    if (value === 0) return '0'
    return `${value > 0 ? '+' : '−'}${unsigned(fmtValue(Math.abs(value), unit))}`
  }
  const unmapped = shapes.filter((shape) => !coordsFor(shape.name, scenarios[0])).length
  const outline = theme.palette.base[200]

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.25,
        ...(fit ? { height: 1, minHeight: 0, gridTemplateRows: 'minmax(0, 1fr)' } : {}),
      }}
    >
      {changeToggle && (
        <Choice
          label="Show"
          value={reading}
          onChange={setReading}
          options={[
            { key: 'level', label: 'the value' },
            { key: 'change', label: 'the difference from Business as Usual' },
          ]}
        />
      )}

      <Box
        sx={{
          display: 'grid',
          // One row is the design: the eye reads across the scenarios. Only on a
          // narrow screen does it give that up, and then it halves rather than
          // dropping a single map onto a line of its own.
          gridTemplateColumns: {
            xs: `repeat(${Math.ceil(scenarios.length / 2)}, minmax(0, 1fr))`,
            md: `repeat(${scenarios.length}, minmax(0, 1fr))`,
          },
          gap: 1.5,
          ...(fit
            ? {
                gridTemplateColumns: `repeat(${scenarios.length}, minmax(0, 1fr))`,
                gridTemplateRows: 'minmax(0, 1fr)',
                minHeight: 0,
              }
            : {}),
        }}
      >
        {scenarios.map((scenario) => (
          <Box
            key={scenario}
            sx={{
              display: 'grid',
              gap: 0.5,
              alignContent: 'start',
              opacity: dimmed.includes(scenario) ? 0.2 : 1,
              transition: 'opacity 200ms ease',
              ...(fit ? { minHeight: 0, gridTemplateRows: 'auto minmax(0, 1fr)' } : {}),
            }}
          >
            {/* Two lines tall whether or not the name wraps, so the captions line up. */}
            {/* A fitted panel has the width for the table's own column heads. */}
            <Typography
              variant={fit ? 'chartTitle' : 'chartLabel'}
              sx={{ color: 'base.50', minHeight: fit ? undefined : 30 }}
              noWrap={fit}
            >
              {SCENARIO_NAME[scenario]}
            </Typography>
            {/* The map and its numbers share one box, sized to the map's own proportions,
                so a number sits on its region however the panel is shaped. */}
            <Box
              sx={
                fit
                  ? { minHeight: 0, containerType: 'size', display: 'grid', placeItems: 'center' }
                  : undefined
              }
            >
              <Box
                sx={{
                  position: 'relative',
                  ...(fit
                    ? {
                        width: `min(100cqw, calc(100cqh * ${REGION_VIEWBOX.width / REGION_VIEWBOX.height}))`,
                        height: `min(100cqh, calc(100cqw * ${REGION_VIEWBOX.height / REGION_VIEWBOX.width}))`,
                      }
                    : {
                        width: '100%',
                        aspectRatio: `${REGION_VIEWBOX.width} / ${REGION_VIEWBOX.height}`,
                      }),
                }}
              >
                <Box
                  component="svg"
                  viewBox={`0 0 ${REGION_VIEWBOX.width} ${REGION_VIEWBOX.height}`}
                  role="img"
                  aria-label={`${SCENARIO_NAME[scenario]}, ${unitLabel} by region`}
                  sx={{ width: '100%', height: '100%', display: 'block' }}
                >
                  <path d={WATERWAY_PATH} fill="currentColor" opacity={0.08} />
                  {shapes.map((shape) => {
                    const entry = at(scenario, shape.name)
                    const value = reads(scenario, shape.name)
                    const paint = fillFor(value)
                    return (
                      <path
                        key={shape.name}
                        d={shape.d}
                        fill={paint?.fill ?? 'none'}
                        fillOpacity={paint?.opacity ?? 0}
                        stroke={outline}
                        strokeWidth={entry ? 2.5 : 2}
                        strokeDasharray={entry ? undefined : '8 6'}
                        strokeLinejoin="round"
                        opacity={entry ? 1 : 0.45}
                        cursor={entry ? 'pointer' : undefined}
                        onClick={entry ? () => setInspect(entry.coords) : undefined}
                      >
                        <title>
                          {entry
                            ? `${shape.name}: ${value === null ? 'no value' : fmtValue(value, unit)}${
                                reading === 'change' ? ' (difference from Business as Usual)' : ''
                              }`
                            : `${shape.name}: no value to place`}
                        </title>
                      </path>
                    )
                  })}
                </Box>
                {showValues &&
                  shapes.map((shape) => {
                    const value = reads(scenario, shape.name)
                    if (value === null || !at(scenario, shape.name)) return null
                    return (
                      <Typography
                        key={shape.name}
                        variant="chartValue"
                        aria-hidden
                        noWrap
                        sx={{
                          position: 'absolute',
                          left: `${(shape.label[0] / REGION_VIEWBOX.width) * 100}%`,
                          top: `${(shape.label[1] / REGION_VIEWBOX.height) * 100}%`,
                          transform: 'translate(-50%, -50%)',
                          pointerEvents: 'none',
                          // A dark pill, so the number reads on any fill and off the edge of one.
                          color: 'common.white',
                          bgcolor: 'base.900',
                          px: 0.5,
                          borderRadius: 0.5,
                        }}
                      >
                        {mapText(value)}
                      </Typography>
                    )
                  })}
              </Box>
            </Box>
            {caption && (
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.6 }}>
                <Typography variant="body2" sx={{ color: 'base.100' }}>
                  score
                </Typography>
                <Typography variant="chartValueLarge">{caption(scenario)}</Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* One legend for the row: the scale the fills share, then the dashed case. */}
      {hideLegend ? null : !anyValue ? (
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          No published value to place on these maps yet.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 1.5 }}>
          {reading !== 'change' && (
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              {unitLabel}
            </Typography>
          )}
          {reading === 'change' ? (
            <DivergingLegend
              label="Difference from Business as Usual: the gap between the two values. Hover a region for both."
              min={`−${unsigned(fmtValue(max, unit))}`}
              max={`+${unsigned(fmtValue(max, unit))}`}
              note="Orange is worse than today, blue better. The ends of the ramp are the largest gaps on these maps."
            />
          ) : (
            <Typography variant="body2" sx={{ color: 'base.100' }}>
              {isScore ? '−5' : diverging ? `−${unsigned(fmtValue(max, unit))}` : fmtValue(0, unit)}{' '}
              {diverging
                ? [-1, -0.5, 0, 0.5, 1].map((step) => (
                    <Swatch key={step} tone={cellFill(direction * step * SCORE_SPAN)} />
                  ))
                : SWATCH_STEPS.map((step) => (
                    <Swatch
                      key={step}
                      tone={theme.palette.salinity.teal}
                      opacity={0.12 + step * 0.88}
                    />
                  ))}{' '}
              {isScore
                ? '+5'
                : diverging
                  ? `+${unsigned(fmtValue(max, unit))}`
                  : fmtValue(max, unit)}
              {diverging ? ', orange is worse, blue is better' : ''}
            </Typography>
          )}
          {unmapped > 0 && (
            <Typography variant="body2" sx={{ color: 'base.100' }}>
              <Swatch dashed /> no value to place
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: 'base.100' }}>
            Click a region to see where its value comes from.
          </Typography>
        </Box>
      )}

      <CellDetail coords={inspect} onClose={() => setInspect(null)} />
    </Box>
  )
}
