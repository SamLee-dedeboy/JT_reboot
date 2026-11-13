import { Box, Container, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { jtSpacing, navigation } from '@/theme'
import { TeamIcon } from '@/ui'
import { criteria } from '@/content/criteria'
import { teamStyle } from '@/ui/teamStyle'

/** Team switcher; `hrefFor` decides whether it stays on methodology or on one scenario. */
export default function TeamTabs({
  activeTeamId,
  hrefFor,
  sticky = true,
}: {
  activeTeamId: string
  hrefFor: (teamId: string) => string
  sticky?: boolean
}) {
  return (
    <Box
      component="nav"
      aria-label="Evaluation criteria"
      sx={{
        position: sticky ? 'sticky' : 'static',
        top: navigation.barHeight,
        zIndex: 90,
        bgcolor: 'base.700',
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'border.subtle',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: '90dvw',
          px: 0,
          display: 'flex',
          justifyContent: { xs: 'flex-start', lg: 'center' },
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ flex: '0 0 auto' }}>
          {criteria.map((team) => {
            const active = team.id === activeTeamId
            const { color, icon } = teamStyle[team.id]
            return (
              <Box
                key={team.id}
                component={Link}
                to={hrefFor(team.id)}
                aria-current={active ? 'page' : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: jtSpacing.gap.xs,
                  px: jtSpacing.component.sm,
                  py: jtSpacing.component.sm,
                  borderRadius: 1,
                  color: active ? 'common.black' : color,
                  bgcolor: active ? color : 'transparent',
                  '&:hover, &:focus-visible': {
                    bgcolor: active ? color : alpha(color, 0.16),
                    outline: 'none',
                  },
                }}
              >
                <TeamIcon team={icon} size={18} />
                <Typography component="span" variant="button" sx={{ whiteSpace: 'nowrap' }}>
                  {team.label}
                </Typography>
              </Box>
            )
          })}
        </Stack>
      </Container>
    </Box>
  )
}
