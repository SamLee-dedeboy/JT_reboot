import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import Icon from '../Icon'
import { assetUrl } from '../../utils/baseUrl'

export interface StudioFeatureCardProps {
  badge: string
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
  badge,
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
        gap: { xs: '1.3rem', md: '2.6rem' },
        alignItems: 'center',
        paddingBlock: { xs: '1.3rem', md: '2.6rem' },
        borderBlock: '1px solid',
        borderColor: 'border.subtle',
      }}
    >
      <Box
        sx={{
          order: { xs: 0, md: flip ? 2 : 0 },
          borderRadius: 1,
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
      <Box>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            bgcolor: 'base.800',
            border: 1,
            borderColor: 'translucent.primaryGreen',
            color: 'primary.main',
            typography: 'eyebrow',
            paddingInline: '0.7rem',
            paddingBlock: '0.36rem',
            borderRadius: '999px',
            marginBottom: '1rem',
          }}
        >
          {badge}
        </Box>
        <Typography variant="numberGhost" component="div" sx={{ marginBottom: '0.6rem' }}>
          {number}
        </Typography>
        <Typography
          variant="h3"
          component="h3"
          sx={{ color: 'primary.main', marginBottom: '0.7rem' }}
        >
          {title}
        </Typography>
        {place && (
          <Typography
            variant="meta"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'secondary.light',
              marginBottom: '1rem',
            }}
          >
            {place}
          </Typography>
        )}
        <Typography
          variant="body1"
          sx={{
            lineHeight: place ? 1.6 : undefined,
            marginBottom: actionLabel ? '1.6rem' : 0,
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
              alignItems: 'center',
              gap: '0.45rem',
              typography: 'button',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              paddingInline: '1.1rem',
              paddingBlock: '0.62rem',
              borderRadius: '999px',
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
