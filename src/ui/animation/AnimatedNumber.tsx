import { Box, type BoxProps } from '@mui/material'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedNumberProps extends Omit<BoxProps, 'children'> {
  value: number
  duration?: number
  initialValue?: number
  formatValue?: (value: number) => string
}

const defaultFormatValue = (latest: number) => Math.round(latest).toLocaleString()

export default function AnimatedNumber({
  value,
  duration = 2.4,
  initialValue = 0,
  formatValue = defaultFormatValue,
  sx,
  ...props
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion()
  const motionValue = useMotionValue(initialValue)
  const [displayValue, setDisplayValue] = useState(formatValue(initialValue))

  useMotionValueEvent(motionValue, 'change', (latest) => {
    setDisplayValue(formatValue(latest))
  })

  useEffect(() => {
    if (reduceMotion) {
      motionValue.set(value)
      return
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    })

    return controls.stop
  }, [duration, formatValue, motionValue, reduceMotion, value])

  return (
    <Box
      component={motion.span}
      aria-live="polite"
      sx={{
        display: 'inline-block',
        typography: 'displayNumber',
        color: 'common.white',
        ...sx,
      }}
      {...props}
    >
      {reduceMotion ? formatValue(value) : displayValue}
    </Box>
  )
}
