import { Box, Button, FormControlLabel, Stack, Switch, Tooltip, Typography as MuiTypography, useMediaQuery, useTheme, type TypographyProps, type Theme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { LogoWordmark, type LogoVariant } from '../components/Logo';
import { TypographyPreviewItem } from './helper';
import { type TypographyToken } from './helperUtils';

function TooltipTypography({ variant = 'body1', children, ...props }: TypographyProps) {
  const tooltipLabel = typeof variant === 'string' ? variant : 'body1';

  return (
    <Tooltip title={tooltipLabel} arrow placement="top">
      <MuiTypography variant={variant} {...props}>
        {children}
      </MuiTypography>
    </Tooltip>
  );
}

function ColorSwatch({ label, hex, showSpacingGuides = false }: { label: string; hex: string; showSpacingGuides?: boolean }) {
  const guideSx = showSpacingGuides
    ? {
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          border: '1px dashed #b280ff',
          borderRadius: 'inherit',
          boxSizing: 'border-box',
        },
      }
    : undefined;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(81, 93, 97, 0.3)', p: 1, borderRadius: 0.75, ...(guideSx ?? {}) }}>
      <Box sx={{ width: 48, height: 48, borderRadius: 0.75, background: hex }} />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <TooltipTypography variant="body1" sx={{ fontWeight: 700 }}>{label}</TooltipTypography>
        <TooltipTypography variant="body2" sx={{ opacity: 0.8 }}>{hex}</TooltipTypography>
      </Box>
    </Box>
  );
}

function useComputedSpacing(elementRef: React.RefObject<HTMLDivElement | null>) {
  const [spacing, setSpacing] = useState<{ pt?: string; pl?: string; mt?: string; mb?: string }>({});

  useEffect(() => {
    if (!elementRef.current) return;

    const el = elementRef.current;
    const computed = window.getComputedStyle(el);

    setSpacing({
      pt: computed.paddingTop,
      pl: computed.paddingLeft,
      mt: computed.marginTop,
      mb: computed.marginBottom,
    });
  }, [elementRef]);

  return spacing;
}

function LogoVariantPreview({ variant, compressedLogos, showSpacingGuides, showSpacingPixels, guideSx, theme }: { variant: { key: LogoVariant; label: string }; compressedLogos: boolean; showSpacingGuides: boolean; showSpacingPixels: boolean; guideSx: Record<string, unknown> | undefined; theme: Theme }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box key={variant.key} ref={ref} sx={{
      width: '100%', maxWidth: 360,
      p: theme.jtSpacing.component.md, background: 'rgba(81, 93, 97, 0.3)', borderRadius: 1, ...(guideSx ?? {})
    }}>
      {showSpacingGuides && <SpacingMetrics elementRef={ref} showPixels={showSpacingPixels} />}
      <TooltipTypography variant="h4" component="div">{variant.label}</TooltipTypography>
      <Box sx={{ mt: theme.jtSpacing.component.md, display: 'flex', justifyContent: 'flex-end' }}>
        <LogoWordmark variant={variant.key} compressed={compressedLogos} linkToHome={false} />
      </Box>
    </Box>
  );
}

