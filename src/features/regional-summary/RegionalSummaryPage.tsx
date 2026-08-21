import { useCallback, useState } from 'react'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import StationToggle from './components/StationToggle'
import ComparisonFilterControl from './components/ComparisonFilterControl'
import TimeRangeControl from './components/TimeRangeControl'
import RegionalSummaryTutorial from './components/RegionalSummaryTutorial'
import RegionalSummaryMethod from './components/RegionalSummaryMethod'
import StationMaximumMode from './components/StationMaximumMode'
import ArtworkMap from './components/map/Map'
import {
  DISABLED_SCENARIOS,
  SCENARIOS,
  type ComparisonFilter,
  type RegionalScenario,
  type SelectedRegionTimeline,
} from './types'

export default function RegionalSummaryPage() {
  const [viewMode, setViewMode] = useState<'regional' | 'station-maximum'>('regional')
  const [showStations, setShowStations] = useState(false)
  const [scenario, setScenario] = useState<RegionalScenario>(SCENARIOS[1])
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [methodOpen, setMethodOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegionTimeline | null>(null)
  const [focusedReportId, setFocusedReportId] = useState<string | null>(null)
  const [comparisonFilter, setComparisonFilter] = useState<ComparisonFilter>({
    mode: 'either',
    showUsCm: true,
    showPercent: true,
    minimumUsCm: 450,
    minimumPercent: 10,
    startMonth: null,
    endMonth: null,
  })
  const handleSelectedRegionChange = useCallback((region: SelectedRegionTimeline | null) => {
    setSelectedRegion(region)
    setFocusedReportId(null)
  }, [])

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'base.800' }}>
      <Box
        component="main"
        aria-label="Regional Summary"
        sx={{
          height: '100dvh',
          minHeight: 520,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'base.800',
        }}
      >
        <Box
          component="header"
          sx={{
            display: 'grid',
            alignContent: 'center',
            gridTemplateRows: 'auto auto auto',
            rowGap: 1.25,
            flex: '0 0 auto',
            position: 'relative',
            width: '100%',
            zIndex: 3,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1.5, md: 2 },
          }}
        >
          <Box
            data-tour="regional-purpose"
            sx={(theme) => ({
              alignItems: 'center',
              display: 'grid',
              gap: theme.jtSpacing.gap.md,
              gridTemplateColumns: 'minmax(0, 1fr) auto',
            })}
          >
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  color: 'common.white',
                  fontSize: { xs: '1.35rem', sm: '2rem', md: '2.6rem' },
                  lineHeight: 1,
                }}
              >
                Regional Summary
              </Typography>
              <Typography variant="caption" sx={{ color: 'base.100', display: 'block', mt: 0.75 }}>
                {viewMode === 'regional'
                  ? 'Explore where and when each planning scenario produces meaningful salinity changes relative to Business as Usual.'
                  : 'Examine the most salt-affected station among 10 Franks Tract stations for each day and scenario.'}
              </Typography>
            </Box>
            <Box
              sx={(theme) => ({
                alignItems: 'center',
                display: 'flex',
                gap: theme.jtSpacing.gap.sm,
              })}
            >
              <Tabs
                value={viewMode}
                onChange={(_, value: 'regional' | 'station-maximum') => {
                  setViewMode(value)
                  if (value === 'regional' && DISABLED_SCENARIOS.includes(scenario)) {
                    setScenario(SCENARIOS[1])
                  }
                }}
                aria-label="Regional Summary analysis mode"
                sx={{
                  minHeight: 40,
                  '& .MuiTab-root': { minHeight: 40 },
                  '& .MuiTabs-indicator': { bgcolor: 'brand.primaryGreen' },
                }}
              >
                <Tab label="Regional reports" value="regional" />
                <Tab label="Station maximum" value="station-maximum" />
              </Tabs>
              {viewMode === 'regional' && (
                <>
                  <Button variant="outlined" onClick={() => setMethodOpen(true)}>
                    Method
                  </Button>
                  <Button variant="outlined" onClick={() => setTutorialOpen(true)}>
                    Tutorial
                  </Button>
                </>
              )}
            </Box>
          </Box>
          <Box
            sx={(theme) => ({
              alignItems: 'stretch',
              display: 'grid',
              gap: theme.jtSpacing.gap.sm,
              gridTemplateColumns: {
                xs: '1fr',
                md: 'minmax(0, 1fr) minmax(180px, 200px)',
                lg: 'minmax(0, 1fr) minmax(460px, 550px) minmax(130px, 150px)',
              },
              minWidth: 0,
              '& > [data-tour="regional-thresholds"]': {
                gridColumn: { md: '1 / -1', lg: 'auto' },
                gridRow: { md: 2, lg: 'auto' },
              },
              '& > [data-tour="regional-stations"]': {
                gridColumn: { md: 2, lg: 'auto' },
                gridRow: { md: 1, lg: 'auto' },
              },
            })}
          >
            <Box
              data-tour="regional-scenarios"
              role="group"
              aria-label="Scenario filter"
              sx={(theme) => ({
                alignItems: 'center',
                display: 'flex',
                minWidth: 0,
                '& .MuiTab-root:hover, & .MuiTab-root:focus-visible': {
                  bgcolor: alpha(theme.palette.brand.primaryGreen, 0.14),
                  borderColor: alpha(theme.palette.brand.primaryGreen, 0.3),
                },
                '& .MuiTab-root.Mui-selected': {
                  bgcolor: 'brand.primaryGreen !important',
                  borderColor: 'brand.primaryGreen !important',
                  color: 'common.black !important',
                },
              })}
            >
              <Tabs
                value={scenario}
                onChange={(_, value: RegionalScenario) => setScenario(value)}
                variant="scrollable"
                scrollButtons={false}
                aria-label="Scenario compared with Business as Usual"
                sx={(theme) => ({
                  minHeight: theme.spacing(5),
                  width: '100%',
                  '& .MuiTabs-flexContainer': { alignItems: 'center', gap: theme.jtSpacing.gap.xs },
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .MuiTab-root': {
                    ...theme.typography.captionSmall,
                    border: 1,
                    borderColor: 'transparent',
                    borderRadius: 'var(--mui-shape-borderRadius)',
                    color: 'common.white',
                    flexShrink: 0,
                    fontWeight: 500,
                    minHeight: theme.spacing(5),
                    minWidth: 0,
                    opacity: 1,
                    px: theme.jtSpacing.component.xs,
                    py: 0,
                    transition:
                      'background-color 180ms ease, border-color 180ms ease, color 180ms ease',
                    '&:hover, &:focus-visible': {
                      bgcolor: alpha(theme.palette.brand.primaryGreen, 0.14),
                      borderColor: alpha(theme.palette.brand.primaryGreen, 0.3),
                      outline: 'none',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'brand.primaryGreen',
                      borderColor: 'brand.primaryGreen',
                      color: 'common.black',
                    },
                  },
                  '& .MuiTabs-scroller': { overflowX: 'auto !important', scrollbarWidth: 'none' },
                  '& .MuiTabs-scroller::-webkit-scrollbar': { display: 'none' },
                })}
              >
                {SCENARIOS.filter(
                  (item) => viewMode === 'station-maximum' || !DISABLED_SCENARIOS.includes(item),
                ).map((item) => (
                  <Tab
                    disabled={viewMode === 'regional' && DISABLED_SCENARIOS.includes(item)}
                    key={item}
                    value={item}
                    label={item}
                  />
                ))}
              </Tabs>
            </Box>
            {viewMode === 'regional' && (
              <ComparisonFilterControl
                filter={comparisonFilter}
                scenario={scenario}
                onChange={setComparisonFilter}
              />
            )}
            {viewMode === 'regional' && (
              <StationToggle showStations={showStations} onStationsChange={setShowStations} />
            )}
          </Box>
          {viewMode === 'regional' && (
            <TimeRangeControl
              filter={comparisonFilter}
              scenario={scenario}
              selectedRegion={selectedRegion}
              onReportSelect={setFocusedReportId}
              onChange={setComparisonFilter}
            />
          )}
        </Box>
        {viewMode === 'regional' ? (
          <ArtworkMap
            showStations={showStations}
            scenario={scenario}
            comparisonFilter={comparisonFilter}
            focusedReportId={focusedReportId}
            onSelectedRegionChange={handleSelectedRegionChange}
          />
        ) : (
          <StationMaximumMode scenario={scenario} />
        )}
      </Box>
      <RegionalSummaryTutorial open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      <RegionalSummaryMethod open={methodOpen} onClose={() => setMethodOpen(false)} />
    </Box>
  )
}
