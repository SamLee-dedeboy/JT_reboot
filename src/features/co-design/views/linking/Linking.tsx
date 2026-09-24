// "Designing" view, ported from JT_dashboard/src/lib/Linking/Linking.svelte.
import { Box } from '@mui/material'
import { useState } from 'react'
import ColumnHeading from './ColumnHeading'
import type { GraphNode } from './renderers/CodeGraphRenderer'
import ScenarioCodes from './ScenarioCodes'
import ScenarioOverview from './ScenarioOverview'
import type { tScenarioData } from './types'

export default function Linking() {
  const [selectedScenario, setSelectedScenario] = useState<tScenarioData | undefined>(undefined)
  const [selectedCode, setSelectedCode] = useState<GraphNode | undefined>(undefined)

  // The Svelte $effect cleared the selected code whenever the scenario changed.
  const changeScenario = (scenario: tScenarioData | undefined) => {
    if (scenario === selectedScenario) return
    setSelectedScenario(scenario)
    setSelectedCode(undefined)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexGrow: 1,
        pt: 1,
        px: 4,
        pb: 4,
        textAlign: 'center',
      }}
    >
      {/* Left half: scenario picker and the selected scenario's description */}
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <ScenarioOverview
          selectedScenario={selectedScenario}
          onSelectScenario={changeScenario}
          selectedCode={selectedCode}
          onSelectCode={setSelectedCode}
        />
      </Box>
      {/* Right half: the scenario's code graph */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ColumnHeading>Public ideas &amp; values</ColumnHeading>
        <Box
          sx={(theme) => ({
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
            bgcolor: theme.coDesign.linking.graph.background,
            border: theme.coDesign.linking.graph.border,
            borderRadius: theme.coDesign.linking.graph.radius,
          })}
        >
          <ScenarioCodes selectedScenario={selectedScenario} onSelectCode={setSelectedCode} />
        </Box>
      </Box>
    </Box>
  )
}
