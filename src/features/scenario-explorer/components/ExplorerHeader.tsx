import { Box, Button, FormControl, MenuItem, Select, Tab, Tabs, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link } from 'react-router-dom'
import { explorerControl } from '@/theme'
import { useCompactExplorer } from '../explorerType'
import { menuItemSx, selectMenuProps } from './controlStyles'
import type { DashboardMode } from '../types'

const MODES: ReadonlyArray<{ number: string; label: string; value: DashboardMode }> = [
  { number: '01', label: 'RMA Scenario Comparison', value: 'rma-scenarios' },
  { number: '02', label: 'Tiered Outflows', value: 'tiered-outflows' },
  { number: '03', label: 'RMA vs. SCHISM', value: 'rma-schism' },
  { number: '04', label: 'SCHISM Runs', value: 'schism-runs' },
  { number: '05', label: 'SLR vs. Current', value: 'slr-current' },
  { number: '06', label: 'Compare SLR Scenarios', value: 'slr-scenarios' },
  { number: '07', label: 'RMA vs. CalSim', value: 'rma-calsim' },
  { number: '08', label: 'COR and TUN', value: 'calsim-scenarios' },
]

const PUBLIC_MODES: ReadonlyArray<{ number: string; label: string; value: DashboardMode }> = [
  { number: '01', label: 'Adaptation Scenario Comparison', value: 'rma-scenarios' },
  { number: '02', label: 'Alternative Delta Outflow', value: 'tiered-outflows' },
  {
    number: '03',
    label: 'Sea Level Rise Adaptation Scenario Comparison',
    value: 'slr-scenarios',
  },
  { number: '04', label: 'Sea Level Rise vs. Current Comparison', value: 'slr-current' },
]

interface ExplorerHeaderProps {
  description: string
  mode: DashboardMode
  onModeChange: (mode: DashboardMode) => void
  onTutorialOpen: () => void
  showSchismRuns?: boolean
  showSlrModes?: boolean
  publicModesOnly?: boolean
}

