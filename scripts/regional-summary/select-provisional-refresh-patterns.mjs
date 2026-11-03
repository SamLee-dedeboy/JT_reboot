// Reviews the October 2026 named-region refresh against the rules behind the hand-approved
// patterns, then writes the survivors to the provisional runtime file and every decision to a
// ledger beside the analysis. Nothing here is user approved; the page labels it PROVISIONAL.
import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const researchRoot = process.argv[2] ?? 'D:/projects/JT_exploration/RMA/BDSC_regional_summary'
const refreshDir = path.join(researchRoot, 'internal/analysis/regional_pattern_refresh_2026-10-29')
const patternDir = path.join(repoRoot, 'public/data/patterns')

// The weakest values among the approved patterns the public page shows.
const MIN_DURATION_DAYS = 17
const MIN_STATION_AGREEMENT = 0.787
const MIN_DIFFERENCE_EC = 50
const MIN_DIFFERENCE_PCT = 2

// Corridors have no reviewed polygon, and the approved outflow set left them out too.
const siteRegionIds = {
  lindsey_cache_slough: 'lindsey_cache_slough',
  suisun_marsh: 'suisun_marsh',
  montezuma_slough: 'montezuma_slough',
  suisun_bay: 'suisun_bay',
  confluence_zone: 'confluence_zone',
  central_delta: 'central_delta',
  south_delta: 'southern_delta',
  franks_tract: 'franks_tract',
  north_franks_tract: 'north_franks_tract',
  freshwater_corridor: 'bf_freshwater_pathway',
  clifton_court_forebay: 'clifton_court_forebay',
}

// Each scenario keeps the regions of its approved set. A Tunnel has none to follow.
const estuaryRegions = ['suisun_marsh', 'montezuma_slough', 'suisun_bay', 'confluence_zone']
const handpickedRegions = {
  reserve: new Set(['lindsey_cache_slough', ...estuaryRegions]),
  ecomachine: new Set(estuaryRegions),
  newgreen: new Set(estuaryRegions),
  bolster: new Set([
    'franks_tract',
    'north_franks_tract',
    'freshwater_corridor',
    'clifton_court_forebay',
  ]),
}

const releases = JSON.parse(
  fs.readFileSync(
    path.join(repoRoot, 'public/data/operations/calling-on-reserves-release-schedule.json'),
    'utf8',
  ),
).moreThanBau
const lastReleaseEnd = releases.at(-1).endDate

const overlapsRelease = ({ start_date: start, end_date: end }) =>
  releases.some(({ startDate, endDate }) => start <= endDate && end >= startDate)
const startsDuringOrAfterRelease = ({ start_date: start }) =>
  start > lastReleaseEnd ||
  releases.some(({ startDate, endDate }) => start >= startDate && start <= endDate)

function rejection(pattern) {
  const region = siteRegionIds[pattern.geo_id]
  if (!region) return 'region has no reviewed polygon on the site'
  if (pattern.calendar_duration_days < MIN_DURATION_DAYS) {
    return `shorter than ${MIN_DURATION_DAYS} days`
  }
  if (pattern.avg_station_agreement < MIN_STATION_AGREEMENT) {
    return `station agreement below ${MIN_STATION_AGREEMENT}`
  }
  if (Math.abs(pattern.avg_absolute_difference) < MIN_DIFFERENCE_EC) {
    return `difference below ${MIN_DIFFERENCE_EC} uS/cm`
  }
  if (Math.abs(pattern.avg_percent_difference) < MIN_DIFFERENCE_PCT) {
    return `difference below ${MIN_DIFFERENCE_PCT}%`
  }
  if (handpickedRegions[pattern.scenario_key]?.has(pattern.geo_id) === false) {
    return `region not in the approved ${pattern.scenario_label} set`
  }
  if (pattern.scenario_key === 'reserve') {
    if (pattern.direction === 'saltier' && startsDuringOrAfterRelease(pattern)) {
      return 'saltier during or after a release'
    }
    if (pattern.direction === 'fresher' && !overlapsRelease(pattern)) {
      return 'fresher without overlapping a release'
    }
  }
  return null
}

const trend = (patterns) => {
  const directions = new Set(patterns.map(({ direction }) => direction))
  if (directions.size > 1) return 'flipping'
  return directions.values().next().value ?? 'unclear'
}

