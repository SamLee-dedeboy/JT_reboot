// Co-design dashboard, migrated from the JT_dashboard Svelte app (App.svelte).
// Styled with the site theme; dashboard-specific tokens live in theme.coDesign.
import { Box, Stack, Typography } from '@mui/material'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link as RouterLink, Route, Routes, useParams } from 'react-router-dom'
import Logo from '../../ui/Logo'
import CoDesignDialog from './shared/CoDesignDialog'
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
}

// Header copy per view; the longer descriptions live on the landing timeline.
const pageInfo: Record<string, PageInfo> = {
  '/flow': { title: 'Listening', subtitle: 'Understanding Public Values and Concerns' },
  '/linking': { title: 'Designing', subtitle: 'From Ideas and Values to Scenarios' },
  '/mental-model': {
    title: 'Conceptualizing',
    subtitle: 'Shared Understandings of Delta Salinity',
  },
  '/sunburst': { title: 'Comparing', subtitle: 'Different Mental Models' },
}

function TutorialBody({ children }: { children: ReactNode }) {
  return <Stack sx={{ gap: 1, color: 'base.50' }}>{children}</Stack>
}

function PageTutorial({ location }: { location: string }): ReactNode {
  if (location === '/flow') {
    return (
      <>
        <Typography id="co-design-tutorial-title" variant="h5" component="h3">
          How to use this interface
        </Typography>
        <TutorialBody>
          <Typography variant="body2">
            Three common questions we asked participants in interviews were:
          </Typography>
          <Box component="ol" sx={{ pl: 2.5, m: 0 }}>
            <Typography component="li" variant="body2">
              What should Future Salinity Management Strategies focus on?
            </Typography>
            <Typography component="li" variant="body2">
              What are the Drivers of Change?
            </Typography>
            <Typography component="li" variant="body2">
              Is the current decision making Fair?
            </Typography>
          </Box>
          <Typography variant="body2">
            Answer the questions yourself by clicking the blocks and see how many participants agree
            with you!
          </Typography>
          <Typography variant="body2">
            Each block represents a category of public opinion. Connected blocks represent public
            opinion from the same group of people.
          </Typography>
          <Typography variant="body2">
            Color of connections represent different groups of people, defined by participants'
            responses to <em>"What should be the Future Salinity Management Strategies?"</em>
          </Typography>
        </TutorialBody>
      </>
    )
  }
  if (location === '/linking') {
    return (
      <>
        <Typography id="co-design-tutorial-title" variant="h5" component="h3">
          How to use this interface
        </Typography>
        <TutorialBody>
          <Typography variant="body2">
            This interactive section illustrates how the results of interviews informed and guided
            the design of the project’s future adaptation scenarios.
          </Typography>
          <Typography variant="body2">
            Select a scenario from the left column to open a description of that scenario and a
            diagram of public values and concerns included in the scenario. You can zoom in and out
            of the diagram and hover over any of the bubble categories to see how many participants
            mentioned this interest and to read more detailed information about how this topic was
            discussed in interviews.
          </Typography>
        </TutorialBody>
      </>
    )
  }
  if (location === '/mental-model') {
    return (
      <>
        <Typography id="co-design-tutorial-title" variant="h5" component="h3">
          How to read these Mental Models
        </Typography>
        <TutorialBody>
          <Typography variant="body2">
            This collective mental model combines and visualizes how interview and workshop
            participants collectively responded to the following questions:
          </Typography>
          <Box component="ol" sx={{ pl: 2.5, m: 0 }}>
            <Typography component="li" variant="body2">
              What factors do you think have the most influence on Delta salinity management?
            </Typography>
            <Typography component="li" variant="body2">
              What is most at risk if salinity increases in the Delta?
            </Typography>
          </Box>
          <Typography variant="body2">
            Results have been organized into themes and symbolized from large to small based on the
            number of times they are mentioned by participants.
          </Typography>
          <Typography variant="body2">
            This collective mental model enables us to see shared understandings in how participants
            perceive drivers and impacts of Delta Salinity.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Tip: Hover over a node to view the data.
          </Typography>
        </TutorialBody>
      </>
    )
  }
  if (location === '/sunburst') {
    return (
      <>
        <Typography id="co-design-tutorial-title" variant="h5" component="h3">
          Comparing mental models across populations
        </Typography>
        <TutorialBody>
          <Typography variant="body2">
            Here we can compare the different themes present in the mental models across different
            populations. You can see differences across team members and interviewees, different
            years of engagement in the delta, residents and non residents, and different ages.
          </Typography>
          <Typography variant="body2">
            Tip: click different segments of the wheels to see more on what this concept was in
            participants' mental model.
          </Typography>
        </TutorialBody>
      </>
    )
  }
  return null
}

export default function CoDesignDashboard() {
  // Equivalent of svelte-spa-router's $location ("/", "/flow", ...).
  const { '*': rest = '' } = useParams()
  const location = `/${rest.replace(/\/$/, '')}`
  const isNotHomePage = location !== '/'
  const currentPage = pageInfo[location] ?? null

  // Open the tutorial whenever navigating to a content page.
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

  // Kiosk shortcut carried over from the exhibition dashboard: Enter goes fullscreen.
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !isFullscreen) {
        event.preventDefault()
        enterFullscreen()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [enterFullscreen, isFullscreen])

  return (
    <Box sx={{ bgcolor: (theme) => theme.coDesign.shell.pageBackground }}>
      <CoDesignDialog
        open={pageModalOpen && currentPage !== null}
        onClose={() => setPageModalOpen(false)}
        labelledBy="co-design-tutorial-title"
      >
        <PageTutorial location={location} />
      </CoDesignDialog>

      <Box
        component="main"
        sx={(theme) => ({
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100vw',
          height: '100dvh',
          overflowY: { xs: 'auto', lg: 'hidden' },
          bgcolor: theme.coDesign.shell.pageBackground,
        })}
      >
        {/* View title at left, site wordmark and dashboard-home link at right */}
        <Box
          component="header"
          sx={(theme) => ({
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: currentPage ? 'space-between' : 'flex-end',
            gap: 2,
            px: { xs: 2, md: 4 },
            py: 1,
            mb: 2,
            bgcolor: theme.coDesign.shell.headerBackground,
            borderBottom: `1px solid ${theme.coDesign.shell.headerBorder}`,
          })}
        >
          {isNotHomePage && currentPage && (
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <InfoButton
                onClick={() => setPageModalOpen((open) => !open)}
                label="About this section"
              />
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                sx={{ alignItems: { md: 'baseline' }, columnGap: 1.5, minWidth: 0 }}
              >
                <Typography variant="h4" component="h1">
                  {currentPage.title}
                </Typography>
                <Typography variant="eyebrow" component="p">
                  {currentPage.subtitle}
                </Typography>
              </Stack>
            </Stack>
          )}
          <Stack sx={{ alignItems: 'flex-end', flexShrink: 0 }}>
            <Logo />
            {isNotHomePage && (
              <Typography
                component={RouterLink}
                to={coDesignPath('/')}
                variant="chartLabel"
                sx={{
                  color: 'base.100',
                  textDecoration: 'none',
                  '&:hover, &:focus-visible': { color: 'primary.main' },
                }}
              >
                ← Dashboard home
              </Typography>
            )}
          </Stack>
        </Box>
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
      </Box>
    </Box>
  )
}
