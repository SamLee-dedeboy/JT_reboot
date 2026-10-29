// A breakout table: one subteam hosts, the public asks, the screen answers.
//
// This is 4C's data model behind a different shell. The host starts on their own
// criterion with every scenario showing, and has four moves: pick scenarios, pick
// a place, pick a period, open a metric into its parts; and two ways to look,
// table or map. Everything is set large for a projector, and every number
// on screen is one the subteam published: a value we inferred shows as a
// placeholder, never as a number. Pinned views and their notes stay on the
// laptop, offline, and export as a Markdown file for the report-out. Teams with
// sea-level-rise runs can switch the whole table to them; differences are then
// read against that run's own Business as Usual.
//
// The shell speaks the scenarios pages' design: the numbered sticky tab bar and
// bordered translucent panels, with no site navbar so the table owns the screen.
// The table itself keeps the 4C cell design. Scenarios always sit in one fixed
// order and fade when switched off; ranking scores (−5…+5) are set apart from the
// details beneath them.
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { evaluationCardSx } from '../../evaluation/styles'
import { jtSpacing, navigation, ranking } from '../../../../theme'
import { TEAMS } from '../../../../internal/rank-visualization/data'
import type { TeamKey } from '../../../../internal/rank-visualization/data'
import type { MapScale } from '../../../../internal/rank-visualization/subteams/RegionValues'
import { CellCard } from './components/CellCards'
import type { Inspect } from './components/CellCards'
import { TableTabs } from './components/controls'
import { Maps } from './components/Maps'
import { Matrix } from './components/Matrix'
import { Pins } from './components/Pins'
import { Rail } from './components/Rail'
import { LegendBar, Sentence, ViewSwitch } from './components/TableHeader'
import { TEAM_CAVEATS, TEAM_TAKEAWAYS, UI } from './model/labels'
import { mapItems } from './model/mapModel'
import { pageX } from './styles'
import { useBreakout } from './useBreakout'
import type { ScenarioSetId, View } from './useBreakout'

const TEAM_KEYS = TEAMS.map((team) => team.key)

/**
 * The pin bar (note, pin, export) is hidden for now so the table fits one screen.
 * Pins already saved stay in localStorage and come back when this is turned on.
 */
const SHOW_PINS = false

/**
 * The one breakout page: every team's table behind the tab bar, the team in
 * `?team=` and the scenario set in `?set=` (`outflow` for the tiered outflow runs).
 */
export default function BreakoutPage() {
  return <BreakoutTable />
}

export function BreakoutTable({ embedded = false }: { embedded?: boolean }) {
  const [params] = useSearchParams()
  const param = params.get('team')
  const team = TEAM_KEYS.includes(param as TeamKey) ? (param as TeamKey) : TEAM_KEYS[0]
  const set: ScenarioSetId = params.get('set') === 'outflow' ? 'outflow' : 'adaptation'
  return (
    <Box
      component={embedded ? 'section' : 'main'}
      aria-label={embedded ? 'Performance by criterion' : undefined}
      sx={{ minHeight: embedded ? 0 : '100dvh', bgcolor: 'base.800', color: 'common.white' }}
    >
      <Table team={team} set={set} key={`${team}-${set}`} embedded={embedded} />
    </Box>
  )
}

