// One line-art icon per subteam, drawn on a shared 24px grid with a single
// stroke weight so they read as one set at label size. Each takes the current
// text color, so a team's icon inherits that team's color wherever it is used.
import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import type { TeamKey } from '../data'

/** Marks the criterion each icon stands for, so the imagery stays tied to the metric. */
const ICONS: Record<TeamKey, { title: string; art: ReactNode }> = {
  // Delta ecology: fish over open water (species and food web).
  ecology: {
    title: 'Ecology',
    art: (
      <>
        <path d="M3.6 11.2c2.4-3.2 6-4.8 9.2-4.8 2.9 0 4.8 1.9 4.8 4.8s-1.9 4.8-4.8 4.8c-3.2 0-6.8-1.6-9.2-4.8Z" />
        <path d="M17.6 8.4 21.8 6v10.4l-4.2-2.4" />
        <path d="M3.2 19.9c2-1.4 4-1.4 6 0s4 1.4 6 0" />
        <circle cx="7.6" cy="10" r="0.85" fill="currentColor" stroke="none" />
      </>
    ),
  },
  // Recreation: boating on the Delta.
  recreation: {
    title: 'Recreation',
    art: (
      <>
        <path d="M12.9 3.4 19 14.2h-6.1Z" />
        <path d="M11.1 6.6 6.6 14.2h4.5V3.4" />
        <path d="M3.4 17h17.2l-2.6 3.6H6Z" />
      </>
    ),
  },
  // Environmental justice: drinking water at home (the criterion's core metric).
  environmentalJustice: {
    title: 'Env. Justice',
    art: (
      <>
        <path d="M3.9 10.6 12 4.3l8.1 6.3v9.1a1 1 0 0 1-1 1H4.9a1 1 0 0 1-1-1Z" />
        <path d="M12 11.5c1.7 2 2.5 3.3 2.5 4.3a2.5 2.5 0 0 1-5 0c0-1 .8-2.3 2.5-4.3Z" />
      </>
    ),
  },
  // Economy: Delta agriculture.
  economy: {
    title: 'Economy',
    art: (
      <>
        <path d="M12 20.8V7.6" />
        <path d="M12 8.2c-2-.7-3-2-3.1-4.1 2.1.1 3.2 1.5 3.1 4.1Z" />
        <path d="M12 8.2c2-.7 3-2 3.1-4.1-2.1.1-3.2 1.5-3.1 4.1Z" />
        <path d="M12 14c-2.5 0-4-1.5-4.4-4 2.5-.3 4.2 1.2 4.4 4Z" />
        <path d="M12 14c2.5 0 4-1.5 4.4-4-2.5-.3-4.2 1.2-4.4 4Z" />
        <path d="M4.6 20.8h14.8" />
      </>
    ),
  },
  // Eco-cultural restoration: tule stands at the waterline — the Delta marsh
  // landscape and access to it, deliberately not ceremonial imagery.
  ecoCultural: {
    title: 'Eco-cultural',
    art: (
      <>
        <path d="M3 20.8h18" />
        <path d="M8.2 20.8c-.7-4.4 0-7.7 2-9.9" />
        <path d="M12.6 20.8c-.3-5.3.7-9.2 2.9-11.5" />
        <path d="M17.4 20.8c0-3.2.5-5.6 1.6-7.2" />
        <ellipse cx="10.4" cy="9.6" rx="1.3" ry="2.1" />
        <ellipse cx="15.7" cy="7.6" rx="1.3" ry="2.1" />
      </>
    ),
  },
}

interface TeamIconProps {
  team: TeamKey
  /** Box size in px; the stroke stays constant so the set reads the same at any size. */
  size?: number
  /** Hidden from assistive tech when the team name is already in the label. */
  decorative?: boolean
}

export default function TeamIcon({ team, size = 16, decorative = true }: TeamIconProps) {
  const icon = ICONS[team]
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : icon.title}
      sx={{
        flex: 'none',
        width: size,
        height: size,
        display: 'block',
        color: 'inherit',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
    >
      {icon.art}
    </Box>
  )
}
