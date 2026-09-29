import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const researchRoot =
  process.argv.slice(2).find((argument) => !argument.startsWith('--')) ??
  'D:/projects/JT_exploration/RMA/BDSC_regional_summary'
const minus10 = process.argv.includes('--minus10')
const analysisFolder = minus10
  ? 'delta_outflow_minus10_regional_sensitivity'
  : 'delta_outflow_regional_sensitivity'
const analysisDir = path.join(researchRoot, `internal/analysis/${analysisFolder}`)
const runtimeDir = path.join(repoRoot, 'public/data/regional-summary')
const scenarioKey = minus10 ? 'schism_run17_minus10pct_outflow' : 'schism_run16_plus30pct_outflow'
const scenarioLabel = minus10 ? 'Decrease Delta Outflow (−10%)' : 'Increase Delta Outflow (+30%)'
const rmaRoot = path.resolve(researchRoot, '..')
const baselineEcPath = path.join(
  rmaRoot,
  'data/baseline_schism/ec_full_extent_all_stations/run_15_EC_daily_mean_full_extent.csv',
)
const scenarioEcPath = path.join(
  rmaRoot,
  `data/baseline_schism/ec_full_extent_all_stations/run_${minus10 ? '17' : '16'}_EC_daily_mean_full_extent.csv`,
)
const stationGeojsonPath = path.join(
  researchRoot,
  'inputs/stations/schism_modeled_stations_405.geojson',
)
const minus10ApprovedIds = new Set([
  'OUTFLOWM10-SM-01',
  'OUTFLOWM10-MS-01',
  'OUTFLOWM10-SB-01',
  'OUTFLOWM10-SB-05',
  'OUTFLOWM10-CZ-01',
  'OUTFLOWM10-SRC-01',
  'OUTFLOWM10-CD-01',
  'OUTFLOWM10-LCS-01',
  'OUTFLOWM10-LCS-02',
  'OUTFLOWM10-SD-05',
])

function parseCsv(text) {
  const rows = []
  let row = []
  let value = ''
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (character === '"') {
      if (quoted && text[index + 1] === '"') value += text[++index]
      else quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(value)
      value = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(value)
      if (row.some((cell) => cell !== '')) rows.push(row)
      row = []
      value = ''
    } else value += character
  }
  if (value || row.length) {
    row.push(value)
    rows.push(row)
  }
  const [headers, ...records] = rows
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ''])),
  )
}

const numberOrNull = (value) => (value === '' || value == null ? null : Number(value))
const mean = (values) => {
  const valid = values.filter(Number.isFinite)
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null
}
const unwrapGeometry = (geojson) => {
  if (geojson.type === 'FeatureCollection') return geojson.features[0]?.geometry ?? null
  if (geojson.type === 'Feature') return geojson.geometry
  return geojson
}

const regionConfig = {
  suisun_marsh: {
    name: 'Suisun Marsh',
    coordinates: [-122.07, 38.15],
    polygon: 'suisun_marsh.geojson',
  },
  montezuma_slough: {
    name: 'Montezuma Slough',
    coordinates: [-121.99, 38.12],
    polygon: 'montezuma_slough.geojson',
  },
  suisun_bay: {
    name: 'Suisun Bay',
    coordinates: [-122.05, 38.06],
    polygon: 'suisun_bay.geojson',
  },
  confluence_zone: {
    name: 'Confluence Zone',
    coordinates: [-121.82, 38.05],
    polygon: 'confluence_zone.geojson',
  },
  sacramento_river_corridor: {
    name: 'Sacramento River Corridor',
    coordinates: [-121.67, 38.08],
  },
  lindsey_cache_slough: {
    name: 'Lindsey–Cache Slough',
    coordinates: [-121.7, 38.27],
    polygon: 'lindsey_cache_slough.geojson',
  },
  central_delta: { name: 'Central Delta', coordinates: [-121.58, 38.02] },
  southern_delta: { name: 'Southern Delta', coordinates: [-121.56, 37.78] },
}

const recommended = JSON.parse(
  fs.readFileSync(path.join(analysisDir, 'recommended_station_sets.json'), 'utf8'),
)
const baselineRows = parseCsv(fs.readFileSync(baselineEcPath, 'utf8'))
const scenarioRows = parseCsv(fs.readFileSync(scenarioEcPath, 'utf8'))
const stationGeojson = JSON.parse(fs.readFileSync(stationGeojsonPath, 'utf8'))
const stationsById = new Map(
  stationGeojson.features.map((feature) => [
    Number(feature.properties.schism_station_index),
    feature,
  ]),
)
const baselineByDate = new Map(baselineRows.map((row) => [row.time, row]))
const scenarioByDate = new Map(scenarioRows.map((row) => [row.time, row]))
const stationColumnById = new Map(
  Object.keys(baselineRows[0] ?? {})
    .filter((column) => column !== 'time')
    .map((column) => [Number(column.split('_', 1)[0]), column]),
)

