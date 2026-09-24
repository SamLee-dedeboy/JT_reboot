// "Comparing" view: sunburst gallery of mental-model themes by population,
// ported from JT_dashboard/src/lib/Sunburst/Sunburst.svelte.
import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import * as d3 from 'd3'
import { getSunburstData } from '../../api'
import { enableDragToScroll } from './dragToScroll'
import SliderToggle from './SliderToggle'
import SunburstChart from './SunburstChart'
import { buildGlobalColorMap, generateTitle, sortTopLevelAlphabetically } from './sunburstData'
import type { SunburstData, SunburstDataWithTitle } from './sunburstData'

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

// Underlined key phrase in a row's descriptive copy.
function Underline({ children }: { children: ReactNode }) {
  return (
    <Box
      component="span"
      sx={(theme) => ({
        textDecoration: 'underline',
        textDecorationColor: theme.coDesign.sunburst.textPanel.underline,
        textUnderlineOffset: '0.15em',
      })}
    >
      {children}
    </Box>
  )
}

// Heading + copy for one comparison row.
function RowText({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {children}
    </>
  )
}

export default function Sunburst() {
  const theme = useTheme()
  const colorPalette = theme.coDesign.sunburst.categoryPalette
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
    () =>
      buildGlobalColorMap(
        processedDatasets.map((item) => item.data),
        colorPalette,
      ),
    [processedDatasets, colorPalette],
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

  // Drag-to-scroll on the view's scroll container, enabled once the data has
  // loaded, as in the original.
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!loaded || !scrollRef.current) return
    return enableDragToScroll(scrollRef.current)
  }, [loaded])

  const rows = Array.from({ length: Math.ceil(processedDatasets.length / 2) }, (_, i) =>
    processedDatasets.slice(i * 2, i * 2 + 2),
  )

  const copy = (children: ReactNode) => (
    <Typography variant="cardBody" component="p">
      {children}
    </Typography>
  )

  return (
    <Box
      ref={scrollRef}
      sx={(theme) => ({
        position: 'relative',
        display: 'flex',
        // Fill the space under the dashboard header and scroll inside it.
        flex: '1 1 0',
        minHeight: 0,
        overflowY: 'auto',
        px: 2,
        color: theme.coDesign.sunburst.text,
        bgcolor: theme.coDesign.sunburst.surface,
      })}
    >
      <Box sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Top-5 filter, pinned to the top-right corner */}
        <Stack
          direction="row"
          sx={(theme) => ({
            position: 'absolute',
            top: 0,
            right: theme.spacing(1),
            zIndex: 50,
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 1,
            bgcolor: theme.coDesign.sunburst.controls.background,
            border: theme.coDesign.sunburst.controls.border,
            borderRadius: theme.coDesign.sunburst.controls.radius,
            boxShadow: theme.coDesign.sunburst.controls.shadow,
          })}
        >
          <Typography variant="controlLabel">Show Top 5 Only:</Typography>
          <SliderToggle checked={isTop5Mode} onChange={setIsTop5Mode} label="Show top 5 only" />
        </Stack>

        {/* Gallery */}
        <Stack sx={{ gap: 4, mb: 4, mt: 3 }}>
          {rows.map((rowData, rowIndex) => (
            <Stack key={rowIndex} sx={{ gap: 2 }}>
              {/* Row: descriptive text, then two sunbursts */}
              <Stack
                direction="row"
                sx={(theme) => ({
                  justifyContent: 'center',
                  gap: 4,
                  bgcolor: theme.coDesign.sunburst.row.background,
                  border: theme.coDesign.sunburst.row.border,
                  borderRadius: theme.coDesign.sunburst.row.radius,
                })}
              >
                <Stack sx={{ flex: 1, maxWidth: '56rem', mx: 'auto', gap: 2 }}>
                  <Box
                    sx={(theme) => ({
                      p: 2,
                      ml: 1.5,
                      mt: 1.5,
                      textAlign: 'left',
                      color: theme.coDesign.sunburst.textPanel.text,
                      bgcolor: theme.coDesign.sunburst.textPanel.background,
                      border: theme.coDesign.sunburst.textPanel.border,
                      borderRadius: theme.coDesign.sunburst.textPanel.radius,
                      boxShadow: theme.coDesign.sunburst.textPanel.shadow,
                      '& h2': { color: theme.coDesign.sunburst.text },
                    })}
                  >
                    {rowIndex === 0 ? (
                      <RowText title="Age Group">
                        {copy(
                          <>
                            Compare mental model themes between{' '}
                            <Underline>{rowData[0]?.title || ''}</Underline> and{' '}
                            <Underline>{rowData[1]?.title || ''}</Underline>. Participants aged
                            18-35 had on average less subthemes than the 36-64 age group and 65
                            years and older group.{' '}
                            <Underline>
                              This suggests that mental models become more detailed or developed
                              with increasing age.{' '}
                            </Underline>
                            The most mentioned theme in the mental models is human impacts.
                          </>,
                        )}
                      </RowText>
                    ) : rowIndex === 1 ? (
                      <RowText title="Experience of Engagement">
                        {copy(
                          <>
                            Here you can see how years of engagement in the Delta can affect mental
                            model composition. <Underline>{rowData[0]?.title || ''}</Underline>{' '}
                            versus <Underline>{rowData[1]?.title || ''}</Underline> influence themes
                            people focus on.{' '}
                            <Underline>
                              This suggests that as engagement in the delta increases, individuals
                              learn more about the system and their conceptualizations of salinity
                              become deeper and broader as well.
                            </Underline>
                          </>,
                        )}
                      </RowText>
                    ) : rowIndex === 2 ? (
                      <RowText title="Team vs Interviewee">
                        {copy(
                          <>
                            On average team members had 12 subthemes in their mental models, in
                            comparison interviewees had 20 subthemes on average. The top drivers of
                            salinity in the delta for both groups were flow and policy and
                            regulation. In contrast, climate change appears as the most identified
                            theme in only the team mental models.
                          </>,
                        )}
                        <Typography variant="cardBody" component="span">
                          <Underline>
                            This suggests that interviewees’ mental models had greater breadth than
                            research team members. While interviewees focused more on human impact
                            influences, researchers focused more on climate change and physical
                            infrastructure influences.
                          </Underline>
                        </Typography>
                      </RowText>
                    ) : null}
                  </Box>
                </Stack>
                {rowData.map((item, index) => (
                  <Box key={index} sx={{ position: 'relative', minWidth: '30rem' }}>
                    <SunburstChart
                      data={item.data}
                      title={item.title}
                      index={rowIndex * 2 + index}
                      colorPalette={colorPalette}
                      globalColorMap={globalColorMap}
                    />
                  </Box>
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Box sx={(theme) => ({ height: theme.spacing(10) })} />
      </Box>
    </Box>
  )
}
