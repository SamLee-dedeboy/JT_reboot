import { useState } from 'react';
import PageLayout from './PageLayout';
import './Playground.css';
import MapContainer from '../components/maps/MapContainer.tsx';
import GanttChart from '../components/visualizations/GanttChart';

export default function Playground() {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [hoveredStationIndex, setHoveredStationIndex] = useState<number | null>(null);
  const [unacceptableOver75, setUnacceptableOver75] = useState<number[]>([]);
  const [goodOver75, setGoodOver75] = useState<number[]>([]);

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
          <MapContainer
            currentViewingDate={hoveredDate}
            highlightedStationIndex={hoveredStationIndex}
            unacceptableOver75={unacceptableOver75}
            goodOver75={goodOver75}
          />
        </div>
      </section>
    </PageLayout>
  );
}


