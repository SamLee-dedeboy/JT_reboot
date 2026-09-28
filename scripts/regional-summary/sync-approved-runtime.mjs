import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const researchRoot = process.argv[2] ?? 'D:/projects/JT_exploration/RMA/BDSC_regional_summary'
const ledgerPath = path.join(
  researchRoot,
  'internal/analysis/bdsc-preparation/approved_patterns.csv',
)
const polygonDir = path.join(researchRoot, 'inputs/waterway_regions')
const patternPath = path.join(repoRoot, 'public/data/regional-summary/pattern-list.json')
const roiPath = path.join(repoRoot, 'public/data/regional-summary/region-of-interest.geojson')

function parseCsv(text) {
  const rows = []
  let row = []
  let value = ''
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        value += '"'
        index += 1
      } else quoted = !quoted
    } else if (char === ',' && !quoted) {
      row.push(value)
      value = ''
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1
      row.push(value)
      if (row.some((cell) => cell !== '')) rows.push(row)
      row = []
      value = ''
    } else value += char
  }
  if (value || row.length) {
    row.push(value)
    rows.push(row)
  }
  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, ''))
  return rows.map((cells) =>
    Object.fromEntries(headers.map((header, i) => [header, cells[i] ?? ''])),
  )
}

const numberOrNull = (value) => (value === '' || value == null ? null : Number(value))
const slug = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
const midpoint = (start, end) => {
  const date = new Date((new Date(start).getTime() + new Date(end).getTime()) / 2)
  return date.toISOString().slice(0, 10)
}

const scenarioConfig = {
  bolster: { label: 'Bolster & Fortify' },
  ecomachine: { label: 'Eco Machine' },
  newgreen: { label: 'New Green Watershed' },
  reserve: { label: 'Calling on Reserves' },
  schism_run16_plus30pct_outflow: { label: 'Increase Delta Outflow (+30%)' },
}

const regionConfig = {
  north_franks_tract: {
    name: 'North of Franks Tract',
    polygon: 'north_franks_tract.geojson',
    coordinates: [-121.625, 38.095],
  },
  franks_tract: {
    name: 'Franks Tract',
    polygon: 'franks_tract.geojson',
    coordinates: [-121.596, 38.046],
  },
  freshwater_corridor: {
    id: 'bf_freshwater_pathway',
    name: 'Freshwater Corridor',
    polygon: 'freshwater_corridor_narrow.geojson',
    coordinates: [-121.573, 37.956],
  },
  bf_freshwater_pathway: {
    name: 'Freshwater Corridor',
    polygon: 'freshwater_corridor_narrow.geojson',
    coordinates: [-121.573, 37.956],
  },
  clifton_court_forebay: {
    name: 'Clifton Court Forebay',
    polygon: 'clifton_court_forebay.geojson',
    coordinates: [-121.58, 37.83],
  },
  suisun_marsh: {
    name: 'Suisun Marsh',
    polygon: 'suisun_marsh.geojson',
    coordinates: [-122.07, 38.15],
  },
  montezuma_slough: {
    name: 'Montezuma Slough',
    polygon: 'montezuma_slough.geojson',
    coordinates: [-121.99, 38.12],
  },
  suisun_bay: { name: 'Suisun Bay', polygon: 'suisun_bay.geojson', coordinates: [-122.05, 38.06] },
  confluence_zone: { name: 'Confluence Zone', coordinates: [-121.84, 38.04] },
  lindsey_cache_slough: { name: 'Lindsey–Cache Slough', coordinates: [-121.68, 38.23] },
  southern_delta: { name: 'Southern Delta', coordinates: [-121.56, 37.78] },
}

function unwrapGeometry(geojson) {
  if (geojson.type === 'FeatureCollection') return geojson.features[0]?.geometry ?? null
  if (geojson.type === 'Feature') return geojson.geometry
  return geojson
}

function geometryFor(regionId) {
  const config = regionConfig[regionId]
  if (!config?.polygon) return null
  const file = path.join(polygonDir, config.polygon)
  return fs.existsSync(file) ? unwrapGeometry(JSON.parse(fs.readFileSync(file, 'utf8'))) : null
}

function patternId(row, existingIds) {
  const explicit = row.notes.match(/(?:Pattern ID|ID)\s*[:=]\s*([A-Z0-9-]+)/i)?.[1]
  if (explicit) return explicit
  const key = `${row.scenario_key}|${row.region_id}|${row.period_start}|${row.period_end}`
  if (existingIds.has(key)) return existingIds.get(key)
  const prefix =
    row.scenario_key === 'ecomachine'
      ? 'ECO'
      : row.scenario_key === 'newgreen'
        ? 'NGW'
        : row.scenario_key.toUpperCase()
  return `${prefix}-${slug(row.region_id).toUpperCase()}-${row.period_start.replaceAll('-', '')}`
}

