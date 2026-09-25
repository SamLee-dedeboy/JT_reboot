// The co-design timeline (Listening → Designing → Conceptualizing → Comparing),
// shown on the dashboard landing page and the internal timeline page. Steps
// with a `view` open that dashboard view; others are plain cards.
import { Box, ButtonBase, Typography } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { coDesignPath } from '../shared/paths'
import { dashboardSteps } from './timelineSteps'
import type { TimelineStep } from './timelineSteps'

interface TimelineProps {
  steps?: TimelineStep[]
  sx?: SxProps<Theme>
}

interface CoDesignTimelineProps extends TimelineProps {
  // Show only each step's title and subtitle (no description or hint).
  compact?: boolean
}

// Vertical timeline: cards alternate sides of a centred rail from md, and sit
// to the right of a left-hand rail below md.
export default function CoDesignTimeline({
  steps = dashboardSteps,
  compact = false,
  sx,
}: CoDesignTimelineProps) {
  const onSelect = useSelectView()

  return (
    <Box
      sx={[
        (theme) => ({
          position: 'relative',
          width: '100%',
          maxWidth: theme.coDesign.shell.timeline.maxWidth,
          px: { xs: 2, md: 0 },
          display: 'flex',
          flexDirection: 'column',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
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
        <VerticalItem
          key={step.title}
          step={step}
          index={index}
          compact={compact}
          onSelect={onSelect}
        />
      ))}
    </Box>
  )
}

// Horizontal compact timeline: dots along one rail, cards alternating above
// and below it. Each card spans two step columns, so same-side neighbours
// never overlap; the outer padding keeps the first and last cards inside.
export function HorizontalCoDesignTimeline({ steps = dashboardSteps, sx }: TimelineProps) {
  const onSelect = useSelectView()
  const columns = steps.length

  return (
    <Box
      sx={[
        { width: '100%', px: `calc(100% / ${2 * (columns + 1)})` },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: 'auto auto auto',
        }}
      >
        {/* Rail across every step column */}
        <Box
          sx={(theme) => ({
            gridRow: 2,
            gridColumn: '1 / -1',
            alignSelf: 'center',
            height: theme.coDesign.shell.timeline.railWidth,
            bgcolor: theme.coDesign.shell.timeline.rail,
          })}
        />
        {steps.map((step, index) => (
          <HorizontalItem key={step.title} step={step} index={index} onSelect={onSelect} />
        ))}
      </Box>
    </Box>
  )
}

function useSelectView() {
  const navigate = useNavigate()
  return (view: string) => navigate(coDesignPath(view))
}

function VerticalItem({
  step,
  index,
  compact,
  onSelect,
}: {
  step: TimelineStep
  index: number
  compact: boolean
  onSelect: (view: string) => void
}) {
  const isLeft = index % 2 === 0

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
        // Interleave the full cards so alternating sides sit half a card apart;
        // compact cards are short enough to simply stack.
        mt: index === 0 ? 0 : compact ? 2 : { xs: 3, md: -6 },
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
        <TimelineCard
          step={step}
          index={index}
          compact={compact}
          onSelect={onSelect}
          sx={(theme) => ({
            width: compact
              ? { xs: '100%', md: theme.coDesign.shell.timeline.compactCardWidth }
              : '100%',
            maxWidth: { md: theme.coDesign.shell.timeline.cardMaxWidth },
          })}
        >
          {/* Below md the date moves into the card */}
          <Typography variant="numberArticle" sx={{ display: { md: 'none' } }}>
            {step.date}
          </Typography>
        </TimelineCard>
      </Box>
      <Dot sx={{ gridRow: 1, gridColumn: { xs: 1, md: 2 } }}>
        <Typography
          variant="numberArticle"
          sx={{
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
      </Dot>
    </Box>
  )
}

function HorizontalItem({
  step,
  index,
  onSelect,
}: {
  step: TimelineStep
  index: number
  onSelect: (view: string) => void
}) {
  const isTop = index % 2 === 0
  const stem = (
    <Box
      sx={(theme) => ({
        alignSelf: 'center',
        width: theme.coDesign.shell.timeline.stemWidth,
        height: theme.coDesign.shell.timeline.stemHeight,
        bgcolor: theme.coDesign.shell.timeline.rail,
      })}
    />
  )

  return (
    <>
      {/* Card with its stem, centred on the step column and two columns wide */}
      <Box
        sx={(theme) => ({
          gridRow: isTop ? 1 : 3,
          gridColumn: index + 1,
          alignSelf: isTop ? 'end' : 'start',
          justifySelf: 'center',
          width: `calc(200% - ${theme.spacing(2)})`,
          display: 'flex',
          flexDirection: isTop ? 'column' : 'column-reverse',
        })}
      >
        <TimelineCard step={step} index={index} compact onSelect={onSelect} sx={{ flexGrow: 1 }} />
        {stem}
      </Box>
      {/* Dot on the rail, with the date on the side away from the card */}
      <Dot sx={{ gridRow: 2, gridColumn: index + 1 }}>
        <Typography
          variant="numberArticle"
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            ...(isTop ? { top: 'calc(100% + 8px)' } : { bottom: 'calc(100% + 8px)' }),
          }}
        >
          {step.date}
        </Typography>
      </Dot>
    </>
  )
}

