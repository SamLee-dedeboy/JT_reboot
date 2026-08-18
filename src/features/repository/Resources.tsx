// Repository page for references, research articles, and modeling resources.
import { Box, Button, Typography } from '@mui/material'
import RepoLayout from './RepoLayout'
import Section from '../../ui/Section'
import SectionHead from '../../ui/SectionHead'
import ScrollReveal from '../../ui/animation/ScrollReveal'
import Eyebrow from '../../ui/Eyebrow'
import Icon from '../../ui/Icon'
import ReferenceCard from './ReferenceCard'
import ArticleAccordion from './ArticleAccordion'
import { assetUrl } from '../../utils/baseUrl'
import { REFERENCES } from './data/resources'
import { jtSpacing } from '../../theme'

export default function Resources() {
  return (
    <RepoLayout
      current="resources"
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
      {/* Building on existing research */}
      <Section id="building">
        <ScrollReveal
          sx={{
            position: 'relative',
            borderRadius: 1,
            overflow: 'hidden',
            border: 1,
            borderColor: 'border.subtle',
            mb: jtSpacing.section.md,
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: (theme) =>
                `linear-gradient(90deg, ${theme.palette.translucent[600]}, transparent 45%)`,
            },
          }}
        >
          <Box
            component="img"
            src={assetUrl('/images/repo/resources-hero.png')}
            alt="Aerial view of the Sacramento-San Joaquin Delta"
            loading="lazy"
            sx={{ width: '100%', display: 'block', aspectRatio: '24 / 7', objectFit: 'cover' }}
          />
        </ScrollReveal>
        <SectionHead
          eyebrow="Foundations"
          title="Building on Existing Delta Research"
          sx={{ marginBottom: jtSpacing.component.md }}
        />
        <ScrollReveal
          delay={0.06}
          sx={{
            typography: 'body2',
            maxWidth: '70ch',
            mb: jtSpacing.component.lg,
          }}
        >
          The following content is provided as a small collection of reference literature that has
          informed the research of the Just Transition project. It includes literature from a wide
          range of disciplines, and across a range of concerns and public interests in the Delta.
          All content shared here is the intellectual property of the credited authors and agencies.
        </ScrollReveal>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: jtSpacing.gap.xs,
          }}
        >
          {REFERENCES.map((r) => (
            <ScrollReveal key={r.title}>
              <ReferenceCard r={r} />
            </ScrollReveal>
          ))}
        </Box>
      </Section>

      {/* Research articles */}
      <Section id="articles" sx={{ pt: 0 }}>
        <SectionHead eyebrow="Literature" title="Research Articles" />
        <ArticleAccordion />
      </Section>

      {/* Modeling resources */}
      <Section id="modeling" bg="base.700">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: jtSpacing.gap.lg, md: jtSpacing.component.xl },
            alignItems: 'center',
          }}
        >
          <ScrollReveal
            sx={{
              bgcolor: 'common.white',
              borderRadius: 1,
              p: jtSpacing.section.sm,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Box
              component="img"
              src={assetUrl('/images/repo/cwemf.png')}
              alt="California Water & Environmental Modeling Forum (CWEMF)"
              loading="lazy"
              sx={{ maxHeight: 120, width: 'auto' }}
            />
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <Eyebrow>Modeling Resources</Eyebrow>
            <Typography
              variant="h2"
              component="h3"
              sx={{ mt: jtSpacing.component.sm, mb: jtSpacing.component.md }}
            >
              California Water &amp; Environmental Modeling Forum
            </Typography>
            <Typography variant="body1" sx={{ mb: jtSpacing.component.lg, maxWidth: '46ch' }}>
              This wiki serves as a collaborative platform for sharing information, resources, and
              documentation related to modeling efforts focused on the Delta ecosystem.
            </Typography>
            <Button
              href="#"
              variant="contained"
              color="primary"
              endIcon={<Icon name="arrow-right" size={18} />}
            >
              Model Inventory
            </Button>
          </ScrollReveal>
        </Box>
      </Section>
    </RepoLayout>
  )
}
