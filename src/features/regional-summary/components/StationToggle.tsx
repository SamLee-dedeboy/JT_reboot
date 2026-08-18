import { Box, Switch, Typography } from '@mui/material'

interface StationToggleProps {
  showStations: boolean
  onStationsChange: (checked: boolean) => void
}

export default function StationToggle({ showStations, onStationsChange }: StationToggleProps) {
  return (
    <Box
      data-tour="regional-stations"
      role="group"
      aria-label="RMA station layer"
      sx={(theme) => ({
        alignContent: 'center',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gridTemplateRows: 'auto auto',
        columnGap: theme.jtSpacing.gap.xs,
        rowGap: theme.jtSpacing.gap.xs,
        minWidth: 0,
        px: theme.jtSpacing.component.xs,
        py: theme.jtSpacing.component.xs,
      })}
    >
      <Typography
        variant="button"
        component="span"
        sx={{ alignSelf: 'center', color: showStations ? 'primary.main' : 'common.white' }}
      >
        RMA stations
      </Typography>
      <Switch
        checked={showStations}
        color="primary"
        onChange={(event) => onStationsChange(event.target.checked)}
        slotProps={{ input: { 'aria-label': 'Show 386 RMA station points' } }}
        sx={{ alignSelf: 'center' }}
      />
      <Typography
        variant="captionSmall"
        component="span"
        sx={{ color: 'base.100', gridColumn: '1 / -1' }}
      >
        386 stations
      </Typography>
    </Box>
  )
}
