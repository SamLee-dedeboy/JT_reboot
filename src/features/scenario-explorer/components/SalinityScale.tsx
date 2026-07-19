import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { motion } from 'framer-motion';
import { chartTransition, formatNumber } from '../format';
import ExplorerInfoPopover from './ExplorerInfoPopover';

interface SalinityScaleProps {
  extent: number;
  units: string;
}

export default function SalinityScale({ extent, units }: SalinityScaleProps) {
  const [infoAnchor, setInfoAnchor] = useState<HTMLButtonElement | null>(null);
  return (
    <Box sx={{ alignSelf: 'stretch', display: 'grid', minWidth: 0, width: '100%' }}>
      <Box sx={(theme) => ({ alignItems: 'center', display: 'flex', gap: theme.jtSpacing.gap.xs, mb: theme.jtSpacing.component.xs })}>
        <Typography variant="caption" color="text.secondary" noWrap>Color scale · 90th percentile</Typography>
        <IconButton aria-label="Explain the 90th percentile color scale" onClick={(event) => setInfoAnchor(event.currentTarget)} size="small" sx={{ color: 'text.secondary', p: 0 }}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={(theme) => ({ alignItems: 'center', display: 'grid', gap: theme.jtSpacing.gap.xs, gridTemplateColumns: 'auto minmax(5rem, 1fr) auto', height: theme.spacing(5) })}>
        <Typography component={motion.span} variant="captionSmall" key={`negative-${formatNumber(extent)}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ color: 'common.white', fontWeight: 'bold' }}>
          −{formatNumber(extent)} {units}
        </Typography>
        <motion.div
          initial={{ scaleX: 0.85, opacity: 0.5 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={chartTransition}
          style={{ height: 'var(--mui-spacing)', borderRadius: 'var(--mui-shape-borderRadius)', background: 'linear-gradient(90deg, var(--mui-palette-salinity-teal), var(--mui-palette-base-200), var(--mui-palette-salinity-pink))' }}
        />
        <Typography component={motion.span} variant="captionSmall" key={`positive-${formatNumber(extent)}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ color: 'common.white', fontWeight: 'bold' }}>
          +{formatNumber(extent)} {units}
        </Typography>
      </Box>
      <ExplorerInfoPopover anchor={infoAnchor} onClose={() => setInfoAnchor(null)}>
        <Typography variant="caption" color="salinity.pink">About this color scale</Typography>
        <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryGreen' } }}>Why the 90th percentile?</Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          The endpoints use the 90th percentile of absolute station-day differences across the selected region and scenario.
        </Typography>
        <Typography variant="captionSmall" component="p" color="text.secondary">
          <Box component="span" sx={{ color: 'brand.primaryGreen' }}>The most extreme 10% share the strongest color</Box> so outliers do not wash out differences elsewhere. Only the display scale is capped; underlying values remain unchanged.
        </Typography>
      </ExplorerInfoPopover>
    </Box>
  );
}
