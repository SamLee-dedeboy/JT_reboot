import { Box } from '@mui/material'
import { lazy, Suspense, useEffect, useState } from 'react'
import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'
import WhatIfSectionEditorial from './components/WhatIfSectionEditorial'
import FuturesPanels from './components/FuturesPanels'
import StakesPanels from './components/StakesPanels'
import WorksPanels from './components/WorksPanels'
import HomeNavRail from './components/HomeNavRail'

const HeroMap = lazy(() => import('../../map/instances/HeroMapPilot'))

// Photo sections have no id anchor of their own in the rail. Bumping their own
// z-index above the rail broke the torn-paper overlap with adjacent sections,
// so instead the rail's own z-index drops below every section (min z is 30)
// whenever one of these scrolls through its band, and rises back above all of
// them otherwise — real occlusion, no opacity fade.
const RAIL_OBSCURING_SECTION_IDS = ['futures-photo', 'stakes-photo', 'works-photo']

export default function HomePage() {
  const [obscuredBy, setObscuredBy] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const els = RAIL_OBSCURING_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    )
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        setObscuredBy((prev) => {
          const next = new Set(prev)
          entries.forEach((entry) => {
            if (entry.isIntersecting) next.add(entry.target.id)
            else next.delete(entry.target.id)
          })
          return next
        })
      },
      { rootMargin: '-24% 0px -55% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const railHidden = obscuredBy.size > 0

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
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={(theme) => ({
                position: 'absolute',
                top: 0,
                bottom: 0,
                zIndex: railHidden ? 10 : 70,
                pointerEvents: 'none',
                display: { xs: 'none', lg: 'block' },
                pl: `calc(var(--home-rail-inset) - ${theme.spacing(1.125 / 2)} + 1px)`,
                pt: '4.5rem',
              })}
            >
              <HomeNavRail />
            </Box>
            <WhatIfSectionEditorial />
            <FuturesPanels />
            <StakesPanels />
            <WorksPanels />
          </Box>
        </Box>
        <Footer />
      </main>
    </>
  )
}
