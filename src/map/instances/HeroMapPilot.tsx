import { useCallback, useEffect, useRef, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import { useMediaQuery, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { Box, Typography } from '@mui/material'
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded'
import { HERO } from '../../features/home/content/homeContent'
import BaseMap from '../BaseMap'
import MapLayerOrchestrator from '../MapLayerOrchestrator'
import SalinityVector155Layer from '../layers/SalinityVector155Layer'
import { HERO_MAP_STYLE, SUISUN_BAY_CENTER } from '../mapCameraView'

const mapContainerStyle = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
} as const

function getHeroBreakpoint(isXlUp: boolean, isLgUp: boolean, isMdUp: boolean, isSmUp: boolean) {
  if (isXlUp) return 'xl'
  if (isLgUp) return 'lg'
  if (isMdUp) return 'md'
  if (isSmUp) return 'sm'
  return 'xs'
}

const heroZoomByBreakpoint = {
  xs: 9.15,
  sm: 9.45,
  md: 9.75,
  lg: 10,
  xl: 10.25,
} as const

/** Pauses the salinity animation while the hero is off-screen or the tab is hidden. */
function useHeroVisibility(sectionRef: React.RefObject<HTMLElement | null>) {
  const [isInViewport, setIsInViewport] = useState(true)
  const [isPageVisible, setIsPageVisible] = useState(() => document.visibilityState === 'visible')

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => setIsInViewport(entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [sectionRef])

  useEffect(() => {
    const handleVisibilityChange = () => setIsPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return isInViewport && isPageVisible
}

export default function HeroMapPilot() {
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'))
  const [mapObj, setMapObj] = useState<MapboxMap | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const isAnimationPlaying = useHeroVisibility(sectionRef)
  const heroBreakpoint = getHeroBreakpoint(isXlUp, isLgUp, isMdUp, isSmUp)
  const [heroInitialViewState] = useState(() => ({
    ...SUISUN_BAY_CENTER,
    zoom: heroZoomByBreakpoint[heroBreakpoint],
  }))

  const handleMapAvailable = useCallback((map: MapboxMap) => {
    if (mapRef.current === map) return
    mapRef.current = map
    setMapObj(map)
  }, [])

  return (
    <Box
      component="section"
      ref={sectionRef}
      id="top"
      sx={{
        position: 'sticky',
        top: { xs: 72, md: 76 },
        width: '100%',
        height: { xs: 'calc(100svh - 72px)', md: 'calc(100svh - 76px)' },
        minHeight: { xs: 520, md: 600 },
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      <Box sx={mapContainerStyle}>
        <BaseMap
          initialViewState={heroInitialViewState}
          mapStyleUrl={HERO_MAP_STYLE}
          interactive={false}
          fadeDuration={0}
          onMapReady={handleMapAvailable}
          onMapStyleData={handleMapAvailable}
        >
          <MapLayerOrchestrator map={mapObj} showDeltaStations={false}>
            <SalinityVector155Layer map={mapObj} playing={isAnimationPlaying} intervalMs={100} />
          </MapLayerOrchestrator>
        </BaseMap>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 21,
          pointerEvents: 'none',
          background: {
            xs: 'linear-gradient(180deg, rgba(16,22,24,0.04) 0%, rgba(16,22,24,0.18) 36%, rgba(37,52,57,0.84) 100%)',
            md: 'radial-gradient(ellipse at 22% 76%, rgba(37,52,57,0.88) 0%, rgba(37,52,57,0.64) 12%, rgba(37,52,57,0.18) 33%, rgba(37,52,57,0) 58%)',
          },
        }}
      />

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 0.8, ease: 'easeOut' },
          y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: theme.spacing(theme.jtSpacing.section.sm),
          display: 'flex',
          justifyContent: 'center',
          zIndex: 23,
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            gap: theme.jtSpacing.component.xs,
            color: 'common.white',
            textShadow: `0 1px 8px ${theme.palette.translucent.textShadow}`,
          }}
        >
          <KeyboardDoubleArrowDownRoundedIcon sx={{ typography: 'h3' }} />
          <Typography variant="button" component="span">
            Scroll
          </Typography>
        </Box>
      </motion.div>

      <Box
        sx={{
          position: 'absolute',
          left: 'var(--home-rail-inset)',
          right: { xs: theme.spacing(3), md: 'auto' },
          top: '65%',
          bottom: 0,
          minHeight: { xs: '58%', sm: '49%', md: '43%' },
          zIndex: 24,
          pointerEvents: 'auto',
          color: 'common.white',
          width: {
            xs: 'auto',
            md: 'calc(100vw - 8rem)',
            lg: 'min(calc(100vw - 12rem), 76rem)',
          },
          pl: { xs: theme.jtSpacing.component.md, md: theme.jtSpacing.component.lg },
          borderLeft: '2px solid',
          borderColor: 'common.white',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '30rem', sm: '100%', md: '100%', lg: '76rem' },
            mx: { xs: 'auto', sm: 0 },
            paddingTop: { xs: theme.jtSpacing.component.sm, md: theme.jtSpacing.component.md },
          }}
        >
          <Typography
            variant="logoHero"
            component="h1"
            sx={{
              textShadow: `0 2px 30px ${theme.palette.translucent.textShadow}`,
              textWrap: 'balance',
            }}
          >
            <Box component="span" sx={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {HERO.titleLine1}
            </Box>
            <br />
            {HERO.titleLine2}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{
              mt: { xs: theme.jtSpacing.component.sm, md: theme.jtSpacing.component.md },
              mb: 0,
              maxWidth: theme.jtSpacing.paragraphMaxWidth.default,
              textShadow: `0 1px 12px ${theme.palette.translucent.textShadow}`,
              hyphens: 'none',
              overflowWrap: 'normal',
              wordBreak: 'normal',
              textWrap: 'balance',
            }}
          >
            {HERO.lede}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
