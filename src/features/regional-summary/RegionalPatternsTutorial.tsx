import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton, Paper, Stack, Typography, useMediaQuery } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  regionalSummaryControlStyles,
  regionalSummaryDetailTypography,
  regionalSummarySizing,
  regionalSummaryTutorialStyles,
} from './regionalSummaryStyles'

interface TutorialStep {
  title: string
  target?: string
  body: string
  promotional?: boolean
}

const steps: TutorialStep[] = [
  {
    title: 'Choose a salinity pattern',
    target: '[data-tour="regional-pattern-timeline"]',
    body: 'Tap a pink or cyan event bar to load the evidence for that modeled salinity pattern.',
  },
  {
    title: 'Read stations on the map',
    target: '[data-tour="regional-pattern-map"]',
    body: 'After selection, station colors use the same white-to-pink or white-to-cyan scale as the station distribution.',
  },
  {
    title: 'Compare the evidence',
    target: '[data-tour="regional-pattern-details"]',
    body: 'The line chart compares scenario and baseline conditions. The station distribution and interpretation explain the spatial response.',
  },
  {
    title: 'Explore another region',
    target: '[data-tour="regional-pattern-regions"]',
    body: 'Tap another regional row to switch places while keeping the full timeline available for comparison.',
  },
  {
    title: 'Go deeper with the Salinity Difference Explorer',
    body: 'Want to explore salinity changes in more detail? Check out the Salinity Difference Explorer on the screens next to this touchscreen.',
    promotional: true,
  },
]

interface Bounds {
  bottom: number
  left: number
  right: number
  top: number
}

function targetBounds(selector: string): Bounds | null {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
  if (!nodes.length) return null
  const rects = nodes.map((node) => node.getBoundingClientRect())
  return {
    bottom: Math.max(...rects.map((rect) => rect.bottom)),
    left: Math.min(...rects.map((rect) => rect.left)),
    right: Math.max(...rects.map((rect) => rect.right)),
    top: Math.min(...rects.map((rect) => rect.top)),
  }
}

