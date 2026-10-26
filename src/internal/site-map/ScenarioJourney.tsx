// Future Scenarios journey: pick a scenario and an evaluation team, then follow
// the path a visitor takes from the home page through that team's results to
// the overall ranking.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Chip, Stack, Typography } from '@mui/material'
import type { Theme } from '@mui/material'
import siteMap from 'virtual:site-map'
import { evaluationTeams } from '../../features/scenarios/content'
import {
  buildJourney,
  journeyScenarios,
  type JourneyStep,
  type JourneyTransition,
  type OutlineItem,
  type StepStatus,
} from './journeyModel'

const statusLabel: Record<StepStatus, string> = {
  live: 'Live page',
  section: 'Section of a page',
  planned: 'Planned',
}

const RAIL = 40

export default function ScenarioJourney() {
  const [scenarioSlug, setScenarioSlug] = useState<string>(journeyScenarios[0].slug)
  const [teamId, setTeamId] = useState<string>(evaluationTeams[1].id)
  const scenario =
    journeyScenarios.find((item) => item.slug === scenarioSlug) ?? journeyScenarios[0]
  const team = evaluationTeams.find((item) => item.id === teamId) ?? evaluationTeams[0]

  const { steps, transitions } = useMemo(
    () => buildJourney(scenario, team, siteMap.routes, siteMap.links),
    [scenario, team],
  )
  const liveSteps = steps.filter((step) => step.status !== 'planned').length
  const gaps = transitions.filter((transition) => transition.kind === 'missing').length

  return (
    <Stack sx={(theme) => ({ gap: theme.jtSpacing.gap.md, maxWidth: 980 })}>
      {/* Journey choices */}
      <Stack sx={(theme) => ({ gap: theme.jtSpacing.gap.sm })}>
        <ChoiceRow label="Scenario">
          {journeyScenarios.map((item) => (
            <Chip
              key={item.slug}
              label={item.title}
              color={item.slug === scenario.slug ? 'secondary' : 'default'}
              variant={item.slug === scenario.slug ? 'filled' : 'outlined'}
              aria-pressed={item.slug === scenario.slug}
              onClick={() => setScenarioSlug(item.slug)}
            />
          ))}
        </ChoiceRow>
        <ChoiceRow label="Evaluation team">
          {evaluationTeams.map((item) => (
            <Chip
              key={item.id}
              label={item.label}
              color={item.id === team.id ? 'secondary' : 'default'}
              variant={item.id === team.id ? 'filled' : 'outlined'}
              aria-pressed={item.id === team.id}
              onClick={() => setTeamId(item.id)}
            />
          ))}
        </ChoiceRow>
        <Typography variant="meta" sx={{ color: 'base.100' }}>
          {liveSteps} of {steps.length} steps exist today · {gaps} missing{' '}
          {gaps === 1 ? 'link' : 'links'} between steps
        </Typography>
      </Stack>

      {/* Steps with the move between each pair */}
      <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
        {steps.map((step, index) => (
          <Box component="li" key={step.id}>
            <StepCard step={step} index={index} selectedTeamId={team.id} onSelectTeam={setTeamId} />
            {transitions[index] && <TransitionRow transition={transitions[index]} />}
          </Box>
        ))}
      </Box>
    </Stack>
  )
}

function ChoiceRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={(theme) => ({ gap: theme.jtSpacing.gap.xs, alignItems: { md: 'center' } })}
    >
      <Typography variant="chartLabel" sx={{ color: 'base.200', minWidth: 140 }}>
        {label}
      </Typography>
      <Stack direction="row" sx={(theme) => ({ flexWrap: 'wrap', gap: theme.jtSpacing.gap.xs })}>
        {children}
      </Stack>
    </Stack>
  )
}

const statusColor = (theme: Theme, status: StepStatus) =>
  status === 'planned' ? theme.chart.siteMap.warning : theme.chart.siteMap.selected

