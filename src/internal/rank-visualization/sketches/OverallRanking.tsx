// 1A — the equal-weight ranking as bars growing from the Business-as-Usual line
// on a full −5…+5 axis. Each scenario unfolds into its four team ballots on the
// same axis: the dashed overall line runs on through them (the average) and
// dashed grey guides mark the lowest and highest ballot (the spread).
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, ButtonBase, Switch, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import SketchCard from '../components/SketchCard'
import { useTeams } from '../components/teamPalette'
import { CARD_WIDTH, COLUMN_GAP, ROW_GAP, TRACK_HEIGHT, trackColumns } from '../components/layout'
import { BallotPip, RankNumber, ScaleLabels } from '../components/ChartBits'
import { RANKED, TEAMS, fmtScore, toPct } from '../data'
import type { ScenarioStats } from '../data'

type RankedScenario = ScenarioStats & { rank: number }

const rowColumns = trackColumns()
/** Ballot sub-rows are shorter than scenario rows so the breakdown reads as nested. */
const BALLOT_ROW_HEIGHT = 22
/** Ballot names indent past the rank column (16px) plus a further step, so they read as nested under the scenario. */
const BALLOT_INDENT = 32
/** Width of the ballot-score slot at the end of the label column (fits "+5" / "−4"). */
const BALLOT_SCORE_WIDTH = 24
const LONGEST_TEAM_NAME = TEAMS.map((t) => t.name).reduce((a, b) => (b.length > a.length ? b : a))

const barColor = (theme: Theme, score: number) =>
  score >= 0 ? theme.chart.voting.above : theme.chart.voting.below

/** Dashed zero line shared by the scenario track and its ballot sub-rows. */
function ZeroLine() {
  return (
    <Box
      sx={(theme) => ({
        left: '50%',
        top: 0,
        bottom: 0,
        borderLeft: `1px dashed ${theme.chart.voting.zeroLine}`,
      })}
    />
  )
}

/**
 * Spread band: the range from the lowest to the highest ballot, drawn
 * semi-transparent behind the bars (box-plot style). Always mounted so it can
 * fade in and out with the Spread switch.
 */
function SpreadBand({
  scores,
  show,
  variant,
}: {
  scores: number[]
  show: boolean
  /** 'row': outlined band on the overall row · 'column': full-height background behind ballots. */
  variant: 'row' | 'column'
}) {
  const minPos = toPct(Math.min(...scores))
  const maxPos = toPct(Math.max(...scores))
  if (maxPos === minPos) return null
  return (
    <Box
      aria-hidden
      sx={(theme) => ({
        left: `${minPos}%`,
        width: `${maxPos - minPos}%`,
        opacity: show ? 1 : 0,
        transition: 'opacity 200ms ease',
        bgcolor: alpha(theme.chart.voting.spread, variant === 'row' ? 0.16 : 0.1),
        ...(variant === 'row'
          ? {
              top: 'calc(50% - 9px)',
              height: 18,
              borderRadius: 0.5,
              border: `1px solid ${alpha(theme.chart.voting.spread, 0.5)}`,
            }
          : {
              top: 0,
              bottom: 0,
              borderLeft: `1px solid ${alpha(theme.chart.voting.spread, 0.35)}`,
              borderRight: `1px solid ${alpha(theme.chart.voting.spread, 0.35)}`,
            }),
      })}
    />
  )
}

/** Scenario track: overall bar from the zero line on a full −5…+5 axis. */
function OverallTrack({ scenario, showSpread }: { scenario: RankedScenario; showSpread: boolean }) {
  const avgPos = toPct(scenario.avg)
  const isBaseline = scenario.scores.every((score) => score === 0)
  return (
    <Box sx={{ position: 'relative', height: TRACK_HEIGHT, '& > *': { position: 'absolute' } }}>
      {/* Full −5…+5 axis with end ticks, so every row shows the whole range */}
      <Box
        sx={(theme) => ({
          left: 0,
          right: 0,
          top: '50%',
          height: '1px', // numeric 1 would mean 100% in sx
          bgcolor: theme.chart.axis.line,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: -4,
            width: '1px',
            height: 9,
            bgcolor: theme.chart.axis.line,
          },
          '&::before': { left: 0 },
          '&::after': { right: 0 },
        })}
      />
      {/* Business as Usual's white marker sits on zero, so it needs no zero line */}
      {!isBaseline && <ZeroLine />}
      <SpreadBand scores={scenario.scores} show={showSpread} variant="row" />
      {!isBaseline && (
        <Box
          sx={(theme) => ({
            top: 'calc(50% - 6px)',
            height: 12,
            borderRadius: 0.5,
            left: `${Math.min(50, avgPos)}%`,
            width: `${Math.abs(avgPos - 50)}%`,
            bgcolor: barColor(theme, scenario.avg),
          })}
        />
      )}
      {isBaseline && (
        <Box
          sx={(theme) => ({
            left: '50%',
            top: 'calc(50% - 8px)',
            width: 4,
            height: 16,
            borderRadius: 0.5,
            bgcolor: theme.chart.voting.overall,
            transform: 'translateX(-50%)',
          })}
        />
      )}
    </Box>
  )
}

