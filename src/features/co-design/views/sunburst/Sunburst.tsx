// "Comparing" view: sunburst gallery of mental-model themes by population,
// ported from JT_dashboard/src/lib/Sunburst/Sunburst.svelte.
import { useEffect, useMemo, useState } from 'react'
import * as d3 from 'd3'
import { getSunburstData } from '../../api'
import { enableDragToScroll } from './dragToScroll'
import SliderToggle from './SliderToggle'
import SunburstChart from './SunburstChart'
import {
  buildGlobalColorMap,
  colorPalette,
  generateTitle,
  sortTopLevelAlphabetically,
} from './sunburstData'
import type { SunburstData, SunburstDataWithTitle } from './sunburstData'
import './Sunburst.css'

// Display order; files not listed here are left out of the gallery.
const desiredOrder = [
  'sunburst_age_18_35.json',
  'sunburst_age_36_64.json',
  'sunburst_age_65_plus.json',
  'sunburst_years_0_10_experience.json',
  'sunburst_years_11_30_experience.json',
  'sunburst_years_31_plus_experience.json',
  'sunburst_team.json',
  'sunburst_interviewees.json',
]

function filterToTop5(data: SunburstData): SunburstData {
  if (!data.children || data.children.length <= 5) {
    return data
  }

  const sortedChildren = [...data.children]
    .sort(
      (a, b) =>
        (d3.sum(b.children || [], (d) => d.value || 0) || 0) -
        (d3.sum(a.children || [], (d) => d.value || 0) || 0),
    )
    .slice(0, 5)

  return {
    ...data,
    children: sortedChildren,
  }
}

async function loadData(): Promise<SunburstDataWithTitle[]> {
  // Fetch all sunburst data at once
  const allData = await getSunburstData<Record<string, SunburstData>>()

  // Convert the data object to an array with titles
  const unsortedDatasets = Object.entries(allData).map(([filename, data]) => ({
    data,
    title: generateTitle(filename, true),
    filename,
  }))

  // Sort according to the desired order and only include files in desiredOrder
  return desiredOrder
    .map((orderedFilename) =>
      unsortedDatasets.find((dataset) => dataset.filename === orderedFilename),
    )
    .filter((dataset) => dataset !== undefined)
}

export default function Sunburst() {
  const [sunburstDatasets, setSunburstDatasets] = useState<SunburstDataWithTitle[]>([])
  const [loaded, setLoaded] = useState(false)
  const [isTop5Mode, setIsTop5Mode] = useState(true)

  const processedDatasets = useMemo(
    () =>
      (isTop5Mode
        ? sunburstDatasets.map((item) => ({ ...item, data: filterToTop5(item.data) }))
        : sunburstDatasets
      ).map((item) => ({ ...item, data: sortTopLevelAlphabetically(item.data) })),
    [sunburstDatasets, isTop5Mode],
  )

  // Same category → same color across every chart (rebuilt with the data).
  const globalColorMap = useMemo(
    () => buildGlobalColorMap(processedDatasets.map((item) => item.data)),
    [processedDatasets],
  )

  useEffect(() => {
    let cancelled = false
    loadData().then((datasets) => {
      if (cancelled) return
      setSunburstDatasets(datasets)
      setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Drag-to-scroll is enabled once the data has loaded, as in the original.
  useEffect(() => {
    if (!loaded) return
    return enableDragToScroll(document.querySelector('.jtd-root') ?? document)
  }, [loaded])

  const rows = Array.from({ length: Math.ceil(processedDatasets.length / 2) }, (_, i) =>
    processedDatasets.slice(i * 2, i * 2 + 2),
  )

  return (
    <div className="jtd-Sunburst min-h-screen bg-[var(--surface-elevated)] font-body overflow-y-auto relative flex px-4 text-white">
      <div className="px-5 py-5 grow">
        <div
          className="absolute top-0 right-2 z-50 rounded-lg shadow-md px-3 py-2 color-white"
          style={{ background: 'var(--surface-elevated)' }}
        >
          <div className="flex items-center gap-3 text-white">
            <span className="text-sm">Show Top 5 Only:</span>
            <SliderToggle checked={isTop5Mode} onChange={setIsTop5Mode} />
          </div>
        </div>

        {/* Gallery */}
        <div className="flex flex-col gap-8 mb-8 mt-6">
          {rows.map((rowData, rowIndex) => (
            <div key={rowIndex} className="flex flex-col gap-4">
              {/* Row of two sunbursts */}
              <div className="flex justify-center gap-8 bg-[var(--surface-page)] rounded">
                {/* Descriptive text for this row */}
                <div className="max-w-4xl flex-1 mx-auto flex flex-col gap-4">
                  <div className="p-4 rounded-lg shadow-md bg-(--surface-elevated) ml-3 mt-3">
                    <div className="text-left">
                      {rowIndex === 0 ? (
                        <>
                          <h2>Age Group</h2>
                          <p className="text">
                            Compare mental model themes between{' '}
                            <span className="underline">{rowData[0]?.title || ''}</span> and{' '}
                            <span className="underline">{rowData[1]?.title || ''}</span>.
                            Participants aged 18-35 had on average less subthemes than the 36-64 age
                            group and 65 years and older group.{' '}
                            <span className="underline">
                              This suggests that mental models become more detailed or developed
                              with increasing age.{' '}
                            </span>
                            The most mentioned theme in the mental models is human impacts.
                          </p>
                        </>
                      ) : rowIndex === 1 ? (
                        <>
                          <h2>Experience of Engagement</h2>
                          <p className="text">
                            Here you can see how years of engagement in the Delta can affect mental
                            model composition.{' '}
                            <span className="underline">{rowData[0]?.title || ''}</span> versus{' '}
                            <span className="underline">{rowData[1]?.title || ''}</span> influence
                            themes people focus on.{' '}
                            <span className="underline">
                              This suggests that as engagement in the delta increases, individuals
                              learn more about the system and their conceptualizations of salinity
                              become deeper and broader as well.
                            </span>
                          </p>
                        </>
                      ) : rowIndex === 2 ? (
                        <>
                          <h2>Team vs Interviewee</h2>
                          <p className="text">
                            On average team members had 12 subthemes in their mental models, in
                            comparison interviewees had 20 subthemes on average. The top drivers of
                            salinity in the delta for both groups were flow and policy and
                            regulation. In contrast, climate change appears as the most identified
                            theme in only the team mental models.
                          </p>
                          <span className="underline">
                            This suggests that interviewees’ mental models had greater breadth than
                            research team members. While interviewees focused more on human impact
                            influences, researchers focused more on climate change and physical
                            infrastructure influences.
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                {rowData.map((item, index) => (
                  <div key={index} className="min-w-[30rem] relative">
                    <SunburstChart
                      data={item.data}
                      title={item.title}
                      index={rowIndex * 2 + index}
                      colorPalette={colorPalette}
                      globalColorMap={globalColorMap}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-[5rem]"></div>
      </div>
    </div>
  )
}
