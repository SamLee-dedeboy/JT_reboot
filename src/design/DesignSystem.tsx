import { Box, Button, FormControlLabel, Stack, Switch, Tooltip, Typography as MuiTypography, useTheme, type TypographyProps } from '@mui/material';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Eyebrow from '../components/common/Eyebrow';
import Hl, { type HighlightStyleVariant } from '../components/common/Highlight';
import Icon from '../components/common/Icon';
import DocCard from '../components/repo/DocCard';
import ReferenceCard from '../components/repo/ReferenceCard';
import { assetUrl } from '../utils/baseUrl';
import DesignSection from './common/DesignSection';
import { displayGroupHeaderSx, displayGroupSx, displayItemSx, displayMetaSx, themeSafeGap } from './common/displayStyles';
import ColorContent from './sections/ColorContent';
import LogoContent from './sections/LogoContent';
import NumberingContent from './sections/NumberingContent';
import TypographyContent from './sections/TypographyContent';

function TooltipTypography({ variant = 'body1', children, ...props }: TypographyProps) {
  const tooltipLabel = typeof variant === 'string' ? variant : 'body1';

  return (
    <Tooltip
      arrow
      placement="top"
      title={
        <Box sx={{ px: 0.3, py: 0.2 }}>
          <Box sx={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'primary.main', lineHeight: 1.2 }}>
            Typography Variant
          </Box>
          <Box sx={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', textTransform: 'uppercase', lineHeight: 1.25 }}>
            {tooltipLabel}
          </Box>
        </Box>
      }
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: 'base.800',
            color: 'common.white',
            border: '1px solid rgba(126,217,87,0.3)',
            boxShadow: '0 10px 28px rgba(16,22,24,0.45)',
          },
        },
        arrow: {
          sx: { color: 'base.800' },
        },
      }}
    >
      <MuiTypography variant={variant} {...props}>
        {children}
      </MuiTypography>
    </Tooltip>
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

const DESIGN_SECTIONS = [
  { id: 'logo', label: 'Logo' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'sections', label: 'Sections' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'chips', label: 'Chips' },
  { id: 'cards', label: 'Cards' },
  { id: 'numbering', label: 'Numbering' },
  { id: 'highlight', label: 'Highlight' },
];

