import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import Icon from '../Icon'
import { assetUrl } from '../../utils/baseUrl'
import { jtSpacing } from '../../theme'

export interface StudioFeatureCardProps {
  number: string
  title: string
  body: ReactNode
  image: string
  imageAlt: string
  place?: string
  flip?: boolean
  actionLabel?: string
  actionHref?: string
}

export default function StudioFeatureCard({
  number,
  title,
  body,
  image,
  imageAlt,
  place,
  flip = false,
  actionLabel,
  actionHref = '#',
}: StudioFeatureCardProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: flip ? '1fr 1.35fr' : '1.35fr 1fr', sm: '1fr 1.2fr' },
        gap: { xs: jtSpacing.gap.md, md: jtSpacing.component.xl },
        alignItems: 'center',
        paddingBlock: { xs: jtSpacing.component.md, md: jtSpacing.component.xl },
        borderBlock: '1px solid',
        borderColor: 'border.subtle',
      }}
    >
      <Box
        sx={{
          order: { xs: 0, md: flip ? 2 : 0 },
          borderRadius: 0,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'border.default',
          bgcolor: 'base.700',
        }}
      >
        <Box
          component="img"
          src={assetUrl(image)}
          alt={imageAlt}
          loading="lazy"
          sx={{ width: '100%', display: 'block' }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: jtSpacing.gap.xs }}>
        <Typography variant="numberGhost" component="div">
          {number}
        </Typography>
        <Typography variant="h3" component="h3" sx={{ color: 'primary.main' }}>
          {title}
        </Typography>
        {place && (
          <Typography
            variant="meta"
            sx={{
              typography: 'eyebrow',
              color: 'secondary.light',
            }}
          >
            {place}
          </Typography>
        )}
        <Typography
          variant="body1"
          sx={{
            maxWidth: place ? '42ch' : undefined,
            color: 'base.100',
          }}
        >
          {body}
        </Typography>
        {actionLabel && (
          <Box
            component="a"
            href={actionHref}
            sx={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: jtSpacing.gap.xs,
              marginTop: jtSpacing.component.sm,
              typography: 'button',
              paddingInline: jtSpacing.component.md,
              paddingBlock: jtSpacing.component.xs,
              borderRadius: 999,
              border: '1.5px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              transition: 'background 180ms ease, color 180ms ease, transform 160ms ease',
              '& svg': { transition: 'transform 180ms ease' },
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'base.700',
                transform: 'translateY(-1px)',
              },
              '&:hover svg': { transform: 'translateY(2px)' },
            }}
          >
            {actionLabel}
            <Icon name="arrow-down" size={16} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
