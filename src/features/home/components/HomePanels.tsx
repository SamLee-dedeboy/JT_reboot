// The home page's four narrative panels, top to bottom. Each is the shared HomePanel frame
// plus its own body; their words live in src/content/home.ts.
import { alpha, Box, Button, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import {
  FUTURES,
  HOME_SECTIONS,
  STAKE_SECTIONS,
  WHAT_IF,
  WORK_STEPS,
  WORKS_INTRO,
} from '../../../content/home'
import { ActionButton, TextLink } from '../../../ui/ActionLink'
import { textLinkSx } from '../../../ui/actionStyles'
import ScrollReveal from '../../../ui/animation/ScrollReveal'
import { emphasize } from '../../../utils/highlightText'
import HomePanel from './HomePanel'

interface PanelProps {
  bg: string
}

// ---------- What if? ----------

export function WhatIfPanel({ bg }: PanelProps) {
  const theme = useTheme()
  return (
    <HomePanel
      section={HOME_SECTIONS.whatIf}
      bg={bg}
      maxWidth={theme.jtSpacing.paragraphMaxWidth.default}
      headSx={{ pt: theme.jtSpacing.component.lg, mb: theme.jtSpacing.section.sm }}
      sx={{
        minHeight: '80dvh',
        pt: { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.lg },
        pb: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
        color: 'brand.primaryBlue',
      }}
    >
      <ScrollReveal>
        {WHAT_IF.blocks.map((block, index) =>
          block.kind === 'questions' ? (
            <Typography
              key={index}
              variant="bodyLarge"
              component="p"
              sx={{ mt: index === 0 ? 0 : theme.jtSpacing.section.sm, color: 'base.50' }}
            >
              {block.lines.map((line) => (
                <Box key={line} component="span" sx={{ display: 'block' }}>
                  {line}
                </Box>
              ))}
            </Typography>
          ) : (
            <Typography
              key={index}
              variant="editorialEmphasis"
              component="p"
              sx={{ mt: theme.jtSpacing.section.sm }}
            >
              {block.text}
            </Typography>
          ),
        )}
        <Box sx={{ mt: theme.jtSpacing.component.lg }}>
          <ActionButton {...WHAT_IF.cta} />
        </Box>
      </ScrollReveal>
    </HomePanel>
  )
}

// ---------- What futures? ----------

export function FuturesPanel({ bg }: PanelProps) {
  const theme = useTheme()
  return (
    <HomePanel section={HOME_SECTIONS.futures} bg={bg} maxWidth="80ch">
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: `repeat(${FUTURES.length}, minmax(0, 1fr))`,
          gap: theme.jtSpacing.section.md,
        }}
      >
        {FUTURES.map((future, index) => (
          <ScrollReveal
            key={future.title}
            component="article"
            delay={index * 0.1}
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <Typography variant="h3" component="h3" sx={{ color: 'primary.main' }}>
              {future.title}
            </Typography>
            <Typography
              variant="bodyLarge"
              sx={{ color: 'common.white', mt: theme.jtSpacing.component.md }}
            >
              {future.body}
            </Typography>
          </ScrollReveal>
        ))}
      </Box>
    </HomePanel>
  )
}

// ---------- What's at stake? ----------

function StakeSection({
  section,
  index,
}: {
  section: (typeof STAKE_SECTIONS)[number]
  index: number
}) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  return (
    <ScrollReveal component="article" delay={index * 0.1}>
      <Typography variant="h3" component="h3" sx={{ color: 'primary.main' }}>
        {section.title}
      </Typography>
      <Typography
        component="p"
        variant="bodyLarge"
        sx={{ color: 'common.white', mt: theme.jtSpacing.component.md }}
      >
        {emphasize(section.introduction.join(' '), section.emphasize)}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          paddingTop: expanded ? theme.jtSpacing.component.lg : 0,
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 320ms ease, padding-top 320ms ease',
        }}
      >
        <Box sx={{ overflow: 'hidden' }}>
          {section.details.map((paragraph, detailIndex) => (
            <Typography
              key={paragraph}
              component="p"
              variant="bodyLarge"
              sx={{
                color: 'base.100',
                mt: detailIndex === 0 ? 0 : theme.jtSpacing.component.sm,
              }}
            >
              {emphasize(paragraph, section.emphasize)}
            </Typography>
          ))}
        </Box>
      </Box>
      <Button
        variant="text"
        disableRipple
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        sx={{ ...textLinkSx, mt: theme.jtSpacing.component.md }}
      >
        {expanded ? 'Show less' : 'Read more'}
      </Button>
    </ScrollReveal>
  )
}

