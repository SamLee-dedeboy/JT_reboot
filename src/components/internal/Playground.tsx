// Internal exploratory playground that pairs the water-quality timeline with
// interactive Delta map views.
import { useCallback, useMemo, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import PageLayout from './PageLayout';
import MapContainer from '../maps/MapContainer.tsx';
import KelpFusionMap from '../maps/KelpFusionMap.tsx';
import GanttChart from '../visualizations/GanttChart';
import type { KelpSet } from '../../lib/kelp/types';

type MapTab = 'default' | 'kelp';

// Colors mirror the gantt chart's category palette so the kelp boundaries
// read as the same categories the user is steering with the sliders.
const UNACCEPTABLE_COLOR = '#f77c3b';
const GOOD_COLOR = '#51a2bd';

export default function Playground() {
  const theme = useTheme();
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [hoveredStationIndex, setHoveredStationIndex] = useState<number | null>(null);
  const [unacceptableOver75, setUnacceptableOver75] = useState<number[]>([]);
  const [goodOver75, setGoodOver75] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<MapTab>('default');
  // Lazy-mount the kelp map: skip its tile/mesh fetch for users who never
  // click the tab, but keep it mounted once shown so re-activation is instant.
  const [kelpEverActivated, setKelpEverActivated] = useState(false);

  const selectTab = useCallback((tab: MapTab) => {
    setActiveTab(tab);
    if (tab === 'kelp') setKelpEverActivated(true);
  }, []);

  // Build kelp sets from the gantt-chart threshold output. The set IDs are
  // stable so KelpFusionMap can preserve user-toggled visible/opacity across
  // membership updates (i.e. moving the slider doesn't reset the panel).
  const kelpSets = useMemo<KelpSet[]>(() => {
    const sets: KelpSet[] = [];
    if (unacceptableOver75.length > 0) {
      sets.push({
        setId: 'UNACCEPTABLE',
        label: 'Unacceptable threshold',
        stationIndices: unacceptableOver75,
        color: UNACCEPTABLE_COLOR,
        opacity: 0.35,
        visible: true,
      });
    }
    if (goodOver75.length > 0) {
      sets.push({
        setId: 'GOOD',
        label: 'Good threshold',
        stationIndices: goodOver75,
        color: GOOD_COLOR,
        opacity: 0.35,
        visible: true,
      });
    }
    return sets;
  }, [unacceptableOver75, goodOver75]);

  return (
    <PageLayout title="Playground" fullWidthContent hideTitle>
      <Box
        component="section"
        sx={{
          mt: (theme) => `-${theme.spacing(theme.jtSpacing.section.xs)}`,
          width: '100%',
          minHeight: { xs: 'calc(100vh - 72px)', md: 'calc(100vh - 76px)' },
          height: { lg: 'calc(100vh - 76px)' },
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          gap: { xs: theme.jtSpacing.gap.sm, lg: theme.jtSpacing.gap.md },
          p: { xs: theme.jtSpacing.component.sm, md: theme.jtSpacing.component.md },
          bgcolor: 'brand.base',
          overflow: 'hidden',
        }}
      >
        <Box
          aria-label="Visualization placeholder"
          sx={{
            flex: { xs: '0 0 auto', lg: '1 1 58%' },
            height: { xs: 'min(78vh, 760px)', lg: '100%' },
            minHeight: 0,
            bgcolor: 'base.700',
            border: '1px solid',
            borderColor: 'rgba(155,162,164,0.22)',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <GanttChart
            onHoverDateChange={setHoveredDate}
            onHoverStationIndexChange={setHoveredStationIndex}
            onStationCategoryListsChange={(payload) => {
              setUnacceptableOver75(payload.unacceptableOver75);
              setGoodOver75(payload.goodOver75);
            }}
          />
        </Box>
        <Box
          aria-label="Map preview panel"
          sx={{
            flex: { xs: '0 0 auto', lg: '1 1 42%' },
            height: { xs: 'min(68vh, 620px)', lg: '100%' },
            minHeight: 0,
            position: 'relative',
            border: '1px solid',
            borderColor: 'rgba(155,162,164,0.22)',
            borderRadius: 1,
            overflow: 'hidden',
            '& .mapboxgl-map': {
              width: '100%',
              height: '100%',
            },
          }}
        >
          <ToggleButtonGroup
            exclusive
            value={activeTab}
            onChange={(_, tab: MapTab | null) => {
              if (tab) selectTab(tab);
            }}
            aria-label="Map view"
            size="small"
            sx={{
              position: 'absolute',
              top: theme.spacing(1.5),
              right: theme.spacing(1.5),
              zIndex: 35,
              bgcolor: 'rgba(37, 52, 57, 0.88)',
              border: '1px solid rgba(155,162,164,0.28)',
              borderRadius: 999,
              p: 0.4,
              boxShadow: '0 8px 24px rgba(16,22,24,0.26)',
              backdropFilter: 'blur(6px)',
              '& .MuiToggleButtonGroup-grouped': {
                border: 0,
                borderRadius: '999px !important',
                px: 1.5,
                py: 0.5,
                color: 'rgba(242,240,239,0.78)',
                typography: 'button',
                fontSize: '0.78rem',
                '&:hover': {
                  color: 'common.white',
                  bgcolor: 'rgba(126,217,87,0.08)',
                },
                '&.Mui-selected': {
                  color: 'primary.light',
                  bgcolor: 'rgba(126,217,87,0.22)',
                  '&:hover': {
                    bgcolor: 'rgba(126,217,87,0.28)',
                  },
                },
              },
            }}
          >
            <ToggleButton value="default" aria-label="Default map">
              Default
            </ToggleButton>
            <ToggleButton value="kelp" aria-label="Kelp diagram">
              Kelp Diagram
            </ToggleButton>
          </ToggleButtonGroup>
          {/*
            The default map stays mounted unconditionally so the existing
            playground UX is unchanged. The kelp map is lazy-mounted on the
            first activation and then kept alive — so its waterway-mesh fetch
            and station-coord harvest only run once, and the inactive map is
            hidden via CSS rather than unmounted.
          */}
          <Box sx={{ position: 'absolute', inset: 0 }}>
            <Box
              aria-hidden={activeTab !== 'default'}
              sx={{
                position: 'absolute',
                inset: 0,
                display: activeTab === 'default' ? 'block' : 'none',
              }}
            >
              <MapContainer
                currentViewingDate={hoveredDate}
                highlightedStationIndex={hoveredStationIndex}
                unacceptableOver75={unacceptableOver75}
                goodOver75={goodOver75}
              />
            </Box>
            {kelpEverActivated && (
              <Box
                aria-hidden={activeTab !== 'kelp'}
                sx={{
                  '--kelp-controls-top': '60px',
                  position: 'absolute',
                  inset: 0,
                  display: activeTab === 'kelp' ? 'block' : 'none',
                }}
              >
                <KelpFusionMap externalSets={kelpSets} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </PageLayout>
  );
}
