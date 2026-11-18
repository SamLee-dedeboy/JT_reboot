// The site's one section rail, with scroll spy: it marks the section in view and scrolls to
// the one a reader picks. Every rail on the site is this component, and everything about how
// a rail looks and how wide it is comes from its variant, in `railVariants` below. A page
// picks a variant and passes its items; it never sizes, places or restyles the rail.
//   page:   the "On this page" list in an article's rail column: the heading, then dot and
//           label; it pins below the page's tab bar from lg up and sits in flow below lg.
//   sticky: pins as the reader scrolls past full-bleed colored panels (Home, the scenarios
//           landing): dot then label, no heading, dots outlined in white to read on color.
//   fixed:  pinned to the right edge of the viewport, label then dot, one line per item,
//           for pages whose content fills the width (the Background page and its map).
// The column variants (page, sticky) fill their column up to `navigation.railWidth` from lg
// up and wrap a label too long for it, with the dot on its first line; the grid that holds one uses the
// same width as its track (`navigation.railColumn`, or RailGrid). Items' look is shared by every variant
// (eyebrow labels; nested or criterion-colored items in navigationSubLabel with a smaller
// dot). Below lg the sticky and fixed rails hide, and pages show SectionTabs instead.
import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import type { Theme } from '@mui/material'
import { navigation } from '@/theme'
import useScrollSpy from './useScrollSpy'

export interface NavRailItem {
  id: string
  label: string
  disabled?: boolean
  indent?: boolean
  /** Shown before the label, e.g. a criterion icon. */
  icon?: ReactNode
  /** Identity color for the label, icon and active dot; the label keeps it in every state. */
  color?: string
}

export type NavRailVariant = 'fixed' | 'sticky' | 'page'

interface RailVariant {
  /** The eyebrow above the items, if the variant has one. */
  heading?: string
  /** Dot before the label (in a rail column) or after it (at the screen's right edge). */
  dotFirst: boolean
  /** Long labels wrap within the rail's width; otherwise each item keeps one line. */
  wraps: boolean
  /** Inactive dots outlined in white, to read over photos and colored panels. */
  lightDots: boolean
  /** Where the rail sits and how wide it is. */
  container: (theme: Theme) => object
}

/** Every rail's look, placement and width, by variant. Change a rail here, for every page. */
const railVariants: Record<NavRailVariant, RailVariant> = {
  page: {
    heading: 'On this page',
    dotFirst: true,
    wraps: true,
    lightDots: false,
    container: (theme) => ({
      position: { lg: 'sticky' },
      top: { lg: navigation.pageRailTop },
      zIndex: 3,
      display: 'flex',
      width: { lg: '100%' },
      maxWidth: { lg: navigation.railWidth },
      // Every page's rail starts the same distance below the hero.
      pt: { xs: theme.jtSpacing.component.lg, md: theme.jtSpacing.component.xl },
    }),
  },
  sticky: {
    dotFirst: true,
    wraps: true,
    lightDots: true,
    container: () => ({
      position: 'sticky',
      top: '25vh',
      zIndex: 3,
      display: { xs: 'none', lg: 'flex' },
      width: '100%',
      maxWidth: navigation.railWidth,
    }),
  },
  fixed: {
    dotFirst: false,
    wraps: false,
    lightDots: false,
    container: (theme) => ({
      position: 'fixed',
      right: theme.spacing(theme.jtSpacing.component.md),
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 70,
      display: { xs: 'none', lg: 'flex' },
    }),
  },
}

interface NavRailProps {
  items: NavRailItem[]
  ariaLabel?: string
  variant?: NavRailVariant
  /** Set when the page tracks the current section itself; otherwise the rail's scroll spy does. */
  activeItemId?: string
  onNavigate?: (id: string) => void
  scrollBehavior?: ScrollBehavior
}

