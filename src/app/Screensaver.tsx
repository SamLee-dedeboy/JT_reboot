// Exhibit screensaver: after a stretch with no interaction, the home hero's
// salinity animation takes over the viewport on any route, with no navbar
// or title. A click, tap, key press, or scroll wheel dismisses it; mouse
// movement alone does not, so the attract loop survives a passing nudge.
import { Box, useTheme } from '@mui/material'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'

const HeroSalinityMap = lazy(() => import('../map/instances/HeroSalinityMap'))

/** Seconds without interaction before the screensaver appears. */
export const DEFAULT_SCREENSAVER_IDLE_SECONDS = 120
/** Query parameter that overrides the idle delay in seconds; `0` turns the screensaver off. */
export const SCREENSAVER_QUERY_PARAM = 'screensaver'

const ACTIVITY_EVENTS = [
  'pointerdown',
  'pointermove',
  'keydown',
  'wheel',
  'touchstart',
  'scroll',
] as const
const EXIT_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'wheel'] as const
const FADE_SECONDS = 0.8
/** How long after an exit tap the follow-up click is swallowed so it cannot land on the page. */
const CLICK_GUARD_MS = 600

function readIdleSeconds() {
  const raw = new URLSearchParams(window.location.search).get(SCREENSAVER_QUERY_PARAM)
  if (raw === null) return DEFAULT_SCREENSAVER_IDLE_SECONDS
  const seconds = Number(raw)
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : DEFAULT_SCREENSAVER_IDLE_SECONDS
}

/** Blocks the click that follows the pointerdown which dismissed the screensaver. */
function guardNextClick() {
  const swallow = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()
    cleanup()
  }
  const cleanup = () => {
    window.removeEventListener('click', swallow, true)
    window.clearTimeout(timeout)
  }
  const timeout = window.setTimeout(cleanup, CLICK_GUARD_MS)
  window.addEventListener('click', swallow, true)
}

function useIdleScreensaver(idleSeconds: number) {
  const [active, setActive] = useState(false)

  // Armed while the page is live: any interaction restarts the countdown.
  useEffect(() => {
    if (active || idleSeconds <= 0) return

    let timeout: number | undefined
    const arm = () => {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => setActive(true), idleSeconds * 1000)
    }

    arm()
    for (const type of ACTIVITY_EVENTS) {
      window.addEventListener(type, arm, { capture: true, passive: true })
    }
    return () => {
      window.clearTimeout(timeout)
      for (const type of ACTIVITY_EVENTS) {
        window.removeEventListener(type, arm, { capture: true })
      }
    }
  }, [active, idleSeconds])

  // While showing: the first click, tap, key, or wheel exits and is consumed
  // so it does not also act on whatever sits beneath the overlay.
  useEffect(() => {
    if (!active) return

    const exit = (event: Event) => {
      const isBrowserShortcut =
        event instanceof KeyboardEvent && (event.metaKey || event.ctrlKey || event.altKey)
      if (!isBrowserShortcut && event.cancelable) event.preventDefault()
      event.stopPropagation()
      if (event.type === 'pointerdown' || event.type === 'touchstart') guardNextClick()
      setActive(false)
    }

    for (const type of EXIT_EVENTS) {
      window.addEventListener(type, exit, { capture: true, passive: false })
    }
    return () => {
      for (const type of EXIT_EVENTS) {
        window.removeEventListener(type, exit, { capture: true })
      }
    }
  }, [active])

  return active
}

function ScreensaverScene() {
  // No readiness gate: salinity playback keeps reloading its tiles, so Mapbox's
  // `load` may never fire while the hero map also runs. Like the hero, the map
  // draws progressively over the brand base behind it.
  return (
    <Box sx={{ position: 'absolute', inset: 0 }}>
      <Suspense fallback={null}>
        <HeroSalinityMap />
      </Suspense>
    </Box>
  )
}

export default function Screensaver() {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()
  const [idleSeconds] = useState(readIdleSeconds)
  const active = useIdleScreensaver(idleSeconds)

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="screensaver"
          role="presentation"
          aria-label="Screensaver. Click, tap, or press any key to continue."
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : FADE_SECONDS, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: theme.zIndex.modal,
            backgroundColor: theme.palette.brand.base,
            cursor: 'none',
          }}
        >
          <ScreensaverScene />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
