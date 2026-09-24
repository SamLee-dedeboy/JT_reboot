// Ported from JT_dashboard/src/lib/Flow/components/SectionWrapper.svelte.
// `bind:section` becomes section + onSectionChange.
import { motion } from 'framer-motion'
import { assetUrl } from '../../../../../utils/baseUrl'
import type { BlockAggregator } from '../renderers/BlockAggregator'
import type { tSectionMetadata } from '../types'
import Section from './Section'

const cubicOut = (t: number) => (t - 1) ** 3 + 1

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
      <div
        role="button"
        tabIndex={0}
        className="show-icon-container pointer-events-auto relative h-[1.5rem] w-[1.5rem] cursor-pointer hover:bg-gray-300"
        style={{ zIndex: 10 * total_sections - index }}
        onClick={(e) => {
          e.preventDefault()
          onSectionChange({ ...section, hidden: false })
        }}
      >
        {/* folder-plus.svg does not exist in the original's public/ either. */}
        <img src={assetUrl('images/co-design/folder-plus.svg')} alt="show" />
        <span className="hidden-section-title hidden w-max"> {section.title}</span>
      </div>
    )
  }
  return (
    // in:fly|global={{ x: 40, duration: 500 }}
    <motion.div
      className="section-container pointer-events-none flex flex-col"
      style={{
        width: `${(100 * section.columns.length) / total_columns}%`,
        zIndex: 10 * (total_sections - index),
      }}
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: cubicOut }}
    >
      <Section section={section} block_aggregator={block_aggregator} />
    </motion.div>
  )
}
