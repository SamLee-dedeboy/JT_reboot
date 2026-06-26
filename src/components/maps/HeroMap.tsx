// Decorative Mapbox hero map used behind landing-page hero content.
import Map from 'react-map-gl/mapbox'
import { useEffect, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import { useMediaQuery, useTheme } from '@mui/material'
import 'mapbox-gl/dist/mapbox-gl.css'
import { motion } from 'framer-motion'
import { Box, Typography } from '@mui/material'
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded'
import Eyebrow from '../common/Eyebrow'
import { HERO } from '../../data/homeContent'

const mapContainerStyle = { position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' } as const
const mapStyle = { width: '100%', height: '100%' } as const
const suisunBayCenter = {
  longitude: -122.05,
  latitude: 38.08,
}
const heroLede = 'Envisioning equitable futures for water management in the Sacramento-San Joaquin Delta amid drought, salinity, and'

const cycleLayerIds = [
  'salinity-mockup-june-3kgk8e',
  'salinity-mockup-september-dh1h3e',
  'salinity-mockup-october-v2-zi-vxywcj',
  //'salinity-mockup-october-3y2x4a',
  'salinity-mockup-april-0pn2k2',
]

const opacityPropsByLayerType: Record<string, string> = {
  fill: 'fill-opacity',
  line: 'line-opacity',
  circle: 'circle-opacity',
  symbol: 'icon-opacity',
  raster: 'raster-opacity',
  heatmap: 'heatmap-opacity',
  'fill-extrusion': 'fill-extrusion-opacity',
}

const transitionPropsByLayerType: Record<string, string> = {
  fill: 'fill-opacity-transition',
  line: 'line-opacity-transition',
  circle: 'circle-opacity-transition',
  symbol: 'icon-opacity-transition',
  raster: 'raster-opacity-transition',
  heatmap: 'heatmap-opacity-transition',
  'fill-extrusion': 'fill-extrusion-opacity-transition',
}

export default function HeroMap() {
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'))
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN
  const [mapObj, setMapObj] = useState<MapboxMap | null>(null)
  const heroViewState = {
    ...suisunBayCenter,
    zoom: isXlUp ? 10.25 : isLgUp ? 10 : isMdUp ? 9.75 : isSmUp ? 9.45 : 9.15,
  }

  useEffect(() => {
    if (!mapObj) return

    let idx = 0
    let intervalId: number | undefined
    const crossfadeMs = 1400
    const cycleMs = 2800

    const setLayerOpacity = (layerId: string, opacity: number) => {
      const layer = mapObj.getLayer(layerId) as { type?: string } | undefined
      if (!layer) {
        console.warn('No layer', layerId)
        return
      }

      const layerType = layer.type ?? ''
      const opacityProperty = opacityPropsByLayerType[layerType]
      const transitionProperty = transitionPropsByLayerType[layerType]
      const typedOpacityProperty = opacityProperty as Parameters<MapboxMap['setPaintProperty']>[1]
      const typedTransitionProperty = transitionProperty as Parameters<MapboxMap['setPaintProperty']>[1]

      if (!opacityProperty || !transitionProperty) {
        return
      }

      mapObj.setLayoutProperty(layerId, 'visibility', 'visible')
      mapObj.setPaintProperty(layerId, typedTransitionProperty, {
        duration: crossfadeMs,
        delay: 0,
      } as Parameters<MapboxMap['setPaintProperty']>[2])
      mapObj.setPaintProperty(layerId, typedOpacityProperty, opacity as Parameters<MapboxMap['setPaintProperty']>[2])
    }

    const getExistingLayerIds = () => {
      const idsThatExist = cycleLayerIds.filter((id) => !!mapObj.getLayer(id))
      if (idsThatExist.length === 0) {
        console.warn('No salinity animation layers found')
      }

      return idsThatExist
    }

    const start = () => {
      const idsThatExist = getExistingLayerIds()
      if (idsThatExist.length === 0) return

      idsThatExist.forEach((id, layerIdx) => setLayerOpacity(id, layerIdx === 0 ? 1 : 0))

      intervalId = window.setInterval(() => {
        idx = (idx + 1) % idsThatExist.length
        idsThatExist.forEach((id, layerIdx) => setLayerOpacity(id, layerIdx === idx ? 1 : 0))
      }, cycleMs)
    }

    if (!mapObj.isStyleLoaded?.()) {
      mapObj.once('styledata', start)
    } else {
      start()
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId)
      }
      mapObj.off('styledata', start)
    }
  }, [mapObj])

  useEffect(() => {
    if (!mapObj) return

    mapObj.easeTo({
      center: [heroViewState.longitude, heroViewState.latitude],
      zoom: heroViewState.zoom,
      duration: 650,
      essential: true,
    })
  }, [heroViewState.latitude, heroViewState.longitude, heroViewState.zoom, mapObj])

  return (
    <Box component="section" id="top" sx={{ position: 'relative', width: '100%', height: '90vh' }}>
      <Box sx={mapContainerStyle}>
        <Map
          initialViewState={heroViewState}
          mapStyle="mapbox://styles/justtransition/cmqa9drzx000p01rh2s259fpn"
          mapboxAccessToken={mapboxToken}
          style={mapStyle}
          interactive={false}
          onLoad={(evt) => setMapObj(evt.target as MapboxMap)}
        />
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
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', gap: theme.jtSpacing.component.xs, color: 'common.white', textShadow: '0 1px 8px rgba(0, 0, 0, 0.45)' }}>
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
          px: { xs: theme.jtSpacing.component.md, sm: 0 },
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
          <Eyebrow sx={{ mb: { xs: 1, md: theme.jtSpacing.component.sm }, textShadow: '0 1px 8px rgba(16,22,24,0.6)' }}>
            {HERO.eyebrow}
          </Eyebrow>
          <Typography
            variant="logoHero"
            component="h1"
            sx={{
              textShadow: '0 2px 30px rgba(16,22,24,0.52)',
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
              textShadow: '0 1px 12px rgba(16,22,24,0.58)',
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
