import { lazy, Suspense } from 'react'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import WhatIfSectionEditorial from './components/home/WhatIfSectionEditorial'
import Foundations from './components/home/Foundations'
import OurApproachSection from './components/home/OurApproachSection'
import Stakes from './components/home/Stakes'
import MissionBand from './components/home/MissionBand'
import HowItWorks from './components/home/HowItWorks'

const HeroMap = lazy(() => import('./components/maps/instances/HeroMap'))

function HeroMapFallback() {
  return (
    <section
      id="top"
      style={{
        width: '100%',
        height: '90vh',
        background: '#253439',
      }}
    />
  )
}

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<HeroMapFallback />}>
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

export default LandingPage
