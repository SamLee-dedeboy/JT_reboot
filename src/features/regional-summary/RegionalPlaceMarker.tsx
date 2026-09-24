import PlaceIcon from '@mui/icons-material/Place'
import { Box, Typography } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'
import { regionalSummarySizing, regionalSummaryTypography } from './regionalSummaryStyles'

interface RegionalPlaceMarkerProps {
  color: string
  secondaryColor?: string
  index: number
  name: string
  selected: boolean
  onSelect: () => void
}

export default function RegionalPlaceMarker({
  color,
  secondaryColor,
  index,
  name,
  selected,
  onSelect,
}: RegionalPlaceMarkerProps) {
  const reduceMotion = useReducedMotion()
  const gradientId = useId().replaceAll(':', '')

  return (
    <Box
      component={motion.button}
      type="button"
      aria-label={name}
      aria-pressed={selected}
      onClick={(event) => {
        event.stopPropagation()
        onSelect()
      }}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.72, y: 14 }}
      animate={{ opacity: 1, scale: selected ? 1.12 : 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 360, damping: 24, delay: index * 0.035 }
      }
      sx={{
        appearance: 'none',
        alignItems: 'flex-end',
        bgcolor: 'transparent',
        border: 0,
        color: 'common.white',
        cursor: 'pointer',
        display: 'flex',
        minHeight: regionalSummarySizing.touchTarget,
        minWidth: regionalSummarySizing.touchTarget,
        p: 0,
        transformOrigin: '24px 100%',
        userSelect: 'none',
        '&:focus-visible': {
          outline: '3px solid',
          outlineColor: 'common.white',
          outlineOffset: 4,
          borderRadius: 1,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: regionalSummarySizing.markerPinWidth,
          height: regionalSummarySizing.markerPinHeight,
          flex: '0 0 auto',
          zIndex: 1,
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 27 37"
          aria-hidden="true"
          sx={{
            display: 'block',
            width: regionalSummarySizing.markerPinWidth,
            height: regionalSummarySizing.markerPinHeight,
          }}
        >
          {secondaryColor ? (
            <defs>
              <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor={color} />
                <stop offset="50%" stopColor={color} />
                <stop offset="50%" stopColor={secondaryColor} />
                <stop offset="100%" stopColor={secondaryColor} />
              </linearGradient>
            </defs>
          ) : null}
          <path
            d="M11.5 2C5.776 2 2 6.583 2 12.235c0 2.622 1.727 6.824 2.591 8.53C5.455 22.47 10.636 31 11.5 31s6.045-8.53 6.909-10.235C19.273 19.059 21 14.857 21 12.235 21 6.583 17.224 2 11.5 2Z"
            fill={secondaryColor ? `url(#${gradientId})` : color}
            stroke={selected ? '#f2f0ef' : color}
            strokeWidth={selected ? 1.5 : 0}
          />
          <circle cx="11.5" cy="11.5" fill="#f2f0ef" r="7.5" />
        </Box>
        <PlaceIcon
          aria-hidden="true"
          sx={{
            color,
            fontSize: regionalSummarySizing.markerIconSize,
            position: 'absolute',
            left: '21%',
            top: '17%',
          }}
        />
      </Box>
      <Typography
        component="span"
        sx={{
          ...regionalSummaryTypography.markerLabel,
          bgcolor: 'base.900',
          backgroundImage: secondaryColor
            ? `linear-gradient(90deg, ${color} 0 50%, ${secondaryColor} 50% 100%)`
            : `linear-gradient(${color}, ${color})`,
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
          backgroundSize: `100% ${regionalSummarySizing.markerAccent}`,
          boxShadow: selected
            ? `0 0 0 3px #f2f0ef, 0 0 24px ${color}`
            : '2px 2px 5px rgba(16,22,24,0.6)',
          color: 'common.white',
          display: 'block',
          ml: -0.5,
          mb: 2.5,
          px: 'clamp(9px, 0.55vw, 20px)',
          pt: 'clamp(6px, 0.4vw, 14px)',
          pb: 'clamp(8px, 0.5vw, 18px)',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </Typography>
    </Box>
  )
}
