// The story page's navigation below lg, where the rail, the scenario tabs and the map column
// don't fit. A dock at the bottom of the screen, in thumb reach, carries both: the chapter
// in view (tap for every chapter) and the map, which opens full screen. Switching a map site
// on from the text shows a small live preview of the map just above the dock.
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  Drawer,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { storyScenarios, type OrderedChapter, type ScenarioContent } from '@/content/scenarios'
import { getLegendItem } from '@/map/scenarios/config'
import { jtSpacing, navigation } from '@/theme'
import { focusRing } from '@/ui/focusRing'
import useScrollSpy from '@/ui/useScrollSpy'
import ScenarioChip from './ScenarioChip'
import StoryMap from './StoryMap'

const { bottomDock } = navigation
/** The live map preview's height, above the dock. */
const PEEK_HEIGHT = 168
/** The chapter progress ring: its box and the radius of its track. */
const RING_SIZE = 44
const RING_RADIUS = 18
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

type SelectHabitat = (update: (current: string | null) => string | null) => void

interface MobileStoryNavProps {
  scenario: ScenarioContent
  chapters: OrderedChapter[]
  selectedHabitatType: string | null
  onSelectHabitat: SelectHabitat
  /** Tiered outflows is not one of the five adaptation scenarios: no scenario list. */
  isTieredOutflows: boolean
}

const scrollToSection = (id: string) => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // 'instant', not 'auto': the site's global CSS makes 'auto' scroll smoothly.
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' })
}

/** The map sites a reader can switch on: each chapter row that names a map feature. */
function useMapSites(scenario: ScenarioContent, chapters: OrderedChapter[]) {
  return chapters.flatMap(({ chapter }) =>
    (chapter.highlights ?? []).flatMap((highlight) => {
      const key = highlight.mapSelectionKey ?? highlight.mapHabitatType
      const symbol = key ? getLegendItem(scenario.slug, key) : undefined
      return key && symbol ? [{ key, symbol, label: symbol.label }] : []
    }),
  )
}

/** Shared look of the dock, the preview and the map sheet's key: a raised dark panel. */
const raisedPanelSx = {
  bgcolor: 'base.900',
  border: 1,
  borderColor: 'border.default',
  borderRadius: 5,
  boxShadow: navigation.dropdownShadow,
} as const

/** The chapter's place in the story, as a ring that fills chapter by chapter. */
function ProgressRing({ position, total }: { position: number; total: number }) {
  const theme = useTheme()
  return (
    <Box sx={{ position: 'relative', width: RING_SIZE, height: RING_SIZE, flex: 'none' }}>
      <Box
        component="svg"
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        aria-hidden="true"
        sx={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={theme.palette.base[400]}
          strokeWidth={3}
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={`${(RING_LENGTH * position) / total} ${RING_LENGTH}`}
          style={{ transition: 'stroke-dasharray 300ms ease' }}
        />
      </Box>
      <Typography
        variant="numberBadge"
        component="span"
        sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}
      >
        {String(position).padStart(2, '0')}
      </Typography>
    </Box>
  )
}

