// Dashboard landing timeline, ported from JT_dashboard/src/lib/Home.svelte and
// styled with the site theme (theme.coDesign.shell.timeline).
import { Box, ButtonBase, Stack, Typography } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CoDesignDialog from '../shared/CoDesignDialog'
import InfoButton from '../shared/InfoButton'
import { coDesignPath } from '../shared/paths'

// Module-level so the welcome dialog only opens on the first visit per page load.
let visited = false

type TimelineStep = {
  date: string
  side: 'left' | 'right'
  view: string
  title: string
  subtitle: string[]
  body: string
  hint: string
}

const steps: TimelineStep[] = [
  {
    date: '2023',
    side: 'left',
    view: '/flow',
    title: 'Listening',
    subtitle: ['Understanding public', 'values and concerns'],
    body: 'Our process began by interviewing Delta residents, community organizers, Indigenous community members, farmers, scientists, experts and agency officials. Key questions we asked interviewees included what they most value about the Delta, what factors they believe drive change, what salinity adaptation strategies they are most interested in seeing explored, and who is and isn’t represented in Delta planning efforts.',
    hint: 'Click to explore the results and connections across the interview data',
  },
  {
    date: 'Early 2024',
    side: 'right',
    view: '/linking',
    title: 'Designing',
    subtitle: ['From ideas and values', 'to scenarios'],
    body: "With a better understanding of interviewee's perceived drivers of change, management and adaptation strategies to explore, and values and priorities, we designed six distinct scenarios.",
    hint: 'Click to explore how interviews shaped the design of each scenario',
  },
  {
    date: '2025',
    side: 'left',
    view: '/mental-model',
    title: 'Conceptualizing',
    subtitle: ['Shared understandings of Delta salinity'],
    body: 'Leveraging these interviews and data collected through our public workshops, we have been documenting how project participants conceptualize and understand salinity and salinity management in the Delta, as well as how those understandings change over time. These are visualized as “mental models” which are representations of how people understand a system, concept, or process works.',
    hint: 'Click to see these mental models',
  },
  {
    date: 'Summer 2025',
    side: 'right',
    view: '/sunburst',
    title: 'Comparing',
    subtitle: ['Different mental models'],
    body: 'We then compare how the mental models are similar and different across different groups of people, including across age, years of engagement in the Delta, Delta resident or non-resident, and research team members compared to research participants.',
    hint: 'Click to explore how mental models differ across participants',
  },
]

export default function Home() {
  const navigate = useNavigate()
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

        <Timeline onSelect={(view) => navigate(coDesignPath(view))} />
      </Box>
    </>
  )
}

function Timeline({ onSelect }: { onSelect: (view: string) => void }) {
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        width: '100%',
        maxWidth: theme.coDesign.shell.timeline.maxWidth,
        mt: 10,
        px: { xs: 2, md: 0 },
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      {/* Vertical rail: centred on desktop, hugging the left edge below md */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: {
            xs: `calc(${theme.spacing(2)} + ${theme.coDesign.shell.timeline.railColumn / 2}px)`,
            md: '50%',
          },
          width: theme.coDesign.shell.timeline.railWidth,
          bgcolor: theme.coDesign.shell.timeline.rail,
          transform: 'translateX(-50%)',
          zIndex: 1,
        })}
      />
      {steps.map((step, index) => (
        <TimelineItem key={step.view} step={step} index={index} onSelect={onSelect} />
      ))}
    </Box>
  )
}

function TimelineItem({
  step,
  index,
  onSelect,
}: {
  step: TimelineStep
  index: number
  onSelect: (view: string) => void
}) {
  const isLeft = step.side === 'left'

  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        alignItems: 'center',
        width: '100%',
        gridTemplateColumns: {
          xs: `${theme.coDesign.shell.timeline.railColumn}px 1fr`,
          md: `1fr ${theme.coDesign.shell.timeline.railColumn}px 1fr`,
        },
        // Interleave cards so alternating sides sit half a card apart.
        mt: index === 0 ? 0 : { xs: 3, md: -6 },
      })}
    >
      <Box
        sx={{
          gridRow: 1,
          gridColumn: { xs: 2, md: isLeft ? 1 : 3 },
          justifySelf: { xs: 'stretch', md: isLeft ? 'end' : 'start' },
          display: 'flex',
          alignItems: 'center',
          pl: { xs: 2, md: isLeft ? 0 : 3 },
          pr: { xs: 0, md: isLeft ? 3 : 0 },
        }}
      >
        <TimelineCard step={step} index={index} onSelect={onSelect} />
      </Box>
      <Box
        sx={(theme) => ({
          gridRow: 1,
          gridColumn: { xs: 1, md: 2 },
          justifySelf: 'center',
          position: 'relative',
          width: theme.coDesign.shell.timeline.dotSize,
          height: theme.coDesign.shell.timeline.dotSize,
          borderRadius: '50%',
          bgcolor: theme.coDesign.shell.timeline.dot,
          zIndex: 2,
        })}
      >
        <Typography
          variant="numberArticle"
          sx={{
            // Dates sit on the rail's outer side; below md they move into the card.
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            whiteSpace: 'nowrap',
            ...(isLeft ? { left: 'calc(100% + 10px)' } : { right: 'calc(100% + 10px)' }),
          }}
        >
          {step.date}
        </Typography>
      </Box>
    </Box>
  )
}

function TimelineCard({
  step,
  index,
  onSelect,
}: {
  step: TimelineStep
  index: number
  onSelect: (view: string) => void
}) {
  return (
    <ButtonBase
      onClick={() => onSelect(step.view)}
      sx={(theme) => {
        const card = theme.coDesign.shell.timeline.card
        const pulse = keyframes`
          0%, 100% { box-shadow: ${card.shadow}; }
          50% { box-shadow: ${card.pulseShadow}; }
        `
        return {
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
          width: '100%',
          maxWidth: { md: theme.coDesign.shell.timeline.cardMaxWidth },
          px: { xs: 3, md: 4.5 },
          py: { xs: 3, md: 4 },
          textAlign: 'center',
          color: 'common.white',
          bgcolor: card.background,
          border: card.border,
          borderRadius: card.radius,
          boxShadow: card.shadow,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
          // Stagger the pulse so the cards don't breathe in unison.
          animation: `${pulse} 3s ease-in-out infinite`,
          animationDelay: `${index * 0.75}s`,
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: card.hoverBorder,
            boxShadow: card.hoverShadow,
          },
          '&:active': { transform: 'translateY(0)' },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }
      }}
    >
      <Typography variant="numberArticle" sx={{ display: { md: 'none' } }}>
        {step.date}
      </Typography>
      <Typography variant="h4" component="h3">
        {step.title}
      </Typography>
      <Typography variant="eyebrow" component="p">
        {step.subtitle.map((line, i) => (
          <Box component="span" key={line} sx={{ display: 'block' }}>
            {line}
            {i < step.subtitle.length - 1 ? ' ' : ''}
          </Box>
        ))}
      </Typography>
      <Typography variant="cardBody" sx={{ color: 'base.50' }}>
        {step.body}
      </Typography>
      <Typography variant="meta" sx={{ color: 'secondary.main', fontStyle: 'italic' }}>
        {step.hint}
      </Typography>
    </ButtonBase>
  )
}
