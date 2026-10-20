// The live size of an element, so a chart can be drawn at exactly the room it has
// instead of scrolling: the breakout screen never scrolls inside its result card.
import { useCallback, useEffect, useState } from 'react'

export function useElementSize<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const ref = useCallback((element: T | null) => setNode(element), [])
  useEffect(() => {
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize((prev) =>
        Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1
          ? prev
          : { width, height },
      )
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])
  return { ref, ...size }
}
