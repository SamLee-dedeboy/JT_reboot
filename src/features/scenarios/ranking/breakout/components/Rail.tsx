// The table's controls: conditions, time period, place and scenarios. On the site
// they are one panel above the table; in the kiosk, a column beside it.
import { Box, Stack, Typography } from '@mui/material'
import { jtSpacing, ranking } from '../../../../../theme'
import { TEAMS } from '../../../../../internal/rank-visualization/data'
import type { TeamKey } from '../../../../../internal/rank-visualization/data'
import { ANY } from '../../../../../internal/rank-visualization/drilldown/model'
import type { Climate } from '../../../../../internal/rank-visualization/drilldown/model'
import {
  REGION_SHAPES,
  REGION_TEAM_VIEWBOX,
  WATERWAY_PATH,
} from '../../../../../internal/rank-visualization/subteams/regionShapes'
import { RailGroup, Segmented, SetChip } from './controls'
import {
  PERIOD_MONTHS,
  PERIOD_WHY,
  PLACE_TRAYS,
  PLACE_WHY,
  TEAM_PERIOD_MONTHS,
  UI,
  placeName,
  scenarioName,
} from '../model/labels'
import { Explainer, Pairs, Prose, Section } from './Explainer'
import type { Breakout } from '../useBreakout'

// ---------- the rail ----------

/** The controls, compact, scrolling inside the work area so they never push the page past one screen. */
/**
 * Teams whose rail offers no place to pick: Eco-cultural's In-Delta / upper
 * watershed split is a note on restored acres, not a place to filter the table by.
 */
const NO_PLACES: TeamKey[] = ['ecoCultural']

