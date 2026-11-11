/* Shared primitives — reveal-on-scroll, placeholders, small inline icons */
const { useState, useEffect, useRef, useCallback } = React;

/* IntersectionObserver-based scroll reveal.
   Respects [data-motion="off"] by revealing immediately. */
function Reveal({ children, delay = 0, as = 'div', className = '', style = {}, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const motionOff = document.documentElement.getAttribute('data-motion') === 'off';
    if (motionOff) { setShown(true); return; }

    let done = false;
    const reveal = () => { if (!done) { done = true; setShown(true); } };
    const inView = () => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight || document.documentElement.clientHeight || 800;
      return r.top < h * 0.92 && r.bottom > 0;
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) reveal(); }),
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);

    // Fallbacks: in case the frame wasn't sized/painted when the observer
    // was registered, re-check on the next frames and on load.
    const t1 = setTimeout(() => { if (inView()) reveal(); }, 120);
    const t2 = setTimeout(() => { if (inView()) reveal(); }, 400);
    const onLoad = () => { if (inView()) reveal(); };
    window.addEventListener('load', onLoad);

    return () => {
      io.disconnect();
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Striped image placeholder with a monospace label */
function Placeholder({ label, ratio = '16 / 10', minHeight, style = {}, children }) {
  return (
    <div
      className="ph"
      style={{ aspectRatio: minHeight ? undefined : ratio, minHeight, ...style }}
    >
      {children}
      <span className="ph-label">{label}</span>
    </div>
  );
}

/* Minimal inline icons (stroke), kept to simple geometry */
function Icon({ name, size = 22, stroke = 'currentColor', strokeWidth = 1.6, style }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', style,
  };
  switch (name) {
    case 'arrow-down':
      return (<svg {...common}><path d="M12 5v14M6 13l6 6 6-6" /></svg>);
    case 'arrow-right':
      return (<svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
    case 'chevron-down':
      return (<svg {...common}><path d="M6 9l6 6 6-6" /></svg>);
    case 'plus':
      return (<svg {...common}><path d="M12 5v14M5 12h14" /></svg>);
    case 'minus':
      return (<svg {...common}><path d="M5 12h14" /></svg>);
    case 'menu':
      return (<svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
    case 'close':
      return (<svg {...common}><path d="M6 6l12 12M18 6L6 18" /></svg>);
    case 'mail':
      return (<svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>);
    case 'drop':
      return (<svg {...common}><path d="M12 3c3.5 4 6 7 6 10a6 6 0 1 1-12 0c0-3 2.5-6 6-10z" /></svg>);
    case 'waves':
      return (<svg {...common}><path d="M2 7c2 0 2 1.5 4 1.5S10 7 12 7s2 1.5 4 1.5S20 7 22 7" /><path d="M2 12c2 0 2 1.5 4 1.5S10 12 12 12s2 1.5 4 1.5S20 12 22 12" /><path d="M2 17c2 0 2 1.5 4 1.5S10 17 12 17s2 1.5 4 1.5S20 17 22 17" /></svg>);
    case 'thermometer':
      return (<svg {...common}><path d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0z" /></svg>);
    case 'users':
      return (<svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5" /><path d="M16 6a3 3 0 0 1 0 5" /><path d="M21 20c0-2.5-1.6-4.2-4-4.8" /></svg>);
    case 'compass':
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></svg>);
    case 'layers':
      return (<svg {...common}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></svg>);
    case 'leaf':
      return (<svg {...common}><path d="M5 19c0-8 5-13 14-13 0 9-5 14-14 13z" /><path d="M5 19c3-4 6-6 9-7" /></svg>);
    case 'coins':
      return (<svg {...common}><ellipse cx="12" cy="7" rx="7" ry="3" /><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7" /><path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" /></svg>);
    case 'pin':
      return (<svg {...common}><path d="M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12z" /><circle cx="12" cy="9" r="2.4" /></svg>);
    case 'arrow-up-right':
      return (<svg {...common}><path d="M7 17L17 7M9 7h8v8" /></svg>);
    default:
      return null;
  }
}

Object.assign(window, { Reveal, Placeholder, Icon });