const browserStationGeojson = {
  type: 'FeatureCollection',
  name: stationGeojson.name,
  metadata: stationGeojson.metadata,
  features: stationGeojson.features.map((feature) => ({
    type: 'Feature',
    id: feature.id,
    properties: {
      schism_station_index: feature.properties.schism_station_index,
      schism_short_name: feature.properties.schism_short_name,
      station_name: feature.properties.station_name,
      schism_cluster: feature.properties.schism_cluster,
      nearest_rma_station_number: feature.properties.nearest_rma_station_number,
    },
    geometry: feature.geometry,
  })),
}
fs.writeFileSync(
  path.join(runtimeDir, 'schism-modeled-stations-405.geojson'),
  `${JSON.stringify(browserStationGeojson)}\n`,
)
const candidates = parseCsv(
  fs.readFileSync(path.join(analysisDir, 'pattern_candidates.csv'), 'utf8'),
)
const robustIds = new Set(
  Object.values(recommended.regions).flatMap((region) => region.robust_candidate_ids ?? []),
)
const approvedIds = minus10
  ? [...robustIds].filter((candidateId) => minus10ApprovedIds.has(candidateId))
  : [...robustIds]
const robustRows = approvedIds.map((candidateId) => {
  const matches = candidates.filter((row) => row.candidate_id === candidateId)
  return matches.find((row) => row.is_primary_core_variant === 'True') ?? matches[0]
})

if (robustRows.some((row) => !row))
  throw new Error('A robust candidate is missing from pattern_candidates.csv')

const polygonDir = path.join(researchRoot, 'inputs/waterway_regions')
const grouped = new Map()
for (const row of robustRows) {
  if (!grouped.has(row.region_id)) grouped.set(row.region_id, [])
  grouped.get(row.region_id).push(row)
}

const places = [...grouped.entries()].map(([regionId, rows]) => {
  const config = regionConfig[regionId]
  const polygonPath = config.polygon ? path.join(polygonDir, config.polygon) : null
  const geometry =
    polygonPath && fs.existsSync(polygonPath)
      ? unwrapGeometry(JSON.parse(fs.readFileSync(polygonPath, 'utf8')))
      : null
  return {
    id: regionId,
    name: config.name,
    coordinates: config.coordinates,
    geographyScale: 'region',
    geometryStatus: geometry ? 'reviewed_polygon' : 'label_only_pending_polygon',
    geometryNote: geometry
      ? `Uses the reviewed ${config.name} geometry from inputs/waterway_regions.`
      : 'No reviewed polygon is available; the runtime map shows a place label at the representative location.',
    geometry,
    trend: rows[0].direction,
    patterns: rows
      .sort((a, b) => a.start_date.localeCompare(b.start_date))
      .map((row) => ({
        id: row.candidate_id,
        candidateType: 'approved_curated_pattern',
        direction: row.direction,
        patternType: row.calendar_duration_days >= 365 ? 'persistent_condition' : 'episode',
        startDate: row.start_date,
        endDate: row.end_date,
        durationDays: numberOrNull(row.calendar_duration_days),
        qualifyingDays: numberOrNull(row.n_qualifying_days),
        baselineEc: numberOrNull(row.baseline_ec),
        scenarioEc: numberOrNull(row.scenario_ec),
        differenceEc: numberOrNull(row.avg_ec_difference),
        differencePct: numberOrNull(row.avg_percent_difference),
        stationCount: numberOrNull(row.n_stations),
        stationAgreement: numberOrNull(row.avg_station_agreement_fraction),
        stationCoverage: 1,
        thresholdEc: null,
        additionalThresholdDays: null,
        sustainedReversals: null,
        reversalsPerYear: null,
        reviewStatus: 'selected',
        reviewNote: `Approved robust pattern ${row.candidate_id}; ${row.robustness_reason}`,
        proposedDisplayRegion: config.name,
        broaderStoryGroup: minus10 ? '−10% Delta Outflow' : '+30% Delta Outflow',
        analysisProvenance: analysisFolder,
      })),
  }
})

const patternListPath = path.join(runtimeDir, 'pattern-list.json')
const patternList = JSON.parse(fs.readFileSync(patternListPath, 'utf8'))
patternList.scenarios[scenarioKey] = {
  label: scenarioLabel,
  places,
}
patternList.generatedAt = new Date().toISOString()
patternList.sourceRecordCount = Object.values(patternList.scenarios)
  .flatMap((scenario) => scenario.places)
  .reduce((sum, place) => sum + place.patterns.length, 0)
fs.writeFileSync(patternListPath, `${JSON.stringify(patternList, null, 2)}\n`)

