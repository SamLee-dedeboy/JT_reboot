import { useEffect, useRef, useState } from 'react'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import type { SvgIconComponent } from '@mui/icons-material'
import { Box, Button, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { createPortal } from 'react-dom'
import Eyebrow from '../../../../../components/common/Eyebrow'
import { palette } from '../../../../../theme/muiTheme'
import RegionScenarioView from './RegionScenarioView'

const SCENARIO_REGIONS = new Set(['Central Delta', 'San Pablo Bay', 'Suisun Bay'])

interface PlaceExploreScreenProps {
  color?: string
  icon: SvgIconComponent
  onClose: () => void
  open: boolean
  placeName: string
}

function PlaceExploreScreen({
  color = palette.brand.primaryPink,
  icon: Icon,
  onClose,
  open,
  placeName,
}: PlaceExploreScreenProps) {
  const prefersReducedMotion = useReducedMotion()
  const backButtonRef = useRef<HTMLButtonElement>(null)
  const [showScenarioView, setShowScenarioView] = useState(false)

  useEffect(() => {
    if (!open) setShowScenarioView(false)
  }, [open])

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    backButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [onClose, open])

  if (typeof document === 'undefined') return null

  const duration = prefersReducedMotion ? 0 : 0.55

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          aria-label={`${placeName} exploration screen`}
          aria-modal="true"
          role="dialog"
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { clipPath: 'inset(0 0 0 100%)' }
          }
          animate={{ clipPath: 'inset(0 0 0 0%)', opacity: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { clipPath: 'inset(0 100% 0 0)' }
          }
          transition={{ duration, ease: [0.76, 0, 0.24, 1] }}
          style={{
            backgroundColor: palette.base[800],
            inset: 0,
            overflow: 'hidden auto',
            position: 'fixed',
            zIndex: 1600,
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              backgroundImage: `linear-gradient(${palette.base[700]} 1px, transparent 1px), linear-gradient(90deg, ${palette.base[700]} 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              inset: 0,
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,.55), transparent 72%)',
              opacity: 0.34,
              pointerEvents: 'none',
              position: 'absolute',
            }}
          />

          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              initial={{ x: '-8vw' }}
              animate={{ x: '108vw' }}
              transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                bottom: 0,
                opacity: 0.85,
                position: 'absolute',
                top: 0,
                width: 90,
              }}
            />
          )}

          <AnimatePresence initial={false} mode="wait">
          {showScenarioView ? (
            <RegionScenarioView
              key={`${placeName}-scenarios`}
              onBack={() => {
                setShowScenarioView(false)
                requestAnimationFrame(() => backButtonRef.current?.focus())
              }}
              regionName={placeName}
            />
          ) : (
          <Box
            key="location-briefing"
            component={motion.div}
            initial={prefersReducedMotion ? false : { clipPath: 'inset(0 0 0 100%)', opacity: 1 }}
            animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { clipPath: 'inset(0 100% 0 0)', opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.58, ease: [0.76, 0, 0.24, 1] }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100dvh',
              mx: 'auto',
              p: { xs: 2.5, sm: 4, md: 6 },
              position: 'relative',
              width: 'min(1440px, 100%)',
            }}
          >
            <Stack
              direction="row"
              sx={{ alignItems: 'center', justifyContent: 'space-between', mb: { xs: 6, md: 10 } }}
            >
              <Button
                ref={backButtonRef}
                onClick={onClose}
                startIcon={<ArrowBackRoundedIcon />}
                variant="outlined"
                sx={{
                  borderColor: color,
                  color,
                  fontWeight: (theme) => theme.typography.fontWeightBold,
                  '&:hover': { backgroundColor: palette.translucent.primaryPink, borderColor: color },
                }}
              >
                Back to map
              </Button>
              <Eyebrow sx={{ color: palette.base[100] }}>Location select</Eyebrow>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                flex: 1,
                gap: { xs: 5, md: 8 },
                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.35fr) minmax(320px, .65fr)' },
              }}
            >
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: -42 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.34, duration: 0.5 }}
              >
                <Stack spacing={3} sx={{ alignItems: 'flex-start', maxWidth: 820 }}>
                  <Box
                    sx={{
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      border: `7px solid ${color}`,
                      borderRadius: '50%',
                      color,
                      display: 'flex',
                      height: { xs: 84, md: 108 },
                      justifyContent: 'center',
                      width: { xs: 84, md: 108 },
                    }}
                  >
                    <Icon sx={{ fontSize: { xs: 52, md: 68 } }} />
                  </Box>
                  <Box>
                    <Eyebrow sx={{ color, mb: 1.5 }}>Location briefing</Eyebrow>
                    <Typography
                      component="h1"
                      sx={{
                        color: palette.common.white,
                        fontSize: 'clamp(3rem, 8vw, 7.5rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.035em',
                        lineHeight: 0.88,
                        textTransform: 'uppercase',
                      }}
                    >
                      {placeName}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{ color: palette.base[100], fontSize: { xs: 18, md: 23 }, lineHeight: 1.45, maxWidth: 680 }}
                  >
                    Explore the stories, scenarios, and regional connections that shape this place.
                  </Typography>
                </Stack>
              </motion.div>

              <Stack spacing={2.5} sx={{ justifyContent: 'center' }}>
                {[
                  ['Place summary', 'Review place-based findings and understand how this location connects to the wider region.'],
                  ['Primary objective', 'Compare scenarios, discover key signals, and identify the choices that matter here.'],
                ].map(([label, copy], index) => (
                  <Box
                    key={label}
                    component={motion.div}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 38 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.42 + index * 0.1, duration: 0.45 }}
                    sx={{
                      backgroundColor: 'rgba(20, 29, 31, 0.82)',
                      borderLeft: `4px solid ${color}`,
                      boxShadow: `0 16px 46px ${palette.translucent.textShadow}`,
                      p: { xs: 2.5, md: 3.5 },
                    }}
                  >
                    <Eyebrow sx={{ color, mb: 1 }}>{label}</Eyebrow>
                    <Typography sx={{ color: palette.base[50], fontSize: 17, lineHeight: 1.5 }}>
                      {copy}
                    </Typography>
                  </Box>
                ))}

                <Button
                  endIcon={<PlayArrowRoundedIcon />}
                  onClick={() => {
                    if (SCENARIO_REGIONS.has(placeName)) setShowScenarioView(true)
                  }}
                  variant="contained"
                  sx={{
                    alignSelf: 'flex-start',
                    backgroundColor: color,
                    boxShadow: `0 10px 34px ${palette.translucent.primaryPink}`,
                    color: palette.base[900],
                    fontWeight: (theme) => theme.typography.fontWeightBold,
                    minHeight: 54,
                    px: 3,
                    '&:hover': { backgroundColor: color, filter: 'brightness(1.12)' },
                  }}
                >
                  Begin exploration
                </Button>
              </Stack>
            </Box>
          </Box>
          )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default PlaceExploreScreen

