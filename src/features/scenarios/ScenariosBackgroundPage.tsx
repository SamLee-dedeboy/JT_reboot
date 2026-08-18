import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import RouteIcon from '@mui/icons-material/Route'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import WavesIcon from '@mui/icons-material/Waves'
import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import scrollama from 'scrollama'
import ScrollReveal from '../../ui/animation/ScrollReveal'
import Footer from '../../ui/Footer'
import NavRail from '../../ui/NavRail'
import Navbar from '../../ui/Navbar'
import ScenariosBackgroundMap from '../../map/instances/ScenariosBackgroundMap'
import type { ScenariosBackgroundMapStep } from '../../map/layers/ScenariosBackgroundLayers'

interface ContextChapter {
  id: string
  kicker: string
  title: string
  body: string
  icon: ReactNode
  accent: string
  mapStep: ScenariosBackgroundMapStep
}

const contextChapters: ContextChapter[] = [
  {
    id: '01',
    kicker: 'Two Rivers',
    title: 'California has two major river systems shaping the Delta',
    body: 'The Sacramento River flows south from Northern California, while the San Joaquin River flows north through the Central Valley. They meet in the Sacramento-San Joaquin Delta, where freshwater moves toward Suisun Bay, San Francisco Bay, and the Pacific Ocean.',
    icon: <RouteIcon />,
    accent: '#7ed957',
    mapStep: 'rivers',
  },
  {
    id: '02',
    kicker: 'The Push and Pull',
    title: 'Freshwater outflow pushes west while ocean water pushes inland',
    body: 'Delta management is shaped by a tug of war: river outflow helps repel salty ocean water, while tides and sea level pressure can move saltwater inland. At the same time, major state and federal water projects export drinking and agricultural water from the southern Delta to communities and farms farther south.',
    icon: <CompareArrowsIcon />,
    accent: '#79e1e4',
    mapStep: 'flow',
  },
  {
    id: '03',
    kicker: 'X2 Distance',
    title: 'X2 helps measure where that tug of war is happening',
    body: 'The X2 salinity index tracks how far the low-salinity zone extends inland from the Golden Gate. In the StoryMap baseline, this distance is shown along the Sacramento and San Joaquin rivers in five-kilometer increments, making X2 a useful shorthand for understanding where freshwater outflow and ocean inflow are meeting.',
    icon: <WaterDropIcon />,
    accent: '#f2c820',
    mapStep: 'x2',
  },
]

const keyTerms = [
  ['Outflow', 'Freshwater moving from the rivers through the Delta toward the Bay.'],
  [
    'Salinity intrusion',
    'Saltier Bay water moving inland when tides, sea level, or low river flows allow it.',
  ],
  [
    'Exports',
    'Water diverted from the southern Delta for farms and drinking water in other parts of California.',
  ],
  ['X2', 'A distance-based salinity marker used to track the low-salinity zone.'],
]

const navRailItems = [
  { id: 'overview', label: 'Overview' },
  ...contextChapters.map((chapter) => ({
    id: `section-${chapter.id}`,
    label: chapter.kicker,
  })),
  { id: 'key-terms', label: 'Key Terms' },
]

const eyebrowSx = {
  typography: 'eyebrow',
  color: 'primary.main',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
} as const

