import { Box, ButtonBase, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { motion, useReducedMotion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { jtSpacing, ranking } from '../../theme'
import TagChip from '../../ui/TagChip'
import { usePatternEvidence, type PatternEvidence } from './regionalPatternEvidence'
import { getRegionalTimelineContextPeriods } from './regionalTimelineContext'
import {
  datedEvents,
  datePosition,
  eventPlacement,
  timelineDomain,
  valueFormat,
} from './regionalTimeline'
import type { RegionalPattern, RegionalPlace } from './regionalSummaryData'
import { WATER_YEAR_START } from '../scenarios/content'

interface RegionalStackedTimelineProps {
  scenarioSlug: string
  places: RegionalPlace[]
  provisional?: boolean
  seaLevelRise?: boolean
  /** Region highlighted on the map; its row is emphasized here. */
  focusedPlaceId: string | null
  onFocusPlace: (placeId: string) => void
}

const labelColumn = { xs: '104px', sm: '220px' }

const legendDirections = [
  { direction: 'saltier', label: 'Saltier' },
  { direction: 'fresher', label: 'Fresher' },
] as const

/** What a row of context periods is about, beside the periods' own name. */
const contextSubjects: Record<string, string> = {
  'Higher release': 'Shasta Dam',
  'Gates closed': 'Franks Tract gates',
  'Dry Season': 'Season',
}

/** Periods closer than this share of the axis share one label, since two would collide. */
const mergeLabelsWithin = 12

const bracketHeight = 5

const dayFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})
const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
const utcDate = (date: string) => new Date(`${date}T00:00:00Z`)

function formatDateRange(start: string, end: string) {
  const [from, to] = [utcDate(start), utcDate(end)]
  const fromYear = from.getUTCFullYear() === to.getUTCFullYear() ? '' : `, ${from.getUTCFullYear()}`
  return `${dayFormat.format(from)}${fromYear} to ${dayFormat.format(to)}, ${to.getUTCFullYear()}`
}

/** A period's dates, by month where it runs whole months. */
function formatPeriod(start: string, end: string) {
  const [from, to] = [utcDate(start), utcDate(end)]
  const lastOfMonth = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth() + 1, 0)).getUTCDate()
  if (from.getUTCDate() !== 1 || to.getUTCDate() !== lastOfMonth) return formatDateRange(start, end)
  const [first, last] = [monthFormat.format(from), monthFormat.format(to)]
  const [firstYear, lastYear] = [from.getUTCFullYear(), to.getUTCFullYear()]
  if (firstYear !== lastYear) return `${first} ${firstYear}–${last} ${lastYear}`
  return first === last ? `${last} ${lastYear}` : `${first}–${last} ${lastYear}`
}

/** Periods sharing a label, naming a year they share only once. */
function joinPeriods(periods: string[]) {
  const year = periods[periods.length - 1].slice(-4)
  return periods
    .map((period, index) =>
      index < periods.length - 1 && period.endsWith(year)
        ? period.replace(/,? \d{4}$/, '')
        : period,
    )
    .join(' and ')
}

/** A label over a stretch of the axis, kept inside the axis near either end. */
function axisLabelSx(left: number, right: number) {
  const center = (left + right) / 2
  if (center < 15) return { left: `${left}%` }
  if (center > 80) return { right: `${100 - right}%`, textAlign: 'right' as const }
  return { left: `${center}%`, transform: 'translateX(-50%)', textAlign: 'center' as const }
}

/** Water years beneath the axis, with shorter names on phones; outflow runs on a later period. */
function waterYears(scenarioSlug: string) {
  return timelineDomain(scenarioSlug).isOutflowComparison
    ? [
        {
          start: WATER_YEAR_START.critical2021,
          end: WATER_YEAR_START.critical2022,
          label: 'Critical water year 2021',
          shortLabel: 'Critical 2021',
        },
        {
          start: WATER_YEAR_START.critical2022,
          end: '2022-01-01',
          label: 'Critical water year 2022',
          shortLabel: '2022',
        },
      ]
    : [
        {
          start: WATER_YEAR_START.wet2019,
          end: WATER_YEAR_START.dry2020,
          label: 'Wet water year 2019',
          shortLabel: 'Wet',
        },
        {
          start: WATER_YEAR_START.dry2020,
          end: WATER_YEAR_START.critical2021,
          label: 'Dry water year 2020',
          shortLabel: 'Dry',
        },
        {
          start: WATER_YEAR_START.critical2021,
          end: '2020-11-29',
          label: 'Critical 2021',
          shortLabel: 'Critical',
        },
      ]
}

