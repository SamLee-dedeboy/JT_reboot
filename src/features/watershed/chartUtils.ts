// Helpers shared by the upstream restoration charts, which draw at their container's
// pixel width so labels keep the site's type sizes.
import { useEffect, useState } from 'react'

/** 1.5M, -842.4K, 630, 6.4: one decimal above a thousand, whole tens, small values to 0.1. */
export function compactNumber(value: number) {
  const absolute = Math.abs(value)
  if (absolute >= 1_000_000)
    return `${(value / 1_000_000).toFixed(absolute % 1_000_000 === 0 ? 0 : 1)}M`
  if (absolute >= 1_000) return `${(value / 1_000).toFixed(absolute % 1_000 === 0 ? 0 : 1)}K`
  if (absolute >= 10 || Number.isInteger(value)) return Math.round(value).toLocaleString('en-US')
  return value.toFixed(1)
}

/** Tracks an element's width; pass the returned setter as its `ref`. */
export function useElementWidth(initial: number) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [width, setWidth] = useState(initial)

  useEffect(() => {
    if (!element) return undefined
    const update = () => setWidth(element.getBoundingClientRect().width)
    update()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])

  return [setElement, width] as const
}

/** Below this width a chart keeps its shape and scrolls sideways. */
export const MIN_CHART_WIDTH = 600
/** Ticks and labels on the loss side of zero. */
export const LOSS_COLOR = '#b9685e'