function StepCard({
  step,
  index,
  selectedTeamId,
  onSelectTeam,
}: {
  step: JourneyStep
  index: number
  selectedTeamId: string
  onSelectTeam: (id: string) => void
}) {
  const planned = step.status === 'planned'

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `${RAIL}px minmax(0, 1fr)`, gap: 1.5 }}>
      {/* Step number on the journey rail */}
      <Box
        sx={(theme) => ({
          width: RAIL,
          height: RAIL,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          border: 1,
          borderStyle: planned ? 'dashed' : 'solid',
          borderColor: statusColor(theme, step.status),
          color: statusColor(theme, step.status),
        })}
      >
        <Typography variant="numberBadge" component="span">
          {index + 1}
        </Typography>
      </Box>

      <Box
        component="article"
        sx={(theme) => ({
          p: 2.5,
          border: 1,
          borderStyle: planned ? 'dashed' : 'solid',
          borderColor: planned ? theme.chart.siteMap.warning : 'border.default',
          borderRadius: 1,
          bgcolor: planned ? 'transparent' : 'translucent.100',
        })}
      >
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'baseline', justifyContent: 'space-between' }}
        >
          <Typography variant="cardTitle" component="h3">
            {step.title}
          </Typography>
          <Typography
            variant="chartLabel"
            component="span"
            sx={(theme) => ({ color: statusColor(theme, step.status) })}
          >
            {statusLabel[step.status]}
          </Typography>
        </Stack>
        <Typography variant="meta" component="p" sx={{ color: 'base.100', mt: 0.5 }}>
          {step.question}
        </Typography>
        <RouteLabel route={step.route} openable={step.status !== 'planned'} />

        {step.sees.length > 0 && (
          <Section title="Visitor sees">
            <Stack component="ul" sx={{ m: 0, pl: 2.25, gap: 0.5 }}>
              {step.sees.map((item) => (
                <Typography key={item} variant="cardBody" component="li">
                  {item}
                </Typography>
              ))}
            </Stack>
          </Section>
        )}

        {step.teamChoice && (
          <Section title="Choose a team to follow">
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
              {evaluationTeams.map((item) => (
                <Chip
                  key={item.id}
                  size="small"
                  label={`${item.number} ${item.label}`}
                  color={item.id === selectedTeamId ? 'secondary' : 'default'}
                  variant={item.id === selectedTeamId ? 'filled' : 'outlined'}
                  onClick={() => onSelectTeam(item.id)}
                />
              ))}
            </Stack>
          </Section>
        )}

        {step.outline && (
          <Section title={planned ? 'Proposed page outline' : 'Page outline'}>
            <Outline items={step.outline} />
          </Section>
        )}

        {step.branches.length > 0 && (
          <Section title="Side paths">
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
              {step.branches.map((branch) => (
                <Chip
                  key={branch.label}
                  size="small"
                  variant="outlined"
                  component={Link}
                  to={branch.to}
                  clickable
                  label={branch.note ? `${branch.label} · ${branch.note}` : branch.label}
                />
              ))}
            </Stack>
          </Section>
        )}
      </Box>
    </Box>
  )
}

function RouteLabel({ route, openable }: { route: string; openable: boolean }) {
  const sx = { color: 'secondary.main', display: 'inline-block', mt: 0.75 } as const
  if (!openable) {
    return (
      <Typography variant="captionSmall" component="p" sx={{ ...sx, color: 'base.200' }}>
        Proposed route: {route}
      </Typography>
    )
  }
  return (
    <Typography variant="captionSmall" component={Link} to={route} sx={sx}>
      {route}
    </Typography>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="chartLabel" component="h4" sx={{ color: 'base.200', mb: 0.75 }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

function Outline({ items }: { items: OutlineItem[] }) {
  return (
    <Stack component="ol" sx={{ m: 0, pl: 2.5, gap: 0.75 }}>
      {items.map((item) => (
        <Box component="li" key={item.title}>
          <Typography
            variant="cardBody"
            component="span"
            sx={(theme) => ({
              color: item.planned
                ? theme.chart.siteMap.warning
                : item.focus
                  ? theme.chart.siteMap.selected
                  : 'common.white',
            })}
          >
            {item.title}
            {item.planned && ' (not built yet)'}
          </Typography>
          {item.detail && (
            <Typography variant="captionSmall" component="p" sx={{ color: 'base.200' }}>
              {item.detail}
            </Typography>
          )}
          {item.children && (
            <Box sx={{ mt: 0.5 }}>
              <Outline items={item.children} />
            </Box>
          )}
        </Box>
      ))}
    </Stack>
  )
}

function TransitionRow({ transition }: { transition: JourneyTransition }) {
  const missing = transition.kind === 'missing'
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `${RAIL}px minmax(0, 1fr)`, gap: 1.5 }}>
      {/* Connector between steps */}
      <Box
        sx={(theme) => ({
          justifySelf: 'center',
          width: 0,
          minHeight: 64,
          borderLeft: 2,
          borderStyle: missing ? 'dashed' : 'solid',
          borderColor: missing ? theme.chart.siteMap.warning : theme.chart.siteMap.linkEdge,
        })}
      />
      <Box sx={{ py: 1.5 }}>
        <Typography
          variant="controlLabel"
          component="p"
          sx={(theme) => ({
            color: missing ? theme.chart.siteMap.warning : theme.chart.siteMap.linkEdge,
          })}
        >
          {missing ? 'Missing: ' : '↓ '}
          {transition.action}
        </Typography>
        {transition.evidence.map((link) => (
          <Typography
            key={`${link.file}:${link.line}`}
            variant="captionSmall"
            component="p"
            sx={{ color: 'base.200' }}
          >
            {link.to} · {link.file}:{link.line}
          </Typography>
        ))}
        {transition.suggestion && (
          <Typography variant="captionSmall" component="p" sx={{ color: 'base.100' }}>
            {transition.suggestion}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
