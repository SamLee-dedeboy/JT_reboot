import { Box, Button, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import GroupContainer from '../common/GroupContainer';
import { displayItemSx, displayMetaSx } from '../common/displayStyles';
import { TypographyPreviewItem } from '../helper';
import { type TypographyToken } from '../helperUtils';
import { jtSpacing } from '../../theme/muiTheme';

function TypographySpecimen({
  label,
  variant,
  variantName,
  content,
  action,
}: {
  label: string;
  variant: TypographyToken;
  variantName: string;
  content: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Box
      sx={{
        ...displayItemSx,
        borderLeftWidth: 1,
        borderLeftColor: 'divider',
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
      }}
    >
      <TypographyPreviewItem label={label} variant={variant} variantName={variantName} />
      <Box
        sx={{
          ...displayMetaSx,
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: jtSpacing.gap.sm,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Typography variant="caption">{content}</Typography>
        {action}
      </Box>
    </Box>
  );
}

export default function TypographyContent({ guideSx }: { guideSx?: SxProps<Theme> }) {
  const theme = useTheme();
  const typography = [
    { label: 'H1', variantName: 'h1', variant: theme.typography.h1 as TypographyToken, content: 'Page title' },
    { label: 'H2', variantName: 'h2', variant: theme.typography.h2 as TypographyToken, content: 'Section heading' },
    { label: 'H3', variantName: 'h3', variant: theme.typography.h3 as TypographyToken, content: 'Subsection heading' },
    { label: 'H4', variantName: 'h4', variant: theme.typography.h4 as TypographyToken, content: 'Small heading / Card Titles' },
    { label: 'H5', variantName: 'h5', variant: theme.typography.h5 as TypographyToken, content: 'Compact label title, used by color swatches.' },
    { label: 'Body 1', variantName: 'body1', variant: theme.typography.body1 as TypographyToken, content: 'Body text' },
    { label: 'Body 2', variantName: 'body2', variant: theme.typography.body2 as TypographyToken, content: 'Primary body text? (styles can be refined)' },
    { label: 'Caption', variantName: 'caption', variant: theme.typography.caption as TypographyToken, content: 'Image captions, disclaimers? (styles can be refined)' },
    { label: 'Caption Small', variantName: 'captionSmall', variant: theme.typography.captionSmall as TypographyToken, content: 'Compact metadata text, used by color swatch hex values.' },
    { label: 'Button', variantName: 'button', variant: theme.typography.button as TypographyToken, content: 'Button text: Hammersmith One / 300 / uppercase / 0.08em tracking / 1.15rem' },
    { label: 'Eyebrow', variantName: 'eyebrow', variant: theme.typography.eyebrow as TypographyToken, content: 'Small uppercase section label.' },
    { label: 'Logo', variantName: 'logo', variant: theme.typography.logo as TypographyToken, content: 'Logo wordmark text.' },
    { label: 'Logo Subtitle', variantName: 'logoSubtitle', variant: theme.typography.logoSubtitle as TypographyToken, content: 'Desktop logo tagline text.' },
    { label: 'Logo Hero', variantName: 'logoHero', variant: theme.typography.logoHero as TypographyToken, content: 'Hero logo text.' },
    { label: 'Number Ghost', variantName: 'numberGhost', variant: theme.typography.numberGhost as TypographyToken, content: 'Card corner and studio feature ghost number' },
    { label: 'Number Article', variantName: 'numberArticle', variant: theme.typography.numberArticle as TypographyToken, content: 'Article accordion index' },
    { label: 'Number Timeline', variantName: 'numberTimeline', variant: theme.typography.numberTimeline as TypographyToken, content: 'Timeline year marker' },
    { label: 'Number Badge', variantName: 'numberBadge', variant: theme.typography.numberBadge as TypographyToken, content: 'How It Works process bullet' },
  ];

  const typographySections = [
    {
      title: 'Heading',
      description: 'Display, section-level, and compact title styles.',
      items: typography.filter((t) => ['H1', 'H2', 'H3', 'H4', 'H5'].includes(t.label)),
    },
    {
      title: 'Text Body',
      description: 'Paragraph, supporting copy, and small-print text styles.',
      items: typography.filter((t) => ['Body 1', 'Body 2', 'Caption', 'Caption Small'].includes(t.label)),
    },
    {
      title: 'Numbering',
      description: 'Numeric display styles used by cards, accordions, timelines, and badges.',
      items: typography.filter((t) => t.label.startsWith('Number')),
    },
    {
      title: 'Button',
      description: 'Action text style used by themed buttons and button-like controls, plus logo-specific navigation text.',
      items: typography.filter((t) => ['Button', 'Eyebrow', 'Logo', 'Logo Subtitle', 'Logo Hero'].includes(t.label)),
    },
  ];

  return (
    <Box sx={{ display: 'grid', gap: jtSpacing.gap.lg, my: jtSpacing.section.sm }}>
      <Typography variant="body2" sx={{ maxWidth: '72ch' }}>
        Display rule: children inside group containers use neutral divider borders. Standalone specimens keep the green left accent for visibility.
      </Typography>
      {typographySections.map((section) => (
        <GroupContainer
          key={section.title}
          title={section.title}
          description={section.description}
          sx={guideSx}
        >
          <Box sx={{ display: 'grid', gap: jtSpacing.gap.sm }}>
            {section.items.map((t) => (
              <TypographySpecimen
                key={t.label}
                label={t.label}
                variant={t.variant}
                variantName={t.variantName}
                content={t.content}
                action={t.label === 'Button' ? <Button variant="contained" color="primary">Actual themed button</Button> : undefined}
              />
            ))}
          </Box>
        </GroupContainer>
      ))}
    </Box>
  );
}
