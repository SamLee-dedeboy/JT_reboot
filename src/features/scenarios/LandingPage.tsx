import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'
import NavRail from '../../ui/NavRail'
import ScrollReveal from '../../ui/animation/ScrollReveal'
import { assetUrl } from '../../utils/baseUrl'
import AdaptationPanels from './AdaptationPanels'
import OutflowPanel from './OutflowPanel'
import { navigation } from '../../theme'

const stickyPanels = [
  {
    id: 'current-operations',
    railLabel: 'Current Operations',
    title: 'Understand Current Operations',
    body: 'Review the current operations and understand the key parameters that shape how we model the Delta.',
    bgcolor: 'base.700',
    image: '/images/scenarios/web/business-as-usual.webp',
  },
  {
    id: 'tiered-outflows',
    railLabel: 'Outflow Variations',
    title: 'Explore Outflow Variations',
    body: 'How does increasing or decreasing how much water flows through the Delta change salinity relative to current operations?',
    bgcolor: 'base.500',
  },
  {
    id: 'adaptation-scenarios',
    railLabel: 'Adaptation Scenarios',
    title: 'Explore Adaptation Scenarios',
    body: 'How do five potential adaptation strategies shape communities, ecosystems, and water systems across the Delta?',
    bgcolor: 'base.800',
  },
  {
    id: 'whats-next',
    railLabel: "What's Next?",
    title: "What's next?",
    body: 'Dive deeper into the scenarios — examine the modeling results for each future, review the criteria used to evaluate them, test how scenarios change with two feet of sea-level rise, and compare the scenarios from diverse perspectives through visualizations.',
    bgcolor: 'base.700',
  },
] as const

const adaptationScenarioItems = [
  {
    title: 'Eco Machine',
    image: assetUrl('/images/scenarios/web/eco-machine-2.webp'),
    eyebrow: '01',
    body: 'Where can tidal restoration be implemented in the Delta to strategically reduce salinity, while also creating ecological, eco-cultural, recreational, and community benefits?',
    href: '/scenarios/eco-machine',
  },
  {
    title: 'New Green Watershed',
    image: assetUrl('/images/scenarios/web/new-green-watershed.webp'),
    eyebrow: '02',
    body: 'In addition to tidal restoration, what if the Delta and larger watershed were holistically restored to reduce systemic risks to the Delta’s water infrastructure, transition to a more regenerative and sustainable economy, and advance Indigenous sovereignty?',
    href: '/scenarios/new-green-watershed',
  },
  {
    title: 'Bolster and Fortify',
    image: assetUrl('/images/scenarios/web/bolster-fortify-2.webp'),
    eyebrow: '03',
    body: 'What if reinforced levees combined with operable gates created a more resilient freshwater corridor through the Delta?',
    href: '/scenarios/bolster-and-fortify',
  },
  {
    title: 'Calling on Reserves',
    image: assetUrl('/images/scenarios/web/calling-on-reserves.webp'),
    eyebrow: '04',
    body: 'What if the state’s major dams and reservoirs were operated differently \u2013 mainly by changing when and how water is stored and released \u2013 to improve drought resilience, manage salinity, and better support aquatic ecosystems?',
    href: '/scenarios/calling-on-reserves',
  },
  {
    title: 'A Tunnel',
    image: assetUrl('/images/scenarios/web/a-tunnel.webp'),
    eyebrow: '05',
    body: 'What if a large tunnel \u2014 the Delta Conveyance Project, or DCP—were constructed to divert freshwater from the Sacramento River during high storm flows and convey that water underground to export pumps in the South Delta?',
    href: '/scenarios/a-tunnel',
  },
]

/** Photos the sticky panels show further down the page, fetched once the hero has painted. */
const panelImages = [
  assetUrl(stickyPanels[0].image),
  assetUrl('/images/scenarios/web/outflow.webp'),
  ...adaptationScenarioItems.map((item) => item.image),
]

/** Warms the browser cache in idle time so each panel's photo is ready when it is reached. */
function usePreloadImages(urls: string[]) {
  useEffect(() => {
    const load = () =>
      urls.forEach((url) => {
        const image = new Image()
        image.decoding = 'async'
        image.src = url
      })
    // Safari has no requestIdleCallback; a short timeout keeps the hero first there too.
    if (typeof window.requestIdleCallback === 'function') {
      // The timeout guarantees the load even when animation keeps the page from going idle.
      const handle = window.requestIdleCallback(load, { timeout: 1500 })
      return () => window.cancelIdleCallback(handle)
    }
    const handle = window.setTimeout(load, 200)
    return () => window.clearTimeout(handle)
  }, [urls])
}

const scenarioSectionLinks = stickyPanels.slice(0, 3).map((panel) => ({
  label: panel.title,
  href: `#${panel.id}`,
}))

const STICKY_PANEL_SCROLL_DVH = 150
const STICKY_SECTION_HEIGHT_DVH = 100 + (stickyPanels.length - 1) * STICKY_PANEL_SCROLL_DVH
const PANEL_TRANSITION = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
} as const
const scenarioRailItems = stickyPanels.map((panel) => ({ id: panel.id, label: panel.railLabel }))

