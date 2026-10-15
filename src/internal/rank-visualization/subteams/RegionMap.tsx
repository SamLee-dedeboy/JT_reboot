// How each subteam cut up the same estuary.
//
// The comparison only works if every team is drawn in one frame, so all four stay
// on screen and the active one comes forward while the others drop to a hairline.
// Switching subteams then reads as the boundaries moving rather than as four
// separate maps, which is the finding: five teams, five defensible ways of
// dividing the Delta, almost none of them coincident.
//
// Eco-cultural has no outline here. Its geography is historic Tribal territory and
// specific cultural-practice sites are deliberately not mapped, so the panel says
// that rather than drawing a shape nobody agreed to publish.
//
// THE OUTLINES ARE NOT JOINED TO THE NUMBERS. The shapefile's region names do not
// match the keys the data arrays use (regionShapes.ts lists every gap), so this is
// a comparison layer beside the values, not a lookup onto them. Only EJ's three
// vulnerability classes line up exactly; see TODO.md before plotting values here.
import { Box, Typography } from '@mui/material'
import { TEAMS } from '../data'
import type { TeamKey } from '../data'
import { TeamMark } from '../drilldown/DrillBits'
import { useTeams } from '../components/teamPalette'
import { REGION_SHAPES, REGION_VIEWBOX, WATERWAY_PATH } from './regionShapes'

const TEAM_ORDER: TeamKey[] = ['ecology', 'recreation', 'environmentalJustice', 'economy']

export function RegionMap({ active }: { active: TeamKey }) {
  const teams = useTeams()
  const colorOf = (team: TeamKey) => teams.find((entry) => entry.key === team)?.color ?? ''
  const mine = REGION_SHAPES.filter((shape) => shape.team === active)
  const others = TEAM_ORDER.filter((team) => team !== active)

  if (mine.length === 0) return <NoOutline active={active} />

  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <Box
        component="svg"
        viewBox={`0 0 ${REGION_VIEWBOX.width} ${REGION_VIEWBOX.height}`}
        role="img"
        aria-label={`Delta regions as ${TEAMS.find((t) => t.key === active)?.name} draws them, with the other subteams' boundaries behind`}
        sx={{ width: '100%', maxWidth: 420, height: 'auto', display: 'block' }}
      >
        <path d={WATERWAY_PATH} fill="currentColor" opacity={0.1} />

        {/* Everyone else, as hairlines, so the active cut is read against them. */}
        {others.map((team) =>
          REGION_SHAPES.filter((shape) => shape.team === team).map((shape, i) => (
            <path
              key={`${team}-${i}`}
              d={shape.d}
              fill="none"
              stroke={colorOf(team)}
              strokeWidth={2.2}
              strokeDasharray="6 5"
              opacity={0.55}
            />
          )),
        )}

        {mine.map((shape, i) => (
          <path
            key={`${active}-${i}`}
            d={shape.d}
            fill={colorOf(active)}
            fillOpacity={0.16}
            stroke={colorOf(active)}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
        {TEAM_ORDER.map((team) => (
          <Box key={team} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <Box
              sx={{
                width: 14,
                height: 3,
                borderRadius: 2,
                bgcolor: colorOf(team),
                opacity: team === active ? 1 : 0.4,
              }}
            />
            <Typography
              variant="chartAxis"
              sx={{ color: team === active ? 'base.50' : 'base.300' }}
            >
              {TEAMS.find((entry) => entry.key === team)?.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

/** Named regions for the active team, so the outline has labels to read against. */
export function RegionList({ active }: { active: TeamKey }) {
  const names = REGION_SHAPES.filter((shape) => shape.team === active).map((shape) => shape.name)
  if (names.length === 0) return null
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {names.map((name) => (
        <Typography
          key={name}
          variant="chartAxis"
          sx={{
            px: 0.8,
            py: 0.3,
            borderRadius: 999,
            border: 1,
            borderColor: 'border.default',
            color: 'base.100',
          }}
        >
          {name}
        </Typography>
      ))}
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
        borderRadius: 1,
        border: 1,
        borderStyle: 'dashed',
        borderColor: 'border.default',
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TeamMark team={active} size={13} />
        <Typography variant="chartLabel">No boundary to draw</Typography>
      </Box>
      <Typography variant="body2" sx={{ color: 'base.100' }}>
        This criterion’s geography is historic Tribal territory, and specific cultural-practice
        sites are deliberately not mapped. Drawing an outline here would publish a boundary nobody
        agreed to.
      </Typography>
    </Box>
  )
}
