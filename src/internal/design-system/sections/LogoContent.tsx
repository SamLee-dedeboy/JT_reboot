import {
  Box,
  Stack,
  useMediaQuery,
  useTheme,
  type SxProps,
  type Theme,
  type TypographyProps,
} from '@mui/material'
import { useRef, type ComponentType, type RefObject } from 'react'
import { LogoWordmark, type LogoVariant } from '../../../ui/Logo'
import { displayItemSx } from '../common/displayStyles'
import { jtSpacing } from '../../../theme/index'

const logoVariants: Array<{ key: LogoVariant; label: string }> = [
  { key: 'mobile', label: 'Mobile' },
  { key: 'tablet', label: 'Tablet' },
  { key: 'desktop', label: 'Desktop' },
]

type LogoContentProps = {
  guideSx?: SxProps<Theme>
  showSpacingGuides: boolean
  showSpacingPixels: boolean
  SpacingMetrics: ComponentType<{
    elementRef: RefObject<HTMLDivElement | null>
    showPixels: boolean
  }>
  tooltipTypography: ComponentType<TypographyProps>
}

function LogoVariantPreview({
  variant,
  showSpacingGuides,
  showSpacingPixels,
  SpacingMetrics,
  guideSx,
  TooltipTypography,
}: {
  variant: { key: LogoVariant; label: string }
  showSpacingGuides: boolean
  showSpacingPixels: boolean
  SpacingMetrics: LogoContentProps['SpacingMetrics']
  guideSx?: SxProps<Theme>
  TooltipTypography: LogoContentProps['tooltipTypography']
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <Box
      key={variant.key}
      ref={ref}
      sx={{
        ...displayItemSx,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: jtSpacing.gap.sm,
        overflow: 'hidden',
        ...(guideSx ?? {}),
      }}
    >
      {showSpacingGuides && <SpacingMetrics elementRef={ref} showPixels={showSpacingPixels} />}
      <TooltipTypography variant="h4" component="div">
        {variant.label}
      </TooltipTypography>
      <Box sx={{ minWidth: 0, overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
        <LogoWordmark variant={variant.key} linkToHome={false} />
      </Box>
    </Box>
  )
}

export default function LogoContent({
  guideSx,
  showSpacingGuides,
  showSpacingPixels,
  SpacingMetrics,
  tooltipTypography: TooltipTypography,
}: LogoContentProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const activePreviewRef = useRef<HTMLDivElement>(null)
  const activeLogoVariant: LogoVariant = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'

  return (
    <Stack spacing={jtSpacing.gap.lg}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 0.5fr) minmax(0, 1fr)' },
          gap: jtSpacing.gap.lg,
          alignItems: 'start',
        }}
      >
        <Box>
          <TooltipTypography variant="body1">
            Current viewport renders:{' '}
            <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {activeLogoVariant}
            </Box>
          </TooltipTypography>
          <TooltipTypography variant="body2" sx={{ mt: jtSpacing.component.sm }}>
            The production wordmark is always a single-line logo; only the viewport-specific sizing
            changes.
          </TooltipTypography>
        </Box>
        <Box
          ref={activePreviewRef}
          sx={{
            ...displayItemSx,
            width: '100%',
            minWidth: 0,
            overflow: 'hidden',
            ...(guideSx ?? {}),
          }}
        >
          {showSpacingGuides && (
            <SpacingMetrics elementRef={activePreviewRef} showPixels={showSpacingPixels} />
          )}
          <TooltipTypography variant="h4" component="div">
            Active preview
          </TooltipTypography>
          <Box sx={{ mt: jtSpacing.component.md, minWidth: 0, overflow: 'hidden' }}>
            <LogoWordmark variant={activeLogoVariant} linkToHome={false} />
          </Box>
        </Box>
      </Box>

      <Stack spacing={jtSpacing.gap.lg}>
        {logoVariants.map((variant) => (
          <LogoVariantPreview
            key={variant.key}
            variant={variant}
            showSpacingGuides={showSpacingGuides}
            showSpacingPixels={showSpacingPixels}
            SpacingMetrics={SpacingMetrics}
            guideSx={guideSx}
            TooltipTypography={TooltipTypography}
          />
        ))}
      </Stack>
    </Stack>
  )
}