/** The scenario's four ballots on the same axis, with average and spread carried down. */
function Breakdown({ scenario, showSpread }: { scenario: RankedScenario; showSpread: boolean }) {
  const teams = useTeams()
  const avgPos = toPct(scenario.avg)

  return (
    // Divider + breathing room separate the overall row from its team ballots
    <Box
      sx={{
        mt: 1,
        pt: 1,
        pb: 1.5,
        borderTop: 1,
        borderColor: 'border.default',
      }}
    >
      {scenario.scores.map((score, i) => {
        const team = teams[i]
        const pos = toPct(score)
        return (
          <Box
            key={team.name}
            sx={{
              display: 'grid',
              gridTemplateColumns: rowColumns,
              columnGap: COLUMN_GAP,
              alignItems: 'center',
            }}
          >
            {/* Pip in the indent, then the team and its ballot score */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9, pr: 0.75 }}>
              <Box
                sx={{
                  flex: 'none',
                  width: BALLOT_INDENT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <BallotPip
                  color={team.color}
                  score={score}
                  size={10}
                  title={`${team.name}: ${fmtScore(score)}`}
                />
              </Box>
              {/* Name slot sized by an invisible copy of the longest team name, so the
                  scores sit just after the names and still line up in one column */}
              <Box sx={{ flex: 'none', display: 'grid', '& > *': { gridArea: '1 / 1' } }}>
                <Typography variant="chartLabel" sx={{ color: team.color }}>
                  {team.name}
                </Typography>
                <Typography variant="chartLabel" aria-hidden sx={{ visibility: 'hidden' }}>
                  {LONGEST_TEAM_NAME}
                </Typography>
              </Box>
              <Typography
                variant="chartValue"
                sx={{
                  flex: 'none',
                  width: BALLOT_SCORE_WIDTH,
                  textAlign: 'right',
                  color: 'base.100',
                }}
              >
                {fmtScore(score)}
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'relative',
                height: BALLOT_ROW_HEIGHT,
                '& > *': { position: 'absolute' },
              }}
            >
              <ZeroLine />
              {/* Spread: a background column from the lowest to the highest ballot */}
              <SpreadBand scores={scenario.scores} show={showSpread} variant="column" />
              {/* A ballot of 0 draws no bar: the track stays empty */}
              {score !== 0 && (
                <Box
                  sx={{
                    top: 'calc(50% - 4px)',
                    height: 8,
                    borderRadius: 0.5,
                    left: `${Math.min(50, pos)}%`,
                    width: `${Math.abs(pos - 50)}%`,
                    bgcolor: team.color,
                  }}
                />
              )}
              {/* Dashed overall line continues from the bar tip (the average of these
                  ballots), colored by the scenario's sign like its bar and score */}
              {scenario.avg !== 0 && (
                <Box
                  sx={(theme) => ({
                    left: `${avgPos}%`,
                    top: 0,
                    bottom: 0,
                    borderLeft: `2px dashed ${barColor(theme, scenario.avg)}`,
                    transform: 'translateX(-1px)',
                  })}
                />
              )}
            </Box>

            {/* Overall column stays one number per scenario */}
            <Box />
          </Box>
        )
      })}
    </Box>
  )
}

