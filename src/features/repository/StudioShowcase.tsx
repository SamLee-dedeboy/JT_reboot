// The design studios as a grid of cards, with an open slot for the next studio.
import { Box, Typography } from '@mui/material'
import { Eyebrow, ScrollReveal, StudioFeatureCard } from '@/ui'
import { STUDIOS } from './data/studios'
import { jtSpacing } from '@/theme'

export default function StudioShowcase() {
  return (
    <Box>
      <ScrollReveal
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: jtSpacing.gap.md,
          mb: jtSpacing.component.xl,
        }}
      >
        <Typography variant="numberTimeline" component="h2">
          2025
        </Typography>
        <Eyebrow sx={{ color: 'primary.main' }}>Undergraduate Design Studios</Eyebrow>
        <Box
          aria-hidden
          sx={{ flex: '1 1 120px', height: '1px', alignSelf: 'center', bgcolor: 'border.default' }}
        />
      </ScrollReveal>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
          gap: jtSpacing.gap.xl,
        }}
      >
        {STUDIOS.map((studio, index) => (
          <ScrollReveal key={studio.title + studio.place} delay={(index % 2) * 0.08}>
            <StudioFeatureCard
              number={studio.n}
              title={studio.title}
              place={studio.place}
              body={studio.desc}
              image={studio.img}
              imageAlt={`${studio.title}, ${studio.place}`}
              actionLabel="Download"
            />
          </ScrollReveal>
        ))}

        {/* The slot the next studio will fill */}
        <ScrollReveal delay={(STUDIOS.length % 2) * 0.08}>
          <Box
            sx={{
              height: '100%',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: jtSpacing.gap.sm,
              p: jtSpacing.component.xl,
              border: '1.5px dashed',
              borderColor: 'border.strong',
              borderRadius: 2,
            }}
          >
            <Typography variant="numberGhost" component="p">
              {String(STUDIOS.length + 1).padStart(2, '0')}
            </Typography>
            <Typography variant="h4" component="h3">
              Next studio
            </Typography>
            <Typography variant="placeholderNote" component="p">
              New studios are added here as the coursework continues.
            </Typography>
          </Box>
        </ScrollReveal>
      </Box>
    </Box>
  )
}
