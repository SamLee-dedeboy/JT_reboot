import { Box, ListSubheader, MenuItem, Stack } from '@mui/material'
import { useState } from 'react'
import { TEAM_NAMES } from '@/content/names'
import { LabeledSelect } from '@/features/scenario-explorer/components/controls'
import {
  menuGroupHeadDividedSx,
  menuGroupHeadSx,
  menuItemSx,
} from '@/features/scenario-explorer/components/controlStyles'
import { chart, jtSpacing } from '@/theme'
import { ActionButton, Segmented, StageChip, TagChip, TextLink } from '@/ui'
import DesignSection from '../parts/DesignSection'
import Specimen, { UsageTag } from '../parts/Specimen'

const scenarios = [
  'Business as Usual',
  'Eco Machine',
  'New Green Watershed',
  'Bolster & Fortify',
  'Calling on Reserves',
  'A Tunnel',
]

// The explorer's grouped list: Business as Usual under Baseline, the rest under their own head.
const groupedOptions = (unavailable: string) => [
  <ListSubheader key="baseline" disableSticky sx={menuGroupHeadSx}>
    Baseline
  </ListSubheader>,
  ...scenarios.flatMap((name, index) => [
    ...(index === 1
      ? [
          <ListSubheader key="adaptation" disableSticky sx={menuGroupHeadDividedSx}>
            Adaptation scenarios
          </ListSubheader>,
        ]
      : []),
    <MenuItem key={name} value={name} disabled={name === unavailable} sx={menuItemSx}>
      {name}
    </MenuItem>,
  ]),
]

const teams = Object.values(TEAM_NAMES).sort((a, b) => a.number.localeCompare(b.number))

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: jtSpacing.section.sm,
  alignItems: 'start',
} as const

/** Buttons, links, toggles, chips and the dropdown. */
export default function ControlsSection() {
  const [view, setView] = useState<'scenario' | 'criterion'>('scenario')
  const [base, setBase] = useState('Business as Usual')
  const [scenario, setScenario] = useState('Eco Machine')

  return (
    <DesignSection id="controls" eyebrow="Components" title="Actions and controls">
      <Box sx={grid}>
        <Specimen
          name="ActionButton"
          spec="Contained or outlined pill. Arrow right stays on the site; up-right leaves it."
          usage={<UsageTag>Every feature</UsageTag>}
        >
          <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <ActionButton label="Compare the scenarios" href="/scenarios/ranking" />
            <ActionButton label="Read the report" href="https://example.org" variant="outlined" />
          </Stack>
        </Specimen>
        <Specimen
          name="TextLink · forthcoming"
          spec="Text link underlines on hover. With no href, a button shows as forthcoming."
        >
          <Stack spacing={2}>
            <TextLink label="See how it was modeled" href="/scenarios/modeling" />
            <ActionButton label="Workshop reports" />
          </Stack>
        </Specimen>
      </Box>

      <Box sx={grid}>
        <Specimen
          name="Segmented"
          spec="Switches a view in place. Green fill, or the host team's color on its own facets."
          usage={<UsageTag>scenario-ranking</UsageTag>}
        >
          <Segmented
            label="Ranking view"
            value={view}
            onChange={setView}
            options={[
              { value: 'scenario', label: 'By scenario' },
              { value: 'criterion', label: 'By criterion' },
            ]}
          />
        </Specimen>
        <Specimen name="StageChip" spec="On, off and plain.">
          <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <StageChip label="Modeled" on />
            <StageChip label="Evaluated" />
            <StageChip label="Ranked" plain />
          </Stack>
        </Specimen>
        <Specimen name="TagChip" spec="Team fill with a dark label. Not a link.">
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {teams.map((team) => (
              <TagChip key={team.key} label={team.shortName} fill={chart.voting.team[team.key]} />
            ))}
          </Stack>
        </Specimen>
      </Box>

      <Specimen
        name="Dropdown · LabeledSelect"
        spec="Field: base.800, border.strong, radius 6; green edge while open. List: base.800 panel, radius 8, dropdown shadow; rows are white; Baseline and Adaptation scenarios heads (navigationSubLabel, base.200) split the list; the chosen option is bold with a green check."
        usage={<UsageTag>scenario-explorer</UsageTag>}
      >
        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap', maxWidth: 720 }}>
          <LabeledSelect
            label="Base Scenario"
            value={base}
            onChange={(event) => setBase(event.target.value)}
          >
            {groupedOptions(scenario)}
          </LabeledSelect>
          <LabeledSelect
            label="Scenario"
            value={scenario}
            onChange={(event) => setScenario(event.target.value)}
          >
            {groupedOptions(base)}
          </LabeledSelect>
        </Stack>
      </Specimen>
    </DesignSection>
  )
}
