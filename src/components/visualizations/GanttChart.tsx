import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import './GanttChart.css';

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

type SortMode = 'unacceptable' | 'good' | 'station-index';
type DatasetMode = 'run15' | 'run16' | 'run17';

const VULNERABILITY_GROUP_ORDER: VulnerabilityGroup[] = ['HIGHEST', 'HIGH', 'MODERATE'];

const DATASET_PATHS: Record<DatasetMode, string> = {
  run15: `${import.meta.env.BASE_URL}data/water_quality_run15.json`,
  run16: `${import.meta.env.BASE_URL}data/water_quality_run16.json`,
  run17: `${import.meta.env.BASE_URL}data/water_quality_run17.json`,
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
  const [data, setData] = useState<WaterQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusDomain, setFocusDomain] = useState<[Date, Date] | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('unacceptable');
  const [datasetMode, setDatasetMode] = useState<DatasetMode>('run15');
  const [partitionByVulnerability, setPartitionByVulnerability] = useState(false);
  const [unacceptableFocusThreshold, setUnacceptableFocusThreshold] = useState(75);
  const [goodFocusThreshold, setGoodFocusThreshold] = useState(75);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

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
        const response = await fetch(DATASET_PATHS[datasetMode]);
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
  }, [datasetMode]);

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
  }, [datasetMode, onHoverDateChange, onHoverStationIndexChange]);

  useEffect(() => {
    if (!data || !bounds || !svgRef.current) {
      return;
    }

    const containerWidth = canvasSize.width;
    const containerHeight = canvasSize.height;
    const isLargeViewport = containerWidth >= 1024;
    const chartWidth = isLargeViewport ? Math.max(containerWidth, 900) : 1100;
    const brushHeight = 24;
    const margin = { top: 26, right: 18, bottom: 22, left: 84 };
    const brushGap = partitionByVulnerability ? 20 : 8;
    const defaultRowHeight = 16;
    const defaultInnerHeight = Math.max(displayRows.length * defaultRowHeight, 100);
    const availableInnerHeight = Math.max(
      containerHeight - (margin.top + brushHeight + brushGap + margin.bottom),
      100,
    );
    const innerHeight = isLargeViewport && containerHeight > 0 ? availableInnerHeight : defaultInnerHeight;
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
      .paddingInner(0.32)
      .paddingOuter(0.1);

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

    axisGroup.select('.domain').attr('stroke', '#5e5e5e');
    axisGroup.selectAll('.tick line').attr('stroke', '#404040');
    axisGroup.selectAll('.tick text').attr('fill', '#cfcfcf').attr('font-size', 11);

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
      .attr('class', 'gantt-gap-label')
      .attr('x', margin.left - 8)
      .attr('y', (y.bandwidth() / 2) + 0.5)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text((row: DisplayRow) => formatVulnerabilityLabel(getGapVulnerability(row)));

    rowGroups
      .filter(isStationRow)
      .append('text')
      .attr('class', 'gantt-station-label')
      .attr('x', margin.left - 8)
      .attr('y', (y.bandwidth() / 2) + 0.5)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-weight', (row: DisplayRow) => {
        const record = getStationRecord(row);
        return focusedStationIndexSet.has(record.station_index) ? 700 : 400;
      })
      .style('fill', (row: DisplayRow) => {
        const record = getStationRecord(row);

        if (unacceptableOver75Set.has(record.station_index)) {
          return '#f77c3b';
        }

        if (goodOver75Set.has(record.station_index)) {
          return '#51a2bd';
        }

        return '#cfcfcf';
      })
      .style('cursor', 'pointer')
      .text((row: DisplayRow) => String(getStationRecord(row).station_index))
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
      .attr('class', 'gantt-row-default')
      .attr('x', margin.left)
      .attr('y', 0)
      .attr('height', y.bandwidth())
      .attr('width', chartWidth - margin.left - margin.right);

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
      .attr('class', (d: RenderSegment) => `gantt-segment ${d.segment.status}`)
      .attr('x', (d: RenderSegment) => x(d.startDate < domainStart ? domainStart : d.startDate))
      .attr('y', 0)
      .attr('height', y.bandwidth())
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
      .attr('class', 'gantt-zoom-overlay')
      .attr('x', margin.left)
      .attr('y', barsTop)
      .attr('width', chartWidth - margin.left - margin.right)
      .attr('height', innerHeight)
      .style('fill', 'transparent')
      .style('pointer-events', 'all')
      .call(zoom);

    const hoverLayer = svg.append('g').attr('class', 'gantt-hover-layer');
    const hoverLine = hoverLayer
      .append('line')
      .attr('class', 'gantt-hover-line')
      .attr('y1', barsTop)
      .attr('y2', barsTop + innerHeight)
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
      .attr('class', 'gantt-brush-lane')
      .attr('x', margin.left)
      .attr('y', brushTop)
      .attr('width', chartWidth - margin.left - margin.right)
      .attr('height', brushHeight)
      .attr('rx', 3);

    const brush = d3
      .brushX()
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
    onHoverDateChange,
    onHoverStationIndexChange,
  ]);

  if (loading) {
    return <div className="gantt-state">Loading water quality timeline...</div>;
  }

  if (error || !data || !bounds) {
    return <div className="gantt-state">{error ?? 'No timeline data available.'}</div>;
  }

  return (
    <div className="gantt-chart" aria-label="Water quality gantt chart">
      <div className="gantt-header">
        <div className="gantt-title-block">
          <h3>Water Quality Timeline</h3>
          <p>{data.timestamps[0]} to {data.timestamps[data.timestamps.length - 1]}</p>
          <div className="gantt-interaction-notes" aria-label="Chart interaction notes">
            <p className="gantt-interaction-note">Use the brush to focus on certain time window. Click outside to reset.</p>
            <p className="gantt-interaction-note">Hover a station index to highlight that station on the map.</p>
          </div>
          <div className="gantt-dataset-controls" aria-label="Dataset options">
            <label htmlFor="gantt-dataset-select">Dataset</label>
            <select
              id="gantt-dataset-select"
              className="gantt-dataset-select"
              value={datasetMode}
              onChange={(event) => {
                setFocusDomain(null);
                setDatasetMode(event.target.value as DatasetMode);
              }}
            >
              <option value="run15">Run 15 - Historical</option>
              <option value="run16">Run 16 - 10decrease</option>
              <option value="run17">Run 17 - 30increase</option>
            </select>
          </div>
        </div>
        <div className="gantt-controls">
          <div className="gantt-legend" aria-label="Legend">
            <span><i className="dot good" />Good</span>
            <span><i className="dot acceptable" />Acceptable</span>
            <span><i className="dot unacceptable" />Unacceptable</span>
            {focusDomain && (
              <button
                type="button"
                className="gantt-reset-btn"
                onClick={() => setFocusDomain(null)}
              >
                Reset Time Focus
              </button>
            )}
          </div>
          <div className="gantt-sort-controls" aria-label="Sort options">
            <label htmlFor="gantt-sort-select">Sort stations</label>
            <select
              id="gantt-sort-select"
              className="gantt-sort-select"
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
            >
              <option value="unacceptable">Sorted by unacceptable</option>
              <option value="good">Sorted by good</option>
              <option value="station-index">Sorted by station index</option>
            </select>
          </div>
          <div className="gantt-toggle-controls">
            <label className="gantt-toggle-label" htmlFor="gantt-partition-toggle">
              <input
                id="gantt-partition-toggle"
                className="gantt-partition-toggle"
                type="checkbox"
                checked={partitionByVulnerability}
                onChange={(event) => setPartitionByVulnerability(event.target.checked)}
              />
              Group by vulnerability
            </label>
          </div>
          <div className="gantt-threshold-controls" aria-label="Focus threshold options">
            <div className="gantt-threshold-group">
              <label className="gantt-threshold-label" htmlFor="gantt-unacceptable-threshold">
                Unacceptable Exceedance: <span className="gantt-threshold-value-unacceptable">{unacceptableFocusThreshold}%</span>
              </label>
              <input
                id="gantt-unacceptable-threshold"
                className="gantt-threshold-slider gantt-threshold-slider-unacceptable"
                type="range"
                min={0}
                max={100}
                step={1}
                value={unacceptableFocusThreshold}
                onChange={(event) => setUnacceptableFocusThreshold(Number(event.target.value))}
              />
            </div>
            <div className="gantt-threshold-group">
              <label className="gantt-threshold-label" htmlFor="gantt-good-threshold">
                Good Exceedance: <span>{goodFocusThreshold}%</span>
              </label>
              <input
                id="gantt-good-threshold"
                className="gantt-threshold-slider"
                type="range"
                min={0}
                max={100}
                step={1}
                value={goodFocusThreshold}
                onChange={(event) => setGoodFocusThreshold(Number(event.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      <div ref={canvasWrapRef} className="gantt-canvas-wrap" role="img" aria-label="Water quality timeline chart">
        <svg ref={svgRef} className="gantt-svg" />
      </div>
    </div>
  );
}
