// Turns the generated route/link scan plus the navbar config into a layered
// graph: navbar -> menu sections -> pages -> nested views, with in-page links.
import type { SiteMapLink, SiteMapRoute } from 'virtual:site-map'
import type { DropdownItem, NavItem } from '../../ui/navigation'
import type { ProposedPage, UISection } from './pageStructure'

export type SiteNodeKind = 'chrome' | 'section' | 'page' | 'planned' | 'block'
export type SiteEdgeKind = 'menu' | 'nested' | 'link' | 'block'

export interface SiteNode {
  id: string
  kind: SiteNodeKind
  label: string
  path: string | null
  column: number
  /** Nesting below the first page column, for indenting deeper views. */
  depth: number
  row: number
  route: SiteMapRoute | null
  internal: boolean
  /** Concrete values seen in links to a parameterised route, e.g. scenario slugs. */
  examples: string[]
  sections: string[]
  /** A page the proposal adds that AppRouter does not declare yet. */
  proposed?: boolean
  /** Where a proposed page's content lives today. */
  today?: string
  /** A UI section's description. */
  detail?: string
}

export interface SiteEdge {
  id: string
  kind: SiteEdgeKind
  from: string
  to: string
  dynamic: boolean
  sources: SiteMapLink[]
  /** A link the proposal calls for that is not in the code yet. */
  planned?: boolean
}

export interface UnresolvedTarget {
  target: string
  origin: string
  file: string | null
  line: number | null
}

export interface SiteGraph {
  nodes: SiteNode[]
  edges: SiteEdge[]
  rows: number
  selfLinks: Map<string, SiteMapLink[]>
  unresolved: UnresolvedTarget[]
  unreachable: SiteNode[]
}

export interface SiteGraphOptions {
  showInternal: boolean
  showPlanned: boolean
  /** Routes left out of the diagram entirely (e.g. unrelated internal tools). */
  hiddenPaths?: ReadonlySet<string>
  /** UI sections to show under a page, keyed by route path. */
  sections?: Record<string, UISection[]>
  /** Proposed pages and menu shown over the real routes. */
  proposal?: {
    pages: ProposedPage[]
    /** A replacement dropdown for one navbar section. */
    menu?: { section: string; items: DropdownItem[] }
    /** Routes the proposal replaces; they leave the map while it is shown. */
    replaced?: string[]
  }
}

const NAVBAR_ID = 'chrome:navbar'
const HOME_SECTION_ID = 'section:logo'
const ORPHAN_SECTION_ID = 'section:unlisted'
const INTERNAL_SECTION_LABEL = 'Internal'

export const pageId = (path: string) => `page:${path}`

const titleCase = (segment: string) =>
  segment
    .replace(/^:/, '')
    .replace(/Slug$/, '')
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')

function routeLabel(path: string) {
  if (path === '/') return 'Home'
  const segments = path.split('/').filter(Boolean)
  const last = segments[segments.length - 1]
  const param = segments.find((segment) => segment.startsWith(':'))
  if (last.startsWith(':')) return `${titleCase(last)} page`
  return param ? `${titleCase(last)} (per ${titleCase(param).toLowerCase()})` : titleCase(last)
}

