// Ported from JT_dashboard/src/lib/Flow/components/Combinations.svelte.
// Dropped: the unused leading_section_title / block_aggregator props, the
// commented-out base-block pickers and the per-row participant chips.
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import InfoButton from '../../../shared/InfoButton'
import { useFlowState } from '../flowStore'
import './Combinations.css'

const cubicOut = (t: number) => (t - 1) ** 3 + 1
// Svelte plays an outro by running the intro easing backwards in time, which
// for cubicOut is cubicIn when expressed as a forward (framer-motion) ease.
const cubicIn = (t: number) => t ** 3

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
    <div className="jtd-Combinations combinations-container relative flex w-full grow flex-col gap-y-1 pl-2 pt-2">
      <InfoButton
        className="absolute right-2 top-2 z-50"
        label="How to read this chart"
        onClick={() => setShowHelpModal(true)}
      />
      <div className="flex mb-2">
        <span className="px-1 text-[0.925rem] mr-8">
          See how participants priorities align across the different salinity management strategies.
        </span>
      </div>
      <div className="flex grow flex-col">
        <div style={{ color: 'var(--text-subtitle)' }}>Salinity Management Strategies</div>
        <div
          className="column-headers relative z-[40] mt-6 flex max-w-full select-none justify-between overflow-x-visible"
          style={{
            paddingLeft: '0.875rem',
            paddingRight: '11.625rem',
            height: `${sorted_options.length * 1.5}rem`,
          }}
        >
          {sorted_options.map((option, index) => {
            const option_clicked = clicked_options.includes(option)
            const label_bottom = (sorted_options.length - index) * 1.5
            return (
              <div key={option} className="column-anchor relative w-[1.3rem] mr-1 flex-none">
                <span
                  className="absolute whitespace-nowrap text-sm"
                  style={{
                    bottom: `${label_bottom + 0.25}rem`,
                    left: 0,
                    color: option_clicked ? 'white' : 'darkgray',
                  }}
                >
                  {option}
                </span>
                <div
                  className="connecting-line"
                  style={{ bottom: 0, left: '50%', height: `${label_bottom + 0.25}rem` }}
                ></div>
              </div>
            )
          })}
        </div>
        <div
          className="combinations-list flex h-1 grow flex-col gap-y-2 overflow-auto pl-2 pr-46 text-sm"
          style={{ scrollbarGutter: 'stable' }}
        >
          {sorted_combinations.map((combination, index) => {
            const combination_titles = combination_content[combination].map((b) => b.title)
            const circle_filled = sorted_options.map((o) => combination_titles.includes(o))
            const classes = [
              'combination-container relative flex justify-between px-1.5 py-1 opacity-15 outline-0 outline-black transition-opacity hover:shadow-md hover:brightness-90',
              rendered_combinations.includes(combination) ? 'rendered' : '',
              highlighted_combinations.includes(combination) ? 'highlighted' : '',
            ]
            return (
              <div
                key={combination}
                role="button"
                tabIndex={index}
                className={classes.join(' ')}
                style={{ backgroundColor: combination_colors[combination] }}
                onClick={(e) => {
                  e.preventDefault()
                  // Highlighting a combination was disabled in the original.
                }}
              >
                {sorted_options.map((option, i) => (
                  <svg key={option} className="h-[1.3rem] w-[1.3rem]" viewBox="0 0 100 110">
                    <circle
                      cx="50"
                      cy="55"
                      r="50"
                      fill="white"
                      opacity={circle_filled[i] ? 1 : 0.2}
                      strokeWidth="8"
                      stroke={circle_filled[i] ? '#444444' : 'lightgray'}
                    ></circle>
                  </svg>
                ))}
                <div className="participant-chips absolute bottom-0 left-[101%] right-0 top-0 flex items-center gap-1 px-1">
                  {combination_participants[combination].length}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {show_help_modal && (
          <motion.div
            className="help-modal-overlay absolute left-0 right-8 top-1 inset-0 z-60"
            role="dialog"
            aria-modal="true"
            aria-label="How to read this chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'linear' }}
          >
            <button
              type="button"
              className="modal-backdrop absolute inset-0"
              aria-label="Close modal"
              onClick={() => setShowHelpModal(false)}
            ></button>
            <motion.div
              className="help-modal-content absolute left-1 right-0 top-0 flex w-full flex-col gap-2 rounded p-4 pr-6 text-base"
              style={{ width: 'calc(100% - 1rem)' }}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0, transition: { duration: 0.2, ease: cubicIn } }}
              transition={{ duration: 0.2, ease: cubicOut }}
            >
              <button
                type="button"
                className="modal-close absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded text-sm"
                aria-label="Close"
                onClick={() => setShowHelpModal(false)}
              >
                ×
              </button>
              <div className="font-semibold">How to read this chart</div>
              <div>
                Each row represents participants who supports the same set of
                <span className="underline"> salinity management strategies</span>.
              </div>
              <div>
                <span className="legend-swatch-filled"></span> A filled circle means the group
                picked that strategy; <span className="legend-swatch-empty"></span> an empty circle
                means they did not.
              </div>
              <div>The initials on the right show which participants share that combination.</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
