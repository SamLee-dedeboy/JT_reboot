import { useEffect, useState } from 'react'
import type { Geometry } from 'geojson'
import { assetUrl } from '../../utils/baseUrl'

export interface RegionalPattern {
  id: string
  candidateType: string
  direction: 'saltier' | 'fresher' | null
  patternType: string | null
  startDate: string | null
  endDate: string | null
  durationDays: number | null
  qualifyingDays: number | null
  baselineEc: number | null
  scenarioEc: number | null
  differenceEc: number | null
  differencePct: number | null
  stationCount: number | null
  stationAgreement: number | null
  stationCoverage: number | null
  thresholdEc: number | null
  additionalThresholdDays: number | null
  sustainedReversals: number | null
  reversalsPerYear: number | null
  reviewStatus: string
  reviewNote: string
  proposedDisplayRegion: string
  broaderStoryGroup: string
}

export interface RegionalPlace {
  id: string
  name: string
  coordinates: [number, number]
  geographyScale: string
  geometryStatus: string
  geometryNote: string
  geometry: Geometry | null
  trend: 'saltier' | 'fresher' | 'flipping' | 'unclear'
  patterns: RegionalPattern[]
}

interface ScenarioPatterns {
  label: string
  places: RegionalPlace[]
}

interface RegionalSummaryDataset {
  generatedAt: string
  sourceRecordCount: number
  scenarios: Record<string, ScenarioPatterns>
}

const scenarioKeyBySlug: Record<string, string> = {
  'bolster-and-fortify': 'bolster',
  'eco-machine': 'ecomachine',
  'new-green-watershed': 'newgreen',
  'calling-on-reserves': 'reserve',
}

export function useRegionalPlaces(scenarioSlug: string) {
  const [result, setResult] = useState<{
    scenarioSlug: string | null
    places: RegionalPlace[]
    error: string | null
  }>({ scenarioSlug: null, places: [], error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetch(assetUrl('/data/regional-summary/pattern-list.json'), {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Pattern data request failed (${response.status})`)
        return response.json() as Promise<RegionalSummaryDataset>
      })
      .then((dataset) => {
        const scenarioKey = scenarioKeyBySlug[scenarioSlug]
        setResult({
          scenarioSlug,
          places: scenarioKey ? (dataset.scenarios[scenarioKey]?.places ?? []) : [],
          error: null,
        })
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return
        setResult({
          scenarioSlug,
          places: [],
          error: reason instanceof Error ? reason.message : 'Pattern data could not be loaded.',
        })
      })

    return () => controller.abort()
  }, [scenarioSlug])

  const loading = result.scenarioSlug !== scenarioSlug
  return {
    places: loading ? [] : result.places,
    loading,
    error: loading ? null : result.error,
  }
}
