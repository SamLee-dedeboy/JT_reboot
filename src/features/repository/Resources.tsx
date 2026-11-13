// Repository page for references, research articles, and modeling resources.
import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { ActionButton, ScrollReveal, type NavRailItem } from '@/ui'
import { assetUrl } from '@/utils/baseUrl'
import { jtSpacing, navigation } from '@/theme'
import RepoLayout from './RepoLayout'
import ReferenceTable from './ReferenceTable'
import ArticleAccordion from './ArticleAccordion'
import { REFERENCES } from './data/resources'

const rail: NavRailItem[] = [
  { id: 'foundations', label: 'Delta research' },
  { id: 'articles', label: 'Research articles' },
  { id: 'modeling', label: 'Modeling resources' },
]

/** One section of the page: a heading, an optional intro, then its content. */
function PageSection({
  id,
  title,
  intro,
  children,
}: {
  id: string
  title: string
  intro?: ReactNode
  children: ReactNode
}) {
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={`${id}-title`}
      sx={{
        scrollMarginTop: `${navigation.pageRailTop}px`,
        pt: { xs: jtSpacing.section.sm, md: jtSpacing.section.md },
      }}
    >
      <ScrollReveal sx={{ mb: jtSpacing.component.xl }}>
        <Typography id={`${id}-title`} variant="h2">
          {title}
        </Typography>
        {intro && (
          <Typography
            variant="body1"
            sx={{ mt: jtSpacing.component.md, maxWidth: '70ch', color: 'base.100' }}
          >
            {intro}
          </Typography>
        )}
      </ScrollReveal>
      {children}
    </Box>
  )
}

export default function Resources() {
  return (
    <RepoLayout
      current="resources"
      heroImage="/images/repo/resources-hero.png"
      rail={rail}
      title={
        <>
          References{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            &amp; Resources
          </Box>
        </>
      }
      lede="A curated collection of reference literature that has informed the Just Transitions project — spanning disciplines, concerns, and public interests across the Delta."
    >
      <PageSection
        id="foundations"
        title="Building on Existing Delta Research"
        intro="The following content is provided as a small collection of reference literature that has informed the research of the Just Transition project. It includes literature from a wide range of disciplines, and across a range of concerns and public interests in the Delta. All content shared here is the intellectual property of the credited authors and agencies."
      >
        <ReferenceTable references={REFERENCES} />
      </PageSection>

      <PageSection id="articles" title="Research Articles">
        <ArticleAccordion />
      </PageSection>

      <PageSection id="modeling" title="Modeling Resources">
        {/* The CWEMF logo sits on the page ground, which matches its own background */}
        <ScrollReveal
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1.2fr)' },
            gap: { xs: jtSpacing.gap.lg, md: jtSpacing.component.xl },
            alignItems: 'center',
            p: { xs: jtSpacing.component.lg, md: jtSpacing.section.sm },
            border: 1,
            borderColor: 'border.default',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'grid', placeItems: 'center' }}>
            <Box
              component="img"
              src={assetUrl('/images/repo/cwemf.png')}
              alt="California Water & Environmental Modeling Forum (CWEMF)"
              loading="lazy"
              sx={{ maxHeight: 120, maxWidth: '100%', width: 'auto' }}
            />
          </Box>
          <Box>
            <Typography variant="h3" sx={{ mb: jtSpacing.component.md }}>
              California Water &amp; Environmental Modeling Forum
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: jtSpacing.component.lg, maxWidth: '52ch', color: 'base.100' }}
            >
              This wiki serves as a collaborative platform for sharing information, resources, and
              documentation related to modeling efforts focused on the Delta ecosystem.
            </Typography>
            <ActionButton label="Model inventory" href="#" />
          </Box>
        </ScrollReveal>
      </PageSection>
    </RepoLayout>
  )
}
