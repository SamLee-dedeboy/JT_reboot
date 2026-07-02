// Internal watershed scenario dashboard for comparing restoration metrics and
// modeled change ranges.
import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import ForestRoundedIcon from '@mui/icons-material/ForestRounded';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
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
import Section from '../common/Section';
import SectionHead from '../common/SectionHead';
import ScrollReveal from '../animation/ScrollReveal';
import Icon, { FloodplainTileIcon, type IconName } from '../common/Icon';
import Hl from '../common/Highlight';
import { assetUrl } from '../../utils/baseUrl';
import { palette } from '../../theme/muiTheme';

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

interface ChartTooltipState {
  x: number;
  y: number;
  title: string;
  subtitle: string;
  color: string;
  rows: Array<{
    label: string;
    value: string;
    color: string;
  }>;
}

type AttentionCompareMode = 'acres' | 'percent';
type AttentionScaleMode = 'linear' | 'log';
type AttentionDesignMode = 'bars' | 'icons' | 'area' | 'overlay';

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
    baseColor: '#4fb06f',
    shadeRange: ['#b7d6bd', '#4fb06f'],
    restorableAcres: 11700000,
    acreageMetric: 'change in et',
  },
  meadows: {
    label: 'Meadows',
    singular: 'meadow',
    icon: 'compass',
    baseColor: '#d8bf42',
    shadeRange: ['#eee59a', '#d8bf42'],
    restorableAcres: 115863.6,
    acreageMetric: 'change in et**',
  },
  floodplains: {
    label: 'Floodplains',
    singular: 'floodplain',
    icon: 'waves',
    baseColor: '#62b6d9',
    shadeRange: ['#b9ddec', '#62b6d9'],
    restorableAcres: 63600,
    acreageMetric: 'change in gw recharge',
  },
};

const SCENARIO_LEDE =
  'The New Green Watershed scenario imagines ecological restoration and land-use adaptation as tools for addressing subsidence, flooding, habitat stress, and the transition toward a more regenerative Delta economy.';

const SCENARIO_DETAIL =
  'Placeholder text... This page helps compare how restoration priorities change modeled watershed outcomes across habitat focus areas and restoration levels.';

