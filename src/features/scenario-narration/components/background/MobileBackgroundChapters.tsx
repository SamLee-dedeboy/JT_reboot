// The Background page's map and chapters below lg. The map stays pinned at the top of the
// screen while the overview and the three chapters scroll beneath it, each filling the rest
// of the screen, so every step is read with the map it moves. A column of marks down the
// map's right edge stands in for the desktop rail: where the reader is, and a way to jump.
import { Box, ButtonBase, Stack, Typography, alpha, useTheme } from '@mui/material'
import { useRef } from 'react'
import { backgroundOverview } from '@/content/background'
import ScenariosBackgroundMap from '@/map/background/ScenariosBackgroundMap'
import { jtSpacing, navigation } from '@/theme'
import { focusRing } from '@/ui/focusRing'
import { contextChapters, scrollSteps, useActiveStep } from './backgroundSteps'

/** The pinned map's share of the screen. */
const MAP_HEIGHT = '46svh'
/** Where a step's text starts: under the navbar and the pinned map. */
const belowMap = `calc(${navigation.barHeight.xs}px + ${MAP_HEIGHT})`
/** The marks: each step, then the key terms after the chapters. */
const marks = [...scrollSteps, { id: 'key-terms', label: 'Key terms' }]

const scrollToMark = (id: string) => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // 'instant', not 'auto': the site's global CSS makes 'auto' scroll smoothly.
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' })
}

/** One step's words, at least the height of the screen left below the map. */
function Step({
  id,
  mapStep,
  number,
  accent,
  kicker,
  title,
  body,
}: {
  id: string
  mapStep: string
  number?: string
  accent: string
  kicker: string
  title: string
  body: string
}) {
  return (
    <Box
      component="section"
      id={id}
      className="scenario-scroll-step"
      data-step={mapStep}
      aria-labelledby={`${id}-title`}
      sx={{
        scrollMarginTop: belowMap,
        minHeight: `calc(100svh - ${belowMap})`,
        boxSizing: 'border-box',
        px: jtSpacing.page.x,
        py: jtSpacing.section.sm,
        borderTop: 1,
        borderColor: 'border.subtle',
      }}
    >
      <Stack spacing={jtSpacing.gap.md} sx={{ maxWidth: '62ch' }}>
        <Stack direction="row" spacing={jtSpacing.gap.sm} sx={{ alignItems: 'baseline' }}>
          {number && (
            <Typography variant="numberBadge" component="span" sx={{ color: accent }}>
              {number}
            </Typography>
          )}
          <Typography variant="eyebrow" component="p" sx={{ color: 'base.100' }}>
            {kicker}
          </Typography>
        </Stack>
        <Typography id={`${id}-title`} variant="chapterTitle" component="h2">
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: 'base.100' }}>
          {body}
        </Typography>
      </Stack>
    </Box>
  )
}

export default function MobileBackgroundChapters() {
  const theme = useTheme()
  const stepsRef = useRef<HTMLDivElement | null>(null)
  // A step is current once its top passes 70% of the way down the screen.
  const activeStep = useActiveStep(stepsRef, 0.7)
  const activeIndex = scrollSteps.findIndex((step) => step.mapStep === activeStep)

  return (
    <Box component="section" sx={{ position: 'relative', bgcolor: 'base.800' }}>
      {/* The pinned map, with the step marks down its right edge. */}
      <Box
        sx={{
          position: 'sticky',
          top: navigation.barHeight.xs,
          zIndex: 1,
          height: MAP_HEIGHT,
          minHeight: 260,
        }}
      >
        <ScenariosBackgroundMap
          activeStep={activeStep}
          showInfoOverlay={false}
          sx={{ height: '100%', minHeight: 0, border: 0 }}
        />
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(180deg, transparent 70%, ${alpha(theme.palette.base[800], 0.9)} 100%)`,
          }}
        />
        <Box
          component="nav"
          aria-label="Background context steps"
          sx={{
            position: 'absolute',
            top: jtSpacing.gap.sm,
            right: jtSpacing.gap.xs,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          {marks.map((mark, index) => {
            const current = index === activeIndex
            const passed = index < activeIndex
            return (
              <ButtonBase
                key={mark.id}
                onClick={() => scrollToMark(mark.id)}
                aria-label={current ? undefined : mark.label}
                aria-current={current ? 'step' : undefined}
                sx={{
                  minWidth: 44,
                  height: 36,
                  px: current ? jtSpacing.component.sm : 0,
                  borderRadius: 18,
                  bgcolor: current ? 'primary.main' : 'transparent',
                  color: 'common.black',
                  transition: 'background-color 200ms ease',
                  '&:focus-visible': focusRing,
                }}
              >
                {current ? (
                  <Typography variant="numberBadge" component="span" sx={{ color: 'common.black' }}>
                    {mark.label}
                  </Typography>
                ) : (
                  <Box
                    component="span"
                    sx={{
                      width: 10,
                      height: 10,
                      boxSizing: 'border-box',
                      borderRadius: '50%',
                      border: 2,
                      borderColor: passed ? 'primary.main' : 'common.white',
                      bgcolor: passed ? 'primary.main' : alpha(theme.palette.base[900], 0.6),
                    }}
                  />
                )}
              </ButtonBase>
            )
          })}
        </Box>
      </Box>

      {/* The steps, read beneath the map. */}
      <Box ref={stepsRef} component="article">
        <Step
          id="overview"
          mapStep="overview"
          accent={theme.palette.secondary.light}
          kicker={backgroundOverview.kicker}
          title={backgroundOverview.title}
          body={backgroundOverview.body}
        />
        {contextChapters.map((chapter) => (
          <Step
            key={chapter.id}
            id={`section-${chapter.id}`}
            mapStep={chapter.mapStep}
            number={chapter.id}
            accent={chapter.accent(theme.palette)}
            kicker={chapter.kicker}
            title={chapter.title}
            body={chapter.body}
          />
        ))}
      </Box>
    </Box>
  )
}
