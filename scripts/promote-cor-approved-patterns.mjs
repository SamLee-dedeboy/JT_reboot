import fs from 'node:fs'
import path from 'node:path'

const repoRoot = path.resolve(import.meta.dirname, '..')
const runtimePath = path.join(repoRoot, 'public/data/regional-summary/pattern-list.json')
const approvedLedger = process.argv[2]

const releases = [
  { id: 'release-1', start: '2019-01-01', end: '2019-02-28' },
  { id: 'release-2', start: '2019-12-01', end: '2020-01-31' },
]

const regions = {
  lindsey_cache_slough: {
    name: 'Lindsey–Cache Slough',
    prefix: 'LCS',
    coordinates: [-121.68, 38.23],
    stationCount: 24,
  },
  suisun_marsh: {
    name: 'Suisun Marsh',
    prefix: 'SM',
    coordinates: [-122.05, 38.18],
    stationCount: 12,
  },
  montezuma_slough: {
    name: 'Montezuma Slough',
    prefix: 'MS',
    coordinates: [-121.92, 38.13],
    stationCount: 8,
  },
  suisun_bay: { name: 'Suisun Bay', prefix: 'SB', coordinates: [-122.05, 38.06], stationCount: 17 },
  confluence_zone: {
    name: 'Confluence Zone',
    prefix: 'CZ',
    coordinates: [-121.82, 38.05],
    stationCount: 24,
  },
}

const all = {
  lindsey_cache_slough: [
    ['fresher', '2018-10-07', '2018-10-21', 205.3, 165.3],
    ['saltier', '2018-11-13', '2018-11-19', 163.7, 192.1],
    ['saltier', '2018-12-15', '2019-01-13', 296.7, 346.5],
    ['fresher', '2019-01-31', '2019-02-20', 363.1, 277.9],
    ['fresher', '2019-02-24', '2019-03-05', 242.2, 199.7],
    ['fresher', '2019-03-18', '2019-04-04', 260.0, 192.9],
    ['saltier', '2019-04-12', '2019-04-22', 181.3, 231.3],
    ['fresher', '2019-04-26', '2019-07-31', 263.9, 180.6],
    ['fresher', '2019-08-30', '2019-11-09', 216.1, 130.9],
    ['fresher', '2019-12-03', '2020-06-05', 316.8, 193.0],
  ],
  suisun_marsh: [
    ['saltier', '2018-10-07', '2019-01-07', 12767.3, 15562.1],
    ['fresher', '2019-01-14', '2019-03-08', 2416.8, 1744.0],
    ['fresher', '2019-03-19', '2019-04-03', 420.7, 349.1],
    ['saltier', '2019-04-14', '2019-05-15', 317.9, 485.9],
    ['saltier', '2019-05-21', '2019-07-20', 1262.8, 2070.0],
    ['saltier', '2019-07-31', '2019-12-23', 7556.7, 12376.8],
    ['fresher', '2019-12-27', '2020-01-28', 8273.7, 6645.7],
    ['saltier', '2020-02-11', '2020-07-31', 7597.1, 8808.5],
    ['fresher', '2020-08-06', '2020-09-17', 16931.1, 16279.4],
    ['saltier', '2020-09-24', '2020-11-29', 15031.8, 16642.5],
  ],
  montezuma_slough: [
    ['saltier', '2018-10-07', '2019-01-05', 8729.1, 11041.3],
    ['fresher', '2019-01-07', '2019-01-27', 2952.8, 1602.1],
    ['fresher', '2019-01-31', '2019-03-04', 533.3, 333.6],
    ['fresher', '2019-03-29', '2019-04-04', 193.5, 172.3],
    ['saltier', '2019-04-12', '2019-05-11', 138.2, 196.3],
    ['saltier', '2019-05-23', '2019-07-24', 920.2, 1360.6],
    ['saltier', '2019-07-29', '2019-12-19', 5146.8, 9266.0],
    ['fresher', '2019-12-27', '2020-01-23', 5325.0, 3752.4],
    ['saltier', '2020-01-26', '2020-05-17', 2837.0, 4084.2],
    ['saltier', '2020-05-26', '2020-07-28', 7968.4, 8498.3],
    ['fresher', '2020-08-10', '2020-09-12', 14581.7, 13849.8],
    ['saltier', '2020-09-15', '2020-11-29', 10530.1, 12212.3],
  ],
  suisun_bay: [
    ['saltier', '2018-10-07', '2019-01-03', 18975.3, 22102.2],
    ['fresher', '2019-01-05', '2019-01-25', 10622.4, 6244.7],
    ['fresher', '2019-01-30', '2019-03-04', 1473.0, 513.9],
    ['fresher', '2019-03-19', '2019-04-04', 410.6, 225.0],
    ['saltier', '2019-04-07', '2019-05-11', 531.9, 1059.9],
    ['saltier', '2019-05-20', '2019-07-07', 1855.7, 3519.6],
    ['fresher', '2019-07-09', '2019-07-30', 8046.7, 7825.9],
    ['saltier', '2019-08-01', '2019-12-14', 10198.9, 16014.5],
    ['fresher', '2019-12-17', '2020-01-22', 10988.7, 7693.0],
    ['saltier', '2020-01-24', '2020-05-11', 10216.6, 13031.7],
    ['fresher', '2020-05-13', '2020-05-22', 14206.1, 13739.5],
    ['saltier', '2020-05-23', '2020-07-22', 14573.8, 15280.6],
    ['fresher', '2020-07-25', '2020-09-10', 19714.4, 18744.8],
    ['saltier', '2020-09-11', '2020-11-29', 20760.8, 22595.9],
  ],
  confluence_zone: [
    ['saltier', '2018-10-07', '2019-01-03', 3953.9, 5339.0],
    ['fresher', '2019-01-05', '2019-01-22', 1545.3, 800.8],
    ['fresher', '2019-03-14', '2019-04-13', 155.2, 135.1],
    ['fresher', '2019-05-06', '2019-05-19', 131.4, 117.0],
    ['saltier', '2019-06-08', '2019-06-28', 115.8, 172.2],
    ['fresher', '2019-07-16', '2019-07-26', 784.1, 717.6],
    ['saltier', '2019-08-02', '2019-12-12', 991.3, 2389.9],
    ['fresher', '2019-12-22', '2020-01-19', 1151.1, 617.8],
    ['saltier', '2020-01-22', '2020-05-08', 975.2, 1543.8],
    ['fresher', '2020-05-11', '2020-05-22', 1878.7, 1658.1],
    ['saltier', '2020-05-24', '2020-07-16', 1899.2, 2107.1],
    ['fresher', '2020-07-23', '2020-09-08', 4070.6, 3596.9],
    ['saltier', '2020-09-10', '2020-11-29', 4837.3, 5904.8],
  ],
}

