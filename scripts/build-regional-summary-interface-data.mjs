import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

function parseCsv(text) {
  const rows = []
  let row = []
  let value = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    const next = text[index + 1]

    if (character === '"' && quoted && next === '"') {
      value += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(value)
      value = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1
      row.push(value)
      if (row.some((cell) => cell !== '')) rows.push(row)
      row = []
      value = ''
    } else {
      value += character
    }
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

const toNumber = (value) => (value === '' || value == null ? null : Number(value))
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length
const firstValue = (...values) => values.find((value) => value !== '' && value != null) ?? ''

const [
  shortlistPath,
  clusterPath,
  geometryPath,
  outputPath,
  optionalArgument,
  secondOptionalArgument,
] = process.argv.slice(2)
const optionalArgumentIsGeometry = optionalArgument?.toLowerCase().endsWith('.geojson')
const mergeScenarioKey = optionalArgumentIsGeometry ? undefined : optionalArgument
const franksTractGeometryPath = optionalArgumentIsGeometry
  ? optionalArgument
  : secondOptionalArgument
const northFranksTractGeometryPath = 'public/data/regional-summary/raw/north_franks_tract.geojson'
if (!shortlistPath || !clusterPath || !geometryPath || !outputPath) {
  throw new Error(
    'Usage: node build-regional-summary-interface-data.mjs <shortlist.csv> <clusters.csv> <geometries.geojson> <output.json> [merge-scenario-key] [franks-tract.geojson]',
  )
}

const [shortlist, clusters, geometryCollection, franksTractCollection, northFranksTractCollection] =
  await Promise.all([
    readFile(resolve(shortlistPath), 'utf8').then(parseCsv),
    readFile(resolve(clusterPath), 'utf8').then(parseCsv),
    readFile(resolve(geometryPath), 'utf8').then(JSON.parse),
    franksTractGeometryPath
      ? readFile(resolve(franksTractGeometryPath), 'utf8').then(JSON.parse)
      : Promise.resolve(null),
    readFile(resolve(northFranksTractGeometryPath), 'utf8').then(JSON.parse),
  ])

const clusterCoordinates = new Map(
  clusters.map((cluster) => {
    const longitudes = cluster.longitudes.split(';').map(Number).filter(Number.isFinite)
    const latitudes = cluster.latitudes.split(';').map(Number).filter(Number.isFinite)
    return [cluster.cluster_name, [mean(longitudes), mean(latitudes)]]
  }),
)

const coordinateOverrides = new Map([
  ['B&F Freshwater Pathway', [-121.62, 38.0]],
  ['Suisun Bay', [-122.02, 38.08]],
  ['San Pablo Bay', [-122.37, 38.04]],
  ['Suisun Marsh', [-122.07, 38.16]],
  ['Lindsey-Cache Slough', [-121.75, 38.25]],
  ['Montezuma Slough–eastern Suisun Marsh', [-122.06, 38.13]],
  ['Montezuma Slough', [-122.06, 38.13]],
  ['North Franks Tract', [-121.625, 38.085]],
])

const geometryIdByPlace = new Map([
  ['B&F Freshwater Pathway', 'bf_freshwater_pathway'],
  ['Suisun Bay', 'open_suisun_bay'],
  ['San Pablo Bay', 'san_pablo_bay'],
  ['Suisun Marsh', 'ngw_component_003'],
  ['Lindsey-Cache Slough', 'ngw_component_001'],
  ['Montezuma Slough–eastern Suisun Marsh', 'montezuma_slough'],
  ['Montezuma Slough', 'montezuma_slough'],
  ['Franks Tract', 'franks_tract'],
  ['North Franks Tract', 'north_franks_tract'],
])

const geometryById = new Map()
for (const feature of geometryCollection.features) {
  const id = feature.properties?.region_id
  if (!id || feature.properties?.kind === 'habitat_boundary') continue
  geometryById.set(id, feature.geometry)
}
if (franksTractCollection?.features?.[0]?.geometry) {
  geometryById.set('franks_tract', franksTractCollection.features[0].geometry)
}
if (northFranksTractCollection?.features?.[0]?.geometry) {
  geometryById.set('north_franks_tract', northFranksTractCollection.features[0].geometry)
}

function convexHull(points) {
  if (points.length < 3) return null
  const sorted = [...points].sort(([ax, ay], [bx, by]) => ax - bx || ay - by)
  const cross = (origin, a, b) =>
    (a[0] - origin[0]) * (b[1] - origin[1]) - (a[1] - origin[1]) * (b[0] - origin[0])
  const lower = []
  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), point) <= 0) lower.pop()
    lower.push(point)
  }
  const upper = []
  for (const point of sorted.toReversed()) {
    while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), point) <= 0) upper.pop()
    upper.push(point)
  }
  const ring = [...lower.slice(0, -1), ...upper.slice(0, -1)]
  ring.push(ring[0])
  return { type: 'Polygon', coordinates: [ring] }
}

const clusterGeometries = new Map(
  clusters.map((cluster) => {
    const longitudes = cluster.longitudes.split(';').map(Number)
    const latitudes = cluster.latitudes.split(';').map(Number)
    return [
      cluster.cluster_name,
      convexHull(longitudes.map((longitude, index) => [longitude, latitudes[index]])),
    ]
  }),
)

