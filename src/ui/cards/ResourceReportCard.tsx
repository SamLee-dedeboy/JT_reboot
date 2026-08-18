import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import Icon from '../Icon'
import { assetUrl } from '../../utils/baseUrl'
import { jtSpacing } from '../../theme'

export interface ResourceReportAction {
  label: string
  kind: 'download' | 'view'
  href?: string
}

export interface ResourceReportCardProps {
  badge: string
  title: string
  image?: string
  description: ReactNode
  actions?: ResourceReportAction[]
}

function ActionLink({ action }: { action: ResourceReportAction }) {
  const ghost = action.kind !== 'download'

  return (
    <Box
      component="a"
      href={action.href ?? '#'}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: jtSpacing.gap.xs,
        typography: 'button',
        paddingInline: jtSpacing.component.md,
        paddingBlock: jtSpacing.component.xs,
        borderRadius: 999,
        border: '1.5px solid',
        borderColor: ghost ? 'border.strong' : 'primary.main',
        color: ghost ? 'secondary.light' : 'primary.main',
        transition: 'background 180ms ease, color 180ms ease, transform 160ms ease',
        '& svg': { transition: 'transform 180ms ease' },
        '&:hover': ghost
          ? { bgcolor: 'translucent.primaryBlue', color: 'common.white' }
          : { bgcolor: 'primary.main', color: 'base.700', transform: 'translateY(-1px)' },
        '&:hover svg': { transform: 'translateX(2px)' },
      }}
    >
      {action.label}
      {action.kind === 'download' ? (
        <Icon name="arrow-down" size={15} />
      ) : (
        <Icon name="arrow-up-right" size={15} />
      )}
    </Box>
  )
}

export default function ResourceReportCard({
  badge,
  title,
  image,
  description,
  actions = [],
}: ResourceReportCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'surface',
        border: '1px solid',
        borderColor: 'border.subtle',
        borderRadius: 1,
        overflow: 'hidden',
        transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: 'translucent.primaryGreen',
          boxShadow: (theme) => `0 16px 40px ${theme.palette.translucent.cardShadow}`,
        },
        '&:hover .report-cover-img': { transform: 'scale(1.04)' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '16 / 10',
          bgcolor: 'base.700',
          overflow: 'hidden',
        }}
      >
        {image ? (
          <Box
            className="report-cover-img"
            component="img"
            src={assetUrl(image)}
            alt={title}
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'primary.main',
              padding: jtSpacing.gap.lg,
            }}
          >
            <Typography
              variant="h4"
              component="span"
              sx={{ color: 'base.700', textAlign: 'center' }}
            >
              {title}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            position: 'absolute',
            left: (theme) => theme.spacing(jtSpacing.component.sm),
            top: (theme) => theme.spacing(jtSpacing.component.sm),
            display: 'inline-flex',
            alignItems: 'center',
            bgcolor: 'translucent.700',
            border: 1,
            borderColor: 'translucent.primaryGreen',
            color: 'primary.main',
            typography: 'eyebrow',
            paddingInline: jtSpacing.component.sm,
            paddingBlock: jtSpacing.component.xs,
            borderRadius: 999,
            backdropFilter: 'blur(2px)',
          }}
        >
          {badge}
        </Box>
      </Box>
      <Stack spacing={jtSpacing.gap.sm} sx={{ padding: jtSpacing.component.md, flex: 1 }}>
        <Typography variant="cardTitle" component="h3" sx={{ color: 'secondary.light' }}>
          {title}
        </Typography>
        <Typography variant="cardBody" sx={{ color: 'base.100' }}>
          {description}
        </Typography>
        {actions.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: jtSpacing.gap.sm,
              marginTop: 'auto',
              paddingTop: jtSpacing.component.xs,
            }}
          >
            {actions.map((action) => (
              <ActionLink key={`${action.kind}-${action.label}`} action={action} />
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  )
}
