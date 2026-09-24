// Ported from JT_dashboard/src/lib/MentalModel/AllMMs.svelte. The bindable
// `selected_code` / `tooltip_y` props are lifted to the parent via `onHover`.
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useMemo, useRef } from 'react'
import type { CodebookEntry } from './constants'
import { MentalModelRenderer } from './renderers/MentalModelRenderer'
import type { HoverHandler, MentalModelRendererTokens } from './renderers/MentalModelRenderer'

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

  const theme = useTheme()
  const tokens = useMemo<MentalModelRendererTokens>(() => {
    const mm = theme.coDesign.mentalModel
    return {
      nodeColors: mm.node,
      centerFill: mm.node.center,
      stroke: mm.node.stroke,
      hoverStroke: mm.node.hoverStroke,
      lightText: mm.text.light,
      darkText: mm.text.dark,
      link: mm.link.stroke,
      linkOpacity: mm.link.opacity,
      arrow: mm.link.arrow,
      regionTop: mm.region.drivers,
      regionBottom: mm.region.impacts,
      regionOpacity: mm.region.opacity,
      labelFontFamily: theme.typography.cardBody.fontFamily ?? theme.typography.fontFamily ?? '',
      labelFontWeight: theme.typography.fontWeightRegular ?? 'normal',
      centerFontFamily: theme.typography.chartTitle.fontFamily ?? '',
      centerFontWeight: theme.typography.fontWeightRegular ?? 'normal',
    }
  }, [theme])

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
    const renderer = new MentalModelRenderer(svgId, handleHover, tokens)
    renderer.init()
    rendererRef.current = renderer
    return () => {
      renderer.destroy()
      rendererRef.current = null
    }
  }, [svgId, tokens])

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
    // `tokens` re-runs this after the renderer is rebuilt with new theme values.
  }, [serverData, parentDict, codebook, codeTsne, tokens])

  // The renderer sizes its viewBox from this SVG's box on init.
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box component="svg" id={svgId} sx={{ display: 'block', width: '100%', height: '100%' }} />
    </Box>
  )
}
