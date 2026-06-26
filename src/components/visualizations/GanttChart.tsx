// Water-quality timeline visualization with D3-rendered status bars, brush
// selection, and station sorting/grouping controls.
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import * as d3 from 'd3';
import { palette } from '../../theme/muiTheme';

type WaterQualityStatus = 'acceptable' | 'unacceptable' | string;
type VulnerabilityGroup = 'HIGHEST' | 'HIGH' | 'MODERATE';

interface WaterQualitySegment {
  status: WaterQualityStatus;
  start: string;
  end: string;
}

interface RawWaterQualitySegment {
  status: WaterQualityStatus;
  start: string;
  end: string;
}

interface RawWaterQualityRecord {
  station: string;
  station_index: string | number;
  station_long_name?: string;
  vulnerability?: string;
  affordability?: string;
  segments: RawWaterQualitySegment[];
}

interface RawWaterQualitySummaryRecord {
  station: string;
  station_index: string | number;
  station_long_name?: string;
  vulnerability?: string;
  affordability?: string;
  good: number;
  acceptable: number;
  unacceptable: number;
  not_good?: number;
}

interface WaterQualityStationMetrics {
  good: number;
  acceptable: number;
  unacceptable: number;
}

interface WaterQualityRecord {
  station: string;
  station_index: number;
  vulnerability: VulnerabilityGroup;
  segments: WaterQualitySegment[];
}

interface WaterQualityData {
  timestamps: string[];
  records: WaterQualityRecord[];
  summary?: WaterQualitySummaryRecord[];
}

interface WaterQualitySummaryRecord {
  station: string;
  station_index: number;
  good: number;
  acceptable: number;
  unacceptable: number;
  not_good?: number;
}

interface RawWaterQualityData {
  timestamps: string[];
  records: RawWaterQualityRecord[];
  summary?: RawWaterQualitySummaryRecord[];
}

interface StationInfoRecord {
  station_short_name: string;
  station_index: number;
}

interface StationInfoPayload {
  stations: StationInfoRecord[];
}

type SortMode = 'unacceptable' | 'good' | 'station-index';
type DatasetMode = 'run15' | 'run16' | 'run17';
type ConfigurationMode = 'max-base' | 'max-deanna' | 'mean-base' | 'mean-stringent';

const VULNERABILITY_GROUP_ORDER: VulnerabilityGroup[] = ['HIGHEST', 'HIGH', 'MODERATE'];

const DATASET_PATHS: Record<ConfigurationMode, Record<DatasetMode, string>> = {
  'max-base': {
    run15: `${import.meta.env.BASE_URL}/data/max/base/water_quality_run15.json`,
    run16: `${import.meta.env.BASE_URL}/data/max/base/water_quality_run16.json`,
    run17: `${import.meta.env.BASE_URL}/data/max/base/water_quality_run17.json`,
  },
  'max-deanna': {
    run15: `${import.meta.env.BASE_URL}/data/max/Deanna/water_quality_run15.json`,
    run16: `${import.meta.env.BASE_URL}/data/max/Deanna/water_quality_run16.json`,
    run17: `${import.meta.env.BASE_URL}/data/max/Deanna/water_quality_run17.json`,
  },
  'mean-base': {
    run15: `${import.meta.env.BASE_URL}/data/mean/base/water_quality_run15.json`,
    run16: `${import.meta.env.BASE_URL}/data/mean/base/water_quality_run16.json`,
    run17: `${import.meta.env.BASE_URL}/data/mean/base/water_quality_run17.json`,
  },
  'mean-stringent': {
    run15: `${import.meta.env.BASE_URL}/data/mean/stringent/water_quality_run15.json`,
    run16: `${import.meta.env.BASE_URL}/data/mean/stringent/water_quality_run16.json`,
    run17: `${import.meta.env.BASE_URL}/data/mean/stringent/water_quality_run17.json`,
  },
};

const categoryColors = {
  good: palette.brand.primaryBlue,
  acceptable: alpha(palette.brand.primaryBlue, 0.5),
  unacceptable: palette.accent.orange,
};

interface RenderSegment {
  segment: WaterQualitySegment;
  station: string;
  startDate: Date;
  endDate: Date;
}

interface StationDisplayRow {
  kind: 'station';
  key: string;
  record: WaterQualityRecord;
}