function makePattern(row, id) {
  return {
    id,
    candidateType: 'approved_curated_pattern',
    direction: row.direction || null,
    patternType: row.pattern_type || null,
    startDate: row.period_start || null,
    endDate: row.period_end || null,
    durationDays: numberOrNull(row.calendar_duration_days),
    qualifyingDays: numberOrNull(row.n_qualifying_days),
    baselineEc: numberOrNull(row.baseline_regional_ec),
    scenarioEc: numberOrNull(row.scenario_regional_ec),
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
    reviewNote: row.notes || `Approved ${row.approved_date || 'curated'} pattern.`,
    proposedDisplayRegion: row.region_name,
    broaderStoryGroup: row.scenario_label,
    analysisProvenance: 'approved_patterns.csv',
  }
}

const dataset = JSON.parse(fs.readFileSync(patternPath, 'utf8'))
const ledger = parseCsv(fs.readFileSync(ledgerPath, 'utf8'))
const existingIds = new Map()
for (const [scenarioKey, scenario] of Object.entries(dataset.scenarios)) {
  for (const place of scenario.places) {
    for (const pattern of place.patterns)
      existingIds.set(
        `${scenarioKey}|${place.id}|${pattern.startDate}|${pattern.endDate}`,
        pattern.id,
      )
  }
}

for (const [scenarioKey, config] of Object.entries(scenarioConfig)) {
  dataset.scenarios[scenarioKey] ??= { label: config.label, places: [] }
}

const grouped = new Map()
for (const row of ledger) {
  const configured = regionConfig[row.region_id] ?? {
    name: row.region_name,
    coordinates: [-121.75, 38.05],
  }
  const regionId = configured.id ?? row.region_id
  const key = `${row.scenario_key}|${regionId}`
  if (!grouped.has(key)) grouped.set(key, [])
  grouped.get(key).push({ ...row, region_id: regionId, region_name: configured.name })
}

for (const [key, rows] of grouped) {
  const [scenarioKey, regionId] = key.split('|')
  const scenario = dataset.scenarios[scenarioKey]
  const config = regionConfig[regionId] ?? {
    name: rows[0].region_name,
    coordinates: [-121.75, 38.05],
  }
  let place = scenario.places.find((candidate) => candidate.id === regionId)
  const geometry = geometryFor(regionId)
  const spatialStatus = geometry ? 'reviewed_polygon' : 'label_only_pending_polygon'
  const spatialNote = geometry
    ? `Uses the reviewed ${config.name} geometry from inputs/waterway_regions.`
    : `No reviewed polygon is available; the runtime map shows a place label at the representative location.`
  if (!place) {
    place = {
      id: regionId,
      name: config.name,
      coordinates: config.coordinates,
      geographyScale: 'region',
      geometryStatus: spatialStatus,
      geometryNote: spatialNote,
      geometry,
      trend: 'unclear',
      patterns: [],
    }
    scenario.places.push(place)
  } else {
    place.name = config.name
    place.coordinates = config.coordinates
    place.geometry = geometry
    place.geometryStatus = spatialStatus
    place.geometryNote = spatialNote
  }
  place.patterns = rows.map((row) => makePattern(row, patternId(row, existingIds)))
  const directions = new Set(place.patterns.map((pattern) => pattern.direction).filter(Boolean))
  place.trend = directions.size > 1 ? 'flipping' : (directions.values().next().value ?? 'unclear')
}

dataset.generatedAt = new Date().toISOString()
dataset.sourceRecordCount = ledger.length
fs.writeFileSync(patternPath, `${JSON.stringify(dataset, null, 2)}\n`)

