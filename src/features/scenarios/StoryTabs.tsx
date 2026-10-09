import { Box, Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { jtSpacing } from '../../theme'
import { scenarios } from './content'

const scenarioOrder = [
  'eco-machine',
  'new-green-watershed',
  'bolster-and-fortify',
  'calling-on-reserves',
  'a-tunnel',
] as const

const orderedScenarios = scenarioOrder
  .map((slug) => scenarios.find((scenario) => scenario.slug === slug))
  .filter((scenario): scenario is (typeof scenarios)[number] => scenario != null)

export default function StoryTabs({
  currentSlug,
  destination = 'story',
}: {
  currentSlug: string
  destination?: 'story' | 'results'
}) {
  return (
    <Box
      component="nav"
      aria-label="Adaptation scenarios"
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            width: 'max-content',
            flex: '0 0 auto',
            gap: jtSpacing.gap.xs,
          }}
        >
          {orderedScenarios.map((scenario, index) => {
            const active = scenario.slug === currentSlug
            return (
              <Box
                key={scenario.slug}
                component={Link}
                to={`/scenarios/${scenario.slug}${destination === 'results' ? '/results' : ''}`}
                aria-current={active ? 'page' : undefined}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto minmax(0, 1fr)',
                  alignItems: 'center',
                  gap: jtSpacing.gap.xs,
                  px: jtSpacing.component.sm,
                  py: jtSpacing.component.sm,
                  borderRadius: 1,
                  color: active ? 'common.black' : 'common.white',
                  bgcolor: active ? 'primary.main' : 'transparent',
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
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography component="span" variant="button" sx={{ whiteSpace: 'nowrap' }}>
                  {scenario.title}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Container>
    </Box>
  )
}
