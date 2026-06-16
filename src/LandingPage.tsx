import Navbar from './components/common/Navbar'
import HeroMap from './components/maps/HeroMap'
import Footer from './components/common/Footer'
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
        <Footer />
      </main>
    </>
  )
}

export default LandingPage
