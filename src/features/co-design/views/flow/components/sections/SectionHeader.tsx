// Ported from JT_dashboard/src/lib/Flow/components/sections/SectionHeader.svelte.
// Only the title (with its shrink-to-fit sizing) was reachable. The category
// curation code (add/remove/submit to POST /curate/category/, which has no
// backend) had no markup calling it and is dropped, along with the unused
// `options` / `category_metadata` props and the getContext("fetchData") lookup.
import { Box } from '@mui/material'
import { useEffect, useRef } from 'react'
import type { tSectionMetadata } from '../../types'

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
    <Box
      sx={(theme) => ({
        position: 'relative',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 0,
        px: 0.5,
        textAlign: 'center',
        userSelect: 'none',
        pointerEvents: 'auto',
        bgcolor: theme.coDesign.flow.sectionHeader.background,
        boxShadow: theme.coDesign.flow.sectionHeader.shadow,
      })}
    >
      {/* The titles are plain text constants ({@html} in the original). */}
      {/* Font size is fitted to the band by the effect above. */}
      <Box
        ref={titleRef}
        sx={(theme) => ({
          typography: 'meta',
          position: 'relative',
          width: '100%',
          height: theme.coDesign.flow.sectionHeader.titleHeight,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 1.6,
          color: theme.coDesign.flow.sectionHeader.text,
        })}
      >
        {section.title}
      </Box>
    </Box>
  )
}
