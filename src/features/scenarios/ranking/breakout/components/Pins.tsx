// Pinned views and their notes, exported as Markdown for the report-out.
import DownloadIcon from '@mui/icons-material/Download'
import PushPinIcon from '@mui/icons-material/PushPin'
import { Box, Button, Chip, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { jtSpacing } from '../../../../../theme'
import { ANY, fmtValue } from '../../../../../internal/rank-visualization/drilldown/model'
import { read } from '../model/cells'
import { scenarioName } from '../model/labels'
import { pageX } from '../styles'
import type { Breakout, Pin } from '../useBreakout'

// ---------- pins ----------

export function Pins({ state, name }: { state: Breakout; name: string }) {
  const [note, setNote] = useState('')
  const exportNotes = () => {
    const lines = [`# ${name} table`, '', ...state.pins.flatMap((p) => pinToMarkdown(p, state))]
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.toLowerCase().replace(/\W+/g, '-')}-table-notes.md`
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <Box
      component="section"
      aria-label="Pinned views"
      sx={(theme) => ({
        px: pageX,
        py: theme.jtSpacing.section.xs,
        bgcolor: 'base.700',
        borderTop: 1,
        borderColor: 'border.subtle',
      })}
    >
      <Stack spacing={jtSpacing.gap.md}>
        {/* Write a note, pin the view; export the lot for the report-out. */}
        <Box
          sx={{ display: 'flex', gap: jtSpacing.gap.sm, flexWrap: 'wrap', alignItems: 'center' }}
        >
          <TextField
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What the table said about this view"
            label="Note for the pinned view"
            size="small"
            sx={{ flex: '1 1 320px' }}
          />
          <Button
            variant="contained"
            startIcon={<PushPinIcon />}
            onClick={() => {
              state.pin(note)
              setNote('')
            }}
          >
            Pin this view
          </Button>
          {state.pins.length > 0 && (
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportNotes}>
              Export {state.pins.length} pinned
            </Button>
          )}
          {state.pins.length > 0 && (
            <Button variant="text" onClick={state.clearPins}>
              Clear
            </Button>
          )}
        </Box>
        {state.pins.length > 0 && (
          <Box sx={{ display: 'flex', gap: jtSpacing.gap.xs, flexWrap: 'wrap' }}>
            {state.pins.map((p, i) => (
              <Chip
                key={p.id}
                variant="outlined"
                label={`${i + 1}. ${p.note || summarise(p, state)}`}
                onClick={() => state.restore(p)}
                onDelete={() => state.unpin(p.id)}
                sx={{ typography: 'meta', borderColor: 'border.strong', maxWidth: '100%' }}
              />
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  )
}

function summarise(p: Pin, state: Breakout): string {
  const place =
    p.place === ANY
      ? ''
      : ` in ${state.placeFacets.find((f) => f.key === p.place)?.label ?? p.place}`
  const period =
    p.period === ANY
      ? ''
      : `, ${state.periodFacets.find((f) => f.key === p.period)?.label ?? p.period}`
  const climate = p.climate === 'slr' ? ', with sea level rise' : ''
  return `${p.scenarios.length} scenarios on ${p.nodes.length} measure${p.nodes.length === 1 ? '' : 's'}${place}${period}${climate}`
}

function pinToMarkdown(p: Pin, state: Breakout): string[] {
  const how = p.view === 'map' ? ' (on the map)' : ''
  const head = `## ${summarise(p, state)}${how}`
  const lines = [head, '', p.note ? `> ${p.note}` : '', '']
  const header = ['measure', ...p.scenarios.map((s) => scenarioName(s))]
  lines.push(`| ${header.join(' | ')} |`, `| ${header.map(() => '---').join(' | ')} |`)
  for (const id of p.nodes) {
    const node =
      state.selectedNodes.find((n) => n.id === id) ?? state.metrics.find((n) => n.id === id)
    if (!node) continue
    const cells = p.scenarios.map((s) => {
      const r = read(node, s, p.place, p.period, p.climate ?? 'current')
      return r.value === null ? r.why : fmtValue(r.value, node.unit)
    })
    lines.push(`| ${node.label} | ${cells.join(' | ')} |`)
  }
  lines.push('')
  return lines
}
