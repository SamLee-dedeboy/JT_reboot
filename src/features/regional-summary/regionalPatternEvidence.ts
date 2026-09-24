import { useEffect, useState } from 'react'
import { assetUrl } from '../../utils/baseUrl'

export interface PatternStationEvidence {
  stationId: number
  name: string
  shortName: string
  longitude: number
  latitude: number
  baselineMean: number
  scenarioMean: number
  differenceEc: number
  differencePct: number | null
  direction: 'saltier' | 'fresher'
  agreesWithPattern: boolean
}

export interface PatternEvidence {
  patternId: string
  scenarioKey: string
  regionId: string
  regionName: string
  eventWindow: { startDate: string; endDate: string }
  stationEvidence: {
    provenance: string
    membershipSource: string
    stationCount: number
    stations: PatternStationEvidence[]
  }
  narrative: {
    headline: string
    description: string
    provenance: string
    reviewStatus: string
  }
}

export interface RegionalStrategyAnnotation {
  id: string
  startDate: string
  endDate: string
  label: string
  description: string
  provenance: string
  reviewStatus: string
}

export interface PatternEvidenceDataset {
  schemaVersion: number
  generatedAt: string
  simulation: { startDate: string; endDate: string; metric: string; units: string }
  scenarios: Record<
    string,
    { label: string; regionOrder: string[]; annotations: RegionalStrategyAnnotation[] }
  >
  patterns: Record<string, PatternEvidence>
}

export function usePatternEvidence() {
  const [data, setData] = useState<PatternEvidenceDataset | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(assetUrl('/data/regional-summary/pattern-evidence.json'), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Evidence request failed (${response.status})`)
        return response.json() as Promise<PatternEvidenceDataset>
      })
      .then(setData)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setData(null)
      })
    return () => controller.abort()
  }, [])

  return data
}
