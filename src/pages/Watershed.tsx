import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
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

interface AttentionSegment {
  habitatFocus: string;
  acres: number;
  percent: number;
}

interface AttentionScenario {
  id: string;
  label: string;
  restorationLevel: string;
  scenarioHabitat: string;
  segments: AttentionSegment[];
}

type AttentionCompareMode = 'acres' | 'percent';

const RESTORATION_LEVEL_ORDER = ['min', 'med', 'max'];
const RESTORATION_LEVEL_LABELS: Record<string, string> = {
  min: 'Minimal Restoration',
  med: 'Medium Restoration',
  max: 'Maximum Restoration',
};
const SCENARIO_HABITAT_ORDER = ['forest', 'meadow', 'floodplain'];
const HABITAT_FOCUS_ORDER = ['forests', 'meadows', 'floodplains'];
const ALL_FILTER_VALUE = 'all';

const HABITAT_META: Record<
  string,
  {
    label: string;
    singular: string;
    icon: IconName;
    baseColor: string;
    shadeRange: [string, string];
    restorableAcres: number;
    acreageMetric: string;
  }
> = {
  forests: {
    label: 'Forests',
    singular: 'forest',
    icon: 'layers',
    baseColor: '#458d63',
    shadeRange: ['#b7d6bd', '#458d63'],
    restorableAcres: 11700000,
    acreageMetric: 'change in et',
  },
  meadows: {
    label: 'Meadows',
    singular: 'meadow',
    icon: 'compass',
    baseColor: '#caa62f',
    shadeRange: ['#eee59a', '#caa62f'],
    restorableAcres: 115863.6,
    acreageMetric: 'change in et**',
  },
  floodplains: {
    label: 'Floodplains',
    singular: 'floodplain',
    icon: 'waves',
    baseColor: '#4e96b8',
    shadeRange: ['#b9ddec', '#4e96b8'],
    restorableAcres: 63600,
    acreageMetric: 'change in gw recharge',
  },
};

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

function formatRestorationLevel(level: string) {
  return RESTORATION_LEVEL_LABELS[level] ?? formatLabel(level);
}

function formatScenarioHabitat(habitat: string) {
  return HABITAT_META[`${habitat}s`]?.label ?? `${formatLabel(habitat)}`;
}

