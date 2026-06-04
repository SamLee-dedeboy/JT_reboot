import { Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import Reveal from './Reveal';
import Eyebrow from './Eyebrow';

interface SectionHeadProps {
  eyebrow: string;
  title: React.ReactNode;
  eyebrowColor?: string;
  sx?: SxProps<Theme>;
}

/** Eyebrow + H2 heading block, matching the design's `.sec-head`. */
export default function SectionHead({ eyebrow, title, eyebrowColor, sx }: SectionHeadProps) {
  return (
    <Reveal sx={[{ mb: '2.6rem' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Eyebrow sx={{ mb: '0.7rem', color: eyebrowColor }}>{eyebrow}</Eyebrow>
      <Typography variant="h2" component="h2">{title}</Typography>
    </Reveal>
  );
}
