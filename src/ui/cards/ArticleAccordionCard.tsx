// One research article in an accordion. Closed, it is a single row: number, title, source and
// year. Open, it becomes a reading card: a source / authors / year table, then the abstract.
import { useId, type ComponentType, type ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import type { BoxProps } from '@mui/material'
import { AnimatePresence, motion, useReducedMotion, type MotionProps } from 'framer-motion'
import Icon from '../Icon'
import { ActionButton } from '../ActionLink'
import { focusRing } from '../focusRing'
import { jtSpacing } from '@/theme'

type MotionBoxProps = Omit<BoxProps, keyof MotionProps> & MotionProps
const MotionBox = motion.create(Box) as ComponentType<MotionBoxProps>

export interface ArticleAccordionCardProps {
  number: string
  title: string
  source: string
  authors?: string
  /** The authors as cited in the closed row, e.g. "Rudnick et al.". */
  citation?: string
  year?: string
  /** The abstract's label, such as "Abstract" or "Highlights". */
  kicker?: string
  /** Where the article lives; without one, no "Open the source" button shows. */
  href?: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}

const EASE = [0.4, 0, 0.2, 1] as const

export default function ArticleAccordionCard({
  number,
  title,
  source,
  authors,
  citation,
  year,
  kicker = 'Abstract',
  href,
  open,
  onToggle,
  children,
}: ArticleAccordionCardProps) {
  const panelId = useId()
  const reduceMotion = useReducedMotion()
  const facts = [
    { label: 'Source', value: source },
    { label: 'Authors', value: authors },
    { label: 'Year', value: year },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value))

  return (
    <Box
      sx={{
        bgcolor: open ? 'base.700' : 'surface',
        border: 1,
        borderColor: open ? 'primary.main' : 'border.subtle',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'border-color 220ms ease, background-color 220ms ease',
        '&:hover': { borderColor: open ? 'primary.main' : 'translucent.primaryGreen' },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr) auto',
          gap: { xs: jtSpacing.gap.sm, sm: jtSpacing.gap.md },
          alignItems: 'center',
          textAlign: 'left',
          bgcolor: 'transparent',
          border: 0,
          cursor: 'pointer',
          color: 'common.white',
          px: { xs: jtSpacing.component.md, sm: jtSpacing.gap.lg },
          py: { xs: jtSpacing.component.sm, sm: jtSpacing.component.md },
          '&:focus-visible': focusRing,
          '&:hover .article-title': { color: 'primary.main' },
        }}
      >
        <Typography variant="numberArticle" component="span">
          {number}
        </Typography>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            className="article-title"
            variant="cardTitle"
            component="h3"
            sx={{ color: 'common.white', transition: 'color 180ms ease' }}
          >
            {title}
          </Typography>
          {!open && (
            <Typography variant="body2" component="p" sx={{ mt: jtSpacing.component.xs }}>
              <Box component="span" sx={{ color: 'primary.main' }}>
                {source}
              </Box>
              {(citation || year) && (
                <Box component="span" sx={{ color: 'base.200' }}>
                  {` · ${[citation, year].filter(Boolean).join(', ')}`}
                </Box>
              )}
            </Typography>
          )}
        </Box>
        <MotionBox
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: EASE }}
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            color: 'primary.main',
            bgcolor: open ? 'translucent.primaryGreen' : 'transparent',
          }}
        >
          <Icon name="chevron-down" size={20} />
        </MotionBox>
      </Box>

      <AnimatePresence initial={false}>
        {open && (
          <MotionBox
            id={panelId}
            key="panel"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={
              reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.36, ease: EASE }}
            sx={{ overflow: 'hidden' }}
          >
            <Box
              sx={{
                px: { xs: jtSpacing.component.md, sm: jtSpacing.gap.lg },
                pb: { xs: jtSpacing.component.lg, sm: jtSpacing.component.xl },
              }}
            >
              {/* The citation as a small table */}
              <Box
                component="dl"
                sx={{
                  m: 0,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'max-content minmax(0, 1fr)' },
                  columnGap: jtSpacing.gap.lg,
                  rowGap: { xs: jtSpacing.gap.xs, sm: jtSpacing.gap.sm },
                }}
              >
                {facts.map((fact) => (
                  <Box key={fact.label} sx={{ display: 'contents' }}>
                    <Typography
                      variant="columnHead"
                      component="dt"
                      sx={{ color: 'base.200', pt: { sm: jtSpacing.gap.xs / 2 } }}
                    >
                      {fact.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="dd"
                      sx={{
                        m: 0,
                        mb: { xs: jtSpacing.gap.xs, sm: 0 },
                        color: fact.label === 'Source' ? 'primary.main' : 'base.50',
                      }}
                    >
                      {fact.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box
                aria-hidden
                sx={{ height: '1px', bgcolor: 'border.default', my: jtSpacing.component.lg }}
              />

              <Typography
                variant="eyebrow"
                component="p"
                sx={{ color: 'secondary.main', mb: jtSpacing.component.sm }}
              >
                {kicker}
              </Typography>
              <Box sx={{ maxWidth: '75ch' }}>{children}</Box>

              {href && (
                <ActionButton
                  label="Open the source"
                  href={href}
                  sx={{ mt: jtSpacing.component.lg }}
                />
              )}
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  )
}
