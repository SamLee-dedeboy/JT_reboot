import { Box } from '@mui/material'
import { lazy, Suspense } from 'react'
import Footer from '../../ui/Footer'
import Navbar from '../../ui/Navbar'
import Foundations from './components/Foundations'
import HowItWorks from './components/HowItWorks'
import MissionBand from './components/MissionBand'
import OurApproachSection from './components/OurApproachSection'
import Stakes from './components/Stakes'
import WhatIfSectionEditorial from './components/WhatIfSectionEditorial'

const HeroMap = lazy(() => import('../../map/instances/HeroMap'))

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense
          fallback={
            <Box
              component="section"
              id="top"
              sx={{ width: '100%', height: '90vh', bgcolor: 'brand.base' }}
            />
          }
        >
          <HeroMap />
        </Suspense>
        <WhatIfSectionEditorial />
        <Foundations />
        <OurApproachSection />
        <Stakes />
        <MissionBand />
        <HowItWorks />
        <Footer />
      </main>
    </>
  )
}