const roiPath = path.join(runtimeDir, 'region-of-interest.geojson')
const roi = JSON.parse(fs.readFileSync(roiPath, 'utf8'))
const promotedIds = new Set(places.filter((place) => place.geometry).map((place) => place.id))
roi.features = roi.features.filter((feature) => !promotedIds.has(feature.properties.region_id))
for (const place of places.filter((candidate) => candidate.geometry)) {
  roi.features.push({
    type: 'Feature',
    properties: {
      region_id: place.id,
      region_name: place.name,
      kind: place.geometryStatus,
      geometry_note: place.geometryNote,
    },
    geometry: place.geometry,
  })
}
fs.writeFileSync(roiPath, `${JSON.stringify(roi, null, 2)}\n`)

const sourceSeries = JSON.parse(
  fs.readFileSync(path.join(analysisDir, 'regional_ec_series_7d.json'), 'utf8'),
).series
const runtimeSeriesPath = path.join(runtimeDir, 'pattern-ec-series-7d.json')
const runtimeSeries = JSON.parse(fs.readFileSync(runtimeSeriesPath, 'utf8'))
for (const row of robustRows) {
  const source = Object.values(sourceSeries).find(
    (series) => series.region_id === row.region_id && series.variant_id === row.variant_id,
  )
  if (!source) continue
  runtimeSeries[row.candidate_id] = {
    dates: source.date,
    baseline: source.rolled_baseline_7d,
    scenario: source.rolled_scenario_7d,
    scenarioMin: source.date.map(() => null),
    scenarioMax: source.date.map(() => null),
  }
}
fs.writeFileSync(runtimeSeriesPath, `${JSON.stringify(runtimeSeries)}\n`)

const evidencePath = path.join(runtimeDir, 'pattern-evidence.json')
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'))
evidence.scenarios[scenarioKey] = {
  label: scenarioLabel,
  regionOrder: places.map((place) => place.id),
  annotations: [],
}
for (const place of places) {
  for (const pattern of place.patterns) {
    const stationIds = recommended.regions[place.id]?.core_station_indices ?? []
    const eventDates = baselineRows
      .map((row) => row.time)
      .filter((date) => date >= pattern.startDate && date <= pattern.endDate)
    const stations = stationIds.flatMap((stationId) => {
      const stationFeature = stationsById.get(Number(stationId))
      const column = stationColumnById.get(Number(stationId))
      if (!stationFeature || !column) return []
      const baselineValues = eventDates.map((date) =>
        numberOrNull(baselineByDate.get(date)?.[column]),
      )
      const scenarioValues = eventDates.map((date) =>
        numberOrNull(scenarioByDate.get(date)?.[column]),
      )
      const paired = baselineValues.flatMap((baselineValue, index) => {
        const scenarioValue = scenarioValues[index]
        return Number.isFinite(baselineValue) && Number.isFinite(scenarioValue)
          ? [{ baselineValue, scenarioValue }]
          : []
      })
      const baselineMean = mean(paired.map(({ baselineValue }) => baselineValue))
      const scenarioMean = mean(paired.map(({ scenarioValue }) => scenarioValue))
      if (baselineMean == null || scenarioMean == null) return []
      const differenceEc = scenarioMean - baselineMean
      const [longitude, latitude] = stationFeature.geometry.coordinates
      return [
        {
          stationId: Number(stationId),
          name: stationFeature.properties.station_name,
          shortName: stationFeature.properties.schism_short_name || `SCHISM ${Number(stationId)}`,
          longitude,
          latitude,
          baselineMean: Number(baselineMean.toFixed(3)),
          scenarioMean: Number(scenarioMean.toFixed(3)),
          differenceEc: Number(differenceEc.toFixed(3)),
          differencePct:
            baselineMean === 0 ? null : Number(((differenceEc / baselineMean) * 100).toFixed(3)),
          direction: differenceEc < 0 ? 'fresher' : 'saltier',
          agreesWithPattern: pattern.direction === 'fresher' ? differenceEc < 0 : differenceEc >= 0,
        },
      ]
    })
    evidence.patterns[pattern.id] = {
      patternId: pattern.id,
      scenarioKey,
      regionId: place.id,
      regionName: place.name,
      eventWindow: { startDate: pattern.startDate, endDate: pattern.endDate },
      stationEvidence: {
        provenance: `${analysisFolder}; SCHISM daily station means, event-window average`,
        membershipSource: 'reviewed-core-station-set',
        stationCount: stations.length,
        stations,
      },
      narrative: {
        headline: `${pattern.direction === 'fresher' ? 'Fresher' : 'Saltier'} conditions persisted for ${pattern.durationDays} days.`,
        description: `${place.name} averaged ${Math.abs(pattern.differencePct).toFixed(1)}% ${pattern.direction} than the reference outflow run (${Math.round(pattern.baselineEc).toLocaleString()} → ${Math.round(pattern.scenarioEc).toLocaleString()} µS/cm).`,
        provenance: analysisFolder,
        reviewStatus: 'selected',
      },
    }
  }
}
evidence.generatedAt = patternList.generatedAt
fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)

console.log(
  `Promoted ${robustRows.length} approved ${minus10 ? '−10%' : '+30%'} Delta Outflow patterns across ${places.length} regions.`,
)
