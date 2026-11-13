import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { chartTransition, formatNumber } from '../format'
import { useCompactExplorer } from '../explorerType'
import { explorerControl } from '@/theme'
import ExplorerInfoPopover from './ExplorerInfoPopover'
import { ControlLabel, InfoButton } from './controls'

interface SalinityScaleProps {
  extent: number
  units: string
}

export default function SalinityScale({ extent, units }: SalinityScaleProps) {
  const [infoAnchor, setInfoAnchor] = useState<HTMLButtonElement | null>(null)
  const compact = useCompactExplorer()
  const bar = (
    <motion.div
      initial={{ scaleX: 0.85, opacity: 0.5 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={chartTransition}
      style={{
        height: 'var(--mui-spacing)',
        borderRadius: 'var(--mui-shape-borderRadius)',
        background:
          'linear-gradient(90deg, var(--mui-palette-salinity-teal), var(--mui-palette-base-200), var(--mui-palette-salinity-pink))',
      }}
    />
  )
  return (
    <Box sx={{ alignSelf: 'stretch', display: 'grid', minWidth: 0, width: '100%' }}>
      <ControlLabel label={compact ? 'Color scale' : 'Color scale · 90th percentile'}>
        <InfoButton label="Explain the 90th percentile color scale" onClick={setInfoAnchor} />
      </ControlLabel>
      {compact ? (
        <Box
          sx={{
            alignContent: 'center',
            display: 'grid',
            gap: 0.25,
            height: explorerControl.height,
            minWidth: 0,
          }}
        >
          {bar}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>
            <Typography
              component={motion.span}
              variant="captionSmall"
              key={`negative-${formatNumber(extent)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ color: 'common.white', fontWeight: 'bold' }}
            >
              −{formatNumber(extent)}
            </Typography>
            <Typography variant="captionSmall" sx={{ color: 'text.secondary' }}>
              {units}
            </Typography>
            <Typography
              component={motion.span}
              variant="captionSmall"
              key={`positive-${formatNumber(extent)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ color: 'common.white', fontWeight: 'bold' }}
            >
              +{formatNumber(extent)}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={(theme) => ({
            alignItems: 'center',
            display: 'grid',
            gap: theme.jtSpacing.gap.xs,
            gridTemplateColumns: 'auto minmax(2.5rem, 1fr) auto',
            height: explorerControl.height,
            minWidth: 0,
          })}
        >
          <Typography
            component={motion.span}
            variant="controlValue"
            key={`negative-${formatNumber(extent)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            sx={{ color: 'common.white', fontWeight: 'bold' }}
          >
            −{formatNumber(extent)} {units}
          </Typography>
          {bar}
          <Typography
            component={motion.span}
            variant="controlValue"
            key={`positive-${formatNumber(extent)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            sx={{ color: 'common.white', fontWeight: 'bold' }}
          >
            +{formatNumber(extent)} {units}
          </Typography>
        </Box>
      )}
      <ExplorerInfoPopover anchor={infoAnchor} onClose={() => setInfoAnchor(null)}>
        <Typography variant="caption" color="salinity.pink">
          About this color scale
        </Typography>
        <Typography variant="h5" sx={{ '&&': { color: 'brand.primaryGreen' } }}>
          Why the 90th percentile?
        </Typography>
        <Typography variant="controlValue" component="p" color="text.secondary">
          The endpoints use the 90th percentile of absolute station-day differences across the
          selected region and scenario.
        </Typography>
        <Typography variant="controlValue" component="p" color="text.secondary">
          <Box component="span" sx={{ color: 'brand.primaryGreen' }}>
            The most extreme 10% share the strongest color
          </Box>{' '}
          so outliers do not wash out differences elsewhere. Only the display scale is capped;
          underlying values remain unchanged.
        </Typography>
      </ExplorerInfoPopover>
    </Box>
  )
}
