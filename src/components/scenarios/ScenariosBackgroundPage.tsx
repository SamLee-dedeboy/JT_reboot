import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import MapIcon from '@mui/icons-material/Map';
import RouteIcon from '@mui/icons-material/Route';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WavesIcon from '@mui/icons-material/Waves';
import { Box, Button, Container, Divider, Stack, Typography, useTheme } from '@mui/material';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../animation/ScrollReveal';
import Footer from '../common/Footer';
import NavRail from '../common/NavRail';
import Navbar from '../common/Navbar';

interface ContextChapter {
  id: string;
  kicker: string;
  title: string;
  body: string;
  icon: ReactNode;
  accent: string;
}

const contextChapters: ContextChapter[] = [
  {
    id: '01',
    kicker: 'Two Rivers',
    title: 'California has two major river systems shaping the Delta',
    body: 'The Sacramento River flows south from Northern California, while the San Joaquin River flows north through the Central Valley. They meet in the Sacramento-San Joaquin Delta, where freshwater moves toward Suisun Bay, San Francisco Bay, and the Pacific Ocean.',
    icon: <RouteIcon />,
    accent: '#7ed957',
  },
  {
    id: '02',
    kicker: 'The Push and Pull',
    title: 'Freshwater outflow pushes west while ocean water pushes inland',
    body: 'Delta management is shaped by a tug of war: river outflow helps repel salty ocean water, while tides and sea level pressure can move saltwater inland. At the same time, major state and federal water projects export drinking and agricultural water from the southern Delta to communities and farms farther south.',
    icon: <CompareArrowsIcon />,
    accent: '#79e1e4',
  },
  {
    id: '03',
    kicker: 'X2 Distance',
    title: 'X2 helps measure where that tug of war is happening',
    body: 'The X2 salinity index tracks how far the low-salinity zone extends inland from the Golden Gate. In the StoryMap baseline, this distance is shown along the Sacramento and San Joaquin rivers in five-kilometer increments, making X2 a useful shorthand for understanding where freshwater outflow and ocean inflow are meeting.',
    icon: <WaterDropIcon />,
    accent: '#f2c820',
  },
];

const mapLayers = ['Sacramento River', 'San Joaquin River', 'X2 intervals', 'Export pumps'];

const keyTerms = [
  ['Outflow', 'Freshwater moving from the rivers through the Delta toward the Bay.'],
  ['Salinity intrusion', 'Saltier Bay water moving inland when tides, sea level, or low river flows allow it.'],
  ['Exports', 'Water diverted from the southern Delta for farms and drinking water in other parts of California.'],
  ['X2', 'A distance-based salinity marker used to track the low-salinity zone.'],
];

const navRailItems = [
  { id: 'overview', label: 'Overview' },
  ...contextChapters.map((chapter) => ({
    id: `section-${chapter.id}`,
    label: chapter.kicker,
  })),
  { id: 'key-terms', label: 'Key Terms' },
];

const eyebrowSx = {
  typography: 'eyebrow',
  color: 'primary.main',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
} as const;