const features = []
const seen = new Set()
for (const scenario of Object.values(dataset.scenarios)) {
  for (const place of scenario.places) {
    if (!place.geometry || seen.has(place.id)) continue
    seen.add(place.id)
    features.push({
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
}
fs.writeFileSync(roiPath, `${JSON.stringify({ type: 'FeatureCollection', features }, null, 2)}\n`)

// Populate the chart and station-evidence payloads for RMA-backed scenarios.
// Reviewed B&F records are preserved; SCHISM outflow uses its separate pipeline.
const dashboard = JSON.parse(
  fs.readFileSync(
    path.join(repoRoot, 'public/data/scenario-explorer/salinity_dashboard.json'),
    'utf8',
  ),
)
const evidencePath = path.join(repoRoot, 'public/data/regional-summary/pattern-evidence.json')
const seriesPath = path.join(repoRoot, 'public/data/regional-summary/pattern-ec-series-7d.json')
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'))
const series = JSON.parse(fs.readFileSync(seriesPath, 'utf8'))
const recommendedPath = path.join(
  researchRoot,
  'internal/analysis/bdsc-preparation/cor-regional-sensitivity/recommended_station_sets.json',
)
const recommended = JSON.parse(fs.readFileSync(recommendedPath, 'utf8'))
const dashboardScenarios = new Map(
  Object.values(dashboard.scenarios).map((scenario) => [scenario.key, scenario]),
)
const stationIndex = new Map(
  dashboard.stations.map((station, index) => [Number(station.station_id), index]),
)
const mean = (values) => {
  const valid = values.filter(Number.isFinite)
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null
}
const round = (value) => (Number.isFinite(value) ? Math.round(value * 1000) / 1000 : null)
const rolling = (values) =>
  values.map((_, index) => round(mean(values.slice(Math.max(0, index - 6), index + 1))))

for (const row of ledger) {
  if (['bolster', 'schism_run16_plus30pct_outflow'].includes(row.scenario_key)) continue
  const scenario = dashboardScenarios.get(row.scenario_key)
  if (!scenario) continue
  const configured = regionConfig[row.region_id] ?? { name: row.region_name }
  const regionId = configured.id ?? row.region_id
  const runtimePattern = dataset.scenarios[row.scenario_key].places
    .find((place) => place.id === regionId)
    ?.patterns.find(
      (pattern) => pattern.startDate === row.period_start && pattern.endDate === row.period_end,
    )
  if (!runtimePattern) continue
  const ledgerStations = row.included_station_ids
    .split(';')
    .map(Number)
    .filter((stationId) => Number.isFinite(stationId) && stationId > 0)
  const fallbackStations = recommended.regions[row.region_id]?.complete_set_station_ids ?? []
  const stationIds = ledgerStations.length ? ledgerStations : fallbackStations
  const indices = stationIds.map((id) => stationIndex.get(id)).filter(Number.isInteger)
  if (!indices.length) continue

  const baselineDaily = dashboard.dates.map((_, dateIndex) =>
    mean(indices.map((index) => dashboard.referenceStationValues[index]?.[dateIndex])),
  )
  const scenarioDaily = dashboard.dates.map((_, dateIndex) =>
    mean(
      indices.map((index) => {
        const baseline = dashboard.referenceStationValues[index]?.[dateIndex]
        const difference = scenario.stationValues[index]?.[dateIndex]
        return Number.isFinite(baseline) && Number.isFinite(difference)
          ? baseline + difference
          : null
      }),
    ),
  )
  series[runtimePattern.id] = {
    dates: dashboard.dates,
    baseline: rolling(baselineDaily),
    scenario: rolling(scenarioDaily),
    scenarioMin: dashboard.dates.map(() => null),
    scenarioMax: dashboard.dates.map(() => null),
  }

  const startIndex = dashboard.dates.indexOf(row.period_start)
  const endIndex = dashboard.dates.indexOf(row.period_end)
  const eventStations = stationIds.flatMap((stationId) => {
    const index = stationIndex.get(stationId)
    if (!Number.isInteger(index) || startIndex < 0 || endIndex < startIndex) return []
    const baselineMean = mean(
      dashboard.referenceStationValues[index].slice(startIndex, endIndex + 1),
    )
    const differenceMean = mean(scenario.stationValues[index].slice(startIndex, endIndex + 1))
    if (!Number.isFinite(baselineMean) || !Number.isFinite(differenceMean)) return []
    const station = dashboard.stations[index]
    const direction = differenceMean >= 0 ? 'saltier' : 'fresher'
    return [
      {
        stationId,
        name: station.long_name,
        shortName: station.short_name,
        longitude: station.longitude,
        latitude: station.latitude,
        baselineMean: round(baselineMean),
        scenarioMean: round(baselineMean + differenceMean),
        differenceEc: round(differenceMean),
        differencePct: baselineMean ? round((differenceMean / baselineMean) * 100) : null,
        direction,
        agreesWithPattern: direction === row.direction,
      },
    ]
  })
  evidence.patterns[runtimePattern.id] = {
    patternId: runtimePattern.id,
    scenarioKey: row.scenario_key,
    regionId,
    regionName: configured.name,
    eventWindow: { startDate: row.period_start, endDate: row.period_end },
    stationEvidence: {
      provenance: 'derived-from-scenario-explorer-daily-stations',
      membershipSource: ledgerStations.length
        ? 'approved_patterns.csv'
        : 'recommended_station_sets.json',
      stationCount: eventStations.length,
      stations: eventStations,
    },
    narrative: {
      headline: `${row.direction === 'saltier' ? 'Saltier' : 'Fresher'} conditions persisted for ${row.calendar_duration_days} days.`,
      description: row.display_finding,
      provenance: 'approved_patterns.csv',
      reviewStatus: 'selected',
    },
  }
}

for (const [scenarioKey, scenario] of Object.entries(dataset.scenarios)) {
  evidence.scenarios[scenarioKey] ??= {
    label: scenario.label,
    regionOrder: scenario.places.map((place) => place.id),
    annotations: [],
  }
}
evidence.generatedAt = dataset.generatedAt
fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
fs.writeFileSync(seriesPath, `${JSON.stringify(series)}\n`)

console.log(
  `Synced ${ledger.length} approved patterns across ${Object.keys(dataset.scenarios).length} scenarios.`,
)
console.log(
  `Promoted ${features.length} unique reviewed geometries; remaining regions use place labels.`,
)