export function Rail({
  state,
  row,
}: {
  state: Breakout
  /**
   * On the site the controls are one panel across the top of the table; in the
   * one-screen kiosk they are a column beside it that scrolls inside itself.
   */
  row: boolean
}) {
  const places = !NO_PLACES.includes(state.root.team)
  // A place that stands for everywhere: Delta-wide, or EJ's all 49 points.
  const wide = state.placeFacets.find((f) => /^delta-wide$/i.test(f.label) || f.key === 'all')
  // "Whole run" only where a row on screen has one; otherwise the first period is
  // what the rows show, so it is the one lit.
  const periodValue =
    state.period === ANY && !state.hasWholeRun ? (state.periodFacets[0]?.key ?? ANY) : state.period
  const placeValue = state.place === ANY && wide ? wide.key : state.place
  // Places and periods are the team's own cuts of the data, so they wear its color.
  const teamColor = TEAMS.find((t) => t.key === state.root.team)?.color

  const conditions = state.slrStatus && (
    <RailGroup title={UI.seaLevel}>
      <Segmented<Climate>
        label={UI.seaLevel}
        value={state.climate}
        onChange={state.setClimate}
        nowrap={row}
        options={[
          { value: 'current', label: UI.current },
          {
            value: 'slr',
            label: UI.seaLevelRise,
            disabled: state.slrStatus !== 'loaded',
          },
        ]}
      />
      {state.slrStatus !== 'loaded' && (
        <Typography variant="captionSmall" sx={{ color: 'base.300' }}>
          {UI.seaLevelNotLoaded}
        </Typography>
      )}
    </RailGroup>
  )

  const scenarios = (
    <RailGroup
      title={UI.scenarios}
      action={
        // Everything that can be on is on: five while the baseline is locked, else six.
        state.scenarios.length < state.columns.length - (state.baselineLocked ? 1 : 0)
          ? { label: UI.allOn, onClick: state.setAllScenarios }
          : undefined
      }
    >
      {/* One list per scenario group, under the group's name where it has one; side by side in a row. */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: row ? 'row' : 'column',
          flexWrap: 'wrap',
          gap: row ? jtSpacing.gap.lg : jtSpacing.gap.sm,
        }}
      >
        {state.groups.map((group, index) => (
          <Stack key={group.join()} spacing={0.75}>
            {state.groupLabels?.[index] && (
              <Typography variant="chartTitle" component="h3" sx={{ color: 'base.200' }}>
                {state.groupLabels[index]}
              </Typography>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: row ? 'row' : 'column',
                flexWrap: 'wrap',
                gap: 0.75,
              }}
            >
              {group.map((key) => (
                <SetChip
                  key={key}
                  label={scenarioName(key)}
                  on={state.scenarios.includes(key)}
                  onClick={() => state.toggleScenario(key)}
                  disabled={state.baselineLocked && key === state.baseline}
                />
              ))}
            </Box>
          </Stack>
        ))}
      </Box>
      {state.baselineLocked && (
        <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
          {UI.baselineLocked(scenarioName(state.baseline))}
        </Typography>
      )}
    </RailGroup>
  )

  const period = state.periodFacets.length > 0 && (
    <RailGroup title={UI.timePeriods} info={<PeriodsInfo state={state} />}>
      <Segmented
        label="Period"
        accent={teamColor}
        value={periodValue}
        onChange={state.setPeriod}
        columns={row ? undefined : 2}
        nowrap={row}
        options={[
          ...(state.hasWholeRun ? [{ value: ANY, label: state.wholeRun }] : []),
          ...state.periodFacets.map((facet) => ({ value: facet.key, label: facet.label })),
        ]}
      />
    </RailGroup>
  )

  // `name` is the data's name, which PLACE_TRAYS groups by; `label` is what the tab says.
  const placeOptions = [
    ...(wide ? [] : [{ value: ANY, label: UI.allPlaces, name: UI.allPlaces }]),
    ...state.placeFacets.map((facet) => ({
      value: facet.key,
      label: placeName(facet.label, state.root.team),
      name: facet.label,
    })),
  ]
  // In a row, the places split into trays: all of them together, then the team's
  // parts (bay area and Delta, or its vulnerability classes), one pick across them.
  const placeTrays = row ? placeGroups(placeOptions, wide?.key ?? ANY) : null
  const place = places && state.placeFacets.length > 0 && (
    <RailGroup title={UI.places} info={<PlacesInfo state={state} />}>
      {placeTrays ? (
        <Box
          role="group"
          aria-label="Place"
          sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: jtSpacing.gap.sm }}
        >
          {placeTrays.map((tray) => (
            <Segmented
              key={tray.label}
              label={tray.label}
              accent={teamColor}
              value={placeValue}
              onChange={state.setPlace}
              wrap
              options={tray.options}
            />
          ))}
        </Box>
      ) : (
        <Segmented
          label="Place"
          accent={teamColor}
          value={placeValue}
          onChange={state.setPlace}
          columns={row ? undefined : 2}
          wrap={row}
          options={placeOptions}
        />
      )}
    </RailGroup>
  )

  const panelSx = {
    minHeight: 0,
    p: jtSpacing.component.md,
    border: 1,
    borderColor: 'border.subtle',
    bgcolor: 'base.900',
  } as const

  // On the site: conditions, time period and place in one row, the scenarios beneath.
  // A criterion with none of the three (Eco-cultural) shows the scenarios alone,
  // with no empty row or rule above them.
  if (row) {
    const filters = [conditions, period, place].some(Boolean)
    return (
      <Stack component="aside" aria-label="Table controls" spacing={jtSpacing.gap.lg} sx={panelSx}>
        {filters && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              columnGap: jtSpacing.section.sm,
              rowGap: jtSpacing.gap.lg,
            }}
          >
            {conditions}
            {period}
            {place}
          </Box>
        )}
        <Box
          sx={filters ? { pt: jtSpacing.gap.lg, borderTop: 1, borderColor: 'border.subtle' } : {}}
        >
          {scenarios}
        </Box>
      </Stack>
    )
  }

  // The kiosk: a column beside the table that scrolls inside itself.
  return (
    <Stack
      component="aside"
      aria-label="Table controls"
      spacing={jtSpacing.gap.lg}
      sx={{
        ...panelSx,
        alignSelf: 'start',
        overflowY: { md: 'auto' },
        // It scrolls when it is longer than the screen, without a bar beside it.
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {conditions}
      {scenarios}
      {period}
      {place}
    </Stack>
  )
}

/**
 * The place trays: "All together" on its own, then the places as PLACE_TRAYS groups
 * them, each keeping the team's own order. Places no group lists (Environmental
 * Justice's vulnerability classes) share one tray after them.
 */
function placeGroups(options: { value: string; label: string; name: string }[], all: string) {
  const parts = options.filter((o) => o.value !== all)
  const grouped = PLACE_TRAYS.map((tray) => ({
    label: tray.heading,
    options: parts.filter((o) => tray.places.includes(o.name)),
  }))
  const rest = parts.filter((o) => !PLACE_TRAYS.some((tray) => tray.places.includes(o.name)))
  return [
    { label: UI.allPlaces, options: options.filter((o) => o.value === all) },
    ...grouped,
    { label: UI.places, options: rest },
  ].filter((tray) => tray.options.length > 0)
}

/**
 * The info button beside TIME PERIOD: why the team reads these periods (the team's
 * to write), then the months behind each tab on screen.
 */
function PeriodsInfo({ state }: { state: Breakout }) {
  const team = state.root.team
  const name = TEAMS.find((t) => t.key === team)?.name ?? ''
  const months = (key: string) =>
    TEAM_PERIOD_MONTHS[team]?.[key] ?? PERIOD_MONTHS[key] ?? UI.forthcoming
  const rows: [string, string][] = [
    ...(state.hasWholeRun ? [[state.wholeRun, state.wholeRunMonths] as [string, string]] : []),
    ...state.periodFacets
      .filter((facet) => facet.label)
      .map((facet): [string, string] => [facet.label, months(facet.key)]),
  ]
  return (
    <Explainer team={team} title={UI.aboutPeriods(name)}>
      <Section label={UI.whyPeriods}>
        <Prose text={PERIOD_WHY[team] ?? UI.periodsWhy} team={team} />
      </Section>
      {rows.length > 0 && (
        <Section label={UI.monthRanges}>
          <Pairs rows={rows} />
        </Section>
      )}
    </Explainer>
  )
}

/**
 * The info button beside PLACE: why the team cuts the Delta as it does (the team's
 * to write), then its regions on a map large enough to read.
 */
function PlacesInfo({ state }: { state: Breakout }) {
  const team = state.root.team
  const name = TEAMS.find((t) => t.key === team)?.name ?? ''
  const color = TEAMS.find((t) => t.key === team)?.color
  const shapes = REGION_SHAPES.filter((shape) => shape.team === team)
  const box = (
    REGION_TEAM_VIEWBOX as Partial<Record<TeamKey, Record<'x' | 'y' | 'width' | 'height', number>>>
  )[team]
  return (
    <Explainer team={team} title={UI.aboutPlaces(name)} wide>
      <Section label={UI.whyRegions}>
        <Prose text={PLACE_WHY[team] ?? UI.placesWhy} team={team} />
      </Section>
      {state.placeMetrics.length > 0 && (
        <Section label={UI.readByPlace}>
          <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'grid', gap: 0.25 }}>
            {state.placeMetrics.map((metric) => (
              <Typography key={metric} component="li" variant="body2" sx={{ color: 'base.50' }}>
                {metric}
              </Typography>
            ))}
          </Box>
        </Section>
      )}
      {shapes.length > 0 && box ? (
        <Box
          component="svg"
          viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
          role="img"
          aria-label={`${name} regions: ${shapes.map((s) => s.name).join(', ')}`}
          sx={{ display: 'block', width: 1, maxHeight: ranking.explainer.mapHeight }}
        >
          <path d={WATERWAY_PATH} fill="none" stroke="currentColor" strokeOpacity={0.25} />
          {shapes.map((shape) => (
            <path
              key={shape.name}
              d={shape.d}
              fill={color}
              fillOpacity={0.22}
              stroke={color}
              strokeWidth={1.5}
            />
          ))}
          {shapes.map((shape) => (
            <text
              key={shape.name}
              x={shape.label[0]}
              y={shape.label[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              fontSize={box.width / 24}
            >
              {shape.name}
            </text>
          ))}
        </Box>
      ) : null}
    </Explainer>
  )
}
