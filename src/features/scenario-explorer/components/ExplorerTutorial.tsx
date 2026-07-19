import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

interface TutorialStep {
  title: string;
  target: string;
  paragraphs: string[];
  interactions?: string[];
}

const STEPS: TutorialStep[] = [
  {
    title: 'Purpose of the explorer',
    target: '[data-tour="explorer-purpose"]',
    paragraphs: ['Compare how salinity changes across scenarios, models, regions, stations, and time. The timeline, station distribution, and map are linked views of the same selection.'],
  },
  {
    title: 'Choose a comparison',
    target: '[data-tour="comparison-tabs"]',
    paragraphs: ['Use these tabs to compare RMA scenarios, RMA with SCHISM, or tiered-outflow runs. Each comparison has its own available dates and scenarios.'],
    interactions: ['Select any tab to load that comparison.'],
  },
  {
    title: 'Set the base and selected scenarios',
    target: '[data-tour="scenario-controls"]',
    paragraphs: ['The selected scenario is measured relative to the base scenario. Blue identifies the base; green identifies the selected scenario.'],
    interactions: ['Open either menu to change a scenario.', 'Use the swap button to reverse the comparison.'],
  },
  {
    title: 'Filter the region and choose values',
    target: '[data-tour="region-values"]',
    paragraphs: ['The region filters all three linked views. Display differences as absolute EC in µS/cm or as percent change relative to the selected base scenario.'],
    interactions: ['Choose a region or switch value units.', 'Use the information icons for definitions and formulas.'],
  },
  {
    title: 'Read the color scale',
    target: '[data-tour="color-scale"]',
    paragraphs: ['Teal means fresher than the selected base scenario and pink means saltier. The scale is capped at the 90th percentile so extreme values do not wash out differences elsewhere.'],
  },
  {
    title: 'Read the timeline',
    target: '[data-tour="line-chart"]',
    paragraphs: ['The green line is the selected-scenario regional average. The shaded band shows the selected station range, and the value at the top reports the current regional average deviation.', 'The labeled bands below the axis identify the water-year periods represented in the comparison.'],
    interactions: ['Change All stations, Middle 90%, or Middle 50% to adjust the shaded range.', 'Open the information icons for detailed calculation notes.'],
  },
  {
    title: 'Interact with the timeline',
    target: '[data-tour="line-chart"]',
    paragraphs: ['Move through time and compare additional scenario lines without changing the selected scenario. All linked views update to the active date.'],
    interactions: ['Drag the date slider or drag horizontally inside the chart.', 'Use the eye controls to show or hide comparison scenarios.', 'Hover a visible comparison scenario control to highlight its line in blue.'],
  },
  {
    title: 'Inspect the station distribution',
    target: '[data-tour="beeswarm"]',
    paragraphs: ['Each dot is one station on the active date. Its vertical position shows that station’s difference from the selected base scenario.'],
    interactions: ['Drag vertically across the plot to brush a value range and highlight matching stations on the map.', 'Double-click the plot to clear the brush.', 'Hover a dot to read its station details.'],
  },
  {
    title: 'Explore stations on the map',
    target: '[data-tour="map"]',
    paragraphs: ['Map colors use the same teal-to-pink scale. The map responds to the selected region, date, scenario, and any brushed station range.'],
    interactions: ['Pan and zoom to inspect station patterns.', 'Click a station to open its name, ID, region, value, scenario, and date.', 'Close the station card with its × control or click elsewhere on the map.'],
  },
];

interface ExplorerTutorialProps {
  open: boolean;
  onClose: () => void;
}

const targetBounds = (selector: string) => {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (!nodes.length) return null;
  const rects = nodes.map((node) => node.getBoundingClientRect());
  return {
    bottom: Math.max(...rects.map((rect) => rect.bottom)),
    left: Math.min(...rects.map((rect) => rect.left)),
    right: Math.max(...rects.map((rect) => rect.right)),
    top: Math.min(...rects.map((rect) => rect.top)),
  };
};

