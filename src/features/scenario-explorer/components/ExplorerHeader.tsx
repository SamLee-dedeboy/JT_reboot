import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { DashboardMode } from '../types';

const MODES: ReadonlyArray<{ number: string; label: string; value: DashboardMode }> = [
  { number: '01', label: 'RMA Scenario Comparison', value: 'rma-scenarios' },
  { number: '02', label: 'Tiered Outflows', value: 'tiered-outflows' },
  { number: '03', label: 'RMA vs. SCHISM', value: 'rma-schism' },
  { number: '04', label: 'SCHISM Runs', value: 'schism-runs' },
];

interface ExplorerHeaderProps {
  description: string;
  mode: DashboardMode;
  onModeChange: (mode: DashboardMode) => void;
  onTutorialOpen: () => void;
  showSchismRuns?: boolean;
}

export default function ExplorerHeader({ description, mode, onModeChange, onTutorialOpen, showSchismRuns = false }: ExplorerHeaderProps) {
  return (
    <Box
      component="header"
      data-tour="explorer-purpose"
      sx={(theme) => ({
        display: 'grid',
        flex: '0 0 auto',
        gap: theme.jtSpacing.gap.sm,
        gridTemplateRows: 'auto auto',
        mb: theme.jtSpacing.section.xs,
        width: '100%',
      })}
    >
      <Box
        sx={(theme) => ({
          alignItems: 'center',
          display: 'grid',
          gap: theme.jtSpacing.gap.sm,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(max-content, 1fr) auto minmax(max-content, 1fr)' },
          width: '100%',
        })}
      >
        <Typography component="h1" variant="h2" sx={{ alignSelf: 'center', justifySelf: 'start' }}>
          Salinity <Box component="span" color="primary.main">difference</Box> explorer
        </Typography>
        <Tabs
          data-tour="comparison-tabs"
          aria-label="Dashboard comparison mode"
          onChange={(_, value: DashboardMode) => onModeChange(value)}
          scrollButtons={false}
          value={mode}
          variant="scrollable"
          sx={(theme) => ({
            alignSelf: 'center',
            justifySelf: { xs: 'stretch', lg: 'center' },
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
              transition: 'background-color 180ms ease, border-color 180ms ease, color 180ms ease',
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
          {MODES.filter(({ value }) => value !== 'schism-runs' || showSchismRuns).map(({ number, label, value }) => (
            <Tab
              key={value}
              value={value}
              label={
                <Box sx={(theme) => ({ alignItems: 'center', display: 'grid', gap: theme.jtSpacing.gap.xs, gridTemplateColumns: 'auto minmax(0, 1fr)', width: '100%' })}>
                  <Typography component="span" variant="button" sx={{ color: mode === value ? 'common.black' : 'brand.primaryBlue' }}>{number}</Typography>
                  <Typography component="span" variant="button" sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</Typography>
                </Box>
              }
            />
          ))}
        </Tabs>
        <Button onClick={onTutorialOpen} variant="outlined" sx={(theme) => ({ alignSelf: 'center', height: theme.spacing(5), justifySelf: { xs: 'start', lg: 'end' } })}>
          Tutorial
        </Button>
      </Box>
      <Typography component="p" variant="caption" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
