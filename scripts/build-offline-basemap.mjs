/**
 * Builds the reference layers for the offline exhibit basemap
 * (src/map/offlineBasemapStyle.ts) from OpenStreetMap:
 *
 * - public/data/regional-summary/offline-basemap.geojson: roads, settlement and bay labels
 * - public/data/regional-summary/offline-landuse.geojson: landuse and lake polygons
 *
 *   node scripts/build-offline-basemap.mjs [--reference-only] [cache-dir]
 *
 * Overpass responses are saved in cache-dir (default: .cache/offline-basemap) and
 * reused on later runs, so the output can be regenerated without re-downloading.
 *
 * Data © OpenStreetMap contributors (ODbL).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.join(scriptDir, '../public/data/regional-summary')
const args = process.argv.slice(2)
// --reference-only rebuilds roads, labels, and ocean without the slow landuse tiles.
const referenceOnly = args.includes('--reference-only')
const cacheDir = path.resolve(
  args.find((arg) => !arg.startsWith('--')) ?? path.join(scriptDir, '../.cache/offline-basemap'),
)
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// Roads keep ~1 m precision; landuse only needs ~10 m because it is a soft tone.
const ROAD_PRECISION = 5
const ROAD_SIMPLIFY_TOLERANCE = 0.00002
const LANDUSE_PRECISION = 4
const LANDUSE_SIMPLIFY_TOLERANCE = 0.00008
// Mapbox Streets omits small landuse polygons at exhibit zooms (its sizerank filter).
const LANDUSE_MIN_AREA_SQ_DEGREES = 2e-6

// Landuse is fetched in tiles because the full area exceeds Overpass limits.
const LANDUSE_BOUNDS = { south: 37.6, west: -123.0, north: 38.6, east: -121.0 }
const LANDUSE_TILE_DEGREES = 0.25

/** OSM tag values grouped into the Mapbox Streets landuse classes the online style fills. */
const LANDUSE_CLASSES = {
  landuse: {
    farmland: 'agriculture',
    orchard: 'agriculture',
    vineyard: 'agriculture',
    farmyard: 'agriculture',
    forest: 'wood',
    meadow: 'grass',
    grass: 'grass',
    recreation_ground: 'park',
    residential: 'residential',
  },
  natural: {
    wood: 'wood',
    scrub: 'scrub',
    grassland: 'grass',
    heath: 'grass',
    sand: 'sand',
    beach: 'sand',
    water: 'water',
  },
  leisure: { park: 'park', nature_reserve: 'park', golf_course: 'grass', pitch: 'pitch' },
  aeroway: { aerodrome: 'airport' },
}

const LABELLED_BAYS = new Set(['San Francisco Bay', 'San Pablo Bay', 'Suisun Bay'])
// Suburbs that would otherwise compete with the Delta towns at overview zooms;
// they appear only when the visitor zooms in.
const SECONDARY_PLACES = new Set([
  'Walnut Creek',
  'Danville',
  'Pleasant Hill',
  'Lafayette',
  'Orinda',
  'Moraga',
  'Alamo',
  'Clayton',
  'San Ramon',
  'Dublin',
  'Castro Valley',
  'San Leandro',
  'Union City',
  'El Cerrito',
  'Albany',
  'Piedmont',
  'Hercules',
  'Pinole',
  'Bay Point',
])

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function overpass(query, cacheName) {
  const cachePath = path.join(cacheDir, cacheName)
  if (existsSync(cachePath)) return JSON.parse(await readFile(cachePath, 'utf8'))

  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'JT_reboot offline basemap build',
      },
      body: new URLSearchParams({ data: query }),
    })
    if (response.ok) {
      const text = await response.text()
      await writeFile(cachePath, text, 'utf8')
      return JSON.parse(text)
    }
    if (attempt >= 5 || ![429, 504].includes(response.status)) {
      throw new Error(`Overpass request for ${cacheName} failed: ${response.status}`)
    }
    console.log(`${cacheName}: Overpass ${response.status}, retrying`)
    await sleep(30_000 * attempt)
  }
}

/**
 * Ways only need tags and geometry; multipolygon relations need `out geom` so
 * their member rings are included. They are fetched separately to keep each
 * request within Overpass limits.
 */
