import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

interface TutorialStep {
  title: string
  target: string
  paragraphs: string[]
  interactions?: string[]
}

const STEPS: TutorialStep[] = [
  {
    title: 'Purpose of Regional Summary',
    target: '[data-tour="regional-purpose"]',
    paragraphs: ['Explore where and when each planning scenario produces meaningful salinity changes relative to Business as Usual. The controls, histogram, map, stations, and place details are linked views of the same filters.'],
  },
  {
    title: 'Choose a scenario',
    target: '[data-tour="regional-scenarios"]',
    paragraphs: ['Each available tab shows one planning scenario compared with Business as Usual. A disabled scenario is temporarily unavailable while its results are recomputed.'],
    interactions: ['Select an available tab to update the summaries, histogram, and map.'],
  },
  {
    title: 'Set meaningful-change thresholds',
    target: '[data-tour="regional-thresholds"]',
    paragraphs: ['Filter summaries by absolute conductivity change, percentage change, or both. OR accepts either enabled condition; AND requires both.'],
    interactions: ['Toggle either condition ON or OFF.', 'Enter a minimum value.', 'Restore the recommended 450 µS/cm OR 10% thresholds.'],
  },
  {
    title: 'Focus on a time period',
    target: '[data-tour="regional-time"]',
    paragraphs: ['The two handles define an inclusive start and exclusive end month. Histogram bins show the number of qualifying summaries in each month on one shared y-scale across enabled scenarios.'],
    interactions: ['Drag either handle to filter the summaries.', 'Hover a histogram bin to read its month and count.'],
  },
  {
    title: 'Show monitoring stations',
    target: '[data-tour="regional-stations"]',
    paragraphs: ['The optional station layer shows all 386 baseline monitoring locations and their station indices. Stations associated with a hovered place are highlighted.'],
    interactions: ['Turn RMA stations on or off.'],
  },
  {
    title: 'Explore places on the map',
    target: '[data-tour="regional-map"]',
    paragraphs: ['Each numbered marker reports the qualifying comparison-period count for one place. Strongest signals are reports whose strongest rolling daily deviation exceeds 700 µS/cm.'],
    interactions: ['Hover a marker to reveal its place name and stations.', 'Click a marker to open all qualifying periods in the side panel.', 'Pan and zoom to inspect the region.'],
  },
]

