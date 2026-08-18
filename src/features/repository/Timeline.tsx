// Repository timeline grouped by year and workshop milestone.
import { Box, Typography } from '@mui/material'
import ScrollReveal from '../../ui/animation/ScrollReveal'
import ResourceReportCard from '../../ui/cards/ResourceReportCard'
import { DOC_YEARS } from './data/docYears'
import { jtSpacing } from '../../theme'

export default function Timeline() {
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        pl: { xs: jtSpacing.component.xl, sm: jtSpacing.section.lg },
        '&::before': {
          content: '""',
          position: 'absolute',
          left: theme.spacing(2),
          top: theme.spacing(1),
          bottom: theme.spacing(4),
          width: 2,
          bgcolor: 'translucent.primaryGreen',
        },
      })}
    >
      {DOC_YEARS.map((year) => (
        <Box
          key={year.year}
          sx={{
            position: 'relative',
            mt: jtSpacing.section.lg,
            mb: jtSpacing.component.lg,
            '&:first-of-type': { mt: 0 },
          }}
        >
          {/* Year marker establishes the primary level of the timeline. */}
          <ScrollReveal
            sx={(theme) => ({
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: { xs: theme.spacing(-4), sm: theme.spacing(-8) },
                top: theme.spacing(0.5),
                width: 16,
                height: 16,
                borderRadius: 999,
                bgcolor: 'primary.main',
                boxShadow: `0 0 0 5px ${theme.palette.brand.base}`,
              },
            })}
          >
            <Typography variant="numberTimeline" component="h2">
              {year.year}
            </Typography>
          </ScrollReveal>

          {year.workshops.map((workshop) => (
            <Box
              key={`${workshop.title}-${workshop.date}`}
              sx={(theme) => ({
                position: 'relative',
                mb: jtSpacing.component.xl,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: { xs: theme.spacing(-3.625), sm: theme.spacing(-7.625) },
                  top: theme.spacing(1),
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  bgcolor: 'secondary.light',
                  boxShadow: `0 0 0 4px ${theme.palette.brand.base}`,
                },
              })}
            >
              {/* Workshop heading labels the document group below it. */}
              <ScrollReveal sx={{ mb: jtSpacing.component.md }}>
                <Typography
                  variant="eyebrow"
                  component="p"
                  sx={{ color: 'secondary.main', mb: jtSpacing.component.xs }}
                >
                  {workshop.date}
                </Typography>
                <Typography variant="h4" component="h3">
                  {workshop.title}
                </Typography>
                {workshop.tag && (
                  <Typography variant="body2" sx={{ mt: jtSpacing.component.xs, opacity: 0.7 }}>
                    {workshop.tag}
                  </Typography>
                )}
              </ScrollReveal>

              {/* Responsive report grid contains the workshop's downloadable materials. */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns:
                    workshop.docs.length === 1
                      ? 'minmax(0, 460px)'
                      : 'repeat(auto-fill, minmax(270px, 1fr))',
                  gap: jtSpacing.gap.lg,
                }}
              >
                {workshop.docs.map((doc, index) => (
                  <ScrollReveal key={`${doc.title}-${index}`} delay={index * 0.05}>
                    <ResourceReportCard
                      badge={doc.badge}
                      title={doc.title}
                      image={doc.img}
                      description={doc.desc}
                      actions={doc.actions.map((action) => ({
                        label: action.label,
                        href: action.href,
                        kind: action.kind === 'dl' ? 'download' : 'view',
                      }))}
                    />
                  </ScrollReveal>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}
