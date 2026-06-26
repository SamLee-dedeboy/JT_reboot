import { useCallback, useRef, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import { useMediaQuery, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { Box, Typography } from '@mui/material'
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded'
import Eyebrow from '../../common/Eyebrow'
import { HERO } from '../../../data/homeContent'
import BaseMap from '../BaseMap'
import MapLayerOrchestrator from '../MapLayerOrchestrator'
import { HERO_MAP_STYLE, SUISUN_BAY_CENTER } from '../mapCameraView'

const mapContainerStyle = { position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' } as const
const heroLede = 'Envisioning equitable futures for water management in the Sacramento-San Joaquin Delta amid drought, salinity, and'

const salinityLayerIds = [
  'salinity-mockup-june-3kgk8e',
  'salinity-mockup-september-dh1h3e',
  'salinity-mockup-october-v2-zi-vxywcj',
  'salinity-mockup-april-0pn2k2',
]

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

const salinityLayerCycle = {
  layerIds: salinityLayerIds,
  crossfadeMs: 1400,
  cycleMs: 2800,
}

export default function HeroMap() {
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'))
  const [mapObj, setMapObj] = useState<MapboxMap | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
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
    <Box component="section" id="top" sx={{ position: 'relative', width: '100%', height: '90vh' }}>
      <Box sx={mapContainerStyle}>
        <BaseMap
          initialViewState={heroInitialViewState}
          mapStyleUrl={HERO_MAP_STYLE}
          interactive={false}
          fadeDuration={0}
          onMapReady={handleMapAvailable}
          onMapStyleData={handleMapAvailable}
        >
          <MapLayerOrchestrator
            map={mapObj}
            layerCycle={salinityLayerCycle}
            showDeltaStations={false}
          />
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
          bottom: theme.spacing(theme.jtSpacing.section.md),
          display: 'flex',
          justifyContent: 'center',
          zIndex: 23,
          pointerEvents: 'none',
        }}
      >
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', gap: theme.jtSpacing.component.xs, color: 'common.white', textShadow: `0 1px 8px ${theme.palette.translucent.textShadow}` }}>
            <KeyboardDoubleArrowDownRoundedIcon sx={{ fontSize: { xs: theme.typography.h4.fontSize, md: theme.typography.h3.fontSize } }} />
            <Typography variant="button" component="span" sx={{ fontSize: { xs: theme.typography.button.fontSize, md: theme.typography.body1.fontSize }, letterSpacing: '0.18em' }}>
            Scroll
          </Typography>
        </Box>
      </motion.div>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 0, sm: theme.spacing(1), md: theme.spacing(8), lg: theme.spacing(10) },
          right: { xs: 0, sm: 'auto' },
          bottom: { xs: theme.spacing(11), sm: theme.spacing(12), md: theme.spacing(14), lg: theme.spacing(15) },
          zIndex: 24,
          pointerEvents: 'auto',
          color: 'common.white',
          width: {
            xs: '100%',
            sm: 'calc(100vw - 1rem)',
            md: 'calc(100vw - 8rem)',
            lg: 'min(calc(100vw - 12rem), 76rem)',
          },
          px: { xs: theme.jtSpacing.gap.md, sm: theme.jtSpacing.gap.md, md: theme.jtSpacing.gap.lg },
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '30rem', sm: '100%', md: '100%', lg: '76rem' },
            mx: { xs: 'auto', sm: 0 },
            pl: { xs: 0, md: theme.jtSpacing.component.md },
            borderLeft: { xs: 0, md: '3px solid' },
            borderColor: { md: 'primary.main' },
          }}
        >
          <Eyebrow sx={{ mb: { xs: 1, md: theme.jtSpacing.component.sm }, textShadow: `0 1px 8px ${theme.palette.translucent.textShadow}` }}>
            {HERO.eyebrow}
          </Eyebrow>
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
              maxWidth: { xs: '100%', sm: '100%', md: '100%' },
              fontSize: 'clamp(1.2rem, 1.4vw, 1.7rem)', //h4
              lineHeight: { xs: 1.35, md: 1.6 },
              textShadow: `0 1px 12px ${theme.palette.translucent.textShadow}`,
              hyphens: 'none',
              overflowWrap: 'normal',
              wordBreak: 'normal',
              textWrap: 'balance',
            }}
          >
            {heroLede}{' '}
            <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
              sea-level rise.
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
