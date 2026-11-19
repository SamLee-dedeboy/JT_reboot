// A lead organization's name led by its abbreviation in the lead color: DWR – Department of
// Water Resources. Organizations without an abbreviation show the name alone.
import { Box, useTheme } from '@mui/material'

export default function LeadName({ abbr, name }: { abbr?: string; name: string }) {
  const theme = useTheme()
  if (!abbr) return <>{name}</>
  return (
    <>
      <Box component="span" sx={{ color: theme.chart.governance.lead }}>
        {abbr}
      </Box>
      {` – ${name}`}
    </>
  )
}
