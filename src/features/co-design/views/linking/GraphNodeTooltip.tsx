// Code detail panel (participant count + summary) for the hovered graph node,
// ported from JT_dashboard/src/lib/Linking/GraphNodeTooltip.svelte.
import { useEffect, useState } from 'react'
import { summarizeCode } from '../../api'
import { bubble_color, contrastTextColor } from './constants'
import type { GraphNode } from './renderers/CodeGraphRenderer'
import SlideIn from './SlideIn'
import './GraphNodeTooltip.css'

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
  const color = bubble_color(category)

  return (
    <div className="jtd-GraphNodeTooltip modal-content flex flex-col grow text-left text-white pb-4 relative">
      <div
        className="text-center font-(--font-body) font-semibold p-2"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 90%, transparent)`,
          color: contrastTextColor(color),
        }}
      >
        {code.depth <= 1 ? code.id.split('\\').at(-1)?.toUpperCase() : code.id.split('\\').at(-1)}
      </div>

      <div className="scrollable mb-4 px-4 flex flex-col absolute top-0 bottom-0">
        <p className="">
          <span className="underline">{code.participantCount}</span> participants mentioned this in
          their interview.
        </p>
        {handleExpand && (
          <div className="mt-4">
            <button
              className="expand-button px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow-md"
              onClick={() => handleExpand(code)}
            >
              Expand
            </button>{' '}
            to see its children.
          </div>
        )}

        <div className="">
          {summarization === undefined ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading summary...</div>
            </div>
          ) : (
            <SlideIn key={code.id} className="py-4 rounded-lg text-left">
              <p className="leading-relaxed whitespace-pre-wrap">
                {summarization || 'No summary available.'}
              </p>
            </SlideIn>
          )}
        </div>
      </div>
    </div>
  )
}
