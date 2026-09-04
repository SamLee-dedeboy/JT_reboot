import { useCallback, useState } from 'react'
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

export default function HeroMap() {
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'))
  const [mapObj, setMapObj] = useState<MapboxMap | null>(null)
  const [firstLabelLayerId, setFirstLabelLayerId] = useState<string>()
  const heroBreakpoint = getHeroBreakpoint(isXlUp, isLgUp, isMdUp, isSmUp)
  const [heroInitialViewState] = useState(() => ({
    ...SUISUN_BAY_CENTER,
    zoom: heroZoomByBreakpoint[heroBreakpoint],
  }))
  const [heroLedeLocation, heroLedeConditions] = HERO.lede.split(' amid ')

  const handleMapAvailable = useCallback((map: MapboxMap) => {
    setMapObj(map)
    const labelLayerId = map.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id
    setFirstLabelLayerId((current) => (current === labelLayerId ? current : labelLayerId))
  }, [])

  return (
    <Box
      component="section"
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
            <SalinityVector155Layer map={mapObj} intervalMs={100} beforeId={firstLabelLayerId} />
          </MapLayerOrchestrator>
        </BaseMap>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: 'var(--home-rail-inset)',
          right: { xs: theme.spacing(3), md: 'auto' },
          top: 'auto',
          bottom: theme.spacing(12),
          minHeight: 'max-content',
          zIndex: 24,
          pointerEvents: 'auto',
          color: 'common.white',
          width: 'max-content',
          pl: { xs: theme.jtSpacing.component.md, md: theme.jtSpacing.component.lg },
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            maxWidth: '76ch',
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
              maxWidth: { xs: theme.jtSpacing.paragraphMaxWidth.default, md: 'none' },
              textShadow: `0 1px 12px ${theme.palette.translucent.textShadow}`,
              hyphens: 'none',
              overflowWrap: 'normal',
              wordBreak: 'normal',
            }}
          >
            <Box component="span" sx={{ display: 'block', whiteSpace: { md: 'nowrap' } }}>
              {heroLedeLocation}
            </Box>
            <Box component="span" sx={{ display: 'block' }}>
              amid {heroLedeConditions}
            </Box>
          </Typography>
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { duration: 0.8, ease: 'easeOut' },
              y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              width: '100%',
              margin: '0 auto',
              paddingTop: theme.spacing(theme.jtSpacing.component.lg),
              display: isMdUp ? 'flex' : 'none',
              justifyContent: 'center',
              transform: `translateX(-${theme.spacing(theme.jtSpacing.section.md)})`,
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
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
        </Box>
      </Box>
    </Box>
  )
}
