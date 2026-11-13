// The evaluation criteria, one file each in the shape of ./types, in the site's order.
import { ecoculturalRestoration } from './ecoculturalRestoration'
import { ecology } from './ecology'
import { economy } from './economy'
import { environmentalJustice } from './environmentalJustice'
import { recreation } from './recreation'
import type { Criterion, CriterionId } from './types'

export const criteria: Criterion[] = [
  ecology,
  environmentalJustice,
  ecoculturalRestoration,
  recreation,
  economy,
]

export const criterionById = Object.fromEntries(
  criteria.map((criterion) => [criterion.id, criterion]),
) as Record<CriterionId, Criterion>

export type * from './types'
