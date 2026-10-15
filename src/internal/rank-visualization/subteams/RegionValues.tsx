// The regional pattern behind a score: one small map per scenario.
//
// A rank has no geography. It is one number per scenario, Delta-wide, so it
// cannot be drawn onto a map. What can be drawn is the metric it rolled up from,
// region by region, with the rank as the caption. Six maps in a row, one scale,
// is what makes that collapse visible: the eye reads the pattern across the row
// and then the number each pattern became.
//
// Three rules hold throughout. Colour is value, never identity (team colour stays
// on the outline). Regions with nothing to place stay in the frame as dashed
// outlines, because dropping them would change the frame between maps. And a
// region click is a cell: it has a criterion, a scenario, a place and a period,
// which is exactly what the provenance modal takes.
import { Box, Typography, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTeams } from '../components/teamPalette'
import { cellFill } from '../data'
import type { TeamKey } from '../data'
import { CellDetail } from '../drilldown/CellDetail'
import { valueAt } from '../drilldown/cellValue'
import type { Cell } from '../drilldown/cellValue'
import { SCENARIO_NAME, fmtValue, isSigned } from '../drilldown/model'
import type { ScenarioKey } from '../drilldown/model'
import type { Dim } from '../drilldown/usePivot'
import { REGION_SHAPES, REGION_VIEWBOX, WATERWAY_PATH } from './regionShapes'
import { Choice } from './SubteamFrame'

type Reading = 'level' | 'change'

export interface RegionValuesProps {
  team: TeamKey
  scenarios: ScenarioKey[]
  /** The cell behind a shapefile region under one scenario; null where nothing lines up. */
  coordsFor: (region: string, scenario: ScenarioKey) => Record<Dim, string> | null
  /** What sits under each map: the subteam's own score, or the word for its absence. */
  caption: (scenario: ScenarioKey) => string
  /** What the fill measures, for the legend. */
  unitLabel: string
  /** Offer the change-against-Business-as-Usual reading as well as the level. */
  changeToggle?: boolean
}

const SCORE_SPAN = 5

export function RegionValues({
  team,
  scenarios,
  coordsFor,
  caption,
  unitLabel,
  changeToggle,
}: RegionValuesProps) {
  const theme = useTheme()
  const teams = useTeams()
  const outline = teams.find((entry) => entry.key === team)?.color ?? ''
  const shapes = REGION_SHAPES.filter((shape) => shape.team === team)
  const [reading, setReading] = useState<Reading>('level')
  const [inspect, setInspect] = useState<Record<Dim, string> | null>(null)

  // Every cell in the panel, so one scale serves every map.
  const grid = useMemo(() => {
    const out = new Map<string, { coords: Record<Dim, string>; cell: Cell } | null>()
    for (const scenario of scenarios) {
      for (const shape of shapes) {
        const coords = coordsFor(shape.name, scenario)
        out.set(`${scenario}|${shape.name}`, coords ? { coords, cell: valueAt(coords) } : null)
      }
    }
    return out
  }, [coordsFor, scenarios, shapes])

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

  const fillFor = (value: number | null): { fill: string; opacity: number } | null => {
    if (value === null) return null
    const strength = Math.min(1, Math.abs(value) / max)
    if (diverging) {
      return { fill: cellFill(direction * Math.sign(value) * strength * SCORE_SPAN), opacity: 1 }
    }
    return { fill: theme.palette.salinity.teal, opacity: 0.12 + strength * 0.88 }
  }

  const unmapped = shapes.filter((shape) => !coordsFor(shape.name, scenarios[0])).length

  return (
    <Box sx={{ display: 'grid', gap: 1.25 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
        {changeToggle && (
          <Choice
            label="Read as"
            value={reading}
            onChange={setReading}
            options={[
              { key: 'level', label: 'the value' },
              { key: 'change', label: 'difference from the Business as Usual baseline' },
            ]}
          />
        )}
        <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
          {reading === 'change'
            ? `fill: difference from baseline, up to ±${fmtValue(max, unit)}`
            : `fill: ${unitLabel}, up to ${fmtValue(max, unit)}`}
          {unmapped > 0 &&
            ` · ${unmapped} dashed ${unmapped === 1 ? 'region has' : 'regions have'} no value to place`}
        </Typography>
      </Box>

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
        }}
      >
        {scenarios.map((scenario) => (
          <Box key={scenario} sx={{ display: 'grid', gap: 0.5, alignContent: 'start' }}>
            <Box
              component="svg"
              viewBox={`0 0 ${REGION_VIEWBOX.width} ${REGION_VIEWBOX.height}`}
              role="img"
              aria-label={`${SCENARIO_NAME[scenario]}, ${unitLabel} by region`}
              sx={{ width: '100%', height: 'auto', display: 'block' }}
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
                            reading === 'change' ? ' (difference from baseline)' : ''
                          }`
                        : `${shape.name}: no value to place`}
                    </title>
                  </path>
                )
              })}
            </Box>
            <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
              {SCENARIO_NAME[scenario]}
            </Typography>
            <Typography variant="chartValue">{caption(scenario)}</Typography>
          </Box>
        ))}
      </Box>

      <CellDetail coords={inspect} onClose={() => setInspect(null)} />
    </Box>
  )
}
