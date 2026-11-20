// Ported from JT_dashboard/src/lib/Flow/components/sections/SectionHeader.svelte.
// Only the title was reachable. The category
// curation code (add/remove/submit to POST /curate/category/, which has no
// backend) had no markup calling it and is dropped, along with the unused
// `options` / `category_metadata` props and the getContext("fetchData") lookup.
import { Box, Typography } from '@mui/material'
import type { tSectionMetadata } from '../../types'

// The green band over each column: the question, in the same type style for
// every column.
export default function SectionHeader({
  section,
}: {
  section: tSectionMetadata
}) {
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
        flexShrink: 0,
        height: theme.coDesign.flow.sectionHeader.titleHeight,
        px: 2.5,
        py: 2,
        textAlign: 'left',
        userSelect: 'none',
        pointerEvents: 'auto',
        color: theme.coDesign.flow.sectionHeader.text,
        bgcolor: theme.coDesign.flow.sectionHeader.background,
        boxShadow: theme.coDesign.flow.sectionHeader.shadow,
      })}
    >
      <Typography variant="tableValueStrong" component="h2" sx={{ color: 'inherit' }}>
        {section.title}
      </Typography>
    </Box>
  )
}
