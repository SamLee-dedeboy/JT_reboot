import { Box, Button, Typography } from '@mui/material';
import Icon from '../common/Icon';
import Section from '../common/Section';
import Reveal from '../common/Reveal';
import { highlightKeywords } from '../../utils/highlightText';

const framingQuestion = {
  text: 'What if Delta communities could compare different water futures before decisions are made?',
  keywords: ['Delta communities', 'different water futures'],
};

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
];

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
        <Reveal>
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
            <Typography
              variant="h2"
              component="h2"
              sx={{ color: 'primary.main', mb: '1.15rem' }}
            >
              What if?
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: '960px',
                color: 'rgba(242,240,239,0.78)',
                fontSize: { md: '1.02rem' },
              }}
            >
              We begin by imagining more than one path forward for water, communities, and ecosystems in the Delta.
            </Typography>
          </Box>
        </Reveal>

        <Reveal delay={0.06}>
          <Box
            component="blockquote"
            sx={{
              m: 0,
              maxWidth: '1080px',
              pl: { xs: '1.2rem', md: '1.6rem' },
              borderLeft: '4px solid',
              borderColor: 'primary.main',
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
        </Reveal>

        <Reveal delay={0.12}>
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
                  color: 'rgba(242,240,239,0.84)',
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
        </Reveal>
        <Reveal delay={0.18} sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', mt: (theme) => theme.jtSpacing.component.sm }}>
            <Button
              variant="contained"
              color="primary"
              disabled
              title="Coming soon"
              endIcon={<Icon name="arrow-right" size={18} />}
            >
              View Adaptation Scenarios
            </Button>
        </Reveal>
      </Box>
    </Section>
  );
}
