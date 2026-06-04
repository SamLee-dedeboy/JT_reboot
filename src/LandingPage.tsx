import Navbar from './components/Navbar'
import HeroMap from './components/maps/HeroMap'
import Footer from './components/Footer'
import WhatIfSection from './components/home/WhatIfSection'
import Foundations from './components/home/Foundations'
import OurApproachSection from './components/home/OurApproachSection'
import Stakes from './components/home/Stakes'
import MissionBand from './components/home/MissionBand'
import HowItWorks from './components/home/HowItWorks'
import NavRail from './components/home/NavRail'

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroMap />
        <WhatIfSection />
        <Foundations />
        <OurApproachSection />
        <Stakes />
        <MissionBand />
        <HowItWorks />
        <Footer />
      </main>
      <NavRail />
    </>
  )
}

export default LandingPage
