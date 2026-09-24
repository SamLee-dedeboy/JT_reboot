// Co-design dashboard, migrated from the JT_dashboard Svelte app (App.svelte).
// Phase 1 keeps the dashboard's own design system: styles are scoped under
// .jtd-root and Tailwind utilities are generated for this folder only.
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './styles/preflight.css'
import './styles/base.css'
import './styles/tailwind.css'
import './CoDesignDashboard.css'
import Fade from './shared/FadeModal'
import InfoButton from './shared/InfoButton'
import { coDesignPath } from './shared/paths'
import Home from './views/Home'

const Flow = lazy(() => import('./views/flow/Flow'))
const Linking = lazy(() => import('./views/linking/Linking'))
const MentalModel = lazy(() => import('./views/mental-model/MentalModel'))
const Sunburst = lazy(() => import('./views/sunburst/Sunburst'))
const SunburstGrid = lazy(() => import('./views/sunburst/SunburstGrid'))

type PageInfo = {
  title: string
  subtitle: string
  body: string
  hint: string
}

const pageInfo: Record<string, PageInfo> = {
  '/flow': {
    title: 'Listening',
    subtitle: 'Understanding Public Values and Concerns',
    body: "Our process began by interviewing Delta residents, community organizers, Indigenous community members, farmers, scientists, experts and agency officials. Key questions we asked interviewees were what they most value about the Delta, what factors are driving change, what adaptation strategies are most useful to explore, and who is and isn't represented in Delta planning efforts.",
    hint: 'Explore the results and connections across the interview data',
  },
  '/linking': {
    title: 'Designing',
    subtitle: 'From Ideas and Values to Scenarios',
    body: 'With a rich understanding of participant values, the drivers of change, and the management and adaptation strategies prioritized across a range of interviewees, we used this information as the foundation for the design of six distinct scenarios.',
    hint: 'Explore how interviews shaped the design of each scenario',
  },
  '/mental-model': {
    title: 'Conceptualizing',
    subtitle: 'Shared Understandings of Delta Salinity',
    body: 'Throughout the project we have been documenting how project participants conceptualize and understand salinity and salinity management in the Delta. We collected these "mental models" through interviews and our public workshops and exhibitions.',
    hint: 'Explore shared understandings of drivers and impacts of Delta Salinity',
  },
  '/sunburst': {
    title: 'Comparing',
    subtitle: 'Different Mental Models',
    body: 'We then took the interview and public mental models a step further by comparing them across a range of demographic and other category types. We observed similarities and differences between a variety of groups, including comparisons across age, experience, Delta resident or non-resident, and research team members compared to participants.',
    hint: 'Explore how mental models differ across participants',
  },
}

function PageTutorial({ location }: { location: string }): ReactNode {
  if (location === '/flow') {
    return (
      <>
        <h3 className="modal-tutorial-title">How to use this interface</h3>
        <div className="modal-tutorial-body">
          <p>Three common questions we asked participants in interviews were:</p>
          <ol>
            <li>What should Future Salinity Management Strategies focus on?</li>
            <li>What are the Drivers of Change?</li>
            <li>Is the current decision making Fair?</li>
          </ol>
          <p>
            Answer the questions yourself by clicking the blocks and see how many participants agree
            with you!
          </p>
          <p>
            Each block represents a category of public opinion. Connected blocks represent public
            opinion from the same group of people.
          </p>
          <p>
            Color of connections represent different groups of people, defined by participants'
            responses to <em>"What should be the Future Salinity Management Strategies?"</em>
          </p>
        </div>
      </>
    )
  }
  if (location === '/linking') {
    return (
      <>
        <h3 className="modal-tutorial-title">How to use this interface</h3>
        <div className="modal-tutorial-body">
          <p>
            This interactive section illustrates how the results of interviews informed and guided
            the design of the project’s future adaptation scenarios.
          </p>
          <p>
            Select a scenario from the left column to open a description of that scenario and a
            diagram of public values and concerns included in the scenario. You can zoom in and out
            of the diagram and hover over any of the bubble categories to see how many participants
            mentioned this interest and to read more detailed information about how this topic was
            discussed in interviews.
          </p>
        </div>
      </>
    )
  }
  if (location === '/mental-model') {
    return (
      <>
        <h3 className="modal-tutorial-title">How to read these Mental Models</h3>
        <div className="modal-tutorial-body">
          <p>
            This collective mental model combines and visualizes how interview and workshop
            participants collectively responded to the following questions:
          </p>
          <ol>
            <li>What factors do you think have the most influence on Delta salinity management?</li>
            <li>What is most at risk if salinity increases in the Delta?</li>
          </ol>
          <p>
            Results have been organized into themes and symbolized from large to small based on the
            number of times they are mentioned by participants.
          </p>
          <p>
            This collective mental model enables us to see shared understandings in how participants
            perceive drivers and impacts of Delta Salinity.
          </p>
          <p className="italic">Tip: Hover over a node to view the data.</p>
        </div>
      </>
    )
  }
  if (location === '/sunburst') {
    return (
      <>
        <h3 className="modal-tutorial-title">Comparing mental models across populations</h3>
        <div className="modal-tutorial-body">
          <p>
            Here we can compare the different themes present in the mental models across different
            populations. You can see differences across team members and interviewees, different
            years of engagement in the delta, residents and non residents, and different ages.
          </p>
          <p>
            Tip: click different segments of the wheels to see more on what this concept was in
            participants' mental model.
          </p>
        </div>
      </>
    )
  }
  return null
}

