// The Background page's map and its three chapters. From lg up the map is pinned full screen
// and the cards scroll over it; below lg (MobileBackgroundChapters) the map is pinned at
// the top of the screen and the cards scroll beneath it.
import { Box, Stack, Typography, alpha, useMediaQuery, useTheme } from '@mui/material'
import { useRef } from 'react'
import { backgroundOverview } from '@/content/background'
import ScenariosBackgroundMap from '@/map/background/ScenariosBackgroundMap'
import { contextChapters, useActiveStep } from './backgroundSteps'
import MobileBackgroundChapters from './MobileBackgroundChapters'

/** The sticky map with the overview and three chapters scrolling over it; each step moves the map. */
function DesktopBackgroundChapters() {
  const theme = useTheme()
  // The map's dark shade at a given opacity, the cards' quiet border and their two shadows.
  const shade = (opacity: number) => alpha(theme.palette.base[900], opacity)
  const quietBorder = alpha(theme.palette.base[200], 0.2)
  const activeShadow = `0 22px 60px ${shade(0.34)}`
  const restingShadow = `0 16px 44px ${shade(0.2)}`
  const stepsRef = useRef<HTMLDivElement | null>(null)
  const activeStep = useActiveStep(stepsRef, 0.6)

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
                  {backgroundOverview.kicker}
                </Typography>
                <Typography variant="chapterTitle" component="h2" sx={{ color: 'common.white' }}>
                  {backgroundOverview.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'base.100' }}>
                  {backgroundOverview.body}
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

export default function BackgroundChapters() {
  const theme = useTheme()
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true })
  return isLgUp ? <DesktopBackgroundChapters /> : <MobileBackgroundChapters />
}
