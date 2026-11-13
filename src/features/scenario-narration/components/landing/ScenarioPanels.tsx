import { Box, Stack, Typography, useTheme } from '@mui/material'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useRef, useState } from 'react'
import { ActionButton, NavRail } from '@/ui'
import { assetUrl } from '@/utils/baseUrl'
import AdaptationPanels from './AdaptationPanels'
import OutflowPanel from './OutflowPanel'
import { navigation } from '@/theme'
import { ADAPTATION_CARDS, LANDING_PANELS } from '@/content/landing'
import WhatsNextPanel from './WhatsNextPanel'

const STICKY_PANEL_SCROLL_DVH = 150

const STICKY_SECTION_HEIGHT_DVH = 100 + (LANDING_PANELS.length - 1) * STICKY_PANEL_SCROLL_DVH

const PANEL_TRANSITION = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
} as const

const scenarioRailItems = LANDING_PANELS.map((panel) => ({ id: panel.id, label: panel.railLabel }))

export default function ScenarioPanels() {
  const theme = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const nextPanel = Math.min(
      LANDING_PANELS.length - 1,
      Math.round(progress * (LANDING_PANELS.length - 1)),
    )
    setActivePanel((currentPanel) => (currentPanel === nextPanel ? currentPanel : nextPanel))
  })

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        height: `${STICKY_SECTION_HEIGHT_DVH}dvh`,
      }}
    >
      {LANDING_PANELS.map((panel, index) => (
        <Box
          key={panel.id}
          id={panel.id}
          sx={{
            position: 'absolute',
            top: `${index * STICKY_PANEL_SCROLL_DVH}dvh`,
            width: 1,
            height: '1px',
            pointerEvents: 'none',
            scrollMarginTop: navigation.barHeight,
          }}
        />
      ))}

      <Box
        sx={{
          position: 'sticky',
          top: navigation.barHeight,
          height: navigation.belowBar('100dvh'),
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '20dvw 80dvw', lg: '15dvw 85dvw' },
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            position: 'relative',
            zIndex: 2,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'base.700',
            borderRight: '2px solid',
            borderColor: 'primary.main',
          }}
        >
          <NavRail
            items={scenarioRailItems}
            ariaLabel="Scenario landing sections"
            variant="sticky"
            activeItemId={LANDING_PANELS[activePanel].id}
            scrollBehavior="auto"
            onNavigate={(id) => {
              const panelIndex = LANDING_PANELS.findIndex((panel) => panel.id === id)
              if (panelIndex >= 0) setActivePanel(panelIndex)
            }}
            sx={{
              position: 'static',
              top: 'auto',
              display: 'flex',
              width: '100%',
              alignSelf: 'center',
              px: theme.jtSpacing.component.md,
            }}
          />
        </Box>

        <Box sx={{ position: 'relative', minWidth: 0, bgcolor: 'base.800' }}>
          <AnimatePresence initial={false} mode="sync">
            {LANDING_PANELS.map((panel, index) =>
              index === activePanel ? (
                <Box
                  key={panel.id}
                  component={motion.article}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={PANEL_TRANSITION}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: panel.bgcolor,
                    backgroundImage:
                      'image' in panel
                        ? `linear-gradient(90deg, ${theme.palette.translucent[800]} 0%, ${theme.palette.translucent[500]} 50%, ${theme.palette.translucent[300]} 68%, ${theme.palette.translucent[50]} 100%), url(${assetUrl(panel.image)})`
                        : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 70%',
                    px:
                      panel.id === 'current-operations'
                        ? { xs: theme.jtSpacing.page.x.xs, md: theme.jtSpacing.section.lg }
                        : 0,
                  }}
                >
                  {index === 1 ? (
                    <OutflowPanel
                      variationKeys={['saltier', 'fresher']}
                      title={panel.title}
                      description={panel.body}
                      actionPlacement="shared"
                      expandOnInteraction={false}
                      showSectionLabel={false}
                      sharedActionVariant="contained"
                    />
                  ) : index === 2 ? (
                    <AdaptationPanels
                      items={ADAPTATION_CARDS}
                      actionLabel="Explore"
                      header={
                        <Stack spacing={1.2} sx={{ maxWidth: { xs: 620, md: 760 } }}>
                          <Typography variant="h2" component="h2">
                            {panel.title}
                          </Typography>
                          <Typography
                            variant="bodyLarge"
                            sx={{ color: 'common.white', maxWidth: '58ch' }}
                          >
                            {panel.body}
                          </Typography>
                        </Stack>
                      }
                    />
                  ) : panel.id === 'whats-next' ? (
                    <WhatsNextPanel />
                  ) : (
                    <Stack spacing={theme.jtSpacing.component.md} sx={{ maxWidth: '52ch' }}>
                      <Typography variant="h2" component="h2">
                        {panel.title}
                      </Typography>
                      <Typography variant="bodyLarge">{panel.body}</Typography>
                      {index === 0 && (
                        <Stack spacing={theme.jtSpacing.gap.sm} sx={{ alignItems: 'flex-start' }}>
                          <ActionButton label="Understand Key Parameters" />
                          <ActionButton label="Understand Salinity Basics" variant="outlined" />
                        </Stack>
                      )}
                    </Stack>
                  )}
                </Box>
              ) : null,
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  )
}
