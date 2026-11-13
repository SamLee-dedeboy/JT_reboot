// A design studio: a raised card with the studio's image and number across the top, then its
// place, title, summary and a download link.
import { Box, Button, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import Icon from '../Icon'
import { raisedCardSx } from '../surfaceStyles'
import { assetUrl } from '@/utils/baseUrl'
import { jtSpacing } from '@/theme'

export interface StudioFeatureCardProps {
  number: string
  title: string
  body: ReactNode
  image: string
  imageAlt: string
  place?: string
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
  actionLabel,
  actionHref = '#',
}: StudioFeatureCardProps) {
  return (
    <Box component="article" sx={raisedCardSx}>
      {/* The studio's image, its number over a shade at the foot */}
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          bgcolor: 'base.700',
          borderBottom: 1,
          borderColor: 'border.subtle',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: (theme) =>
              `linear-gradient(0deg, ${theme.palette.translucent[800]} 0%, transparent 45%)`,
          },
        }}
      >
        <Box
          className="raised-card-media"
          component="img"
          src={assetUrl(image)}
          alt={imageAlt}
          loading="lazy"
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <Typography
          variant="numberTimeline"
          component="span"
          aria-hidden
          sx={{
            position: 'absolute',
            zIndex: 1,
            left: (theme) => theme.spacing(jtSpacing.component.md),
            bottom: (theme) => theme.spacing(jtSpacing.component.sm),
            color: 'common.white',
          }}
        >
          {number}
        </Typography>
      </Box>

      {/* Place, title, summary and the download */}
      <Stack spacing={jtSpacing.gap.sm} sx={{ flex: 1, p: jtSpacing.component.lg }}>
        {place && (
          <Typography variant="eyebrow" component="p" sx={{ color: 'primary.main' }}>
            {place}
          </Typography>
        )}
        <Typography variant="h3" component="h3" sx={{ color: 'common.white' }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: 'base.100', maxWidth: '52ch' }}>
          {body}
        </Typography>
        {actionLabel && (
          <Button
            component="a"
            href={actionHref}
            variant="contained"
            endIcon={<Icon name="arrow-down" size={18} />}
            sx={{ alignSelf: 'flex-start', mt: 'auto' }}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  )
}