interface GapDisplayRow {
  kind: 'gap';
  key: string;
  vulnerability: VulnerabilityGroup;
}

type DisplayRow = StationDisplayRow | GapDisplayRow;

function isStationRow(row: DisplayRow): row is StationDisplayRow {
  return row.kind === 'station';
}

function isGapRow(row: DisplayRow): row is GapDisplayRow {
  return row.kind === 'gap';
}

function getStationRecord(row: DisplayRow): WaterQualityRecord {
  return (row as StationDisplayRow).record;
}

function getGapVulnerability(row: DisplayRow): VulnerabilityGroup {
  return (row as GapDisplayRow).vulnerability;
}

interface GanttChartProps {
  onHoverDateChange?: (date: string | null) => void;
  onHoverStationIndexChange?: (stationIndex: number | null) => void;
  onStationCategoryListsChange?: (payload: {
    unacceptableOver75: number[];
    goodOver75: number[];
  }) => void;
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function normalizeStationIndex(value: string | number): number {
  return typeof value === 'number' ? value : Number.parseInt(value, 10);
}

function normalizeVulnerability(value?: string): VulnerabilityGroup {
  const normalized = value?.toUpperCase();

  if (normalized === 'HIGHEST' || normalized === 'HIGH' || normalized === 'MODERATE') {
    return normalized;
  }

  return 'MODERATE';
}

function formatVulnerabilityLabel(vulnerability: VulnerabilityGroup): string {
  return `${vulnerability}`;
}

function buildStationMetricsMap(summary?: WaterQualitySummaryRecord[]) {
  const metricsByStationIndex = new Map<number, WaterQualityStationMetrics>();

  summary?.forEach((record) => {
    const stationIndex = normalizeStationIndex(record.station_index);

    metricsByStationIndex.set(stationIndex, {
      good: Number(record.good) || 0,
      acceptable: Number(record.acceptable) || 0,
      unacceptable: Number(record.unacceptable) || 0,
    });
  });

  return metricsByStationIndex;
}

function normalizeWaterQualityData(payload: RawWaterQualityData): WaterQualityData {
  return {
    timestamps: payload.timestamps,
    records: payload.records.map((record) => ({
      station: record.station,
      station_index: normalizeStationIndex(record.station_index),
      vulnerability: normalizeVulnerability(record.vulnerability),
      segments: record.segments.map((segment) => ({
        status: segment.status,
        start: segment.start,
        end: segment.end,
      })),
    })),
    summary: payload.summary?.map((record) => ({
      station: record.station,
      station_index: normalizeStationIndex(record.station_index),
      good: Number(record.good) || 0,
      acceptable: Number(record.acceptable) || 0,
      unacceptable: Number(record.unacceptable) || 0,
      not_good: record.not_good,
    })),
  };
}

function compareStationRecords(
  a: WaterQualityRecord,
  b: WaterQualityRecord,
  sortMode: SortMode,
  stationMetrics: Map<number, WaterQualityStationMetrics>,
) {
  const aMetrics = stationMetrics.get(a.station_index) ?? { good: 0, acceptable: 0, unacceptable: 0 };
  const bMetrics = stationMetrics.get(b.station_index) ?? { good: 0, acceptable: 0, unacceptable: 0 };

  if (sortMode === 'station-index') {
    return a.station_index - b.station_index;
  }

  if (sortMode === 'good') {
    const goodDelta = bMetrics.good - aMetrics.good;
    if (goodDelta !== 0) {
      return goodDelta;
    }

    const acceptableDelta = bMetrics.acceptable - aMetrics.acceptable;
    return acceptableDelta !== 0 ? acceptableDelta : a.station_index - b.station_index;
  }

  const unacceptableDelta = bMetrics.unacceptable - aMetrics.unacceptable;
  if (unacceptableDelta !== 0) {
    return unacceptableDelta;
  }

  const acceptableDelta = bMetrics.acceptable - aMetrics.acceptable;
  return acceptableDelta !== 0 ? acceptableDelta : a.station_index - b.station_index;
}

function sortStationRecords(
  records: WaterQualityRecord[],
  sortMode: SortMode,
  stationMetrics: Map<number, WaterQualityStationMetrics>,
) {
  return [...records].sort((a, b) => compareStationRecords(a, b, sortMode, stationMetrics));
}

function buildDisplayRows(
  records: WaterQualityRecord[],
  sortMode: SortMode,
  partitionByVulnerability: boolean,
  stationMetrics: Map<number, WaterQualityStationMetrics>,
) {
  if (!partitionByVulnerability) {
    return sortStationRecords(records, sortMode, stationMetrics).map((record): DisplayRow => ({
      kind: 'station',
      key: `station-${record.station_index}`,
      record,
    }));
  }

  const rows: DisplayRow[] = [];

  VULNERABILITY_GROUP_ORDER.forEach((vulnerability) => {
    const groupedRecords = sortStationRecords(
      records.filter((record) => record.vulnerability === vulnerability),
      sortMode,
      stationMetrics,
    );

    if (groupedRecords.length === 0) {
      return;
    }

    if (rows.length === 0 || rows[rows.length - 1]?.kind === 'station') {
      rows.push({
        kind: 'gap',
        key: `gap-${vulnerability}-${rows.length}`,
        vulnerability,
      });
    }

    groupedRecords.forEach((record) => {
      rows.push({
        kind: 'station',
        key: `station-${record.station_index}-${vulnerability}`,
        record,
      });
    });
  });

  return rows;
}

function getAxisTickConfig(start: Date, end: Date) {
  const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  if (days > 540) {
    return { interval: d3.timeMonth.every(3), format: d3.timeFormat('%b %Y') };
  }

  if (days > 180) {
    return { interval: d3.timeMonth.every(1), format: d3.timeFormat('%b %Y') };
  }

  if (days > 60) {
    return { interval: d3.timeWeek.every(1), format: d3.timeFormat('%b %d') };
  }

  if (days > 14) {
    return { interval: d3.timeDay.every(2), format: d3.timeFormat('%b %d') };
  }

  return { interval: d3.timeDay.every(1), format: d3.timeFormat('%b %d') };
}

export default function GanttChart({
  onHoverDateChange,
  onHoverStationIndexChange,
  onStationCategoryListsChange,
}: GanttChartProps) {
  const theme = useTheme();
  const [data, setData] = useState<WaterQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusDomain, setFocusDomain] = useState<[Date, Date] | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('unacceptable');
  const [datasetMode, setDatasetMode] = useState<DatasetMode>('run15');
  const [configurationMode, setConfigurationMode] = useState<ConfigurationMode>('max-base');
  const [partitionByVulnerability, setPartitionByVulnerability] = useState(false);
  const [unacceptableFocusThreshold, setUnacceptableFocusThreshold] = useState(75);
  const [goodFocusThreshold, setGoodFocusThreshold] = useState(75);
  const [stationShortNameByIndex, setStationShortNameByIndex] = useState<Map<number, string>>(new Map());
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const chartColors = useMemo(
    () => ({
      axisDomain: palette.base[400],
      axisTick: palette.base[700],
      brushLane: palette.base[800],
      brushStroke: palette.base[600],
      focus: palette.brand.primaryGreen,
      focusWash: alpha(palette.brand.primaryGreen, 0.47),
      rowFill: alpha(palette.base[800], 0.24),
      text: palette.common.white,
      mutedText: palette.base[100],
      groupText: '#8bc4d4',
      ...categoryColors,
    }),
    [],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadStationInfo() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}/data/water_quality_station_info.json`);
        if (!response.ok) {
          throw new Error(`Failed to load station info (${response.status})`);
        }

        const payload = (await response.json()) as StationInfoPayload;
        const nextMap = new Map<number, string>();

        payload.stations.forEach((record) => {
          nextMap.set(Number(record.station_index), record.station_short_name);
        });

        if (isMounted) {
          setStationShortNameByIndex(nextMap);
        }
      } catch {
        if (isMounted) {
          setStationShortNameByIndex(new Map());
        }
      }
    }

    void loadStationInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!canvasWrapRef.current) {
      return;
    }

    const element = canvasWrapRef.current;

    const updateSize = () => {
      setCanvasSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch(DATASET_PATHS[configurationMode][datasetMode]);
        if (!response.ok) {
          throw new Error(`Failed to load water quality data (${response.status})`);
        }

        const rawPayload = (await response.json()) as RawWaterQualityData;
        const payload = normalizeWaterQualityData(rawPayload);
        if (isMounted) {
          setData(payload);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown data loading error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [datasetMode, configurationMode]);

  const bounds = useMemo(() => {
    if (!data || data.timestamps.length === 0) {
      return null;
    }

    const startDate = parseDate(data.timestamps[0]);
    const endDate = parseDate(data.timestamps[data.timestamps.length - 1]);

    return { startDate, endDate };
  }, [data]);

  const stationMetrics = useMemo(() => {
    if (!data) {
      return new Map<number, WaterQualityStationMetrics>();
    }

    return buildStationMetricsMap(data.summary);
  }, [data]);

  const displayRows = useMemo(() => {
    if (!data) {
      return [] as DisplayRow[];
    }

    return buildDisplayRows(data.records, sortMode, partitionByVulnerability, stationMetrics);
  }, [data, sortMode, partitionByVulnerability, stationMetrics]);

  const parsedTimeline = useMemo(() => {
    if (!data) {
      return [] as Array<{ label: string; date: Date }>;
    }

    return data.timestamps.map((label) => ({ label, date: parseDate(label) }));
  }, [data]);

  const stationCategoryLists = useMemo(() => {
    if (!data || !data.summary) {
      return { unacceptableOver75: [], goodOver75: [] };
    }

    const unacceptableThresholdRatio = unacceptableFocusThreshold / 100;
    const goodThresholdRatio = goodFocusThreshold / 100;
    const unacceptableOver75: number[] = [];
    const goodOver75: number[] = [];

    data.summary.forEach((record) => {
      const goodDays = Number(record.good) || 0;
      const acceptableDays = Number(record.acceptable) || 0;
      const unacceptableDays = Number(record.unacceptable) || 0;
      const totalDays = goodDays + acceptableDays + unacceptableDays;

      if (totalDays <= 0) {
        return;
      }

      const unacceptableRatio = unacceptableDays / totalDays;
      const goodRatio = goodDays / totalDays;

      if (unacceptableRatio >= unacceptableThresholdRatio) {
        unacceptableOver75.push(record.station_index);
      }

      if (goodRatio >= goodThresholdRatio) {
        goodOver75.push(record.station_index);
      }
    });

    return { unacceptableOver75, goodOver75 };
  }, [data, unacceptableFocusThreshold, goodFocusThreshold]);

  const unacceptableOver75Set = useMemo(() => {
    return new Set(stationCategoryLists.unacceptableOver75);
  }, [stationCategoryLists.unacceptableOver75]);

  const goodOver75Set = useMemo(() => {
    return new Set(stationCategoryLists.goodOver75);
  }, [stationCategoryLists.goodOver75]);

  const focusedStationIndexSet = useMemo(() => {
    return new Set([
      ...stationCategoryLists.unacceptableOver75,
      ...stationCategoryLists.goodOver75,
    ]);
  }, [stationCategoryLists]);

  useEffect(() => {
    onStationCategoryListsChange?.(stationCategoryLists);
  }, [stationCategoryLists, onStationCategoryListsChange]);

  useEffect(() => {
    onHoverDateChange?.(null);
    onHoverStationIndexChange?.(null);
  }, [datasetMode, configurationMode, onHoverDateChange, onHoverStationIndexChange]);

  useEffect(() => {
    if (!data || !bounds || !svgRef.current) {
      return;
    }

    const containerWidth = canvasSize.width;
    const containerHeight = canvasSize.height;
    const svgFontFamily = theme.typography.fontFamily ?? 'Nunito Sans, Arial, sans-serif';
    const chartWidth = Math.max(containerWidth, 620);
    const brushHeight = 8;
    const margin = { top: 30, right: 14, bottom: 10, left: 38 };
    const brushGap = partitionByVulnerability ? 20 : 8;
    const availableInnerHeight = Math.max(
      containerHeight - (margin.top + brushHeight + brushGap + margin.bottom),
      100,
    );
    const innerHeight = containerHeight > 0 ? availableInnerHeight : Math.max(displayRows.length * 9, 100);
    const barsTop = margin.top + brushHeight + brushGap;
    const brushTop = margin.top;
    const chartHeight = barsTop + innerHeight + margin.bottom;
    const [domainStart, domainEnd] = focusDomain ?? [bounds.startDate, bounds.endDate];

    const svg = d3.select(svgRef.current);
    svg.attr('width', chartWidth);
    svg.attr('height', chartHeight);
    svg.attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`);
    svg.selectAll('*').remove();

    const xOverview = d3
      .scaleTime()
      .domain([bounds.startDate, bounds.endDate])
      .range([margin.left, chartWidth - margin.right]);

    const x = d3
      .scaleTime()
      .domain([domainStart, domainEnd])
      .range([margin.left, chartWidth - margin.right]);

    const tickConfig = getAxisTickConfig(domainStart, domainEnd);

    const y = d3
      .scaleBand<string>()
      .domain(displayRows.map((row) => row.key))
      .range([barsTop, barsTop + innerHeight])
      .paddingInner(0.35)
      .paddingOuter(0.2);

    const axis = d3
      .axisTop<Date>(x)
      .ticks(tickConfig.interval)
      .tickSizeOuter(0)
      .tickFormat(tickConfig.format as (d: Date | d3.NumberValue, i: number) => string);

    const axisGroup = svg
      .append('g')
      .attr('class', 'gantt-axis')
      .attr('transform', `translate(0, ${margin.top - 8})`)
      .call(axis);

    axisGroup.select('.domain').attr('stroke', chartColors.axisDomain);
    axisGroup.selectAll('.tick line').attr('stroke', chartColors.axisTick);
    axisGroup
      .selectAll('.tick text')
      .attr('fill', chartColors.mutedText)
      .style('font-size', '0.5rem')
      .style('font-family', svgFontFamily)
      .style('font-weight', 400);

    const plotGroup = svg.append('g').attr('class', 'gantt-plot');

    const rowGroups = plotGroup
      .append('g')
      .selectAll('g')
      .data(displayRows)
      .join('g')
      .attr('transform', (row: DisplayRow) => `translate(0, ${y(row.key) ?? 0})`);

    rowGroups
      .filter(isGapRow)
      .append('text')
      .attr('x', margin.left - 6)
      .attr('y', (y.bandwidth() / 2) + 0.5)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', chartColors.groupText)
      .style('font-size', '0.5rem')
      .style('font-family', svgFontFamily)
      .style('font-weight', 700)
      .attr('letter-spacing', '0.06em')
      .attr('text-transform', 'uppercase')
      .text((row: DisplayRow) => formatVulnerabilityLabel(getGapVulnerability(row)));

    rowGroups
      .filter(isStationRow)
      .append('text')
      .attr('x', margin.left - 6)
      .attr('y', (y.bandwidth() / 2) + 0.5)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .style('font-size', '0.5rem')
      .style('font-family', svgFontFamily)
      .style('text-transform', 'uppercase')
      .attr('font-weight', (row: DisplayRow) => {
        const record = getStationRecord(row);
        return focusedStationIndexSet.has(record.station_index) ? 700 : 400;
      })
      .style('fill', (row: DisplayRow) => {
        const record = getStationRecord(row);

        if (unacceptableOver75Set.has(record.station_index)) {
          return chartColors.unacceptable;
        }

        if (goodOver75Set.has(record.station_index)) {
          return chartColors.good;
        }

        return chartColors.mutedText;
      })
      .style('cursor', 'pointer')
      .text((row: DisplayRow) => {
        const stationIndex = getStationRecord(row).station_index;
        return stationShortNameByIndex.get(stationIndex) ?? String(stationIndex);
      })
      .on('mouseenter', (_, row: DisplayRow) => {
        const record = getStationRecord(row);
        onHoverStationIndexChange?.(record.station_index);
      })
      .on('mouseleave', () => {
        onHoverStationIndexChange?.(null);
      });

    rowGroups
      .filter(isStationRow)
      .append('rect')
      .attr('x', margin.left)
      .attr('y', 0)
      .attr('height', y.bandwidth())
      .attr('width', chartWidth - margin.left - margin.right)
      .attr('fill', chartColors.rowFill);

    rowGroups
      .filter(isStationRow)
      .append('g')
      .attr('class', 'gantt-segments')
      .selectAll('rect')
      .data((row: DisplayRow) =>
        getStationRecord(row).segments
          .map((segment: WaterQualitySegment) => ({
            segment,
            station: getStationRecord(row).station,
            startDate: parseDate(segment.start),
            endDate: parseDate(segment.end),
          }))
          .filter((entry) => entry.endDate >= domainStart && entry.startDate <= domainEnd),
      )
      .join('rect')
      .attr('x', (d: RenderSegment) => x(d.startDate < domainStart ? domainStart : d.startDate))
      .attr('y', 0)
      .attr('height', y.bandwidth())
      .attr('fill', (d: RenderSegment) => {
        if (d.segment.status === 'acceptable') {
          return chartColors.acceptable;
        }

        if (d.segment.status === 'unacceptable') {
          return chartColors.unacceptable;
        }

        return chartColors.good;
      })
      .attr('shape-rendering', 'geometricPrecision')
      .attr('width', (d: RenderSegment) => {
        const visibleStart = d.startDate < domainStart ? domainStart : d.startDate;
        const visibleEnd = d.endDate > domainEnd ? domainEnd : d.endDate;
        const start = x(visibleStart);
        const end = x(visibleEnd);
        return Math.max(end - start, 1);
      })
      .append('title')
      .text((d: RenderSegment) => `${d.station}: ${d.segment.status} (${d.segment.start} to ${d.segment.end})`);

    const zoom = d3
      .zoom<SVGRectElement, unknown>()
      .scaleExtent([1, 250])
      .translateExtent([
        [margin.left, barsTop],
        [chartWidth - margin.right, barsTop + innerHeight],
      ])
      .extent([
        [margin.left, barsTop],
        [chartWidth - margin.right, barsTop + innerHeight],
      ])
      .on('zoom', (event: d3.D3ZoomEvent<SVGRectElement, unknown>) => {
        if (!event.sourceEvent) {
          return;
        }

        const nextScale = event.transform.rescaleX(xOverview);
        const [nextStart, nextEnd] = nextScale.domain() as [Date, Date];
        if (nextEnd <= nextStart) {
          return;
        }

        setFocusDomain([nextStart, nextEnd]);
      });

    const zoomOverlay = svg
      .append('rect')
      .attr('x', margin.left)
      .attr('y', barsTop)
      .attr('width', chartWidth - margin.left - margin.right)
      .attr('height', innerHeight)
      .style('fill', 'transparent')
      .style('pointer-events', 'all')
      .style('cursor', 'grab')
      .call(zoom);

    const hoverLayer = svg.append('g').attr('class', 'gantt-hover-layer');
    const hoverLine = hoverLayer
      .append('line')
      .attr('y1', barsTop)
      .attr('y2', barsTop + innerHeight)
      .attr('stroke', chartColors.focus)
      .attr('stroke-width', 1)
      .style('display', 'none');

    const bisectCenter = d3.bisector((d: { label: string; date: Date }) => d.date).center;

    zoomOverlay
      .on('mousemove', (event) => {
        if (parsedTimeline.length === 0) {
          return;
        }

        const [mx] = d3.pointer(event, svg.node());
        const clampedX = Math.max(margin.left, Math.min(chartWidth - margin.right, mx));
        const hoveredDate = x.invert(clampedX);
        const idx = bisectCenter(parsedTimeline, hoveredDate);
        const nearest = parsedTimeline[idx];
        if (!nearest) {
          return;
        }

        const lineX = x(nearest.date);
        hoverLine
          .attr('x1', lineX)
          .attr('x2', lineX)
          .style('display', 'block');

        onHoverDateChange?.(nearest.label);
      })
      .on('mouseleave', () => {
        hoverLine.style('display', 'none');
        onHoverDateChange?.(null);
      });

    const totalWidth = chartWidth - margin.left - margin.right;
    const focusedWidth = xOverview(domainEnd) - xOverview(domainStart);
    const zoomScale = Math.max(totalWidth / Math.max(focusedWidth, 1), 1);
    const translateX = margin.left - zoomScale * xOverview(domainStart);
    const zoomTransform = d3.zoomIdentity.translate(translateX, 0).scale(zoomScale);
    zoomOverlay.call(zoom.transform, zoomTransform);

    svg
      .append('rect')
      .attr('x', margin.left)
      .attr('y', brushTop)
      .attr('width', chartWidth - margin.left - margin.right)
      .attr('height', brushHeight)
      .attr('rx', 2)
      .attr('fill', chartColors.brushLane)
      .attr('stroke', chartColors.brushStroke)
      .attr('stroke-width', 1);

    const brush = d3
      .brushX()
      .handleSize(4)
      .extent([
        [margin.left, brushTop],
        [chartWidth - margin.right, brushTop + brushHeight],
      ])
      .on('brush end', (event: d3.D3BrushEvent<unknown>) => {
        if (!event.sourceEvent) {
          return;
        }

        if (!event.selection) {
          setFocusDomain(null);
          return;
        }

        const [x0, x1] = event.selection as [number, number];
        const nextStart = xOverview.invert(x0);
        const nextEnd = xOverview.invert(x1);

        if (nextEnd <= nextStart) {
          return;
        }

        setFocusDomain([nextStart, nextEnd]);
      });

    const brushGroup = svg.append('g').attr('class', 'gantt-brush').call(brush);

    brushGroup.call(brush.move, [xOverview(domainStart), xOverview(domainEnd)]);

    brushGroup.selectAll('.overlay').style('cursor', 'crosshair');
    brushGroup
      .selectAll('.selection')
      .attr('fill', chartColors.focusWash)
      .attr('stroke', chartColors.focus)
      .attr('stroke-width', 1)
      .attr('height', brushHeight)
      .attr('y', brushTop);
    brushGroup
      .selectAll('.handle')
      .attr('fill', chartColors.focus)
      .attr('height', brushHeight + 2)
      .attr('y', brushTop - 1)
      .attr('rx', 1.5);
  }, [
    data,
    bounds,
    canvasSize,
    focusDomain,
    displayRows,
    parsedTimeline,
    partitionByVulnerability,
    focusedStationIndexSet,
    unacceptableOver75Set,
    goodOver75Set,
    stationShortNameByIndex,
    chartColors,
    theme.typography.fontFamily,
    onHoverDateChange,
    onHoverStationIndexChange,
  ]);

  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'common.white',
          p: theme.jtSpacing.component.md,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">Loading water quality timeline...</Typography>
      </Box>
    );
  }

  if (error || !data || !bounds) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'common.white',
          p: theme.jtSpacing.component.md,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">{error ?? 'No timeline data available.'}</Typography>
      </Box>
    );
  }

  const compactFieldSx = {
    '& .MuiInputLabel-root': {
      typography: 'captionSmall',
      lineHeight: 1,
      transform: 'translate(10px, 7px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(10px, -6px) scale(0.78)',
      },
    },
    '& .MuiOutlinedInput-root': {
      minHeight: 30,
      typography: 'captionSmall',
    },
    '& .MuiSelect-select': {
      py: 0.55,
      pl: 1.2,
      pr: '26px !important',
      lineHeight: 1.15,
      minHeight: 'unset !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  } as const;

  return (
    <Box
      aria-label="Water quality gantt chart"
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.jtSpacing.component.xs,
        p: theme.jtSpacing.component.xs,
        bgcolor: 'base.700',
        color: 'common.white',
      }}
    >
      <Box
        component="header"
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto auto',
          gap: 0.5,
          px: theme.jtSpacing.component.xs,
          py: 0,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 0.75,
            alignItems: 'center',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" component="h4" sx={{color: "brand.primaryGreen"}}>
              Water Quality
            </Typography>
            <Typography variant="captionSmall" component="p" sx={{ color: 'base.100', lineHeight: 1.1, mb: 0 }}>
              {data.timestamps[0]} - {data.timestamps[data.timestamps.length - 1]}
            </Typography>
          </Box>

          <FormControl size="small" sx={compactFieldSx}>
            <InputLabel id="gantt-dataset-label">Run</InputLabel>
            <Select
              labelId="gantt-dataset-label"
              id="gantt-dataset-select"
              label="Run"
              value={datasetMode}
              onChange={(event) => {
                setFocusDomain(null);
                setDatasetMode(event.target.value as DatasetMode);
              }}
            >
              <MenuItem value="run15">Run 15 - Historical</MenuItem>
              <MenuItem value="run16">Run 16 - 10decrease</MenuItem>
              <MenuItem value="run17">Run 17 - 30increase</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={compactFieldSx}>
            <InputLabel id="gantt-configuration-label">Configuration</InputLabel>
            <Select
              labelId="gantt-configuration-label"
              id="gantt-configuration-select"
              label="Configuration"
              value={configurationMode}
              onChange={(event) => {
                setFocusDomain(null);
                setConfigurationMode(event.target.value as ConfigurationMode);
              }}
            >
              <MenuItem value="max-base">Max daily - base thresholds</MenuItem>
              <MenuItem value="max-deanna">Max daily - Deanna thresholds</MenuItem>
              <MenuItem value="mean-base">Mean daily - base thresholds</MenuItem>
              <MenuItem value="mean-stringent">Mean daily - stringent thresholds</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={compactFieldSx}>
            <InputLabel id="gantt-sort-label">Sort Stations</InputLabel>
            <Select
              labelId="gantt-sort-label"
              id="gantt-sort-select"
              label="Sort Stations"
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
            >
              <MenuItem value="unacceptable">Sorted by unacceptable</MenuItem>
              <MenuItem value="good">Sorted by good</MenuItem>
              <MenuItem value="station-index">Sorted by station index</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '150px minmax(150px, 1fr) minmax(170px, 1fr) 1fr' },
            gap: 4,
            alignItems: 'center',
          }}
        >
          <FormControlLabel
            control={
              <Switch
                size="small"
                id="gantt-partition-toggle"
                checked={partitionByVulnerability}
                onChange={(event) => setPartitionByVulnerability(event.target.checked)}
              />
            }
            label="Group by Vulnerability"
            sx={{
              color: 'base.100',
              m: 0,
              '& .MuiFormControlLabel-label': { typography: 'captionSmall' },
            }}
          />

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
            <Typography id="gantt-unacceptable-threshold-label" variant="captionSmall" sx={{ color: 'accent.orange', whiteSpace: 'nowrap' }}>
              Unacceptable {unacceptableFocusThreshold}%
            </Typography>
            <Slider
              aria-labelledby="gantt-unacceptable-threshold-label"
              min={0}
              max={100}
              step={1}
              value={unacceptableFocusThreshold}
              onChange={(_, value) => setUnacceptableFocusThreshold(Array.isArray(value) ? value[0] : value)}
              size="small"
              sx={{ color: 'accent.orange', py: 0.25 }}
            />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
            <Typography id="gantt-good-threshold-label" variant="captionSmall" sx={{ color: 'secondary.light', whiteSpace: 'nowrap' }}>
              Good {goodFocusThreshold}%
            </Typography>
            <Slider
              aria-labelledby="gantt-good-threshold-label"
              min={0}
              max={100}
              step={1}
              value={goodFocusThreshold}
              onChange={(_, value) => setGoodFocusThreshold(Array.isArray(value) ? value[0] : value)}
              size="small"
              sx={{ color: 'secondary.main', py: 0.25 }}
            />
          </Stack>

          <Stack direction="row" spacing={0.85} useFlexGap aria-label="Legend" sx={{ alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            {[
              { label: 'Good', color: categoryColors.good },
              { label: 'Acceptable', color: categoryColors.acceptable },
              { label: 'Unacceptable', color: categoryColors.unacceptable },
            ].map((item) => (
              <Stack key={item.label} component="span" direction="row" spacing={1} sx={{ alignItems: 'center', color: 'base.100' }}>
                <Box component="i" aria-hidden sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                <Typography variant="captionSmall" component="span" sx={{ color: 'inherit', whiteSpace: 'nowrap', }}>
                  {item.label}
                </Typography>
              </Stack>
            ))}
            {focusDomain && (
              <Button variant="outlined" size="small" onClick={() => setFocusDomain(null)} sx={{ py: 0.25, px: 1,  }}>
                Reset
              </Button>
            )}
          </Stack>
        </Box>
      </Box>

      <Box
        ref={canvasWrapRef}
        role="img"
        aria-label="Water quality timeline chart"
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          borderTop: '1px solid',
          borderColor: 'rgba(155,162,164,0.18)',
        }}
      >
        <Box component="svg" ref={svgRef} sx={{ width: '100%', height: '100%', display: 'block' }} />
      </Box>
    </Box>
  );
}
