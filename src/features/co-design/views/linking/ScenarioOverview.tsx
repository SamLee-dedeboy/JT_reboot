// Scenario picker + description panel, ported from
// JT_dashboard/src/lib/Linking/ScenarioOverview.svelte.
import { useEffect, useState } from 'react'
import { getScenarios } from '../../api'
import GraphNodeTooltip from './GraphNodeTooltip'
import type { GraphNode } from './renderers/CodeGraphRenderer'
import SlideIn from './SlideIn'
import type { tScenarioData } from './types'
import './ScenarioOverview.css'

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
    return <div className="jtd-ScenarioOverview loading">Loading...</div>
  }

  return (
    <div className="jtd-ScenarioOverview scenario-container flex flex-col flex-1 gap-y-2 min-h-0">
      <div className="flex flex-col flex-1 gap-y-2 min-h-0">
        <div className="flex grow gap-y-2 min-h-0">
          <div className="selector flex flex-col gap-y-4 z-10">
            <h3 className="scenario-label text-center pl-1 capitalize">SCENARIO</h3>
            <div className="flex flex-col gap-x-4 gap-y-4 flex-wrap mx-1 grow justify-between">
              {scenarioOverview.map((scenario) => (
                <button
                  key={scenario.name}
                  className={`scenario-button w-[9rem] min-h-[4rem] rounded outline-1 px-4 py-2 uppercase transition-all text-[1rem] ${
                    selectedScenario?.name === scenario.name ? 'active' : ''
                  }`}
                  onClick={() => {
                    const next = scenarioOverview.find((s) => s.name === scenario.name)
                    if (next !== selectedScenario) setSlideOnSwitch(true)
                    onSelectScenario(next)
                  }}
                >
                  {scenario.name === 'Tunnel Vision' ? 'A Tunnel' : scenario.name}
                </button>
              ))}
            </div>
          </div>
          <div className="content-area flex flex-col grow min-h-0">
            <div className="content-container px-4 flex flex-col rounded relative gap-4 grow">
              {selectedScenario && (
                <ScenarioDetails
                  key={selectedScenario.name}
                  scenario={selectedScenario}
                  slide={slideOnSwitch}
                  selectedCode={selectedCode}
                  onSelectCode={onSelectCode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
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
      <h3 className="text-center">DESCRIPTIONS</h3>
      <div
        className="flex flex-col gap-2 outline-1 grow"
        style={{ outlineColor: 'var(--jt-green)' }}
      >
        <SlideIn
          play={slide}
          className="scenario-content flex px-4 py-4 flex-col min-w-[18rem] relative mb-4"
        >
          <div className="px-1 text-left">
            <span className="field-name text-2xl font-semibold pt-2">{scenario.name}</span>
          </div>
          <div className="px-1 text-left">
            <span className="font-semibold"> Scenario Description: </span>
            <span className="field-content italic">{scenario.narrative}</span>
          </div>
        </SlideIn>
        <div className="code-detail-panel m-4 min-h-0 grow relative bg-(--surface-page)">
          {selectedCode ? (
            <div className="absolute top-0 bottom-0 left-0 right-0">
              <GraphNodeTooltip code={selectedCode} handleClose={() => onSelectCode(undefined)} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm italic opacity-70">
              Click a bubble on the right to see participant opinions about it here.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
