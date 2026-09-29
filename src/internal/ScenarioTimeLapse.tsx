import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import Navbar from '../ui/Navbar'
import { assetUrl } from '../utils/baseUrl'

const DATA_URL = assetUrl('/data/scenario-time-lapse/scenario_region_ec_avg_avg_timeseries.json')
const SALINITY_COLORS = [
  '#7ed2e1',
  '#70c1d5',
  '#5eaac5',
  '#4991b1',
  '#32759a',
  '#235c86',
  '#174670',
]

type ScaleMode = 'log' | 'linear'

interface ScenarioTimeseries {
  name: string
  stationCount: number
  values: Array<number | null>
  mean: number | null
  min: number | null
  max: number | null
}

interface ScenarioRegion {
  name: string
  min: number
  max: number
  scenarios: ScenarioTimeseries[]
}

interface ScenarioPayload {
  metric: string
  source: string
  aggregation: string
  units: string
  dates: string[]
  min: number
  max: number
  regions: ScenarioRegion[]
}

function formatNumber(value: number | null | undefined, digits = 0) {
  if (value == null || Number.isNaN(value)) return 'n/a'
  return value.toLocaleString(undefined, { maximumFractionDigits: digits })
}

function formatLegendNumber(value: number) {
  return Math.abs(value) >= 1000 ? `${formatNumber(value / 1000, 1)}k` : formatNumber(value)
}

function formatDate(value: string | undefined) {
  if (!value) return 'n/a'
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function colorForValue(value: number | null, min: number, max: number, mode: ScaleMode) {
  if (value == null) return 'rgba(16, 22, 24, 0.82)'
  const normalized =
    mode === 'log'
      ? (Math.log10(Math.max(value, 1)) - Math.log10(Math.max(min, 1))) /
        (Math.log10(Math.max(max, min + 1)) - Math.log10(Math.max(min, 1)) || 1)
      : (value - min) / (max - min || 1)
  const index = Math.round(Math.min(1, Math.max(0, normalized)) * (SALINITY_COLORS.length - 1))
  return SALINITY_COLORS[index]
}

function ScaleButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: string
  onClick: () => void
}) {
  return (
    <Button
      aria-pressed={active}
      onClick={onClick}
      sx={{
        minWidth: 0,
        border: '1px solid',
        borderColor: active ? 'primary.main' : 'base.300',
        borderRadius: 999,
        bgcolor: active ? 'translucent.primaryGreen' : 'surface',
        color: active ? 'common.white' : 'base.100',
        typography: 'button',
        lineHeight: 1.1,
        px: 1.25,
        py: 0.72,
      }}
    >
      {children}
    </Button>
  )
}

