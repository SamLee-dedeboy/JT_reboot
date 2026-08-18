// Repository navigation tabs for switching between documentation/resource
// sections.
import { Link } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { jtSpacing } from '../../theme'

export type RepoTabKey = 'docs' | 'learning' | 'resources'

const REPO_TABS: { n: string; label: string; shortLabel: string; to: string; key: RepoTabKey }[] = [
  {
    n: '01',
    label: 'Project Documentation',
    shortLabel: 'Documentation',
    to: '/pages/project-documentation',
    key: 'docs',
  },
  {
    n: '02',
    label: 'Service Learning',
    shortLabel: 'Learning',
    to: '/pages/service-learning',
    key: 'learning',
  },
  {
    n: '03',
    label: 'References & Resources',
    shortLabel: 'References',
    to: '/pages/resources',
    key: 'resources',
  },
]

/** Top-level switcher linking the three repository pages. */
export default function RepoTabs({ current }: { current: RepoTabKey }) {
  return (
    <Box
      component="nav"
      aria-label="Repository sections"
      sx={{
        position: 'sticky',
        top: { xs: 72, md: 76 },
        zIndex: 90,
        bgcolor: 'base.700',
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'border.subtle',
        boxShadow: (theme) => theme.navigation.dropdownShadow,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: jtSpacing.gap.lg, md: jtSpacing.gap.xl },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'auto minmax(0, 1fr)' },
          alignItems: 'center',
          gap: { xs: jtSpacing.component.xs, md: jtSpacing.gap.md },
          py: { xs: jtSpacing.component.xs, md: 0 },
        }}
      >
        <Typography
          variant="eyebrow"
          component="p"
          sx={{
            display: { xs: 'none', md: 'block' },
            pr: jtSpacing.gap.md,
            color: 'base.100',
            whiteSpace: 'nowrap',
          }}
        >
          Repository
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(3, max-content)', sm: 'repeat(3, minmax(0, 1fr))' },
            gap: { xs: jtSpacing.component.xs, md: jtSpacing.gap.xs },
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {REPO_TABS.map((tab) => {
            const active = tab.key === current
            return (
              <Box
                key={tab.key}
                component={Link}
                to={tab.to}
                aria-current={active ? 'page' : undefined}
                sx={{
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: { xs: 'auto', sm: 'auto minmax(0, 1fr)' },
                  alignItems: 'center',
                  gap: { xs: jtSpacing.component.xs, sm: jtSpacing.gap.xs },
                  minWidth: { xs: 132, sm: 0 },
                  px: { xs: jtSpacing.component.sm, md: jtSpacing.gap.md },
                  py: { xs: jtSpacing.component.xs, md: jtSpacing.component.sm },
                  borderRadius: 1,
                  color: active ? 'common.black' : 'common.white',
                  bgcolor: active ? 'primary.main' : 'transparent',
                  transition: 'background-color 180ms ease, color 180ms ease',
                  '&:hover, &:focus-visible': {
                    bgcolor: active ? 'primary.main' : 'translucent.primaryGreen',
                    outline: 'none',
                  },
                }}
              >
                <Typography
                  component="span"
                  variant="numberBadge"
                  sx={{ color: active ? 'common.black' : 'primary.main' }}
                >
                  {tab.n}
                </Typography>
                <Typography component="span" variant="button" sx={{ whiteSpace: 'nowrap' }}>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {tab.label}
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    {tab.shortLabel}
                  </Box>
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Container>
    </Box>
  )
}
