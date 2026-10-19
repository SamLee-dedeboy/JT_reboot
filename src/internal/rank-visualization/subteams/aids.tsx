// Small visual aids that sit beside the "What they measured" text.
//
// Each one draws the size or shape of a measurement the prose can only name:
// which months a water year covers, how long 793 days is, how 49 points split
// into three classes. They use layout and neutral tokens, with hue only where
// it repeats an encoding the page already uses (teal for the counted window).
import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

function Caption({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body2" sx={{ color: 'base.100' }}>
      {children}
    </Typography>
  )
}

function Head({ children }: { children: ReactNode }) {
  return (
    <Typography variant="chartLabel" sx={{ color: 'base.50' }}>
      {children}
    </Typography>
  )
}

/**
 * A unit that is a count of days, drawn: one point, thirty days, each day a square.
 * The pattern is fixed, not data, so the picture explains the unit, not a result.
 */
const SAMPLE_DAYS = '000001111111100000011111111111'

function DayStrip({
  heading,
  tone,
  filled,
  rest,
  scale,
}: {
  heading: string
  tone: string
  /** What a filled square means, as a short clause. */
  filled: ReactNode
  /** The sentence after the count, naming the proportion. */
  rest: ReactNode
  /** How far the team took this, in one sentence. */
  scale: string
}) {
  const count = [...SAMPLE_DAYS].filter((d) => d === '1').length
  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <Head>{heading}</Head>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gap: 0.3 }}>
        {[...SAMPLE_DAYS].map((day, i) => (
          <Box
            key={i}
            sx={{
              aspectRatio: '1 / 1',
              borderRadius: 0.3,
              bgcolor: day === '1' ? tone : 'translucent.200',
            }}
          />
        ))}
      </Box>
      <Caption>
        Each square is a day. A coloured square is {filled}. {rest}, here {count} of 30.
      </Caption>
      <Caption>{scale}</Caption>
    </Box>
  )
}

export function SuitabilityDays() {
  return (
    <DayStrip
      heading="One point, one month, one species"
      tone="salinity.teal"
      filled={
        <>
          a <Box component="strong">suitability day</Box>: salinity and temperature were both inside
          the species’ range
        </>
      }
      rest={
        <>
          The <Box component="strong">proportion</Box> is coloured squares over all squares
        </>
      }
      scale="The team did this for every day of two water years, at 145 points, for 8 species and life stages, then summarised each region."
    />
  )
}

export function LimitDays() {
  return (
    <DayStrip
      heading="One point, one month, one activity"
      tone="salinity.teal"
      filled={
        <>
          a <Box component="strong">day over the limit</Box>: the water was saltier (or, for two
          activities, warmer) than the activity tolerates
        </>
      }
      rest={
        <>
          The <Box component="strong">proportion of days over the limit</Box> is coloured squares
          over all squares
        </>
      }
      scale="The team did this for 793 days at 32 points, for four activities, and reports it by region for the whole run, the wet seasons and the dry seasons."
    />
  )
}

export function ThresholdDays() {
  return (
    <DayStrip
      heading="One intake point, one month"
      tone="salinity.teal"
      filled={
        <>
          a <Box component="strong">day over the threshold</Box>: the water at that point was
          saltier than 1,050 µS/cm, the limit for drinking water
        </>
      }
      rest={
        <>
          The <Box component="strong">proportion of days over the threshold</Box> is coloured
          squares over all squares
        </>
      }
      scale="The team did this for 793 days at 49 intake points, then pooled the points by vulnerability class."
    />
  )
}

