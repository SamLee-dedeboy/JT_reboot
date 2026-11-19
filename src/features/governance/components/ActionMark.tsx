// An action's end mark: a circle in its strategy area's color. A top action glows: one soft
// halo of the same color behind it.
import { useTheme } from '@mui/material'

export default function ActionMark({
  cx,
  cy,
  r,
  color,
  top,
  outline,
  className,
}: {
  cx: number
  cy: number
  r: number
  color: string
  /** One of the team's overall top actions. */
  top: boolean
  /** A ring drawn around the mark (the active action). */
  outline?: string
  className?: string
}) {
  const glow = useTheme().chart.governance.glow
  return (
    <>
      {top && <circle cx={cx} cy={cy} r={r * glow.radius} fill={color} opacity={glow.opacity} />}
      <circle
        className={className}
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        stroke={outline ?? 'none'}
        strokeWidth={2}
      />
    </>
  )
}
