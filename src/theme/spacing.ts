export const jtSpacing = {
  component: { xs: 1, sm: 1.5, md: 2.5, lg: 3.5, xl: 5 },
  section: { xs: 3, sm: 4.5, md: 6, lg: 9, xl: 12 },
  gap: { xs: 1, sm: 1.5, md: 2.5, lg: 3, xl: 4 },
  page: { x: { xs: 6, sm: 8, md: 10 }, y: { xs: 4, md: 6 } },
  paragraphMaxWidth: { default: '70ch', compact: '40ch' },
  scenario: {
    panelHeaderInset: { xs: 2.5, md: 4.5 },
    panelContentInline: { xs: 2.5, md: 3 },
    panelContentBottom: { xs: 3.5, md: 9 },
    comparisonHeader: 2.5,
    comparisonRowInline: { xs: 2, md: 3 },
  },
} as const
