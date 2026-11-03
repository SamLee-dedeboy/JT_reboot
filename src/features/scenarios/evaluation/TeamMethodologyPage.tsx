// One evaluation team's criterion, condensed from its "Story Behind the
// Criterion" report into a technical summary: what it is, why it matters, how
// it was built, and how each component is measured. Scenario results live on
// the per-scenario team pages.
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  Box,
  Button,
  ButtonBase,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { alpha, type Theme } from '@mui/material/styles'
import { Fragment, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Label } from '../../../internal/rank-visualization/subteams/RegionMap'
import {
  REGION_SHAPES,
  REGION_TEAM_VIEWBOX,
  WATERWAY_PATH,
} from '../../../internal/rank-visualization/subteams/regionShapes'
import { jtSpacing } from '../../../theme'
import Footer from '../../../ui/Footer'
import Navbar from '../../../ui/Navbar'
import StageChip from '../../../ui/StageChip'
import PageRail from '../../../ui/PageRail'
import TeamIcon from '../../../ui/TeamIcon'
import {
  criterionReferences,
  criterionRegions,
  criterionStories,
  type CriterionRegions,
  type CriterionStory,
  type StoryTable,
} from '../content'
import { teamStyle } from '../teamStyle'
import { findTeam, methodologyPath } from './paths'
import { CitedText } from './citations'
import { CitationContext, referenceId } from './citationContext'
import { CaveatsPanel, Diamond, EvaluationHero, SectionHeading, TeamTabs } from './shared'

export default function TeamMethodologyPage() {
  const { teamId } = useParams()
  const team = findTeam(teamId)
  if (!team) return <Navigate to="/scenarios/evaluation" replace />
  const story = criterionStories[team.id]
  const { color, icon } = teamStyle[team.id]
  const regions = criterionRegions[team.id]
  const sections = regions ? pageSections : pageSections.filter((s) => s.id !== 'regions')

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ bgcolor: 'base.800', color: 'common.white' }}>
        <EvaluationHero
          image="/images/scenarios/web/cover.webp"
          title={team.label}
          summary={story.brief.what}
          summaryVariant="body1"
          accent={color}
          icon={<TeamIcon team={icon} size={56} />}
        >
          <Box>
            <Button
              component={Link}
              to={`/scenarios/evaluation#${team.id}`}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{
                color,
                borderColor: color,
                '&:hover': { borderColor: color, bgcolor: alpha(color, 0.12) },
              }}
            >
              Back to evaluation
            </Button>
          </Box>
        </EvaluationHero>
        <TeamTabs activeTeamId={team.id} hrefFor={methodologyPath} />

        {/* Same frame and rail as the evaluation overview, so the two pages' text lines up. */}
        <Container
          maxWidth={false}
          sx={{
            width: '90dvw',
            px: 0,
            pb: jtSpacing.section.xl,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(180px, .3fr) minmax(0, 1.92fr)' },
            gap: { xs: jtSpacing.gap.xl, lg: jtSpacing.section.md },
            alignItems: 'start',
          }}
        >
          {/* Section rail: beside the content from lg up, above it on smaller screens */}
          <PageRail
            items={sections}
            ariaLabel={`${team.label} sections`}
            sx={{ pt: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl } }}
          />

          <CitationContext.Provider
            value={{ accent: color, references: criterionReferences[team.id] }}
          >
            <Stack
              spacing={jtSpacing.section.xl}
              sx={{
                minWidth: 0,
                gridColumn: { lg: 2 },
                p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
                '& > *': { maxWidth: jtSpacing.layout.data.maxWidth },
                // The what, why and regions overview runs together; dividers start after it
                '& > #components, & > #construction, & > #references': {
                  pt: jtSpacing.section.md,
                  borderTop: 2,
                  borderColor: alpha(color, 0.5),
                },
              }}
            >
              <WhatSection story={story} accent={color} />
              <WhySection story={story} accent={color} />
              {regions && <RegionsSection regions={regions} accent={color} />}
              {/* Keyed by criterion so switching criteria resets the open component tab */}
              <ComponentsSection key={team.id} story={story} accent={color} />
              <ConstructionSection story={story} accent={color} />
              <Box
                component="section"
                id="references"
                aria-labelledby="references-title"
                sx={sectionSx}
              >
                <SectionHeading
                  variant="h3"
                  title="References"
                  id="references-title"
                  accent={color}
                />
                <Box
                  component="ol"
                  sx={{
                    ...methodologyTextColumnSx,
                    m: 0,
                    mt: jtSpacing.gap.md,
                    p: 0,
                    listStyle: 'none',
                  }}
                >
                  {criterionReferences[team.id].map((reference, index) => (
                    <Typography
                      key={reference}
                      id={referenceId(index)}
                      component="li"
                      variant="body2"
                      sx={{
                        ...sectionSx,
                        display: 'grid',
                        gridTemplateColumns: '2.5em minmax(0, 1fr)',
                        color: 'base.100',
                        py: jtSpacing.component.xs,
                        borderTop: 1,
                        borderColor: 'border.subtle',
                        overflowWrap: 'anywhere',
                        // Flash the entry a citation number jumps to
                        '&:target': { bgcolor: alpha(color, 0.14) },
                      }}
                    >
                      <Box component="span" sx={{ color, fontWeight: 600 }}>
                        {index + 1}.
                      </Box>
                      <span>
                        <Reference text={reference} accent={color} />
                      </span>
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Stack>
          </CitationContext.Provider>
        </Container>
      </Box>
      <Footer />
    </>
  )
}

/** Sections listed in the page rail; ids match the section elements below. */
const pageSections = [
  { id: 'what', label: 'What is this criterion?' },
  { id: 'why', label: 'Why does it matter?' },
  { id: 'regions', label: 'Which regions does it cover?' },
  { id: 'components', label: 'What are its components?' },
  { id: 'construction', label: 'How was it constructed?' },
  { id: 'references', label: 'References' },
]

/** Clears the sticky navbar and team tabs when a section is scrolled to. */
const sectionSx = { scrollMarginTop: 150 } as const

/** Standalone prose, at the same measure as the evaluation overview's intro. */
const methodologyTextColumnSx = { maxWidth: '100ch' } as const

/** The Why and Regions sections share one grid: text on the left, its visual on the right. */
const criterionSplitSx = {
  display: 'grid',
  gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 5fr) minmax(0, 7fr)' },
  columnGap: jtSpacing.section.md,
  rowGap: jtSpacing.gap.lg,
  alignItems: 'start',
} as const

