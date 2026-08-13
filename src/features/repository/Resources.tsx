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
            borderRadius: 'var(--mui-shape-borderRadius)',
            overflow: 'hidden',
            border: '1px solid rgba(155,162,164,0.18)',
            mb: '3.2rem',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(37,52,57,0.55), transparent 45%)',
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
        <SectionHead eyebrow="Foundations" title="Building on Existing Delta Research" />
        <ScrollReveal
          delay={0.06}
          sx={{
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: '1.6rem',
            fontSize: '1.3rem',
            lineHeight: 1.75,
            maxWidth: '70ch',
            mb: '2.6rem',
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(330px, 100%), 1fr))',
            gap: '1.3rem',
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
      <Section id="modeling" bg="base.600">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: '1.6rem', md: '2.6rem' },
            alignItems: 'center',
          }}
        >
          <ScrollReveal
            sx={{
              bgcolor: 'common.white',
              borderRadius: 'var(--mui-shape-borderRadius)',
              p: '2.2rem',
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
            <Typography variant="h2" component="h3" sx={{ mt: '0.6rem', mb: '1rem' }}>
              California Water &amp; Environmental Modeling Forum
            </Typography>
            <Typography
              sx={{ fontSize: '1.2rem', lineHeight: 1.7, mb: '1.6rem', maxWidth: '46ch' }}
            >
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
