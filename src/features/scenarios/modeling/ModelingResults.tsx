import RegionalSalinitySummary from '../../regional-summary/RegionalSalinitySummary'

/** Adaptation runs with patterns from the latest data, which the team has yet to review. */
const provisionalKeys: Record<string, { current?: string; seaLevelRise: string }> = {
  'eco-machine': { seaLevelRise: 'provisional_slr_ecomachine' },
  'new-green-watershed': { seaLevelRise: 'provisional_slr_newgreen' },
  'bolster-and-fortify': { seaLevelRise: 'provisional_slr_bolster' },
  'calling-on-reserves': {
    current: 'provisional_current_reserve',
    seaLevelRise: 'provisional_slr_reserve',
  },
  'a-tunnel': { current: 'provisional_current_tunnel', seaLevelRise: 'provisional_slr_tunnel' },
}

/** The simplified regional salinity view: saltier and fresher places, then when it happens. */
export default function ModelingResults({
  scenarioSlug,
  scenarioTitle,
  outflowVariation,
  seaLevelRise = false,
  explorerHref,
  showHeading,
  headingId = 'modeling-results-title',
}: {
  scenarioSlug: string
  scenarioTitle: string
  outflowVariation?: 'increase' | 'decrease'
  seaLevelRise?: boolean
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
        : seaLevelRise
          ? provisionalKeys[scenarioSlug]?.seaLevelRise
          : provisionalKeys[scenarioSlug]?.current

  return (
    <RegionalSalinitySummary
      key={`${regionalScenarioSlug}-${scenarioKeyOverride ?? 'default'}`}
      scenarioSlug={regionalScenarioSlug}
      scenarioTitle={scenarioTitle}
      scenarioKeyOverride={scenarioKeyOverride}
      seaLevelRise={seaLevelRise}
      explorerHref={explorerHref}
      headingId={headingId}
      showHeading={showHeading}
    />
  )
}
