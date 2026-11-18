// The adaptation scenarios below lg: one card per scenario in a sideways strip that snaps card
// by card, the next card peeking in, with a count of where the reader is. It replaces the
// desktop's AdaptationPanels, whose panels open on hover, which a touch screen doesn't have.
import { useRef, useState } from 'react'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { ActionButton } from '@/ui'

interface AdaptationCarouselItem {
  title: string
  image: string
  eyebrow?: string
  body?: string
  href: string
}

export default function AdaptationCarousel({ items }: { items: AdaptationCarouselItem[] }) {
  const theme = useTheme()
  const stripRef = useRef<HTMLUListElement>(null)
  const [current, setCurrent] = useState(0)
  // The page inset, so the words line up with the hero above.
  const inset = theme.jtSpacing.page.x

  // The card whose left edge is nearest the strip's start is the current one.
  const trackCurrent = () => {
    const strip = stripRef.current
    const first = strip?.firstElementChild as HTMLElement | null
    if (!strip || !first) return
    const stride = first.offsetWidth + parseFloat(getComputedStyle(strip).columnGap || '0')
    setCurrent(Math.min(items.length - 1, Math.round(strip.scrollLeft / stride)))
  }

  // It fills whatever height its parent leaves it: the cards stretch to the strip's height.
  return (
    <Stack spacing={theme.jtSpacing.gap.md} sx={{ flex: '1 0 auto' }}>
      <Box
        ref={stripRef}
        component="ul"
        aria-label="Adaptation scenarios"
        onScroll={trackCurrent}
        sx={{
          m: 0,
          p: 0,
          px: inset,
          listStyle: 'none',
          flex: '1 0 auto',
          display: 'flex',
          gap: theme.jtSpacing.gap.sm,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPaddingInline: {
            xs: theme.spacing(inset.xs),
            sm: theme.spacing(inset.sm),
            md: theme.spacing(inset.md),
          },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {items.map((item, index) => (
          <Box
            key={item.title}
            component="li"
            sx={{
              position: 'relative',
              flex: 'none',
              width: 'min(84%, 24rem)',
              minHeight: '34rem',
              display: 'flex',
              alignItems: 'flex-end',
              isolation: 'isolate',
              overflow: 'hidden',
              scrollSnapAlign: 'start',
              bgcolor: 'base.900',
              // The photo stays clear at the top and darkens under the text.
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                zIndex: -1,
                background: `linear-gradient(180deg, ${theme.palette.translucent[50]} 0%, ${theme.palette.translucent[300]} 30%, ${theme.palette.translucent[800]} 62%, ${theme.palette.translucent[800]} 100%)`,
              },
            }}
          >
            <Box
              component="img"
              src={item.image}
              alt=""
              loading="lazy"
              decoding="async"
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: -2,
                width: 1,
                height: 1,
                objectFit: 'cover',
                opacity: 0.88,
              }}
            />
            <Stack
              spacing={theme.jtSpacing.gap.xs}
              sx={{
                width: 1,
                px: theme.jtSpacing.scenario.panelContentInline.xs,
                pb: theme.jtSpacing.scenario.panelContentBottom.xs,
              }}
            >
              <Typography variant="numberArticle" component="p" sx={{ color: 'primary.main' }}>
                {item.eyebrow ?? String(index + 1).padStart(2, '0')}
              </Typography>
              <Typography variant="h3" component="h3" sx={{ color: 'common.white' }}>
                {item.title}
              </Typography>
              {item.body && (
                <Typography variant="body1" component="p" sx={{ color: 'common.white' }}>
                  {item.body}
                </Typography>
              )}
              <Box sx={{ pt: theme.jtSpacing.component.sm }}>
                <ActionButton label="Explore" href={item.href} />
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>

      {/* Where the reader is in the strip, and that it goes on. */}
      <Stack
        direction="row"
        spacing={theme.jtSpacing.gap.sm}
        sx={{ px: inset, alignItems: 'center' }}
      >
        <Stack direction="row" spacing={0.75} aria-hidden="true">
          {items.map((item, index) => (
            <Box
              key={item.title}
              sx={{
                width: (t) => t.spacing(index === current ? 2.5 : 0.75),
                height: (t) => t.spacing(0.75),
                borderRadius: 999,
                bgcolor: index === current ? 'primary.main' : 'base.400',
                transition: 'width 200ms ease, background-color 200ms ease',
              }}
            />
          ))}
        </Stack>
        <Typography
          variant="captionSmall"
          component="p"
          aria-live="polite"
          sx={{ color: 'base.100' }}
        >
          {current + 1} of {items.length} · swipe for more
        </Typography>
      </Stack>
    </Stack>
  )
}