function DesignSystemNavRail() {
  const [active, setActive] = useState(DESIGN_SECTIONS[0].id);

  useEffect(() => {
    const els = DESIGN_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box
      component="nav"
      aria-label="Design system section navigation"
      sx={{
        position: 'fixed',
        right: '1.6rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 70,
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        gap: '0.4rem',
      }}
    >
      {DESIGN_SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <Box
            key={s.id}
            component="button"
            onClick={() => go(s.id)}
            aria-label={s.label}
            aria-current={on ? 'true' : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.7rem',
              py: '0.35rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              '&:hover .rail-dot, &:hover .rail-label': { color: 'primary.main' },
              '&:hover .rail-dot': { borderColor: 'primary.main' },
              '&:hover .rail-label': { opacity: 0.9, transform: 'none' },
            }}
          >
            <Box
              className="rail-label"
              sx={{
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '0.72rem',
                color: on ? 'primary.main' : 'common.white',
                opacity: on ? 0.9 : 0,
                transform: on ? 'none' : 'translateX(6px)',
                transition: 'opacity 200ms ease, transform 200ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {s.label}
            </Box>
            <Box
              className="rail-dot"
              sx={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                border: '1.5px solid',
                borderColor: on ? 'primary.main' : 'rgba(242,240,239,0.4)',
                bgcolor: on ? 'primary.main' : 'transparent',
                transform: on ? 'scale(1.2)' : 'none',
                transition: 'all 200ms ease',
                flex: 'none',
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}

function UsageNote({ children }: { children: ReactNode }) {
  return (
    <TooltipTypography variant="body2" sx={{ maxWidth: '72ch', mb: 2, color: 'base.200' }}>
      {children}
    </TooltipTypography>
  );
}

function StyleLine({ children, token = false, custom = false }: { children: ReactNode; token?: boolean; custom?: boolean }) {
  return (
    <Box component="div" sx={{ color: custom ? '#ff677d' : token ? 'base.100' : 'base.200', mb: 0.45 }}>
      {custom ? 'Non-token: ' : token ? 'Theme token: ' : ''}
      {children}
    </Box>
  );
}

function SpecCaption({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.35 }}>
      {children}
    </Box>
  );
}

const sampleDoc = {
  badge: 'Report',
  title: 'Workshop Report',
  img: '/images/repo/workbook.png',
  desc: 'Repository cards use a fixed media ratio, pill badge, compact title, description, and action chips.',
  actions: [{ label: 'Download', kind: 'dl' as const }],
};

const sampleReference = {
  title: 'Reference Literature Card',
  source: 'Source or publication name',
  meta: 'Authors, year, and metadata',
};

const highlightColors = [
  { label: 'Primary Green', swatch: '#7ed957' },
  { label: 'Primary Blue', swatch: '#51a2bd' },
  { label: 'Accent Blue', swatch: '#79e1e4' },
  { label: 'Accent Orange', swatch: '#f77c3b' },
  { label: 'Accent Yellow', swatch: '#f2c820' },
  { label: 'Accent Purple', swatch: '#b280ff' },
  { label: 'Accent Pink', swatch: '#ff677d' },
];

const highlightStyles: Array<{ label: string; value: HighlightStyleVariant }> = [
  { label: 'Underline', value: 'underline' },
  { label: 'Soft Fill', value: 'wash' },
  { label: 'Pill', value: 'pill' },
];

const highlightVibrancyOptions = [
  { label: 'Subtle', alpha: 0.18 },
  { label: 'Balanced', alpha: 0.32 },
  { label: 'Vibrant', alpha: 0.52 },
];

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red},${green},${blue},${alpha})`;
}

const statCardSx = {
  bgcolor: 'surface',
  border: '1px solid rgba(155,162,164,0.18)',
  borderRadius: 'var(--mui-shape-borderRadius)',
  p: '1.9rem',
} as const;

const pillSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  whiteSpace: 'nowrap',
  px: '1rem',
  py: '0.5rem',
  borderRadius: '999px',
  border: '1px solid',
  borderColor: 'base.300',
  bgcolor: 'surface',
  fontSize: '0.98rem',
  lineHeight: 1,
} as const;

function ComponentMeta({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ ...displayMetaSx, color: 'base.200', fontSize: '0.92rem', lineHeight: 1.5 }}>
      {children}
    </Box>
  );
}

function ButtonSpec({ title, children, caption }: { title: string; children: ReactNode; caption: ReactNode }) {
  return (
    <Box sx={displayItemSx}>
      <TooltipTypography variant="h4" component="h3">{title}</TooltipTypography>
      <Box>{children}</Box>
      <ComponentMeta>{caption}</ComponentMeta>
    </Box>
  );
}

function CardRow({ children, caption }: { children: ReactNode; caption: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(280px, 0.85fr)' }, gap: themeSafeGap, alignItems: 'start' }}>
      <Box sx={{ minWidth: 0 }}>{children}</Box>
      <ComponentMeta>{caption}</ComponentMeta>
    </Box>
  );
}

function LandingCardSpec({ n, title, body, icon }: { n: string; title: string; body: string; icon: 'compass' | 'users' | 'layers' }) {
  return (
    <Box sx={{ ...statCardSx, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '1.2rem' }}>
        <TooltipTypography variant="numberGhost" component="span">
          {n}
        </TooltipTypography>
        <Icon name={icon} size={28} stroke="var(--mui-palette-primary-main)" />
      </Box>
      <TooltipTypography variant="h3" component="h3" sx={{ mb: '1rem', color: 'primary.main' }}>
        {title}
      </TooltipTypography>
      <TooltipTypography variant="body2">{body}</TooltipTypography>
      <ComponentMeta>
        <StyleLine token>Number uses MUI `numberGhost` typography and `theme.numbering.color.ghost`.</StyleLine>
        <StyleLine token>Title uses MUI h3; body uses MUI body2; green icon uses primary.main.</StyleLine>
        <StyleLine token>Surface uses palette surface with shared shape radius.</StyleLine>
        <StyleLine custom>Border uses rgba(155,162,164,0.18), not a named palette token.</StyleLine>
      </ComponentMeta>
    </Box>
  );
}

function PageLayoutCardSpec() {
  return (
    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 1, borderLeft: 4, borderColor: 'primary.main', p: 2 }}>
      <TooltipTypography variant="h4" component="h3">PageLayout Card</TooltipTypography>
      <TooltipTypography variant="body1" component="p">Used by subpage `.card-grid` content such as repository pages.</TooltipTypography>
    </Box>
  );
}

function ArticleAccordionSpec() {
  return (
    <Box sx={{ bgcolor: 'surface', border: '1px solid rgba(126,217,87,0.4)', borderRadius: 'var(--mui-shape-borderRadius)', overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'auto 1fr', sm: 'auto 1fr auto' }, gap: { xs: '0.8rem', sm: '1.2rem' }, alignItems: 'center', p: { xs: '1.2rem', sm: '1.5rem 1.7rem' } }}>
        <TooltipTypography variant="numberArticle" component="span">01</TooltipTypography>
        <Box>
          <Box sx={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.3, color: 'common.white', mb: '0.4rem' }}>Article Accordion Card</Box>
          <Box sx={{ fontSize: '0.98rem', color: 'base.200' }}><Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>Source label</Box> Metadata line</Box>
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'grid' }, placeItems: 'center', width: '2.4rem', height: '2.4rem', borderRadius: '50%', border: '1.5px solid rgba(126,217,87,0.4)', color: 'primary.main', bgcolor: 'rgba(126,217,87,0.12)' }}>
          <Icon name="plus" size={18} />
        </Box>
      </Box>
      <Box sx={{ p: { xs: '0 1.2rem 1.8rem', sm: '0 1.7rem 1.8rem calc(1.7rem + 2.4rem + 1.2rem)' }, borderTop: '1px solid rgba(155,162,164,0.12)' }}>
        <Box sx={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.78rem', color: 'secondary.main', pt: '1.3rem', mb: '0.9rem' }}>Abstract</Box>
        <TooltipTypography sx={{ fontSize: '1.08rem', lineHeight: 1.7, color: 'rgba(242,240,239,0.85)' }}>Expandable article text appears below the button row.</TooltipTypography>
      </Box>
    </Box>
  );
}

function PlaceholderSpec() {
  return (
    <Box sx={{ position: 'relative', borderRadius: 'var(--mui-shape-borderRadius)', overflow: 'hidden', bgcolor: 'base.700', backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 2px, transparent 2px, transparent 11px)', border: '1px solid rgba(155,162,164,0.18)', display: 'grid', placeItems: 'center', aspectRatio: '16 / 10' }}>
      <Box component="span" sx={{ fontFamily: '"Nunito Sans", monospace', fontSize: '0.8rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'base.200', bgcolor: 'rgba(16, 22, 24, 0.55)', px: 1.4, py: 0.7, borderRadius: '999px', border: '1px solid rgba(155,162,164,0.2)' }}>Placeholder</Box>
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
  const [showSpacingGuides, setShowSpacingGuides] = useState(false)
  const [showSpacingPixels, setShowSpacingPixels] = useState(true)
  const [highlightSwatch, setHighlightSwatch] = useState(highlightColors[0].swatch)
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyleVariant>('underline')
  const [highlightVibrancy, setHighlightVibrancy] = useState(highlightVibrancyOptions[1].alpha)

  // Refs for measuring actual computed spacing
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const logoSectionRef = useRef<HTMLDivElement>(null);
  const colorSectionRef = useRef<HTMLDivElement>(null);

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
  const activeHighlightColor = hexToRgba(highlightSwatch, highlightVibrancy)

  return (
    <>
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
          <TooltipTypography variant="body1">To see how spacing changes at different breakpoints, resize the browser window or use developer tools.</TooltipTypography>
      </Box>

      <DesignSection
        id="logo"
        title="Logo"
        sectionRef={logoSectionRef}
        guideSx={guideSx}
        metrics={showSpacingGuides && <SpacingMetrics elementRef={logoSectionRef} showPixels={showSpacingPixels} />}
        explanation={
          <>
            <TooltipTypography variant="body1">The production logo is a responsive text wordmark that echoes the source ArcGIS header while fitting the new sticky MUI navbar.</TooltipTypography>
            <ComponentMeta>
              <StyleLine token>Logo text uses the MUI `logo` typography variant with viewport-specific fit sizing.</StyleLine>
              <StyleLine token>Logo color uses primary.main and nav placement uses the shared Navbar/AppBar shell.</StyleLine>
            </ComponentMeta>
          </>
        }
      >
        <LogoContent
          guideSx={guideSx}
          showSpacingGuides={showSpacingGuides}
          showSpacingPixels={showSpacingPixels}
          SpacingMetrics={SpacingMetrics}
          tooltipTypography={TooltipTypography}
        />
      </DesignSection>

      <DesignSection
        id="colors"
        title="Color Palette"
        sectionRef={colorSectionRef}
        guideSx={guideSx}
        metrics={showSpacingGuides && <SpacingMetrics elementRef={colorSectionRef} showPixels={showSpacingPixels} />}
        explanation={
          <>
            <TooltipTypography variant="body1">MUI theme palette colors for the Just Transitions website.</TooltipTypography>
            <TooltipTypography variant="body1">Any colors used in UI components need to pass color contrast accessibility guidelines (AA and AAA).</TooltipTypography>
            <TooltipTypography variant="body1">Any colors used in visualizations and maps need to pass color contrast and blindness checks.</TooltipTypography>
          </>
        }
      >
        <ColorContent guideSx={guideSx} />
      </DesignSection>

      <DesignSection
        id="typography"
        title="Typography"
        guideSx={guideSx}
        explanation={
          <>
            <TooltipTypography variant="body1">{"Heading \u2014 Hammersmith One"}</TooltipTypography>
            <TooltipTypography variant="body1">{"Body \u2014 Nunito Sans (currently), Proxima Nova"}</TooltipTypography>
            <TooltipTypography variant="body1">Specs format: font-size / font-weight / line-height / font-family</TooltipTypography>
            <TooltipTypography variant="body2" sx={{ color: '#ff677d', mt: 1 }}>Red notes in this design system identify styles that are not currently expressed as MUI theme tokens.</TooltipTypography>
          </>
        }
      >
        <TypographyContent guideSx={guideSx} />
      </DesignSection>

      <DesignSection id="numbering" eyebrow="Components" title="Numbering Systems" guideSx={guideSx}>
        <UsageNote>
          Current numbering appears in several visual roles across the website. These standalone specimens are backed by MUI typography variants plus `theme.numbering` layout tokens, and keep the green left accent because they are not inside a group container.
        </UsageNote>
        <NumberingContent />
      </DesignSection>

      <DesignSection id="spacing" eyebrow="Foundations" title="Spacing System" guideSx={guideSx}>
        <UsageNote>
          Spacing is split by intent: component padding for inside controls/cards, gap for layout relationships, section padding for vertical page rhythm, and page gutters for the design-system canvas.
        </UsageNote>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }, gap: theme.jtSpacing.gap.lg }}>
          {[
            { label: 'Component Padding', values: theme.jtSpacing.component, use: 'Inside cards, logo previews, buttons, form controls, and callout text blocks.' },
            { label: 'Layout Gaps', values: theme.jtSpacing.gap, use: 'Between cards, button rows, split columns, and grouped controls.' },
            { label: 'Section Rhythm', values: theme.jtSpacing.section, use: 'Vertical padding between major page sections and design-system chapters.' },
            { label: 'Page Gutters', values: theme.jtSpacing.page.x, use: 'Outer design-system page padding and wide canvas breathing room.' },
          ].map((group) => (
            <Box key={group.label} sx={statCardSx}>
              <TooltipTypography variant="h4" component="h3">{group.label}</TooltipTypography>
              <TooltipTypography variant="body2" sx={{ mb: 1.5 }}>{group.use}</TooltipTypography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                {Object.entries(group.values).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'grid', gridTemplateColumns: '72px 80px minmax(0, 1fr)', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ fontFamily: 'var(--font-heading)', color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>{key}</Box>
                    <Box sx={{ color: 'base.100' }}>{String(value)}</Box>
                    <Box sx={{ height: 10, width: `min(100%, ${Number(value) * 18}px)`, bgcolor: 'primary.main', borderRadius: 999 }} />
                  </Box>
                ))}
              </Box>
              <ComponentMeta>
                <StyleLine token>Values are consumed through `theme.jtSpacing` and `theme.spacing(...)`.</StyleLine>
                <StyleLine custom>Some legacy components still use literal rem/px spacing and should be migrated later.</StyleLine>
              </ComponentMeta>
            </Box>
          ))}
        </Box>
      </DesignSection>

      <DesignSection id="sections" eyebrow="Foundations" title="Section Styling" guideSx={guideSx}>
        <UsageNote>
          Current sections are styled as full-width bands with constrained content, section heads, optional dark/blue backgrounds, and callout rules.
        </UsageNote>
        <Stack spacing={theme.jtSpacing.gap.lg}>
          <CardRow
            caption={
              <SpecCaption>
                <StyleLine token>Outer element is `component="section"` with vertical rhythm.</StyleLine>
                <StyleLine token>{'Default `Section` uses `py: { xs: 3.75rem, md: 6rem }` and a `Container maxWidth="lg"`.'}</StyleLine>
                <StyleLine custom>The rem values are currently literal in `Section.tsx`; they should become `jtSpacing.section` aliases.</StyleLine>
              </SpecCaption>
            }
          >
            <Box component="section" sx={{ py: { xs: '3.75rem', md: '6rem' }, bgcolor: 'base.600', border: '1px solid rgba(155,162,164,0.16)' }}>
              <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: '1.25rem', md: '2rem' } }}>
                <Eyebrow sx={{ mb: '0.7rem' }}>Section Band</Eyebrow>
                <TooltipTypography variant="h2" component="h3">Constrained Content</TooltipTypography>
              </Box>
            </Box>
          </CardRow>
          <CardRow
            caption={
              <SpecCaption>
                <StyleLine token>SectionHead uses Eyebrow plus MUI h2.</StyleLine>
                <StyleLine custom>Eyebrow letter spacing, 0.85rem size, and SectionHead margin are local component styles.</StyleLine>
              </SpecCaption>
            }
          >
            <Box sx={statCardSx}>
              <Eyebrow sx={{ mb: '0.7rem' }}>Methodology</Eyebrow>
              <TooltipTypography variant="h2" component="h3">Our Approach</TooltipTypography>
            </Box>
          </CardRow>
          <CardRow
            caption={
              <SpecCaption>
                <StyleLine token>Repository/PageLayout sections use brand.base, common.white, secondary.main, and primary.main.</StyleLine>
                <StyleLine custom>Repository hero lede width, font size, and left-rule thickness are custom.</StyleLine>
              </SpecCaption>
            }
          >
            <Box sx={{ bgcolor: 'brand.base', border: '1px solid rgba(155,162,164,0.16)', p: theme.jtSpacing.component.md }}>
              <TooltipTypography variant="h2" component="h3" sx={{ color: 'secondary.main' }}>Page Title Section</TooltipTypography>
              <TooltipTypography component="p" sx={{ maxWidth: '60ch', fontSize: '1.3rem', lineHeight: 1.7, color: 'rgba(242,240,239,0.9)', borderLeft: '3px solid', borderColor: 'primary.main', pl: '1.5rem' }}>
                Repository lede with left accent rule.
              </TooltipTypography>
            </Box>
          </CardRow>
        </Stack>
      </DesignSection>

      <DesignSection id="buttons" eyebrow="Components" title="Buttons" guideSx={guideSx}>
        <UsageNote>
          Button styles currently used in the repo include global MUI contained/outlined buttons, navbar menu buttons, disabled CTAs, text-style disclosure buttons, and repository action pills.
        </UsageNote>
        <Stack spacing={theme.jtSpacing.gap.lg}>
          <ButtonSpec
            title="Primary + Outline CTA"
            caption={
              <SpecCaption>
                <StyleLine token>Used by HeroMap, Our Approach, Resources, and landing CTAs.</StyleLine>
                <StyleLine token>Typography uses `theme.typography.button`: Hammersmith One, 300, uppercase, 0.08em tracking, 1.15rem.</StyleLine>
                <StyleLine token>Shape, padding, disabled state, and hover lift come from `MuiButton` theme overrides.</StyleLine>
              </SpecCaption>
            }
          >
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary">Primary action</Button>
              <Button variant="outlined" color="primary">Outline action</Button>
              <Button variant="contained" color="primary" disabled>Disabled primary</Button>
              <Button variant="outlined" color="primary" disabled>Disabled outline</Button>
            </Stack>
          </ButtonSpec>
          <ButtonSpec
            title="Secondary Color CTA"
            caption={
              <SpecCaption>
                <StyleLine token>Uses the same global MUI button typography, radius, spacing, disabled state, and hover behavior.</StyleLine>
                <StyleLine token>Color comes from the secondary palette: primary blue family.</StyleLine>
              </SpecCaption>
            }
          >
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
              <Button variant="contained" color="secondary">Secondary</Button>
              <Button variant="outlined" color="secondary">Secondary outline</Button>
              <Button variant="contained" color="secondary" disabled>Disabled secondary</Button>
              <Button variant="outlined" color="secondary" disabled>Disabled outline</Button>
            </Stack>
          </ButtonSpec>
          <ButtonSpec
            title="Navbar Buttons"
            caption={
              <SpecCaption>
                <StyleLine token>Top-level nav buttons inherit MUI button typography.</StyleLine>
                <StyleLine token>Dropdown and mobile drawer accents use primary.main; captions use the captionSmall typography variant and base.100.</StyleLine>
                <StyleLine custom>Desktop dropdown and mobile drawer panels use local translucent surfaces, quiet borders, blur, and custom link markers.</StyleLine>
                <StyleLine custom>Navbar buttons use custom `minWidth: 140`, white text overrides, and active green outline/fill states.</StyleLine>
              </SpecCaption>
            }
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                <Button sx={{ minWidth: 140, color: 'common.white' }} endIcon={<Icon name="chevron-down" size={16} />}>Repository</Button>
                <Button sx={{ minWidth: 140, color: 'common.white', border: '1px solid rgba(126,217,87,0.36)', bgcolor: 'rgba(126,217,87,0.08)' }} endIcon={<Icon name="chevron-down" size={16} />}>Related Projects</Button>
                <Button disabled sx={{ minWidth: 140 }}>Scenarios</Button>
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(280px, 380px) minmax(260px, 340px)' }, gap: 2, alignItems: 'start' }}>
                <Box sx={{ bgcolor: 'rgba(37,52,57,0.96)', border: '1px solid rgba(155,162,164,0.22)', borderRadius: 'var(--mui-shape-borderRadius)', boxShadow: '0 18px 46px rgba(0,0,0,0.34)', p: 1 }}>
                  <Box sx={{ px: 1.5, pt: 1, pb: 1 }}>
                    <TooltipTypography variant="eyebrow" component="p" sx={{ mb: 0.75 }}>Explore</TooltipTypography>
                    <TooltipTypography variant="captionSmall" component="p" sx={{ color: 'base.100', lineHeight: 1.45, maxWidth: 280 }}>
                      Browse reports, learning materials, and project resources.
                    </TooltipTypography>
                    <Box sx={{ mt: 1.25, height: 2, width: 56, bgcolor: 'primary.main', borderRadius: 999 }} />
                  </Box>
                  {['Project Documentation & Reports', 'Service Learning & Education', 'References & Resources'].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mx: 0.5, my: 0.5, px: 1.25, py: 1.1, borderRadius: 'var(--mui-shape-borderRadius)', border: '1px solid transparent', color: 'common.white', '&:hover': { bgcolor: 'rgba(126,217,87,0.08)', borderColor: 'rgba(126,217,87,0.38)' } }}>
                      <Box sx={{ width: 3, height: 22, mt: 0.1, borderRadius: 999, bgcolor: 'primary.main', opacity: 0.72, flex: 'none' }} />
                      <Box sx={{ fontWeight: 800, lineHeight: 1.25 }}>{item}</Box>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ bgcolor: 'rgba(37,52,57,0.98)', border: '1px solid rgba(155,162,164,0.22)', borderRadius: 'var(--mui-shape-borderRadius)', boxShadow: '-18px 0 46px rgba(0,0,0,0.22)', p: 1.5 }}>
                  <Box sx={{ mb: 1.5 }}>
                    <TooltipTypography variant="h4" component="h3" sx={{ color: 'common.white', lineHeight: 1.12 }}>Menu</TooltipTypography>
                  </Box>
                  <Stack spacing={1}>
                    <Box sx={{ borderRadius: 'var(--mui-shape-borderRadius)', border: '1px solid rgba(126,217,87,0.34)', bgcolor: 'rgba(126,217,87,0.06)', overflow: 'hidden' }}>
                      <Box sx={{ px: 1.5, py: 1.25, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Box>
                          <Box sx={{ color: 'common.white', fontWeight: 800, lineHeight: 1.25 }}>Repository</Box>
                          <TooltipTypography variant="captionSmall" component="p" sx={{ color: 'base.100', mt: 0.45, lineHeight: 1.45 }}>
                            Browse reports, learning materials, and project resources.
                          </TooltipTypography>
                        </Box>
                        <Icon name="chevron-down" size={18} />
                      </Box>
                      <Box sx={{ mx: 1, mb: 1, pt: 0.75, borderTop: '1px solid rgba(155,162,164,0.16)' }}>
                        <TooltipTypography variant="eyebrow" component="p" sx={{ px: 1.25, pt: 0.7, pb: 0.25 }}>Explore</TooltipTypography>
                        {['Project Documentation & Reports', 'Service Learning & Education', 'References & Resources'].map((item) => (
                          <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', px: 1.25, py: 1, borderRadius: 'var(--mui-shape-borderRadius)', color: 'common.white' }}>
                            <Box sx={{ width: 3, height: 22, mt: 0.25, mr: 1.1, borderRadius: 999, bgcolor: 'primary.main', opacity: 0.72, flex: 'none' }} />
                            <Box sx={{ fontWeight: 800, lineHeight: 1.25 }}>{item}</Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ borderRadius: 'var(--mui-shape-borderRadius)', border: '1px solid rgba(155,162,164,0.18)', bgcolor: 'rgba(81,93,97,0.22)', px: 1.5, py: 1.25, color: 'common.white', fontWeight: 800 }}>Repository</Box>
                  </Stack>
                </Box>
              </Box>
            </Stack>
          </ButtonSpec>
          <ButtonSpec
            title="Text Disclosure Button"
            caption={
              <SpecCaption>
                <StyleLine token>Color uses primary.main.</StyleLine>
                <StyleLine custom>Typography is custom Hammersmith One, uppercase, 0.95rem, 0.08em tracking instead of MUI button.</StyleLine>
              </SpecCaption>
            }
          >
            <Box component="button" sx={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.95rem', color: 'primary.main' }}>
              Read more <Icon name="chevron-down" size={16} />
            </Box>
          </ButtonSpec>
          <ButtonSpec
            title="Repository Action Pill"
            caption={
              <SpecCaption>
                <StyleLine token>Main action color uses primary.main; ghost text uses secondary.light.</StyleLine>
                <StyleLine custom>Typography, border width, padding, radius, and hover transitions are custom in `DocCard`.</StyleLine>
              </SpecCaption>
            }
          >
            <Stack direction="row" spacing={1.2} sx={{ flexWrap: 'wrap' }}>
              <Box component="a" href="#" sx={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.85rem', px: '1.1rem', py: '0.62rem', borderRadius: '999px', border: '1.5px solid', borderColor: 'primary.main', color: 'primary.main' }}>Download <Icon name="arrow-down" size={15} /></Box>
              <Box component="a" href="#" sx={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.85rem', px: '1.1rem', py: '0.62rem', borderRadius: '999px', border: '1.5px solid rgba(155,162,164,0.4)', color: 'secondary.light' }}>View <Icon name="arrow-up-right" size={15} /></Box>
            </Stack>
          </ButtonSpec>
        </Stack>
      </DesignSection>

      <DesignSection id="chips" eyebrow="Components" title="Chips and Badges" guideSx={guideSx}>
        <UsageNote>
          Chips are non-navigation labels used in approach modes, repository badges, placeholders, and map/status legends.
        </UsageNote>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: theme.jtSpacing.gap.lg }}>
          <ButtonSpec
            title="Approach Mode Chip"
            caption={
              <SpecCaption>
                <StyleLine token>Background uses surface; borderColor uses base.300; dot uses primary.main.</StyleLine>
                <StyleLine custom>Typography is custom body font 0.98rem rather than a MUI typography variant.</StyleLine>
              </SpecCaption>
            }
          >
            <Box sx={pillSx}><Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main' }} />Scenario comparison</Box>
          </ButtonSpec>
          <ButtonSpec
            title="Repository Badge"
            caption={
              <SpecCaption>
                <StyleLine token>Text color uses primary.main.</StyleLine>
                <StyleLine custom>Dark alpha background, green alpha border, 0.68rem type, tracking, and pill radius are custom.</StyleLine>
              </SpecCaption>
            }
          >
            <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: 'rgba(16,22,24,0.78)', border: '1px solid rgba(126,217,87,0.35)', color: 'primary.main', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem', px: '0.7rem', py: '0.36rem', borderRadius: '999px' }}>Design Studio</Box>
          </ButtonSpec>
        </Box>
      </DesignSection>

      <DesignSection id="cards" eyebrow="Components" title="Cards" guideSx={guideSx}>
        <UsageNote>
          These are the card and card-like containers currently present across the repo. Each row shows the example on the left and typography plus palette usage on the right.
        </UsageNote>
        <Stack spacing={theme.jtSpacing.gap.lg}>
          <CardRow
            caption={
              <SpecCaption>
                <StyleLine token>Palette: primary.main, common.white, brand/base background depending on placement.</StyleLine>
                <StyleLine custom>Callout has intentionally square corners: border radius is 0.</StyleLine>
                <StyleLine custom>Some callouts use custom font sizing or line-height instead of a typography variant.</StyleLine>
              </SpecCaption>
            }
          >
            <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', borderRadius: 0, pl: theme.jtSpacing.component.md, py: theme.jtSpacing.component.sm, bgcolor: 'transparent' }}>
              <TooltipTypography variant="body1" component="p" sx={{ m: 0 }}>
                Callout text uses a left accent rule and intentionally keeps square edges.
              </TooltipTypography>
            </Box>
          </CardRow>
          <CardRow
            caption={
              <SpecCaption>
                <StyleLine token>Typography: title uses MUI h4; body uses MUI body1.</StyleLine>
                <StyleLine token>Border color uses primary.main; radius uses MUI spacing number through PageLayout styles.</StyleLine>
                <StyleLine custom>Background uses rgba(255,255,255,0.06), not a named palette token.</StyleLine>
              </SpecCaption>
            }
          >
            <PageLayoutCardSpec />
          </CardRow>
          <CardRow
            caption={
              <SpecCaption>
                <StyleLine token>Typography: title uses MUI h3; body uses MUI body2; color uses primary.main.</StyleLine>
                <StyleLine token>Surface uses palette surface; radius uses MUI shape radius.</StyleLine>
                <StyleLine custom>Number styling and border rgba are custom.</StyleLine>
              </SpecCaption>
            }
          >
            <LandingCardSpec n="01" icon="compass" title="Landing Foundation Card" body="Used by Foundations and mirrored by Stakes cards with translucent surface, quiet border, and compact padding." />
          </CardRow>
          <CardRow
            caption={
              <SpecCaption>
                <StyleLine token>Palette: surface, base.700, primary.main, base.700 contrast, secondary.light.</StyleLine>
                <StyleLine custom>Badge typography, badge alpha background/border, title restyle, description size, action pill styles, and hover shadow are custom.</StyleLine>
              </SpecCaption>
            }
          >
            <DocCard doc={sampleDoc} />
          </CardRow>
          <CardRow
            caption={
              <SpecCaption>
                <StyleLine token>Palette: surface, surfaceStrong, secondary.main, primary.main, common.white, base.200.</StyleLine>
                <StyleLine custom>Title/source/meta font sizes and 10px radius are custom.</StyleLine>
              </SpecCaption>
            }
          >
            <ReferenceCard r={sampleReference} />
          </CardRow>
          <CardRow
            caption={
              <SpecCaption>
                <StyleLine token>Palette: surface, primary.main, secondary.main, common.white, base.200.</StyleLine>
                <StyleLine custom>Index, title, metadata, kicker, body text sizing, alpha borders, and expand icon sizing are custom.</StyleLine>
              </SpecCaption>
            }
          >
            <ArticleAccordionSpec />
          </CardRow>
          <CardRow
            caption={
              <SpecCaption>
                <StyleLine token>Palette: primary.main, secondary.light, base.700; radius uses MUI shape radius on image.</StyleLine>
                <StyleLine token>Large number uses MUI `numberGhost` typography.</StyleLine>
                <StyleLine custom>Row borders, badge, title sizing, place label, and description sizing are custom.</StyleLine>
              </SpecCaption>
            }
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1.2fr' }, gap: '1.3rem', alignItems: 'center', py: '1.3rem', borderTop: '1px solid rgba(155,162,164,0.16)', borderBottom: '1px solid rgba(155,162,164,0.16)' }}>
              <Box component="img" src={assetUrl('/images/repo/studio-isleton.png')} alt="Studio card specimen" sx={{ width: '100%', borderRadius: 'var(--mui-shape-borderRadius)', border: '1px solid rgba(155,162,164,0.2)', display: 'block' }} />
              <Box>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: 'rgba(16,22,24,0.78)', border: '1px solid rgba(126,217,87,0.35)', color: 'primary.main', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem', px: '0.7rem', py: '0.36rem', borderRadius: '999px', mb: '1rem' }}>Design Studio</Box>
                <TooltipTypography variant="numberGhost" component="div" sx={{ mb: '0.6rem' }}>01</TooltipTypography>
                <TooltipTypography variant="h3" component="h4" sx={{ color: 'primary.main', mb: '0.7rem' }}>Studio Feature Row</TooltipTypography>
                <TooltipTypography variant="body2">Rows alternate image and text columns on desktop, then stack naturally on mobile.</TooltipTypography>
              </Box>
            </Box>
          </CardRow>
          <CardRow
            caption={
              <SpecCaption>
                <StyleLine token>Palette: base.700 and base.200.</StyleLine>
                <StyleLine custom>Striped background, alpha label background, monospace label, and alpha border are custom.</StyleLine>
              </SpecCaption>
            }
          >
            <PlaceholderSpec />
          </CardRow>
        </Stack>
      </DesignSection>

      <DesignSection id="highlight" eyebrow="Components" title="Inline Highlighter" guideSx={guideSx}>
        <UsageNote>
          The highlighter is a semantic mark with an underline gradient. The shared `Hl` primitive now accepts a `color` prop, so key phrases can use green by default or another approved accent color when a section needs distinction.
        </UsageNote>
        <Box sx={displayGroupSx}>
          <Box sx={displayGroupHeaderSx}>
            <TooltipTypography variant="h4" component="h3" sx={{ m: 0 }}>Highlight Specimen</TooltipTypography>
            <TooltipTypography variant="body2" sx={{ maxWidth: '64ch' }}>Interactive color controls and preview copy use the shared display-shell treatment.</TooltipTypography>
          </Box>
          <Box sx={displayItemSx}>
            <Box sx={{ display: 'grid', gap: theme.jtSpacing.gap.sm }}>
              <TooltipTypography variant="captionSmall" component="div">Style</TooltipTypography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {highlightStyles.map((style) => (
                  <Box
                    key={style.value}
                    component="button"
                    onClick={() => setHighlightStyle(style.value)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.2,
                      py: 0.7,
                      borderRadius: '999px',
                      border: 1,
                      borderColor: highlightStyle === style.value ? 'primary.main' : 'divider',
                      bgcolor: highlightStyle === style.value ? 'surface' : 'transparent',
                      color: highlightStyle === style.value ? 'primary.main' : 'base.100',
                      cursor: 'pointer',
                      typography: 'eyebrow',
                    }}
                  >
                    {style.label}
                  </Box>
                ))}
              </Box>

              <TooltipTypography variant="captionSmall" component="div">Vibrancy</TooltipTypography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {highlightVibrancyOptions.map((option) => (
                  <Box
                    key={option.label}
                    component="button"
                    onClick={() => setHighlightVibrancy(option.alpha)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.8,
                      px: 1.2,
                      py: 0.7,
                      borderRadius: '999px',
                      border: 1,
                      borderColor: highlightVibrancy === option.alpha ? 'primary.main' : 'divider',
                      bgcolor: highlightVibrancy === option.alpha ? hexToRgba(highlightSwatch, 0.16) : 'transparent',
                      color: highlightVibrancy === option.alpha ? 'common.white' : 'base.100',
                      cursor: 'pointer',
                      typography: 'eyebrow',
                    }}
                  >
                    <Box sx={{ width: 28, height: 10, borderRadius: 999, bgcolor: hexToRgba(highlightSwatch, option.alpha), border: 1, borderColor: 'divider' }} />
                    {option.label}
                  </Box>
                ))}
              </Box>

              <TooltipTypography variant="captionSmall" component="div">Accent hue</TooltipTypography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {highlightColors.map((c) => (
                  <Box
                    key={c.label}
                    component="button"
                    onClick={() => setHighlightSwatch(c.swatch)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.8,
                      px: 1.2,
                      py: 0.7,
                      borderRadius: '999px',
                      border: '1px solid',
                      borderColor: highlightSwatch === c.swatch ? 'primary.main' : 'divider',
                      bgcolor: highlightSwatch === c.swatch ? hexToRgba(c.swatch, 0.12) : 'transparent',
                      color: 'common.white',
                      cursor: 'pointer',
                      typography: 'eyebrow',
                    }}
                  >
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c.swatch }} />
                    {c.label}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '1rem 2rem', maxWidth: 1080 }}>
              {[
                ['01', <>Who <Hl color={activeHighlightColor} styleVariant={highlightStyle}>benefits</Hl>, and who carries the <Hl color={activeHighlightColor} styleVariant={highlightStyle}>tradeoffs</Hl>?</>],
                ['02', <>How do <Hl color={activeHighlightColor} styleVariant={highlightStyle}>social and ecological needs</Hl> shift across scenarios?</>],
                ['03', <>How can these scenarios support a <Hl color={activeHighlightColor} styleVariant={highlightStyle}>just transition</Hl>?</>],
                ['04', <>Use highlights for exact phrases, then let plain body text do the rest.</>],
              ].map(([n, text]) => (
                <TooltipTypography key={String(n)} component="p" sx={{ m: 0, display: 'grid', gridTemplateColumns: theme.numbering.grid.inlineTemplate, gap: theme.numbering.grid.inlineGap, alignItems: 'baseline', color: 'rgba(242,240,239,0.84)', fontSize: '1.1rem', lineHeight: 1.55 }}>
                  <TooltipTypography variant="numberArticle" component="span" aria-hidden>{n}</TooltipTypography>
                  <Box component="span">{text}</Box>
                </TooltipTypography>
              ))}
            </Box>
            <ComponentMeta>
              <StyleLine token>Color choices come from brand primary green, brand primary blue, and every color in the accent palette.</StyleLine>
              <StyleLine token>Vibrancy controls adjust the accent color alpha while keeping the palette hue fixed.</StyleLine>
              <StyleLine custom>The color-choice controls are custom pills; they are not MUI Buttons or Chips yet.</StyleLine>
            </ComponentMeta>
          </Box>
        </Box>
      </DesignSection>
    </Box>
    <DesignSystemNavRail />
    </>
  );
}
