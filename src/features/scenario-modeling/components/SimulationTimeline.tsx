import { Box, Stack, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { waterYearColor } from './styles'
import {
  type SimulationPeriodData,
  type StationModel,
  simulationTimelines,
} from '@/content/modeling'

/** One model's simulation period on its own time axis, labeled by water year type. */
export default function SimulationTimeline({ model }: { model: StationModel }) {
  const { ariaLabel, days, spinUpLabel, endLabel, periods, ticks } = simulationTimelines[model]

  return (
    <>
      <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <Box
          role="img"
          aria-label={ariaLabel}
          sx={{
            minWidth: 360,
            // Room for a last axis label centered on the end of the axis.
            pr: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: jtSpacing.gap.sm,
              mb: 0.5,
            }}
          >
            <Typography variant="meta" sx={{ color: 'base.100' }}>
              {spinUpLabel}
            </Typography>
            <Typography variant="meta" sx={{ color: 'base.100' }}>
              {endLabel}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: periods.map((period) => `minmax(0, ${period.days}fr)`).join(' '),
              minHeight: 58,
            }}
          >
            {periods.map((period, index) => (
              <SimulationPeriod key={index} period={period} />
            ))}
          </Box>
          <Box
            aria-hidden="true"
            sx={{
              position: 'relative',
              mt: 1,
              height: (theme) => theme.spacing(4),
              borderTop: 1,
              borderColor: 'base.100',
            }}
          >
            {ticks.map(({ day, label }) => (
              <Stack
                key={label}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: `${(day / days) * 100}%`,
                  transform: 'translateX(-50%)',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ width: '1px', height: 6, bgcolor: 'base.100' }} />
                <Typography variant="meta" sx={{ color: 'base.100', whiteSpace: 'nowrap' }}>
                  {label}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}

function SimulationPeriod({ period }: { period: SimulationPeriodData }) {
  if (period.tone === 'spinUp') {
    return (
      <Box
        sx={(theme) => ({
          backgroundImage: `repeating-linear-gradient(135deg, ${theme.palette.translucent[400]} 0 5px, transparent 5px 10px)`,
        })}
      />
    )
  }
  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 0.5,
          textAlign: 'center',
          bgcolor: waterYearColor[period.tone],
        },
        'divided' in period && { borderLeft: 2, borderColor: 'base.800' },
      ]}
    >
      {'label' in period && (
        <Typography variant="meta" sx={{ color: 'common.white' }}>
          {period.label}
        </Typography>
      )}
    </Box>
  )
}
