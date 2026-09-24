// Code detail panel (participant count + summary) for the hovered graph node,
// ported from JT_dashboard/src/lib/Linking/GraphNodeTooltip.svelte.
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { summarizeCode } from '../../api'
import { readableTextOn } from '../../shared/contrast'
import { categoryColorScale } from './constants'
import type { GraphNode } from './renderers/CodeGraphRenderer'
import SlideIn from './SlideIn'

interface GraphNodeTooltipProps {
  code: GraphNode
  handleExpand?: (code: GraphNode) => void
  // Kept from the original's props; its close button is not rendered.
  handleClose: () => void
}

// Mirrors the original fetch chain: any failure (the server's 404 for codes
// without a summary) logs and resolves to "".
function fetchSummarization(code: GraphNode): Promise<string> {
  return summarizeCode<string>(code.id).catch((error) => {
    console.error('Error:', error)
    return ''
  })
}

export default function GraphNodeTooltip({ code, handleExpand }: GraphNodeTooltipProps) {
  const theme = useTheme()
  const { linking } = theme.coDesign
  // {#await fetchSummarization()}: pending until the summary for *this* code
  // resolves; a new code shows the pending branch again.
  const [result, setResult] = useState<{ code: GraphNode; summarization: string } | null>(null)
  useEffect(() => {
    let cancelled = false
    fetchSummarization(code).then((summarization) => {
      if (!cancelled) setResult({ code, summarization })
    })
    return () => {
      cancelled = true
    }
  }, [code])
  const summarization = result?.code === code ? result.summarization : undefined

  const category = code.id.split('\\').at(0)!
  const color = categoryColorScale(linking.category)(category)

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100%',
        minHeight: 0,
        pb: 2,
        textAlign: 'left',
        color: theme.chart.tooltip.text,
      }}
    >
      {/* Code name on its category colour */}
      <Typography
        variant="cardTitle"
        component="div"
        sx={{
          p: 1,
          textAlign: 'center',
          bgcolor: `color-mix(in srgb, ${color} 90%, transparent)`,
          color: readableTextOn(color, linking.onColor.light, linking.onColor.dark),
        }}
      >
        {code.depth <= 1 ? code.id.split('\\').at(-1)?.toUpperCase() : code.id.split('\\').at(-1)}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 0',
          minHeight: 0,
          overflowY: 'auto',
          mb: 2,
          px: 2,
        }}
      >
        <Typography variant="cardBody" component="p" sx={{ mt: 1 }}>
          <Box component="span" sx={{ textDecoration: 'underline' }}>
            {code.participantCount}
          </Box>{' '}
          participants mentioned this in their interview.
        </Typography>
        {handleExpand && (
          <Typography variant="cardBody" component="div" sx={{ mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={() => handleExpand(code)}>
              Expand
            </Button>{' '}
            to see its children.
          </Typography>
        )}

        <Box>
          {summarization === undefined ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
              <Typography variant="meta" sx={{ color: 'base.200' }}>
                Loading summary...
              </Typography>
            </Box>
          ) : (
            <SlideIn key={code.id} sx={{ py: 2, textAlign: 'left' }}>
              <Typography variant="cardBody" component="p" sx={{ whiteSpace: 'pre-wrap' }}>
                {summarization || 'No summary available.'}
              </Typography>
            </SlideIn>
          )}
        </Box>
      </Box>
    </Box>
  )
}
