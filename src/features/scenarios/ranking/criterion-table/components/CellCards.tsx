// The cards a click opens: a cell's numbers (a lookup), and a score's definition
// (an explainer, beside its row's name).
import { Box, Popover, Stack, Typography, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { jtSpacing, ranking } from '../../../../../theme'
import { TEAMS, cellFill, roundScore } from '../../model/teams'
import type { TeamKey } from '../../model/teams'
import { TeamMark } from '../../TeamMark'
import type { Coords } from '../../model/cellValue'
import { ANY, fmtValue } from '../../model/criteria'
import type { CriterionNode } from '../../model/criteria'
import { scoreText, signed } from '../../model/cells'
import type { CellPoint } from '../../model/cells'
import { UI, placeName, scenarioName } from '../../tableText'
import { scenarioTakeaway, teamText, wetlandTakeaway } from '../../data'
import type { ScenarioTakeaway } from '../../data'
import { popoverPaperSx, popoverWidth } from '../styles'
import {
  Explainer,
  LabelledRows,
  Prose,
  ScoreRows,
  ScoreScale,
  Section,
  TakeawayPanel,
} from './Explainer'

/** A clicked cell: where it sits on screen, what it is, and its numbers. */
export interface Inspect {
  anchor: HTMLElement
  node: CriterionNode
  point: CellPoint
  /** Which of New Green Watershed's restoration levels, for a cell of the opened column. */
  level?: number
  /** Whether the table is showing differences, so the card leads with one. */
  diff: boolean
  /** The tiered-outflow tab, where Historic Baseline is a run of its own. */
  outflowSet: boolean
  coords: Coords
}

/** Exact Economy dollars followed by a quick reading aid for amounts of $1M or more. */
function annotatedUsd(value: number): string {
  const exact = fmtValue(value, 'usd')
  if (Math.abs(value) < 1_000_000) return exact
  const millions = Math.abs(value) / 1_000_000
  const rounded = millions < 10 ? Math.round(millions * 10) / 10 : Math.round(millions)
  const compact = `${value < 0 ? '−' : '+'}$${rounded.toLocaleString('en-US')}M`
  return `${exact} (${compact})`
}

/** The score, large and in the table's colours; a dashed outline until it is published. */
function ScoreBlock({ raw, text }: { raw: number | null; text: string }) {
  const { scoreBlock } = ranking.explainer
  return (
    <Box
      sx={{
        gridArea: 'score',
        alignSelf: { xs: 'center', sm: 'start' },
        minWidth: scoreBlock,
        minHeight: scoreBlock,
        px: 1,
        boxSizing: 'border-box',
        borderRadius: 0.75,
        border: raw === null ? '1px dashed' : 0,
        borderColor: 'border.strong',
        bgcolor: raw === null ? 'transparent' : cellFill(roundScore(raw)),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.625,
      }}
    >
      <Typography variant="chartLabel" sx={{ color: raw === null ? 'base.100' : 'common.white' }}>
        {UI.score}
      </Typography>
      <Typography
        variant={raw === null ? 'captionSmall' : 'statNumber'}
        component="span"
        sx={{ color: raw === null ? 'base.100' : 'common.white' }}
      >
        {text}
      </Typography>
    </Box>
  )
}

/** A takeaway's lead sentence, then its points, each beside its label. */
function Takeaway({ takeaway, team }: { takeaway: ScenarioTakeaway; team: TeamKey }) {
  return (
    <>
      <Box sx={{ pt: 2.5, borderTop: 1, borderColor: 'border.subtle' }}>
        <Prose text={takeaway.lead} team={team} variant="takeawayLead" textColor="common.white" />
      </Box>
      {takeaway.points && <LabelledRows rows={takeaway.points} team={team} />}
    </>
  )
}

/** A small outlined chip: a baseline's model. */
function Chip({ label, color }: { label: string; color?: string }) {
  return (
    <Typography
      component="span"
      variant="captionSmall"
      sx={{
        px: 1,
        borderRadius: 999,
        border: 1,
        borderColor: color ?? 'border.strong',
        color: color ?? 'base.100',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Typography>
  )
}

/**
 * A cell's card, opened beside it. The scenario titles it, under the measure, with the
 * place, time period and conditions it is read under in one quiet line. A score sits
 * large beside the title; the team's criterion score also shows its scenario takeaway,
 * or the takeaway for one restoration level when the cell is that level's and the team
 * wrote one, and takes the wider card so the text runs to fewer lines. A measure shows its
 * value, Business as Usual's (with the model run when it is CalSim's or SCHISM's),
 * and the difference.
 */
export function CellCard({ inspect, onClose }: { inspect: Inspect | null; onClose: () => void }) {
  const theme = useTheme()
  if (!inspect) return null
  const { anchor, node, point, level, coords, outflowSet } = inspect
  const levelTakeaway = level === undefined ? undefined : wetlandTakeaway(node.team, level)
  const team = TEAMS.find((t) => t.key === node.team)
  const unit = node.unit
  const score = unit === 'score'
  const base = point.base
  const value = (v: number | null) =>
    v === null
      ? UI.forthcoming
      : score
        ? scoreText(v)
        : unit === 'usd'
          ? annotatedUsd(v)
          : fmtValue(v, unit)

  const place =
    coords.place === ANY
      ? UI.allPlaces
      : placeName(node.places.find((f) => f.key === coords.place)?.label ?? UI.allPlaces, node.team)
  const period =
    coords.period === ANY
      ? UI.wholePeriod
      : (node.periods.find((f) => f.key === coords.period)?.label ?? UI.wholePeriod)
  const conditions = coords.climate === 'slr' ? UI.withSeaLevelRise : UI.currentConditions

  const change = point.raw !== null && base?.value != null ? point.raw - base.value : null
  const better = change === null || change === 0 ? 0 : change > 0 === node.betterHigher ? 1 : -1
  const tone =
    better > 0
      ? theme.chart.voting.above
      : better < 0
        ? theme.chart.voting.belowText
        : theme.palette.base[100]
  // Business as Usual, whichever model's run it is; the outflow tab's own Historic
  // Baseline keeps its name.
  const run =
    base && !(outflowSet && base.scenario === 'hist') ? UI.baselineRun[base.scenario] : undefined
  const isBau = base && (base.scenario === 'bau' || run)
  const hasTakeaway = score && node.level === 'team'
  const takeaway =
    levelTakeaway ?? (hasTakeaway ? scenarioTakeaway(node.team, point.scenario) : undefined)
  const context = [
    ...(level !== undefined ? [UI.ngwLevels[level]] : []),
    place,
    period,
    conditions,
  ].join(' · ')

  const row = (label: ReactNode, v: string, lead = false, color?: string) => (
    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
      <Typography
        variant="body2"
        component="div"
        sx={{ display: 'flex', alignItems: 'center', gap: 1, color: lead ? 'base.50' : 'base.100' }}
      >
        {label}
      </Typography>
      <Typography
        variant={lead ? 'numberScore' : 'body1'}
        component="span"
        sx={{ color: color ?? (lead ? 'common.white' : 'base.100'), whiteSpace: 'nowrap' }}
      >
        {v}
      </Typography>
    </Box>
  )

  return (
    <Popover
      open
      anchorEl={anchor}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-label': node.label,
          sx: {
            ...popoverPaperSx,
            p: { xs: 2, sm: 3 },
            maxWidth: 'none',
            width: popoverWidth(hasTakeaway ? ranking.explainer.width : ranking.explainer.cell),
          },
        },
      }}
    >
      <Stack spacing={jtSpacing.gap.sm}>
        {/* Title block: on a phone the score stays beside the name and the context runs full width. */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gridTemplateAreas: {
              xs: '"measure measure" "title score" "context context"',
              sm: '"measure score" "title score" "context score"',
            },
            columnGap: { xs: 1.5, sm: 2.5 },
            rowGap: 0.75,
            alignItems: 'center',
          }}
        >
          <Box sx={{ gridArea: 'measure', display: 'flex', alignItems: 'center', gap: 1 }}>
            <TeamMark team={node.team} size={16} />
            <Typography variant="chartTitle" component="p" sx={{ color: team?.color }}>
              {node.label}
            </Typography>
          </Box>
          <Typography
            variant="takeawayScenario"
            component="h3"
            sx={{ gridArea: 'title', minWidth: 0, color: 'common.white' }}
          >
            {scenarioName(point.scenario)}
          </Typography>
          <Box sx={{ gridArea: 'context' }}>
            <Typography variant="captionSmall" component="p">
              {context}
            </Typography>
            {score && (
              <Typography variant="captionSmall" component="p" sx={{ mt: 0.25 }}>
                {UI.scoredAgainst(
                  base && !isBau ? scenarioName(base.scenario) : UI.businessAsUsual,
                )}
              </Typography>
            )}
          </Box>
          {score && <ScoreBlock raw={point.raw} text={value(point.raw)} />}
        </Box>
        {!score && (
          <Stack spacing={0.75} sx={{ pt: 1, borderTop: 1, borderColor: 'border.subtle' }}>
            {row(scenarioName(point.scenario), value(point.raw), true)}
            {base &&
              row(
                isBau ? (
                  <>
                    {UI.businessAsUsual}
                    {run && <Chip label={run} color={theme.palette.primary.light} />}
                  </>
                ) : (
                  scenarioName(base.scenario)
                ),
                value(base.value),
              )}
            {change !== null && (
              <Box sx={{ pt: 0.75, borderTop: 1, borderColor: 'border.subtle' }}>
                {row(
                  UI.difference,
                  unit === 'usd' ? annotatedUsd(change) : signed(change, unit),
                  false,
                  tone,
                )}
              </Box>
            )}
          </Stack>
        )}
        {/* The takeaway leads the card's reading; nothing written yet says so in its place. */}
        {hasTakeaway &&
          (takeaway ? (
            <Takeaway takeaway={takeaway} team={node.team} />
          ) : (
            <Typography
              variant="placeholderNote"
              component="p"
              sx={{ pt: 2.5, borderTop: 1, borderColor: 'border.subtle' }}
            >
              {UI.takeawayForthcoming}
            </Typography>
          ))}
      </Stack>
    </Popover>
  )
}