function orderByList(value: string, order: string[]) {
  const index = order.indexOf(value);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function colorForScenarioHabitatLevel(scenarioHabitat: string, restorationLevel: string) {
  const meta = HABITAT_META[`${scenarioHabitat}s`];
  const levelIndex = Math.max(RESTORATION_LEVEL_ORDER.indexOf(restorationLevel), 0);

  if (!meta) {
    return '#51a2bd';
  }

  return d3
    .scaleSequential<string>()
    .domain([0, RESTORATION_LEVEL_ORDER.length - 1])
    .interpolator(d3.interpolateRgb(meta.shadeRange[0], meta.shadeRange[1]))(levelIndex);
}

function getCompleteRecords(records: WatershedMetricRecord[]) {
  return records.filter((record) => isFiniteNumber(record.value_low) && isFiniteNumber(record.value_high));
}

function matchesFilters(record: WatershedMetricRecord, restorationLevel: string, scenarioHabitat: string) {
  return (
    (restorationLevel === ALL_FILTER_VALUE || record.restoration_level === restorationLevel) &&
    (scenarioHabitat === ALL_FILTER_VALUE || record.scenario_habitat === scenarioHabitat)
  );
}

function getRestoredAcres(records: WatershedMetricRecord[], habitatFocus: string) {
  const meta = HABITAT_META[habitatFocus];
  const acreageRecord = records.find(
    (record) =>
      record.habitat_focus === habitatFocus &&
      record.metric.toLowerCase() === meta?.acreageMetric &&
      isFiniteNumber(record.value_high) &&
      isFiniteNumber(record.metric_high) &&
      record.metric_high !== 0,
  );

  if (!acreageRecord || !meta || !isFiniteNumber(acreageRecord.value_high) || !isFiniteNumber(acreageRecord.metric_high)) {
    return 0;
  }

  return Math.abs(acreageRecord.value_high / acreageRecord.metric_high);
}

function formatNumber(value: number) {
  return d3.format(',.0f')(value);
}

function formatPercent(value: number) {
  return `${d3.format(',.1f')(value)}%`;
}

function orderScenarioRecords(a: WatershedMetricRecord, b: WatershedMetricRecord) {
  return (
    orderByList(a.restoration_level, RESTORATION_LEVEL_ORDER) - orderByList(b.restoration_level, RESTORATION_LEVEL_ORDER) ||
    orderByList(a.scenario_habitat, SCENARIO_HABITAT_ORDER) - orderByList(b.scenario_habitat, SCENARIO_HABITAT_ORDER)
  );
}

function WatershedMetricsChart({
  records,
  habitatFocus,
  selectedRestorationLevel,
  selectedScenarioHabitat,
}: {
  records: WatershedMetricRecord[];
  habitatFocus: string;
  selectedRestorationLevel: string;
  selectedScenarioHabitat: string;
}) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState(320);
  const theme = useTheme();
  const chartFontSize = String(theme.typography.body2.fontSize ?? '0.875rem');
  const focusMeta = HABITAT_META[habitatFocus];

  const facets = useMemo<WatershedChartFacet[]>(() => {
    const filteredRecords = records.filter(
      (record) =>
        record.habitat_focus === habitatFocus &&
        matchesFilters(record, selectedRestorationLevel, selectedScenarioHabitat),
    );
    const groupedByMetric = d3.group(filteredRecords, (record) => record.metric);

    return Array.from(groupedByMetric, ([metric, metricRecords]) => {
      const completeRecords = getCompleteRecords(metricRecords);

      return {
        metric,
        unit: metricRecords[0]?.unit ?? '',
        records: completeRecords,
        scenarioHabitats: Array.from(new Set(completeRecords.map((record) => record.scenario_habitat))).sort(
          (a, b) => orderByList(a, SCENARIO_HABITAT_ORDER) - orderByList(b, SCENARIO_HABITAT_ORDER),
        ),
        restorationLevels: RESTORATION_LEVEL_ORDER.filter((level) =>
          completeRecords.some((record) => record.restoration_level === level),
        ),
      };
    }).filter((facet) => facet.records.length > 0);
  }, [records, habitatFocus, selectedRestorationLevel, selectedScenarioHabitat]);

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

    const margin = { top: 22, right: 24, bottom: 66, left: 54 };
    const columnGap = 32;
    const rowGap = 34;
    const columns = chartWidth < 760 ? 1 : 2;
    const facetTitleHeight = 42;
    const facetChartHeight = 180;
    const axisLabelOffset = 50;
    const facetBlockHeight = facetTitleHeight + facetChartHeight + margin.bottom;
    const facetCellWidth = Math.max((chartWidth - columnGap * (columns - 1)) / columns, 320);
    const innerWidth = facetCellWidth - margin.left - margin.right;
    const leftColumnFacets = columns === 1 ? facets : facets.filter((facet) => !RIGHT_COLUMN_METRICS.has(facet.metric.toLowerCase()));
    const rightColumnFacets = columns === 1 ? [] : facets.filter((facet) => RIGHT_COLUMN_METRICS.has(facet.metric.toLowerCase()));
    const rows = columns === 1 ? facets.length : Math.max(leftColumnFacets.length, rightColumnFacets.length);
    const height = rows * facetBlockHeight + Math.max(0, rows - 1) * rowGap + margin.top;

    svg
      .attr('viewBox', `0 0 ${chartWidth} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-label', `${focusMeta?.label ?? formatLabel(habitatFocus)} metrics chart`);

    const root = svg.append('g').attr('transform', `translate(0, ${margin.top})`);

    [...leftColumnFacets, ...rightColumnFacets].forEach((facet) => {
      const isRightColumn = columns > 1 && RIGHT_COLUMN_METRICS.has(facet.metric.toLowerCase());
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
        .text(facet.unit ? `${facet.metric}` : facet.metric);

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
        .attr('fill', (record) => colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level))
        .attr('stroke', 'rgba(242, 240, 239, 0.28)')
        .attr('stroke-width', 1);

      chartGroup
        .append('g')
        .attr('transform', `translate(0, ${facetChartHeight})`)
        .call(d3.axisBottom(x0).tickFormat((value) => formatScenarioHabitat(String(value))))
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
        .text('Scenarios');
    });
  }, [chartWidth, facets, habitatFocus, focusMeta?.label, chartFontSize]);

  return (
    <Box ref={setContainerElement} sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h3" sx={{ color: 'primary.main', mb: 1 }}>
          {focusMeta?.label ?? formatLabel(habitatFocus)}
        </Typography>
      </Box>

      {facets.length > 0 ? (
        <>
          <PriorityColorLegend focus={focusMeta?.singular}/>
          <svg ref={chartRef} style={{ display: 'block', width: '100%' }} />
        </>
      ) : (
        <Typography variant="body1" component="p">
          No complete metric ranges are available for this filter combination.
        </Typography>
      )}
    </Box>
  );
}

function PriorityColorLegend({ focus }: { focus: string }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(1, minmax(0, 1fr))' },
        gap: 1.5,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          border: '1px solid rgba(155,162,164,0.18)',
          borderRadius: 1,
          px: 1.2,
          py: 0.9,
        }}
      >
        <Typography variant="captionSmall">Restoration Level</Typography>
        <Stack direction="row" spacing={0.5} aria-hidden>
          {RESTORATION_LEVEL_ORDER.map((level) => (
            <Box
              key={level}
              sx={{
                width: 16,
                height: 16,
                borderRadius: 999,
                bgcolor: colorForScenarioHabitatLevel(focus, level),
                border: '1px solid rgba(242,240,239,0.25)',
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

function buildAttentionScenarios(
  records: WatershedMetricRecord[],
  selectedRestorationLevel: string,
  selectedScenarioHabitat: string,
) {
  const filteredRecords = records.filter((record) => matchesFilters(record, selectedRestorationLevel, selectedScenarioHabitat));
  const groupedScenarios = d3.groups(
    filteredRecords,
    (record) => record.restoration_level,
    (record) => record.scenario_habitat,
  );

  return groupedScenarios
    .flatMap(([restorationLevel, habitatGroups]) =>
      habitatGroups.map(([scenarioHabitat, scenarioRecords]) => {
        const segments = HABITAT_FOCUS_ORDER.map((habitatFocus) => {
          const acres = getRestoredAcres(scenarioRecords, habitatFocus);
          const restorableAcres = HABITAT_META[habitatFocus].restorableAcres;

          return {
            habitatFocus,
            acres,
            percent: restorableAcres > 0 ? (acres / restorableAcres) * 100 : 0,
          };
        }).filter((segment) => segment.acres > 0);

        return {
          id: `${restorationLevel}-${scenarioHabitat}`,
          label: `${formatRestorationLevel(restorationLevel)} / ${formatScenarioHabitat(scenarioHabitat)}`,
          restorationLevel,
          scenarioHabitat,
          segments,
        };
      }),
    )
    .filter((scenario) => scenario.segments.length > 0)
    .sort(
      (a, b) =>
        orderByList(a.restorationLevel, RESTORATION_LEVEL_ORDER) - orderByList(b.restorationLevel, RESTORATION_LEVEL_ORDER) ||
        orderByList(a.scenarioHabitat, SCENARIO_HABITAT_ORDER) - orderByList(b.scenarioHabitat, SCENARIO_HABITAT_ORDER),
    );
}

function AttentionStackedChart({
  records,
  selectedRestorationLevel,
  selectedScenarioHabitat,
  compareMode,
  onCompareModeChange,
}: {
  records: WatershedMetricRecord[];
  selectedRestorationLevel: string;
  selectedScenarioHabitat: string;
  compareMode: AttentionCompareMode;
  onCompareModeChange: (mode: AttentionCompareMode) => void;
}) {
  const scenarios = useMemo<AttentionScenario[]>(
    () => buildAttentionScenarios(records, selectedRestorationLevel, selectedScenarioHabitat),
    [records, selectedRestorationLevel, selectedScenarioHabitat],
  );
  const maxScenarioTotal = useMemo(() => {
    const totals = scenarios.map((scenario) =>
      d3.sum(scenario.segments, (segment) => (compareMode === 'acres' ? segment.acres : segment.percent)),
    );

    return Math.max(...totals, 1);
  }, [scenarios, compareMode]);

  if (!scenarios.length) {
    return (
      <Typography variant="body1" component="p">
        No restored acreage estimates are available for this filter combination.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.6}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
          gap: 1.4,
          alignItems: 'end',
        }}
      >
        <Box>
          <Typography variant="h4" component="h4" sx={{ color: 'primary.main', mb: 1 }}>
            Habitat Attention Across Scenarios
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: '76ch' }}>
            Stacked bars show how much each scenario emphasizes forests, meadows, and floodplains. Compare actual
            restored acreage or the share of each habitat focus&apos;s restorable baseline.
          </Typography>
        </Box>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={compareMode}
          onChange={(_, value: AttentionCompareMode | null) => {
            if (value) {
              onCompareModeChange(value);
            }
          }}
          aria-label="Compare attention chart values"
          sx={{
            justifySelf: { xs: 'start', md: 'end' },
            '& .MuiToggleButton-root': {
              color: 'common.white',
              borderColor: 'rgba(155,162,164,0.35)',
              px: 1.6,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'common.black',
                '&:hover': { bgcolor: 'primary.light' },
              },
            },
          }}
        >
          <ToggleButton value="acres" aria-label="Compare actual acreage">
            Acres
          </ToggleButton>
          <ToggleButton value="percent" aria-label="Compare percentages">
            Percent
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Stack spacing={1.2}>
        {scenarios.map((scenario) => {
          const scenarioTotal = d3.sum(scenario.segments, (segment) =>
            compareMode === 'acres' ? segment.acres : segment.percent,
          );
          const totalWidth = `${(scenarioTotal / maxScenarioTotal) * 100}%`;

          return (
            <Box
              key={scenario.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 0.35fr) minmax(0, 1fr)' },
                gap: { xs: 0.8, md: 1.6 },
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h5" component="h4">
                  {formatRestorationLevel(scenario.restorationLevel)}
                </Typography>
                <Typography variant="captionSmall" component="p" sx={{ color: 'secondary.main' }}>
                  {formatScenarioHabitat(scenario.scenarioHabitat)}
                </Typography>
              </Box>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    width: totalWidth,
                    minHeight: 25,
                    overflow: 'hidden',
                    borderRadius: 1,
                    border: '1px solid rgba(155,162,164,0.18)',
                    bgcolor: 'rgba(16,22,24,0.45)',
                  }}
                >
                  {scenario.segments.map((segment) => {
                    const meta = HABITAT_META[segment.habitatFocus];
                    const value = compareMode === 'acres' ? segment.acres : segment.percent;
                    const width = scenarioTotal > 0 ? `${(value / scenarioTotal) * 100}%` : '0%';
                    const label = compareMode === 'acres' ? formatNumber(segment.acres) : formatPercent(segment.percent);

                    return (
                      <Box
                        key={segment.habitatFocus}
                        sx={{
                          width,
                          bgcolor: meta.baseColor,
                          color: 'common.white',
                          px: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          borderRight: '1px solid rgba(242,240,239,0.25)',
                          '&:last-of-type': { borderRight: 0 },
                        }}
                        title={`${meta.label}: ${formatPercent(segment.percent)} / ${formatNumber(segment.acres)} acres`}
                      >
                        <Typography variant="captionSmall" component="span" sx={{ color: 'inherit', lineHeight: 1.15 }}>
                          {label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
                    gap: 0.8,
                    mt: 0.8,
                  }}
                >
                  {scenario.segments.map((segment) => {
                    const meta = HABITAT_META[segment.habitatFocus];

                    return (
                      <Typography key={segment.habitatFocus} variant="captionSmall" component="p">
                        <Box component="span" sx={{ color: meta.baseColor, fontWeight: 800 }}>
                          {meta.label}:
                        </Box>{' '}
                        {formatNumber(segment.acres)} acres
                      </Typography>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}

function ChangesComparisonChart({
  records,
  selectedRestorationLevel,
  selectedScenarioHabitat,
}: {
  records: WatershedMetricRecord[];
  selectedRestorationLevel: string;
  selectedScenarioHabitat: string;
}) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState(320);
  const theme = useTheme();
  const chartFontSize = String(theme.typography.body2.fontSize ?? '0.875rem');

  const facets = useMemo(() => {
    const filteredRecords = getCompleteRecords(
      records.filter((record) => matchesFilters(record, selectedRestorationLevel, selectedScenarioHabitat)),
    );

    return Array.from(d3.group(filteredRecords, (record) => record.metric), ([metric, metricRecords]) => ({
      metric,
      unit: metricRecords[0]?.unit ?? '',
      records: [...metricRecords].sort(orderScenarioRecords),
    })).filter((facet) => facet.records.length > 0);
  }, [records, selectedRestorationLevel, selectedScenarioHabitat]);

  useEffect(() => {
    if (!containerElement) {
      return undefined;
    }

    const updateWidth = () => setChartWidth(Math.max(containerElement.getBoundingClientRect().width, 320));
    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerElement);

    return () => observer.disconnect();
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

    const columns = chartWidth < 860 ? 1 : 2;
    const columnGap = 34;
    const rowGap = 34;
    const margin = { top: 28, right: 28, bottom: 38, left: 126 };
    const facetTitleHeight = 36;
    const chartRowHeight = 24;
    const facetChartHeight = (facet: (typeof facets)[number]) => facet.records.length * chartRowHeight + 18;
    const facetHeights = facets.map((facet) => facetTitleHeight + facetChartHeight(facet) + margin.bottom);
    const columnWidth = Math.max((chartWidth - columnGap * (columns - 1)) / columns, 320);
    const innerWidth = columnWidth - margin.left - margin.right;
    const columnHeights = Array.from({ length: columns }, () => 0);
    const placements = facets.map((facet, index) => {
      const column = columns === 1 ? 0 : index % columns;
      const x = column * (columnWidth + columnGap);
      const y = columnHeights[column];
      columnHeights[column] += facetHeights[index] + rowGap;
      return { facet, x, y, height: facetHeights[index] };
    });
    const height = Math.max(...columnHeights) - rowGap + margin.top;

    svg
      .attr('viewBox', `0 0 ${chartWidth} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-label', 'Watershed scenario change ranges');

    const root = svg.append('g').attr('transform', `translate(0, ${margin.top})`);

    placements.forEach(({ facet, x, y: facetY }) => {
      const values = facet.records.flatMap((record) => [record.value_low, record.value_high].filter(isFiniteNumber));
      const [extentMinRaw, extentMaxRaw] = d3.extent(values);
      const extentMin = Math.min(extentMinRaw ?? 0, 0);
      const extentMax = Math.max(extentMaxRaw ?? 1, 0);
      const span = extentMax - extentMin || 1;
      const padding = span * 0.08;
      const xScale = d3
        .scaleLinear()
        .domain([extentMin - padding, extentMax + padding])
        .nice()
        .range([0, innerWidth]);
      const yScale = d3
        .scaleBand<string>()
        .domain(facet.records.map((record) => record.scenario))
        .range([0, facet.records.length * chartRowHeight])
        .padding(0.25);
      const facetGroup = root.append('g').attr('transform', `translate(${x}, ${facetY})`);

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

      if (xScale.domain()[0] < 0 && xScale.domain()[1] > 0) {
        chartGroup
          .append('line')
          .attr('x1', xScale(0))
          .attr('x2', xScale(0))
          .attr('y1', 0)
          .attr('y2', facet.records.length * chartRowHeight)
          .attr('stroke', 'rgba(242,240,239,0.42)')
          .attr('stroke-dasharray', '4 4');
      }

      chartGroup
        .append('g')
        .call(d3.axisLeft(yScale).tickSize(0))
        .call((axisGroup) => axisGroup.selectAll('text').attr('fill', 'currentColor').attr('font-size', chartFontSize))
        .call((axisGroup) => axisGroup.selectAll('path').remove());

      chartGroup
        .append('g')
        .attr('transform', `translate(0, ${facet.records.length * chartRowHeight + 8})`)
        .call(d3.axisBottom(xScale).ticks(4).tickFormat((value) => d3.format('.2~s')(Number(value))))
        .call((axisGroup) => axisGroup.selectAll('text').attr('fill', 'currentColor').attr('font-size', chartFontSize))
        .call((axisGroup) => axisGroup.selectAll('path,line').attr('stroke', 'rgba(242,240,239,0.35)'));

      const scenarioGroups = chartGroup
        .selectAll<SVGGElement, WatershedMetricRecord>('.change-range-row')
        .data(facet.records)
        .enter()
        .append('g')
        .attr('class', 'change-range-row')
        .attr('transform', (record) => `translate(0, ${(yScale(record.scenario) ?? 0) + yScale.bandwidth() / 2})`);

      scenarioGroups
        .append('line')
        .attr('x1', (record) => xScale(Math.min(record.value_low ?? 0, record.value_high ?? 0)))
        .attr('x2', (record) => xScale(Math.max(record.value_low ?? 0, record.value_high ?? 0)))
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', (record) => colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level))
        .attr('stroke-width', 5)
        .attr('stroke-linecap', 'round');

      scenarioGroups
        .append('circle')
        .attr('cx', (record) => xScale(record.value_low ?? 0))
        .attr('cy', 0)
        .attr('r', 3.5)
        .attr('fill', '#f2f0ef')
        .attr('stroke', (record) => colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level))
        .attr('stroke-width', 2);

      scenarioGroups
        .append('circle')
        .attr('cx', (record) => xScale(record.value_high ?? 0))
        .attr('cy', 0)
        .attr('r', 3.5)
        .attr('fill', (record) => colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level));
    });
  }, [chartWidth, facets, chartFontSize]);

  return (
    <Box ref={setContainerElement} sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h3" sx={{ color: 'primary.main', mb: 1 }}>
          Scenario Change Ranges
        </Typography>
        <Typography variant="body2" sx={{ maxWidth: '76ch' }}>
          Low-to-high ranges from Table 2, grouped by metric and filtered by the same restoration and habitat-priority
          controls.
        </Typography>
      </Box>
      {facets.length > 0 ? (
        <svg ref={chartRef} style={{ display: 'block', width: '100%' }} />
      ) : (
        <Typography variant="body1" component="p">
          No change ranges are available for this filter combination.
        </Typography>
      )}
    </Box>
  );
}

