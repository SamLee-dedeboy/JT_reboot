// Internal site map: how visitors move through the site, generated from
// AppRouter, the navbar config, and links found in page source. Opens on the
// site map, with the sections the Future Scenarios workflow still needs layered
// on; the visitor journey is a toggle away.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import siteMap from 'virtual:site-map'
import PageLayout from '../PageLayout'
import { navItems } from '../../ui/navigation'
import { buildSiteGraph, type SiteGraph, type SiteNode } from './siteMapModel'
import SiteMapDiagram from './SiteMapDiagram'
import ScenarioJourney from './ScenarioJourney'
import { currentSections, proposedPages, proposedSections } from './pageStructure'

type SiteMapView = 'full' | 'journey'

interface FilterState {
  showProposal: boolean
  showSections: boolean
  showLinks: boolean
  showInternal: boolean
  showPlanned: boolean
}

const filterLabels: Record<keyof FilterState, string> = {
  showProposal: 'Proposed additions',
  showSections: 'Page sections',
  showLinks: 'In-page links',
  showInternal: 'Internal tools',
  showPlanned: 'Planned menu items',
}

// Internal tools unrelated to the visitor journey stay off the map.
const hiddenPaths: ReadonlySet<string> = new Set([
  '/pages/regional-summary',
  '/design-system',
  '/pages/playground',
  '/pages/baseline-exploration',
  '/pages/scenario-time-lapse',
  '/pages/kelp-diagram',
  '/pages/watershed',
  '/pages/co-design-timeline',
  '/pages/site-map',
])

export default function SiteMapPage() {
  const [view, setView] = useState<SiteMapView>('full')

  return (
    <PageLayout title="Site Map" fullWidthContent plainContent>
      <Box sx={(theme) => ({ px: theme.jtSpacing.page.x, pb: theme.jtSpacing.section.sm })}>
        <Stack sx={(theme) => ({ gap: theme.jtSpacing.gap.sm, mb: theme.jtSpacing.component.md })}>
          <Typography
            variant="bodyLarge"
            sx={(theme) => ({
              color: 'base.100',
              maxWidth: theme.jtSpacing.paragraphMaxWidth.default,
            })}
          >
            Generated from <code>AppRouter</code>, the navbar config, scenario content, and the
            links each page's components point to. Edit a route or link and this map updates with
            it.
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={view}
            onChange={(_, next: SiteMapView | null) => next && setView(next)}
            aria-label="Site map view"
            size="small"
          >
            <ToggleButton value="full">Site map</ToggleButton>
            <ToggleButton value="journey">Future Scenarios journey</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {view === 'journey' && <ScenarioJourney />}
        {view === 'full' && <FullSiteMap />}
      </Box>
    </PageLayout>
  )
}

function FullSiteMap() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [filters, setFilters] = useState<FilterState>({
    showProposal: true,
    showSections: true,
    showLinks: true,
    showInternal: true,
    showPlanned: true,
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const graph = useMemo(
    () =>
      buildSiteGraph(siteMap.routes, siteMap.links, navItems, {
        showInternal: filters.showInternal,
        showPlanned: filters.showPlanned,
        hiddenPaths,
        sections: filters.showSections
          ? filters.showProposal
            ? { ...currentSections, ...proposedSections }
            : currentSections
          : undefined,
        proposal: filters.showProposal
          ? {
              pages: filters.showSections
                ? proposedPages
                : proposedPages.map((page) => ({ ...page, sections: [] })),
            }
          : undefined,
      }),
    [filters.showInternal, filters.showPlanned, filters.showProposal, filters.showSections],
  )
  const selected = graph.nodes.find((node) => node.id === selectedId) ?? null
  const linkCount = graph.edges.filter((edge) => edge.kind === 'link').length

  return (
    <>
      {/* Summary and filters */}
      <Stack sx={(theme) => ({ gap: theme.jtSpacing.gap.sm, mb: theme.jtSpacing.component.md })}>
        <Stack direction="row" sx={(theme) => ({ flexWrap: 'wrap', gap: theme.jtSpacing.gap.xs })}>
          <Stat label="Routes" value={siteMap.routes.length - hiddenPaths.size} />
          <Stat label="In-page links" value={linkCount} />
          <Stat label="Unlinked pages" value={graph.unreachable.length} warn />
          <Stat label="Unmatched targets" value={graph.unresolved.length} warn />
        </Stack>
        <Stack direction="row" sx={(theme) => ({ flexWrap: 'wrap', gap: theme.jtSpacing.gap.xs })}>
          {(Object.keys(filterLabels) as (keyof FilterState)[]).map((key) => (
            <Chip
              key={key}
              label={filterLabels[key]}
              variant={filters[key] ? 'filled' : 'outlined'}
              color={filters[key] ? 'secondary' : 'default'}
              aria-pressed={filters[key]}
              onClick={() => setFilters((current) => ({ ...current, [key]: !current[key] }))}
            />
          ))}
        </Stack>
      </Stack>

      {/* Diagram with details; desktop and mobile get different layouts */}
      {isDesktop ? (
        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: { md: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 340px' },
            gap: theme.jtSpacing.gap.md,
            alignItems: 'start',
          })}
        >
          <SiteMapDiagram
            graph={graph}
            showLinks={filters.showLinks}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <Box sx={{ position: { lg: 'sticky' }, top: { lg: 96 } }}>
            <DetailsPanel graph={graph} node={selected} />
          </Box>
        </Box>
      ) : (
        <MobileOutline graph={graph} showLinks={filters.showLinks} />
      )}

      <AuditList graph={graph} />
    </>
  )
}

