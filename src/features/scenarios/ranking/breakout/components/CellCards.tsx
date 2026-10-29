// The cards a click opens: a cell's numbers (a lookup), and a score's definition
// (an explainer, beside its row's name).
import { Box, Popover, Stack, Typography, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { jtSpacing } from '../../../../../theme'
import { TEAMS, cellFill } from '../../../../../internal/rank-visualization/data'
import { TeamMark } from '../../../../../internal/rank-visualization/drilldown/DrillBits'
import type { Coords } from '../../../../../internal/rank-visualization/drilldown/cellValue'
import { ANY, fmtValue } from '../../../../../internal/rank-visualization/drilldown/model'
import type { CriterionNode } from '../../../../../internal/rank-visualization/drilldown/model'
import { scoreText, signed } from '../model/cells'
import type { CellPoint } from '../model/cells'
import {
  CRITERION_DEFINITIONS,
  METRIC_DEFINITIONS,
  SCENARIO_TAKEAWAYS,
  UI,
  placeName,
  scenarioName,
} from '../model/labels'
import { popoverPaperSx } from '../styles'
import { Explainer, Pairs, Prose, ScoreScale, Section } from './Explainer'

/** A clicked cell: where it sits on screen, what it is, and its numbers. */
export interface Inspect {
  anchor: HTMLElement
  node: CriterionNode
  point: CellPoint
  /** Whether the table is showing differences, so the card leads with one. */
  diff: boolean
  /** The tiered-outflow tab, where Historic Baseline is a run of its own. */
  outflowSet: boolean
  coords: Coords
}

/** A small outlined chip: the selection a cell is read under, or a baseline's model. */
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
 * A cell's card, opened beside it. It names the measure and scenario and repeats the
 * place, time period and conditions it is read under. A score then shows the score
 * and the team's takeaway for that scenario; a measure shows its value, Business as
 * Usual's (with the model run when it is CalSim's or SCHISM's) and the difference.
 */
export function CellCard({ inspect, onClose }: { inspect: Inspect | null; onClose: () => void }) {
  const theme = useTheme()
  if (!inspect) return null
  const { anchor, node, point, coords, outflowSet } = inspect
  const team = TEAMS.find((t) => t.key === node.team)
  const unit = node.unit
  const score = unit === 'score'
  const base = point.base
  const value = (v: number | null) =>
    v === null ? UI.forthcoming : score ? scoreText(v) : fmtValue(v, unit)

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
        variant={lead ? 'h4' : 'body1'}
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
        paper: { role: 'dialog', 'aria-label': node.label, sx: { ...popoverPaperSx, width: 360 } },
      }}
    >
      <Stack spacing={jtSpacing.gap.sm}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TeamMark team={node.team} size={16} />
            <Typography variant="chartTitle" component="h3" sx={{ color: team?.color }}>
              {node.level === 'team' ? UI.teamScore(node.label) : node.label}
            </Typography>
          </Box>
          <Typography variant="body2" component="p" sx={{ color: 'base.50', mt: 0.5 }}>
            {scenarioName(point.scenario)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          <Chip label={place} />
          <Chip label={period} />
          <Chip label={conditions} />
        </Box>
        <Stack spacing={0.75} sx={{ pt: 1, borderTop: 1, borderColor: 'border.subtle' }}>
          {score ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'base.50' }}>
                {UI.score}
              </Typography>
              <Typography
                variant="chartValueLarge"
                component="span"
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 0.6,
                  bgcolor: point.raw === null ? 'transparent' : cellFill(point.raw),
                  color: point.raw === null ? 'base.300' : 'common.white',
                }}
              >
                {value(point.raw)}
              </Typography>
            </Box>
          ) : (
            <>
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
                  {row(UI.difference, signed(change, unit), false, tone)}
                </Box>
              )}
            </>
          )}
        </Stack>
        {score && (
          <Section label={UI.takeaway}>
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              {SCENARIO_TAKEAWAYS[node.team]?.[point.scenario] ?? UI.takeawayForthcoming}
            </Typography>
          </Section>
        )}
      </Stack>
    </Popover>
  )
}

/**
 * The info button beside a score's name, and the explainer it opens. A criterion
 * score lists its metrics and how they combine; a metric says what it measures, how
 * it is computed, what it considers and how it is scored. Content: labels.ts.
 */
export function ScoreInfo({ node }: { node: CriterionNode }) {
  const title = node.level === 'team' ? UI.teamScore(node.label) : node.label
  if (node.level === 'team') {
    const criterion = CRITERION_DEFINITIONS[node.team]
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
  const metric = METRIC_DEFINITIONS[node.id]
  if (!metric) return null
  return (
    <Explainer team={node.team} title={title}>
      <Section label={UI.measures}>
        <Prose text={metric.measures} team={node.team} />
      </Section>
      <Section label={UI.computed}>
        <Prose text={metric.computed} team={node.team} />
      </Section>
      <Section label={UI.considered}>
        {typeof metric.considered === 'string' ? (
          <Prose text={metric.considered} team={node.team} />
        ) : (
          <Pairs rows={metric.considered} />
        )}
      </Section>
      <Section label={UI.howScored}>
        {metric.scale && <ScoreScale {...metric.scale} />}
        <Prose text={metric.scored} team={node.team} />
      </Section>
    </Explainer>
  )
}
