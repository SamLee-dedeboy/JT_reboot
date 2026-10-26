// Global site navigation config, shared by the Navbar and the internal Site Map.
export interface DropdownItem {
  label: string
  href: string
  external?: boolean
  disabled?: boolean
}

export interface NavItem {
  label: string
  caption?: string
  href?: string
  dropdown?: DropdownItem[]
  /** Disabled "coming soon" item — rendered greyed out, not navigable. */
  disabled?: boolean
}

export const navItems: NavItem[] = [
  {
    label: 'Background',
    caption: 'Explore the project background and its approach to just transitions.',
    dropdown: [
      { label: 'A Delta in Transition', href: '#', disabled: true },
      { label: 'Participatory Scenario Planning', href: '#', disabled: true },
      { label: 'What Is a Just Transition?', href: '#', disabled: true },
    ],
  },
  {
    label: 'Co-Designing',
    caption: 'Explore the collaborative process, participant input, and workshop materials.',
    dropdown: [
      { label: 'Co-Design Dashboard', href: '/pages/co-design-dashboard' },
      { label: 'Participant Responses', href: '#', disabled: true },
      { label: 'Workshop Reports', href: '#', disabled: true },
    ],
  },
  {
    label: 'Future Scenarios',
    caption: 'Explore possible futures, modeling, evaluation, and scenario performance.',
    dropdown: [
      { label: 'Choose a Future', href: '/scenarios' },
      { label: 'Modeling & Evaluation', href: '/scenarios/results' },
      { label: 'Performance & Ranking', href: '/scenarios/ranking' },
    ],
  },
  {
    label: 'Resources',
    caption: 'Browse governance, project documentation, and related resources.',
    dropdown: [
      { label: 'Governance & Implementation', href: '#', disabled: true },
      { label: 'Project Documentation', href: '/pages/project-documentation' },
      { label: 'References & Related Projects', href: '/pages/resources' },
    ],
  },
  {
    label: 'Internal',
    caption: 'Project tools and design references for the team.',
    dropdown: [
      { label: 'Scenario Explorer', href: '/pages/scenario-explorer/internal' },
      { label: 'D-1641 Station Explorer', href: '/pages/scenario-explorer/d1641' },
      { label: 'Regional Summary', href: '/pages/regional-summary' },
      { label: 'Design System', href: '/design-system' },
      { label: 'EJ Playground', href: '/pages/playground' },
      { label: 'Baseline Exploration', href: '/pages/baseline-exploration' },
      { label: 'Scenario Time Lapse', href: '/pages/scenario-time-lapse' },
      { label: 'KelpDiagram', href: '/pages/kelp-diagram' },
      { label: 'Watershed', href: '/pages/watershed' },
      { label: 'Rank Visualization', href: '/pages/rank-visualization' },
      { label: 'Breakout Tables', href: '/pages/breakout' },
      { label: 'Co-Design Timeline', href: '/pages/co-design-timeline' },
      { label: 'Tribal Stewardship Spectrum', href: '/pages/tribal-stewardship-spectrum' },
      { label: 'Eco-cultural Metrics', href: '/pages/ecocultural-metrics' },
      { label: 'Site Map', href: '/pages/site-map' },
    ],
  },
]
