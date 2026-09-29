import fs from 'node:fs'
import path from 'node:path'

const researchRoot = process.argv[2] ?? 'D:/projects/JT_exploration/RMA/BDSC_regional_summary'
const inventoryPath = path.join(
  researchRoot,
  'internal/mapping/delta_outflow_station_review/station_inventory.json',
)
const membershipPath = path.join(
  researchRoot,
  'internal/mapping/delta_outflow_station_review/delta_outflow_station_membership.json',
)
const outputPath = path.join(researchRoot, 'inputs/stations/schism_modeled_stations_405.geojson')

const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'))
const membership = JSON.parse(fs.readFileSync(membershipPath, 'utf8'))

const membershipsByStation = new Map()
const addMembership = (stationId, regionId, membershipClass, groupId = null) => {
  const records = membershipsByStation.get(stationId) ?? []
  records.push({ region_id: regionId, membership_class: membershipClass, group_id: groupId })
  membershipsByStation.set(stationId, records)
}

for (const [regionId, region] of Object.entries(membership.regions)) {
  for (const stationId of region.core_station_indices ?? []) {
    addMembership(stationId, regionId, 'core')
  }
  for (const [groupId, stationIds] of Object.entries(region.questionable_station_groups ?? {})) {
    for (const stationId of stationIds) addMembership(stationId, regionId, 'questionable', groupId)
  }
  for (const stationId of region.excluded_station_indices ?? []) {
    addMembership(stationId, regionId, 'excluded')
  }
  for (const stationId of region.removed_station_indices ?? []) {
    addMembership(stationId, regionId, 'removed')
  }
}

const features = inventory.stations.map((station) => {
  const stationMemberships = membershipsByStation.get(station.schism_station_index) ?? []
  return {
    type: 'Feature',
    id: station.schism_station_index,
    properties: {
      schism_station_index: station.schism_station_index,
      schism_short_name: station.schism_short_name,
      station_name: station.station_name,
      layer: station.layer,
      x_utm10: station.x_utm10,
      y_utm10: station.y_utm10,
      z: station.z,
      schism_cluster: station.schism_cluster,
      nearest_rma_station_number: station.nearest_rma_station_number,
      nearest_rma_station_name: station.nearest_rma_station_name,
      nearest_rma_distance_m: station.nearest_rma_distance_m,
      reviewed_region_ids: [...new Set(stationMemberships.map((record) => record.region_id))],
      reviewed_region_memberships: stationMemberships,
    },
    geometry: {
      type: 'Point',
      coordinates: [station.longitude, station.latitude],
    },
  }
})

const ids = features.map((feature) => feature.properties.schism_station_index)
if (
  features.length !== 405 ||
  new Set(ids).size !== 405 ||
  Math.min(...ids) !== 1 ||
  Math.max(...ids) !== 405
) {
  throw new Error('Expected exactly 405 unique SCHISM station indices spanning 1..405.')
}

const geojson = {
  type: 'FeatureCollection',
  name: 'SCHISM modeled stations (405)',
  metadata: {
    station_id_field: 'schism_station_index',
    station_id_definition: '1-based SCHISM station.in order; not an RMA station number.',
    nearest_rma_id_field: 'nearest_rma_station_number',
    source_inventory: path.relative(researchRoot, inventoryPath).replaceAll('\\', '/'),
    source_membership: path.relative(researchRoot, membershipPath).replaceAll('\\', '/'),
    feature_count: features.length,
  },
  features,
}

fs.writeFileSync(outputPath, `${JSON.stringify(geojson, null, 2)}\n`)
console.log(`Wrote ${features.length} SCHISM station points to ${outputPath}`)
