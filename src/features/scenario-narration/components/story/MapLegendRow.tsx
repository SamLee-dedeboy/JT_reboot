import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, ButtonBase, Collapse, Stack, Typography } from '@mui/material'
import { useId, useState, type ReactNode } from 'react'
import type { LegendItem } from '@/map/scenarios/config'
import { jtSpacing } from '@/theme'
import ScenarioChip from './ScenarioChip'

/** Wide enough for the toggle's label, so titles line up from row to row. */
const symbolColumnWidth = 124

interface HighlightProps {
  title: string
  summary?: string
  paragraphs?: string[]
  /** The map symbol for this row. Rows without a map feature have no chip or toggle. */
  symbol?: LegendItem
  selected?: boolean
  /** Another row is selected. */
  dimmed?: boolean
  onSelect?: () => void
  renderText?: (text: string) => ReactNode
}

export default function MapLegendRow({
  title,
  summary,
  paragraphs = [],
  symbol,
  selected = false,
  dimmed = false,
  onSelect,
  renderText,
}: HighlightProps) {
  const [expanded, setExpanded] = useState(false)
  const detailsId = useId()

  return (
    <Box
      component="section"
      sx={{
        display: 'grid',
        gridTemplateColumns: symbol
          ? { xs: 'minmax(0, 1fr)', sm: `${symbolColumnWidth}px minmax(0, 1fr)` }
          : 'minmax(0, 1fr)',
        columnGap: jtSpacing.component.md,
        rowGap: jtSpacing.component.xs,
        py: jtSpacing.component.lg,
        borderTop: 1,
        borderColor: 'border.subtle',
      }}
    >
      {symbol && !onSelect && <ScenarioChip symbol={symbol} />}
      {symbol && onSelect && (
        <ButtonBase
          onClick={onSelect}
          aria-pressed={selected}
          aria-label={`${selected ? 'Clear' : 'Show'} ${title} on the map`}
          sx={(theme) => ({
            alignSelf: 'start',
            justifySelf: 'start',
            flexDirection: { xs: 'row', sm: 'column' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: jtSpacing.gap.sm,
            minHeight: 44,
            color: selected ? 'primary.main' : 'base.100',
            transition: theme.transitions.create('color'),
            '&:hover': { color: selected ? 'primary.main' : 'common.white' },
            '&.Mui-focusVisible': {
              outline: `2px solid ${theme.palette.common.white}`,
              outlineOffset: theme.spacing(0.5),
            },
          })}
        >
          <ScenarioChip symbol={symbol} selected={selected} dimmed={dimmed} />
          <Typography
            variant="captionSmall"
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: jtSpacing.gap.sm,
              color: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 9,
                height: 9,
                flex: '0 0 auto',
                boxSizing: 'border-box',
                border: '1.5px solid',
                borderRadius: '50%',
                bgcolor: selected ? 'currentColor' : 'transparent',
              }}
            />
            {selected ? 'On map' : 'Show on map'}
          </Typography>
        </ButtonBase>
      )}

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h4"
          component="h4"
          sx={(theme) => ({
            color: dimmed ? 'base.100' : 'common.white',
            transition: theme.transitions.create('color'),
          })}
        >
          {title}
        </Typography>
        {summary && (
          <Typography variant="body2" sx={{ mt: jtSpacing.component.sm, color: 'base.50' }}>
            {renderText ? renderText(summary) : summary}
          </Typography>
        )}

        {paragraphs.length > 0 && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Stack id={detailsId} spacing={jtSpacing.gap.md} sx={{ mt: jtSpacing.component.md }}>
              {paragraphs.map((paragraph) => (
                <Typography variant="body2" key={paragraph} sx={{ color: 'base.100' }}>
                  {renderText ? renderText(paragraph) : paragraph}
                </Typography>
              ))}
            </Stack>
          </Collapse>
        )}

        {paragraphs.length > 0 && (
          <Box sx={{ mt: jtSpacing.component.sm }}>
            <ButtonBase
              onClick={() => setExpanded((current) => !current)}
              aria-expanded={expanded}
              aria-controls={detailsId}
              sx={(theme) => ({
                gap: jtSpacing.gap.sm,
                minHeight: 44,
                color: 'base.100',
                typography: 'button',
                '&:hover': { color: 'common.white' },
                '&.Mui-focusVisible': {
                  outline: `2px solid ${theme.palette.common.white}`,
                  outlineOffset: theme.spacing(0.5),
                },
              })}
            >
              {expanded ? 'Hide technical details' : 'Read technical details'}
              <ExpandMoreIcon
                fontSize="inherit"
                sx={(theme) => ({
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: theme.transitions.create('transform'),
                })}
              />
            </ButtonBase>
          </Box>
        )}
      </Box>
    </Box>
  )
}
