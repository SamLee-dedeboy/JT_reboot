import { Box, Stack, Typography } from '@mui/material'
import { scenarioMapLayersBySlug } from './scenarioLayerConfig'

interface ScenarioMapLegendProps {
  scenarioSlug: string
  selectedHabitatType?: string | null
}

export default function ScenarioMapLegend({
  scenarioSlug,
  selectedHabitatType,
}: ScenarioMapLegendProps) {
  const legends = (scenarioMapLayersBySlug[scenarioSlug] ?? [])
    .map((source) => source.legend)
    .filter((legend): legend is NonNullable<typeof legend> => legend != null)

  if (!legends.length) return null

  return (
    <Stack
      spacing={2}
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: (theme) => theme.spacing(theme.jtSpacing.component.sm),
        left: (theme) => theme.spacing(theme.jtSpacing.component.sm),
        maxWidth: 'min(240px, calc(100% - 24px))',
        p: (theme) => theme.jtSpacing.component.sm,
        bgcolor: 'translucent.900',
        border: 1,
        borderColor: 'border.default',
        borderRadius: 1,
        backdropFilter: 'blur(10px)',
        pointerEvents: 'none',
      }}
    >
      {legends.map((legend) => (
        <Box key={legend.title}>
          <Typography variant="eyebrow" component="p" sx={{ mb: 1 }}>
            {legend.title}
          </Typography>
          <Stack spacing={1}>
            {legend.items.map((item) => (
              <Stack key={item.label} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 14,
                    height: item.kind === 'line' ? 3 : 14,
                    flex: '0 0 auto',
                    bgcolor: item.color,
                    border: item.kind === 'line' ? 0 : 1,
                    borderColor: item.kind === 'line' ? 'transparent' : 'common.black',
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
        </Box>
      ))}
    </Stack>
  )
}
