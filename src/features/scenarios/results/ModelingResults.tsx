import RegionalSalinitySummary from '../../regional-summary/RegionalSalinitySummary'

/** The simplified regional salinity view: saltier and fresher places, then when it happens. */
export default function ModelingResults({
  scenarioSlug,
  scenarioTitle,
  outflowVariation,
  explorerHref,
  showHeading,
  headingId = 'modeling-results-title',
}: {
  scenarioSlug: string
  scenarioTitle: string
  outflowVariation?: 'increase' | 'decrease'
  explorerHref: string
  showHeading?: boolean
  headingId?: string
}) {
  const regionalScenarioSlug =
    scenarioSlug === 'tiered-outflows' ? 'alternative-delta-outflows' : scenarioSlug
  const scenarioKeyOverride =
    outflowVariation === 'increase'
      ? 'schism_run16_plus30pct_outflow'
      : outflowVariation === 'decrease'
        ? 'schism_run17_minus10pct_outflow'
        : undefined

  return (
    <RegionalSalinitySummary
      key={`${regionalScenarioSlug}-${scenarioKeyOverride ?? 'default'}`}
      scenarioSlug={regionalScenarioSlug}
      scenarioTitle={scenarioTitle}
      scenarioKeyOverride={scenarioKeyOverride}
      explorerHref={explorerHref}
      headingId={headingId}
      showHeading={showHeading}
    />
  )
}
