// The strip under the navbar that switches between the three repository pages: numbered
// segments, the current one filled green (the same pattern as the scenario story tabs).
import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { jtSpacing, navigation } from '@/theme'
import { focusRing } from '@/ui/focusRing'

export type RepoTabKey = 'docs' | 'learning' | 'resources'

const REPO_TABS: { n: string; label: string; shortLabel: string; to: string; key: RepoTabKey }[] = [
  {
    n: '01',
    label: 'Project Documentation',
    shortLabel: 'Documentation',
    to: '/pages/project-documentation',
    key: 'docs',
  },
  {
    n: '02',
    label: 'Service Learning',
    shortLabel: 'Learning',
    to: '/pages/service-learning',
    key: 'learning',
  },
  {
    n: '03',
    label: 'References & Resources',
    shortLabel: 'References',
    to: '/pages/resources',
    key: 'resources',
  },
]

/** Top-level switcher linking the three repository pages. */
export default function RepoTabs({ current }: { current: RepoTabKey }) {
  const stripRef = useRef<HTMLDivElement>(null)

  // On a phone the strip scrolls sideways: bring the current page's tab into view.
  useLayoutEffect(() => {
    const strip = stripRef.current
    const tab = strip?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!strip || !tab) return
    strip.scrollLeft = tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2
  }, [current])

  return (
    <Box
      component="nav"
      aria-label="Repository sections"
      sx={{
        position: 'sticky',
        top: navigation.barHeight,
        zIndex: 90,
        bgcolor: 'base.700',
        borderBottom: 1,
        borderColor: 'border.subtle',
        boxShadow: (theme) => theme.navigation.dropdownShadow,
      }}
    >
      <Container
        ref={stripRef}
        maxWidth={false}
        sx={{
          position: 'relative',
          width: '90dvw',
          px: 0,
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {REPO_TABS.map((tab) => {
          const active = tab.key === current
          return (
            <Box
              key={tab.key}
              component={Link}
              to={tab.to}
              aria-current={active ? 'page' : undefined}
              sx={{
                flex: '1 0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: jtSpacing.gap.sm,
                minHeight: 56,
                px: jtSpacing.component.md,
                color: active ? 'common.black' : 'common.white',
                bgcolor: active ? 'primary.main' : 'transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'background-color 200ms ease, color 200ms ease',
                '& .repo-tab-number': { transition: 'transform 200ms ease' },
                '&:hover': {
                  bgcolor: active ? 'primary.main' : 'translucent.primaryGreen',
                },
                '&:hover .repo-tab-number': { transform: active ? 'none' : 'translateY(-2px)' },
                '&:focus-visible': focusRing,
              }}
            >
              <Typography
                className="repo-tab-number"
                component="span"
                variant="numberBadge"
                sx={{ color: active ? 'common.black' : 'primary.main' }}
              >
                {tab.n}
              </Typography>
              <Typography component="span" variant="button">
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {tab.label}
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  {tab.shortLabel}
                </Box>
              </Typography>
            </Box>
          )
        })}
      </Container>
    </Box>
  )
}
