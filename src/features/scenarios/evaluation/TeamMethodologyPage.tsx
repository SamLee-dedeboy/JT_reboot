// One evaluation team's criterion, condensed from its "Story Behind the
// Criterion" report into a technical summary: what it is, why it matters, how
// it was built, and how each component is measured. Scenario results live on
// the per-scenario team pages.
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material'
import { alpha, type Theme } from '@mui/material/styles'
import { useState } from 'react'
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
import { evaluationCardSx } from './styles'
import { EvaluationHero, SectionHeading, TeamTabs } from './shared'

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

        {/* Hybrid-width frame: readable prose and wide map/table sections share one page. */}
        <Container
          maxWidth={false}
          sx={{
            width: jtSpacing.layout.hybrid.width,
            px: 0,
            pb: jtSpacing.section.xl,
            display: 'grid',
            // Keep the rail track stable when the hybrid frame width changes.
            gridTemplateColumns: {
              xs: '1fr',
              lg: '240px minmax(0, 1fr) minmax(360px, .92fr)',
            },
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
                gridColumn: { lg: '2 / -1' },
                p: { xs: jtSpacing.component.lg, md: jtSpacing.component.xl },
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
                <Typography
                  variant="body2"
                  sx={(theme) => ({ ...methodologyTextColumnSx(theme), color: 'base.200' })}
                >
                  Sources this summary draws on, from {story.source}
                </Typography>
                <Box
                  component="ol"
                  sx={(theme) => ({
                    ...methodologyTextColumnSx(theme),
                    m: 0,
                    mt: jtSpacing.gap.md,
                    p: 0,
                    listStyle: 'none',
                  })}
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

/** The left half of the methodology's hybrid grid, used by standalone prose. */
const methodologyTextColumnSx = (theme: Theme) => ({
  width: { md: `calc(50% - ${theme.spacing(jtSpacing.section.md / 2)})` },
  maxWidth: '100%',
})

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
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        columnGap: { xs: 0, md: jtSpacing.section.md },
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
          <Typography key={paragraph} variant="body1" sx={{ color: 'base.100' }}>
            <CitedText text={paragraph} />
          </Typography>
        ))}
      </Stack>
      <Button
        type="button"
        variant="outlined"
        sx={{
          gridColumn: 1,
          justifySelf: 'start',
          mt: jtSpacing.component.lg,
          color: accent,
          borderColor: accent,
          '&:hover': { borderColor: accent, bgcolor: alpha(accent, 0.12) },
        }}
      >
        Read full documentation
      </Button>
    </Box>
  )
}

