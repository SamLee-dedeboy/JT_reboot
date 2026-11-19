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
} from '@/content/home'
import { ActionButton, Icon, ScrollReveal, TextLink } from '@/ui'
import { textLinkSx } from '@/ui/actionStyles'
import { emphasize, highlightPhrases } from '@/utils/highlightText'
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
            // The turns in the argument, in the brand blue (4.6:1 on the panel's deep teal).
            <Typography
              key={index}
              variant="editorialEmphasis"
              component="p"
              sx={{ mt: theme.jtSpacing.section.sm, color: 'brand.primaryBlue' }}
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

/** A key term in the "What futures?" answers, set in the brand green. */
const markGreen = (phrase: string, key: number) => (
  <Box key={key} component="span" sx={{ color: 'primary.main' }}>
    {phrase}
  </Box>
)

export function FuturesPanel({ bg }: PanelProps) {
  const theme = useTheme()
  const { scenarios } = FUTURES
  // Open space, not a rule, keeps the three answers apart.
  const planningGap = { xs: theme.jtSpacing.section.md, md: theme.jtSpacing.section.lg }
  return (
    <HomePanel section={HOME_SECTIONS.futures} bg={bg} maxWidth="80ch">
      {/* Scenarios, the idea, as one statement; then what the method is and why to use it. */}
      <ScrollReveal component="article">
        <Typography variant="h3" component="h3" sx={{ color: 'common.white' }}>
          {scenarios.label}
        </Typography>
        <Typography
          variant="bodyLargeStrong"
          component="p"
          sx={{ color: 'common.white', mt: theme.jtSpacing.component.md }}
        >
          {highlightPhrases(scenarios.statement, scenarios.highlights, markGreen)}
        </Typography>
      </ScrollReveal>
      <Box sx={{ display: 'grid', gap: planningGap, mt: planningGap }}>
        {FUTURES.planning.map((item, index) => (
          <ScrollReveal key={item.title} component="article" delay={(index + 1) * 0.1}>
            <Typography
              variant="h3"
              component="h3"
              sx={{ color: item.accent === 'why' ? 'secondary.main' : 'common.white' }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="bodyLarge"
              component="p"
              sx={{ color: 'common.white', mt: theme.jtSpacing.component.md }}
            >
              {highlightPhrases(item.body, item.highlights, markGreen)}
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
        // The chevron says the text opens in place; it turns over once it has.
        endIcon={
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 320ms ease',
            }}
          >
            <Icon name="chevron-down" size={18} />
          </Box>
        }
        sx={{
          ...textLinkSx,
          // The chevron opens text in place, so it holds still; the → nudge is for links.
          '&:hover .MuiButton-endIcon': { transform: 'none' },
          mt: theme.jtSpacing.component.md,
        }}
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
// A phone gets smaller markers and a shallower inset so the step text keeps its width.
const LADDER = {
  xs: { marker: 36, inset: 52 },
  md: { marker: 44, inset: 72 },
} as const

/** One value per ladder breakpoint, built from that breakpoint's marker size and inset. */
const byLadder = <T,>(value: (geometry: { marker: number; inset: number }) => T) => ({
  xs: value(LADDER.xs),
  md: value(LADDER.md),
})

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
          component="p"
          sx={{ color: 'common.white', maxWidth: theme.jtSpacing.paragraphMaxWidth.default }}
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
          pl: byLadder(({ inset }) => `${inset}px`),
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
                left: byLadder(({ marker, inset }) => marker / 2 - 1 - inset),
                top: byLadder(({ marker }) => marker),
                height: byLadder(
                  ({ marker }) =>
                    `calc(100% - ${marker}px + ${theme.spacing(theme.jtSpacing.section.sm)})`,
                ),
                width: 2,
                background: `linear-gradient(180deg, ${depthTone(index)}, ${depthTone(index + 1)})`,
              },
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                left: byLadder(({ inset }) => -inset),
                top: 0,
                width: byLadder(({ marker }) => marker),
                height: byLadder(({ marker }) => marker),
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
              component="p"
              sx={{
                // The same heading-to-text space as every other panel on the page.
                mt: theme.jtSpacing.component.md,
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
