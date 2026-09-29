import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dashboard = JSON.parse(
  fs.readFileSync(path.join(root, 'public/data/scenario-explorer/salinity_dashboard.json'), 'utf8'),
)
const patternList = JSON.parse(
  fs.readFileSync(path.join(root, 'public/data/regional-summary/pattern-list.json'), 'utf8'),
)

const scenarioData = new Map(
  Object.values(dashboard.scenarios).map((scenario) => [scenario.key, scenario]),
)
const dateIndex = new Map(dashboard.dates.map((date, index) => [date, index]))
const round = (value) => Math.round(value * 1000) / 1000
const mean = (values) => values.reduce((total, value) => total + value, 0) / values.length
const patterns = {}

for (const [scenarioKey, scenario] of Object.entries(patternList.scenarios)) {
  const source = scenarioData.get(scenarioKey)
  if (!source) continue

  for (const place of scenario.places) {
    for (const pattern of place.patterns) {
      const start = dateIndex.get(pattern.startDate)
      const end = dateIndex.get(pattern.endDate)
      if (start == null || end == null) continue

      patterns[pattern.id] = dashboard.stations.map((station, stationIndex) => {
        const baselineValues = dashboard.referenceStationValues[stationIndex].slice(start, end + 1)
        const differenceValues = source.stationValues[stationIndex].slice(start, end + 1)
        const paired = baselineValues
          .map((baseline, index) => ({ baseline, difference: differenceValues[index] }))
          .filter(
            ({ baseline, difference }) => Number.isFinite(baseline) && Number.isFinite(difference),
          )
        const baselineMean = paired.length ? mean(paired.map(({ baseline }) => baseline)) : 0
        const differenceEc = paired.length ? mean(paired.map(({ difference }) => difference)) : 0
        const scenarioMean = baselineMean + differenceEc
        const differencePct = baselineMean === 0 ? null : (differenceEc / baselineMean) * 100
        const direction = differenceEc < 0 ? 'fresher' : 'saltier'

        return {
          stationId: Number(station.station_id),
          name: station.long_name,
          shortName: station.short_name,
          longitude: station.longitude,
          latitude: station.latitude,
          baselineMean: round(baselineMean),
          scenarioMean: round(scenarioMean),
          differenceEc: round(differenceEc),
          differencePct: differencePct == null ? null : round(differencePct),
          direction,
          agreesWithPattern: direction === pattern.direction,
        }
      })
    }
  }
}

const output = path.join(root, 'public/data/regional-summary/pattern-surrounding-stations.json')
fs.writeFileSync(output, JSON.stringify({ patterns }))
console.log(`Wrote ${Object.keys(patterns).length} event station sets to ${output}`)
