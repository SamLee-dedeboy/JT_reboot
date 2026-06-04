import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';

interface RevealProps extends BoxProps {
  /** Stagger delay in seconds before the reveal transition runs. */
  delay?: number;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * IntersectionObserver-based scroll reveal. Elements start
 * opacity:0 / translateY(26px) and ease to visible when they enter
 * the viewport. Respects prefers-reduced-motion (reveals immediately,
 * no shift). Ported from the design prototype's `Reveal` primitive.
 */
export default function Reveal({ delay = 0, sx, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();
  // Start already-shown when motion is reduced — avoids a setState-in-effect.
  const [shown, setShown] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let done = false;
    const reveal = () => {
      if (!done) {
        done = true;
        setShown(true);
      }
    };
    const inView = () => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight || document.documentElement.clientHeight || 800;
      return r.top < h * 0.92 && r.bottom > 0;
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && reveal()),
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);

    // Fallbacks in case the frame wasn't painted when the observer registered.
    const t1 = window.setTimeout(() => inView() && reveal(), 120);
    const t2 = window.setTimeout(() => inView() && reveal(), 400);
    const onLoad = () => inView() && reveal();
    window.addEventListener('load', onLoad);

    return () => {
      io.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('load', onLoad);
    };
  }, [reduced]);

  return (
    <Box
      ref={ref}
      sx={[
        {
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(26px)',
          transition: reduced
            ? 'none'
            : 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)',
          transitionDelay: `${delay}s`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </Box>
  );
}