const keep = new Set([
  'COR-LCS-10',
  ...[1, 2, 5, 6, 7, 8, 10].map((n) => `COR-SM-${String(n).padStart(2, '0')}`),
  ...[1, 2, 7, 8, 9, 12].map((n) => `COR-MS-${String(n).padStart(2, '0')}`),
  ...[1, 2, 3, 6, 8, 9, 10, 14].map((n) => `COR-SB-${String(n).padStart(2, '0')}`),
  ...[1, 2, 7, 8, 9, 13].map((n) => `COR-CZ-${String(n).padStart(2, '0')}`),
])

const olderAndClaude = new Set([
  'COR-LCS-10',
  'COR-SM-06',
  'COR-SM-07',
  'COR-MS-07',
  'COR-MS-08',
  'COR-SB-02',
  'COR-SB-08',
])

function releaseTiming(start, end) {
  const r1 = releases[0],
    r2 = releases[1]
  if (start < r1.start && end >= r1.start)
    return ['Before and into potential release 1', ['release-1']]
  if (start >= r1.start && end <= r1.end) return ['During potential release 1', ['release-1']]
  if (start <= r1.end && end > r1.end)
    return ['During and after potential release 1', ['release-1']]
  if (start > r1.end && end < r2.start) return ['Between potential releases 1 and 2', []]
  if (start < r2.start && end >= r2.start)
    return ['Before and into potential release 2', ['release-2']]
  if (start >= r2.start && end <= r2.end) return ['During potential release 2', ['release-2']]
  if (start <= r2.end && end > r2.end)
    return ['During and after potential release 2', ['release-2']]
  return ['After potential release 2', []]
}

