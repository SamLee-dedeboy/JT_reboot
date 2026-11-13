import { Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { LegendItem } from '@/map/scenarios/config'
import { symbolSwatchSx } from '@/map/scenarios/symbolSwatch'

export const chipWidth = 84
const chipHeight = 34

/** The pill beside a chapter or row title, holding a short figure or a map symbol. */
export default function ScenarioChip({
  children,
  symbol,
  selected = false,
  dimmed = false,
}: {
  children?: ReactNode
  symbol?: LegendItem
  selected?: boolean
  dimmed?: boolean
}) {
  return (
    <Typography
      variant="numberArticle"
      component="span"
      aria-hidden={symbol ? true : undefined}
      sx={(theme) => ({
        width: chipWidth,
        height: chipHeight,
        flex: '0 0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'common.white',
        border: '1.5px solid',
        borderColor: selected ? 'primary.main' : 'common.white',
        borderRadius: `${chipHeight / 2}px`,
        opacity: dimmed ? 0.5 : 1,
        transition: theme.transitions.create(['opacity', 'border-color']),
        ...(symbol && symbolSwatchSx(symbol, selected)),
      })}
    >
      {children}
    </Typography>
  )
}
