// "Public ideas & values" panel: info overlay + code graph for the selected
// scenario, ported from JT_dashboard/src/lib/Linking/ScenarioCodes.svelte.
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import RemoveIcon from '@mui/icons-material/Remove'
import { Box, IconButton, Typography } from '@mui/material'
import type { TypographyProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getScenarioCodes } from '../../api'
import InfoButton from '../../shared/InfoButton'
import CodeGraph from './CodeGraph'
import type { GraphNode, tCode } from './renderers/CodeGraphRenderer'
import { cubicOut } from './transitions'
import type { tScenarioData } from './types'

// transition:scale={{ start: 0.85, duration: 200, easing: cubicOut }}
const scaleTransition = {
  initial: { scale: 0.85, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.85, opacity: 0 },
  transition: { duration: 0.2, ease: cubicOut },
}

// Expanded info card; scales from its top-right corner like the original.
const ExpandedInfo = styled(motion.div)(({ theme }) => {
  const panel = theme.coDesign.linking.graph.infoPanel
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    maxWidth: panel.maxWidth,
    padding: theme.spacing(1.5),
    transformOrigin: 'top right',
    color: theme.chart.tooltip.text,
    backgroundColor: panel.background,
    border: panel.border,
    borderRadius: panel.radius,
    boxShadow: panel.shadow,
  }
})

function InfoText({ sx, ...props }: TypographyProps) {
  return (
    <Typography
      variant="meta"
      component="p"
      sx={[{ m: 0, fontStyle: 'italic' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
}

interface ScenarioCodesProps {
  selectedScenario?: tScenarioData
  onSelectCode: (code: GraphNode | undefined) => void
}

export default function ScenarioCodes({ selectedScenario, onSelectCode }: ScenarioCodesProps) {
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    // {#key selected_scenario}: everything below re-mounts per scenario.
    <ScenarioCodesBody
      key={selectedScenario?.number ?? ''}
      selectedScenario={selectedScenario}
      onSelectCode={onSelectCode}
      infoOpen={infoOpen}
      setInfoOpen={setInfoOpen}
    />
  )
}

type CodesRequest =
  { status: 'pending' } | { status: 'resolved'; codes: tCode[] } | { status: 'error'; error: Error }

function ScenarioCodesBody({
  selectedScenario,
  onSelectCode,
  infoOpen,
  setInfoOpen,
}: ScenarioCodesProps & { infoOpen: boolean; setInfoOpen: (open: boolean) => void }) {
  const [request, setRequest] = useState<CodesRequest>({ status: 'pending' })

  useEffect(() => {
    if (!selectedScenario) return
    let cancelled = false
    getScenarioCodes<{ occurrences: tCode[]; participants: tCode[] }>(selectedScenario.number)
      .then((data) => {
        if (!cancelled) setRequest({ status: 'resolved', codes: data['participants'] })
      })
      .catch((error: Error) => {
        console.error('Error:', error)
        if (!cancelled) setRequest({ status: 'error', error })
      })
    return () => {
      cancelled = true
    }
  }, [selectedScenario])

  return (
    <>
      {/* Info overlay pinned to the graph panel's top-right corner */}
      <Box sx={{ position: 'absolute', top: 1, right: 1, zIndex: 20, textAlign: 'left' }}>
        <AnimatePresence initial={false}>
          {infoOpen ? (
            <ExpandedInfo key="expanded" {...scaleTransition}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Typography
                  variant="chartTitle"
                  component="h3"
                  sx={{ m: 0, color: 'secondary.main' }}
                >
                  Public ideas &amp; values
                </Typography>
                <IconButton
                  size="small"
                  aria-label="Collapse info panel"
                  onClick={() => setInfoOpen(false)}
                  sx={(theme) => ({
                    flexShrink: 0,
                    p: 0.25,
                    color: 'common.white',
                    '&:hover': { bgcolor: theme.coDesign.linking.graph.zoomControls.hover },
                  })}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <InfoOutlinedIcon fontSize="small" sx={{ flexShrink: 0, mt: 0.125 }} />
                <InfoText>
                  This chart shows the participant ideas and values that we aligned to this
                  scenario.
                </InfoText>
              </Box>
              <InfoText sx={{ ml: 3.5 }}>
                Each bubble is a category of opinion. Bigger bubbles = more participants mentioned
                this category.
              </InfoText>
              <InfoText sx={{ ml: 3.5 }}>Hover any bubble to see more details.</InfoText>
            </ExpandedInfo>
          ) : (
            <motion.div key="collapsed" {...scaleTransition}>
              <InfoButton onClick={() => setInfoOpen(true)} label="Expand info panel" />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
      {selectedScenario ? (
        request.status === 'resolved' ? (
          <CodeGraph codes={request.codes} onSelectCode={onSelectCode} />
        ) : request.status === 'error' ? (
          <Typography
            variant="body2"
            component="p"
            sx={(theme) => ({ color: theme.coDesign.linking.error })}
          >
            error {request.error.message}
          </Typography>
        ) : null
      ) : (
        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" sx={{ p: 2.5, color: 'common.white', fontStyle: 'italic' }}>
            Select a scenario on the left to see public opinion.
          </Typography>
        </Box>
      )}
    </>
  )
}
