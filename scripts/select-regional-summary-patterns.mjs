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

function comparisonKey(pattern) {
  const typeLabel = pattern.pattern_type || pattern.candidate_type || ''
  return [
    pattern.geo_scale,
    pattern.geo_id,
    typeLabel,
    pattern.direction,
    pattern.candidate_type || '',
  ].join('|')
}

function csvValue(value) {
  const serialized = Array.isArray(value)
    ? JSON.stringify(value)
    : value == null
      ? ''
      : String(value)
  return /[",\r\n]/.test(serialized) ? `"${serialized.replaceAll('"', '""')}"` : serialized
}

const [ecoMachineCsvPath, patternsPath, decisionsPath, outputPath, preservedPatternsArgument] =
  process.argv.slice(2)
const preservedPatternsPath =
  preservedPatternsArgument ?? 'public/data/regional-summary/raw/north-franks-tract-patterns.csv'

if (!ecoMachineCsvPath || !patternsPath || !decisionsPath || !outputPath) {
  throw new Error(
    'Usage: node select-regional-summary-patterns.mjs <eco-machine-kept.csv> <patterns.json> <decisions.json> <output.csv>',
  )
}

const [ecoMachineRows, patternData, decisionData, preservedPatterns] = await Promise.all([
  readFile(resolve(ecoMachineCsvPath), 'utf8').then(parseCsv),
  readFile(resolve(patternsPath), 'utf8').then(JSON.parse),
  readFile(resolve(decisionsPath), 'utf8').then(JSON.parse),
  readFile(resolve(preservedPatternsPath), 'utf8').then(parseCsv),
])

const candidates = patternData.curated_candidates
const decisions = decisionData.decisions
const candidateById = new Map(candidates.map((candidate) => [candidate.pattern_id, candidate]))

const ecoMachine = ecoMachineRows.map((row) => candidateById.get(row.pattern_id) ?? row)
const ecoMachineKeys = new Set(ecoMachine.map(comparisonKey))
const excludedBolsterGeographies = new Set([
  'Brannan–Andrus Island junction',
  "Fisherman's Cut–Piper Slough",
  'Franks Tract',
  'Old River at Franks Tract',
  'Prisoners Point–Mandeville Reach',
  'Sacramento River–Sherman Island',
  'Three Mile Slough–Twitchell/False River',
])

const selected = candidates.filter((candidate) => {
  const status = decisions[candidate.pattern_id]?.status ?? 'unreviewed'

  if (candidate.scenario_key === 'bolster') {
    return status === 'keep' && !excludedBolsterGeographies.has(candidate.geo_id)
  }
  if (candidate.scenario_key === 'newgreen') return ecoMachineKeys.has(comparisonKey(candidate))
  if (candidate.scenario_key === 'reserve') return status !== 'exclude'
  return false
})

selected.push(...ecoMachine)
selected.push(...preservedPatterns)

const scenarioOrder = new Map([
  ['bolster', 0],
  ['ecomachine', 1],
  ['newgreen', 2],
  ['reserve', 3],
])

selected.sort(
  (a, b) =>
    scenarioOrder.get(a.scenario_key) - scenarioOrder.get(b.scenario_key) ||
    String(a.geo_name ?? '').localeCompare(String(b.geo_name ?? '')) ||
    String(a.start_date ?? '').localeCompare(String(b.start_date ?? '')),
)

const headers = [...new Set(selected.flatMap((record) => Object.keys(record)))]
const csv = [
  headers.map(csvValue).join(','),
  ...selected.map((record) => headers.map((header) => csvValue(record[header])).join(',')),
].join('\n')

await mkdir(dirname(resolve(outputPath)), { recursive: true })
await writeFile(resolve(outputPath), `${csv}\n`)

const counts = Object.fromEntries(
  [...scenarioOrder.keys()].map((scenario) => [
    scenario,
    selected.filter((pattern) => pattern.scenario_key === scenario).length,
  ]),
)

console.log(JSON.stringify({ outputPath: resolve(outputPath), counts }, null, 2))
