// The co-design timeline (Listening → Designing → Conceptualizing → Comparing),
// shown on the dashboard landing page and the internal timeline page. Steps
// with a `view` open that dashboard view; others are plain cards. Steps can be
// grouped (one heading per run of steps) and toned to set their emphasis.
// Below lg the views are not offered (see useViewsAvailable), so every card is
// a plain card there.
import { Box, ButtonBase, Typography } from '@mui/material'
import type { BoxProps } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { motion, useReducedMotion, useScroll, useSpring, type MotionProps } from 'framer-motion'
import { useRef, type ComponentType, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/ui'
import { focusRing } from '@/ui/focusRing'
import { coDesignPath } from '../shared/paths'
import { useViewsAvailable } from '../shared/useViewsAvailable'
import { dashboardSteps } from './timelineSteps'
import type { TimelineStatus, TimelineStep, TimelineTone } from './timelineSteps'

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

type MotionBoxProps = Omit<BoxProps, keyof MotionProps> & MotionProps
const MotionBox = motion.create(Box) as ComponentType<MotionBoxProps>

const toneOf = (theme: Theme, tone: TimelineTone = 'default') =>
  theme.coDesign.shell.timeline.tones[tone]

// A soft ring breathing out of the dot of a step that opens a view, as on the
// documentation timeline's newest workshop.
const dotPulse = keyframes`
  from { transform: scale(1); opacity: 0.55; }
  to { transform: scale(2.4); opacity: 0; }
`

// Vertical timeline: cards alternate sides of a centred rail from md, and sit
// to the right of a left-hand rail below md.
export default function CoDesignTimeline({
  steps: allSteps = dashboardSteps,
  compact = false,
  sx,
}: CoDesignTimelineProps) {
  const onSelect = useSelectView()
  const viewsAvailable = useViewsAvailable()
  // Without the views a step is informational: no link, and no hint that says to click.
  const steps = allSteps
    .filter((step) => !step.hidden)
    .map((step) => (viewsAvailable ? step : { ...step, view: undefined, action: undefined }))
  const runs = groupRuns(steps)
  // The rail fills green as the reader scrolls past it, like the documentation timeline.
  const railRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 65%', 'end 65%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const railSx = (theme: Theme) => {
    const { railColumn, railWidth } = theme.coDesign.shell.timeline
    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      // Not a translate: the fill's scale owns the transform.
      left: {
        xs: `calc(${theme.spacing(2)} + ${railColumn / 2 - railWidth / 2}px)`,
        md: `calc(50% - ${railWidth / 2}px)`,
      },
      width: railWidth,
      zIndex: 1,
    } as const
  }

  return (
    <Box
      ref={railRef}
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
        aria-hidden
        sx={[railSx, (theme) => ({ bgcolor: theme.coDesign.shell.timeline.rail })]}
      />
      {!reduceMotion && (
        <MotionBox
          aria-hidden
          style={{ scaleY: fill }}
          sx={[
            railSx,
            (theme) => ({
              bgcolor: theme.coDesign.shell.timeline.railFill,
              transformOrigin: 'top',
            }),
          ]}
        />
      )}
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
                  borderBottom: `1px solid ${toneOf(theme, run.tone).rail}`,
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
                ...(toneOf(theme, run.tone).dashedRail
                  ? {
                      backgroundImage: `repeating-linear-gradient(90deg, ${toneOf(theme, run.tone).rail} 0 8px, transparent 8px 14px)`,
                    }
                  : { bgcolor: toneOf(theme, run.tone).rail }),
                visibility: run.hidden ? 'hidden' : 'visible',
              })}
            />
            {/* Boundary tick between this group and the previous one */}
            {/* Only labelled groups get a boundary tick */}
            {run.start > 0 && run.group && (
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
          border: `1px solid ${toneOf(theme, tone).rail}`,
          borderRadius: 999,
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
        pulse={Boolean(step.view) && step.tone !== 'muted'}
        pulseDelay={index * 0.55}
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
        <TimelineCard step={step} compact onSelect={onSelect} sx={{ flexGrow: 1 }} />
        {stem}
      </Box>
      {/* Dot on the rail, with the date on the side away from the card */}
      <Dot
        tone={step.tone}
        pulse={Boolean(step.view) && step.tone !== 'muted'}
        pulseDelay={index * 0.55}
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
  pulse = false,
  pulseDelay = 0,
  children,
  sx,
}: {
  tone?: TimelineTone
  /** Breathe a soft ring: the step opens a view. */
  pulse?: boolean
  /** Seconds to hold the ring back, so neighbouring dots don't breathe in unison. */
  pulseDelay?: number
  children: ReactNode
  sx?: SxProps<Theme>
}) {
  return (
    <Box
      sx={[
        (theme) => {
          const { dotSize, dotHalo } = theme.coDesign.shell.timeline
          return {
            justifySelf: 'center',
            alignSelf: 'center',
            position: 'relative',
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            zIndex: 2,
            boxShadow: `0 0 0 ${dotHalo}px ${theme.coDesign.shell.pageBackground}`,
            // Hollow dots (planned steps) show the page through a ring.
            ...(toneOf(theme, tone).hollowDot
              ? {
                  bgcolor: theme.coDesign.shell.pageBackground,
                  border: `2px solid ${toneOf(theme, tone).dot}`,
                  boxSizing: 'border-box',
                }
              : { bgcolor: toneOf(theme, tone).dot }),
            ...(pulse && {
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                bgcolor: toneOf(theme, tone).dot,
                opacity: 0,
                animation: `${dotPulse} 2.2s ease-out ${pulseDelay}s infinite`,
                pointerEvents: 'none',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              },
            }),
          }
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  )
}

function TimelineCard({
  step,
  compact,
  onSelect,
  sx,
  children,
}: {
  step: TimelineStep
  compact: boolean
  onSelect: (view: string) => void
  sx?: SxProps<Theme>
  children?: ReactNode
}) {
  const view = step.view
  const tone = step.tone ?? 'default'
  const subtitle = step.subtitle.join(' ')
  const content = compact ? (
    <>
      {step.status && <StatusTag status={step.status} tone={tone} />}
      {children}
      <Typography
        variant="chartTitle"
        component="h3"
        sx={(theme) => ({ color: toneOf(theme, tone).title })}
      >
        {step.title}
      </Typography>
      <Typography
        variant="controlLabel"
        component="p"
        sx={(theme) => ({ color: toneOf(theme, tone).subtitle })}
      >
        {subtitle}
      </Typography>
    </>
  ) : (
    // Full card: Hammersmith only for the title; everything else in the body face.
    <>
      {step.status && <StatusTag status={step.status} tone={tone} />}
      {children}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Typography
          variant="h4"
          component="h3"
          sx={(theme) => ({ color: toneOf(theme, tone).title })}
        >
          {step.title}
        </Typography>
        <Typography
          variant="takeawayLead"
          component="p"
          sx={(theme) => ({ color: toneOf(theme, tone).subtitle })}
        >
          {subtitle}
        </Typography>
      </Box>
      {step.body && (
        <Typography
          variant="cardBody"
          sx={(theme) => ({ color: theme.coDesign.shell.timeline.card.body })}
        >
          {step.body}
        </Typography>
      )}
      {step.details && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            variant="takeawayLabel"
            component="p"
            sx={(theme) => ({ color: theme.coDesign.shell.timeline.card.label })}
          >
            {step.details.label}
          </Typography>
          <Box component="ul" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, m: 0, p: 0 }}>
            {step.details.items.map((item) => (
              <Typography
                key={item}
                component="li"
                variant="chipQualifier"
                sx={(theme) => ({
                  listStyle: 'none',
                  px: 1.5,
                  py: 0.625,
                  borderRadius: 999,
                  color: theme.coDesign.shell.timeline.card.chipText,
                  bgcolor: theme.coDesign.shell.timeline.card.chipBackground,
                })}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
      {/* The whole card is the link; this row names where it goes */}
      {view && step.action && (
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: theme.jtSpacing.gap.xs,
            mt: theme.jtSpacing.component.xs,
            pt: theme.jtSpacing.component.sm,
            borderTop: `1px solid ${theme.coDesign.shell.timeline.card.divider}`,
            color: theme.coDesign.shell.timeline.card.action,
            '& svg': { transition: 'transform 180ms ease' },
          })}
        >
          <Typography variant="tableValueStrong" component="span" sx={{ color: 'inherit' }}>
            {step.action}
          </Typography>
          <Icon name="arrow-right" size={18} />
        </Box>
      )}
    </>
  )

  const extraSx = Array.isArray(sx) ? sx : [sx]
  // Steps without a dashboard view are informational: no link or hover.
  if (!view) {
    return <Box sx={[cardBaseSx(compact, tone), ...extraSx]}>{content}</Box>
  }

  return (
    <ButtonBase
      onClick={() => onSelect(view)}
      sx={[
        cardBaseSx(compact, tone),
        (theme) => {
          const card = theme.coDesign.shell.timeline.card
          return {
            transition: 'transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease',
            '&:hover, &.Mui-focusVisible': {
              transform: `translateY(-${card.hoverLift}px)`,
              borderColor: card.hoverBorder,
              boxShadow: card.hoverShadow,
            },
            '&:hover svg, &.Mui-focusVisible svg': { transform: 'translateX(2px)' },
            '&:active': { transform: 'translateY(0)' },
            '&.Mui-focusVisible': focusRing,
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
              '&:hover, &.Mui-focusVisible': { transform: 'none' },
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

// Full cards read left to right like the site's document cards; compact cards
// stay centred on their dot.
function cardBaseSx(compact: boolean, tone: TimelineTone) {
  return (theme: Theme) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: compact ? 1 : 2,
    px: compact ? { xs: 3, md: 2 } : theme.jtSpacing.component.md,
    py: compact ? 2.5 : theme.jtSpacing.component.md,
    textAlign: compact ? 'center' : 'left',
    color: 'common.white',
    bgcolor: toneOf(theme, tone).cardBackground,
    border: toneOf(theme, tone).border,
    borderRadius: theme.coDesign.shell.timeline.card.radius,
    boxShadow: toneOf(theme, tone).shadow,
  })
}

const statusLabels: Record<TimelineStatus, string> = { ongoing: 'Ongoing', upcoming: 'Upcoming' }

// Status tag sitting on the card's top edge.
function StatusTag({ status, tone }: { status: TimelineStatus; tone: TimelineTone }) {
  return (
    <Typography
      variant="columnHead"
      component="span"
      sx={(theme) => {
        const toneTokens = toneOf(theme, tone)
        return {
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          px: 1,
          py: 0.25,
          whiteSpace: 'nowrap',
          color: toneTokens.date,
          bgcolor: toneTokens.tagBackground,
          border: `1px solid ${toneTokens.rail}`,
          borderRadius: 999,
        }
      }}
    >
      {statusLabels[status]}
    </Typography>
  )
}
