// One cell's paper trail: the number, where it sits, and where it came from.
//
// A cell is a coordinate — criterion, scenario, place, period — and that is true
// whether the reader reached it from the pivot table or by clicking a region on
// a map. So this lives outside any one sketch, and takes only the coordinate.
// Labels come from the node's own facets, which is what makes it portable.
//
// Set in the site's design system: an outlined card on base.700, sentence-case
// headings, body-sized text for the quote and our note, and the theme's buttons.
import { Box, Button, Dialog, Divider, Stack, Typography } from '@mui/material'
import { jtSpacing } from '../../../theme'
import { TeamMark } from './DrillBits'
import { unitHeading } from './scales'
import { DOC_LABEL, PROVENANCE_LABEL, fmtValue } from './model'
import type { CriterionNode, Provenance as ProvenanceKind } from './model'
import { sourcesFor } from './tree'
import { describeCoords, emptyReason, valueAt } from './cellValue'
import type { Coords } from './cellValue'

/** A small outlined label: whose number this is. */
function ProvenanceBadge({ provenance, absent }: { provenance: ProvenanceKind; absent: boolean }) {
  const label = absent && provenance !== 'unscored' ? 'pending' : PROVENANCE_LABEL[provenance]
  const theirs = !absent && provenance === 'reported'
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        px: 1,
        py: 0.25,
        borderRadius: 999,
        border: 1,
        borderStyle: provenance === 'inferred' || absent ? 'dashed' : 'solid',
        borderColor: theirs ? 'primary.main' : 'border.strong',
        color: theirs ? 'primary.main' : 'base.200',
      }}
    >
      <Typography variant="captionSmall" sx={{ color: 'inherit' }}>
        {label}
      </Typography>
    </Box>
  )
}

/**
 * Where the number came from. The note that accompanies it is ours, written to
 * explain. This is the document: what the subteam published, verbatim, and where
 * to find it. The two are kept apart on purpose, because the whole argument of
 * the page is which numbers are theirs.
 */
export function Provenance({ node }: { node?: CriterionNode }) {
  const sources = node ? (node.sources ?? sourcesFor(node.id)) : []
  if (!node) return null
  return (
    <Stack spacing={jtSpacing.gap.sm} sx={{ maxWidth: '78ch' }}>
      <Typography variant="navigationLabel" component="h3">
        Source
      </Typography>
      {sources.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'base.200' }}>
          No source has been recorded yet.
        </Typography>
      ) : (
        sources.map((source, i) => (
          <Stack
            key={i}
            spacing={0.75}
            sx={{
              p: jtSpacing.component.sm,
              borderRadius: 1,
              border: 1,
              borderColor: 'border.subtle',
              borderLeft: 3,
              borderLeftColor: source.doc === 'ours' ? 'primary.main' : 'border.strong',
              bgcolor: 'translucent.100',
            }}
          >
            <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
              {DOC_LABEL[source.doc]}
            </Typography>
            <Typography variant="meta" sx={{ color: 'common.white' }}>
              {source.where}
            </Typography>
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              {source.doc === 'ours' ? source.quote : `“${source.quote}”`}
            </Typography>
          </Stack>
        ))
      )}
    </Stack>
  )
}

/**
 * The modal. It opens over whatever the reader was looking at and leaves it
 * untouched: asking where a number came from should not rearrange the thing the
 * number sits in.
 */
export function CellDetail({ coords, onClose }: { coords: Coords | null; onClose: () => void }) {
  const cell = coords ? valueAt(coords) : undefined
  const node = cell?.node
  return (
    <Dialog
      open={!!coords}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="cell-detail-title"
      slotProps={{
        paper: {
          sx: {
            // MUI's default paper is light and its elevation overlay tints what is
            // underneath, so both give way to the site's card surface.
            backgroundImage: 'none',
            bgcolor: 'base.700',
            color: 'base.50',
            border: 1,
            borderColor: 'border.subtle',
            borderRadius: 1,
            p: jtSpacing.component.lg,
          },
        },
        backdrop: { sx: { bgcolor: 'translucent.700' } },
      }}
    >
      {coords && cell && node && (
        <Stack spacing={jtSpacing.gap.md}>
          {/* What was clicked: the measure and where it sits. */}
          <Stack spacing={0.75}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TeamMark team={node.team} size={18} />
              <Typography variant="h4" component="h2" id="cell-detail-title">
                {node.label}
              </Typography>
            </Box>
            <Typography variant="meta" sx={{ color: 'base.200' }}>
              {describeCoords(coords, node)}
            </Typography>
          </Stack>

          {/* The number itself, its unit, and whose number it is. */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h3" component="p" sx={{ color: 'common.white' }}>
              {cell.value === null ? '—' : fmtValue(cell.value, cell.unit)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'base.100' }}>
              {/* A node with numbers elsewhere is not a node with no number: saying
                  "no number of its own" about Env. Justice under A Tunnel blames
                  the metric for a gap that belongs to one scenario. */}
              {cell.value !== null
                ? unitHeading(cell.unit).toLowerCase()
                : Object.keys(node.values).length === 0
                  ? emptyReason('criterion', node.id)
                  : 'no result published for this scenario'}
            </Typography>
            <Box sx={{ ml: 'auto' }}>
              <ProvenanceBadge
                provenance={cell.inferred ? 'inferred' : node.provenance}
                absent={cell.value === null}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'border.subtle' }} />

          {/* The citation leads. It is what the reader clicked for, and putting our
              own commentary in front of it makes them read us before the source. */}
          <Provenance node={node} />

          {node.note && (
            <Stack spacing={jtSpacing.gap.sm}>
              <Typography variant="navigationLabel" component="h3">
                How we read it
              </Typography>
              <Typography variant="body2" sx={{ color: 'base.100' }}>
                {node.note}
              </Typography>
            </Stack>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          </Box>
        </Stack>
      )}
    </Dialog>
  )
}
