// The co-design timeline (Listening → Designing → Conceptualizing → Comparing),
// shown on the dashboard landing page and the internal timeline page. Steps
// with a `view` open that dashboard view; others are plain cards. Steps can be
// grouped (one heading per run of steps) and toned to set their emphasis.
import { Box, ButtonBase, Typography } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { coDesignPath } from '../shared/paths'
import { dashboardSteps } from './timelineSteps'
import type { TimelineStep, TimelineTone } from './timelineSteps'

interface TimelineProps {
  steps?: TimelineStep[]
  sx?: SxProps<Theme>
}

interface CoDesignTimelineProps extends TimelineProps {
  // Show only each step's title and subtitle (no description or hint).
  compact?: boolean
}

type StepRun = { group?: string; tone: TimelineTone; start: number; end: number; hidden: boolean }

// Split steps into runs of consecutive steps that share a group.
function groupRuns(steps: TimelineStep[]): StepRun[] {
  const runs: StepRun[] = []
  steps.forEach((step, index) => {
    const last = runs[runs.length - 1]
    const hidden = step.hidden ?? false
    if (last && last.group === step.group) {
      last.end = index
      last.hidden &&= hidden
    } else {
      runs.push({
        group: step.group,
        tone: step.tone ?? 'default',
        start: index,
        end: index,
        hidden,
      })
    }
  })
  return runs
}

