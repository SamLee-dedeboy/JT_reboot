import { Box } from '@mui/material'
import { lazy, Suspense } from 'react'
import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'
import WhatIfPanel from './components/01_WhatIfPanel'
import FuturesPanel from './components/02_FuturesPanel'
import StakesPanel from './components/03_StakesPanel'
import WorksPanel from './components/04_WorksPanel'
import HomeImagePanel from './components/HomeImagePanel'
import HomeNavRail from './components/HomeNavRail'
import PanelSlant from './components/PanelSlant'

const HeroMap = lazy(() => import('../../map/instances/HeroMap'))

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Box
          sx={(theme) => ({
            position: 'relative',
            '--home-rail-inset': theme.spacing(3),
            [theme.breakpoints.up('md')]: { '--home-rail-inset': theme.spacing(8) },
            [theme.breakpoints.up('lg')]: { '--home-rail-inset': theme.spacing(10) },
          })}
        >
          <Box
            sx={{
              position: 'relative',
              zIndex: 0,
              height: { xs: 'calc(120dvh - 72px)', md: 'calc(120dvh - 76px)' },
            }}
          >
            <Suspense
              fallback={
                <Box
                  component="section"
                  id="top"
                  sx={{ width: '100%', height: 'calc(100svh - 76px)', bgcolor: 'brand.base' }}
                />
              }
            >
              <HeroMap />
            </Suspense>
          </Box>
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={(theme) => ({
                position: 'absolute',
                top: 0,
                bottom: 0,
                zIndex: 3,
                pointerEvents: 'none',
                display: { xs: 'none', lg: 'block' },
                pl: `calc(var(--home-rail-inset) - ${theme.spacing(1.125 / 2)} + 1px)`,
                pt: '4.5rem',
              })}
            >
              <HomeNavRail />
            </Box>
            <PanelSlant color="#384550" attachment="before" tilt="up-right" />
            <WhatIfPanel />
            <PanelSlant color="#384550" attachment="after" tilt="down-right" />
            <HomeImagePanel
              id="futures-photo"
              ariaLabel="What is a just transition?"
              image="images/community-fishing.jpg"
              textPositionY="35%"
              backgroundSize={{ xs: 'cover', md: 'cover', lg: '130% auto' }}
              backgroundPosition={{ xs: '62% center', md: 'center 57%', lg: '0% 35%' }}
              text="The term Just Transition is used in the domains of climate, energy, and environmental justice and refers to efforts to reduce inequity in society. This project seeks to advance such efforts by democratizing science and decision making in the Delta through a participatory scenario planning process."
              buttonLabel="What is a just transition?"
              buttonHref="#foundations"
            />
            <PanelSlant color="base.500" attachment="before" tilt="down-right" />
            <FuturesPanel />
            <PanelSlant color="base.500" attachment="after" tilt="down-right" />
            <HomeImagePanel
              id="stakes-photo"
              ariaLabel="Participatory scenario planning"
              image="images/exhibit.jpg"
              backgroundPosition={{ xs: '62% center', md: 'center 38%', lg: 'center 35%' }}
              textWidth="60ch"
              text="By envisioning diverse ways in which climate, governance, and ecosystems might co-evolve, scenario-based planning offers tools to reflect on current actions and goals, and in turn, fosters shared learning and socio-technical innovation."
              buttonLabel="Participatory Scenario Planning"
              buttonHref="#stakes"
            />
            <PanelSlant color="base.800" attachment="before" tilt="down-right" />
            <StakesPanel />
            <PanelSlant color="base.800" attachment="after" tilt="up-right" />
            <HomeImagePanel
              id="works-photo"
              ariaLabel="A delta in transition"
              image="images/tulare-basin.jpg"
              textPositionY="50%"
              backgroundPosition={{ xs: '62% center', md: 'center 42%', lg: 'center bottom 10%' }}
              text="Salinity management in the Delta during drought has historically been done on an emergency basis. However, with future droughts and sea-level rise more likely, long-range planning that creatively visions new futures for salinity management while holistically considering the tradeoffs associated with those futures is needed."
              buttonLabel="A Delta in Transition"
              buttonHref="#works"
              textWidth="75ch"
            />
            <PanelSlant color="base.900" attachment="before" tilt="down-right" />
            <WorksPanel />
          </Box>
        </Box>
        <Footer />
      </main>
    </>
  )
}
