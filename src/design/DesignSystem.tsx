import { useState } from 'react';
import './DesignSystem.css';

function ColorSwatch({ label, hex }: { label: string; hex: string }) {
  return (
    <div className="swatch">
      <div className="swatch-color" style={{ background: hex }} />
      <div className="swatch-meta">
        <div className="swatch-name">{label}</div>
        <div className="swatch-value">{hex}</div>
      </div>
    </div>
  );
}

const typography = [
  { variant: 'H1', size: 'clamp(3.6rem, 1.5rem + 4vw, 5rem)', weight: 600, line: 1 },
  { variant: 'H2', size: 'clamp(1.4rem, 1.6rem + 3.2vw, 4.4rem)', weight: 300, line: 1.05 },
  { variant: 'Body1', size: '1.125rem', weight: 400, line: 1.75 },
  { variant: 'Button', size: '1rem', weight: 500, line: 1.4 },
];

const radii = [
  { name: 'xs', px: '2px' },
  { name: 'sm', px: '4px' },
  { name: 'md', px: '8px' },
  { name: 'lg', px: '12px' },
  { name: 'pill', px: '999px' },
];


export default function DesignSystem() {
  const [isDarkBackground, setIsDarkBackground] = useState(true);

  const commonColors = [
    { label: 'off-white', hex: '#fcfbfa' },
    { label: 'off-black', hex: '#212121' },
  ];

  const brandPalette = [
    { label: 'Primary', hex: '#253439' },
    { label: 'Accent Blue', hex: '#64ACC4' },
    { label: 'Accent Green', hex: '#7ed957' },
  ];

  const textColors = [
    { label: 'Light', hex: '#fcfbfa' },
    { label: 'Dark', hex: '#253439' },
  ];

  const mapColors = [
    { label: 'Spray', hex: '#7eeaee' },
    { label: 'Orange Roughy', hex: '#cb531b' },
    { label: 'Bitter Lemon', hex: '#dee006' },
    { label: 'Heliotrope', hex: '#e263ff' },
    { label: 'Web Orange', hex: '#efa400' },
    { label: 'Sasquatch Socks', hex: '#ff4c79' },
  ];

  const visColors = [
    { label: 'Spray but slightly darker', hex: '#79e1e4' },
    { label: 'Mandarin Pearl', hex: '#f77c3b' },
    { label: 'Ripe Lemon', hex: '#f2c820' },
    { label: 'Heliotrope', hex: '#b280ff' },
    { label: 'Wild Watermelon', hex: '#ff677d' },
  ]

  return (
    <div
      className={`design-system-shell ${isDarkBackground ? 'design-system-page--dark' : 'design-system-page--light'}`}
      style={{
        backgroundColor: isDarkBackground ? '#253439' : '#fcfbfa',
        color: isDarkBackground ? '#fcfbfa' : '#253439',
      }}
    >
      <div className="design-system-content">
        <header className="ds-header">
          <div className="ds-header-copy">
            <h1>Just Transition Website Design System</h1>
          </div>
          <button
            type="button"
            className="ds-toggle-button"
            onClick={() => setIsDarkBackground((current) => !current)}
            aria-pressed={isDarkBackground}
          >
            {isDarkBackground ? 'Switch to Light Background' : 'Switch to Dark Background'}
          </button>
        </header>

        <section className="ds-section">
          <h2>Color Palette</h2>
          <div className="palette-intro">
            <p className="muted">Color names are given by Figma.</p>
            <p className="muted">Any colors used in UI components need to pass color contrast accessibility guidelines (AA and AAA).</p>
            <p className="muted">Any colors used in vis and maps as categories need to pass color contrast and blindness checks.</p>
          </div>
          <div className="palette-row">
            <div className="palette-column">
              <h4>Brand</h4>
              {brandPalette.map((c) => (
                <ColorSwatch key={c.label} label={c.label} hex={c.hex} />
              ))}
            </div>
            <div className="palette-column">
              <h4>Common</h4>
              {commonColors.map((c) => (
                <ColorSwatch key={c.label} label={c.label} hex={c.hex} />
              ))}
            </div>
            <div className="palette-column">
              <h4>Text Colors</h4>
              {textColors.map((c) => (
                <ColorSwatch key={c.label} label={c.label} hex={c.hex} />
              ))}
            </div>
          </div>
          <div className="palette-row">
            <div className="palette-column">
              <h4>Existing</h4>
              <a href="https://projects.susielu.com/viz-palette?colors=%5B%22%237eeaee%22%2C%22%23cb531b%22%2C%22%23dee006%22%2C%22%23e263ff%22%2C%22%23efa400%22%2C%22%23ff4c79%22%5D&mode=%22none%22&backgroundColor=%22%23253439%22" target="_blank" rel="noopener noreferrer">
                Color check
              </a>

              {mapColors.map((c) => (
                <ColorSwatch key={c.label} label={c.label} hex={c.hex} />
              ))}
            </div>
            <div className='palette-column'>
              <h4>Candidates</h4>
              <a href="https://projects.susielu.com/viz-palette?colors=%5B%22%2379e1e4%22%2C%22%23f77c3b%22%2C%22%23f2c820%22%2C%22%23b280ff%22%2C%22%23ff677d%22%5D&mode=%22none%22&backgroundColor=%22%23253439%22" target="_blank" rel="noopener noreferrer">
                Color check
              </a>
              {visColors.map((c) => (
                <ColorSwatch key={c.label} label={c.label} hex={c.hex} />
              ))}
            </div>
          </div>
        </section>

        <section className="ds-section">
          <h2>Typography</h2>
          <p className="muted">Typeface: Hammersmith One for headings, Proxima Nova for body copy.</p>
          <p className="muted">Specs format: font-size / font-weight / line-height / letter-spacing</p>
          <div className="typography-list">
            {typography.map((t) => (
              <div key={t.variant} className="type-item">
                <div className="type-sample" style={{ fontSize: t.size, fontWeight: t.weight }}>
                  {t.variant} — Example headline
                </div>
                <div className="type-meta">{`${t.size} / ${t.weight} / ${t.line}`}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="ds-section">
          <h2>Radius</h2>
          <div className="radii-row">
            {radii.map((r) => (
              <div key={r.name} className="radius-item">
                <div className="radius-box" style={{ borderRadius: r.px }} />
                <div className="radius-meta">{r.name} — {r.px}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="ds-section">
          <h2>Component guidance</h2>
          <div className="component-row">
            <div className="component-example">
              <div className="example-label">Buttons</div>
              <div className="example-controls">
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-outline">Outline</button>
              </div>
            </div>

            <div className="component-example">
              <div className="example-label">Card</div>
              <div className="example-card">
                <h4>Card title</h4>
                <p className="muted">Short description or metadata goes here.</p>
              </div>
            </div>

            <div className="component-example">
              <div className="example-label">Form Input</div>
              <input className="ds-input" placeholder="Enter text" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
