// Reusable fixed side navigation rail with scroll-spy behavior for any page
// that exposes stable section IDs.
import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'

export interface NavRailItem {
  id: string
  label: string
  disabled?: boolean
  /** Theme color path (e.g. 'base.500') used to fill this item's dot once its section has been seen. */
  dotColor?: string
}

const HOME_SECTIONS: NavRailItem[] = [
  { id: 'top', label: 'Top' },
  { id: 'whatif', label: 'What If?' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'approach', label: 'Approach' },
  { id: 'stakes', label: "What's at Stake" },
  { id: 'mission', label: 'Mission' },
  { id: 'works', label: 'How It Works' },
]

interface NavRailProps {
  items?: NavRailItem[]
  ariaLabel?: string
  variant?: 'default' | 'home'
  sx?: SxProps<Theme>
}

export default function NavRail({
  items = HOME_SECTIONS,
  ariaLabel = 'Section navigation',
  variant = 'default',
  sx,
}: NavRailProps) {
  const [active, setActive] = useState(items[0]?.id ?? '')
  const activeId = items.some((item) => item.id === active) ? active : (items[0]?.id ?? '')
  const [seenIds, setSeenIds] = useState<Set<string>>(() => new Set(items[0] ? [items[0].id] : []))
  const navRef = useRef<HTMLElement>(null)
  const [lineMetrics, setLineMetrics] = useState<{ top: number; height: number } | null>(null)

  useEffect(() => {
    if (variant !== 'home') return
    const navEl = navRef.current
    if (!navEl) return

    const recompute = () => {
      const dots = navEl.querySelectorAll<HTMLElement>('.rail-dot')
      if (dots.length < 2) return
      const navRect = navEl.getBoundingClientRect()
      const first = dots[0].getBoundingClientRect()
      const last = dots[dots.length - 1].getBoundingClientRect()
      const top = first.top + first.height / 2 - navRect.top
      const bottom = last.top + last.height / 2 - navRect.top
      setLineMetrics({ top, height: bottom - top })
    }

    recompute()
    const ro = new ResizeObserver(recompute)
    ro.observe(navEl)
    window.addEventListener('resize', recompute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recompute)
    }
  }, [items, variant])

  useEffect(() => {
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
        setSeenIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const currentSectionColor = items.find((item) => item.id === activeId)?.dotColor ?? 'base.300'

  return (
    <Box
      component="nav"
      ref={navRef}
      aria-label={ariaLabel}
      sx={[
        (theme) => ({
          position: variant === 'home' ? 'sticky' : 'fixed',
          right: variant === 'home' ? 'auto' : theme.spacing(theme.jtSpacing.component.md),
          top: variant === 'home' ? '25vh' : '50%',
          transform: variant === 'home' ? 'none' : 'translateY(-50%)',
          zIndex: 70,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          alignSelf: variant === 'home' ? 'start' : undefined,
          gap: variant === 'home' ? theme.jtSpacing.gap.sm : theme.jtSpacing.gap.xs,
          pointerEvents: 'auto',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {variant === 'home' && lineMetrics && (
        <Box
          aria-hidden
          sx={(theme) => ({
            position: 'absolute',
            top: lineMetrics.top,
            height: lineMetrics.height,
            left: `calc(${theme.spacing(1.125 / 2)} - 1px)`,
            width: '2px',
            bgcolor: 'common.white',
            zIndex: -1,
          })}
        />
      )}
      {items.map((s) => {
        const on = activeId === s.id
        const isSeen = variant !== 'home' || seenIds.has(s.id)
        const dot = (
          <Box
            className="rail-dot"
            sx={{
              display: 'block',
              boxSizing: 'border-box',
              width: (theme) => theme.spacing(1.125),
              height: (theme) => theme.spacing(1.125),
              borderRadius: '50%',
              border: '2px solid',
              borderColor:
                variant === 'home'
                  ? !isSeen
                    ? 'transparent'
                    : on
                      ? 'primary.main'
                      : 'common.white'
                  : on
                    ? 'primary.main'
                    : 'base.300',
              bgcolor: !isSeen
                ? 'transparent'
                : variant === 'home'
                  ? on
                    ? 'primary.main'
                    : currentSectionColor
                  : on
                    ? 'primary.main'
                    : 'transparent',
              transform: on ? 'scale(1.2)' : 'none',
              transition:
                'transform 200ms ease, border-color 200ms ease, background-color 200ms ease',
              flex: 'none',
            }}
          />
        )
        const label = (
          <Box
            className="rail-label"
            sx={{
              typography: 'eyebrow',
              fontSize: (theme) => theme.typography.captionSmall.fontSize,
              letterSpacing: (theme) => theme.typography.numberBadge.letterSpacing,
              color: on ? 'primary.main' : 'common.white',
              transition: 'color 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
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
              alignItems: 'center',
              justifyContent: variant === 'home' ? 'flex-start' : 'flex-end',
              gap: (theme) => theme.jtSpacing.gap.sm,
              paddingBlock: (theme) => theme.jtSpacing.component.xs / 2,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: s.disabled ? 'default' : 'pointer',
              opacity: s.disabled ? 0.58 : 1,
              color: on ? 'primary.main' : 'base.200',
              '&:hover .rail-dot, &:hover .rail-label': {
                color: variant === 'home' ? 'common.white' : 'primary.main',
              },
              '&:hover .rail-dot': {
                borderColor: 'primary.main',
                bgcolor: variant === 'home' ? 'common.white' : undefined,
              },
              '&:hover .rail-label': {
                color: variant === 'home' ? 'common.white' : 'primary.main',
              },
            }}
          >
            {variant === 'home' ? (
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