const scenarios = {}
for (const source of shortlist) {
  const geographyId = firstValue(source.geography_id, source.geo_id)
  const geographyName = firstValue(source.geography_name, source.geo_name)
  const geographyScale = firstValue(source.geography_scale, source.geo_scale)
  const isStationCluster = geographyScale === 'cluster' || geographyScale === 'station_cluster'
  const scenario = (scenarios[source.scenario_key] ??= {
    label: source.scenario_label,
    places: {},
  })
  const coordinates = isStationCluster
    ? (clusterCoordinates.get(geographyName) ?? coordinateOverrides.get(geographyName))
    : (coordinateOverrides.get(geographyName) ?? clusterCoordinates.get(geographyName))
  if (!coordinates) throw new Error(`No coordinates found for ${geographyName}`)

  const hasAuthoritativeFranksTract =
    geographyId === 'franks_tract' && franksTractCollection?.features?.[0]?.geometry
  const hasSuppliedGeometry =
    !isStationCluster && (geometryIdByPlace.has(geographyName) || hasAuthoritativeFranksTract)
  const place = (scenario.places[geographyId] ??= {
    id: geographyId,
    name: geographyName,
    coordinates,
    geographyScale,
    geometryStatus: firstValue(
      hasAuthoritativeFranksTract ? 'reviewed_polygon' : '',
      source.geometry_status,
      hasSuppliedGeometry ? 'candidate_polygon' : 'approximate_station_footprint',
    ),
    geometryNote: firstValue(
      hasAuthoritativeFranksTract ? 'Uses the reviewed Franks Tract waterway-region geometry.' : '',
      source.geometry_note,
      hasSuppliedGeometry
        ? 'Uses the supplied candidate waterway geometry.'
        : 'Generated from the selected cluster station coordinates; not a reviewed boundary.',
    ),
    geometry:
      (isStationCluster
        ? (clusterGeometries.get(geographyName) ??
          geometryById.get(geometryIdByPlace.get(geographyName)))
        : (geometryById.get(geometryIdByPlace.get(geographyName)) ??
          clusterGeometries.get(geographyName))) ?? null,
    patterns: [],
  })

  place.patterns.push({
    id: source.pattern_id,
    candidateType: source.candidate_type,
    direction: source.direction || null,
    patternType: source.pattern_type || null,
    startDate: source.start_date || null,
    endDate: source.end_date || null,
    durationDays: toNumber(source.calendar_duration_days),
    qualifyingDays: toNumber(source.n_qualifying_days),
    baselineEc: toNumber(firstValue(source.baseline_ec_us_cm, source.avg_baseline_value)),
    scenarioEc: toNumber(firstValue(source.scenario_ec_us_cm, source.avg_scenario_value)),
    differenceEc: toNumber(
      firstValue(
        source.difference_us_cm,
        source.avg_absolute_difference === ''
          ? ''
          : source.direction === 'fresher'
            ? -Number(source.avg_absolute_difference)
            : source.avg_absolute_difference,
      ),
    ),
    differencePct: toNumber(firstValue(source.difference_pct, source.avg_percent_difference)),
    stationCount: toNumber(firstValue(source.station_count, source.n_stations)),
    stationAgreement: toNumber(
      firstValue(source.station_agreement_fraction, source.avg_station_agreement),
    ),
    stationCoverage: toNumber(
      firstValue(source.paired_station_coverage_fraction, source.avg_paired_station_coverage),
    ),
    thresholdEc: toNumber(firstValue(source.threshold_us_cm, source.threshold_uS_cm)),
    additionalThresholdDays: toNumber(
      firstValue(source.net_additional_threshold_days, source.net_additional_days),
    ),
    sustainedReversals: toNumber(source.sustained_reversal_count),
    reversalsPerYear: toNumber(source.reversals_per_model_year),
    reviewStatus: firstValue(source.review_status, 'selected'),
    reviewNote: source.review_note ?? '',
    proposedDisplayRegion: source.proposed_display_region ?? '',
    broaderStoryGroup: source.broader_story_group ?? '',
  })
}

for (const scenario of Object.values(scenarios)) {
  for (const place of Object.values(scenario.places)) {
    const directions = new Set(place.patterns.map((pattern) => pattern.direction).filter(Boolean))
    const thresholdDirections = new Set(
      place.patterns
        .map((pattern) => pattern.additionalThresholdDays)
        .filter((value) => value != null && value !== 0)
        .map((value) => (value > 0 ? 'saltier' : 'fresher')),
    )
    const hasReversals = place.patterns.some((pattern) => (pattern.sustainedReversals ?? 0) > 0)
    const signals = new Set([...directions, ...thresholdDirections])
    place.trend =
      hasReversals || signals.size > 1
        ? 'flipping'
        : signals.has('saltier')
          ? 'saltier'
          : signals.has('fresher')
            ? 'fresher'
            : 'unclear'
  }
}

let outputScenarios = Object.fromEntries(
  Object.entries(scenarios).map(([key, scenario]) => [
    key,
    { ...scenario, places: Object.values(scenario.places) },
  ]),
)
let sourceRecordCount = shortlist.length

if (mergeScenarioKey) {
  const existing = JSON.parse(await readFile(resolve(outputPath), 'utf8'))
  const previousScenarioCount =
    existing.scenarios[mergeScenarioKey]?.places.reduce(
      (count, place) => count + place.patterns.length,
      0,
    ) ?? 0
  outputScenarios = {
    ...existing.scenarios,
    [mergeScenarioKey]: outputScenarios[mergeScenarioKey],
  }
  sourceRecordCount = existing.sourceRecordCount - previousScenarioCount + shortlist.length
}

const output = {
  generatedAt: new Date().toISOString(),
  sourceRecordCount,
  scenarios: outputScenarios,
}

const destination = resolve(outputPath)
await mkdir(dirname(destination), { recursive: true })
await writeFile(destination, `${JSON.stringify(output, null, 2)}\n`)
console.log(`Wrote ${shortlist.length} patterns to ${destination}`)