function MapPlaceholder() {
  return (
    <Box
      aria-label="Interactive map placeholder"
      sx={{
        position: 'relative',
        minHeight: { xs: 390, md: 'calc(100vh - 156px)' },
        border: '1px solid rgba(155,162,164,0.28)',
        bgcolor: '#162226',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.42,
          backgroundImage: `
            linear-gradient(rgba(121,225,228,0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(121,225,228,0.14) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '10%',
          right: '16%',
          top: '20%',
          height: 12,
          borderRadius: 999,
          bgcolor: 'rgba(126,217,87,0.78)',
          transform: 'rotate(13deg)',
          boxShadow: '0 0 28px rgba(126,217,87,0.45)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '23%',
          right: '8%',
          top: '49%',
          height: 10,
          borderRadius: 999,
          bgcolor: 'rgba(121,225,228,0.72)',
          transform: 'rotate(-18deg)',
          boxShadow: '0 0 28px rgba(121,225,228,0.36)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 190,
          height: 190,
          right: '-42px',
          bottom: '-28px',
          border: '34px solid rgba(81,162,189,0.18)',
          borderRadius: '50%',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 120,
          height: 120,
          left: '12%',
          bottom: '15%',
          border: '2px dashed rgba(242,200,32,0.72)',
          borderRadius: '50%',
        }}
      />
      <Stack
        spacing={1.1}
        sx={{
          position: 'absolute',
          top: 18,
          left: 18,
          right: 18,
          p: 2,
          bgcolor: 'rgba(16,22,24,0.82)',
          border: '1px solid rgba(155,162,164,0.24)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={eyebrowSx}>
          <MapIcon fontSize="small" />
          Story Map Component
        </Box>
        <Typography variant="h5" component="p" sx={{ color: 'common.white' }}>
          Placeholder for Delta salinity map
        </Typography>
        <Typography variant="captionSmall" component="p" sx={{ color: 'base.100', lineHeight: 1.45 }}>
          This area can be replaced with the interactive map or StoryMap sidecar module.
        </Typography>
      </Stack>
      <Stack
        direction="row"
        useFlexGap
        sx={{ position: 'absolute', left: 18, right: 18, bottom: 18, flexWrap: 'wrap', gap: 1 }}
      >
        {mapLayers.map((layer, index) => (
          <Box
            key={layer}
            component="span"
            sx={{
              px: 1.2,
              py: 0.7,
              border: '1px solid rgba(155,162,164,0.24)',
              bgcolor: index === 2 ? 'rgba(242,200,32,0.18)' : 'rgba(16,22,24,0.76)',
              color: index === 2 ? '#f2c820' : 'base.50',
              fontSize: '0.82rem',
              lineHeight: 1,
              fontWeight: 800,
            }}
          >
            {layer}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default function ScenariosBackgroundPage() {
  const theme = useTheme();

  return (
    <>
      <Navbar />
      <NavRail
        items={navRailItems}
        ariaLabel="Background context sections"
        sx={(theme) => ({
          left: theme.spacing(theme.jtSpacing.component.lg),
          right: 'auto',
          alignItems: 'flex-start',
          '& button': {
            justifyContent: 'flex-start',
          },
          '& .rail-label': {
            order: 2,
            transform: 'translateX(-6px)',
          },
          '& .rail-dot': {
            order: 1,
          },
          '& button:hover .rail-label': {
            transform: 'none',
          },
        })}
      />
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
                  A short primer for reading the scenario maps: where the rivers meet, why outflow matters, and how X2 tracks the balance between freshwater and saltwater.
                </Typography>
              </Stack>
            </ScrollReveal>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.lg } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 0.86fr) minmax(420px, 0.74fr)' },
              gap: { xs: 4, lg: 5 },
              alignItems: 'start',
            }}
          >
            <Box component="article" sx={{ maxWidth: 860, mx: { xs: 0, lg: 'auto' }, width: '100%' }}>
              <ScrollReveal>
                <Box
                  id="overview"
                  sx={{
                    scrollMarginTop: 104,
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '130px minmax(0, 1fr)' },
                    gap: { xs: 1.4, sm: 3 },
                    pb: 3,
                    mb: 2,
                    borderBottom: '1px solid rgba(155,162,164,0.2)',
                  }}
                >
                  <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.light' }}>
                    Overview
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'base.100' }}>
                    The Delta is both an estuary and a water supply hub. That means each scenario starts with the same basic question: how much freshwater is available to hold back salinity while also serving ecosystems, Delta communities, farms, and cities?
                  </Typography>
                </Box>
              </ScrollReveal>

              <Stack spacing={0}>
                {contextChapters.map((chapter, index) => (
                  <ScrollReveal key={chapter.id} delay={index * 0.06}>
                    <Box
                      component="section"
                      id={`section-${chapter.id}`}
                      sx={{
                        scrollMarginTop: 104,
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '130px minmax(0, 1fr)' },
                        gap: { xs: 1.6, sm: 3 },
                        py: { xs: 4, md: 5 },
                        borderBottom: '1px solid rgba(155,162,164,0.18)',
                      }}
                    >
                      <Stack spacing={1.2} sx={{ color: 'base.100' }}>
                        <Typography variant="numberArticle" component="p" sx={{ color: chapter.accent }}>
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
                        <Typography variant="h3" component="h2" sx={{ color: 'common.white', textTransform: 'none', letterSpacing: 0, lineHeight: 1.18 }}>
                          {chapter.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'base.100' }}>
                          {chapter.body}
                        </Typography>
                      </Stack>
                    </Box>
                  </ScrollReveal>
                ))}
              </Stack>

              <ScrollReveal>
                <Box component="section" id="key-terms" sx={{ scrollMarginTop: 104, py: { xs: 4, md: 5 } }}>
                  <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.light', mb: 2 }}>
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
                  <Button component={Link} to="/scenarios" variant="contained" color="secondary" endIcon={<ArrowForwardIcon />} sx={{ color: 'base.900' }}>
                    Continue to Scenarios
                  </Button>
                  <Button component={Link} to="/scenarios" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ color: 'common.white', borderColor: 'base.300' }}>
                    Back
                  </Button>
                </Stack>
              </ScrollReveal>
            </Box>

            <Box
              component="aside"
              sx={{
                position: { xs: 'static', lg: 'sticky' },
                top: { lg: 96 },
                alignSelf: 'start',
              }}
            >
              <MapPlaceholder />
              <Divider sx={{ my: 2, borderColor: 'rgba(155,162,164,0.18)' }} />
              <Typography variant="captionSmall" component="p" sx={{ color: 'base.100', lineHeight: 1.55 }}>
                Source framing follows the Adaptation Scenarios StoryMap baseline: current operations, salinity intrusion, monitoring and compliance stations, and the X2 salinity index.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
