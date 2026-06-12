import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Box,
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
import Section from '../components/common/Section';
import SectionHead from '../components/common/SectionHead';
import Reveal from '../components/common/Reveal';
import Icon, { type IconName } from '../components/common/Icon';
import { assetUrl } from '../utils/baseUrl';

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

const SCENARIO_LEDE =
  'The New Green Watershed scenario imagines ecological restoration and land-use adaptation as tools for addressing subsidence, flooding, habitat stress, and the transition toward a more regenerative Delta economy.';

const SCENARIO_DETAIL =
  'Rather than treating each island, channel, and habitat type as an isolated management problem, this page frames the scenario as a watershed-scale comparison of restoration priorities and modeled tradeoffs.';

const watershedHighlights: Array<{ n: string; icon: IconName; title: string; body: string }> = [
  {
    n: '01',
    icon: 'waves',
    title: 'Watershed Connections',
    body: 'Compare how habitat choices ripple across broader Delta water, land, and restoration priorities.',
  },
  {
    n: '02',
    icon: 'compass',
    title: 'Scenario Indicators',
    body: 'Track modeled metric ranges across habitat focus areas, scenario habitats, and restoration intensities.',
  },
  {
    n: '03',
    icon: 'layers',
    title: 'Habitat Restoration',
    body: 'Read restoration levels as planning levers, from minimum intervention to larger landscape transformation.',
  },
];

const cardSx = {
  bgcolor: 'surface',
  border: '1px solid rgba(155,162,164,0.18)',
  borderRadius: 'var(--mui-shape-borderRadius)',
  p: '1.9rem',
} as const;

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
  const chartFontSize = String(theme.typography.body2.fontSize ?? '0.875rem');

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
        <Typography variant="h4" component="h3" sx={{ color: 'primary.main', mb: 1 }}>
          Metrics Visualization
        </Typography>
        <Typography variant="body2" component="p" sx={{ maxWidth: '72ch' }}>
          Faceted ranges compare low-to-high modeled values by scenario habitat, with restoration levels grouped inside each habitat.
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

export default function Watershed() {
  const [metrics, setMetrics] = useState<WatershedMetricRecord[]>([]);
  const [selectedHabitatFocus, setSelectedHabitatFocus] = useState('');

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
    <PageLayout title="New Green Watershed" fullWidthContent>
      <Section id="watershed-overview">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
            gap: { xs: '1.6rem', md: '2.25rem' },
            alignItems: 'center',
          }}
        >
          <Reveal delay={0.08} sx={{ maxWidth: { xs: 520, md: 'none' }, mx: { xs: 'auto', md: 0 } }}>
            <Box
              component="img"
              src={assetUrl('/images/scenarios/new-green-watershed.jpg')}
              alt="Wetland and Delta landscape representing the New Green Watershed scenario"
              sx={{
                width: '100%',
                aspectRatio: '5 / 4',
                objectFit: 'cover',
                borderRadius: 'var(--mui-shape-borderRadius)',
                border: '1px solid rgba(155,162,164,0.2)',
                display: 'block',
              }}
            />
          </Reveal>
          <Box>
            <SectionHead eyebrow="Scenario Overview" title="Restoration as a Watershed-Scale Strategy" />
            <Reveal delay={0.06}>
              <Typography variant="body1" sx={{ maxWidth: '72ch', mb: '1.1rem' }}>
                {SCENARIO_LEDE}
              </Typography>
              <Typography variant="body2" sx={{ maxWidth: '72ch' }}>
                {SCENARIO_DETAIL}
              </Typography>
            </Reveal>
          </Box>
        </Box>
      </Section>

      <Section id="watershed-lens" bg="base.600">
        <SectionHead eyebrow="Scenario Lens" title="What This Page Helps Compare" />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: { xs: '1.6rem', md: '2.25rem' },
          }}
        >
          {watershedHighlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08} sx={cardSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '1.2rem' }}>
                <Typography variant="numberGhost" component="span">
                  {item.n}
                </Typography>
                <Icon name={item.icon} size={28} stroke="var(--mui-palette-primary-main)" />
              </Box>
              <Typography variant="h3" component="h3" sx={{ mb: '1rem', color: 'primary.main' }}>
                {item.title}
              </Typography>
              <Typography variant="body2">{item.body}</Typography>
            </Reveal>
          ))}
        </Box>
      </Section>

      <Section id="watershed-metrics">
        <Box
          sx={{
            ...cardSx,
            p: { xs: '1.4rem', md: '2rem' },
          }}
        >
          <Stack spacing={3}>
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'stretch', md: 'flex-end' },
                justifyContent: 'space-between',
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              <Box>
                <Typography variant="eyebrow" component="p" sx={{ mb: '0.7rem' }}>
                  Scenario Metrics
                </Typography>
                <Typography variant="h2" component="h2" sx={{ mb: 1 }}>
                  Compare Modeled Tradeoffs
                </Typography>
                <Typography variant="body2" component="p" sx={{ maxWidth: '62ch' }}>
                  Choose a habitat focus to compare outcomes across habitat scenarios and restoration levels.
                </Typography>
              </Box>

              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 260 } }}>
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
        </Box>
      </Section>
    </PageLayout>
  );
}
