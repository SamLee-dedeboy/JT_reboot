import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import { Box, ButtonBase, Stack, Typography } from '@mui/material'
import { jtSpacing } from '../../theme'

interface ScenarioNarrativeHighlightProps {
  title: string
  paragraphs: string[]
  selected?: boolean
  onSelect?: () => void
  actionLabel?: string
}

export default function ScenarioNarrativeHighlight({
  title,
  paragraphs,
  selected = false,
  onSelect,
  actionLabel,
}: ScenarioNarrativeHighlightProps) {
  const content = (
    <>
      <Typography variant="h4" component="h4" sx={{ color: 'common.white' }}>
        {title}
      </Typography>
      <Stack spacing={jtSpacing.gap.md} sx={{ mt: jtSpacing.component.md }}>
        {paragraphs.map((paragraph) => (
          <Typography variant="body2" key={paragraph} sx={{ color: 'base.100' }}>
            {paragraph}
          </Typography>
        ))}
      </Stack>
      {onSelect && (
        <Typography
          variant="button"
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: jtSpacing.gap.sm,
            mt: jtSpacing.component.lg,
            color: selected ? 'common.white' : 'primary.main',
          }}
        >
          <MapOutlinedIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} />
          {selected ? 'Highlighted on map' : (actionLabel ?? 'Highlight on map')}
        </Typography>
      )}
    </>
  )

  return (
    <Box
      component="aside"
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        bgcolor: selected ? 'translucent.primaryGreen' : 'surface',
        border: 1,
        borderColor: selected ? 'primary.main' : 'border.subtle',
        borderRadius: 1,
        transition: theme.transitions.create(['background-color', 'border-color', 'transform']),
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '0 auto 0 0',
          width: 4,
          bgcolor: 'primary.main',
        },
        '&:hover': onSelect
          ? {
              borderColor: 'primary.main',
              transform: `translateY(-${theme.spacing(0.5)})`,
            }
          : undefined,
      })}
    >
      {onSelect ? (
        <ButtonBase
          onClick={onSelect}
          aria-pressed={selected}
          aria-label={`${selected ? 'Clear' : 'Show'} ${title.toLowerCase()} habitat highlight on map`}
          sx={{
            width: '100%',
            display: 'block',
            p: jtSpacing.component.lg,
            pl: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
            textAlign: 'left',
            '&.Mui-focusVisible': {
              bgcolor: 'translucent.primaryGreen',
            },
          }}
        >
          {content}
        </ButtonBase>
      ) : (
        <Box sx={{ p: jtSpacing.component.lg, pl: { md: jtSpacing.component.xl } }}>{content}</Box>
      )}
    </Box>
  )
}
