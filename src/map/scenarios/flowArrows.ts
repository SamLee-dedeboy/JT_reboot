// Water direction as small arrows: ocean inflow along a route, larger at the Golden Gate and
// shrinking inland, and the two rivers beside their channels. They are a schematic of direction,
// not modeled flow, so they are drawn by hand here.
import type { FeatureCollection } from 'geojson'

type Coordinate = [number, number]

const route: Coordinate[] = [
  [-122.76, 37.79],
  [-122.566, 37.8042],
  [-122.4959, 37.813],
  [-122.4441, 37.8479],
  [-122.4259, 37.8965],
  [-122.4382, 37.9517],
  [-122.4054, 37.999],
  [-122.3646, 38.0448],
  [-122.2973, 38.0552],
  [-122.2267, 38.0588],
  [-122.1561, 38.0524],
  [-122.0866, 38.0587],
  [-122.0176, 38.0679],
  [-121.9481, 38.0564],
]

// Sampled from the mainstem GeoJSON and set just off the channel. Each is an arrow's tail and the
// direction of flow, in degrees clockwise from north.
const riverArrows: Array<{ tail: Coordinate; bearing: number }> = [
  { tail: [-121.7723, 39.0016], bearing: 186 },
  { tail: [-121.854, 38.9074], bearing: 155 },
  { tail: [-121.7929, 38.8437], bearing: 110 },
  { tail: [-121.7437, 38.7967], bearing: 154 },
  { tail: [-121.5973, 38.703], bearing: 174 },
  { tail: [-121.5848, 38.5999], bearing: 144 },
  { tail: [-121.4942, 38.5269], bearing: 198 },
  { tail: [-121.4807, 38.4633], bearing: 168 },
  { tail: [-121.5059, 38.3495], bearing: 211 },
  { tail: [-121.5898, 38.2041], bearing: 240 },
  { tail: [-121.7089, 38.1507], bearing: 215 },
  { tail: [-121.2187, 37.6777], bearing: 330 },
  { tail: [-121.3164, 37.7185], bearing: 340 },
  { tail: [-121.3449, 37.8138], bearing: 356 },
  { tail: [-121.2954, 37.9262], bearing: 341 },
  { tail: [-121.4129, 38.012], bearing: 304 },
  { tail: [-121.5698, 38.0506], bearing: 302 },
]

const samplesPerSegment = 8

const arrowsStartMeters = 6000
const arrowStartLengthMeters = 6200
const arrowEndLengthMeters = 2600
const arrowGapRatio = 0.5
const riverArrowLengthMeters = 4000
// As fractions of each arrow's length.
const arrowStemHalfWidth = 0.06
const arrowHeadLength = 0.42
const arrowHeadHalfWidth = 0.22

const metersPerDegreeLatitude = 111_320
const metersPerDegreeLongitude = metersPerDegreeLatitude * Math.cos((38 * Math.PI) / 180)

/** Catmull-Rom through the route, so the arrow bends instead of kinking at each point. */
function smooth(points: Coordinate[]): Coordinate[] {
  const smoothed: Coordinate[] = []
  for (let index = 0; index < points.length - 1; index += 1) {
    const before = points[Math.max(index - 1, 0)]
    const from = points[index]
    const to = points[index + 1]
    const after = points[Math.min(index + 2, points.length - 1)]
    for (let sample = 0; sample < samplesPerSegment; sample += 1) {
      const t = sample / samplesPerSegment
      const interpolate = (axis: 0 | 1) =>
        0.5 *
        (2 * from[axis] +
          (to[axis] - before[axis]) * t +
          (2 * before[axis] - 5 * from[axis] + 4 * to[axis] - after[axis]) * t ** 2 +
          (3 * from[axis] - before[axis] - 3 * to[axis] + after[axis]) * t ** 3)
      smoothed.push([interpolate(0), interpolate(1)])
    }
  }
  smoothed.push(points[points.length - 1])
  return smoothed
}

function toMeters([longitude, latitude]: Coordinate): Coordinate {
  return [longitude * metersPerDegreeLongitude, latitude * metersPerDegreeLatitude]
}

function toCoordinate([x, y]: Coordinate): Coordinate {
  return [x / metersPerDegreeLongitude, y / metersPerDegreeLatitude]
}

const centerline = smooth(route).map(toMeters)
const distances = [0]
for (let index = 1; index < centerline.length; index += 1) {
  const [x0, y0] = centerline[index - 1]
  const [x1, y1] = centerline[index]
  distances.push(distances[index - 1] + Math.hypot(x1 - x0, y1 - y0))
}
const totalLength = distances[distances.length - 1]

function pointAlongRoute(distance: number): Coordinate {
  const next = distances.findIndex((candidate) => candidate >= distance)
  if (next <= 0) return centerline[Math.max(next, 0)]
  const t = (distance - distances[next - 1]) / (distances[next] - distances[next - 1])
  const [x0, y0] = centerline[next - 1]
  const [x1, y1] = centerline[next]
  return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]
}

/** One stemmed arrow from tail to tip, sized across by its length. */
function buildArrowRing([tailX, tailY]: Coordinate, [tipX, tipY]: Coordinate, length: number) {
  const chord = Math.hypot(tipX - tailX, tipY - tailY)
  const alongX = (tipX - tailX) / chord
  const alongY = (tipY - tailY) / chord
  const place = (along: number, across: number): Coordinate => [
    tailX + alongX * along * chord - alongY * across * length,
    tailY + alongY * along * chord + alongX * across * length,
  ]
  const ring = [
    place(0, arrowStemHalfWidth),
    place(1 - arrowHeadLength, arrowStemHalfWidth),
    place(1 - arrowHeadLength, arrowHeadHalfWidth),
    place(1, 0),
    place(1 - arrowHeadLength, -arrowHeadHalfWidth),
    place(1 - arrowHeadLength, -arrowStemHalfWidth),
    place(0, -arrowStemHalfWidth),
    place(0, arrowStemHalfWidth),
  ]
  return ring.map(toCoordinate)
}

function buildOceanArrowRings(): Coordinate[][] {
  const rings: Coordinate[][] = []
  let tailDistance = arrowsStartMeters
  while (true) {
    const progress = tailDistance / totalLength
    const length =
      arrowStartLengthMeters + (arrowEndLengthMeters - arrowStartLengthMeters) * progress
    if (tailDistance + length > totalLength) return rings
    rings.push(
      buildArrowRing(pointAlongRoute(tailDistance), pointAlongRoute(tailDistance + length), length),
    )
    tailDistance += length * (1 + arrowGapRatio)
  }
}

function buildRiverArrowRings(): Coordinate[][] {
  return riverArrows.map(({ tail, bearing }) => {
    const [tailX, tailY] = toMeters(tail)
    const radians = (bearing * Math.PI) / 180
    const tip: Coordinate = [
      tailX + Math.sin(radians) * riverArrowLengthMeters,
      tailY + Math.cos(radians) * riverArrowLengthMeters,
    ]
    return buildArrowRing([tailX, tailY], tip, riverArrowLengthMeters)
  })
}

export const flowArrows: FeatureCollection = {
  type: 'FeatureCollection',
  features: [...buildOceanArrowRings(), ...buildRiverArrowRings()].map((ring) => ({
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [ring] },
  })),
}
