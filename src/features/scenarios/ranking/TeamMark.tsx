// A criterion's icon in its own colour, beside its name wherever the ranking names it.
import { Box } from '@mui/material'
import TeamIcon from '../../../ui/TeamIcon'
import { TEAMS } from './model/teams'
import type { TeamKey } from './model/teams'

export function TeamMark({ team, size = 13 }: { team: TeamKey; size?: number }) {
  const color = TEAMS.find((entry) => entry.key === team)?.color
  // A span, not a div: the mark also sits inside sentences.
  return (
    <Box component="span" sx={{ color, display: 'inline-flex', flex: 'none' }}>
      <TeamIcon team={team} size={size} />
    </Box>
  )
}
