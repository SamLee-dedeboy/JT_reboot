// Which of a page's sections is in view: the one crossing a band 40–45% down the viewport.
// NavRail and SectionTabs both read it, so a rail and the tabs that replace it on a phone
// always agree on the current section. Before any section reaches the band, the first one.
import { useEffect, useState } from 'react'

export default function useScrollSpy(ids: string[], enabled = true) {
  const [active, setActive] = useState(ids[0] ?? '')
  // A string key, so callers can pass a freshly mapped array on every render.
  const idKey = ids.join('|')

  useEffect(() => {
    if (!enabled) return

    const els = idKey
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const id = visible[0]?.target.id
        if (!id) return
        setActive(id)
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [enabled, idKey])

  return ids.includes(active) ? active : (ids[0] ?? '')
}
