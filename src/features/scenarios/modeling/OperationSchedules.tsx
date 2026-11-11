import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Tooltip, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import gateSchedule from '../../../../public/data/operations/bolster-and-fortify-gate-schedule.json'
import releaseSchedule from '../../../../public/data/operations/calling-on-reserves-release-schedule.json'
import { waterYearColor } from '../styles'
import { WATER_YEAR_START } from '../content'

const DAY_MS = 86_400_000

/** A schedule's time, where 24:00 is the end of that day. */
const toTime = (date: string, time = '00:00') =>
  time === '24:00' ? Date.parse(`${date}T00:00:00Z`) + DAY_MS : Date.parse(`${date}T${time}:00Z`)

const { analysisPeriod } = gateSchedule
const periodStart = toTime(analysisPeriod.startDate)
const periodEnd = toTime(analysisPeriod.endDate, '24:00')

/** A time's position along the results period, as a percentage. */
const position = (time: number) => ((time - periodStart) / (periodEnd - periodStart)) * 100

const scheduleDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
const tickMonth = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
const tickMonthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
const dayCount = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })
const signedCfs = new Intl.NumberFormat('en-US', { signDisplay: 'always' })

const parseDate = (date: string) => new Date(`${date}T00:00:00Z`)
const formatDateRange = (start: string, end: string) =>
  scheduleDate.formatRange(parseDate(start), parseDate(end))
const formatCfs = (cfs: number) => signedCfs.format(cfs).replace('-', '−')

const waterYears = [
  {
    label: 'Wet water year 2019',
    start: WATER_YEAR_START.wet2019,
    end: WATER_YEAR_START.dry2020,
    tone: waterYearColor.wet,
  },
  {
    label: 'Dry water year 2020',
    start: WATER_YEAR_START.dry2020,
    end: WATER_YEAR_START.critical2021,
    tone: waterYearColor.dry,
  },
  {
    label: 'Critical',
    start: WATER_YEAR_START.critical2021,
    end: '2020-11-30',
    tone: waterYearColor.critical,
  },
] as const

const waterYearColumns = waterYears
  .map(({ start, end }) => `${(toTime(end) - toTime(start)) / DAY_MS}fr`)
  .join(' ')

const axisTicks = [
  WATER_YEAR_START.wet2019,
  '2019-01-01',
  '2019-04-01',
  '2019-07-01',
  WATER_YEAR_START.dry2020,
  '2020-01-01',
  '2020-04-01',
  '2020-07-01',
  WATER_YEAR_START.critical2021,
].map((date) => {
  const parsed = parseDate(date)
  const showYear = parsed.getUTCMonth() === 9
  return {
    date,
    left: position(parsed.getTime()),
    label: (showYear ? tickMonthYear : tickMonth).format(parsed),
  }
})

const closures = gateSchedule.closures.map((closure) => {
  const start = toTime(closure.startDate, closure.startTime)
  const end = toTime(closure.endDate, closure.endTime)
  return { ...closure, start, end, days: dayCount.format((end - start) / DAY_MS) }
})

const openSpans = closures.slice(1).map((closure, index) => ({
  id: closure.id,
  center: (position(closures[index].end) + position(closure.start)) / 2,
}))

/** The labels share a row: the outer two align to the chart's edges and the rest center. */
const closureLabelAlign = (index: number) => {
  if (index === 0) return 'left'
  return index === closures.length - 1 ? 'right' : 'center'
}

interface ReleasePeriod {
  id: string
  startDate: string
  endDate: string
  monthlyDifferenceCfs: number[]
  note?: string
  direction: 'more' | 'less'
}

const releasePeriods: ReleasePeriod[] = [
  ...releaseSchedule.moreThanBau.map((period) => ({ ...period, direction: 'more' as const })),
  ...releaseSchedule.lessThanBau.map((period) => ({ ...period, direction: 'less' as const })),
]

/** The start of the month `offset` calendar months after a period's first. */
const monthStart = (startDate: string, offset: number) => {
  const first = parseDate(startDate)
  return Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + offset, 1)
}

const releaseMonths = releasePeriods
  .flatMap(({ startDate, monthlyDifferenceCfs, note }) =>
    monthlyDifferenceCfs.map((cfs, index) => ({
      start: monthStart(startDate, index),
      end: Math.min(monthStart(startDate, index + 1), periodEnd),
      cfs,
      note,
    })),
  )
  .filter(({ start }) => start < periodEnd)