// Ring that grows out of an in-progress step's dot and fades away.
const ripple = (scale: number) => keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(${scale}); opacity: 0; }
`

const toneOf = (theme: Theme, tone: TimelineTone = 'default') =>
  theme.coDesign.shell.timeline.tones[tone]

// Vertical timeline: cards alternate sides of a centred rail from md, and sit
// to the right of a left-hand rail below md.
export default function CoDesignTimeline({
  steps: allSteps = dashboardSteps,
  compact = false,
  sx,
}: CoDesignTimelineProps) {
  const onSelect = useSelectView()
  const steps = allSteps.filter((step) => !step.hidden)
  const runs = groupRuns(steps)

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
      {runs.map((run, runIndex) => (
        <Box key={run.start} sx={{ display: 'contents' }}>
          {run.group && (
            <VerticalGroupHeading label={run.group} tone={run.tone} first={runIndex === 0} />
          )}
          {steps.slice(run.start, run.end + 1).map((step, offset) => (
            <VerticalItem
              key={step.title}
              step={step}
              index={run.start + offset}
              first={offset === 0}
              compact={compact}
              onSelect={onSelect}
            />
          ))}
        </Box>
      ))}
    </Box>
  )
}

// Horizontal compact timeline: dots along one rail, cards alternating above
// and below it. Cards span `horizontalCardSpan` (< 2) step columns, so
// same-side neighbours never touch; the outer padding keeps the first and last
// cards inside the container. Group headings sit above their steps, and a tick
// on the rail marks each group boundary.
export function HorizontalCoDesignTimeline({ steps = dashboardSteps, sx }: TimelineProps) {
  const onSelect = useSelectView()
  const columns = steps.length
  const runs = groupRuns(steps)

  return (
    <Box
      sx={[
        (theme) => {
          // Edge cards overhang their column by (span - 1) / 2 columns.
          const span = theme.coDesign.shell.timeline.horizontalCardSpan
          return { width: '100%', px: `calc(100% * ${(span - 1) / (2 * (columns + span - 1))})` }
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          // Group headings, top cards, rail, bottom cards.
          gridTemplateRows: 'auto auto auto auto',
        }}
      >
        {runs.map((run) => (
          <Box key={run.start} sx={{ display: 'contents' }}>
            {run.group && (
              <Box
                sx={(theme) => ({
                  gridRow: 1,
                  gridColumn: `${run.start + 1} / ${run.end + 2}`,
                  mx: 1,
                  mb: 5,
                  pb: 1,
                  textAlign: 'center',
                  borderBottom: `2px solid ${toneOf(theme, run.tone).rail}`,
                  visibility: run.hidden ? 'hidden' : 'visible',
                })}
              >
                <Typography
                  variant="eyebrow"
                  component="h2"
                  sx={(theme) => ({ color: toneOf(theme, run.tone).label })}
                >
                  {run.group}
                </Typography>
              </Box>
            )}
            {/* Rail segment in the group's tone */}
            <Box
              sx={(theme) => ({
                gridRow: 3,
                gridColumn: `${run.start + 1} / ${run.end + 2}`,
                alignSelf: 'center',
                height: theme.coDesign.shell.timeline.railWidth,
                bgcolor: toneOf(theme, run.tone).rail,
                visibility: run.hidden ? 'hidden' : 'visible',
              })}
            />
            {/* Boundary tick between this group and the previous one */}
            {run.start > 0 && (
              <Box
                sx={(theme) => ({
                  gridRow: 3,
                  gridColumn: run.start + 1,
                  justifySelf: 'start',
                  alignSelf: 'center',
                  width: theme.coDesign.shell.timeline.railWidth,
                  height: theme.coDesign.shell.timeline.dividerHeight,
                  bgcolor: toneOf(theme, run.tone).rail,
                  transform: 'translateX(-50%)',
                  // Hidden, not removed: it sets the rail row's height.
                  visibility: run.hidden ? 'hidden' : 'visible',
                })}
              />
            )}
          </Box>
        ))}
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

// Group label pill laid over the vertical rail, breaking it between groups.
function VerticalGroupHeading({
  label,
  tone,
  first,
}: {
  label: string
  tone: TimelineTone
  first: boolean
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        justifyContent: { xs: 'flex-start', md: 'center' },
        mt: first ? 0 : 6,
        mb: 3,
      }}
    >
      <Typography
        variant="eyebrow"
        component="h2"
        sx={(theme) => ({
          px: 2,
          py: 0.75,
          color: toneOf(theme, tone).label,
          bgcolor: theme.coDesign.shell.pageBackground,
          border: `2px solid ${toneOf(theme, tone).rail}`,
          borderRadius: theme.coDesign.shell.timeline.card.radius,
        })}
      >
        {label}
      </Typography>
    </Box>
  )
}

function VerticalItem({
  step,
  index,
  first,
  compact,
  onSelect,
}: {
  step: TimelineStep
  index: number
  first: boolean
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
        mt: first ? 0 : compact ? 2 : { xs: 3, md: -6 },
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
          <Typography
            variant="numberArticle"
            sx={(theme) => ({ display: { md: 'none' }, color: toneOf(theme, step.tone).date })}
          >
            {step.date}
          </Typography>
        </TimelineCard>
      </Box>
      <Dot
        tone={step.tone}
        ongoing={step.ongoing}
        sx={{ gridRow: 1, gridColumn: { xs: 1, md: 2 } }}
      >
        <Typography
          variant="numberArticle"
          sx={(theme) => ({
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            whiteSpace: 'nowrap',
            color: toneOf(theme, step.tone).date,
            ...(isLeft ? { left: 'calc(100% + 10px)' } : { right: 'calc(100% + 10px)' }),
          })}
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
        bgcolor: toneOf(theme, step.tone).rail,
      })}
    />
  )

  return (
    <>
      {/* Card with its stem, centred on the step column */}
      <Box
        sx={(theme) => ({
          gridRow: isTop ? 2 : 4,
          gridColumn: index + 1,
          alignSelf: isTop ? 'end' : 'start',
          justifySelf: 'center',
          width: `${theme.coDesign.shell.timeline.horizontalCardSpan * 100}%`,
          display: 'flex',
          flexDirection: isTop ? 'column' : 'column-reverse',
          visibility: step.hidden ? 'hidden' : 'visible',
        })}
      >
        <TimelineCard step={step} index={index} compact onSelect={onSelect} sx={{ flexGrow: 1 }} />
        {stem}
      </Box>
      {/* Dot on the rail, with the date on the side away from the card */}
      <Dot
        tone={step.tone}
        ongoing={step.ongoing}
        sx={{ gridRow: 3, gridColumn: index + 1, visibility: step.hidden ? 'hidden' : 'visible' }}
      >
        <Typography
          variant="numberArticle"
          sx={(theme) => ({
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            color: toneOf(theme, step.tone).date,
            ...(isTop ? { top: 'calc(100% + 8px)' } : { bottom: 'calc(100% + 8px)' }),
          })}
        >
          {step.date}
        </Typography>
      </Dot>
    </>
  )
}

function Dot({
  tone,
  ongoing = false,
  children,
  sx,
}: {
  tone?: TimelineTone
  ongoing?: boolean
  children: ReactNode
  sx?: SxProps<Theme>
}) {
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
          bgcolor: toneOf(theme, tone).dot,
          zIndex: 2,
          ...(ongoing && {
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `2px solid ${toneOf(theme, tone).dot}`,
              animation: `${ripple(theme.coDesign.shell.timeline.ongoing.rippleScale)} ${theme.coDesign.shell.timeline.ongoing.rippleDuration} ease-out infinite`,
              '@media (prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0 },
            },
          }),
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
  const tone = step.tone ?? 'default'
  const content = (
    <>
      {step.ongoing && <OngoingTag tone={tone} />}
      {children}
      <Typography
        variant={compact ? 'chartTitle' : 'h4'}
        component="h3"
        sx={(theme) => ({ color: toneOf(theme, tone).title })}
      >
        {step.title}
      </Typography>
      {/* Full cards keep the authored line breaks; compact cards wrap to fit */}
      <Typography
        variant={compact ? 'controlLabel' : 'eyebrow'}
        component="p"
        sx={compact ? (theme) => ({ color: toneOf(theme, tone).subtitle }) : undefined}
      >
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
    return <Box sx={[cardBaseSx(compact, tone, step.ongoing ?? false), ...extraSx]}>{content}</Box>
  }

  return (
    <ButtonBase
      onClick={() => onSelect(view)}
      sx={[
        cardBaseSx(compact, tone, step.ongoing ?? false),
        (theme) => {
          const card = theme.coDesign.shell.timeline.card
          const pulse = keyframes`
            0%, 100% { box-shadow: ${card.shadow}; }
            50% { box-shadow: ${card.pulseShadow}; }
          `
          return {
            transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
            // Stagger the pulse so the cards don't breathe in unison; muted
            // steps stay still so they don't compete for attention.
            ...(tone !== 'muted' && {
              animation: `${pulse} 3s ease-in-out infinite`,
              animationDelay: `${index * 0.75}s`,
            }),
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

function cardBaseSx(compact: boolean, tone: TimelineTone, ongoing: boolean) {
  return (theme: Theme) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: compact ? 1 : 1.25,
    px: { xs: 3, md: compact ? 3 : 4.5 },
    py: compact ? 2.5 : { xs: 3, md: 4 },
    textAlign: 'center',
    color: 'common.white',
    bgcolor: theme.coDesign.shell.timeline.card.background,
    border: toneOf(theme, tone).border,
    ...(ongoing && { borderStyle: theme.coDesign.shell.timeline.ongoing.cardBorderStyle }),
    borderRadius: theme.coDesign.shell.timeline.card.radius,
    boxShadow: toneOf(theme, tone).shadow,
  })
}

// "Ongoing" tag sitting on the card's top edge.
function OngoingTag({ tone }: { tone: TimelineTone }) {
  return (
    <Typography
      variant="chartLabel"
      component="span"
      sx={(theme) => ({
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        px: 1,
        py: 0.25,
        whiteSpace: 'nowrap',
        color: toneOf(theme, tone).date,
        bgcolor: theme.coDesign.shell.timeline.card.background,
        border: `1px solid ${toneOf(theme, tone).rail}`,
        borderRadius: theme.coDesign.shell.timeline.card.radius,
      })}
    >
      Ongoing
    </Typography>
  )
}