export default function ExplorerTutorial({ open, onClose }: ExplorerTutorialProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [bounds, setBounds] = useState<ReturnType<typeof targetBounds>>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const step = STEPS[stepIndex];

  useEffect(() => {
    if (open) setStepIndex(0);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    const target = document.querySelector<HTMLElement>(step.target);
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    const update = () => setBounds(targetBounds(step.target));
    update();
    const frame = window.requestAnimationFrame(update);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, step.target]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', closeOnEscape);
    cardRef.current?.focus();
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose, open, stepIndex]);

  if (!open) return null;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const cardWidth = Math.min(520, viewportWidth - 32);
  const gap = 16;
  let cardLeft = Math.max(gap, (viewportWidth - cardWidth) / 2);
  let cardTop = gap;
  if (bounds) {
    if (bounds.right + gap + cardWidth <= viewportWidth) cardLeft = bounds.right + gap;
    else if (bounds.left - gap - cardWidth >= 0) cardLeft = bounds.left - gap - cardWidth;
    else cardLeft = Math.min(viewportWidth - cardWidth - gap, Math.max(gap, bounds.left));
    cardTop = Math.min(viewportHeight - 420, Math.max(gap, bounds.top));
  }

  return (
    <Box sx={{ inset: 0, pointerEvents: 'none', position: 'fixed', zIndex: 1400 }}>
      {bounds && <Box aria-hidden sx={(theme) => ({
        border: 2,
        borderColor: 'brand.primaryBlue',
        borderRadius: 1,
        boxShadow: `0 0 0 9999px ${alpha(theme.palette.common.black, 0.72)}`,
        height: `calc(${Math.max(0, bounds.bottom - bounds.top)}px + ${theme.spacing(theme.jtSpacing.component.sm)} + ${theme.spacing(theme.jtSpacing.component.sm)})`,
        left: `calc(${bounds.left}px - ${theme.spacing(theme.jtSpacing.component.sm)})`,
        position: 'fixed',
        top: `calc(${bounds.top}px - ${theme.spacing(theme.jtSpacing.component.sm)})`,
        transition: 'all 220ms ease',
        width: `calc(${Math.max(0, bounds.right - bounds.left)}px + ${theme.spacing(theme.jtSpacing.component.sm)} + ${theme.spacing(theme.jtSpacing.component.sm)})`,
      })} />}
      <Paper ref={cardRef} role="dialog" aria-label={`Tutorial step ${stepIndex + 1} of ${STEPS.length}: ${step.title}`} tabIndex={-1} elevation={12} sx={(theme) => ({ bgcolor: 'base.700', border: 1, borderColor: 'brand.primaryBlue', borderRadius: 1, display: 'grid', gap: theme.jtSpacing.gap.sm, left: stepIndex === 0 ? '50%' : cardLeft, maxHeight: `calc(100dvh - ${theme.spacing(4)})`, overflowY: 'auto', p: theme.jtSpacing.component.md, pointerEvents: 'auto', position: 'fixed', top: stepIndex === 0 ? '50%' : Math.max(gap, cardTop), transform: stepIndex === 0 ? 'translate(-50%, -50%)' : 'none', width: cardWidth })}>
        <Box sx={{ alignItems: 'start', display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="captionSmall" color="brand.primaryBlue">Step {stepIndex + 1} of {STEPS.length}</Typography>
            <Typography variant="h4">{step.title}</Typography>
          </Box>
          <IconButton aria-label="Close tutorial" onClick={onClose} size="small" sx={{ color: 'text.secondary' }}><CloseIcon /></IconButton>
        </Box>
        {step.paragraphs.map((paragraph) => <Typography key={paragraph} variant="body1" component="p" color="text.secondary">{paragraph}</Typography>)}
        {step.interactions && <Box sx={(theme) => ({ bgcolor: 'surface', border: 1, borderColor: 'divider', borderRadius: 1, display: 'grid', gap: theme.jtSpacing.gap.sm, p: theme.jtSpacing.component.md })}>
          <Typography variant="button" color="brand.primaryGreen">Available interaction</Typography>
          <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.sm })}>
            {step.interactions.map((interaction) => {
              const separator = interaction.indexOf(' ');
              const action = separator < 0 ? interaction : interaction.slice(0, separator);
              const detail = separator < 0 ? '' : interaction.slice(separator);
              return <Box key={interaction} sx={(theme) => ({ alignItems: 'center', display: 'grid', gap: theme.jtSpacing.gap.sm, gridTemplateColumns: 'auto minmax(0, 1fr)' })}>
                <Box aria-hidden sx={(theme) => ({ bgcolor: 'brand.primaryGreen', borderRadius: '50%', height: theme.spacing(1), width: theme.spacing(1) })} />
                <Typography variant="caption" color="text.secondary"><Box component="span" sx={{ color: 'brand.primaryGreen' }}>{action}</Box>{detail}</Typography>
              </Box>;
            })}
          </Box>
        </Box>}
        <Stack direction="row" aria-label="Tutorial progress" sx={(theme) => ({ gap: theme.jtSpacing.gap.xs, justifyContent: 'center' })}>
          {STEPS.map((item, index) => <IconButton key={item.title} aria-label={`Go to step ${index + 1}: ${item.title}`} onClick={() => setStepIndex(index)} size="small" sx={{ p: 0.5 }}><Box sx={{ bgcolor: index === stepIndex ? 'brand.primaryBlue' : 'base.300', borderRadius: '50%', height: 8, width: 8 }} /></IconButton>)}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onClose} color="inherit" size="small" sx={(theme) => ({ borderRadius: 1, height: theme.spacing(4), minWidth: 'auto', px: theme.jtSpacing.component.sm, py: 0 })}>Skip tour</Button>
          <Box sx={(theme) => ({ display: 'flex', gap: theme.jtSpacing.gap.xs })}>
            <Button disabled={stepIndex === 0} onClick={() => setStepIndex((index) => index - 1)} size="small" sx={(theme) => ({ borderRadius: 1, height: theme.spacing(4), minWidth: 'auto', px: theme.jtSpacing.component.sm, py: 0 })}>Back</Button>
            <Button variant="contained" size="small" sx={(theme) => ({ borderRadius: 1, height: theme.spacing(4), minWidth: 'auto', px: theme.jtSpacing.component.sm, py: 0 })} onClick={() => { if (stepIndex === STEPS.length - 1) onClose(); else setStepIndex((index) => index + 1); }}>{stepIndex === STEPS.length - 1 ? 'Finish' : 'Next'}</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
