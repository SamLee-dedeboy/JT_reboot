// Ported from JT_dashboard/src/lib/MentalModel/AllMMs.svelte. The bindable
// `selected_code` / `tooltip_y` props are lifted to the parent via `onHover`.
import { useEffect, useMemo, useRef } from 'react'
import type { CodebookEntry } from './constants'
import { MentalModelRenderer } from './renderers/MentalModelRenderer'
import type { HoverHandler } from './renderers/MentalModelRenderer'

type AllMMsProps = {
  codebook: CodebookEntry[]
  codeTsne: Record<string, number>
  svgId: string
  serverData: Record<string, string[]> | undefined
  onHover: (selectedCode: string | undefined, tooltipY: number | undefined) => void
}

export default function AllMMs({ codebook, codeTsne, svgId, serverData, onHover }: AllMMsProps) {
  const rendererRef = useRef<MentalModelRenderer | null>(null)
  const onHoverRef = useRef(onHover)
  useEffect(() => {
    onHoverRef.current = onHover
  }, [onHover])

  const parentDict = useMemo(
    () =>
      codebook.reduce<Record<string, string>>((acc, code) => {
        acc[code.name] = code.parent
        return acc
      }, {}),
    [codebook],
  )

  useEffect(() => {
    const handleHover: HoverHandler = (node, clientY) => {
      onHoverRef.current(node ? node[0] : undefined, node ? clientY : undefined)
    }
    const renderer = new MentalModelRenderer(svgId, handleHover)
    renderer.init()
    rendererRef.current = renderer
    return () => {
      renderer.destroy()
      rendererRef.current = null
    }
  }, [svgId])

  useEffect(() => {
    if (!serverData || !rendererRef.current) return
    const participantsByParent = Object.keys(serverData).reduce<Record<string, string[]>>(
      (acc, code) => {
        let parent_code = parentDict[code]
        if (parent_code === 'N/A') {
          parent_code = code // If no parent, use the code itself
        }
        if (!acc[parent_code]) {
          acc[parent_code] = []
        }
        acc[parent_code] = Array.from(new Set(acc[parent_code].concat(serverData[code])))
        return acc
      },
      {},
    )
    const render_data = Object.keys(participantsByParent).reduce<Record<string, number>>(
      (acc, code) => {
        acc[code] = participantsByParent[code].length
        return acc
      },
      {},
    )
    rendererRef.current.update(render_data, codebook, codeTsne)
  }, [serverData, parentDict, codebook, codeTsne])

  return (
    <div id="MM" className="grow">
      <svg id={svgId} className="w-full h-full"></svg>
    </div>
  )
}
