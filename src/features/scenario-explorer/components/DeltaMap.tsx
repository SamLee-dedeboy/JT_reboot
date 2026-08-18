import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { formatDate, formatNumber, valueColor } from '../format'
import { SCENARIO_EXPLORER_MAP_STYLE } from '../mapConfig'
import { palette } from '../../../theme/index'
import type { FeatureCollection, Point } from 'geojson'
import type { GeoJSONSource } from 'mapbox-gl'
import type {
  D1641Dataset,
  D1641StationCompliance,
  HistogramBrush,
  ScenarioDataset,
} from '../types'

const MAP_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [-122.82, 37.8],
  [-121.1, 38.36],
]

interface MapCanvasProps {
  data: ScenarioDataset
  baseScenario: string
  scenario: string
  dateIndex: number
  region: string
  mapExtent: number
  histogramBrush: HistogramBrush
  d1641Data: D1641Dataset | null
}

type ComplianceState = 'none' | 'compliant' | 'exceeded' | 'insufficient' | 'high-tide'

const objectiveLabel = (objective: string) =>
  ({
    agricultural: 'Agricultural salinity objective',
    ecosystem_14d: 'Fish and wildlife salinity objective',
    ecosystem_high_tide_monthly: 'Monthly high-tide fish and wildlife salinity objective',
  })[objective] ?? objective.replaceAll('_', ' ')

const judgmentRegulation = (judgment: D1641StationCompliance['judgments'][string]) => {
  const averagingPeriod =
    judgment.windowDays === 'calendar_month'
      ? 'calendar-month average'
      : `${judgment.windowDays}-day running average`
  return `${objectiveLabel(judgment.objective)}: ${averagingPeriod} must not exceed ${formatNumber(judgment.threshold)} µS/cm`
}

function stationRegulation(station: D1641StationCompliance | undefined, date: string) {
  if (!station) return ''
  const judgment = station.judgments?.[date]
  if (judgment) return judgmentRegulation(judgment)
  const regulation = station.regulations?.find((item) => date >= item.start && date <= item.end)
  if (regulation) {
    const averagingPeriod =
      regulation.windowDays === 'calendar_month'
        ? 'calendar-month average'
        : `${regulation.windowDays}-day running average`
    return `${objectiveLabel(regulation.objective)}: ${averagingPeriod} must not exceed ${formatNumber(regulation.threshold)} µS/cm`
  }
  const metric = station.metrics?.[date]
  if (metric) {
    const averagingPeriod =
      metric.windowDays === 'calendar_month'
        ? 'calendar-month average'
        : `${metric.windowDays}-day running average`
    return `No D-1641 limit applies on this date; ${averagingPeriod} shown for context`
  }
  const objectives = [...new Set(station.objectives.map((item) => objectiveLabel(item.objective)))]
  return objectives.length ? objectives.join('; ') : 'D-1641 salinity objective'
}

function comparisonRegulation(
  selected: D1641StationCompliance | undefined,
  base: D1641StationCompliance | undefined,
  date: string,
) {
  const selectedJudgment = selected?.judgments?.[date]
  const baseJudgment = base?.judgments?.[date]
  if (selectedJudgment && baseJudgment) {
    const selectedRule = judgmentRegulation(selectedJudgment)
    const baseRule = judgmentRegulation(baseJudgment)
    return selectedRule === baseRule
      ? selectedRule
      : `Base — ${baseRule}; Selected — ${selectedRule}`
  }
  if (selectedJudgment) return judgmentRegulation(selectedJudgment)
  if (baseJudgment) return judgmentRegulation(baseJudgment)
  return stationRegulation(selected ?? base, date)
}

function stationCompliance(station: D1641StationCompliance | undefined, date: string) {
  if (!station) return { state: 'none' as ComplianceState, onset: false, summary: '' }
  const exceeded = station.objectives.filter(
    (objective) =>
      objective.status === 'calculated_exceedance' &&
      objective.start &&
      objective.end &&
      date >= objective.start &&
      date <= objective.end,
  )
  const highTide = station.objectives.some(
    (objective) => objective.status === 'not_computable_high_tide_data_required',
  )
  const insufficient = station.objectives.some(
    (objective) => objective.status === 'not_computable_station_not_in_scenario_export',
  )
  const state: ComplianceState = exceeded.length
    ? 'exceeded'
    : highTide
      ? 'high-tide'
      : insufficient
        ? 'insufficient'
        : 'compliant'
  return {
    state,
    onset: exceeded.some((objective) => objective.start === date),
    summary: exceeded.length
      ? station.judgments?.[date]
        ? `${formatNumber(station.judgments[date].value)} µS/cm`
        : 'Exceedance active'
      : state === 'high-tide'
        ? 'D-1641 status requires high-tide data'
        : state === 'insufficient'
          ? 'D-1641 status is not computable from this export'
          : station.metrics?.[date]
            ? `${formatNumber(station.metrics[date].value)} µS/cm`
            : 'Insufficient data for this date',
  }
}

