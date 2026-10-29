// Above the table: the sentence saying what it shows, the Table/Map switch and the legend.
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import { Box, Typography, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { ranking } from '../../../../../theme'
import { cellFill } from '../../../../../internal/rank-visualization/data'
import { ANY } from '../../../../../internal/rank-visualization/drilldown/model'
import type { MapScale } from '../../../../../internal/rank-visualization/subteams/RegionValues'
import { Swatch } from '../../../../../internal/rank-visualization/subteams/SubteamFrame'
import { Segmented } from './controls'
import type { SegmentOption } from './controls'
import { splitRows } from '../model/cells'
import { FADED } from '../model/chartKit'
import { UI, placeName, scenarioName } from '../model/labels'
import type { Breakout, View } from '../useBreakout'

/** The data-state sentence, set large: the audience's anchor. */
export function Sentence({ state, compact }: { state: Breakout; compact?: boolean }) {
  const n = state.scenarios.length
  const names = state.selectedNodes.map((node) => node.label)
  const placeLabel =
    state.place === ANY
      ? null
      : placeName(
          state.placeFacets.find((f) => f.key === state.place)?.label ?? '',
          state.root.team,
        )
  const periodLabel =
    state.period === ANY ? null : state.periodFacets.find((f) => f.key === state.period)?.label
  const em = (text: ReactNode) => (
    <Box
      component="strong"
      sx={compact ? { typography: 'sentenceValueLarge' } : { color: 'common.white' }}
    >
      {text}
    </Box>
  )
  return (
    <Typography variant="bodyLarge" component="p" sx={{ color: 'common.white' }}>
      {state.reading === 'change' ? UI.comparingChange(scenarioName(state.baseline)) : UI.comparing}
      {em(
        n === state.columns.length
          ? UI.allScenarios(n, state.setId)
          : UI.someScenarios(n, state.setId),
      )}
      {state.climate === 'slr' && (
        <>
          {', '}
          {em(UI.withSeaLevelRise)}
          {', '}
        </>
      )}
      {/* The site's sentence names the scenarios only; the kiosk also counts the rows. */}
      {!compact && (
        <>
          {' on '}
          {em(names.length <= 2 ? names.join(' and ') : `${names.length} metrics`)}
        </>
      )}
      {placeLabel && (
        <>
          {' in '}
          {em(placeLabel)}
        </>
      )}
      {periodLabel && (
        <>
          {', '}
          {em(periodLabel)}
        </>
      )}
    </Typography>
  )
}

/** Table or map: the rail's segmented tray, compact, with an icon apiece, leading the legend row. */
export function ViewSwitch({ state, view }: { state: Breakout; view: View }) {
  const views: SegmentOption<View>[] = [
    { value: 'table', label: UI.table, icon: <TableRowsOutlinedIcon fontSize="small" /> },
    { value: 'map', label: UI.map, icon: <MapOutlinedIcon fontSize="small" /> },
  ]
  return (
    <Box sx={{ flex: 'none' }}>
      <Segmented<View>
        label="View the result as"
        value={view}
        onChange={state.setView}
        options={views}
        dense
      />
    </Box>
  )
}

/**
 * The legend for whichever view is open, after the view switch. A difference is
 * drawn in the same colours as a value, so one key serves both readings.
 */
export function LegendBar({
  state,
  view,
  mapScale,
}: {
  state: Breakout
  view: View
  mapScale: MapScale | null
}) {
  const theme = useTheme()
  const { scores, details } = splitRows(state.selectedNodes)
  const item = (key: string, label: string, body: ReactNode) => (
    <Box
      key={key}
      sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 'none', whiteSpace: 'nowrap' }}
    >
      {label && (
        <Typography variant="body2" sx={{ color: 'base.100' }}>
          {label}
        </Typography>
      )}
      {body}
    </Box>
  )
  const caption = (text: string) => <Typography variant="body2">{text}</Typography>
  const steps = [-5, -3, -1, 0, 1, 3, 5]
  return (
    <Box
      sx={{
        flex: '1 1 auto',
        minWidth: 0,
        display: 'flex',
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        overflow: 'hidden',
        alignItems: 'center',
        columnGap: 3,
        rowGap: 0.75,
      }}
    >
      {view === 'map' &&
        mapScale &&
        item(
          'map',
          '',
          <>
            {caption(mapScale.worse)}
            {steps.map((step) => (
              <Swatch key={step} tone={cellFill(step)} />
            ))}
            {caption(mapScale.better)}
            <Typography variant="body2" sx={{ color: 'base.200' }}>
              {mapScale.note}
            </Typography>
          </>,
        )}
      {scores.length > 0 &&
        view !== 'map' &&
        item(
          'scores',
          UI.legendScores,
          <>
            {caption('−5')}
            {steps.map((step) => (
              <Swatch key={step} tone={cellFill(step)} />
            ))}
            {caption('+5')}
          </>,
        )}
      {details.length > 0 &&
        view !== 'map' &&
        state.reading === 'change' &&
        item(
          'details',
          '',
          <>
            <Swatch tone={theme.chart.voting.above} />
            {caption(UI.better)}
            <Swatch tone={theme.chart.voting.below} />
            {caption(UI.worse)}
          </>,
        )}
      {item(
        'empty',
        '',
        <>
          <Box
            component="span"
            sx={{
              width: ranking.legend.swatchHeight * 2 + 2,
              height: ranking.legend.swatchHeight * 2 + 2,
              border: 1,
              borderColor: 'border.strong',
            }}
          />
          {caption(UI.noValue)}
        </>,
      )}
      {view !== 'map' && item('na', '', caption(UI.notApplicableKey))}
      {state.scenarios.length < state.columns.length &&
        item(
          'faded',
          '',
          <>
            <Box component="span" sx={{ opacity: FADED }}>
              <Swatch tone={theme.palette.base[50]} />
            </Box>
            {caption(UI.switchedOff)}
          </>,
        )}
    </Box>
  )
}