/**
 * The info button beside a score's name, and the explainer it opens. A criterion
 * score lists its metrics and how they combine; a metric opens with the team's takeaway,
 * then says what it measures, how it is computed, what it considers and how it is
 * scored. Metric sections are optional. Content: labels.ts.
 */
export function ScoreInfo({ node }: { node: CriterionNode }) {
  const title = node.level === 'team' ? UI.teamScore(node.label) : node.label
  if (node.level === 'team') {
    const criterion = teamText(node.team).criterion
    const teamColor = TEAMS.find((t) => t.key === node.team)?.color
    return (
      <Explainer team={node.team} title={title}>
        <Section label={UI.metricsUsed(criterion.metrics.length)}>
          <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {criterion.metrics.map((metric, index) => (
              <Box
                key={metric}
                component="li"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto minmax(0, 1fr)',
                  columnGap: 1.25,
                  py: 0.5,
                  borderTop: index ? 1 : 0,
                  borderColor: 'border.subtle',
                }}
              >
                <Typography variant="chartTitle" component="span" sx={{ color: teamColor }}>
                  {index + 1}
                </Typography>
                <Typography variant="body2" component="span" sx={{ color: 'base.50' }}>
                  {metric}
                </Typography>
              </Box>
            ))}
          </Box>
        </Section>
        <Section label={UI.howCombine}>
          <Prose text={criterion.combine} team={node.team} />
        </Section>
        {criterion.outside && (
          <Section label={UI.notInScore}>
            <Prose text={criterion.outside} team={node.team} />
          </Section>
        )}
      </Explainer>
    )
  }
  const metric = node.info
  if (!metric) return null
  return (
    <Explainer team={node.team} title={title} roomy>
      {metric.takeaway && <TakeawayPanel takeaway={metric.takeaway} team={node.team} />}
      {metric.measures && (
        <Section label={UI.measures}>
          <Prose text={metric.measures} team={node.team} />
        </Section>
      )}
      {metric.computed && (
        <Section label={UI.computed}>
          <Prose text={metric.computed} team={node.team} />
        </Section>
      )}
      {(metric.scale || metric.scoreRows || metric.scored) && (
        <Section label={UI.howScored}>
          {metric.scale && <ScoreScale {...metric.scale} />}
          {metric.scoreRows && <ScoreRows {...metric.scoreRows} />}
          {metric.scored && <Prose text={metric.scored} team={node.team} />}
        </Section>
      )}
    </Explainer>
  )
}