export default function ExplorerHeader({
  description,
  mode,
  onModeChange,
  onTutorialOpen,
  showSchismRuns = false,
  showSlrModes = false,
  publicModesOnly = false,
}: ExplorerHeaderProps) {
  const compact = useCompactExplorer()
  const availableModes = publicModesOnly
    ? PUBLIC_MODES
    : MODES.filter(
        ({ value }) =>
          (value !== 'schism-runs' || showSchismRuns) &&
          (!value.startsWith('slr-') || showSlrModes),
      )

  return (
    <Box
      component="header"
      data-tour="explorer-purpose"
      sx={(theme) => ({
        display: 'grid',
        flex: '0 0 auto',
        gap: 0.75,
        mb: theme.jtSpacing.gap.sm,
        width: '100%',
      })}
    >
      <Box
        sx={(theme) => ({
          alignItems: 'center',
          display: 'grid',
          gap: theme.jtSpacing.gap.sm,
          gridTemplateAreas: {
            xs: '"title tutorial" "back back" "mode mode"',
            lg: '"title back mode tutorial"',
          },
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr) auto',
            lg: 'max-content max-content minmax(20rem, 30rem) minmax(max-content, 1fr)',
          },
          width: '100%',
        })}
      >
        <Typography component="h1" variant="h2" sx={{ gridArea: 'title', justifySelf: 'start' }}>
          Salinity{' '}
          <Box component="span" color="primary.main">
            difference
          </Box>{' '}
          explorer
        </Typography>
        <Button
          component={Link}
          to="/scenarios/modeling"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          aria-label="Back to Modeling"
          sx={{
            alignSelf: 'center',
            gridArea: 'back',
            height: explorerControl.headerHeight,
            justifySelf: 'start',
            whiteSpace: 'nowrap',
          }}
        >
          {compact ? 'Back' : 'Back to Modeling'}
        </Button>
        {showSlrModes || publicModesOnly ? (
          <Box
            sx={{
              alignSelf: 'center',
              display: 'grid',
              gap: 0.25,
              gridArea: 'mode',
              minWidth: 0,
            }}
          >
            <FormControl data-tour="comparison-tabs" size="small">
              <Select
                aria-label="Dashboard comparison mode"
                value={mode}
                onChange={(event) => onModeChange(event.target.value as DashboardMode)}
                MenuProps={selectMenuProps}
                sx={(theme) => ({
                  bgcolor: alpha(theme.palette.brand.primaryBlue, 0.08),
                  borderRadius: explorerControl.pillRadius,
                  color: 'brand.primaryBlue',
                  height: explorerControl.headerHeight,
                  typography: 'button',
                  '& .MuiSelect-select': {
                    alignItems: 'center',
                    display: 'flex',
                    overflow: 'hidden',
                    pl: 2,
                    py: 0,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'brand.primaryBlue',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: 'brand.primaryBlue',
                    },
                  '& .MuiSelect-icon': {
                    color: 'brand.primaryBlue',
                    transition: 'transform 160ms ease',
                  },
                })}
              >
                {availableModes.map(({ number, label, value }) => (
                  <MenuItem key={value} value={value} sx={menuItemSx}>
                    <Box
                      component="span"
                      sx={(theme) => ({
                        alignItems: 'baseline',
                        display: 'grid',
                        gap: theme.jtSpacing.gap.sm,
                        gridTemplateColumns: 'auto minmax(0, 1fr)',
                      })}
                    >
                      <Typography
                        component="span"
                        variant="numberBadge"
                        sx={{ color: 'brand.primaryBlue' }}
                      >
                        {number}
                      </Typography>
                      <Box component="span">{label}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {publicModesOnly && (
              <Typography
                component="p"
                variant="captionSmall"
                sx={{ color: 'brand.primaryBlue', m: 0 }}
              >
                ↑ Check out other comparisons
              </Typography>
            )}
          </Box>
        ) : (
          <Tabs
            data-tour="comparison-tabs"
            aria-label="Dashboard comparison mode"
            onChange={(_, value: DashboardMode) => onModeChange(value)}
            scrollButtons={false}
            value={mode}
            variant="scrollable"
            sx={(theme) => ({
              alignSelf: 'center',
              gridArea: 'mode',
              minHeight: theme.spacing(5),
              '& .MuiTabs-flexContainer': { alignItems: 'center', gap: theme.jtSpacing.gap.xs },
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                border: 1,
                borderColor: 'transparent',
                borderRadius: 'var(--mui-shape-borderRadius)',
                color: 'common.white',
                minHeight: theme.spacing(5),
                minWidth: { xs: theme.spacing(24), sm: 0 },
                opacity: 1,
                px: theme.jtSpacing.component.sm,
                py: 0,
                transition:
                  'background-color 180ms ease, border-color 180ms ease, color 180ms ease',
                '&:hover, &:focus-visible': {
                  bgcolor: alpha(theme.palette.brand.primaryBlue, 0.14),
                  borderColor: alpha(theme.palette.brand.primaryBlue, 0.3),
                  outline: 'none',
                },
                '&.Mui-selected': {
                  bgcolor: 'brand.primaryBlue',
                  borderColor: 'brand.primaryBlue',
                  color: 'common.black',
                },
              },
              '& .MuiTabs-scroller': { overflowX: 'auto !important', scrollbarWidth: 'none' },
              '& .MuiTabs-scroller::-webkit-scrollbar': { display: 'none' },
            })}
          >
            {availableModes.map(({ number, label, value }) => (
              <Tab
                key={value}
                value={value}
                label={
                  <Box
                    sx={(theme) => ({
                      alignItems: 'center',
                      display: 'grid',
                      gap: theme.jtSpacing.gap.xs,
                      gridTemplateColumns: 'auto minmax(0, 1fr)',
                      width: '100%',
                    })}
                  >
                    <Typography
                      component="span"
                      variant="button"
                      sx={{ color: mode === value ? 'common.black' : 'brand.primaryBlue' }}
                    >
                      {number}
                    </Typography>
                    <Typography
                      component="span"
                      variant="button"
                      sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}
                    >
                      {label}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Tabs>
        )}
        <Button
          onClick={onTutorialOpen}
          variant="outlined"
          sx={{
            alignSelf: 'center',
            gridArea: 'tutorial',
            height: explorerControl.headerHeight,
            justifySelf: 'end',
          }}
        >
          Tutorial
        </Button>
      </Box>
      {/* One line once there is room; a phone wraps it so nothing is lost without hover. */}
      <Typography
        component="p"
        variant="controlValue"
        title={description}
        sx={{
          color: 'base.100',
          overflow: { md: 'hidden' },
          textOverflow: { md: 'ellipsis' },
          whiteSpace: { md: 'nowrap' },
        }}
      >
        {description}
      </Typography>
    </Box>
  )
}