const provisionalNote = (pattern) =>
  `Provisional selection from ${pattern.analysis_provenance}; passes the approved-pattern rules but has not been reviewed by the team.`

function runtimePattern(pattern) {
  return {
    id: pattern.pattern_id,
    candidateType: 'provisional_curated_pattern',
    direction: pattern.direction,
    patternType: pattern.pattern_type,
    startDate: pattern.start_date,
    endDate: pattern.end_date,
    durationDays: pattern.calendar_duration_days,
    qualifyingDays: pattern.n_qualifying_days,
    baselineEc: pattern.avg_baseline_value,
    scenarioEc: pattern.avg_scenario_value,
    differenceEc: pattern.avg_absolute_difference,
    differencePct: pattern.avg_percent_difference,
    stationCount: pattern.station_count,
    stationAgreement: pattern.avg_station_agreement,
    stationCoverage: pattern.station_coverage,
    thresholdEc: null,
    additionalThresholdDays: null,
    sustainedReversals: null,
    reversalsPerYear: null,
    reviewStatus: 'provisional',
    reviewNote: provisionalNote(pattern),
    proposedDisplayRegion: pattern.geo_name,
    broaderStoryGroup: pattern.broader_story_group,
    analysisProvenance: pattern.analysis_provenance,
  }
}

// The refresh left out Bolster & Fortify's focal regions; run_bf_focal_slr.py adds them.
const candidates = ['review_patterns.json', 'runs/slr__bolster_focal/patterns.json'].flatMap(
  (file) => JSON.parse(fs.readFileSync(path.join(refreshDir, file), 'utf8')),
)
const approved = JSON.parse(fs.readFileSync(path.join(patternDir, 'pattern-list.json'), 'utf8'))
const approvedPlaces = new Map(
  Object.values(approved.scenarios)
    .flatMap(({ places }) => places)
    .map((place) => [place.id, place]),
)

const reviewed = candidates.map((pattern) => ({ pattern, reason: rejection(pattern) }))
const scenarios = {}
for (const { pattern, reason } of reviewed) {
  const key = `provisional_${pattern.climate_condition}_${pattern.scenario_key}`
  scenarios[key] ??= { label: pattern.scenario_label, places: [] }
  if (reason) continue
  const placeId = siteRegionIds[pattern.geo_id]
  let place = scenarios[key].places.find(({ id }) => id === placeId)
  if (!place) {
    const { patterns: _patterns, trend: _trend, ...region } = approvedPlaces.get(placeId)
    place = { ...region, patterns: [] }
    scenarios[key].places.push(place)
  }
  place.patterns.push({ ...runtimePattern(pattern), proposedDisplayRegion: place.name })
}

for (const [key, scenario] of Object.entries(scenarios)) {
  for (const place of scenario.places) {
    place.trend = trend(place.patterns)
    place.patterns.sort((left, right) => left.startDate.localeCompare(right.startDate))
    for (let index = 1; index < place.patterns.length; index += 1) {
      const previous = place.patterns[index - 1]
      const next = place.patterns[index]
      if (next.startDate <= previous.endDate) {
        throw new Error(`${key} ${place.id}: ${previous.id} overlaps ${next.id}`)
      }
    }
  }
  const count = scenario.places.flatMap(({ patterns }) => patterns).length
  console.log(`${key}: ${count} patterns in ${scenario.places.length} regions`)
}

fs.writeFileSync(
  path.join(patternDir, 'pattern-list-provisional.json'),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      sourceRecordCount: candidates.length,
      status: 'provisional; not reviewed by the team',
      scenarios,
    },
    null,
    2,
  )}\n`,
)

const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
const columns = [
  'pattern_id',
  'run_id',
  'geo_name',
  'direction',
  'start_date',
  'end_date',
  'calendar_duration_days',
  'avg_absolute_difference',
  'avg_percent_difference',
  'avg_station_agreement',
]
const ledger = [
  [...columns, 'decision', 'reason'].map(quote).join(','),
  ...reviewed.map(({ pattern, reason }) =>
    [...columns.map((column) => pattern[column]), reason ? 'reject' : 'provisional', reason]
      .map(quote)
      .join(','),
  ),
]
fs.writeFileSync(path.join(refreshDir, 'provisional_review.csv'), `${ledger.join('\n')}\n`)
console.log(`Reviewed ${candidates.length} candidates.`)
