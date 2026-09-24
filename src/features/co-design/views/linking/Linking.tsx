// "Designing" view, ported from JT_dashboard/src/lib/Linking/Linking.svelte.
import { useState } from 'react'
import type { GraphNode } from './renderers/CodeGraphRenderer'
import ScenarioCodes from './ScenarioCodes'
import ScenarioOverview from './ScenarioOverview'
import type { tScenarioData } from './types'
import './Linking.css'

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
    <div className="jtd-Linking page-container flex grow relative">
      <div className="flex-1 flex flex-col min-h-0 relative">
        <ScenarioOverview
          selectedScenario={selectedScenario}
          onSelectScenario={changeScenario}
          selectedCode={selectedCode}
          onSelectCode={setSelectedCode}
        />
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <h3>PUBLIC IDEAS & VALUES</h3>
        <div className="bubble-container flex flex-col flex-1 min-h-0">
          <ScenarioCodes selectedScenario={selectedScenario} onSelectCode={setSelectedCode} />
        </div>
      </div>
    </div>
  )
}
