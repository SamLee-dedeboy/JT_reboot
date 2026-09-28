import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const researchRoot = process.argv[2] ?? 'D:/projects/JT_exploration/RMA/BDSC_regional_summary'
const patternPath = path.join(repoRoot, 'public/data/regional-summary/pattern-list.json')
const outputPath = path.join(researchRoot, 'inputs/regional_label_locations.geojson')
const membershipPath = path.join(
  researchRoot,
  'internal/mapping/delta_outflow_station_review/delta_outflow_station_membership.json',
)
const inventoryPath = path.join(
  researchRoot,
  'internal/mapping/delta_outflow_station_review/station_inventory.json',
)

const dataset = JSON.parse(fs.readFileSync(patternPath, 'utf8'))
const regions = new Map()

for (const [scenarioKey, scenario] of Object.entries(dataset.scenarios)) {
  for (const place of scenario.places) {
    const existing = regions.get(place.id)
    if (existing) {
      existing.properties.scenario_keys.push(scenarioKey)
      existing.properties.scenario_labels.push(scenario.label)
      continue
    }
    regions.set(place.id, {
      type: 'Feature',
      id: place.id,
      properties: {
        region_id: place.id,
        region_name: place.name,
        scenario_keys: [scenarioKey],
        scenario_labels: [scenario.label],
        editing_note: 'Move this point to change the map pin and label location.',
      },
      geometry: {
        type: 'Point',
        coordinates: place.coordinates,
      },
    })
  }
}

const membership = JSON.parse(fs.readFileSync(membershipPath, 'utf8'))
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'))
const stationById = new Map(
  inventory.stations.map((station) => [station.schism_station_index, station]),
)
for (const [regionId, region] of Object.entries(membership.regions)) {
  if (regions.has(regionId)) continue
  const stations = (region.core_station_indices ?? [])
    .map((id) => stationById.get(id))
    .filter(Boolean)
  if (!stations.length) continue
  const coordinates = [
    stations.reduce((sum, station) => sum + station.longitude, 0) / stations.length,
    stations.reduce((sum, station) => sum + station.latitude, 0) / stations.length,
  ]
  regions.set(regionId, {
    type: 'Feature',
    id: regionId,
    properties: {
      region_id: regionId,
      region_name: region.region_name,
      scenario_keys: ['schism_run16_plus30pct_outflow', 'schism_run17_minus10pct_outflow'],
      scenario_labels: ['Increase Delta Outflow (+30%)', 'Decrease Delta Outflow (−10%)'],
      editing_note:
        'Initial point is the centroid of reviewed SCHISM core stations. Move it to change the future map pin and label location.',
    },
    geometry: { type: 'Point', coordinates },
  })
}

const geojson = {
  type: 'FeatureCollection',
  name: 'Regional summary label locations',
  metadata: {
    coordinate_order: '[longitude, latitude]',
    usage:
      'Edit Point coordinates only. The regional-summary runtime synchronizer reads this file as the authoritative label-location source.',
    feature_count: regions.size,
  },
  features: [...regions.values()].sort((a, b) =>
    a.properties.region_name.localeCompare(b.properties.region_name),
  ),
}

fs.writeFileSync(outputPath, `${JSON.stringify(geojson, null, 2)}\n`)
console.log(`Wrote ${regions.size} editable regional label locations to ${outputPath}`)