function MapCanvas({
  data,
  d1641Data,
  baseScenario,
  scenario,
  dateIndex,
  region,
  mapExtent,
  histogramBrush,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const selectedScenario = data.scenarios.find((item) => item.key === scenario)!
  const baseScenarioLabel =
    data.scenarios.find((item) => item.key === baseScenario)?.label ?? 'Base scenario'
  const scenarioCompliance = d1641Data?.scenarios[scenario]
  const baseCompliance = d1641Data?.scenarios[baseScenario]
  const geojson = useMemo<FeatureCollection<Point>>(
    () => ({
      type: 'FeatureCollection',
      features: data.stations.map((station, index) => {
        const value = selectedScenario.stationValues[index][dateIndex]
        const selectedD1641Station = scenarioCompliance?.stations[String(station.station_id)]
        const baseD1641Station = baseCompliance?.stations[String(station.station_id)]
        const selectedCompliance = stationCompliance(selectedD1641Station, data.dates[dateIndex])
        const baseStationCompliance = stationCompliance(baseD1641Station, data.dates[dateIndex])
        const selectedExceeded = selectedCompliance.state === 'exceeded'
        const baseExceeded = baseStationCompliance.state === 'exceeded'
        const combinedState: ComplianceState =
          selectedExceeded || baseExceeded
            ? 'exceeded'
            : selectedCompliance.state !== 'none'
              ? selectedCompliance.state
              : baseStationCompliance.state
        const exceedanceScenarios =
          selectedExceeded && baseExceeded
            ? 'B+S!'
            : selectedExceeded
              ? 'S!'
              : baseExceeded
                ? 'B!'
                : ''
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [station.longitude, station.latitude] },
          properties: {
            ...station,
            value,
            date: data.dates[dateIndex],
            scenarioLabel: selectedScenario.label,
            baseScenarioLabel,
            units: data.units ?? '',
            color: valueColor(value, mapExtent),
            active: region === 'All regions' || station.region === region,
            brushed:
              (region === 'All regions' || station.region === region) &&
              histogramBrush != null &&
              value != null &&
              value >= histogramBrush[0] &&
              value <= histogramBrush[1]
                ? 1
                : 0,
            hasBrush: histogramBrush != null ? 1 : 0,
            d1641State: combinedState,
            d1641Onset: selectedCompliance.onset || baseStationCompliance.onset ? 1 : 0,
            exceedanceScenarios,
            selectedD1641Summary: selectedCompliance.summary,
            baseD1641Summary: baseStationCompliance.summary,
            d1641Id: selectedD1641Station?.d1641Id ?? baseD1641Station?.d1641Id ?? '',
            d1641Name:
              selectedD1641Station?.fullName || baseD1641Station?.fullName || station.long_name,
            d1641Regulation: comparisonRegulation(
              selectedD1641Station,
              baseD1641Station,
              data.dates[dateIndex],
            ),
            selected: String(station.station_id) === selectedStationId ? 1 : 0,
          },
        }
      }),
    }),
    [
      baseCompliance,
      baseScenarioLabel,
      data.dates,
      data.stations,
      data.units,
      dateIndex,
      histogramBrush,
      mapExtent,
      region,
      scenarioCompliance,
      selectedScenario,
      selectedStationId,
    ],
  )
  const onsetSignature = useMemo(
    () =>
      geojson.features
        .filter((feature) => feature.properties?.d1641Onset === 1)
        .map((feature) => String(feature.properties?.station_id ?? ''))
        .join('|'),
    [geojson],
  )

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || ''
    if (!containerRef.current) return
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: SCENARIO_EXPLORER_MAP_STYLE,
      bounds: MAP_BOUNDS,
      fitBoundsOptions: { padding: 10 },
      attributionControl: false,
    })
    mapRef.current = map
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.on('load', () => {
      map.addSource('stations', { type: 'geojson', data: geojson })
      map.addLayer({
        id: 'station-halo',
        type: 'circle',
        source: 'stations',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'active'], true], 6, 3.5],
          'circle-color': palette.base[900],
          'circle-opacity': 0.78,
        },
      })
      map.addLayer({
        id: 'stations',
        type: 'circle',
        source: 'stations',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'active'], true], 4.4, 2],
          'circle-color': ['get', 'color'],
          'circle-opacity': [
            'case',
            ['all', ['==', ['get', 'hasBrush'], 1], ['==', ['get', 'active'], true]],
            0.42,
            ['==', ['get', 'active'], true],
            0.96,
            0.12,
          ],
          'circle-color-transition': { duration: 450 },
          'circle-radius-transition': { duration: 300 },
          'circle-opacity-transition': { duration: 300 },
        },
      })
      map.addLayer({
        id: 'd1641-exceedance-halo',
        type: 'circle',
        source: 'stations',
        filter: ['==', ['get', 'd1641State'], 'exceeded'],
        paint: {
          'circle-radius': 12,
          'circle-color': palette.accent.yellow,
          'circle-opacity': [
            'case',
            ['!=', ['get', 'active'], true],
            0.08,
            ['all', ['==', ['get', 'hasBrush'], 1], ['!=', ['get', 'brushed'], 1]],
            0.08,
            0.28,
          ],
          'circle-stroke-color': palette.accent.yellow,
          'circle-stroke-width': 3,
          'circle-stroke-opacity': [
            'case',
            ['!=', ['get', 'active'], true],
            0.16,
            ['all', ['==', ['get', 'hasBrush'], 1], ['!=', ['get', 'brushed'], 1]],
            0.16,
            1,
          ],
        },
      })
      map.addLayer({
        id: 'd1641-location-diamond',
        type: 'symbol',
        source: 'stations',
        filter: ['in', ['get', 'd1641State'], ['literal', ['compliant', 'exceeded']]],
        layout: {
          'text-field': ['match', ['get', 'd1641State'], 'exceeded', '◆', '◇'],
          'text-size': ['match', ['get', 'd1641State'], 'exceeded', 25, 30],
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': [
            'match',
            ['get', 'd1641State'],
            'exceeded',
            palette.accent.yellow,
            palette.common.white,
          ],
          'text-halo-color': palette.base[900],
          'text-halo-width': ['match', ['get', 'd1641State'], 'exceeded', 3, 1.5],
          'text-opacity': [
            'case',
            ['!=', ['get', 'active'], true],
            0.12,
            ['all', ['==', ['get', 'hasBrush'], 1], ['!=', ['get', 'brushed'], 1]],
            0.1,
            0.95,
          ],
        },
      })
      map.addLayer({
        id: 'd1641-badge',
        type: 'symbol',
        source: 'stations',
        filter: ['==', ['get', 'd1641State'], 'exceeded'],
        layout: {
          'text-field': ['get', 'exceedanceScenarios'],
          'text-size': 14,
          'text-offset': [0.85, -0.85],
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': palette.accent.yellow,
          'text-halo-color': palette.base[900],
          'text-halo-width': 3,
          'text-opacity': [
            'case',
            ['!=', ['get', 'active'], true],
            0.12,
            ['all', ['==', ['get', 'hasBrush'], 1], ['!=', ['get', 'brushed'], 1]],
            0.1,
            1,
          ],
        },
      })
      map.addLayer({
        id: 'station-selected-outline',
        type: 'circle',
        source: 'stations',
        filter: ['==', ['get', 'selected'], 1],
        paint: {
          'circle-radius': 10,
          'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-color': palette.common.white,
          'circle-stroke-width': 2.5,
        },
      })
      map.addLayer({
        id: 'd1641-onset-pulse',
        type: 'circle',
        source: 'stations',
        filter: ['==', ['get', 'd1641Onset'], 1],
        paint: {
          'circle-radius': 8,
          'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-color': palette.accent.yellow,
          'circle-stroke-width': 2,
          'circle-opacity': 0,
        },
      })
      map.addLayer({
        id: 'station-brush-highlight',
        type: 'circle',
        source: 'stations',
        filter: ['==', ['get', 'brushed'], 1],
        paint: {
          'circle-radius': 6.25,
          'circle-color': ['get', 'color'],
          'circle-stroke-color': palette.brand.primaryGreen,
          'circle-stroke-width': 1.5,
          'circle-opacity': 1,
          'circle-blur': 0,
          'circle-radius-transition': { duration: 250 },
          'circle-opacity-transition': { duration: 250 },
        },
      })
      map.addLayer({
        id: 'station-brush-label',
        type: 'symbol',
        source: 'stations',
        filter: ['==', ['get', 'brushed'], 1],
        layout: {
          'text-field': ['to-string', ['get', 'station_id']],
          'text-size': 12,
          'text-offset': [0, 1.35],
          'text-anchor': 'top',
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': palette.common.white,
          'text-halo-color': palette.base[900],
          'text-halo-width': 2,
        },
      })
      const showStationPopup = (event: mapboxgl.MapMouseEvent) => {
        const feature = map.queryRenderedFeatures(event.point, {
          layers: ['station-brush-highlight', 'stations'],
        })[0]
        if (!feature || feature.geometry.type !== 'Point') return
        const properties = feature.properties ?? {}
        popupRef.current?.remove()
        setSelectedStationId(String(properties.station_id ?? ''))
        const content = document.createElement('div')
        content.className = 'station-popup-content'

        const title = document.createElement('strong')
        title.className = 'station-popup-title'
        title.textContent = String(properties.long_name || `Station ${properties.station_id || ''}`)
        content.appendChild(title)

        const metadata = document.createElement('div')
        metadata.className = 'station-popup-metadata'
        metadata.textContent = [
          properties.station_id && `ID ${properties.station_id}`,
          properties.region,
        ]
          .filter(Boolean)
          .join(' · ')
        content.appendChild(metadata)

        const value = document.createElement('div')
        value.className = 'station-popup-value'
        const numericValue = Number(properties.value)
        const hasNumericValue =
          properties.value != null && properties.value !== '' && Number.isFinite(numericValue)
        if (hasNumericValue && properties.units === '%') {
          value.classList.add(
            numericValue > 0
              ? 'station-popup-value-positive'
              : numericValue < 0
                ? 'station-popup-value-negative'
                : 'station-popup-value-neutral',
          )
        }
        value.textContent = hasNumericValue
          ? `${formatNumber(numericValue)} ${properties.units || ''}`.trim()
          : 'No value available'
        content.appendChild(value)

        const context = document.createElement('div')
        context.className = 'station-popup-context'
        context.textContent = [
          properties.scenarioLabel,
          properties.date && formatDate(String(properties.date)),
        ]
          .filter(Boolean)
          .join(' · ')
        content.appendChild(context)
        if (properties.selectedD1641Summary || properties.baseD1641Summary) {
          const compliance = document.createElement('div')
          compliance.className = 'station-popup-compliance'

          const complianceHeading = document.createElement('strong')
          complianceHeading.className = 'station-popup-compliance-heading'
          complianceHeading.textContent = 'Compliance station'
          compliance.appendChild(complianceHeading)

          const complianceStation = document.createElement('div')
          complianceStation.className = 'station-popup-compliance-station'
          const complianceStationName = String(
            properties.long_name ||
              properties.d1641Name ||
              `Station ${properties.station_id || ''}`,
          )
          complianceStation.textContent = properties.d1641Id
            ? `${complianceStationName} (${properties.d1641Id})`
            : complianceStationName
          compliance.appendChild(complianceStation)

          if (properties.d1641Regulation) {
            const rule = document.createElement('div')
            rule.className = 'station-popup-rule'
            const ruleLabel = document.createElement('strong')
            ruleLabel.className = 'station-popup-rule-label'
            ruleLabel.textContent = 'D-1641 rule'
            rule.appendChild(ruleLabel)
            const ruleText = document.createElement('div')
            ruleText.className = 'station-popup-rule-text'
            ruleText.textContent = String(properties.d1641Regulation)
            rule.appendChild(ruleText)
            compliance.appendChild(rule)
          }

          const statuses = document.createElement('div')
          statuses.className = 'station-popup-statuses'
          ;[
            {
              label: `Base · ${properties.baseScenarioLabel || 'scenario'}`,
              summary: properties.baseD1641Summary,
            },
            {
              label: `Selected · ${properties.scenarioLabel || 'scenario'}`,
              summary: properties.selectedD1641Summary,
            },
          ].forEach(({ label, summary }, index) => {
            const statusKind = index === 0 ? 'base' : 'selected'
            const row = document.createElement('div')
            row.className = `station-popup-status station-popup-status-${statusKind}`
            const statusLabel = document.createElement('strong')
            statusLabel.className = `station-popup-status-label station-popup-status-label-${statusKind}`
            statusLabel.textContent = String(label)
            row.appendChild(statusLabel)
            const statusText = document.createElement('span')
            statusText.className = `station-popup-status-text station-popup-status-text-${statusKind}`
            statusText.textContent = String(summary || 'Not a computable compliance station')
            row.appendChild(statusText)
            statuses.appendChild(row)
          })
          compliance.appendChild(statuses)
          content.appendChild(compliance)
        }

        const popup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: true,
          maxWidth: '22rem',
          offset: 10,
        })
          .setLngLat((feature.geometry as Point).coordinates as [number, number])
          .setDOMContent(content)
          .addTo(map)
        popup.on('close', () => {
          if (popupRef.current === popup) {
            popupRef.current = null
            setSelectedStationId(null)
          }
        })
        popupRef.current = popup
      }
      map.on('click', showStationPopup)
      map.on('mouseenter', 'stations', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'stations', () => {
        map.getCanvas().style.cursor = ''
      })
    })
    return () => {
      const popup = popupRef.current
      popupRef.current = null
      popup?.remove()
      map.remove()
    }
    // The map instance is intentionally created once; later data updates use the source effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      ;(mapRef.current?.getSource('stations') as GeoJSONSource | undefined)?.setData(geojson)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [geojson])

  useEffect(() => {
    const map = mapRef.current
    if (!map?.getLayer('d1641-onset-pulse') || !onsetSignature) return
    const start = performance.now()
    const duration = 1400
    let frame = 0
    const animate = (now: number) => {
      const elapsed = now - start
      const cycle = (elapsed % (duration / 2)) / (duration / 2)
      map.setPaintProperty('d1641-onset-pulse', 'circle-radius', 8 + cycle * 12)
      map.setPaintProperty('d1641-onset-pulse', 'circle-opacity', Math.max(0, 0.8 * (1 - cycle)))
      if (elapsed < duration) frame = window.requestAnimationFrame(animate)
      else map.setPaintProperty('d1641-onset-pulse', 'circle-opacity', 0)
    }
    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [dateIndex, onsetSignature])

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        minHeight: { xs: '32.5rem', lg: 0 },
        '& .mapboxgl-popup': {
          maxWidth: 'min(22rem, calc(100% - 1rem)) !important',
          '@media (max-width: 1919.95px)': {
            maxWidth: 'min(17rem, calc(100% - 1rem)) !important',
          },
        },
        '& .mapboxgl-popup-content': {
          bgcolor: 'base.700',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 6,
          color: 'text.primary',
          maxHeight: 'calc(100dvh - 4rem)',
          overflowX: 'hidden',
          overflowY: 'auto',
          overflowWrap: 'anywhere',
          p: 0,
        },
        '& .mapboxgl-popup-close-button': {
          bgcolor: 'transparent !important',
          color: 'text.secondary',
          fontSize: '1.25rem',
          p: 1,
        },
        '& .mapboxgl-popup-close-button:hover, & .mapboxgl-popup-close-button:focus-visible': {
          bgcolor: 'transparent !important',
          color: 'brand.primaryGreen',
        },
        '& .mapboxgl-popup-tip': { borderTopColor: 'base.700' },
        '& .station-popup-content': (theme) => ({
          display: 'grid',
          gap: theme.jtSpacing.gap.xs,
          p: theme.jtSpacing.component.sm,
          pr: theme.jtSpacing.component.lg,
          '@media (max-width: 1919.95px)': {
            gap: theme.spacing(0.5),
            p: theme.jtSpacing.component.xs,
            pr: theme.jtSpacing.component.md,
          },
        }),
        '& .station-popup-title': (theme) => ({
          color: 'brand.primaryGreen',
          fontWeight: 400,
          lineHeight: 1.3,
          textTransform: 'none',
          typography: 'body1',
          '@media (max-width: 1919.95px)': {
            ...theme.typography.caption,
            color: theme.palette.brand.primaryGreen,
          },
        }),
        '& .station-popup-metadata, & .station-popup-context': {
          color: 'text.secondary',
          typography: 'captionSmall',
        },
        '& .station-popup-compliance': (theme) => ({
          borderTop: 1,
          borderColor: 'divider',
          color: 'common.white',
          display: 'grid',
          gap: theme.jtSpacing.gap.xs,
          mt: 0.5,
          pt: 1,
        }),
        '& .station-popup-compliance-heading': {
          color: 'text.secondary',
          fontWeight: 400,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          typography: 'captionSmall',
        },
        '& .station-popup-compliance-station': (theme) => ({
          color: 'brand.primaryGreen',
          fontWeight: 400,
          lineHeight: 1.3,
          textTransform: 'none',
          typography: 'body1',
          '@media (max-width: 1919.95px)': {
            ...theme.typography.caption,
            color: theme.palette.brand.primaryGreen,
          },
        }),
        '& .station-popup-rule': (theme) => ({
          bgcolor: 'base.800',
          borderLeft: 3,
          borderColor: 'accent.yellow',
          display: 'grid',
          gap: theme.jtSpacing.gap.xs,
          my: 0.5,
          p: theme.jtSpacing.component.xs,
        }),
        '& .station-popup-rule-label': {
          color: 'brand.primaryGreen',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          typography: 'captionSmall',
        },
        '& .station-popup-rule-text': {
          color: 'common.white',
          lineHeight: 1.4,
          typography: 'captionSmall',
        },
        '& .station-popup-statuses': (theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.xs }),
        '& .station-popup-status': {
          alignItems: 'start',
          display: 'grid',
          gap: 0.25,
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          '@media (max-width: 1919.95px)': {
            gridTemplateColumns: 'minmax(0, 1fr)',
          },
        },
        '& .station-popup-status-label': { fontWeight: 400, typography: 'captionSmall' },
        '& .station-popup-status-text': {
          textAlign: 'right',
          typography: 'captionSmall',
          '@media (max-width: 1919.95px)': { textAlign: 'left' },
        },
        '& .station-popup-status-label-base, & .station-popup-status-text-base': {
          color: 'brand.primaryBlue',
        },
        '& .station-popup-status-label-selected, & .station-popup-status-text-selected': {
          color: 'brand.primaryGreen',
        },
        '& .station-popup-value': { color: 'text.primary', typography: 'h5' },
        '& .station-popup-value-positive': { color: 'salinity.pink' },
        '& .station-popup-value-negative': { color: 'salinity.teal' },
        '& .station-popup-value-neutral': { color: 'text.primary' },
      }}
    />
  )
}

