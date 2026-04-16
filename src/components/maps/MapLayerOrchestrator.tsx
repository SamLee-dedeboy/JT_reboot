import DeltaStationPointsLayer from './layers/DeltaStationPointsLayer';

interface MapLayerOrchestratorProps {
  highlightedStationIndex?: number | null;
  unacceptableOver75?: number[];
  goodOver75?: number[];
}

export default function MapLayerOrchestrator({
  highlightedStationIndex = null,
  unacceptableOver75 = [],
  goodOver75 = [],
}: MapLayerOrchestratorProps) {
  return (
    <>
      <DeltaStationPointsLayer
        highlightedStationIndex={highlightedStationIndex}
        unacceptableOver75={unacceptableOver75}
        goodOver75={goodOver75}
      />
    </>
  );
}

