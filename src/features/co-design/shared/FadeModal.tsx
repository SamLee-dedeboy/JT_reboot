// Replaces Svelte's `transition:fade={{ duration: 200 }}` on the dashboard's
// modal backdrops.
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeProps {
  show: boolean
  className?: string
  onClick?: () => void
  children: ReactNode
}

export default function Fade({ show, className, onClick, children }: FadeProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={className}
          role="button"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'linear' }}
          onClick={onClick}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
