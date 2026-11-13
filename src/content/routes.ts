// Links between features: the criterion (methodology) pages, by team.
import { criteria } from './criteria'

export const findTeam = (teamId: string | undefined) => criteria.find((team) => team.id === teamId)

export const methodologyPath = (teamId: string) => `/scenarios/evaluation/${teamId}`
