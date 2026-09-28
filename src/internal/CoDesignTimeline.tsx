// Internal view of the project timeline: the co-design dashboard's four steps,
// muted as background, then the modeling-data and communication work that
// followed, highlighted as the focus. Horizontal from lg; below that the steps
// stack vertically. Dashboard steps still open their views.
import { Box, FormControlLabel, Switch, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
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
    status: 'ongoing',
    subtitle: ['A public website from', 'early sub-team insights'],
  },
  {
    date: 'Summer 2026',
    title: 'Sharing',
    status: 'ongoing',
    subtitle: ['BDSC artwork and tools', 'for external experts'],
  },
]

// Planned work, styled apart from what's already under way. Draft name.
const upcomingSteps: TimelineStep[] = [
  {
    date: 'Nov 2026',
    title: 'Convening',
    status: 'upcoming',
    subtitle: ['Public workshop'],
  },
]

// The co-design steps recede (muted) so the new work stands out (highlight).
// Hiding the new work keeps every co-design step exactly where it was.
const buildSteps = (showNewWork: boolean): TimelineStep[] => [
  ...dashboardSteps.map((step) => ({ ...step, group: EARLIER_GROUP, tone: 'muted' as const })),
  ...laterSteps.map((step) => ({
    ...step,
    group: LATER_GROUP,
    tone: 'highlight' as const,
    hidden: !showNewWork,
  })),
  ...upcomingSteps.map((step) => ({ ...step, tone: 'future' as const, hidden: !showNewWork })),
]

export default function CoDesignTimelinePage() {
  const theme = useTheme()
  const isHorizontal = useMediaQuery(theme.breakpoints.up('lg'))
  const [showNewWork, setShowNewWork] = useState(true)
  const steps = buildSteps(showNewWork)

  return (
    <PageLayout title="Co-Design Timeline" plainContent>
      {/* Reveal / hide the post-co-design steps, e.g. while presenting */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormControlLabel
          labelPlacement="start"
          control={
            <Switch
              checked={showNewWork}
              onChange={(event) => setShowNewWork(event.target.checked)}
            />
          }
          label={<Typography variant="controlLabel">Show new work</Typography>}
          sx={{ m: 0, gap: 1 }}
        />
      </Box>
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