const nextStepItems = [
  {
    number: '01',
    title: 'Modeling',
    body: 'See how each future is represented in the hydrodynamic model, then explore modeled salinity for the outflow variations, the adaptation scenarios, and the adaptation scenarios with two feet of sea-level rise.',
    label: 'Explore modeling',
    href: '/scenarios/modeling',
  },
  {
    number: '02',
    title: 'Evaluation',
    body: 'Review the five criteria used to evaluate each scenario (ecology, environmental justice, eco-cultural restoration, recreation, and the economy) and how one scenario looks across all of them.',
    label: 'Review evaluation',
    href: '/scenarios/evaluation',
  },
  {
    number: '03',
    title: 'Scenario ranking',
    body: 'Use the ranking visualization to compare overall scenario scores and see how different priorities and weighting choices affect which futures rise to the top.',
    label: 'Open ranking visualization',
    href: '/scenarios/ranking',
  },
] as const

function WhatsNextPanel() {
  const theme = useTheme()

  return (
    <Box sx={{ width: 1, height: 1, overflowY: 'auto' }}>
      <Box
        sx={{
          width: { xs: '90%', lg: '70dvw' },
          mx: 'auto',
          py: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
        }}
      >
        <Typography variant="h1" component="h2">
          What's next?
        </Typography>
        <Typography
          variant="bodyLarge"
          sx={{
            mt: theme.jtSpacing.component.lg,
            maxWidth: '100ch',
            color: 'common.white',
          }}
        >
          <Box component="span" sx={{ color: 'primary.main' }}>
            Dive deeper into the scenarios
          </Box>{' '}
          {'—'} see how each future is modeled, review how the criteria evaluate them, and compare
          the scenarios from diverse perspectives through visualizations.
        </Typography>

        <Box
          sx={{
            mt: theme.jtSpacing.section.lg,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            rowGap: theme.jtSpacing.section.md,
            width: 1,
          }}
        >
          {nextStepItems.map((item) => (
            <Box
              key={item.number}
              component="article"
              sx={{
                pt: theme.jtSpacing.component.md,
                borderTop: 1,
                borderColor: 'border.subtle',
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr)',
                columnGap: theme.jtSpacing.gap.md,
                rowGap: theme.jtSpacing.gap.sm,
                alignItems: 'start',
              }}
            >
              <Typography variant="numberBadge" component="p" sx={{ gridColumn: 1 }}>
                {item.number}
              </Typography>
              <Stack spacing={theme.jtSpacing.gap.sm} sx={{ gridColumn: 2 }}>
                <Typography variant="h4" component="h3">
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: '80ch' }}>
                  {item.body}
                </Typography>
                <Button
                  component={Link}
                  to={item.href}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {item.label}
                </Button>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

function StickyScenarioPanels() {
  const theme = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const nextPanel = Math.min(
      stickyPanels.length - 1,
      Math.round(progress * (stickyPanels.length - 1)),
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
      {stickyPanels.map((panel, index) => (
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
          component="nav"
          aria-label="Scenario landing sections"
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
            variant="home"
            activeItemId={stickyPanels[activePanel].id}
            scrollBehavior="auto"
            onNavigate={(id) => {
              const panelIndex = stickyPanels.findIndex((panel) => panel.id === id)
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
            {stickyPanels.map((panel, index) =>
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
                      items={adaptationScenarioItems}
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
                          <Button
                            component={Link}
                            to="/scenarios/key-parameters"
                            variant="contained"
                            color="primary"
                            sx={{ color: 'common.black' }}
                          >
                            Understand Key Parameters
                          </Button>
                          <Button
                            component={Link}
                            to="/scenarios/background-context"
                            variant="outlined"
                            sx={{ color: 'common.white', borderColor: 'common.white' }}
                          >
                            Understand Salinity Basics
                          </Button>
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

export default function LandingPage() {
  const theme = useTheme()
  usePreloadImages(panelImages)

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white', overflowX: 'clip' }}>
        <Box
          component="header"
          sx={{
            position: 'relative',
            height: navigation.belowBar('100dvh'),
            display: 'flex',
            alignItems: 'center',
            isolation: 'isolate',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(90deg, rgba(16,22,24,0.94) 0%, rgba(16,22,24,0.78) 44%, rgba(16,22,24,0.32) 100%), url(${assetUrl('/images/scenarios/web/cover.webp')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: -1,
            },
          }}
        >
          <Container maxWidth="lg">
            <ScrollReveal>
              <Stack
                spacing={theme.jtSpacing.gap.lg}
                sx={{ maxWidth: theme.jtSpacing.paragraphMaxWidth.default }}
              >
                <Typography variant="h1" component="h1" sx={{ maxWidth: '15ch' }}>
                  Choose a future to explore
                </Typography>
                <Typography variant="bodyLarge" sx={{ maxWidth: '58ch', color: 'base.100' }}>
                  Start with current operations, then move through outflow variations and adaptation
                  pathways to compare what different Delta futures ask of communities, ecosystems,
                  and water systems.
                </Typography>
                <Stack
                  direction="row"
                  useFlexGap
                  spacing={theme.jtSpacing.gap.sm}
                  sx={{ flexWrap: 'wrap' }}
                >
                  {scenarioSectionLinks.map((link, index) => (
                    <Button
                      key={link.href}
                      variant={index === 2 ? 'contained' : 'outlined'}
                      color="primary"
                      component="a"
                      href={link.href}
                      endIcon={index === 2 ? <ArrowForwardIcon /> : undefined}
                      sx={
                        index === 2 ? undefined : { color: 'common.white', borderColor: 'base.300' }
                      }
                    >
                      {link.label}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </ScrollReveal>
          </Container>
        </Box>

        <StickyScenarioPanels />
      </Box>
      <Footer />
    </>
  )
}
