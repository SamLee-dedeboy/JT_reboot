// Force-directed code graph with zoom controls, ported from
// JT_dashboard/src/lib/Linking/CodeGraph.svelte.
import { useEffect, useRef, useState } from 'react'
import { CodeGraphRenderer } from './renderers/CodeGraphRenderer'
import type { GraphNode, tCode } from './renderers/CodeGraphRenderer'
import './CodeGraph.css'

interface CodeGraphProps {
  codes: tCode[]
  // Replaces the bindable `selected_code`: called with the hovered node.
  onSelectCode: (code: GraphNode | undefined) => void
}

export default function CodeGraph({ codes, onSelectCode }: CodeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const rendererRef = useRef<CodeGraphRenderer | null>(null)
  const onSelectCodeRef = useRef(onSelectCode)
  const [zoomLevel, setZoomLevel] = useState(0.6)

  useEffect(() => {
    onSelectCodeRef.current = onSelectCode
  }, [onSelectCode])

  useEffect(() => {
    const renderer = new CodeGraphRenderer(svgRef.current!, (node) => {
      // Svelte wrapped each assigned node in a fresh $state proxy, so even
      // re-hovering the same node re-ran the tooltip's summary {#await}
      // (pending, then slide-in). A shallow copy keeps that behaviour.
      onSelectCodeRef.current(node ? { ...node } : undefined)
    })
    renderer.onZoomChange = (scale) => {
      setZoomLevel(scale)
    }
    renderer.init()
    renderer.update(codes)
    rendererRef.current = renderer
    return () => {
      renderer.destroy()
      rendererRef.current = null
    }
  }, [codes])

  return (
    <div className="jtd-CodeGraph flex flex-col h-0 grow relative pb-2">
      <svg ref={svgRef} className="overflow-hidden mt-2 w-full h-full"></svg>
      <div className="zoom-controls absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-md px-1.5 py-1 shadow-md">
        <button
          type="button"
          className="zoom-btn"
          aria-label="Zoom out"
          onClick={() => rendererRef.current?.zoomOut()}
        >
          −
        </button>
        <button
          type="button"
          className="zoom-btn reset"
          aria-label="Reset zoom"
          onClick={() => rendererRef.current?.resetZoom()}
        >
          Reset
        </button>
        <div className="zoom-level" aria-live="polite">
          {Math.round(zoomLevel * 100)}%
        </div>
        <button
          type="button"
          className="zoom-btn"
          aria-label="Zoom in"
          onClick={() => rendererRef.current?.zoomIn()}
        >
          +
        </button>
      </div>
    </div>
  )
}
