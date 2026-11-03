// Dissolve Ecology's Suisun Bay and Suisun Marsh outlines into one "Suisun Marsh"
// polygon, because the team combined the two in its regional assignments.
//
//     node scripts/merge-suisun-outline.mjs
//
// build-subteam-regions.py has no polygon-clipping library, so it reads this output
// (scripts/data/subteam-regions/eco-suisun-marsh.geojson) in place of the two rows.
import { readFileSync, writeFileSync } from 'node:fs'
import { union } from 'martinez-polygon-clipping'

const dir = new URL('./data/subteam-regions/', import.meta.url)
const view = (name) => {
  const { buffer, byteOffset, length } = readFileSync(new URL(name, dir))
  return new DataView(buffer, byteOffset, length)
}
const shp = view('subteam_regions.shp')
const dbf = view('subteam_regions.dbf')

const text = (view, start, length) =>
  new TextDecoder().decode(new Uint8Array(view.buffer, view.byteOffset + start, length))

function readRows() {
  const count = dbf.getUint32(4, true)
  const headerLength = dbf.getUint16(8, true)
  const recordLength = dbf.getUint16(10, true)
  const fields = []
  for (let at = 32; dbf.getUint8(at) !== 0x0d; at += 32) {
    fields.push({ name: text(dbf, at, 11).split('\0')[0], length: dbf.getUint8(at + 16) })
  }
  return Array.from({ length: count }, (_, row) => {
    let at = headerLength + row * recordLength + 1
    const record = {}
    for (const { name, length } of fields) {
      record[name] = text(dbf, at, length).trim()
      at += length
    }
    return record
  })
}

function readShapes() {
  const shapes = []
  let at = 100
  while (at < shp.byteLength) {
    const body = at + 8
    const parts = shp.getUint32(body + 36, true)
    const points = shp.getUint32(body + 40, true)
    const starts = Array.from({ length: parts }, (_, i) => shp.getUint32(body + 44 + i * 4, true))
    const first = body + 44 + parts * 4
    shapes.push(
      starts.map((start, i) => {
        const end = i + 1 < parts ? starts[i + 1] : points
        return Array.from({ length: end - start }, (_, j) => [
          shp.getFloat64(first + (start + j) * 16, true),
          shp.getFloat64(first + (start + j) * 16 + 8, true),
        ])
      }),
    )
    at = body + shp.getInt32(at + 4) * 2
  }
  return shapes
}

const rows = readRows()
const shapes = readShapes()
const outline = (name) => shapes[rows.findIndex((r) => r.team === 'ECO' && r.type === name)]

const merged = union(outline('Suisun Bay'), outline('Suisun Marsh'))
if (merged.length !== 1) throw new Error(`expected one polygon, got ${merged.length}`)

writeFileSync(
  new URL('eco-suisun-marsh.geojson', dir),
  `${JSON.stringify({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { title: 'Suisun Marsh' },
        geometry: { type: 'Polygon', coordinates: merged[0] },
      },
    ],
  })}\n`,
)
console.log(`merged Suisun: ${merged[0].length} ring(s), ${merged[0][0].length} points`)
