// Animation wrapper that fades and lifts content into place when it enters
// the viewport while respecting reduced-motion preferences.
import { Box } from '@mui/material'
import type { BoxProps } from '@mui/material'
import { motion, useReducedMotion, type MotionProps } from 'framer-motion'
import type { ComponentType, PropsWithChildren } from 'react'

type MotionBoxProps = Omit<BoxProps, keyof MotionProps> & MotionProps
const MotionBox = motion.create(Box) as ComponentType<MotionBoxProps>

interface ScrollRevealProps extends PropsWithChildren<Omit<BoxProps, keyof MotionProps>> {
  delay?: number
}

export default function ScrollReveal({ delay = 0, sx, children, ...rest }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <MotionBox
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      sx={sx}
      {...rest}
    >
      {children}
    </MotionBox>
  )
}
