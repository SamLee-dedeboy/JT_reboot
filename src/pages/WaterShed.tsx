import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Box,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import PageLayout from './PageLayout';

interface WatershedMetricRecord {
  habitat_focus: string;
  metric: string;
  metric_low: number | null;
  metric_high: number | null;
  unit: string;
  scenario: string;
  restoration_level: string;
  scenario_habitat: string;
  value_low: number | null;
  value_high: number | null;
}

interface WatershedMetricsPayload {
  data: WatershedMetricRecord[];
}

interface WatershedChartFacet {
  metric: string;
  unit: string;
  records: WatershedMetricRecord[];
  scenarioHabitats: string[];
  restorationLevels: string[];
}

const RESTORATION_LEVEL_ORDER = ['min', 'med', 'max'];
const RESTORATION_LEVEL_COLOR_SCALE = d3
  .scaleSequential<string>()
  .domain([0, RESTORATION_LEVEL_ORDER.length - 1])
  .interpolator(d3.interpolateRgb('#baebfc', '#51a2bd'));

const RIGHT_COLUMN_METRICS = new Set(['change in et', 'change in forest cover']);

const watershedHighlights = [
  { title: 'Watershed connections', body: 'Placeholder' },
  { title: 'Indicators', body: 'Placeholder' },
  { title: 'Habitat Restoration', body: 'Placeholder' },
];

