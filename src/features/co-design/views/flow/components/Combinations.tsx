// Ported from JT_dashboard/src/lib/Flow/components/Combinations.svelte.
// Dropped: the unused leading_section_title / block_aggregator props, the
// commented-out base-block pickers and the per-row participant chips.
import CloseIcon from '@mui/icons-material/Close'
import { Box, ButtonBase, IconButton, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import InfoButton from '../../../shared/InfoButton'
import { useFlowState } from '../flowStore'

const cubicOut = (t: number) => (t - 1) ** 3 + 1
// Svelte plays an outro by running the intro easing backwards in time, which
// for cubicOut is cubicIn when expressed as a forward (framer-motion) ease.
const cubicIn = (t: number) => t ** 3

// Rows are 1.5rem apart in the strategy-label staircase; circles are 1.3rem.
const OPTION_STEP_REM = 1.5
const CIRCLE_SIZE = '1.3rem'

// Transparent layer over the panel that closes the help popover on click.
const HelpOverlay = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(0.5),
  right: theme.spacing(4),
  bottom: 0,
  left: 0,
  zIndex: 60,
}))

const HelpContent = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: theme.spacing(0.5),
  width: `calc(100% - ${theme.spacing(2)})`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  paddingRight: theme.spacing(3),
  color: theme.coDesign.flow.helpPopover.text,
  backgroundColor: theme.coDesign.flow.helpPopover.background,
  border: theme.coDesign.flow.helpPopover.border,
  borderRadius: theme.coDesign.flow.helpPopover.radius,
  boxShadow: theme.coDesign.flow.helpPopover.shadow,
}))

function LegendSwatch({ selected }: { selected: boolean }) {
  return (
    <Box
      component="span"
      sx={(theme) => {
        const tokens = theme.coDesign.flow.helpPopover
        return {
          display: 'inline-block',
          width: tokens.swatchSize,
          height: tokens.swatchSize,
          borderRadius: '50%',
          verticalAlign: '-0.25rem',
          mx: 0.25,
          bgcolor: tokens.swatchFill,
          border: `2px solid ${selected ? tokens.swatchBorderSelected : tokens.swatchBorderUnselected}`,
          opacity: selected ? 1 : 0.5,
        }
      }}
    />
  )
}

function aggregate_combinations(
  participant_combinations: { [key: string]: string },
  all_participants: string[],
) {
  const combination_participants: { [key: string]: string[] } = {}
  Object.entries(participant_combinations).forEach(([participant, combination]) => {
    if (combination_participants[combination] === undefined) {
      combination_participants[combination] = []
    }
    combination_participants[combination].push(participant)
  })
  combination_participants['empty'] = []
  all_participants.forEach((participant) => {
    if (participant_combinations[participant] === undefined) {
      combination_participants['empty'].push(participant)
    }
  })
  return combination_participants
}

