import { adaptationScenarios } from '@/content/scenarios'
import CriteriaGrid from './CriteriaGrid'
import FamilySection from './FamilySection'

/** The five adaptation scenarios, scored by every criterion. */
export default function AdaptationFamily() {
  return (
    <FamilySection
      id="adaptation-scenarios"
      number="02"
      title="Adaptation scenarios"
      summary="Every criterion evaluated the five adaptation scenarios. Scores compare each one with Business as Usual: positive is better, negative is worse."
      background={700}
      actions={[
        { label: 'Compare in the ranking', href: '/scenarios/ranking' },
        { label: 'View Modeling results', href: '/scenarios/modeling' },
      ]}
    >
      <CriteriaGrid
        rows={adaptationScenarios.map((scenario) => ({
          slug: scenario.slug,
          label: scenario.title,
        }))}
      />
    </FamilySection>
  )
}
