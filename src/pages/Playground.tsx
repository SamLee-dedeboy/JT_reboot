import { useCallback, useMemo, useState } from 'react';
import PageLayout from './PageLayout';
import './Playground.css';
import MapContainer from '../components/maps/MapContainer.tsx';
import KelpFusionMap from '../components/maps/KelpFusionMap.tsx';
import GanttChart from '../components/visualizations/GanttChart';
import type { KelpSet } from '../lib/kelp/types';

type MapTab = 'default' | 'kelp';

// Colors mirror the gantt chart's category palette so the kelp boundaries
// read as the same categories the user is steering with the sliders.
const UNACCEPTABLE_COLOR = '#f77c3b';
const GOOD_COLOR = '#51a2bd';

export default function Playground() {
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
    <PageLayout title="Playground" fullWidthContent>
      <section className="playground-page">
        <div className="playground-vis-panel" aria-label="Visualization placeholder">
          <GanttChart
            onHoverDateChange={setHoveredDate}
            onHoverStationIndexChange={setHoveredStationIndex}
            onStationCategoryListsChange={(payload) => {
              setUnacceptableOver75(payload.unacceptableOver75);
              setGoodOver75(payload.goodOver75);
            }}
          />
        </div>
        <div className="playground-map-panel" aria-label="Map preview panel">
          <div className="playground-map-tabs" role="tablist" aria-label="Map view">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'default'}
              className={`playground-map-tab${activeTab === 'default' ? ' is-active' : ''}`}
              onClick={() => selectTab('default')}
            >
              Default
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'kelp'}
              className={`playground-map-tab${activeTab === 'kelp' ? ' is-active' : ''}`}
              onClick={() => selectTab('kelp')}
            >
              Kelp Diagram
            </button>
          </div>
          {/*
            The default map stays mounted unconditionally so the existing
            playground UX is unchanged. The kelp map is lazy-mounted on the
            first activation and then kept alive — so its waterway-mesh fetch
            and station-coord harvest only run once, and the inactive map is
            hidden via CSS rather than unmounted.
          */}
          <div className="playground-map-stack">
            <div
              className={`playground-map-pane${activeTab === 'default' ? '' : ' is-hidden'}`}
              aria-hidden={activeTab !== 'default'}
            >
              <MapContainer
                currentViewingDate={hoveredDate}
                highlightedStationIndex={hoveredStationIndex}
                unacceptableOver75={unacceptableOver75}
                goodOver75={goodOver75}
              />
            </div>
            {kelpEverActivated && (
              <div
                className={`playground-map-pane playground-kelp-pane${activeTab === 'kelp' ? '' : ' is-hidden'}`}
                aria-hidden={activeTab !== 'kelp'}
              >
                <KelpFusionMap externalSets={kelpSets} />
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
