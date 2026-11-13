import { Box, Stack, Typography } from '@mui/material'
import { jtSpacing } from '@/theme'
import { CitedText } from './citations'
import { NumberedHeading } from '@/ui'
import { type SectionProps, criterionSplitSx, sectionSx } from './criterionLayout'

export default function WhySection({ story, accent }: SectionProps) {
  const { stats = [], statsInRows, paragraphs, quote } = story.why
  return (
    <Box component="section" id="why" aria-labelledby="why-title" sx={sectionSx}>
      <NumberedHeading
        variant="h3"
        title="Why does this criterion matter?"
        id="why-title"
        accent={accent}
      />
      <Box sx={criterionSplitSx}>
        <Stack spacing={jtSpacing.gap.md}>
          {paragraphs.map((paragraph) => (
            <Typography key={paragraph} variant="body1" sx={{ color: 'base.100' }}>
              <CitedText text={paragraph} />
            </Typography>
          ))}
          {quote && (
            <Box
              component="blockquote"
              sx={{ m: 0, pl: jtSpacing.component.md, borderLeft: 3, borderColor: accent }}
            >
              <Typography variant="body1" sx={{ color: 'base.50' }}>
                “{quote}”
              </Typography>
              <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
                Project interviewee
              </Typography>
            </Box>
          )}
        </Stack>
        {stats.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: statsInRows
                ? 'minmax(0, 1fr)'
                : 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: statsInRows ? jtSpacing.gap.sm : jtSpacing.gap.lg,
              pt: jtSpacing.gap.sm,
              borderTop: 1,
              borderColor: 'border.subtle',
            }}
          >
            {stats.map((stat, index) => (
              <Stack
                key={stat.label}
                spacing={jtSpacing.gap.xs}
                sx={
                  statsInRows && index
                    ? { pt: jtSpacing.gap.sm, borderTop: 1, borderColor: 'border.subtle' }
                    : undefined
                }
              >
                <Typography
                  variant={statsInRows ? 'statNumberCompact' : 'statNumber'}
                  component="p"
                  sx={{ color: accent }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'base.100' }}>
                  <CitedText text={stat.label} />
                </Typography>
              </Stack>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
