import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import type { ScenarioContent } from '@/content/scenarios'
import { jtSpacing } from '@/theme'
import { assetUrl } from '@/utils/baseUrl'
import { storyGridColumns } from './storyLayout'

/** The scenario's photo, number, title and plain-language premise. */
export default function StoryHero({
  scenario,
  isTieredOutflows,
}: {
  scenario: ScenarioContent
  isTieredOutflows: boolean
}) {
  return (
    <Box
      id="overview"
      component="header"
      sx={{
        position: 'relative',
        minHeight: { xs: 440, md: 560 },
        display: 'flex',
        alignItems: 'flex-end',
        isolation: 'isolate',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: (theme) =>
            `linear-gradient(90deg, ${theme.palette.translucent[900]}, ${theme.palette.translucent[600]}), url(${assetUrl(scenario.image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: '90dvw',
          px: 0,
          py: { xs: jtSpacing.section.md, md: jtSpacing.section.lg },
          display: 'grid',
          gridTemplateColumns: storyGridColumns,
          gap: { xs: jtSpacing.gap.xl, lg: jtSpacing.section.md },
        }}
      >
        <Stack
          spacing={jtSpacing.gap.md}
          sx={{
            gridColumn: { lg: '2 / 4' },
            maxWidth: jtSpacing.paragraphMaxWidth.default,
          }}
        >
          <Button
            component={Link}
            to="/scenarios"
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: 'flex-start', color: 'base.100' }}
          >
            All scenarios
          </Button>
          {!isTieredOutflows && <Typography variant="numberArticle">{scenario.number}</Typography>}
          <Typography variant="h1">{scenario.title}</Typography>
          <Typography variant="body1" sx={{ color: 'base.50', maxWidth: '60ch' }}>
            {scenario.summary}
          </Typography>
          {scenario.comparisonNote && (
            <Typography
              variant="meta"
              sx={{
                maxWidth: '64ch',
                color: 'base.50',
                borderLeft: 2,
                borderColor: 'primary.main',
                pl: jtSpacing.component.sm,
              }}
            >
              {scenario.comparisonNote}
            </Typography>
          )}
        </Stack>
      </Container>
    </Box>
  )
}