export function StakesPanel({ bg }: PanelProps) {
  const theme = useTheme()
  return (
    <HomePanel section={HOME_SECTIONS.stakes} bg={bg} maxWidth="76ch">
      <Box sx={{ display: 'grid', gap: theme.jtSpacing.section.md }}>
        {STAKE_SECTIONS.map((section, index) => (
          <StakeSection key={section.title} section={section} index={index} />
        ))}
      </Box>
    </HomePanel>
  )
}

// ---------- How it works? ----------

// Ladder geometry (px): every step marker sits on one vertical line, like soundings on a depth line.
const MARKER_SIZE = 44
const LADDER_INSET = 72

export function WorksPanel({ bg }: PanelProps) {
  const theme = useTheme()
  const blue = theme.palette.brand.primaryBlue
  // Markers fade with each step so the list reads from shallow to deep.
  const depthTone = (index: number) => alpha(blue, 1 - (index / WORK_STEPS.length) * 0.7)

  return (
    <HomePanel
      section={HOME_SECTIONS.works}
      bg={bg}
      maxWidth="76ch"
      headSx={{ mb: theme.jtSpacing.component.lg }}
    >
      <ScrollReveal>
        <Typography
          variant="bodyLarge"
          sx={{ color: 'base.100', maxWidth: theme.jtSpacing.paragraphMaxWidth.default }}
        >
          {WORKS_INTRO.lead}
        </Typography>
      </ScrollReveal>
      <ScrollReveal sx={{ mt: theme.jtSpacing.section.md }}>
        <Typography
          variant="editorialEmphasis"
          component="p"
          sx={{ fontStyle: 'italic', color: 'common.white' }}
        >
          {WORKS_INTRO.stepsLead}
        </Typography>
      </ScrollReveal>
      <Box
        component="ol"
        sx={{
          listStyle: 'none',
          m: 0,
          mt: theme.jtSpacing.gap.lg,
          p: 0,
          pl: `${LADDER_INSET}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.jtSpacing.section.sm,
        }}
      >
        {WORK_STEPS.map((step, index) => (
          <ScrollReveal
            key={step.title}
            component="li"
            delay={index * 0.06}
            sx={{
              position: 'relative',
              // Each step draws the line down to the next marker, so it ends at the last one.
              '&:not(:last-of-type)::after': {
                content: '""',
                position: 'absolute',
                left: MARKER_SIZE / 2 - 1 - LADDER_INSET,
                top: MARKER_SIZE,
                height: `calc(100% - ${MARKER_SIZE}px + ${theme.spacing(theme.jtSpacing.section.sm)})`,
                width: 2,
                background: `linear-gradient(180deg, ${depthTone(index)}, ${depthTone(index + 1)})`,
              },
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                left: -LADDER_INSET,
                top: 0,
                width: MARKER_SIZE,
                height: MARKER_SIZE,
                boxSizing: 'border-box',
                borderRadius: '50%',
                border: 2,
                borderColor: depthTone(index),
                // The panel's own color, so the line stops at the marker's edge.
                bgcolor: bg,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Typography variant="numberBadge" component="span" sx={{ color: 'common.white' }}>
                {String(index + 1).padStart(2, '0')}
              </Typography>
            </Box>
            <Typography
              variant="editorialEmphasis"
              component="h3"
              sx={{ pt: 1, color: 'common.white' }}
            >
              {step.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: theme.jtSpacing.gap.xs,
                color: 'base.100',
                maxWidth: theme.jtSpacing.paragraphMaxWidth.default,
              }}
            >
              {step.text}
            </Typography>
            <Box
              sx={{
                mt: theme.jtSpacing.gap.xs,
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: theme.jtSpacing.gap.lg,
              }}
            >
              {step.links.map((link) => (
                <TextLink key={link.label} {...link} />
              ))}
            </Box>
          </ScrollReveal>
        ))}
      </Box>
    </HomePanel>
  )
}
