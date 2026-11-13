import { useEffect, useState } from 'react'
import { overviewNavigation, type OverviewSectionId } from '@/content/modeling'

/** The rail's active section: the last one to have reached the reading line, in either scroll direction. */
export default function useActiveSection() {
  const [activeSection, setActiveSection] = useState<OverviewSectionId>('how-modeled')
  useEffect(() => {
    const update = () => {
      const readingLine = window.innerHeight * 0.3
      let current: OverviewSectionId = overviewNavigation[0].id
      for (const { id } of overviewNavigation) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top <= readingLine) current = id
      }
      setActiveSection(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return [activeSection, setActiveSection] as const
}
