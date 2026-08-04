import { Box, CircularProgress, Typography } from '@mui/material'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { palette } from '../../../../theme/muiTheme'

interface MapLoaderProps {
  isLoaded: boolean
  onExitComplete: () => void
}

function MapLoader({ isLoaded, onExitComplete }: MapLoaderProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false} onExitComplete={onExitComplete}>
      {!isLoaded && (
        <Box
          key="map-loader"
          component={motion.div}
          role="status"
          aria-live="polite"
          aria-label="Loading map"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
          sx={{
            alignItems: 'center',
            backgroundColor: palette.base[800],
            display: 'flex',
            inset: 0,
            flexDirection: 'column',
            gap: 1.5,
            justifyContent: 'center',
            pointerEvents: 'auto',
            position: 'absolute',
            zIndex: 10,
          }}
        >
          <CircularProgress color="primary" size={36} thickness={4} />
          <Typography
            component="span"
            sx={{
              color: palette.common.white,
              fontSize: 14,
              fontWeight: (theme) => theme.typography.fontWeightBold,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Loading map
          </Typography>
        </Box>
      )}
    </AnimatePresence>
  )
}

export default MapLoader
