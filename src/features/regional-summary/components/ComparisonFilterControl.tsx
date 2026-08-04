import { useEffect, useMemo, useState } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import { Box, Button, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import type { ComparisonFilter, ComparisonFilterMode, RegionalScenario } from '../types'

const DATA_URL = `${import.meta.env.BASE_URL}data/regional-summary/all-scenario-comparisons.json`

interface ComparisonRow {
  scenario: string
  comparison_scenario: string
  place: string
  difference_us_cm: number
  difference_percent: number
  start_date: string
  end_date: string
}

interface ComparisonFilterControlProps {
  filter: ComparisonFilter
  scenario: RegionalScenario
  onChange: (filter: ComparisonFilter) => void
}

function passesFilter(row: ComparisonRow, filter: ComparisonFilter) {
  const passesUs = Math.abs(row.difference_us_cm) >= filter.minimumUsCm
  const passesPercent = Math.abs(row.difference_percent) >= filter.minimumPercent
  if (!filter.showUsCm && !filter.showPercent) return true
  if (!filter.showUsCm) return passesPercent
  if (!filter.showPercent) return passesUs
  return filter.mode === 'either' ? passesUs || passesPercent : passesUs && passesPercent
}

function passesTimeFilter(row: ComparisonRow, filter: ComparisonFilter) {
  const rowStart = row.start_date.slice(0, 7)
  const rowEnd = row.end_date.slice(0, 7)
  return (!filter.startMonth || rowEnd >= filter.startMonth)
    && (!filter.endMonth || rowStart < filter.endMonth)
}

export default function ComparisonFilterControl({ filter, scenario, onChange }: ComparisonFilterControlProps) {
  const [rows, setRows] = useState<ComparisonRow[]>([])

  useEffect(() => {
    fetch(DATA_URL)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load comparisons')))
      .then((payload) => setRows(payload.places.flatMap((place: { comparisons: ComparisonRow[] }) => place.comparisons)))
      .catch(() => setRows([]))
  }, [])

  const result = useMemo(() => {
    const comparisons = rows.filter((row) => row.scenario === scenario && row.comparison_scenario === 'Business as Usual' && passesFilter(row, filter) && passesTimeFilter(row, filter))
    return { periods: comparisons.length, places: new Set(comparisons.map((row) => row.place)).size }
  }, [filter, rows, scenario])

  const field = (label: string, value: number, disabled: boolean, update: (value: number) => void) => (
    <TextField disabled={disabled} label={label} type="number" value={value} onChange={(event) => update(Math.max(0, Number(event.target.value) || 0))} slotProps={{ htmlInput: { min: 0 } }} sx={{ minWidth: 108, opacity: disabled ? 0.45 : 1, transition: 'opacity 160ms ease', '& .MuiInputBase-root': { height: 34 }, '& .MuiInputBase-input': { typography: 'captionSmall', py: 0.5, px: 1 } }} />
  )

  const conditionToggle = (label: string, checked: boolean, update: (checked: boolean) => void) => (
    <ToggleButton
      aria-label={`${checked ? 'Disable' : 'Enable'} ${label} threshold`}
      selected={checked}
      size="small"
      value={label}
      onChange={() => update(!checked)}
      sx={{ gap: 0.5, height: 34, px: 1, textTransform: 'none', whiteSpace: 'nowrap', '&.Mui-selected': { bgcolor: 'brand.primaryGreen', color: 'common.black' }, '&.Mui-selected:hover': { bgcolor: 'brand.primaryGreen' } }}
    >
      {checked ? <CheckCircleRoundedIcon fontSize="small" /> : <RadioButtonUncheckedRoundedIcon fontSize="small" />}
    </ToggleButton>
  )

  return (
    <Stack data-tour="regional-thresholds" role="group" aria-label="Comparison threshold filter" sx={(theme) => ({ border: '1px solid', borderColor: 'divider', borderRadius: 1, display: 'grid', gridTemplateColumns: 'auto minmax(108px, 1fr) auto auto minmax(92px, .8fr)', gridTemplateRows: '34px 26px', columnGap: theme.jtSpacing.gap.xs, rowGap: theme.jtSpacing.gap.xs, alignContent: 'center', minWidth: 0, px: theme.jtSpacing.component.xs, py: theme.jtSpacing.component.xs })}>
      {conditionToggle('µS/cm', filter.showUsCm, (showUsCm) => onChange({ ...filter, showUsCm }))}
      {field('Minimum µS/cm', filter.minimumUsCm, !filter.showUsCm, (minimumUsCm) => onChange({ ...filter, minimumUsCm }))}
      {filter.showUsCm && filter.showPercent ? (
        <ToggleButtonGroup exclusive size="small" value={filter.mode} onChange={(_, mode: ComparisonFilterMode | null) => mode && onChange({ ...filter, mode })} aria-label="Threshold operator">
          <ToggleButton value="either">OR</ToggleButton>
          <ToggleButton value="both">AND</ToggleButton>
        </ToggleButtonGroup>
      ) : <Box aria-hidden sx={{ minWidth: 88 }} />}
      {conditionToggle('%', filter.showPercent, (showPercent) => onChange({ ...filter, showPercent }))}
      {field('Minimum %', filter.minimumPercent, !filter.showPercent, (minimumPercent) => onChange({ ...filter, minimumPercent }))}
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, gridColumn: '1 / -1', gridRow: 2, justifyContent: 'space-between', minWidth: 0 }}>
        <Button size="small" variant="text" startIcon={<ReplayRoundedIcon />} onClick={() => onChange({ ...filter, mode: 'either', showUsCm: true, showPercent: true, minimumUsCm: 450, minimumPercent: 10 })} sx={{ minHeight: 26, minWidth: 0, overflow: 'hidden', py: 0, textOverflow: 'ellipsis', textTransform: 'none', whiteSpace: 'nowrap' }}>
          Restore recommended: 450 µS/cm OR 10%
        </Button>
        <Typography variant="captionSmall" sx={{ color: 'base.100', flexShrink: 0, fontWeight: 700, whiteSpace: 'nowrap' }}>
          {result.periods.toLocaleString()} periods across {result.places} places
        </Typography>
      </Box>
    </Stack>
  )
}