const places = Object.entries(regions).map(([regionId, region]) => {
  const patterns = all[regionId].flatMap((event, index) => {
    const id = `COR-${region.prefix}-${String(index + 1).padStart(2, '0')}`
    if (!keep.has(id)) return []
    const [direction, startDate, endDate, baselineEc, scenarioEc] = event
    const differenceEc = scenarioEc - baselineEc
    const [releaseTimingLabel, relatedReleaseIds] = releaseTiming(startDate, endDate)
    const durationDays = Math.round((Date.parse(endDate) - Date.parse(startDate)) / 86400000) + 1
    return [
      {
        id,
        candidateType: 'user_curated_cor_response',
        direction,
        patternType: 'episode',
        startDate,
        endDate,
        durationDays,
        qualifyingDays: durationDays,
        baselineEc,
        scenarioEc,
        differenceEc: Number(differenceEc.toFixed(3)),
        differencePct: Number(((differenceEc / baselineEc) * 100).toFixed(3)),
        stationCount: region.stationCount,
        stationAgreement: null,
        stationCoverage: 1,
        thresholdEc: null,
        additionalThresholdDays: null,
        sustainedReversals: null,
        reversalsPerYear: null,
        reviewStatus: 'selected',
        reviewNote: `${releaseTimingLabel}. Release windows are provisional month-scale inferences, not confirmed operation dates.`,
        proposedDisplayRegion: region.name,
        broaderStoryGroup: 'Calling on Reserves release chronology',
        releaseTimingLabel,
        relatedReleaseIds,
        analysisProvenance: olderAndClaude.has(id)
          ? 'older exploratory pattern and Claude latest complete-set analysis'
          : 'Claude latest complete-set analysis',
      },
    ]
  })
  const directions = new Set(patterns.map((pattern) => pattern.direction))
  return {
    id: regionId,
    name: region.name,
    coordinates: region.coordinates,
    geographyScale: 'region',
    geometryStatus: 'station_centroid_pending_polygon',
    geometryNote:
      'Uses the reviewed complete station set; a display polygon has not yet been promoted.',
    geometry: null,
    trend: directions.size > 1 ? 'flipping' : [...directions][0],
    patterns,
  }
})

const dataset = JSON.parse(fs.readFileSync(runtimePath, 'utf8'))
dataset.scenarios.reserve = {
  label: 'Calling on Reserves',
  releasePeriods: releases.map((release) => ({ ...release, provisional: true })),
  places,
}
dataset.generatedAt = new Date().toISOString()
dataset.sourceRecordCount = Object.values(dataset.scenarios)
  .flatMap((s) => s.places)
  .reduce((sum, place) => sum + place.patterns.length, 0)
fs.writeFileSync(runtimePath, `${JSON.stringify(dataset, null, 2)}\n`)

if (approvedLedger) {
  const header = [
    'region_id',
    'region_name',
    'scenario_key',
    'scenario_label',
    'pattern_type',
    'period_start',
    'period_end',
    'requested_period_start',
    'requested_period_end',
    'station_set_variant_id',
    'station_set_label',
    'n_stations',
    'included_station_ids',
    'direction',
    'baseline_regional_ec',
    'scenario_regional_ec',
    'avg_ec_difference',
    'avg_percent_difference',
    'median_station_difference',
    'n_qualifying_days',
    'calendar_duration_days',
    'avg_station_agreement_fraction',
    'min_daily_station_agreement',
    'n_agreeing',
    'n_disagreeing',
    'display_finding',
    'approved_date',
    'approved_by',
    'notes',
  ]
  const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const existing = fs.readFileSync(approvedLedger, 'utf8').trimEnd().split(/\r?\n/)
  const existingText = existing.join('\n')
  const rows = []
  for (const place of places)
    for (const pattern of place.patterns) {
      if (existingText.includes(`"${pattern.id}"`) || existingText.includes(pattern.id)) continue
      const values = {
        region_id: place.id,
        region_name: place.name,
        scenario_key: 'reserve',
        scenario_label: 'Calling on Reserves',
        pattern_type: 'episode',
        period_start: pattern.startDate,
        period_end: pattern.endDate,
        requested_period_start: pattern.startDate,
        requested_period_end: pattern.endDate,
        station_set_variant_id: 'complete_reviewed_set',
        station_set_label: `Complete reviewed station set (${pattern.stationCount})`,
        n_stations: pattern.stationCount,
        included_station_ids: '',
        direction: pattern.direction,
        baseline_regional_ec: pattern.baselineEc,
        scenario_regional_ec: pattern.scenarioEc,
        avg_ec_difference: pattern.differenceEc,
        avg_percent_difference: pattern.differencePct,
        median_station_difference: '',
        n_qualifying_days: pattern.qualifyingDays,
        calendar_duration_days: pattern.durationDays,
        avg_station_agreement_fraction: '',
        min_daily_station_agreement: '',
        n_agreeing: '',
        n_disagreeing: '',
        display_finding: `${pattern.id}: ${place.name} was ${pattern.direction} than Business as Usual from ${pattern.startDate} to ${pattern.endDate}.`,
        approved_date: new Date().toISOString().slice(0, 10),
        approved_by: 'user (chat approval)',
        notes: `Pattern ID ${pattern.id}; ${pattern.releaseTimingLabel}; provenance: ${pattern.analysisProvenance}; potential release 1 2019-01-01..2019-02-28; potential release 2 2019-12-01..2020-01-31; release dates provisional.`,
      }
      rows.push(header.map((key) => quote(values[key])).join(','))
    }
  if (rows.length) fs.appendFileSync(approvedLedger, `\n${rows.join('\n')}`)
  console.log(`Added ${rows.length} approved COR patterns to ${approvedLedger}`)
}

console.log(
  `Promoted ${places.reduce((sum, place) => sum + place.patterns.length, 0)} curated COR patterns.`,
)
