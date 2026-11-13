// Global site navigation config, shared by the Navbar and the internal Site Map.
export interface DropdownItem {
  label: string
  href: string
  /** One line under the label in a grouped menu. */
  caption?: string
  /** Short note beside a nested shortcut. */
  hint?: string
  external?: boolean
  disabled?: boolean
  /** Shortcuts drawn indented beneath this page. */
  children?: DropdownItem[]
}

/** A headed run of links in a grouped dropdown, read top to bottom. */
export interface DropdownGroup {
  /** Heading over the group; on a featured group, the card's eyebrow. */
  label: string
  /** Draws the group's one link as the highlighted starting-point card. */
  featured?: boolean
  items: DropdownItem[]
}

export interface NavItem {
  label: string
  caption?: string
  href?: string
  dropdown?: DropdownItem[]
  /** Replaces the flat `dropdown` with headed groups and nested shortcuts. */
  groups?: DropdownGroup[]
  /** Disabled "coming soon" item — rendered greyed out, not navigable. */
  disabled?: boolean
}

/** A menu's links as groups; a flat dropdown becomes one "Explore" group. */
export const menuGroups = (item: NavItem): DropdownGroup[] =>
  item.groups ?? (item.dropdown ? [{ label: 'Explore', items: item.dropdown }] : [])

/** Every link a menu lists, nested shortcuts included, each page once. */
export const menuEntries = (item: NavItem): DropdownItem[] => {
  const seen = new Set<string>()
  return menuGroups(item)
    .flatMap((group) => group.items)
    .flatMap((entry) => [entry, ...(entry.children ?? [])])
    .filter((entry) => {
      if (entry.disabled) return true
      if (seen.has(entry.href)) return false
      seen.add(entry.href)
      return true
    })
}

export const navItems: NavItem[] = [
  {
    label: 'Background',
    caption: 'Explore the project background and its approach to just transitions.',
    dropdown: [
      { label: 'A Delta in Transition', href: '#', disabled: true },
      { label: 'Participatory Scenario Planning', href: '/pages/scenario-planning' },
      { label: 'What are current conditions?', href: '#', disabled: true },
    ],
  },
  {
    label: 'Co-Designing',
    caption: 'Explore the collaborative process, participant input, and workshop materials.',
    dropdown: [
      { label: 'Co-Design Experience', href: '/pages/co-design-dashboard' },
      { label: 'Workshop Reports', href: '#', disabled: true },
    ],
  },
  {
    label: 'Future Scenarios',
    caption: 'Explore possible futures, modeling, evaluation, and scenario performance.',
    groups: [
      {
        label: 'Start here',
        featured: true,
        items: [
          {
            label: 'Choose a Future',
            href: '/scenarios',
            caption:
              'Understand what are current operations, outflow variations, and five adaptation scenarios.',
          },
        ],
      },
      {
        label: 'Methods and Results',
        items: [
          {
            label: 'Salinity Modeling',
            href: '/scenarios/modeling',
            caption: 'See how salinity changes under each future',
            children: [
              {
                label: 'Salinity Pattern Explorer',
                href: '/pages/scenario-explorer',
                hint: 'Explore changes across stations and time',
              },
            ],
          },
          {
            label: 'Evaluation Criteria',
            href: '/scenarios/evaluation',
            caption: 'Learn about the methodology behind each criterion',
          },
        ],
      },
      {
        label: 'Scenario Ranking',
        items: [
          {
            label: 'By scenario',
            href: '/scenarios/ranking',
            caption: 'Rank futures and adjust what matters most',
          },
          {
            label: 'By criterion',
            href: '/scenarios/ranking/by-criterion',
            caption: 'See how each criterion score is built',
          },
        ],
      },
    ],
  },
  {
    label: 'Governance',
    disabled: true,
  },
  {
    label: 'Co-Learning',
    disabled: true,
  },
  {
    label: 'Resources',
    caption: 'Browse project documentation, learning materials, references, and related projects.',
    groups: [
      {
        label: 'Repository',
        items: [
          {
            label: 'Project Documentation',
            href: '/pages/project-documentation',
            caption: 'Workshop reports, findings and outreach materials',
          },
          {
            label: 'Service Learning',
            href: '/pages/service-learning',
            caption: 'Undergraduate design studios working with Delta communities',
          },
          {
            label: 'References & Resources',
            href: '/pages/resources',
            caption: 'Delta research, articles and modeling resources',
          },
        ],
      },
      {
        label: 'Related projects',
        items: [
          {
            label: 'Franks Tract Futures',
            href: 'https://franks-tract-futures-ucdavis.hub.arcgis.com/',
            caption: 'Co-designing the future of Franks Tract',
            external: true,
          },
          {
            label: 'Delta Island Adaptations',
            href: 'https://deltaislandadaptations-ucdavis.hub.arcgis.com/',
            caption: 'Adaptation futures for subsided Delta islands',
            external: true,
          },
          {
            label: 'Delta Adapts',
            href: 'https://www.deltacouncil.ca.gov/delta-plan/climate-change',
            caption: "The Delta Stewardship Council's climate change initiative",
            external: true,
          },
          {
            label: 'DSC Salinity Workshop Series',
            href: 'https://deltacouncil.ca.gov/pdf/science-program/2022-03-07-salinity-management-workshops-info-sheet-march-2022.pdf',
            caption: 'Delta Stewardship Council salinity management workshops (PDF)',
            external: true,
          },
        ],
      },
    ],
  },
]
