import { useEffect, useState } from 'react'

/** The rail's active section: the one most in view around the reading line. */
export default function useActiveSection<Id extends string>(ids: readonly Id[], first: Id) {
  const [activeSection, setActiveSection] = useState<Id>(first)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(({ isIntersecting }) => isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id as Id)
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.2, 0.5] },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [ids])

  return [activeSection, setActiveSection] as const
}