function Dot({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box
      sx={[
        (theme) => ({
          justifySelf: 'center',
          alignSelf: 'center',
          position: 'relative',
          width: theme.coDesign.shell.timeline.dotSize,
          height: theme.coDesign.shell.timeline.dotSize,
          borderRadius: '50%',
          bgcolor: theme.coDesign.shell.timeline.dot,
          zIndex: 2,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  )
}

function TimelineCard({
  step,
  index,
  compact,
  onSelect,
  sx,
  children,
}: {
  step: TimelineStep
  index: number
  compact: boolean
  onSelect: (view: string) => void
  sx?: SxProps<Theme>
  children?: ReactNode
}) {
  const view = step.view
  const content = (
    <>
      {children}
      <Typography variant={compact ? 'chartTitle' : 'h4'} component="h3">
        {step.title}
      </Typography>
      {/* Full cards keep the authored line breaks; compact cards wrap to fit */}
      <Typography variant="eyebrow" component="p">
        {compact
          ? step.subtitle.join(' ')
          : step.subtitle.map((line, i) => (
              <Box component="span" key={line} sx={{ display: 'block' }}>
                {line}
                {i < step.subtitle.length - 1 ? ' ' : ''}
              </Box>
            ))}
      </Typography>
      {!compact && step.body && (
        <Typography variant="cardBody" sx={{ color: 'base.50' }}>
          {step.body}
        </Typography>
      )}
      {!compact && step.hint && (
        <Typography variant="meta" sx={{ color: 'secondary.main', fontStyle: 'italic' }}>
          {step.hint}
        </Typography>
      )}
    </>
  )

  const extraSx = Array.isArray(sx) ? sx : [sx]
  // Steps without a dashboard view are informational: no link, pulse or hover.
  if (!view) {
    return <Box sx={[cardBaseSx(compact), ...extraSx]}>{content}</Box>
  }

  return (
    <ButtonBase
      onClick={() => onSelect(view)}
      sx={[
        cardBaseSx(compact),
        (theme) => {
          const card = theme.coDesign.shell.timeline.card
          const pulse = keyframes`
            0%, 100% { box-shadow: ${card.shadow}; }
            50% { box-shadow: ${card.pulseShadow}; }
          `
          return {
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
        },
        ...extraSx,
      ]}
    >
      {content}
    </ButtonBase>
  )
}

function cardBaseSx(compact: boolean) {
  return (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: compact ? 1 : 1.25,
    px: { xs: 3, md: compact ? 3 : 4.5 },
    py: compact ? 2.5 : { xs: 3, md: 4 },
    textAlign: 'center',
    color: 'common.white',
    bgcolor: theme.coDesign.shell.timeline.card.background,
    border: theme.coDesign.shell.timeline.card.border,
    borderRadius: theme.coDesign.shell.timeline.card.radius,
    boxShadow: theme.coDesign.shell.timeline.card.shadow,
  })
}
