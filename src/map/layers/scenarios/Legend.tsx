import { Box, Stack, Typography } from '@mui/material'
import { map } from '../../../theme'
import { isOfflineMapEnabled } from '../../offlineBasemapStyle'
import { layersBySlug, type MapScope } from './config'
import { symbolSwatchSx } from './symbolSwatch'

interface LegendProps {
  scenarioSlug: string
  visible?: boolean
  selectedHabitatType?: string | null
  visibilityScope?: MapScope
}

export default function Legend({
  scenarioSlug,
  visible = true,
  selectedHabitatType,
  visibilityScope = 'delta',
}: LegendProps) {
  const offline = isOfflineMapEnabled()
  const legends = (layersBySlug[scenarioSlug] ?? [])
    .filter((source) => !(offline && source.url?.startsWith('mapbox://') && !source.offlineData))
    .filter((source) => (source.visibilityScope ?? 'delta') === visibilityScope)
    .map((source) => source.legend)
    .filter((legend): legend is NonNullable<typeof legend> => legend != null)

  if (!legends.length) return null

  return (
    <Stack
      spacing={2}
      sx={(theme) => ({
        position: 'absolute',
        zIndex: 2,
        top: (theme) => theme.spacing(theme.jtSpacing.component.sm),
        left: (theme) => theme.spacing(theme.jtSpacing.component.sm),
        // A gradient's one-line title and key need more room than a stack of swatches.
        maxWidth: `min(${legends.some((legend) => legend.gradient) ? 280 : 240}px, calc(100% - 24px))`,
        p: (theme) => theme.jtSpacing.component.sm,
        bgcolor: 'translucent.900',
        border: 1,
        borderColor: 'border.default',
        borderRadius: 1,
        backdropFilter: 'blur(10px)',
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : theme.spacing(-1),
        transition: theme.transitions.create(['opacity', 'transform'], {
          duration: map.scenarios.layerFadeDurationMs,
        }),
      })}
    >
      {legends.map((legend) => (
        <Box key={legend.title}>
          <Typography
            variant="eyebrow"
            component="p"
            // A gradient's title says it is illustrative, so it stays on small screens.
            sx={{
              display: legend.gradient ? 'block' : { xs: 'none', lg: 'block' },
              mb: 1,
              color: 'base.100',
              whiteSpace: legend.gradient ? 'nowrap' : undefined,
            }}
          >
            {legend.title}
          </Typography>
          <Stack spacing={1}>
            {legend.items.map((item) => (
              <Stack key={item.label} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 18,
                    height: 14,
                    flex: '0 0 auto',
                    ...symbolSwatchSx(item, selectedHabitatType === item.selectionKey),
                    opacity:
                      selectedHabitatType && item.selectionKey !== selectedHabitatType ? 0.25 : 1,
                  }}
                />
                <Typography
                  variant="captionSmall"
                  sx={{
                    opacity:
                      selectedHabitatType && item.selectionKey !== selectedHabitatType ? 0.45 : 1,
                  }}
                >
                  {item.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
          {legend.gradient && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', whiteSpace: 'nowrap' }}>
              <Typography variant="captionSmall">{legend.gradient.startLabel}</Typography>
              <Box
                aria-hidden="true"
                sx={{
                  flex: '1 1 auto',
                  minWidth: 40,
                  height: 10,
                  background: `linear-gradient(90deg, ${legend.gradient.colors.join(', ')})`,
                }}
              />
              <Typography variant="captionSmall">{legend.gradient.endLabel}</Typography>
            </Stack>
          )}
        </Box>
      ))}
    </Stack>
  )
}