/** 793 days against year marks, so the length of the run has a shape. */
export function RunLength({ days, points }: { days: number; points: number }) {
  const years = Math.ceil(days / 365)
  return (
    <Box sx={{ display: 'grid', gap: 0.6 }}>
      <Head>{`${days.toLocaleString('en-US')} days of daily readings at ${points} points`}</Head>
      <Box
        sx={{
          position: 'relative',
          height: 22,
          bgcolor: 'translucent.100',
          borderRadius: 0.4,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            width: `${(days / (years * 365)) * 100}%`,
            bgcolor: 'salinity.teal',
          }}
        />
        {Array.from({ length: years - 1 }, (_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${((i + 1) / years) * 100}%`,
              width: 2,
              bgcolor: 'base.900',
            }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {Array.from({ length: years + 1 }, (_, i) => (
          <Caption key={i}>{i === 0 ? 'start' : `${i} ${i === 1 ? 'year' : 'years'}`}</Caption>
        ))}
      </Box>
      <Caption>
        {`About ${Math.floor(days / 365)} years and ${Math.round((days % 365) / 30)} months, so every season appears at least twice.`}
      </Caption>
    </Box>
  )
}

/** The points as one bar, split into the classes the team sorted them into. */
export function ClassBar({
  heading,
  groups,
  caption,
}: {
  heading: string
  groups: { label: string; count: number }[]
  caption: string
}) {
  const total = groups.reduce((sum, group) => sum + group.count, 0)
  const tones = ['base.100', 'base.200', 'base.300']
  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <Head>{heading}</Head>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: groups.map((group) => `${group.count}fr`).join(' '),
          columnGap: 0.25,
          rowGap: 0.5,
        }}
      >
        {groups.map((group) => (
          <Typography key={group.label} variant="body2" sx={{ color: 'base.50' }}>
            <Box component="strong">{group.count}</Box> {group.label}
          </Typography>
        ))}
        {groups.map((group, i) => (
          <Box key={group.label} sx={{ height: 18, borderRadius: 0.4, bgcolor: tones[i % 3] }} />
        ))}
      </Box>
      <Caption>
        {total} points in all. {caption}
      </Caption>
    </Box>
  )
}

/** Steps that narrow from left to right, each a count, joined by arrows. */
export function Funnel({ steps }: { steps: { n: string; label: string; note: string }[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: steps
            .map((_, i) => `${steps.length - i + 1}fr auto`)
            .join(' ')
            .replace(/ auto$/, ''),
        },
        gap: 1,
        alignItems: 'center',
      }}
    >
      {steps.map((step, i) => (
        <Box key={step.label} sx={{ display: 'contents' }}>
          <Box
            sx={{
              display: 'grid',
              gap: 0.4,
              alignContent: 'start',
              p: 1.25,
              borderRadius: 1,
              bgcolor: 'translucent.100',
              minWidth: 0,
            }}
          >
            <Typography variant="h4" component="div" sx={{ color: 'base.50' }}>
              {step.n}
            </Typography>
            <Typography variant="body2" sx={{ color: 'base.50' }}>
              <Box component="strong">{step.label}</Box>
            </Typography>
            <Typography variant="body2" sx={{ color: 'base.100' }}>
              {step.note}
            </Typography>
          </Box>
          {i < steps.length - 1 && (
            <Typography
              variant="h4"
              component="div"
              aria-hidden
              sx={{ color: 'base.300', display: { xs: 'none', sm: 'block' } }}
            >
              →
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  )
}

/**
 * What an Economy number is, drawn: today's level and a scenario's level as two
 * bars, with the gap between them bracketed, because the gap is the number the
 * team reports. Beside it, where and when it is reported: the Delta and its four
 * zones, in a wet and a dry water year.
 */
export function DifferenceFromToday({ map }: { map: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 0.8fr)' },
        gap: 3,
        alignItems: 'start',
      }}
    >
      <Box sx={{ display: 'grid', gap: 1 }}>
        <Head>Every number is a difference from today</Head>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr',
            columnGap: 1.5,
            rowGap: 0.75,
            alignItems: 'center',
          }}
        >
          <Caption>Today</Caption>
          <Box sx={{ height: 18, borderRadius: 0.4, bgcolor: 'base.100' }} />
          <Caption>A scenario</Caption>
          <Box sx={{ position: 'relative', height: 18 }}>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                width: '58%',
                borderRadius: 0.4,
                bgcolor: 'base.100',
              }}
            />
            <Box
              sx={(theme) => ({
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '55%',
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 0.4,
                border: 1,
                borderStyle: 'dashed',
                borderColor: theme.chart.voting.below,
              })}
            >
              <Typography
                variant="body2"
                component="span"
                sx={(theme) => ({ color: theme.chart.voting.below, whiteSpace: 'nowrap' })}
              >
                the gap
              </Typography>
            </Box>
          </Box>
        </Box>
        <Caption>
          The team reports the gap, in dollars of revenue or value added, or in jobs: negative when
          a scenario leaves the farm economy smaller than today, positive when larger.
        </Caption>
      </Box>
      <Box sx={{ display: 'grid', gap: 0.75 }}>
        <Head>For 5 geographies</Head>
        <Box sx={{ maxWidth: 220 }}>{map}</Box>
        <Caption>The Delta as a whole, and its North, Central, South and West zones.</Caption>
      </Box>
      <Box sx={{ display: 'grid', gap: 0.75 }}>
        <Head>In 2 water years</Head>
        {[
          { label: '2019, wet', tone: 'base.100' },
          { label: '2020, dry', tone: 'base.300' },
        ].map((year) => (
          <Box key={year.label} sx={{ display: 'grid', gap: 0.3 }}>
            <Caption>{year.label}</Caption>
            <Box sx={{ height: 12, borderRadius: 0.4, bgcolor: year.tone }} />
          </Box>
        ))}
        <Caption>Each a full October-to-September year.</Caption>
      </Box>
    </Box>
  )
}

/**
 * What "acres restored" counts, drawn: the same stretch of land today and under
 * a scenario; the squares that turn into habitat are the acres the metric sums.
 * The pattern is fixed, not data.
 */
const LAND_AFTER = '000111100000011111000000111000'

export function AcreStrip({ types }: { types: { group: string; names: string }[] }) {
  const restored = [...LAND_AFTER].filter((d) => d === '1').length
  const row = (pattern: string) => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gap: 0.3 }}>
      {[...pattern].map((cell, i) => (
        <Box
          key={i}
          sx={{
            aspectRatio: '1 / 1',
            borderRadius: 0.3,
            bgcolor: cell === '1' ? 'salinity.teal' : 'translucent.200',
          }}
        />
      ))}
    </Box>
  )
  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <Head>One stretch of land, today and under a scenario</Head>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '90px 1fr',
          columnGap: 1.5,
          rowGap: 0.75,
          alignItems: 'center',
        }}
      >
        <Caption>Today</Caption>
        {row('0'.repeat(30))}
        <Caption>A scenario</Caption>
        {row(LAND_AFTER)}
      </Box>
      <Caption>
        Each square is a parcel. A coloured square has been <Box component="strong">restored</Box>{' '}
        to one of the habitat types the team counts; the metric is the acres those squares add up
        to, here {restored} of 30.
      </Caption>
      <Box sx={{ display: 'grid', gap: 0.25 }}>
        {types.map((type) => (
          <Caption key={type.group}>
            <Box component="strong">{type.group}:</Box> {type.names}
          </Caption>
        ))}
      </Box>
    </Box>
  )
}

/**
 * The metrics side by side, each tagged quantitative or qualitative. A
 * quantitative metric sits on a filled card and may list what is inside it; a
 * qualitative one stays on a dashed card.
 */
export function MetricCards({
  metrics,
}: {
  metrics: { label: string; counted: boolean; items?: string[] }[]
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: `repeat(${metrics.length}, 1fr)`,
        },
        gap: 1,
      }}
    >
      {metrics.map((metric) => (
        <Box
          key={metric.label}
          sx={{
            display: 'grid',
            gap: 0.75,
            alignContent: 'start',
            p: 1.25,
            borderRadius: 1,
            bgcolor: metric.counted ? 'translucent.200' : 'transparent',
            border: metric.counted ? 0 : 1,
            borderStyle: 'dashed',
            borderColor: 'border.default',
          }}
        >
          <Box
            sx={{
              justifySelf: 'start',
              px: 0.8,
              py: 0.2,
              borderRadius: 999,
              border: 1,
              borderColor: metric.counted ? 'salinity.teal' : 'border.strong',
              color: metric.counted ? 'salinity.teal' : 'base.100',
              typography: 'controlLabel',
            }}
          >
            {metric.counted ? 'Quantitative' : 'Qualitative'}
          </Box>
          <Typography variant="body2" sx={{ color: 'base.50' }}>
            <Box component="strong">{metric.label}</Box>
          </Typography>
          {metric.items && (
            <Box component="ul" sx={{ m: 0, pl: 2, display: 'grid', gap: 0.25 }}>
              {metric.items.map((item) => (
                <Typography key={item} component="li" variant="body2" sx={{ color: 'base.50' }}>
                  {item}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

/** The subteam's regions in geographic order, with the ones that have no outline marked. */
export function RegionStrip({
  regions,
  order,
}: {
  regions: { name: string; drawn: boolean }[]
  order: string
}) {
  const missing = regions.filter((region) => !region.drawn).length
  return (
    <Box sx={{ display: 'grid', gap: 0.5 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
        {regions.map((region) => (
          <Box
            key={region.name}
            sx={{
              minWidth: 96,
              minHeight: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              px: 0.4,
              borderRadius: 0.4,
              border: 1,
              borderStyle: region.drawn ? 'solid' : 'dashed',
              borderColor: region.drawn ? 'base.50' : 'border.default',
              bgcolor: region.drawn ? 'translucent.100' : 'transparent',
            }}
          >
            <Typography variant="body2" sx={{ color: region.drawn ? 'base.50' : 'base.100' }}>
              {region.name}
            </Typography>
          </Box>
        ))}
      </Box>
      <Caption>
        {missing > 0
          ? `${order}. Solid: drawn on the map. Dashed: analysed by the team, but no map outline yet.`
          : `${order}. All outlined on the map.`}
      </Caption>
    </Box>
  )
}
