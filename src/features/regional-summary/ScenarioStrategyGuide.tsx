import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ScenarioContent } from '../scenarios/content/scenarioContent'
import {
  regionalSummaryControlStyles,
  regionalSummarySizing,
  regionalSummaryTypography,
} from './regionalSummaryStyles'

interface StrategyStep {
  title: string
  description: string
}

const strategiesByScenario: Record<string, StrategyStep[]> = {
  'eco-machine': [
    {
      title: 'Restore tidal landscapes in Suisun Marsh',
      description:
        'Restoration around Grizzly Island changes how tidal energy moves through Suisun Bay, testing whether working wetlands can help limit inland salinity.',
    },
    {
      title: 'Build vegetated landforms in Franks Tract',
      description:
        'New land use interrupts a major route for saltwater intrusion while creating habitat, recreation, and eco-cultural opportunities.',
    },
  ],
  'new-green-watershed': [
    {
      title: 'Keep peat soils wet',
      description:
        'Rice, paludiculture, floating wetlands, and managed wetlands help slow land subsidence while supporting habitat and carbon storage.',
    },
    {
      title: 'Reconnect Delta habitats',
      description:
        'Tidal wetlands, floodplains, side channels, riverbanks, and higher ground form connected spaces for water, fish, plants, and wildlife.',
    },
    {
      title: 'Restore the upstream watershed',
      description:
        'Forest stewardship, meadow restoration, and reconnected floodplains help landscapes hold water and release it more gradually.',
    },
  ],
  'calling-on-reserves': [
    {
      title: 'Reoperate Shasta Reservoir',
      description:
        'Managers change when water is stored and released, balancing a drought reserve against freshwater flows needed downstream.',
    },
    {
      title: 'Send differently timed flows toward the Delta',
      description:
        'Releases travel down the Sacramento River to resist salinity intrusion and support habitats connected to freshwater inflow.',
    },
  ],
  'bolster-and-fortify': [
    {
      title: 'Operate new gates at Franks Tract',
      description:
        'Two drought-time salinity-control gates regulate movement through the northeastern and southeastern corners of the tract.',
    },
    {
      title: 'Reconstruct levees to direct freshwater',
      description:
        'Reclaimed levees inside Franks Tract direct San Joaquin River water south into Old River.',
    },
    {
      title: 'Create a through-Delta freshwater pathway',
      description:
        'A connected freshwater route carries San Joaquin River water through the Delta toward Clifton Court Forebay and the southern pumping plants.',
    },
  ],
  'a-tunnel': [
    {
      title: 'Divert water at northern Delta intakes',
      description:
        'Some Sacramento River water enters a new conveyance route before traveling through the Delta channel network.',
    },
    {
      title: 'Carry water beneath the Delta',
      description:
        'An underground route moves water directly toward Bethany Reservoir while changing the freshwater remaining in Delta channels.',
    },
  ],
}

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
  const strategies = strategiesByScenario[scenario.slug] ?? []
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

  if (typeof document === 'undefined' || (started && !step)) return null

  return createPortal(
    <Box sx={{ inset: 0, pointerEvents: 'none', position: 'fixed', zIndex: 1400 }}>
      <Paper
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={
          started
            ? `Adaptation strategy ${stepIndex + 1} of ${strategies.length}: ${step.title}`
            : `Welcome to the ${scenario.title} strategy guide`
        }
        tabIndex={-1}
        elevation={12}
        sx={(theme) => ({
          bgcolor: 'base.700',
          border: 1,
          borderColor: 'primary.main',
          borderRadius: 1,
          display: 'grid',
          gap: regionalSummarySizing.sectionGap,
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
            <Typography sx={{ ...regionalSummaryTypography.scenarioNumber, color: 'primary.main' }}>
              {started ? `Strategy ${stepIndex + 1} of ${strategies.length}` : 'Before you explore'}
            </Typography>
            <Typography component="h2" sx={{ ...regionalSummaryTypography.regionTitle, mt: 0.75 }}>
              {started ? step.title : scenario.title}
            </Typography>
          </Box>
          <IconButton
            aria-label="Close strategy guide"
            onClick={onClose}
            sx={{
              color: 'base.100',
              minHeight: regionalSummarySizing.compactTouchTarget,
              minWidth: regionalSummarySizing.compactTouchTarget,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography sx={{ ...regionalSummaryTypography.instruction, color: 'base.100' }}>
          {started ? step.description : scenario.summary}
        </Typography>
        {!started ? (
          <Typography sx={{ ...regionalSummaryTypography.instruction, color: 'base.100' }}>
            Take a short tour of the adaptation strategies in this scenario, or skip directly to the
            regional salinity map.
          </Typography>
        ) : null}
        {started ? (
          <Stack
            direction="row"
            aria-label="Guide progress"
            sx={{ gap: 1, justifyContent: 'center' }}
          >
            {strategies.map((strategy, index) => (
              <IconButton
                key={strategy.title}
                aria-label={`Go to strategy ${index + 1}: ${strategy.title}`}
                onClick={() => setStepIndex(index)}
                sx={{
                  p: 1.25,
                  minHeight: regionalSummarySizing.compactTouchTarget,
                  minWidth: regionalSummarySizing.compactTouchTarget,
                }}
              >
                <Box
                  sx={{
                    bgcolor: index === stepIndex ? 'primary.main' : 'base.300',
                    borderRadius: '50%',
                    height: 10,
                    width: 10,
                  }}
                />
              </IconButton>
            ))}
          </Stack>
        ) : null}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={onClose}
            color="inherit"
            sx={regionalSummaryControlStyles.compactTouchButton}
          >
            Skip guide
          </Button>
          {started ? (
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
                sx={regionalSummaryControlStyles.primaryTouchButton}
              >
                {stepIndex === strategies.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={() => setStarted(true)}
              sx={regionalSummaryControlStyles.primaryTouchButton}
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
