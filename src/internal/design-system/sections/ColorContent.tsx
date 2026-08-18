import { Box, Typography, type SxProps, type Theme } from '@mui/material'
import type { ReactNode } from 'react'
import GroupContainer from '../common/GroupContainer'
import { displayItemSx } from '../common/displayStyles'
import { jtSpacing, palette } from '../../../theme/index'

type PaletteColor = {
  label: string
  hex: string
}

function ColorSwatch({ label, hex, muted = false }: PaletteColor & { muted?: boolean }) {
  return (
    <Box
      sx={{
        ...displayItemSx,
        borderLeftWidth: 1,
        borderLeftColor: 'divider',
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        flex: { xs: '1 1 100%', sm: '0 1 188px' },
        minWidth: 0,
        width: { xs: '100%', sm: 188 },
        opacity: muted ? 0.72 : 1,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          flex: '0 0 36px',
          borderRadius: 1,
          bgcolor: hex,
          border: 1,
          borderColor: 'divider',
        }}
      />
      <Box sx={{ display: 'grid', minWidth: 0 }}>
        <Typography variant="h5">{label}</Typography>
        <Typography variant="captionSmall">{hex}</Typography>
      </Box>
    </Box>
  )
}

function ColorPaletteGroup({
  title,
  colors,
  headerAction,
  muted = false,
}: {
  title: string
  colors: PaletteColor[]
  headerAction?: ReactNode
  muted?: boolean
}) {
  return (
    <GroupContainer title={title} headerAction={headerAction} muted={muted}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: jtSpacing.gap.xs }}>
        {colors.map((c) => (
          <ColorSwatch key={c.label} label={c.label} hex={c.hex} muted={muted} />
        ))}
      </Box>
    </GroupContainer>
  )
}

const baseKeys = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const

const commonColors: PaletteColor[] = [
  { label: 'Light', hex: palette.common.white },
  { label: 'Dark', hex: palette.common.black },
]

const brandPalette: PaletteColor[] = [
  { label: 'Base', hex: palette.brand.base },
  { label: 'Primary Blue', hex: palette.brand.primaryBlue },
  { label: 'Primary Green', hex: palette.brand.primaryGreen },
]

const accentPalette: PaletteColor[] = [
  { label: 'Blue', hex: palette.accent.blue },
  { label: 'Red', hex: palette.accent.red },
  { label: 'Orange', hex: palette.accent.orange },
  { label: 'Yellow', hex: palette.accent.yellow },
  { label: 'Purple', hex: palette.accent.purple },
  { label: 'Pink', hex: palette.accent.pink },
]

const basePalette: PaletteColor[] = baseKeys.map((key) => ({ label: key, hex: palette.base[key] }))

const surfacePalette: PaletteColor[] = [
  { label: 'Surface', hex: palette.surface },
  { label: 'Surface Strong', hex: palette.surfaceStrong },
  { label: 'Footer Background', hex: palette.footerBg },
]

const translucentPalette: PaletteColor[] = [
  { label: 'Primary Green Wash', hex: palette.translucent.primaryGreen },
  { label: 'Text Shadow', hex: palette.translucent.textShadow },
]

const deactivatedPalette: PaletteColor[] = [
  { label: 'Spray', hex: '#7eeaee' },
  { label: 'Orange Roughy', hex: '#cb531b' },
  { label: 'Bitter Lemon', hex: '#dee006' },
  { label: 'Heliotrope', hex: '#e263ff' },
  { label: 'Web Orange', hex: '#efa400' },
  { label: 'Sasquatch Socks', hex: '#ff4c79' },
]

export default function ColorContent({ guideSx }: { guideSx?: SxProps<Theme> }) {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gap: jtSpacing.gap.sm,
          my: jtSpacing.section.sm,
          ...(guideSx ?? {}),
        }}
      >
        <ColorPaletteGroup title="Brand" colors={brandPalette} />
        <ColorPaletteGroup title="Text" colors={commonColors} />
        <ColorPaletteGroup title="Accents" colors={accentPalette} />
        <ColorPaletteGroup title="Base" colors={basePalette} />
        <ColorPaletteGroup title="Surfaces" colors={surfacePalette} />
        <ColorPaletteGroup title="Translucent Tokens" colors={translucentPalette} />
      </Box>

      <Box sx={{ mt: jtSpacing.section.sm, ...(guideSx ?? {}) }}>
        <ColorPaletteGroup
          title="Currently Deactivated"
          colors={deactivatedPalette}
          muted
          headerAction={
            <Typography
              variant="button"
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: jtSpacing.component.xs,
                py: jtSpacing.component.xs,
                borderRadius: 999,
                bgcolor: 'surfaceStrong',
                border: 1,
                borderColor: 'accent.pink',
                color: 'accent.pink',
                lineHeight: 1,
              }}
            >
              Inactive palette
            </Typography>
          }
        />
      </Box>
    </>
  )
}
