import { Box, Container, Stack, Typography } from '@mui/material'
import { jtSpacing, ranking } from '@/theme'
import { RANK_LABEL } from '../../styles'
import { railSx } from '../rankingLayout'

const headsUpPoints = [
  {
    title: 'Weights express values',
    body: 'Raising a criterion says it matters more to you. The criterion scores themselves stay exactly as reported.',
  },
  {
    title: 'Zero means today, not neutral',
    body: 'Every score is measured against Business as Usual. A future at zero performs like today’s Delta.',
  },
  {
    title: 'Close scores are near ties',
    body: 'Futures a few tenths apart can swap places with a small change in weight. Treat neighboring ranks as close calls, not clear wins.',
  },
]

export default function HeadsUp() {
  return (
    <Box
      component="section"
      aria-labelledby="heads-up"
      sx={{ bgcolor: 'base.800', borderBottom: 1, borderColor: 'border.default' }}
    >
      <Container
        maxWidth={false}
        sx={{ ...railSx, py: { xs: jtSpacing.section.lg, md: jtSpacing.section.xl } }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 5fr) minmax(0, 7fr)' },
            gap: { xs: jtSpacing.section.sm, md: jtSpacing.section.lg },
            alignItems: 'start',
          }}
        >
          <Stack spacing={jtSpacing.gap.lg} sx={{ alignItems: 'flex-start' }}>
            <Typography variant="eyebrow">Before you reweigh</Typography>
            <Typography id="heads-up" variant="h2">
              A note on changing the weights
            </Typography>
            <Typography variant="body1" sx={{ color: 'base.100' }}>
              Next, you decide which outcomes matter most. Weights change the order, never the
              evidence. Keep three things in mind as you explore.
            </Typography>
          </Stack>
          <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {headsUpPoints.map((point, index) => (
              <Box
                component="li"
                key={point.title}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: ranking.headsUp.columns,
                  gap: jtSpacing.gap.md,
                  py: jtSpacing.component.lg,
                  borderTop: 1,
                  borderBottom: index === headsUpPoints.length - 1 ? 1 : 0,
                  borderColor: 'border.default',
                }}
              >
                <Typography variant="chartValueLarge" sx={RANK_LABEL}>
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Stack spacing={jtSpacing.gap.xs}>
                  <Typography variant="navigationLabel" component="h3">
                    {point.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'base.100' }}>
                    {point.body}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
