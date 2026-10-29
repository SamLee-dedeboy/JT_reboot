// The map view: one row of maps per measure, coloured like the table.
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import type { TeamKey } from '../../../../../internal/rank-visualization/data'
import { RegionValues } from '../../../../../internal/rank-visualization/subteams/RegionValues'
import type { MapScale } from '../../../../../internal/rank-visualization/subteams/RegionValues'
import { Segmented } from './controls'
import { capitalise, lifeStage, unitWord } from '../model/cells'
import { UI } from '../model/labels'
import { MAP_REGION_KEY, NESTED_MAP_TABS, entityTabs, mapItems } from '../model/mapModel'
import type { MapItem } from '../model/mapModel'
import type { Breakout } from '../useBreakout'

/**
 * One measure's six maps at a time, picked by tabs: for Recreation and Economy a
 * row for the ranking score, then one for the measure under it; for the others one
 * row of every measure (a species with its life stages as chips).
 */
export function Maps({
  state,
  team,
  onScale,
}: {
  state: Breakout
  team: TeamKey
  onScale: (scale: MapScale | null) => void
}) {
  const keys = MAP_REGION_KEY[team] ?? {}
  const items = mapItems(state, team)
  const scores = [...new Set(items.map((item) => item.score))]
  const [picked, setPicked] = useState<string | null>(null)
  const active = items.find((item) => item.node.id === picked) ?? items[0]
  const dimmed = state.columns.filter((scenario) => !state.scenarios.includes(scenario))
  useEffect(() => {
    if (!active) onScale(null)
  }, [active, onScale])
  if (!active) return null
  const { node } = active
  const nested = NESTED_MAP_TABS.includes(team)
  const scoreIndex = scores.indexOf(active.score)
  const tabs = entityTabs(items, nested ? active.score : null)
  const tabIndex = tabs.findIndex((t) => t.items.includes(active))
  const stage = lifeStage(node.label).stage
  /** Open a tab on the life stage already showing, where it has one. */
  const openTab = (tab: { items: MapItem[] }) =>
    setPicked(
      (tab.items.find((i) => lifeStage(i.node.label).stage === stage) ?? tab.items[0]).node.id,
    )
  /** Open another score on the same measure (Birding to Birding), where it has one. */
  const openScore = (index: number) => {
    const next = entityTabs(items, scores[index])
    openTab(next.find((t) => t.name === tabs[tabIndex].name) ?? next[0])
  }
  // The score tray shows for the nested teams; the measure tray always shows, so
  // the map is always named, except where it would only repeat the score; the
  // life-stage tray shows for a species with stages.
  const measureTray = !nested || tabs.length > 1 || active.node !== active.score
  const stages = lifeStage(tabs[tabIndex].items[0].node.label).stage ? tabs[tabIndex].items : []
  return (
    <Box
      sx={{
        height: 1,
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        rowGap: 2,
        // Room for the outlines of the maps.
        pb: 0.75,
      }}
    >
      {/* What is mapped: one row of trays, in the rail's segmented style. */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1.5,
          minWidth: 0,
        }}
      >
        {nested && (
          <Box sx={{ flex: '0 1 auto', minWidth: 0 }}>
            <Segmented
              label={UI.mapScorePicker}
              value={String(scoreIndex)}
              onChange={(next) => openScore(Number(next))}
              options={scores.map((score, index) => ({ value: String(index), label: score.label }))}
              dense
            />
          </Box>
        )}
        {measureTray && (
          <Box sx={{ flex: '0 1 auto', minWidth: 0 }}>
            <Segmented
              label={UI.mapMeasurePicker}
              value={String(tabIndex)}
              onChange={(next) => openTab(tabs[Number(next)])}
              options={tabs.map((tab, index) => ({ value: String(index), label: tab.name }))}
              dense
            />
          </Box>
        )}
        {stages.length > 0 && (
          <Box sx={{ flex: 'none' }}>
            <Segmented
              label={UI.lifeStagePicker}
              value={active.node.id}
              onChange={setPicked}
              options={stages.map((item) => ({
                value: item.node.id,
                label: capitalise(lifeStage(item.node.label).stage ?? item.node.label),
              }))}
              dense
            />
          </Box>
        )}
      </Box>
      <Box id="map-panel" sx={{ minHeight: 0, display: 'grid' }}>
        <RegionValues
          key={node.id}
          team={team}
          scenarios={state.columns}
          dimmed={dimmed}
          reading={state.reading}
          sameStyleForChange
          scoreScale
          // A share is scored one point per percentage point against Business as Usual.
          scorePerPoint={node.unit === 'share' ? 0.01 : undefined}
          onScale={onScale}
          hideLegend
          fit
          coordsFor={(region, scenario) =>
            keys[region]
              ? {
                  criterion: node.id,
                  scenario,
                  place: keys[region],
                  period: state.period,
                  climate: state.climate,
                }
              : null
          }
          unitLabel={unitWord(node)}
          hideInferred
          showValues
        />
      </Box>
    </Box>
  )
}
