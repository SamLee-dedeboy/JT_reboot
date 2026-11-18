// What the Background page's desktop and phone layouts share: the three chapters with their
// icons and accents, the scroll steps that drive the map, and the scroller that tracks them.
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import RouteIcon from '@mui/icons-material/Route'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import type { Theme } from '@mui/material'
import { useEffect, useState, type ReactNode, type RefObject } from 'react'
import scrollama, { type DecimalType } from 'scrollama'
import { backgroundOverview, baselineBackgroundChapters } from '@/content/background'
import type { ScenariosBackgroundMapStep } from '@/map/background/ScenariosBackgroundLayers'

export interface ContextChapter {
  id: string
  kicker: string
  title: string
  body: string
  icon: ReactNode
  /** The chapter's accent, read from the theme palette. */
  accent: (palette: Theme['palette']) => string
  mapStep: ScenariosBackgroundMapStep
}

const chapterPresentation = {
  '01': { icon: <RouteIcon />, accent: (palette: Theme['palette']) => palette.primary.main },
  '02': { icon: <CompareArrowsIcon />, accent: (palette: Theme['palette']) => palette.accent.blue },
  '03': { icon: <WaterDropIcon />, accent: (palette: Theme['palette']) => palette.accent.yellow },
} as const

export const contextChapters: ContextChapter[] = baselineBackgroundChapters.map((chapter) => ({
  ...chapter,
  ...chapterPresentation[chapter.id],
}))

/** The overview, then each chapter: the anchor each card carries and the map step it shows. */
export const scrollSteps = [
  { id: 'overview', label: backgroundOverview.kicker, mapStep: 'overview' as const },
  ...contextChapters.map((chapter) => ({
    id: `section-${chapter.id}`,
    label: chapter.kicker,
    mapStep: chapter.mapStep,
  })),
]

/**
 * The map step of the card the reader is on. Every `.scenario-scroll-step` under `root`
 * is a step, in the order of `scrollSteps`; `offset` is how far down the screen a card's
 * top must pass to become the current one.
 */
export function useActiveStep(root: RefObject<HTMLElement | null>, offset: DecimalType) {
  const [activeStep, setActiveStep] = useState<ScenariosBackgroundMapStep>('overview')

  useEffect(() => {
    const stepElements = root.current?.querySelectorAll<HTMLElement>('.scenario-scroll-step')
    if (!stepElements || stepElements.length === 0) return undefined

    const scroller = scrollama()
    scroller.setup({ step: stepElements, offset, threshold: 4 }).onStepEnter(({ index }) => {
      setActiveStep(scrollSteps[index]?.mapStep ?? 'overview')
    })

    const handleResize = () => scroller.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      scroller.destroy()
    }
  }, [root, offset])

  return activeStep
}
