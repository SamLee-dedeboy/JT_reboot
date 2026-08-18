// Inline highlight primitive for emphasizing text with design-system variants.
import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { highlighter } from '../theme'

export type HighlightStyleVariant = 'underline' | 'raisedUnderline' | 'wash' | 'pill'

/** Semantic inline highlight, with style variants for design-system exploration. */
export default function Hl({
  children,
  color = highlighter.defaultColor,
  styleVariant = 'underline',
}: {
  children: ReactNode
  color?: string
  styleVariant?: HighlightStyleVariant
}) {
  const styleByVariant = {
    underline: {
      background: `linear-gradient(transparent 32%, ${color} 32%)`,
      paddingInline: '0.1em',
      borderRadius: '2px',
    },
    raisedUnderline: {
      background: `linear-gradient(transparent 24%, ${color} 24% 100%)`,
      paddingInline: '0.14em',
      paddingBlock: '0.04em',
      borderRadius: '4px',
      lineHeight: 1.08,
      boxDecorationBreak: 'clone',
      WebkitBoxDecorationBreak: 'clone',
    },
    wash: {
      background: `linear-gradient(transparent 15%, ${color} 15%)`,
      paddingInline: '0.16em',
      borderRadius: '1px',
      lineHeight: 1,
      boxDecorationBreak: 'clone',
      WebkitBoxDecorationBreak: 'clone',
    },
    pill: {
      background: color,
      paddingInline: '0.38em',
      paddingBlock: '0.03em',
      borderRadius: '999px',
    },
  } as const

  return (
    <Box
      component="mark"
      sx={{
        color: 'common.white',
        ...styleByVariant[styleVariant],
      }}
    >
      {children}
    </Box>
  )
}