function signed(value: number, unit: string) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${valueFormat.format(Math.abs(value))}${unit}`
}

const counted = (count: number, noun: string) => `${count} ${noun}${count === 1 ? '' : 's'}`

function EventStat({
  label,
  value,
  caption,
  color,
}: {
  label: string
  value: string
  caption?: string
  color?: string
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="columnHead" component="p" sx={{ mb: jtSpacing.gap.xs }}>
        {label}
      </Typography>
      <Typography variant="statValue" component="p" sx={{ color }}>
        {value}
      </Typography>
      {caption ? (
        <Typography variant="body2" sx={{ mt: jtSpacing.gap.xs, color: 'base.100' }}>
          {caption}
        </Typography>
      ) : null}
    </Box>
  )
}

/** The selected event: how much it differs, the EC behind that, and when it happened. */
function EventDetails({
  placeName,
  pattern,
  evidence,
}: {
  placeName: string
  pattern: RegionalPattern
  evidence?: PatternEvidence
}) {
  const reduceMotion = useReducedMotion()
  const color = pattern.direction === 'fresher' ? 'salinity.teal' : 'salinity.pink'
  const difference =
    pattern.differenceEc == null
      ? 'Unavailable'
      : [
          signed(pattern.differenceEc, ' µS/cm'),
          pattern.differencePct == null ? null : `(${signed(pattern.differencePct, '%')})`,
        ]
          .filter(Boolean)
          .join(' ')
  const ec = (value: number | null) => (value == null ? '—' : valueFormat.format(value))
  const stations = evidence?.stationEvidence.stationCount ?? pattern.stationCount
  const qualifyingDays = pattern.qualifyingDays ?? pattern.durationDays

  return (
    <Box
      component={motion.div}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.42, ease: 'easeOut' }}
    >
      <Typography variant="cardTitle" component="p" sx={{ mb: jtSpacing.gap.md }}>
        {placeName} was{' '}
        <Box component="span" sx={{ color }}>
          {pattern.direction ?? 'different'}
        </Box>
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            md: 'repeat(3, auto)',
          },
          justifyContent: 'space-between',
          gap: { xs: jtSpacing.gap.md, md: jtSpacing.gap.lg },
        }}
      >
        <EventStat label="Average difference" value={difference} color={color} />
        <EventStat
          label="EC change"
          value={`${ec(pattern.baselineEc)} → ${ec(pattern.scenarioEc)}`}
          caption={stations == null ? 'µS/cm' : `µS/cm, based on ${counted(stations, 'station')}`}
        />
        <EventStat
          label="Date range"
          value={
            pattern.startDate && pattern.endDate
              ? formatDateRange(pattern.startDate, pattern.endDate)
              : '—'
          }
          caption={
            qualifyingDays == null ? undefined : `${counted(qualifyingDays, 'qualifying day')}`
          }
        />
      </Box>
    </Box>
  )
}

/**
 * Every region's salinity events stacked on one simulation timeline, with seasonal or
 * operational context annotated above and water years bracketed beneath. Only the event bars
 * are filled, since only they can be selected.
 */
export default function RegionalStackedTimeline({
  scenarioSlug,
  places,
  provisional = false,
  seaLevelRise = false,
  focusedPlaceId,
  onFocusPlace,
}: RegionalStackedTimelineProps) {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()
  const evidence = usePatternEvidence()
  const domain = timelineDomain(scenarioSlug)
  const contextPeriods = getRegionalTimelineContextPeriods(scenarioSlug, seaLevelRise)
  const [selected, setSelected] = useState<{ pattern: RegionalPattern; placeId: string } | null>(
    null,
  )
  const selectedPlace = places.find((place) => place.id === selected?.placeId)

  const directionColor = (direction: RegionalPattern['direction']) =>
    direction === 'fresher' ? theme.palette.salinity.teal : theme.palette.salinity.pink

  const contextName = contextPeriods.find(({ label }) => label)?.label ?? ''
  const contextLabels: { left: number; right: number; dates: string[] }[] = []
  for (const { startDate, endDate } of contextPeriods) {
    const left = datePosition(startDate, domain)
    const right = datePosition(endDate, domain)
    const dates = formatPeriod(startDate, endDate)
    const previous = contextLabels[contextLabels.length - 1]
    if (previous && left - previous.right < mergeLabelsWithin) {
      previous.right = right
      previous.dates.push(dates)
    } else {
      contextLabels.push({ left, right, dates: [dates] })
    }
  }
  const years = waterYears(scenarioSlug)
  const guideEdges = contextPeriods.flatMap(({ startDate, endDate }) => [
    datePosition(startDate, domain),
    datePosition(endDate, domain),
  ])

  const rowLabel = (children: ReactNode, alignSelf: 'start' | 'end') => (
    <Typography variant="columnHead" sx={{ alignSelf, pr: 1 }}>
      {children}
    </Typography>
  )

  const directions = legendDirections.filter(({ direction }) =>
    places.some((place) =>
      datedEvents(place).some((pattern) => (pattern.direction ?? 'saltier') === direction),
    ),
  )

  return (
    <Box>
      {/* Title, and the key to the bars */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: jtSpacing.gap.md,
          mb: jtSpacing.component.md,
        }}
      >
        <Stack
          direction="row"
          spacing={jtSpacing.gap.md}
          useFlexGap
          sx={{ flexWrap: 'wrap', alignItems: 'center' }}
        >
          <Typography variant="h3" component="h3">
            Salinity pattern timeline
          </Typography>
          {provisional ? <TagChip fill="primary.main" label="PROVISIONAL" /> : null}
        </Stack>
        <Stack direction="row" spacing={jtSpacing.gap.md}>
          {directions.map(({ direction, label }) => (
            <Stack
              key={direction}
              direction="row"
              spacing={jtSpacing.gap.xs}
              sx={{ alignItems: 'center' }}
            >
              <Box
                sx={{
                  width: ranking.legend.swatchWidth,
                  borderTop: ranking.legend.swatchHeight,
                  borderColor: directionColor(direction),
                }}
              />
              <Typography variant="body2">{label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: `${labelColumn.xs} minmax(0, 1fr)`,
            sm: `${labelColumn.sm} minmax(0, 1fr)`,
          },
        }}
      >
        {/* Seasonal or operational context, written out rather than drawn as bars */}
        {contextPeriods.length ? (
          <>
            {rowLabel(
              <>
                <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                  {contextSubjects[contextName] ?? contextName}
                </Box>
                <Box component="span" sx={{ display: { md: 'none' } }}>
                  {contextName}
                </Box>
              </>,
              'end',
            )}
            <Box sx={{ position: 'relative', height: { xs: 14, md: 56 } }}>
              {contextLabels.map(({ left, right, dates }) => (
                <Box
                  key={left}
                  sx={{
                    ...axisLabelSx(left, right),
                    position: 'absolute',
                    top: 0,
                    display: { xs: 'none', md: 'block' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Typography
                    variant="captionSmall"
                    component="p"
                    sx={{ color: 'brand.primaryBlue' }}
                  >
                    {contextName}
                  </Typography>
                  <Typography variant="captionSmall" component="p">
                    {joinPeriods(dates)}
                  </Typography>
                </Box>
              ))}
              {contextPeriods.map(({ id, startDate, endDate }) => {
                const left = datePosition(startDate, domain)
                return (
                  <Box
                    key={id}
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: `${left}%`,
                      width: `${datePosition(endDate, domain) - left}%`,
                      height: bracketHeight,
                      border: 1,
                      borderBottom: 0,
                      borderColor: 'brand.primaryBlue',
                    }}
                  />
                )
              })}
            </Box>
          </>
        ) : null}

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
                  py: 0.5,
                  pr: 1,
                  borderTop: 1,
                  borderTopColor: 'border.subtle',
                  color: focused ? 'primary.main' : 'common.white',
                  '&:hover, &.Mui-focusVisible': { color: 'primary.main' },
                }}
              >
                <Typography variant="body2" sx={{ color: 'inherit' }}>
                  {place.name}
                </Typography>
              </ButtonBase>
              <Box
                sx={{
                  position: 'relative',
                  minHeight: ranking.trackHeight,
                  borderTop: 1,
                  borderColor: 'border.subtle',
                  bgcolor: focused ? 'translucent.100' : 'transparent',
                }}
              >
                {/* Where each context period starts and ends */}
                {guideEdges.map((edge, index) => (
                  <Box
                    key={index}
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `${edge}%`,
                      borderLeft: '1px dashed',
                      borderColor: 'translucent.primaryBlueStrong',
                      pointerEvents: 'none',
                    }}
                  />
                ))}
                {/* Each new water year */}
                {years.slice(1).map(({ start }) => (
                  <Box
                    key={start}
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `${datePosition(start, domain)}%`,
                      borderLeft: 1,
                      borderColor: 'border.strong',
                      pointerEvents: 'none',
                    }}
                  />
                ))}
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
                        top: '50%',
                        mt: `${-ranking.bar.height / 2}px`,
                        height: ranking.bar.height,
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
        <Box sx={{ position: 'relative', height: 34 }}>
          <Box
            sx={{
              position: 'absolute',
              inset: '0 0 auto 0',
              borderTop: 1,
              borderColor: 'base.300',
            }}
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
                sx={{
                  width: '1px',
                  height: 6,
                  bgcolor: 'base.300',
                  mx: index === 0 ? 0 : 'auto',
                }}
              />
              <Typography
                variant="captionSmall"
                sx={{
                  whiteSpace: 'nowrap',
                  // Quarter labels collide: keep every other one, and only the ends on phones.
                  display: {
                    xs: index === 0 || index === domain.ticks.length - 1 ? 'block' : 'none',
                    sm: index % 2 === 0 || index === domain.ticks.length - 1 ? 'block' : 'none',
                  },
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Water years, bracketed like the axis they belong to */}
        {rowLabel('Water year', 'start')}
        <Box sx={{ position: 'relative', height: 30 }}>
          {years.map(({ start, end, label, shortLabel }) => {
            const left = datePosition(start, domain)
            const right = datePosition(end, domain)
            return (
              <Box key={start} sx={{ display: 'contents' }}>
                <Box
                  aria-hidden="true"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: `${left}%`,
                    width: `${right - left}%`,
                    height: bracketHeight,
                    border: 1,
                    borderBottom: 0,
                    borderColor: 'base.300',
                  }}
                />
                <Typography
                  variant="captionSmall"
                  sx={{
                    ...axisLabelSx(left, right),
                    position: 'absolute',
                    top: 8,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                    {label}
                  </Box>
                  <Box component="span" sx={{ display: { md: 'none' } }}>
                    {shortLabel}
                  </Box>
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Details for the selected event */}
      <Box
        sx={{
          mt: jtSpacing.component.md,
          py: jtSpacing.component.md,
          borderTop: 1,
          borderBottom: 1,
          borderColor: 'border.strong',
        }}
      >
        {selected && selectedPlace ? (
          <EventDetails
            key={selected.pattern.id}
            placeName={selectedPlace.name}
            pattern={selected.pattern}
            evidence={evidence?.patterns[selected.pattern.id]}
          />
        ) : (
          <Typography variant="body2" sx={{ color: 'base.100' }}>
            Select a bar to see that event's details.
          </Typography>
        )}
      </Box>
    </Box>
  )
}