export default function ScenarioTimeLapse() {
  const [data, setData] = useState<ScenarioPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [regionName, setRegionName] = useState('Suisun Bay')
  const [scaleMode, setScaleMode] = useState<ScaleMode>('log')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetch(DATA_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load scenario time lapse (${response.status})`)
        return response.json() as Promise<ScenarioPayload>
      })
      .then((payload) => {
        setData(payload)
        setActiveIndex(payload.dates.length - 1)
        if (!payload.regions.some((region) => region.name === 'Suisun Bay')) {
          setRegionName(payload.regions[0]?.name ?? '')
        }
      })
      .catch((reason: unknown) => {
        if ((reason as { name?: string }).name !== 'AbortError') {
          setError(reason instanceof Error ? reason.message : 'Unable to load scenario data')
        }
      })
    return () => controller.abort()
  }, [])

  const region = useMemo(
    () => data?.regions.find((item) => item.name === regionName) ?? data?.regions[0],
    [data, regionName],
  )
  const extent = useMemo(() => {
    if (!region) return { min: 1, max: 2 }
    return scaleMode === 'log'
      ? { min: Math.max(1, region.min), max: Math.max(2, region.max) }
      : { min: region.min, max: region.max }
  }, [region, scaleMode])
  const thresholds = useMemo(
    () =>
      Array.from({ length: SALINITY_COLORS.length }, (_, index) => {
        const t = index / (SALINITY_COLORS.length - 1)
        return scaleMode === 'log'
          ? 10 ** (Math.log10(extent.min) + t * (Math.log10(extent.max) - Math.log10(extent.min)))
          : extent.min + t * (extent.max - extent.min)
      }),
    [extent, scaleMode],
  )

  const setIndexFromPointer = (event: MouseEvent<HTMLElement>) => {
    if (!data) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width))
    setActiveIndex(Math.round(ratio * (data.dates.length - 1)))
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: 'base.800', color: 'common.white', minHeight: '100dvh' }}>
        <Navbar />
        <Typography sx={{ p: 5 }}>{error}</Typography>
      </Box>
    )
  }

  if (!data || !region) {
    return (
      <Box sx={{ bgcolor: 'base.900', display: 'grid', minHeight: '100dvh', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Navbar />
      <Box
        component="main"
        sx={{
          '--label-width': { xs: '190px', md: '220px' },
          '--frame-right-pad': { xs: '20px', md: '42px' },
          '--row-height': `max(86px, calc((100dvh - 330px) / ${region.scenarios.length}))`,
          bgcolor: 'base.800',
          color: 'common.white',
          minHeight: { xs: 'calc(100vh - 72px)', md: 'calc(100vh - 76px)' },
          minWidth: 980,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          component="section"
          sx={{
            alignItems: 'center',
            display: 'grid',
            gap: { xs: 2, lg: 2.5 },
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'minmax(280px, .78fr) minmax(520px, 1.7fr) minmax(360px, .9fr)',
            },
            px: { xs: '20px', md: '54px' },
            py: { xs: '22px', md: '28px' },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ lineHeight: 1, m: 0, mb: 2, textTransform: 'uppercase' }}
            >
              <Box component="span" sx={{ color: 'primary.main' }}>
                Scenario
              </Box>{' '}
              EC-Avg-Avg Time Lapse
            </Typography>
            <Typography
              variant="eyebrow"
              component="span"
              sx={{ color: 'base.100', display: 'block' }}
            >
              {formatDate(data.dates[activeIndex])}
            </Typography>
            <Typography
              variant="h4"
              component="strong"
              sx={{ display: 'block', fontWeight: 400, mt: 0.75 }}
            >
              {region.name}
            </Typography>
          </Box>

          <Box
            sx={{
              alignSelf: 'center',
              bgcolor: 'surface',
              border: '1px solid',
              borderColor: 'translucent.primaryGreen',
              borderLeft: 4,
              borderLeftColor: 'primary.main',
              borderRadius: 1,
              minWidth: 0,
              px: (theme) => theme.jtSpacing.component.md,
              py: (theme) => theme.jtSpacing.component.sm,
            }}
          >
            <Typography variant="eyebrow" component="p" sx={{ mb: 1 }}>
              Select Region
            </Typography>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
              {data.regions.map((item) => (
                <ScaleButton
                  active={item.name === region.name}
                  key={item.name}
                  onClick={() => setRegionName(item.name)}
                >
                  {item.name}
                </ScaleButton>
              ))}
            </Stack>
            <Typography variant="body2" component="p" sx={{ color: 'base.100', mb: 0, mt: 1.5 }}>
              Compare daily regional EC-AVG-AVG across all six scenarios. Each row is one scenario;
              move across the strips to inspect the same date in every row.
            </Typography>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mb: '10px' }}>
              <ScaleButton active={scaleMode === 'log'} onClick={() => setScaleMode('log')}>
                LOG
              </ScaleButton>
              <ScaleButton active={scaleMode === 'linear'} onClick={() => setScaleMode('linear')}>
                LINEAR
              </ScaleButton>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: '7px' }}>
              <Typography variant="captionSmall" component="span" sx={legendEndpointSx}>
                Fresher
              </Typography>
              <Typography variant="captionSmall" component="span" sx={legendEndpointSx}>
                Saltier
              </Typography>
            </Stack>
            <Box
              sx={{
                background: `linear-gradient(90deg, ${SALINITY_COLORS.join(',')})`,
                borderRadius: 999,
                boxShadow: 'inset 0 0 0 1px rgba(242, 240, 239, 0.1)',
                height: 11,
              }}
            />
            <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 1 }}>
              {thresholds.map((value, index) => (
                <Typography key={index} variant="captionSmall" sx={legendLabelSx}>
                  {formatLegendNumber(value)}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Box>

        <Box
          component="section"
          sx={{
            borderTop: '1px solid',
            borderColor: 'base.700',
            boxShadow: 'inset 0 30px 80px rgba(0,0,0,0.22)',
            pr: 'var(--frame-right-pad)',
          }}
        >
          {region.scenarios.map((scenario) => {
            const activeValue = scenario.values[activeIndex]
            return (
              <Box
                component="article"
                key={scenario.name}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'var(--label-width) minmax(0, 1fr)',
                  minHeight: 'var(--row-height)',
                  '& + &': { borderTop: '5px solid', borderColor: 'base.900' },
                }}
              >
                <Box
                  sx={{
                    alignContent: 'center',
                    bgcolor: 'base.900',
                    display: 'grid',
                    gap: 1,
                    pl: { xs: '20px', md: '54px' },
                    pr: 1.5,
                    py: 1.5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{ color: 'common.white', m: 0, mb: 0.5, textTransform: 'uppercase' }}
                    >
                      {scenario.name}
                    </Typography>
                    <Typography
                      color="base.300"
                      component="p"
                      variant="captionSmall"
                      sx={{ m: 0, textTransform: 'uppercase' }}
                    >
                      {scenario.stationCount} stations
                    </Typography>
                  </Box>
                  <Typography
                    color="base.100"
                    component="strong"
                    variant="captionSmall"
                    sx={{ fontWeight: 800, lineHeight: 1.2 }}
                  >
                    {formatNumber(activeValue)} {data.units.replace('uS', 'µS')}
                  </Typography>
                </Box>
                <Box
                  aria-label={`${scenario.name} daily salinity time lapse`}
                  onMouseMove={setIndexFromPointer}
                  onClick={setIndexFromPointer}
                  role="img"
                  sx={{
                    cursor: 'crosshair',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${data.dates.length}, minmax(1px, 1fr))`,
                    minHeight: 'var(--row-height)',
                    position: 'relative',
                  }}
                >
                  {scenario.values.map((value, index) => (
                    <Box
                      aria-hidden="true"
                      key={index}
                      sx={{ bgcolor: colorForValue(value, extent.min, extent.max, scaleMode) }}
                    />
                  ))}
                  <Box
                    sx={{
                      bgcolor: 'rgba(255,255,255,.7)',
                      bottom: 0,
                      left: `${(activeIndex / Math.max(1, data.dates.length - 1)) * 100}%`,
                      pointerEvents: 'none',
                      position: 'absolute',
                      top: 0,
                      width: 2,
                    }}
                  />
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </>
  )
}

const legendLabelSx = {
  color: 'base.200',
  fontWeight: 800,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
} as const

const legendEndpointSx = {
  color: 'common.white',
  fontWeight: 800,
  textTransform: 'uppercase',
} as const
