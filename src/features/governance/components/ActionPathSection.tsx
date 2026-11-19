// The shared-actions section: how to read the path tree, the scenario pin, the key to
// colors and shapes, and the tree itself.
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { scenarioName } from '@/content/names'
import { jtSpacing } from '@/theme'
import { Section, SectionHead, Segmented } from '@/ui'
import { PATH_SECTION, STRATEGY_AREA_NAMES } from '../content'
import { ACTIONS } from '../data/actions'
import type { GovernanceScenarioKey, LeadKey, StrategyAreaKey } from '../data/types'
import { BRANCH_ORDER, topActionIds } from '../model/pathTree'
import ActionMark from './ActionMark'
import ActionPathTree from './ActionPathTree'

type Pin = GovernanceScenarioKey | 'all'
type LeadPin = LeadKey | 'all'
const AREAS: StrategyAreaKey[] = ['FL', 'ECO', 'AG', 'WSR']
const topCount = topActionIds(ACTIONS).size
/** The shape key draws a stub of path before each mark. */
const SHAPE_KEY_WIDTH = 30

/** One entry in the key: a small mark or swatch, then its words. */
function KeyItem({
  mark,
  label,
  width = 14,
}: {
  mark: React.ReactNode
  label: string
  width?: number
}) {
  return (
    <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: jtSpacing.gap.xs }}>
      <Box
        component="svg"
        aria-hidden
        width={width}
        height={14}
        viewBox={`0 0 ${width} 14`}
        sx={{ flex: 'none' }}
      >
        {mark}
      </Box>
      <Typography variant="captionSmall" component="span" sx={{ color: 'common.white' }}>
        {label}
      </Typography>
    </Box>
  )
}

const keyList = {
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: jtSpacing.gap.lg,
  rowGap: jtSpacing.gap.xs,
  m: 0,
  p: 0,
  listStyle: 'none',
} as const

export default function ActionPathSection() {
  const theme = useTheme()
  const tokens = theme.chart.governance
  const [pin, setPin] = useState<Pin>('all')
  // Set by tapping a lead organization's name over its lane in the tree.
  const [lead, setLead] = useState<LeadPin>('all')
  const neutral = tokens.member
  const markX = SHAPE_KEY_WIDTH - 7
  // A short path ahead of each shape.
  const pathStub = <line x1={0} x2={markX} y1={7} y2={7} stroke={tokens.path} strokeWidth={1.2} />

  return (
    <Section id={PATH_SECTION.id}>
      <SectionHead eyebrow={PATH_SECTION.eyebrow} title={PATH_SECTION.title} />

      {/* The scenario pin, then the key to colors and shapes. */}
      <Stack spacing={jtSpacing.gap.md} sx={{ mt: jtSpacing.section.sm }}>
        <Stack spacing={jtSpacing.gap.xs}>
          <Typography variant="columnHead" component="span" sx={{ color: 'base.100' }}>
            {PATH_SECTION.pinLabel}
          </Typography>
          <Segmented<Pin>
            label={PATH_SECTION.pinLabel}
            value={pin}
            onChange={setPin}
            wrap
            options={[
              { value: 'all', label: PATH_SECTION.pinAll },
              ...BRANCH_ORDER.map((key) => ({
                value: key,
                label: scenarioName(key),
              })),
            ]}
          />
        </Stack>
        <Box component="ul" aria-label="Strategy areas" sx={keyList}>
          {AREAS.map((area) => (
            <KeyItem
              key={area}
              label={`${STRATEGY_AREA_NAMES[area]} (${ACTIONS.filter((a) => a.area === area).length})`}
              mark={<circle cx={7} cy={7} r={5} fill={tokens.area[area]} />}
            />
          ))}
        </Box>
        <Box component="ul" aria-label="Shapes" sx={keyList}>
          <KeyItem
            label={PATH_SECTION.shapes.shared}
            width={SHAPE_KEY_WIDTH}
            mark={
              <>
                {pathStub}
                <ActionMark cx={markX} cy={7} r={4.5} color={neutral} top={false} />
              </>
            }
          />
          <KeyItem
            label={PATH_SECTION.shapes.single}
            width={SHAPE_KEY_WIDTH}
            mark={
              <>
                <rect x={0} y={0} width={SHAPE_KEY_WIDTH} height={14} rx={3} fill={tokens.band} />
                {pathStub}
                <ActionMark cx={markX} cy={7} r={4.5} color={neutral} top={false} />
              </>
            }
          />
          <KeyItem
            label={`${PATH_SECTION.shapes.top} (${topCount})`}
            width={SHAPE_KEY_WIDTH}
            mark={
              <>
                {pathStub}
                <ActionMark cx={markX} cy={7} r={4} color={neutral} top />
              </>
            }
          />
          <KeyItem
            label={PATH_SECTION.shapes.lead}
            mark={
              <>
                <line x1={7} x2={7} y1={0} y2={14} stroke={tokens.leadLane} strokeWidth={1.5} />
                <rect x={4.5} y={4.5} width={5} height={5} fill={tokens.lead} />
              </>
            }
          />
        </Box>
        <Typography variant="captionSmall" component="p">
          {PATH_SECTION.hint}
        </Typography>
      </Stack>

      <Box sx={{ mt: jtSpacing.section.sm }}>
        <ActionPathTree
          pinned={pin === 'all' ? null : pin}
          onPin={(key) => setPin(key ?? 'all')}
          lead={lead === 'all' ? null : lead}
          onLead={(key) => setLead(key ?? 'all')}
        />
      </Box>

      <Typography
        variant="captionProse"
        component="p"
        sx={{
          mt: jtSpacing.section.sm,
          maxWidth: jtSpacing.paragraphMaxWidth.default,
          color: 'base.100',
        }}
      >
        {PATH_SECTION.topNote(topCount)}
      </Typography>
    </Section>
  )
}
