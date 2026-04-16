import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

interface DropdownItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Scenarios',
    dropdown: [
      { label: 'Adaptation Scenarios', href: '/pages/adaptation-scenarios' },
    ],
  },
  {
    label: 'Get Involved',
    dropdown: [
      { label: 'Public Events', href: '/pages/public-events' },
      { label: 'Participatory Scenario Planning', href: '/pages/scenario-planning' },
      { label: 'Contact Us', href: '/pages/contact-us' },
    ],
  },
  {
    label: 'Repository',
    dropdown: [
      { label: 'Project Documentation & Reports', href: '/pages/project-documentation' },
      { label: 'Service Learning & Education', href: '/pages/service-learning' },
      { label: 'References & Resources', href: '/pages/resources' },
    ],
  },
  {
    label: 'Related Projects',
    dropdown: [
      { label: 'Franks Tract Futures', href: 'https://franks-tract-futures-ucdavis.hub.arcgis.com/', external: true },
      { label: 'Delta Island Adaptations', href: 'https://deltaislandadaptations-ucdavis.hub.arcgis.com/', external: true },
      { label: 'Delta Adapts', href: 'https://www.deltacouncil.ca.gov/delta-plan/climate-change', external: true },
    ],
  },
  {
    label: 'Playground',
    href: '/pages/playground',
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Just Transitions in the Delta</span>
        </Link>
        <button
          className={`hamburger ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {navItems.map((item, i) => (
            <li
              key={item.label}
              className="nav-item"
              onMouseEnter={() => setOpenDropdown(i)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {item.href ? (
                <Link to={item.href}>{item.label}</Link>
              ) : (
                <button
                  className="nav-btn"
                  onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                >
                  {item.label}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </button>
              )}
              {item.dropdown && openDropdown === i && (
                <ul className="dropdown">
                  {item.dropdown.map((sub) => (
                    <li key={sub.label}>
                      {sub.external ? (
                        <a href={sub.href} target="_blank" rel="noopener noreferrer">
                          {sub.label}
                        </a>
                      ) : (
                        <Link to={sub.href} onClick={() => { setOpenDropdown(null); setMobileOpen(false); }}>
                          {sub.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
