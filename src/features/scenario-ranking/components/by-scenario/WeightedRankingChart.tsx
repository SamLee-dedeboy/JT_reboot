import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import {
  Box,
  Button,
  ButtonBase,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { motion, useReducedMotion } from 'framer-motion'
import { Fragment, useMemo, useState } from 'react'
import { jtSpacing, ranking } from '@/theme'
import { TeamIcon } from '@/ui'
import { EQUAL_WEIGHTS, TEAMS, fmtWeight, sameWeights, weightedRanking } from '../../model/teams'
import type { Scenario, WeightedScenario } from '../../model/teams'
import { UNRANKED, rankLabel } from './scoreFormat'
import { Legend, NotScoredNote, ScaleGuide, ScoreBar, ScoreValue } from './ScoreScale'

/** The only priority levels a visitor can pick, one button each. */
const PRIORITY_STEPS = [0.5, 1, 2, 3]

const RERANK_TRANSITION = { duration: ranking.motion.rerankSeconds, ease: 'easeOut' } as const

const rowCenter = (index: number) => ranking.rowHeight / 2 + index * ranking.rowHeight

/** Where a row shows how far it moved against equal weights. */
type MovePlacement = 'underRank' | 'column' | 'none'

const STEP_HINT = '×½ halves a criterion’s influence; ×3 triples it.'

/** The criteria whose weight is not ×1, as "Ecology ×3 · Economy ×½". */
function weightSummary(weights: number[]) {
  const changed = TEAMS.flatMap((team, i) =>
    weights[i] === 1 ? [] : [`${team.name} ×${fmtWeight(weights[i])}`],
  )
  return changed.length ? changed.join(' · ') : 'Every criterion counts equally'
}

/** ▲2 or ▼2: places gained or lost against the equal-weight order. Nothing when it held. */
function MoveChip({ delta }: { delta: number }) {
  if (delta === 0) return <Box />
  const up = delta > 0
  return (
    <Box
      component="span"
      aria-label={`${up ? 'Up' : 'Down'} ${Math.abs(delta)} from equal weights`}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        justifySelf: 'center',
        minWidth: ranking.moveChip.minWidth,
        height: ranking.moveChip.height,
        px: jtSpacing.component.xs,
        borderRadius: ranking.setToggle.radius,
        border: 1,
        borderColor: up ? 'primary.main' : 'border.strong',
        color: up ? 'primary.main' : 'base.100',
      }}
    >
      <Typography variant="chipLabel" component="span" aria-hidden sx={{ color: 'inherit' }}>
        {up ? '▲' : '▼'}
        {Math.abs(delta)}
      </Typography>
    </Box>
  )
}

/** The six criteria, each with a button per priority level. */
function PriorityControls({
  weights,
  onChange,
  compact,
}: {
  weights: number[]
  onChange: (teamIndex: number, weight: number) => void
  /** A phone's sheet: shorter rows and buttons, so more of the six fit on screen. */
  compact?: boolean
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ranking.columns.priorities,
        columnGap: jtSpacing.gap.md,
      }}
    >
      {TEAMS.map((team, index) => (
        <Box
          key={team.key}
          role="group"
          aria-label={`${team.name} priority`}
          sx={{
            display: 'grid',
            gap: jtSpacing.gap.xs,
            py: compact ? jtSpacing.component.xs : jtSpacing.component.sm,
            borderTop: 1,
            borderColor: 'border.subtle',
          }}
        >
          <Stack
            direction="row"
            spacing={jtSpacing.gap.xs}
            sx={{ alignItems: 'center', color: team.color }}
          >
            <TeamIcon team={team.key} size={ranking.teamIconSize} />
            <Typography variant="navigationLabel" noWrap sx={{ color: 'common.white' }}>
              {team.name}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={jtSpacing.gap.xs} sx={{ width: '100%' }}>
            {PRIORITY_STEPS.map((step) => {
              const active = weights[index] === step
              return (
                <ButtonBase
                  key={step}
                  aria-pressed={active}
                  onClick={() => onChange(index, step)}
                  sx={{
                    typography: compact ? 'chartValue' : 'chartValueLarge',
                    minWidth: ranking.priorityButton.minWidth,
                    height: compact
                      ? ranking.priorityButton.compactHeight
                      : ranking.priorityButton.height,
                    px: jtSpacing.component.xs,
                    flex: 1,
                    borderRadius: ranking.priorityButton.radius,
                    border: 1,
                    borderColor: active ? team.color : 'border.default',
                    bgcolor: active ? team.color : 'transparent',
                    color: active ? 'common.black' : 'base.100',
                    '&:hover, &.Mui-focusVisible': {
                      borderColor: team.color,
                      color: active ? 'common.black' : 'common.white',
                    },
                  }}
                >
                  ×{fmtWeight(step)}
                </ButtonBase>
              )
            })}
          </Stack>
        </Box>
      ))}
    </Box>
  )
}

