// Static replacements for the JT_dashboard FastAPI endpoints. Every endpoint
// was a deterministic read, so scripts/co-design/snapshot_api.py writes each
// response to public/data/co-design/ and these helpers serve them. Function
// names follow the original routes; each resolves to the same JSON payload the
// server returned.
import { assetUrl } from '../../utils/baseUrl'

const cache = new Map<string, Promise<unknown>>()

function loadJson<T>(path: string): Promise<T> {
  let request = cache.get(path)
  if (!request) {
    request = fetch(assetUrl(`data/co-design/${path}`)).then((response) => {
      if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`)
      return response.json()
    })
    // Allow a retry after a failed request instead of caching the rejection.
    request.catch(() => cache.delete(path))
    cache.set(path, request)
  }
  return request as Promise<T>
}

function notFound(detail: string): Error {
  return new Error(detail)
}

// GET /api/flow/data/
export const getFlowData = <T = unknown>() => loadJson<T>('flow/data.json')

// GET /api/mental-model/codebook/
export const getCodebook = <T = unknown>() => loadJson<T>('mental-model/codebook.json')

// GET /api/mental-model/codebook/parent_tsne/
export const getCodebookParentTsne = <T = unknown>() => loadJson<T>('mental-model/parent-tsne.json')

// GET /api/mental-model/mental_model/interview/
export const getInterviewMentalModels = <T = unknown>() =>
  loadJson<T>('mental-model/interview.json')

// GET /api/mental-model/mental_model/exhibition/
export const getExhibitionMentalModels = <T = unknown>() =>
  loadJson<T>('mental-model/exhibition.json')

// GET /api/sunburst/data/
export const getSunburstData = <T = unknown>() => loadJson<T>('sunburst/data.json')

// POST /api/sunburst/code/ { code_name }
export async function getSunburstCode<T = unknown>(codeName: string): Promise<T> {
  const name = codeName.replace('(general)', '').trim()
  const codes = await loadJson<Record<string, T>>('sunburst/codes.json')
  if (!(name in codes)) throw notFound(`Code '${name}' not found`)
  return codes[name]
}

// GET /api/linking/scenarios/
export const getScenarios = <T = unknown>() => loadJson<T>('linking/scenarios.json')

// POST /api/linking/scenarios/codes_manual/ { scenario }
export async function getScenarioCodes<T = unknown>(scenario: string): Promise<T> {
  const all = await loadJson<Record<string, T>>('linking/scenario-codes.json')
  if (!(scenario in all)) throw notFound(`Scenario '${scenario}' not found in data`)
  return all[scenario]
}

// POST /api/linking/codes/summarize/ { code }
export async function summarizeCode<T = unknown>(code: string): Promise<T> {
  const summaries = await loadJson<Record<string, T>>('linking/code-summaries.json')
  if (!(code in summaries)) throw notFound(`Code '${code}' not found in data`)
  return summaries[code]
}
