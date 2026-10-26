// Vite plugin that serves `virtual:site-map`: the route table parsed from
// src/app/AppRouter.tsx (plus nested `/*` routers) and every internal link each
// route's module graph points at. The internal Site Map page renders it, so the
// diagram follows the code instead of a hand-maintained copy. Only paths, file
// names, and line numbers are emitted; no source text reaches the bundle.
import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'

const VIRTUAL_ID = 'virtual:site-map'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const ROUTER_FILE = 'src/app/AppRouter.tsx'

// Site chrome mounted on most pages. Its links are modeled once (the navbar
// config is imported directly by the page) rather than attributed to every route.
const CHROME_FILES = new Set(['src/ui/Navbar.tsx', 'src/ui/navigation.ts', 'src/ui/Footer.tsx'])
const IGNORED_DIRS = ['/archived/', '/legacy/']

export interface SiteMapRoute {
  path: string
  component: string
  file: string | null
  nestedUnder: string | null
}

export interface SiteMapLink {
  from: string
  to: string
  file: string
  line: number
  dynamic: boolean
}

const toPosix = (file: string) => file.split(path.sep).join('/')

function resolveModule(root: string, fromFile: string, specifier: string): string | null {
  if (!specifier.startsWith('.')) return null
  const base = path.resolve(root, path.dirname(fromFile), specifier)
  const candidates = [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    path.join(base, 'index.tsx'),
    path.join(base, 'index.ts'),
  ]
  const hit = candidates.find((file) => /\.tsx?$/.test(file) && fs.existsSync(file))
  return hit ? toPosix(path.relative(root, hit)) : null
}

function read(root: string, file: string) {
  try {
    return fs.readFileSync(path.join(root, file), 'utf8')
  } catch {
    return ''
  }
}

