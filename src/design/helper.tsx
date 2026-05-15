import { Box, Tooltip, Typography as MuiTypography, type TypographyProps, useTheme } from '@mui/material';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { describeTypographyFontSize, type TypographyToken } from './helperUtils';

const TooltipTypography = forwardRef<HTMLSpanElement, TypographyProps>(function TooltipTypography(
  { variant = 'body2', children, ...props },
  ref,
) {
  const tooltipLabel = typeof variant === 'string' ? variant : 'body2';

  return (
    <Tooltip title={tooltipLabel} arrow placement="top">
      <MuiTypography ref={ref} variant={variant} {...props}>
        {children}
      </MuiTypography>
    </Tooltip>
  );
});

export function TypographyPreviewItem({
  label,
  variant,
}: {
  label: string;
  variant: TypographyToken;
}) {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [computedFontSize, setComputedFontSize] = useState('');
  const [clampSummary, setClampSummary] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const updateComputedFontSize = () => {
      if (!previewRef.current) {
        return;
      }

      const rootFontSizePx = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
      const viewportWidthPx = window.innerWidth;
      const computedStyles = window.getComputedStyle(previewRef.current);
      const clampInfo = describeTypographyFontSize(variant.fontSize, rootFontSizePx, viewportWidthPx);

      setComputedFontSize(computedStyles.fontSize);
      setClampSummary(
        clampInfo.branch === 'fixed'
          ? `(${clampInfo.picked})`
          : `(${clampInfo.branch}, ${clampInfo.picked})`,
      );
    };

    updateComputedFontSize();
    window.addEventListener('resize', updateComputedFontSize);

    return () => window.removeEventListener('resize', updateComputedFontSize);
  }, [variant]);

  return (
    <Box className="type-item">
      <TooltipTypography ref={previewRef} variant="inherit" component="div" className="type-sample" sx={{
        ...variant,
        mb: theme.jtSpacing.component.xs,
      }}>
        {label} — Example headline
      </TooltipTypography>
      <TooltipTypography variant="body2" component="div" className="type-meta">
        {`${variant.fontSize ?? 'inherit'} / ${variant.fontWeight ?? 'inherit'} / ${variant.lineHeight ?? 'inherit'} / ${variant.fontFamily ?? 'inherit'}`}
      </TooltipTypography>
      <TooltipTypography variant="body2" component="div" sx={{ color: 'secondary.main', fontWeight: 700, mt: 0.35 }}>
        {computedFontSize ? (
          (() => {
            const px = computedFontSize.endsWith('px') ? Number.parseFloat(computedFontSize) : NaN;
            const pt = Number.isFinite(px) ? `${(px * 0.75).toFixed(2)}pt` : '';
            return <span>Current display font size: {`${computedFontSize}${pt ? ` / ${pt}` : ''} ${clampSummary}`}</span>;
          })()
        ) : 'Current display font size: measuring...'}
      </TooltipTypography>
    </Box>
  );
}
