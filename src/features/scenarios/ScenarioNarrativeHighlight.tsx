import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import { Box, ButtonBase, Collapse, Stack, Typography, alpha } from '@mui/material'
import { useId, useState } from 'react'
import { jtSpacing } from '../../theme'

interface ScenarioNarrativeHighlightProps {
  title: string
  summary: string
  paragraphs: string[]
  accentColor: string
  selected?: boolean
  onSelect?: () => void
  actionLabel?: string
}

export default function ScenarioNarrativeHighlight({
  title,
  summary,
  paragraphs,
  accentColor,
  selected = false,
  onSelect,
  actionLabel,
}: ScenarioNarrativeHighlightProps) {
  const [expanded, setExpanded] = useState(false)
  const detailsId = useId()

  return (
    <Box
      component="section"
      sx={(theme) => ({
        py: jtSpacing.component.lg,
        px: { xs: jtSpacing.component.sm, md: jtSpacing.component.md },
        borderLeft: 4,
        borderLeftColor: accentColor,
        backgroundImage: `linear-gradient(90deg, ${alpha(accentColor, 0.14)} 0%, ${alpha(
          accentColor,
          0.04,
        )} 42%, transparent 72%)`,
        transition: theme.transitions.create('background-image'),
      })}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          columnGap: jtSpacing.gap.md,
          rowGap: jtSpacing.gap.sm,
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 18,
            height: 18,
            flex: '0 0 auto',
            alignSelf: 'center',
            bgcolor: accentColor,
            borderRadius: 0.5,
          }}
        />
        <Typography variant="h4" component="h4" sx={{ color: 'common.white' }}>
          {title}
        </Typography>
        {onSelect && (
          <ButtonBase
            onClick={onSelect}
            aria-pressed={selected}
            aria-label={`${selected ? 'Clear' : 'Show'} ${title.toLowerCase()} habitat highlight on map`}
            sx={(theme) => ({
              gap: jtSpacing.gap.sm,
              px: jtSpacing.component.sm,
              py: jtSpacing.component.xs,
              color: 'primary.main',
              typography: 'button',
              bgcolor: selected ? 'translucent.primaryBlue' : 'transparent',
              transition: theme.transitions.create('background-color'),
              '&:hover': { bgcolor: 'translucent.primaryBlueSubtle' },
              '&.Mui-focusVisible': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: theme.spacing(0.5),
              },
            })}
          >
            <MapOutlinedIcon fontSize="inherit" />
            {selected ? 'Highlighted' : (actionLabel ?? 'Highlight')}
          </ButtonBase>
        )}
      </Box>
      <Typography variant="body2" sx={{ mt: jtSpacing.component.md, color: 'base.50' }}>
        {summary}
      </Typography>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Stack id={detailsId} spacing={jtSpacing.gap.md} sx={{ mt: jtSpacing.component.md }}>
          {paragraphs.map((paragraph) => (
            <Typography variant="body2" key={paragraph} sx={{ color: 'base.100' }}>
              {paragraph}
            </Typography>
          ))}
        </Stack>
      </Collapse>

      <Box sx={{ mt: jtSpacing.component.lg }}>
        <ButtonBase
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          aria-controls={detailsId}
          sx={(theme) => ({
            gap: jtSpacing.gap.sm,
            color: 'primary.main',
            typography: 'button',
            '&.Mui-focusVisible': {
              outline: `2px solid ${theme.palette.primary.main}`,
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
    </Box>
  )
}
