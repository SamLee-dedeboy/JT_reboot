// Standalone grid of every sunburst, one row per comparison, ported from
// JT_dashboard/src/lib/Sunburst/SunburstGrid.svelte.
import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as d3 from 'd3'
import { getSunburstData } from '../../api'
import SliderToggle from './SliderToggle'
import SunburstChart from './SunburstChart'
import { buildGlobalColorMap, generateTitle, sortTopLevelAlphabetically } from './sunburstData'
import type { SunburstData, SunburstDataWithTitle } from './sunburstData'

// Each row groups a set of comparable charts. Order within a row is the
// display order left-to-right.
const rows: { key: string; files: string[] }[] = [
  {
    key: 'age',
    files: ['sunburst_age_18_35.json', 'sunburst_age_36_64.json', 'sunburst_age_65_plus.json'],
  },
  {
    key: 'years',
    files: [
      'sunburst_years_0_10_experience.json',
      'sunburst_years_11_30_experience.json',
      'sunburst_years_31_plus_experience.json',
    ],
  },
  {
    key: 'team',
    files: ['sunburst_team.json', 'sunburst_interviewees.json'],
  },
  {
    key: 'residency',
    files: ['sunburst_Resident.json', 'sunburst_Non Resident.json'],
  },
]

// Total value of a node (sum of its children, or its own value for a leaf).
const nodeTotal = (d: SunburstData): number =>
  d.children && d.children.length ? d3.sum(d.children, (c) => c.value || 0) || 0 : d.value || 0

// Keep only the top 5 parent themes AND, within each, only its top 5 child
// codes. Trimming the outer ring as well keeps the wheels readable.
function filterToTop5(data: SunburstData): SunburstData {
  if (!data.children) return data

  const topParents = [...data.children].sort((a, b) => nodeTotal(b) - nodeTotal(a)).slice(0, 5)

  return {
    ...data,
    children: topParents.map((parent) =>
      parent.children
        ? {
            ...parent,
            children: [...parent.children]
              .sort((a, b) => (b.value || 0) - (a.value || 0))
              .slice(0, 5),
          }
        : parent,
    ),
  }
}

async function loadData(): Promise<Record<string, SunburstDataWithTitle>> {
  const allData = await getSunburstData<Record<string, SunburstData>>()

  const next: Record<string, SunburstDataWithTitle> = {}
  for (const [filename, data] of Object.entries(allData)) {
    next[filename] = { data, title: generateTitle(filename), filename }
  }
  return next
}

// One labelled switch in the controls panel.
function ControlRow({
  children,
  label,
  checked,
  onChange,
}: {
  children: ReactNode
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
      <Typography variant="controlLabel">{children}</Typography>
      <SliderToggle checked={checked} onChange={onChange} label={label} />
    </Stack>
  )
}

// Current setting shown after a control's name ("Labels: new").
function ControlValue({ children }: { children: ReactNode }) {
  return (
    <Box component="span" sx={(theme) => ({ color: theme.coDesign.sunburst.textMuted })}>
      {children}
    </Box>
  )
}

export default function SunburstGrid() {
  const theme = useTheme()
  const colorPalette = theme.coDesign.sunburst.categoryPalette
  const [datasetsByFile, setDatasetsByFile] = useState<Record<string, SunburstDataWithTitle>>({})
  const [isTop5Mode, setIsTop5Mode] = useState(true)
  // Label style: true = new callout labels, false = old in-ring radial labels.
  const [useCallouts, setUseCallouts] = useState(true)
  // Slice order: true = by size (largest first), false = alphabetical (keeps a
  // theme in the same angular slot across every chart).
  const [orderBySize, setOrderBySize] = useState(true)

  // Rows resolved to the datasets that actually loaded, with the Top-5 filter
  // applied. Slice ordering is handled by the chart itself.
  const processedRows = useMemo(
    () =>
      rows.map((row) => ({
        key: row.key,
        charts: row.files
          .map((file) => datasetsByFile[file])
          .filter((d): d is SunburstDataWithTitle => d !== undefined)
          .map((d) => ({ ...d, data: isTop5Mode ? filterToTop5(d.data) : d.data })),
      })),
    [datasetsByFile, isTop5Mode],
  )

  // Rebuild the shared color map whenever the processed data changes so the same
  // category keeps the same color across every chart. Colors are assigned from an
  // alphabetically-ordered pass so they stay stable no matter how the slices are
  // ordered on screen.
  const globalColorMap = useMemo(
    () =>
      buildGlobalColorMap(
        processedRows.flatMap((r) => r.charts).map((c) => sortTopLevelAlphabetically(c.data)),
        colorPalette,
      ),
    [processedRows, colorPalette],
  )

  useEffect(() => {
    let cancelled = false
    loadData().then((next) => {
      if (!cancelled) setDatasetsByFile(next)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        // Fill the space under the dashboard header and scroll inside it.
        flex: '1 1 0',
        minHeight: 0,
        overflowY: 'auto',
        p: 3,
        color: theme.coDesign.sunburst.text,
        bgcolor: theme.coDesign.sunburst.surface,
      })}
    >
      {/* Controls */}
      <Stack
        sx={(theme) => ({
          position: 'absolute',
          top: theme.spacing(1),
          right: theme.spacing(1.5),
          zIndex: 50,
          gap: 1,
          px: 1.5,
          py: 1,
          bgcolor: theme.coDesign.sunburst.controls.background,
          border: theme.coDesign.sunburst.controls.border,
          borderRadius: theme.coDesign.sunburst.controls.radius,
          boxShadow: theme.coDesign.sunburst.controls.shadow,
        })}
      >
        {/* Label style: new callouts vs. old in-ring */}
        <ControlRow label="Callout labels" checked={useCallouts} onChange={setUseCallouts}>
          Labels: <ControlValue>{useCallouts ? 'new' : 'old'}</ControlValue>
        </ControlRow>

        {/* Slice order: size vs alphabetical */}
        <ControlRow label="Order slices by size" checked={orderBySize} onChange={setOrderBySize}>
          Order: <ControlValue>{orderBySize ? 'by size' : 'A–Z'}</ControlValue>
        </ControlRow>

        {/* Top-5 toggle */}
        <ControlRow label="Top 5 only" checked={isTop5Mode} onChange={setIsTop5Mode}>
          Top 5 only (themes + codes):
        </ControlRow>
      </Stack>

      {/* Rows: ages, years, team vs interviewee, residency */}
      <Stack sx={{ gap: 3, mt: 4 }}>
        {processedRows.map((row, rowIndex) => (
          <Stack
            key={rowIndex}
            direction="row"
            sx={(theme) => ({
              justifyContent: useCallouts && row.charts.length > 2 ? 'flex-start' : 'center',
              gap: 2,
              py: 2,
              overflowX: 'auto',
              bgcolor: theme.coDesign.sunburst.row.background,
              border: theme.coDesign.sunburst.row.border,
              borderRadius: theme.coDesign.sunburst.row.radius,
            })}
          >
            {row.charts.map((item, col) => (
              <Box
                key={col}
                sx={{ position: 'relative', flex: 1, minWidth: useCallouts ? '44rem' : '24rem' }}
              >
                <SunburstChart
                  data={item.data}
                  title={item.title}
                  index={col}
                  tooltipSide={col === row.charts.length - 1 ? 'left' : 'right'}
                  showAllLabels={true}
                  outerCallouts={useCallouts}
                  sortBySize={orderBySize}
                  colorPalette={colorPalette}
                  globalColorMap={globalColorMap}
                />
              </Box>
            ))}
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
