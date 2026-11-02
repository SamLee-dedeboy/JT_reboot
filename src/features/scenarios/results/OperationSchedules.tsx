import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Stack, Tooltip, Typography } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import type { ReactNode } from 'react'
import gateSchedule from '../../../../public/data/operations/bolster-and-fortify-gate-schedule.json'
import releaseSchedule from '../../../../public/data/operations/calling-on-reserves-release-schedule.json'
import { jtSpacing } from '../../../theme'

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
const valueList = new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' })

const parseDate = (date: string) => new Date(`${date}T00:00:00Z`)
const formatDate = (date: string) => scheduleDate.format(parseDate(date))
const formatDateRange = (start: string, end: string) =>
  scheduleDate.formatRange(parseDate(start), parseDate(end))
const formatCfs = (cfs: number) => signedCfs.format(cfs).replace('-', '−')

const waterYears = [
  { label: 'Wet · Water year 2019', start: '2018-10-01', end: '2019-10-01', tone: 'base.400' },
  { label: 'Dry · Water year 2020', start: '2019-10-01', end: '2020-10-01', tone: 'base.500' },
  { label: 'Critical dry', start: '2020-10-01', end: '2020-11-30', tone: 'surfaceStrong' },
] as const

const waterYearColumns = waterYears
  .map(({ start, end }) => `${(toTime(end) - toTime(start)) / DAY_MS}fr`)
  .join(' ')