export default function ScenariosBackgroundPage() {
  const theme = useTheme()
  const stepsRef = useRef<HTMLDivElement | null>(null)
  const [activeStep, setActiveStep] = useState<ScenariosBackgroundMapStep>('overview')
  const scrollSteps = useMemo(
    () => [
      {
        id: 'overview',
        label: 'Overview',
        mapStep: 'overview' as const,
      },
      ...contextChapters.map((chapter) => ({
        id: `section-${chapter.id}`,
        label: chapter.kicker,
        mapStep: chapter.mapStep,
      })),
    ],
    [],
  )

  useEffect(() => {
    const stepRoot = stepsRef.current
    if (!stepRoot) return undefined

    const stepElements = stepRoot.querySelectorAll<HTMLElement>('.scenario-scroll-step')
    if (stepElements.length === 0) return undefined

    const scroller = scrollama()
    scroller
      .setup({
        step: stepElements,
        offset: 0.6,
        threshold: 4,
      })
      .onStepEnter(({ index }) => {
        const nextStep = scrollSteps[index]?.mapStep ?? 'overview'
        setActiveStep(nextStep)
      })

    const handleResize = () => scroller.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      scroller.destroy()
    }
  }, [scrollSteps])

  return (
    <>
      <Navbar />
      <NavRail items={navRailItems} ariaLabel="Background context sections" />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <Box
          component="header"
          sx={{
            bgcolor: 'base.900',
            color: 'common.white',
            borderBottom: '1px solid rgba(155,162,164,0.24)',
          }}
        >
          <Container maxWidth="lg" sx={{ py: { xs: 4.5, md: 6 } }}>
            <ScrollReveal>
              <Stack spacing={2.5} sx={{ maxWidth: 840 }}>
                <Button
                  component={Link}
                  to="/scenarios"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    alignSelf: 'flex-start',
                    color: 'base.100',
                    border: '1px solid rgba(155,162,164,0.24)',
                    bgcolor: 'rgba(81,93,97,0.18)',
                    '&:hover': { color: 'common.white', bgcolor: 'rgba(126,217,87,0.18)' },
                  }}
                >
                  Scenarios
                </Button>
                <Box sx={eyebrowSx}>
                  <WavesIcon fontSize="small" />
                  Background Context
                </Box>
                <Typography variant="h1" component="h1" sx={{ maxWidth: '17ch' }}>
                  Delta salinity basics
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '62ch', color: 'base.100' }}>
                  A short primer for reading the scenario maps: where the rivers meet, why outflow
                  matters, and how X2 tracks the balance between freshwater and saltwater.
                </Typography>
              </Stack>
            </ScrollReveal>
          </Container>
        </Box>

        <Container maxWidth={false} disableGutters sx={{ position: 'relative' }}>
          <Box
            component="section"
            sx={{
              position: 'relative',
              minHeight: { xs: 'auto', lg: '340vh' },
              bgcolor: '#162226',
            }}
          >
            <Box
              sx={{
                position: { xs: 'relative', lg: 'sticky' },
                top: { lg: 0 },
                height: { xs: 430, lg: '100vh' },
                zIndex: 0,
              }}
            >
              <ScenariosBackgroundMap
                activeStep={activeStep}
                showInfoOverlay={false}
                sx={{
                  height: '100%',
                  minHeight: { xs: 430, lg: '100vh' },
                  border: 0,
                }}
              />
              <Box
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: {
                    xs: 'linear-gradient(180deg, rgba(16,22,24,0.05) 0%, rgba(16,22,24,0.74) 100%)',
                    lg: 'linear-gradient(90deg, rgba(16,22,24,0.88) 0%, rgba(16,22,24,0.58) 34%, rgba(16,22,24,0.12) 68%, rgba(16,22,24,0.2) 100%)',
                  },
                  zIndex: 1,
                }}
              />
            </Box>

            <Box
              component="article"
              ref={stepsRef}
              sx={{
                position: { xs: 'relative', lg: 'absolute' },
                inset: { lg: 0 },
                zIndex: 2,
                width: '100%',
                px: { xs: 2, sm: 3, md: 5, lg: 8 },
                pt: { xs: 3, lg: 0 },
                pb: { xs: theme.jtSpacing.section.md, lg: 0 },
                pointerEvents: 'none',
              }}
            >
              <Box sx={{ maxWidth: 620, pointerEvents: 'auto' }}>
                <Box
                  className="scenario-scroll-step"
                  data-step="overview"
                  sx={{
                    minHeight: { xs: 'auto', lg: '82vh' },
                    display: 'flex',
                    alignItems: { xs: 'stretch', lg: 'center' },
                    pb: { xs: 3, lg: 8 },
                  }}
                >
                  <Box
                    id="overview"
                    sx={{
                      scrollMarginTop: 104,
                      width: '100%',
                      p: { xs: 2.5, md: 3 },
                      bgcolor:
                        activeStep === 'overview' ? 'rgba(16,22,24,0.88)' : 'rgba(16,22,24,0.62)',
                      border: '1px solid',
                      borderColor:
                        activeStep === 'overview'
                          ? 'rgba(126,217,87,0.48)'
                          : 'rgba(155,162,164,0.2)',
                      boxShadow:
                        activeStep === 'overview'
                          ? '0 22px 60px rgba(0,0,0,0.34)'
                          : '0 16px 44px rgba(0,0,0,0.2)',
                      backdropFilter: 'blur(14px)',
                      transition:
                        'border-color 220ms ease, background-color 220ms ease, box-shadow 220ms ease',
                    }}
                  >
                    <Stack spacing={1.4}>
                      <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.light' }}>
                        Overview
                      </Typography>
                      <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                          color: 'common.white',
                          textTransform: 'none',
                          letterSpacing: 0,
                          lineHeight: 1.18,
                        }}
                      >
                        Start with the Delta as both estuary and water supply hub
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'base.100' }}>
                        The Delta is both an estuary and a water supply hub. That means each
                        scenario starts with the same basic question: how much freshwater is
                        available to hold back salinity while also serving ecosystems, Delta
                        communities, farms, and cities?
                      </Typography>
                    </Stack>
                  </Box>
                </Box>

                <Stack spacing={0}>
                  {contextChapters.map((chapter) => (
                    <Box
                      key={chapter.id}
                      className="scenario-scroll-step"
                      data-step={chapter.mapStep}
                      sx={{
                        minHeight: { xs: 'auto', lg: '72vh' },
                        display: 'flex',
                        alignItems: { xs: 'stretch', lg: 'center' },
                        py: { xs: 2, lg: 7 },
                      }}
                    >
                      <Box
                        component="section"
                        id={`section-${chapter.id}`}
                        sx={{
                          scrollMarginTop: 104,
                          width: '100%',
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '112px minmax(0, 1fr)' },
                          gap: { xs: 1.6, sm: 3 },
                          p: { xs: 2.5, md: 3 },
                          bgcolor:
                            activeStep === chapter.mapStep
                              ? 'rgba(16,22,24,0.88)'
                              : 'rgba(16,22,24,0.62)',
                          border: '1px solid',
                          borderColor:
                            activeStep === chapter.mapStep
                              ? `${chapter.accent}88`
                              : 'rgba(155,162,164,0.2)',
                          boxShadow:
                            activeStep === chapter.mapStep
                              ? '0 22px 60px rgba(0,0,0,0.34)'
                              : '0 16px 44px rgba(0,0,0,0.2)',
                          backdropFilter: 'blur(14px)',
                          transition:
                            'border-color 220ms ease, background-color 220ms ease, box-shadow 220ms ease',
                        }}
                      >
                        <Stack spacing={1.2} sx={{ color: 'base.100' }}>
                          <Typography
                            variant="numberArticle"
                            component="p"
                            sx={{ color: chapter.accent }}
                          >
                            {chapter.id}
                          </Typography>
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              display: 'grid',
                              placeItems: 'center',
                              borderRadius: 999,
                              color: chapter.accent,
                              bgcolor: 'rgba(81,93,97,0.24)',
                              border: '1px solid rgba(155,162,164,0.2)',
                            }}
                          >
                            {chapter.icon}
                          </Box>
                        </Stack>
                        <Stack spacing={1.5}>
                          <Typography variant="eyebrow" component="p" sx={{ color: 'base.100' }}>
                            {chapter.kicker}
                          </Typography>
                          <Typography
                            variant="h3"
                            component="h2"
                            sx={{
                              color: 'common.white',
                              textTransform: 'none',
                              letterSpacing: 0,
                              lineHeight: 1.18,
                            }}
                          >
                            {chapter.title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'base.100' }}>
                            {chapter.body}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>

          <Container
            maxWidth="lg"
            sx={{ py: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.lg } }}
          >
            <ScrollReveal>
              <Box
                component="section"
                id="key-terms"
                sx={{ scrollMarginTop: 104, py: { xs: 4, md: 5 } }}
              >
                <Typography
                  variant="eyebrow"
                  component="p"
                  sx={{ color: 'secondary.light', mb: 2 }}
                >
                  Key Terms
                </Typography>
                <Box sx={{ borderTop: '2px solid', borderColor: 'primary.main' }}>
                  {keyTerms.map(([term, definition]) => (
                    <Box
                      key={term}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '170px minmax(0, 1fr)' },
                        gap: { xs: 0.6, sm: 2.5 },
                        py: 2,
                        borderBottom: '1px solid rgba(155,162,164,0.18)',
                      }}
                    >
                      <Typography variant="h5" component="h3" sx={{ color: 'common.white' }}>
                        {term}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'base.100' }}>
                        {definition}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </ScrollReveal>

            <ScrollReveal>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.4}
                sx={{ py: 4, alignItems: { xs: 'stretch', sm: 'center' } }}
              >
                <Button
                  component={Link}
                  to="/scenarios"
                  variant="contained"
                  color="secondary"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: 'base.900' }}
                >
                  Continue to Scenarios
                </Button>
                <Button
                  component={Link}
                  to="/scenarios"
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  sx={{ color: 'common.white', borderColor: 'base.300' }}
                >
                  Back
                </Button>
              </Stack>
            </ScrollReveal>
            <Typography
              variant="captionSmall"
              component="p"
              sx={{ color: 'base.100', lineHeight: 1.55, mt: 1 }}
            >
              Source framing follows the Adaptation Scenarios StoryMap baseline: current operations,
              salinity intrusion, monitoring and compliance stations, and the X2 salinity index.
            </Typography>
          </Container>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
