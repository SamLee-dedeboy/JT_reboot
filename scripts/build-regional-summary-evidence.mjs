import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = path.join(root, 'public/data/regional-summary')

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

function mean(values) {
  const valid = values.filter(Number.isFinite)
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null
}

function parseIds(value) {
  if (!value) return []
  if (value.startsWith('[')) return JSON.parse(value).map(Number)
  return value.split(';').filter(Boolean).map(Number)
}

function generatedNarrative(pattern, stations) {
  const direction = pattern.direction === 'fresher' ? 'lower' : 'higher'
  const plainDirection = pattern.direction === 'fresher' ? 'fresher' : 'saltier'
  const agreement = stations.length
    ? Math.round(
        (stations.filter((station) => station.agreesWithPattern).length / stations.length) * 100,
      )
    : null
  const amount =
    pattern.differencePct == null ? '' : ` by about ${Math.abs(pattern.differencePct).toFixed(0)}%`
  return {
    headline: `${plainDirection[0].toUpperCase()}${plainDirection.slice(1)} conditions persisted for ${pattern.durationDays ?? 'multiple'} days.`,
    description: `During this event, average salinity was ${direction} than baseline${amount}.${agreement == null ? '' : ` ${agreement}% of included stations changed in the same direction.`}`,
    provenance: 'generated-from-curated-metrics',
    reviewStatus: 'needs-review',
  }
}

const patternList = JSON.parse(await readFile(path.join(dataDir, 'pattern-list.json'), 'utf8'))
const dashboard = JSON.parse(
  await readFile(path.join(root, 'public/data/scenario-explorer/salinity_dashboard.json'), 'utf8'),
)
const selectedRows = parseCsv(
  await readFile(path.join(dataDir, 'raw/selected-patterns.csv'), 'utf8'),
)
const selectedById = new Map(selectedRows.map((row) => [row.pattern_id, row]))
const northGeometry = JSON.parse(
  await readFile(path.join(dataDir, 'raw/north_franks_tract.geojson'), 'utf8'),
)
const northIds = northGeometry.features[0].properties.station_ids.map(Number)
const franksRows = parseCsv(
  await readFile(path.join(dataDir, 'raw/franks-tract-sensitivity.csv'), 'utf8'),
)
const franksIds = parseIds(franksRows.find((row) => row.variant === 'core_9')?.station_ids ?? '')
const cliftonIds = [284, 288, 355, 357, 358, 360, 362, 363, 369]
const scenarioByKey = new Map(dashboard.scenarios.map((scenario) => [scenario.key, scenario]))
const stationIndexById = new Map(
  dashboard.stations.map((station, index) => [Number(station.station_id), index]),
)

function membership(pattern, placeId) {
  const selected = selectedById.get(pattern.id)
  if (selected) {
    const agreeing = parseIds(selected.agreeing_station_ids)
    const disagreeing = parseIds(selected.disagreeing_station_ids)
    const ids = [...new Set([...agreeing, ...disagreeing])]
    if (ids.length) return { ids, source: 'curated-pattern-membership' }
  }
  if (placeId === 'north_franks_tract')
    return { ids: northIds, source: 'reviewed-region-membership' }
  if (placeId === 'franks_tract') return { ids: franksIds, source: 'franks-tract-core-9' }
  if (placeId === 'clifton_court_forebay')
    return { ids: cliftonIds, source: 'curated-region-membership' }
  return { ids: [], source: 'unavailable' }
}

const output = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  simulation: {
    startDate: dashboard.startDate,
    endDate: dashboard.dates.at(-1),
    metric: dashboard.metric,
    units: dashboard.units,
  },
  scenarios: {},
  patterns: {},
}

