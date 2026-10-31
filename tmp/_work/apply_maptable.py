import sys

S = sys.argv[1]


def ed(p, pairs):
    path = f'{S}/{p}'
    s = open(path, encoding='utf-8').read()
    for o, n in pairs:
        assert s.count(o) == 1, (p, o[:80], s.count(o))
        s = s.replace(o, n)
    open(path, 'w', encoding='utf-8', newline='').write(s)


R = 'internal/rank-visualization/subteams/RegionValues.tsx'
ed(R, [
    ("import { Box, Typography, useTheme } from '@mui/material'",
     "import { Box, ButtonBase, Typography, useTheme } from '@mui/material'"),
    ("import { useEffect, useMemo, useState } from 'react'",
     "import { useEffect, useMemo, useState } from 'react'\nimport { ranking } from '../../../theme'"),
    ("""   */
  scorePerPoint?: number
}""", """   */
  scorePerPoint?: number
  /**
   * Number the regions on the maps and list every value in one table beneath,
   * a row per region under the maps' own columns. Picking a row outlines that
   * region on every map and dims the rest; `hint` says so above the table.
   */
  regionTable?: { hint: string; noValue: string }
}"""),
    ("""  onScale,
  scorePerPoint,
}: RegionValuesProps) {""", """  onScale,
  scorePerPoint,
  regionTable,
}: RegionValuesProps) {"""),
    ("""  const [inspect, setInspect] = useState<Coords | null>(null)
""", """  const [inspect, setInspect] = useState<Coords | null>(null)
  /** The region picked in the table, outlined on every map. */
  const [picked, setPicked] = useState<string | null>(null)
"""),
    ("""  const unmapped = shapes.filter((shape) => !coordsFor(shape.name, scenarios[0])).length
  const outline = theme.palette.base[200]
""", """  const unmapped = shapes.filter((shape) => !coordsFor(shape.name, scenarios[0])).length
  const outline = theme.palette.base[200]
  // With the table: the regions that have a cell anywhere, numbered in map order,
  // and a lead column on the maps' row so the table's values sit under their maps.
  const listed = regionTable
    ? shapes.filter((shape) => scenarios.some((scenario) => at(scenario, shape.name)))
    : []
  const number = (region: string) => listed.findIndex((shape) => shape.name === region) + 1
  const columns = `repeat(${scenarios.length}, minmax(0, 1fr))`
  const tableColumns = `${ranking.mapRegionLabel}px ${columns}`
  /** A region's value in the table: blue where better, red where worse, as the table. */
  const toneFor = (value: number | null) =>
    value === null || value === 0 || reading !== 'change'
      ? theme.palette.base[value === null ? 300 : 50]
      : direction * value > 0
        ? theme.chart.voting.above
        : theme.chart.voting.belowText
"""),
    ("""        ...(fit
          ? {
              height: 1,
              minHeight: 0,
              gridTemplateRows: 'minmax(0, 1fr)',
            }
          : {}),
      }}
    >""", """        ...(fit
          ? {
              height: 1,
              minHeight: 0,
              gridTemplateRows: regionTable ? 'minmax(0, 1fr) auto auto' : 'minmax(0, 1fr)',
            }
          : {}),
      }}
    >"""),
    ("""          ...(fit
            ? {
                gridTemplateColumns: `repeat(${scenarios.length}, minmax(0, 1fr))`,
                gridTemplateRows: 'minmax(0, 1fr)',
                minHeight: 0,
              }
            : {}),
        }}
      >
        {scenarios.map((scenario) => (""", """          ...(fit
            ? {
                gridTemplateColumns: regionTable ? tableColumns : columns,
                gridTemplateRows: 'minmax(0, 1fr)',
                minHeight: 0,
              }
            : {}),
        }}
      >
        {regionTable && <Box aria-hidden />}
        {scenarios.map((scenario) => ("""),
    ("""                    const entry = at(scenario, shape.name)
                    const value = reads(scenario, shape.name)
                    const paint = paintAt(scenario, shape.name, value)
                    return (
                      <path
                        key={shape.name}
                        d={shape.d}
                        fill={paint?.fill ?? 'none'}
                        fillOpacity={paint?.opacity ?? 0}
                        stroke={outline}
                        strokeWidth={entry ? 2.5 : 2}""", """                    const entry = at(scenario, shape.name)
                    const value = reads(scenario, shape.name)
                    const paint = paintAt(scenario, shape.name, value)
                    const lit = picked === shape.name
                    // A region picked in the table: outlined; the others recede.
                    const fade = picked !== null && !lit ? 0.3 : 1
                    return (
                      <path
                        key={shape.name}
                        d={shape.d}
                        fill={paint?.fill ?? 'none'}
                        fillOpacity={(paint?.opacity ?? 0) * fade}
                        stroke={lit ? theme.palette.common.white : outline}
                        strokeWidth={lit ? 6 : entry ? 2.5 : 2}"""),
    ("""                {showValues &&
                  shapes.map((shape) => {
                    const value = reads(scenario, shape.name)
                    if (value === null || !at(scenario, shape.name)) return null""", """                {regionTable &&
                  listed.map((shape) => (
                    <Typography
                      key={shape.name}
                      variant="chartTitle"
                      aria-hidden
                      sx={{
                        position: 'absolute',
                        left: `${(shape.label[0] / REGION_VIEWBOX.width) * 100}%`,
                        top: `${(shape.label[1] / REGION_VIEWBOX.height) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        color: picked && picked !== shape.name ? 'base.300' : 'common.white',
                        textShadow: (t) => `0 0 4px ${t.palette.base[900]}`,
                      }}
                    >
                      {number(shape.name)}
                    </Typography>
                  ))}
                {showValues &&
                  !regionTable &&
                  shapes.map((shape) => {
                    const value = reads(scenario, shape.name)
                    if (value === null || !at(scenario, shape.name)) return null"""),
    ("""      {/* One legend for the row: the scale the fills share, then the dashed case. */}""",
     """      {regionTable && (
        <Typography variant="body2" sx={{ color: 'base.200' }}>
          {picked ? `${picked}: ${regionTable.hint}` : regionTable.hint}
        </Typography>
      )}
      {regionTable && (
        <Box
          role="group"
          aria-label={regionTable.hint}
          sx={{ display: 'grid', borderTop: 1, borderColor: 'border.default' }}
        >
          {listed.map((shape) => {
            const on = picked === shape.name
            return (
              <ButtonBase
                key={shape.name}
                aria-pressed={on}
                onClick={() => setPicked(on ? null : shape.name)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: tableColumns,
                  columnGap: 1.5,
                  alignItems: 'center',
                  justifyItems: 'center',
                  minHeight: ranking.breakoutRow.score,
                  borderBottom: 1,
                  borderColor: 'border.subtle',
                  bgcolor: on ? 'translucent.primaryGreenSubtle' : 'transparent',
                  boxShadow: on ? `inset 3px 0 0 ${theme.palette.primary.main}` : 'none',
                  '&:hover': { bgcolor: 'translucent.100' },
                  '&.Mui-focusVisible': { outline: 2, outlineColor: 'primary.main' },
                }}
              >
                <Box sx={{ justifySelf: 'start', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="captionSmall"
                    component="span"
                    sx={{
                      width: 22,
                      height: 22,
                      flex: 'none',
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      border: on ? 0 : 1,
                      borderColor: 'border.strong',
                      bgcolor: on ? 'common.white' : 'transparent',
                      color: on ? 'base.900' : 'base.50',
                    }}
                  >
                    {number(shape.name)}
                  </Typography>
                  <Typography variant="body2" component="span" sx={{ color: 'base.50' }}>
                    {shape.name}
                  </Typography>
                </Box>
                {scenarios.map((scenario) => {
                  const value = at(scenario, shape.name) ? reads(scenario, shape.name) : null
                  return (
                    <Typography
                      key={scenario}
                      variant="body2"
                      component="span"
                      sx={{
                        color: toneFor(value),
                        opacity: dimmed.includes(scenario) ? 0.2 : 1,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {value === null ? regionTable.noValue : mapText(value)}
                    </Typography>
                  )
                })}
              </ButtonBase>
            )
          })}
        </Box>
      )}

      {/* One legend for the row: the scale the fills share, then the dashed case. */}"""),
])

ed('theme/theme.ts', [
    ("  barOpacity: 0.7,\n", "  barOpacity: 0.7,\n  /** The map view's region table: the width of its region-name column. */\n  mapRegionLabel: 190,\n"),
])

ed('features/scenarios/ranking/breakout/components/Maps.tsx', [
    ("""          hideInferred
          showValues
        />""", """          hideInferred
          showValues
          regionTable={{ hint: UI.mapPickRegion, noValue: UI.forthcoming }}
        />"""),
])
ed('features/scenarios/ranking/breakout/model/labels.ts', [
    ("  mapMeasurePicker: 'Measure on the map',\n",
     "  mapMeasurePicker: 'Measure on the map',\n  /** Above the map view's region table. */\n  mapPickRegion: 'Pick an area below to outline it on every map; pick it again to clear.',\n"),
])
print('ok')
