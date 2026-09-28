import fs from 'node:fs'

const ledgerPath =
  process.argv[2] ??
  'D:/projects/JT_exploration/RMA/BDSC_regional_summary/internal/analysis/bdsc-preparation/approved_patterns.csv'

const removedPatternIds = new Set([
  'COR-SM-08',
  'COR-SM-10',
  'COR-MS-09',
  'COR-MS-12',
  'COR-SB-10',
  'COR-SB-14',
  'COR-CZ-09',
  'COR-CZ-13',
])

function parseCsv(text) {
  const records = []
  let record = []
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
      record.push(value)
      value = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      record.push(value)
      if (record.some((cell) => cell !== '')) records.push(record)
      record = []
      value = ''
    } else value += character
  }
  if (value || record.length) {
    record.push(value)
    records.push(record)
  }
  return records
}

const quote = (value) => `"${String(value).replaceAll('"', '""')}"`
const records = parseCsv(fs.readFileSync(ledgerPath, 'utf8'))
const [headers, ...rows] = records
const notesIndex = headers.findIndex((header) => header.replace(/^\uFEFF/, '') === 'notes')
const keptRows = rows.filter((row) => {
  const patternId = row[notesIndex]?.match(/Pattern ID\s+([A-Z0-9-]+)/i)?.[1]
  return !removedPatternIds.has(patternId)
})
const removedCount = rows.length - keptRows.length

if (removedCount !== removedPatternIds.size) {
  throw new Error(
    `Expected to remove ${removedPatternIds.size} patterns, but matched ${removedCount}.`,
  )
}

fs.writeFileSync(
  ledgerPath,
  `${[headers, ...keptRows].map((row) => row.map(quote).join(',')).join('\n')}\n`,
)
console.log(`Removed ${removedCount} saltier during/after-release COR patterns.`)