function WhySection({ story, accent }: SectionProps) {
  const { stats = [], paragraphs, quote } = story.why
  return (
    <Box component="section" id="why" aria-labelledby="why-title" sx={sectionSx}>
      <SectionHeading
        variant="h3"
        title="Why does this criterion matter?"
        id="why-title"
        accent={accent}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: stats.length ? 'minmax(0, .8fr) minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))',
          },
          gap: { xs: jtSpacing.gap.lg, md: jtSpacing.section.md },
          alignItems: 'start',
        }}
      >
        {stats.length > 0 && (
          <Stack spacing={jtSpacing.gap.lg}>
            {stats.map((stat) => (
              <Stack key={stat.label} spacing={jtSpacing.gap.sm}>
                <Typography variant="displayNumber" component="p" sx={{ color: accent }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1">{stat.label}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
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
      </Box>
    </Box>
  )
}

function ConstructionSection({ story, accent }: SectionProps) {
  const { intro, facts, steps } = story.construction
  return (
    <Box component="section" id="construction" aria-labelledby="construction-title" sx={sectionSx}>
      <SectionHeading
        variant="h3"
        title="How was this criterion constructed?"
        id="construction-title"
        accent={accent}
      />
      <Typography
        variant="body1"
        sx={(theme) => ({ ...methodologyTextColumnSx(theme), color: 'base.50' })}
      >
        <CitedText text={intro} />
      </Typography>

      {/* Key numbers behind the criterion, read before the step-by-step */}
      {facts.length > 0 && (
        <Box
          component="dl"
          sx={{
            m: 0,
            mt: jtSpacing.section.sm,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              md: `repeat(${facts.length}, minmax(0, 1fr))`,
            },
            borderTop: 1,
            borderBottom: 1,
            borderColor: 'border.subtle',
          }}
        >
          {facts.map((fact, index) => (
            <Box
              key={fact.label}
              sx={{
                py: jtSpacing.component.md,
                px: {
                  xs: index % 2 ? jtSpacing.component.md : 0,
                  md: index ? jtSpacing.component.md : 0,
                },
                // Width only, so the responsive values don't reset the divider color
                borderLeftStyle: 'solid',
                borderLeftWidth: { xs: index % 2 ? '1px' : 0, md: index ? '1px' : 0 },
                borderLeftColor: 'border.subtle',
              }}
            >
              <Typography component="dd" variant="numberTimeline" sx={{ m: 0, color: accent }}>
                {fact.value}
              </Typography>
              <Typography component="dt" variant="body2" sx={{ color: 'base.100', mt: 0.5 }}>
                {fact.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Steps in order along a rail; each node carries the step number */}
      <Box component="ol" sx={{ m: 0, p: 0, mt: jtSpacing.section.sm, listStyle: 'none' }}>
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
            <Stack
              spacing={jtSpacing.gap.xs}
              sx={(theme) => ({
                ...methodologyTextColumnSx(theme),
                pt: 0.75,
              })}
            >
              {step.when && (
                <Typography variant="navigationSubLabel" component="p" sx={{ color: accent }}>
                  {step.when}
                </Typography>
              )}
              <Typography variant="h4" component="h3">
                {step.title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'base.100' }}>
                <CitedText text={step.body} />
              </Typography>
              {step.points && (
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
                  {step.points.map((point, pointIndex) => (
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
                      {/* Team-colored diamond, centred on the first line */}
                      <Box
                        aria-hidden="true"
                        sx={{
                          width: 6,
                          height: 6,
                          mt: 0.875,
                          bgcolor: accent,
                          transform: 'rotate(45deg)',
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'base.100' }}>
                        <CitedText text={point} />
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
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
  return (
    <Box
      component="section"
      id="regions"
      aria-labelledby="regions-title"
      sx={{
        ...sectionSx,
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
        gridTemplateAreas: { xs: '"heading" "copy" "map"', md: '"heading heading" "copy map"' },
        columnGap: { xs: 0, md: jtSpacing.section.md },
        rowGap: jtSpacing.gap.lg,
        alignItems: 'start',
      }}
    >
      <Box sx={{ gridArea: 'heading' }}>
        <SectionHeading
          variant="h3"
          title="Which regions does this criterion cover?"
          id="regions-title"
          accent={accent}
        />
      </Box>
      <Stack spacing={jtSpacing.gap.md} sx={{ gridArea: 'copy', minWidth: 0 }}>
        <Typography variant="body1" sx={{ color: 'base.100' }}>
          <CitedText text={regions.intro} />
        </Typography>
        <Box component="dl" sx={{ m: 0, borderTop: 1, borderColor: 'border.subtle' }}>
          {regions.regions.map((region) => (
            <Box
              key={region.name}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) minmax(0, 1.2fr)' },
                columnGap: jtSpacing.gap.md,
                py: jtSpacing.component.xs,
                borderBottom: 1,
                borderColor: 'border.subtle',
              }}
            >
              <Typography component="dt" variant="body1" sx={{ color: 'common.white' }}>
                {region.name}
              </Typography>
              <Typography component="dd" variant="body2" sx={{ m: 0, color: 'base.200' }}>
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
          gridArea: 'map',
          width: '100%',
          maxWidth: 520,
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
          <Label key={`label-${shape.name}`} shape={shape} size={32} />
        ))}
      </Box>
    </Box>
  )
}

function ComponentsSection({ story, accent }: SectionProps) {
  const { intro, items } = story.components
  const [active, setActive] = useState(0)
  const item = items[active]

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
          sx={(theme) => ({ ...methodologyTextColumnSx(theme), color: 'base.100' })}
        >
          {intro}
        </Typography>
      )}
      <Tabs
        value={active}
        onChange={(_, next: number) => setActive(next)}
        variant="scrollable"
        allowScrollButtonsMobile
        aria-label="Components"
        sx={{
          mt: jtSpacing.gap.lg,
          borderBottom: 1,
          borderColor: 'border.subtle',
          '& .MuiTabs-indicator': { bgcolor: accent },
          '& .MuiTab-root.Mui-selected': { color: accent },
        }}
      >
        {items.map((component, index) => (
          <Tab
            key={component.name}
            label={`${String(index + 1).padStart(2, '0')} ${component.name}`}
            id={`component-tab-${index}`}
            aria-controls="component-panel"
          />
        ))}
      </Tabs>

      <Box
        role="tabpanel"
        id="component-panel"
        aria-labelledby={`component-tab-${active}`}
        sx={{ pt: jtSpacing.section.sm }}
      >
        <Typography
          variant="body1"
          sx={(theme) => ({ ...methodologyTextColumnSx(theme), color: 'base.50' })}
        >
          <CitedText text={item.summary} />
        </Typography>

        {/* Spec sheet beside the ordered method */}
        <Box
          sx={{
            mt: jtSpacing.gap.lg,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1.15fr)' },
            gap: { xs: jtSpacing.gap.lg, md: jtSpacing.section.sm },
            alignItems: 'start',
          }}
        >
          <Box
            component="dl"
            sx={{ ...evaluationCardSx, m: 0, borderTop: 3, borderTopColor: accent }}
          >
            {item.spec.map((row, index) => (
              <Box
                key={row.label}
                sx={{
                  py: jtSpacing.component.sm,
                  borderTop: index ? 1 : 0,
                  borderColor: 'border.subtle',
                }}
              >
                <Typography component="dt" variant="navigationSubLabel" sx={{ color: 'base.200' }}>
                  {row.label}
                </Typography>
                <Typography component="dd" variant="body2" sx={{ m: 0, mt: 0.5, color: 'base.50' }}>
                  {row.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box>
            <Typography variant="navigationLabel" component="h3">
              Method
            </Typography>
            <Box component="ol" sx={{ m: 0, p: 0, mt: jtSpacing.gap.sm, listStyle: 'none' }}>
              {item.method.map((step, index) => (
                <Box
                  component="li"
                  key={step}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '28px minmax(0, 1fr)',
                    columnGap: jtSpacing.gap.sm,
                    py: jtSpacing.component.sm,
                    borderTop: 1,
                    borderColor: 'border.subtle',
                  }}
                >
                  <Typography
                    variant="numberBadge"
                    component="span"
                    sx={{ color: accent, pt: 0.25 }}
                  >
                    {index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'base.100' }}>
                    <CitedText text={step} />
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {item.tables?.map((table) => (
          <StoryDataTable key={table.caption} table={table} accent={accent} />
        ))}

        {item.caveats && (
          <Box
            sx={{
              mt: jtSpacing.gap.lg,
              p: jtSpacing.component.md,
              borderLeft: 3,
              borderColor: accent,
              bgcolor: alpha(accent, 0.06),
            }}
          >
            <Typography variant="navigationSubLabel" component="h3" sx={{ color: accent }}>
              Caveats
            </Typography>
            <Box component="ul" sx={{ m: 0, mt: jtSpacing.gap.xs, pl: jtSpacing.component.md }}>
              {item.caveats.map((caveat) => (
                <Typography
                  key={caveat}
                  component="li"
                  variant="body2"
                  sx={{ display: 'list-item', color: 'base.100', mt: 0.5 }}
                >
                  <CitedText text={caveat} />
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

function StoryDataTable({ table, accent }: { table: StoryTable; accent: string }) {
  return (
    <Box component="figure" sx={{ m: 0, mt: jtSpacing.gap.lg }}>
      <Typography
        component="figcaption"
        variant="navigationSubLabel"
        sx={{ color: accent, mb: jtSpacing.gap.sm }}
      >
        {table.caption}
      </Typography>
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