export default function Combinations() {
  const combination_colors = useFlowState((s) => s.combination_colors)
  const combination_content = useFlowState((s) => s.combination_content)
  const participant_combinations = useFlowState((s) => s.participant_combinations)
  const all_participants = useFlowState((s) => s.all_participants)
  const highlighted_combinations = useFlowState((s) => s.highlighted_combinations)
  const rendered_combinations = useFlowState((s) => s.rendered_combinations)
  const leading_blocks = useFlowState((s) => s.leading_blocks)
  const clicked_normal_blocks = useFlowState((s) => s.clicked_normal_blocks)

  const [show_help_modal, setShowHelpModal] = useState(false)
  const rowTokens = useTheme().coDesign.flow.combinations

  // The original sorted `options` in place, so both share this order.
  const sorted_options = leading_blocks.map((b) => b.title).sort((a, b) => b.length - a.length)
  const clicked_titles = clicked_normal_blocks.map((b) => b.title)
  const clicked_options = sorted_options.filter((o) => clicked_titles.includes(o))

  const combination_participants = aggregate_combinations(
    participant_combinations,
    all_participants,
  )

  const sorted_combinations = [...rendered_combinations].sort(
    (a, b) =>
      -((combination_participants[a]?.length || 0) - (combination_participants[b]?.length || 0)),
  )

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        flexGrow: 1,
        flexDirection: 'column',
        rowGap: 0.5,
        pl: 1,
        pt: 1,
      }}
    >
      <InfoButton
        label="How to read this chart"
        onClick={() => setShowHelpModal(true)}
        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 50 }}
      />
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography variant="meta" component="p" sx={{ px: 0.5, mr: 8, color: 'base.50' }}>
          See how participants priorities align across the different salinity management strategies.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
        <Typography
          variant="controlLabel"
          component="h3"
          sx={(theme) => ({ color: theme.coDesign.flow.combinations.subtitle })}
        >
          Salinity Management Strategies
        </Typography>
        {/* Staircase of strategy labels with dotted leaders down to the circle columns */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 40,
            mt: 3,
            display: 'flex',
            maxWidth: '100%',
            userSelect: 'none',
            justifyContent: 'space-between',
            overflowX: 'visible',
            pl: 1.75,
            pr: 23.25,
            height: `${sorted_options.length * OPTION_STEP_REM}rem`,
          }}
        >
          {sorted_options.map((option, index) => {
            const option_clicked = clicked_options.includes(option)
            const label_bottom = (sorted_options.length - index) * OPTION_STEP_REM
            return (
              <Box
                key={option}
                sx={{ position: 'relative', width: CIRCLE_SIZE, mr: 0.5, flex: 'none' }}
              >
                <Typography
                  variant="controlLabel"
                  sx={(theme) => ({
                    position: 'absolute',
                    whiteSpace: 'nowrap',
                    bottom: `${label_bottom + 0.25}rem`,
                    left: 0,
                    color: option_clicked
                      ? theme.coDesign.flow.combinations.optionLabelActive
                      : theme.coDesign.flow.combinations.optionLabel,
                  })}
                >
                  {option}
                </Typography>
                <Box
                  sx={(theme) => ({
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: 2,
                    height: `${label_bottom + 0.25}rem`,
                    borderLeft: theme.coDesign.flow.combinations.connector,
                    zIndex: 30,
                    pointerEvents: 'none',
                  })}
                />
              </Box>
            )
          })}
        </Box>
        <Box
          sx={{
            display: 'flex',
            height: 4,
            flexGrow: 1,
            flexDirection: 'column',
            rowGap: 1,
            overflow: 'auto',
            pl: 1,
            pr: 23,
            scrollbarGutter: 'stable',
          }}
        >
          {sorted_combinations.map((combination, index) => {
            const combination_titles = combination_content[combination].map((b) => b.title)
            const circle_filled = sorted_options.map((o) => combination_titles.includes(o))
            const rendered = rendered_combinations.includes(combination)
            const highlighted = highlighted_combinations.includes(combination)
            return (
              <Box
                key={combination}
                role="button"
                tabIndex={index}
                sx={(theme) => ({
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 0.75,
                  py: 0.5,
                  opacity: rendered ? 1 : 0.15,
                  outline: highlighted ? theme.coDesign.flow.combinations.rowHighlightOutline : 0,
                  transition: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: theme.coDesign.flow.combinations.rowHoverShadow,
                    filter: 'brightness(0.9)',
                  },
                  '&:focus-visible': { outline: theme.coDesign.flow.combinations.rowFocusOutline },
                })}
                style={{ backgroundColor: combination_colors[combination] }}
                onClick={(e) => {
                  e.preventDefault()
                  // Highlighting a combination was disabled in the original.
                }}
              >
                {sorted_options.map((option, i) => (
                  <Box
                    component="svg"
                    key={option}
                    viewBox="0 0 100 110"
                    sx={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
                  >
                    <circle
                      cx="50"
                      cy="55"
                      r="50"
                      strokeWidth="8"
                      fill={rowTokens.circleFill}
                      opacity={circle_filled[i] ? 1 : 0.2}
                      stroke={
                        circle_filled[i]
                          ? rowTokens.circleStrokeSelected
                          : rowTokens.circleStrokeUnselected
                      }
                    />
                  </Box>
                ))}
                <Typography
                  variant="meta"
                  sx={(theme) => ({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: '101%',
                    display: 'flex',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 0.5,
                    color: theme.coDesign.flow.combinations.count,
                  })}
                >
                  {combination_participants[combination].length}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>

      <AnimatePresence>
        {show_help_modal && (
          <HelpOverlay
            role="dialog"
            aria-modal="true"
            aria-label="How to read this chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'linear' }}
          >
            <ButtonBase
              aria-label="Close modal"
              disableRipple
              onClick={() => setShowHelpModal(false)}
              sx={{ position: 'absolute', inset: 0 }}
            />
            <HelpContent
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0, transition: { duration: 0.2, ease: cubicIn } }}
              transition={{ duration: 0.2, ease: cubicOut }}
            >
              <IconButton
                aria-label="Close"
                size="small"
                onClick={() => setShowHelpModal(false)}
                sx={(theme) => ({
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: theme.coDesign.flow.helpPopover.close,
                  '&:hover, &:focus-visible': { color: theme.coDesign.flow.helpPopover.closeHover },
                })}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <Typography variant="h5" component="h3" sx={{ pr: 3 }}>
                How to read this chart
              </Typography>
              <Typography variant="body2" sx={{ color: 'base.50' }}>
                Each row represents participants who supports the same set of
                <Box component="span" sx={{ textDecoration: 'underline' }}>
                  {' '}
                  salinity management strategies
                </Box>
                .
              </Typography>
              <Typography variant="body2" sx={{ color: 'base.50' }}>
                <LegendSwatch selected /> A filled circle means the group picked that strategy;{' '}
                <LegendSwatch selected={false} /> an empty circle means they did not.
              </Typography>
              <Typography variant="body2" sx={{ color: 'base.50' }}>
                The initials on the right show which participants share that combination.
              </Typography>
            </HelpContent>
          </HelpOverlay>
        )}
      </AnimatePresence>
    </Box>
  )
}
