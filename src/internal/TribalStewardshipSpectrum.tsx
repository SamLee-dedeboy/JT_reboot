// Accessible, responsive interpretation of the Tribal Stewardship Policy spectrum.
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Box, Chip, Container, Stack, Typography, alpha } from '@mui/material'
import PageLayout from './PageLayout'

interface PathwayGroup {
  label: string
  items: string[]
}

interface Pathway {
  number: string
  title: string
  description: string
  groups: PathwayGroup[]
}

const pathways: Pathway[] = [
  {
    number: '01',
    title: 'Access',
    description: 'Tribal access expands from time-bound activities to ongoing, unrestricted use.',
    groups: [
      {
        label: 'Restricted access',
        items: [
          'Access to specified area for specified action/time',
          'Access to partial area for specified action/time',
          'Access to whole area for specified action/time',
        ],
      },
      {
        label: 'Limited access',
        items: [
          'Minimal access with conditions',
          'Access to partial area with conditions',
          'Access to whole area with conditions',
        ],
      },
      {
        label: 'Unlimited access',
        items: [
          'Minimal unlimited access with no conditions',
          'Partial unlimited access with no conditions',
          'Full unlimited access with no conditions',
        ],
      },
    ],
  },
  {
    number: '02',
    title: 'Collaboration',
    description: 'Decision-making authority grows from shared decisions to delegated authority.',
    groups: [
      {
        label: 'Shared decision making',
        items: [
          'Some decisions are shared',
          'Most decisions are shared',
          'All decisions are shared',
        ],
      },
      {
        label: 'Deferred decision making',
        items: [
          'Some decisions are deferred',
          'Most decisions are deferred',
          'All decisions are deferred',
        ],
      },
      {
        label: 'Delegated/\u200btransferred decision making',
        items: [
          'Some decisions are delegated',
          'Most decisions are delegated',
          'All decisions are delegated',
        ],
      },
    ],
  },
  {
    number: '03',
    title: 'Ancestral Land Return',
    description: 'Stewardship advances toward unrestricted tribal ownership and trust property.',
    groups: [
      {
        label: 'Shared fee lands',
        items: [
          'Active shared ownership + decision-making',
          'Minimal interference from shared owner',
          'No interference from shared owner',
        ],
      },
      {
        label: 'Fee lands',
        items: [
          'Restricted property held in fee',
          'Minimally restricted property held in fee',
          'Unrestricted property held in fee',
        ],
      },
      {
        label: 'Trust lands',
        items: [
          'Restricted trust property',
          'Minimally restricted trust property',
          'Unrestricted trust property',
        ],
      },
    ],
  },
]

