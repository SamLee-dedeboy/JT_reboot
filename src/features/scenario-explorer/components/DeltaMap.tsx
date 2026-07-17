import { useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from 'framer-motion';
import { chartTransition, formatNumber, valueColor } from '../format';
import { explorerPalette as palette } from '../theme';
import type { FeatureCollection, Point } from 'geojson';
import type { GeoJSONSource } from 'mapbox-gl';
import type { HistogramBrush, Scenario, ScenarioDataset, Station } from '../types';

const MAP_STYLE = "mapbox://styles/justtransition/cmreic454000z01sle8uh6v7n";
const MAP_BOUNDS: mapboxgl.LngLatBoundsLike = [[-122.82, 37.8], [-121.1, 38.36]];

interface ScaleLegendProps { extent: number; expanded: boolean; onToggle: () => void; units: string }

function ScaleLegend({ extent, expanded, onToggle, units }: ScaleLegendProps) {
  return (
    <Box
      component="button"
      type="button"
      aria-expanded={expanded}
      onClick={onToggle}
      sx={{
        alignSelf: "start", bgcolor: "transparent", border: 0, color: "text.primary", cursor: "pointer",
        display: "grid", gridTemplateColumns: "auto auto 6.25rem auto auto", alignItems: "center", gap: 1,
        minWidth: "20rem", p: 1, textTransform: "uppercase",
        "&:focus-visible": { outline: `0.0625rem solid ${palette.pink}`, outlineOffset: "0.125rem" },
      }}
    >
      <Typography component={motion.span} variant="body2" key={`negative-${formatNumber(extent)}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>−{formatNumber(extent)}</Typography>
      <Typography component="span" variant="body2" >Fresher</Typography>
      <motion.div
        initial={{ scaleX: 0.85, opacity: 0.5 }} animate={{ scaleX: 1, opacity: 1 }} transition={chartTransition}
        style={{ height: "0.3125rem", background: `linear-gradient(90deg, ${palette.teal}, #aeb6b8, ${palette.pink})` }}
      />
      <Typography component="span" variant="body2" >Saltier</Typography>
      <Typography component={motion.span} variant="body2" key={`positive-${formatNumber(extent)}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>+{formatNumber(extent)}</Typography>
      <Box sx={{ color: 'text.secondary', display: 'grid', gridColumn: '1 / -1', justifyContent: 'center', mt: 0.5, textAlign: 'center' }}>
        <Typography component="span" variant="caption" sx={{ alignItems: "center", display: "flex", gap: 0.5, gridColumn: "1 / -1", justifyContent: "center", textTransform: "none" }}>
          {units} · 90TH PERCENTILE SCALE <HelpIcon sx={{ fontSize: '1rem' }} />
        </Typography>
      </Box>
    </Box>
  );
}

interface MapCanvasProps {
  data: ScenarioDataset;
  scenario: string;
  dateIndex: number;
  region: string;
  mapExtent: number;
  histogramBrush: HistogramBrush;
  onStation: (station: Station & { value: number | null }) => void;
}

function MapCanvas({ data, scenario, dateIndex, region, mapExtent, histogramBrush, onStation }: MapCanvasProps) {
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
      map.addLayer({ id: "station-halo", type: "circle", source: "stations", paint: { "circle-radius": ["case", ["==", ["get", "active"], true], 6, 3.5], "circle-color": palette.base900, "circle-opacity": 0.78 } });
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
          "circle-radius": 6.25, "circle-color": ["get", "color"], "circle-stroke-color": palette.green,
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
          "text-color": palette.white, "text-halo-color": palette.base900, "text-halo-width": 2,
        },
      });
      map.on("mouseenter", "stations", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "stations", () => { map.getCanvas().style.cursor = ""; });
      map.on('click', 'stations', (event) => {
        const properties = event.features?.[0]?.properties;
        if (properties) onStation(properties as Station & { value: number | null });
      });
    });
    return () => map.remove();
  // The map instance is intentionally created once; later data updates use the source effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { (mapRef.current?.getSource('stations') as GeoJSONSource | undefined)?.setData(geojson); }, [geojson]);

  return <Box ref={containerRef} sx={{ flex: 1, minHeight: { xs: '32.5rem', lg: 0 } }} />;
}

interface DeltaMapProps extends Omit<MapCanvasProps, 'onStation'> {
  selectedScenario: Scenario;
  baseScenarioLabel: string;
  mapModelLabel: string | null;
  units: string;
}

export default function DeltaMap({ data, scenario, dateIndex, region, mapExtent, selectedScenario, baseScenarioLabel, mapModelLabel, histogramBrush, units }: DeltaMapProps) {
  const [station, setStation] = useState<(Station & { value: number | null }) | null>(null);
  const [showScaleInfo, setShowScaleInfo] = useState(false);
  return (
    <Paper variant="outlined" component="article" sx={{ bgcolor: 'base.700', display: "flex", flexDirection: "column", height: '100%', minHeight: 0, minWidth: 0, overflow: "hidden", position: "relative" }}>
      <Box sx={{ alignItems: "center", borderBottom: 1, borderColor: "divider", display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", xl: "minmax(0,1fr) auto" }, minHeight: "6rem", p: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>Delta Map</Typography>
          <Box component="h2" sx={{ display: 'grid', gap: 0.35, m: 0, mt: 0.75, minWidth: 0 }}>
            <Box sx={{ alignItems: 'baseline', display: 'flex', gap: 0.65, minWidth: 0 }}>
              <Box component="strong" sx={{ color: "brand.primaryGreen", fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 400, letterSpacing: '0.04em', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{mapModelLabel ? `${mapModelLabel} · ${selectedScenario.label}` : selectedScenario.label}</Box>
              <Box component="span" sx={{ color: "text.secondary", fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 400, lineHeight: 1.2, whiteSpace: 'nowrap' }}>compared to</Box>
            </Box>
            <Box component="span" sx={{ color: "brand.primaryBlue", fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 400, letterSpacing: '0.04em', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{baseScenarioLabel}</Box>
          </Box>
        </Box>
        <ScaleLegend extent={mapExtent} expanded={showScaleInfo} onToggle={() => setShowScaleInfo((value) => !value)} units={units} />
      </Box>
      <MapCanvas data={data} scenario={scenario} dateIndex={dateIndex} region={region} mapExtent={mapExtent} histogramBrush={histogramBrush} onStation={setStation} />
      {showScaleInfo && (
        <Paper elevation={12} sx={{ bgcolor: "rgba(16,22,24,.97)", border: 1, borderColor: "divider", maxWidth: "26rem", p: 2.5, position: "absolute", right: 2, top: "7rem", zIndex: 4 }}>
          <IconButton aria-label="Close scale explanation" onClick={() => setShowScaleInfo(false)} sx={{ position: "absolute", right: 1, top: 1 }}><CloseIcon fontSize="small" /></IconButton>
          <Typography variant="caption" color="primary.main">About this color scale</Typography>
          <Typography variant="h3" sx={{ mt: 1, pr: 4 }}>Why the 90th percentile?</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>Across all station-days in the selected region and scenario, the absolute delta at the 90th percentile sets both color-scale ends. The most extreme 10% use the strongest color, keeping outliers from washing out differences elsewhere.</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>Only the display scale is capped; the underlying station values are unchanged.</Typography>
        </Paper>
      )}
      {station && (
        <Paper component="button" onClick={() => setStation(null)} sx={{ bgcolor: "rgba(16,22,24,.95)", border: 0, borderLeft: `0.1875rem solid ${palette.pink}`, color: "text.primary", cursor: "pointer", display: "grid", gap: 0.5, left: 2, p: 2, position: "absolute", right: 2, textAlign: "left", top: "7rem", zIndex: 3 }}>
          <Typography variant="caption" color="text.secondary">{station.region} · Station {station.station_id}</Typography>
          <Typography variant="h5">{station.long_name}</Typography>
          <Typography variant="h3" color={(station.value ?? 0) > 0 ? "primary.main" : "secondary.main"}>{(station.value ?? 0) > 0 ? "+" : ""}{formatNumber(station.value, 1)} {units}</Typography>
        </Paper>
      )}
    </Paper>
  );
}
