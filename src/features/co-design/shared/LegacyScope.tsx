// Views not yet restyled onto the theme still need the dashboard's scoped
// stylesheet (styles/*.css). `display: contents` keeps them direct flex
// children of <main>, as they were in the Svelte app. Remove once every view
// is restyled.
import { Box } from '@mui/material'
import type { ReactNode } from 'react'

export default function LegacyScope({ children }: { children: ReactNode }) {
  return (
    <Box className="jtd-root" sx={{ display: 'contents' }}>
      {children}
    </Box>
  )
}
