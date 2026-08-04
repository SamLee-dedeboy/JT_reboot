import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import { palette } from '../../../../../theme/muiTheme'
import ScenarioLoadingScreen from './ScenarioLoadingScreen'

const DATA_URL = `${import.meta.env.BASE_URL}data/regional-summary/region-scenarios.json`
const MINIMUM_LOADING_TIME = 1800
const SALINITY_COLORS = ['#7ED2E1', '#70C1D5', '#5EAAC5', '#4991B1', '#32759A', '#235C86', '#174670']
const DEVIATION_COLORS = [
  '#255C6E',
  '#5B9AAA',
  '#263638',
  '#B84872',
  '#FB0169',
]

type ViewMode = 'raw' | 'deviation'

interface Scenario {
  name: string
  values: Array<number | null>
}

interface ScenarioData {
  dates: string[]
  units: string
  regions: Array<{
    name: string
    min: number
    max: number
    scenarios: Scenario[]
  }>
}

interface RegionScenarioViewProps {
  onBack: () => void
  regionName: string
}

function formatValue(value: number) {
  return Math.round(value).toLocaleString()
}

function formatDeviation(value: number) {
  const rounded = Math.round(value)
  if (rounded === 0) return '0'
  return `${rounded > 0 ? '+' : '−'}${Math.abs(rounded).toLocaleString()}`
}

function formatLegendValue(value: number) {
  return value >= 1000
    ? `${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`
    : Math.round(value).toLocaleString()
}

function colorForValue(value: number | null, min: number, max: number) {
  if (value == null) return 'transparent'
  const logMin = Math.log10(Math.max(min, 1))
  const logMax = Math.log10(Math.max(max, min + 1))
  const position = (Math.log10(Math.max(value, 1)) - logMin) / (logMax - logMin || 1)
  const index = Math.min(
    SALINITY_COLORS.length - 1,
    Math.max(0, Math.round(Math.min(1, Math.max(0, position)) * (SALINITY_COLORS.length - 1))),
  )
  return SALINITY_COLORS[index]
}

function colorForDeviation(value: number | null, maxAbsoluteDeviation: number) {
  if (value == null) return 'transparent'
  const range = maxAbsoluteDeviation || 1
  const logRange = Math.log10(1 + range)
  const signedLogValue = Math.sign(value) * Math.log10(1 + Math.abs(value))
  const position = Math.min(1, Math.max(0, (signedLogValue + logRange) / (logRange * 2)))
  const index = Math.min(DEVIATION_COLORS.length - 1, Math.round(position * (DEVIATION_COLORS.length - 1)))
  return DEVIATION_COLORS[index]
}

const LEGEND_POSITIONS = [0, 0.25, 0.5, 0.75, 1]

function legendValues(min: number, max: number, isDeviation: boolean) {
  if (isDeviation) {
    const range = Math.max(Math.abs(min), Math.abs(max), 1)
    const logRange = Math.log10(1 + range)
    return LEGEND_POSITIONS.map((position) => {
      const signedPosition = position * 2 - 1
      return Math.sign(signedPosition) * (10 ** (Math.abs(signedPosition) * logRange) - 1)
    })
  }

  const logMin = Math.log10(Math.max(min, 1))
  const logMax = Math.log10(Math.max(max, min + 1))
  return LEGEND_POSITIONS.map((position) => 10 ** (logMin + position * (logMax - logMin)))
}

