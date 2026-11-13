import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import RouteIcon from '@mui/icons-material/Route'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import { Box, Stack, Typography, alpha, useTheme } from '@mui/material'
import type { Theme } from '@mui/material'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import scrollama from 'scrollama'
import { baselineBackgroundChapters } from '@/content/background'
import ScenariosBackgroundMap from '@/map/background/ScenariosBackgroundMap'
import type { ScenariosBackgroundMapStep } from '@/map/background/ScenariosBackgroundLayers'

interface ContextChapter {
  id: string
  kicker: string
  title: string
  body: string
  icon: ReactNode
  /** The chapter's accent, read from the theme palette. */
  accent: (palette: Theme['palette']) => string
  mapStep: ScenariosBackgroundMapStep
}

const chapterPresentation = {
  '01': { icon: <RouteIcon />, accent: (palette: Theme['palette']) => palette.primary.main },
  '02': { icon: <CompareArrowsIcon />, accent: (palette: Theme['palette']) => palette.accent.blue },
  '03': { icon: <WaterDropIcon />, accent: (palette: Theme['palette']) => palette.accent.yellow },
} as const

const contextChapters: ContextChapter[] = baselineBackgroundChapters.map((chapter) => ({
  ...chapter,
  ...chapterPresentation[chapter.id],
}))

/** The sticky map with the overview and three chapters scrolling over it; each step moves the map. */
export default function BackgroundChapters() {
  const theme = useTheme()
  // The map's dark shade at a given opacity, the cards' quiet border and their two shadows.
  const shade = (opacity: number) => alpha(theme.palette.base[900], opacity)
  const quietBorder = alpha(theme.palette.base[200], 0.2)
  const activeShadow = `0 22px 60px ${shade(0.34)}`
  const restingShadow = `0 16px 44px ${shade(0.2)}`
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
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: { xs: 'auto', lg: '340vh' },
        bgcolor: 'base.800',
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
              xs: `linear-gradient(180deg, ${shade(0.05)} 0%, ${shade(0.74)} 100%)`,
              lg: `linear-gradient(90deg, ${shade(0.88)} 0%, ${shade(0.58)} 34%, ${shade(0.12)} 68%, ${shade(0.2)} 100%)`,
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
                bgcolor: activeStep === 'overview' ? shade(0.88) : shade(0.62),
                border: '1px solid',
                borderColor:
                  activeStep === 'overview' ? alpha(theme.palette.primary.main, 0.48) : quietBorder,
                boxShadow: activeStep === 'overview' ? activeShadow : restingShadow,
                backdropFilter: 'blur(14px)',
                transition:
                  'border-color 220ms ease, background-color 220ms ease, box-shadow 220ms ease',
              }}
            >
              <Stack spacing={1.4}>
                <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.light' }}>
                  Overview
                </Typography>
                <Typography variant="chapterTitle" component="h2" sx={{ color: 'common.white' }}>
                  Start with the Delta as both estuary and water supply hub
                </Typography>
                <Typography variant="body1" sx={{ color: 'base.100' }}>
                  The Delta is both an estuary and a water supply hub. That means each scenario
                  starts with the same basic question: how much freshwater is available to hold back
                  salinity while also serving ecosystems, Delta communities, farms, and cities?
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
                    bgcolor: activeStep === chapter.mapStep ? shade(0.88) : shade(0.62),
                    border: '1px solid',
                    borderColor:
                      activeStep === chapter.mapStep
                        ? alpha(chapter.accent(theme.palette), 0.53)
                        : quietBorder,
                    boxShadow: activeStep === chapter.mapStep ? activeShadow : restingShadow,
                    backdropFilter: 'blur(14px)',
                    transition:
                      'border-color 220ms ease, background-color 220ms ease, box-shadow 220ms ease',
                  }}
                >
                  <Stack spacing={1.2} sx={{ color: 'base.100' }}>
                    <Typography
                      variant="numberArticle"
                      component="p"
                      sx={{ color: chapter.accent(theme.palette) }}
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
                        color: chapter.accent(theme.palette),
                        bgcolor: alpha(theme.palette.base[400], 0.24),
                        border: '1px solid',
                        borderColor: quietBorder,
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
                      variant="chapterTitle"
                      component="h2"
                      sx={{ color: 'common.white' }}
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
  )
}
