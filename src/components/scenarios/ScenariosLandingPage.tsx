import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BoltIcon from '@mui/icons-material/Bolt';
import ExploreIcon from '@mui/icons-material/Explore';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandableScenarioPanels from '../animation/ExpandableScenarioPanels';
import ScrollReveal from '../animation/ScrollReveal';
import Footer from '../common/Footer';
import Navbar from '../common/Navbar';
import { assetUrl } from '../../utils/baseUrl';
import ScenarioRidgelinePlot from './ScenarioRidgelinePlot';

const outflowVariations = [
  {
    label: 'Less Delta outflow',
    percent: 'Variation II',
    body: 'Explore a more constrained outflow condition (10% decrease) in the Delta.',
  },
  {
    label: 'Business as Usual',
    percent: 'Current operations',
    body: 'Begin with this starting point before changing Delta outflow assumptions.',
  },
  {
    label: 'More Delta outflow',
    percent: 'Variation I',
    body: 'Explore how a stronger outflow (30% increase) can shift water quality, habitats, and tradeoffs.',
  },
];

const outflowVariationPanels = outflowVariations.map((variation, index) => ({
  title: variation.label,
  image: assetUrl('/images/scenarios/outflow.jpg'),
  eyebrow: variation.percent,
  body: variation.body,
  href: '/scenarios',
  key: `outflow-${index}`,
}));

const adaptationScenarios = [
  {
    title: 'Business as Usual',
    image: '/images/scenarios/business-as-usual.jpg',
    description: 'Current operations continue forward. Use this path to compare how familiar choices shape future Delta tradeoffs.',
  },
  {
    title: 'Eco Machine',
    image: '/images/scenarios/eco-machine-2.JPG',
    description: 'A nature-based future that works with wetlands, habitat, and water flows. It asks what restoration can do as infrastructure.',
  },
  {
    title: 'New Green Watershed',
    image: '/images/scenarios/new-green-watershed.jpg',
    description: 'A watershed-scale path focused on upstream change and green infrastructure. It connects Delta outcomes to broader land and water choices.',
  },
  {
    title: 'Calling on Reserves',
    image: '/images/scenarios/calling-on-reserves.jpg',
    description: 'A future that leans on stored capacity and emergency reserves. It explores how backup systems affect risk, reliability, and equity.',
  },
  {
    title: 'Bolster and Fortify',
    image: '/images/scenarios/bolster-fortify-2.JPG',
    description: 'A protection-focused path built around stronger edges and defenses. It asks what is secured, and what pressures remain.',
  },
  {
    title: 'A Tunnel',
    image: '/images/scenarios/a-tunnel.jpg',
    description: 'A conveyance-centered future for moving water differently. It helps compare system-wide effects across communities and ecosystems.',
  },
];

const expandableScenarioItems = adaptationScenarios.map((scenario, index) => ({
  title: scenario.title,
  image: assetUrl(scenario.image),
  eyebrow: `0${index + 1}`,
  body: scenario.description,
  href: '/scenarios',
}));

const sectionLabelSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  color: 'primary.main',
  typography: 'eyebrow',
} as const;

const glassPanelSx = {
  border: '2px solid',
  borderColor: 'translucent.primaryGreen',
  bgcolor: 'surface',
  boxShadow: 'none',
  backdropFilter: 'blur(14px)',
} as const;

