import {
  Box,
  Button,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography as MuiTypography,
  useTheme,
  type TypographyProps,
} from '@mui/material'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import AnimatedNumber from '../../ui/animation/AnimatedNumber'
import Eyebrow from '../../ui/Eyebrow'
import Hl, { type HighlightStyleVariant } from '../../ui/Highlight'
import Icon from '../../ui/Icon'
import NavRail from '../../ui/NavRail'
import AccentPlateCard from '../../ui/cards/AccentPlateCard'
import ArticleAccordionCard from '../../ui/cards/ArticleAccordionCard'
import NotchTabCard from '../../ui/cards/NotchTabCard'
import ResourceReportCard from '../../ui/cards/ResourceReportCard'
import SideGlowCard from '../../ui/cards/SideGlowCard'
import SimpleCard from '../../ui/cards/SimpleCard'
import SplitRailCard from '../../ui/cards/SplitRailCard'
import StudioFeatureCard from '../../ui/cards/StudioFeatureCard'
import ReferenceCard from '../../features/repository/ReferenceCard'
import { assetUrl } from '../../utils/baseUrl'
import DesignSection from './common/DesignSection'
import { displayItemSx, displayMetaSx, themeSafeGap } from './common/displayStyles'
import ColorContent from './sections/ColorContent'
import LogoContent from './sections/LogoContent'
import NumberingContent from './sections/NumberingContent'
import TypographyContent from './sections/TypographyContent'

function TooltipTypography({ variant = 'body1', children, ...props }: TypographyProps) {
  const tooltipLabel = typeof variant === 'string' ? variant : 'body1'

  return (
    <Tooltip
      arrow
      placement="top"
      title={
        <Box sx={{ px: 0.3, py: 0.2 }}>
          <Box
            sx={{
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'primary.main',
              lineHeight: 1.2,
            }}
          >
            Typography Variant
          </Box>
          <Box
            sx={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              lineHeight: 1.25,
            }}
          >
            {tooltipLabel}
          </Box>
        </Box>
      }
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: 'base.800',
            color: 'common.white',
            border: '1px solid',
            borderColor: 'translucent.primaryGreen',
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
  )
}

function useComputedSpacing(elementRef: React.RefObject<HTMLDivElement | null>) {
  const [spacing, setSpacing] = useState<{ pt?: string; pl?: string; mt?: string; mb?: string }>({})

  useEffect(() => {
    if (!elementRef.current) return

    const el = elementRef.current
    const computed = window.getComputedStyle(el)

    setSpacing({
      pt: computed.paddingTop,
      pl: computed.paddingLeft,
      mt: computed.marginTop,
      mb: computed.marginBottom,
    })
  }, [elementRef])

  return spacing
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
  { id: 'scenario-data', label: 'Scenario/Data' },
  { id: 'numbering', label: 'Numbering' },
  { id: 'animation', label: 'Animation' },
  { id: 'highlight', label: 'Highlight' },
]

function UsageNote({ children }: { children: ReactNode }) {
  return (
    <TooltipTypography variant="body2" sx={{ maxWidth: '72ch', mb: 2, color: 'base.200' }}>
      {children}
    </TooltipTypography>
  )
}

function StyleLine({
  children,
  token = false,
  custom = false,
}: {
  children: ReactNode
  token?: boolean
  custom?: boolean
}) {
  const dotColor = custom ? 'accent.red' : token ? 'primary.main' : 'base.200'

  return (
    <Box
      component="div"
      sx={{
        display: 'grid',
        gridTemplateColumns: '0.55rem minmax(0, 1fr)',
        gap: 0.8,
        alignItems: 'baseline',
        color: custom ? 'accent.red' : token ? 'base.100' : 'base.200',
        mb: 0.55,
      }}
    >
      <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: dotColor }} />
      <Box component="span">{children}</Box>
    </Box>
  )
}

function TypeSpec({
  variant,
  label = variant,
}: {
  variant: TypographyProps['variant']
  label?: ReactNode
}) {
  return (
    <TooltipTypography
      variant={variant}
      component="span"
      sx={{ color: 'primary.main', fontWeight: 800 }}
    >
      {label}
    </TooltipTypography>
  )
}

function SpecCaption({ children }: { children: ReactNode }) {
  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.35 }}>{children}</Box>
}

const sampleDoc = {
  badge: 'Report',
  title: 'Workshop Report',
  img: '/images/repo/workbook.png',
  desc: 'Repository cards use a fixed media ratio, pill badge, compact title, description, and action chips.',
  actions: [{ label: 'Download', kind: 'dl' as const }],
}

const sampleReference = {
  title: 'Reference Literature Card',
  source: 'Source or publication name',
  meta: 'Authors, year, and metadata',
}

const highlightColors = [
  { label: 'Primary Green', swatch: '#7ed957' },
  { label: 'Primary Blue', swatch: '#51a2bd' },
  { label: 'Accent Blue', swatch: '#79e1e4' },
  { label: 'Accent Orange', swatch: '#f77c3b' },
  { label: 'Accent Yellow', swatch: '#f2c820' },
  { label: 'Accent Purple', swatch: '#b280ff' },
  { label: 'Accent Pink', swatch: '#ff677d' },
]

const highlightStyles: Array<{ label: string; value: HighlightStyleVariant }> = [
  { label: 'Underline', value: 'underline' },
  { label: 'Raised Underline', value: 'raisedUnderline' },
  { label: 'Soft Fill', value: 'wash' },
  { label: 'Pill', value: 'pill' },
]

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '')
  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)

  return `rgba(${red},${green},${blue},${alpha})`
}

function ComponentMeta({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ ...displayMetaSx, color: 'base.200', fontSize: '0.92rem', lineHeight: 1.5 }}>
      {children}
    </Box>
  )
}

const animatedNumberUsageSnippet = `import AnimatedNumber from '../../ui/animation/AnimatedNumber';

function ImpactMetric() {
  return <AnimatedNumber value={125000} duration={2.4} />;
}`

function CodeSnippet({ label, code }: { label: string; code: string }) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'base.800',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: theme.jtSpacing.component.sm,
          py: theme.jtSpacing.component.xs,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <TooltipTypography variant="captionSmall" component="div" sx={{ color: 'primary.main' }}>
          {label}
        </TooltipTypography>
      </Box>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: theme.jtSpacing.component.sm,
          overflowX: 'auto',
          color: 'base.100',
          fontFamily: 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace',
          fontSize: '0.82rem',
          lineHeight: 1.55,
        }}
      >
        <code>{code}</code>
      </Box>
    </Box>
  )
}

