// Co-design dashboard, migrated from the JT_dashboard Svelte app (App.svelte).
// Styled with the site theme; dashboard-specific tokens live in theme.coDesign.
// The landing page is an ordinary site page (navbar, hero, footer); each view is a
// full-height tool under its own header, like the salinity explorer. The views need
// a laptop-sized screen: below lg every dashboard URL shows the landing page.
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Stack, Typography } from '@mui/material'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Link as RouterLink, Route, Routes, useParams } from 'react-router-dom'
import { Footer, Navbar } from '@/ui'
import HowToReadDialog from './shared/HowToReadDialog'
import { howToRead } from './shared/howToReadContent'
import { coDesignPath } from './shared/paths'
import { useViewsAvailable } from './shared/useViewsAvailable'
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

export default function CoDesignDashboard() {
  // Equivalent of svelte-spa-router's $location ("/", "/flow", ...).
  const { '*': rest = '' } = useParams()
  const location = `/${rest.replace(/\/$/, '')}`
  const isNotHomePage = location !== '/'
  const currentPage = pageInfo[location] ?? null
  const viewsAvailable = useViewsAvailable()

  // Open How to read this whenever navigating to a content page.
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
      // Enter on a link or control activates it instead.
      const onControl =
        event.target instanceof Element &&
        event.target.closest('a, button, input, select, textarea, [role="button"]') !== null
      if (event.key === 'Enter' && !isFullscreen && !onControl) {
        event.preventDefault()
        enterFullscreen()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [enterFullscreen, isFullscreen])

  const views = (
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
  )

  // Landing page: a site page that scrolls with the document. A view's URL keeps
  // showing it on a small screen, so widening the window brings the view back.
  if (!isNotHomePage || !viewsAvailable) {
    return (
      <>
        <Navbar />
        <Box component="main">{viewsAvailable ? views : <Home />}</Box>
        <Footer />
      </>
    )
  }

  return (
    <Box sx={{ bgcolor: (theme) => theme.coDesign.shell.pageBackground }}>
      <HowToReadDialog
        open={pageModalOpen && currentPage !== null}
        onClose={() => setPageModalOpen(false)}
        content={howToRead[location] ?? null}
      />

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
        {/* Back to the landing page and the view's title at left, How to read this at right */}
        <Box
          component="header"
          sx={(theme) => ({
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: theme.jtSpacing.gap.md,
            px: { xs: 2, md: 4 },
            py: 1.5,
            bgcolor: theme.coDesign.shell.headerBackground,
            borderBottom: `1px solid ${theme.coDesign.shell.headerBorder}`,
          })}
        >
          <Stack
            direction="row"
            sx={(theme) => ({ alignItems: 'center', gap: theme.jtSpacing.gap.md, minWidth: 0 })}
          >
            <Button
              component={RouterLink}
              to={coDesignPath('/')}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              Back to timeline
            </Button>
            {currentPage && (
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
            )}
          </Stack>
          {currentPage && (
            <Button
              variant="outlined"
              onClick={() => setPageModalOpen((open) => !open)}
              sx={{ flexShrink: 0 }}
            >
              How to read this
            </Button>
          )}
        </Box>
        {views}
      </Box>
    </Box>
  )
}
