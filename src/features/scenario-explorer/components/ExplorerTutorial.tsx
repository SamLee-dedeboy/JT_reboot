import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'

interface TutorialStep {
  title: string
  target: string
  paragraphs: string[]
  // Replaces the paragraphs on the public route, which offers only its four comparisons.
  publicParagraphs?: string[]
  interactions?: string[]
}

const STEPS: TutorialStep[] = [
  {
    title: 'Purpose of the explorer',
    target: '[data-tour="explorer-purpose"]',
    paragraphs: [
      'Compare how salinity changes across scenarios, regions, stations, and time. The timeline, station distribution, and map are linked views of the same selection.',
    ],
  },
  {
    title: 'Choose a comparison',
    target: '[data-tour="comparison-tabs"]',
    paragraphs: [
      'Use this menu to switch comparisons. Each comparison has its own available dates and scenarios.',
    ],
    publicParagraphs: [
      'Use this menu to switch between four comparisons. Each has its own available dates and scenarios.',
      '01 Adaptation Scenario Comparison compares adaptation scenarios under current conditions.',
      '02 Alternative Delta Outflow compares runs with different Delta outflow levels.',
      '03 Sea Level Rise Adaptation Scenario Comparison compares adaptation scenarios with sea level rise.',
      '04 Sea Level Rise vs. Current Comparison compares each scenario with sea level rise against the same scenario today.',
    ],
    interactions: ['Open the menu and select a comparison to load it.'],
  },
  {
    title: 'Set the base and selected scenarios',
    target: '[data-tour="scenario-controls"]',
    paragraphs: [
      'The selected scenario is measured relative to the base scenario. Blue identifies the base; green identifies the selected scenario.',
      'Calling on Reserves and A Tunnel are computed against the CalSim Business as Usual run, so selecting either one locks the base. The sea level rise vs. current comparison has a single Scenario menu, because each scenario is measured against its own current run.',
    ],
    interactions: [
      'Open a menu to change a scenario.',
      'Use the swap button, where available, to reverse the comparison.',
    ],
  },
  {
    title: 'Filter the region and choose values',
    target: '[data-tour="region-values"]',
    paragraphs: [
      'The region filters all three linked views. Display differences as absolute EC in µS/cm or as percent change relative to the selected base scenario.',
    ],
    interactions: [
      'Choose a region or switch value units.',
      'Use the information icons for definitions and formulas.',
    ],
  },
  {
    title: 'Read the color scale',
    target: '[data-tour="color-scale"]',
    paragraphs: [
      'Teal means fresher than the selected base scenario and pink means saltier. The scale is capped at the 90th percentile so extreme values do not wash out differences elsewhere.',
    ],
  },
  {
    title: 'Read the timeline',
    target: '[data-tour="line-chart"]',
    paragraphs: [
      'The green line averages the stations in the selected spread for the selected scenario. The shaded band shows that same station spread, and the value at the top reports the current average deviation for those stations.',
      'The labeled bands below the axis identify the water-year periods represented in the comparison.',
      'In the adaptation scenario comparison, shaded windows mark when Bolster & Fortify’s gates are closed or when Calling on Reserves releases more than Business as Usual at Keswick. Hover a window for its dates.',
    ],
    interactions: [
      'Change All stations, Central 90%, or Central 50% to choose which stations the average line, shaded band, and station distribution use.',
      'Open the information icons for detailed calculation notes.',
    ],
  },
  {
    title: 'Interact with the timeline',
    target: '[data-tour="line-chart"]',
    paragraphs: [
      'Move through time and compare additional scenario lines without changing the selected scenario. All linked views update to the active date.',
    ],
    interactions: [
      'Drag the date slider or drag horizontally inside the chart.',
      'Use the eye controls to show or hide comparison scenarios.',
      'Hover a visible comparison scenario control to highlight its line in blue.',
    ],
  },
  {
    title: 'Expand scenario comparisons',
    target: '[data-tour="scenario-overlay-expand"]',
    paragraphs: [
      'When two or more scenarios are visible, expand the timeline to use the full dashboard width. Expanded mode temporarily hides the station distribution and map so the scenario lines have more room.',
    ],
    interactions: [
      'Show at least one additional scenario to enable the expand button.',
      'Select the expand button to focus on the timeline.',
      'Select the restore button before continuing to the station distribution and map.',
    ],
  },
  {
    title: 'Inspect the station distribution',
    target: '[data-tour="beeswarm"]',
    paragraphs: [
      'Each dot is one station on the active date. Its vertical position shows that station’s difference from the selected base scenario.',
      'A brushed band keeps the same vertical position as the date changes. For example, brushing the top continues to follow the saltiest portion of stations on each day.',
    ],
    interactions: [
      'Drag vertically across the plot to brush a value range and highlight matching stations on the map.',
      'Move through dates to follow the same relative portion of the distribution over time.',
      'Double-click the plot to clear the brush.',
      'Hover a dot to read its station details.',
    ],
  },
  {
    title: 'Explore stations on the map',
    target: '[data-tour="map"]',
    paragraphs: [
      'Map colors use the same teal-to-pink scale. The map responds to the selected region, date, scenario, and any brushed station range.',
    ],
    interactions: [
      'Pan and zoom to inspect station patterns.',
      'Click a station to open its name, ID, region, value, scenario, and date.',
      'Close the station card with its × control or click elsewhere on the map.',
      'Select the lasso icon and draw around stations to focus the timeline and station distribution on them.',
    ],
  },
]

