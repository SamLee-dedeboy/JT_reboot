// Co-design landing page (hero, what co-designing is, timeline), ported from
// JT_dashboard/src/lib/Home.svelte and laid out like the site's other pages.
import { Box, Container, Typography } from '@mui/material'
import { PageHero, Section } from '@/ui'
import { borderedPanelSx } from '@/ui/surfaceStyles'
import CoDesignTimeline from '../components/CoDesignTimeline'
import { useViewsAvailable } from '../shared/useViewsAvailable'

// Participants working through the scenario boards at the 2025 public workshop.
const HERO_IMAGE = '/images/background/psp-workshop-2025.webp'

// Shown wherever the views are not offered (below lg).
const LARGER_SCREEN_NOTE =
  'For the best experience, visit on a laptop or larger screen, where each step opens an interactive view of the data.'

export default function Home() {
  const viewsAvailable = useViewsAvailable()

  return (
    <>
      <PageHero
        image={HERO_IMAGE}
        title="Co-Design Experience"
        summaryVariant="body1"
        summary="Explore how the Just Transitions in the Delta research project has prioritized and responded to public engagement through a participatory scenario planning process."
      />

      <Section bg="base.600">
        <Typography
          variant="h2"
          component="h2"
          sx={(theme) => ({ mb: theme.jtSpacing.section.sm })}
        >
          What is{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            co-designing
          </Box>
          ?
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '78ch' }}>
          Co-designing is a collaborative process in which researchers, community members, and other
          partners learn from one another by sharing knowledge, experiences, and perspectives to
          jointly understand issues and develop solutions. It recognizes that expertise exists both
          inside and outside academia and values mutual learning throughout the research process.
        </Typography>
      </Section>

      {/* The four steps of the process; from lg up each card opens its view */}
      <Box component="section" sx={{ bgcolor: 'base.700' }}>
        <Container
          maxWidth="lg"
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: theme.jtSpacing.section.sm,
            py: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.lg },
          })}
        >
          {viewsAvailable && (
            <Typography variant="eyebrow" component="p" sx={{ textAlign: 'center' }}>
              Click a step to explore it in an interactive view
            </Typography>
          )}
          {!viewsAvailable && (
            <Box role="note" sx={[borderedPanelSx, { width: '100%' }]}>
              <Typography variant="eyebrow" component="p" sx={{ mb: 1 }}>
                Best on a larger screen
              </Typography>
              <Typography variant="body2">{LARGER_SCREEN_NOTE}</Typography>
            </Box>
          )}
          <CoDesignTimeline />
        </Container>
      </Box>
    </>
  )
}
