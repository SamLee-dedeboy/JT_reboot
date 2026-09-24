// Ported from JT_dashboard/src/lib/MentalModel/CodeTooltip.svelte. The optional
// `handleClose` prop / Close button was never passed by MentalModel and is
// omitted.
import { useMemo } from 'react'
import { colorForNode, textColorForNode } from './constants'
import type { CodebookEntry } from './constants'

type CodeTooltipProps = {
  codebook: CodebookEntry[]
  all_code_participants: Record<string, string[]>
  selected_code: string | undefined
}

type ChildParticipants = Record<string, string[]>

const count = (item: ChildParticipants) => Object.values(item)[0].length

export default function CodeTooltip({
  codebook,
  all_code_participants,
  selected_code,
}: CodeTooltipProps) {
  // Categorical color for the hovered node's type, used to tint the tooltip's
  // header so it stays visually linked to the node on the canvas.
  const node_type = codebook.find((code) => code.name === selected_code)?.type
  const node_color = colorForNode(node_type)
  const node_text_color = textColorForNode(node_type)

  const parent_to_child_participants = useMemo(() => {
    const child_dict = codebook.reduce<Record<string, string[]>>((acc, code) => {
      const parent_code = code.parent === 'N/A' ? code.name : code.parent
      acc[parent_code] = acc[parent_code] || []
      acc[parent_code].push(code.name)
      return acc
    }, {})
    const parent_codes = codebook.filter((code) => code.parent === 'N/A').map((code) => code.name)
    return parent_codes.reduce<Record<string, ChildParticipants[]>>((acc, parent) => {
      acc[parent] = child_dict[parent]
        .map((name) => ({ [name]: all_code_participants[name] || [] }))
        .filter((item) => count(item) > 0)
      return acc
    }, {})
  }, [codebook, all_code_participants])

  const tooltip_data = selected_code ? parent_to_child_participants[selected_code] : undefined
  const total_participants = tooltip_data
    ? tooltip_data.reduce((acc, item) => {
        Object.values(item)[0].forEach((participant) => acc.add(participant))
        return acc
      }, new Set<string>()).size
    : 0

  return (
    <div className="">
      {tooltip_data ? (
        <div
          className="tooltip-content jt-body-2 rounded text-white"
          style={{ backgroundColor: 'var(--surface-interactive)' }}
        >
          <h4
            className="inline-block px-2 py-1 rounded w-full"
            style={{ backgroundColor: node_color, color: node_text_color }}
          >
            {selected_code}
          </h4>
          <div className="px-6 pb-4">
            <p className="text-left mt-3">
              {codebook.find((code) => code.name === selected_code)?.definition ||
                'No definition available'}
            </p>
            <p className="text-left mt-2">
              <span className="font-semibold underline">{total_participants}</span> participants
              mentioned this.
            </p>
            {tooltip_data.length > 1 && (
              <>
                <p className="text-left">Among these {total_participants} participants,</p>
                <ul className="text-left">
                  <li className="ml-2">
                    - <span className="underline">{count(tooltip_data[0])}</span> participants
                    mentioned{' '}
                    <span className="underline italic">
                      {Object.keys(tooltip_data[0])[0]} (general)
                    </span>
                  </li>
                  {tooltip_data
                    .slice(1)
                    .sort((a, b) => count(b) - count(a))
                    .map((item) => (
                      <li key={Object.keys(item)[0]} className="ml-2">
                        - <span className="underline">{count(item)}</span> participants mentioned{' '}
                        <span className="underline italic">{Object.keys(item)[0]}</span>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="tooltip-content text-slate-700 text-lg">Select a code to see details.</div>
      )}
    </div>
  )
}
