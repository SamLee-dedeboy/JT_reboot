// Editorial "what if" landing section that frames the project questions and
// primary calls to action.
import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import Icon from '../../../ui/Icon'
import Section from '../../../ui/Section'
import ScrollReveal from '../../../ui/animation/ScrollReveal'
import { highlightKeywords } from '../../../utils/highlightText'

const framingQuestion = {
  text: 'What if Delta communities could compare different water futures before decisions are made?',
  keywords: ['Delta communities', 'different water futures'],
}

const followUpQuestions = [
  {
    text: 'What could each future look like?',
    keywords: ['future'],
  },
  {
    text: 'Who benefits, and who carries the tradeoffs?',
    keywords: ['benefits', 'tradeoffs'],
  },
  {
    text: 'How do social and ecological needs shift across scenarios?',
    keywords: ['social and ecological needs'],
  },
  {
    text: 'How can these scenarios support a just transition?',
    keywords: ['just transition'],
  },
]

export default function WhatIfSectionEditorial() {
  return (
    <Section
      id="whatif"
      bg="base.700"
      sx={{
        py: { xs: '3.5rem', md: '5rem' },
        borderTop: '1px solid rgba(155,162,164,0.14)',
        borderBottom: '1px solid rgba(155,162,164,0.14)',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: { xs: '2rem', md: '2.6rem' },
          maxWidth: '1120px',
        }}
      >
        <ScrollReveal>
          <Box>
            <Typography
              component="p"
              sx={{
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '0.95rem',
                color: 'secondary.main',
                mb: '0.75rem',
              }}
            >
              Imagine With Us
            </Typography>
            <Typography variant="h2" component="h2" sx={{ color: 'primary.main', mb: '1.15rem' }}>
              What if?
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: '960px',
                color: 'base.100',
                fontSize: { md: '1.02rem' },
              }}
            >
              We begin by imagining more than one path forward for water, communities, and
              ecosystems in the Delta.
            </Typography>
          </Box>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <Box
            component="blockquote"
            sx={{
              m: 0,
              maxWidth: '1080px',
            }}
          >
            <Typography
              component="p"
              sx={{
                m: 0,
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.5rem, 1rem + 1.35vw, 2.35rem)',
                lineHeight: 1.22,
                color: 'common.white',
              }}
            >
              {highlightKeywords(framingQuestion.text, framingQuestion.keywords)}
            </Typography>
          </Box>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(360px, 1fr))' },
              gap: { xs: '0.85rem 1.2rem', md: '1rem 2rem' },
              maxWidth: '1080px',
            }}
          >
            {followUpQuestions.map((q, index) => (
              <Typography
                key={q.text}
                component="p"
                sx={{
                  m: 0,
                  display: 'grid',
                  gridTemplateColumns: (theme) => theme.numbering.grid.inlineTemplate,
                  gap: (theme) => theme.numbering.grid.inlineGap,
                  alignItems: 'baseline',
                  color: 'base.100',
                  fontSize: { xs: '1.08rem', md: '1.12rem' },
                  lineHeight: 1.55,
                }}
              >
                <Typography variant="numberArticle" component="span" aria-hidden>
                  {String(index + 2).padStart(2, '0')}
                </Typography>
                <Box component="span">{highlightKeywords(q.text, q.keywords)}</Box>
              </Typography>
            ))}
          </Box>
        </ScrollReveal>
        <ScrollReveal
          delay={0.18}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            mt: (theme) => theme.jtSpacing.component.sm,
          }}
        >
          <Button
            component={Link}
            to="/scenarios"
            variant="contained"
            color="primary"
            endIcon={<Icon name="arrow-right" size={18} />}
          >
            View Adaptation Scenarios
          </Button>
        </ScrollReveal>
      </Box>
    </Section>
  )
}
