// The tablet stand-in for a page's sticky section rail (NavRail is hidden below lg; phones
// get neither, and their sections simply scroll): a strip pinned under the navbar with one numbered tab per section. As the reader
// scrolls, the tab of the section in view fills green (the same scroll spy as the rail) and
// slides into view; tapping a tab scrolls its section up to just below the strip. It looks
// like the repository tabs, so every sticky tab strip on the site reads the same.
import { useLayoutEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { navigation } from '@/theme'
import { focusRing } from './focusRing'
import type { NavRailItem } from './NavRail'
import useScrollSpy from './useScrollSpy'

interface SectionTabsProps {
  /** The page's sections, in order: the same items its rail takes. */
  items: Pick<NavRailItem, 'id' | 'label'>[]
  ariaLabel: string
}

export default function SectionTabs({ items, ariaLabel }: SectionTabsProps) {
  const navRef = useRef<HTMLElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const activeId = useScrollSpy(items.map((item) => item.id))

  // The strip scrolls sideways on a narrow screen: keep the current section's tab in view.
  useLayoutEffect(() => {
    const strip = stripRef.current
    const tab = strip?.querySelector<HTMLElement>('[aria-current="true"]')
    if (!strip || !tab) return
    strip.scrollTo({ left: tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2 })
  }, [activeId])

  const go = (id: string) => {
    const section = document.getElementById(id)
    const nav = navRef.current
    if (!section || !nav) return
    // Land the section just below the strip: the navbar (the strip's own `top`) plus the strip.
    const offset = nav.offsetHeight + parseFloat(getComputedStyle(nav).top || '0')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({
      top: section.getBoundingClientRect().top + window.scrollY - offset + 1,
      // 'instant', not 'auto': the site's global CSS makes 'auto' scroll smoothly.
      behavior: reduceMotion ? 'instant' : 'smooth',
    })
  }

  return (
    <Box
      ref={navRef}
      component="nav"
      aria-label={ariaLabel}
      sx={{
        display: { xs: 'none', sm: 'block' },
        position: 'sticky',
        top: navigation.barHeight,
        zIndex: 90,
        bgcolor: 'base.700',
        borderBottom: 1,
        borderColor: 'border.subtle',
        boxShadow: (theme) => theme.navigation.dropdownShadow,
      }}
    >
      <Box
        ref={stripRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {items.map((item, index) => {
          const active = item.id === activeId
          return (
            <Box
              key={item.id}
              component="button"
              type="button"
              onClick={() => go(item.id)}
              aria-current={active ? 'true' : undefined}
              sx={(theme) => ({
                flex: '1 0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.jtSpacing.gap.sm,
                minHeight: navigation.sectionTabsHeight,
                px: theme.jtSpacing.component.md,
                border: 0,
                cursor: 'pointer',
                color: active ? 'common.black' : 'common.white',
                bgcolor: active ? 'primary.main' : 'transparent',
                whiteSpace: 'nowrap',
                transition: 'background-color 200ms ease, color 200ms ease',
                '& .section-tab-number': { transition: 'transform 200ms ease' },
                '&:hover': {
                  bgcolor: active ? 'primary.main' : 'translucent.primaryGreen',
                },
                '&:hover .section-tab-number': { transform: active ? 'none' : 'translateY(-2px)' },
                '&:focus-visible': focusRing,
              })}
            >
              <Typography
                className="section-tab-number"
                component="span"
                variant="numberBadge"
                sx={{ color: active ? 'common.black' : 'primary.main' }}
              >
                {String(index + 1).padStart(2, '0')}
              </Typography>
              <Typography component="span" variant="button">
                {item.label}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
