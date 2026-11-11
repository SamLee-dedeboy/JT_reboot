// The site's two link-button styles, so actions look and behave alike on every page:
// a contained (or outlined) button with a direction arrow, and a quiet text link.
// Either one, given no `href`, shows disabled with the italic "Forthcoming" note.
import { Button, Stack, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { textLinkSx } from './actionStyles'

export interface ActionTarget {
  label: string
  /** An in-app route, an in-page `#anchor` or an external `https://` URL. None marks it forthcoming. */
  href?: string
}

const isExternal = (href: string) => /^https?:\/\//.test(href)

/** Router link for app routes, a plain anchor for `#` and external URLs (opened in a new tab). */
function linkProps(href: string) {
  if (isExternal(href)) {
    return { component: 'a', href, target: '_blank', rel: 'noopener noreferrer' } as const
  }
  if (href.startsWith('#')) return { component: 'a', href } as const
  return { component: Link, to: href } as const
}

const arrowFor = (href: string, size: number) => (
  <Icon name={isExternal(href) ? 'arrow-up-right' : 'arrow-right'} size={size} />
)

/** A disabled button with the italic "Forthcoming" note beside it. */
function Forthcoming({ button, sx }: { button: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Stack
      direction="row"
      useFlexGap
      spacing={1.5}
      sx={[{ alignItems: 'center', flexWrap: 'wrap' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {button}
      <Typography variant="captionSmall" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
        Forthcoming
      </Typography>
    </Stack>
  )
}

/**
 * A page's call to action: a pill in the brand green (or outlined) with a direction arrow.
 * `sx` places it: it lands on the button, or on the row that holds the "Forthcoming" note.
 */
export function ActionButton({
  label,
  href,
  variant = 'contained',
  sx,
}: ActionTarget & { variant?: 'contained' | 'outlined'; sx?: SxProps<Theme> }) {
  if (!href) {
    return (
      <Forthcoming
        sx={sx}
        button={
          <Button variant={variant} disabled>
            {label}
          </Button>
        }
      />
    )
  }
  return (
    <Button {...linkProps(href)} variant={variant} endIcon={arrowFor(href, 18)} sx={sx}>
      {label}
    </Button>
  )
}

/** A secondary action: green capitals that read as a link rather than a button. */
export function TextLink({ label, href }: ActionTarget) {
  if (!href) {
    return (
      <Forthcoming
        button={
          <Button variant="text" disabled sx={textLinkSx}>
            {label}
          </Button>
        }
      />
    )
  }
  return (
    <Button
      {...linkProps(href)}
      variant="text"
      disableRipple
      endIcon={arrowFor(href, 16)}
      sx={textLinkSx}
    >
      {label}
    </Button>
  )
}
