import { Box, ButtonBase, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { jtSpacing } from '../../theme'
import { InterpretationCard } from './RegionalPatternsPage'
import { usePatternEvidence } from './regionalPatternEvidence'
import { getRegionalTimelineContextPeriods } from './regionalTimelineContext'
import { datedEvents, datePosition, eventPlacement, timelineDomain } from './regionalTimeline'
import type { RegionalPattern, RegionalPlace } from './regionalSummaryData'

interface RegionalStackedTimelineProps {
  scenarioSlug: string
  scenarioTitle: string
  places: RegionalPlace[]
  /** Region highlighted on the map; its row is emphasized here. */
  focusedPlaceId: string | null
  onFocusPlace: (placeId: string) => void
}

const labelColumn = { xs: '104px', sm: '168px' }
const trackHeight = 24
const barHeight = 12

/** Water-year bands beneath the axis; the outflow comparison runs on a later period. */
function waterYearBands(scenarioSlug: string) {
  return timelineDomain(scenarioSlug).isOutflowComparison
    ? [
        { start: '2020-08-01', end: '2020-10-01', label: 'Dry year', tone: 'dry' as const },
        {
          start: '2020-10-01',
          end: '2022-01-01',
          label: 'Critical dry year',
          tone: 'critical' as const,
        },
      ]
    : [
        { start: '2018-10-01', end: '2019-10-01', label: 'Wet year', tone: 'wet' as const },
        { start: '2019-10-01', end: '2020-10-01', label: 'Dry year', tone: 'dry' as const },
        {
          start: '2020-10-01',
          end: '2020-11-29',
          label: 'Critical dry year',
          tone: 'critical' as const,
        },
      ]
}

/**
 * Every region's salinity events stacked on one simulation timeline, with seasonal or
 * operational context and water-year type underneath. Selecting a bar shows its details.
 */
export default function RegionalStackedTimeline({
  scenarioSlug,
  scenarioTitle,
  places,
  focusedPlaceId,
  onFocusPlace,
}: RegionalStackedTimelineProps) {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()
  const evidence = usePatternEvidence()
  const domain = timelineDomain(scenarioSlug)
  const contextPeriods = getRegionalTimelineContextPeriods(scenarioSlug)
  const [selected, setSelected] = useState<{ pattern: RegionalPattern; placeId: string } | null>(
    null,
  )
  const selectedPlace = places.find((place) => place.id === selected?.placeId)

  const directionColor = (direction: RegionalPattern['direction']) =>
    direction === 'fresher' ? theme.palette.salinity.teal : theme.palette.salinity.pink

  const rowLabel = (text: string) => (
    <Typography variant="captionSmall" sx={{ alignSelf: 'center', pr: 1 }}>
      {text.toUpperCase()}
    </Typography>
  )

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: `${labelColumn.xs} minmax(0, 1fr)`,
            sm: `${labelColumn.sm} minmax(0, 1fr)`,
          },
          rowGap: 0.25,
        }}
      >
        {/* One event track per region */}
        {places.map((place) => {
          const focused = place.id === focusedPlaceId
          return (
            <Box key={place.id} sx={{ display: 'contents' }}>
              <ButtonBase
                onClick={() => onFocusPlace(place.id)}
                aria-pressed={focused}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  pl: 1,
                  pr: 1,
                  borderLeft: 3,
                  borderColor: focused ? 'primary.main' : 'transparent',
                  color: focused ? 'primary.main' : 'common.white',
                  '&:hover, &.Mui-focusVisible': { color: 'primary.main' },
                }}
              >
                <Typography variant="navigationLabel">{place.name}</Typography>
              </ButtonBase>
              <Box
                sx={{
                  position: 'relative',
                  height: trackHeight,
                  bgcolor: focused ? 'translucent.100' : 'transparent',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '50%',
                    height: 1,
                    bgcolor: 'border.subtle',
                    transform: 'translateY(-50%)',
                  },
                }}
              >
                {datedEvents(place).map((pattern) => {
                  const placement = eventPlacement(pattern, domain)
                  const color = directionColor(pattern.direction)
                  const active = selected?.pattern.id === pattern.id
                  return (
                    <ButtonBase
                      key={pattern.id}
                      component={motion.button}
                      nativeButton
                      aria-pressed={active}
                      aria-label={`${place.name}: ${pattern.direction ?? 'changed'} from ${pattern.startDate} to ${pattern.endDate}`}
                      onClick={() => {
                        setSelected({ pattern, placeId: place.id })
                        onFocusPlace(place.id)
                      }}
                      initial={reduceMotion ? false : { opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' }}
                      sx={{
                        position: 'absolute',
                        left: `${placement.left}%`,
                        width: `${placement.width}%`,
                        minWidth: 10,
                        top: (trackHeight - barHeight) / 2,
                        height: barHeight,
                        zIndex: 1,
                        bgcolor: color,
                        transformOrigin: 'left center',
                        boxShadow: active ? `0 0 10px 3px ${alpha(color, 0.72)}` : 'none',
                        outline: active ? `2px solid ${theme.palette.common.white}` : 'none',
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: `0 0 10px 3px ${alpha(color, 0.72)}`,
                        },
                      }}
                    />
                  )
                })}
              </Box>
            </Box>
          )
        })}

        {/* Simulation axis */}
        <Box />
        <Box sx={{ position: 'relative', height: 34, mt: 0.5 }}>
          <Box
            sx={{ position: 'absolute', inset: '0 0 auto 0', height: 2, bgcolor: 'common.white' }}
          />
          {domain.ticks.map(([date, label], index) => (
            <Box
              key={date}
              sx={{
                position: 'absolute',
                top: 0,
                left: `${datePosition(date, domain)}%`,
                transform: index === 0 ? 'none' : 'translateX(-50%)',
                textAlign: index === 0 ? 'left' : 'center',
              }}
            >
              <Box
                sx={{ width: 2, height: 8, bgcolor: 'common.white', mx: index === 0 ? 0 : 'auto' }}
              />
              <Typography
                variant="captionSmall"
                sx={{
                  whiteSpace: 'nowrap',
                  // Quarter labels collide on phones; keep every other one.
                  display: { xs: index % 2 ? 'none' : 'block', sm: 'block' },
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Seasonal or operational context */}
        {contextPeriods.length ? (
          <>
            {rowLabel(contextPeriods[0].id.startsWith('dry-season') ? 'Season' : 'Operations')}
            <Box sx={{ position: 'relative', height: 30 }}>
              {contextPeriods.map((period) => {
                const left = datePosition(period.startDate, domain)
                const width = datePosition(period.endDate, domain) - left
                return (
                  <Box
                    key={period.id}
                    sx={{
                      position: 'absolute',
                      top: 15,
                      left: `${left}%`,
                      width: `${width}%`,
                      minWidth: 6,
                      borderTop: 1,
                      borderColor: 'brand.primaryBlue',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      overflow: 'visible',
                    }}
                  >
                    <Typography
                      variant="captionSmall"
                      sx={{
                        px: jtSpacing.component.xs,
                        bgcolor: 'base.800',
                        color: 'brand.primaryBlue',
                        transform: 'translateY(-50%)',
                        whiteSpace: 'nowrap',
                        ...(left > 75 ? { position: 'absolute', right: 0 } : {}),
                      }}
                    >
                      {period.label.toUpperCase()}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </>
        ) : null}

        {/* Water-year type */}
        {rowLabel('Water year')}
        <Box sx={{ position: 'relative', height: 30 }}>
          {waterYearBands(scenarioSlug).map((band) => {
            const left = datePosition(band.start, domain)
            const width = datePosition(band.end, domain) - left
            const color =
              band.tone === 'wet' ? theme.palette.primary.main : theme.palette.salinity.pink
            return (
              <Box
                key={band.start}
                sx={{
                  position: 'absolute',
                  top: 15,
                  left: `${left}%`,
                  width: `${width}%`,
                  borderTop: 2,
                  borderColor: color,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  minWidth: 0,
                  overflow: 'visible',
                }}
              >
                <Typography
                  variant="captionSmall"
                  noWrap
                  sx={{
                    px: jtSpacing.component.xs,
                    bgcolor: 'base.800',
                    color,
                    transform: 'translateY(-50%)',
                    ...(left > 75 ? { position: 'absolute', right: 0 } : {}),
                  }}
                >
                  {band.label.toUpperCase()}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Details for the selected event */}
      <Box sx={{ mt: jtSpacing.component.lg }}>
        {selected && selectedPlace ? (
          <InterpretationCard
            key={selected.pattern.id}
            scenarioTitle={scenarioTitle}
            placeName={selectedPlace.name}
            pattern={selected.pattern}
            evidence={evidence?.patterns[selected.pattern.id]}
          />
        ) : (
          <Box
            sx={{
              px: jtSpacing.component.md,
              py: jtSpacing.component.md,
              borderLeft: 4,
              borderColor: 'border.default',
              bgcolor: 'base.800',
            }}
          >
            <Typography variant="body2" sx={{ color: 'base.200' }}>
              Select a bar to see that event's details.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
