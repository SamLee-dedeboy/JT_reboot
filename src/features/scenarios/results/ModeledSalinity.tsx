import { Box, Stack, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { jtSpacing } from '../../../theme'
import { adaptationScenarios, outflowResultVariations } from '../content'
import { explorerHref } from './explorerLinks'
import ModelingResults from './ModelingResults'

interface SalinityOption {
  id: string
  label: string
  scenarioSlug: string
  outflowVariation?: 'increase' | 'decrease'
  explorerHref: string
}

/** Every modeled future, grouped the way the modeling step introduces them. */
const optionGroups: { id: string; title: string; options: SalinityOption[] }[] = [
  {
    id: 'outflow',
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
    id: 'adaptation',
    title: 'Adaptation scenarios',
    options: adaptationScenarios.map((scenario) => ({
      id: scenario.slug,
      label: scenario.title,
      scenarioSlug: scenario.slug,
      explorerHref: explorerHref({ scenarioSlug: scenario.slug }),
    })),
  },
]

/** Modeling step: the simplified regional salinity view for any modeled future. */
export default function ModeledSalinity({
  showHeading = true,
  headingId,
}: {
  showHeading?: boolean
  headingId?: string
}) {
  const [groupId, setGroupId] = useState(optionGroups[0].id)
  // Each family remembers its own future, so switching back returns to it.
  const [selectedIds, setSelectedIds] = useState<Record<string, string>>({})
  const group = optionGroups.find(({ id }) => id === groupId) ?? optionGroups[0]
  const selected = group.options.find(({ id }) => id === selectedIds[group.id]) ?? group.options[0]

  return (
    <Stack spacing={jtSpacing.component.lg}>
      {/* Two stacked tab rows: the family of futures, then a future within it. */}
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'border.default' }}>
          <Tabs
            value={group.id}
            onChange={(_, value: string) => setGroupId(value)}
            aria-label="Family of modeled futures"
            variant="scrollable"
            scrollButtons={false}
          >
            {optionGroups.map(({ id, title }) => (
              <Tab key={id} value={id} label={title} />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ bgcolor: 'translucent.50', borderBottom: 1, borderColor: 'border.subtle' }}>
          <Tabs
            value={selected.id}
            onChange={(_, value: string) =>
              setSelectedIds((current) => ({ ...current, [group.id]: value }))
            }
            aria-label={group.title}
            variant="scrollable"
            scrollButtons={false}
          >
            {group.options.map(({ id, label }) => (
              <Tab key={id} value={id} label={label} />
            ))}
          </Tabs>
        </Box>
      </Box>
      <ModelingResults
        scenarioSlug={selected.scenarioSlug}
        scenarioTitle={selected.label}
        outflowVariation={selected.outflowVariation}
        explorerHref={selected.explorerHref}
        showHeading={showHeading}
        headingId={headingId}
      />
    </Stack>
  )
}
