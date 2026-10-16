// The outline each subteam drew, with the other subteams' behind it.
//
// Four teams published a geography: Ecology's estuarine subregions, Recreation's
// four regions, EJ's vulnerability classes and Economy's water-agency zones. They
// do not line up, and the disagreement is a finding, so the map always shows all
// four and brings the active team's forward. Eco-cultural has no outline and says
// why. Colour here is deliberately neutral: this page keeps hue for values.
import { Box, Typography, useTheme } from '@mui/material'
import { TEAMS } from '../data'
import type { TeamKey } from '../data'
import { TeamMark } from '../drilldown/DrillBits'
import { REGION_SHAPES, REGION_VIEWBOX, WATERWAY_PATH } from './regionShapes'
import type { RegionShape } from './regionShapes'

const TEAM_ORDER: TeamKey[] = ['ecology', 'recreation', 'environmentalJustice', 'economy']

export function RegionMap({ active, labels = true }: { active: TeamKey; labels?: boolean }) {
  const theme = useTheme()
  const mine = REGION_SHAPES.filter((shape) => shape.team === active)
  const others = TEAM_ORDER.filter((team) => team !== active)

  if (mine.length === 0) return <NoOutline active={active} />

  return (
    <Box
      component="svg"
      viewBox={`0 0 ${REGION_VIEWBOX.width} ${REGION_VIEWBOX.height}`}
      role="img"
      aria-label={`Delta regions drawn using ${TEAMS.find((t) => t.key === active)?.name} boundaries, with other subteam boundaries behind them`}
      sx={{ width: '100%', maxWidth: 420, height: 'auto', display: 'block' }}
    >
      <path d={WATERWAY_PATH} fill="currentColor" opacity={0.1} />

      {/* Everyone else, as dashed hairlines, so the active cut is read against them. */}
      {others.map((team) =>
        REGION_SHAPES.filter((shape) => shape.team === team).map((shape, i) => (
          <path
            key={`${team}-${i}`}
            d={shape.d}
            fill="none"
            stroke={theme.palette.base[400]}
            strokeWidth={2}
            strokeDasharray="6 5"
          />
        )),
      )}

      {mine.map((shape, i) => (
        <path
          key={`${active}-${i}`}
          d={shape.d}
          fill={theme.palette.base[50]}
          fillOpacity={0.12}
          stroke={theme.palette.base[50]}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      ))}

      {labels && mine.map((shape, i) => <Label key={`label-${active}-${i}`} shape={shape} />)}
    </Box>
  )
}

function NoOutline({ active }: { active: TeamKey }) {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gap: 0.75,
        p: theme.jtSpacing.component.md,
        maxWidth: 420,
        alignContent: 'start',
        borderRadius: 1,
        border: 1,
        borderStyle: 'dashed',
        borderColor: 'border.default',
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
        <TeamMark team={active} size={13} />
        <Typography variant="chartLabel">No boundary to draw</Typography>
      </Box>
      <Typography variant="body2" sx={{ color: 'base.100' }}>
        This criterion covers historic Tribal territory. Specific cultural-practice sites are
        deliberately not mapped, and no one agreed to publish an outline for this geography.
      </Typography>
    </Box>
  )
}

/** In viewBox units; the map renders at about half scale, so this is ~11px on screen. */
const LABEL_SIZE = 21

/** Names longer than one word-pair get two lines, split at the space nearest the middle. */
function splitName(name: string): string[] {
  if (name.length <= 14) return [name]
  const spaces = [...name].map((ch, i) => (ch === ' ' ? i : -1)).filter((i) => i > 0)
  if (spaces.length === 0) return [name]
  const mid = name.length / 2
  const at = spaces.reduce((best, i) => (Math.abs(i - mid) < Math.abs(best - mid) ? i : best))
  return [name.slice(0, at), name.slice(at + 1)]
}

/** The region's name, set inside its fattest part with a dark halo so it reads over any fill. */
export function Label({ shape, size = LABEL_SIZE }: { shape: RegionShape; size?: number }) {
  const theme = useTheme()
  const [x, y] = shape.label
  const lines = splitName(shape.name)
  const first = lines.length === 1 ? 0 : -size * 0.6
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily={theme.typography.fontFamily}
      fontSize={size}
      fill={theme.palette.base[50]}
      stroke={theme.palette.base[900]}
      strokeWidth={size / 4}
      strokeLinejoin="round"
      paintOrder="stroke"
      pointerEvents="none"
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? first : size * 1.15}>
          {line}
        </tspan>
      ))}
    </text>
  )
}
