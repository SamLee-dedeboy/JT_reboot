// Ported from JT_dashboard/src/lib/Flow/components/sections/SectionHeader.svelte.
// Only the title (with its shrink-to-fit sizing) was reachable. The category
// curation code (add/remove/submit to POST /curate/category/, which has no
// backend) had no markup calling it and is dropped, along with the unused
// `options` / `category_metadata` props and the getContext("fetchData") lookup.
import { useEffect, useRef } from 'react'
import type { tSectionMetadata } from '../../types'
import './SectionHeader.css'

function titleFontSize(title: string) {
  const len = title.replace(/<[^>]+>/g, '').length
  if (len <= 35) return '11pt'
  if (len <= 65) return '10pt'
  if (len <= 75) return '9pt'
  return '7pt'
}

export default function SectionHeader({ section }: { section: tSectionMetadata }) {
  const titleRef = useRef<HTMLDivElement>(null)
  const title_font_size = titleFontSize(section.title)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const measure = () => {
      if (el.clientWidth === 0) return
      el.style.fontSize = title_font_size
      let size = parseFloat(getComputedStyle(el).fontSize)
      while (el.scrollHeight > el.clientHeight && size > 6) {
        size -= 0.5
        el.style.fontSize = size + 'px'
      }
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [section.title, title_font_size])

  return (
    <div className="jtd-SectionHeader header-container section-header pointer-events-auto relative flex text-lg">
      {/* The titles are plain text constants ({@html} in the original). */}
      <div className="section-title relative w-full" ref={titleRef}>
        {section.title}
      </div>
    </div>
  )
}