function landuseQuery(type, bbox) {
  const tagFilters = Object.entries(LANDUSE_CLASSES).map(
    ([key, values]) => `  ${type}[${key}~"^(${Object.keys(values).join('|')})$"](${bbox});`,
  )
  const output = type === 'way' ? 'out tags geom qt;' : 'out geom qt;'
  return `[out:json][timeout:170];\n(\n${tagFilters.join('\n')}\n);\n${output}\n`
}

const roundTo = (precision) => (value) => Number(value.toFixed(precision))
const pointKey = ([lon, lat]) => `${lon},${lat}`

function perpendicularDistance([x, y], [x1, y1], [x2, y2]) {
  const dx = x2 - x1
  const dy = y2 - y1
  if (dx === 0 && dy === 0) return Math.hypot(x - x1, y - y1)
  return Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / Math.hypot(dx, dy)
}

function simplify(points, tolerance) {
  if (points.length < 3) return points
  let maxDistance = 0
  let index = 0
  for (let i = 1; i < points.length - 1; i += 1) {
    const distance = perpendicularDistance(points[i], points[0], points.at(-1))
    if (distance > maxDistance) {
      maxDistance = distance
      index = i
    }
  }
  if (maxDistance <= tolerance) return [points[0], points.at(-1)]
  return [
    ...simplify(points.slice(0, index + 1), tolerance).slice(0, -1),
    ...simplify(points.slice(index), tolerance),
  ]
}

/** Joins lines that share endpoints, e.g. OSM ways of one road or one multipolygon ring. */
function mergeLines(lines) {
  const remaining = new Set(lines.map((_, index) => index))
  const byEndpoint = new Map()
  lines.forEach((line, index) => {
    for (const key of [pointKey(line[0]), pointKey(line.at(-1))]) {
      if (!byEndpoint.has(key)) byEndpoint.set(key, [])
      byEndpoint.get(key).push(index)
    }
  })
  const takeNeighbor = (point) => {
    const candidates = byEndpoint.get(pointKey(point)) ?? []
    const next = candidates.find((index) => remaining.has(index))
    if (next === undefined) return null
    remaining.delete(next)
    const line = lines[next]
    return pointKey(line[0]) === pointKey(point) ? line : [...line].reverse()
  }

  const merged = []
  for (const start of lines.keys()) {
    if (!remaining.has(start)) continue
    remaining.delete(start)
    let chain = lines[start]
    const isClosed = () => pointKey(chain[0]) === pointKey(chain.at(-1))
    for (
      let next = !isClosed() && takeNeighbor(chain.at(-1));
      next;
      next = !isClosed() && takeNeighbor(chain.at(-1))
    ) {
      chain = [...chain, ...next.slice(1)]
    }
    for (
      let previous = !isClosed() && takeNeighbor(chain[0]);
      previous;
      previous = !isClosed() && takeNeighbor(chain[0])
    ) {
      chain = [...[...previous].reverse(), ...chain.slice(1)]
    }
    merged.push(chain)
  }
  return merged
}

