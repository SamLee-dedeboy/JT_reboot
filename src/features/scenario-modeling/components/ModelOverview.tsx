import { Box, Stack, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { type StationModel, modeledOutputs } from '@/content/modeling'
import { GroupBlock } from './sectionParts'
import StationMap from './StationMap'
import SimulationTimeline from './SimulationTimeline'

/** The outputs one model reports. */
function ModeledOutputs({ model }: { model: StationModel }) {
  return (
    <Stack spacing={jtSpacing.gap.sm}>
      {modeledOutputs
        .filter((output) => model === 'rma' || !('adaptationOnly' in output))
        .map((output) => (
          <Box key={output.title}>
            <Typography variant="cardTitle" component="p" sx={{ color: 'primary.main' }}>
              {output.title}
            </Typography>
            <Typography variant="body2">
              {output.body}
              {'availability' in output && ` ${output.availability}`}
            </Typography>
          </Box>
        ))}
    </Stack>
  )
}

/** Where a model samples, beside when it runs and what it reports. */
export default function ModelOverview({
  model,
  stationNote,
}: {
  model: StationModel
  stationNote: string
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 2fr) minmax(0, 3fr)' },
        gap: jtSpacing.gap.xl,
        alignItems: 'start',
        mt: jtSpacing.component.lg,
      }}
    >
      <GroupBlock title="Station locations">
        <Typography variant="body2" sx={{ mb: jtSpacing.gap.sm }}>
          {stationNote}
        </Typography>
        <StationMap model={model} />
      </GroupBlock>
      <Stack spacing={jtSpacing.component.lg} sx={{ minWidth: 0 }}>
        <GroupBlock title="Simulation time">
          <SimulationTimeline model={model} />
        </GroupBlock>
        <GroupBlock title="What is modeled">
          <ModeledOutputs model={model} />
        </GroupBlock>
      </Stack>
    </Box>
  )
}
