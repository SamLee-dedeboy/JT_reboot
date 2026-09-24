// Ported from JT_dashboard/src/lib/MentalModel/CodeTooltip.svelte. The optional
// `handleClose` prop / Close button was never passed by MentalModel and is
// omitted.
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { readableTextOn } from '../../shared/contrast'
import { colorForNode } from './constants'
import type { CodebookEntry } from './constants'

type CodeTooltipProps = {
  codebook: CodebookEntry[]
  all_code_participants: Record<string, string[]>
  selected_code: string | undefined
}

type ChildParticipants = Record<string, string[]>

const count = (item: ChildParticipants) => Object.values(item)[0].length

// Underlined participant count; <strong> carries the emphasis weight.
function Count({ value }: { value: number }) {
  return (
    <Box component="strong" sx={{ color: 'common.white', textDecoration: 'underline' }}>
      {value}
    </Box>
  )
}

// Underlined, italic child-code name.
function CodeName({ children }: { children: string }) {
  return (
    <Box component="em" sx={{ color: 'common.white', textDecoration: 'underline' }}>
      {children}
    </Box>
  )
}

export default function CodeTooltip({
  codebook,
  all_code_participants,
  selected_code,
}: CodeTooltipProps) {
  // The hovered node's type picks the header fill so the tooltip stays
  // visually linked to its bubble on the canvas.
  const node_type = codebook.find((code) => code.name === selected_code)?.type

  const parent_to_child_participants = useMemo(() => {
    const child_dict = codebook.reduce<Record<string, string[]>>((acc, code) => {
      const parent_code = code.parent === 'N/A' ? code.name : code.parent
      acc[parent_code] = acc[parent_code] || []
      acc[parent_code].push(code.name)
      return acc
    }, {})
    const parent_codes = codebook.filter((code) => code.parent === 'N/A').map((code) => code.name)
    return parent_codes.reduce<Record<string, ChildParticipants[]>>((acc, parent) => {
      acc[parent] = child_dict[parent]
        .map((name) => ({ [name]: all_code_participants[name] || [] }))
        .filter((item) => count(item) > 0)
      return acc
    }, {})
  }, [codebook, all_code_participants])

  const tooltip_data = selected_code ? parent_to_child_participants[selected_code] : undefined
  const total_participants = tooltip_data
    ? tooltip_data.reduce((acc, item) => {
        Object.values(item)[0].forEach((participant) => acc.add(participant))
        return acc
      }, new Set<string>()).size
    : 0

  if (!tooltip_data) {
    return (
      <Typography variant="meta" component="p" sx={{ color: 'base.200' }}>
        Select a code to see details.
      </Typography>
    )
  }

  return (
    <Box
      sx={(theme) => ({
        overflow: 'hidden',
        textAlign: 'left',
        color: 'common.white',
        bgcolor: theme.chart.tooltip.background,
        border: `1px solid ${theme.chart.tooltip.border}`,
        borderRadius: theme.coDesign.mentalModel.tooltip.radius,
        boxShadow: theme.coDesign.mentalModel.tooltip.shadow,
      })}
    >
      {/* Header band in the bubble's own colour */}
      <Typography
        variant="cardTitle"
        component="h3"
        sx={(theme) => {
          const mm = theme.coDesign.mentalModel
          const fill = colorForNode(node_type, mm.node)
          return {
            px: 1.5,
            py: 0.75,
            textAlign: 'center',
            bgcolor: fill,
            color: readableTextOn(fill, mm.text.light, mm.text.dark),
          }
        }}
      >
        {selected_code}
      </Typography>
      <Box sx={{ px: 3, pt: 1.5, pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="cardBody" component="p">
          {codebook.find((code) => code.name === selected_code)?.definition ||
            'No definition available'}
        </Typography>
        <Typography variant="meta" component="p" sx={{ color: 'base.50' }}>
          <Count value={total_participants} /> participants mentioned this.
        </Typography>
        {tooltip_data.length > 1 && (
          <Box>
            <Typography variant="meta" component="p" sx={{ color: 'base.50' }}>
              Among these {total_participants} participants,
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, listStyleType: 'disc', color: 'base.50' }}>
              <Typography component="li" variant="meta" sx={{ ml: 1 }}>
                - <Count value={count(tooltip_data[0])} /> participants mentioned{' '}
                <CodeName>{`${Object.keys(tooltip_data[0])[0]} (general)`}</CodeName>
              </Typography>
              {tooltip_data
                .slice(1)
                .sort((a, b) => count(b) - count(a))
                .map((item) => (
                  <Typography
                    key={Object.keys(item)[0]}
                    component="li"
                    variant="meta"
                    sx={{ ml: 1 }}
                  >
                    - <Count value={count(item)} /> participants mentioned{' '}
                    <CodeName>{Object.keys(item)[0]}</CodeName>
                  </Typography>
                ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