export default function RegionalPatternsTutorial({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [bounds, setBounds] = useState<Bounds | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const step = steps[stepIndex]

  useEffect(() => {
    if (!open) return undefined
    const timeout = window.setTimeout(() => setStepIndex(0), 0)
    return () => window.clearTimeout(timeout)
  }, [open])

  useLayoutEffect(() => {
    if (!open) return undefined
    if (!step.target) return undefined
    const targetSelector = step.target
    const target = document.querySelector<HTMLElement>(targetSelector)
    target?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
    const update = () => setBounds(targetBounds(targetSelector))
    update()
    const frame = window.requestAnimationFrame(update)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, reduceMotion, step.target])

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    cardRef.current?.focus()
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose, open, stepIndex])

  if (!open) return null

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const activeBounds = step.target ? bounds : null
  const cardWidth = Math.min(
    regionalSummarySizing.tutorialWidthMax,
    Math.max(
      regionalSummarySizing.tutorialWidthMin,
      viewportWidth * regionalSummarySizing.tutorialWidthRatio,
    ),
    viewportWidth - 32,
  )
  const estimatedCardHeight = regionalSummarySizing.tutorialEstimatedHeight
  const gap = 20
  let cardLeft = Math.max(gap, (viewportWidth - cardWidth) / 2)
  let cardTop = Math.max(gap, (viewportHeight - estimatedCardHeight) / 2)

  if (activeBounds) {
    if (activeBounds.right + gap + cardWidth <= viewportWidth) {
      cardLeft = activeBounds.right + gap
      cardTop = Math.min(
        viewportHeight - estimatedCardHeight - gap,
        Math.max(gap, activeBounds.top),
      )
    } else if (activeBounds.left - gap - cardWidth >= 0) {
      cardLeft = activeBounds.left - gap - cardWidth
      cardTop = Math.min(
        viewportHeight - estimatedCardHeight - gap,
        Math.max(gap, activeBounds.top),
      )
    } else {
      cardLeft = Math.min(viewportWidth - cardWidth - gap, Math.max(gap, activeBounds.left))
      cardTop =
        activeBounds.bottom + gap + estimatedCardHeight <= viewportHeight
          ? activeBounds.bottom + gap
          : Math.max(gap, activeBounds.top - estimatedCardHeight - gap)
    }
  }

  return (
    <Box sx={{ inset: 0, pointerEvents: 'none', position: 'fixed', zIndex: 1400 }}>
      {activeBounds ? (
        <Box
          aria-hidden
          sx={(theme) => ({
            position: 'fixed',
            left: activeBounds.left - 10,
            top: activeBounds.top - 10,
            width: Math.max(0, activeBounds.right - activeBounds.left) + 20,
            height: Math.max(0, activeBounds.bottom - activeBounds.top) + 20,
            border: 3,
            borderColor: 'primary.main',
            borderRadius: 1,
            boxShadow: `0 0 0 9999px ${alpha(theme.palette.common.black, 0.72)}`,
            transition: reduceMotion ? 'none' : 'all 220ms ease',
          })}
        />
      ) : (
        <Box
          aria-hidden
          sx={(theme) => ({
            position: 'fixed',
            inset: 0,
            bgcolor: alpha(theme.palette.common.black, 0.72),
          })}
        />
      )}

      <Paper
        ref={cardRef}
        role="dialog"
        aria-label={`Tutorial step ${stepIndex + 1} of ${steps.length}: ${step.title}`}
        tabIndex={-1}
        elevation={12}
        sx={{
          position: 'fixed',
          left: cardLeft,
          top: cardTop,
          width: cardWidth,
          maxHeight: 'calc(100dvh - 32px)',
          overflowY: 'auto',
          pointerEvents: 'auto',
          ...(step.promotional
            ? regionalSummaryTutorialStyles.promotionCard
            : regionalSummaryTutorialStyles.card),
          borderRadius: 1,
          p: regionalSummarySizing.surfacePadding,
          display: 'grid',
          gap: 2,
          transition: reduceMotion ? 'none' : 'left 220ms ease, top 220ms ease',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography sx={{ ...regionalSummaryDetailTypography.eyebrow, color: 'primary.main' }}>
              Step {stepIndex + 1} of {steps.length}
            </Typography>
            <Typography
              component="h2"
              sx={{
                ...regionalSummaryDetailTypography.title,
                ...(step.promotional ? regionalSummaryTutorialStyles.promotionTitle : {}),
                mt: 1,
              }}
            >
              {step.title}
            </Typography>
          </Box>
          <IconButton aria-label="Close tutorial" onClick={onClose} sx={{ color: 'base.100' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography sx={{ ...regionalSummaryDetailTypography.body, color: 'base.100' }}>
          {step.body}
        </Typography>

        <Stack
          direction="row"
          aria-label="Tutorial progress"
          sx={{ gap: 0.5, justifyContent: 'center' }}
        >
          {steps.map((item, index) => (
            <IconButton
              key={item.title}
              aria-label={`Go to step ${index + 1}: ${item.title}`}
              onClick={() => setStepIndex(index)}
              size="small"
              sx={{ p: 0.5 }}
            >
              <Box
                sx={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  bgcolor: index === stepIndex ? 'primary.main' : 'base.300',
                }}
              />
            </IconButton>
          ))}
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button onClick={onClose} sx={regionalSummaryControlStyles.compactTouchButton}>
            Skip tour
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((index) => index - 1)}
              sx={regionalSummaryControlStyles.compactTouchButton}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (stepIndex === steps.length - 1) onClose()
                else setStepIndex((index) => index + 1)
              }}
              sx={regionalSummaryControlStyles.compactTouchButton}
            >
              {stepIndex === steps.length - 1 ? 'Done' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
