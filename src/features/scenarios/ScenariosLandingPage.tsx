import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import BoltIcon from '@mui/icons-material/Bolt'
import ExploreIcon from '@mui/icons-material/Explore'
import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'
import NavRail from '../../ui/NavRail'
import ExpandableScenarioPanels from '../../ui/animation/ExpandableScenarioPanels'
import ScrollReveal from '../../ui/animation/ScrollReveal'
import { assetUrl } from '../../utils/baseUrl'
import OutflowVariationGrid from './OutflowVariationGrid'

const stickyPanels = [
  {
    id: 'outflow-variations',
    railLabel: 'Current Operations',
    eyebrow: 'Start Here',
    title: 'Understand Current Operations',
    body: 'This section helps you understand the current operations and key parameters that shape how we model the Delta.',
    bgcolor: 'base.700',
    image: '/images/scenarios/business-as-usual.jpg',
  },
  {
    id: 'tiered-outflows',
    railLabel: 'Tiered Outflows',
    eyebrow: 'Tiered Outflows',
    title: 'Explore Outflow Variations',
    body: 'Explore water outflow variations and how they compare against current operations by increasing or reducing the amount of water flowing through the Delta.',
    bgcolor: 'base.500',
  },
  {
    id: 'adaptations',
    railLabel: 'Adaptation Scenarios',
    eyebrow: 'Possible Water Futures',
    title: 'Explore Adaptation Scenarios',
    body: 'Explore five potential adaptation pathways and how they might shape communities, ecosystems, and water systems across the Delta.',
    bgcolor: 'base.800',
  },
] as const

const adaptationScenarioItems = [
  {
    title: 'Eco Machine',
    image: assetUrl('/images/scenarios/eco-machine-2.JPG'),
    eyebrow: '01',
    body: 'A nature-based future that works with wetlands, habitat, and water flows. It asks what restoration can do as infrastructure.',
    href: '/scenarios/eco-machine',
  },
  {
    title: 'New Green Watershed',
    image: assetUrl('/images/scenarios/new-green-watershed.jpg'),
    eyebrow: '02',
    body: 'A watershed-scale path focused on upstream change and green infrastructure. It connects Delta outcomes to broader land and water choices.',
    href: '/scenarios/new-green-watershed',
  },
  {
    title: 'Calling on Reserves',
    image: assetUrl('/images/scenarios/calling-on-reserves.jpg'),
    eyebrow: '03',
    body: 'A future that leans on stored capacity and emergency reserves. It explores how backup systems affect risk, reliability, and equity.',
    href: '/scenarios/calling-on-reserves',
  },
  {
    title: 'Bolster and Fortify',
    image: assetUrl('/images/scenarios/bolster-fortify-2.JPG'),
    eyebrow: '04',
    body: 'A protection-focused path built around stronger edges and defenses. It asks what is secured, and what pressures remain.',
    href: '/scenarios/bolster-and-fortify',
  },
  {
    title: 'A Tunnel',
    image: assetUrl('/images/scenarios/a-tunnel.jpg'),
    eyebrow: '05',
    body: 'A conveyance-centered future for moving water differently. It helps compare system-wide effects across communities and ecosystems.',
    href: '/scenarios/a-tunnel',
  },
]

const scenarioSectionLinks = stickyPanels.map((panel) => ({
  label: panel.title,
  href: `#${panel.id}`,
}))

const STICKY_PANEL_SCROLL_DVH = 150
const scenarioRailItems = [
  ...stickyPanels.map((panel) => ({ id: panel.id, label: panel.railLabel })),
  { id: 'whats-next', label: "What's Next?" },
]