function ScenarioRow({
  scenario,
  open,
  onToggle,
  showSpread,
}: {
  scenario: RankedScenario
  open: boolean
  onToggle: () => void
  showSpread: boolean
}) {
  return (
    <Box>
      <ButtonBase
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`${scenario.name}: ${open ? 'hide' : 'show'} the four ballots`}
        sx={(theme) => ({
          width: '100%',
          display: 'grid',
          gridTemplateColumns: rowColumns,
          columnGap: COLUMN_GAP,
          alignItems: 'center',
          textAlign: 'left',
          borderRadius: 1,
          '&:hover, &.Mui-focusVisible': { bgcolor: theme.chart.voting.well },
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9, pr: 0.75 }}>
          <RankNumber rank={scenario.rank} />
          <Typography variant="chartLabel" sx={{ flex: 1 }}>
            {scenario.name}
          </Typography>
          <ExpandMoreIcon
            fontSize="small"
            sx={{
              color: 'base.100',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 200ms ease',
            }}
          />
        </Box>
        <OverallTrack scenario={scenario} showSpread={showSpread} />
        {/* Overall score colored on the same diverging scale as its bar */}
        <Typography
          variant="chartValueLarge"
          sx={(theme) => ({
            textAlign: 'right',
            color: scenario.avg === 0 ? theme.palette.base[100] : barColor(theme, scenario.avg),
          })}
        >
          {fmtScore(scenario.avg)}
        </Typography>
      </ButtonBase>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="breakdown"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <Breakdown scenario={scenario} showSpread={showSpread} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

type TierKey = 'better' | 'same' | 'worse'

/** Vertical scale down the left edge: which side of today each group of rows lands on. */
const TIERS: { key: TierKey; label: string; color: (theme: Theme) => string }[] = [
  { key: 'better', label: 'Better than today', color: (t) => t.chart.voting.above },
  { key: 'same', label: 'Same as today', color: (t) => t.chart.voting.spread },
  { key: 'worse', label: 'Worse than today', color: (t) => t.chart.voting.below },
]

const tierOf = (avg: number): TierKey => (avg > 0 ? 'better' : avg < 0 ? 'worse' : 'same')

/** Width of the tier scale column (rule + rotated label). */
const TIER_AXIS = 28
const withTierAxis = `${TIER_AXIS}px minmax(0, 1fr)`

/** Colored rule plus a label reading bottom-to-top; its length sets the group's minimum height. */
function TierScale({ label, color }: { label: string; color: (theme: Theme) => string }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.75, alignSelf: 'stretch' }}>
      <Box sx={(theme) => ({ flex: 'none', width: 2, borderRadius: 1, bgcolor: color(theme) })} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="chartColumnHead"
          sx={(theme) => ({
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            whiteSpace: 'nowrap',
            color: color(theme),
          })}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  )
}

export default function OverallRanking() {
  // Spread (lowest-to-highest ballot) is off by default and toggled from the chart header.
  const [showSpread, setShowSpread] = useState(false)
  // Every breakdown starts open; each row then opens and closes on its own.
  const [open, setOpen] = useState<Set<string>>(() => new Set(RANKED.map((s) => s.name)))
  const toggle = (name: string) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  return (
    <SketchCard id="1a" width={CARD_WIDTH}>
      <Box sx={{ display: 'grid', gridTemplateColumns: withTierAxis, columnGap: 1, mb: ROW_GAP }}>
        <Box />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: rowColumns,
            columnGap: COLUMN_GAP,
            alignItems: 'end',
          }}
        >
          {/* Spread switch lives on the chart it controls, above the scenario names */}
          <Box
            component="label"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
          >
            <Switch
              size="small"
              checked={showSpread}
              onChange={(event) => setShowSpread(event.target.checked)}
            />
            <Typography variant="chartColumnHead">Spread</Typography>
          </Box>
          <ScaleLabels labels={['−5', '0', '5']} />
          <Typography variant="chartColumnHead" sx={{ textAlign: 'right' }}>
            Overall
          </Typography>
        </Box>
      </Box>

      {/* Rows are ranked, so each tier is one contiguous group */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {TIERS.map((tier) => {
          const members = RANKED.filter((s) => tierOf(s.avg) === tier.key)
          if (members.length === 0) return null
          return (
            <Box
              key={tier.key}
              sx={{ display: 'grid', gridTemplateColumns: withTierAxis, columnGap: 1 }}
            >
              <TierScale label={tier.label} color={tier.color} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: ROW_GAP }}>
                {members.map((scenario) => (
                  <ScenarioRow
                    key={scenario.name}
                    scenario={scenario}
                    open={open.has(scenario.name)}
                    onToggle={() => toggle(scenario.name)}
                    showSpread={showSpread}
                  />
                ))}
              </Box>
            </Box>
          )
        })}
      </Box>
    </SketchCard>
  )
}
