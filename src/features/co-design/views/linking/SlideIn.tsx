// Replaces Svelte's `in:slide` (duration 400, cubicOut, axis 'y') used by
// ScenarioOverview and GraphNodeTooltip. Like Svelte, it measures the element's
// computed height, vertical padding/margin/border on mount and animates each
// from 0, with `overflow: hidden; min-height: 0` while running, then hands the
// element back to its stylesheet.
import { animate } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cubicOut } from './transitions'

const DURATION = 0.4
// Svelte's slide sets opacity to min(t * 20, 1): fully opaque once the eased
// progress reaches 0.05, i.e. after ~1.7% of the duration under cubicOut.
const OPACITY_DURATION = DURATION * (1 - Math.cbrt(0.95))

const ANIMATED = [
  'height',
  'padding-top',
  'padding-bottom',
  'margin-top',
  'margin-bottom',
  'border-top-width',
  'border-bottom-width',
] as const

interface SlideInProps {
  // Evaluated on mount only: false renders without an intro (Svelte's local
  // transitions don't play when an ancestor block is created).
  play?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export default function SlideIn({ play = true, className, style, children }: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [playOnMount] = useState(play)

  useLayoutEffect(() => {
    if (!playOnMount) return
    const el = ref.current!
    const cs = getComputedStyle(el)
    const targets = ANIMATED.map((prop) => parseFloat(cs.getPropertyValue(prop)) || 0)
    const opacity = +cs.opacity
    const clear = () => {
      for (const prop of [...ANIMATED, 'overflow', 'min-height', 'opacity']) {
        el.style.removeProperty(prop)
      }
    }
    el.style.overflow = 'hidden'
    el.style.minHeight = '0'
    // Apply the t = 0 frame before paint; framer starts on the next frame.
    for (const prop of ANIMATED) el.style.setProperty(prop, '0px')
    el.style.opacity = '0'
    const keyframes = Object.fromEntries(
      ANIMATED.map((prop, i) => [
        prop.replace(/-(\w)/g, (_, c: string) => c.toUpperCase()),
        [0, targets[i]],
      ]),
    )
    const size = animate(el, keyframes, { duration: DURATION, ease: cubicOut })
    const fade = animate(
      el,
      { opacity: [0, opacity] },
      { duration: OPACITY_DURATION, ease: 'linear' },
    )
    let active = true
    size.then(() => {
      if (active) clear()
    })
    return () => {
      active = false
      size.stop()
      fade.stop()
      clear()
    }
  }, [playOnMount])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