interface SectionProps {
  story: CriterionStory
  accent: string
}

function WhatSection({ story, accent }: SectionProps) {
  return (
    <Box
      component="section"
      id="what"
      aria-labelledby="criterion-title"
      sx={{
        ...sectionSx,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
      }}
    >
      <Box sx={{ gridColumn: 1 }}>
        <SectionHeading
          variant="h3"
          title="What is this criterion?"
          id="criterion-title"
          accent={accent}
        />
      </Box>
      <Stack spacing={jtSpacing.gap.md} sx={{ gridColumn: 1, minWidth: 0 }}>
        {story.what.map((paragraph) => (
          <Typography
            key={paragraph}
            variant="body1"
            sx={{ ...methodologyTextColumnSx, color: 'base.100' }}
          >
            <CitedText text={paragraph} />
          </Typography>
        ))}
      </Stack>
      <Stack
        direction="row"
        useFlexGap
        spacing={jtSpacing.gap.sm}
        sx={{
          gridColumn: 1,
          justifySelf: 'start',
          mt: jtSpacing.component.lg,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Button disabled variant="outlined">
          Read full documentation
        </Button>
        <Typography variant="captionSmall" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
          Forthcoming
        </Typography>
      </Stack>
    </Box>
  )
}

function WhySection({ story, accent }: SectionProps) {
  const { stats = [], statsInRows, paragraphs, quote } = story.why
  return (
    <Box component="section" id="why" aria-labelledby="why-title" sx={sectionSx}>
      <SectionHeading
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
                  variant="statNumber"
                  component="p"
                  sx={{
                    color: accent,
                    ...(statsInRows && {
                      fontSize: 'clamp(2rem, 2.4vw, 2.5rem)',
                      lineHeight: 1.15,
                    }),
                  }}
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
          <Typography
            component="dd"
            variant="h4"
            sx={{ m: 0, color: accent, textTransform: 'none' }}
          >
            {fact.value}
          </Typography>
          <Typography component="dt" variant="body2" sx={{ color: 'base.100', mt: 0.5 }}>
            {fact.label}
          </Typography>
          {fact.dates?.map((date, index) => (
            <Typography
              key={date}
              component="dd"
              variant="navigationSubLabel"
              sx={{ m: 0, mt: index ? 0 : 1, color: accent, fontWeight: 400, lineHeight: 1.5 }}
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
          <Typography
            component="span"
            variant="h4"
            sx={{ color: accent, textTransform: 'none', lineHeight: 1 }}
          >
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

function ConstructionSection({ story, accent }: SectionProps) {
  const { intro, facts, outcomes, points, paragraphs, steps } = story.construction
  return (
    <Box component="section" id="construction" aria-labelledby="construction-title" sx={sectionSx}>
      <SectionHeading
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

/** The team's own regions, drawn over the Delta's channels, beside what each one is. */
function RegionsSection({ regions, accent }: { regions: CriterionRegions; accent: string }) {
  const shapes = REGION_SHAPES.filter((shape) => shape.team === regions.mapTeam)
  const teamViewBox = REGION_TEAM_VIEWBOX[regions.mapTeam]
  const compactMap = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  // Ecology's outlines span the widest area. From md up, every team's map shares its
  // scale, so the Delta is the same size on each page; on a phone each fills the width.
  const widestMap = REGION_TEAM_VIEWBOX.ecology.width
  const labelSize = compactMap ? teamViewBox.width / 26 : widestMap / 45
  return (
    <Box component="section" id="regions" aria-labelledby="regions-title" sx={sectionSx}>
      <SectionHeading
        variant="h3"
        title="Which regions does this criterion cover?"
        id="regions-title"
        accent={accent}
      />
      <Box sx={criterionSplitSx}>
        <Stack spacing={jtSpacing.gap.md} sx={{ minWidth: 0 }}>
          <Typography variant="body1" sx={{ color: 'base.100' }}>
            <CitedText text={regions.intro} />
          </Typography>
          <Box component="dl" sx={{ m: 0, borderTop: 1, borderColor: 'border.subtle' }}>
            {regions.regions.map((region) => (
              <Box
                key={region.name}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto minmax(0, 1fr)',
                  columnGap: jtSpacing.gap.md,
                  alignItems: 'baseline',
                  py: jtSpacing.component.xs,
                  borderBottom: 1,
                  borderColor: 'border.subtle',
                }}
              >
                <Typography component="dt" variant="body2" sx={{ color: 'common.white' }}>
                  {region.name}
                </Typography>
                <Typography
                  component="dd"
                  variant="body2"
                  sx={{ m: 0, color: 'base.200', textAlign: 'right' }}
                >
                  <CitedText text={region.note ?? ''} />
                </Typography>
              </Box>
            ))}
          </Box>
          {regions.mapNote && (
            <Typography variant="caption" sx={{ color: 'base.200' }}>
              <CitedText text={regions.mapNote} />
            </Typography>
          )}
        </Stack>
        <Box
          component="svg"
          viewBox={`${teamViewBox.x} ${teamViewBox.y} ${teamViewBox.width} ${teamViewBox.height}`}
          role="img"
          aria-label={`Map of the Delta showing ${shapes.map((shape) => shape.name).join(', ')}`}
          sx={{
            width: '100%',
            maxWidth: { md: `${(teamViewBox.width / widestMap) * 100}%` },
            height: 'auto',
            display: 'block',
            justifySelf: 'center',
          }}
        >
          <path d={WATERWAY_PATH} fill="currentColor" opacity={0.12} />
          {shapes.map((shape) => (
            <path
              key={shape.name}
              d={shape.d}
              fill={alpha(accent, 0.18)}
              stroke={accent}
              strokeWidth={3}
              strokeLinejoin="round"
            />
          ))}
          {shapes.map((shape) => (
            <Label key={`label-${shape.name}`} shape={shape} size={labelSize} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

const COUNT_WORDS: Record<number, string> = { 3: 'three', 4: 'four' }

function ComponentsSection({ story, accent }: SectionProps) {
  const { intro, items } = story.components
  const [active, setActive] = useState(0)
  const item = items[active]
  const [lead, ...details] = item.spec

  return (
    <Box component="section" id="components" aria-labelledby="components-title" sx={sectionSx}>
      <SectionHeading
        variant="h3"
        title="What are the components of this criterion?"
        id="components-title"
        accent={accent}
      />
      {intro && (
        <Typography
          variant="body1"
          sx={{ ...methodologyTextColumnSx, color: 'base.100', whiteSpace: 'pre-line' }}
        >
          {intro}
        </Typography>
      )}
      <Typography
        variant="body1"
        sx={{
          ...methodologyTextColumnSx,
          mt: intro ? jtSpacing.gap.sm : jtSpacing.gap.xs,
          color: 'base.100',
        }}
      >
        This criterion has {COUNT_WORDS[items.length] ?? items.length} components. Select one to see
        how it is measured.
      </Typography>

      <Box
        sx={{
          mt: jtSpacing.gap.lg,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: `repeat(${items.length % 2 ? items.length : 2}, minmax(0, 1fr))`,
            lg: `repeat(${items.length}, minmax(0, 1fr))`,
          },
          gap: jtSpacing.gap.sm,
        }}
      >
        {items.map((component, index) => (
          <ComponentCard
            key={component.name}
            number={index + 1}
            name={component.name}
            summary={component.summary}
            selected={index === active}
            accent={accent}
            onSelect={() => setActive(index)}
          />
        ))}
      </Box>

      <Box
        id="component-panel"
        role="region"
        aria-label={item.name}
        sx={{ pt: jtSpacing.section.sm }}
      >
        <Box
          sx={{
            pb: jtSpacing.gap.lg,
            borderBottom: 1,
            borderColor: 'border.subtle',
          }}
        >
          <Typography component="p" variant="navigationSubLabel" sx={{ color: accent }}>
            {lead.label}
          </Typography>
          <Typography
            component="p"
            variant="editorialEmphasis"
            sx={{ ...methodologyTextColumnSx, mt: 0.5, color: 'base.50' }}
          >
            {lead.value}
          </Typography>
          <Box component="dl" sx={{ m: 0, mt: jtSpacing.gap.sm }}>
            {details.map((row, index) => (
              <Box
                key={row.label}
                sx={{
                  ...methodologyTextColumnSx,
                  mt: index ? jtSpacing.gap.xs : 0,
                  display: 'grid',
                  gridTemplateColumns: '5em minmax(0, 1fr)',
                  alignItems: 'baseline',
                }}
              >
                <Typography component="dt" variant="navigationSubLabel" sx={{ color: 'base.200' }}>
                  {row.label}
                </Typography>
                <Typography component="dd" variant="body2" sx={{ m: 0, color: 'base.100' }}>
                  {row.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* The ordered method, with its caveats always in view beside it */}
        <Box
          sx={{
            mt: jtSpacing.gap.lg,
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: item.caveats ? 'minmax(0, 7fr) minmax(0, 5fr)' : '1fr',
            },
            gap: { xs: jtSpacing.gap.lg, md: jtSpacing.section.sm },
            alignItems: 'start',
          }}
        >
          <Box>
            <Typography variant="navigationLabel" component="h3">
              Method
            </Typography>
            <Box
              component="ol"
              sx={{
                ...(item.caveats ? {} : methodologyTextColumnSx),
                m: 0,
                p: 0,
                mt: jtSpacing.gap.sm,
                listStyle: 'none',
              }}
            >
              {item.method.map((step, index) => (
                <Box
                  component="li"
                  key={step}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '28px minmax(0, 1fr)',
                    columnGap: jtSpacing.gap.sm,
                    alignItems: 'baseline',
                    py: jtSpacing.component.sm,
                    borderTop: 1,
                    borderColor: 'border.subtle',
                  }}
                >
                  <Typography variant="h4" component="span" sx={{ color: accent }}>
                    {index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'base.100' }}>
                    <CitedText text={step} />
                  </Typography>
                </Box>
              ))}
            </Box>
            {item.link && (
              <Button
                component={Link}
                to={item.link.to}
                variant="contained"
                sx={{ mt: jtSpacing.gap.md }}
              >
                {item.link.label}
              </Button>
            )}
          </Box>

          {item.caveats && (
            <CaveatsPanel
              accent={accent}
              caveats={item.caveats.map((caveat) => ({
                key: caveat,
                content: <CitedText text={caveat} />,
              }))}
            />
          )}
        </Box>

        {item.tables?.map((table) => (
          <OptionalTable key={`${item.name}-${table.caption}`} table={table} accent={accent} />
        ))}
      </Box>
    </Box>
  )
}

/** A component as a numbered card; selecting it shows its details below the row. */
function ComponentCard({
  number,
  name,
  summary,
  selected,
  accent,
  onSelect,
}: {
  number: number
  name: string
  summary: string
  selected: boolean
  accent: string
  onSelect: () => void
}) {
  return (
    <ButtonBase
      onClick={onSelect}
      aria-pressed={selected}
      aria-controls="component-panel"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: jtSpacing.gap.sm,
        p: jtSpacing.component.md,
        textAlign: 'left',
        color: 'inherit',
        border: 1,
        borderColor: 'border.subtle',
        borderTop: 3,
        borderTopColor: selected ? accent : 'border.subtle',
        borderRadius: 1,
        bgcolor: selected ? alpha(accent, 0.1) : 'transparent',
        '&:hover': { bgcolor: selected ? alpha(accent, 0.1) : 'translucent.100' },
        '&.Mui-focusVisible': { outline: 2, outlineColor: accent, outlineOffset: 2 },
      }}
    >
      <Typography component="span" variant="statNumber" sx={{ color: accent }}>
        {number}
      </Typography>
      <Typography component="span" variant="h4" sx={{ color: 'base.50' }}>
        {name}
      </Typography>
      <Typography component="span" variant="body2" sx={{ color: 'base.100' }}>
        <CitedText text={summary} />
      </Typography>
    </ButtonBase>
  )
}

/** A component's data table, closed until asked for. */
function OptionalTable({ table, accent }: { table: StoryTable; accent: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Box sx={{ mt: jtSpacing.gap.lg }}>
      <Button
        variant="outlined"
        startIcon={open ? <RemoveIcon /> : <AddIcon />}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        sx={{ color: accent, borderColor: 'border.subtle' }}
      >
        {table.caption}
      </Button>
      {open && <StoryDataTable table={table} accent={accent} />}
    </Box>
  )
}

function StoryDataTable({ table, accent }: { table: StoryTable; accent: string }) {
  return (
    <Box component="figure" aria-label={table.caption} sx={{ m: 0, mt: jtSpacing.gap.sm }}>
      <Box
        sx={{
          overflowX: 'auto',
          border: 1,
          borderColor: 'border.subtle',
          borderRadius: 1,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(accent, 0.1) }}>
              {table.columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    typography: 'chartTitle',
                    color: 'base.50',
                    whiteSpace: 'nowrap',
                    borderBottom: 2,
                    borderBottomColor: accent,
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.rows.map((row) => (
              <TableRow
                key={row[0]}
                sx={{
                  '&:nth-of-type(even)': { bgcolor: 'translucent.100' },
                  '&:last-of-type td': { borderBottom: 0 },
                }}
              >
                {row.map((cell, index) => (
                  <TableCell
                    key={`${row[0]}-${table.columns[index]}`}
                    sx={{
                      typography: 'body2',
                      color: index ? 'base.100' : 'common.white',
                      verticalAlign: 'top',
                      borderColor: 'border.subtle',
                    }}
                  >
                    {index ? cell : <RowLabel text={cell} />}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}

/** A row's first cell; a trailing life stage ("…, juvenile") becomes a pill, as in the breakout table. */
function RowLabel({ text }: { text: string }) {
  const match = /^(.*), (juvenile|adult)$/i.exec(text)
  if (!match) return text
  const stage = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase()
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {match[1]}
      <StageChip label={stage} plain />
    </Box>
  )
}

/** A citation with any URLs in it made into links. */
function Reference({ text, accent }: { text: string; accent: string }) {
  return text.split(/(https?:\/\/\S+)/).map((part, index) =>
    index % 2 ? (
      <Box
        component="a"
        key={part}
        href={part.replace(/[.,]$/, '')}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: accent, textDecorationColor: alpha(accent, 0.5) }}
      >
        {part}
      </Box>
    ) : (
      part
    ),
  )
}
