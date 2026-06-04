import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const SECTIONS = [
  { id: 'top', label: 'Top' },
  { id: 'whatif', label: 'What If?' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'approach', label: 'Approach' },
  { id: 'stakes', label: "What's at Stake" },
  { id: 'mission', label: 'Mission' },
  { id: 'works', label: 'How It Works' },
];

/** Fixed right-edge dot nav with scroll-spy. Hidden below 1200px. */
export default function NavRail() {
  const [active, setActive] = useState('top');

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
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
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box
      component="nav"
      aria-label="Section navigation"
      sx={{
        position: 'fixed',
        right: '1.6rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 70,
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        gap: '0.4rem',
      }}
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
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
              gap: '0.7rem',
              py: '0.35rem',
              background: 'none',
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
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '0.72rem',
                color: on ? 'primary.main' : 'common.white',
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
                width: 9,
                height: 9,
                borderRadius: '50%',
                border: '1.5px solid',
                borderColor: on ? 'primary.main' : 'rgba(242,240,239,0.4)',
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
