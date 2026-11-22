// Below md the table shows one scenario at a time; these choose which. A phone steps
// through them with arrows and dots; sm has the room to list all of them, one pick
// across their groups. The pager under the table steps on without scrolling back up.
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { Box, Button, ButtonBase, IconButton, Stack, Typography } from '@mui/material'
import { jtSpacing, ranking } from '@/theme'
import { focusRing } from '@/ui/focusRing'
import type { ScenarioKey } from '../../model/criteria'
import { UI, scenarioName } from '../../tableText'
import { SetChip } from './controls'
import type { TableState } from './useCriterionTable'

interface PickerProps {
  state: TableState
  scenario: ScenarioKey
  onChange: (scenario: ScenarioKey) => void
}

/** Where a scenario sits: its index, and the group it belongs to. */
function place(state: TableState, scenario: ScenarioKey) {
  const index = Math.max(0, state.columns.indexOf(scenario))
  const group = state.groups.findIndex((members) => members.includes(scenario))
  return { index, group: state.groupLabels?.[group] }
}

const step = (state: TableState, scenario: ScenarioKey, by: number) => {
  const n = state.columns.length
  return state.columns[(place(state, scenario).index + by + n) % n]
}

/** A phone: the scenario's group and name between arrows, its place in the run, and dots. */
export function ScenarioStepper({ state, scenario, onChange }: PickerProps) {
  const { index, group } = place(state, scenario)
  const { hit, dot, current } = ranking.scenarioDots
  return (
    <Stack component="section" aria-label={UI.scenario} spacing={jtSpacing.gap.xs}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: jtSpacing.gap.sm }}>
        <IconButton
          aria-label={UI.previousScenario}
          onClick={() => onChange(step(state, scenario, -1))}
          sx={{ border: 1, borderColor: 'border.strong', color: 'common.white' }}
        >
          <ChevronLeftRoundedIcon />
        </IconButton>
        <Box aria-live="polite" sx={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
          {group && (
            <Typography
              variant="captionSmall"
              component="p"
              // As far above the name as "3 of 6 scenarios" is below it.
              sx={{ color: 'primary.main', mb: 0.5 }}
            >
              {group}
            </Typography>
          )}
          <Typography variant="h4" component="p">
            {scenarioName(scenario)}
          </Typography>
          <Typography variant="captionSmall" component="p">
            {UI.scenarioOf(index + 1, state.columns.length)}
          </Typography>
        </Box>
        <IconButton
          aria-label={UI.nextScenario}
          onClick={() => onChange(step(state, scenario, 1))}
          sx={{ border: 1, borderColor: 'border.strong', color: 'common.white' }}
        >
          <ChevronRightRoundedIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {state.columns.map((key) => {
          const on = key === scenario
          return (
            <ButtonBase
              key={key}
              aria-label={scenarioName(key)}
              aria-current={on ? 'true' : undefined}
              onClick={() => onChange(key)}
              sx={{
                width: hit,
                height: hit,
                borderRadius: 1,
                '&.Mui-focusVisible': focusRing,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: 'block',
                  width: on ? current : dot,
                  height: dot,
                  borderRadius: ranking.setToggle.radius,
                  bgcolor: on ? 'primary.main' : 'border.strong',
                  transition: 'width 150ms ease',
                }}
              />
            </ButtonBase>
          )
        })}
      </Box>
    </Stack>
  )
}

/** sm: every scenario by name in its group, one of them on. */
export function ScenarioList({ state, scenario, onChange }: PickerProps) {
  return (
    <Stack component="section" aria-label={UI.scenario} spacing={jtSpacing.gap.sm}>
      <Typography variant="chartTitle" component="h4">
        {UI.scenario}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${state.groups.length}, minmax(0, 1fr))`,
          gap: jtSpacing.gap.md,
        }}
      >
        {state.groups.map((group, index) => (
          <Stack key={group.join()} spacing={0.75}>
            {state.groupLabels?.[index] && (
              <Typography variant="captionSmall" component="h5" sx={{ color: 'primary.main' }}>
                {state.groupLabels[index]}
              </Typography>
            )}
            {group.map((key) => (
              <SetChip
                key={key}
                label={scenarioName(key)}
                on={key === scenario}
                onClick={() => onChange(key)}
              />
            ))}
          </Stack>
        ))}
      </Box>
    </Stack>
  )
}

/** Under a phone's table: the scenarios either side, by name, a thumb away. */
export function ScenarioPager({ state, scenario, onChange }: PickerProps) {
  const previous = step(state, scenario, -1)
  const next = step(state, scenario, 1)
  const label = {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as const
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: jtSpacing.gap.sm,
      }}
    >
      <Button
        variant="outlined"
        startIcon={<ChevronLeftRoundedIcon />}
        onClick={() => onChange(previous)}
        aria-label={`${UI.previousScenario}: ${scenarioName(previous)}`}
        sx={{ minWidth: 0, color: 'common.white', borderColor: 'border.strong' }}
      >
        <Box component="span" sx={label}>
          {scenarioName(previous)}
        </Box>
      </Button>
      <Button
        variant="outlined"
        endIcon={<ChevronRightRoundedIcon />}
        onClick={() => onChange(next)}
        aria-label={`${UI.nextScenario}: ${scenarioName(next)}`}
        sx={{ minWidth: 0 }}
      >
        <Box component="span" sx={label}>
          {scenarioName(next)}
        </Box>
      </Button>
    </Box>
  )
}
