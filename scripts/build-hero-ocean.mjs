// Builds public/data/geospatial-assets/shared/hero-ocean.geojson: the Pacific and Monterey
// Bay outside San Francisco Bay, traced from the basemap's own water (mapbox-streets-v8),
// so the home hero can fill the ocean beyond the salinity model with the marine color.
//
//   node scripts/build-hero-ocean.mjs
//
// Reads VITE_MAPBOX_TOKEN from .env. Keeps only large water polygons that run off their
// tile (the ocean, not lakes or reservoirs), splits them at the Golden Gate Bridge and drops
// the Bay side, which the animation already covers. No clipping elsewhere, so no slivers.
import { readFileSync, writeFileSync } from 'node:fs'
import { VectorTile } from '@mapbox/vector-tile'
import Pbf from 'pbf'

const ZOOM = 9
/** [west, south, east, north]: the coast every hero framing can reach. */
const BBOX = [-123.8, 36.2, -121.6, 38.9]
/**
 * The Golden Gate Bridge, run a little onto land at both ends: the one place the Bay's
 * water meets the ocean's. Water rings that cross it are split in two here.
 */
const GOLDEN_GATE = [
  [-122.4772, 37.803],
  [-122.4795, 37.833],
]
/**
 * A rough outline of the Bay and Delta, generous to its shores but clear of the Pacific
 * coast (Marin, Tomales Bay, Pacifica, Half Moon Bay). Water pieces whose vertices
 * mostly fall inside it are the Bay, which the salinity animation already covers.
 */
const BAY_OUTLINE = [
  [-122.4775, 37.805],
  [-122.479, 37.83],
  [-122.5, 37.86],
  [-122.56, 37.92],
  [-122.6, 38.1],
  [-122.7, 38.25],
  [-122.3, 38.4],
  [-121.3, 38.6],
  [-121.3, 37.3],
  [-122.2, 37.3],
  [-122.38, 37.55],
  [-122.4, 37.7],
  [-122.45, 37.8],
]
/** A polygon must cover this share of its tile to count as ocean. */
const MIN_TILE_SHARE = 0.03
const OUT = 'public/data/geospatial-assets/shared/hero-ocean.geojson'

const env = readFileSync('.env', 'utf8')
const token = env.match(/^VITE_MAPBOX_TOKEN=(.+)$/m)?.[1]?.trim()
if (!token) throw new Error('VITE_MAPBOX_TOKEN missing from .env')

const lon2x = (lon) => Math.floor(((lon + 180) / 360) * 2 ** ZOOM)
const lat2y = (lat) => {
  const r = (lat * Math.PI) / 180
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** ZOOM)
}

function ringArea(ring) {
  let a = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1])
  }
  return a / 2
}

function pointInRing([px, py], ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** Where segment a–b crosses segment c–d, or null. */
function intersect(a, b, c, d) {
  const den = (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0])
  if (den === 0) return null
  const t = ((c[0] - a[0]) * (d[1] - c[1]) - (c[1] - a[1]) * (d[0] - c[0])) / den
  const u = ((c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0])) / den
  if (t < 0 || t > 1 || u < 0 || u > 1) return null
  return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]
}

/** A ring split in two where it crosses the bridge, or left whole if it doesn't. */
function splitAtGoldenGate(ring) {
  const crossings = []
  for (let i = 0; i < ring.length; i++) {
    const point = intersect(ring[i], ring[(i + 1) % ring.length], ...GOLDEN_GATE)
    if (point) crossings.push({ i, point })
  }
  if (crossings.length === 0) return [ring]
  if (crossings.length !== 2) throw new Error(`ring crosses the bridge ${crossings.length} times`)
  const [{ i: i1, point: q1 }, { i: i2, point: q2 }] = crossings
  return [
    [q1, ...ring.slice(i1 + 1, i2 + 1), q2],
    [q2, ...ring.slice(i2 + 1), ...ring.slice(0, i1 + 1), q1],
  ]
}

const isBay = (ring) =>
  ring.filter((p) => pointInRing(p, BAY_OUTLINE)).length > ring.length / 2

const round = (p) => [Math.round(p[0] * 1e5) / 1e5, Math.round(p[1] * 1e5) / 1e5]
const close = (ring) => (ring.length ? [...ring, ring[0]] : ring)

const polygons = []
const [x0, x1] = [lon2x(BBOX[0]), lon2x(BBOX[2])]
const [y0, y1] = [lat2y(BBOX[3]), lat2y(BBOX[1])]

for (let x = x0; x <= x1; x++) {
  for (let y = y0; y <= y1; y++) {
    const url = `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/${ZOOM}/${x}/${y}.vector.pbf?access_token=${token}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`tile ${ZOOM}/${x}/${y}: HTTP ${res.status}`)
    const tile = new VectorTile(new Pbf(Buffer.from(await res.arrayBuffer())))
    const layer = tile.layers.water
    if (!layer) continue
    for (let i = 0; i < layer.length; i++) {
      const feature = layer.feature(i)
      const extent = feature.extent
      const tileArea = extent * extent
      // Rings in tile units: outer rings are followed by their holes.
      const rings = feature.loadGeometry().map((ring) => ring.map((p) => [p.x, p.y]))
      let current = null
      for (const ring of rings) {
        const area = ringArea(ring)
        // Vector-tile outer rings wind clockwise in screen space (positive here).
        if (area > 0) {
          const big = area / tileArea >= MIN_TILE_SHARE
          const crossesTile = ring.some(
            ([px, py]) => px <= 0 || py <= 0 || px >= extent || py >= extent,
          )
          current = big && crossesTile ? [ring] : null
          if (current) polygons.push({ rings: current, x, y, extent })
        } else if (current) {
          current.push(ring)
        }
      }
    }
  }
}

// Tile units to lon/lat.
const toLngLat = (x, y, extent) => ([px, py]) => {
  const n = 2 ** ZOOM
  const lon = ((x + px / extent) / n) * 360 - 180
  const merc = Math.PI * (1 - (2 * (y + py / extent)) / n)
  const lat = (Math.atan(Math.sinh(merc)) * 180) / Math.PI
  return [lon, lat]
}

// Split each piece at the bridge, give each hole to the side it lies in, drop the Bay.
const coordinates = []
for (const { rings, x, y, extent } of polygons) {
  const [outer, ...holes] = rings.map((ring) => {
    const lngLat = ring.map(toLngLat(x, y, extent))
    return lngLat.slice(0, -1) // vector-tile rings repeat their first point
  })
  const sides = splitAtGoldenGate(outer).map((side) => [side])
  for (const hole of holes) sides.find(([side]) => pointInRing(hole[0], side))?.push(hole)
  for (const side of sides) {
    if (side[0].length < 3 || isBay(side[0])) continue
    coordinates.push(side.map((ring) => close(ring.map(round))))
  }
}

const geojson = {
  type: 'FeatureCollection',
  features: [{ type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates } }],
}
writeFileSync(OUT, JSON.stringify(geojson))
console.log(`${OUT}: ${coordinates.length} polygons from ${polygons.length} tile pieces`)