function Stat({ label, value, warn = false }: { label: string; value: number; warn?: boolean }) {
  return (
    <Box
      sx={(theme) => ({
        px: theme.jtSpacing.component.sm,
        py: theme.jtSpacing.component.xs,
        border: 1,
        borderColor: warn && value > 0 ? theme.chart.siteMap.warning : 'border.default',
        borderRadius: 1,
        bgcolor: 'translucent.100',
      })}
    >
      <Typography variant="chartValueLarge" component="p">
        {value}
      </Typography>
      <Typography variant="captionSmall" component="p" sx={{ color: 'base.100' }}>
        {label}
      </Typography>
    </Box>
  )
}

const openablePath = (node: SiteNode) => {
  if (!node.path) return null
  if (!node.path.includes(':')) return node.path
  return node.examples[0] ?? null
}

function SourceLine({ file, line }: { file: string; line?: number }) {
  return (
    <Typography variant="captionSmall" component="span" sx={{ color: 'base.200' }}>
      {line === undefined ? file : `${file}:${line}`}
    </Typography>
  )
}

function DetailsPanel({ graph, node }: { graph: SiteGraph; node: SiteNode | null }) {
  if (!node) {
    return (
      <Box sx={panelSx}>
        <Typography variant="meta" sx={{ color: 'base.100' }}>
          Select a node to see where it is reached from and where it leads. Hover to trace its
          connections.
        </Typography>
      </Box>
    )
  }

  const byId = new Map(graph.nodes.map((entry) => [entry.id, entry]))
  const incoming = graph.edges.filter((edge) => edge.to === node.id)
  const outgoing = graph.edges.filter((edge) => edge.from === node.id)
  const selfLinks = graph.selfLinks.get(node.id) ?? []
  const target = openablePath(node)

  return (
    <Stack sx={(theme) => ({ ...panelSx, gap: theme.jtSpacing.gap.sm })}>
      <Box>
        <Typography variant="cardTitle" component="h2">
          {node.label}
        </Typography>
        {node.path && (
          <Typography variant="meta" component="p" sx={{ color: 'secondary.main' }}>
            {node.path}
          </Typography>
        )}
        {node.route?.file && <SourceLine file={node.route.file} />}
        {node.detail && (
          <Typography variant="meta" component="p" sx={{ color: 'base.100' }}>
            {node.detail}
          </Typography>
        )}
        {node.proposed && (
          <Typography variant="captionSmall" component="p" sx={{ color: 'base.100', mt: 0.5 }}>
            Proposed
            {node.kind === 'page' ? ' page, not in AppRouter yet' : ' section, not built yet'}
            {node.today && `. Today this content is at ${node.today}.`}
          </Typography>
        )}
      </Box>
      {target && !node.proposed && (
        <Button component={Link} to={target} variant="outlined" color="secondary" size="small">
          Open {target}
        </Button>
      )}
      {node.examples.length > 0 && (
        <EdgeGroup title="Linked instances">
          {node.examples.map((example) => (
            <Typography key={example} variant="captionSmall" component="li">
              {example}
            </Typography>
          ))}
        </EdgeGroup>
      )}
      <EdgeGroup title={`Reached from (${incoming.length})`}>
        {incoming.map((edge) => (
          <Typography key={edge.id} variant="captionSmall" component="li">
            {byId.get(edge.from)?.label} <Kind kind={edge.kind} />
            {edge.sources.map((source) => (
              <Box key={`${source.file}:${source.line}`} component="span" sx={{ display: 'block' }}>
                <SourceLine file={source.file} line={source.line} />
              </Box>
            ))}
          </Typography>
        ))}
      </EdgeGroup>
      <EdgeGroup title={`Leads to (${outgoing.length})`}>
        {outgoing.map((edge) => (
          <Typography key={edge.id} variant="captionSmall" component="li">
            {byId.get(edge.to)?.label} <Kind kind={edge.planned ? 'planned' : edge.kind} />
            {edge.sources.map((source) => (
              <Box key={`${source.file}:${source.line}`} component="span" sx={{ display: 'block' }}>
                {source.to} · <SourceLine file={source.file} line={source.line} />
              </Box>
            ))}
          </Typography>
        ))}
      </EdgeGroup>
      {selfLinks.length > 0 && (
        <EdgeGroup title={`Links within the page (${selfLinks.length})`}>
          {selfLinks.map((source) => (
            <Typography key={`${source.file}:${source.line}`} variant="captionSmall" component="li">
              {source.to} · <SourceLine file={source.file} line={source.line} />
            </Typography>
          ))}
        </EdgeGroup>
      )}
    </Stack>
  )
}

