import { Box } from '@mui/material'
import { lazy, Suspense } from 'react'
import { HOME_PHOTOS, HOME_RAIL_ITEMS } from '../../content/home'
import Footer from '../../ui/Footer'
import NavRail from '../../ui/NavRail'
import Navbar from '../../ui/Navbar'
import RailGrid from '../../ui/RailGrid'
import HomeImagePanel from './components/HomeImagePanel'
import { FuturesPanel, StakesPanel, WhatIfPanel, WorksPanel } from './components/HomePanels'
import PanelSlant from './components/PanelSlant'
import { navigation } from '../../theme'

const HeroMap = lazy(() => import('./components/HeroMap'))

/** Each narrative panel's color; the slants into and out of a panel take the same one. */
const panelBg = {
  whatIf: '#1e4b56',
  futures: 'base.500',
  stakes: 'base.800',
  works: 'base.900',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Box
          sx={(theme) => ({
            position: 'relative',
            // The page's left gutter: the hero title, the rail and every panel's text line up on it.
            '--home-rail-inset': theme.spacing(3),
            [theme.breakpoints.up('md')]: { '--home-rail-inset': theme.spacing(8) },
            [theme.breakpoints.up('lg')]: { '--home-rail-inset': theme.spacing(10) },
          })}
        >
          <Box
            sx={{
              position: 'relative',
              zIndex: 0,
              height: navigation.belowBar('120dvh'),
            }}
          >
            <Suspense
              fallback={
                <Box
                  component="section"
                  id="top"
                  sx={{
                    width: '100%',
                    height: navigation.belowBar('100svh').md,
                    bgcolor: 'brand.base',
                  }}
                />
              }
            >
              <HeroMap />
            </Suspense>
          </Box>
          <Box sx={{ position: 'relative' }}>
            {/* The rail rides over every panel below the hero, in the same rail column. */}
            <RailGrid
              rail={
                <NavRail
                  items={HOME_RAIL_ITEMS}
                  ariaLabel="Explore the home page"
                  variant="sticky"
                />
              }
              sx={(theme) => ({
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                pointerEvents: 'none',
                // The dot's center sits on the gutter line.
                pl: `calc(var(--home-rail-inset) - ${theme.spacing(1.125 / 2)} + 1px)`,
                pt: '4.5rem',
              })}
            />
            <PanelSlant color={panelBg.whatIf} attachment="before" tilt="up-right" />
            <WhatIfPanel bg={panelBg.whatIf} />
            <PanelSlant color={panelBg.whatIf} attachment="after" tilt="down-right" />
            <HomeImagePanel
              photo={HOME_PHOTOS.justTransition}
              textPositionY="35%"
              backgroundSize={{ xs: 'cover', md: 'cover', lg: '130% auto' }}
              backgroundPosition={{ xs: '62% center', md: 'center 57%', lg: '0% 35%' }}
            />
            <PanelSlant color={panelBg.futures} attachment="before" tilt="down-right" />
            <FuturesPanel bg={panelBg.futures} />
            <PanelSlant color={panelBg.futures} attachment="after" tilt="down-right" />
            <HomeImagePanel
              photo={HOME_PHOTOS.scenarioPlanning}
              backgroundPosition={{ xs: '62% center', md: 'center 38%', lg: 'center 35%' }}
              textWidth="60ch"
            />
            <PanelSlant color={panelBg.stakes} attachment="before" tilt="down-right" />
            <StakesPanel bg={panelBg.stakes} />
            <PanelSlant color={panelBg.stakes} attachment="after" tilt="up-right" />
            <HomeImagePanel
              photo={HOME_PHOTOS.deltaInTransition}
              textPositionY="50%"
              backgroundPosition={{ xs: '62% center', md: 'center 42%', lg: 'center bottom 10%' }}
              textWidth="75ch"
            />
            <PanelSlant color={panelBg.works} attachment="before" tilt="down-right" />
            <WorksPanel bg={panelBg.works} />
          </Box>
        </Box>
        <Footer />
      </main>
    </>
  )
}
