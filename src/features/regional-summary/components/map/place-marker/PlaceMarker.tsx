import { useRef, useState } from 'react'
import type { SvgIconComponent } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { palette } from '../../../../../theme/muiTheme'
import PlaceExploreScreen from './PlaceExploreScreen'
import PlacePopover from './PlacePopover'

// Debug sizing: fixed CSS pixels keep the marker the same size at every map zoom.
const MARKER_SCALE = 2
const MARKER_WIDTH = 27 * MARKER_SCALE
const MARKER_HEIGHT = 37 * MARKER_SCALE

export interface PlaceMarkerProps {
  color?: string
  description?: string
  placeName: string
  icon: SvgIconComponent
  takeaway?: string
}

function PlaceMarker({
  color = palette.brand.primaryPink,
  description,
  placeName,
  icon: Icon,
  takeaway,
}: PlaceMarkerProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isLabelVisible, setIsLabelVisible] = useState(false)
  const [isExploreOpen, setIsExploreOpen] = useState(false)
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null)
  const markerAnchorRef = useRef<HTMLDivElement>(null)

  const openPopover = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setPopoverAnchor(markerAnchorRef.current)
  }

  return (
    <>
      <motion.div
      aria-label={placeName}
      aria-haspopup="dialog"
      aria-expanded={Boolean(popoverAnchor)}
      onBlur={() => setIsLabelVisible(false)}
      onClick={openPopover}
      onFocus={() => setIsLabelVisible(true)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setPopoverAnchor(markerAnchorRef.current)
        }
      }}
      onMouseEnter={() => setIsLabelVisible(true)}
      onMouseLeave={() => setIsLabelVisible(false)}
      role="button"
      tabIndex={0}
      style={{
        alignItems: 'center',
        display: 'flex',
        outline: 'none',
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
    >
      <motion.div
        ref={markerAnchorRef}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.45, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 20,
          mass: 0.75,
        }}
        style={{
          flex: '0 0 auto',
          height: MARKER_HEIGHT,
          position: 'relative',
          transformOrigin: '50% 100%',
          width: MARKER_WIDTH,
          zIndex: 1,
        }}
      >
        <Box
          aria-hidden="true"
          component="svg"
          viewBox="0 0 27 37"
          sx={{ display: 'block', height: MARKER_HEIGHT, pointerEvents: 'none', width: MARKER_WIDTH }}
        >
          <path
            d="M11.5 2C5.776 2 2 6.583 2 12.235c0 2.622 1.727 6.824 2.591 8.53C5.455 22.47 10.636 31 11.5 31s6.045-8.53 6.909-10.235C19.273 19.059 21 14.857 21 12.235 21 6.583 17.224 2 11.5 2Z"
            fill={color}
            style={{
              filter: `drop-shadow(2px 2px 2px ${palette.translucent.textShadow})`,
            }}
          />
          <circle cx="11.5" cy="11.5" fill={palette.common.white} r="7.5" />
        </Box>
        <Icon
          aria-hidden="true"
          sx={{
            color,
            fontSize: 24,
            left: 11,
            position: 'absolute',
            top: 11,
          }}
        />
      </motion.div>

      <AnimatePresence initial={false}>
        {isLabelVisible && (
          <motion.div
            key="place-label"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { clipPath: 'inset(0 100% 0 0)', opacity: 0, x: -10 }
            }
            animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1, x: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { clipPath: 'inset(0 100% 0 0)', opacity: 0, x: -10 }
            }
            transition={{ duration: prefersReducedMotion ? 0.12 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginLeft: -4, marginTop: -26 }}
          >
            <Typography
              component="span"
                sx={{
                  backgroundColor: color,
                  boxShadow: `2px 2px 4px ${palette.translucent.textShadow}`,
                  color: 'white',
                  display: 'block',
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  lineHeight: 1,
                  padding: '5px 7px',
                  whiteSpace: 'nowrap',
              }}
            >
              {placeName}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

      </motion.div>

      <PlacePopover
        anchorEl={popoverAnchor}
        color={color}
        description={description ?? `${placeName} is a featured location in the region.`}
        icon={Icon}
        onClose={() => setPopoverAnchor(null)}
        onExplore={() => {
          setPopoverAnchor(null)
          setIsExploreOpen(true)
        }}
        open={Boolean(popoverAnchor)}
        placeName={placeName}
        takeaway={takeaway ?? 'Present findings from the scenario comparison view and connect them to this location.'}
      />

      <PlaceExploreScreen
        color={color}
        icon={Icon}
        onClose={() => setIsExploreOpen(false)}
        open={isExploreOpen}
        placeName={placeName}
      />
    </>
  )
}

export default PlaceMarker