export default function MobileStoryNav({
  scenario,
  chapters,
  selectedHabitatType,
  onSelectHabitat,
  isTieredOutflows,
}: MobileStoryNavProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [pendingChapter, setPendingChapter] = useState<string | null>(null)
  const activeId = useScrollSpy(['overview', ...chapters.map(({ anchor }) => anchor)])
  const mapSites = useMapSites(scenario, chapters)

  const activeIndex = chapters.findIndex(({ anchor }) => anchor === activeId)
  const arriving = activeIndex === -1
  const current = chapters[Math.max(activeIndex, 0)]
  const selectedSite = mapSites.find((site) => site.key === selectedHabitatType)
  const toggleSite = (key: string) => onSelectHabitat((selected) => (selected === key ? null : key))

  const openChapter = (anchor: string) => {
    // Scroll once the sheet has gone: the open sheet locks the page's scroll.
    setPendingChapter(anchor)
    setSheetOpen(false)
  }

  return (
    <>
      {/* The live map preview: shown while a site is on and the full map is closed. */}
      {selectedSite && !mapOpen && (
        <Box
          component="aside"
          aria-label="Map preview"
          sx={{
            ...raisedPanelSx,
            position: 'fixed',
            zIndex: 1100,
            left: bottomDock.inset,
            right: bottomDock.inset,
            bottom: bottomDock.inset * 2 + bottomDock.height,
            height: PEEK_HEIGHT,
            overflow: 'hidden',
          }}
        >
          <StoryMap
            scenario={scenario}
            selectedHabitatType={selectedHabitatType}
            layout="fill"
            showLegend={false}
          />
          <Stack
            spacing={jtSpacing.gap.xs}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              p: jtSpacing.component.md,
              pr: jtSpacing.section.sm,
              pointerEvents: 'none',
              background: (theme) =>
                `linear-gradient(180deg, ${theme.palette.translucent[800]} 0%, transparent 100%)`,
            }}
          >
            <Typography variant="eyebrow" component="p">
              On the map
            </Typography>
            <Typography variant="cardTitle" component="p">
              {selectedSite.label}
            </Typography>
          </Stack>
          <IconButton
            aria-label={`Hide ${selectedSite.label} on the map`}
            onClick={() => toggleSite(selectedSite.key)}
            sx={{
              position: 'absolute',
              top: jtSpacing.gap.sm,
              right: jtSpacing.gap.sm,
              color: 'common.white',
              bgcolor: 'translucent.800',
              '&:hover': { bgcolor: 'base.900' },
            }}
          >
            <CloseIcon sx={{ width: 18, height: 18 }} />
          </IconButton>
          <Button
            variant="contained"
            onClick={() => setMapOpen(true)}
            startIcon={<OpenInFullIcon />}
            sx={{
              position: 'absolute',
              right: jtSpacing.component.sm,
              bottom: jtSpacing.component.sm,
              bgcolor: 'base.900',
              color: 'common.white',
              '&:hover': { bgcolor: 'base.700' },
            }}
          >
            Full map
          </Button>
        </Box>
      )}

      {/* The dock: the chapter in view on the left, the map on the right. */}
      <Box
        component="nav"
        aria-label="Story navigation"
        sx={{
          ...raisedPanelSx,
          position: 'fixed',
          zIndex: 1100,
          left: bottomDock.inset,
          right: bottomDock.inset,
          bottom: bottomDock.inset,
          height: bottomDock.height,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: jtSpacing.gap.xs,
          px: jtSpacing.gap.xs,
        }}
      >
        {arriving ? (
          <ButtonBase
            onClick={() => scrollToSection(chapters[0].anchor)}
            sx={{
              flex: 1,
              minWidth: 0,
              height: bottomDock.height - 12,
              justifyContent: 'flex-start',
              gap: jtSpacing.gap.sm,
              px: jtSpacing.gap.sm,
              borderRadius: 4,
              bgcolor: 'primary.main',
              color: 'common.black',
              '&:focus-visible': focusRing,
            }}
          >
            <ArrowDownwardIcon sx={{ width: 22, height: 22 }} />
            <Stack sx={{ minWidth: 0, alignItems: 'flex-start' }}>
              <Typography variant="eyebrow" component="span" sx={{ color: 'common.black' }}>
                Start reading
              </Typography>
              <Typography variant="cardTitle" component="span" noWrap>
                {chapters[0].label}
              </Typography>
            </Stack>
          </ButtonBase>
        ) : (
          <ButtonBase
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-label={`Chapter ${activeIndex + 1} of ${chapters.length}, ${current.label}. Show all chapters`}
            sx={{
              flex: 1,
              minWidth: 0,
              height: bottomDock.height - 12,
              justifyContent: 'flex-start',
              gap: jtSpacing.gap.sm,
              px: jtSpacing.gap.xs,
              borderRadius: 4,
              color: 'common.white',
              '&:hover': { bgcolor: 'translucent.primaryGreen' },
              '&:focus-visible': focusRing,
            }}
          >
            <ProgressRing position={activeIndex + 1} total={chapters.length} />
            <Stack sx={{ flex: 1, minWidth: 0, alignItems: 'flex-start' }}>
              <Typography variant="eyebrow" component="span" sx={{ color: 'base.100' }}>
                Chapter {activeIndex + 1} of {chapters.length}
              </Typography>
              <Typography variant="cardTitle" component="span" noWrap sx={{ maxWidth: 1 }}>
                {current.label}
              </Typography>
            </Stack>
            <ExpandLessIcon sx={{ width: 22, height: 22 }} />
          </ButtonBase>
        )}
        <Box aria-hidden="true" sx={{ width: '1px', height: 36, bgcolor: 'border.default' }} />
        <ButtonBase
          onClick={() => setMapOpen(true)}
          aria-haspopup="dialog"
          aria-label={selectedSite ? `Map, ${selectedSite.label} shown` : 'Map'}
          sx={{
            position: 'relative',
            width: 64,
            height: bottomDock.height - 12,
            flexDirection: 'column',
            gap: jtSpacing.gap.xs,
            borderRadius: 4,
            color: selectedSite ? 'primary.main' : 'common.white',
            bgcolor: selectedSite ? 'translucent.primaryGreen' : 'transparent',
            '&:hover': { bgcolor: 'translucent.primaryGreen' },
            '&:focus-visible': focusRing,
          }}
        >
          <MapOutlinedIcon sx={{ width: 22, height: 22 }} />
          <Typography variant="controlLabel" component="span">
            Map
          </Typography>
        </ButtonBase>
      </Box>

      {/* Every chapter, where the reader is, and the other scenarios. */}
      <Drawer
        anchor="bottom"
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        slotProps={{
          paper: {
            sx: {
              maxHeight: '86dvh',
              bgcolor: 'base.700',
              backgroundImage: 'none',
              borderTop: 1,
              borderColor: 'border.default',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              pb: jtSpacing.component.lg,
            },
          },
          transition: {
            onExited: () => {
              if (pendingChapter) scrollToSection(pendingChapter)
              setPendingChapter(null)
            },
          },
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            alignSelf: 'center',
            width: 40,
            height: 4,
            mt: jtSpacing.gap.sm,
            borderRadius: 1,
            bgcolor: 'base.400',
          }}
        />
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            pl: jtSpacing.page.x.xs,
            pr: jtSpacing.gap.sm,
            pt: jtSpacing.gap.sm,
          }}
        >
          <Stack spacing={jtSpacing.gap.xs}>
            {!isTieredOutflows && (
              <Typography variant="eyebrow" component="p" sx={{ color: 'base.100' }}>
                {scenario.number} of {String(storyScenarios.length).padStart(2, '0')} adaptation
                scenarios
              </Typography>
            )}
            <Typography variant="h4" component="h2">
              {scenario.title}
            </Typography>
          </Stack>
          <IconButton
            aria-label="Close chapters"
            onClick={() => setSheetOpen(false)}
            sx={{ color: 'common.white', bgcolor: 'base.500' }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box
          component="ol"
          aria-label="Chapters"
          sx={{ listStyle: 'none', m: 0, mt: jtSpacing.gap.sm, px: jtSpacing.gap.sm, py: 0 }}
        >
          {chapters.map(({ anchor, label, chapter }, index) => {
            const here = index === activeIndex
            const read = index < activeIndex
            return (
              <li key={anchor}>
                <ButtonBase
                  onClick={() => openChapter(anchor)}
                  aria-current={here ? 'step' : undefined}
                  sx={{
                    width: 1,
                    minHeight: 64,
                    display: 'grid',
                    gridTemplateColumns: '36px minmax(0, 1fr) 28px',
                    alignItems: 'center',
                    gap: jtSpacing.gap.sm,
                    px: jtSpacing.component.sm,
                    py: jtSpacing.gap.sm,
                    borderRadius: 4,
                    textAlign: 'left',
                    color: here ? 'common.black' : 'common.white',
                    bgcolor: here ? 'primary.main' : 'transparent',
                    '&:hover': { bgcolor: here ? 'primary.main' : 'translucent.primaryGreen' },
                    '&:focus-visible': focusRing,
                  }}
                >
                  <Typography
                    variant="numberBadge"
                    component="span"
                    sx={{ color: here ? 'common.black' : 'primary.main' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                  <Stack sx={{ minWidth: 0 }}>
                    <Typography variant="cardTitle" component="span">
                      {label}
                    </Typography>
                    <Typography
                      variant="meta"
                      component="span"
                      sx={{ color: here ? 'common.black' : 'base.100' }}
                    >
                      {chapter.title}
                    </Typography>
                  </Stack>
                  {read && (
                    <CheckIcon
                      aria-label="Read"
                      sx={{ width: 20, height: 20, color: 'primary.main', justifySelf: 'center' }}
                    />
                  )}
                </ButtonBase>
              </li>
            )
          })}
        </Box>

        {!isTieredOutflows && (
          <Stack
            spacing={jtSpacing.gap.sm}
            sx={{
              mx: jtSpacing.page.x.xs,
              mt: jtSpacing.component.md,
              pt: jtSpacing.component.md,
              borderTop: 1,
              borderColor: 'border.subtle',
            }}
          >
            <Typography variant="eyebrow" component="h3" sx={{ color: 'base.100' }}>
              Other scenarios
            </Typography>
            <Stack
              component="ul"
              direction="row"
              spacing={jtSpacing.gap.sm}
              sx={{
                listStyle: 'none',
                m: 0,
                p: 0,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {storyScenarios
                .filter((other) => other.slug !== scenario.slug)
                .map((other) => (
                  <li key={other.slug}>
                    <Button
                      component={Link}
                      to={`/scenarios/${other.slug}`}
                      variant="outlined"
                      onClick={() => setSheetOpen(false)}
                      sx={{ whiteSpace: 'nowrap', color: 'common.white', borderColor: 'base.300' }}
                    >
                      <Typography variant="numberBadge" component="span" sx={{ mr: 1 }}>
                        {other.number}
                      </Typography>
                      {other.title}
                    </Button>
                  </li>
                ))}
            </Stack>
          </Stack>
        )}

        <Button
          variant="outlined"
          startIcon={<MapOutlinedIcon />}
          onClick={() => {
            setSheetOpen(false)
            setMapOpen(true)
          }}
          sx={{ mx: jtSpacing.page.x.xs, mt: jtSpacing.component.lg, color: 'common.white' }}
        >
          Open the map
        </Button>
      </Drawer>

      {/* The map, full screen, with a switch for each site the story names. */}
      <Dialog
        fullScreen
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        aria-labelledby="story-map-title"
        slotProps={{ paper: { sx: { bgcolor: 'base.800', backgroundImage: 'none' } } }}
      >
        <Stack
          direction="row"
          sx={{
            height: navigation.barHeight.xs,
            flex: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: jtSpacing.gap.sm,
            bgcolor: 'base.900',
            borderBottom: 1,
            borderColor: 'border.subtle',
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setMapOpen(false)}
            sx={{ color: 'common.white' }}
          >
            Back to the story
          </Button>
          <Typography
            id="story-map-title"
            variant="eyebrow"
            component="h2"
            noWrap
            sx={{ pr: jtSpacing.gap.sm }}
          >
            {scenario.title} map
          </Typography>
        </Stack>
        <Box sx={{ position: 'relative', flex: 1, minHeight: 0 }}>
          <StoryMap
            scenario={scenario}
            selectedHabitatType={selectedHabitatType}
            layout="fill"
            showLegend={mapSites.length === 0}
          />
          {mapSites.length > 0 && (
            <Stack
              role="group"
              aria-label="Map sites"
              sx={{
                ...raisedPanelSx,
                position: 'absolute',
                left: bottomDock.inset,
                right: bottomDock.inset,
                bottom: bottomDock.inset,
                p: jtSpacing.component.sm,
              }}
            >
              {mapSites.map((site) => (
                <FormControlLabel
                  key={site.key}
                  labelPlacement="start"
                  control={
                    <Switch
                      checked={selectedHabitatType === site.key}
                      onChange={() => toggleSite(site.key)}
                    />
                  }
                  label={
                    <Stack direction="row" spacing={jtSpacing.gap.sm} sx={{ alignItems: 'center' }}>
                      <ScenarioChip
                        symbol={site.symbol}
                        selected={selectedHabitatType === site.key}
                      />
                      <Typography variant="cardTitle" component="span">
                        {site.label}
                      </Typography>
                    </Stack>
                  }
                  sx={{ m: 0, minHeight: 56, justifyContent: 'space-between' }}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Dialog>
    </>
  )
}
