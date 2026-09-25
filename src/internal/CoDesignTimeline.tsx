// Internal view of the project timeline: the co-design dashboard's four steps,
// muted as background, then the modeling-data and communication work that
// followed, highlighted as the focus. Horizontal from lg; below that the steps
// stack vertically. Dashboard steps still open their views.
import { Box, useMediaQuery, useTheme } from '@mui/material'
import CoDesignTimeline, {
  HorizontalCoDesignTimeline,
} from '../features/co-design/components/CoDesignTimeline'
import { dashboardSteps } from '../features/co-design/components/timelineSteps'
import type { TimelineStep } from '../features/co-design/components/timelineSteps'
import PageLayout from './PageLayout'

// Draft names, subtitles and group labels, pending team review.
const EARLIER_GROUP = 'Where we started · 2023–2025'
const LATER_GROUP = 'What’s new · Nov 2025–2026'

const laterSteps: TimelineStep[] = [
  {
    date: 'Nov 2025',
    title: 'Enabling',
    subtitle: ['Scripts for internal teams', 'to use modeling data'],
  },
  {
    date: '2026',
    title: 'Analyzing',
    subtitle: ['Supporting sub-team', 'analyses'],
  },
  {
    date: 'April 2026',
    title: 'Communicating',
    subtitle: ['A public website from', 'early sub-team insights'],
  },
  {
    date: 'Summer 2026',
    title: 'Sharing',
    subtitle: ['BDSC artwork and tools', 'for external experts'],
  },
]

const steps: TimelineStep[] = [
  ...dashboardSteps.map((step) => ({ ...step, group: EARLIER_GROUP, tone: 'muted' as const })),
  ...laterSteps.map((step) => ({ ...step, group: LATER_GROUP, tone: 'highlight' as const })),
]

export default function CoDesignTimelinePage() {
  const theme = useTheme()
  const isHorizontal = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <PageLayout title="Co-Design Timeline" plainContent>
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'center',
          py: theme.jtSpacing.section.sm,
        })}
      >
        {isHorizontal ? (
          <HorizontalCoDesignTimeline steps={steps} />
        ) : (
          <CoDesignTimeline steps={steps} compact />
        )}
      </Box>
    </PageLayout>
  )
}
