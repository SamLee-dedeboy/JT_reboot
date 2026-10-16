// The subteam-first half of the page.
//
// The scenario-first half asks which future wins, and to answer it every criterion
// has to collapse into one commensurable number. This half asks what each subteam
// looked at and what they found, which needs no commensurability, and so can show
// the work the other half has to leave out.
import { Box, ButtonBase, Typography } from '@mui/material'
import { useState } from 'react'
import { TEAMS } from '../data'
import type { TeamKey } from '../data'
import { TeamMark } from '../drilldown/DrillBits'
import { DRILL_CARD_WIDTH } from '../drilldown/scales'
import EcologyView from './EcologyView'
import EconomyView from './EconomyView'
import EcoCulturalView from './EcoCulturalView'
import EjView from './EjView'
import RecreationView from './RecreationView'
import { SUBTEAM_PROFILES } from './profiles'

const VIEWS: Record<TeamKey, () => React.JSX.Element> = {
  ecology: EcologyView,
  recreation: RecreationView,
  environmentalJustice: EjView,
  economy: EconomyView,
  ecoCultural: EcoCulturalView,
}

export default function SubteamPages() {
  const [team, setTeam] = useState<TeamKey>('ecology')
  const View = VIEWS[team]

  return (
    <Box
      sx={(theme) => ({
        px: theme.jtSpacing.page.x,
        py: theme.jtSpacing.section.sm,
        // The internal layout spaces prose with a margin under every <p>; these
        // pages space with grid gaps, and chart labels are <p>s too, so the margin
        // would shift every label off its cell.
        '&& p': { mb: 0 },
      })}
    >
      <Box
        sx={(theme) => ({
          maxWidth: DRILL_CARD_WIDTH,
          display: 'grid',
          gap: theme.jtSpacing.section.xs,
        })}
      >
        {/* One strip, five segments: the team is the page, so the switch reads as tabs. */}
        <Box
          component="nav"
          aria-label="Subteam"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
            gap: 0.5,
            p: 0.5,
            borderRadius: 2,
            bgcolor: 'base.700',
            border: 1,
            borderColor: 'border.subtle',
          }}
        >
          {TEAMS.map((entry) => (
            <SubteamTab
              key={entry.key}
              team={entry.key}
              name={entry.name}
              topic={SUBTEAM_PROFILES[entry.key].topic}
              active={entry.key === team}
              onClick={() => setTeam(entry.key)}
            />
          ))}
        </Box>
        <View key={team} />
      </Box>
    </Box>
  )
}

function SubteamTab({
  team,
  name,
  topic,
  active,
  onClick,
}: {
  team: TeamKey
  name: string
  topic: string
  active: boolean
  onClick: () => void
}) {
  return (
    <ButtonBase
      onClick={onClick}
      role="tab"
      aria-selected={active}
      sx={{
        display: 'grid',
        gap: 0.5,
        justifyItems: 'start',
        alignContent: 'start',
        textAlign: 'left',
        px: 1.5,
        py: 1.25,
        borderRadius: 1.5,
        bgcolor: active ? 'translucent.200' : 'transparent',
        boxShadow: active ? 'inset 0 -2px 0 0 currentColor' : 'none',
        color: active ? 'primary.main' : 'base.100',
        '&:hover, &.Mui-focusVisible': { bgcolor: 'translucent.100' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <TeamMark team={team} size={14} />
        <Typography variant="chartLabel" sx={{ color: active ? 'base.50' : 'base.100' }}>
          {name}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: active ? 'base.50' : 'base.100' }}>
        {topic}
      </Typography>
    </ButtonBase>
  )
}
