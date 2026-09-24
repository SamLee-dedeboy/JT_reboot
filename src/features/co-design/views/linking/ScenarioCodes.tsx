// "Public ideas & values" panel: info overlay + code graph for the selected
// scenario, ported from JT_dashboard/src/lib/Linking/ScenarioCodes.svelte.
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getScenarioCodes } from '../../api'
import InfoButton from '../../shared/InfoButton'
import CodeGraph from './CodeGraph'
import type { GraphNode, tCode } from './renderers/CodeGraphRenderer'
import { cubicOut } from './transitions'
import type { tScenarioData } from './types'
import './ScenarioCodes.css'

// transition:scale={{ start: 0.85, duration: 200, easing: cubicOut }}
const scaleTransition = {
  initial: { scale: 0.85, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.85, opacity: 0 },
  transition: { duration: 0.2, ease: cubicOut },
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
      <div className="jtd-ScenarioCodes info-panel absolute right-9 top-13 z-20 italic">
        <AnimatePresence initial={false}>
          {infoOpen ? (
            <motion.div
              key="expanded"
              className="info-panel-expanded flex flex-col gap-2 rounded-md p-3 text-sm text-left"
              {...scaleTransition}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="title-banner uppercase not-italic font-normal text-xl">
                  PUBLIC IDEAS & VLAUES
                </span>
                <button
                  type="button"
                  className="info-toggle shrink-0 rounded px-1.5 leading-none flex items-center justify-center"
                  aria-label="Collapse info panel"
                  onClick={() => setInfoOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-minus-icon lucide-minus"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </button>
              </div>
              <span className="inline-flex items-start gap-2 font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0.5 h-5 w-5 shrink-0"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <span>
                  This chart shows the participant ideas and values that we aligned to this
                  scenario.
                </span>
              </span>
              <div className="ml-7 font-normal">
                Each bubble is a category of opinion. Bigger bubbles = more participants mentioned
                this category.
              </div>
              <div className="ml-7 font-normal">Hover any bubble to see more details.</div>
            </motion.div>
          ) : (
            <motion.div key="collapsed" {...scaleTransition}>
              <InfoButton onClick={() => setInfoOpen(true)} label="Expand info panel" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {selectedScenario ? (
        request.status === 'resolved' ? (
          <CodeGraph codes={request.codes} onSelectCode={onSelectCode} />
        ) : request.status === 'error' ? (
          <p className="jtd-ScenarioCodes error-message">error {request.error.message}</p>
        ) : null
      ) : (
        <div className="jtd-ScenarioCodes flex-1 items-center justify-center flex text-3xl italic">
          <span className="select-hint p-5 rounded">
            Select a scenario on the left to see public opinion.
          </span>
        </div>
      )}
    </>
  )
}
