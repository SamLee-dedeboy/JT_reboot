// Text links sit flush with the copy above them: no pill, no lift, an underline and arrow nudge
// on hover. `&&` outranks the theme's button padding, which it sets inside a breakpoint query.
export const textLinkSx = {
  minWidth: 0,
  justifyContent: 'flex-start',
  textAlign: 'left',
  color: 'primary.main',
  '&&': { paddingInline: 0 },
  '& .MuiButton-endIcon': { transition: 'transform 180ms ease' },
  '&:hover': {
    bgcolor: 'transparent',
    transform: 'none',
    textDecoration: 'underline',
    textUnderlineOffset: '0.35em',
  },
  '&:hover .MuiButton-endIcon': { transform: 'translateX(4px)' },
  '&.Mui-focusVisible': { outline: '2px solid currentColor', outlineOffset: 4 },
} as const
