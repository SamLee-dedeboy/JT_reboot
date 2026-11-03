// Starts the published Delta outflow patterns at the SCHISM results start, 1 October 2020.
//
// Runs 15-17 have daily output from 11 August 2020, but results are reported from October, so a
// pattern detected earlier is clipped and its values are recomputed over the clipped window. The
// pattern itself is not re-detected: its robustness tests still describe the original window.
//
// Run after promote-delta-outflow-approved-patterns.mjs, which restores the unclipped patterns.
// It reproduces each pattern's published values first and stops if any of them differ.
//
// OUTFLOW-SD-01 is removed rather than clipped: only 17 of its 46 days fall in the results period,
// and 16 of 77 stations disagree with it over those days (3 of 78 before the clip).
import fs from 'node:fs'
import path from 'node:path'

const RESULTS_START = '2020-10-01'
const REMOVED_PATTERNS = new Set(['OUTFLOW-SD-01'])

const repoRoot = process.cwd()
const researchRoot =
  process.argv.slice(2).find((argument) => !argument.startsWith('--')) ??
  'D:/projects/JT_exploration/RMA/BDSC_regional_summary'
const patternDir = path.join(repoRoot, 'public/data/patterns')
const ecDir = path.resolve(researchRoot, '../data/baseline_schism/ec_full_extent_all_stations')
const dryRun = process.argv.includes('--dry-run')

const runs = [
  {
    scenarioKey: 'schism_run16_plus30pct_outflow',
    folder: 'delta_outflow_regional_sensitivity',
    scenarioRun: '16',
  },
  {
    scenarioKey: 'schism_run17_minus10pct_outflow',
    folder: 'delta_outflow_minus10_regional_sensitivity',
    scenarioRun: '17',
  },
]

function parseCsv(text) {
  const rows = []
  let row = []
  let value = ''
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        value += '"'
        index += 1
      } else quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(value)
      value = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(value)
      value = ''
      if (row.some((cell) => cell !== '')) rows.push(row)
      row = []
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

const readCsv = (filePath) => parseCsv(fs.readFileSync(filePath, 'utf8'))
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'))
const finite = (values) => values.filter((value) => Number.isFinite(value))
const mean = (values) => {
  const usable = finite(values)
  return usable.length ? usable.reduce((sum, value) => sum + value, 0) / usable.length : null
}
const numberOrNull = (value) => {
  if (value === '' || value == null) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}
const round = (value, digits = 3) => Number(value.toFixed(digits))

/** Every value the analysis reports for one pattern, from its smoothed regional series. */
function regionalValues(series, startDate, endDate) {
  const indices = series.date.flatMap((date, index) =>
    date >= startDate && date <= endDate ? [index] : [],
  )
  const pick = (values) => indices.map((index) => numberOrNull(values[index]))
  const baseline = pick(series.rolled_baseline_7d)
  const difference = pick(series.rolled_difference_7d)
  return {
    days: indices.length,
    qualifyingDays: indices.filter((index) => String(series.qualifies[index]) === 'true').length,
    baselineEc: mean(baseline),
    scenarioEc: mean(pick(series.rolled_scenario_7d)),
    differenceEc: mean(difference),
    differencePct: mean(difference.map((value, position) => (100 * value) / baseline[position])),
    stationAgreement: mean(pick(series.rolling_agreement_fraction)),
  }
}

const patternListPath = path.join(patternDir, 'pattern-list.json')
const evidencePath = path.join(patternDir, 'pattern-evidence.json')
const seriesPath = path.join(patternDir, 'pattern-ec-series-7d.json')
const patternList = readJson(patternListPath)
const evidence = readJson(evidencePath)
const runtimeSeries = readJson(seriesPath)
const baselineRows = readCsv(path.join(ecDir, 'run_15_EC_daily_mean_full_extent.csv'))
const generatedAt = new Date().toISOString()
const report = []

for (const { scenarioKey } of runs) {
  for (const place of patternList.scenarios[scenarioKey].places) {
    place.patterns = place.patterns.filter(({ id }) => !REMOVED_PATTERNS.has(id))
  }
}
for (const id of REMOVED_PATTERNS) {
  delete evidence.patterns[id]
  delete runtimeSeries[id]
}

