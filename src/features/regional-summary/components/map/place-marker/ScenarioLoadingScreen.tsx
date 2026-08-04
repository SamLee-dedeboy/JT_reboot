import { Box, Stack, Typography } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import { palette } from '../../../../../theme/muiTheme'

interface ScenarioLoadingScreenProps {
  regionName: string
}

function ScenarioLoadingScreen({ regionName }: ScenarioLoadingScreenProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <Box
      aria-label={`Loading ${regionName} scenarios`}
      aria-live="polite"
      role="status"
      sx={{
        backgroundColor: palette.base[800],
        display: 'grid',
        minHeight: '100dvh',
        overflow: 'hidden',
        placeItems: 'center',
        position: 'relative',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          backgroundImage: `linear-gradient(${palette.translucent.primaryPink} 1px, transparent 1px), linear-gradient(90deg, ${palette.translucent.primaryPink} 1px, transparent 1px)`,
          backgroundSize: '42px 42px',
          inset: 0,
          maskImage: 'radial-gradient(circle at center, black, transparent 72%)',
          opacity: 0.48,
          position: 'absolute',
        }}
      />

      <Stack
        spacing={3}
        sx={{
          alignItems: 'center',
          maxWidth: 720,
          px: 3,
          position: 'relative',
          width: '100%',
          zIndex: 1,
        }}
      >
        <Box sx={{ height: 180, position: 'relative', width: 280 }}>
          {[0, 1, 2].map((ripple) => (
            <Box
              aria-hidden="true"
              component={motion.div}
              key={ripple}
              animate={
                prefersReducedMotion
                  ? undefined
                  : { opacity: [0, 0.5, 0], scale: [0.55, 1.2] }
              }
              transition={{ delay: ripple * 0.48, duration: 1.5, ease: 'easeOut', repeat: Infinity }}
              sx={{
                border: `4px solid ${palette.brand.primaryPink}`,
                borderRadius: '50%',
                height: 88,
                left: 30,
                opacity: prefersReducedMotion ? 0.35 : undefined,
                position: 'absolute',
                top: 46,
                width: 220,
              }}
            />
          ))}
        </Box>

        <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography
            component="h1"
            sx={{
              color: palette.common.white,
              fontFamily: '"Hammersmith One", sans-serif',
              fontSize: 'clamp(1.7rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Setting up {regionName}...
          </Typography>
        </Stack>

        <Box sx={{ border: `1px solid ${palette.brand.primaryPink}`, p: '7px 12px', position: 'relative' }}>
          <Typography
            component={motion.p}
            animate={prefersReducedMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            sx={{
              color: palette.brand.primaryPink,
              fontFamily: 'monospace',
              fontSize: '0.76rem',
              letterSpacing: '0.16em',
              m: 0,
              textTransform: 'uppercase',
            }}
          >
            Loading data...
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

export default ScenarioLoadingScreen