type DeltaMapProps = MapCanvasProps

export default function DeltaMap({
  data,
  d1641Data,
  baseScenario,
  scenario,
  dateIndex,
  region,
  mapExtent,
  histogramBrush,
}: DeltaMapProps) {
  return (
    <Paper
      data-tour="map"
      variant="outlined"
      component="article"
      sx={{
        bgcolor: 'base.700',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        minWidth: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <MapCanvas
        data={data}
        d1641Data={d1641Data}
        baseScenario={baseScenario}
        scenario={scenario}
        dateIndex={dateIndex}
        region={region}
        mapExtent={mapExtent}
        histogramBrush={histogramBrush}
      />
      {d1641Data && (
        <Paper
          aria-label="D-1641 map status legend"
          variant="outlined"
          sx={(theme) => ({
            bgcolor: 'base.700',
            borderRadius: 1,
            display: 'grid',
            gap: theme.jtSpacing.gap.xs,
            left: theme.jtSpacing.component.sm,
            p: theme.jtSpacing.component.xs,
            position: 'absolute',
            top: theme.jtSpacing.component.sm,
          })}
        >
          <Box
            sx={(theme) => ({ alignItems: 'center', display: 'flex', gap: theme.jtSpacing.gap.sm })}
          >
            <Typography variant="captionSmall" sx={{ color: 'common.white' }}>
              ◇ D-1641 compliance station
            </Typography>
            <Typography variant="captionSmall" sx={{ color: 'accent.yellow', fontWeight: 800 }}>
              ◆ Active exceedance: B! base · S! selected
            </Typography>
          </Box>
        </Paper>
      )}
    </Paper>
  )
}
