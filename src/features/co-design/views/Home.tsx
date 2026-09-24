// Dashboard landing timeline, ported from JT_dashboard/src/lib/Home.svelte.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Fade from '../shared/FadeModal'
import InfoButton from '../shared/InfoButton'
import { coDesignPath } from '../shared/paths'
import './Home.css'

// Module-level so the welcome modal only opens on the first visit per page load.
let visited = false

export default function Home() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(() => !visited)
  useEffect(() => {
    visited = true
  }, [])
  const push = (view: string) => navigate(coDesignPath(view))

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen) {
        e.preventDefault()
        setModalOpen(false)
      }
    }
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [modalOpen])

  return (
    <div className="jtd-Home">
      <Fade show={modalOpen} className="modal-backdrop" onClick={() => setModalOpen(false)}>
        <div
          className="modal-box"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="modal-title">
            Welcome to the
            <br />
            Co-Learning Dashboard
          </h2>
          <p className="modal-body">
            This site offers interactive opportunities to explore how the Just Transitions in the
            Delta research project has prioritized and responded to public engagement through a
            participatory scenario planning process
          </p>
          <p className="modal-cta">Click one of the modules to get started</p>
          <button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close">
            ✕
          </button>
        </div>
      </Fade>

      <InfoButton
        onClick={() => setModalOpen((open) => !open)}
        label="About this dashboard"
        className="info-btn-fixed"
      />

      <div className="home-container">
        <header className="welcome-header gap-8">
          <h1 className="welcome-title">Welcome to the Co-Learning Dashboard</h1>
          <p className="welcome-subtitle">
            “What is co-learning”? Co-learning is a collaborative process in which researchers,
            community members, and other partners learn from one another by sharing knowledge,
            experiences, and perspectives to jointly understand issues and develop solutions. It
            recognizes that expertise exists both inside and outside academia and values mutual
            learning throughout the research process
          </p>
        </header>

        <div className="timeline-container">
          <div className="timeline-line"></div>

          {/* Timeline Item 1 - Left */}
          <div className="timeline-item left">
            <div className="timeline-side">
              <button className="timeline-card" onClick={() => push('/flow')}>
                <h3 className="card-title">Listening</h3>
                <h4 className="card-subtitle">
                  UNDERSTANDING PUBLIC <br /> VALUES and CONCERNS
                </h4>
                <p className="card-body">
                  Our process began by interviewing Delta residents, community organizers,
                  Indigenous community members, farmers, scientists, experts and agency officials.
                  Key questions we asked interviewees included what they most value about the Delta,
                  what factors they believe drive change, what salinity adaptation strategies they
                  are most interested in seeing explored, and who is and isn’t represented in Delta
                  planning efforts.
                </p>
                <p className="card-hint">
                  Click to explore the results and connections across the interview data
                </p>
              </button>
            </div>
            <div className="timeline-dot">
              <div className="timeline-date">2023</div>
            </div>
          </div>

          {/* Timeline Item 2 - Right */}
          <div className="timeline-item right">
            <div className="timeline-dot">
              <div className="timeline-date">Early 2024</div>
            </div>
            <div className="timeline-side">
              <button className="timeline-card" onClick={() => push('/linking')}>
                <h3 className="card-title">Designing</h3>
                <h4 className="card-subtitle">
                  FROM IDEAS and VALUES <br /> TO SCENARIOS
                </h4>
                <p className="card-body">
                  With a better understanding of interviewee's perceived drivers of change,
                  management and adaptation strategies to explore, and values and priorities, we
                  designed six distinct scenarios.
                </p>
                <p className="card-hint">
                  Click to explore how interviews shaped the design of each scenario
                </p>
              </button>
            </div>
          </div>

          {/* Timeline Item 3 - Left */}
          <div className="timeline-item left">
            <div className="timeline-side">
              <button className="timeline-card" onClick={() => push('/mental-model')}>
                <h3 className="card-title">CONCEPTUALIZING</h3>
                <h4 className="card-subtitle">SHARED UNDERSTANDINGS OF DELTA SALINITY</h4>
                <p className="card-body">
                  Leveraging these interviews and data collected through our public workshops, we
                  have been documenting how project participants conceptualize and understand
                  salinity and salinity management in the Delta, as well as how those understandings
                  change over time. These are visualized as “mental models” which are
                  representations of how people understand a system, concept, or process works.
                </p>
                <p className="card-hint">Click to see these mental models</p>
              </button>
            </div>
            <div className="timeline-dot">
              <div className="timeline-date">2025</div>
            </div>
          </div>

          {/* Timeline Item 4 - Right */}
          <div className="timeline-item right">
            <div className="timeline-dot">
              <div className="timeline-date">Summer 2025</div>
            </div>
            <div className="timeline-side">
              <button className="timeline-card" onClick={() => push('/sunburst')}>
                <h3 className="card-title">Comparing</h3>
                <h4 className="card-subtitle">DIFFERENT MENTAL MODELS</h4>
                <p className="card-body">
                  We then compare how the mental models are similar and different across different
                  groups of people, including across age, years of engagement in the Delta, Delta
                  resident or non-resident, and research team members compared to research
                  participants.
                </p>
                <p className="card-hint">
                  Click to explore how mental models differ across participants
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
