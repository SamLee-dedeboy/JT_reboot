import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import BoltIcon from '@mui/icons-material/Bolt'
import ExploreIcon from '@mui/icons-material/Explore'
import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import ExpandableScenarioPanels from '../../ui/animation/ExpandableScenarioPanels'
import ScrollReveal from '../../ui/animation/ScrollReveal'
import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'
import { assetUrl } from '../../utils/baseUrl'
import OutflowVariationGrid from './OutflowVariationGrid'
import ScenarioRidgelinePlot from './ScenarioRidgelinePlot'
import ScenarioRankingOverview from './ScenarioRankingOverview'

const adaptationScenarios = [
  {
    title: 'Business as Usual',
    image: '/images/scenarios/business-as-usual.jpg',
    description:
      'Current operations continue forward. Use this path to compare how familiar choices shape future Delta tradeoffs.',
    slug: 'business-as-usual',
  },
  {
    title: 'Eco Machine',
    image: '/images/scenarios/eco-machine-2.JPG',
    description:
      'A nature-based future that works with wetlands, habitat, and water flows. It asks what restoration can do as infrastructure.',
    slug: 'eco-machine',
  },
  {
    title: 'New Green Watershed',
    image: '/images/scenarios/new-green-watershed.jpg',
    description:
      'A watershed-scale path focused on upstream change and green infrastructure. It connects Delta outcomes to broader land and water choices.',
    slug: 'new-green-watershed',
  },
  {
    title: 'Bolster and Fortify',
    image: '/images/scenarios/bolster-fortify-2.JPG',
    description:
      'A protection-focused path built around stronger edges and defenses. It asks what is secured, and what pressures remain.',
    slug: 'bolster-and-fortify',
  },
  {
    title: 'Calling on Reserves',
    image: '/images/scenarios/calling-on-reserves.jpg',
    description:
      'A future that leans on stored capacity and emergency reserves. It explores how backup systems affect risk, reliability, and equity.',
    slug: 'calling-on-reserves',
  },
  {
    title: 'A Tunnel',
    image: '/images/scenarios/a-tunnel.jpg',
    description:
      'A conveyance-centered future for moving water differently. It helps compare system-wide effects across communities and ecosystems.',
    slug: 'a-tunnel',
  },
]

const expandableScenarioItems = adaptationScenarios.map((scenario, index) => ({
  title: scenario.title,
  image: assetUrl(scenario.image),
  eyebrow: `0${index + 1}`,
  body: scenario.description,
  href: `/scenarios/${scenario.slug}`,
}))

const sectionLabelSx = {
  color: 'primary.main',
  '& .MuiSvgIcon-root': {
    fontSize: 'inherit',
    verticalAlign: 'middle',
    mr: 1,
  },
} as const

const glassPanelSx = {
  border: '2px solid',
  borderColor: 'translucent.primaryGreen',
  bgcolor: 'surface',
  boxShadow: 'none',
  backdropFilter: 'blur(14px)',
} as const