for (const [scenarioKey, scenarioGroup] of Object.entries(patternList.scenarios)) {
  const scenario = scenarioByKey.get(scenarioKey)
  output.scenarios[scenarioKey] = {
    label: scenarioGroup.label,
    regionOrder: scenarioGroup.places.map((place) => place.id),
    annotations:
      scenarioKey === 'bolster'
        ? [
            {
              id: 'gates-closed-2018',
              startDate: '2018-10-17',
              endDate: '2018-12-15',
              label: 'Operable gates closed',
              description:
                'Illustrative operating window aligned to the shortlisted North Franks Tract response.',
              provenance: 'generated-placeholder',
              reviewStatus: 'needs-review',
            },
            {
              id: 'gates-closed-2019',
              startDate: '2019-01-01',
              endDate: '2019-03-01',
              label: 'Operable gates closed',
              description:
                'Illustrative operating window aligned to the shortlisted North Franks Tract response.',
              provenance: 'generated-placeholder',
              reviewStatus: 'needs-review',
            },
            {
              id: 'gates-closed-2020',
              startDate: '2020-09-30',
              endDate: '2020-11-28',
              label: 'Operable gates closed',
              description:
                'Illustrative operating window aligned to the shortlisted North Franks Tract response.',
              provenance: 'generated-placeholder',
              reviewStatus: 'needs-review',
            },
          ]
        : [],
  }
  if (!scenario) continue

  for (const place of scenarioGroup.places) {
    for (const pattern of place.patterns.filter(
      (candidate) => candidate.startDate && candidate.endDate,
    )) {
      const member = membership(pattern, place.id)
      const startIndex = dashboard.dates.indexOf(pattern.startDate)
      const endIndex = dashboard.dates.indexOf(pattern.endDate)
      const stations = member.ids.flatMap((stationId) => {
        const stationIndex = stationIndexById.get(stationId)
        if (stationIndex == null || startIndex < 0 || endIndex < 0) return []
        const baseline = []
        const scenarioValues = []
        const differences = []
        for (let dateIndex = startIndex; dateIndex <= endIndex; dateIndex += 1) {
          const baselineValue = dashboard.referenceStationValues[stationIndex]?.[dateIndex]
          const difference = scenario.stationValues[stationIndex]?.[dateIndex]
          if (!Number.isFinite(baselineValue) || !Number.isFinite(difference)) continue
          baseline.push(baselineValue)
          differences.push(difference)
          scenarioValues.push(baselineValue + difference)
        }
        const baselineMean = mean(baseline)
        const scenarioMean = mean(scenarioValues)
        const differenceEc = mean(differences)
        if (baselineMean == null || scenarioMean == null || differenceEc == null) return []
        const station = dashboard.stations[stationIndex]
        return [
          {
            stationId,
            name: station.long_name,
            shortName: station.short_name,
            longitude: station.longitude,
            latitude: station.latitude,
            baselineMean: Number(baselineMean.toFixed(3)),
            scenarioMean: Number(scenarioMean.toFixed(3)),
            differenceEc: Number(differenceEc.toFixed(3)),
            differencePct:
              baselineMean === 0 ? null : Number(((differenceEc / baselineMean) * 100).toFixed(3)),
            direction: differenceEc < 0 ? 'fresher' : 'saltier',
            agreesWithPattern:
              pattern.direction === 'fresher' ? differenceEc < 0 : differenceEc >= 0,
          },
        ]
      })
      output.patterns[pattern.id] = {
        patternId: pattern.id,
        scenarioKey,
        regionId: place.id,
        regionName: place.name,
        eventWindow: { startDate: pattern.startDate, endDate: pattern.endDate },
        stationEvidence: {
          provenance: 'derived-from-scenario-explorer-daily-stations',
          membershipSource: member.source,
          stationCount: stations.length,
          stations,
        },
        narrative: generatedNarrative(pattern, stations),
      }
    }
  }
}

await writeFile(
  path.join(dataDir, 'pattern-evidence.json'),
  `${JSON.stringify(output, null, 2)}\n`,
  'utf8',
)
console.log(`Wrote ${Object.keys(output.patterns).length} pattern evidence records.`)