const watershedHighlights: Array<{ n: string; icon: IconName; title: string; body: string }> = [
  {
    n: '01',
    icon: 'waves',
    title: 'Watershed Connections',
    body: 'Placeholder text',
  },
  {
    n: '02',
    icon: 'compass',
    title: 'Scenario Indicators',
    body: 'Placeholder text',
  },
  {
    n: '03',
    icon: 'layers',
    title: 'Habitat Restoration',
    body: 'Placeholder text',
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

function formatRestorationShort(level: string) {
  if (level === 'min') {
    return 'Minimum';
  }

  if (level === 'med') {
    return 'Medium';
  }

  if (level === 'max') {
    return 'Maximum';
  }

  return formatLabel(level);
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

function formatCompactNumber(value: number) {
  return d3.format('.3~s')(value).replace('G', 'B');
}

function formatPercent(value: number) {
  return `${d3.format(',.1f')(value)}%`;
}

function formatCompactPercent(value: number) {
  return value >= 100 ? `${d3.format(',.0f')(value)}%` : formatPercent(value);
}

function formatWholePercent(value: number) {
  return `${d3.format(',.0f')(value)}%`;
}

const HABITAT_ATTENTION_ICONS = {
  forests: ForestRoundedIcon,
  meadows: GrassRoundedIcon,
} as const;

function FilledHabitatIcon({
  habitatFocus,
  percent,
  size = 52,
  fillOpacity = 1,
}: {
  habitatFocus: string;
  percent: number;
  size?: number;
  fillOpacity?: number;
}) {
  const meta = HABITAT_META[habitatFocus];
  const HabitatIcon = HABITAT_ATTENTION_ICONS[habitatFocus as keyof typeof HABITAT_ATTENTION_ICONS];
  const fillPercent = Math.max(0, Math.min(percent, 100));

  if (habitatFocus === 'floodplains') {
    return (
      <Box sx={{ position: 'relative', width: size, height: size, flex: '0 0 auto' }} aria-hidden>
        <FloodplainTileIcon size={size} sx={{ position: 'absolute', inset: 0, color: 'rgba(242,240,239,0.18)' }} />
        <FloodplainTileIcon
          size={size}
          sx={{
            position: 'absolute',
            inset: 0,
            color: meta.baseColor,
            opacity: fillOpacity,
            clipPath: `inset(${100 - fillPercent}% 0 0 0)`,
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: size, height: size, flex: '0 0 auto' }} aria-hidden>
      <HabitatIcon sx={{ position: 'absolute', inset: 0, width: size, height: size, color: 'rgba(242,240,239,0.18)' }} />
      <HabitatIcon
        sx={{
          position: 'absolute',
          inset: 0,
          width: size,
          height: size,
          color: meta.baseColor,
          opacity: fillOpacity,
          clipPath: `inset(${100 - fillPercent}% 0 0 0)`,
        }}
      />
    </Box>
  );
}

function HabitatAttentionIconSet({
  segment,
}: {
  segment: AttentionSegment;
}) {
  const isFloodplain = segment.habitatFocus === 'floodplains';
  const isMeadow = segment.habitatFocus === 'meadows';

  if (isFloodplain) {
    const expansionIconCount = Math.max(1, Math.min(Math.ceil(segment.percent / 100), 6));

    return (
      <Stack direction="row" spacing={0.55} useFlexGap sx={{ alignItems: 'center', flexWrap: 'nowrap' }}>
        <FilledHabitatIcon habitatFocus={segment.habitatFocus} percent={100} size={62} />
        {Array.from({ length: expansionIconCount }).map((_, index) => {
          const remainingPercent = segment.percent - index * 100;
          const fillPercent = Math.max(0, Math.min(remainingPercent, 100));

          return <FilledHabitatIcon key={`${segment.habitatFocus}-${index}`} habitatFocus={segment.habitatFocus} percent={fillPercent} size={38} />;
        })}
      </Stack>
    );
  }

  if (isMeadow) {
    const expansionPercent = Math.max(segment.percent - 100, 0);
    const expansionIcons = Math.min(Math.ceil(expansionPercent / 100), 4);

    return (
      <Stack direction="row" spacing={0.6} useFlexGap sx={{ alignItems: 'center', flexWrap: 'nowrap' }}>
        <FilledHabitatIcon habitatFocus={segment.habitatFocus} percent={Math.min(segment.percent, 100)} size={62} fillOpacity={0.5} />
        {expansionIcons > 0 && (
          <Stack direction="row" spacing={0.25} useFlexGap sx={{ alignItems: 'center', flexWrap: 'nowrap' }}>
            {Array.from({ length: expansionIcons }).map((_, index) => {
              const remainingPercent = expansionPercent - index * 100;
              const fillPercent = Math.max(0, Math.min(remainingPercent, 100));

              return (
                <FilledHabitatIcon
                  key={`${segment.habitatFocus}-expansion-${index}`}
                  habitatFocus={segment.habitatFocus}
                  percent={fillPercent}
                  size={34}
                  fillOpacity={0.5}
                />
              );
            })}
          </Stack>
        )}
      </Stack>
    );
  }

  return <FilledHabitatIcon habitatFocus={segment.habitatFocus} percent={segment.percent} size={62} />;
}

function HabitatAttentionIconCard({
  segment,
}: {
  segment: AttentionSegment;
}) {
  const meta = HABITAT_META[segment.habitatFocus];
  const modeLabel =
    segment.habitatFocus === 'forests' ? 'Recovery' : segment.habitatFocus === 'floodplains' ? 'Expansion' : 'Recovery + Expansion';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.65,
        alignItems: 'flex-start',
        p: { xs: 0.7, md: 0.9 },
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 250,
          minHeight: 138,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflow: 'hidden',
        }}
      >
        <HabitatAttentionIconSet segment={segment} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="captionSmall" component="p" sx={{ color: 'text.secondary', lineHeight: 1.15, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {modeLabel}
        </Typography>
        <Typography variant="h5" component="p" sx={{ color: meta.baseColor, lineHeight: 1.05 }}>
          <Box component="span" sx={{ fontWeight: 800 }}>
            {meta.label}
          </Box>
          <Box component="span" sx={{ fontWeight: 300 }}>
            {' '}• {formatNumber(segment.acres)} acres
          </Box>
        </Typography>
        <Typography variant="captionSmall" component="p" sx={{ color: 'common.white', fontWeight: 800, mt: 0.25 }}>
          {formatCompactPercent(segment.percent)}
        </Typography>
      </Box>
    </Box>
  );
}

function AreaSquareGlyph({
  segment,
}: {
  segment: AttentionSegment;
}) {
  const meta = HABITAT_META[segment.habitatFocus];
  const baseSize = 78;
  const isForest = segment.habitatFocus === 'forests';
  const isFloodplain = segment.habitatFocus === 'floodplains';
  const isMeadow = segment.habitatFocus === 'meadows';
  const recoveryPercent = isFloodplain ? 0 : Math.min(segment.percent, 100);
  const expansionPercent = isForest ? 0 : isMeadow ? Math.max(segment.percent - 100, 0) : segment.percent;
  const recoverySize = Math.sqrt(recoveryPercent / 100) * baseSize;
  const outerSize = Math.sqrt(1 + expansionPercent / 100) * baseSize;
  const frameSize = 224;
  const layerOpacity = isMeadow ? 0.5 : 1;
  const originX = 66;
  const originY = 18;
  const calloutPercent = expansionPercent > 0 ? expansionPercent : recoveryPercent;
  const calloutSize = expansionPercent > 0 ? outerSize : recoverySize;
  const calloutY = originY + calloutSize;
  const labelColumnWidth = 58;
  const ruleStart = 62;
  const panelBg = 'rgb(35, 51, 55)';

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 260,
        height: frameSize,
        overflow: 'visible',
      }}
      aria-hidden
    >
      {expansionPercent > 0 && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: originX,
              bottom: originY,
              width: outerSize,
              height: outerSize,
              bgcolor: meta.baseColor,
              opacity: layerOpacity,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: originX,
              bottom: originY,
              width: baseSize,
              height: baseSize,
              bgcolor: panelBg,
            }}
          />
        </>
      )}
      <Box
        sx={{
          position: 'absolute',
          left: originX,
          bottom: originY,
          width: baseSize,
          height: baseSize,
          border: `2px solid ${meta.baseColor}`,
          bgcolor: 'rgba(16,22,24,0.16)',
        }}
      />
      {recoveryPercent > 0 && (
        <Box
          sx={{
            position: 'absolute',
            left: originX,
            bottom: originY,
            width: recoverySize,
            height: recoverySize,
            bgcolor: meta.baseColor,
            opacity: layerOpacity,
          }}
        />
      )}
      {calloutPercent > 0 && (
        <>
          <Typography
            variant="h5"
            component="span"
            sx={{
              position: 'absolute',
              left: 0,
              width: labelColumnWidth,
              textAlign: 'right',
              bottom: calloutY - 9,
              color: meta.baseColor,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {formatCompactPercent(calloutPercent)}
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              left: ruleStart,
              bottom: calloutY - 2,
              width: Math.max(0, originX + calloutSize - ruleStart),
              borderTop: `2px solid ${meta.baseColor}`,
              opacity: 0.95,
            }}
          />
        </>
      )}
      <Typography
        variant="captionSmall"
        component="span"
        sx={{
          position: 'absolute',
          left: 0,
          width: labelColumnWidth,
          textAlign: 'right',
          bottom: originY + baseSize - 9,
          color: 'text.secondary',
          lineHeight: 1,
        }}
      >
        100%
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          left: ruleStart,
          bottom: originY + baseSize - 2,
          width: originX + baseSize - ruleStart + 6,
          borderTop: '2px solid',
          borderColor: 'text.secondary',
          opacity: 0.65,
        }}
      />
    </Box>
  );
}

