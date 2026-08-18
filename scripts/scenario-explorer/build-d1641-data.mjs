import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const sourceDir =
  process.argv[2] ?? path.resolve('..', 'JT_exploration', 'RMA', 'data', 'processed', 'd1641_rma')
const outputPath = path.resolve(
  process.argv[3] ?? path.join('public', 'data', 'scenario-explorer', 'd1641_rma.json'),
)

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
      } else {
        quoted = !quoted
      }
    } else if (character === ',' && !quoted) {
      row.push(value)
      value = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(value)
      if (row.some(Boolean)) rows.push(row)
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

const addDays = (date, days) => {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

const [intervalRows, mappingRows, evaluationRows, displayRows] = await Promise.all([
  readFile(path.join(sourceDir, 'rma_d1641_exceedance_intervals.csv'), 'utf8').then(parseCsv),
  readFile(path.join(sourceDir, 'rma_d1641_station_mapping.csv'), 'utf8').then(parseCsv),
  readFile(path.join(sourceDir, 'rma_d1641_metric_evaluations.csv'), 'utf8').then(parseCsv),
  readFile(path.join(sourceDir, 'rma_d1641_display_metrics.csv'), 'utf8').then(parseCsv),
])

const regulationsByStation = {}
for (const row of evaluationRows.filter((item) => item.scenario === 'baseline')) {
  const regulations = (regulationsByStation[row.station_id] ??= [])
  const previous = regulations[regulations.length - 1]
  const signature = `${row.objective}|${row.metric}|${row.window_days}|${row.threshold_us_cm}`
  if (previous?.signature === signature && addDays(previous.end, 1) === row.evaluation_date) {
    previous.end = row.evaluation_date
  } else
    regulations.push({
      signature,
      objective: row.objective,
      metric: row.metric,
      windowDays: row.window_days,
      threshold: Number(row.threshold_us_cm),
      start: row.evaluation_date,
      end: row.evaluation_date,
    })
}

const scenarios = {}
for (const mapping of mappingRows) {
  const scenario = (scenarios[mapping.scenario] ??= { stations: {} })
  scenario.stations[mapping.rma_station_number] = {
    d1641Id: mapping.d1641_station_id,
    fullName: mapping.rma_station_name,
    regulations: (regulationsByStation[mapping.d1641_station_id] ?? []).map(
      ({ signature, ...regulation }) => regulation,
    ),
    judgments: {},
    metrics: {},
    objectives: [],
  }
}

for (const row of intervalRows) {
  const stationNumber = mappingRows.find(
    (mapping) => mapping.scenario === row.scenario && mapping.d1641_station_id === row.station_id,
  )?.rma_station_number
  if (!stationNumber) continue
  const station = scenarios[row.scenario]?.stations[stationNumber]
  if (!station) continue
  station.objectives.push({
    objective: row.objective,
    status: row.status,
    ...(row.start_date ? { start: row.start_date, end: row.end_date } : {}),
  })
}

for (const row of evaluationRows) {
  if (row.exceeded !== 'True' || row.data_status !== 'complete') continue
  const stationNumber = mappingRows.find(
    (mapping) => mapping.scenario === row.scenario && mapping.d1641_station_id === row.station_id,
  )?.rma_station_number
  const station = scenarios[row.scenario]?.stations[stationNumber]
  if (!station) continue
  const windowDays = Number(row.window_days)
  const start = Number.isFinite(windowDays)
    ? addDays(row.evaluation_date, -(windowDays - 1))
    : `${row.evaluation_date.slice(0, 7)}-01`
  const value = Number(row.calculated_value_us_cm)
  const threshold = Number(row.threshold_us_cm)
  for (let date = start; date <= row.evaluation_date; date = addDays(date, 1)) {
    const existing = station.judgments[date]
    if (!existing || value / threshold > existing.value / existing.threshold) {
      station.judgments[date] = {
        objective: row.objective,
        metric: row.metric,
        windowDays: row.window_days,
        value,
        threshold,
        evaluationDate: row.evaluation_date,
      }
    }
  }
}

for (const row of displayRows) {
  if (row.data_status !== 'complete' || !row.calculated_value_us_cm) continue
  const stationNumber = mappingRows.find(
    (mapping) => mapping.scenario === row.scenario && mapping.d1641_station_id === row.station_id,
  )?.rma_station_number
  const station = scenarios[row.scenario]?.stations[stationNumber]
  if (!station) continue
  const regulation = station.regulations.find(
    (item) => item.objective === row.objective && row.date >= item.start && row.date <= item.end,
  )
  const candidate = {
    objective: row.objective,
    metric: row.metric,
    windowDays: row.window_days,
    value: Number(row.calculated_value_us_cm),
    ...(regulation ? { threshold: regulation.threshold } : {}),
  }
  const existing = station.metrics[row.date]
  if (!existing || (regulation && existing.threshold == null)) station.metrics[row.date] = candidate
}

await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      source: 'California State Water Resources Control Board Decision 1641',
      generatedFrom: 'RMA/data/processed/d1641_rma',
      scenarios,
    },
    null,
    2,
  )}\n`,
)

console.log(`Wrote ${outputPath}`)