function pointInRing([x, y], ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function ringArea(ring) {
  let area = 0
  for (let i = 0; i < ring.length - 1; i += 1) {
    area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
  }
  return Math.abs(area / 2)
}

/**
 * Approximates Mapbox Streets' place_label symbolrank (lower = more prominent)
 * so the offline style can reuse the online settlement-label expressions.
 */
function symbolRank(place, population, name) {
  if (SECONDARY_PLACES.has(name)) return 14
  if (population >= 480_000) return 7
  if (population >= 100_000) return 10
  if (population >= 35_000) return 11
  if (population >= 20_000) return 12
  if (place === 'city' || population >= 10_000) return 13
  if (place === 'town') return 14
  return 15
}

function buildReferenceFeatures(elements) {
  const round = roundTo(ROAD_PRECISION)

  const places = elements
    .filter((element) => element.type === 'node' && element.tags?.place && element.tags.name)
    .map((element) => {
      const population =
        Number.parseInt(String(element.tags.population ?? '').replace(/\D/g, ''), 10) || 0
      return {
        type: 'Feature',
        properties: {
          kind: 'place',
          class: element.tags.place,
          name: element.tags.name,
          symbolrank: symbolRank(element.tags.place, population, element.tags.name),
        },
        geometry: { type: 'Point', coordinates: [round(element.lon), round(element.lat)] },
      }
    })
    .sort((a, b) => a.properties.symbolrank - b.properties.symbolrank)

  // Only the major bays the online style labels at exhibit zooms, each at a single point.
  const bays = elements
    .filter((element) => element.tags?.natural === 'bay' && LABELLED_BAYS.has(element.tags.name))
    .map((element) => {
      let coordinates = [element.lon, element.lat]
      if (element.type !== 'node') {
        const { minlon, minlat, maxlon, maxlat } = element.bounds
        coordinates = [(minlon + maxlon) / 2, (minlat + maxlat) / 2]
      }
      return {
        type: 'Feature',
        properties: { kind: 'water-label', class: 'bay', name: element.tags.name },
        geometry: { type: 'Point', coordinates: coordinates.map(round) },
      }
    })

  const roadGroups = new Map()
  for (const element of elements) {
    if (element.type !== 'way' || !element.tags?.highway || !(element.geometry?.length > 1))
      continue
    const properties = {
      kind: 'road',
      class: element.tags.highway,
      name: element.tags.name ?? element.tags.ref ?? '',
    }
    const key = `${properties.class}|${properties.name}`
    if (!roadGroups.has(key)) roadGroups.set(key, { properties, lines: [] })
    roadGroups.get(key).lines.push(element.geometry.map(({ lon, lat }) => [round(lon), round(lat)]))
  }
  const roads = [...roadGroups.values()].flatMap(({ properties, lines }) =>
    mergeLines(lines).map((line) => ({
      type: 'Feature',
      properties,
      geometry: { type: 'LineString', coordinates: simplify(line, ROAD_SIMPLIFY_TOLERANCE) },
    })),
  )

  // Named rivers become a few long lines each, used for both drawing and labels.
  const riverGroups = new Map()
  for (const element of elements) {
    if (element.tags?.waterway !== 'river' || !(element.geometry?.length > 1)) continue
    const name = element.tags.name
    if (!riverGroups.has(name)) riverGroups.set(name, [])
    riverGroups.get(name).push(element.geometry.map(({ lon, lat }) => [round(lon), round(lat)]))
  }
  const rivers = [...riverGroups].flatMap(([name, lines]) =>
    mergeLines(lines).map((line) => ({
      type: 'Feature',
      properties: { kind: 'waterway', class: 'river', name },
      geometry: { type: 'LineString', coordinates: simplify(line, LANDUSE_SIMPLIFY_TOLERANCE) },
    })),
  )

  const lakes = buildLanduseFeatures(
    elements.filter((element) => element.tags?.natural === 'water'),
  ).map((feature) => ({ ...feature, properties: { kind: 'lake' } }))

  return { roads, places, bays, rivers, lakes, ...buildOceanFeatures(elements) }
}

/**
 * OSM coastline runs with land on its left. Within the exhibit area it is one
 * north-to-south line (Pacific shore plus the Bay shoreline) and closed island
 * rings, so the ocean is that line closed around a point far offshore.
 */
function buildOceanFeatures(elements) {
  const round = roundTo(LANDUSE_PRECISION)
  const coastlines = mergeLines(
    elements
      .filter((element) => element.type === 'way' && element.tags?.natural === 'coastline')
      .map((element) => element.geometry.map(({ lon, lat }) => [round(lon), round(lat)])),
  ).map((line) => simplify(line, LANDUSE_SIMPLIFY_TOLERANCE))

  const isClosed = (line) => pointKey(line[0]) === pointKey(line.at(-1))
  const islands = coastlines.filter((line) => isClosed(line) && line.length > 3)
  // The main shore is the longest open line; short fragments are inlets clipped
  // by the query edge (e.g. Elkhorn Slough at the southern boundary).
  const [shore, ...fragments] = coastlines
    .filter((line) => !isClosed(line))
    .sort((a, b) => b.length - a.length)
  if (!shore || shore[0][1] < shore.at(-1)[1]) {
    throw new Error('Expected the main coastline to run north to south')
  }
  if (fragments.length > 0) {
    console.log(`Ignoring ${fragments.length} clipped coastline fragment(s)`)
  }
  const offshore = Math.min(...shore.map(([lon]) => lon)) - 1
  const ocean = [...shore, [offshore, shore.at(-1)[1]], [offshore, shore[0][1]], shore[0]]
  const polygon = (kind, rings) => ({
    type: 'Feature',
    properties: { kind },
    geometry: { type: 'MultiPolygon', coordinates: rings.map((ring) => [ring]) },
  })
  return { ocean: [polygon('ocean', [ocean]), polygon('island', islands)] }
}

function landuseClass(tags = {}) {
  for (const [key, values] of Object.entries(LANDUSE_CLASSES)) {
    if (values[tags[key]]) return values[tags[key]]
  }
  return null
}

function buildLanduseFeatures(elements) {
  const seen = new Set()
  const features = []

  for (const element of elements) {
    const id = `${element.type}/${element.id}`
    const featureClass = landuseClass(element.tags)
    if (!featureClass || seen.has(id)) continue
    seen.add(id)
    // Water carries the Delta channels, so it keeps road-level detail.
    const isWater = featureClass === 'water'
    const round = roundTo(isWater ? ROAD_PRECISION : LANDUSE_PRECISION)
    const tolerance = isWater ? ROAD_SIMPLIFY_TOLERANCE : LANDUSE_SIMPLIFY_TOLERANCE

    const toLine = (geometry) => geometry.map(({ lon, lat }) => [round(lon), round(lat)])
    const toRings = (lines, minArea) =>
      lines
        .filter((line) => line.length > 3 && pointKey(line[0]) === pointKey(line.at(-1)))
        .map((ring) => simplify(ring, tolerance))
        .filter((ring) => ring.length > 3 && ringArea(ring) >= minArea)
    const memberRings = (role, minArea) =>
      toRings(
        mergeLines(
          (element.members ?? [])
            .filter((member) => member.role === role && member.geometry?.length > 1)
            .map((member) => toLine(member.geometry)),
        ),
        minArea,
      )

    const outers =
      element.type === 'way'
        ? toRings([toLine(element.geometry ?? [])], LANDUSE_MIN_AREA_SQ_DEGREES)
        : memberRings('outer', LANDUSE_MIN_AREA_SQ_DEGREES)
    if (outers.length === 0) continue

    // Inner rings are holes, e.g. the farmed islands between Delta channels.
    const polygons = outers.map((outer) => [outer])
    const inners = element.type === 'way' ? [] : memberRings('inner', 0)
    for (const inner of inners) {
      const polygon = polygons.find(([outer]) => pointInRing(inner[0], outer))
      polygon?.push(inner)
    }

    features.push({
      type: 'Feature',
      properties: { class: featureClass },
      geometry: { type: 'MultiPolygon', coordinates: polygons },
    })
  }
  return features
}

await mkdir(cacheDir, { recursive: true })

const referenceQuery = await readFile(path.join(scriptDir, 'offline-basemap.overpassql'), 'utf8')
const reference = await overpass(referenceQuery, 'reference.json')
const { roads, places, bays, rivers, lakes, ocean } = buildReferenceFeatures(reference.elements)
await writeFile(
  path.join(outputDir, 'offline-basemap.geojson'),
  JSON.stringify({
    type: 'FeatureCollection',
    features: [...ocean, ...lakes, ...rivers, ...roads, ...places, ...bays],
  }),
  'utf8',
)
console.log(
  `offline-basemap.geojson: ${roads.length} roads, ${rivers.length} rivers, ${lakes.length} lakes, ${places.length} places`,
)

if (referenceOnly) process.exit(0)

const landuseElements = []
const { south, west, north, east } = LANDUSE_BOUNDS
for (let tileSouth = south; tileSouth < north; tileSouth += LANDUSE_TILE_DEGREES) {
  for (let tileWest = west; tileWest < east; tileWest += LANDUSE_TILE_DEGREES) {
    const bbox = [
      tileSouth,
      tileWest,
      Math.min(tileSouth + LANDUSE_TILE_DEGREES, north),
      Math.min(tileWest + LANDUSE_TILE_DEGREES, east),
    ].map((value) => Number(value.toFixed(2)))
    const ways = await overpass(
      landuseQuery('way', bbox.join(',')),
      `landuse_${bbox[0]}_${bbox[1]}.json`,
    )
    const relations = await overpass(
      landuseQuery('rel', bbox.join(',')),
      `landuse_rel_${bbox[0]}_${bbox[1]}.json`,
    )
    // Relations come only from the relation query, which includes their members.
    landuseElements.push(
      ...ways.elements.filter((element) => element.type === 'way'),
      ...relations.elements,
    )
  }
}
const landuse = buildLanduseFeatures(landuseElements)
await writeFile(
  path.join(outputDir, 'offline-landuse.geojson'),
  JSON.stringify({ type: 'FeatureCollection', features: landuse }),
  'utf8',
)
console.log(`offline-landuse.geojson: ${landuse.length} polygons`)
