import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..', '..');
const metricsPath = path.join(projectRoot, 'public', 'data', 'watershed', 'metrics.json');
const outputDir = path.join(projectRoot, 'public', 'exports', 'watershed');

const levels = [
  { key: 'min', label: 'Minimum Restoration', slug: 'minimum-restoration' },
  { key: 'med', label: 'Medium Restoration', slug: 'medium-restoration' },
  { key: 'max', label: 'Maximum Restoration', slug: 'maximum-restoration' },
];

const habitats = [
  { focus: 'forests', scenario: 'forest', label: 'Forests', color: '#4fb06f', metric: 'change in et' },
  { focus: 'meadows', scenario: 'meadow', label: 'Meadows', color: '#d8bf42', metric: 'change in et**' },
  { focus: 'floodplains', scenario: 'floodplain', label: 'Floodplains', color: '#62b6d9', metric: 'change in gw recharge' },
];

const { data: records } = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));

function restoredAcres(scenarioRecords, habitat) {
  const record = scenarioRecords.find(
    (item) =>
      item.habitat_focus === habitat.focus &&
      item.metric.toLowerCase() === habitat.metric &&
      Number.isFinite(item.value_high) &&
      Number.isFinite(item.metric_high) &&
      item.metric_high !== 0,
  );
  return record ? Math.abs(record.value_high / record.metric_high) : 0;
}

const scenarios = levels.flatMap((level) =>
  habitats.map((priority) => {
    const scenarioRecords = records.filter(
      (record) => record.restoration_level === level.key && record.scenario_habitat === priority.scenario,
    );
    return {
      level: level.key,
      priority,
      segments: habitats.map((habitat) => ({
        ...habitat,
        acres: restoredAcres(scenarioRecords, habitat),
      })),
    };
  }),
);

const maxTotal = Math.max(...scenarios.map((scenario) => scenario.segments.reduce((sum, segment) => sum + segment.acres, 0)));
const format = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const escapeXml = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function renderLevel(level) {
  const levelScenarios = scenarios.filter((scenario) => scenario.level === level.key);
  const width = 2048;
  const height = 792;
  const panelX = 8;
  const panelWidth = width - panelX * 2;
  const headerHeight = 134;
  const contentX = 38;
  const contentWidth = width - contentX * 2;
  const rowHeight = 215;
  const barYWithinRow = 88;
  const barHeight = 44;

  const rows = levelScenarios
    .map((scenario, rowIndex) => {
      const rowY = headerHeight + rowIndex * rowHeight;
      const total = scenario.segments.reduce((sum, segment) => sum + segment.acres, 0);
      const totalWidth = (total / maxTotal) * (contentWidth - 18);
      let segmentX = contentX;
      const barSegments = scenario.segments
        .map((segment) => {
          const segmentWidth = total > 0 ? (segment.acres / total) * totalWidth : 0;
          const rect = `<rect x="${segmentX.toFixed(2)}" y="${rowY + barYWithinRow}" width="${segmentWidth.toFixed(2)}" height="${barHeight}" fill="${segment.color}" stroke="#9ba2a4" stroke-opacity=".42"/>`;
          segmentX += segmentWidth;
          return rect;
        })
        .join('');

      const labels = scenario.segments
        .map((segment, index) => {
          const x = contentX + index * (contentWidth / 3);
          const focused = segment.focus === scenario.priority.focus;
          const label = `${segment.label} – ${format.format(segment.acres)} acres`;
          const estimatedWidth = 24 + label.length * 14.2;
          return focused
            ? `<rect x="${x}" y="${rowY + 146}" width="${estimatedWidth}" height="50" rx="25" fill="none" stroke="${segment.color}" stroke-width="2"/>
               <text x="${x + 16}" y="${rowY + 178}" class="value" fill="${segment.color}">${escapeXml(label)}</text>`
            : `<text x="${x}" y="${rowY + 178}" class="value" fill="${segment.color}">${escapeXml(label)}</text>`;
        })
        .join('');

      const divider =
        rowIndex < levelScenarios.length - 1
          ? `<line x1="${contentX}" y1="${rowY + rowHeight}" x2="${width - contentX}" y2="${rowY + rowHeight}" stroke="#9ba2a4" stroke-opacity=".18"/>`
          : '';

      return `
        <g>
          <text x="${contentX}" y="${rowY + 54}" class="row-title" fill="${scenario.priority.color}">PRIORITIZE ${scenario.priority.label.toUpperCase()}</text>
          ${barSegments}
          ${labels}
          ${divider}
        </g>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width / 2}" height="${height / 2}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(level.label)} habitat attention</title>
  <desc id="desc">Restored acreage for scenarios that prioritize forests, meadows, or floodplains.</desc>
  <style>
    text { font-family: "Nunito Sans", Arial, sans-serif; }
    .heading { font-family: "Hammersmith One", Arial, sans-serif; font-size: 32px; font-weight: 700; }
    .caption { font-size: 27px; font-weight: 400; }
    .row-title { font-family: "Hammersmith One", Arial, sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 6px; }
    .value { font-size: 27px; font-weight: 500; }
  </style>
  <rect width="${width}" height="${height}" fill="#26373c"/>
  <rect x="${panelX}" y="7" width="${panelWidth}" height="${height - 14}" rx="14" fill="none" stroke="#9ba2a4" stroke-opacity=".20" stroke-width="2"/>
  <path d="M ${panelX} ${headerHeight} H ${width - panelX}" stroke="#9ba2a4" stroke-opacity=".20" stroke-width="2"/>
  <path d="M ${panelX + 14} 7 H ${width - panelX - 14} Q ${width - panelX} 7 ${width - panelX} 21 V ${headerHeight} H ${panelX} V 21 Q ${panelX} 7 ${panelX + 14} 7 Z" fill="#4a595d" fill-opacity=".42"/>
  <text x="${contentX}" y="58" class="heading" fill="#fff">${escapeXml(level.label.toUpperCase())}</text>
  <text x="${contentX}" y="96" class="caption" fill="#c5cacc">Placeholder caption</text>
  ${rows}
</svg>`;
}

fs.mkdirSync(outputDir, { recursive: true });
for (const level of levels) {
  fs.writeFileSync(path.join(outputDir, `${level.slug}.svg`), renderLevel(level), 'utf8');
}

console.log(outputDir);