interface RegionalSummaryTutorialProps {
  open: boolean
  onClose: () => void
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

export default function RegionalSummaryTutorial({ open, onClose }: RegionalSummaryTutorialProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [bounds, setBounds] = useState<ReturnType<typeof targetBounds>>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const step = STEPS[stepIndex]

  useEffect(() => {
    if (open) setStepIndex(0)
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
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
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
      {bounds && <Box aria-hidden sx={(theme) => ({
        border: 2,
        borderColor: 'brand.primaryGreen',
        borderRadius: 1,
        boxShadow: `0 0 0 9999px ${alpha(theme.palette.common.black, 0.72)}`,
        height: `calc(${Math.max(0, bounds.bottom - bounds.top)}px + ${theme.spacing(theme.jtSpacing.component.sm)} + ${theme.spacing(theme.jtSpacing.component.sm)})`,
        left: `calc(${bounds.left}px - ${theme.spacing(theme.jtSpacing.component.sm)})`,
        position: 'fixed',
        top: `calc(${bounds.top}px - ${theme.spacing(theme.jtSpacing.component.sm)})`,
        transition: 'all 220ms ease',
        width: `calc(${Math.max(0, bounds.right - bounds.left)}px + ${theme.spacing(theme.jtSpacing.component.sm)} + ${theme.spacing(theme.jtSpacing.component.sm)})`,
      })} />}
      <Paper ref={cardRef} role="dialog" aria-label={`Tutorial step ${stepIndex + 1} of ${STEPS.length}: ${step.title}`} tabIndex={-1} elevation={12} sx={(theme) => ({ bgcolor: 'base.700', border: 1, borderColor: 'brand.primaryGreen', borderRadius: 1, display: 'grid', gap: theme.jtSpacing.gap.sm, left: stepIndex === 0 ? '50%' : cardLeft, maxHeight: `calc(100dvh - ${theme.spacing(4)})`, overflowY: 'auto', p: theme.jtSpacing.component.md, pointerEvents: 'auto', position: 'fixed', top: stepIndex === 0 ? '50%' : Math.max(gap, cardTop), transform: stepIndex === 0 ? 'translate(-50%, -50%)' : 'none', width: cardWidth })}>
        <Box sx={{ alignItems: 'start', display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="captionSmall" color="brand.primaryGreen">Step {stepIndex + 1} of {STEPS.length}</Typography>
            <Typography variant="h4">{step.title}</Typography>
          </Box>
          <IconButton aria-label="Close tutorial" onClick={onClose} size="small" sx={{ color: 'text.secondary' }}><CloseIcon /></IconButton>
        </Box>
        {step.paragraphs.map((paragraph) => <Typography key={paragraph} variant="body1" component="p" color="text.secondary">{paragraph}</Typography>)}
        {step.interactions && <Box sx={(theme) => ({ bgcolor: 'surface', border: 1, borderColor: 'divider', borderRadius: 1, display: 'grid', gap: theme.jtSpacing.gap.sm, p: theme.jtSpacing.component.md })}>
          <Typography variant="button" color="brand.primaryGreen">Available interaction</Typography>
          <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.sm })}>
            {step.interactions.map((interaction) => {
              const separator = interaction.indexOf(' ')
              const action = separator < 0 ? interaction : interaction.slice(0, separator)
              const detail = separator < 0 ? '' : interaction.slice(separator)
              return <Box key={interaction} sx={(theme) => ({ alignItems: 'center', display: 'grid', gap: theme.jtSpacing.gap.sm, gridTemplateColumns: 'auto minmax(0, 1fr)' })}>
                <Box aria-hidden sx={(theme) => ({ bgcolor: 'brand.primaryGreen', borderRadius: '50%', height: theme.spacing(1), width: theme.spacing(1) })} />
                <Typography variant="caption" color="text.secondary"><Box component="span" sx={{ color: 'brand.primaryGreen' }}>{action}</Box>{detail}</Typography>
              </Box>
            })}
          </Box>
        </Box>}
        <Stack direction="row" aria-label="Tutorial progress" sx={(theme) => ({ gap: theme.jtSpacing.gap.xs, justifyContent: 'center' })}>
          {STEPS.map((item, index) => <IconButton key={item.title} aria-label={`Go to step ${index + 1}: ${item.title}`} onClick={() => setStepIndex(index)} size="small" sx={{ p: 0.5 }}><Box sx={{ bgcolor: index === stepIndex ? 'brand.primaryGreen' : 'base.300', borderRadius: '50%', height: 8, width: 8 }} /></IconButton>)}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onClose} color="inherit" size="small" sx={(theme) => ({ borderRadius: 1, height: theme.spacing(4), minWidth: 'auto', px: theme.jtSpacing.component.sm, py: 0 })}>Skip tour</Button>
          <Box sx={(theme) => ({ display: 'flex', gap: theme.jtSpacing.gap.xs })}>
            <Button disabled={stepIndex === 0} onClick={() => setStepIndex((index) => index - 1)} size="small" sx={(theme) => ({ borderRadius: 1, height: theme.spacing(4), minWidth: 'auto', px: theme.jtSpacing.component.sm, py: 0 })}>Back</Button>
            <Button variant="contained" size="small" sx={(theme) => ({ borderRadius: 1, height: theme.spacing(4), minWidth: 'auto', px: theme.jtSpacing.component.sm, py: 0 })} onClick={() => { if (stepIndex === STEPS.length - 1) onClose(); else setStepIndex((index) => index + 1) }}>{stepIndex === STEPS.length - 1 ? 'Finish' : 'Next'}</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