export default function ScenariosLandingPage() {
  const theme = useTheme();

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
          <Container maxWidth="lg" sx={{ py: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.xl } }}>
            <ScrollReveal>
              <Stack spacing={theme.jtSpacing.gap.lg} sx={{ maxWidth: theme.jtSpacing.paragraphMaxWidth.default }}>
                <Box sx={sectionLabelSx}>
                  <ExploreIcon fontSize="small" />
                  Scenario Explorer
                </Box>
                <Typography variant="h1" component="h1" sx={{ maxWidth: '15ch' }}>
                  Choose a future to explore
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '58ch', color: 'base.100' }}>
                  Start with current operations, then move through outflow variations and adaptation pathways to compare what different Delta futures ask of communities, ecosystems, and water systems.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={theme.jtSpacing.gap.sm} sx={{ pt: theme.jtSpacing.component.xs }}>
                  <Button variant="contained" color="primary" component="a" href="#shared-context" endIcon={<ArrowForwardIcon />}>
                    Start with Current Operations
                  </Button>
                  <Button variant="outlined" component="a" href="#adaptations" sx={{ color: 'common.white', borderColor: 'base.300' }}>
                    Browse Adaptations
                  </Button>
                </Stack>
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
                  <Box sx={sectionLabelSx}>
                    <BoltIcon fontSize="small" />
                    Start Here
                  </Box>
                  <Typography variant="h2">Starting point</Typography>
                  <Typography variant="body1" sx={{ color: 'base.100' }}>
                    Read the background context first: this helps you understand the key factors shaping the Delta, and how the scenarios are designed to explore tradeoffs in water management, ecosystems, and communities.
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
                      Key Parameters
                    </Button>
                    <Button
                      component={Link}
                      to="/scenarios/background-context"
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ color: 'common.white', borderColor: 'base.300' }}
                    >
                      Read Background Context
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
                    sx={{ width: '100%', height: '100%', minHeight: 'inherit', objectFit: 'cover', opacity: 0.72 }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(16,22,24,0.08), rgba(16,22,24,0.9))',
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
                      sx={{ display: 'inline-flex', mb: theme.jtSpacing.gap.sm, px: theme.jtSpacing.component.xs, py: theme.jtSpacing.component.xs, border: 1, borderColor: 'primary.main', bgcolor: 'translucent.primaryGreen' }}
                    >
                      Business as Usual
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

        <Box component="section" aria-labelledby="outflow-panels-title">
          <ExpandableScenarioPanels
            items={outflowVariationPanels}
            actionLabel="Explore"
            sharedImage
            header={
              <Stack spacing={1.2} sx={{ maxWidth: { xs: 620, md: 760 } }}>
                <Box sx={sectionLabelSx}>
                  <WaterDropIcon fontSize="small" />
                  Outflow Variations
                </Box>
                <Typography id="outflow-panels-title" variant="h2" component="h2">
                  Three views of one water future
                </Typography>
                <Typography variant="body2" sx={{ color: 'base.100', maxWidth: '58ch' }}>
                  Three vertical panels use one shared image to compare less Delta outflow, current operations, and more Delta outflow.
                </Typography>
              </Stack>
            }
          />
        </Box>

        <Box component="section" id="adaptations" aria-labelledby="scenario-panels-title">
          <ExpandableScenarioPanels
            items={expandableScenarioItems}
            collapseOnScroll
            comparisonContent={(selectedPanel, onSelectPanel, active, seaLevelRise) => (
              <ScenarioRidgelinePlot selectedIndex={selectedPanel} onSelect={onSelectPanel} active={active} seaLevelRise={seaLevelRise} />
            )}
            header={
              <Stack spacing={1.2} sx={{ maxWidth: { xs: 620, md: 'none' } }}>
                <Box sx={sectionLabelSx}>
                  <ExploreIcon fontSize="small" />
                  Adaptation Pathways
                </Box>
                <Typography
                  id="scenario-panels-title"
                  variant="h2"
                  component="h2"
                  sx={{
                    whiteSpace: { xs: 'normal', md: 'nowrap' },
                    maxWidth: 'none',
                  }}
                >
                  Six futures, side by side
                </Typography>
                <Typography variant="body2" sx={{ color: 'base.100', maxWidth: '58ch' }}>
                  A full-screen panel view for browsing the same pathways as expandable columns.
                </Typography>
              </Stack>
            }
          />
        </Box>
      </Box>
      <Footer />
    </>
  );
}
