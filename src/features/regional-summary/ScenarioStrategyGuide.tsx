import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ScenarioContent } from '../scenarios/content'
import { scenarioStrategies } from './scenarioStrategies'
import {
  regionalSummaryControlStyles,
  regionalSummaryDetailTypography,
  regionalSummarySizing,
  regionalSummaryTutorialStyles,
} from './regionalSummaryStyles'

interface ScenarioStrategyGuideProps {
  scenario: ScenarioContent
  onClose: () => void
  onWelcome: () => void
  onStepChange: (stepIndex: number) => void
}

const cardPlacements: Array<{
  top?: string
  right?: number
  bottom?: number
  left?: number
}> = [
  { top: 'calc(15dvh + 32px)', right: 32 },
  { bottom: 32, left: 32 },
  { bottom: 32, right: 32 },
]

export default function ScenarioStrategyGuide({
  scenario,
  onClose,
  onWelcome,
  onStepChange,
}: ScenarioStrategyGuideProps) {
  const [started, setStarted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const explorationOnly = scenario.slug === 'alternative-delta-outflows'
  const strategies = scenarioStrategies[scenario.slug] ?? []
  const step = strategies[stepIndex]
  const placement = started ? cardPlacements[stepIndex % cardPlacements.length] : cardPlacements[0]

  useEffect(() => {
    if (started) onStepChange(stepIndex)
    else onWelcome()
  }, [onStepChange, onWelcome, started, stepIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    cardRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, started, stepIndex])

  if (typeof document === 'undefined' || (!explorationOnly && started && !step)) return null

  return createPortal(
    <Box sx={{ inset: 0, pointerEvents: 'none', position: 'fixed', zIndex: 1400 }}>
      <Paper
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={
          started && !explorationOnly
            ? `Adaptation strategy ${stepIndex + 1} of ${strategies.length}: ${step.title}`
            : `Welcome to the ${scenario.title} exploration`
        }
        tabIndex={-1}
        elevation={12}
        sx={(theme) => ({
          ...regionalSummaryTutorialStyles.card,
          borderRadius: 1,
          display: 'grid',
          gap: 2,
          bottom: { xs: 'auto', md: started ? (placement.bottom ?? 'auto') : 'auto' },
          left: { xs: '50%', md: started ? (placement.left ?? 'auto') : '50%' },
          maxHeight: `calc(100dvh - ${theme.spacing(4)})`,
          overflowY: 'auto',
          p: regionalSummarySizing.surfacePadding,
          pointerEvents: 'auto',
          position: 'fixed',
          right: { xs: 'auto', md: started ? (placement.right ?? 'auto') : 'auto' },
          top: { xs: '50%', md: started ? (placement.top ?? 'auto') : '50%' },
          transform: {
            xs: 'translate(-50%, -50%)',
            md: started ? 'none' : 'translate(-50%, -50%)',
          },
          transition: 'left 420ms ease, right 420ms ease, top 420ms ease, bottom 420ms ease',
          width: {
            xs: 'calc(100vw - 32px)',
            sm: started ? regionalSummarySizing.guideWidth : regionalSummarySizing.welcomeWidth,
          },
        })}
      >
        <Box sx={{ alignItems: 'start', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography sx={{ ...regionalSummaryDetailTypography.eyebrow, color: 'primary.main' }}>
              {started && !explorationOnly
                ? `Strategy ${stepIndex + 1} of ${strategies.length}`
                : 'Before you explore'}
            </Typography>
            <Typography component="h2" sx={{ ...regionalSummaryDetailTypography.title, mt: 1 }}>
              {started && !explorationOnly ? step.title : scenario.title}
            </Typography>
          </Box>
          <IconButton
            aria-label="Close strategy guide"
            onClick={onClose}
            sx={{ color: 'base.100' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography sx={{ ...regionalSummaryDetailTypography.body, color: 'base.100' }}>
          {started && !explorationOnly ? step.description : scenario.summary}
        </Typography>
        {!started ? (
          <Typography sx={{ ...regionalSummaryDetailTypography.body, color: 'base.100' }}>
            {explorationOnly
              ? 'Compare how salinity changes when Delta outflow is increased by 30% or reduced by 10% relative to current operations. Use the tabs above the map to switch between alternatives, then tap a region to inspect its approved salinity patterns.'
              : scenario.slug === 'a-tunnel'
                ? 'Our modeling results are coming soon.'
                : 'Take a short tour of the adaptation strategies in this scenario, or skip directly to explore regional salinity patterns.'}
          </Typography>
        ) : null}
        {started && !explorationOnly ? (
          <Stack
            direction="row"
            aria-label="Guide progress"
            sx={{ gap: 0.5, justifyContent: 'center' }}
          >
            {strategies.map((strategy, index) => (
              <IconButton
                key={strategy.title}
                aria-label={`Go to strategy ${index + 1}: ${strategy.title}`}
                onClick={() => setStepIndex(index)}
                size="small"
                sx={{ p: 0.5 }}
              >
                <Box
                  sx={{
                    bgcolor: index === stepIndex ? 'primary.main' : 'base.300',
                    borderRadius: '50%',
                    height: 9,
                    width: 9,
                  }}
                />
              </IconButton>
            ))}
          </Stack>
        ) : null}
        <Box
          sx={{
            display: 'flex',
            justifyContent: explorationOnly ? 'flex-end' : 'space-between',
            gap: 2,
          }}
        >
          {!explorationOnly ? (
            <Button
              onClick={onClose}
              color="inherit"
              sx={regionalSummaryControlStyles.compactTouchButton}
            >
              Skip guide
            </Button>
          ) : null}
          {started && !explorationOnly ? (
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
                  if (stepIndex === strategies.length - 1) onClose()
                  else setStepIndex((index) => index + 1)
                }}
                sx={regionalSummaryControlStyles.compactTouchButton}
              >
                {stepIndex === strategies.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          ) : explorationOnly ? (
            <Button
              variant="contained"
              onClick={onClose}
              sx={regionalSummaryControlStyles.compactTouchButton}
            >
              Start exploration
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setStarted(true)}
              sx={regionalSummaryControlStyles.compactTouchButton}
            >
              Start strategy guide
            </Button>
          )}
        </Box>
      </Paper>
    </Box>,
    document.body,
  )
}