export default function Watershed() {
  const [metrics, setMetrics] = useState<WatershedMetricRecord[]>([]);
  const [changes, setChanges] = useState<WatershedMetricRecord[]>([]);
  const [selectedRestorationLevel, setSelectedRestorationLevel] = useState(ALL_FILTER_VALUE);
  const [selectedScenarioHabitat, setSelectedScenarioHabitat] = useState(ALL_FILTER_VALUE);
  const [attentionCompareMode, setAttentionCompareMode] = useState<AttentionCompareMode>('acres');

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/watershed/metrics.json`).then(
        (response) => response.json() as Promise<WatershedMetricsPayload>,
      ),
      fetch(`${import.meta.env.BASE_URL}data/watershed/changes.json`).then(
        (response) => response.json() as Promise<WatershedMetricsPayload>,
      ),
    ])
      .then(([metricsPayload, changesPayload]) => {
        if (!isMounted) {
          return;
        }

        setMetrics(metricsPayload.data ?? []);
        setChanges(changesPayload.data ?? []);
      })
      .catch(() => {
        if (isMounted) {
          setMetrics([]);
          setChanges([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageLayout title="New Green Watershed" fullWidthContent hideTitle>
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
            <SectionHead
              eyebrow="Scenario Overview"
              title="Restoration as a Watershed-Scale Strategy"
              titleColor="secondary.main"
            />
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
        <SectionHead eyebrow="Scenario Lens" title="What This Page Helps Compare" titleColor="common.white" />
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
                <Typography variant="h2" sx={{ mb: 1, '&&': { color: 'common.white' } }}>
                  Compare Modeled Tradeoffs
                </Typography>
                <Typography variant="body2" component="p" sx={{ maxWidth: '70ch' }}>
                  Use the controls to isolate one restoration level, one habitat-priority scenario, or a single
                  combination. Leave both controls on all scenarios to compare the full nine-scenario matrix.
                </Typography>
              </Box>
            </Box>

            <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(210px, 1fr))' },
                  gap: 1.2,
                  width: { xs: '100%', md: 'auto' },
                }}
              >
                <FormControl size="small">
                  <InputLabel id="restoration-level-label">Restoration level</InputLabel>
                  <Select
                    labelId="restoration-level-label"
                    value={selectedRestorationLevel}
                    label="Restoration level"
                    onChange={(event: SelectChangeEvent<string>) => setSelectedRestorationLevel(event.target.value)}
                  >
                    <MenuItem value={ALL_FILTER_VALUE}>All restoration levels</MenuItem>
                    {RESTORATION_LEVEL_ORDER.map((level) => (
                      <MenuItem key={level} value={level}>
                        {formatRestorationLevel(level)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <InputLabel id="scenario-habitat-label">Habitat prioritization</InputLabel>
                  <Select
                    labelId="scenario-habitat-label"
                    value={selectedScenarioHabitat}
                    label="Habitat prioritization"
                    onChange={(event: SelectChangeEvent<string>) => setSelectedScenarioHabitat(event.target.value)}
                  >
                    <MenuItem value={ALL_FILTER_VALUE}>All habitat priorities</MenuItem>
                    {SCENARIO_HABITAT_ORDER.map((habitat) => (
                      <MenuItem key={habitat} value={habitat}>
                        {formatScenarioHabitat(habitat)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>


            {metrics.length > 0 ? (
              <Stack spacing={4}>
                <AttentionStackedChart
                  records={metrics}
                  selectedRestorationLevel={selectedRestorationLevel}
                  selectedScenarioHabitat={selectedScenarioHabitat}
                  compareMode={attentionCompareMode}
                  onCompareModeChange={setAttentionCompareMode}
                />

                <ChangesComparisonChart
                  records={changes}
                  selectedRestorationLevel={selectedRestorationLevel}
                  selectedScenarioHabitat={selectedScenarioHabitat}
                />

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
                    gap: { xs: 2, lg: 2.5 },
                    alignItems: 'start',
                  }}
                >
                  {HABITAT_FOCUS_ORDER.map((habitatFocus) => (
                    <Box
                      key={habitatFocus}
                      sx={{
                        borderTop: '1px solid rgba(155,162,164,0.18)',
                        pt: 2.5,
                        minWidth: 0,
                      }}
                    >
                      <WatershedMetricsChart
                        records={metrics.filter((d) => !["Change in ET**", "Change in wetland cover"].includes(d.metric))}
                        habitatFocus={habitatFocus}
                        selectedRestorationLevel={selectedRestorationLevel}
                        selectedScenarioHabitat={selectedScenarioHabitat}
                      />
                    </Box>
                  ))}
                </Box>
              </Stack>
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
