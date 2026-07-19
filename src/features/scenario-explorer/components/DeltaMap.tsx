import { useEffect, useMemo, useRef } from "react";
import { Box, Paper } from "@mui/material";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { valueColor } from '../format';
import { palette } from '../../../theme/muiTheme';
import type { FeatureCollection, Point } from 'geojson';
import type { GeoJSONSource } from 'mapbox-gl';
import type { HistogramBrush, ScenarioDataset } from '../types';

const MAP_STYLE = "mapbox://styles/justtransition/cmreic454000z01sle8uh6v7n";
const MAP_BOUNDS: mapboxgl.LngLatBoundsLike = [[-122.82, 37.8], [-121.1, 38.36]];

interface MapCanvasProps {
  data: ScenarioDataset;
  scenario: string;
  dateIndex: number;
  region: string;
  mapExtent: number;
  histogramBrush: HistogramBrush;
}

function MapCanvas({ data, scenario, dateIndex, region, mapExtent, histogramBrush }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const selectedScenario = data.scenarios.find((item) => item.key === scenario)!;
  const geojson = useMemo<FeatureCollection<Point>>(() => ({
    type: 'FeatureCollection',
    features: data.stations.map((station, index) => {
      const value = selectedScenario.stationValues[index][dateIndex];
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [station.longitude, station.latitude] },
        properties: { ...station, value, color: valueColor(value, mapExtent), active: region === "All regions" || station.region === region, brushed: (region === "All regions" || station.region === region) && histogramBrush != null && value != null && value >= histogramBrush[0] && value <= histogramBrush[1] ? 1 : 0, hasBrush: histogramBrush != null ? 1 : 0 },
      };
    }),
  }), [data.stations, selectedScenario, dateIndex, region, mapExtent, histogramBrush]);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";
    if (!containerRef.current) return;
    const map = new mapboxgl.Map({ container: containerRef.current, style: MAP_STYLE, bounds: MAP_BOUNDS, fitBoundsOptions: { padding: 10 }, attributionControl: false });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    map.on("load", () => {
      map.addSource("stations", { type: "geojson", data: geojson });
      map.addLayer({ id: "station-halo", type: "circle", source: "stations", paint: { "circle-radius": ["case", ["==", ["get", "active"], true], 6, 3.5], "circle-color": palette.base[900], "circle-opacity": 0.78 } });
      map.addLayer({
        id: "stations", type: "circle", source: "stations",
        paint: {
          "circle-radius": ["case", ["==", ["get", "active"], true], 4.4, 2], "circle-color": ["get", "color"],
          "circle-opacity": ["case", ["all", ["==", ["get", "hasBrush"], 1], ["==", ["get", "active"], true]], 0.42, ["==", ["get", "active"], true], 0.96, 0.12],
          "circle-color-transition": { duration: 450 }, "circle-radius-transition": { duration: 300 }, "circle-opacity-transition": { duration: 300 },
        },
      });
      map.addLayer({
        id: "station-brush-highlight", type: "circle", source: "stations", filter: ["==", ["get", "brushed"], 1],
        paint: {
          "circle-radius": 6.25, "circle-color": ["get", "color"], "circle-stroke-color": palette.brand.primaryGreen,
          "circle-stroke-width": 1.5, "circle-opacity": 1, "circle-blur": 0,
          "circle-radius-transition": { duration: 250 }, "circle-opacity-transition": { duration: 250 },
        },
      });
      map.addLayer({
        id: "station-brush-label", type: "symbol", source: "stations", filter: ["==", ["get", "brushed"], 1],
        layout: {
          "text-field": ["to-string", ["get", "station_id"]], "text-size": 12,
          "text-offset": [0, 1.35], "text-anchor": "top", "text-allow-overlap": true,
        },
        paint: {
          "text-color": palette.common.white, "text-halo-color": palette.base[900], "text-halo-width": 2,
        },
      });
    });
    return () => map.remove();
  // The map instance is intentionally created once; later data updates use the source effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      (mapRef.current?.getSource('stations') as GeoJSONSource | undefined)?.setData(geojson);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [geojson]);

  return <Box ref={containerRef} sx={{ flex: 1, minHeight: { xs: '32.5rem', lg: 0 } }} />;
}

type DeltaMapProps = MapCanvasProps;

export default function DeltaMap({ data, scenario, dateIndex, region, mapExtent, histogramBrush }: DeltaMapProps) {
  return (
    <Paper variant="outlined" component="article" sx={{ bgcolor: 'base.700', borderRadius: 1, display: "flex", flexDirection: "column", height: '100%', minHeight: 0, minWidth: 0, overflow: "hidden", position: "relative" }}>
      <MapCanvas data={data} scenario={scenario} dateIndex={dateIndex} region={region} mapExtent={mapExtent} histogramBrush={histogramBrush} />
    </Paper>
  );
}
