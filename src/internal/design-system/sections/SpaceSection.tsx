import { Box, Stack, Typography } from '@mui/material'
import { jtSpacing, navigation } from '@/theme'
import DesignSection from '../parts/DesignSection'
import { SpecimenGroup } from '../parts/Specimen'

const scales = [
  { title: 'component · inside a block', scale: jtSpacing.component, color: 'primary.main' },
  { title: 'gap · between siblings', scale: jtSpacing.gap, color: 'accent.blue' },
  { title: 'section · between blocks', scale: jtSpacing.section, color: 'secondary.main' },
] as const

const monoSx = { fontFamily: 'ui-monospace, Consolas, monospace' } as const

/** The jtSpacing scales (in MUI 8 px steps), page widths and corner radii. */
export default function SpaceSection() {
  return (
    <DesignSection
      id="space"
      eyebrow="Foundations"
      title="Space and shape"
      intro="MUI spacing is 8 px a step. Use the jtSpacing scale for its job rather than a raw number."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: jtSpacing.section.sm,
        }}
      >
        {scales.map(({ title, scale, color }) => (
          <SpecimenGroup key={title} title={title}>
            <Stack spacing={1.5}>
              {Object.entries(scale).map(([key, steps]) => (
                <Stack key={key} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{ width: (theme) => theme.spacing(steps), height: 22, bgcolor: color }}
                  />
                  <Typography variant="captionSmall" sx={{ ...monoSx, color: 'base.100' }}>
                    {key} {steps} · {steps * 8}px
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </SpecimenGroup>
        ))}
        <SpecimenGroup title="Widths and corners">
          <Typography variant="body2" component="div">
            <strong>reading</strong> {jtSpacing.layout.reading.width} · <strong>hybrid</strong>{' '}
            {jtSpacing.layout.hybrid.width} · <strong>data</strong> {jtSpacing.layout.data.width},
            max {jtSpacing.layout.data.maxWidth}
            <br />
            <strong>rail column</strong> {navigation.railColumn}
          </Typography>
          {[
            {
              radius: 999,
              label: '999 · buttons, toggles, chips',
              sx: { border: 1, borderColor: 'border.strong' },
            },
            {
              radius: navigation.panelRadius,
              label: `${navigation.panelRadius} · menu panels`,
              sx: { bgcolor: 'base.800', border: 1, borderColor: 'border.default' },
            },
            { radius: '6px', label: '6px · fields, surfaces', sx: { bgcolor: 'surface' } },
          ].map(({ radius, label, sx }) => (
            <Stack key={label} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 88, height: 36, borderRadius: radius, ...sx }} />
              <Typography variant="captionSmall" sx={{ ...monoSx, color: 'base.100' }}>
                {label}
              </Typography>
            </Stack>
          ))}
        </SpecimenGroup>
      </Box>
    </DesignSection>
  )
}
