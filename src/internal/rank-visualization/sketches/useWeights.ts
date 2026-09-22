import { useCallback, useState } from 'react'
import { EQUAL_WEIGHTS } from '../data'
import type { Weights } from '../data'

/** Team weights owned by a single sketch; each sketch is weighted independently. */
export function useWeights() {
  const [weights, setWeights] = useState<Weights>(EQUAL_WEIGHTS)
  const setWeight = useCallback((teamIndex: number, value: number) => {
    setWeights((current) => current.map((w, i) => (i === teamIndex ? value : w)))
  }, [])
  return { weights, setWeight, setWeights }
}

/** Row re-rank motion; MotionConfig on the page honors reduced-motion preferences. */
export const rerankTransition = { duration: 0.25, ease: 'easeOut' } as const
