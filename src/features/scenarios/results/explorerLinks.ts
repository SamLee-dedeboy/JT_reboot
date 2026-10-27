/** Scenario explorer keys for the adaptation scenarios, by page slug. */
const explorerScenarioKeys: Record<string, string> = {
  'eco-machine': 'ecomachine',
  'new-green-watershed': 'newgreen',
  'bolster-and-fortify': 'bolster',
  'calling-on-reserves': 'reserve',
  'a-tunnel': 'tunnel',
}

/** Deep link into the scenario explorer for an outflow variation or an adaptation scenario. */
export const explorerHref = (target: { outflowExplorerKey: string } | { scenarioSlug: string }) =>
  'outflowExplorerKey' in target
    ? `/pages/scenario-explorer?mode=tiered-outflows&scenario=${target.outflowExplorerKey}`
    : `/pages/scenario-explorer?scenario=${explorerScenarioKeys[target.scenarioSlug] ?? ''}`
