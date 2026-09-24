// "Conceptualizing" view, ported from JT_dashboard/src/lib/MentalModel/MentalModel.svelte.
// Fetch order matches the original: codebook first, then interview + exhibition
// mental models; the parent t-SNE loads in parallel.
import { Box, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  getCodebook,
  getCodebookParentTsne,
  getExhibitionMentalModels,
  getInterviewMentalModels,
} from '../../api'
import { readableTextOn } from '../../shared/contrast'
import AllMMs from './AllMMs'
import CodeTooltip from './CodeTooltip'
import { colorForNode, DRIVER_TYPE, IMPACT_TYPE } from './constants'
import type { CodebookEntry } from './constants'

type CodeParticipants = Record<string, string[]>

export default function MentalModel() {
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
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexGrow: 1,
        px: { xs: 2, md: 4 },
        pt: 2,
        pb: 4,
        textAlign: 'center',
      }}
    >
      {/* Chart and descriptions side by side from md, stacked below */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flexGrow: 1,
          gap: 3,
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', md: '70%' },
            minHeight: 0,
            gap: 0.5,
          }}
        >
          <Typography variant="chartTitle" component="h2">
            Collective Mental Model
          </Typography>
          {/* Chart canvas; the legend chips pin to its top and bottom corners */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              // Stacked below md there is no fixed-height row to fill, so give the chart room.
              minHeight: { xs: '70vh', md: 0 },
            }}
          >
            <LegendChip type={DRIVER_TYPE} edge="top">
              Drivers
            </LegendChip>
            <LegendChip type={IMPACT_TYPE} edge="bottom">
              Impacts
            </LegendChip>
            <AllMMs
              serverData={mergedServerData}
              codeTsne={codeTsne}
              codebook={codebook}
              svgId="mm_svg"
              onHover={handleHover}
            />
          </Box>
        </Box>
        <Box
          ref={setSidebarEl}
          sx={{
            position: 'relative',
            width: { xs: '100%', md: '30%' },
            minHeight: 0,
            pb: 2,
            overflow: 'hidden',
            color: 'common.white',
          }}
        >
          <Typography variant="chartTitle" component="h2">
            Descriptions
          </Typography>
          <Box ref={setTooltipAnchorEl} sx={{ position: 'relative', mt: 0.5 }}>
            {mergedServerData && selectedCode ? (
              // From md, centred on the hovered bubble's y and clamped inside the
              // sidebar; stacked below md it simply flows under the heading.
              <Box
                key={selectedCode}
                ref={setTooltipEl}
                style={{ top: tooltipTop }}
                sx={(theme) => ({
                  position: { xs: 'static', md: 'absolute' },
                  left: theme.spacing(1),
                  right: theme.spacing(1),
                  transform: { md: 'translateY(-50%)' },
                  transition: theme.transitions.create('all', {
                    duration: theme.coDesign.mentalModel.tooltip.moveDuration,
                    easing: theme.transitions.easing.easeInOut,
                  }),
                })}
              >
                <CodeTooltip
                  codebook={codebook}
                  all_code_participants={mergedServerData}
                  selected_code={selectedCode}
                />
              </Box>
            ) : (
              <Typography
                variant="meta"
                component="p"
                sx={{
                  display: 'flex',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  textAlign: 'center',
                  fontStyle: 'italic',
                  color: 'base.100',
                }}
              >
                Hover over a bubble on the left to see details about that code.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// Drivers / Impacts key, filled with the same colour as that half's bubbles.
function LegendChip({
  type,
  edge,
  children,
}: {
  type: string
  edge: 'top' | 'bottom'
  children: ReactNode
}) {
  return (
    <Typography
      variant="chartLabel"
      sx={(theme) => {
        const mm = theme.coDesign.mentalModel
        const fill = colorForNode(type, mm.node)
        return {
          position: 'absolute',
          left: theme.spacing(1),
          [edge]: theme.spacing(1),
          zIndex: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: mm.legendRadius,
          pointerEvents: 'none',
          bgcolor: fill,
          color: readableTextOn(fill, mm.text.light, mm.text.dark),
        }
      }}
    >
      {children}
    </Typography>
  )
}