for (const { scenarioKey, folder, scenarioRun } of runs) {
  const analysisDir = path.join(researchRoot, 'internal/analysis', folder)
  const candidates = readCsv(path.join(analysisDir, 'pattern_candidates.csv'))
  const sourceSeries = Object.values(
    readJson(path.join(analysisDir, 'regional_ec_series_7d.json')).series,
  )
  const scenarioRows = readCsv(path.join(ecDir, `run_${scenarioRun}_EC_daily_mean_full_extent.csv`))
  const scenarioByDate = new Map(scenarioRows.map((row) => [row.time, row]))
  const stationColumnById = new Map(
    Object.keys(baselineRows[0])
      .filter((column) => column !== 'time')
      .map((column) => [Number(column.split('_', 1)[0]), column]),
  )

  for (const place of patternList.scenarios[scenarioKey].places) {
    for (const pattern of place.patterns) {
      const candidate =
        candidates.find(
          (row) => row.candidate_id === pattern.id && row.is_primary_core_variant === 'True',
        ) ?? candidates.find((row) => row.candidate_id === pattern.id)
      if (!candidate || candidate.start_date >= RESULTS_START) continue
      if (candidate.end_date < RESULTS_START) {
        throw new Error(
          `${pattern.id} ends before ${RESULTS_START}; it needs a decision, not a clip.`,
        )
      }
      const series = sourceSeries.find(
        (row) => row.region_id === place.id && row.variant_id === candidate.variant_id,
      )
      if (!series) throw new Error(`${pattern.id} has no smoothed series.`)
      const original = regionalValues(series, candidate.start_date, candidate.end_date)
      const published = {
        baselineEc: Number(candidate.baseline_ec),
        scenarioEc: Number(candidate.scenario_ec),
        differenceEc: Number(candidate.avg_ec_difference),
        differencePct: Number(candidate.avg_percent_difference),
      }
      for (const [key, value] of Object.entries(published)) {
        if (Math.abs(original[key] - value) > 0.01) {
          throw new Error(`${pattern.id} ${key}: reproduced ${original[key]}, published ${value}.`)
        }
      }

      const clipped = regionalValues(series, RESULTS_START, candidate.end_date)
      Object.assign(pattern, {
        startDate: RESULTS_START,
        durationDays: clipped.days,
        qualifyingDays: clipped.qualifyingDays,
        patternType: clipped.days >= 365 ? 'persistent_condition' : 'episode',
        baselineEc: round(clipped.baselineEc),
        scenarioEc: round(clipped.scenarioEc),
        differenceEc: round(clipped.differenceEc),
        differencePct: round(clipped.differencePct),
        stationAgreement: round(clipped.stationAgreement, 4),
        reviewNote: `${pattern.reviewNote.replace(/ Clipped to results start.*$/, '')} Clipped to results start ${RESULTS_START} from ${candidate.start_date}; values recomputed, robustness tests not rerun.`,
      })

      // Same station averages as the promotion script, over the clipped window.
      const eventRows = baselineRows.filter(
        (row) => row.time >= RESULTS_START && row.time <= candidate.end_date,
      )
      const entry = evidence.patterns[pattern.id]
      entry.eventWindow.startDate = RESULTS_START
      entry.stationEvidence.stations = entry.stationEvidence.stations.flatMap((station) => {
        const column = stationColumnById.get(Number(station.stationId))
        const paired = eventRows.flatMap((row) => {
          const baselineValue = numberOrNull(row[column])
          const scenarioValue = numberOrNull(scenarioByDate.get(row.time)?.[column])
          return baselineValue != null && scenarioValue != null
            ? [{ baselineValue, scenarioValue }]
            : []
        })
        const baselineMean = mean(paired.map(({ baselineValue }) => baselineValue))
        const scenarioMean = mean(paired.map(({ scenarioValue }) => scenarioValue))
        if (baselineMean == null || scenarioMean == null) return []
        const differenceEc = scenarioMean - baselineMean
        return [
          {
            ...station,
            baselineMean: round(baselineMean),
            scenarioMean: round(scenarioMean),
            differenceEc: round(differenceEc),
            differencePct: baselineMean === 0 ? null : round((differenceEc / baselineMean) * 100),
            direction: differenceEc < 0 ? 'fresher' : 'saltier',
            agreesWithPattern:
              pattern.direction === 'fresher' ? differenceEc < 0 : differenceEc >= 0,
          },
        ]
      })
      entry.stationEvidence.stationCount = entry.stationEvidence.stations.length
      entry.narrative.headline = `${pattern.direction === 'fresher' ? 'Fresher' : 'Saltier'} conditions persisted for ${pattern.durationDays} days.`
      entry.narrative.description = `${place.name} averaged ${Math.abs(pattern.differencePct).toFixed(1)}% ${pattern.direction} than the reference outflow run (${Math.round(pattern.baselineEc).toLocaleString()} → ${Math.round(pattern.scenarioEc).toLocaleString()} µS/cm).`

      report.push(
        `${pattern.id}: ${candidate.start_date} → ${RESULTS_START}, ${candidate.calendar_duration_days} → ${clipped.days} days, ${published.differencePct}% → ${pattern.differencePct}%`,
      )
    }
  }

  // Every chart series for this outflow run starts at the results start too.
  for (const place of patternList.scenarios[scenarioKey].places) {
    for (const pattern of place.patterns) {
      const chart = runtimeSeries[pattern.id]
      if (!chart) continue
      const first = chart.dates.findIndex((date) => date >= RESULTS_START)
      if (first <= 0) continue
      for (const key of ['dates', 'baseline', 'scenario', 'scenarioMin', 'scenarioMax']) {
        if (chart[key]) chart[key] = chart[key].slice(first)
      }
    }
  }
}

console.log(report.join('\n'))
console.log(`Clipped ${report.length} patterns to ${RESULTS_START}.`)

if (!dryRun) {
  patternList.generatedAt = generatedAt
  evidence.generatedAt = generatedAt
  fs.writeFileSync(patternListPath, `${JSON.stringify(patternList, null, 2)}\n`)
  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  fs.writeFileSync(seriesPath, `${JSON.stringify(runtimeSeries)}\n`)
}
