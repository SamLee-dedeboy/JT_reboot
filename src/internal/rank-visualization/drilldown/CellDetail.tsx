// One cell's paper trail: the number, where it sits, and where it came from.
//
// A cell is a coordinate — criterion, scenario, place, period — and that is true
// whether the reader reached it from the pivot table or by clicking a region on
// a map. So this lives outside any one sketch, and takes only the coordinate.
// Labels come from the node's own facets, which is what makes it portable.
import { Box, ButtonBase, Dialog, Typography } from '@mui/material'
import { ProvenanceChip, TeamMark } from './DrillBits'
import { unitHeading } from './scales'
import { DOC_LABEL, fmtValue } from './model'
import type { CriterionNode } from './model'
import { sourcesFor } from './tree'
import type { Dim } from './usePivot'
import { describeCoords, emptyReason, valueAt } from './cellValue'

/**
 * Where the number came from. The note that accompanies it is ours, written to
 * explain. This is the document: what the subteam published, verbatim, and where
 * to find it. The two are kept apart on purpose, because the whole argument of
 * the page is which numbers are theirs.
 */
export function Provenance({ node }: { node?: CriterionNode }) {
  const sources = node ? sourcesFor(node.id) : []
  if (!node) return null
  return (
    <Box sx={{ display: 'grid', gap: 1, maxWidth: '78ch' }}>
      <Typography variant="eyebrow">Where this comes from</Typography>
      {sources.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'base.300' }}>
          No citation recorded for this one yet.
        </Typography>
      ) : (
        sources.map((source, i) => (
          <Box
            key={i}
            sx={{
              display: 'grid',
              gap: 0.4,
              pl: 1.5,
              borderLeft: 2,
              borderColor: source.doc === 'ours' ? 'primary.main' : 'border.strong',
            }}
          >
            <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
              {DOC_LABEL[source.doc]}
            </Typography>
            <Typography variant="chartLabel" sx={{ display: 'block' }}>
              {source.where}
            </Typography>
            <Typography variant="body2" sx={{ color: 'base.100' }}>
              {source.doc === 'ours' ? source.quote : `“${source.quote}”`}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  )
}

/**
 * The modal. It opens over whatever the reader was looking at and leaves it
 * untouched: asking where a number came from should not rearrange the thing the
 * number sits in.
 */
export function CellDetail({
  coords,
  onClose,
}: {
  coords: Record<Dim, string> | null
  onClose: () => void
}) {
  const cell = coords ? valueAt(coords) : undefined
  const node = cell?.node
  return (
    <Dialog
      open={!!coords}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: (theme) => ({
            // The same surface the sketch card uses, so the panel reads as part of
            // this page. MUI's default paper is light, and its elevation overlay
            // tints whatever you put underneath, so both are turned off.
            backgroundImage: 'none',
            bgcolor: 'base.700',
            color: 'base.50',
            border: 1,
            borderColor: 'border.default',
            borderRadius: 2,
            p: theme.jtSpacing.component.md,
          }),
        },
        backdrop: { sx: { bgcolor: 'translucent.700' } },
      }}
    >
      {coords && cell && node && (
        <Box sx={{ display: 'grid', gap: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <TeamMark team={node.team} size={13} />
            <Typography variant="chartTitle" component="h2">
              {node.label}
            </Typography>
          </Box>

          <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
            {describeCoords(coords, node)}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="numberArticle" component="div">
              {cell.value === null ? '—' : fmtValue(cell.value, cell.unit)}
            </Typography>
            <Typography variant="chartAxis" sx={{ color: 'base.300' }}>
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
              <ProvenanceChip
                provenance={cell.inferred ? 'inferred' : node.provenance}
                absent={cell.value === null}
              />
            </Box>
          </Box>

          {/* The citation leads. It is what the reader clicked for, and putting our
              own commentary in front of it makes them read us before the source. */}
          <Provenance node={node} />

          {node.note && (
            <Box sx={{ display: 'grid', gap: 0.75, mt: 1 }}>
              <Typography variant="eyebrow">Our reading</Typography>
              <Typography variant="body2" sx={{ color: 'base.100' }}>
                {node.note}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
            <ButtonBase
              onClick={onClose}
              sx={{
                typography: 'controlLabel',
                px: 1.1,
                py: 0.55,
                borderRadius: 999,
                border: 1,
                borderColor: 'border.strong',
                color: 'base.50',
                '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main' },
              }}
            >
              Close
            </ButtonBase>
          </Box>
        </Box>
      )}
    </Dialog>
  )
}
