import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { jtSpacing } from '../../../theme'
import { outflowResultVariations, resultFamilies } from '../content'

export type ResultFamily = (typeof resultFamilies)[number]['id']

export function FamilyNavigation({ activeFamily }: { activeFamily: ResultFamily }) {
  return (
    <Stack direction="row" useFlexGap spacing={jtSpacing.gap.sm} sx={{ flexWrap: 'wrap' }}>
      {resultFamilies.map((family) => {
        const active = family.id === activeFamily
        return (
          <Button
            key={family.id}
            component={Link}
            to={family.href}
            variant={active ? 'contained' : 'outlined'}
            aria-current={active ? 'page' : undefined}
            sx={active ? undefined : { color: 'common.white', borderColor: 'base.300' }}
          >
            {family.label}
          </Button>
        )
      })}
    </Stack>
  )
}

export function OutflowTabs({ activeVariation }: { activeVariation: string }) {
  return (
    <Box
      component="nav"
      aria-label="Outflow variations"
      sx={{
        position: 'sticky',
        top: { xs: 72, md: 76 },
        zIndex: 90,
        bgcolor: 'base.700',
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'border.subtle',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: '90dvw',
          px: 0,
          display: 'flex',
          justifyContent: { xs: 'flex-start', md: 'center' },
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            width: 'max-content',
            flex: '0 0 auto',
          }}
        >
          {outflowResultVariations.map((variation) => {
            const active = activeVariation === variation.id
            return (
              <Box
                key={variation.id}
                component={Link}
                to={`/scenarios/tiered-outflows/results?variation=${variation.id}`}
                aria-current={active ? 'page' : undefined}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto minmax(0, 1fr)',
                  alignItems: 'center',
                  gap: jtSpacing.gap.xs,
                  px: jtSpacing.component.md,
                  py: jtSpacing.component.sm,
                  color: active ? 'common.black' : 'common.white',
                  bgcolor: active ? 'primary.main' : 'transparent',
                  '&:hover, &:focus-visible': {
                    bgcolor: active ? 'primary.main' : 'translucent.primaryGreen',
                    outline: 'none',
                  },
                }}
              >
                <Typography
                  component="span"
                  variant="numberBadge"
                  sx={{ color: active ? 'common.black' : 'primary.main' }}
                >
                  {variation.number}
                </Typography>
                <Typography component="span" variant="button" sx={{ whiteSpace: 'nowrap' }}>
                  {variation.label}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Container>
    </Box>
  )
}
