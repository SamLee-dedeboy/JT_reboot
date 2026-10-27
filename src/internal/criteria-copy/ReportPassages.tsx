// The passages of a criterion's "Story Behind the Criterion" report that sit behind
// one editor section, folded away under a toggle. Extracted by
// scripts/extract-criterion-reports.py; read-only, for checking drafts against the source.
import {
  Box,
  Button,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { jtSpacing } from '../../theme'
import type { CriterionSource, ReportBlock } from './copyFile'

export default function ReportPassages({
  source,
  sectionId,
}: {
  source?: CriterionSource
  sectionId: string
}) {
  const [open, setOpen] = useState(false)
  const blocks = source?.sections[sectionId] ?? []

  if (!source)
    return (
      <Typography
        variant="captionSmall"
        component="p"
        sx={{ color: 'base.200', mt: jtSpacing.gap.sm }}
      >
        No report text extracted for this criterion.
      </Typography>
    )
  if (!blocks.length)
    return (
      <Typography
        variant="captionSmall"
        component="p"
        sx={{ color: 'base.200', mt: jtSpacing.gap.sm }}
      >
        The report ({source.report}) has no matching passage for this section.
      </Typography>
    )

  return (
    <Box sx={{ mt: jtSpacing.gap.sm }}>
      <Button
        size="small"
        variant="outlined"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {open ? 'Hide the report text' : 'Show the report text'}
      </Button>
      <Typography
        variant="captionSmall"
        component="span"
        sx={{ color: 'base.200', ml: jtSpacing.gap.sm }}
      >
        {source.report}
      </Typography>
      <Collapse in={open} unmountOnExit>
        <Box
          sx={{
            mt: jtSpacing.gap.sm,
            p: jtSpacing.component.md,
            maxHeight: '70vh',
            overflowY: 'auto',
            border: 1,
            borderColor: 'border.subtle',
          }}
        >
          {groupItems(blocks).map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </Box>
      </Collapse>
    </Box>
  )
}

type Grouped = ReportBlock | { type: 'list'; items: string[] }

/** Runs of list items become one list. */
function groupItems(blocks: ReportBlock[]): Grouped[] {
  const out: Grouped[] = []
  for (const block of blocks) {
    const last = out[out.length - 1]
    if (block.type === 'item') {
      if (last?.type === 'list') last.items.push(block.text)
      else out.push({ type: 'list', items: [block.text] })
    } else out.push(block)
  }
  return out
}

function Block({ block }: { block: Grouped }) {
  const gap = { mt: jtSpacing.gap.sm }
  switch (block.type) {
    case 'heading':
      return (
        <Typography
          variant={block.level === 1 ? 'cardTitle' : 'navigationLabel'}
          component="p"
          sx={{ mt: jtSpacing.component.sm, '&:first-of-type': { mt: 0 } }}
        >
          {block.text}
        </Typography>
      )
    case 'list':
      return (
        <Box component="ul" sx={{ ...gap, mb: 0, pl: jtSpacing.component.md }}>
          {block.items.map((item, index) => (
            <Typography key={index} component="li" variant="body2" sx={{ color: 'base.100' }}>
              {item}
            </Typography>
          ))}
        </Box>
      )
    case 'table':
      return (
        <Box sx={{ ...gap, overflowX: 'auto' }}>
          <Table size="small">
            <TableBody>
              {block.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      sx={{ color: 'base.100', borderColor: 'border.subtle' }}
                    >
                      <Typography variant="captionSmall">{cell}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )
    default:
      return (
        <Typography variant="body2" sx={{ ...gap, color: 'base.100', whiteSpace: 'pre-line' }}>
          {block.text}
        </Typography>
      )
  }
}
