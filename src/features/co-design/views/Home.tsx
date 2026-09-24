// Dashboard landing page (welcome dialog + timeline), ported from
// JT_dashboard/src/lib/Home.svelte and styled with the site theme.
import { Box, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import CoDesignTimeline from '../components/CoDesignTimeline'
import CoDesignDialog from '../shared/CoDesignDialog'
import InfoButton from '../shared/InfoButton'

// Module-level so the welcome dialog only opens on the first visit per page load.
let visited = false

export default function Home() {
  const [modalOpen, setModalOpen] = useState(() => !visited)
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
          Co-Learning Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'base.50' }}>
          This site offers interactive opportunities to explore how the Just Transitions in the
          Delta research project has prioritized and responded to public engagement through a
          participatory scenario planning process
        </Typography>
        <Typography variant="meta" sx={{ color: 'secondary.main', fontStyle: 'italic' }}>
          Click one of the modules to get started
        </Typography>
      </CoDesignDialog>

      <InfoButton
        onClick={() => setModalOpen((open) => !open)}
        label="About this dashboard"
        sx={{ position: 'fixed', top: 16, left: 16, zIndex: 100 }}
      />

      {/* Scrolls inside the fixed-height dashboard <main> */}
      <Box
        sx={(theme) => ({
          flex: '1 1 0',
          minHeight: 0,
          width: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: theme.jtSpacing.gap.md,
          pt: theme.jtSpacing.gap.md,
          pb: theme.jtSpacing.section.md,
          textAlign: 'center',
        })}
      >
        <Stack sx={{ alignItems: 'center', gap: 4 }}>
          <Typography variant="h2" component="h1">
            Welcome to the Co-Learning Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={(theme) => ({ maxWidth: theme.jtSpacing.paragraphMaxWidth.default })}
          >
            “What is co-learning”? Co-learning is a collaborative process in which researchers,
            community members, and other partners learn from one another by sharing knowledge,
            experiences, and perspectives to jointly understand issues and develop solutions. It
            recognizes that expertise exists both inside and outside academia and values mutual
            learning throughout the research process
          </Typography>
        </Stack>

        <CoDesignTimeline sx={{ mt: 10 }} />
      </Box>
    </>
  )
}
