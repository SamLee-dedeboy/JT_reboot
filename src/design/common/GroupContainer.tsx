import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { jtSpacing } from '../../theme/muiTheme';
import { displayGroupHeaderSx, displayGroupSx } from './displayStyles';

export default function GroupContainer({
  title,
  description,
  headerAction,
  children,
  muted = false,
  sx,
}: {
  title: string;
  description?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
  muted?: boolean;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box sx={{ ...displayGroupSx, borderStyle: muted ? 'dashed' : 'solid', ...(sx ?? {}) }}>
      <Box sx={{ ...displayGroupHeaderSx, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: jtSpacing.gap.sm, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'grid', gap: jtSpacing.gap.xs, minWidth: 0 }}>
          <Typography variant="h4" component="h3" sx={{ m: 0 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ maxWidth: '64ch' }}>
              {description}
            </Typography>
          )}
        </Box>
        {headerAction}
      </Box>
      {children}
    </Box>
  );
}
