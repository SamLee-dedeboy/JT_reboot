// A region's name drawn on the region maps.
import { useTheme } from '@mui/material'
import type { RegionShape } from '@/content/deltaRegions'

const LABEL_SIZE = 21

/** Names longer than one word-pair get two lines, split at the space nearest the middle. */
function splitName(name: string): string[] {
  if (name.length <= 14) return [name]
  const spaces = [...name].map((ch, i) => (ch === ' ' ? i : -1)).filter((i) => i > 0)
  if (spaces.length === 0) return [name]
  const mid = name.length / 2
  const at = spaces.reduce((best, i) => (Math.abs(i - mid) < Math.abs(best - mid) ? i : best))
  return [name.slice(0, at), name.slice(at + 1)]
}

/** The region's name, set inside its fattest part with a dark halo so it reads over any fill. */
export function Label({ shape, size = LABEL_SIZE }: { shape: RegionShape; size?: number }) {
  const theme = useTheme()
  const [x, y] = shape.label
  const lines = splitName(shape.name)
  const first = lines.length === 1 ? 0 : -size * 0.6
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily={theme.typography.fontFamily}
      fontSize={size}
      fill={theme.palette.base[50]}
      stroke={theme.palette.base[900]}
      strokeWidth={size / 4}
      strokeLinejoin="round"
      paintOrder="stroke"
      pointerEvents="none"
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? first : size * 1.15}>
          {line}
        </tspan>
      ))}
    </text>
  )
}
