import { Box, Typography, useTheme } from '@mui/material';
import type { ReactNode } from 'react';
import { jtSpacing } from '../../theme/muiTheme';
import { displayItemSx, displayMetaSx } from '../common/displayStyles';

function StyleLine({ children, token = false }: { children: ReactNode; token?: boolean }) {
  return (
    <Box
      component="div"
      sx={{
        display: 'grid',
        gridTemplateColumns: '0.55rem minmax(0, 1fr)',
        gap: 0.8,
        alignItems: 'baseline',
        color: token ? 'base.100' : 'base.200',
        mb: 0.55,
      }}
    >
      <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: token ? 'primary.main' : 'base.200' }} />
      <Typography component="span" variant="caption">{children}</Typography>
    </Box>
  );
}

function ComponentMeta({ children }: { children: ReactNode }) {
  return <Box sx={displayMetaSx}>{children}</Box>;
}

export default function NumberingContent() {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: jtSpacing.gap.lg }}>
      <Box sx={displayItemSx}>
        <Box sx={{ display: 'flex', gap: jtSpacing.gap.sm, alignItems: 'baseline' }}>
          <Typography variant="numberGhost" component="span">01</Typography>
        </Box>
        <Typography variant="body2">Card corner number.</Typography>
        <ComponentMeta>
          <StyleLine token>Typography uses MUI `numberGhost` variant with Hammersmith One for card and studio ghost numbers.</StyleLine>
          <StyleLine token>Color uses `theme.numbering.color.ghost`, mapped to base.100 for AAA contrast on brand base.</StyleLine>
          <StyleLine token>Spacing between merged examples uses `theme.jtSpacing.gap.sm`.</StyleLine>
        </ComponentMeta>
      </Box>

      <Box sx={displayItemSx}>
        <Box sx={{ display: 'flex', gap: jtSpacing.gap.sm, alignItems: 'baseline' }}>
          <Typography variant="numberArticle" component="span" sx={{ width: theme.numbering.article.width }}>02</Typography>
        </Box>
        <Typography variant="body2">Article accordion index.</Typography>
        <ComponentMeta>
          <StyleLine token>Typography uses MUI `numberArticle` variant with Hammersmith One.</StyleLine>
          <StyleLine token>Color uses `theme.numbering.color.primary`, matching primary.main.</StyleLine>
          <StyleLine token>Grid column, gap, and reserved index width use `theme.numbering` tokens.</StyleLine>
        </ComponentMeta>
      </Box>

      <Box sx={displayItemSx}>
        <Box sx={{ display: 'flex', gap: jtSpacing.gap.sm, alignItems: 'baseline' }}>
          <Typography variant="numberTimeline" component="div">2025</Typography>
        </Box>
        <Typography variant="body2" >Timeline year marker.</Typography>
        <ComponentMeta>
          <StyleLine token>Typography uses MUI `numberTimeline` variant with Hammersmith One.</StyleLine>
          <StyleLine token>Color uses `theme.numbering.color.primary`, matching primary.main.</StyleLine>
        </ComponentMeta>
      </Box>

      <Box sx={displayItemSx}>
        <Box sx={{ display: 'flex', gap: jtSpacing.gap.sm, alignItems: 'baseline' }}>
          <Typography
            variant="numberBadge"
            component="span"
            sx={{
              display: 'inline-grid',
              placeItems: 'center',
              width: theme.numbering.badge.size,
              height: theme.numbering.badge.size,
              border: theme.numbering.badge.border,
              borderRadius: theme.numbering.badge.radius,
            }}
          >
          04
          </Typography>
        </Box>
        <Typography variant="body2">How It Works process bullet.</Typography>
        <ComponentMeta>
          <StyleLine token>Typography uses MUI `numberBadge` variant with Hammersmith One.</StyleLine>
          <StyleLine token>Badge dimensions, border, and radius use `theme.numbering.badge` tokens.</StyleLine>
        </ComponentMeta>
      </Box>
    </Box>
  );
}