/** "Set your priorities" over its hint, with the way back to equal weights beside it. */
function PrioritiesHeading({ changed, onReset }: { changed: boolean; onReset: () => void }) {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={jtSpacing.gap.sm}
        sx={{
          minHeight: ranking.controlHeight,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={jtSpacing.gap.sm} sx={{ alignItems: 'center' }}>
          <TuneRoundedIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h4" component="h3" sx={{ whiteSpace: 'nowrap' }}>
            Set your priorities
          </Typography>
        </Stack>
        <Button variant="text" disabled={!changed} onClick={onReset}>
          Reset
        </Button>
      </Stack>
      <Box sx={{ minHeight: ranking.weightedSubheadHeight, display: 'flex', alignItems: 'center' }}>
        <Typography variant="captionSmall" component="p">
          {STEP_HINT}
        </Typography>
      </Box>
    </Box>
  )
}

function CurrentRanking({
  scenarios,
  move,
}: {
  scenarios: WeightedScenario[]
  move: MovePlacement
}) {
  const reduceMotion = useReducedMotion()

  return (
    <Box sx={{ position: 'relative' }}>
      <ScaleGuide
        columns={ranking.columns.current}
        columnGap={jtSpacing.gap.sm}
        column={3}
        from="xs"
      />
      {scenarios.map((scenario, index) => {
        // A phone's row (move chip under the rank) sets its text a size down.
        const compact = move === 'underRank'
        const rank = (
          <Typography
            variant={compact ? 'chartValue' : 'chartValueLarge'}
            sx={{ color: 'primary.main' }}
          >
            {scenario.hasScores ? rankLabel(index + 1) : UNRANKED}
          </Typography>
        )
        return (
          <Box
            key={scenario.name}
            component={motion.div}
            layout="position"
            transition={reduceMotion ? { duration: 0 } : RERANK_TRANSITION}
            sx={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: ranking.columns.current,
              gap: jtSpacing.gap.sm,
              alignItems: 'center',
              height: ranking.rowHeight,
              borderTop: 1,
              borderColor: 'border.subtle',
              bgcolor: scenario.delta > 0 ? 'translucent.primaryGreenSubtle' : 'transparent',
            }}
          >
            {move === 'underRank' ? (
              <Stack spacing={jtSpacing.gap.xs} sx={{ alignItems: 'flex-start' }}>
                {rank}
                {scenario.delta !== 0 && <MoveChip delta={scenario.delta} />}
              </Stack>
            ) : (
              rank
            )}
            <Typography variant={compact ? 'chipLabel' : 'navigationLabel'}>
              {scenario.name}
            </Typography>
            {scenario.hasScores ? <ScoreBar score={scenario.wAvg} /> : <NotScoredNote />}
            {move === 'column' && <MoveChip delta={scenario.delta} />}
            <ScoreValue scenario={scenario} compact={compact} />
          </Box>
        )
      })}
    </Box>
  )
}

function RankingLinks({
  scenarios,
  equal,
}: {
  scenarios: WeightedScenario[]
  equal: WeightedScenario[]
}) {
  const reduceMotion = useReducedMotion()
  const { width, bend, strokeWidth, opacity, color } = ranking.links
  const height = ranking.rowHeight * equal.length

  return (
    <Box
      component="svg"
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      sx={{ display: 'block', overflow: 'visible', color }}
    >
      {scenarios.map((scenario, now) => {
        const before = equal.findIndex(({ name }) => name === scenario.name)
        const moved = before !== now
        return (
          <motion.path
            key={scenario.name}
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={false}
            animate={{
              d: `M0,${rowCenter(now)} L${width * bend[0]},${rowCenter(now)} L${width * bend[1]},${rowCenter(before)} L${width},${rowCenter(before)}`,
              strokeWidth: moved ? strokeWidth.moved : strokeWidth.resting,
              opacity: moved ? opacity.moved : opacity.resting,
            }}
            transition={reduceMotion ? { duration: 0 } : RERANK_TRANSITION}
          />
        )
      })}
    </Box>
  )
}