function StickyScenarioPanels() {
  const theme = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const firstOpacity = useTransform(scrollYProgress, [0, 0.28, 0.38], [1, 1, 0])
  const secondOpacity = useTransform(scrollYProgress, [0.28, 0.38, 0.62, 0.72], [0, 1, 1, 0])
  const thirdOpacity = useTransform(scrollYProgress, [0.62, 0.72, 1], [0, 1, 1])
  const opacities = [firstOpacity, secondOpacity, thirdOpacity]

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const nextPanel = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2
    setActivePanel((currentPanel) => (currentPanel === nextPanel ? currentPanel : nextPanel))
  })

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        height: `${100 + stickyPanels.length * STICKY_PANEL_SCROLL_DVH}dvh`,
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
            height: `${STICKY_PANEL_SCROLL_DVH}dvh`,
            pointerEvents: 'none',
            scrollMarginTop: '76px',
          }}
        />
      ))}

      <Box
        sx={{
          position: 'sticky',
          top: { xs: 72, md: 76 },
          height: { xs: 'calc(100dvh - 72px)', md: 'calc(100dvh - 76px)' },
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
            bgcolor: 'base.900',
            borderRight: '2px solid',
            borderColor: 'primary.main',
          }}
        >
          <NavRail
            items={scenarioRailItems}
            ariaLabel="Scenario landing sections"
            variant="home"
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
          {stickyPanels.map((panel, index) => (
            <Box
              key={panel.id}
              component={motion.article}
              style={{ opacity: opacities[index] }}
              aria-hidden={activePanel !== index}
              inert={activePanel !== index}
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: activePanel === index ? 1 : 0,
                pointerEvents: activePanel === index ? 'auto' : 'none',
                display: 'flex',
                alignItems: 'center',
                bgcolor: panel.bgcolor,
                backgroundImage:
                  'image' in panel
                    ? `linear-gradient(90deg, ${theme.palette.translucent.blackShadow}, transparent 72%), url(${assetUrl(panel.image)})`
                    : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center 70%',
                px:
                  index === 1 || index === 2
                    ? 0
                    : { xs: theme.jtSpacing.page.x.xs, md: theme.jtSpacing.section.lg },
              }}
            >
              {index === 1 ? (
                <OutflowVariationGrid
                  variationKeys={['fresher', 'saltier']}
                  eyebrow={panel.eyebrow}
                  title={panel.title}
                  description={panel.body}
                />
              ) : index === 2 ? (
                <ExpandableScenarioPanels
                  items={adaptationScenarioItems}
                  actionLabel="Explore"
                  header={
                    <Stack spacing={1.2} sx={{ maxWidth: { xs: 620, md: 760 } }}>
                      <Typography component="p" variant="eyebrow" sx={{ color: 'primary.main' }}>
                        <ExploreIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 1 }} />
                        {panel.eyebrow}
                      </Typography>
                      <Typography variant="h2" component="h2">
                        {panel.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'common.white', maxWidth: '58ch' }}>
                        {panel.body}
                      </Typography>
                    </Stack>
                  }
                />
              ) : (
                <Stack spacing={theme.jtSpacing.component.md} sx={{ maxWidth: '52ch' }}>
                  <Typography variant="eyebrow" component="p" sx={{ color: 'primary.main' }}>
                    {index === 0 && (
                      <BoltIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 1 }} />
                    )}
                    {panel.eyebrow}
                  </Typography>
                  <Typography variant="h2" component="h2">
                    {panel.title}
                  </Typography>
                  <Typography variant="body1">{panel.body}</Typography>
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
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default function ScenariosLandingPage() {
  const theme = useTheme()

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white', overflowX: 'clip' }}>
        <Box
          component="header"
          sx={{
            position: 'relative',
            height: { xs: 'calc(100dvh - 72px)', md: 'calc(100dvh - 76px)' },
            display: 'flex',
            alignItems: 'center',
            isolation: 'isolate',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(90deg, rgba(16,22,24,0.94) 0%, rgba(16,22,24,0.78) 44%, rgba(16,22,24,0.32) 100%), url(${assetUrl('/images/scenarios/cover.jpg')})`,
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
                <Typography component="p" variant="eyebrow" sx={{ color: 'primary.main' }}>
                  <ExploreIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 1 }} />
                  Scenario Explorer
                </Typography>
                <Typography variant="h1" component="h1" sx={{ maxWidth: '15ch' }}>
                  Choose a future to explore
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '58ch', color: 'base.100' }}>
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

        <Box
          component="section"
          id="whats-next"
          sx={{
            minHeight: '70dvh',
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'base.900',
            py: theme.jtSpacing.section.lg,
            scrollMarginTop: { xs: '72px', md: '76px' },
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={theme.jtSpacing.gap.lg} sx={{ maxWidth: '70ch' }}>
              <Stack spacing={theme.jtSpacing.component.sm}>
                <Typography variant="eyebrow" component="p" sx={{ color: 'primary.main' }}>
                  What's Next?
                </Typography>
                <Typography variant="h2" component="h2">
                  Dive deeper into the scenarios
                </Typography>
                <Typography variant="body1" sx={{ color: 'base.100' }}>
                  Understand how each future is modeled and evaluated, then compare its benefits,
                  impacts, and performance side by side.
                </Typography>
              </Stack>
              <Stack spacing={theme.jtSpacing.gap.sm} sx={{ alignItems: 'flex-start' }}>
                <Button component={Link} to="/scenarios/key-parameters" variant="contained">
                  Modeling &amp; Evaluation
                </Button>
                <Button component={Link} to="/pages/scenario-explorer" variant="outlined">
                  Comparison
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
  )
}
