// Reusable fixed side navigation rail with scroll-spy behavior for any page
// that exposes stable section IDs.
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material';

export interface NavRailItem {
  id: string;
  label: string;
}

const HOME_SECTIONS: NavRailItem[] = [
  { id: 'top', label: 'Top' },
  { id: 'whatif', label: 'What If?' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'approach', label: 'Approach' },
  { id: 'stakes', label: "What's at Stake" },
  { id: 'mission', label: 'Mission' },
  { id: 'works', label: 'How It Works' },
];

interface NavRailProps {
  items?: NavRailItem[];
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

export default function NavRail({ items = HOME_SECTIONS, ariaLabel = 'Section navigation', sx }: NavRailProps) {
  const [active, setActive] = useState('');
  const activeId = items.some((item) => item.id === active) ? active : items[0]?.id ?? '';

  useEffect(() => {
    const els = items.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box
      component="nav"
      aria-label={ariaLabel}
      sx={[
        (theme) => ({
          position: 'fixed',
          right: theme.spacing(theme.jtSpacing.component.lg),
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 70,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          gap: theme.jtSpacing.component.xs,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {items.map((s) => {
        const on = activeId === s.id;
        return (
          <Box
            key={s.id}
            component="button"
            onClick={() => go(s.id)}
            aria-label={s.label}
            aria-current={on ? 'true' : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: (theme) => theme.jtSpacing.gap.xs,
              py: (theme) => theme.jtSpacing.component.xs / 2,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              '&:hover .rail-dot, &:hover .rail-label': { color: 'primary.main' },
              '&:hover .rail-dot': { borderColor: 'primary.main' },
              '&:hover .rail-label': { opacity: 0.9, transform: 'none' },
            }}
            >
              <Box
                className="rail-label"
                sx={{
                  typography: 'eyebrow',
                  fontSize: (theme) => theme.typography.captionSmall.fontSize,
                  letterSpacing: (theme) => theme.typography.numberBadge.letterSpacing,
                  color: on ? 'primary.main' : 'text.primary',
                  opacity: on ? 0.9 : 0,
                  transform: on ? 'none' : 'translateX(6px)',
                  transition: 'opacity 200ms ease, transform 200ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {s.label}
            </Box>
            <Box
              className="rail-dot"
              sx={{
                width: (theme) => theme.spacing(1.125),
                height: (theme) => theme.spacing(1.125),
                borderRadius: '50%',
                border: '1.5px solid',
                borderColor: (theme) => (on ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.4)),
                bgcolor: on ? 'primary.main' : 'transparent',
                transform: on ? 'scale(1.2)' : 'none',
                transition: 'all 200ms ease',
                flex: 'none',
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