// Identifier -> file for default imports and `lazy(() => import(...))` bindings.
function componentImports(root: string, file: string, source: string) {
  const map = new Map<string, string>()
  const patterns = [
    /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g,
    /const\s+(\w+)\s*=\s*lazy\(\s*\(\)\s*=>\s*import\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]
  for (const pattern of patterns) {
    for (const [, name, specifier] of source.matchAll(pattern)) {
      const resolved = resolveModule(root, file, specifier)
      if (resolved) map.set(name, resolved)
    }
  }
  return map
}

function joinRoute(prefix: string, child: string) {
  if (!prefix) return child
  if (!child || child === '/') return prefix
  return `${prefix.replace(/\/$/, '')}/${child.replace(/^\//, '')}`
}

function parseRoutes(root: string, file: string, prefix: string, nestedUnder: string | null) {
  const source = read(root, file)
  const imports = componentImports(root, file, source)
  const routes: SiteMapRoute[] = []
  const routePattern = /<Route\s+(index|path=["']([^"']*)["'])\s*element=\{\s*(?:\w+\(\s*)?<(\w+)/g

  for (const match of source.matchAll(routePattern)) {
    const [, kind, rawPath = '', component] = match
    const isSplat = rawPath.endsWith('/*')
    const routePath = joinRoute(prefix, kind === 'index' ? '' : rawPath.replace(/\/\*$/, ''))
    const componentFile = imports.get(component) ?? null
    routes.push({ path: routePath, component, file: componentFile, nestedUnder })
    if (isSplat && componentFile) {
      routes.push(...parseRoutes(root, componentFile, routePath, routePath))
    }
  }
  // An index route repeats its parent's path; keep the parent entry only.
  const seen = new Set<string>()
  return routes.filter((route) => {
    if (seen.has(route.path)) return false
    seen.add(route.path)
    return true
  })
}

interface ImportEdge {
  file: string
  // Export names wanted from `file`; null means the whole module.
  names: string[] | null
  reexport: boolean
}

const STATEMENT_PATTERN = /\b(import|export)\s+(type\s+)?([\w*{}\s,$]*?)\s*from\s+['"]([^'"]+)['"]/g

// Which export names a clause such as `X, { a, b as c }` or `* as ns` asks for.
function clauseNames(
  keyword: string,
  clause: string,
): { wanted: string[] | null; exposed: string[] } {
  if (clause.includes('*')) {
    const alias = clause.match(/\*\s+as\s+(\w+)/)?.[1]
    return { wanted: null, exposed: alias ? [alias] : ['*'] }
  }
  const wanted: string[] = []
  const exposed: string[] = []
  const defaultName = clause.match(/^\s*(\w+)/)?.[1]
  if (defaultName && keyword === 'import') {
    wanted.push('default')
    exposed.push(defaultName)
  }
  for (const specifier of clause.match(/\{([^}]*)\}/)?.[1].split(',') ?? []) {
    const [original, alias] = specifier
      .replace(/^\s*type\s+/, '')
      .trim()
      .split(/\s+as\s+/)
    if (!original || specifier.trim().startsWith('type ')) continue
    wanted.push(original)
    exposed.push(alias ?? original)
  }
  return { wanted, exposed }
}

function importsOf(root: string, file: string, source: string): ImportEdge[] {
  const edges: ImportEdge[] = []
  for (const [, keyword, typeOnly, clause, specifier] of source.matchAll(STATEMENT_PATTERN)) {
    if (typeOnly) continue
    const resolved = resolveModule(root, file, specifier)
    if (!resolved) continue
    const { wanted } = clauseNames(keyword, clause)
    if (wanted && wanted.length === 0) continue
    edges.push({ file: resolved, names: wanted, reexport: keyword === 'export' })
  }
  for (const [, specifier] of source.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    const resolved = resolveModule(root, file, specifier)
    if (resolved) edges.push({ file: resolved, names: null, reexport: false })
  }
  return edges
}

// Follow a barrel only through the re-exports a consumer actually asked for, so
// importing one item from `content/index.ts` does not pull in every link in it.
function reachableFrom(root: string, file: string, source: string, names: string[] | null) {
  const edges = importsOf(root, file, source)
  if (names === null) return { ownBody: true, next: edges }

  const next: ImportEdge[] = []
  const satisfied = new Set<string>()
  for (const [, , typeOnly, clause, specifier] of source.matchAll(STATEMENT_PATTERN)) {
    if (typeOnly || !source.includes(`export ${clause}`)) continue
    const resolved = resolveModule(root, file, specifier)
    if (!resolved) continue
    if (clause.trim() === '*') {
      next.push({ file: resolved, names, reexport: true })
      continue
    }
    const { wanted, exposed } = clauseNames('export', clause)
    const picked = (wanted ?? []).filter((_, index) => names.includes(exposed[index]))
    exposed.filter((name) => names.includes(name)).forEach((name) => satisfied.add(name))
    if (picked.length > 0) next.push({ file: resolved, names: picked, reexport: true })
  }
  const ownBody = names.some((name) => !satisfied.has(name))
  if (ownBody) next.push(...edges.filter((edge) => !edge.reexport))
  return { ownBody, next }
}

const LINK_PATTERN =
  /(?:\b(?:to|href)\s*[:=]\s*\{?\s*|\bnavigate\(\s*)(?:'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`)/g

// Path helpers such as `export const methodologyPath = (teamId: string) => `/scenarios/...``.
const HELPER_PATTERN = /export const (\w+) = \([^)]*\)(?:\s*:\s*\w+)?\s*=>\s*`(\/[^`]*)`/g

type PathHelpers = Map<string, string>

function helpersIn(source: string, helpers: PathHelpers) {
  for (const [, name, template] of source.matchAll(HELPER_PATTERN)) helpers.set(name, template)
}

const toPattern = (raw: string) =>
  raw.replace(/\$\{[^}]*\}/g, ':param').replace(/(?::param)+/g, ':param')

function linksIn(source: string, file: string, from: string, helpers: PathHelpers): SiteMapLink[] {
  const links: SiteMapLink[] = []
  const lineAt = (index: number | undefined) => source.slice(0, index).split('\n').length
  for (const match of source.matchAll(LINK_PATTERN)) {
    const template = match[3]
    const raw = match[1] ?? match[2] ?? template ?? ''
    if (!raw.startsWith('/') || raw.startsWith('//')) continue
    const to = toPattern(raw)
    const pathname = to.split(/[?#]/)[0]
    // Asset URLs such as /exports/report.pdf are not page routes.
    if (/\.[a-z0-9]+$/i.test(pathname)) continue
    links.push({ from, to, file, line: lineAt(match.index), dynamic: to !== raw })
  }
  // Links built by a path helper: `to={methodologyPath(id)}`, `hrefFor={methodologyPath}`,
  // or `hrefFor={(id) => teamResultsPath(slug, id)}`.
  for (const [name, template] of helpers) {
    const call = new RegExp(
      `\\b(?:to|href|hrefFor)\\s*[:=]\\s*\\{?\\s*(?:\\([^)]*\\)\\s*=>\\s*)?${name}\\b`,
      'g',
    )
    for (const match of source.matchAll(call)) {
      links.push({ from, to: toPattern(template), file, line: lineAt(match.index), dynamic: true })
    }
  }
  return links
}

export function buildSiteMap(root: string) {
  const routes = parseRoutes(root, ROUTER_FILE, '', null)
  const entryFiles = new Set(routes.map((route) => route.file).filter(Boolean))
  const links: SiteMapLink[] = []
  const helpers: PathHelpers = new Map()
  // Each route's own sources; links are read once every path helper is known.
  const scanned: { from: string; file: string; source: string }[] = []

  for (const route of routes) {
    if (!route.file) continue
    const visited = new Set<string>()
    const queue: ImportEdge[] = [{ file: route.file, names: null, reexport: false }]
    while (queue.length > 0) {
      const { file, names } = queue.shift()!
      const key = `${file}|${names?.slice().sort().join(',') ?? '*'}`
      if (visited.has(key) || CHROME_FILES.has(file)) continue
      if (IGNORED_DIRS.some((dir) => file.includes(dir))) continue
      // Another route's page belongs to that route (e.g. a nested router child).
      if (file !== route.file && entryFiles.has(file)) continue
      visited.add(key)
      const source = read(root, file)
      const { ownBody, next } = reachableFrom(root, file, source, names)
      helpersIn(source, helpers)
      if (ownBody) scanned.push({ from: route.path, file, source })
      queue.push(...next)
    }
  }
  for (const { from, file, source } of scanned) links.push(...linksIn(source, file, from, helpers))

  // A nested router's own links stay with the parent route; drop exact duplicates.
  const unique = new Map(
    links.map((link) => [`${link.from}|${link.to}|${link.file}|${link.line}`, link]),
  )
  return { routes, links: [...unique.values()] }
}

export default function siteMapPlugin(): Plugin {
  let root = process.cwd()
  let server: ViteDevServer | undefined

  return {
    name: 'jt-site-map',
    configResolved(config) {
      root = config.root
    },
    configureServer(devServer) {
      server = devServer
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined
    },
    load(id) {
      if (id !== RESOLVED_ID) return undefined
      const siteMap = buildSiteMap(root)
      return `export default ${JSON.stringify(siteMap)}`
    },
    // Any source edit can add a route or link, so rebuild the map alongside it.
    handleHotUpdate({ file, modules }) {
      if (!server || !/[\\/]src[\\/].*\.tsx?$/.test(file)) return undefined
      const siteMapModule = server.moduleGraph.getModuleById(RESOLVED_ID)
      if (!siteMapModule) return undefined
      server.moduleGraph.invalidateModule(siteMapModule)
      return [...modules, siteMapModule]
    },
  }
}