function isFiniteNumber(value: number | null): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function formatLabel(value: string) {
  return value
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function colorForLevel(level: string) {
  const levelIndex = RESTORATION_LEVEL_ORDER.indexOf(level);
  return levelIndex >= 0 ? RESTORATION_LEVEL_COLOR_SCALE(levelIndex) : '#51a2bd';
}

function WatershedMetricsChart({
  records,
  selectedHabitatFocus,
}: {
  records: WatershedMetricRecord[];
  selectedHabitatFocus: string;
}) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
    const [chartWidth, setChartWidth] = useState(320);
  const theme = useTheme();
  const chartFontSize = theme.typography.body2.fontSize;

  const facets = useMemo<WatershedChartFacet[]>(() => {
    const filteredRecords = records.filter((record) => record.habitat_focus === selectedHabitatFocus);
    const groupedByMetric = d3.group(filteredRecords, (record) => record.metric);

    return Array.from(groupedByMetric, ([metric, metricRecords]) => {
      const completeRecords = metricRecords.filter(
        (record) => isFiniteNumber(record.value_low) && isFiniteNumber(record.value_high),
      );

      return {
        metric,
        unit: metricRecords[0]?.unit ?? '',
        records: completeRecords,
        scenarioHabitats: Array.from(new Set(metricRecords.map((record) => record.scenario_habitat))).sort(),
        restorationLevels: RESTORATION_LEVEL_ORDER.filter((level) =>
          metricRecords.some((record) => record.restoration_level === level),
        ),
      };
    });
  }, [records, selectedHabitatFocus]);

  useEffect(() => {
    if (!containerElement) {
      return undefined;
    }

    const updateWidth = () => {
      setChartWidth(Math.max(containerElement.getBoundingClientRect().width, 320));
    };

    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(containerElement);

    return () => {
      observer.disconnect();
    };
  }, [containerElement]);

  useEffect(() => {
    const svgElement = chartRef.current;

    if (!svgElement) {
      return;
    }

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    if (!facets.length) {
      return;
    }

    const margin = { top: 20, right: 24, bottom: 60, left: 84 };
    const columnGap = 32;
    const rowGap = 34;
    const columns = 2;
    const facetTitleHeight = 42;
    const facetChartHeight = 180;
    const axisLabelOffset = 50;
    const facetBlockHeight = facetTitleHeight + facetChartHeight + margin.bottom;
    const facetCellWidth = Math.max((chartWidth - columnGap) / columns, 320);
    const innerWidth = facetCellWidth - margin.left - margin.right;
    const leftColumnFacets = facets.filter((facet) => !RIGHT_COLUMN_METRICS.has(facet.metric.toLowerCase()));
    const rightColumnFacets = facets.filter((facet) => RIGHT_COLUMN_METRICS.has(facet.metric.toLowerCase()));
    const rows = Math.max(leftColumnFacets.length, rightColumnFacets.length);
    const height = rows * facetBlockHeight + Math.max(0, rows - 1) * rowGap + margin.top;

    const colorScale = d3
      .scaleOrdinal<string, string>()
      .domain(RESTORATION_LEVEL_ORDER)
      .range(RESTORATION_LEVEL_ORDER.map((level) => colorForLevel(level)));

    svg
      .attr('viewBox', `0 0 ${chartWidth} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-label', `${formatLabel(selectedHabitatFocus)} metrics chart`);

    const root = svg.append('g').attr('transform', `translate(0, ${margin.top})`);

    [...leftColumnFacets, ...rightColumnFacets].forEach((facet) => {
      const isRightColumn = RIGHT_COLUMN_METRICS.has(facet.metric.toLowerCase());
      const columnIndex = isRightColumn ? 1 : 0;
      const rowIndex = isRightColumn ? rightColumnFacets.indexOf(facet) : leftColumnFacets.indexOf(facet);
      const facetOffsetX = columnIndex * (facetCellWidth + columnGap);
      const facetOffsetY = rowIndex * (facetBlockHeight + rowGap);
      const facetGroup = root.append('g').attr('transform', `translate(${facetOffsetX}, ${facetOffsetY})`);

      facetGroup
        .append('text')
        .attr('x', margin.left)
        .attr('y', 0)
        .attr('fill', 'currentColor')
        .attr('font-size', chartFontSize)
        .attr('font-weight', 700)
        .attr('text-transform', 'uppercase')
        .text(facet.unit ? `${facet.metric} (${facet.unit})` : facet.metric);

      const chartGroup = facetGroup.append('g').attr('transform', `translate(${margin.left}, ${facetTitleHeight})`);

      const x0 = d3
        .scaleBand<string>()
        .domain(facet.scenarioHabitats)
        .range([0, innerWidth])
        .paddingInner(0.22)
        .paddingOuter(0.08);

      const x1 = d3
        .scaleBand<string>()
        .domain(facet.restorationLevels)
        .range([0, x0.bandwidth()])
        .padding(0.15);

      const allValues = facet.records.flatMap((record) => [record.value_low, record.value_high].filter(isFiniteNumber));
      const [minimumRaw, maximumRaw] = d3.extent(allValues);
      const minimum = minimumRaw ?? 0;
      const maximum = maximumRaw ?? 1;
      const span = maximum - minimum;
      const padding = span === 0 ? Math.max(Math.abs(maximum) * 0.15, 1) : span * 0.08;

      const y = d3
        .scaleLinear()
        .domain([minimum - padding, maximum + padding])
        .nice()
        .range([facetChartHeight, 0]);

      chartGroup
        .append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat((value) => d3.format('.2~s')(Number(value))))
        .call((axisGroup) => axisGroup.selectAll('text').attr('fill', 'currentColor').attr('font-size', chartFontSize))
        .call((axisGroup) => axisGroup.selectAll('path,line').attr('stroke', 'rgba(242, 240, 239, 0.35)'));

      if (y.domain()[0] < 0 && y.domain()[1] > 0) {
        chartGroup
          .append('line')
          .attr('x1', 0)
          .attr('x2', innerWidth)
          .attr('y1', y(0))
          .attr('y2', y(0))
          .attr('stroke', 'rgba(242, 240, 239, 0.45)')
          .attr('stroke-dasharray', '4 4');
      }

      const scenarioGroups = chartGroup
        .selectAll<SVGGElement, [string, WatershedMetricRecord[]]>('.watershed-scenario-group')
        .data(d3.groups(facet.records, (record) => record.scenario_habitat))
        .enter()
        .append('g')
        .attr('class', 'watershed-scenario-group')
        .attr('transform', ([scenarioHabitat]) => `translate(${x0(scenarioHabitat) ?? 0}, 0)`);

      scenarioGroups
        .selectAll<SVGRectElement, WatershedMetricRecord>('rect')
        .data(([, scenarioRecords]) => scenarioRecords.filter((record) => isFiniteNumber(record.value_low) && isFiniteNumber(record.value_high)))
        .enter()
        .append('rect')
        .attr('x', (record) => x1(record.restoration_level) ?? 0)
        .attr('y', (record) => y(Math.max(record.value_low ?? 0, record.value_high ?? 0)))
        .attr('width', x1.bandwidth())
        .attr('height', (record) => Math.abs(y(record.value_low ?? 0) - y(record.value_high ?? 0)))
        .attr('rx', 2)
        .attr('fill', (record) => colorScale(record.restoration_level))
        .attr('stroke', 'rgba(242, 240, 239, 0.28)')
        .attr('stroke-width', 1);

      chartGroup
        .append('g')
        .attr('transform', `translate(0, ${facetChartHeight})`)
        .call(d3.axisBottom(x0).tickFormat((value) => `${formatLabel(String(value))}`))
        .call((axisGroup) => axisGroup.selectAll('text').attr('fill', 'currentColor').attr('font-size', chartFontSize))
        .call((axisGroup) => axisGroup.selectAll('path,line').attr('stroke', 'rgba(242, 240, 239, 0.35)'));

      chartGroup
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', facetChartHeight + axisLabelOffset)
        .attr('fill', 'currentColor')
        .attr('font-size', chartFontSize)
        .attr('font-weight', 700)
        .attr('text-anchor', 'middle')
        .text('Prioritization');
    });
  }, [chartWidth, facets, selectedHabitatFocus, chartFontSize]);

  return (
    <Box ref={setContainerElement} sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h2" sx={{ color: 'primary.main', mb: 1 }}>
          Metrics visualization
        </Typography>
        <Typography variant="body1" component="p">
          Faceted grouped bar chart of value_low to value_high ranges, split by metric and grouped by scenario_habitat with restoration_level comparisons inside each group.
        </Typography>
      </Box>

      {facets.length > 0 ? (
        <>
          <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            {RESTORATION_LEVEL_ORDER.filter((level) => facets.some((facet) => facet.restorationLevels.includes(level))).map((level) => (
              <Stack key={level} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 14, height: 14, borderRadius: 999, bgcolor: colorForLevel(level) }} />
                <Typography variant="body1" component="span">
                  {formatLabel(level)}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <svg ref={chartRef} style={{ display: 'block', width: '100%' }} />
        </>
      ) : (
        <Typography variant="body1" component="p">
          No complete metric ranges are available for this habitat focus.
        </Typography>
      )}
    </Box>
  );
}

export default function WaterShed() {
  const [metrics, setMetrics] = useState<WatershedMetricRecord[]>([]);
    const [selectedHabitatFocus, setSelectedHabitatFocus] = useState('');
    const theme = useTheme();

  useEffect(() => {
    let isMounted = true;

    fetch(`${import.meta.env.BASE_URL}data/watershed/metrics.json`)
      .then((response) => response.json() as Promise<WatershedMetricsPayload>)
      .then((payload) => {
        if (!isMounted) {
          return;
        }

        const loadedMetrics = payload.data ?? [];
        setMetrics(loadedMetrics);

        const availableFocuses = Array.from(new Set(loadedMetrics.map((record) => record.habitat_focus)));
        setSelectedHabitatFocus((current) => current || availableFocuses[0] || '');
      })
      .catch(() => {
        if (isMounted) {
          setMetrics([]);
          setSelectedHabitatFocus('');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const habitatFocusOptions = useMemo(() => Array.from(new Set(metrics.map((record) => record.habitat_focus))), [metrics]);

  const effectiveHabitatFocus = selectedHabitatFocus || habitatFocusOptions[0] || '';

  return (
    <PageLayout title="New Green Watershed">
      <Container disableGutters maxWidth="lg" sx={{ py: theme.jtSpacing.section.md }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" component="p" sx={{ color: 'primary.main', mb: 1, letterSpacing: 1.2, textTransform: 'uppercase' }}>
              Scenario overview
            </Typography>
            <Typography variant="body1" component="p">
              Placeholder text.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            {watershedHighlights.map((item) => (
              <Card key={item.title} variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h4" component="h2" sx={{ color: 'primary.main', mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" component="p">
                    {item.body}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Card variant="outlined">
            <CardContent>
              <Stack spacing={3}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: { xs: 'stretch', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                    flexDirection: { xs: 'column', md: 'row' },
                  }}
                >
                  <Box>
                    <Typography variant="h4" component="h2" sx={{ color: 'primary.main', mb: 1 }}>
                      Watershed metrics
                    </Typography>
                    <Typography variant="body1" component="p">
                      Choose a habitat focus to compare across habitat scenarios and restoration levels.
                    </Typography>
                  </Box>

                  <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="habitat-focus-label">Habitat focus</InputLabel>
                    <Select
                      labelId="habitat-focus-label"
                      value={effectiveHabitatFocus}
                      label="Habitat focus"
                      onChange={(event: SelectChangeEvent<string>) => setSelectedHabitatFocus(event.target.value)}
                    >
                      {habitatFocusOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {formatLabel(option)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {effectiveHabitatFocus ? (
                  <WatershedMetricsChart records={metrics} selectedHabitatFocus={effectiveHabitatFocus} />
                ) : (
                  <Typography variant="body1" component="p">
                    Loading metrics...
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </PageLayout>
  );
}