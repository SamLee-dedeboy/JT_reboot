// Ported from JT_dashboard/src/lib/Flow/components/Section.svelte.
// The "participant" and "background" branches (Participant.svelte,
// Background.svelte) are dropped: no section with those ids exists in the
// store, so they could never render.
import { Box } from '@mui/material'
import type { BlockAggregator } from '../renderers/BlockAggregator'
import type { tSectionMetadata } from '../types'
import DecisionMaking from './sections/DecisionMaking'
import DriversOfChange from './sections/DriversOfChange'
import FutureManagement from './sections/FutureManagement'
import SectionHeader from './sections/SectionHeader'

interface Props {
  section: tSectionMetadata
  block_aggregator: BlockAggregator
}

export default function Section({ section, block_aggregator }: Props) {
  if (section.id === 'drivers_of_change') {
    return (
      <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
        <SectionHeader section={section} />
        <DriversOfChange section={section} block_aggregator={block_aggregator} />
      </Box>
    )
  }
  if (section.id === 'future_management') {
    return (
      <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
        <SectionHeader section={section} />
        <FutureManagement section={section} block_aggregator={block_aggregator} />
      </Box>
    )
  }
  if (section.id === 'decision_making') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SectionHeader section={section} />
        <DecisionMaking section={section} block_aggregator={block_aggregator} />
      </Box>
    )
  }
  if (section.id === 'decision_making_2' || section.id === 'decision_making_3') {
    return (
      <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
        <SectionHeader section={section} />
        <DecisionMaking section={section} block_aggregator={block_aggregator} />
      </Box>
    )
  }
  return null
}