interface ExplorerTutorialProps {
  open: boolean
  onClose: () => void
  publicModesOnly?: boolean
}

const targetBounds = (selector: string) => {
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

export default function ExplorerTutorial({
  open,
  onClose,
  publicModesOnly = false,
}: ExplorerTutorialProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [bounds, setBounds] = useState<ReturnType<typeof targetBounds>>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const step = STEPS[stepIndex]

  useEffect(() => {
    if (!open) return undefined
    const timeout = window.setTimeout(() => setStepIndex(0), 0)
    return () => window.clearTimeout(timeout)
  }, [open])

  useLayoutEffect(() => {
    if (!open) return undefined
    const target = document.querySelector<HTMLElement>(step.target)
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    const update = () => setBounds(targetBounds(step.target))
    update()
    const frame = window.requestAnimationFrame(update)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, step.target])

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
  const cardWidth = Math.min(520, viewportWidth - 32)
  const gap = 16
  let cardLeft = Math.max(gap, (viewportWidth - cardWidth) / 2)
  let cardTop = gap
  if (bounds) {
    if (bounds.right + gap + cardWidth <= viewportWidth) cardLeft = bounds.right + gap
    else if (bounds.left - gap - cardWidth >= 0) cardLeft = bounds.left - gap - cardWidth
    else cardLeft = Math.min(viewportWidth - cardWidth - gap, Math.max(gap, bounds.left))
    cardTop = Math.min(viewportHeight - 420, Math.max(gap, bounds.top))
  }

  return (
    <Box sx={{ inset: 0, pointerEvents: 'none', position: 'fixed', zIndex: 1400 }}>
      {bounds && (
        <Box
          aria-hidden
          sx={(theme) => ({
            border: 2,
            borderColor: 'brand.primaryBlue',
            borderRadius: 1,
            boxShadow: `0 0 0 9999px ${alpha(theme.palette.common.black, 0.72)}`,
            height: `calc(${Math.max(0, bounds.bottom - bounds.top)}px + ${theme.spacing(theme.jtSpacing.component.sm)} + ${theme.spacing(theme.jtSpacing.component.sm)})`,
            left: `calc(${bounds.left}px - ${theme.spacing(theme.jtSpacing.component.sm)})`,
            position: 'fixed',
            top: `calc(${bounds.top}px - ${theme.spacing(theme.jtSpacing.component.sm)})`,
            transition: 'all 220ms ease',
            width: `calc(${Math.max(0, bounds.right - bounds.left)}px + ${theme.spacing(theme.jtSpacing.component.sm)} + ${theme.spacing(theme.jtSpacing.component.sm)})`,
          })}
        />
      )}
      <Paper
        ref={cardRef}
        role="dialog"
        aria-label={`Tutorial step ${stepIndex + 1} of ${STEPS.length}: ${step.title}`}
        tabIndex={-1}
        elevation={12}
        sx={(theme) => ({
          bgcolor: 'base.700',
          border: 1,
          borderColor: 'brand.primaryBlue',
          borderRadius: 1,
          display: 'grid',
          gap: theme.jtSpacing.gap.sm,
          left: stepIndex === 0 ? '50%' : cardLeft,
          // Stays on screen from wherever it sits; a long step scrolls inside the card.
          maxHeight:
            stepIndex === 0
              ? `calc(100dvh - ${theme.spacing(4)})`
              : `calc(100dvh - ${Math.max(gap, cardTop) + gap}px)`,
          overflowY: 'auto',
          p: theme.jtSpacing.component.md,
          pointerEvents: 'auto',
          position: 'fixed',
          top: stepIndex === 0 ? '50%' : Math.max(gap, cardTop),
          transform: stepIndex === 0 ? 'translate(-50%, -50%)' : 'none',
          width: cardWidth,
        })}
      >
        <Box sx={{ alignItems: 'start', display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="captionSmall" color="brand.primaryBlue">
              Step {stepIndex + 1} of {STEPS.length}
            </Typography>
            <Typography variant="h4">{step.title}</Typography>
          </Box>
          <IconButton
            aria-label="Close tutorial"
            onClick={onClose}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {(publicModesOnly && step.publicParagraphs ? step.publicParagraphs : step.paragraphs).map(
          (paragraph) => (
            <Typography key={paragraph} variant="body1" component="p" color="text.secondary">
              {paragraph}
            </Typography>
          ),
        )}
        {step.interactions && (
          <Box
            sx={(theme) => ({
              bgcolor: 'surface',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              display: 'grid',
              gap: theme.jtSpacing.gap.sm,
              p: theme.jtSpacing.component.md,
            })}
          >
            <Typography variant="button" color="brand.primaryGreen">
              Available interaction
            </Typography>
            <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.sm })}>
              {step.interactions.map((interaction) => {
                const separator = interaction.indexOf(' ')
                const action = separator < 0 ? interaction : interaction.slice(0, separator)
                const detail = separator < 0 ? '' : interaction.slice(separator)
                return (
                  <Box
                    key={interaction}
                    sx={(theme) => ({
                      alignItems: 'center',
                      display: 'grid',
                      gap: theme.jtSpacing.gap.sm,
                      gridTemplateColumns: 'auto minmax(0, 1fr)',
                    })}
                  >
                    <Box
                      aria-hidden
                      sx={(theme) => ({
                        bgcolor: 'brand.primaryGreen',
                        borderRadius: '50%',
                        height: theme.spacing(1),
                        width: theme.spacing(1),
                      })}
                    />
                    <Typography variant="caption" color="text.secondary">
                      <Box component="span" sx={{ color: 'brand.primaryGreen' }}>
                        {action}
                      </Box>
                      {detail}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}
        <Stack
          direction="row"
          aria-label="Tutorial progress"
          sx={(theme) => ({ gap: theme.jtSpacing.gap.xs, justifyContent: 'center' })}
        >
          {STEPS.map((item, index) => (
            <IconButton
              key={item.title}
              aria-label={`Go to step ${index + 1}: ${item.title}`}
              onClick={() => setStepIndex(index)}
              size="small"
              sx={{ p: 0.5 }}
            >
              <Box
                sx={{
                  bgcolor: index === stepIndex ? 'brand.primaryBlue' : 'base.300',
                  borderRadius: '50%',
                  height: 8,
                  width: 8,
                }}
              />
            </IconButton>
          ))}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={onClose}
            color="inherit"
            size="small"
            sx={(theme) => ({
              borderRadius: 1,
              height: theme.spacing(4),
              minWidth: 'auto',
              px: theme.jtSpacing.component.sm,
              py: 0,
            })}
          >
            Skip tour
          </Button>
          <Box sx={(theme) => ({ display: 'flex', gap: theme.jtSpacing.gap.xs })}>
            <Button
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((index) => index - 1)}
              size="small"
              sx={(theme) => ({
                borderRadius: 1,
                height: theme.spacing(4),
                minWidth: 'auto',
                px: theme.jtSpacing.component.sm,
                py: 0,
              })}
            >
              Back
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={(theme) => ({
                borderRadius: 1,
                height: theme.spacing(4),
                minWidth: 'auto',
                px: theme.jtSpacing.component.sm,
                py: 0,
              })}
              onClick={() => {
                if (stepIndex === STEPS.length - 1) onClose()
                else setStepIndex((index) => index + 1)
              }}
            >
              {stepIndex === STEPS.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