function ColorLegend({ max, min, mode }: { max: number; min: number; mode: ViewMode }) {
  const isDeviation = mode === 'deviation'
  const colors = isDeviation ? DEVIATION_COLORS : SALINITY_COLORS
  const ticks = legendValues(min, max, isDeviation)
  const formatLegend = (value: number) => isDeviation ? formatDeviation(value) : formatLegendValue(value)

  return (
    <Box sx={{ minWidth: { xs: 280, md: 460 }, width: { xs: '100%', md: '32vw' } }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.75 }}>
        <Typography sx={legendEndpointStyle}>{isDeviation ? 'Below baseline' : 'Fresher'}</Typography>
        <Typography sx={legendEndpointStyle}>{isDeviation ? 'Above baseline' : 'Saltier'}</Typography>
      </Stack>
      <Box
        sx={{
          borderRadius: 999,
          display: 'grid',
          gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))`,
          height: 11,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {colors.map((color) => (
          <Box key={color} sx={{ backgroundColor: color, boxShadow: `inset 0 0 0 1px rgba(242,240,239,.1), 0 0 8px ${color}` }} />
        ))}
        {LEGEND_POSITIONS.slice(1, -1).map((position) => (
          <Box
            aria-hidden="true"
            key={position}
            sx={{
              backgroundColor: 'rgba(242,240,239,.84)',
              bottom: -3,
              left: `${position * 100}%`,
              opacity: 0.65,
              position: 'absolute',
              top: -3,
              width: 2,
            }}
          />
        ))}
      </Box>
      <Box sx={{ height: 24, mt: 0.75, position: 'relative' }}>
        {ticks.map((value, index) => {
          const position = LEGEND_POSITIONS[index]
          const transform = position === 0
            ? 'none'
            : position === 1
              ? 'translateX(-100%)'
              : 'translateX(-50%)'

          return (
          <Typography
            component="span"
            key={position}
            sx={{
              ...legendValueStyle,
              left: `${position * 100}%`,
              position: 'absolute',
              transform,
            }}
          >
            {formatLegend(value)}
          </Typography>
          )
        })}
      </Box>
    </Box>
  )
}

const legendEndpointStyle = {
  color: palette.common.white,
  fontFamily: '"Hammersmith One", sans-serif',
  fontSize: '1.2rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
} as const

const legendValueStyle = {
  color: palette.base[200],
  fontFamily: '"Hammersmith One", sans-serif',
  fontSize: '1rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
} as const

interface ScenarioRowProps {
  activeIndex: number
  baselineValues: Array<number | null>
  index: number
  max: number
  maxAbsoluteDeviation: number
  min: number
  mode: ViewMode
  onHover: (index: number | null) => void
  scenario: Scenario
  units: string
}

function ScenarioRow({
  activeIndex,
  baselineValues,
  index,
  max,
  maxAbsoluteDeviation,
  min,
  mode,
  onHover,
  scenario,
  units,
}: ScenarioRowProps) {
  const prefersReducedMotion = useReducedMotion()
  const rawActiveValue = scenario.values[activeIndex]
  const baselineActiveValue = baselineValues[activeIndex]
  const activeValue = mode === 'deviation'
    ? rawActiveValue == null || baselineActiveValue == null
      ? null
      : rawActiveValue - baselineActiveValue
    : rawActiveValue

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const position = Math.min(0.999999, Math.max(0, (event.clientX - bounds.left) / bounds.width))
    onHover(Math.floor(position * scenario.values.length))
  }

  return (
    <Box
      component={motion.article}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: prefersReducedMotion ? 0 : 0.18 + index * 0.08, duration: 0.42 }}
      sx={{
        borderTop: index === 0 ? `1px solid ${palette.base[700]}` : `5px solid ${palette.base[900]}`,
        display: 'grid',
        gridTemplateColumns: { xs: '128px minmax(700px, 1fr)', md: '152px minmax(0, 1fr)' },
        minHeight: 112,
      }}
    >
      <Box
        sx={{
          backgroundColor: palette.base[900],
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 1.5, md: 2 },
        }}
      >
        <Typography
          component="h2"
          sx={{
            color: palette.common.white,
            fontFamily: (theme) => theme.typography.h1.fontFamily,
            fontSize: '1.5rem',
            fontWeight: 700,
            lineHeight: 1.05,
            mb: 1,
            textTransform: 'uppercase',
          }}
        >
          {scenario.name}
        </Typography>
        <Typography sx={{ color: palette.brand.primaryPink, fontSize: '0.95rem', fontWeight: 800, mt: 1 }}>
          {activeValue == null ? 'n/a' : mode === 'deviation' ? formatDeviation(activeValue) : formatValue(activeValue)} {units}
        </Typography>
      </Box>

      <Box
        aria-label={`${scenario.name} salinity time series`}
        onMouseLeave={() => onHover(null)}
        onMouseMove={handleMove}
        sx={{ cursor: 'default', overflow: 'hidden', position: 'relative' }}
      >
        <Box
          component={motion.div}
          initial={prefersReducedMotion ? false : { clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.28 + index * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          sx={{ display: 'grid', gridTemplateColumns: `repeat(${scenario.values.length}, minmax(0, 1fr))`, height: '100%' }}
        >
          {scenario.values.map((value, valueIndex) => {
            const baselineValue = baselineValues[valueIndex]
            const displayValue = mode === 'deviation'
              ? value == null || baselineValue == null
                ? null
                : value - baselineValue
              : value

            return (
            <Box
              aria-hidden="true"
              key={valueIndex}
              sx={{
                backgroundColor: mode === 'deviation'
                  ? colorForDeviation(displayValue, maxAbsoluteDeviation)
                  : colorForValue(displayValue, min, max),
                minWidth: 0,
              }}
            />
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

function RegionScenarioView({ onBack, regionName }: RegionScenarioViewProps) {
  const prefersReducedMotion = useReducedMotion()
  const [data, setData] = useState<ScenarioData | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('raw')

  useEffect(() => {
    let active = true
    let revealTimer: ReturnType<typeof setTimeout> | undefined
    const loadingStartedAt = performance.now()

    fetch(DATA_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load region scenarios (${response.status})`)
        return response.json() as Promise<ScenarioData>
      })
      .then((payload) => {
        const elapsed = performance.now() - loadingStartedAt
        revealTimer = setTimeout(() => {
          if (active) setData(payload)
        }, Math.max(0, MINIMUM_LOADING_TIME - elapsed))
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load scenario data')
        }
      })
    return () => {
      active = false
      if (revealTimer) clearTimeout(revealTimer)
    }
  }, [])

  if (loadError) {
    return (
      <Box sx={{ display: 'grid', minHeight: '100dvh', placeItems: 'center' }}>
        <Typography sx={{ color: palette.brand.primaryPink }}>{loadError}</Typography>
      </Box>
    )
  }

  if (!data) {
    return <ScenarioLoadingScreen regionName={regionName} />
  }

  const region = data.regions.find((item) => item.name === regionName)
  if (!region) {
    return (
      <Box sx={{ display: 'grid', minHeight: '100dvh', placeItems: 'center' }}>
        <Typography sx={{ color: palette.brand.primaryPink }}>
          Scenario data is unavailable for {regionName}.
        </Typography>
      </Box>
    )
  }

  const baselineValues = region.scenarios[0]?.values ?? []
  const maxAbsoluteDeviation = Math.max(
    1,
    ...region.scenarios.flatMap((scenario) =>
      scenario.values.map((value, index) => {
        const baselineValue = baselineValues[index]
        return value == null || baselineValue == null ? 0 : Math.abs(value - baselineValue)
      }),
    ),
  )
  const activeIndex = hoverIndex ?? data.dates.length - 1

  return (
    <Box
      component={motion.section}
      initial={prefersReducedMotion ? false : { clipPath: 'inset(0 0 0 100%)', opacity: 1 }}
      animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { clipPath: 'inset(0 100% 0 0)', opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.58, ease: [0.76, 0, 0.24, 1] }}
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', minWidth: 900, position: 'relative', width: '100%' }}
    >
      <Box
        sx={{
          alignItems: 'flex-end',
          display: 'flex',
          gap: 4,
          justifyContent: 'space-between',
          minHeight: 170,
          px: { xs: 2, md: 4 },
          pb: 2,
          pt: 8,
        }}
      >
        <Button
          autoFocus
          onClick={onBack}
          startIcon={<ArrowBackRoundedIcon />}
          variant="outlined"
          sx={{
            borderColor: palette.brand.primaryPink,
            color: palette.brand.primaryPink,
            flex: '0 0 auto',
            fontWeight: (theme) => theme.typography.fontWeightBold,
            '&:hover': { backgroundColor: palette.translucent.primaryPink, borderColor: palette.brand.primaryPink },
          }}
        >
          Back to briefing
        </Button>
        <Box
          component={motion.div}
          initial={prefersReducedMotion ? false : { opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: 0.4 }}
        >
          <Stack spacing={1.5} sx={{ alignItems: 'flex-end' }}>
            <ToggleButtonGroup
              exclusive
              onChange={(_, nextMode: ViewMode | null) => {
                if (nextMode) setViewMode(nextMode)
              }}
              size="small"
              value={viewMode}
              sx={{
                '& .MuiToggleButton-root': {
                  borderColor: palette.brand.primaryPink,
                  color: palette.brand.primaryPink,
                  fontFamily: '"Hammersmith One", sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  px: 2,
                  textTransform: 'uppercase',
                },
                '& .MuiToggleButton-root.Mui-selected': {
                  backgroundColor: palette.brand.primaryPink,
                  color: palette.base[900],
                  '&:hover': { backgroundColor: palette.brand.primaryPink, filter: 'brightness(1.08)' },
                },
              }}
            >
              <ToggleButton value="raw">Raw values</ToggleButton>
              <ToggleButton value="deviation">Deviation · log</ToggleButton>
            </ToggleButtonGroup>
            <ColorLegend
              max={viewMode === 'deviation' ? maxAbsoluteDeviation : region.max}
              min={viewMode === 'deviation' ? -maxAbsoluteDeviation : region.min}
              mode={viewMode}
            />
          </Stack>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', flex: 1, gridTemplateRows: 'repeat(6, minmax(112px, 1fr))', overflowX: 'auto' }}>
        {region.scenarios.map((scenario, index) => (
          <ScenarioRow
            activeIndex={activeIndex}
            baselineValues={baselineValues}
            index={index}
            key={scenario.name}
            max={region.max}
            maxAbsoluteDeviation={maxAbsoluteDeviation}
            min={region.min}
            mode={viewMode}
            onHover={setHoverIndex}
            scenario={scenario}
            units={data.units}
          />
        ))}
      </Box>
    </Box>
  )
}

export default RegionScenarioView
