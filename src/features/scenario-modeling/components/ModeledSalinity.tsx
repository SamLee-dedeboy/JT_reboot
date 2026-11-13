import { Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { jtSpacing } from '@/theme'
import { adaptationScenarios } from '@/content/scenarios'
import { outflowResultVariations } from './outflowVariations'
import { Segmented } from '@/ui'
import ChoiceCards from './ChoiceCards'
import { explorerHref } from './explorerLinks'
import ModelingResults from './ModelingResults'

interface SalinityOption {
  id: string
  /** The name on its card; `title` reads as part of a sentence in the results. */
  label: string
  title: string
  scenarioSlug: string
  outflowVariation?: 'increase' | 'decrease'
  explorerHref: string
}

const outflowCardLabels = { decrease: '−10% Delta outflow', increase: '+30% Delta outflow' }

/** Every modeled future, grouped the way the modeling step introduces them. */
const optionGroups: { id: string; title: string; options: SalinityOption[] }[] = [
  {
    id: 'outflow',
    title: 'Outflow variations',
    options: outflowResultVariations.map((variation) => ({
      id: variation.id,
      label: outflowCardLabels[variation.id],
      title: variation.label,
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
      title: scenario.title,
      scenarioSlug: scenario.slug,
      explorerHref: explorerHref({ scenarioSlug: scenario.slug }),
    })),
  },
]

const options = optionGroups.flatMap((group) => group.options)

type SeaLevel = 'current' | 'rise'

/** Modeling step: the simplified regional salinity view for any modeled future. */
export default function ModeledSalinity({
  showHeading = true,
  headingId,
}: {
  showHeading?: boolean
  headingId?: string
}) {
  const [selectedId, setSelectedId] = useState(options[0].id)
  const selected = options.find(({ id }) => id === selectedId) ?? options[0]
  const [chosenSeaLevel, setChosenSeaLevel] = useState<SeaLevel>('current')
  // The SCHISM outflow runs have no sea level rise version.
  const seaLevel = selected.outflowVariation ? 'current' : chosenSeaLevel

  return (
    <Stack spacing={jtSpacing.component.lg}>
      <ChoiceCards groups={optionGroups} value={selected.id} onChange={setSelectedId} />
      <Box>
        <Typography variant="columnHead" component="p" sx={{ mb: jtSpacing.gap.xs }}>
          Sea level
        </Typography>
        <Segmented<SeaLevel>
          label="Sea level"
          value={seaLevel}
          options={[
            { value: 'current', label: 'Current' },
            {
              value: 'rise',
              label: '2 feet of sea level rise',
              disabled: Boolean(selected.outflowVariation),
            },
          ]}
          onChange={setChosenSeaLevel}
          dense
          nowrap
        />
      </Box>
      <ModelingResults
        scenarioSlug={selected.scenarioSlug}
        scenarioTitle={selected.title}
        outflowVariation={selected.outflowVariation}
        seaLevelRise={seaLevel === 'rise'}
        explorerHref={selected.explorerHref}
        showHeading={showHeading}
        headingId={headingId}
      />
    </Stack>
  )
}