/** A value label centers on its bar, unless a taller bar beside it would run through the text. */
const valueLabelPlacement = (start: number, end: number, cfs: number) =>
  releaseMonths.some((month) => month.start === end && month.cfs > cfs && cfs > 0)
    ? { left: `${position(end)}%`, transform: 'translateX(-100%)' }
    : { left: `${(position(start) + position(end)) / 2}%`, transform: 'translateX(-50%)' }

// Just enough headroom and footroom for the labels on the tallest bars (+4,700 and −2,000).
const CFS_MAX = 5600
const CFS_MIN = -2800
const LABELED_CFS = 600
const RELEASE_PLOT_HEIGHT = 240
const RELEASE_GUTTER = 96

const cfsPosition = (cfs: number) => ((CFS_MAX - cfs) / (CFS_MAX - CFS_MIN)) * 100

// Only stretches long enough to hold the words are labeled.
const labeledNoChange = releaseSchedule.noChange
  .map(({ startDate, endDate }) => ({
    id: startDate,
    start: toTime(startDate),
    end: toTime(endDate, '24:00'),
  }))
  .filter(({ start, end }) => end - start > 60 * DAY_MS)

const releaseMonthName = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** The results period: water-year bands above and month ticks below the plot, on one time axis. */
function ScheduleTimeline({
  ariaLabel,
  gutter = 0,
  compact = false,
  monthGridlines = true,
  children,
}: {
  ariaLabel: string
  gutter?: number
  /** For a narrow column: fewer month ticks, and the shortest water year goes unlabeled. */
  compact?: boolean
  monthGridlines?: boolean
  children: ReactNode
}) {
  const ticks = compact ? axisTicks.filter(({ date }) => /-(04|10)-01$/.test(date)) : axisTicks

  return (
    <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <Box
        role="img"
        aria-label={ariaLabel}
        sx={{ minWidth: compact ? 360 : 760, pl: `${gutter}px` }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: waterYearColumns, columnGap: '2px' }}>
          {waterYears.map(({ label, tone }) => (
            <Box
              key={label}
              sx={{ py: 1, px: 0.5, bgcolor: tone, textAlign: 'center', whiteSpace: 'nowrap' }}
            >
              {!(compact && label === 'Critical') && (
                <Typography variant="meta" sx={{ color: 'common.white' }}>
                  {label}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ position: 'relative' }}>
          {monthGridlines &&
            ticks.map(({ date, left }) => (
              <Box
                key={date}
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${left}%`,
                  borderLeft: 1,
                  borderColor: 'border.subtle',
                }}
              />
            ))}
          {children}
        </Box>
        <Box aria-hidden="true" sx={{ position: 'relative', height: 28, mt: 0.75 }}>
          {ticks.map(({ date, left, label }, index) => (
            <Typography
              key={date}
              variant="meta"
              sx={{
                position: 'absolute',
                left: `${left}%`,
                transform: index === 0 ? 'none' : 'translateX(-50%)',
                color: 'base.100',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

/** Each closure as a block on the time axis, numbered and labeled directly with its dates and length, all on one row. */
export function GateTimeline() {
  const description = closures
    .map(
      ({ startDate, endDate, days }, index) =>
        `closure ${index + 1}, ${formatDateRange(startDate, endDate)}, ${days} days`,
    )
    .join('; ')

  return (
    <ScheduleTimeline compact ariaLabel={`Gates closed: ${description}. Gates are open otherwise.`}>
      <Box
        sx={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${closures.length}, minmax(0, 1fr))`,
          columnGap: 1,
          pt: 1.5,
          pb: 1,
        }}
      >
        {closures.map(({ id, startDate, endDate, days }, index) => (
          <Box key={id} sx={{ textAlign: closureLabelAlign(index) }}>
            <Typography variant="columnHead" component="p" sx={{ color: 'primary.main' }}>
              Closure {index + 1}
            </Typography>
            <Typography variant="meta" component="p" sx={{ color: 'common.white' }}>
              {formatDateRange(startDate, endDate)}
            </Typography>
            <Typography variant="meta" component="p" sx={{ color: 'base.100' }}>
              {days} days
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ position: 'relative', height: 48 }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            borderTop: 2,
            borderColor: 'base.200',
          }}
        />
        {openSpans.map(({ id, center }) => (
          <Typography
            key={id}
            variant="meta"
            sx={{
              position: 'absolute',
              bottom: '50%',
              left: `${center}%`,
              transform: 'translateX(-50%)',
              pb: 0.25,
              color: 'base.100',
              whiteSpace: 'nowrap',
            }}
          >
            Gates open
          </Typography>
        ))}
        {closures.map(({ id, start, end, startDate, endDate, days, reopens }) => (
          <Tooltip
            key={id}
            title={`Gates closed ${formatDateRange(startDate, endDate)}: ${days} days`}
            placement="top"
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${position(start)}%`,
                width: `${position(end) - position(start)}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                bgcolor: 'accent.blue',
              }}
            >
              {!reopens && <ChevronRightIcon sx={{ color: 'base.900' }} />}
            </Box>
          </Tooltip>
        ))}
      </Box>
      <Typography
        variant="meta"
        component="p"
        sx={{ mt: 0.75, mb: 1.5, color: 'base.100', textAlign: 'right' }}
      >
        Still closed when the simulation ends
      </Typography>
    </ScheduleTimeline>
  )
}

/** One bar per month against CalSim Baseline, with each period shaded on the side of the zero line it moves toward. */
export function ReleaseTimeline() {
  const zero = cfsPosition(0)

  return (
    <ScheduleTimeline
      monthGridlines={false}
      gutter={RELEASE_GUTTER}
      ariaLabel="Monthly difference in Shasta Dam release from CalSim Baseline, October 2018 to November 2020, with periods of higher flow shaded above the zero line and periods of lower flow shaded below it."
    >
      <Box sx={{ position: 'relative', height: RELEASE_PLOT_HEIGHT }}>
        {releasePeriods.map(({ id, startDate, endDate, direction }) => {
          const left = position(toTime(startDate))
          const right = position(Math.min(toTime(endDate, '24:00'), periodEnd))
          return (
            <Box
              key={id}
              aria-hidden="true"
              sx={{
                position: 'absolute',
                left: `${left}%`,
                width: `${right - left}%`,
                ...(direction === 'more'
                  ? { top: 0, bottom: `${100 - zero}%` }
                  : { top: `${zero}%`, bottom: 0 }),
                bgcolor: 'translucent.100',
              }}
            />
          )
        })}
        <Typography
          variant="meta"
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: `${zero / 2}%`,
            right: '100%',
            transform: 'translateY(-50%)',
            pr: 1.5,
            color: 'primary.main',
            whiteSpace: 'nowrap',
          }}
        >
          Higher flow
        </Typography>
        <Typography
          variant="meta"
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: `${(zero + 100) / 2}%`,
            right: '100%',
            transform: 'translateY(-50%)',
            pr: 1.5,
            color: 'primary.main',
            whiteSpace: 'nowrap',
          }}
        >
          Lower flow
        </Typography>
        {releaseMonths.map(({ start, end, cfs, note }) => (
          <Tooltip
            key={start}
            placement="top"
            title={`${releaseMonthName.format(new Date(start))}: ${formatCfs(cfs)} cfs${note ? `. ${note}` : ''}`}
          >
            <Box
              sx={{
                position: 'absolute',
                left: `calc(${position(start)}% + 1px)`,
                width: `calc(${position(end) - position(start)}% - 2px)`,
                top: `${cfsPosition(Math.max(cfs, 0))}%`,
                height: `${(Math.abs(cfs) / (CFS_MAX - CFS_MIN)) * 100}%`,
                bgcolor: 'visualization.neutral',
              }}
            />
          </Tooltip>
        ))}
        {releaseMonths
          .filter(({ cfs }) => Math.abs(cfs) >= LABELED_CFS)
          .map(({ start, end, cfs }) => (
            <Typography
              key={start}
              variant="meta"
              component="strong"
              sx={[
                {
                  position: 'absolute',
                  whiteSpace: 'nowrap',
                  ...valueLabelPlacement(start, end, cfs),
                },
                cfs > 0
                  ? { bottom: `${100 - cfsPosition(cfs)}%` }
                  : { top: `${cfsPosition(cfs)}%` },
              ]}
            >
              {formatCfs(cfs)}
            </Typography>
          ))}
        {labeledNoChange.map(({ id, start, end }) => (
          <Typography
            key={id}
            variant="meta"
            sx={{
              position: 'absolute',
              bottom: `${100 - zero}%`,
              left: `${(position(start) + position(end)) / 2}%`,
              transform: 'translateX(-50%)',
              color: 'base.100',
              whiteSpace: 'nowrap',
            }}
          >
            No change
          </Typography>
        ))}
        <Box
          sx={{
            position: 'absolute',
            top: `${zero}%`,
            left: 0,
            right: 0,
            borderTop: 2,
            borderColor: 'base.200',
          }}
        />
      </Box>
    </ScheduleTimeline>
  )
}