const axisTicks = [
  '2018-10-01',
  '2019-01-01',
  '2019-04-01',
  '2019-07-01',
  '2019-10-01',
  '2020-01-01',
  '2020-04-01',
  '2020-07-01',
  '2020-10-01',
].map((date) => {
  const parsed = parseDate(date)
  const showYear = parsed.getUTCMonth() === 0 || parsed.getUTCMonth() === 9
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

/** A closure's label stays inside the chart: the outer two align to its edges. */
const closureLabelSx = (index: number, left: number, right: number): SystemStyleObject => {
  if (index === 0) return { left: `${left}%` }
  if (index === closures.length - 1) return { right: `${100 - right}%`, textAlign: 'right' }
  return { left: `${(left + right) / 2}%`, transform: 'translateX(-50%)', textAlign: 'center' }
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

// Headroom above the tallest bar (+4,700) keeps its label clear of the water-year bands.
const CFS_MAX = 5600
const CFS_MIN = -2500
const LABELED_CFS = 600
const cfsTicks = [4000, 2000, -2000]
const RELEASE_PLOT_HEIGHT = 300

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

function LegendKey({ swatch, label }: { swatch: ReactNode; label: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      {swatch}
      <Typography variant="meta" sx={{ color: 'base.50' }}>
        {label}
      </Typography>
    </Stack>
  )
}

const swatchSx = { width: 16, height: 16, flexShrink: 0 }

/** The results period: water-year bands above and month ticks below the plot, on one time axis. */
function ScheduleTimeline({
  ariaLabel,
  gutter = 0,
  children,
}: {
  ariaLabel: string
  gutter?: number
  children: ReactNode
}) {
  return (
    <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <Box role="img" aria-label={ariaLabel} sx={{ minWidth: 900, pl: `${gutter}px` }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: waterYearColumns, columnGap: '2px' }}>
          {waterYears.map(({ label, tone }) => (
            <Box
              key={label}
              sx={{ py: 1, px: 0.5, bgcolor: tone, textAlign: 'center', whiteSpace: 'nowrap' }}
            >
              <Typography variant="meta" sx={{ color: 'common.white' }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ position: 'relative' }}>
          {axisTicks.map(({ date, left }) => (
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
          {axisTicks.map(({ date, left, label }, index) => (
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

/** Each closure as a block on the time axis, with its dates and length labeled directly. */
export function GateTimeline() {
  const description = closures
    .map(({ startDate, endDate, days }) => `${formatDateRange(startDate, endDate)}, ${days} days`)
    .join('; ')

  return (
    <ScheduleTimeline ariaLabel={`Gates closed: ${description}. Gates are open otherwise.`}>
      <Box sx={{ position: 'relative', height: 76 }}>
        {closures.map(({ id, start, end, startDate, endDate, days }, index) => (
          <Box
            key={id}
            sx={{
              position: 'absolute',
              bottom: 8,
              whiteSpace: 'nowrap',
              ...closureLabelSx(index, position(start), position(end)),
            }}
          >
            <Typography variant="cardTitle" component="p">
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

const tableHeadSx = { typography: 'columnHead', pb: jtSpacing.gap.sm, textAlign: 'left' }
const tableCellSx = { py: jtSpacing.gap.sm, pr: jtSpacing.gap.md, typography: 'body2' }

const withTimeOfDay = (date: string, time: string) => {
  if (time === '12:00') return `${formatDate(date)}, noon`
  if (time === '24:00') return `${formatDate(date)}, end of day`
  return formatDate(date)
}

/** The closures with their times of day, which the timeline leaves out. */
export function GateScheduleTable() {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <Box component="th" scope="col" sx={tableHeadSx}>
              Closed from
            </Box>
            <Box component="th" scope="col" sx={tableHeadSx}>
              Reopens
            </Box>
            <Box component="th" scope="col" sx={{ ...tableHeadSx, textAlign: 'right' }}>
              Days
            </Box>
          </tr>
        </thead>
        <tbody>
          {closures.map(({ id, startDate, startTime, endDate, endTime, reopens, days }) => (
            <Box component="tr" key={id} sx={{ borderTop: 1, borderColor: 'border.default' }}>
              <Box component="td" sx={tableCellSx}>
                {withTimeOfDay(startDate, startTime)}
              </Box>
              <Box component="td" sx={tableCellSx}>
                {reopens ? withTimeOfDay(endDate, endTime) : 'Still closed'}
              </Box>
              <Box component="td" sx={{ ...tableCellSx, pr: 0, textAlign: 'right' }}>
                {days}
              </Box>
            </Box>
          ))}
        </tbody>
      </Box>
    </Box>
  )
}

/** One bar per month: above the line is more than CalSim Base, below is less. */
export function ReleaseTimeline() {
  const zero = cfsPosition(0)

  return (
    <Stack spacing={jtSpacing.gap.sm}>
      <Stack direction="row" useFlexGap spacing={jtSpacing.gap.md} sx={{ flexWrap: 'wrap' }}>
        <LegendKey
          swatch={<Box sx={{ ...swatchSx, bgcolor: 'accent.blue' }} />}
          label="More than CalSim Base"
        />
        <LegendKey
          swatch={<Box sx={{ ...swatchSx, bgcolor: 'accent.orange' }} />}
          label="Less than CalSim Base"
        />
        <LegendKey
          swatch={<Box sx={{ width: 16, borderTop: 2, borderColor: 'base.200' }} />}
          label="No change"
        />
      </Stack>
      <ScheduleTimeline
        gutter={72}
        ariaLabel="Monthly difference in Keswick release from CalSim Base, October 2018 to November 2020. The exact periods and values are listed below the chart."
      >
        <Box sx={{ position: 'relative', height: RELEASE_PLOT_HEIGHT }}>
          {cfsTicks.map((cfs) => (
            <Box
              key={cfs}
              aria-hidden="true"
              sx={{
                position: 'absolute',
                top: `${cfsPosition(cfs)}%`,
                left: 0,
                right: 0,
                borderTop: 1,
                borderColor: 'border.subtle',
              }}
            />
          ))}
          {[...cfsTicks, 0].map((cfs) => (
            <Typography
              key={cfs}
              variant="meta"
              aria-hidden="true"
              sx={{
                position: 'absolute',
                top: `${cfsPosition(cfs)}%`,
                right: '100%',
                transform: 'translateY(-50%)',
                pr: 1,
                color: 'base.100',
                whiteSpace: 'nowrap',
              }}
            >
              {cfs === 0 ? '0' : formatCfs(cfs)}
              {cfs === cfsTicks[0] ? ' cfs' : ''}
            </Typography>
          ))}
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
                  bgcolor: cfs > 0 ? 'accent.blue' : 'accent.orange',
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
    </Stack>
  )
}

function ReleasePeriodList({ direction }: { direction: 'more' | 'less' }) {
  const periods = releasePeriods.filter((period) => period.direction === direction)

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          pb: jtSpacing.gap.xs,
          borderBottom: 1,
          borderColor: 'border.strong',
        }}
      >
        <Box
          sx={{
            ...swatchSx,
            bgcolor: direction === 'more' ? 'accent.blue' : 'accent.orange',
          }}
        />
        <Typography variant="columnHead">
          {direction === 'more' ? 'More than CalSim Base' : 'Less than CalSim Base'}
        </Typography>
      </Stack>
      {periods.map(({ id, startDate, endDate, monthlyDifferenceCfs, note }) => {
        const clipped = endDate > analysisPeriod.endDate
        const values = valueList.format(
          monthlyDifferenceCfs
            .filter((_, index) => monthStart(startDate, index) < periodEnd)
            .map(formatCfs),
        )
        return (
          <Box
            key={id}
            sx={{ py: jtSpacing.gap.sm, borderBottom: 1, borderColor: 'border.default' }}
          >
            <Typography variant="cardTitle" component="p">
              {formatDateRange(startDate, clipped ? analysisPeriod.endDate : endDate)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.25 }}>
              {values} cfs.{note ? ` ${note}` : ''}
              {clipped ? ` Continues to ${formatDate(endDate)}, after the simulation ends.` : ''}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

/** The dates and values behind the release chart. */
export function ReleasePeriods() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: jtSpacing.gap.lg,
      }}
    >
      <ReleasePeriodList direction="more" />
      <ReleasePeriodList direction="less" />
    </Box>
  )
}
