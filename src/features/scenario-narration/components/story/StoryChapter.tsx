import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import type { ScenarioChapter } from '@/content/scenarios'
import { getLegendItem } from '@/map/scenarios/config'
import { jtSpacing } from '@/theme'
import HighlightedParagraph from './HighlightedParagraph'
import MapLegendRow from './MapLegendRow'
import ScenarioChip, { chipWidth } from './ScenarioChip'

const renderNarrationText = (text: string) => <HighlightedParagraph text={text} />
const renderBoldNarrationText = (text: string) => (
  <HighlightedParagraph text={text} boldPrimaryBlue />
)

/** One chapter of the story: its text, map keys and the map layers it can switch on. */
export default function StoryChapter({
  chapter,
  anchor,
  scenarioSlug,
  isTieredOutflows,
  boldPrimaryBlue,
  selectedHabitatType,
  onSelectHabitat,
}: {
  chapter: ScenarioChapter
  anchor: string
  scenarioSlug: string
  isTieredOutflows: boolean
  boldPrimaryBlue: boolean
  selectedHabitatType: string | null
  onSelectHabitat: (update: (current: string | null) => string | null) => void
}) {
  return (
    <Box
      component="section"
      id={anchor}
      sx={{
        scrollMarginTop: (theme) => theme.spacing(jtSpacing.section.lg),
        pt: jtSpacing.section.md,
        borderTop: 1,
        borderColor: 'border.subtle',
        ...(chapter.chip && {
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: `${chipWidth}px minmax(0, 1fr)` },
          columnGap: jtSpacing.component.md,
          rowGap: jtSpacing.component.xs,
        }),
      }}
    >
      {chapter.chip && (
        <Box sx={{ gridRow: { sm: '1 / 3' }, justifySelf: 'start' }}>
          <ScenarioChip>{chapter.chip}</ScenarioChip>
        </Box>
      )}
      <Typography variant={chapter.chip ? 'h4' : 'h3'} component="h3">
        {chapter.title}
      </Typography>
      <Stack
        spacing={jtSpacing.gap.md}
        sx={{
          mt: jtSpacing.component.lg,
          minWidth: 0,
          ...(chapter.chip && { gridColumn: { sm: 2 } }),
        }}
      >
        {chapter.paragraphs.map((paragraph) => (
          <Typography variant="body1" key={paragraph} sx={{ color: 'base.100' }}>
            <HighlightedParagraph
              text={paragraph}
              tieredOutflows={isTieredOutflows}
              boldPrimaryBlue={boldPrimaryBlue}
            />
          </Typography>
        ))}
        {chapter.mapKey && (
          <Box
            aria-label={`${chapter.title} map key`}
            role="group"
            sx={{ mt: jtSpacing.component.md }}
          >
            {chapter.mapKey.map((selectionKey) => {
              const symbol = getLegendItem(scenarioSlug, selectionKey)
              return (
                symbol && <MapLegendRow key={selectionKey} title={symbol.label} symbol={symbol} />
              )
            })}
          </Box>
        )}
        {chapter.highlights && (
          <Box
            component="aside"
            aria-label={`${chapter.title} interactive map layers`}
            sx={{ mt: jtSpacing.component.md }}
          >
            {chapter.highlights.map((highlight) => {
              const habitatType = highlight.mapSelectionKey ?? highlight.mapHabitatType
              const symbol = habitatType ? getLegendItem(scenarioSlug, habitatType) : undefined

              return (
                <MapLegendRow
                  key={highlight.title}
                  title={highlight.title}
                  summary={highlight.summary}
                  paragraphs={highlight.paragraphs}
                  renderText={boldPrimaryBlue ? renderBoldNarrationText : renderNarrationText}
                  symbol={symbol}
                  selected={symbol != null && selectedHabitatType === habitatType}
                  dimmed={
                    symbol != null &&
                    selectedHabitatType != null &&
                    selectedHabitatType !== habitatType
                  }
                  onSelect={
                    habitatType
                      ? () =>
                          onSelectHabitat((current) =>
                            current === habitatType ? null : habitatType,
                          )
                      : undefined
                  }
                />
              )
            })}
          </Box>
        )}
        {chapter.highlightsAction && (
          <Button
            component={Link}
            to={chapter.highlightsAction.href}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{ alignSelf: 'flex-start', mt: jtSpacing.component.lg }}
          >
            {chapter.highlightsAction.label}
          </Button>
        )}
        {chapter.subsections?.map((subsection) => (
          <Box id={subsection.id} key={subsection.title} sx={{ pt: jtSpacing.component.lg }}>
            <Typography variant="h4" component="h4">
              {subsection.title}
            </Typography>
            <Stack spacing={jtSpacing.gap.md} sx={{ mt: jtSpacing.component.md }}>
              {subsection.paragraphs.map((paragraph) => (
                <Typography variant="body1" key={paragraph} sx={{ color: 'base.100' }}>
                  <HighlightedParagraph
                    text={paragraph}
                    tieredOutflows={isTieredOutflows}
                    boldPrimaryBlue={boldPrimaryBlue}
                  />
                </Typography>
              ))}
              {subsection.orderedItems && (
                <Box
                  component="ol"
                  sx={{
                    m: 0,
                    pl: jtSpacing.component.xl,
                    color: 'base.100',
                  }}
                >
                  {subsection.orderedItems.map((item) => (
                    <Typography
                      component="li"
                      variant="body1"
                      key={item}
                      sx={{ pl: jtSpacing.gap.sm }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              )}
            </Stack>
          </Box>
        ))}
        {chapter.endingParagraphs?.map((paragraph) => (
          <Typography variant="body1" key={paragraph} sx={{ color: 'base.100' }}>
            <HighlightedParagraph
              text={paragraph}
              tieredOutflows={isTieredOutflows}
              boldPrimaryBlue={boldPrimaryBlue}
            />
          </Typography>
        ))}
        {chapter.primaryAction && (
          <Button
            component={Link}
            to={chapter.primaryAction.href}
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            sx={{ alignSelf: 'flex-start', mt: jtSpacing.component.lg }}
          >
            {chapter.primaryAction.label}
          </Button>
        )}
        {chapter.relatedLinks && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            useFlexGap
            spacing={jtSpacing.gap.sm}
            sx={{ flexWrap: 'wrap', mt: jtSpacing.component.md }}
          >
            {chapter.relatedLinks.map((link) => (
              <Button
                key={link.href}
                component={Link}
                to={link.href}
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
