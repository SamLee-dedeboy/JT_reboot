// Dashboard landing page (hero, welcome dialog, timeline), ported from
// JT_dashboard/src/lib/Home.svelte and laid out like the site's other pages.
import { Box, Button, Container, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { PageHero } from '@/ui'
import { borderedPanelSx } from '@/ui/surfaceStyles'
import CoDesignTimeline from '../components/CoDesignTimeline'
import CoDesignDialog from '../shared/CoDesignDialog'
import { useViewsAvailable } from '../shared/useViewsAvailable'

// Module-level so the welcome dialog only opens on the first visit per page load.
let visited = false

// Participants working through the scenario boards at the 2025 public workshop.
const HERO_IMAGE = '/images/background/psp-workshop-2025.webp'

// Shown wherever the views are not offered (below lg).
const LARGER_SCREEN_NOTE =
  'For the best experience, visit on a laptop or larger screen, where each step opens an interactive view of the data.'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(() => !visited)
  const viewsAvailable = useViewsAvailable()
  useEffect(() => {
    visited = true
  }, [])

  return (
    <>
      <CoDesignDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        align="center"
        labelledBy="co-design-welcome-title"
      >
        <Typography id="co-design-welcome-title" variant="h4" component="h2">
          Welcome to the
          <br />
          Co-Design Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'base.50' }}>
          This site offers interactive opportunities to explore how the Just Transitions in the
          Delta research project has prioritized and responded to public engagement through a
          participatory scenario planning process
        </Typography>
        {viewsAvailable ? (
          <Typography variant="eyebrow" component="p">
            Click one of the modules to get started
          </Typography>
        ) : (
          <Typography variant="captionProse" component="p" sx={{ color: 'primary.main' }}>
            {LARGER_SCREEN_NOTE}
          </Typography>
        )}
      </CoDesignDialog>

      <PageHero
        image={HERO_IMAGE}
        eyebrow="Welcome to the"
        title="Co-Design Dashboard"
        summaryVariant="body1"
        summary="“What is co-designing”? Co-designing is a collaborative process in which researchers, community members, and other partners learn from one another by sharing knowledge, experiences, and perspectives to jointly understand issues and develop solutions. It recognizes that expertise exists both inside and outside academia and values mutual learning throughout the research process"
      >
        <Box>
          <Button variant="outlined" onClick={() => setModalOpen((open) => !open)}>
            About this dashboard
          </Button>
        </Box>
      </PageHero>

      {/* The four steps of the process; from lg up each card opens its view */}
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
    </>
  )
}
