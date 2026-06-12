import Navbar from './components/Navbar'
import HeroMap from './components/maps/HeroMap'
import Funding from './components/Funding'
import WhatIfSectionEditorial from './components/home/WhatIfSectionEditorial'
import Foundations from './components/home/Foundations'
import OurApproachSection from './components/home/OurApproachSection'
import Stakes from './components/home/Stakes'
import MissionBand from './components/home/MissionBand'
import HowItWorks from './components/home/HowItWorks'

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroMap />
        <WhatIfSectionEditorial />
        <Foundations />
        <OurApproachSection />
        <Stakes />
        <MissionBand />
        <HowItWorks />
        <Funding />
      </main>
    </>
  )
}

export default LandingPage
