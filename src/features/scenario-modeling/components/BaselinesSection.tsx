import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import WavesOutlinedIcon from '@mui/icons-material/WavesOutlined'
import { Box, Stack, Typography } from '@mui/material'
import type { Future } from '@/content/modeling'
import { jtSpacing } from '@/theme'
import BaselineTable from './BaselineTable'
import { KeyPhrase, SubsectionHeading } from './sectionParts'
import { sectionSx } from './sectionStyles'

const baselineNotes = [
  {
    title: 'Sea level rise.',
    body: 'RMA runs were repeated with 2 feet of sea level rise, the only rise modeled, and those runs are compared with the matching baseline that also has 2 feet of sea level rise. The SCHISM outflow runs have no sea level rise version.',
    Icon: WavesOutlinedIcon,
  },
  {
    title: 'Same locations within a model.',
    body: 'Each scenario and its baseline are compared at the same stations. RMA and SCHISM use different station sets, shown below.',
    Icon: PlaceOutlinedIcon,
  },
] as const

/** The three baselines, the table of what each scenario is compared with, and two notes. */
export default function BaselinesSection({
  onSelectFuture,
}: {
  onSelectFuture: (future: Future) => void
}) {
  return (
    <Box
      component="section"
      id="shared-baseline"
      aria-labelledby="shared-baseline-title"
      sx={sectionSx}
    >
      <SubsectionHeading
        id="shared-baseline-title"
        title={
          <>
            Three baselines for{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              Business as Usual
            </Box>
          </>
        }
      >
        <KeyPhrase>All three baselines represent the same thing: current conditions</KeyPhrase>,
        with no outflow variation or adaptation scenario applied. Only the modeling differs. Each
        scenario is read against the baseline modeled the same way, so{' '}
        <KeyPhrase>the difference reflects the one thing that scenario changes</KeyPhrase>.
      </SubsectionHeading>
      <BaselineTable onSelectFuture={onSelectFuture} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
          gap: jtSpacing.gap.xl,
          pt: jtSpacing.component.lg,
          borderTop: 1,
          borderColor: 'border.strong',
        }}
      >
        {baselineNotes.map(({ title, body, Icon }) => (
          <Stack key={title} direction="row" spacing={jtSpacing.gap.sm}>
            <Icon sx={{ color: 'base.200' }} />
            <Typography variant="body2">
              <Box component="strong" sx={{ color: 'common.white' }}>
                {title}
              </Box>{' '}
              {body}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  )
}
