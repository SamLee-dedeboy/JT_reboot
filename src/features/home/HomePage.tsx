import { Box, useMediaQuery, useTheme } from '@mui/material'
import { lazy, Suspense } from 'react'
import { HOME_PHOTOS, HOME_RAIL_ITEMS } from '@/content/home'
import { Footer, Navbar, NavRail, RailGrid, SectionTabs } from '@/ui'
import HomeImagePanel from './components/HomeImagePanel'
import { FuturesPanel, StakesPanel, WhatIfPanel, WorksPanel } from './components/HomePanels'
import PanelSlant from './components/PanelSlant'
import { navigation } from '@/theme'

const HeroMap = lazy(() => import('./components/HeroMap'))

/** Each narrative panel's color; the slants into and out of a panel take the same one. */
const panelBg = {
  whatIf: 'brand.deepTeal',
  futures: 'base.500',
  stakes: 'base.800',
  works: 'base.900',
}

export default function HomePage() {
  const theme = useTheme()
  // The rail shows from lg up; below it, the section tabs take its place.
  const showRail = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true })
  // The tab strip shows from sm to lg; a phone gets neither tabs nor rail.
  const showTabs = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true }) && !showRail

  return (
    <>
      <Navbar />
      <main>
        <Box
          sx={(theme) => ({
            position: 'relative',
            // The page's left gutter: the hero title, the rail and every panel's text line up on it.
            // At sm it sits where the hero text stood: the phone gutter plus the hero's old indent.
            '--home-rail-inset': theme.spacing(3),
            [theme.breakpoints.up('sm')]: {
              '--home-rail-inset': theme.spacing(3 + theme.jtSpacing.component.md),
            },
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
            {/* From sm to lg the tabs pin under the navbar through every panel, in place of the rail. */}
            {/* The hero ends on a slant into the first panel, except where the tab strip
                (sm to lg) sits between them and gives the hero a straight edge. */}
            {showTabs ? (
              <SectionTabs items={HOME_RAIL_ITEMS} ariaLabel="Explore the home page" />
            ) : (
              <PanelSlant color={panelBg.whatIf} attachment="before" tilt="up-right" />
            )}
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