function PathwayCard({ pathway }: { pathway: Pathway }) {
  return (
    <Box
      component="article"
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        p: theme.jtSpacing.component.lg,
        border: 1,
        borderColor: 'border.default',
        borderTop: 4,
        borderTopColor: 'primary.main',
        bgcolor: 'translucent.100',
      })}
    >
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="numberArticle">Pathway {pathway.number}</Typography>
        <ArrowForwardRoundedIcon color="primary" aria-hidden="true" />
      </Stack>
      <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
        {pathway.title}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1.5 }}>
        {pathway.description}
      </Typography>

      <Stack spacing={2.5} sx={{ mt: 3.5 }}>
        {pathway.groups.map((group, groupIndex) => (
          <Box key={group.label}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Chip label={`${groupIndex + 1}`} size="small" color="primary" />
              <Typography variant="cardTitle" component="h3">
                {group.label}
              </Typography>
            </Stack>
            <Box
              component="ol"
              sx={(theme) => ({
                m: 0,
                mt: theme.jtSpacing.component.sm,
                pl: theme.jtSpacing.component.lg,
                color: 'base.100',
                '& li': { pl: 0.5, mb: 0.75 },
                '& li::marker': { color: 'primary.main' },
              })}
            >
              {group.items.map((item) => (
                <Typography key={item} component="li" variant="cardBody">
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

// Pathway blocks darken left to right along the arrow; the cards inside stay one colour.
const pathwayBackground = ['base.600', 'base.700', 'base.800'] as const
// Space between the three groups of a pathway, so each group reads as its own column.
const GROUP_GAP = 'sm' as const
// Arrow height in spacing units; its lower half overlaps the pathway blocks.
const ARROW_HEIGHT = 7

// Rows of the figure grid. Pathways span rows 2–7 and share them through subgrid, so
// group labels and each step line up across all nine columns.
const FIGURE_ROWS = { arrow: 1, pathwayStart: 2, foundation: 8 } as const
const PATHWAY_ROWS = { title: 1, branch: 2, group: 3, firstStep: 4 } as const

type BranchPosition = 'first' | 'middle' | 'last'
const branchPositions: BranchPosition[] = ['first', 'middle', 'last']

// Draws one third of a bracket so each drop lands exactly on its group's centre.
function BranchTick({ position, column }: { position: BranchPosition; column: number }) {
  return (
    <Box
      aria-hidden="true"
      sx={(theme) => {
        const halfGap = `calc(${theme.spacing(theme.jtSpacing.gap[GROUP_GAP])} / -2)`
        return {
          gridColumn: column,
          gridRow: PATHWAY_ROWS.branch,
          position: 'relative',
          height: theme.spacing(3),
          '&::before': {
            content: '""',
            position: 'absolute',
            top: position === 'middle' ? 0 : '50%',
            bottom: 0,
            left: `calc(50% - ${theme.spacing(0.125)})`,
            borderLeft: 2,
            borderColor: 'base.100',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: position === 'first' ? '50%' : halfGap,
            right: position === 'last' ? '50%' : halfGap,
            borderTop: 2,
            borderColor: 'base.100',
          },
        }
      }}
    />
  )
}

function FigureFaithfulSpectrum() {
  return (
    <Box component="section" aria-labelledby="figure-faithful-heading">
      <Container>
        <Typography variant="eyebrow">Version 1 · original structure</Typography>
        <Typography id="figure-faithful-heading" variant="h2" component="h2" sx={{ mt: 1.5 }}>
          The figure, rebuilt for the web
        </Typography>
        <Typography
          variant="body2"
          sx={(theme) => ({ maxWidth: theme.jtSpacing.paragraphMaxWidth.default, mt: 2 })}
        >
          The original figure’s arrow, side rail, three-part spectrum, and foundational agreement
          bar, with every label set horizontally. Each group’s three examples sit in their own
          column and progress top to bottom.
        </Typography>
      </Container>

      <Box sx={(theme) => ({ mt: 4, overflowX: 'auto', px: theme.jtSpacing.component.lg, pb: 1 })}>
        <Box
          role="figure"
          aria-label="Spectrum of tribal stewardship pathways from access through collaboration to ancestral land return, supported by consultation and engagement and by respectful, durable, mutually beneficial relationships and agreements."
          sx={{
            display: 'grid',
            gridTemplateColumns: '16rem repeat(9, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(8, auto)',
            minWidth: 1500,
            maxWidth: 1720,
            mx: 'auto',
          }}
        >
          {/* Consultation sits beside the spectrum: necessary, but not stewardship on its own. */}
          <Box
            component="aside"
            sx={(theme) => ({
              gridColumn: 1,
              gridRow: `${FIGURE_ROWS.arrow} / ${FIGURE_ROWS.foundation + 1}`,
              mr: theme.jtSpacing.gap.sm,
              p: theme.jtSpacing.component.sm,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 1.5,
              bgcolor: alpha(theme.palette.accent.purple, 0.16),
              borderLeft: 4,
              borderColor: 'accent.purple',
            })}
          >
            <Typography variant="h4" component="h3">
              Consultation and Engagement
            </Typography>
            <Typography variant="meta" component="p" sx={{ color: 'base.50' }}>
              Early, often, and meaningful tribal consultation and engagement is necessary and
              critical to building partnerships between tribes and non-tribal entities but alone is
              not considered tribal stewardship under this Policy.
            </Typography>
          </Box>

          {/* The direction of travel across all three pathways. */}
          <Box
            sx={(theme) => ({
              gridColumn: '2 / -1',
              gridRow: FIGURE_ROWS.arrow,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
              height: theme.spacing(ARROW_HEIGHT),
              // Pull the pathway blocks up so the arrow's lower half sits over them.
              mb: theme.spacing(-ARROW_HEIGHT / 2),
              pl: theme.jtSpacing.component.md,
              pr: 8,
              bgcolor: 'brand.primaryGreen',
              color: 'common.black',
              clipPath: `polygon(0 0, calc(100% - ${theme.spacing(5)}) 0, 100% 50%, calc(100% - ${theme.spacing(5)}) 100%, 0 100%)`,
            })}
          >
            <Typography variant="h4" component="p">
              Spectrum of Tribal Stewardship Pathways
            </Typography>
          </Box>

          {pathways.map((pathway, pathwayIndex) => (
            <Box
              key={pathway.title}
              component="article"
              aria-label={pathway.title}
              sx={(theme) => ({
                gridColumn: 'span 3',
                gridRow: `${FIGURE_ROWS.pathwayStart} / ${FIGURE_ROWS.foundation}`,
                display: 'grid',
                gridTemplateColumns: 'subgrid',
                gridTemplateRows: 'subgrid',
                columnGap: theme.jtSpacing.gap[GROUP_GAP],
                rowGap: 0,
                pt: `calc(${theme.spacing(theme.jtSpacing.component.md)} + ${theme.spacing(ARROW_HEIGHT / 2)})`,
                px: theme.jtSpacing.component.sm,
                pb: theme.jtSpacing.component.lg,
                bgcolor: pathwayBackground[pathwayIndex],
                borderRight: pathwayIndex < pathways.length - 1 ? 1 : 0,
                borderColor: 'border.default',
              })}
            >
              <Typography
                variant="h4"
                component="h3"
                sx={{
                  gridColumn: '1 / -1',
                  gridRow: PATHWAY_ROWS.title,
                  textAlign: 'center',
                  mb: 1,
                }}
              >
                {pathway.title}
              </Typography>

              {pathway.groups.map((group, groupIndex) => (
                <BranchTick
                  key={`${group.label}-branch`}
                  position={branchPositions[groupIndex]}
                  column={groupIndex + 1}
                />
              ))}

              {/* One outlined column per group holds its label and its three examples. */}
              {pathway.groups.map((group, groupIndex) => (
                <Box
                  key={`${group.label}-column`}
                  aria-hidden="true"
                  sx={{
                    gridColumn: groupIndex + 1,
                    gridRow: `${PATHWAY_ROWS.group} / span 4`,
                    bgcolor: 'translucent.50',
                    border: 1,
                    borderColor: 'border.strong',
                  }}
                />
              ))}

              {pathway.groups.map((group, groupIndex) => (
                <Typography
                  key={group.label}
                  variant="h5"
                  component="h4"
                  sx={(theme) => ({
                    gridColumn: groupIndex + 1,
                    gridRow: PATHWAY_ROWS.group,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    px: 0.5,
                    pt: theme.jtSpacing.component.sm,
                    pb: theme.jtSpacing.component.xs,
                  })}
                >
                  {group.label}
                </Typography>
              ))}

              {pathway.groups.flatMap((group, groupIndex) =>
                group.items.map((item, stepIndex) => (
                  <Typography
                    key={item}
                    variant="meta"
                    component="p"
                    sx={(theme) => ({
                      gridColumn: groupIndex + 1,
                      gridRow: PATHWAY_ROWS.firstStep + stepIndex,
                      display: 'flex',
                      alignItems: 'center',
                      mx: 0.75,
                      mb: theme.jtSpacing.component.xs,
                      px: 1,
                      py: 1,
                      color: 'common.white',
                      bgcolor: 'surfaceStrong',
                    })}
                  >
                    {item}
                  </Typography>
                )),
              )}
            </Box>
          ))}

          {/* Every pathway rests on the same relationship commitment. */}
          <Box
            sx={(theme) => ({
              gridColumn: '2 / -1',
              gridRow: FIGURE_ROWS.foundation,
              mt: theme.jtSpacing.gap.sm,
              p: theme.jtSpacing.component.md,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              bgcolor: alpha(theme.palette.brand.primaryBlue, 0.16),
              borderLeft: 4,
              borderColor: 'brand.primaryBlue',
            })}
          >
            <Typography variant="h4" component="h3">
              Respectful, Durable, and Mutually Beneficial Relationships and Agreements
            </Typography>
            <Typography variant="meta" component="p" sx={{ color: 'base.50' }}>
              Tribal stewardship agreements should be respectful, durable, and mutually beneficial.
              Partnering on tribal access, collaboration, and ancestral land return projects might
              include aspects of tribal consultation and engagement, but go above and beyond
              standard consultations to create a lasting relationship built on a foundation of
              respect and shared priorities.
            </Typography>
          </Box>
        </Box>
      </Box>
      <Container>
        <Typography
          variant="captionSmall"
          component="p"
          sx={{ mt: 1.5, display: { xs: 'block', lg: 'none' } }}
        >
          On smaller screens, swipe horizontally to follow the spectrum.
        </Typography>
      </Container>
    </Box>
  )
}

export default function TribalStewardshipSpectrum() {
  return (
    <PageLayout title="Tribal Stewardship Pathways" fullWidthContent hideTitle plainContent>
      {/* Introduce the policy goal and explain how to read the spectrum. */}
      <Box
        component="header"
        sx={(theme) => ({
          py: theme.jtSpacing.section.lg,
          borderBottom: 1,
          borderColor: 'border.default',
        })}
      >
        <Container>
          <Typography variant="eyebrow">Policy figure · accessible prototype</Typography>
          <Typography variant="h1" component="h1" sx={{ maxWidth: '16ch', mt: 2 }}>
            A spectrum of tribal stewardship
          </Typography>
          <Typography
            variant="bodyLarge"
            sx={(theme) => ({ maxWidth: theme.jtSpacing.paragraphMaxWidth.default, mt: 3 })}
          >
            California’s Tribal Stewardship Policy sets a goal to advance tribal stewardship across
            at least 7.5 million acres of lands and coastal waters.
          </Typography>
          <Typography
            variant="body2"
            sx={(theme) => ({ maxWidth: theme.jtSpacing.paragraphMaxWidth.default, mt: 2 })}
          >
            The spectrum describes three pathways. Within each pathway, the examples progress toward
            greater access, decision-making authority, or tribal ownership.
          </Typography>
        </Container>
      </Box>

      {/* Keep the source figure's composition while improving its color and type contrast. */}
      <Box sx={(theme) => ({ py: theme.jtSpacing.section.md })}>
        <FigureFaithfulSpectrum />
      </Box>

      {/* Offer a second interpretation optimized for responsive reading. */}
      <Container sx={(theme) => ({ py: theme.jtSpacing.section.md })}>
        <Typography variant="eyebrow">Version 2 · responsive cards</Typography>
        <Typography variant="h2" component="h2" sx={{ mt: 1.5, mb: 3 }}>
          The same content, optimized for reading
        </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography variant="h5" component="p">
            Spectrum of tribal stewardship pathways
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'primary.main' }}>
            <Typography variant="controlLabel">Increasing tribal authority</Typography>
            <ArrowForwardRoundedIcon aria-hidden="true" />
          </Stack>
        </Stack>

        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
            gap: theme.jtSpacing.gap.md,
          })}
        >
          {pathways.map((pathway) => (
            <PathwayCard key={pathway.title} pathway={pathway} />
          ))}
        </Box>
      </Container>

      {/* Separate consultation from stewardship while keeping it visibly foundational. */}
      <Box
        sx={(theme) => ({
          bgcolor: 'translucent.primaryBlueSubtle',
          py: theme.jtSpacing.section.md,
        })}
      >
        <Container>
          <Box
            sx={(theme) => ({
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 2fr)' },
              gap: theme.jtSpacing.gap.lg,
              alignItems: 'start',
            })}
          >
            <Box>
              <Typography variant="eyebrow">A necessary foundation</Typography>
              <Typography variant="h3" component="h2" sx={{ mt: 1.5 }}>
                Consultation and engagement
              </Typography>
            </Box>
            <Typography variant="bodyLarge">
              Early, often, and meaningful tribal consultation and engagement is necessary and
              critical to building partnerships between tribes and non-tribal entities but alone is
              not considered tribal stewardship under this Policy.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={(theme) => ({ py: theme.jtSpacing.section.lg })}>
        <Container>
          <Typography variant="eyebrow">Across every pathway</Typography>
          <Typography variant="h2" component="h2" sx={{ maxWidth: '20ch', mt: 1.5 }}>
            Respectful, Durable, and Mutually Beneficial Relationships and Agreements
          </Typography>
          <Typography
            variant="body1"
            sx={(theme) => ({ maxWidth: theme.jtSpacing.paragraphMaxWidth.default, mt: 3 })}
          >
            Tribal stewardship agreements should be respectful, durable, and mutually beneficial.
            Partnering on tribal access, collaboration, and ancestral land return projects might
            include aspects of tribal consultation and engagement, but go above and beyond standard
            consultations to create a lasting relationship built on a foundation of respect and
            shared priorities.
          </Typography>
        </Container>
      </Box>
    </PageLayout>
  )
}
