import { useEffect, useMemo, useRef } from "react";
import { Box, Paper } from "@mui/material";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { formatDate, formatNumber, valueColor } from '../format';
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
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const selectedScenario = data.scenarios.find((item) => item.key === scenario)!;
  const geojson = useMemo<FeatureCollection<Point>>(() => ({
    type: 'FeatureCollection',
    features: data.stations.map((station, index) => {
      const value = selectedScenario.stationValues[index][dateIndex];
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [station.longitude, station.latitude] },
        properties: { ...station, value, date: data.dates[dateIndex], scenarioLabel: selectedScenario.label, units: data.units ?? '', color: valueColor(value, mapExtent), active: region === "All regions" || station.region === region, brushed: (region === "All regions" || station.region === region) && histogramBrush != null && value != null && value >= histogramBrush[0] && value <= histogramBrush[1] ? 1 : 0, hasBrush: histogramBrush != null ? 1 : 0 },
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
      const showStationPopup = (event: mapboxgl.MapMouseEvent) => {
        const feature = map.queryRenderedFeatures(event.point, { layers: ['station-brush-highlight', 'stations'] })[0];
        if (!feature || feature.geometry.type !== 'Point') return;
        const properties = feature.properties ?? {};
        const content = document.createElement('div');
        content.className = 'station-popup-content';

        const title = document.createElement('strong');
        title.className = 'station-popup-title';
        title.textContent = String(properties.long_name || `Station ${properties.station_id || ''}`);
        content.appendChild(title);

        const metadata = document.createElement('div');
        metadata.className = 'station-popup-metadata';
        metadata.textContent = [properties.station_id && `ID ${properties.station_id}`, properties.region].filter(Boolean).join(' · ');
        content.appendChild(metadata);

        const value = document.createElement('div');
        value.className = 'station-popup-value';
        const numericValue = Number(properties.value);
        const hasNumericValue = properties.value != null && properties.value !== '' && Number.isFinite(numericValue);
        if (hasNumericValue && properties.units === '%') {
          value.classList.add(numericValue > 0 ? 'station-popup-value-positive' : numericValue < 0 ? 'station-popup-value-negative' : 'station-popup-value-neutral');
        }
        value.textContent = hasNumericValue
          ? `${formatNumber(numericValue)} ${properties.units || ''}`.trim()
          : 'No value available';
        content.appendChild(value);

        const context = document.createElement('div');
        context.className = 'station-popup-context';
        context.textContent = [properties.scenarioLabel, properties.date && formatDate(String(properties.date))].filter(Boolean).join(' · ');
        content.appendChild(context);

        popupRef.current?.remove();
        popupRef.current = new mapboxgl.Popup({ closeButton: true, closeOnClick: true, maxWidth: '18rem', offset: 10 })
          .setLngLat((feature.geometry as Point).coordinates as [number, number])
          .setDOMContent(content)
          .addTo(map);
      };
      map.on('click', showStationPopup);
      map.on('mouseenter', 'stations', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'stations', () => { map.getCanvas().style.cursor = ''; });
    });
    return () => {
      popupRef.current?.remove();
      map.remove();
    };
  // The map instance is intentionally created once; later data updates use the source effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      (mapRef.current?.getSource('stations') as GeoJSONSource | undefined)?.setData(geojson);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [geojson]);

  return <Box ref={containerRef} sx={{
    flex: 1,
    minHeight: { xs: '32.5rem', lg: 0 },
    '& .mapboxgl-popup-content': { bgcolor: 'base.700', border: 1, borderColor: 'divider', borderRadius: 1, boxShadow: 6, color: 'text.primary', p: 0 },
    '& .mapboxgl-popup-close-button': { bgcolor: 'transparent !important', color: 'text.secondary', fontSize: '1.25rem', p: 1 },
    '& .mapboxgl-popup-close-button:hover, & .mapboxgl-popup-close-button:focus-visible': { bgcolor: 'transparent !important', color: 'brand.primaryGreen' },
    '& .mapboxgl-popup-tip': { borderTopColor: 'base.700' },
    '& .station-popup-content': (theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.xs, p: theme.jtSpacing.component.sm, pr: theme.jtSpacing.component.lg }),
    '& .station-popup-title': { color: 'brand.primaryGreen', typography: 'button' },
    '& .station-popup-metadata, & .station-popup-context': { color: 'text.secondary', typography: 'captionSmall' },
    '& .station-popup-value': { color: 'text.primary', typography: 'h5' },
    '& .station-popup-value-positive': { color: 'salinity.pink' },
    '& .station-popup-value-negative': { color: 'salinity.teal' },
    '& .station-popup-value-neutral': { color: 'text.primary' },
  }} />;
}

type DeltaMapProps = MapCanvasProps;

export default function DeltaMap({ data, scenario, dateIndex, region, mapExtent, histogramBrush }: DeltaMapProps) {
  return (
    <Paper data-tour="map" variant="outlined" component="article" sx={{ bgcolor: 'base.700', borderRadius: 1, display: "flex", flexDirection: "column", height: '100%', minHeight: 0, minWidth: 0, overflow: "hidden", position: "relative" }}>
      <MapCanvas data={data} scenario={scenario} dateIndex={dateIndex} region={region} mapExtent={mapExtent} histogramBrush={histogramBrush} />
    </Paper>
  );
}
