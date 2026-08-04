import CloseIcon from '@mui/icons-material/Close'
import { Box, Dialog, IconButton, Typography } from '@mui/material'
import { palette } from '../../../../theme/muiTheme'
import ComparisonTimeSeriesChart from './ComparisonTimeSeriesChart'

const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
  year: 'numeric',
}).format(new Date(`${value}T00:00:00Z`))

interface ComparisonTimeSeriesDialogProps {
  comparison: {
    comparison_id: string
    direction: 'saltier' | 'fresher'
    end_date: string
    place: string
    scenario: string
    start_date: string
    time_series_ref: string
  } | null
  onClose: () => void
}

export default function ComparisonTimeSeriesDialog({ comparison, onClose }: ComparisonTimeSeriesDialogProps) {
  return (
    <Dialog fullWidth maxWidth="lg" open={Boolean(comparison)} onClose={onClose} slotProps={{ paper: { sx: { bgcolor: palette.base[900], color: palette.common.white, height: 'min(760px, calc(100dvh - 48px))', maxHeight: 'calc(100dvh - 48px)' } } }}>
      {comparison && (
        <Box sx={{ display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)', minHeight: 0 }}>
          <Box component="header" sx={{ alignItems: 'start', bgcolor: palette.base[800], borderBottom: `1px solid ${palette.base[500]}`, display: 'grid', gap: 2, gridTemplateColumns: 'minmax(0, 1fr) auto', px: { xs: 2, md: 4 }, py: 2 }}>
            <Box>
              <Typography component="h2" variant="h4">Daily deviation</Typography>
              <Typography component="p" variant="body2" sx={{ color: palette.base[100], mt: 0.5 }}>
                {comparison.scenario} compared with Business as Usual · {comparison.place}
              </Typography>
              <Typography component="p" variant="captionSmall" sx={{ color: palette.base[200], mt: 0.5 }}>
                {formatDate(comparison.start_date)}–{formatDate(comparison.end_date)} · Positive values are saltier; negative values are fresher.
              </Typography>
              <Typography component="p" variant="captionSmall" sx={{ color: palette.base[200], mt: 0.5, maxWidth: 900 }}>
                Daily deviation is the selected scenario minus Business as Usual for each modeled day. The rolling deviation averages recent daily values over the region’s D-1641-informed time window, reducing short-term fluctuations so sustained changes are easier to see.
              </Typography>
            </Box>
            <IconButton aria-label="Close daily deviation chart" onClick={onClose} sx={{ color: palette.brand.primaryGreen }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ alignContent: 'center', minHeight: 0, overflow: 'auto', p: { xs: 2, md: 3 } }}>
            <ComparisonTimeSeriesChart comparisonId={comparison.time_series_ref} direction={comparison.direction} endDate={comparison.end_date} startDate={comparison.start_date} />
          </Box>
        </Box>
      )}
    </Dialog>
  )
}