export default function CoDesignDashboard() {
  const navigate = useNavigate()
  // Equivalent of svelte-spa-router's $location ("/", "/flow", ...).
  const { '*': rest = '' } = useParams()
  const location = `/${rest.replace(/\/$/, '')}`
  const isNotHomePage = location !== '/'
  const currentPage = pageInfo[location] ?? null

  // Open the modal whenever navigating to a content page.
  const [pageModalOpen, setPageModalOpen] = useState(() => location in pageInfo)
  const [modalLocation, setModalLocation] = useState(location)
  if (modalLocation !== location) {
    setModalLocation(location)
    if (location in pageInfo) setPageModalOpen(true)
  }

  const [isFullscreen, setIsFullscreen] = useState(false)
  const enterFullscreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      }
      setIsFullscreen(true)
    } catch (error) {
      console.warn('Could not enter fullscreen:', error)
    }
  }, [])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !isFullscreen) {
        event.preventDefault()
        enterFullscreen()
      } else if (event.key === 'Escape' && pageModalOpen) {
        event.preventDefault()
        setPageModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [enterFullscreen, isFullscreen, pageModalOpen])

  return (
    <div className="jtd-root jtd-App">
      {/* Per-view tutorial modal, reopened by the header info button */}
      <Fade
        show={pageModalOpen && currentPage !== null}
        className="modal-backdrop"
        onClick={() => setPageModalOpen(false)}
      >
        <div
          className="modal-box"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-tutorial">
            <PageTutorial location={location} />
          </div>
          <button
            className="modal-close"
            onClick={() => setPageModalOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </Fade>

      <main className="flex flex-col relative w-screen h-screen overflow-y-auto lg:overflow-hidden">
        <header className={`app-hero h-[60px] ${isNotHomePage ? 'app-hero--compact' : ''}`}>
          {isNotHomePage && currentPage && (
            <div className="app-hero__page-info">
              <InfoButton
                onClick={() => setPageModalOpen((open) => !open)}
                label="About this section"
              />
              <div className="app-hero__page-text">
                <span className="app-hero__page-title">{currentPage.title}</span>
                <span className="app-hero__page-subtitle">{currentPage.subtitle}</span>
              </div>
            </div>
          )}
          <div className="app-hero__brand">
            <span className="app-hero__title">
              <button
                type="button"
                className="app-hero__title-button"
                title="Back to home"
                onClick={() => navigate(coDesignPath('/'))}
              >
                Just Transitions in the Delta
                <span className="app-hero__title-back">
                  {isNotHomePage ? '← Back to home' : ' '}
                </span>
              </button>
            </span>
          </div>
        </header>
        <Suspense fallback={null}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="flow" element={<Flow />} />
            <Route path="linking" element={<Linking />} />
            <Route path="mental-model" element={<MentalModel />} />
            <Route path="sunburst" element={<Sunburst />} />
            <Route path="sunburst-grid" element={<SunburstGrid />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
