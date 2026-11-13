import { navigation } from '@/theme'

/** The story page's three columns on large screens: rail, narrative, map. */
export const storyGridColumns = {
  xs: '1fr',
  lg: `${navigation.railColumn} minmax(0, 1fr) minmax(320px, .9fr)`,
} as const
