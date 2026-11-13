import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { jtSpacing } from '@/theme'
import { NumberedHeading } from '@/ui'
import { referenceId } from './citationContext'
import { methodologyTextColumnSx, sectionSx } from './criterionLayout'
import Reference from './Reference'

/** The report's reference list; citation numbers in the text jump here. */
export default function ReferencesSection({
  references,
  accent,
}: {
  references: string[]
  accent: string
}) {
  return (
    <Box component="section" id="references" aria-labelledby="references-title" sx={sectionSx}>
      <NumberedHeading variant="h3" title="References" id="references-title" accent={accent} />
      <Box
        component="ol"
        sx={{
          ...methodologyTextColumnSx,
          m: 0,
          mt: jtSpacing.gap.md,
          p: 0,
          listStyle: 'none',
        }}
      >
        {references.map((reference, index) => (
          <Typography
            key={reference}
            id={referenceId(index)}
            component="li"
            variant="body2"
            sx={{
              ...sectionSx,
              display: 'grid',
              gridTemplateColumns: '2.5em minmax(0, 1fr)',
              color: 'base.100',
              py: jtSpacing.component.xs,
              borderTop: 1,
              borderColor: 'border.subtle',
              overflowWrap: 'anywhere',
              // Flash the entry a citation number jumps to
              '&:target': { bgcolor: alpha(accent, 0.14) },
            }}
          >
            <Box component="span" sx={{ color: accent }}>
              {index + 1}.
            </Box>
            <span>
              <Reference text={reference} accent={accent} />
            </span>
          </Typography>
        ))}
      </Box>
    </Box>
  )
}
