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
    <Box sx={(theme) => ({ px: theme.jtSpacing.page.x, py: theme.jtSpacing.section.sm })}>
      <Box sx={{ maxWidth: DRILL_CARD_WIDTH, display: 'grid', gap: 3 }}>
        <Box
          component="nav"
          aria-label="Subteam"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}
        >
          {TEAMS.map((entry) => (
            <SubteamTab
              key={entry.key}
              team={entry.key}
              name={entry.name}
              reaches={SUBTEAM_PROFILES[entry.key].reaches}
              active={entry.key === team}
              onClick={() => setTeam(entry.key)}
            />
          ))}
        </Box>
        <View />
      </Box>
    </Box>
  )
}

function SubteamTab({
  team,
  name,
  reaches,
  active,
  onClick,
}: {
  team: TeamKey
  name: string
  reaches: string
  active: boolean
  onClick: () => void
}) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={active}
      sx={{
        display: 'grid',
        gap: 0.2,
        justifyItems: 'start',
        textAlign: 'left',
        px: 1.25,
        py: 0.9,
        borderRadius: 1,
        border: 1,
        borderColor: active ? 'primary.main' : 'border.default',
        bgcolor: active ? 'translucent.100' : 'transparent',
        '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TeamMark team={team} size={13} />
        <Typography variant="chartLabel" sx={{ color: active ? 'common.white' : 'base.100' }}>
          {name}
        </Typography>
      </Box>
      <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
        {`reaches the score: ${reaches}`}
      </Typography>
    </ButtonBase>
  )
}
