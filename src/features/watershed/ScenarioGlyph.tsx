// One scenario's restored area as nested squares above the acres per landscape. The
// glyph's geometry is unchanged from the original watershed dashboard's overlay design;
// it scales down as a whole when its grid cell is narrower than the drawing.
import ForestRoundedIcon from '@mui/icons-material/ForestRounded'
import GrassRoundedIcon from '@mui/icons-material/GrassRounded'
import { Box, Stack, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { FloodplainTileIcon } from '@/ui'
import { useElementWidth } from './chartUtils'
import { HABITAT_META, LANDSCAPES, formatCompact } from './habitats'
import type { Landscape } from './types'

export interface ScenarioSegment {
  landscape: Landscape
  acres: number
  /** Share of the landscape's restorable area today, in percent. */
  percent: number
}

const MODE_LABELS: Record<Landscape, string> = {
  forests: 'Recovered area',
  meadows: 'Recovered + expanded area',
  floodplains: 'Expanded area',
}

function HabitatIcon({ landscape, size }: { landscape: Landscape; size: number }) {
  const color = HABITAT_META[landscape].baseColor
  if (landscape === 'floodplains') return <FloodplainTileIcon size={size} sx={{ color }} />
  const Icon = landscape === 'forests' ? ForestRoundedIcon : GrassRoundedIcon
  return <Icon sx={{ width: size, height: size, color }} />
}

const fullBaseSize = 96
/** The largest scenario's outer square (maximum floodplain, 577%) at full size. */
const fullLargestSide = Math.sqrt(5.77) * fullBaseSize
const originX = 64
const originY = 12

/**
 * Squares scale with the cell; the percent labels keep their type size, so they stay
 * readable in a narrow cell.
 */
function OverlayGlyph({
  segments,
  scale,
}: {
  segments: Record<Landscape, ScenarioSegment>
  scale: number
}) {
  const { forests: forest, meadows: meadow, floodplains: floodplain } = segments
  const baseSize = fullBaseSize * scale
  const frameSize = originY + fullLargestSide * scale + 8
  const labelColumnWidth = 56
  const ruleStart = 60
  const labelGap = 20
  const side = (percent: number) => Math.sqrt(Math.max(percent, 0) / 100) * baseSize
  const floodplainOuterPercent = 100 + floodplain.percent
  const floodplainSize = side(floodplainOuterPercent)
  const forestSize = side(forest.percent)
  const meadowSize = side(meadow.percent)

  const targetCallouts = [
    floodplain.percent > 0 && {
      key: 'floodplains',
      label: `${Math.round(floodplainOuterPercent)}%`,
      targetBottom: originY + floodplainSize - 8,
      showRule: false,
      color: HABITAT_META.floodplains.baseColor,
      acres: floodplain.acres,
    },
    {
      key: 'baseline',
      label: '100%',
      targetBottom: originY + baseSize - 9,
      showRule: true,
      color: 'rgba(242,240,239,0.86)',
      acres: 0,
    },
    forest.percent > 0 && {
      key: 'forests',
      label: `${Math.round(forest.percent)}%`,
      targetBottom: originY + forestSize - 8,
      showRule: false,
      color: HABITAT_META.forests.baseColor,
      acres: forest.acres,
    },
    meadow.percent > 0 && {
      key: 'meadows',
      label: `${Math.round(meadow.percent)}%`,
      targetBottom: originY + meadowSize - 8,
      showRule: false,
      color: HABITAT_META.meadows.baseColor,
      acres: meadow.acres,
    },
  ].filter((callout): callout is Exclude<typeof callout, false> => Boolean(callout))

  // Place labels bottom-up so close percentages never overlap; a stack of small
  // percentages climbs above its squares rather than piling onto the baseline.
  const callouts = [...targetCallouts]
    .sort((a, b) => a.targetBottom - b.targetBottom || a.acres - b.acres)
    .reduce<Array<(typeof targetCallouts)[number] & { labelBottom: number }>>((placed, callout) => {
      const previous = placed.at(-1)
      const minBottom = previous ? previous.labelBottom + labelGap : originY
      return [...placed, { ...callout, labelBottom: Math.max(callout.targetBottom, minBottom) }]
    }, [])

  const layers = [
    {
      key: 'floodplains',
      size: floodplain.percent > 0 ? floodplainSize : 0,
      color: HABITAT_META.floodplains.baseColor,
      opacity: 0.92,
    },
    { key: 'forests', size: forestSize, color: HABITAT_META.forests.baseColor, opacity: 1 },
    { key: 'meadows', size: meadowSize, color: HABITAT_META.meadows.baseColor, opacity: 0.86 },
  ]
    .filter((layer) => layer.size > 0)
    .sort((a, b) => b.size - a.size)

  return (
    <Box sx={{ position: 'relative', width: '100%', height: frameSize }} aria-hidden>
      {layers.map((layer) => (
        <Box
          key={layer.key}
          sx={{
            position: 'absolute',
            left: originX,
            bottom: originY,
            width: layer.size,
            height: layer.size,
            bgcolor: layer.color,
            opacity: layer.opacity,
          }}
        />
      ))}
      <Box
        sx={{
          position: 'absolute',
          left: originX,
          bottom: originY,
          width: baseSize,
          height: baseSize,
          border: '2px solid rgba(242,240,239,0.86)',
          zIndex: 2,
        }}
      />
      {callouts.map((callout) => (
        <Box key={callout.key}>
          <Typography
            variant="body2"
            component="span"
            sx={{
              position: 'absolute',
              left: 0,
              width: labelColumnWidth,
              textAlign: 'right',
              bottom: callout.labelBottom,
              color: callout.color,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {callout.label}
          </Typography>
          {callout.showRule && (
            <Box
              sx={{
                position: 'absolute',
                left: ruleStart,
                bottom: originY + baseSize - 2,
                width: originX + baseSize - ruleStart,
                borderTop: '2px solid rgba(242,240,239,0.7)',
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  )
}

/** Fits the squares to the cell's width, never enlarging them past full size. */
function ScaledGlyph({ segments }: { segments: Record<Landscape, ScenarioSegment> }) {
  // Starts at full size, until the cell has been measured.
  const [setElement, width] = useElementWidth(fullLargestSide + originX + 4)
  const scale = Math.min(1, (width - originX - 4) / fullLargestSide)

  return (
    <Box ref={setElement} sx={{ width: '100%' }}>
      <OverlayGlyph segments={segments} scale={Math.max(scale, 0.3)} />
    </Box>
  )
}

export default function ScenarioGlyph({
  segments,
  label,
}: {
  segments: Record<Landscape, ScenarioSegment>
  /** Accessible description of the scenario the glyph draws. */
  label: string
}) {
  return (
    <Stack spacing={jtSpacing.gap.sm} sx={{ minWidth: 0 }}>
      <Box role="img" aria-label={label}>
        <ScaledGlyph segments={segments} />
      </Box>
      {/* Acres restored in each landscape */}
      <Stack spacing={jtSpacing.gap.sm} sx={{ minWidth: 0 }}>
        {LANDSCAPES.map((landscape) => (
          <Stack key={landscape} spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              component="p"
              sx={{ color: 'text.secondary', m: 0, textTransform: 'uppercase' }}
            >
              {MODE_LABELS[landscape]}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                m: 0,
                color: HABITAT_META[landscape].baseColor,
              }}
            >
              <Box
                component="span"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 700 }}
              >
                <HabitatIcon landscape={landscape} size={20} />
                {HABITAT_META[landscape].label}
              </Box>
              <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
                {formatCompact(segments[landscape].acres)} acres
              </Box>
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
