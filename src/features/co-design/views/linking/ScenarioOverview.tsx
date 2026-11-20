// Scenario picker + description panel, ported from
// JT_dashboard/src/lib/Linking/ScenarioOverview.svelte.
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, ButtonBase, Typography } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { getScenarios } from '../../api'
import ColumnHeading from './ColumnHeading'
import GraphNodeTooltip from './GraphNodeTooltip'
import type { GraphNode } from './renderers/CodeGraphRenderer'
import SlideIn from './SlideIn'
import type { tScenarioData } from './types'
import { scenarioName } from '@/content/names'
import { focusRing } from '@/ui/focusRing'
import { choiceCardSx } from '@/ui/surfaceStyles'

const loadingPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 1; }
`

interface ScenarioOverviewProps {
  selectedScenario: tScenarioData | undefined
  onSelectScenario: (scenario: tScenarioData | undefined) => void
  selectedCode?: GraphNode | undefined
  onSelectCode: (code: GraphNode | undefined) => void
}

export default function ScenarioOverview({
  selectedScenario,
  onSelectScenario,
  selectedCode,
  onSelectCode,
}: ScenarioOverviewProps) {
  const [scenarioOverview, setScenarioOverview] = useState<tScenarioData[] | undefined>(undefined)
  // The description's `in:slide` only plays when the {#key} block is
  // re-created by a scenario switch, not when the view first renders.
  const [slideOnSwitch, setSlideOnSwitch] = useState(false)

  useEffect(() => {
    let cancelled = false
    getScenarios<tScenarioData[]>()
      .then((data) => {
        if (cancelled) return
        setScenarioOverview(data)
        onSelectScenario(data[0])
      })
      .catch((error) => {
        console.error('Error:', error)
      })
    return () => {
      cancelled = true
    }
    // Fetch once on mount, like Svelte's onMount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!scenarioOverview) {
    return (
      <Typography
        variant="body1"
        sx={{
          color: 'base.50',
          transformOrigin: 'center',
          animation: `${loadingPulse} 2s infinite ease-in-out`,
        }}
      >
        Loading...
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* Scenario picker column */}
      <Box sx={{ zIndex: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ColumnHeading sx={{ pl: 0.5, color: 'base.50' }}>Scenario</ColumnHeading>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            flexGrow: 1,
            justifyContent: 'space-between',
            gap: 2,
            mx: 0.5,
          }}
        >
          {scenarioOverview.map((scenario) => (
            <ScenarioButton
              key={scenario.name}
              active={selectedScenario?.name === scenario.name}
              onClick={() => {
                const next = scenarioOverview.find((s) => s.name === scenario.name)
                if (next !== selectedScenario) setSlideOnSwitch(true)
                onSelectScenario(next)
              }}
            >
              {scenario.name === 'Tunnel Vision' ? scenarioName('tunnel') : scenario.name}
            </ScenarioButton>
          ))}
        </Box>
      </Box>
      {/* Description column */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            gap: 2,
            px: 2,
          }}
        >
          {selectedScenario && (
            <ScenarioDetails
              key={selectedScenario.name}
              scenario={selectedScenario}
              slide={slideOnSwitch}
              selectedCode={selectedCode}
              onSelectCode={onSelectCode}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

// One scenario in the picker: the site's choice card, filled green once chosen.
function ScenarioButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={active}
      sx={(theme) => ({
        ...choiceCardSx(active),
        justifyContent: 'space-between',
        gap: theme.jtSpacing.gap.xs,
        width: theme.coDesign.linking.scenarioButton.width,
        minHeight: theme.coDesign.linking.scenarioButton.minHeight,
        px: theme.jtSpacing.component.sm,
        py: theme.jtSpacing.component.xs,
        borderRadius: 1,
        textAlign: 'left',
        transition: 'background-color 180ms ease, border-color 180ms ease, color 180ms ease',
        '&.Mui-focusVisible': focusRing,
      })}
    >
      <Typography
        component="span"
        variant={active ? 'controlValueSelected' : 'controlValue'}
        sx={{ minWidth: 0 }}
      >
        {children}
      </Typography>
      {active && <CheckRoundedIcon aria-hidden sx={{ flexShrink: 0, width: 18, height: 18 }} />}
    </ButtonBase>
  )
}

// Contents of the Svelte {#key selected_scenario.name} block.
function ScenarioDetails({
  scenario,
  slide,
  selectedCode,
  onSelectCode,
}: {
  scenario: tScenarioData
  slide: boolean
  selectedCode?: GraphNode
  onSelectCode: (code: GraphNode | undefined) => void
}) {
  return (
    <>
      <ColumnHeading>Descriptions</ColumnHeading>
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 1,
          border: theme.coDesign.linking.descriptions.border,
          borderRadius: theme.coDesign.linking.descriptions.radius,
          // Clip the card to the rounded corners without becoming a scroll
          // container (which would let the frame shrink below its content).
          overflow: 'clip',
        })}
      >
        {/* Scenario name and narrative; slides in on a scenario switch */}
        <SlideIn
          play={slide}
          sx={(theme) => ({
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            minWidth: theme.coDesign.linking.descriptions.minWidth,
            p: 2,
            mb: 2,
            textAlign: 'left',
            bgcolor: theme.coDesign.linking.descriptions.card,
          })}
        >
          <Typography variant="h4" component="h3" sx={{ px: 0.5, pt: 1 }}>
            {scenario.name}
          </Typography>
          <Typography variant="cardBody" component="p" sx={{ px: 0.5 }}>
            <strong>Scenario Description: </strong>
            <Box component="span" sx={{ fontStyle: 'italic' }}>
              {scenario.narrative}
            </Box>
          </Typography>
        </SlideIn>
        {/* Detail panel for the bubble last hovered in the graph */}
        <Box
          sx={(theme) => ({
            position: 'relative',
            flexGrow: 1,
            minHeight: 0,
            m: 2,
            bgcolor: theme.chart.tooltip.background,
            border: `1px solid ${theme.chart.tooltip.border}`,
            borderRadius: theme.coDesign.linking.descriptions.radius,
            overflow: 'hidden',
          })}
        >
          {selectedCode ? (
            <Box sx={{ position: 'absolute', inset: 0 }}>
              <GraphNodeTooltip code={selectedCode} handleClose={() => onSelectCode(undefined)} />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
            >
              <Typography
                variant="meta"
                sx={{ color: 'base.100', fontStyle: 'italic', textAlign: 'center' }}
              >
                Click a bubble on the right to see participant opinions about it here.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}
