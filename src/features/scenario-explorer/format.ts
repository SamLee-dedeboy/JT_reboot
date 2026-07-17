export const scenarioColors = ['#fb0169', '#77d6d7', '#aeb6b8', '#f2f0ef', '#697477'];
export const chartTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

export const formatNumber = (value: number | null | undefined, digits = 0) =>
  value == null ? '—' : value.toLocaleString(undefined, { maximumFractionDigits: digits });

export const formatDate = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const quantile = (values: number[], fraction: number): number | null => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const weight = position - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

export const valueColor = (value: number | null, extent: number) => {
  if (value == null) return '#697477';
  const amount = Math.min(1, Math.abs(value) / (extent || 1));
  if (Math.abs(value) < extent * 0.015) return '#aeb6b8';
  const target = value > 0 ? [251, 1, 105] : [119, 214, 215];
  const base = [174, 182, 184];
  return `rgb(${base
    .map((channel, index) => Math.round(channel + (target[index] - channel) * (0.3 + amount * 0.7)))
    .join(',')})`;
};