function HabitatAttentionAreaCell({
  segment,
}: {
  segment: AttentionSegment;
}) {
  const meta = HABITAT_META[segment.habitatFocus];
  const modeLabel =
    segment.habitatFocus === 'forests'
      ? 'Recovered Area'
      : segment.habitatFocus === 'floodplains'
        ? 'Expanded Area'
        : 'Recovered + Expanded Area';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.65,
        alignItems: 'flex-start',
        p: { xs: 0.7, md: 0.9 },
        minWidth: 0,
      }}
    >
      <AreaSquareGlyph segment={segment} />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="captionSmall" component="p" sx={{ color: 'text.secondary', lineHeight: 1.15, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {modeLabel}
        </Typography>
        <Typography variant="h5" component="p" sx={{ color: meta.baseColor, lineHeight: 1.05 }}>
          <Box component="span" sx={{ fontWeight: 800 }}>
            {meta.label}
          </Box>
          <Box component="span" sx={{ fontWeight: 300 }}>
            {' '}• {formatNumber(segment.acres)} acres
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}

function getAttentionSegment(scenario: AttentionScenario, habitatFocus: string) {
  return scenario.segments.find((segment) => segment.habitatFocus === habitatFocus) ?? {
    habitatFocus,
    acres: 0,
    percent: 0,
  };
}

function HabitatAttentionOverlayGlyph({
  scenario,
}: {
  scenario: AttentionScenario;
}) {
  const forest = getAttentionSegment(scenario, 'forests');
  const meadow = getAttentionSegment(scenario, 'meadows');
  const floodplain = getAttentionSegment(scenario, 'floodplains');
  const baseSize = 96;
  const frameSize = 260;
  const originX = 78;
  const originY = 24;
  const labelColumnWidth = 70;
  const ruleStart = 74;
  const floodplainOuterPercent = 100 + floodplain.percent;
  const meadowSize = Math.sqrt(Math.max(meadow.percent, 0) / 100) * baseSize;
  const forestSize = Math.sqrt(Math.max(forest.percent, 0) / 100) * baseSize;
  const floodplainSize = Math.sqrt(Math.max(floodplainOuterPercent, 0) / 100) * baseSize;
  const labelGap = 16;
  const labelBounds = { min: originY + 8, max: frameSize - 16 };
  const targetCallouts = [
    floodplain.percent > 0
      ? {
          key: 'floodplains',
          label: formatWholePercent(floodplainOuterPercent),
          targetBottom: originY + floodplainSize - 8,
          lineBottom: 0,
          lineWidth: 0,
          showRule: false,
          color: HABITAT_META.floodplains.baseColor,
          lineColor: HABITAT_META.floodplains.baseColor,
          acres: floodplain.acres,
        }
      : null,
    {
      key: 'baseline',
      label: '100%',
      targetBottom: originY + baseSize - 9,
      lineBottom: originY + baseSize - 2,
      lineWidth: originX + baseSize - ruleStart,
      showRule: true,
      color: 'rgba(242,240,239,0.86)',
      lineColor: 'rgba(242,240,239,0.7)',
      acres: 0,
    },
    forest.percent > 0
      ? {
          key: 'forests',
          label: formatWholePercent(forest.percent),
          targetBottom: originY + forestSize - 8,
          lineBottom: 0,
          lineWidth: 0,
          showRule: false,
          color: HABITAT_META.forests.baseColor,
          lineColor: HABITAT_META.forests.baseColor,
          acres: forest.acres,
        }
      : null,
    meadow.percent > 0
      ? {
          key: 'meadows',
          label: formatWholePercent(meadow.percent),
          targetBottom: originY + meadowSize - 8,
          lineBottom: 0,
          lineWidth: 0,
          showRule: false,
          color: HABITAT_META.meadows.baseColor,
          lineColor: HABITAT_META.meadows.baseColor,
          acres: meadow.acres,
        }
      : null,
  ].filter((callout): callout is NonNullable<typeof callout> => Boolean(callout));
  const overlayCallouts = [...targetCallouts]
    .sort((a, b) => b.targetBottom - a.targetBottom || b.acres - a.acres)
    .reduce<Array<(typeof targetCallouts)[number] & { labelBottom: number }>>((placed, callout) => {
      const previous = placed.at(-1);
      const maxBottom = previous ? previous.labelBottom - labelGap : labelBounds.max;
      const labelBottom = Math.max(labelBounds.min, Math.min(callout.targetBottom, maxBottom));

      return [...placed, { ...callout, labelBottom }];
    }, []);
  const layers = [
    {
      key: 'floodplains',
      size: floodplain.percent > 0 ? floodplainSize : 0,
      color: HABITAT_META.floodplains.baseColor,
      opacity: 0.92,
    },
    {
      key: 'forests',
      size: forestSize,
      color: HABITAT_META.forests.baseColor,
      opacity: 1,
    },
    {
      key: 'meadows',
      size: meadowSize,
      color: HABITAT_META.meadows.baseColor,
      opacity: 0.86,
    },
  ]
    .filter((layer) => layer.size > 0)
    .sort((a, b) => b.size - a.size);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 330,
        height: frameSize,
        overflow: 'visible',
      }}
      aria-hidden
    >
      {layers.map((layer) => (
        <Box
          key={layer.key}
          sx={{
            position: 'absolute',
            left: originX,
            bottom: originY,
            width: layer.size,
            height: layer.size,
            bgcolor: layer.color,
            opacity: layer.opacity,
          }}
        />
      ))}
      <Box
        sx={{
          position: 'absolute',
          left: originX,
          bottom: originY,
          width: baseSize,
          height: baseSize,
          border: '2px solid rgba(242,240,239,0.86)',
          bgcolor: 'transparent',
          zIndex: 2,
        }}
      />
      {overlayCallouts.map((callout) => (
        <Box key={callout.key}>
          <Typography
            variant="captionSmall"
            component="span"
            sx={{
              position: 'absolute',
              left: 0,
              width: labelColumnWidth,
              textAlign: 'right',
              bottom: callout.labelBottom,
              color: callout.color,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {callout.label}
          </Typography>
          {callout.showRule && (
            <Box
              sx={{
                position: 'absolute',
                left: ruleStart,
                bottom: callout.lineBottom,
                width: callout.lineWidth,
                borderTop: `2px solid ${callout.lineColor ?? callout.color}`,
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}

function HabitatAttentionOverlayCell({
  scenario,
  compact = false,
}: {
  scenario: AttentionScenario;
  compact?: boolean;
}) {
  const theme = useTheme();
  const segments = HABITAT_FOCUS_ORDER.map((habitatFocus) => getAttentionSegment(scenario, habitatFocus));

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: compact ? 'minmax(0, 1fr)' : { xs: 'minmax(0, 1fr)', sm: 'minmax(0, 330px) minmax(0, 1fr)' },
        gap: compact ? theme.jtSpacing.gap.xs : { xs: theme.jtSpacing.gap.xs, sm: theme.jtSpacing.gap.md },
        alignItems: compact ? 'start' : 'end',
        minWidth: 0,
      }}
    >
      <HabitatAttentionOverlayGlyph scenario={scenario} />
      <Stack
        direction="column"
        spacing={compact ? theme.jtSpacing.gap.md : theme.jtSpacing.gap.lg}
        sx={{ minWidth: 0, pt: compact ? theme.jtSpacing.component.xs : 0 }}
      >
        {segments.map((segment) => {
          const meta = HABITAT_META[segment.habitatFocus];
          const acresLabel = compact ? formatCompactNumber(segment.acres) : formatNumber(segment.acres);
          const modeLabel =
            segment.habitatFocus === 'forests'
              ? 'Recovered Area'
              : segment.habitatFocus === 'floodplains'
                ? 'Expanded Area'
                : 'Recovered + Expanded Area';

          return (
            <Stack
              key={segment.habitatFocus}
              direction="column"
              spacing={compact ? theme.jtSpacing.component.xs : theme.jtSpacing.gap.xs}
              sx={{ minWidth: 0 }}
            >
              <Typography
                variant="captionSmall"
                component="p"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1,
                  letterSpacing: compact ? '0.08em' : '0.1em',
                  textTransform: 'uppercase',
                  m: 0,
                  opacity: compact ? 0.9 : 1,
                }}
              >
                {modeLabel}
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: meta.baseColor,
                  lineHeight: 1,
                  m: 0,
                  minWidth: 0,
                  flexWrap: 'wrap',
                  rowGap: 0.35,
                  fontSize: compact ? theme.typography.captionSmall.fontSize : undefined,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1em',
                    height: '1em',
                    flex: '0 0 auto',
                    lineHeight: 1,
                  }}
                >
                  <FilledHabitatIcon habitatFocus={segment.habitatFocus} percent={100} size={compact ? 18 : 20} fillOpacity={1} />
                </Box>
                <Box component="span" sx={{ fontWeight: 800 }}>
                  {meta.label}
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontWeight: 300,
                    opacity: compact ? 0.9 : 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {'\u00a0\u2022\u00a0'}{acresLabel} acres
                </Box>
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}

function truncateChartLabel(label: string, availableWidth: number) {
  const maxCharacters = Math.max(16, Math.floor(availableWidth / 9.2));

  if (label.length <= maxCharacters) {
    return label;
  }

  return `${label.slice(0, Math.max(maxCharacters - 3, 1)).trim()}...`;
}

function formatTooltipValue(value: number | null, unit: string) {
  if (!isFiniteNumber(value)) {
    return 'No data';
  }

  const absoluteValue = Math.abs(value);
  const formattedValue =
    absoluteValue >= 1000
      ? d3.format('.3~s')(value).replace('G', 'B')
      : absoluteValue >= 10
        ? d3.format(',.1f')(value)
        : d3.format(',.2~f')(value);
  return unit ? `${formattedValue} ${unit}` : formattedValue;
}

function formatRangeTooltipRows(records: WatershedMetricRecord[], unit: string) {
  return [...records]
    .sort(
      (a, b) =>
        orderByList(a.restoration_level, RESTORATION_LEVEL_ORDER) - orderByList(b.restoration_level, RESTORATION_LEVEL_ORDER),
    )
    .map((record) => ({
      label: formatRestorationShort(record.restoration_level),
      value: `${formatTooltipValue(record.value_low, unit)} to ${formatTooltipValue(record.value_high, unit)}`,
      color: colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level),
    }));
}

function getTooltipPosition(event: MouseEvent, containerElement: HTMLDivElement | null) {
  const bounds = containerElement?.getBoundingClientRect();

  if (!bounds) {
    return { x: 0, y: 0 };
  }

  return {
    x: Math.min(Math.max(event.clientX - bounds.left + 14, 12), Math.max(bounds.width - 260, 12)),
    y: event.clientY - bounds.top,
  };
}

function ChartTooltip({ tooltip }: { tooltip: ChartTooltipState | null }) {
  if (!tooltip) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        left: tooltip.x,
        top: tooltip.y,
        transform: 'translateY(-50%)',
        width: 248,
        maxWidth: 'calc(100% - 24px)',
        pointerEvents: 'none',
        zIndex: 4,
        borderRadius: 1,
        boxShadow: '0 18px 42px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        bgcolor: 'rgba(16,22,24,0.96)',
        border: '1px solid rgba(155,162,164,0.18)',
      }}
    >
      <Typography
        variant="eyebrow"
        component="p"
        sx={{
          color: 'common.black',
          bgcolor: tooltip.color,
          px: 1.15,
          py: 0.7,
          lineHeight: 1,
          letterSpacing: '0.12em',
        }}
      >
        {tooltip.subtitle.toUpperCase()}
      </Typography>
      <Box sx={{ p: 1.2 }}>
        <Typography variant="body2" component="p" sx={{ color: 'common.white', fontWeight: 800, lineHeight: 1.25, mb: 0.85 }}>
          {tooltip.title}
        </Typography>
        <Stack spacing={0.55}>
          {tooltip.rows.map((row) => (
            <Box
              key={`${row.label}-${row.value}`}
              sx={{ display: 'grid', gridTemplateColumns: '82px minmax(0, 1fr)', gap: 0.85, alignItems: 'baseline' }}
            >
              <Typography variant="captionSmall" component="span" sx={{ color: row.color, fontWeight: 800 }}>
                {row.label}
              </Typography>
              <Typography variant="captionSmall" component="span" sx={{ color: 'text.secondary', lineHeight: 1.25 }}>
                {row.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

function getRestorationOffset(level: string, activeLevels: string[]) {
  if (activeLevels.length <= 1) {
    return 0;
  }

  const index = Math.max(activeLevels.indexOf(level), 0);
  return (index - (activeLevels.length - 1) / 2) * 8;
}

function RestorationLevelLegend() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.2,
        mb: 2.5,
      }}
    >
      <Typography variant="captionSmall" sx={{ color: 'text.secondary', letterSpacing: '0.08em' }}>
        RESTORATION LEVEL
      </Typography>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {RESTORATION_LEVEL_ORDER.map((level) => (
          <Box
            key={level}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.65,
              border: '1px solid',
              borderColor: 'base.300',
              borderRadius: 999,
              px: 1,
              py: 0.45,
              bgcolor: 'rgba(16,22,24,0.22)',
            }}
          >
            <Stack direction="row" spacing={0.25} aria-hidden>
              {SCENARIO_HABITAT_ORDER.map((habitat) => (
                <Box
                  key={`${level}-${habitat}`}
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: 999,
                    bgcolor: colorForScenarioHabitatLevel(habitat, level),
                  }}
                />
              ))}
            </Stack>
            <Typography variant="captionSmall" component="span">
              {formatRestorationShort(level)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function WatershedMetricsChart({
  records,
  habitatFocus,
  selectedRestorationLevel,
  selectedScenarioHabitat,
  showTitle = true,
}: {
  records: WatershedMetricRecord[];
  habitatFocus: string;
  selectedRestorationLevel: string;
  selectedScenarioHabitat: string;
  showTitle?: boolean;
}) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState(320);
  const [tooltip, setTooltip] = useState<ChartTooltipState | null>(null);
  const theme = useTheme();
  const chartFontSize = String(theme.typography.body2.fontSize ?? '0.875rem');
  const chartCaptionFontSize = String(theme.typography.captionSmall.fontSize ?? '0.75rem');
  const chartEyebrowFontSize = String(theme.typography.eyebrow.fontSize ?? chartFontSize);
  const chartEyebrowFontFamily = String(theme.typography.eyebrow.fontFamily ?? theme.typography.fontFamily);
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

    const margin = { top: 24, right: 24, bottom: 36, left: 150 };
    const rowGap = 34;
    const facetTitleHeight = 34;
    const chartRowHeight = 46;
    const innerWidth = chartWidth - margin.left - margin.right;
    const facetHeights = facets.map((facet) => facetTitleHeight + facet.scenarioHabitats.length * chartRowHeight + margin.bottom);
    const height = d3.sum(facetHeights) + Math.max(0, facets.length - 1) * rowGap + margin.top;

    svg
      .attr('viewBox', `0 0 ${chartWidth} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-label', `${focusMeta?.label ?? formatLabel(habitatFocus)} metrics chart`);

    const root = svg.append('g').attr('transform', `translate(0, ${margin.top})`);
    let facetOffsetY = 0;

    facets.forEach((facet, facetIndex) => {
      const facetGroup = root.append('g').attr('transform', `translate(0, ${facetOffsetY})`);
      const allValues = facet.records.flatMap((record) => [record.value_low, record.value_high].filter(isFiniteNumber));
      const [minimumRaw, maximumRaw] = d3.extent(allValues);
      const minimum = Math.min(minimumRaw ?? 0, 0);
      const maximum = Math.max(maximumRaw ?? 1, 0);
      const span = maximum - minimum || 1;
      const padding = span * 0.08;
      const x = d3
        .scaleLinear()
        .domain([minimum - padding, maximum + padding])
        .nice()
        .range([0, innerWidth]);
      const chartHeight = facet.scenarioHabitats.length * chartRowHeight;
      const y = d3
        .scaleBand<string>()
        .domain(facet.scenarioHabitats)
        .range([0, chartHeight])
        .padding(0.28);
      const activeRestorationLevels = facet.restorationLevels;

      facetGroup
        .append('text')
        .attr('x', margin.left / 2)
        .attr('y', 0)
        .attr('fill', 'currentColor')
        .attr('font-size', chartFontSize)
        .attr('font-weight', 700)
        .attr('text-transform', 'uppercase')
        .text(truncateChartLabel(facet.unit ? `${facet.metric} (${facet.unit})` : facet.metric, innerWidth));

      const chartGroup = facetGroup.append('g').attr('transform', `translate(${margin.left}, ${facetTitleHeight})`);

      if (x.domain()[0] < 0 && x.domain()[1] > 0) {
        chartGroup
          .append('line')
          .attr('x1', x(0))
          .attr('x2', x(0))
          .attr('y1', 0)
          .attr('y2', chartHeight)
          .attr('stroke', palette.base[300])
          .attr('stroke-dasharray', '4 4');
      }

      chartGroup
        .append('g')
        .call(
          d3
            .axisLeft(y)
            .tickSize(0)
            .tickFormat((scenario) => {
              return formatScenarioHabitat(String(scenario)).toUpperCase();
            }),
        )
        .call((axisGroup) =>
          axisGroup
            .selectAll<SVGTextElement, string>('text')
            .attr('fill', (scenario) => {
              return HABITAT_META[`${scenario}s`]?.baseColor ?? 'currentColor';
            })
            .attr('font-family', chartEyebrowFontFamily)
            .attr('font-size', chartEyebrowFontSize)
            .attr('font-weight', 400)
            .attr('letter-spacing', '0.12em')
            .attr('text-transform', 'uppercase')
            .attr('dx', '-0.25em'),
        )
        .call((axisGroup) => axisGroup.selectAll('path').remove());

      const scenarioGroups = chartGroup
        .selectAll<SVGGElement, WatershedMetricRecord>('.watershed-scenario-group')
        .data(facet.records)
        .enter()
        .append('g')
        .attr('class', 'watershed-scenario-group')
        .attr(
          'transform',
          (record) =>
            `translate(0, ${(y(record.scenario_habitat) ?? 0) + y.bandwidth() / 2 + getRestorationOffset(record.restoration_level, activeRestorationLevels)})`,
        );

      scenarioGroups
        .append('line')
        .attr('x1', (record) => x(Math.min(record.value_low ?? 0, record.value_high ?? 0)))
        .attr('x2', (record) => x(Math.max(record.value_low ?? 0, record.value_high ?? 0)))
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', (record) => colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level))
        .attr('stroke-width', 5)
        .attr('stroke-linecap', 'round');

      scenarioGroups
        .append('circle')
        .attr('cx', (record) => x(record.value_low ?? 0))
        .attr('cy', 0)
        .attr('r', 3.5)
        .attr('fill', (record) => colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level))
        .attr('stroke', (record) => colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level))
        .attr('stroke-width', 0);

      scenarioGroups
        .append('circle')
        .attr('cx', (record) => x(record.value_high ?? 0))
        .attr('cy', 0)
        .attr('r', 3.5)
        .attr('fill', (record) => colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level));

      chartGroup
        .append('g')
        .attr('transform', `translate(0, ${chartHeight + 8})`)
        .call(d3.axisBottom(x).ticks(4).tickFormat((value) => d3.format('.2~s')(Number(value))))
        .call((axisGroup) => axisGroup.selectAll('text').attr('fill', 'currentColor').attr('font-size', chartCaptionFontSize))
        .call((axisGroup) => axisGroup.selectAll('path,line').attr('stroke', palette.base[300]));

      chartGroup
        .append('g')
        .selectAll<SVGRectElement, string>('.habitat-hover-target')
        .data(facet.scenarioHabitats)
        .enter()
        .append('rect')
        .attr('class', 'habitat-hover-target')
        .attr('x', -margin.left + 4)
        .attr('y', (habitat) => (y(habitat) ?? 0) - (chartRowHeight - y.bandwidth()) / 2)
        .attr('width', innerWidth + margin.left - 4)
        .attr('height', chartRowHeight)
        .attr('fill', 'transparent')
        .style('pointer-events', 'all')
        .style('cursor', 'default')
        .on('mousemove', (event: MouseEvent, habitat) => {
          const habitatRecords = facet.records.filter((record) => record.scenario_habitat === habitat);
          const meta = HABITAT_META[`${habitat}s`];

          setTooltip({
            ...getTooltipPosition(event, containerElement),
            title: facet.unit ? `${facet.metric} (${facet.unit})` : facet.metric,
            subtitle: formatScenarioHabitat(habitat),
            color: meta?.baseColor ?? 'currentColor',
            rows: formatRangeTooltipRows(habitatRecords, facet.unit),
          });
        })
        .on('mouseleave', () => setTooltip(null));

      facetOffsetY += facetHeights[facetIndex] + rowGap;
    });
  }, [
    chartWidth,
    facets,
    habitatFocus,
    focusMeta?.label,
    chartFontSize,
    chartCaptionFontSize,
    chartEyebrowFontFamily,
    chartEyebrowFontSize,
    containerElement,
  ]);

  return (
    <Box ref={setContainerElement} sx={{ width: '100%', position: 'relative' }}>
      {showTitle && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" component="h3" sx={{ color: 'primary.main', mb: 1 }}>
            {focusMeta?.label ?? formatLabel(habitatFocus)}
          </Typography>
        </Box>
      )}

      {facets.length > 0 ? (
        <>
          <svg ref={chartRef} style={{ display: 'block', width: '100%' }} />
          <ChartTooltip tooltip={tooltip} />
        </>
      ) : (
        <Typography variant="body1" component="p">
          No complete metric ranges are available for this filter combination.
        </Typography>
      )}
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
  const [scaleMode, setScaleMode] = useState<AttentionScaleMode>('linear');
  const [designMode, setDesignMode] = useState<AttentionDesignMode>('bars');
  const scenarios = useMemo<AttentionScenario[]>(
    () => buildAttentionScenarios(records, selectedRestorationLevel, selectedScenarioHabitat),
    [records, selectedRestorationLevel, selectedScenarioHabitat],
  );
  const maxScenarioTotal = useMemo(() => {
    const totals = scenarios.map((scenario) =>
      d3.sum(scenario.segments, (segment) => (compareMode === 'acres' ? segment.acres : segment.percent)),
    );
    const scaledTotals = totals.map((total) => (compareMode === 'acres' && scaleMode === 'log' ? Math.log10(total + 1) : total));

    return Math.max(...scaledTotals, 1);
  }, [scenarios, compareMode, scaleMode]);
  const scenariosByRestorationLevel = useMemo(
    () =>
      RESTORATION_LEVEL_ORDER.map((level) => ({
        level,
        scenarios: scenarios.filter((scenario) => scenario.restorationLevel === level),
      })).filter((group) => group.scenarios.length > 0),
    [scenarios],
  );

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
            Stacked bars show how much each scenario prioritizes forests, meadows, and floodplains.
            Compare the share of each habitat focus&apos;s restorable baseline or the restored acreage <Hl>using the tabs on the right.</Hl>
            For acreage, the chart can be displayed on a linear or logarithmic scale.
          </Typography>
        </Box>
        <Stack spacing={1} sx={{ justifySelf: { xs: 'start', md: 'end' }, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={designMode}
            onChange={(_, value: AttentionDesignMode | null) => {
              if (value) {
                setDesignMode(value);
              }
            }}
            aria-label="Select habitat attention design"
            sx={{
              '& .MuiToggleButton-root': {
                color: 'common.white',
                borderColor: 'rgba(155,162,164,0.35)',
                px: 1.4,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'common.black',
                  '&:hover': { bgcolor: 'primary.light' },
                },
              },
            }}
          >
            <ToggleButton value="bars" aria-label="Show current stacked bar design">
              Current
            </ToggleButton>
            <ToggleButton value="icons" aria-label="Show icon design">
              Icon
            </ToggleButton>
            <ToggleButton value="area" aria-label="Show area square design">
              Area
            </ToggleButton>
            <ToggleButton value="overlay" aria-label="Show overlay area design">
              Overlay
            </ToggleButton>
          </ToggleButtonGroup>
          {designMode === 'bars' && (
            <>
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
              {compareMode === 'acres' && (
                <ToggleButtonGroup
              exclusive
              size="small"
              value={scaleMode}
              onChange={(_, value: AttentionScaleMode | null) => {
                if (value) {
                  setScaleMode(value);
                }
              }}
              aria-label="Compare acreage scale"
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'common.white',
                  borderColor: 'rgba(155,162,164,0.35)',
                  px: 1.2,
                  '&.Mui-selected': {
                    bgcolor: 'secondary.main',
                    color: 'common.black',
                    '&:hover': { bgcolor: 'secondary.light' },
                  },
                },
              }}
            >
              <ToggleButton value="linear" aria-label="Use linear acreage scale">
                Linear
              </ToggleButton>
              <ToggleButton value="log" aria-label="Use logarithmic acreage scale">
                Log
              </ToggleButton>
                </ToggleButtonGroup>
              )}
            </>
          )}
        </Stack>
      </Box>

      <Stack spacing={2}>
        {scenariosByRestorationLevel.map(({ level, scenarios: groupedScenarios }) => (
          <Box
            key={level}
            sx={{
              border: '1px solid rgba(155,162,164,0.2)',
              borderRadius: 1,
              bgcolor: 'rgba(16,22,24,0.22)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 1.2,
                flexDirection: { xs: 'column', sm: 'row' },
                px: { xs: 1.4, md: 1.8 },
                py: 1.2,
                bgcolor: 'rgba(81,93,97,0.26)',
                borderBottom: '1px solid rgba(155,162,164,0.18)',
              }}
            >
              <Box>
                <Typography variant="h5" component="h4" sx={{ color: 'common.white' }}>
                  <Box component="span" sx={{ fontWeight: 800 }}>
                    {level === 'min' ? 'Minimum' : level === 'med' ? 'Medium' : 'Maximum'}
                  </Box>{' '}
                  Restoration
                </Typography>
                <Typography variant="captionSmall" component="p">
                  Placeholder caption
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1.4} sx={{ p: { xs: 1.4, md: 1.8 } }}>
              {designMode === 'overlay' ? (
                <Box
                  sx={(theme) => ({
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                    gap: { xs: theme.jtSpacing.gap.md, md: theme.jtSpacing.gap.sm },
                    alignItems: 'start',
                    minWidth: 0,
                  })}
                >
                  {groupedScenarios.map((scenario) => {
                    const priorityMeta = HABITAT_META[`${scenario.scenarioHabitat}s`];

                    return (
                      <Box
                        key={scenario.id}
                        sx={(theme) => ({
                          minWidth: 0,
                          borderTop: { xs: '1px solid rgba(155,162,164,0.14)', md: 0 },
                          borderLeft: { xs: 0, md: '1px solid rgba(155,162,164,0.14)' },
                          pt: { xs: theme.jtSpacing.gap.sm, md: 0 },
                          pl: { xs: 0, md: theme.jtSpacing.gap.sm },
                          '&:first-of-type': { borderTop: 0, borderLeft: 0, pt: 0, pl: 0 },
                        })}
                      >
                        <Typography
                          variant="eyebrow"
                          component="p"
                          sx={{
                            mb: 0.8,
                            color: priorityMeta?.baseColor ?? 'secondary.main',
                            letterSpacing: '0.16em',
                          }}
                        >
                          {formatScenarioHabitat(scenario.scenarioHabitat)}
                        </Typography>
                        <HabitatAttentionOverlayCell scenario={scenario} compact />
                      </Box>
                    );
                  })}
                </Box>
              ) : (
              groupedScenarios.map((scenario) => {
                const scenarioTotal = d3.sum(scenario.segments, (segment) =>
                  compareMode === 'acres' ? segment.acres : segment.percent,
                );
                const scaledScenarioTotal = compareMode === 'acres' && scaleMode === 'log' ? Math.log10(scenarioTotal + 1) : scenarioTotal;
                const totalWidth = `${(scaledScenarioTotal / maxScenarioTotal) * 100}%`;
                const priorityMeta = HABITAT_META[`${scenario.scenarioHabitat}s`];

                return (
                  <Box
                    key={scenario.id}
                    sx={{
                      borderTop: '1px solid rgba(155,162,164,0.14)',
                      pt: 1.2,
                      '&:first-of-type': { borderTop: 0, pt: 0 },
                    }}
                  >
                    <Typography
                      variant="eyebrow"
                      component="p"
                      sx={{
                        mb: 0.8,
                        color: priorityMeta?.baseColor ?? 'secondary.main',
                        letterSpacing: '0.16em',
                      }}
                    >
                      {formatScenarioHabitat(scenario.scenarioHabitat)}
                    </Typography>
                    {designMode === 'bars' ? (
                      <Box sx={{ minWidth: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          width: totalWidth,
                          minHeight: 25,
                          overflow: 'hidden',
                          borderRadius: 0,
                          border: '1px solid rgba(155,162,164,0.18)',
                          bgcolor: 'rgba(16,22,24,0.45)',
                        }}
                        aria-label={`${formatRestorationLevel(scenario.restorationLevel)} ${formatScenarioHabitat(scenario.scenarioHabitat)} habitat attention`}
                      >
                        {scenario.segments.map((segment) => {
                          const meta = HABITAT_META[segment.habitatFocus];
                          const value = compareMode === 'acres' ? segment.acres : segment.percent;
                          const width = scenarioTotal > 0 ? `${(value / scenarioTotal) * 100}%` : '0%';

                          return (
                            <Box
                              key={segment.habitatFocus}
                              sx={{
                                width,
                                bgcolor: meta.baseColor,
                                borderRight: '1px solid',
                                borderColor: 'base.300',
                                '&:last-of-type': { borderRight: 0 },
                              }}
                              title={`${meta.label} – ${formatPercent(segment.percent)} / ${formatNumber(segment.acres)} acres`}
                            />
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
                          const label = compareMode === 'acres' ? `${formatNumber(segment.acres)} acres` : formatPercent(segment.percent);
                          const isFocusedHabitat = segment.habitatFocus === `${scenario.scenarioHabitat}s`;

                          return (
                            <Box
                              key={segment.habitatFocus}
                              sx={{
                                display: 'inline-flex',
                                width: 'fit-content',
                                alignItems: 'center',
                                minHeight: isFocusedHabitat ? 28 : 'auto',
                                border: isFocusedHabitat ? `1px solid ${meta.baseColor}` : '1px solid transparent',
                                borderRadius: 999,
                                px: isFocusedHabitat ? 1 : 0,
                                py: 0,
                              }}
                            >
                              <Typography
                                variant="captionSmall"
                                component="span"
                                sx={{ color: meta.baseColor, m: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}
                              >
                                <span style={{ fontWeight: 800 }}>
                                  {meta.label}
                                </span>
                                {'\u00a0–\u00a0'}
                                {label}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                      </Box>
                    ) : designMode === 'icons' ? (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))',
                          columnGap: { xs: 0.8, md: 1 },
                          rowGap: 0.8,
                          alignItems: 'start',
                          overflowX: 'auto',
                        }}
                      >
                        {scenario.segments.map((segment) => (
                          <HabitatAttentionIconCard key={segment.habitatFocus} segment={segment} />
                        ))}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))',
                          columnGap: { xs: 0.8, md: 1 },
                          rowGap: 0.8,
                          alignItems: 'start',
                          overflowX: 'auto',
                        }}
                      >
                        {scenario.segments.map((segment) => (
                          <HabitatAttentionAreaCell key={segment.habitatFocus} segment={segment} />
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })
              )}
            </Stack>
          </Box>
        ))}
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
  const [tooltip, setTooltip] = useState<ChartTooltipState | null>(null);
  const theme = useTheme();
  const chartFontSize = String(theme.typography.body2.fontSize ?? '0.875rem');
  const chartCaptionFontSize = String(theme.typography.captionSmall.fontSize ?? '0.75rem');
  const chartEyebrowFontSize = String(theme.typography.eyebrow.fontSize ?? chartFontSize);
  const chartEyebrowFontFamily = String(theme.typography.eyebrow.fontFamily ?? theme.typography.fontFamily);

  const facets = useMemo(() => {
    const filteredRecords = getCompleteRecords(
      records.filter((record) => matchesFilters(record, selectedRestorationLevel, selectedScenarioHabitat)),
    );

    return Array.from(d3.group(filteredRecords, (record) => record.metric), ([metric, metricRecords]) => {
      const sortedRecords = [...metricRecords].sort(
        (a, b) =>
          orderByList(a.scenario_habitat, SCENARIO_HABITAT_ORDER) - orderByList(b.scenario_habitat, SCENARIO_HABITAT_ORDER) ||
          orderByList(a.restoration_level, RESTORATION_LEVEL_ORDER) - orderByList(b.restoration_level, RESTORATION_LEVEL_ORDER),
      );

      return {
        metric,
        unit: metricRecords[0]?.unit ?? '',
        records: sortedRecords,
        scenarioHabitats: SCENARIO_HABITAT_ORDER.filter((habitat) =>
          sortedRecords.some((record) => record.scenario_habitat === habitat),
        ),
        restorationLevels: RESTORATION_LEVEL_ORDER.filter((level) =>
          sortedRecords.some((record) => record.restoration_level === level),
        ),
      };
    }).filter((facet) => facet.records.length > 0);
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
    const cardPaddingX = 18;
    const cardPaddingTop = 30;
    const cardPaddingBottom = 8;
    const margin = { top: 28, right: 28, bottom: 38, left: 150 };
    const facetTitleHeight = 36;
    const chartRowHeight = 46;
    const facetChartHeight = (facet: (typeof facets)[number]) => facet.scenarioHabitats.length * chartRowHeight + 18;
    const facetHeights = facets.map(
      (facet) => cardPaddingTop + cardPaddingBottom + facetTitleHeight + facetChartHeight(facet) + margin.bottom,
    );
    const columnWidth = Math.max((chartWidth - columnGap * (columns - 1)) / columns, 320);
    const innerWidth = columnWidth - margin.left - margin.right - cardPaddingX * 2;
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

    placements.forEach(({ facet, x, y: facetY, height: facetHeight }) => {
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
      const chartHeight = facet.scenarioHabitats.length * chartRowHeight;
      const yScale = d3.scaleBand<string>().domain(facet.scenarioHabitats).range([0, chartHeight]).padding(0.28);
      const activeRestorationLevels = facet.restorationLevels;
      const facetGroup = root.append('g').attr('transform', `translate(${x}, ${facetY})`);

      facetGroup
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', columnWidth)
        .attr('height', facetHeight)
        .attr('rx', 4)
        .attr('fill', 'rgba(16,22,24,0.22)')
        .attr('stroke', 'rgba(155,162,164,0.18)')
        .attr('stroke-width', 1);

      facetGroup
        .append('text')
        .attr('x', cardPaddingX + margin.left / 2)
        .attr('y', cardPaddingTop)
        .attr('fill', 'currentColor')
        .attr('font-size', chartFontSize)
        .attr('font-weight', 700)
        .attr('text-transform', 'uppercase')
        .text(truncateChartLabel(facet.unit ? `${facet.metric} (${facet.unit})` : facet.metric, innerWidth));

      const chartGroup = facetGroup
        .append('g')
        .attr('transform', `translate(${cardPaddingX + margin.left}, ${cardPaddingTop + facetTitleHeight})`);

      if (xScale.domain()[0] < 0 && xScale.domain()[1] > 0) {
        chartGroup
          .append('line')
          .attr('x1', xScale(0))
          .attr('x2', xScale(0))
          .attr('y1', 0)
          .attr('y2', chartHeight)
          .attr('stroke', palette.base[300])
          .attr('stroke-dasharray', '4 4');
      }

      chartGroup
        .append('g')
        .call(
          d3
            .axisLeft(yScale)
            .tickSize(0)
            .tickFormat((habitat) => formatScenarioHabitat(String(habitat)).toUpperCase()),
        )
        .call((axisGroup) =>
          axisGroup
            .selectAll<SVGTextElement, string>('text')
            .attr('fill', (habitat) => HABITAT_META[`${habitat}s`]?.baseColor ?? 'currentColor')
            .attr('font-family', chartEyebrowFontFamily)
            .attr('font-size', chartEyebrowFontSize)
            .attr('font-weight', 400)
            .attr('letter-spacing', '0.12em')
            .attr('text-transform', 'uppercase')
            .attr('dx', '-0.25em'),
        )
        .call((axisGroup) => axisGroup.selectAll('path').remove());

      chartGroup
        .append('g')
        .attr('transform', `translate(0, ${chartHeight + 8})`)
        .call(d3.axisBottom(xScale).ticks(4).tickFormat((value) => d3.format('.2~s')(Number(value))))
        .call((axisGroup) => axisGroup.selectAll('text').attr('fill', 'currentColor').attr('font-size', chartCaptionFontSize))
        .call((axisGroup) => axisGroup.selectAll('path,line').attr('stroke', palette.base[300]));

      const scenarioGroups = chartGroup
        .selectAll<SVGGElement, WatershedMetricRecord>('.change-range-row')
        .data(facet.records)
        .enter()
        .append('g')
        .attr('class', 'change-range-row')
        .attr(
          'transform',
          (record) =>
            `translate(0, ${(yScale(record.scenario_habitat) ?? 0) + yScale.bandwidth() / 2 + getRestorationOffset(record.restoration_level, activeRestorationLevels)})`,
        );

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
        .attr('fill', (record) => colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level))
        .attr('stroke', (record) => colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level))
        .attr('stroke-width', 0);

      scenarioGroups
        .append('circle')
        .attr('cx', (record) => xScale(record.value_high ?? 0))
        .attr('cy', 0)
        .attr('r', 3.5)
        .attr('fill', (record) => colorForScenarioHabitatLevel(record.scenario_habitat, record.restoration_level));

      chartGroup
        .append('g')
        .selectAll<SVGRectElement, string>('.habitat-hover-target')
        .data(facet.scenarioHabitats)
        .enter()
        .append('rect')
        .attr('class', 'habitat-hover-target')
        .attr('x', -margin.left + 4)
        .attr('y', (habitat) => (yScale(habitat) ?? 0) - (chartRowHeight - yScale.bandwidth()) / 2)
        .attr('width', innerWidth + margin.left - 4)
        .attr('height', chartRowHeight)
        .attr('fill', 'transparent')
        .style('pointer-events', 'all')
        .style('cursor', 'default')
        .on('mousemove', (event: MouseEvent, habitat) => {
          const habitatRecords = facet.records.filter((record) => record.scenario_habitat === habitat);
          const meta = HABITAT_META[`${habitat}s`];

          setTooltip({
            ...getTooltipPosition(event, containerElement),
            title: facet.unit ? `${facet.metric} (${facet.unit})` : facet.metric,
            subtitle: formatScenarioHabitat(habitat),
            color: meta?.baseColor ?? 'currentColor',
            rows: formatRangeTooltipRows(habitatRecords, facet.unit),
          });
        })
        .on('mouseleave', () => setTooltip(null));
    });
  }, [chartWidth, facets, chartFontSize, chartCaptionFontSize, chartEyebrowFontFamily, chartEyebrowFontSize, containerElement]);

  return (
    <Box ref={setContainerElement} sx={{ width: '100%', position: 'relative' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h3" sx={{ color: 'primary.main', mb: 1 }}>
          Possible Change Ranges
        </Typography>
        <Typography variant="body2" sx={{ maxWidth: '76ch' }}>
          Low-to-high ranges from <Hl>Table 2</Hl> in the excel sheet, grouped by metric and filtered by the same restoration and habitat-priority
          controls. Restoration levels are drawn in order <Hl>Minimum to Medium to Maximum</Hl> within each habitat row. <Hl>Hover over</Hl> the chart to see actual numbers.
        </Typography>
      </Box>
      {facets.length > 0 ? (
        <>
          <RestorationLevelLegend />
          <svg ref={chartRef} style={{ display: 'block', width: '100%' }} />
          <ChartTooltip tooltip={tooltip} />
        </>
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

  const renderHabitatChangeCard = (habitatFocus: string) => {
    const meta = HABITAT_META[habitatFocus];

    return (
      <Box
        key={habitatFocus}
        sx={{
          border: `1px solid ${meta.baseColor}`,
          borderRadius: 1,
          bgcolor: 'rgba(16,22,24,0.22)',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            px: { xs: 1.4, md: 1.6 },
            py: 1.1,
            bgcolor: 'rgba(81,93,97,0.26)',
            borderBottom: `1px solid ${meta.baseColor}`,
          }}
        >
          <Box>
            <Typography variant="h5" component="h4" sx={{ color: meta.baseColor }}>
              {meta.label}
            </Typography>
            <Typography variant="captionSmall" component="p">
              Placeholder caption
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: { xs: 1.4, md: 1.6 } }}>
          <WatershedMetricsChart
            records={metrics.filter((d) => !['Change in ET**', 'Change in wetland cover'].includes(d.metric))}
            habitatFocus={habitatFocus}
            selectedRestorationLevel={selectedRestorationLevel}
            selectedScenarioHabitat={selectedScenarioHabitat}
            showTitle={false}
          />
        </Box>
      </Box>
    );
  };

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
          <ScrollReveal delay={0.08} sx={{ maxWidth: { xs: 520, md: 'none' }, mx: { xs: 'auto', md: 0 } }}>
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
          </ScrollReveal>
          <Box>
            <SectionHead
              eyebrow="Scenario Overview"
              title="Restoration as a Watershed-Scale Strategy"
              titleColor="secondary.main"
            />
            <ScrollReveal delay={0.06}>
              <Typography variant="body1" sx={{ maxWidth: '72ch', mb: '1.1rem' }}>
                {SCENARIO_LEDE}
              </Typography>
              <Typography variant="body2" sx={{ maxWidth: '72ch' }}>
                {SCENARIO_DETAIL}
              </Typography>
            </ScrollReveal>
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
            <ScrollReveal key={item.title} delay={index * 0.08} sx={cardSx}>
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
            </ScrollReveal>
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
                  Compare Nine Scenarios
                </Typography>
                <Typography variant="body2" component="p" sx={{ maxWidth: '75ch' }}>
                  <Hl>Use the controls</Hl> to isolate one restoration level, one habitat prioritization, or a single
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

                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" component="h3" sx={{ color: 'primary.main', mb: 1 }}>
                      Important Metrics within Each Habitat
                    </Typography>
                    <Typography variant="body2" sx={{ maxWidth: '76ch' }}>
                      Horizontal low-to-high ranges by habitat focus, using the same scenario filters. Restoration levels
                      are drawn in order <Hl>Minimum to Medium to Maximum</Hl> within each habitat row. <Hl>Hover over</Hl> the chart to see actual numbers.
                      This is using <Hl>Table 1</Hl> from the excel sheet.
                    </Typography>
                  </Box>
                  <RestorationLevelLegend />
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
                      gap: { xs: 2, lg: 2.5 },
                      alignItems: 'start',
                    }}
                  >
                    {renderHabitatChangeCard('forests')}
                    <Stack spacing={{ xs: 2, lg: 2.5 }}>
                      {renderHabitatChangeCard('meadows')}
                      {renderHabitatChangeCard('floodplains')}
                    </Stack>
                  </Box>
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
