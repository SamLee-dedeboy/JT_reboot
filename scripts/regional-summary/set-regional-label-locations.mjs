import fs from 'node:fs'

const filePath =
  process.argv[2] ??
  'D:/projects/JT_exploration/RMA/BDSC_regional_summary/inputs/regional_label_locations_updated.geojson'
const updates = {
  bf_freshwater_pathway: [-121.573, 37.956],
  montezuma_slough: [-121.9156486, 38.1275449],
  north_franks_tract: [-121.625, 38.095],
}

const geojson = JSON.parse(fs.readFileSync(filePath, 'utf8'))
for (const [regionId, coordinates] of Object.entries(updates)) {
  const feature = geojson.features.find((candidate) => candidate.properties?.region_id === regionId)
  if (!feature || feature.geometry?.type !== 'Point') {
    throw new Error(`Missing Point feature for ${regionId}.`)
  }
  feature.geometry.coordinates = coordinates
}
fs.writeFileSync(filePath, `${JSON.stringify(geojson, null, 2)}\n`)
console.log(`Restored ${Object.keys(updates).join(', ')} in ${filePath}`)
