// The site's one section rail, with scroll spy: it marks the section in view and scrolls to
// the one a reader picks. Every rail shares its items' look (eyebrow labels; nested or
// criterion-colored items in navigationSubLabel with a smaller dot), their spacing and their
// hover. `variant` only places it, for three different kinds of page:
//   fixed:  pinned to the right edge of the viewport, label then dot, one line per item.
//           For pages whose content fills the width, e.g. the Background page and its map.
//   sticky: pins as the reader scrolls past full-bleed colored panels (Home, the scenarios
//           landing), dot then label. Dots are outlined in white to read on those colors.
//   page:   the in-flow "On this page" list in an article's rail column (use PageRail),
//           dot then label; long labels wrap and the dot stays on the first line.
// Don't add a variant or restyle items per page; change the rail here for every page.
import { useEffect, useState, type ReactNode } from 'react'
import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'

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

/** Container layout per variant; everything else about the rail is shared. */
const containerSx: Record<NavRailVariant, (theme: Theme) => object> = {
  fixed: (theme) => ({
    position: 'fixed',
    right: theme.spacing(theme.jtSpacing.component.md),
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 70,
    display: { xs: 'none', lg: 'flex' },
  }),
  sticky: () => ({
    position: 'sticky',
    top: '25vh',
    zIndex: 3,
    display: { xs: 'none', lg: 'flex' },
    alignSelf: 'start',
  }),
  page: () => ({
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'flex-start',
  }),
}

interface NavRailProps {
  items: NavRailItem[]
  ariaLabel?: string
  variant?: NavRailVariant
  activeItemId?: string
  onNavigate?: (id: string) => void
  scrollBehavior?: ScrollBehavior
  sx?: SxProps<Theme>
}

export default function NavRail({
  items,
  ariaLabel = 'Section navigation',
  variant = 'fixed',
  activeItemId,
  onNavigate,
  scrollBehavior = 'smooth',
  sx,
}: NavRailProps) {
  const [active, setActive] = useState(items[0]?.id ?? '')
  const observedActiveId = items.some((item) => item.id === active) ? active : (items[0]?.id ?? '')
  const activeId = activeItemId ?? observedActiveId
  const dotFirst = variant !== 'fixed'
  const wraps = variant === 'page'

  useEffect(() => {
    if (activeItemId !== undefined) return

    const els = items
      .map((s) => document.getElementById(s.id))
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
  }, [activeItemId, items])

  const go = (id: string) => {
    onNavigate?.(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: scrollBehavior, block: 'start' })
  }

  return (
    <Box
      component="nav"
      aria-label={ariaLabel}
      sx={[
        (theme) => ({
          ...containerSx[variant](theme),
          flexDirection: 'column',
          gap: theme.jtSpacing.gap.xs,
          pointerEvents: 'auto',
          userSelect: 'none',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
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
                borderColor:
                  variant === 'sticky'
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
