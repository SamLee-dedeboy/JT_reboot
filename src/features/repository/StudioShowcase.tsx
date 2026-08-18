// Repository showcase section for highlighting studio outputs and supporting
// materials.
import { Box, Typography } from '@mui/material'
import ScrollReveal from '../../ui/animation/ScrollReveal'
import Eyebrow from '../../ui/Eyebrow'
import StudioFeatureCard from '../../ui/cards/StudioFeatureCard'
import { STUDIOS } from './data/studios'
import { jtSpacing } from '../../theme'

/** Alternating left/right feature rows for the design studios. */
export default function StudioShowcase() {
  return (
    <Box>
      <ScrollReveal
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: jtSpacing.gap.md,
          mb: jtSpacing.component.xl,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="numberTimeline" component="span">
          2025
        </Typography>
        <Eyebrow sx={{ color: 'secondary.main' }}>Undergraduate Design Studios</Eyebrow>
      </ScrollReveal>

      {STUDIOS.map((s, i) => (
        <ScrollReveal key={s.title + s.place} delay={0.04}>
          <StudioFeatureCard
            number={s.n}
            title={s.title}
            place={s.place}
            body={s.desc}
            image={s.img}
            imageAlt={`${s.title} - ${s.place}`}
            flip={i % 2 === 1}
            actionLabel="Download"
          />
        </ScrollReveal>
      ))}
    </Box>
  )
}