const stripTarget = (target: string) => target.split(/[?#]/)[0].replace(/(.)\/$/, '$1')

/** Best route for a link target: static segments outrank parameters. */
export function matchRoute(target: string, routes: SiteMapRoute[]) {
  const segments = stripTarget(target).split('/').filter(Boolean)
  let best: { route: SiteMapRoute; score: number } | null = null
  for (const route of routes) {
    const routeSegments = route.path.split('/').filter(Boolean)
    if (routeSegments.length !== segments.length) continue
    let score = 0
    const matches = routeSegments.every((routeSegment, index) => {
      if (routeSegment === segments[index]) {
        score += 2
        return true
      }
      if (routeSegment.startsWith(':')) {
        score += segments[index].startsWith(':') ? 1 : 0
        return true
      }
      return false
    })
    if (matches && (!best || score > best.score)) best = { route, score }
  }
  return best?.route ?? null
}

function parentRoute(route: SiteMapRoute, routes: SiteMapRoute[]) {
  if (route.nestedUnder) return route.nestedUnder
  const candidates = routes
    .map((candidate) => candidate.path)
    .filter((path) => path !== '/' && path !== route.path && route.path.startsWith(`${path}/`))
  return candidates.sort((a, b) => b.length - a.length)[0] ?? null
}

const normalizePattern = (path: string) => path.replace(/:\w+/g, ':')

const isInternalRoute = (route: SiteMapRoute) => route.file?.startsWith('src/internal/') ?? false

export function buildSiteGraph(
  declaredRoutes: SiteMapRoute[],
  links: SiteMapLink[],
  declaredNav: NavItem[],
  options: SiteGraphOptions,
): SiteGraph {
  // Proposed pages join the real routes until AppRouter declares them.
  const proposal = options.proposal
  const declared = new Set(declaredRoutes.map((route) => normalizePattern(route.path)))
  const proposedPages = new Map(
    (proposal?.pages ?? []).map((page) => [normalizePattern(page.path), page]),
  )
  const proposedPaths = new Set(
    (proposal?.pages ?? [])
      .filter((page) => !declared.has(normalizePattern(page.path)))
      .map((page) => page.path),
  )
  const routes: SiteMapRoute[] = [
    ...declaredRoutes,
    ...[...proposedPaths].map((path) => ({
      path,
      component: 'Proposed',
      file: null,
      // Worked examples hang under the template page they fill in.
      nestedUnder: proposedPages.get(normalizePattern(path))?.exampleOf ?? null,
    })),
  ]
  const hiddenPaths = new Set([...(options.hiddenPaths ?? []), ...(proposal?.replaced ?? [])])
  const menu = proposal?.menu
  const navItems = menu
    ? declaredNav.map((item) =>
        item.label === menu.section ? { ...item, dropdown: menu.items } : item,
      )
    : declaredNav
  // A page is still a proposal until AppRouter declares it; a worked example
  // counts as built once the template page it fills in is declared.
  const isProposed = (path: string) => {
    if (!proposedPaths.has(path)) return false
    const template = proposedPages.get(normalizePattern(path))?.exampleOf
    return !template || !declared.has(normalizePattern(template))
  }
  const sectionsFor = (path: string) =>
    proposedPages.get(normalizePattern(path))?.sections ?? options.sections?.[path] ?? []
  const blockLinks: { from: string; to: string; planned: boolean }[] = []

  const nodes = new Map<string, SiteNode>()
  const edges = new Map<string, SiteEdge>()
  const unresolved: UnresolvedTarget[] = []
  const navListed = new Set<string>()
  const internalOnly = new Set<string>()
  let row = 0

  // Which routes the navbar lists, and which only appear under "Internal".
  const listedBy = new Map<string, Set<string>>()
  for (const item of navItems) {
    for (const entry of item.dropdown ?? []) {
      if (entry.disabled || entry.external) continue
      const route = matchRoute(entry.href, routes)
      if (!route) continue
      navListed.add(route.path)
      listedBy.set(route.path, (listedBy.get(route.path) ?? new Set()).add(item.label))
    }
  }
  for (const [path, sections] of listedBy) {
    if (sections.size === 1 && sections.has(INTERNAL_SECTION_LABEL)) internalOnly.add(path)
  }

  const childrenOf = new Map<string, SiteMapRoute[]>()
  for (const route of routes) {
    if (navListed.has(route.path) && !route.nestedUnder) continue
    const parent = parentRoute(route, routes)
    if (parent) childrenOf.set(parent, [...(childrenOf.get(parent) ?? []), route])
  }
  const isTopLevel = (route: SiteMapRoute) =>
    route.path === '/' ||
    (navListed.has(route.path) && !route.nestedUnder) ||
    !parentRoute(route, routes)

  // Internal-tool files count as internal unless a public menu also lists them.
  const isInternal = (route: SiteMapRoute) =>
    internalOnly.has(route.path) || (!listedBy.has(route.path) && isInternalRoute(route))
  const visible = (route: SiteMapRoute) =>
    !hiddenPaths.has(route.path) && (options.showInternal || !isInternal(route))

  const addEdge = (kind: SiteEdgeKind, from: string, to: string, link?: SiteMapLink) => {
    const id = `${kind}:${from}->${to}`
    const existing = edges.get(id)
    if (existing) {
      if (link) existing.sources.push(link)
      existing.dynamic = existing.dynamic && (link?.dynamic ?? true)
      return
    }
    edges.set(id, {
      id,
      kind,
      from,
      to,
      dynamic: link?.dynamic ?? false,
      sources: link ? [link] : [],
    })
  }

  const placeRoute = (
    route: SiteMapRoute,
    column: number,
    depth: number,
    section: string,
    label = proposedPages.get(normalizePattern(route.path))?.label ?? routeLabel(route.path),
  ) => {
    const id = pageId(route.path)
    const existing = nodes.get(id)
    if (existing) {
      if (!existing.sections.includes(section)) existing.sections.push(section)
      return
    }
    nodes.set(id, {
      id,
      kind: 'page',
      label,
      path: route.path,
      column,
      depth,
      row: row++,
      route,
      internal: isInternal(route),
      examples: [],
      sections: [section],
      proposed: isProposed(route.path),
      today: proposedPages.get(normalizePattern(route.path))?.today,
    })
    // The page's UI sections sit directly below it, one row each, sub-sections indented.
    const fromProposal = isProposed(route.path)
    const blockDepth = column === 3 ? depth + 1 : 0
    const addBlocks = (blocks: UISection[], parentId: string, level: number, key: string) => {
      blocks.forEach((block, index) => {
        const blockId = `block:${route.path}:${key}${index}`
        nodes.set(blockId, {
          id: blockId,
          kind: 'block',
          label: block.label,
          detail: block.detail,
          path: null,
          column: 3,
          depth: blockDepth + level,
          row: row++,
          route: null,
          internal: false,
          examples: [],
          sections: [section],
          proposed: fromProposal || block.planned,
        })
        addEdge('block', parentId, blockId)
        if (block.to) {
          blockLinks.push({ from: blockId, to: block.to, planned: fromProposal || !!block.planned })
        }
        if (block.children) addBlocks(block.children, blockId, level + 1, `${key}${index}.`)
      })
    }
    addBlocks(sectionsFor(route.path), id, 0, '')
    for (const child of childrenOf.get(route.path) ?? []) {
      if (!visible(child) || nodes.has(pageId(child.path))) continue
      placeRoute(child, 3, column === 3 ? depth + 1 : 0, section)
      addEdge('nested', id, pageId(child.path))
    }
  }

  const addSection = (id: string, label: string) => {
    nodes.set(id, {
      id,
      kind: 'section',
      label,
      path: null,
      column: 1,
      depth: 0,
      row: -1,
      route: null,
      internal: label === INTERNAL_SECTION_LABEL,
      examples: [],
      sections: [],
    })
    addEdge('menu', NAVBAR_ID, id)
  }

  nodes.set(NAVBAR_ID, {
    id: NAVBAR_ID,
    kind: 'chrome',
    label: 'Navbar',
    path: null,
    column: 0,
    depth: 0,
    row: -1,
    route: null,
    internal: false,
    examples: [],
    sections: [],
  })

  // The logo is the navbar's only route to Home.
  const home = routes.find((route) => route.path === '/')
  if (home) {
    addSection(HOME_SECTION_ID, 'Logo')
    placeRoute(home, 2, 0, 'Logo')
    addEdge('menu', HOME_SECTION_ID, pageId('/'))
  }

  for (const item of navItems) {
    if (item.label === INTERNAL_SECTION_LABEL && !options.showInternal) continue
    const sectionId = `section:${item.label}`
    addSection(sectionId, item.label)
    for (const entry of item.dropdown ?? []) {
      if (entry.disabled) {
        if (!options.showPlanned) continue
        const id = `planned:${item.label}:${entry.label}`
        nodes.set(id, {
          id,
          kind: 'planned',
          label: entry.label,
          path: null,
          column: 2,
          depth: 0,
          row: row++,
          route: null,
          internal: false,
          examples: [],
          sections: [item.label],
        })
        addEdge('menu', sectionId, id)
        continue
      }
      const route = entry.external ? null : matchRoute(entry.href, routes)
      if (!route) {
        unresolved.push({
          target: entry.href,
          origin: `Navbar › ${item.label}`,
          file: null,
          line: null,
        })
        continue
      }
      if (hiddenPaths.has(route.path)) continue
      placeRoute(route, route.nestedUnder ? 3 : 2, 0, item.label, entry.label)
      addEdge('menu', sectionId, pageId(route.path))
    }
  }

  // Routes the navbar never lists: reachable only through in-page links, if at all.
  const unlisted = routes.filter(
    (route) => isTopLevel(route) && visible(route) && !nodes.has(pageId(route.path)),
  )
  if (unlisted.length > 0) {
    addSection(ORPHAN_SECTION_ID, 'Not in navbar')
    for (const route of unlisted) {
      placeRoute(route, 2, 0, 'Not in navbar')
      addEdge('menu', ORPHAN_SECTION_ID, pageId(route.path))
    }
  }

  // Sections sit at the vertical centre of the rows they introduce.
  for (const section of nodes.values()) {
    if (section.kind !== 'section') continue
    const targetRows = [...edges.values()]
      .filter((edge) => edge.kind === 'menu' && edge.from === section.id)
      .map((edge) => nodes.get(edge.to))
      .filter((node): node is SiteNode => !!node && node.sections[0] === section.label)
      .map((node) => node.row)
    section.row =
      targetRows.length > 0 ? (Math.min(...targetRows) + Math.max(...targetRows)) / 2 : 0
  }
  const navbar = nodes.get(NAVBAR_ID)!
  navbar.row = Math.max(0, (row - 1) / 2)

  // In-page links between placed routes.
  const selfLinks = new Map<string, SiteMapLink[]>()
  for (const link of links) {
    const fromId = pageId(link.from)
    const target = matchRoute(link.to, routes)
    if (!target) {
      unresolved.push({ target: link.to, origin: link.from, file: link.file, line: link.line })
      continue
    }
    const toId = pageId(target.path)
    const toNode = nodes.get(toId)
    if (toNode && target.path.includes(':')) {
      const concrete = stripTarget(link.to)
      if (!concrete.includes(':') && !toNode.examples.includes(concrete))
        toNode.examples.push(concrete)
    }
    if (!nodes.has(fromId) || !toNode) continue
    if (fromId === toId) {
      selfLinks.set(fromId, [...(selfLinks.get(fromId) ?? []), link])
      continue
    }
    addEdge('link', fromId, toId, link)
  }

  // Where each UI section sends visitors.
  for (const blockLink of blockLinks) {
    const target = matchRoute(blockLink.to, routes)
    const toId = target ? pageId(target.path) : null
    if (!toId || !nodes.has(toId)) continue
    addEdge('link', blockLink.from, toId)
    const edge = edges.get(`link:${blockLink.from}->${toId}`)
    if (edge) edge.planned = blockLink.planned
  }

  // Unlisted pages nothing links to can only be reached by typing the URL.
  const linkedTo = new Set(
    [...edges.values()].filter((edge) => edge.kind !== 'menu').map((edge) => edge.to),
  )
  const unreachable = [...nodes.values()].filter(
    (node) =>
      node.kind === 'page' && node.sections[0] === 'Not in navbar' && !linkedTo.has(node.id),
  )

  return {
    nodes: [...nodes.values()],
    edges: [...edges.values()],
    rows: row,
    selfLinks,
    unresolved,
    unreachable,
  }
}
