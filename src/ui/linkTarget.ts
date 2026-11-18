// The site's link-arrow rule, shared by every button, link row and card action:
//   ↗ arrow-up-right  leaves the site (an https:// URL) and opens in a new tab
//   → arrow-right     stays on the site (an app route or a #section)
//   ↓ arrow-down      downloads a file (chosen by the caller, not by the href)
//   no arrow          no target yet ("Forthcoming")
/** True for a link that leaves the site. */
export const isExternal = (href: string) => /^https?:\/\//.test(href)

/** The arrow for a link's target, or none when it has no target yet. */
export function linkArrowName(href?: string): 'arrow-up-right' | 'arrow-right' | undefined {
  if (!href) return undefined
  return isExternal(href) ? 'arrow-up-right' : 'arrow-right'
}

/** Anchor attributes that open an outside link in a new tab; empty for links within the site. */
export const newTabProps = (href?: string) =>
  href && isExternal(href) ? ({ target: '_blank', rel: 'noopener noreferrer' } as const) : {}
