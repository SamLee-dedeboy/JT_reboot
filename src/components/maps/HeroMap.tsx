import Map from 'react-map-gl/mapbox'
import { useEffect, useRef, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import { useTheme } from '@mui/material'
import 'mapbox-gl/dist/mapbox-gl.css'
import { motion } from 'framer-motion'
import { Box, Typography } from '@mui/material'
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded'

const mapContainerStyle = { position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' } as const
const mapStyle = { width: '100%', height: '100%' } as const

const cycleLayerIds = [
  'salinity-mockup-june-3kgk8e',
  'salinity-mockup-september-dh1h3e',
  'salinity-mockup-october-3y2x4a',
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
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN
  const [mapObj, setMapObj] = useState<MapboxMap | null>(null)
  const hideTimeoutsRef = useRef<number[]>([])

  useEffect(() => {
    if (!mapObj) return

    let idx = 0
    let intervalId: number | undefined

    const clearHideTimeouts = () => {
      hideTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
      hideTimeoutsRef.current = []
    }

    const setLayerVisibility = (layerId: string, visible: boolean) => {
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

      if (visible) {
        mapObj.setLayoutProperty(layerId, 'visibility', 'visible')

        if (opacityProperty && transitionProperty) {
          mapObj.setPaintProperty(layerId, typedTransitionProperty, {
            duration: 1000,
            delay: 0,
          } as Parameters<MapboxMap['setPaintProperty']>[2])
          mapObj.setPaintProperty(layerId, typedOpacityProperty, 0 as Parameters<MapboxMap['setPaintProperty']>[2])

          window.requestAnimationFrame(() => {
            if (mapObj.getLayer(layerId)) {
              mapObj.setPaintProperty(layerId, typedOpacityProperty, 1 as Parameters<MapboxMap['setPaintProperty']>[2])
            }
          })
        }

        return
      }

      if (opacityProperty && transitionProperty) {
        mapObj.setPaintProperty(layerId, typedTransitionProperty, {
          duration: 1000,
          delay: 0,
        } as Parameters<MapboxMap['setPaintProperty']>[2])
        mapObj.setPaintProperty(layerId, typedOpacityProperty, 0 as Parameters<MapboxMap['setPaintProperty']>[2])

        const timeoutId = window.setTimeout(() => {
          if (mapObj.getLayer(layerId)) {
            mapObj.setLayoutProperty(layerId, 'visibility', 'none')
          }
        }, 1000)

        hideTimeoutsRef.current.push(timeoutId)
        return
      }

      mapObj.setLayoutProperty(layerId, 'visibility', 'none')
    }

    const toggleLayers = (toShow: string[] = [], toHide: string[] = []) => {
      const apply = () => {
        toShow.forEach((id) => setLayerVisibility(id, true))
        toHide.forEach((id) => setLayerVisibility(id, false))
      }

      if (!mapObj.isStyleLoaded?.()) {
        mapObj.once('styledata', apply)
        return
      }

      apply()
    }

    const cycle = () => {
      const idsThatExist = cycleLayerIds.filter((id) => !!mapObj.getLayer(id))
      if (idsThatExist.length === 0) return

      const current = idsThatExist[idx % idsThatExist.length]
      toggleLayers([current], idsThatExist.filter((id) => id !== current))
      idx += 1
    }

    const start = () => {
      clearHideTimeouts()
      cycle()
      intervalId = window.setInterval(cycle, 2000)
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
      clearHideTimeouts()
      mapObj.off('styledata', start)
    }
  }, [mapObj])

  return (
    <Box component="section" sx={{ position: 'relative', width: '100%', height: '90vh' }}>
      <Box sx={mapContainerStyle}>
        <Map
          initialViewState={{
            longitude: -121.95,
            latitude: 38.1,
            zoom: 10,
          }}
          mapStyle="mapbox://styles/justtransition/cmoxeqs5l008b01sx352zdicj"
          mapboxAccessToken={mapboxToken}
          style={mapStyle}
          interactive={false}
          onLoad={(evt) => setMapObj(evt.target as MapboxMap)}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '40vh',
          zIndex: 22,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center bottom, rgba(37, 52, 57, 0.96) 0%, rgba(37, 52, 57, 0.75) 34%, rgba(37, 52, 57, 0.3) 52%, rgba(37, 52, 57, 0) 70%)',
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
          bottom: theme.spacing(theme.jtSpacing.section.lg),
          display: 'flex',
          justifyContent: 'center',
          zIndex: 23,
          pointerEvents: 'none',
        }}
      >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: theme.jtSpacing.component.xs, color: 'common.white', textShadow: '0 1px 8px rgba(0, 0, 0, 0.45)' }}>
            <KeyboardDoubleArrowDownRoundedIcon sx={{ fontSize: { xs: theme.typography.h4.fontSize, md: theme.typography.h3.fontSize } }} />
            <Typography variant="button" component="span" sx={{ fontSize: { xs: theme.typography.button.fontSize, md: theme.typography.body1.fontSize }, letterSpacing: '0.18em' }}>
            Scroll
          </Typography>
        </Box>
      </motion.div>

      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: theme.spacing(20),
          zIndex: 24,
          pointerEvents: 'auto',
          color: 'common.white',
          /* avoid overriding heading font; apply Nunito only to body text below */
          px: { xs: theme.jtSpacing.component.md, md: theme.jtSpacing.component.xl },
          py: { xs: theme.jtSpacing.component.sm, md: theme.jtSpacing.component.md },
          borderRadius: theme.shape.borderRadius,
          maxWidth: { xs: '92%', md: '55%' },
          boxSizing: 'border-box',
          maxHeight: { xs: '45vh', md: '35vh' },
          overflow: 'auto',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}
      >
        <Typography variant="h1">
          Just Transitions in the Delta
        </Typography>
        <Typography
          variant="h4"
          sx={{ mt: theme.jtSpacing.component.xs, textTransform: 'none', fontFamily: '"Nunito Sans", "Helvetica Neue", Arial, sans-serif' }}
        >
          Envisioning adaptation strategies in the Sacramento–San Joaquin Delta under conditions of drought, salinity, and sea-level rise
        </Typography>
      </Box>
    </Box>
  )
}
