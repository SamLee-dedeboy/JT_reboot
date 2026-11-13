// Repository page for service-learning studios and education materials.
import { Box } from '@mui/material'
import { jtSpacing } from '@/theme'
import RepoLayout from './RepoLayout'
import StudioShowcase from './StudioShowcase'

export default function ServiceLearning() {
  return (
    <RepoLayout
      current="learning"
      title={
        <>
          Service Learning{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            &amp; Design Studios
          </Box>
        </>
      }
      lede="Here's a look at University of California undergraduate coursework focused on service learning and education through publicly engaged design studios. This page will be updated with more content as public engagement continues."
    >
      <Box sx={{ pt: { xs: jtSpacing.section.sm, md: jtSpacing.section.md } }}>
        <StudioShowcase />
      </Box>
    </RepoLayout>
  )
}
