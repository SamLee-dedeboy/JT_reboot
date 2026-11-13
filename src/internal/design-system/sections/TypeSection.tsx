import { Box, Stack, Typography, useTheme, type TypographyProps } from '@mui/material'
import { Fragment } from 'react'
import { jtSpacing, typography } from '@/theme'
import DesignSection from '../parts/DesignSection'
import { SpecimenGroup } from '../parts/Specimen'
import { readFontSize } from '../parts/fontSize'
import useViewportWidth from '../parts/useViewportWidth'
import { typeGroups, type TypeSample } from './typeSamples'

const monoSx = {
  fontFamily: 'ui-monospace, Consolas, monospace',
  overflowWrap: 'anywhere',
} as const

type VariantStyle = Record<string, unknown>

// Every variant in the theme that sets its own size, keyed by name.
const themeVariants: Record<string, VariantStyle> = Object.fromEntries(
  Object.entries(typography as Record<string, unknown>).filter(
    (entry): entry is [string, VariantStyle] =>
      typeof entry[1] === 'object' && entry[1] !== null && 'fontSize' in entry[1],
  ),
)
const listed = new Set(typeGroups.flatMap((group) => Object.keys(group.variants)))
const groups = [
  ...typeGroups,
  {
    label: 'Other',
    variants: Object.fromEntries(
      Object.keys(themeVariants)
        .filter((name) => !listed.has(name))
        .map((name): [string, TypeSample] => [name, { sample: name, use: 'Not described yet' }]),
    ),
  },
].filter((group) => Object.keys(group.variants).some((name) => name in themeVariants))

/** Your window width and the MUI breakpoint it falls in. */
function ViewportReadout({ width }: { width: number }) {
  const { values } = useTheme().breakpoints
  const keys = Object.keys(values) as Array<keyof typeof values>
  const current = [...keys].reverse().find((key) => width >= values[key]) ?? keys[0]

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 2, md: 5 }}
      sx={{
        alignItems: { md: 'center' },
        p: jtSpacing.component.md,
        border: 1,
        borderColor: 'border.default',
        borderRadius: '6px',
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="captionSmall">Your window</Typography>
        <Typography variant="statValue">{width} px</Typography>
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="captionSmall">MUI breakpoint</Typography>
        <Typography variant="statValue" sx={{ color: 'primary.main' }}>
          {current}
        </Typography>
      </Stack>
      <Box sx={{ display: 'flex', gap: 0.5, flex: 1, minWidth: 0 }}>
        {keys.map((key) => (
          <Box
            key={key}
            sx={{
              flex: 1,
              py: 1,
              textAlign: 'center',
              borderRadius: '4px',
              typography: 'chartLabel',
              bgcolor: key === current ? 'primary.main' : 'surface',
              color: key === current ? 'common.black' : 'base.100',
            }}
          >
            {key} {values[key]}+
          </Box>
        ))}
      </Box>
    </Stack>
  )
}

/** One variant: its size expression with the part in force in bold, then a live sample. */
function TypeRow({ name, sample, use, width }: { name: string } & TypeSample & { width: number }) {
  const reading = readFontSize(themeVariants[name], width)
  if (!reading) return null
  const joiner = reading.kind === 'steps' ? ' · ' : ', '

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '280px minmax(0, 1fr)' },
        gap: { xs: 1, md: 4 },
        alignItems: 'baseline',
        py: 2,
        borderTop: 1,
        borderColor: 'border.default',
      }}
    >
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Typography variant="tableValueStrong" component="p">
          {name}
        </Typography>
        <Typography variant="captionSmall" component="p" sx={{ ...monoSx, color: 'base.200' }}>
          {reading.kind === 'clamp' && 'clamp('}
          {reading.parts.map((part, index) => (
            <Fragment key={part}>
              {index > 0 && joiner}
              <Box
                component="span"
                sx={
                  index === reading.active ? { color: 'common.white', fontWeight: 800 } : undefined
                }
              >
                {part}
              </Box>
            </Fragment>
          ))}
          {reading.kind === 'clamp' && ')'}
        </Typography>
        <Typography variant="captionSmall" component="p" sx={{ ...monoSx, color: 'base.100' }}>
          = {Math.round(reading.px * 10) / 10} px
        </Typography>
      </Stack>
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Typography
          variant={name as TypographyProps['variant']}
          component="p"
          sx={{ overflowWrap: 'anywhere', m: 0 }}
        >
          {sample}
        </Typography>
        <Typography variant="captionSmall" component="p" sx={{ color: 'base.200' }}>
          {use}
        </Typography>
      </Stack>
    </Box>
  )
}

/** Every typography variant in the theme, drawn live at the reader's window width. */
export default function TypeSection() {
  const width = useViewportWidth()

  return (
    <DesignSection
      id="type"
      eyebrow="Foundations"
      title="Type"
      intro="Hammersmith One for display, wayfinding and numbers; Proxima Nova for reading. Each sample below is the real variant at your window width, and the part of its size rule in force right now is in bold."
    >
      <Box
        sx={{
          p: jtSpacing.component.md,
          border: 1,
          borderColor: 'primary.main',
          borderRadius: '6px',
        }}
      >
        <Typography variant="h4" component="p" sx={{ color: 'primary.main' }}>
          Hammersmith One is always uppercase
        </Typography>
        <Typography variant="body1" sx={{ color: 'base.100', mt: 1 }}>
          Every variant set in Hammersmith One carries textTransform uppercase in
          src/theme/typography.ts. Never switch it off at a call site. Text that must keep its case,
          such as a unit like µS/cm, takes a Proxima Nova variant instead (chartUnit).
        </Typography>
      </Box>
      <ViewportReadout width={width} />
      {groups.map((group) => (
        <SpecimenGroup key={group.label} title={group.label}>
          <Box>
            {Object.entries(group.variants)
              .filter(([name]) => name in themeVariants)
              .map(([name, sample]) => (
                <TypeRow key={name} name={name} width={width} {...sample} />
              ))}
          </Box>
        </SpecimenGroup>
      ))}
    </DesignSection>
  )
}