const scenarioSectionLinks = [
  { label: 'Examine Probable Outflow Variations', href: '#outflow-variations' },
  { label: 'Examine Possible adaptation scenarios', href: '#adaptations', primary: true },
  { label: 'Compare adaptation scenarios', href: '#scenario-comparison' },
  { label: 'View Scenario Rankings', href: '#ranking-overview' },
] as const

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
            minHeight: { xs: 'calc(100vh - 72px)', md: 'calc(100vh - 76px)' },
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
              zIndex: -2,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 'auto 0 0',
              height: '34%',
              background: 'linear-gradient(180deg, rgba(20,29,31,0), #141d1f 88%)',
              zIndex: -1,
            },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{ py: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.xl } }}
          >
            <ScrollReveal>
              <Stack
                spacing={theme.jtSpacing.gap.lg}
                sx={{ maxWidth: theme.jtSpacing.paragraphMaxWidth.default }}
              >
                <Typography component="p" variant="eyebrow" sx={sectionLabelSx}>
                  <ExploreIcon />
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
                <Box
                  component="nav"
                  aria-label="Explore sections on this page"
                  sx={{ pt: theme.jtSpacing.component.xs }}
                >
                  <Stack
                    direction="row"
                    useFlexGap
                    spacing={theme.jtSpacing.gap.sm}
                    sx={{ flexWrap: 'wrap' }}
                  >
                    {scenarioSectionLinks.map((link) => (
                      <Button
                        key={link.href}
                        variant={'primary' in link && link.primary ? 'contained' : 'outlined'}
                        color="primary"
                        component="a"
                        href={link.href}
                        endIcon={
                          'primary' in link && link.primary ? <ArrowForwardIcon /> : undefined
                        }
                        sx={
                          'primary' in link && link.primary
                            ? undefined
                            : { color: 'common.white', borderColor: 'base.300' }
                        }
                      >
                        {link.label}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </ScrollReveal>
          </Container>
        </Box>

        <Box
          component="section"
          id="shared-context"
          sx={{
            bgcolor: 'base.700',
            py: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' },
                gap: { xs: theme.jtSpacing.gap.xl, md: theme.jtSpacing.section.md },
                alignItems: 'center',
              }}
            >
              <ScrollReveal>
                <Stack spacing={theme.jtSpacing.component.md}>
                  <Typography component="p" variant="eyebrow" sx={sectionLabelSx}>
                    <BoltIcon />
                    Start Here
                  </Typography>
                  <Typography variant="h2">Starting point</Typography>
                  <Typography variant="body1" sx={{ color: 'base.100' }}>
                    This section helps you understand the key factors shaping how we model the
                    Delta, as well as the essentials you need to know about the Delta.
                  </Typography>
                  <Stack spacing={theme.jtSpacing.gap.sm} sx={{ alignItems: 'flex-start' }}>
                    <Button
                      component={Link}
                      to="/scenarios/key-parameters"
                      variant="contained"
                      color="secondary"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, color: 'base.900' }}
                    >
                      View Key Parameters
                    </Button>
                    <Button
                      component={Link}
                      to="/scenarios/background-context"
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ color: 'common.white', borderColor: 'base.300' }}
                    >
                      Read Delta Essentials
                    </Button>
                  </Stack>
                </Stack>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <Box
                  sx={{
                    ...glassPanelSx,
                    position: 'relative',
                    minHeight: { xs: 360, md: 440 },
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={assetUrl('/images/scenarios/business-as-usual.jpg')}
                    alt=""
                    sx={{
                      width: '100%',
                      height: '100%',
                      minHeight: 'inherit',
                      objectFit: 'cover',
                      opacity: 0.72,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(16,22,24,0.08), rgba(16,22,24,0.9))',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      left: {
                        xs: theme.spacing(theme.jtSpacing.component.md),
                        md: theme.spacing(theme.jtSpacing.gap.lg),
                      },
                      right: {
                        xs: theme.spacing(theme.jtSpacing.component.md),
                        md: theme.spacing(theme.jtSpacing.gap.lg),
                      },
                      bottom: {
                        xs: theme.spacing(theme.jtSpacing.component.md),
                        md: theme.spacing(theme.jtSpacing.gap.lg),
                      },
                    }}
                  >
                    <Typography
                      component="span"
                      variant="eyebrow"
                      sx={{
                        display: 'inline-flex',
                        mb: theme.jtSpacing.gap.sm,
                        px: theme.jtSpacing.component.xs,
                        py: theme.jtSpacing.component.xs,
                        border: 1,
                        borderColor: 'primary.main',
                        bgcolor: 'translucent.primaryGreen',
                      }}
                    >
                      Current Operations
                    </Typography>
                    <Typography variant="h3" component="p" sx={{ maxWidth: 460 }}>
                      One starting point, many comparisons
                    </Typography>
                  </Box>
                </Box>
              </ScrollReveal>
            </Box>
          </Container>
        </Box>

        <Box
          component="section"
          id="outflow-variations"
          aria-labelledby="outflow-panels-title"
          sx={{ scrollMarginTop: { xs: '72px', md: '76px' } }}
        >
          <OutflowVariationGrid />
        </Box>

        <Box
          component="section"
          id="adaptations"
          aria-labelledby="scenario-panels-title"
          sx={{ scrollMarginTop: { xs: '72px', md: '76px' } }}
        >
          <ExpandableScenarioPanels
            items={expandableScenarioItems}
            collapseOnScroll
            comparisonContent={(selectedPanel, onSelectPanel, active, seaLevelRise) => (
              <ScenarioRidgelinePlot
                selectedIndex={selectedPanel}
                onSelect={onSelectPanel}
                active={active}
                seaLevelRise={seaLevelRise}
              />
            )}
            header={
              <Stack spacing={1.2} sx={{ maxWidth: { xs: 620, md: 760 } }}>
                <Typography component="p" variant="eyebrow" sx={sectionLabelSx}>
                  <ExploreIcon />
                  Adaptation Scenarios
                </Typography>
                <Typography id="scenario-panels-title" variant="h2" component="h2">
                  Possible water futures
                </Typography>
                <Typography variant="body2" sx={{ color: 'base.100', maxWidth: '58ch' }}>
                  Explore six adaptation scenarios and compare how different pathways could shape
                  communities, ecosystems, and water systems across the Delta.
                </Typography>
              </Stack>
            }
          />
        </Box>

        <Box
          component="section"
          id="ranking-overview"
          aria-labelledby="ranking-overview-title"
          sx={{
            bgcolor: 'base.700',
            py: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
            scrollMarginTop: { xs: '72px', md: '76px' },
          }}
        >
          <Container maxWidth="lg">
            <ScrollReveal>
              <Stack spacing={theme.jtSpacing.gap.xl}>
                <Stack spacing={theme.jtSpacing.component.sm} sx={{ maxWidth: '66ch' }}>
                  <Typography component="p" variant="eyebrow" sx={sectionLabelSx}>
                    <ExploreIcon />
                    Ranking Overview
                  </Typography>
                  <Typography id="ranking-overview-title" variant="h2">
                    Compare priorities across adaptation scenarios
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'base.100' }}>
                    This matrix will summarize how each adaptation scenario performs across shared
                    water, ecosystem, equity, and implementation criteria. Rankings will be added
                    after the evaluation framework and results are finalized.
                  </Typography>
                </Stack>

                <ScenarioRankingOverview scenarios={adaptationScenarios} />
              </Stack>
            </ScrollReveal>
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
  )
}
