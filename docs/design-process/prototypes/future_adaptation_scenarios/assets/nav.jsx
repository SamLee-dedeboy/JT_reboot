/* Sticky navbar — wordmark + dropdown menus, mirrors the production IA */
const NAV_ITEMS = [
  { label: 'Scenarios', dropdown: [
    { label: 'Adaptation Scenarios', href: 'Adaptation Scenarios (choose a direction).html' },
  ]},
  { label: 'Get Involved', dropdown: [
    { label: 'Public Events', href: '#' },
    { label: 'Participatory Scenario Planning', href: '#' },
    { label: 'Contact Us', href: 'mailto:just.transitions@ucdavis.edu' },
  ]},
  { label: 'Repository', dropdown: [
    { label: 'Project Documentation & Reports', href: 'Project Documentation.html' },
    { label: 'Service Learning & Education', href: 'Service Learning.html' },
    { label: 'References & Resources', href: 'References & Resources.html' },
  ]},
  { label: 'Related Projects', dropdown: [
    { label: 'Franks Tract Futures', href: '#', external: true },
    { label: 'Delta Island Adaptations', href: '#', external: true },
    { label: 'Delta Adapts', href: '#', external: true },
  ]},
];

function Wordmark() {
  return (
    <a href="Just Transitions Homepage.html" className="wordmark" aria-label="Just Transitions in the Delta — home">
      <span className="wordmark-line">Just Transitions</span>
      <span className="wordmark-line">in the Delta</span>
      <span className="wordmark-sub">Drought, salinity, and sea-level rise</span>
    </a>
  );
}

function Navbar() {
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(null);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <header className="nav" ref={navRef}>
      <div className="nav-inner">
        <Wordmark />

        <nav className="nav-links" aria-label="Primary">
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item.label}
              className="nav-item"
              onMouseEnter={() => setOpen(i)}
              onMouseLeave={() => setOpen(null)}
            >
              <button
                className={`nav-btn ${open === i ? 'active' : ''}`}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {item.label}
                <Icon name="chevron-down" size={16} style={{ transition: 'transform .2s', transform: open === i ? 'rotate(180deg)' : 'none' }} />
              </button>
              <div className={`nav-menu ${open === i ? 'show' : ''}`}>
                {item.dropdown.map((sub) => (
                  <a key={sub.label} href={sub.href} className="nav-menu-item">
                    {sub.label}
                    {sub.external && <span className="ext">↗</span>}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <button className="nav-burger" aria-label="Menu" onClick={() => setMobileOpen(true)}>
          <Icon name="menu" size={26} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`drawer-scrim ${mobileOpen ? 'show' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`drawer ${mobileOpen ? 'show' : ''}`} aria-hidden={!mobileOpen}>
        <div className="drawer-head">
          <span className="h4 green">Just Transitions in the Delta</span>
          <button className="nav-burger" aria-label="Close" onClick={() => setMobileOpen(false)}>
            <Icon name="close" size={24} />
          </button>
        </div>
        {NAV_ITEMS.map((item, i) => (
          <div key={item.label} className="drawer-group">
            <button className="drawer-row" onClick={() => setExpanded(expanded === i ? null : i)}>
              {item.label}
              <Icon name="chevron-down" size={18} style={{ transform: expanded === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
            </button>
            <div className="drawer-sub" style={{ maxHeight: expanded === i ? `${item.dropdown.length * 56}px` : 0 }}>
              {item.dropdown.map((sub) => (
                <a key={sub.label} href={sub.href} className="drawer-sub-item" onClick={() => setMobileOpen(false)}>
                  {sub.label}{sub.external && <span className="ext">↗</span>}
                </a>
              ))}
            </div>
          </div>
        ))}
      </aside>
    </header>
  );
}

window.Navbar = Navbar;