function AnimationPlayground() {
  const theme = useTheme()
  const [targetValue, setTargetValue] = useState(125000)
  const [duration, setDuration] = useState(2.4)

  const controlSx = {
    '& .MuiInputBase-root': {
      bgcolor: 'base.800',
      color: 'common.white',
      borderRadius: 1,
    },
    '& .MuiInputLabel-root': {
      color: 'base.100',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'divider',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main',
    },
  } as const

  return (
    <Box sx={displayItemSx}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.15fr 0.85fr' },
          gap: themeSafeGap,
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            minHeight: 360,
            display: 'grid',
            alignContent: 'center',
            gap: theme.jtSpacing.gap.md,
            p: { xs: theme.jtSpacing.component.md, md: theme.jtSpacing.component.lg },
            bgcolor: 'base.900',
            border: 1,
            borderColor: 'translucent.primaryGreen',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Eyebrow sx={{ mb: 1 }}>Impact metrics</Eyebrow>
            <AnimatedNumber value={targetValue} duration={duration} />
            <TooltipTypography
              variant="body2"
              sx={{ mt: 1.5, maxWidth: '48ch', color: 'base.100' }}
            >
              Use for impact metrics, scenario totals, or time-based counts where the number needs
              to feel alive without losing legibility.
            </TooltipTypography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: theme.jtSpacing.gap.md,
            alignContent: 'start',
            p: theme.jtSpacing.component.md,
            bgcolor: 'base.700',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <TooltipTypography variant="h4" component="h3">
            Controls
          </TooltipTypography>
          <TextField
            label="Target number"
            type="number"
            value={targetValue}
            onChange={(event) => setTargetValue(Number(event.target.value) || 0)}
            slotProps={{ htmlInput: { min: 0, step: 1000 } }}
            sx={controlSx}
          />
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 1 }}>
              <TooltipTypography variant="captionSmall" component="span">
                Animation speed
              </TooltipTypography>
              <TooltipTypography
                variant="captionSmall"
                component="span"
                sx={{ color: 'primary.main' }}
              >
                {duration.toFixed(1)}s
              </TooltipTypography>
            </Box>
            <Slider
              value={duration}
              min={0.4}
              max={6}
              step={0.1}
              onChange={(_, value) => setDuration(Array.isArray(value) ? value[0] : value)}
              aria-label="Animation duration"
            />
          </Box>
          <ComponentMeta>
            <StyleLine token>
              Number typography uses Hammersmith One through `var(--font-heading)`.
            </StyleLine>
            <StyleLine token>
              Motion respects reduced-motion preferences by setting the final value immediately.
            </StyleLine>
            <StyleLine custom>
              The oversized display scale and local control styling are animation-specific
              specimens.
            </StyleLine>
          </ComponentMeta>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: theme.jtSpacing.gap.md }}>
        <CodeSnippet label="Usage" code={animatedNumberUsageSnippet} />
      </Box>
    </Box>
  )
}

function ButtonSpec({
  title,
  children,
  caption,
}: {
  title: string
  children: ReactNode
  caption: ReactNode
}) {
  return (
    <Box sx={displayItemSx}>
      <TooltipTypography variant="h4" component="h3">
        {title}
      </TooltipTypography>
      <Box>{children}</Box>
      <ComponentMeta>{caption}</ComponentMeta>
    </Box>
  )
}

type SpacingModeId = 'component' | 'gap' | 'section' | 'pageX' | 'pageY'

function SpacingPlayground() {
  const theme = useTheme()
  const [modeId, setModeId] = useState<SpacingModeId>('component')
  const [token, setToken] = useState('md')

  const modes = {
    component: {
      label: 'Component Padding',
      description:
        'Inside cards, logo previews, buttons, form controls, and compact content blocks.',
      values: theme.jtSpacing.component,
      property: 'padding',
      previewLabel: 'Two cards with adjustable internal padding',
    },
    gap: {
      label: 'Layout Gap',
      description:
        'Between cards, button rows, split columns, grouped controls, and display specimens.',
      values: theme.jtSpacing.gap,
      property: 'gap',
      previewLabel: 'A small responsive grid with adjustable item gap',
    },
    section: {
      label: 'Section Rhythm',
      description: 'Vertical padding between major page sections and design-system chapters.',
      values: theme.jtSpacing.section,
      property: 'paddingBlock',
      previewLabel: 'Section text rhythm with adjustable vertical breathing room',
    },
    pageX: {
      label: 'Page Gutters',
      description: 'Horizontal page padding for wide canvases and top-level content shells.',
      values: theme.jtSpacing.page.x,
      property: 'paddingInline',
      previewLabel: 'Page shell with adjustable horizontal gutter',
    },
    pageY: {
      label: 'Page Y Rhythm',
      description: 'Top-level vertical page breathing room used by the design-system canvas.',
      values: theme.jtSpacing.page.y,
      property: 'paddingBlock',
      previewLabel: 'Page shell with adjustable vertical gutter',
    },
  } as const

  const activeMode = modes[modeId]
  const tokenNames = Object.keys(activeMode.values)
  const activeToken = tokenNames.includes(token) ? token : tokenNames[0]
  const activeValue = activeMode.values[activeToken as keyof typeof activeMode.values]
  const pixelValue = theme.spacing(activeValue)

  const choiceSx = (selected: boolean) =>
    ({
      display: 'inline-flex',
      alignItems: 'center',
      px: 1.25,
      py: 0.8,
      borderRadius: '999px',
      border: 1,
      borderColor: selected ? 'primary.main' : 'divider',
      bgcolor: selected ? 'translucent.primaryGreen' : 'transparent',
      color: selected ? 'common.white' : 'base.100',
      cursor: 'pointer',
      typography: 'eyebrow',
      lineHeight: 1,
    }) as const

  const metricSx = {
    display: 'grid',
    gap: 0.4,
    p: theme.jtSpacing.component.sm,
    borderRadius: 1,
    bgcolor: 'base.700',
    border: 1,
    borderColor: 'divider',
  } as const

  return (
    <Box sx={displayItemSx}>
      <Box sx={{ display: 'grid', gap: theme.jtSpacing.gap.sm }}>
        <TooltipTypography variant="h4" component="h3">
          Interactive Spacing Playground
        </TooltipTypography>
        <TooltipTypography variant="body2" sx={{ maxWidth: '70ch', color: 'base.100' }}>
          Choose the spacing intent and token, then inspect how that value behaves in the kind of
          layout it is meant to control.
        </TooltipTypography>
      </Box>

      <Box sx={{ display: 'grid', gap: theme.jtSpacing.gap.sm }}>
        <TooltipTypography variant="captionSmall" component="div">
          Spacing intent
        </TooltipTypography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {(Object.keys(modes) as SpacingModeId[]).map((id) => (
            <Box
              key={id}
              component="button"
              type="button"
              onClick={() => setModeId(id)}
              sx={choiceSx(modeId === id)}
            >
              {modes[id].label}
            </Box>
          ))}
        </Box>

        <TooltipTypography variant="captionSmall" component="div">
          Token
        </TooltipTypography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {tokenNames.map((name) => (
            <Box
              key={name}
              component="button"
              type="button"
              onClick={() => setToken(name)}
              sx={choiceSx(activeToken === name)}
            >
              {name}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '0.7fr 1.3fr' },
          gap: themeSafeGap,
          alignItems: 'start',
        }}
      >
        <Box sx={{ display: 'grid', gap: theme.jtSpacing.gap.sm }}>
          <Box sx={metricSx}>
            <TooltipTypography variant="captionSmall" component="div">
              Theme path
            </TooltipTypography>
            <TooltipTypography variant="body2" sx={{ color: 'common.white' }}>
              {modeId === 'pageX'
                ? `theme.jtSpacing.page.x.${activeToken}`
                : modeId === 'pageY'
                  ? `theme.jtSpacing.page.y.${activeToken}`
                  : `theme.jtSpacing.${modeId}.${activeToken}`}
            </TooltipTypography>
          </Box>
          <Box sx={metricSx}>
            <TooltipTypography variant="captionSmall" component="div">
              MUI spacing unit
            </TooltipTypography>
            <TooltipTypography variant="body2" sx={{ color: 'common.white' }}>
              {activeValue} {'->'} {pixelValue}
            </TooltipTypography>
          </Box>
          <Box sx={metricSx}>
            <TooltipTypography variant="captionSmall" component="div">
              Applied as
            </TooltipTypography>
            <TooltipTypography variant="body2" sx={{ color: 'common.white' }}>
              {activeMode.property}
            </TooltipTypography>
          </Box>
          <ComponentMeta>
            <StyleLine token>{activeMode.description}</StyleLine>
            <StyleLine token>
              Every preview uses the selected value through MUI `sx`, so numbers resolve through
              `theme.spacing(...)`.
            </StyleLine>
          </ComponentMeta>
        </Box>

        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'base.800',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: theme.jtSpacing.component.sm,
              py: theme.jtSpacing.component.xs,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <TooltipTypography variant="captionSmall" component="div">
              {activeMode.previewLabel}
            </TooltipTypography>
            <TooltipTypography
              variant="captionSmall"
              component="div"
              sx={{ color: 'primary.main' }}
            >
              {pixelValue}
            </TooltipTypography>
          </Box>
          <SpacingPreview modeId={modeId} value={activeValue} />
        </Box>
      </Box>
    </Box>
  )
}

