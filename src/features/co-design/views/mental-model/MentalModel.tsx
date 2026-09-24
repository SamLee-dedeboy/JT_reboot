// "Conceptualizing" view, ported from JT_dashboard/src/lib/MentalModel/MentalModel.svelte.
// Fetch order matches the original: codebook first, then interview + exhibition
// mental models; the parent t-SNE loads in parallel.
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getCodebook,
  getCodebookParentTsne,
  getExhibitionMentalModels,
  getInterviewMentalModels,
} from '../../api'
import AllMMs from './AllMMs'
import CodeTooltip from './CodeTooltip'
import { nodeTypeColor, nodeTypeTextColor } from './constants'
import type { CodebookEntry } from './constants'
import './MentalModel.css'
import LegacyScope from '../../shared/LegacyScope'

type CodeParticipants = Record<string, string[]>

function MentalModelView() {
  const [codebook, setCodebook] = useState<CodebookEntry[]>([])
  const [codeTsne, setCodeTsne] = useState<Record<string, number>>({})
  const [interviewServerData, setInterviewServerData] = useState<CodeParticipants>()
  const [exhibitionServerData, setExhibitionServerData] = useState<CodeParticipants>()

  useEffect(() => {
    let active = true
    const onError = (error: unknown) => console.error('Error:', error)
    getCodebook<CodebookEntry[]>()
      .then((data) => {
        if (!active) return
        setCodebook(data)
        getInterviewMentalModels<CodeParticipants>()
          .then((mms) => {
            if (active) setInterviewServerData(mms)
          })
          .catch(onError)
        getExhibitionMentalModels<CodeParticipants>()
          .then((mms) => {
            if (active) setExhibitionServerData(mms)
          })
          .catch(onError)
      })
      .catch(onError)
    getCodebookParentTsne<Record<string, number>>()
      .then((data) => {
        if (active) setCodeTsne(data)
      })
      .catch(onError)
    return () => {
      active = false
    }
  }, [])

  // Merge interview + exhibition into a single { code -> participants[] } map.
  // Participants are deduped per code via Set so overlapping IDs (if any) don't
  // double-count. Undefined until at least one source has loaded.
  const mergedServerData = useMemo(() => {
    if (!interviewServerData && !exhibitionServerData) return undefined
    const merged: CodeParticipants = {}
    const sources = [interviewServerData, exhibitionServerData].filter(
      (src): src is CodeParticipants => Boolean(src),
    )
    sources.forEach((src) => {
      Object.keys(src).forEach((code) => {
        if (!merged[code]) merged[code] = []
        merged[code] = merged[code].concat(src[code])
      })
    })
    Object.keys(merged).forEach((code) => {
      merged[code] = Array.from(new Set(merged[code]))
    })
    return merged
  }, [interviewServerData, exhibitionServerData])

  const [selectedCode, setSelectedCode] = useState<string>()
  const [tooltipY, setTooltipY] = useState<number>()
  const [sidebarEl, setSidebarEl] = useState<HTMLDivElement | null>(null)
  const [tooltipAnchorEl, setTooltipAnchorEl] = useState<HTMLDivElement | null>(null)
  const [tooltipEl, setTooltipEl] = useState<HTMLDivElement | null>(null)
  const [tooltipHeight, setTooltipHeight] = useState(0)

  const handleHover = useCallback((code: string | undefined, y: number | undefined) => {
    setSelectedCode(code)
    setTooltipY(y)
  }, [])

  // Track the tooltip's live height via ResizeObserver so we can clamp its
  // position against both its own size and the sidebar's bounds.
  useEffect(() => {
    if (!tooltipEl) return
    const ro = new ResizeObserver((entries) => {
      setTooltipHeight(entries[0].contentRect.height)
    })
    ro.observe(tooltipEl)
    return () => ro.disconnect()
  }, [tooltipEl])

  // Convert the hovered bubble's viewport y into a top offset inside the
  // sidebar. Because the tooltip is translated by -50%, `top` represents the
  // tooltip's VERTICAL CENTER — so clamp by half the tooltip height on each
  // end to keep the whole box inside the sidebar.
  const tooltipTop = useMemo(() => {
    if (tooltipY === undefined || !tooltipAnchorEl) return 0
    const rect = tooltipAnchorEl.getBoundingClientRect()
    const sidebarRect = sidebarEl?.getBoundingClientRect()
    const halfH = tooltipHeight / 2
    const raw = tooltipY - rect.top
    const availableHeight = sidebarRect ? sidebarRect.bottom - rect.top : rect.height
    const minTop = halfH
    const maxTop = Math.max(minTop, availableHeight - halfH)
    return Math.max(minTop, Math.min(maxTop, raw))
  }, [tooltipY, tooltipAnchorEl, sidebarEl, tooltipHeight])

  return (
    <div className="jtd-MentalModel page-container flex grow relative">
      <div className="flex"></div>

      <div className="flex flex-col lg:flex-row grow gap-6 relative min-h-0">
        <div className="relative flex flex-col w-full lg:w-[70%] min-h-0 gap-1">
          <h3 className="uppercase">Collective Mental Model</h3>
          <div
            className="axis-label absolute top-[2.5rem] left-2 z-10 px-3 py-1 rounded text-[1rem] font-semibold pointer-events-none"
            style={{
              backgroundColor: nodeTypeColor['impacts salinity'],
              color: nodeTypeTextColor['impacts salinity'],
            }}
          >
            Drivers
          </div>
          <div
            className="axis-label absolute bottom-2 left-2 z-10 px-3 py-1 rounded text-[1rem] font-semibold pointer-events-none"
            style={{
              backgroundColor: nodeTypeColor['impacted by salinity'],
              color: nodeTypeTextColor['impacted by salinity'],
            }}
          >
            Impacts
          </div>
          <AllMMs
            serverData={mergedServerData}
            codeTsne={codeTsne}
            codebook={codebook}
            svgId="mm_svg"
            onHover={handleHover}
          />
        </div>
        <div
          ref={setSidebarEl}
          className="mm-sidebar relative w-full lg:w-[30%] rounded pb-4 text-white overflow-hidden min-h-0"
        >
          <h3 className="uppercase">Descriptions</h3>
          <div className="relative mt-1" ref={setTooltipAnchorEl}>
            {mergedServerData && selectedCode ? (
              <div
                key={selectedCode}
                ref={setTooltipEl}
                className="absolute top-2 left-2 right-2 -translate-y-1/2 transition-all duration-200"
                style={{ top: `${tooltipTop}px` }}
              >
                <CodeTooltip
                  codebook={codebook}
                  all_code_participants={mergedServerData}
                  selected_code={selectedCode}
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-center italic opacity-70">
                Hover over a bubble on the left to see details about that code.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Temporary: keeps the legacy dashboard stylesheet applied until this view is restyled.
export default function MentalModel() {
  return (
    <LegacyScope>
      <MentalModelView />
    </LegacyScope>
  )
}
