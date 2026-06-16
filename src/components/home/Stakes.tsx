import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Section from '../common/Section';
import SectionHead from '../common/SectionHead';
import Reveal from '../common/Reveal';
import Icon from '../common/Icon';
import { emphasize, splitLead } from '../../utils/highlightText';
import { STAKE, DROUGHT, type StakeBlock } from '../../data/homeContent';

function ExpandableProse({ block }: { block: StakeBlock }) {
  const [open, setOpen] = useState(false);
  const [lead, rest] = splitLead(block.text);

  return (
    <Box>
      <Typography sx={{ fontSize: '1.22rem', lineHeight: 1.7 }}>
        {emphasize(lead, block.emphasize)}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 320ms ease',
          opacity: 0.85,
          mt: open ? '0.9rem' : 0,
        }}
      >
        <Box sx={{ overflow: 'hidden' }}>
          <Typography>{emphasize(rest, block.emphasize)}</Typography>
        </Box>
      </Box>
      {rest && (
        <Box
          component="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          sx={{
            mt: '1.1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.95rem',
            color: 'primary.main',
            '&:hover': { opacity: 0.8 },
          }}
        >
          {open ? 'Show less' : 'Read more'}
          <Icon name="chevron-down" size={16} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </Box>
      )}
    </Box>
  );
}

const cardSx = {
  bgcolor: 'surface',
  border: '1px solid rgba(155,162,164,0.18)',
  borderRadius: 'var(--mui-shape-borderRadius)',
  p: '1.9rem',
} as const;

const tagSx = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.55rem',
  fontFamily: 'var(--font-heading)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  fontSize: '1.1rem',
  color: 'secondary.main',
  mb: '1.2rem',
} as const;

export default function Stakes() {
  return (
    <Section id="stakes">
      <SectionHead eyebrow="Context" title="What's at Stake" />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: '1.6rem', md: '2.25rem' }, alignItems: 'start' }}>
        {[STAKE, DROUGHT].map((block, i) => (
          <Reveal key={block.tag} delay={i * 0.08} sx={cardSx}>
            <Box sx={tagSx}>
              <Icon name={block.icon} size={20} stroke="var(--mui-palette-secondary-main)" />
              {block.tag}
            </Box>
            <ExpandableProse block={block} />
          </Reveal>
        ))}
      </Box>
    </Section>
  );
}
