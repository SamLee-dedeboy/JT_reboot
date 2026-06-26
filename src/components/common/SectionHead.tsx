// Reusable section heading block that pairs an eyebrow label with an H2 title
// and the standard scroll-reveal treatment.
import { Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import ScrollReveal from '../animation/ScrollReveal';
import Eyebrow from './Eyebrow';

interface SectionHeadProps {
  eyebrow: string;
  title: React.ReactNode;
  eyebrowColor?: string;
  titleColor?: string;
  sx?: SxProps<Theme>;
}

export default function SectionHead({ eyebrow, title, eyebrowColor, titleColor, sx }: SectionHeadProps) {
  return (
    <ScrollReveal sx={[(theme) => ({ mb: theme.jtSpacing.section.md }), ...(Array.isArray(sx) ? sx : [sx])]}>
      <Eyebrow sx={(theme) => ({ mb: theme.jtSpacing.component.sm, color: eyebrowColor })}>{eyebrow}</Eyebrow>
      <Typography variant="h2" component="h2" sx={titleColor ? { '&&': { color: titleColor } } : undefined}>
        {title}
      </Typography>
    </ScrollReveal>
  );
}
