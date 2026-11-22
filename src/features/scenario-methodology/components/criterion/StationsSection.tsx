import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { type Theme } from '@mui/material/styles'
import { NumberedHeading } from '@/ui'
import { WATERWAY_PATH } from '@/content/deltaRegions'
import { jtSpacing } from '@/theme'
import { type CriterionStations, type MapStation } from '@/content/criteria'
import { CitedText } from './citations'
import { criterionSplitSx, sectionSx } from './criterionLayout'

/** The part of the region-map frame around the stations, with room for their names. */
const VIEWBOX = { x: 180, y: 395, width: 620, height: 300 }

/** Where a station's name sits relative to its dot. */
const LABEL_OFFSET = {
  above: { dx: 0, dy: -1, anchor: 'middle' },
  below: { dx: 0, dy: 1, anchor: 'middle' },
  left: { dx: -1, dy: 0, anchor: 'end' },
  right: { dx: 1, dy: 0, anchor: 'start' },
} as const

function StationLabel({ station, size }: { station: MapStation; size: number }) {
  const theme = useTheme()
  const offset = LABEL_OFFSET[station.label]
  const gap = size * 0.9
  return (
    <text
      x={station.at[0] + offset.dx * gap}
      y={station.at[1] + offset.dy * gap}
      textAnchor={offset.anchor}
      dominantBaseline="middle"
      fontFamily={theme.typography.fontFamily}
      fontSize={size}
      fill={theme.palette.base[50]}
      stroke={theme.palette.base[900]}
      strokeWidth={size / 4}
      strokeLinejoin="round"
      paintOrder="stroke"
      pointerEvents="none"
    >
      {station.name}
    </text>
  )
}

/** The criterion's stations, by group, drawn over the Delta's channels. */
export default function StationsSection({
  stations,
  accent,
}: {
  stations: CriterionStations
  accent: string
}) {
  const theme = useTheme()
  const compactMap = useMediaQuery((t: Theme) => t.breakpoints.down('md'))
  const labelSize = compactMap ? 20 : 15
  const dotRadius = labelSize * 0.4
  const all = stations.groups.flatMap((group) => group.stations)
  return (
    <Box component="section" id="regions" aria-labelledby="regions-title" sx={sectionSx}>
      <NumberedHeading
        variant="h3"
        title="Which stations does this criterion cover?"
        id="regions-title"
        accent={accent}
      />
      <Box sx={criterionSplitSx}>
        <Stack spacing={jtSpacing.gap.md} sx={{ minWidth: 0 }}>
          <Typography variant="body1" sx={{ color: 'base.100' }}>
            <CitedText text={stations.intro} />
          </Typography>
          <Box component="dl" sx={{ m: 0, borderTop: 1, borderColor: 'border.subtle' }}>
            {stations.groups.map((group) => (
              <Box
                key={group.name}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto minmax(0, 1fr)',
                  columnGap: jtSpacing.gap.sm,
                  rowGap: jtSpacing.gap.xs,
                  alignItems: 'baseline',
                  py: jtSpacing.component.xs,
                  borderBottom: 1,
                  borderColor: 'border.subtle',
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: `accent.${group.tone}`,
                    alignSelf: 'center',
                  }}
                />
                <Typography component="dt" variant="body2" sx={{ color: 'common.white' }}>
                  {group.name}
                </Typography>
                <Typography
                  component="dd"
                  variant="body2"
                  sx={{ gridColumn: 2, m: 0, color: 'base.200' }}
                >
                  {group.stations.map((station) => station.name).join(' · ')}
                  {' — '}
                  {group.note}
                </Typography>
              </Box>
            ))}
          </Box>
          {stations.mapNote && (
            <Typography variant="caption" sx={{ color: 'base.200' }}>
              <CitedText text={stations.mapNote} />
            </Typography>
          )}
        </Stack>
        <Box
          component="svg"
          viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.width} ${VIEWBOX.height}`}
          role="img"
          aria-label={`Map of the Delta showing ${all.map((station) => station.name).join(', ')}`}
          sx={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <path d={WATERWAY_PATH} fill="currentColor" opacity={0.18} />
          {stations.groups.map((group) =>
            group.stations.map((station) => (
              <circle
                key={station.name}
                cx={station.at[0]}
                cy={station.at[1]}
                r={dotRadius}
                fill={theme.palette.accent[group.tone]}
                stroke={theme.palette.base[900]}
                strokeWidth={dotRadius / 3}
              />
            )),
          )}
          {all.map((station) => (
            <StationLabel key={`label-${station.name}`} station={station} size={labelSize} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