export default function NavRail({
  items,
  ariaLabel = 'Section navigation',
  variant = 'fixed',
  activeItemId,
  onNavigate,
  scrollBehavior = 'smooth',
}: NavRailProps) {
  const observedActiveId = useScrollSpy(
    items.map((item) => item.id),
    activeItemId === undefined,
  )
  const activeId = activeItemId ?? observedActiveId
  const { heading, dotFirst, wraps, lightDots, container } = railVariants[variant]

  const go = (id: string) => {
    onNavigate?.(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: scrollBehavior, block: 'start' })
  }

  return (
    <Box
      component="nav"
      aria-label={ariaLabel}
      sx={(theme) => ({
        ...container(theme),
        flexDirection: 'column',
        gap: theme.jtSpacing.gap.xs,
        pointerEvents: 'auto',
        userSelect: 'none',
      })}
    >
      {heading && (
        <Typography
          variant="eyebrow"
          component="p"
          sx={{
            color: 'base.200',
            // The items' gap already sits below it: together they make the heading's space.
            mb: (theme) => theme.jtSpacing.component.md - theme.jtSpacing.gap.xs,
          }}
        >
          {heading}
        </Typography>
      )}
      {items.map((s) => {
        const on = activeId === s.id
        const accent = s.color ?? 'primary.main'
        // Top-level items read as eyebrows; nested (or criterion-colored) items one step smaller.
        const labelTypography = s.indent || s.color ? 'navigationSubLabel' : 'eyebrow'
        const dot = (
          // A first-line-tall slot keeps the dot beside the label's first line when it wraps.
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 'none',
              ...(wraps && { typography: labelTypography, height: '1lh' }),
            }}
          >
            <Box
              className="rail-dot"
              sx={{
                display: 'block',
                boxSizing: 'border-box',
                width: (theme) => theme.spacing(1.125),
                height: (theme) => theme.spacing(1.125),
                ...(s.indent && {
                  width: (theme) => theme.spacing(0.75),
                  height: (theme) => theme.spacing(0.75),
                  borderWidth: 1,
                }),
                borderRadius: '50%',
                border: '2px solid',
                borderColor: lightDots
                  ? on
                    ? 'primary.main'
                    : 'common.white'
                  : on
                    ? accent
                    : 'base.300',
                bgcolor: on ? accent : 'transparent',
                transform: on ? 'scale(1.2)' : 'none',
                transition:
                  'transform 200ms ease, border-color 200ms ease, background-color 200ms ease',
              }}
            />
          </Box>
        )
        const label = (
          <Box
            className="rail-label"
            sx={{
              // Colored (criterion) items use the nested navigation step below the eyebrow parents.
              typography: labelTypography,
              color: s.color ?? (on ? 'primary.main' : 'common.white'),
              transition: 'color 200ms ease',
              whiteSpace: wraps ? 'normal' : 'nowrap',
              textAlign: 'left',
              ...(s.icon && {
                display: 'flex',
                alignItems: 'center',
                gap: (theme: Theme) => theme.jtSpacing.gap.xs,
              }),
            }}
          >
            {s.icon}
            {s.label}
          </Box>
        )
        return (
          <Box
            key={s.id}
            component="button"
            onClick={() => go(s.id)}
            disabled={s.disabled}
            aria-label={s.label}
            aria-current={on ? 'true' : undefined}
            sx={{
              display: 'flex',
              alignItems: wraps ? 'flex-start' : 'center',
              justifyContent: dotFirst ? 'flex-start' : 'flex-end',
              gap: (theme) => theme.jtSpacing.gap.sm,
              paddingBlock: (theme) => theme.jtSpacing.component.xs / 2,
              paddingInlineStart: s.indent
                ? (theme) => theme.spacing(theme.jtSpacing.component.md)
                : 0,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: s.disabled ? 'default' : 'pointer',
              opacity: s.disabled ? 0.58 : 1,
              color: on ? 'primary.main' : 'base.200',
              '&:hover .rail-dot, &:hover .rail-label': {
                color: s.color ?? 'primary.main',
              },
              '&:hover .rail-dot': {
                borderColor: accent,
                bgcolor: on ? accent : 'transparent',
              },
            }}
          >
            {dotFirst ? (
              <>
                {dot}
                {label}
              </>
            ) : (
              <>
                {label}
                {dot}
              </>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
