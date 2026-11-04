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
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { Box, Button, ButtonBase, Collapse, Stack, Typography } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import { useId, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { methodologyPath } from '../../evaluation/paths'
import { evaluationCardSx } from '../../evaluation/styles'
import { jtSpacing, navigation, ranking } from '../../../../theme'
import { TEAMS } from '../../../../internal/rank-visualization/data'
import type { TeamKey } from '../../../../internal/rank-visualization/data'
import type { MapScale } from '../../../../internal/rank-visualization/subteams/RegionValues'
import { CellCard } from './components/CellCards'
import type { Inspect } from './components/CellCards'
import { TableTabs } from './components/controls'
import { Prose } from './components/Explainer'
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

/** Each table's criterion page, whose route ids differ from the ranking's team keys. */
const CRITERION_IDS: Record<TeamKey, string> = {
  ecology: 'ecology',
  recreation: 'recreation',
  environmentalJustice: 'environmental-justice',
  economy: 'economy',
  ecoCultural: 'ecocultural-restoration',
}

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
        spacing={embedded ? jtSpacing.component.xl : jtSpacing.gap.sm}
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
        {/* The kiosk's table has to fit one screen, so the caveats stay on the site. */}
        {embedded ? (
          <>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                columnGap: jtSpacing.section.md,
                rowGap: jtSpacing.component.xl,
              }}
            >
              <Stack spacing={jtSpacing.gap.lg} sx={{ flex: '2 1 560px', minWidth: 0 }}>
                <Typography variant="h3" component="h2">
                  {UI.takeaway}
                </Typography>
                <HostIntro team={team} />
                <Button
                  component={Link}
                  to={methodologyPath(CRITERION_IDS[team])}
                  variant="outlined"
                  sx={{ alignSelf: 'flex-start', borderColor: 'primary.main' }}
                >
                  {UI.learnMoreCriterion}
                </Button>
              </Stack>
              <Caveats team={team} />
            </Box>
            <TableHeading />
          </>
        ) : (
          <>
            <HostIntro team={team} compact />
            <Sentence state={state} />
          </>
        )}
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
              <Maps state={state} team={team} onScale={setMapScale} onInspect={setInspect} />
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

/** On the site: what the table is, set apart from the takeaway above it. */
function TableHeading() {
  return (
    <Typography
      variant="h3"
      component="h2"
      sx={{ borderTop: 1, borderColor: 'border.default', pt: jtSpacing.component.xl }}
    >
      {UI.howBuilt}
    </Typography>
  )
}

/**
 * The team's caveats and clarifications, beside its takeaway: what to keep in mind
 * across the whole criterion. Nothing shows for a team with none.
 */
function Caveats({ team }: { team: TeamKey }) {
  const notes = TEAM_CAVEATS[team] ?? []
  if (notes.length === 0) return null
  // The team's colour marks the icon and arrows, so the note reads as theirs.
  const color = TEAMS.find((t) => t.key === team)?.color
  return (
    <Box
      component="section"
      aria-labelledby={`caveats-${team}`}
      sx={{
        flex: '1 1 420px',
        minWidth: 0,
        px: jtSpacing.component.md,
        pt: jtSpacing.component.md,
        pb: jtSpacing.component.sm,
        bgcolor: 'base.900',
        border: 1,
        borderColor: 'border.default',
        borderRadius: 1,
      }}
    >
      <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ alignItems: 'center', mb: 1.5 }}>
        <WarningAmberRoundedIcon fontSize="small" sx={{ color }} />
        <Typography
          id={`caveats-${team}`}
          variant="chartTitle"
          component="h3"
          sx={{ color: 'base.50' }}
        >
          {UI.caveatsHeading}
        </Typography>
      </Stack>
      <Box>
        {notes.map((note) => (
          <CaveatNote key={note} note={note} color={color} />
        ))}
      </Box>
    </Box>
  )
}

/**
 * One note. "Keyword: the rest" opens from its keyword, so a long list reads as its
 * topics first; a note with no keyword shows whole.
 */
function CaveatNote({ note, color }: { note: string; color?: string }) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const bodyId = useId()
  const match = /^([^:.]{1,60}): (.*)$/s.exec(note)
  if (!match)
    return (
      <Typography
        variant="body2"
        sx={{
          color: 'base.50',
          borderTop: 1,
          borderColor: 'border.subtle',
          pt: jtSpacing.component.sm,
          pb: 0.5,
        }}
      >
        <CaveatText text={note} color={color} />
      </Typography>
    )
  const [, keyword, body] = match
  return (
    <Box sx={{ borderTop: 1, borderColor: 'border.subtle' }}>
      <ButtonBase
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={bodyId}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: jtSpacing.gap.sm,
          width: '100%',
          minHeight: 44,
          py: 1,
          textAlign: 'left',
          '&:hover, &:focus-visible': { bgcolor: 'translucent.100' },
        }}
      >
        <Typography variant="body2" component="span" sx={{ color: 'common.white' }}>
          <strong>{keyword}</strong>
        </Typography>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          style={{ display: 'inline-flex', flex: 'none' }}
        >
          <ChevronRightIcon fontSize="small" sx={{ color }} />
        </motion.span>
      </ButtonBase>
      <Collapse id={bodyId} in={open} timeout={reduceMotion ? 0 : 'auto'}>
        <Stack spacing={1} sx={{ pt: 0.5, pb: jtSpacing.component.sm }}>
          {body.split('\n\n').map((paragraph) => (
            <Typography key={paragraph} variant="body2" sx={{ color: 'base.50' }}>
              <CaveatText text={paragraph} color={color} />
            </Typography>
          ))}
        </Stack>
      </Collapse>
    </Box>
  )
}

/** Caveat emphasis: **team colour** and ++primary green++, without added weight. */
function CaveatText({ text, color }: { text: string; color?: string }) {
  return text.split(/(\*\*.*?\*\*|\+\+.*?\+\+)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return (
        <Box key={index} component="span" sx={{ color }}>
          {part.slice(2, -2)}
        </Box>
      )
    if (part.startsWith('++') && part.endsWith('++'))
      return (
        <Box key={index} component="span" sx={{ color: 'primary.main' }}>
          {part.slice(2, -2)}
        </Box>
      )
    return part
  })
}

/**
 * The team's takeaway as points set apart, or a placeholder until they write it.
 * Compact on the kiosk, where every line it takes comes out of the table.
 */
function HostIntro({ team, compact = false }: { team: TeamKey; compact?: boolean }) {
  const points = TEAM_TAKEAWAYS[team] ?? []
  if (points.length === 0)
    return (
      <Typography
        variant="body1"
        sx={{
          color: 'base.100',
          borderTop: 1,
          borderColor: 'border.default',
          pt: jtSpacing.gap.sm,
        }}
      >
        {UI.openingPlaceholder}
      </Typography>
    )
  return (
    <Stack
      component="ul"
      spacing={compact ? jtSpacing.gap.xs : jtSpacing.gap.md}
      sx={{ listStyle: 'none', m: 0, p: 0 }}
    >
      {points.map((point) => (
        <Box
          key={point}
          component="li"
          sx={compact ? {} : { borderTop: 1, borderColor: 'border.default', pt: jtSpacing.gap.sm }}
        >
          <Prose text={point} team={team} variant={compact ? 'body2' : 'body1'} />
        </Box>
      ))}
    </Stack>
  )
}
