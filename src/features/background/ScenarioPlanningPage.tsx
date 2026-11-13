// The Participatory Scenario Planning page (Background menu): a photo hero, the process, two
// workshop photos edge to edge, co-design beside its board photo, and the project timeline on
// a line, with 2026, the present, as its emphasized step. Words live in
// src/content/scenarioPlanning.ts.
import type { ComponentType, ReactNode } from 'react'
import { Box, Container, Typography } from '@mui/material'
import type { BoxProps } from '@mui/material'
import { motion, useReducedMotion, type MotionProps } from 'framer-motion'
import { ActionButton, Footer, Navbar, ScrollReveal, SectionHead } from '@/ui'
import { jtSpacing } from '@/theme'
import { assetUrl } from '@/utils/baseUrl'
import {
  PSP_CODESIGN,
  PSP_CURRENT_YEAR,
  PSP_HERO,
  PSP_PAST_YEARS,
  PSP_PHOTOS,
  PSP_PROCESS,
  PSP_TIMELINE,
} from '@/content/scenarioPlanning'

type MotionBoxProps = Omit<BoxProps, keyof MotionProps> & MotionProps
const MotionBox = motion.create(Box) as ComponentType<MotionBoxProps>

/** The page's content column, matching the repository pages. */
const contentWidth = { width: '90dvw', px: 0 } as const
const sectionPy = { xs: jtSpacing.section.lg, md: jtSpacing.section.xl } as const

/** A section's lead paragraph and the quieter one after it. */
function LeadAndBody({ lead, body }: { lead: ReactNode; body: string }) {
  return (
    <ScrollReveal delay={0.08}>
      <Typography variant="body1" sx={{ color: 'common.white' }}>
        {lead}
      </Typography>
      <Typography variant="body1" sx={{ mt: jtSpacing.component.lg, color: 'base.100' }}>
        {body}
      </Typography>
    </ScrollReveal>
  )
}

/** A diagram on a bordered panel. */
function DiagramFigure({ src, alt }: { src: string; alt: string }) {
  return (
    <Box
      component="figure"
      sx={{
        m: 0,
        border: 1,
        borderColor: 'border.default',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'brand.base',
      }}
    >
      <Box
        component="img"
        src={assetUrl(src)}
        alt={alt}
        loading="lazy"
        sx={{ display: 'block', width: '100%', height: 'auto' }}
      />
    </Box>
  )
}

