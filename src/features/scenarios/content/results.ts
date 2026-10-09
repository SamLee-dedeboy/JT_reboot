export const evaluationCriteria = [
  { id: 'salinity', label: 'Salinity' },
  { id: 'ecology', label: 'Ecology' },
  { id: 'community', label: 'Community' },
  { id: 'economy', label: 'Economy' },
  { id: 'recreation', label: 'Recreation' },
  { id: 'tribes', label: 'Tribes' },
] as const

export const evaluationMetrics = {
  salinity: {
    heading: 'Salinity indicators',
    items: ['X2 position', 'Compliance stations', 'Monitoring stations'],
  },
  ecology: {
    heading: 'Valued species',
    items: ['Longfin Smelt', 'Chinook Salmon', 'Submerged Aquatic Vegetation'],
  },
  community: {
    heading: 'Community conditions',
    items: ['Drinking water access', 'Delta communities', 'Environmental justice locations'],
  },
  economy: {
    heading: 'Economic activities',
    items: ['Delta agriculture', 'Freshwater supply', 'Local livelihoods'],
  },
  recreation: {
    heading: 'Recreation values',
    items: ['Fishing', 'Boating access', 'Public recreation areas'],
  },
  tribes: {
    heading: 'Eco-cultural values',
    items: ['Land access', 'Cultural practices', 'Tribal stewardship'],
  },
} as const

