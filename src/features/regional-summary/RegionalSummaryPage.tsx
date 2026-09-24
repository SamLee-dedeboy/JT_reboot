import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import { Box, Button, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { scenarios, type ScenarioContent } from '../scenarios/content/scenarioContent'
import { assetUrl } from '../../utils/baseUrl'
import {
  regionalSummaryControlStyles,
  regionalSummarySizing,
  regionalSummaryTypography,
} from './regionalSummaryStyles'
import RegionalSalinityExplorer from './RegionalSalinityExplorer'

const alternativeDeltaOutflows: ScenarioContent = {
  slug: 'alternative-delta-outflows',
  number: '00',
  title: 'Alternative Delta Outflows',
  image: '/images/scenarios/outflow.jpg',
  summary:
    'Explore how alternative Delta outflow levels change salinity patterns relative to current operations.',
  story: [],
  mapFeatures: [],
}

const adaptationScenarioOrder = [
  'eco-machine',
  'new-green-watershed',
  'bolster-and-fortify',
  'calling-on-reserves',
  'a-tunnel',
] as const

const adaptationScenarios = [
  alternativeDeltaOutflows,
  ...adaptationScenarioOrder.map(
    (slug) => scenarios.find((scenario) => scenario.slug === slug) as ScenarioContent,
  ),
]

export default function RegionalSummaryPage() {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()
  const [selectedScenario, setSelectedScenario] = useState<ScenarioContent | null>(null)
  const [pendingScenario, setPendingScenario] = useState<ScenarioContent | null>(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [isExploring, setIsExploring] = useState(false)

  const selectScenario = (scenario: ScenarioContent) => {
    if (!selectedScenario) {
      setSelectedScenario(scenario)
      setDetailsVisible(true)
      return
    }

    if (selectedScenario.slug === scenario.slug) {
      setDetailsVisible(true)
      return
    }

    setPendingScenario(scenario)
    setDetailsVisible(false)
  }

  const finishDetailsExit = () => {
    if (pendingScenario) {
      setSelectedScenario(pendingScenario)
      setPendingScenario(null)
      setDetailsVisible(true)
      return
    }

    setSelectedScenario(null)
  }

  return (
    <Box sx={{ height: '100dvh', overflow: 'hidden', bgcolor: 'base.900' }}>
      <AnimatePresence mode="wait" initial={false}>
        {isExploring && selectedScenario ? (
          <motion.div
            key="regional-salinity-map"
            style={{
              height: '100dvh',
              overflow: 'hidden',
              backgroundColor: theme.palette.base[900],
            }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.985 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <RegionalSalinityExplorer
              scenario={selectedScenario}
              onBack={() => setIsExploring(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="scenario-selection"
            style={{
              height: '100dvh',
              overflow: 'hidden',
              backgroundColor: theme.palette.base[900],
            }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.985 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Box
              component="main"
              aria-label="Regional Summary scenario selection"
              sx={{
                minHeight: '100dvh',
                bgcolor: 'base.900',
                color: 'common.white',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Box
                component="header"
                sx={{
                  minHeight: { xs: 112, md: 120 },
                  px: regionalSummarySizing.pageInset,
                  py: 'clamp(16px, 1.25vw, 48px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: regionalSummarySizing.sectionGap,
                  borderBottom: 1,
                  borderColor: 'translucent.primaryGreen',
                  flex: '0 0 auto',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                    columnGap: 2,
                    rowGap: 0.5,
                  }}
                >
                  <Typography component="h1" sx={regionalSummaryTypography.pageTitle}>
                    Choose an adaptation scenario
                  </Typography>
                  <Typography
                    component="p"
                    sx={{ ...regionalSummaryTypography.pagePrompt, color: 'base.100' }}
                  >
                    to explore salinity patterns across the Delta
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 1,
                    color: 'base.100',
                  }}
                >
                  <TouchAppIcon aria-hidden="true" />
                  <Typography sx={regionalSummaryTypography.instruction}>
                    Tap a scenario to learn more
                  </Typography>
                </Box>
              </Box>

              <Box
                component="ul"
                sx={{
                  m: 0,
                  p: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flex: '1 1 auto',
                  minHeight: 0,
                  flexDirection: { xs: 'column', md: 'row' },
                  overflow: { xs: 'auto', md: 'hidden' },
                }}
              >
                {adaptationScenarios.map((scenario, index) => {
                  const isSelected = selectedScenario?.slug === scenario.slug
                  const anotherScenarioSelected = selectedScenario !== null && !isSelected

                  return (
                    <Box
                      component="li"
                      key={scenario.slug}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      aria-label={`${scenario.title}. ${isSelected ? 'Selected' : 'Tap to learn more'}`}
                      onClick={() => selectScenario(scenario)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          selectScenario(scenario)
                        }
                      }}
                      sx={{
                        position: 'relative',
                        isolation: 'isolate',
                        minWidth: 0,
                        minHeight: { xs: isSelected ? 430 : 144, md: 0 },
                        flex: {
                          xs: '0 0 auto',
                          md: isSelected ? '3 1 0' : anotherScenarioSelected ? '0.48 1 0' : '1 1 0',
                        },
                        cursor: 'pointer',
                        overflow: 'hidden',
                        borderRight: { md: 1 },
                        borderBottom: { xs: 1, md: 0 },
                        borderColor: 'translucent.primaryGreen',
                        outline: 'none',
                        transition: reduceMotion
                          ? 'none'
                          : 'flex 520ms cubic-bezier(0.22, 1, 0.36, 1), min-height 520ms cubic-bezier(0.22, 1, 0.36, 1)',
                        '&:focus-visible': {
                          boxShadow: `inset 0 0 0 4px ${theme.palette.primary.main}`,
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          zIndex: -1,
                          bgcolor: isSelected
                            ? alpha(theme.palette.base[900], 0.28)
                            : alpha(theme.palette.base[900], anotherScenarioSelected ? 0.72 : 0.38),
                          transition: 'background-color 240ms ease',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={assetUrl(scenario.image)}
                        alt=""
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          zIndex: -2,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transform: isSelected ? 'scale(1.035)' : 'scale(1)',
                          filter: anotherScenarioSelected
                            ? 'brightness(0.62) saturate(0.72)'
                            : 'none',
                          transition: reduceMotion
                            ? 'none'
                            : 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms ease',
                        }}
                      />

                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          p: regionalSummarySizing.surfacePadding,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          background: isSelected
                            ? 'linear-gradient(90deg, rgba(16,22,24,0.72) 0%, rgba(16,22,24,0.34) 58%, rgba(16,22,24,0.08) 100%)'
                            : anotherScenarioSelected
                              ? 'linear-gradient(180deg, rgba(16,22,24,0.78) 0%, rgba(16,22,24,0.54) 100%)'
                              : 'linear-gradient(180deg, rgba(16,22,24,0.58) 0%, rgba(16,22,24,0.08) 72%)',
                        }}
                      >
                        <Typography
                          component="p"
                          sx={{
                            ...regionalSummaryTypography.scenarioNumber,
                            color: 'primary.main',
                            mb: 1.5,
                          }}
                        >
                          {String(index).padStart(2, '0')}
                        </Typography>
                        <Typography
                          component="h2"
                          sx={{
                            ...regionalSummaryTypography.scenarioTitle,
                            maxWidth: isSelected ? '18ch' : '10ch',
                            textWrap: 'balance',
                            opacity: anotherScenarioSelected ? 0 : 1,
                            transform: anotherScenarioSelected
                              ? 'translateY(-8px)'
                              : 'translateY(0)',
                            transition: reduceMotion
                              ? 'none'
                              : 'opacity 180ms ease, transform 240ms ease',
                          }}
                        >
                          {scenario.title}
                        </Typography>

                        <AnimatePresence initial={false} onExitComplete={finishDetailsExit}>
                          {isSelected && detailsVisible && (
                            <motion.div
                              key={scenario.slug}
                              initial={reduceMotion ? false : { opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { duration: 0.2, delay: reduceMotion ? 0 : 0.16 },
                              }}
                              exit={
                                reduceMotion
                                  ? undefined
                                  : { opacity: 0, transition: { duration: 0.12, delay: 0 } }
                              }
                            >
                              <Typography
                                sx={{
                                  ...regionalSummaryTypography.scenarioSummary,
                                  mt: 2.5,
                                  maxWidth: '52ch',
                                  color: 'common.white',
                                  textWrap: 'pretty',
                                }}
                              >
                                {scenario.summary}
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
                                <Button
                                  variant={scenario.title === 'A Tunnel' ? 'outlined' : 'contained'}
                                  size="large"
                                  endIcon={<ArrowForwardIcon />}
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    setIsExploring(true)
                                  }}
                                  sx={{
                                    ...regionalSummaryControlStyles.primaryTouchButton,
                                  }}
                                >
                                  {scenario.title === 'A Tunnel'
                                    ? 'Scenario Overview'
                                    : 'Salinity Exploration'}
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="large"
                                  startIcon={<ArrowBackIcon />}
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    setPendingScenario(null)
                                    setDetailsVisible(false)
                                  }}
                                  sx={{
                                    ...regionalSummaryControlStyles.primaryTouchButton,
                                    color: 'common.white',
                                    borderColor: 'primary.main',
                                  }}
                                >
                                  All scenarios
                                </Button>
                              </Box>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}
