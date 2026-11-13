import { Box, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { Eyebrow, NumberedHeading, SectionHead } from '@/ui'
import DesignSection from '../parts/DesignSection'
import Specimen, { UsageTag } from '../parts/Specimen'

/** The heading pieces pages are built from. PageHero is the top of this page. */
export default function HeadingsSection() {
  return (
    <DesignSection
      id="headings"
      eyebrow="Components"
      title="Headings"
      intro="PageHero is the band at the top of this page: eyebrow, h1 and a body1 summary over an optional image."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: jtSpacing.section.sm,
          alignItems: 'start',
        }}
      >
        <Specimen
          name="SectionHead"
          spec="Eyebrow over an h2. The intro under it is body1."
          usage={<UsageTag>Most sections</UsageTag>}
        >
          <SectionHead eyebrow="Scenario modeling" title="Three baselines" />
          <Typography variant="body1" sx={{ color: 'base.100' }}>
            Section intros use body1, never the larger lead size.
          </Typography>
        </Specimen>
        <Specimen
          name="NumberedHeading"
          spec="numberArticle over an h2 (or h3 style). The number can take a team color."
          usage={<UsageTag>scenario-methodology</UsageTag>}
        >
          <NumberedHeading number="02" title="Why it matters" id="design-system-numbered" />
        </Specimen>
        <Specimen name="Eyebrow" spec="Hammersmith One, 0.22em tracking, green.">
          <Eyebrow>Evaluation · 02</Eyebrow>
        </Specimen>
      </Box>
    </DesignSection>
  )
}
