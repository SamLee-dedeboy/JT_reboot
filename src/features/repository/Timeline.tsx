// The documentation timeline: a date column, a line with a dot for each year and workshop, and
// each workshop's documents as cards. The line fills green as the reader scrolls past it.
import { useRef, type ComponentType, type ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import type { BoxProps } from '@mui/material'
import { motion, useReducedMotion, useScroll, useSpring, type MotionProps } from 'framer-motion'
import { ResourceReportCard, ScrollReveal } from '@/ui'
import { jtSpacing, navigation } from '@/theme'
import { DOC_YEARS, type Workshop } from './data/docYears'

type MotionBoxProps = Omit<BoxProps, keyof MotionProps> & MotionProps
const MotionBox = motion.create(Box) as ComponentType<MotionBoxProps>

const DATE_COLUMN = '9rem'
const SPINE_COLUMN = '2.5rem'

/** One row of the timeline: its date, its stretch of the line with a dot, and its content. */
function TimelineRow({
  id,
  date,
  marker,
  markerTop,
  first = false,
  last = false,
  children,
}: {
  id?: string
  date: ReactNode
  marker: ReactNode
  /** Distance from the row's top to the dot's centre, in px; the line starts or ends there. */
  markerTop: number
  first?: boolean
  last?: boolean
  children?: ReactNode
}) {
  const rowRef = useRef<HTMLLIElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start 65%', 'end 65%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const lineSx = {
    position: 'absolute',
    // Not a translate: the fill's scale owns the transform.
    left: 'calc(50% - 1px)',
    width: 2,
    top: first ? `${markerTop}px` : 0,
    bottom: last ? `calc(100% - ${markerTop}px)` : 0,
  } as const

  return (
    <Box
      component="li"
      id={id}
      ref={rowRef}
      sx={{
        listStyle: 'none',
        display: 'grid',
        gridTemplateAreas: { xs: '"spine date" "spine body"', md: '"date spine body"' },
        gridTemplateColumns: {
          xs: `${SPINE_COLUMN} minmax(0, 1fr)`,
          md: `${DATE_COLUMN} ${SPINE_COLUMN} minmax(0, 1fr)`,
        },
        columnGap: { xs: jtSpacing.gap.sm, md: jtSpacing.gap.md },
        scrollMarginTop: `${navigation.pageRailTop}px`,
      }}
    >
      <Box
        sx={{
          gridArea: 'date',
          display: 'flex',
          justifyContent: { md: 'flex-end' },
          textAlign: { md: 'right' },
        }}
      >
        {date}
      </Box>

      {/* This row's stretch of the line, filled as it scrolls past, and its dot */}
      <Box aria-hidden sx={{ gridArea: 'spine', position: 'relative' }}>
        <Box sx={{ ...lineSx, bgcolor: 'border.default' }} />
        {!reduceMotion && (
          <MotionBox
            style={{ scaleY: fill }}
            sx={{ ...lineSx, bgcolor: 'primary.main', transformOrigin: 'top' }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: `${markerTop}px`,
            transform: 'translate(-50%, -50%)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {marker}
        </Box>
      </Box>

      <Box sx={{ gridArea: 'body', minWidth: 0 }}>{children}</Box>
    </Box>
  )
}

/** A dot that grows into place the first time it scrolls into view. */
function Dot({ size, filled, pulse = false }: { size: number; filled: boolean; pulse?: boolean }) {
  const reduceMotion = useReducedMotion()

  return (
    <MotionBox
      initial={reduceMotion ? false : { scale: 0 }}
      whileInView={reduceMotion ? undefined : { scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -20% 0px' }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      sx={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: filled ? 'primary.main' : 'brand.base',
        border: filled ? 0 : 2,
        borderColor: 'primary.main',
        boxShadow: (theme) => `0 0 0 6px ${theme.palette.brand.base}`,
      }}
    >
      {/* The newest workshop's dot breathes a soft ring */}
      {pulse && !reduceMotion && (
        <MotionBox
          animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          sx={{ position: 'absolute', inset: 0, borderRadius: '50%', bgcolor: 'primary.main' }}
        />
      )}
    </MotionBox>
  )
}

function WorkshopRow({
  workshop,
  latest,
  last,
}: {
  workshop: Workshop
  latest: boolean
  last: boolean
}) {
  return (
    <TimelineRow
      id={workshop.id}
      markerTop={16}
      last={last}
      marker={<Dot size={latest ? 16 : 14} filled={latest} pulse={latest} />}
      date={
        <Typography
          variant="h4"
          component="time"
          dateTime={workshop.isoDate}
          sx={{ display: 'block', pt: { md: jtSpacing.component.xs } }}
        >
          {workshop.day}
        </Typography>
      }
    >
      <Box sx={{ pb: last ? 0 : { xs: jtSpacing.section.sm, md: jtSpacing.section.md } }}>
        <ScrollReveal sx={{ mb: jtSpacing.component.lg }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: jtSpacing.gap.sm,
              mt: { xs: jtSpacing.component.xs, md: 0 },
            }}
          >
            <Typography variant="h3" component="h3">
              {workshop.title}
            </Typography>
            {latest && (
              <Typography
                variant="eyebrow"
                component="span"
                sx={{
                  px: jtSpacing.component.sm,
                  py: jtSpacing.gap.xs / 2,
                  borderRadius: 999,
                  bgcolor: 'translucent.primaryGreen',
                  color: 'primary.main',
                }}
              >
                Latest
              </Typography>
            )}
          </Box>
          {workshop.tag && (
            <Typography variant="body1" sx={{ mt: jtSpacing.component.xs, color: 'base.100' }}>
              {workshop.tag}
            </Typography>
          )}
        </ScrollReveal>

        {/* The workshop's documents, revealed one after another */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: jtSpacing.gap.lg,
          }}
        >
          {workshop.docs.map((doc, index) => (
            <ScrollReveal key={`${doc.title}-${index}`} delay={index * 0.07}>
              <ResourceReportCard
                badge={doc.badge}
                title={doc.title}
                image={doc.green ? undefined : doc.img}
                coverLabel={workshop.title}
                description={doc.desc}
                titleComponent="h4"
                actions={doc.actions.map((action) => ({
                  label: action.label,
                  href: action.href,
                  kind: action.kind === 'view' ? 'view' : 'download',
                }))}
              />
            </ScrollReveal>
          ))}
        </Box>
      </Box>
    </TimelineRow>
  )
}

export default function Timeline() {
  const lastYear = DOC_YEARS.length - 1

  return (
    <Box component="ol" sx={{ m: 0, p: 0 }}>
      {DOC_YEARS.map((year, yearIndex) => (
        <Box component="li" key={year.year} sx={{ listStyle: 'none' }}>
          <Box component="ol" sx={{ m: 0, p: 0 }}>
            {/* The year: a large green dot and the year beside a rule */}
            <TimelineRow
              id={`year-${year.year}`}
              markerTop={22}
              first={yearIndex === 0}
              marker={<Dot size={20} filled />}
              date={
                <Typography variant="numberTimeline" component="h2" sx={{ color: 'primary.main' }}>
                  {year.year}
                </Typography>
              }
            >
              {/* A rule level with the year's dot (twice its 22 px offset tall, centred) */}
              <Box
                aria-hidden
                sx={{
                  height: 44,
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  mb: jtSpacing.section.sm,
                  '&::after': { content: '""', flex: 1, height: '1px', bgcolor: 'border.default' },
                }}
              />
              <Box
                sx={{ display: { md: 'none' }, height: (theme) => theme.spacing(jtSpacing.gap.lg) }}
              />
            </TimelineRow>

            {year.workshops.map((workshop, workshopIndex) => (
              <WorkshopRow
                key={workshop.id}
                workshop={workshop}
                latest={yearIndex === 0 && workshopIndex === 0}
                last={yearIndex === lastYear && workshopIndex === year.workshops.length - 1}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}