function SpacingMetrics({ elementRef, showPixels }: { elementRef: React.RefObject<HTMLDivElement | null>; showPixels: boolean }) {
  const spacing = useComputedSpacing(elementRef);
  const purple = '#b280ff';

  return (
    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Top center - padding top */}
      {showPixels && spacing.pt && spacing.pt !== '0px' && (
        <Box sx={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', color: purple, fontSize: '0.75rem', fontWeight: 600 }}>
          {spacing.pt}
        </Box>
      )}

      {/* Left center - padding left */}
      {showPixels && spacing.pl && spacing.pl !== '0px' && (
        <Box sx={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', color: purple, fontSize: '0.75rem', fontWeight: 600 }}>
          {spacing.pl}
        </Box>
      )}

      {/* Top-right - margin-top */}
      {showPixels && spacing.mt && spacing.mt !== '0px' && (
        <Box sx={{ position: 'absolute', top: 4, right: 6, color: purple, fontSize: '0.75rem', fontWeight: 600 }}>
          {spacing.mt}
        </Box>
      )}

      {/* Bottom-right - margin-bottom */}
      {showPixels && spacing.mb && spacing.mb !== '0px' && (
        <Box sx={{ position: 'absolute', bottom: 4, right: 6, color: purple, fontSize: '0.75rem', fontWeight: 600 }}>
          {spacing.mb}
        </Box>
      )}
    </Box>
  );
}


export default function DesignSystem() {
  // Design system uses the theme's dark brand palette by default

  const theme = useTheme()
  const [compressedLogos, setCompressedLogos] = useState(false)
  const [showSpacingGuides, setShowSpacingGuides] = useState(false)
  const [showSpacingPixels, setShowSpacingPixels] = useState(true)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  // Refs for measuring actual computed spacing
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const logoSectionRef = useRef<HTMLDivElement>(null);
  const logoActivePreviewRef = useRef<HTMLDivElement>(null);
  const colorSectionRef = useRef<HTMLDivElement>(null);

  const activeLogoVariant: LogoVariant = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  const logoVariants: Array<{ key: LogoVariant; label: string }> = [
    { key: 'mobile', label: 'Mobile' },
    { key: 'tablet', label: 'Tablet' },
    { key: 'desktop', label: 'Desktop' },
  ]

  const typography = [
    { label: 'H1', variant: theme.typography.h1 as TypographyToken, content: "Landing page title" },
    { label: 'H2', variant: theme.typography.h2 as TypographyToken, content: "Section heading" },
    { label: 'H3', variant: theme.typography.h3 as TypographyToken, content: "Subsection heading" },
    { label: 'H4', variant: theme.typography.h4 as TypographyToken, content: "Small heading / Card Titles" },
    { label: 'Body 1', variant: theme.typography.body1 as TypographyToken, content: "Body text" },
    { label: 'Body 2', variant: theme.typography.body2 as TypographyToken, content: "primary body text? (styles can be refined)" },
      { label: 'Caption', variant: theme.typography.caption as TypographyToken, content: "Image captions, disclaimers? (styles can be refined)" },
    { label: 'Button', variant: theme.typography.button as TypographyToken, content: "Button text" },
  ]

  // Some custom palette keys are attached to theme.palette by our muiTheme. TS doesn't know those keys,
  // so narrow with a small helper to read safely without `any` casts.
  const readPalette = <K extends string>(key: K, fallback: Record<string, string>) => {
    const paletteObj = theme.palette as unknown as Record<string, unknown>
    const p = paletteObj[key] as Record<string, string> | undefined
    return {
      ...(fallback ?? {}),
      ...(p ?? {}),
    }
  }

  const common = readPalette('common', { white: '#ffffff', black: '#1a1a1a' })
  const brand = readPalette('brand', { base: '#253439', primaryBlue: '#51a2bd', primaryGreen: '#7ed957' })
  const accent = readPalette('accent', { blue: '#79e1e4', orange: '#f77c3b', yellow: '#f2c820', purple: '#b280ff', pink: '#ff677d' })
  const guideSx = showSpacingGuides
    ? {
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          border: '1px dashed #b280ff',
          borderRadius: 'inherit',
          boxSizing: 'border-box',
        },
      }
    : undefined

  const commonColors = [
    { label: 'Light', hex: common.white },
    { label: 'Dark', hex: common.black },
  ];

  const brandPalette = [
    { label: 'Base', hex: brand.base },
    { label: 'Primary Blue', hex: brand.primaryBlue },
    { label: 'Primary Green', hex: brand.primaryGreen },
  ];

  const accentPalette = [
    { label: 'Blue', hex: accent.blue },
    { label: 'Orange', hex: accent.orange },
    { label: 'Yellow', hex: accent.yellow },
    { label: 'Purple', hex: accent.purple },
    { label: 'Pink', hex: accent.pink },
  ];

  const baseKeys = ['50','100','200','300','400','500','600','700','800','900']
  const basePalette = readPalette('base', {
    '50': '#e9ebeb',
    '100': '#bbc0c2',
    '200': '#9ba2a4',
    '300': '#6d777a',
    '400': '#515d61',
    '500': '#253439',
    '600': '#222f34',
    '700': '#1a2528',
    '800': '#141d1f',
    '900': '#101618',
  })

  // Colors that were only present in the DesignSystem before — move to Deactivated
  const deactivated = [
    { label: 'Spray', hex: '#7eeaee' },
    { label: 'Orange Roughy', hex: '#cb531b' },
    { label: 'Bitter Lemon', hex: '#dee006' },
    { label: 'Heliotrope', hex: '#e263ff' },
    { label: 'Web Orange', hex: '#efa400' },
    { label: 'Sasquatch Socks', hex: '#ff4c79' },
  ]

  return (
    <Box ref={mainContainerRef} sx={{ maxWidth: 1400, mx: 'auto', px: theme.jtSpacing.page.x.sm, my: theme.jtSpacing.page.y.md }}>
      {showSpacingGuides && <SpacingMetrics elementRef={mainContainerRef} showPixels={showSpacingPixels} />}
      <Box ref={headerRef} sx={{ py: theme.jtSpacing.section.md, px: theme.jtSpacing.component.md, ...(guideSx ?? {}) }}>
        {showSpacingGuides && <SpacingMetrics elementRef={headerRef} showPixels={showSpacingPixels} />}
        <TooltipTypography variant="h1" component="h1">Just Transition Website Design System</TooltipTypography>
      </Box>

      <Box ref={controlsRef} sx={{ display: 'flex', justifyContent: 'flex-start', gap: theme.jtSpacing.gap.md, py: theme.jtSpacing.component.sm, px: theme.jtSpacing.component.md, ...(guideSx ?? {}) }}>
        {showSpacingGuides && <SpacingMetrics elementRef={controlsRef} showPixels={showSpacingPixels} />}
        <FormControlLabel
          control={
            <Switch
              checked={showSpacingGuides}
              onChange={(event) => setShowSpacingGuides(event.target.checked)}
              color="primary"
            />
          }
          label={
            <TooltipTypography variant="body1">
              {showSpacingGuides ? 'Spacing guides on' : 'Spacing guides off'}
            </TooltipTypography>
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={showSpacingPixels}
              onChange={(event) => setShowSpacingPixels(event.target.checked)}
              color="primary"
              disabled={!showSpacingGuides}
            />
          }
          label={
            <TooltipTypography variant="body1">
              {showSpacingPixels ? 'Pixel values on (debug in progress)' : 'Pixel values off (debug in progress)'}
            </TooltipTypography>
          }
        />
      </Box>

      <Box sx={{ py: theme.jtSpacing.section.xs, px: theme.jtSpacing.component.md, ...(guideSx ?? {})}}>
          <TooltipTypography variant="caption">To see how spacing changes at different breakpoints, resize the browser window or use developer tools.</TooltipTypography>
      </Box>

      <Box ref={logoSectionRef} sx={{ py: theme.jtSpacing.section.xs, px: theme.jtSpacing.component.md, ...(guideSx ?? {}) }}>
        {showSpacingGuides && <SpacingMetrics elementRef={logoSectionRef} showPixels={showSpacingPixels} />}
        <TooltipTypography variant="h2" component="h2" gutterBottom>Logo</TooltipTypography>
        <TooltipTypography variant="body1">The production logo now uses conditional return by breakpoint: mobile, tablet, desktop.</TooltipTypography>
        <TooltipTypography variant="body1">
          Current viewport renders:{' '}
          <Box component="span" sx={{ fontWeight: 700, color: brand.primaryGreen }}>
            {activeLogoVariant}
          </Box>
        </TooltipTypography>

        <FormControlLabel
          control={
            <Switch
              checked={compressedLogos}
              onChange={(event) => setCompressedLogos(event.target.checked)}
              color="primary"
            />
          }
          label={
            <TooltipTypography variant="body1">
              {compressedLogos ? 'Compressed logos on (TBD)' : 'Compressed logos off (TBD)'}
            </TooltipTypography>
          }
          sx={{ py: theme.jtSpacing.component.sm, alignItems: 'center' }}
        />
  
        <Box ref={logoActivePreviewRef} sx={{
          width: '100%', maxWidth: 560,
          p: theme.jtSpacing.component.md, background: 'rgba(81, 93, 97, 0.3)', borderRadius: 1, ...(guideSx ?? {})
        }}>
          {showSpacingGuides && <SpacingMetrics elementRef={logoActivePreviewRef} showPixels={showSpacingPixels} />}
          <TooltipTypography variant="h4" component="div">Active preview</TooltipTypography>
          <Box sx={{ mt: theme.jtSpacing.component.md}}>
            <LogoWordmark variant={activeLogoVariant} compressed={compressedLogos} linkToHome={false} />
          </Box>
        </Box>

        {/*TODO: idk why but there's a spacing issue? */}
        <Box sx={{ my: theme.jtSpacing.section.sm, borderBottom: `1px solid ${theme.palette.divider}` }} />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={theme.jtSpacing.gap.lg}>
          {logoVariants.map((variant) => (
            <LogoVariantPreview key={variant.key} variant={variant} compressedLogos={compressedLogos} showSpacingGuides={showSpacingGuides} showSpacingPixels={showSpacingPixels} guideSx={guideSx} theme={theme} />
          ))}
        </Stack>
      </Box>

      <Box ref={colorSectionRef} sx={{ py: theme.jtSpacing.section.xs, px: theme.jtSpacing.component.md, ...(guideSx ?? {}) }}>
        {showSpacingGuides && <SpacingMetrics elementRef={colorSectionRef} showPixels={showSpacingPixels} />}
        <TooltipTypography variant="h2" component="h2" gutterBottom>Color Palette</TooltipTypography>
          <TooltipTypography variant="body1" >MUI theme palette colors for the Just Transitions website.</TooltipTypography>
          <TooltipTypography variant="body1" >Any colors used in UI components need to pass color contrast accessibility guidelines (AA and AAA).</TooltipTypography>
          <TooltipTypography variant="body1" >Any colors used in visualizations and maps need to pass color contrast and blindness checks.</TooltipTypography>
        <Box sx={{ display: 'flex', gap: theme.jtSpacing.gap.lg, flexWrap: 'wrap', my: theme.jtSpacing.section.sm, }}>
          <Box sx={{ flex: `1 1 200px`, display: 'flex', flexDirection: 'column', gap: theme.jtSpacing.gap.sm, p: theme.jtSpacing.component.xs, ...(guideSx ?? {}) }}>
            <TooltipTypography variant="h4" component="h4">Brand</TooltipTypography>
            {brandPalette.map((c) => (
              <ColorSwatch key={c.label} label={c.label} hex={c.hex} showSpacingGuides={showSpacingGuides} />
            ))}
          </Box>
          <Box sx={{ flex: `1 1 200px`, display: 'flex', flexDirection: 'column', gap: theme.jtSpacing.gap.sm, p: theme.jtSpacing.component.xs, ...(guideSx ?? {}) }}>
            <TooltipTypography variant="h4" component="h4">Text</TooltipTypography>
            {commonColors.map((c) => (
              <ColorSwatch key={c.label} label={c.label} hex={c.hex} showSpacingGuides={showSpacingGuides} />
            ))}
          </Box>
          <Box sx={{ flex: `1 1 200px`, display: 'flex', flexDirection: 'column', gap: theme.jtSpacing.gap.sm, p: theme.jtSpacing.component.xs, ...(guideSx ?? {}) }}>
            <TooltipTypography variant="h4" component="h4">Accents?</TooltipTypography>
            {accentPalette.map((c) => (
              <ColorSwatch key={c.label} label={c.label} hex={c.hex} showSpacingGuides={showSpacingGuides} />
            ))}
          </Box>
        </Box>

          <Box sx={{ mt: theme.jtSpacing.section.md, ...(guideSx ?? {}) }}>
            <Box sx={{ display: 'flex', gap: theme.jtSpacing.gap.lg, flexWrap: 'wrap'}}>
              <Box sx={{ flex: `1 1 200px`, display: 'flex', flexDirection: 'column', gap: theme.jtSpacing.gap.sm, p: theme.jtSpacing.component.xs, ...(guideSx ?? {}) }}>
                <TooltipTypography variant="h4" component="h4">Base</TooltipTypography>
                {baseKeys.map((k) => (
                  <ColorSwatch key={k} label={`${k}`} hex={basePalette[k]} showSpacingGuides={showSpacingGuides} />
                ))}
              </Box>
              <Box sx={{ flex: `1 1 200px`, display: 'flex', flexDirection: 'column', gap: theme.jtSpacing.gap.sm, p: theme.jtSpacing.component.xs, ...(guideSx ?? {}) }}>
                <TooltipTypography variant="h4" component="h4">Currently Deactivated</TooltipTypography>
                {deactivated.map((c) => (
                  <ColorSwatch key={c.label} label={c.label} hex={c.hex} showSpacingGuides={showSpacingGuides} />
                ))}
              </Box>
            </Box>
          </Box>
      </Box>

      <Box sx={{ py: theme.jtSpacing.section.xs, px: theme.jtSpacing.component.md, ...(guideSx ?? {}) }}>
        <TooltipTypography variant="h2" component="h2" gutterBottom>Typography</TooltipTypography>
        <TooltipTypography variant="body1">{"Heading \u2014 Hammersmith One"}</TooltipTypography>
        <TooltipTypography variant="body1">{"Body \u2014 Nunito Sans (currently), Proxima Nova"}</TooltipTypography>
        <TooltipTypography variant="body1">Specs format: font-size / font-weight / line-height / font-family</TooltipTypography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.jtSpacing.gap.lg, my: theme.jtSpacing.section.sm, }}>
          {typography.map((t) => (
            <Box key={t.label} sx={{
              display: 'flex', flexDirection: 'column',
              background: 'rgba(81, 93, 97, 0.3)', borderRadius: 1,
              gap: theme.jtSpacing.component.sm, px: theme.jtSpacing.component.md, py: theme.jtSpacing.component.sm, ...(guideSx ?? {})
            }}>
              <TypographyPreviewItem label={t.label} variant={t.variant as Record<string, unknown>} />
              <Box sx={{ p: theme.jtSpacing.component.sm, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <TooltipTypography variant="caption">
                  {t.content}
                </TooltipTypography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ py: theme.jtSpacing.section.xs, px: theme.jtSpacing.component.md, ...(guideSx ?? {}) }}>
        <TooltipTypography variant="h2" component="h2" gutterBottom>Component guidance</TooltipTypography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={theme.jtSpacing.gap.lg} >
          <Box sx={{...guideSx, p: theme.jtSpacing.component.xs}}>
            <TooltipTypography variant="h4" component="div" gutterBottom>Buttons</TooltipTypography>
            <Stack direction="row" spacing={theme.jtSpacing.gap.md}>
              <Button variant="contained" size='medium'>Primary</Button>
              <Button variant="outlined" size='medium'>Outline</Button>
              <Button variant="contained" color='secondary' size='medium'>Secondary</Button>
              <Button variant="outlined"  color='secondary' size='medium'>Outline</Button>
            </Stack>
          </Box>

          <Box sx={{...guideSx, p: theme.jtSpacing.component.xs}}>
            <TooltipTypography variant="h4" component="div" gutterBottom>Card</TooltipTypography>
            <Box sx={{ p: theme.jtSpacing.component.md, bgcolor: 'rgba(255, 255, 255, 0.06)', borderRadius: 1, ...(guideSx ?? {}) }}>
              <TooltipTypography variant="h4" component="h4" gutterBottom>Card title</TooltipTypography>
              <TooltipTypography variant="body2">Short description or metadata goes here.</TooltipTypography>
            </Box>
          </Box>

        </Stack>
      </Box>
    </Box>
  );
}
