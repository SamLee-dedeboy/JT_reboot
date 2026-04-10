import './App.css'
import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhatIf from './components/WhatIf'
import InfoSection from './components/InfoSection'
import TextColumns from './components/TextColumns'
import OurApproach from './components/OurApproach'
import ProjectGoals from './components/ProjectGoals'
import ProjectScope from './components/ProjectScope'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhatIf />

      <InfoSection
        title="What Are Just Transitions?"
        text="The term Just Transition is used in the domains of climate, energy, and environmental justice and refers to efforts to reduce inequity in society. This project seeks to advance such efforts by democratizing science and decision making in the Delta through a participatory scenario planning process that engages underrepresented communities most affected by salinity management."
        imagePosition="right"
        imageSrc="/images/community-fishing.jpg"
        imageAlt="Community members fishing in the Delta"
      />

      <TextColumns columns={[
        {
          title: 'What Are Scenarios?',
          text: 'Scenarios are models and depictions of possible futures and the pathways through which they could manifest. Participatory scenario planning is a "bottom up" approach that involves working directly with public contributors to create and evaluate future scenarios for a particular place.',
        },
        {
          title: 'Why Participatory Scenario Planning?',
          text: 'Scenario planning is an approach increasingly used in conservation and climate change adaptation research, especially when uncertainty, vulnerability, and divergent stakeholder interests create conflicting mandates. By envisioning diverse ways in which climate, governance and ecosystems might co-evolve, scenario-based planning offers tools to reflect on current actions and goals, and in turn, fosters shared learning and socio-technical innovation.',
        },
      ]} />

      <OurApproach />

      <TextColumns columns={[
        {
          title: "What's at Stake?",
          text: "The Bay-Delta region holds immense economic, ecological, and cultural significance, yet funding for research in this area has historically lagged behind other large-scale waterbodies. In addition, the lack of estuary-scale approaches for envisioning alternative futures and evaluating tradeoffs through inclusive public engagement has seen limited progress. Furthermore, the complex science-governance nexus of this area has often been fraught with conflict due to fragmented governance and competing demands on the region's natural resources. As a consequence, responses to climate management in the Delta have often been short-term 'bandaid' solutions with significant and possibly inequitable tradeoffs, leaving long-term solutions unclear.",
        },
        {
          title: 'Drought, Salinity & Sea-Level Rise',
          text: 'During extreme drought years, the amount of water required to be released from reservoirs to keep salinity from entering the Delta is nearly the same amount that is available for water use in the Delta and exported to southern California. These managed water releases for salinity control are intended to protect both in-Delta uses as well as this major source of exports to central and southern California. If ocean tides were to push salinity into the southern Delta—which would be accelerated by sea-level rise—the recovery of freshwater exports would take months to years. As drought stretches into multiple years and reservoir water supplies become more limited, controlling salinity becomes problematic, typically involving reduced exports, temporary relaxation of salinity standards in some parts of the Delta, and the construction of emergency barriers that redirect tidal energy away from the southern Delta. While effective at decreasing the amount of water needed to maintain salinity in the southern Delta, each of these actions has tradeoffs for different groups of people and ecosystems.',
        },
      ]} />

      <section className="salinity-section">
        <div className="salinity-inner container">
          <div className="salinity-text">
            <h2 className="salinity-title">Salinity Management</h2>
            <blockquote className="salinity-body">
              Salinity management in the Delta during drought has historically been done on an emergency basis.
              However, with future droughts and sea-level rise more likely, long-range planning that creatively
              visions new futures for salinity management while holistically considering the tradeoffs associated
              with those futures is needed.
            </blockquote>
          </div>
          <div className="salinity-callout">
            <p>The Just Transitions in the Delta project aims to address this need.</p>
          </div>
        </div>
      </section>

      <InfoSection
        title="How Our Project Works"
        text="Our project aims to raise awareness of the tradeoffs involved in managing the Sacramento-San Joaquin Delta amid future droughts and rising sea levels. Through collaborative design of future scenarios, community dialogue, advanced modeling and visualization, and co-learning that emphasizes underrepresented voices, we build shared understanding of what's possible and what's at stake."
        imagePosition="right"
        imageSrc="/images/workshop-session.jpg"
        imageAlt="Community workshop session"
      >
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/pages/adaptation-scenarios" className="btn btn-primary">
            View Adaptation Scenarios
          </Link>
        </div>
      </InfoSection>

      <section className="goals-scope-row">
        <div className="goals-scope-inner container">
          <ProjectGoals />
          <ProjectScope />
        </div>
      </section>
      <Footer />
    </>
  )
}

export default App
