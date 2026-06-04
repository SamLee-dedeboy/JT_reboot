/* ============================================================
   Adaptation Scenarios — shared visual components
   DeltaMap (schematic), rating widgets, option switcher bar.
   The map is a SCHEMATIC locator — a real GIS layer drops in later.
   ============================================================ */

let __mapUID = 0;

/* Schematic Delta map. `intrusion` (0–1) sets how far salt water reaches
   east from Suisun Bay; `accent` tints the active scenario. */
function DeltaMap({ intrusion = 0.5, accent = 'var(--brand-green)', labels = true, height = 320, className = '', caption = true }) {
  const uid = useRef(`dm${++__mapUID}`).current;
  const salX = 26 + intrusion * 300; // 26..326 within a 0..400 viewBox

  return (
    <div className={`dmap ${className}`} style={{ height }}>
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" className="dmap-svg" role="img"
        aria-label={`Schematic Delta map, salinity intrusion ${Math.round(intrusion * 100)} percent`}>
        <defs>
          <linearGradient id={`${uid}-salt`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(81,162,189,0.42)" />
            <stop offset="70%" stopColor="rgba(81,162,189,0.16)" />
            <stop offset="100%" stopColor="rgba(81,162,189,0)" />
          </linearGradient>
          <clipPath id={`${uid}-clip`}>
            <rect x="0" y="0" width={salX} height="280" />
          </clipPath>
        </defs>

        {/* grid */}
        <g stroke="rgba(81,162,189,0.12)" strokeWidth="1">
          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="280" />
          ))}
          {[40, 80, 120, 160, 200, 240].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} />
          ))}
        </g>

        {/* salty water reach */}
        <rect x="0" y="0" width="400" height="280" fill={`url(#${uid}-salt)`} clipPath={`url(#${uid}-clip)`} />

        {/* channels */}
        <g fill="none" stroke="rgba(139,196,212,0.85)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M150 8 C150 60 176 112 200 150" />
          <path d="M372 274 C306 246 250 198 200 150" />
          <path d="M200 150 C140 150 88 152 14 150" />
          <path d="M200 150 C236 176 278 196 330 202" />
        </g>

        {/* salinity line */}
        <line x1={salX} y1="6" x2={salX} y2="274" stroke={accent} strokeWidth="2.5" strokeDasharray="6 6" opacity="0.95" />
        <circle cx={salX} cy="150" r="4.5" fill={accent} />

        {/* nodes */}
        <g>
          <circle cx="22" cy="150" r="4" fill="none" stroke="rgba(242,240,239,0.7)" strokeWidth="1.6" />
          <circle cx="150" cy="14" r="4" fill="none" stroke="rgba(242,240,239,0.7)" strokeWidth="1.6" />
          <circle cx="332" cy="202" r="4" fill="none" stroke="rgba(242,240,239,0.7)" strokeWidth="1.6" />
          <rect x="306" y="232" width="9" height="9" fill="none" stroke="rgba(242,240,239,0.7)" strokeWidth="1.6" />
        </g>

        {labels && (
          <g className="dmap-labels" fontSize="10" letterSpacing="0.06em">
            <text x="30" y="138" textAnchor="start">SUISUN BAY</text>
            <text x="158" y="20" textAnchor="start">SACRAMENTO R.</text>
            <text x="324" y="220" textAnchor="end">SAN JOAQUIN R.</text>
            <text x="300" y="252" textAnchor="end">EXPORT PUMPS</text>
            <text x={salX} y="270" textAnchor="middle" fill={accent} fontSize="9">SALINITY LINE</text>
          </g>
        )}
      </svg>
      {caption && <span className="dmap-cap">Schematic — drop GIS map</span>}
    </div>
  );
}

/* Four-step dot rating */
function RatingDots({ value, accent = 'var(--brand-green)', size = 9 }) {
  return (
    <span className="rdots" role="img" aria-label={`${value} of 4`}>
      {[1, 2, 3, 4].map((n) => (
        <span key={n} className="rdot" style={{
          width: size, height: size,
          background: n <= value ? accent : 'transparent',
          borderColor: n <= value ? accent : 'rgba(242,240,239,0.28)',
        }} />
      ))}
    </span>
  );
}

/* Horizontal bar rating */
function RatingBar({ value, accent = 'var(--brand-green)' }) {
  return (
    <span className="rbar" role="img" aria-label={`${value} of 4`}>
      <span className="rbar-fill" style={{ width: `${(value / 4) * 100}%`, background: accent }} />
    </span>
  );
}

/* One tradeoff line: icon + label + rating + word */
function TradeoffRow({ factor, value, accent, variant = 'bar' }) {
  return (
    <div className="trow">
      <Icon name={factor.icon} size={17} stroke={factor.stroke} />
      <span className="trow-label">{factor.label}</span>
      {variant === 'dots'
        ? <RatingDots value={value} accent={accent} />
        : <RatingBar value={value} accent={accent} />}
      <span className="trow-word">{RATING_WORDS[value]}</span>
    </div>
  );
}

/* Small rank badge */
function RankBadge({ rank, accent }) {
  return (
    <span className="rankbadge" style={{ borderColor: accent, color: accent }}>
      <span className="rankbadge-n">#{rank}</span>
      <span className="rankbadge-l">community rank</span>
    </span>
  );
}

/* Sticky sub-bar to jump between the four design directions */
function OptionSwitcher({ current }) {
  return (
    <div className="optswitch">
      <div className="optswitch-inner">
        <span className="optswitch-tag">Direction</span>
        <nav className="optswitch-links">
          {OPTIONS.map((o) => (
            <a key={o.id} href={o.file} className={`optswitch-link ${o.id === current ? 'on' : ''}`}>
              <span className="optswitch-letter">{o.letter}</span>{o.label}
            </a>
          ))}
        </nav>
        <a href="Adaptation Scenarios (choose a direction).html" className="optswitch-all">Compare all <Icon name="arrow-right" size={15} /></a>
      </div>
    </div>
  );
}

Object.assign(window, { DeltaMap, RatingDots, RatingBar, TradeoffRow, RankBadge, OptionSwitcher });
