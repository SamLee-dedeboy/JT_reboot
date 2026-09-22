// Selectable team color palettes. The page provides the active palette via
// context; every design reads team colors through useTeams() so switching
// recolors all of them at once. Score colors (blue/orange) never change.
import { createContext, useContext } from 'react'
import { chart } from '../../../theme'
import { TEAMS } from '../data'
import type { Team } from '../data'

export type TeamPaletteKey = keyof typeof chart.voting.teamPalettes

export const TEAM_PALETTES: { key: TeamPaletteKey; label: string; colors: readonly string[] }[] = [
  { key: 'color', label: 'Color', colors: chart.voting.teamPalettes.color },
  { key: 'neutral', label: 'Neutral', colors: chart.voting.teamPalettes.neutral },
]

export const TeamPaletteContext = createContext<readonly string[]>(TEAM_PALETTES[0].colors)

/** Teams in fixed order, colored by the active palette. */
export function useTeams(): Team[] {
  const colors = useContext(TeamPaletteContext)
  return TEAMS.map((team, i) => ({ ...team, color: colors[i] }))
}
