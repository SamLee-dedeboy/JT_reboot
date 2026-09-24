// Internal standalone view of the co-design timeline from the co-design
// dashboard landing page, reduced to each step's title and subtitle; each card
// still opens its dashboard view.
import { Box } from '@mui/material'
import CoDesignTimeline from '../features/co-design/components/CoDesignTimeline'
import PageLayout from './PageLayout'

export default function CoDesignTimelinePage() {
  return (
    <PageLayout title="Co-Design Timeline">
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'center',
          py: theme.jtSpacing.section.sm,
        })}
      >
        <CoDesignTimeline compact />
      </Box>
    </PageLayout>
  )
}
