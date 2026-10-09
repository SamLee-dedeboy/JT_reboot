import { useEffect, useState } from 'react'
import type { Config, MapScope } from '../../../map/layers/scenarios/config'
import { map } from '../../../theme'

interface MapState {
  scope: MapScope
  showAdaptationLayers: boolean
}

export default function useMapState(config: Config): MapState {
  const [showAdaptationLayers, setShowAdaptationLayers] = useState(false)
  const [showStatewideMap, setShowStatewideMap] = useState(false)
  const [showEcoculturalLayers, setShowEcoculturalLayers] = useState(false)

  useEffect(() => {
    let animationFrame = 0
    const triggers = config.triggers
    if (!triggers) {
      animationFrame = requestAnimationFrame(() => {
        setShowAdaptationLayers(false)
        setShowStatewideMap(false)
        setShowEcoculturalLayers(false)
      })
      return () => cancelAnimationFrame(animationFrame)
    }

    let statewideTransitionTimer: number | undefined

    const hasReached = (elementId?: string) => {
      if (!elementId) return false
      const element = document.getElementById(elementId)
      return element != null && element.getBoundingClientRect().top <= window.innerHeight * 0.25
    }

    const updateMapState = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        const reachedStatewide = hasReached(triggers.statewide)

        if (reachedStatewide) {
          setShowAdaptationLayers(false)
          if (statewideTransitionTimer == null) {
            statewideTransitionTimer = window.setTimeout(() => {
              setShowStatewideMap(true)
              statewideTransitionTimer = undefined
            }, map.scenarios.layerFadeDurationMs)
          }
        } else {
          if (statewideTransitionTimer != null) {
            window.clearTimeout(statewideTransitionTimer)
            statewideTransitionTimer = undefined
          }
          setShowStatewideMap(false)
          setShowAdaptationLayers(hasReached(triggers.adaptationLayers))
        }

        setShowEcoculturalLayers(reachedStatewide && hasReached(triggers.ecocultural))
      })
    }

    updateMapState()
    window.addEventListener('scroll', updateMapState, { passive: true })
    window.addEventListener('resize', updateMapState)

    return () => {
      cancelAnimationFrame(animationFrame)
      if (statewideTransitionTimer != null) window.clearTimeout(statewideTransitionTimer)
      window.removeEventListener('scroll', updateMapState)
      window.removeEventListener('resize', updateMapState)
    }
  }, [config])

  return {
    showAdaptationLayers,
    scope: showStatewideMap
      ? showEcoculturalLayers
        ? 'statewide-ecocultural'
        : 'statewide'
      : 'delta',
  }
}
