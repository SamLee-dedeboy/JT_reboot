import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Fragment } from 'react'
import { jtSpacing } from '@/theme'
import { type CriterionStory } from '@/content/criteria'
import { CitedText } from './citations'
import Diamond from './Diamond'
import { NumberedHeading } from '@/ui'
import { type SectionProps, methodologyTextColumnSx, sectionSx } from './criterionLayout'

/** A row of key numbers under a hairline, each with its label beneath. */
function FactRow({
  facts,
  accent,
}: {
  facts: Array<{ value: string; label: string; dates?: string[] }>
  accent: string
}) {
  return (
    <Box
      component="dl"
      sx={{
        m: 0,
        mt: jtSpacing.gap.md,
        pt: jtSpacing.gap.md,
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          md: `repeat(${facts.length}, minmax(0, 1fr))`,
        },
        gap: jtSpacing.gap.md,
        borderTop: 1,
        borderColor: 'border.subtle',
      }}
    >
      {facts.map((fact) => (
        <Box key={fact.label}>
          <Typography component="dd" variant="h4" sx={{ m: 0, color: accent }}>
            {fact.value}
          </Typography>
          <Typography component="dt" variant="body2" sx={{ color: 'base.100', mt: 0.5 }}>
            {fact.label}
          </Typography>
          {fact.dates?.map((date, index) => (
            <Typography
              key={date}
              component="dd"
              variant="factDate"
              sx={{ m: 0, mt: index ? 0 : 1, color: accent }}
            >
              {date}
            </Typography>
          ))}
        </Box>
      ))}
    </Box>
  )
}

/** What the engagement yielded, told as one sentence with its numbers picked out. */
function OutcomesSentence({
  outcomes,
  accent,
}: {
  outcomes: NonNullable<CriterionStory['construction']['outcomes']>
  accent: string
}) {
  const last = outcomes.facts.length - 1
  return (
    <Typography
      variant="body1"
      sx={{ ...methodologyTextColumnSx, color: 'base.50', mt: jtSpacing.gap.lg }}
    >
      {outcomes.intro}{' '}
      {outcomes.facts.map((fact, index) => (
        <Fragment key={fact.label}>
          {index > 0 && (last > 1 ? (index === last ? ', and ' : ', ') : ' and ')}
          <Typography component="span" variant="statInline" sx={{ color: accent }}>
            {fact.value}
          </Typography>{' '}
          {fact.label}
        </Fragment>
      ))}
      .
    </Typography>
  )
}

/** The team-colored diamond that marks a bullet, centred on its first line. */
/** Bullets in a tinted box, each with a team-colored diamond. */
function PointList({ points, accent }: { points: string[]; accent: string }) {
  return (
    <Box
      component="ul"
      sx={{
        m: 0,
        mt: jtSpacing.gap.xs,
        p: 0,
        listStyle: 'none',
        border: 1,
        borderColor: 'border.subtle',
        borderRadius: 1,
        bgcolor: 'translucent.100',
      }}
    >
      {points.map((point, pointIndex) => (
        <Box
          component="li"
          key={point}
          sx={{
            display: 'grid',
            gridTemplateColumns: '8px minmax(0, 1fr)',
            columnGap: jtSpacing.gap.sm,
            px: jtSpacing.component.md,
            py: jtSpacing.component.sm,
            borderTop: pointIndex ? 1 : 0,
            borderColor: 'border.subtle',
          }}
        >
          <Diamond accent={accent} />
          <Typography variant="body2" sx={{ color: 'base.100' }}>
            <CitedText text={point} />
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default function ConstructionSection({ story, accent }: SectionProps) {
  const { intro, facts, outcomes, points, paragraphs, steps } = story.construction
  return (
    <Box component="section" id="construction" aria-labelledby="construction-title" sx={sectionSx}>
      <NumberedHeading
        variant="h3"
        title="How was this criterion constructed?"
        id="construction-title"
        accent={accent}
      />
      <Typography variant="body1" sx={{ ...methodologyTextColumnSx, color: 'base.50' }}>
        <CitedText text={intro} />
      </Typography>

      {/* Key numbers behind the criterion, read before the step-by-step */}
      {facts.length > 0 && <FactRow facts={facts} accent={accent} />}
      {outcomes && <OutcomesSentence outcomes={outcomes} accent={accent} />}
      {points && (
        <Box sx={{ ...methodologyTextColumnSx, mt: jtSpacing.gap.md }}>
          <PointList points={points} accent={accent} />
        </Box>
      )}
      {paragraphs && (
        <Stack spacing={jtSpacing.gap.md} sx={{ ...methodologyTextColumnSx, mt: jtSpacing.gap.md }}>
          {paragraphs.map((paragraph) => (
            <Typography key={paragraph} variant="body1" sx={{ color: 'base.100' }}>
              <CitedText text={paragraph} />
            </Typography>
          ))}
        </Stack>
      )}

      {/* Steps in order along a rail; each node carries the step number */}
      <Box
        component="ol"
        sx={{
          m: 0,
          p: 0,
          mt: steps.length ? jtSpacing.section.sm : 0,
          listStyle: 'none',
        }}
      >
        {steps.map((step, index) => (
          <Box
            component="li"
            key={step.title}
            sx={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '40px minmax(0, 1fr)',
              columnGap: { xs: jtSpacing.gap.md, md: jtSpacing.gap.lg },
              pb: index === steps.length - 1 ? 0 : jtSpacing.component.lg,
              '&::before':
                index === steps.length - 1
                  ? undefined
                  : {
                      content: '""',
                      position: 'absolute',
                      left: 19,
                      top: 40,
                      bottom: 0,
                      borderLeft: 2,
                      borderColor: alpha(accent, 0.35),
                    },
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: 2,
                borderColor: accent,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'base.800',
              }}
            >
              <Typography variant="numberBadge" component="span" sx={{ color: accent }}>
                {String(index + 1).padStart(2, '0')}
              </Typography>
            </Box>
            <Stack spacing={jtSpacing.gap.xs} sx={{ ...methodologyTextColumnSx, pt: 0.75 }}>
              {step.when && (
                <Typography variant="navigationSubLabel" component="p" sx={{ color: accent }}>
                  {step.when}
                </Typography>
              )}
              <Typography variant="h4" component="h3">
                {step.title}
              </Typography>
              {step.body && (
                <Typography variant="body1" sx={{ color: 'base.100' }}>
                  <CitedText text={step.body} />
                </Typography>
              )}
              {step.points && <PointList points={step.points} accent={accent} />}
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