function Hero() {
  return (
    <Box
      component="header"
      id="top"
      sx={(theme) => ({
        minHeight: '88dvh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'flex-end',
        pt: jtSpacing.section.xl,
        pb: { xs: jtSpacing.section.md, md: jtSpacing.section.lg },
        backgroundImage: {
          xs: `linear-gradient(0deg, ${theme.palette.translucent[900]} 0%, ${theme.palette.translucent[700]} 55%, transparent 100%), url(${assetUrl(PSP_HERO.image)})`,
          md: `linear-gradient(90deg, ${theme.palette.translucent[900]} 0%, ${theme.palette.translucent[700]} 38%, transparent 72%), url(${assetUrl(PSP_HERO.image)})`,
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
      })}
    >
      <Container maxWidth={false} sx={contentWidth}>
        <ScrollReveal>
          {/* Two lines: the green accent word, then the rest of the title */}
          <Typography variant="h1" component="h1">
            <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
              {PSP_HERO.titleAccent}
            </Box>
            <Box component="span" sx={{ display: 'block' }}>
              {PSP_HERO.title}
            </Box>
          </Typography>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <Typography
            variant="bodyLarge"
            component="p"
            sx={{ maxWidth: '58ch', mt: jtSpacing.component.lg, color: 'base.50' }}
          >
            {PSP_HERO.lede}
          </Typography>
        </ScrollReveal>
      </Container>
    </Box>
  )
}

function Process() {
  return (
    <Box component="section" id={PSP_PROCESS.id} sx={{ bgcolor: 'base.600', py: sectionPy }}>
      <Container maxWidth={false} sx={contentWidth}>
        <Box sx={{ maxWidth: '70ch' }}>
          <SectionHead
            eyebrow={PSP_PROCESS.eyebrow}
            title={PSP_PROCESS.title}
            sx={{ mb: jtSpacing.section.sm }}
          />
          <LeadAndBody lead={PSP_PROCESS.lead} body={PSP_PROCESS.body} />
        </Box>
      </Container>
    </Box>
  )
}

function Photos() {
  return (
    <Box
      component="section"
      aria-label="Workshop photographs"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
        bgcolor: 'base.900',
      }}
    >
      {PSP_PHOTOS.map((photo) => (
        <Box component="figure" key={photo.image} sx={{ m: 0, position: 'relative' }}>
          <Box
            component="img"
            src={assetUrl(photo.image)}
            alt={photo.alt}
            loading="lazy"
            sx={{
              display: 'block',
              width: '100%',
              height: { xs: '68vw', md: '44vw' },
              maxHeight: 720,
              objectFit: 'cover',
            }}
          />
          <Typography
            variant="eyebrow"
            component="figcaption"
            sx={(theme) => ({
              position: 'absolute',
              insetInline: 0,
              bottom: 0,
              px: jtSpacing.gap.xl,
              pt: jtSpacing.section.sm,
              pb: jtSpacing.gap.lg,
              color: 'base.50',
              background: `linear-gradient(0deg, ${theme.palette.translucent[800]}, transparent)`,
            })}
          >
            {photo.caption}{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              · {photo.date}
            </Box>
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

function CoDesign() {
  return (
    <Box
      component="section"
      id={PSP_CODESIGN.id}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
        bgcolor: 'brand.base',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: sectionPy,
          // The left edge lines up with the 90dvw content column.
          pl: '5dvw',
          pr: { xs: '5dvw', md: jtSpacing.section.md },
        }}
      >
        <SectionHead
          eyebrow={PSP_CODESIGN.eyebrow}
          title={PSP_CODESIGN.title}
          sx={{ mb: jtSpacing.section.sm }}
        />
        <LeadAndBody lead={PSP_CODESIGN.lead} body={PSP_CODESIGN.body} />
      </Box>
      <Box
        component="figure"
        sx={{ m: 0, position: 'relative', minHeight: { xs: '68vw', md: 560 } }}
      >
        <Box
          component="img"
          src={assetUrl(PSP_CODESIGN.image)}
          alt={PSP_CODESIGN.alt}
          loading="lazy"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    </Box>
  )
}

/** Distance from a row's top to its dot's centre, in px; the line starts or ends there. */
const PAST_DOT_TOP = 16
const NOW_DOT_TOP = 24

/** One year on the line: the year, its stretch of the line with a dot, and its content. */
function YearRow({
  year,
  current = false,
  first = false,
  children,
}: {
  year: string
  current?: boolean
  first?: boolean
  children: ReactNode
}) {
  const reduceMotion = useReducedMotion()
  const dotTop = current ? NOW_DOT_TOP : PAST_DOT_TOP
  const dotSize = current ? 22 : 12
  const line = { position: 'absolute', left: 'calc(50% - 1px)', width: 2 } as const

  return (
    <Box
      component="li"
      sx={{
        listStyle: 'none',
        display: 'grid',
        gridTemplateAreas: { xs: '"spine year" "spine body"', md: '"year spine body"' },
        gridTemplateColumns: { xs: '2rem minmax(0, 1fr)', md: '8rem 3rem minmax(0, 1fr)' },
        columnGap: { xs: jtSpacing.gap.md, md: jtSpacing.gap.lg },
      }}
    >
      {/* The year sits level with its dot: a band twice the dot's offset tall, centred */}
      <Box
        sx={{
          gridArea: 'year',
          alignSelf: 'start',
          minHeight: { md: `${dotTop * 2}px` },
          display: 'flex',
          alignItems: 'center',
          justifyContent: { md: 'flex-end' },
        }}
      >
        <Typography
          variant={current ? 'h2' : 'h4'}
          component="p"
          sx={{ color: current ? 'primary.main' : 'base.200' }}
        >
          {year}
        </Typography>
      </Box>

      {/* This year's stretch of the line and its dot; past 2026 the line runs on dashed */}
      <Box aria-hidden sx={{ gridArea: 'spine', position: 'relative' }}>
        <Box
          sx={{
            ...line,
            top: first ? `${dotTop}px` : 0,
            ...(current ? { height: `${dotTop}px` } : { bottom: 0 }),
            bgcolor: 'primary.main',
          }}
        />
        {current && (
          <Box
            sx={{
              ...line,
              width: 0,
              top: `${dotTop}px`,
              bottom: 0,
              borderLeft: 2,
              borderLeftStyle: 'dashed',
              borderColor: 'primary.main',
              opacity: 0.45,
            }}
          />
        )}
        <Box
          sx={(theme) => ({
            position: 'absolute',
            left: '50%',
            top: `${dotTop}px`,
            width: dotSize,
            height: dotSize,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            bgcolor: 'primary.main',
            boxShadow: `0 0 0 6px ${theme.palette.base[700]}`,
          })}
        >
          {/* The present year's dot breathes a soft ring */}
          {current && !reduceMotion && (
            <MotionBox
              animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              sx={{ position: 'absolute', inset: 0, borderRadius: '50%', bgcolor: 'primary.main' }}
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          gridArea: 'body',
          minWidth: 0,
          pt: { xs: jtSpacing.component.sm, md: 0 },
          pb: { xs: jtSpacing.section.sm, md: jtSpacing.section.md },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

function CurrentYearCard() {
  const now = PSP_CURRENT_YEAR

  return (
    <Box
      id={now.id}
      sx={{
        p: { xs: jtSpacing.gap.lg, md: jtSpacing.section.sm },
        border: 1,
        borderColor: 'primary.main',
        borderRadius: 2,
        bgcolor: 'base.900',
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.15fr) minmax(0, 0.85fr)' },
        gap: { xs: jtSpacing.section.sm, lg: jtSpacing.section.md },
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography
          variant="eyebrow"
          component="span"
          sx={{
            display: 'inline-block',
            mb: jtSpacing.component.md,
            px: jtSpacing.component.sm,
            py: jtSpacing.gap.xs / 2,
            borderRadius: 999,
            bgcolor: 'translucent.primaryGreen',
            color: 'primary.main',
          }}
        >
          {now.badge}
        </Typography>
        <Typography variant="h2" component="h3" sx={{ mb: jtSpacing.component.lg }}>
          {now.title}
        </Typography>
        <Typography variant="body1" sx={{ color: 'common.white' }}>
          {now.lead}
        </Typography>
        {now.body.map((paragraph) => (
          <Typography
            key={paragraph}
            variant="body1"
            sx={{ mt: jtSpacing.component.md, color: 'base.100' }}
          >
            {paragraph}
          </Typography>
        ))}
        <ActionButton {...now.link} sx={{ mt: jtSpacing.component.xl }} />
      </Box>
      <DiagramFigure src={now.diagram} alt={now.diagramAlt} />
    </Box>
  )
}

function Timeline() {
  const intro = PSP_TIMELINE.intro

  return (
    <Box component="section" id={PSP_TIMELINE.id} sx={{ bgcolor: 'base.700', py: sectionPy }}>
      <Container maxWidth={false} sx={contentWidth}>
        <Box sx={{ maxWidth: '70ch' }}>
          <SectionHead
            eyebrow={PSP_TIMELINE.eyebrow}
            title={PSP_TIMELINE.title}
            sx={{ mb: jtSpacing.section.sm }}
          />
          <ScrollReveal delay={0.08}>
            <Typography variant="body1" sx={{ color: 'common.white' }}>
              {intro.before}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                {intro.blue}
              </Box>
              {intro.middle}
              <Box component="span" sx={{ color: 'primary.main' }}>
                {intro.green}
              </Box>
              {intro.after}
            </Typography>
          </ScrollReveal>
        </Box>

        <ScrollReveal sx={{ mt: jtSpacing.section.md }}>
          <DiagramFigure src={PSP_TIMELINE.diagram} alt={PSP_TIMELINE.diagramAlt} />
        </ScrollReveal>

        <Box
          component="ol"
          aria-label="Year by year"
          sx={{ m: 0, p: 0, mt: { xs: jtSpacing.section.md, md: jtSpacing.section.lg } }}
        >
          {PSP_PAST_YEARS.map((entry, index) => (
            <YearRow key={entry.year} year={entry.year} first={index === 0}>
              <ScrollReveal>
                <Typography
                  variant="cardHeading"
                  component="h3"
                  sx={{ color: 'base.50', mb: jtSpacing.component.sm }}
                >
                  {entry.label}
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '78ch', color: 'base.100' }}>
                  {entry.text}
                </Typography>
              </ScrollReveal>
            </YearRow>
          ))}
          <YearRow year={PSP_CURRENT_YEAR.year} current>
            <ScrollReveal>
              <CurrentYearCard />
            </ScrollReveal>
          </YearRow>
        </Box>
      </Container>
    </Box>
  )
}

export default function ScenarioPlanningPage() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ color: 'common.white' }}>
        <Hero />
        <Process />
        <Photos />
        <CoDesign />
        <Timeline />
      </Box>
      <Footer />
    </>
  )
}
