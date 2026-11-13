// A document in the repository: a raised card with its cover across the top, then its type,
// title and description, and its download or view links in a footer.
import { Box, Stack, Typography } from '@mui/material'
import type { ElementType, ReactNode } from 'react'
import Icon from '../Icon'
import { raisedCardSx } from '../surfaceStyles'
import { assetUrl } from '@/utils/baseUrl'
import { jtSpacing } from '@/theme'

export interface ResourceReportAction {
  label: string
  kind: 'download' | 'view'
  href?: string
}

export interface ResourceReportCardProps {
  badge: string
  title: string
  /** The cover. Without one the card shows a green title cover. */
  image?: string
  /** A line above the title on the green cover, such as the workshop it came from. */
  coverLabel?: string
  description: ReactNode
  actions?: ResourceReportAction[]
  /** Heading level for the title; h3 by default. */
  titleComponent?: ElementType
}

function ActionLink({ action }: { action: ResourceReportAction }) {
  return (
    <Box
      component="a"
      href={action.href ?? '#'}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: jtSpacing.gap.xs,
        minHeight: 44,
        typography: 'button',
        color: 'primary.main',
        textDecoration: 'none',
        '& svg': { transition: 'transform 180ms ease' },
        '&:hover, &:focus-visible': { color: 'common.white' },
        '&:hover svg, &:focus-visible svg': {
          transform: action.kind === 'download' ? 'translateY(2px)' : 'translate(2px, -2px)',
        },
      }}
    >
      {action.label}
      <Icon name={action.kind === 'download' ? 'arrow-down' : 'arrow-up-right'} size={15} />
    </Box>
  )
}

export default function ResourceReportCard({
  badge,
  title,
  image,
  coverLabel,
  description,
  actions = [],
  titleComponent = 'h3',
}: ResourceReportCardProps) {
  return (
    <Box component="article" sx={raisedCardSx}>
      {/* Cover: the document's own image, or a green title cover */}
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          bgcolor: 'base.700',
          borderBottom: 1,
          borderColor: 'border.subtle',
        }}
      >
        {image ? (
          <Box
            className="raised-card-media"
            component="img"
            src={assetUrl(image)}
            alt=""
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Stack
            className="raised-card-media"
            sx={{
              position: 'absolute',
              inset: 0,
              justifyContent: 'space-between',
              p: jtSpacing.component.md,
              bgcolor: 'primary.main',
              color: 'common.black',
            }}
          >
            <Typography variant="eyebrow" component="span">
              {coverLabel}
            </Typography>
            <Typography variant="h4" component="span">
              {title}
            </Typography>
          </Stack>
        )}
      </Box>

      {/* Type, title and description */}
      <Stack
        spacing={jtSpacing.gap.xs}
        sx={{ flex: 1, px: jtSpacing.component.md, pt: jtSpacing.component.md }}
      >
        <Typography variant="chartLabel" component="p" sx={{ color: 'base.200' }}>
          {badge}
        </Typography>
        <Typography variant="cardHeading" component={titleComponent} sx={{ color: 'common.white' }}>
          {title}
        </Typography>
        <Typography variant="cardBody" sx={{ color: 'base.100' }}>
          {description}
        </Typography>
      </Stack>

      {/* Links to the files */}
      {actions.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: jtSpacing.gap.md,
            mt: jtSpacing.component.md,
            px: jtSpacing.component.md,
            py: jtSpacing.component.xs,
            borderTop: 1,
            borderColor: 'border.subtle',
          }}
        >
          {actions.map((action) => (
            <ActionLink key={`${action.kind}-${action.label}`} action={action} />
          ))}
        </Box>
      )}
    </Box>
  )
}