function SpacingPreview({ modeId, value }: { modeId: SpacingModeId; value: number }) {
  const theme = useTheme()

  if (modeId === 'component') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: theme.jtSpacing.gap.md,
          p: theme.jtSpacing.component.md,
        }}
      >
        {['Scenario Card', 'Repository Card'].map((title) => (
          <Box
            key={title}
            sx={{
              p: value,
              bgcolor: 'surface',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              minHeight: 170,
            }}
          >
            <TooltipTypography variant="eyebrow" component="p" sx={{ mb: 1 }}>
              {title}
            </TooltipTypography>
            <TooltipTypography variant="h4" component="h4" sx={{ mb: 1 }}>
              Content breathes from the edge.
            </TooltipTypography>
            <TooltipTypography variant="body2" sx={{ color: 'base.100' }}>
              This dummy card applies the selected value to padding.
            </TooltipTypography>
          </Box>
        ))}
      </Box>
    )
  }

  if (modeId === 'gap') {
    return (
      <Box sx={{ p: theme.jtSpacing.component.md }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: value,
          }}
        >
          {['Map', 'Data', 'Scenario', 'Action'].map((label) => (
            <Box
              key={label}
              sx={{
                minHeight: 96,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'surface',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <TooltipTypography variant="h4" component="div">
                {label}
              </TooltipTypography>
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  if (modeId === 'section') {
    return (
      <Box
        component="section"
        sx={{ py: value, px: theme.jtSpacing.component.md, bgcolor: 'base.700' }}
      >
        <Box sx={{ maxWidth: 680, mx: 'auto' }}>
          <Eyebrow sx={{ mb: theme.jtSpacing.component.sm }}>Section Rhythm</Eyebrow>
          <TooltipTypography variant="h2" component="h3" sx={{ mb: theme.jtSpacing.component.sm }}>
            Major page sections need room to land.
          </TooltipTypography>
          <TooltipTypography variant="body1" sx={{ color: 'base.100' }}>
            This preview applies the selected value to vertical section padding.
          </TooltipTypography>
        </Box>
      </Box>
    )
  }

  if (modeId === 'pageX') {
    return (
      <Box sx={{ px: value, py: theme.jtSpacing.component.md, bgcolor: 'base.700' }}>
        <Box
          sx={{
            p: theme.jtSpacing.component.md,
            bgcolor: 'surface',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <TooltipTypography variant="h4" component="h3">
            Constrained Page Content
          </TooltipTypography>
          <TooltipTypography variant="body2" sx={{ color: 'base.100' }}>
            The outer shell applies the selected token to horizontal gutters.
          </TooltipTypography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ px: theme.jtSpacing.component.md, py: value, bgcolor: 'base.700' }}>
      <Box
        sx={{
          p: theme.jtSpacing.component.md,
          bgcolor: 'surface',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <TooltipTypography variant="h4" component="h3">
          Design-System Canvas
        </TooltipTypography>
        <TooltipTypography variant="body2" sx={{ color: 'base.100' }}>
          The outer shell applies the selected token to vertical page rhythm.
        </TooltipTypography>
      </Box>
    </Box>
  )
}

function CardRow({
  title,
  children,
  caption,
}: {
  title?: string
  children: ReactNode
  caption: ReactNode
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(280px, 0.85fr)' },
        gap: themeSafeGap,
        alignItems: 'start',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        {title && (
          <TooltipTypography
            variant="eyebrow"
            component="p"
            sx={{ color: 'primary.main', mb: 1.4 }}
          >
            {title}
          </TooltipTypography>
        )}
        {children}
      </Box>
      <ComponentMeta>{caption}</ComponentMeta>
    </Box>
  )
}

function ScenarioPathwayCardSpec() {
  const accent = '#b280ff'
  const scenarioChoiceSx = {
    justifyContent: 'stretch',
    borderColor: 'base.300',
    color: 'common.white',
    bgcolor: 'transparent',
    py: 1.1,
    px: 2.1,
    width: '100%',
    '& .condition-choice': {
      display: 'grid',
      gridTemplateColumns: '24px minmax(0, 1fr) 20px',
      alignItems: 'center',
      gap: 1.15,
      width: '100%',
      textAlign: 'left',
    },
    '& .condition-choice-icon': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'primary.main',
    },
    '& .condition-choice-arrow': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'base.100',
    },
    '&:hover': {
      borderColor: 'primary.main',
      bgcolor: 'translucent.primaryGreen',
    },
  } as const

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: '180px 1fr',
        minHeight: 390,
        border: '2px solid',
        borderColor: `${accent}66`,
        borderRadius: 2,
        bgcolor: 'rgba(20,29,31,0.74)',
        overflow: 'hidden',
        backdropFilter: 'blur(14px)',
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box
          component="img"
          src={assetUrl('/images/scenarios/calling-on-reserves.jpg')}
          alt=""
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(16,22,24,0.04), rgba(16,22,24,0.72))',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: 18,
            bottom: 16,
            width: 48,
            height: 4,
            bgcolor: accent,
            boxShadow: `0 0 18px ${accent}`,
          }}
        />
      </Box>
      <Stack spacing={2} sx={{ p: themeSafeGap }}>
        <TooltipTypography variant="h4" component="h3">
          Calling on Reserves
        </TooltipTypography>
        <TooltipTypography variant="body2" sx={{ color: 'base.100' }}>
          Scenario pathway cards pair a clear image, accent rail, short copy, and condition choices.
        </TooltipTypography>
        <Stack spacing={1.1} sx={{ mt: 'auto' }}>
          {[
            { label: 'Current weather', icon: 'sun' as const },
            { label: 'Sea level rise', icon: 'waves' as const },
          ].map((item) => (
            <Button key={item.label} variant="outlined" sx={scenarioChoiceSx}>
              <Box component="span" className="condition-choice">
                <Box component="span" className="condition-choice-icon">
                  <Icon name={item.icon} size={20} />
                </Box>
                <Box component="span">{item.label}</Box>
                <Box component="span" className="condition-choice-arrow">
                  <Icon name="arrow-right" size={18} />
                </Box>
              </Box>
            </Button>
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}

function SpacingMetrics({
  elementRef,
  showPixels,
}: {
  elementRef: React.RefObject<HTMLDivElement | null>
  showPixels: boolean
}) {
  const spacing = useComputedSpacing(elementRef)
  const purple = '#b280ff'

  return (
    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Top center - padding top */}
      {showPixels && spacing.pt && spacing.pt !== '0px' && (
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            left: '50%',
            transform: 'translateX(-50%)',
            color: purple,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {spacing.pt}
        </Box>
      )}

      {/* Left center - padding left */}
      {showPixels && spacing.pl && spacing.pl !== '0px' && (
        <Box
          sx={{
            position: 'absolute',
            left: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            color: purple,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {spacing.pl}
        </Box>
      )}

      {/* Top-right - margin-top */}
      {showPixels && spacing.mt && spacing.mt !== '0px' && (
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 6,
            color: purple,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {spacing.mt}
        </Box>
      )}

      {/* Bottom-right - margin-bottom */}
      {showPixels && spacing.mb && spacing.mb !== '0px' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 4,
            right: 6,
            color: purple,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {spacing.mb}
        </Box>
      )}
    </Box>
  )
}

export default function DesignSystem() {
  // Design system uses the theme's dark brand palette by default

  const theme = useTheme()
  const [showSpacingGuides, setShowSpacingGuides] = useState(false)
  const [showSpacingPixels, setShowSpacingPixels] = useState(true)
  const [highlightSwatch, setHighlightSwatch] = useState(highlightColors[0].swatch)
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyleVariant>('underline')
  const highlightVibrancyOptions = [
    { label: 'Subtle', alpha: theme.highlighter.vibrancy.subtle },
    { label: 'Balanced', alpha: theme.highlighter.vibrancy.balanced },
    { label: 'Vibrant', alpha: theme.highlighter.vibrancy.vibrant },
  ]
  const [highlightVibrancy, setHighlightVibrancy] = useState<number>(
    theme.highlighter.vibrancy.balanced,
  )

  // Refs for measuring actual computed spacing
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const logoSectionRef = useRef<HTMLDivElement>(null)
  const colorSectionRef = useRef<HTMLDivElement>(null)

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
      <Box
        ref={mainContainerRef}
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          px: theme.jtSpacing.page.x.sm,
          my: theme.jtSpacing.page.y.md,
        }}
      >
        {showSpacingGuides && (
          <SpacingMetrics elementRef={mainContainerRef} showPixels={showSpacingPixels} />
        )}
        <Box
          ref={headerRef}
          sx={{
            py: theme.jtSpacing.section.md,
            px: theme.jtSpacing.component.md,
            ...(guideSx ?? {}),
          }}
        >
          {showSpacingGuides && (
            <SpacingMetrics elementRef={headerRef} showPixels={showSpacingPixels} />
          )}
          <TooltipTypography variant="h1" component="h1">
            Just Transition Website Design System
          </TooltipTypography>
        </Box>

        <Box
          ref={controlsRef}
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: theme.jtSpacing.gap.md,
            py: theme.jtSpacing.component.sm,
            px: theme.jtSpacing.component.md,
            ...(guideSx ?? {}),
          }}
        >
          {showSpacingGuides && (
            <SpacingMetrics elementRef={controlsRef} showPixels={showSpacingPixels} />
          )}
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
                {showSpacingPixels
                  ? 'Pixel values on (debug in progress)'
                  : 'Pixel values off (debug in progress)'}
              </TooltipTypography>
            }
          />
        </Box>

        <Box
          sx={{
            py: theme.jtSpacing.section.xs,
            px: theme.jtSpacing.component.md,
            ...(guideSx ?? {}),
          }}
        >
          <TooltipTypography variant="body1">
            To see how spacing changes at different breakpoints, resize the browser window or use
            developer tools.
          </TooltipTypography>
        </Box>

        <DesignSection
          id="logo"
          title="Logo"
          sectionRef={logoSectionRef}
          guideSx={guideSx}
          metrics={
            showSpacingGuides && (
              <SpacingMetrics elementRef={logoSectionRef} showPixels={showSpacingPixels} />
            )
          }
          explanation={
            <>
              <TooltipTypography variant="body1">
                The production logo is a responsive text wordmark that echoes the source ArcGIS
                header while fitting the new sticky MUI navbar.
              </TooltipTypography>
              <ComponentMeta>
                <StyleLine token>
                  Logo text uses the MUI `logo` typography variant with viewport-specific fit
                  sizing.
                </StyleLine>
                <StyleLine token>
                  Logo color uses primary.main and nav placement uses the shared Navbar/AppBar
                  shell.
                </StyleLine>
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
          metrics={
            showSpacingGuides && (
              <SpacingMetrics elementRef={colorSectionRef} showPixels={showSpacingPixels} />
            )
          }
          explanation={
            <>
              <TooltipTypography variant="body1">
                MUI theme palette colors for the Just Transitions website.
              </TooltipTypography>
              <TooltipTypography variant="body1">
                Any colors used in UI components need to pass color contrast accessibility
                guidelines (AA and AAA).
              </TooltipTypography>
              <TooltipTypography variant="body1">
                Any colors used in visualizations and maps need to pass color contrast and blindness
                checks.
              </TooltipTypography>
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
              <TooltipTypography variant="body1">
                {'Heading \u2014 Hammersmith One'}
              </TooltipTypography>
              <TooltipTypography variant="body1">{'Body \u2014 Proxima Nova'}</TooltipTypography>
              <TooltipTypography variant="body1">
                Specs format: font-size / font-weight / line-height / font-family
              </TooltipTypography>
              <TooltipTypography variant="body2" sx={{ color: 'accent.red', mt: 1 }}>
                Red notes in this design system identify styles that are not currently expressed as
                MUI theme tokens.
              </TooltipTypography>
            </>
          }
        >
          <TypographyContent guideSx={guideSx} />
        </DesignSection>

        <DesignSection
          id="numbering"
          eyebrow="Components"
          title="Numbering Systems"
          guideSx={guideSx}
        >
          <UsageNote>
            Current numbering appears in several visual roles across the website. These standalone
            specimens are backed by MUI typography variants plus `theme.numbering` layout tokens,
            and keep the green left accent because they are not inside a group container.
          </UsageNote>
          <NumberingContent />
        </DesignSection>

        <DesignSection id="animation" eyebrow="Components" title="Animation" guideSx={guideSx}>
          <UsageNote>
            Motion specimens document reusable animation behavior for values that should update with
            a clear sense of change. This counter uses Framer Motion values for the numeric
            interpolation and Hammersmith One for the display typography.
          </UsageNote>
          <AnimationPlayground />
        </DesignSection>

        <DesignSection id="spacing" eyebrow="Foundations" title="Spacing System" guideSx={guideSx}>
          <UsageNote>
            Spacing is split by intent: component padding for inside controls/cards, gap for layout
            relationships, section padding for vertical page rhythm, and page gutters for full-page
            shells.
          </UsageNote>
          <SpacingPlayground />
        </DesignSection>

        <DesignSection
          id="sections"
          eyebrow="Foundations"
          title="Section Styling"
          guideSx={guideSx}
        >
          <UsageNote>
            Current sections are styled as full-width bands with constrained content, section heads,
            and optional dark/blue backgrounds.
          </UsageNote>
          <Stack spacing={theme.jtSpacing.gap.lg}>
            <CardRow
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Outer element is `component="section"` with `jtSpacing.section` vertical rhythm.
                  </StyleLine>
                  <StyleLine token>
                    Constrained content uses a `Container maxWidth="lg"` and themed gutters.
                  </StyleLine>
                  <StyleLine token>
                    SectionHead uses the MUI `eyebrow` typography variant plus MUI h2.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <Box
                component="section"
                sx={{
                  py: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.xl },
                  bgcolor: 'base.600',
                  border: '1px solid',
                  borderColor: 'border.subtle',
                }}
              >
                <Box
                  sx={{
                    maxWidth: 720,
                    mx: 'auto',
                    px: { xs: theme.jtSpacing.component.md, md: theme.jtSpacing.gap.xl },
                  }}
                >
                  <Eyebrow sx={{ mb: theme.jtSpacing.component.sm }}>Methodology</Eyebrow>
                  <TooltipTypography variant="h2" component="h3">
                    Our Approach
                  </TooltipTypography>
                </Box>
              </Box>
            </CardRow>
          </Stack>
        </DesignSection>

        <DesignSection id="buttons" eyebrow="Components" title="Buttons" guideSx={guideSx}>
          <UsageNote>
            Button styles currently used in the repo include global MUI contained/outlined buttons,
            navbar menu buttons, disabled CTAs, text-style disclosure buttons, and repository action
            pills.
          </UsageNote>
          <Stack spacing={theme.jtSpacing.gap.lg}>
            <ButtonSpec
              title="Primary + Outline CTA"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Used by HeroMap, Our Approach, Resources, and landing CTAs.
                  </StyleLine>
                  <StyleLine token>
                    Typography uses `theme.typography.button`: Hammersmith One, 300, uppercase,
                    0.08em tracking, 1.15rem.
                  </StyleLine>
                  <StyleLine token>
                    Shape, padding, disabled state, and hover lift come from `MuiButton` theme
                    overrides.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                <Button variant="contained" color="primary">
                  Primary action
                </Button>
                <Button variant="outlined" color="primary">
                  Outline action
                </Button>
                <Button variant="contained" color="primary" disabled>
                  Disabled primary
                </Button>
                <Button variant="outlined" color="primary" disabled>
                  Disabled outline
                </Button>
              </Stack>
            </ButtonSpec>
            <ButtonSpec
              title="Secondary Color CTA"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Uses the same global MUI button typography, radius, spacing, disabled state, and
                    hover behavior.
                  </StyleLine>
                  <StyleLine token>
                    Color comes from the secondary palette: primary blue family.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                <Button variant="contained" color="secondary">
                  Secondary
                </Button>
                <Button variant="outlined" color="secondary">
                  Secondary outline
                </Button>
                <Button variant="contained" color="secondary" disabled>
                  Disabled secondary
                </Button>
                <Button variant="outlined" color="secondary" disabled>
                  Disabled outline
                </Button>
              </Stack>
            </ButtonSpec>
            <ButtonSpec
              title="Navbar Buttons"
              caption={
                <SpecCaption>
                  <StyleLine token>Top-level nav buttons inherit MUI button typography.</StyleLine>
                  <StyleLine token>
                    Dropdown and mobile drawer accents use primary.main; captions use the
                    captionSmall typography variant and base.100.
                  </StyleLine>
                  <StyleLine token>
                    Desktop button width, active state, panel backgrounds, borders, and shadows use
                    `theme.navigation`.
                  </StyleLine>
                  <StyleLine custom>
                    Dropdown link markers and blur intensity remain local to the navigation
                    component.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                  <Button
                    sx={{ minWidth: theme.navigation.desktopButtonMinWidth, color: 'common.white' }}
                    endIcon={<Icon name="chevron-down" size={16} />}
                  >
                    Repository
                  </Button>
                  <Button
                    sx={{
                      minWidth: theme.navigation.desktopButtonMinWidth,
                      color: 'common.white',
                      border: theme.navigation.activeBorder,
                      bgcolor: theme.navigation.activeBackground,
                    }}
                    endIcon={<Icon name="chevron-down" size={16} />}
                  >
                    Related Projects
                  </Button>
                  <Button disabled sx={{ minWidth: theme.navigation.desktopButtonMinWidth }}>
                    Scenarios
                  </Button>
                </Stack>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'minmax(280px, 380px) minmax(260px, 340px)',
                    },
                    gap: 2,
                    alignItems: 'start',
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: theme.navigation.menuPanelBackground,
                      border: theme.navigation.panelBorder,
                      borderRadius: 'var(--mui-shape-borderRadius)',
                      boxShadow: theme.navigation.dropdownShadow,
                      p: 1,
                    }}
                  >
                    <Box sx={{ px: 1.5, pt: 1, pb: 1 }}>
                      <TooltipTypography variant="eyebrow" component="p" sx={{ mb: 0.75 }}>
                        Explore
                      </TooltipTypography>
                      <TooltipTypography
                        variant="captionSmall"
                        component="p"
                        sx={{ color: 'base.100', lineHeight: 1.45, maxWidth: 280 }}
                      >
                        Browse reports, learning materials, and project resources.
                      </TooltipTypography>
                      <Box
                        sx={{
                          mt: 1.25,
                          height: 2,
                          width: 56,
                          bgcolor: 'primary.main',
                          borderRadius: 999,
                        }}
                      />
                    </Box>
                    {[
                      'Project Documentation & Reports',
                      'Service Learning & Education',
                      'References & Resources',
                    ].map((item) => (
                      <Box
                        key={item}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.25,
                          mx: 0.5,
                          my: 0.5,
                          px: 1.25,
                          py: 1.1,
                          borderRadius: 'var(--mui-shape-borderRadius)',
                          border: '1px solid transparent',
                          color: 'common.white',
                          '&:hover': {
                            bgcolor: 'translucent.primaryGreen',
                            borderColor: 'translucent.primaryGreen',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 3,
                            height: 22,
                            mt: 0.1,
                            borderRadius: 999,
                            bgcolor: 'primary.main',
                            opacity: 0.72,
                            flex: 'none',
                          }}
                        />
                        <TooltipTypography
                          component="div"
                          variant="navigationLabel"
                          sx={{ lineHeight: 1.25 }}
                        >
                          {item}
                        </TooltipTypography>
                      </Box>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      bgcolor: theme.navigation.drawerPanelBackground,
                      border: theme.navigation.panelBorder,
                      borderRadius: 'var(--mui-shape-borderRadius)',
                      boxShadow: theme.navigation.drawerShadow,
                      p: 1.5,
                    }}
                  >
                    <Box sx={{ mb: 1.5 }}>
                      <TooltipTypography
                        variant="h4"
                        component="h3"
                        sx={{ color: 'common.white', lineHeight: 1.12 }}
                      >
                        Menu
                      </TooltipTypography>
                    </Box>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          borderRadius: 'var(--mui-shape-borderRadius)',
                          border: 1,
                          borderColor: 'translucent.primaryGreen',
                          bgcolor: 'translucent.primaryGreen',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            px: 1.5,
                            py: 1.25,
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Box
                              sx={{
                                color: 'common.white',
                                fontWeight: 800,
                                letterSpacing: '0.015em',
                                lineHeight: 1.25,
                              }}
                            >
                              Repository
                            </Box>
                            <TooltipTypography
                              variant="captionSmall"
                              component="p"
                              sx={{ color: 'base.100', mt: 0.45, lineHeight: 1.45 }}
                            >
                              Browse reports, learning materials, and project resources.
                            </TooltipTypography>
                          </Box>
                          <Icon name="chevron-down" size={18} />
                        </Box>
                        <Box
                          sx={{
                            mx: 1,
                            mb: 1,
                            pt: 0.75,
                            borderTop: '1px solid',
                            borderColor: 'border.subtle',
                          }}
                        >
                          <TooltipTypography
                            variant="eyebrow"
                            component="p"
                            sx={{ px: 1.25, pt: 0.7, pb: 0.25 }}
                          >
                            Explore
                          </TooltipTypography>
                          {[
                            'Project Documentation & Reports',
                            'Service Learning & Education',
                            'References & Resources',
                          ].map((item) => (
                            <Box
                              key={item}
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                px: 1.25,
                                py: 1,
                                borderRadius: 'var(--mui-shape-borderRadius)',
                                color: 'common.white',
                              }}
                            >
                              <Box
                                sx={{
                                  width: 3,
                                  height: 22,
                                  mt: 0.25,
                                  mr: 1.1,
                                  borderRadius: 999,
                                  bgcolor: 'primary.main',
                                  opacity: 0.72,
                                  flex: 'none',
                                }}
                              />
                              <Box
                                sx={{ fontWeight: 800, letterSpacing: '0.015em', lineHeight: 1.25 }}
                              >
                                {item}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          borderRadius: 'var(--mui-shape-borderRadius)',
                          border: '1px solid rgba(155,162,164,0.18)',
                          bgcolor: 'rgba(81,93,97,0.22)',
                          px: 1.5,
                          py: 1.25,
                          color: 'common.white',
                          fontWeight: 800,
                          letterSpacing: '0.015em',
                        }}
                      >
                        Repository
                      </Box>
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
                  <StyleLine custom>
                    Typography is custom Hammersmith One, uppercase, 0.95rem, 0.08em tracking
                    instead of MUI button.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <Box
                component="button"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: '0.95rem',
                  color: 'primary.main',
                }}
              >
                Read more <Icon name="chevron-down" size={16} />
              </Box>
            </ButtonSpec>
            <ButtonSpec
              title="Repository Action Pill"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Main action color uses primary.main; ghost text uses secondary.light.
                  </StyleLine>
                  <StyleLine custom>
                    Typography, border width, padding, radius, and hover transitions are custom in
                    `ResourceReportCard`.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <Stack direction="row" spacing={1.2} sx={{ flexWrap: 'wrap' }}>
                <Box
                  component="a"
                  href="#"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontFamily: 'var(--font-heading)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontSize: '0.85rem',
                    px: '1.1rem',
                    py: '0.62rem',
                    borderRadius: '999px',
                    border: '1.5px solid',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                  }}
                >
                  Download <Icon name="arrow-down" size={15} />
                </Box>
                <Box
                  component="a"
                  href="#"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontFamily: 'var(--font-heading)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontSize: '0.85rem',
                    px: '1.1rem',
                    py: '0.62rem',
                    borderRadius: '999px',
                    border: '1.5px solid rgba(155,162,164,0.4)',
                    color: 'secondary.light',
                  }}
                >
                  View <Icon name="arrow-up-right" size={15} />
                </Box>
              </Stack>
            </ButtonSpec>
          </Stack>
        </DesignSection>

        <DesignSection id="chips" eyebrow="Components" title="Chips and Badges" guideSx={guideSx}>
          <UsageNote>
            Chips are non-navigation labels used in repository badges, scenario labels, and
            map/status legends.
          </UsageNote>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: theme.jtSpacing.gap.lg,
            }}
          >
            <ButtonSpec
              title="Repository Badge"
              caption={
                <SpecCaption>
                  <StyleLine token>Text color uses primary.main.</StyleLine>
                  <StyleLine custom>
                    Dark alpha background, green alpha border, 0.68rem type, tracking, and pill
                    radius are custom.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: 'base.800',
                  border: 1,
                  borderColor: 'translucent.primaryGreen',
                  color: 'primary.main',
                  fontFamily: 'var(--font-heading)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: '0.68rem',
                  px: '0.7rem',
                  py: '0.36rem',
                  borderRadius: '999px',
                }}
              >
                Design Studio
              </Box>
            </ButtonSpec>
            <ButtonSpec
              title="Scenario Label"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Text uses the eyebrow typography style and primary.main color.
                  </StyleLine>
                  <StyleLine custom>
                    The scenario card uses a local translucent green background and full-green
                    border.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  mb: 1.5,
                  px: 1.1,
                  py: 0.55,
                  border: 1,
                  borderColor: 'primary.main',
                  bgcolor: 'translucent.primaryGreen',
                  color: 'primary.main',
                  typography: 'eyebrow',
                  lineHeight: 1,
                }}
              >
                Business as Usual
              </Box>
            </ButtonSpec>
          </Box>
        </DesignSection>

        <DesignSection id="cards" eyebrow="Components" title="Cards" guideSx={guideSx}>
          <UsageNote>
            These are the card and card-like containers currently present across the repo. Each row
            shows the example on the left and typography plus palette usage on the right.
          </UsageNote>
          <Stack spacing={theme.jtSpacing.gap.lg}>
            <CardRow
              title="Simple Card"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Typography: number <TypeSpec variant="numberGhost" />, title{' '}
                    <TypeSpec variant="h3" />, body <TypeSpec variant="body2" />.
                  </StyleLine>
                  <StyleLine token>
                    Surface uses palette surface; radius uses MUI shape radius.
                  </StyleLine>
                  <StyleLine custom>Number styling and border rgba are custom.</StyleLine>
                </SpecCaption>
              }
            >
              <SimpleCard
                number="01"
                icon={<Icon name="compass" size={28} stroke="var(--mui-palette-primary-main)" />}
                title="Landing Foundation Card"
                body="Used by Foundations and mirrored by Stakes cards with translucent surface, quiet border, and compact padding."
              />
            </CardRow>
            <CardRow
              title="Accent Plate Card"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Direction 2 from the brainstorm: solid header uses primary.main; body uses
                    base.700.
                  </StyleLine>
                  <StyleLine token>
                    Typography: eyebrow <TypeSpec variant="eyebrow" />, lead{' '}
                    <TypeSpec variant="body1" />, body <TypeSpec variant="body2" />.
                  </StyleLine>
                  <StyleLine token>
                    Spacing uses theme.jtSpacing component and gap values; radius derives from
                    theme.shape.
                  </StyleLine>
                  <StyleLine custom>
                    Header title, corner number, and elevation shadow preserve the brainstorm
                    structure.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <AccentPlateCard
                eyebrow="Foundations"
                number="01"
                title="What Are Scenarios?"
                lead="Scenarios are models and depictions of possible futures and the pathways through which they could manifest."
                body='Participatory scenario planning is a "bottom up" approach that involves working directly with public contributors to create and evaluate future scenarios for a particular place.'
              />
            </CardRow>
            <CardRow
              title="Notch Tab Card"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Direction 4 from the brainstorm: tab and top border use primary.main; card body
                    uses base.700.
                  </StyleLine>
                  <StyleLine token>
                    Typography: eyebrow <TypeSpec variant="eyebrow" />, title{' '}
                    <TypeSpec variant="h3" />, lead <TypeSpec variant="body1" />, body{' '}
                    <TypeSpec variant="body2" />.
                  </StyleLine>
                  <StyleLine custom>
                    The protruding file-folder tab, mixed corner radii, and shadow are
                    component-local.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <NotchTabCard
                eyebrow="Foundations"
                number="01"
                title="What Are Scenarios?"
                icon={<Icon name="compass" size={30} />}
                lead="Scenarios are models and depictions of possible futures and the pathways through which they could manifest."
                body='Participatory scenario planning is a "bottom up" approach that involves working directly with public contributors to create and evaluate future scenarios for a particular place.'
              />
            </CardRow>
            <CardRow
              title="Split Rail Card"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Direction 5 from the brainstorm: rail uses base.900, content panel uses
                    base.500, accent uses primary.main.
                  </StyleLine>
                  <StyleLine token>
                    Typography: title <TypeSpec variant="h3" />, lead <TypeSpec variant="body1" />,
                    body <TypeSpec variant="body2" />.
                  </StyleLine>
                  <StyleLine token>
                    Spacing, radius, and responsive rail dimensions are driven by the MUI theme.
                  </StyleLine>
                  <StyleLine custom>
                    Rail number, vertical label orientation, and strong internal division are
                    component-local behavior.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <SplitRailCard
                eyebrow="Foundations"
                number="01"
                title="What Are Scenarios?"
                icon={<Icon name="compass" size={40} />}
                lead="Scenarios are models and depictions of possible futures and the pathways through which they could manifest."
                body='Participatory scenario planning is a "bottom up" approach that involves working directly with public contributors to create and evaluate future scenarios for a particular place.'
              />
            </CardRow>
            <CardRow
              title="Resource Report Card"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Palette: surface, base.700, primary.main, base.700 contrast, secondary.light.
                  </StyleLine>
                  <StyleLine token>
                    Typography intent: badge <TypeSpec variant="eyebrow" />, title{' '}
                    <TypeSpec variant="h4" />, description <TypeSpec variant="body2" />.
                  </StyleLine>
                  <StyleLine custom>
                    Badge alpha background/border, title restyle, action pill styles, and hover
                    shadow are custom.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <ResourceReportCard
                badge={sampleDoc.badge}
                title={sampleDoc.title}
                image={sampleDoc.img}
                description={sampleDoc.desc}
                actions={sampleDoc.actions.map((action) => ({
                  label: action.label,
                  kind: action.kind === 'dl' ? 'download' : 'view',
                }))}
              />
            </CardRow>
            <CardRow
              title="Reference Card"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Palette: surface, surfaceStrong, secondary.main, primary.main, common.white,
                    base.200.
                  </StyleLine>
                  <StyleLine token>
                    Typography intent: title <TypeSpec variant="h4" />, source{' '}
                    <TypeSpec variant="h5" />, metadata <TypeSpec variant="captionSmall" />.
                  </StyleLine>
                  <StyleLine custom>
                    Title/source/meta font sizes and 10px radius are custom.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <ReferenceCard r={sampleReference} />
            </CardRow>
            <CardRow
              title="Article Accordion Card"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Palette: surface, primary.main, secondary.main, common.white, base.200.
                  </StyleLine>
                  <StyleLine token>
                    Typography intent: index <TypeSpec variant="numberArticle" />, title{' '}
                    <TypeSpec variant="h4" />, metadata <TypeSpec variant="captionSmall" />, kicker{' '}
                    <TypeSpec variant="eyebrow" />, abstract <TypeSpec variant="body2" />.
                  </StyleLine>
                  <StyleLine custom>
                    Text sizing, alpha borders, and expand icon sizing are custom.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <ArticleAccordionCard
                number="01"
                title="Article Accordion Card"
                source="Source label"
                meta="Metadata line"
              >
                Expandable article text appears below the button row.
              </ArticleAccordionCard>
            </CardRow>
            <CardRow
              title="Studio Feature Card"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Palette: primary.main, secondary.light, base.700; radius uses MUI shape radius
                    on image.
                  </StyleLine>
                  <StyleLine token>
                    Typography: number <TypeSpec variant="numberGhost" />, title{' '}
                    <TypeSpec variant="h3" />, body <TypeSpec variant="body1" />.
                  </StyleLine>
                  <StyleLine custom>
                    Row borders, badge, place label, and description sizing are custom.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <StudioFeatureCard
                number="01"
                title="Studio Feature Row"
                image="/images/repo/studio-isleton.png"
                imageAlt="Studio card specimen"
                body="Rows alternate image and text columns on desktop, then stack naturally on mobile."
              />
            </CardRow>
          </Stack>
        </DesignSection>

        <DesignSection
          id="scenario-data"
          eyebrow="Components"
          title="Scenario and Data Views"
          guideSx={guideSx}
        >
          <UsageNote>
            Current scenario and data screens use glass panels, image-led scenario cards, outflow
            variation panels, timeline controls, map overlays, and Kelp inspection controls. These
            specimens document the active implementation patterns.
          </UsageNote>
          <Stack spacing={theme.jtSpacing.gap.lg}>
            <CardRow
              title="Scenario Pathway Card"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Scenario card typography uses h4/body2/button variants and the active accent
                    palette.
                  </StyleLine>
                  <StyleLine token>
                    Image paths use `assetUrl`; radius uses the shared MUI shape token.
                  </StyleLine>
                  <StyleLine custom>
                    Glass panel alpha backgrounds, image gradient overlay, and accent glow are local
                    scenario styles.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <ScenarioPathwayCardSpec />
            </CardRow>
            <CardRow
              title="Side Glow Card"
              caption={
                <SpecCaption>
                  <StyleLine token>
                    Number uses `numberGhost`; label uses `eyebrow`; body uses body2/base.100.
                  </StyleLine>
                  <StyleLine token>
                    Typography: number <TypeSpec variant="numberGhost" />, title{' '}
                    <TypeSpec variant="h4" />, label <TypeSpec variant="eyebrow" />, body{' '}
                    <TypeSpec variant="body2" />.
                  </StyleLine>
                  <StyleLine custom>
                    Square glass panel border, left status bar, and glow values are scenario-local.
                  </StyleLine>
                </SpecCaption>
              }
            >
              <SideGlowCard
                number="02"
                title="More Delta outflow"
                label="Variation I"
                body="Outflow cards use an intentionally square glass panel with a left status bar and scenario-specific accent."
              />
            </CardRow>
          </Stack>
        </DesignSection>

        <DesignSection
          id="highlight"
          eyebrow="Components"
          title="Inline Highlighter"
          guideSx={guideSx}
        >
          <UsageNote>
            The highlighter is a semantic mark with style variants and theme-backed vibrancy levels.
            Use the accent hue control to test approved palette colors without changing the
            underlying emphasis pattern.
          </UsageNote>
          <Box sx={displayItemSx}>
            <Box sx={{ display: 'grid', gap: theme.jtSpacing.gap.sm }}>
              <TooltipTypography variant="captionSmall" component="div">
                Style
              </TooltipTypography>
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

              <TooltipTypography variant="captionSmall" component="div">
                Vibrancy
              </TooltipTypography>
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
                      bgcolor:
                        highlightVibrancy === option.alpha
                          ? hexToRgba(highlightSwatch, 0.16)
                          : 'transparent',
                      color: highlightVibrancy === option.alpha ? 'common.white' : 'base.100',
                      cursor: 'pointer',
                      typography: 'eyebrow',
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 10,
                        borderRadius: 999,
                        bgcolor: hexToRgba(highlightSwatch, option.alpha),
                        border: 1,
                        borderColor: 'divider',
                      }}
                    />
                    {option.label}
                  </Box>
                ))}
              </Box>

              <TooltipTypography variant="captionSmall" component="div">
                Accent hue
              </TooltipTypography>
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
                      bgcolor:
                        highlightSwatch === c.swatch ? hexToRgba(c.swatch, 0.12) : 'transparent',
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
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: '1rem 2rem',
                maxWidth: 1080,
              }}
            >
              {[
                [
                  '01',
                  <>
                    Who{' '}
                    <Hl color={activeHighlightColor} styleVariant={highlightStyle}>
                      benefits
                    </Hl>
                    , and who carries the{' '}
                    <Hl color={activeHighlightColor} styleVariant={highlightStyle}>
                      tradeoffs
                    </Hl>
                    ?
                  </>,
                ],
                [
                  '02',
                  <>
                    How do{' '}
                    <Hl color={activeHighlightColor} styleVariant={highlightStyle}>
                      social and ecological needs
                    </Hl>{' '}
                    shift across scenarios?
                  </>,
                ],
                [
                  '03',
                  <>
                    How can these scenarios support a{' '}
                    <Hl color={activeHighlightColor} styleVariant={highlightStyle}>
                      just transition
                    </Hl>
                    ?
                  </>,
                ],
                [
                  '04',
                  <>Use highlights for exact phrases, then let plain body text do the rest.</>,
                ],
              ].map(([n, text]) => (
                <TooltipTypography
                  key={String(n)}
                  component="p"
                  sx={{
                    m: 0,
                    display: 'grid',
                    gridTemplateColumns: theme.numbering.grid.inlineTemplate,
                    gap: theme.numbering.grid.inlineGap,
                    alignItems: 'baseline',
                    color: 'base.100',
                    fontSize: '1.1rem',
                    lineHeight: 1.55,
                  }}
                >
                  <TooltipTypography variant="numberArticle" component="span" aria-hidden>
                    {n}
                  </TooltipTypography>
                  <Box component="span">{text}</Box>
                </TooltipTypography>
              ))}
            </Box>
            <ComponentMeta>
              <StyleLine token>
                Color choices come from brand primary green, brand primary blue, and every color in
                the accent palette.
              </StyleLine>
              <StyleLine token>
                Vibrancy controls use `theme.highlighter.vibrancy` alpha values while keeping the
                palette hue fixed.
              </StyleLine>
              <StyleLine token>
                Raised underline keeps the underline behavior but shifts the color band upward for
                tighter text alignment.
              </StyleLine>
              <StyleLine custom>
                The color-choice controls are custom pills; they are not MUI Buttons or Chips yet.
              </StyleLine>
            </ComponentMeta>
          </Box>
        </DesignSection>
      </Box>
      <NavRail items={DESIGN_SECTIONS} ariaLabel="Design system section navigation" />
    </>
  )
}
