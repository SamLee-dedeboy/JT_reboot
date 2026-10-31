// The home page's two button styles, shared by every panel so actions look and behave alike:
// a contained call to action with an arrow, and a quiet text link for secondary actions.
import { Button, Stack, Typography, type ButtonProps } from '@mui/material'
import { Link } from 'react-router-dom'
import Icon from '../../../ui/Icon'
import { homeTextLinkSx } from './homeActionStyles'

export interface HomeActionTarget {
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

/** Disabled action with the italic "Forthcoming" note the scenarios landing page uses. */
function Forthcoming({ button }: { button: React.ReactNode }) {
  return (
    <Stack direction="row" useFlexGap spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
      {button}
      <Typography variant="captionSmall" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
        Forthcoming
      </Typography>
    </Stack>
  )
}

/** The page's primary action: a contained pill in the brand green with a direction arrow. */
export function HomeCta({ label, href, sx }: HomeActionTarget & Pick<ButtonProps, 'sx'>) {
  if (!href) {
    return (
      <Forthcoming
        button={
          <Button variant="contained" disabled sx={sx}>
            {label}
          </Button>
        }
      />
    )
  }
  return (
    <Button {...linkProps(href)} variant="contained" endIcon={arrowFor(href, 18)} sx={sx}>
      {label}
    </Button>
  )
}

/** A secondary action: green capitals that read as a link rather than a button. */
export function HomeTextLink({ label, href }: HomeActionTarget) {
  if (!href) {
    return (
      <Forthcoming
        button={
          <Button variant="text" disabled sx={homeTextLinkSx}>
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
      sx={homeTextLinkSx}
    >
      {label}
    </Button>
  )
}