function EqualRanking({ equal }: { equal: WeightedScenario[] }) {
  return (
    <Box>
      {equal.map((scenario) => (
        <Box
          key={scenario.name}
          sx={{
            display: 'grid',
            gridTemplateColumns: ranking.columns.equal,
            gap: jtSpacing.gap.sm,
            alignItems: 'center',
            height: ranking.rowHeight,
            borderTop: 1,
            borderColor: 'border.subtle',
          }}
        >
          <Typography variant="chartValueLarge" sx={{ color: 'base.200' }}>
            {scenario.hasScores ? rankLabel(scenario.rank) : UNRANKED}
          </Typography>
          <Typography variant="navigationLabel" sx={{ color: 'base.100', whiteSpace: 'nowrap' }}>
            {scenario.name}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

/**
 * "Your ranking", what its arrows compare against, and the legend. `compact` (a phone)
 * stacks each under the other, since the heading and its note don't fit side by side.
 */
function YourRankingHeading({
  arrows,
  compact,
  summary,
}: {
  arrows: boolean
  compact?: boolean
  /** The weights in a line, on a phone where the controls sit in a sheet. */
  summary?: string
}) {
  return (
    <Box sx={compact ? { pb: jtSpacing.component.sm } : undefined}>
      <Stack
        direction={compact ? 'column' : 'row'}
        spacing={compact ? jtSpacing.gap.xs : 0}
        sx={{
          minHeight: ranking.controlHeight,
          justifyContent: 'space-between',
          alignItems: compact ? 'flex-start' : 'center',
          pb: compact ? jtSpacing.component.sm : 0,
        }}
      >
        <Typography variant="h4" component="h3">
          Your ranking
        </Typography>
        {summary && <Typography variant="body2">{summary}</Typography>}
        <Typography variant="captionSmall">
          {arrows ? '▲▼ against equal weights' : 'Weighted score'}
        </Typography>
      </Stack>
      <Box sx={{ minHeight: ranking.weightedSubheadHeight, display: 'flex', alignItems: 'center' }}>
        <Legend stacked={compact} />
      </Box>
    </Box>
  )
}

/**
 * A phone: the ranking first, so each change is seen where it lands, under a line that sums
 * up the weights. A pill floating at the foot of the section opens them in a sheet, which
 * previews the top three while they change.
 */
function PhoneWeightedRanking({
  scenarios,
  weights,
  onChange,
  onReset,
}: {
  scenarios: WeightedScenario[]
  weights: number[]
  onChange: (teamIndex: number, weight: number) => void
  onReset: () => void
}) {
  const [open, setOpen] = useState(false)
  const changed = !sameWeights(weights, EQUAL_WEIGHTS)

  return (
    <Box>
      <YourRankingHeading arrows compact summary={weightSummary(weights)} />
      <CurrentRanking scenarios={scenarios} move="underRank" />

      {/* A pill floating over the ranking while the section is on screen: the way in. */}
      <Box
        sx={(theme) => ({
          position: 'sticky',
          bottom: theme.spacing(jtSpacing.component.md),
          zIndex: 2,
          mt: jtSpacing.component.md,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        })}
      >
        <Button
          variant="contained"
          startIcon={<TuneRoundedIcon />}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          sx={{
            pointerEvents: 'auto',
            borderRadius: ranking.priorityTrigger.radius,
            boxShadow: ranking.priorityTrigger.elevation,
            px: jtSpacing.component.md,
          }}
        >
          {changed ? 'Edit your priorities' : 'Set your priorities'}
        </Button>
      </Box>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            'aria-label': 'Set your priorities',
            sx: {
              maxHeight: ranking.prioritySheet.maxHeight,
              bgcolor: 'base.700',
              color: 'common.white',
              borderTopLeftRadius: ranking.prioritySheet.radius,
              borderTopRightRadius: ranking.prioritySheet.radius,
              px: jtSpacing.component.md,
              pb: jtSpacing.component.md,
            },
          },
        }}
      >
        <Box
          aria-hidden
          sx={{
            alignSelf: 'center',
            width: ranking.prioritySheet.handle.width,
            height: ranking.prioritySheet.handle.height,
            my: jtSpacing.component.sm,
            borderRadius: ranking.setToggle.radius,
            bgcolor: 'border.strong',
          }}
        />
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" component="h3">
            Set your priorities
          </Typography>
          <IconButton aria-label="Close priorities" onClick={() => setOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
        <Typography variant="captionSmall" component="p" sx={{ pb: jtSpacing.component.sm }}>
          {STEP_HINT}
        </Typography>
        {/* The top three as they stand, so a change shows without closing the sheet. */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: ranking.columns.topThree,
            columnGap: jtSpacing.gap.sm,
            rowGap: jtSpacing.gap.xs,
            alignItems: 'center',
            p: jtSpacing.component.sm,
            mb: jtSpacing.component.sm,
            border: 1,
            borderColor: 'border.default',
            borderRadius: 2,
            bgcolor: 'translucent.50',
          }}
        >
          <Typography variant="columnHead" sx={{ gridColumn: '1 / -1' }}>
            Top three scenarios now
          </Typography>
          {scenarios.slice(0, 3).map((scenario, index) => (
            <Fragment key={scenario.name}>
              <Typography variant="chartValue" sx={{ color: 'primary.main' }}>
                {scenario.hasScores ? rankLabel(index + 1) : UNRANKED}
              </Typography>
              <Typography variant="chipLabel" noWrap>
                {scenario.name}
              </Typography>
              <Box sx={{ justifySelf: 'center' }}>
                <MoveChip delta={scenario.delta} />
              </Box>
              <ScoreValue scenario={scenario} compact />
            </Fragment>
          ))}
        </Box>
        <PriorityControls weights={weights} onChange={onChange} compact />
        <Stack direction="row" spacing={jtSpacing.gap.sm} sx={{ pt: jtSpacing.component.sm }}>
          <Button variant="outlined" disabled={!changed} onClick={onReset}>
            Reset
          </Button>
          <Button variant="contained" sx={{ flex: 1 }} onClick={() => setOpen(false)}>
            Show my ranking
          </Button>
        </Stack>
      </Drawer>
    </Box>
  )
}

/**
 * Priorities and the reweighted ranking of one scenario set. On a phone the ranking leads
 * and the priorities open in a sheet; on sm the priorities sit above it in two columns; from
 * md beside it; from lg the equal-weight order joins, linked row by row.
 */
export default function WeightedRankingChart({ scenarios: set }: { scenarios: Scenario[] }) {
  const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))
  const [weights, setWeights] = useState([...EQUAL_WEIGHTS])
  const scenarios = useMemo(() => weightedRanking(weights, set), [weights, set])
  const equal = useMemo(() => weightedRanking(EQUAL_WEIGHTS, set), [set])
  const setWeight = (teamIndex: number, weight: number) =>
    setWeights((current) => current.map((value, i) => (i === teamIndex ? weight : value)))
  const reset = () => setWeights([...EQUAL_WEIGHTS])
  const changed = !sameWeights(weights, EQUAL_WEIGHTS)

  if (!smUp) {
    return (
      <PhoneWeightedRanking
        scenarios={scenarios}
        weights={weights}
        onChange={setWeight}
        onReset={reset}
      />
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ranking.columns.layout,
        gap: { xs: jtSpacing.section.md, lg: jtSpacing.section.lg },
        alignItems: 'start',
      }}
    >
      <Box>
        <PrioritiesHeading changed={changed} onReset={reset} />
        <PriorityControls weights={weights} onChange={setWeight} />
      </Box>

      {/* Current ranking; from lg, linked row by row to the equal-weight ranking. */}
      {lgUp ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: ranking.columns.linked,
            columnGap: jtSpacing.gap.sm,
            alignItems: 'end',
          }}
        >
          <YourRankingHeading arrows={false} />
          <Box />
          <Box sx={{ alignSelf: 'start' }}>
            <Typography
              variant="h4"
              component="h3"
              sx={{
                display: 'flex',
                minHeight: ranking.controlHeight,
                alignItems: 'center',
                color: 'base.100',
              }}
            >
              Equal weights
            </Typography>
            <Box sx={{ minHeight: ranking.weightedSubheadHeight }} />
          </Box>

          <CurrentRanking scenarios={scenarios} move="none" />
          <RankingLinks scenarios={scenarios} equal={equal} />
          <EqualRanking equal={equal} />
        </Box>
      ) : (
        <Box>
          <YourRankingHeading arrows />
          <CurrentRanking scenarios={scenarios} move="column" />
        </Box>
      )}
    </Box>
  )
}