const panelSx = {
  p: 2.5,
  border: 1,
  borderColor: 'border.default',
  borderRadius: 1,
  bgcolor: 'translucent.100',
} as const

function Kind({ kind }: { kind: string }) {
  return (
    <Typography variant="captionSmall" component="span" sx={{ color: 'base.200' }}>
      (
      {{
        link: 'in-page link',
        nested: 'nested route',
        block: 'page section',
        planned: 'proposed link',
      }[kind] ?? 'menu'}
      )
    </Typography>
  )
}

function EdgeGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="chartLabel" component="h3" sx={{ color: 'base.100', mb: 0.75 }}>
        {title}
      </Typography>
      <Stack component="ul" sx={{ m: 0, pl: 2.25, gap: 0.75 }}>
        {children}
      </Stack>
    </Box>
  )
}

// Small screens get a nested outline instead of the wide diagram.
function MobileOutline({ graph, showLinks }: { graph: SiteGraph; showLinks: boolean }) {
  const byId = new Map(graph.nodes.map((node) => [node.id, node]))
  const sections = graph.nodes
    .filter((node) => node.kind === 'section')
    .sort((a, b) => a.row - b.row)

  return (
    <Stack sx={(theme) => ({ gap: theme.jtSpacing.gap.md })}>
      {sections.map((section) => {
        const members = graph.nodes
          .filter((node) => node.sections[0] === section.label && node.kind !== 'section')
          .sort((a, b) => a.row - b.row)
        return (
          <Box key={section.id} sx={panelSx}>
            <Typography variant="chartLabel" component="h2" sx={{ color: 'secondary.main', mb: 1 }}>
              {section.label}
            </Typography>
            <Stack component="ul" sx={{ m: 0, pl: 0, listStyle: 'none', gap: 1.25 }}>
              {members.map((node) => {
                const target = openablePath(node)
                const outgoing = graph.edges.filter(
                  (edge) => edge.kind === 'link' && edge.from === node.id,
                )
                return (
                  <Box component="li" key={node.id} sx={{ pl: node.column === 3 ? 2 : 0 }}>
                    <Typography
                      variant="controlLabel"
                      component={target ? Link : 'span'}
                      to={target ?? undefined}
                      sx={{
                        color: node.kind === 'planned' ? 'base.300' : 'common.white',
                        textDecoration: 'none',
                      }}
                    >
                      {node.label}
                    </Typography>
                    {node.path && (
                      <Typography variant="captionSmall" component="p" sx={{ color: 'base.200' }}>
                        {node.path}
                      </Typography>
                    )}
                    {showLinks && outgoing.length > 0 && (
                      <Typography variant="captionSmall" component="p" sx={{ color: 'base.100' }}>
                        → {outgoing.map((edge) => byId.get(edge.to)?.label).join(', ')}
                      </Typography>
                    )}
                  </Box>
                )
              })}
            </Stack>
          </Box>
        )
      })}
    </Stack>
  )
}

function AuditList({ graph }: { graph: SiteGraph }) {
  if (graph.unreachable.length === 0 && graph.unresolved.length === 0) return null
  return (
    <Box
      component="section"
      sx={(theme) => ({ ...panelSx, mt: theme.jtSpacing.component.lg, maxWidth: 960 })}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 1.5 }}>
        Navigation gaps
      </Typography>
      {graph.unreachable.length > 0 && (
        <EdgeGroup title="Not in the navbar and not linked from any page">
          {graph.unreachable.map((node) => (
            <Typography key={node.id} variant="captionSmall" component="li">
              {node.path} · {node.route?.file}
            </Typography>
          ))}
        </EdgeGroup>
      )}
      {graph.unresolved.length > 0 && (
        <Box sx={{ mt: 1.5 }}>
          <EdgeGroup title="Link targets with no matching route">
            {graph.unresolved.map((entry) => (
              <Typography
                key={`${entry.origin}:${entry.target}:${entry.line}`}
                variant="captionSmall"
                component="li"
              >
                {entry.target} from {entry.origin}
                {entry.file && entry.line !== null && (
                  <>
                    {' · '}
                    <SourceLine file={entry.file} line={entry.line} />
                  </>
                )}
              </Typography>
            ))}
          </EdgeGroup>
        </Box>
      )}
      <Typography variant="captionSmall" component="p" sx={{ color: 'base.200', mt: 1.5 }}>
        Links are found statically in each route's imports, including path helpers that return a
        route template (such as <code>methodologyPath</code>). Helpers built from other values (such
        as <code>coDesignPath</code>) are not detected, a link counts even when it only renders
        under some conditions, and shared content files can be counted for every page that imports
        them.
      </Typography>
    </Box>
  )
}
