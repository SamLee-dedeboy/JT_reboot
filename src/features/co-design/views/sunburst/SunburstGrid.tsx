// Standalone grid of every sunburst, one row per comparison, ported from
// JT_dashboard/src/lib/Sunburst/SunburstGrid.svelte.
import { useEffect, useMemo, useState } from 'react'
import * as d3 from 'd3'
import { getSunburstData } from '../../api'
import SliderToggle from './SliderToggle'
import SunburstChart from './SunburstChart'
import {
  buildGlobalColorMap,
  colorPalette,
  generateTitle,
  sortTopLevelAlphabetically,
} from './sunburstData'
import type { SunburstData, SunburstDataWithTitle } from './sunburstData'
import LegacyScope from '../../shared/LegacyScope'

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

function SunburstGridView() {
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
      ),
    [processedRows],
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
    <div className="jtd-SunburstGrid min-h-screen bg-[var(--surface-elevated)] font-body overflow-y-auto relative text-white px-6 py-6">
      {/* Controls */}
      <div
        className="absolute top-2 right-3 z-50 rounded-lg shadow-md px-3 py-2 flex flex-col gap-2"
        style={{ background: 'var(--surface-elevated)' }}
      >
        {/* Label style: new callouts vs. old in-ring */}
        <div className="flex items-center justify-between gap-3 text-white">
          <span className="text-sm">
            Labels: <span className="opacity-70">{useCallouts ? 'new' : 'old'}</span>
          </span>
          <SliderToggle checked={useCallouts} onChange={setUseCallouts} />
        </div>

        {/* Slice order: size vs alphabetical */}
        <div className="flex items-center justify-between gap-3 text-white">
          <span className="text-sm">
            Order: <span className="opacity-70">{orderBySize ? 'by size' : 'A–Z'}</span>
          </span>
          <SliderToggle checked={orderBySize} onChange={setOrderBySize} />
        </div>

        {/* Top-5 toggle */}
        <div className="flex items-center justify-between gap-3 text-white">
          <span className="text-sm">Top 5 only (themes + codes):</span>
          <SliderToggle checked={isTop5Mode} onChange={setIsTop5Mode} />
        </div>
      </div>

      {/* Rows: ages, years, team vs interviewee, residency */}
      <div className="flex flex-col gap-6 mt-8">
        {processedRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex gap-4 bg-[var(--surface-page)] rounded-lg py-4 overflow-x-auto ${
              useCallouts && row.charts.length > 2 ? 'justify-start' : 'justify-center'
            }`}
          >
            {row.charts.map((item, col) => (
              <div
                key={col}
                className={`flex-1 relative ${useCallouts ? 'min-w-[44rem]' : 'min-w-[24rem]'}`}
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
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Temporary: keeps the legacy dashboard stylesheet applied until this view is restyled.
export default function SunburstGrid() {
  return (
    <LegacyScope>
      <SunburstGridView />
    </LegacyScope>
  )
}
