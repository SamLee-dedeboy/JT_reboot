import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { jtSpacing } from '../../../theme'
import { adaptationScenarios, outflowResultVariations } from '../content'
import { explorerHref } from './explorerLinks'
import { ModelingResults } from './ScenarioResults'

interface SalinityOption {
  id: string
  label: string
  scenarioSlug: string
  outflowVariation?: 'increase' | 'decrease'
  explorerHref: string
}

/** Every modeled future, grouped the way the modeling step introduces them. */
const optionGroups: { title: string; options: SalinityOption[] }[] = [
  {
    title: 'Outflow variations',
    options: outflowResultVariations.map((variation) => ({
      id: variation.id,
      label: variation.label,
      scenarioSlug: 'tiered-outflows',
      outflowVariation: variation.id,
      explorerHref: explorerHref({ outflowExplorerKey: variation.explorerKey }),
    })),
  },
  {
    title: 'Adaptation scenarios',
    options: adaptationScenarios.map((scenario) => ({
      id: scenario.slug,
      label: scenario.title,
      scenarioSlug: scenario.slug,
      explorerHref: explorerHref({ scenarioSlug: scenario.slug }),
    })),
  },
]

const allOptions = optionGroups.flatMap((group) => group.options)

/** Modeling step: the simplified regional salinity view for any modeled future. */
export default function ModeledSalinity() {
  const [selectedId, setSelectedId] = useState(allOptions[0].id)
  const selected = allOptions.find((option) => option.id === selectedId) ?? allOptions[0]

  return (
    <Stack spacing={jtSpacing.component.lg}>
      {/* Future picker: one row per family, the selected future filled. */}
      <Stack spacing={jtSpacing.gap.md}>
        {optionGroups.map((group) => (
          <Box key={group.title}>
            <Typography variant="eyebrow" sx={{ display: 'block', color: 'base.200' }}>
              {group.title}
            </Typography>
            <Stack
              direction="row"
              useFlexGap
              spacing={jtSpacing.gap.sm}
              sx={{ flexWrap: 'wrap', mt: jtSpacing.gap.sm }}
            >
              {group.options.map((option) => {
                const active = option.id === selected.id
                return (
                  <Button
                    key={option.id}
                    variant={active ? 'contained' : 'outlined'}
                    aria-pressed={active}
                    onClick={() => setSelectedId(option.id)}
                    sx={active ? undefined : { color: 'common.white', borderColor: 'base.300' }}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </Stack>
          </Box>
        ))}
      </Stack>
      <ModelingResults
        scenarioSlug={selected.scenarioSlug}
        scenarioTitle={selected.label}
        outflowVariation={selected.outflowVariation}
        explorerHref={selected.explorerHref}
      />
    </Stack>
  )
}
