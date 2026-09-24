// Ported from JT_dashboard/src/lib/Flow/components/SectionWrapper.svelte.
// `bind:section` becomes section + onSectionChange.
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { assetUrl } from '../../../../../utils/baseUrl'
import type { BlockAggregator } from '../renderers/BlockAggregator'
import type { tSectionMetadata } from '../types'
import Section from './Section'

const cubicOut = (t: number) => (t - 1) ** 3 + 1

// Sections let clicks through to the sankey; blocks and headers opt back in.
const SectionContainer = styled(motion.div)({
  display: 'flex',
  flexDirection: 'column',
  pointerEvents: 'none',
})

interface Props {
  total_sections: number
  total_columns: number
  index: number
  section: tSectionMetadata
  onSectionChange: (section: tSectionMetadata) => void
  block_aggregator: BlockAggregator
}

export default function SectionWrapper({
  total_sections,
  total_columns,
  index,
  section,
  onSectionChange,
  block_aggregator,
}: Props) {
  if (section?.hidden) {
    return (
      <Box
        role="button"
        tabIndex={0}
        sx={(theme) => ({
          position: 'relative',
          width: theme.coDesign.flow.hiddenSectionToggle.size,
          height: theme.coDesign.flow.hiddenSectionToggle.size,
          pointerEvents: 'auto',
          cursor: 'pointer',
          zIndex: 10 * total_sections - index,
          '&:hover': { bgcolor: theme.coDesign.flow.hiddenSectionToggle.hoverBackground },
        })}
        onClick={(e) => {
          e.preventDefault()
          onSectionChange({ ...section, hidden: false })
        }}
      >
        {/* folder-plus.svg does not exist in the original's public/ either. */}
        <img src={assetUrl('images/co-design/folder-plus.svg')} alt="show" />
        <Box component="span" sx={{ display: 'none', width: 'max-content' }}>
          {' '}
          {section.title}
        </Box>
      </Box>
    )
  }
  return (
    // in:fly|global={{ x: 40, duration: 500 }}
    <SectionContainer
      style={{
        width: `${(100 * section.columns.length) / total_columns}%`,
        zIndex: 10 * (total_sections - index),
      }}
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: cubicOut }}
    >
      <Section section={section} block_aggregator={block_aggregator} />
    </SectionContainer>
  )
}
