// Repository page for project documents, reports, and outreach materials, laid out as a timeline.
import { Box } from '@mui/material'
import type { NavRailItem } from '@/ui'
import { jtSpacing } from '@/theme'
import RepoLayout from './RepoLayout'
import Timeline from './Timeline'
import { DOC_YEARS } from './data/docYears'

// The rail lists each year and, under it, its workshops.
const rail: NavRailItem[] = DOC_YEARS.flatMap((year) => [
  { id: `year-${year.year}`, label: year.year },
  ...year.workshops.map((workshop) => ({
    id: workshop.id,
    label: workshop.title,
    indent: true,
  })),
])

export default function ProjectDocumentation() {
  return (
    <RepoLayout
      current="docs"
      rail={rail}
      title={
        <>
          Project Documentation{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            &amp; Reports
          </Box>
        </>
      }
      lede="Here's a look at our project findings and outreach tools. This page will be updated with more content as public engagement and scenario refinement continue."
    >
      <Box sx={{ pt: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl } }}>
        <Timeline />
      </Box>
    </RepoLayout>
  )
}