function Table({ team, set, embedded }: { team: TeamKey; set: ScenarioSetId; embedded: boolean }) {
  const state = useBreakout(team, set)
  const name = TEAMS.find((entry) => entry.key === team)?.name ?? ''
  const [inspect, setInspect] = useState<Inspect | null>(null)
  // The maps read every difference against Business as Usual: adaptation runs only.
  const canMap = set === 'adaptation' && mapItems(state, team).length > 0
  // The map's colour ends, heard from the map so the one legend can give them.
  const [mapScale, setMapScale] = useState<MapScale | null>(null)
  const view: View = state.view === 'map' && !canMap ? 'table' : state.view

  return (
    // From md up the screen is exactly one viewport tall: tabs, sentence, then the
    // work area. The rail scrolls inside itself; the result is sized to fit.
    <Box
      sx={{
        display: 'grid',
        // One shrinkable column: the tab row scrolls sideways instead of widening the page.
        gridTemplateColumns: 'minmax(0, 1fr)',
        gridTemplateRows: 'auto auto minmax(0, 1fr)',
        // The kiosk is exactly one screen; on the site the table runs as long as it is.
        height: { md: embedded ? 'auto' : '100dvh' },
        minHeight: embedded ? 0 : '100dvh',
        overflow: { md: embedded ? 'visible' : 'hidden' },
        // Today's run on base.800; the sea-level-rise runs ease into base.900.
        bgcolor: state.climate === 'slr' ? 'base.900' : 'base.800',
        transition: 'background-color 600ms ease',
      }}
    >
      <TableTabs
        current={team}
        pathname={embedded ? '/scenarios/ranking/by-criterion' : '/pages/breakout'}
        search={set === 'outflow' ? '&set=outflow' : ''}
        stickyTop={embedded ? navigation.barHeight : 0}
      />

      {/* What is on screen, in one glance from the back row, and the host's opening words. */}
      <Stack
        spacing={jtSpacing.gap.sm}
        sx={(theme) => ({ px: pageX, pt: theme.jtSpacing.component.sm })}
      >
        {/* The tab bar names the table on screen; this names it for screen readers. */}
        <Typography
          variant="h1"
          // Embedded, the page's hero holds the h1.
          component={embedded ? 'h2' : 'h1'}
          sx={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
          }}
        >
          {name} breakout table
        </Typography>
        {embedded && <TableHeading />}
        <HostIntro team={team} />
        <Caveats team={team} />
        {!embedded && <Sentence state={state} />}
      </Stack>

      {/* Controls on the left, the answer on the right. */}
      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: embedded ? 'minmax(0, 1fr)' : { xs: '1fr', ...ranking.breakoutRail },
          gap: theme.jtSpacing.gap.lg,
          alignItems: { xs: 'start', md: 'stretch' },
          minHeight: 0,
          px: pageX,
          py: theme.jtSpacing.component.md,
        })}
      >
        <Rail state={state} row={embedded} />
        <Box
          sx={{
            ...(embedded ? {} : evaluationCardSx),
            // Tighter on a laptop, where the table needs the width.
            p: embedded ? 0 : { md: 1.5, xl: 2.5 },
            minWidth: 0,
            minHeight: 0,
            display: 'grid',
            // The view switch and legend share one line; the result takes the rest
            // of the height and is drawn to fit it, never scrolling.
            gridTemplateColumns: 'minmax(0, 1fr)',
            gridTemplateRows: 'auto minmax(0, 1fr)',
            gap: jtSpacing.gap.md,
          }}
        >
          {embedded ? (
            // On the site: what the table shows beside the view switch, then the legend.
            <Stack spacing={jtSpacing.gap.sm}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: jtSpacing.gap.md,
                }}
              >
                <Sentence state={state} compact />
                {canMap && <ViewSwitch state={state} view={view} />}
              </Box>
              <LegendBar state={state} view={view} mapScale={mapScale} />
            </Stack>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: jtSpacing.gap.md,
                flexWrap: { xs: 'wrap', md: 'nowrap' },
              }}
            >
              {/* The view switch leads the row, where there is a map to switch to; the
                  legend for that view follows it. */}
              {canMap && <ViewSwitch state={state} view={view} />}
              <LegendBar state={state} view={view} mapScale={mapScale} />
            </Box>
          )}
          <Box
            role="region"
            aria-label={`Result as a ${view}`}
            sx={{ minHeight: { xs: 480, md: 0 }, overflow: embedded ? 'visible' : 'hidden' }}
          >
            {view === 'map' ? (
              <Maps state={state} team={team} onScale={setMapScale} />
            ) : (
              <Matrix state={state} onInspect={setInspect} fit={!embedded} />
            )}
          </Box>
        </Box>
      </Box>

      {SHOW_PINS && <Pins state={state} name={name} />}
      <CellCard inspect={inspect} onClose={() => setInspect(null)} />
    </Box>
  )
}

/** On the site: what the table is, under the criterion tabs. */
function TableHeading() {
  return (
    <Typography variant="h2" sx={{ pt: jtSpacing.component.lg }}>
      {UI.howBuilt}
    </Typography>
  )
}

/** The team's takeaway, or a placeholder until they write it. */
/**
 * The team's "Read with care" notes, between its takeaway and the table: what to
 * keep in mind across the whole criterion. Nothing shows for a team with none.
 */
function Caveats({ team }: { team: TeamKey }) {
  const notes = TEAM_CAVEATS[team] ?? []
  if (notes.length === 0) return null
  // In the team's own colour, so the note reads as theirs.
  const color = TEAMS.find((t) => t.key === team)?.color
  return (
    <Box
      component="section"
      aria-labelledby={`caveats-${team}`}
      sx={{
        maxWidth: jtSpacing.paragraphMaxWidth.default,
        px: jtSpacing.component.md,
        py: jtSpacing.component.sm,
        bgcolor: 'base.900',
        border: 1,
        borderColor: color,
      }}
    >
      <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ alignItems: 'center', mb: 1 }}>
        <WarningAmberRoundedIcon fontSize="small" sx={{ color }} />
        <Typography id={`caveats-${team}`} variant="chartTitle" component="h3" sx={{ color }}>
          {UI.readWithCare}
        </Typography>
      </Stack>
      {notes.length === 1 ? (
        <Typography variant="body2" sx={{ color: 'base.50' }}>
          {notes[0]}
        </Typography>
      ) : (
        <Box component="ul" sx={{ m: 0, pl: 3, display: 'grid', gap: 1 }}>
          {notes.map((note) => (
            <Typography key={note} component="li" variant="body2" sx={{ color: 'base.50' }}>
              {note}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  )
}

function HostIntro({ team }: { team: TeamKey }) {
  const intro = TEAM_TAKEAWAYS[team]
  if (intro)
    return (
      <Typography variant="body1" sx={{ color: 'base.50', maxWidth: '80ch' }}>
        {intro}
      </Typography>
    )
  return (
    <Typography variant="body1" sx={{ color: 'base.100', maxWidth: '80ch' }}>
      {UI.openingPlaceholder}
    </Typography>
  )
}
