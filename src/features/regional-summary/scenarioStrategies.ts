/** Adaptation strategies per scenario, shown by the kiosk guide and the results-page recap. */
export interface StrategyStep {
  title: string
  description: string
}

export const scenarioStrategies: Record<string, StrategyStep[]> = {
  'eco-machine': [
    {
      title: 'Restore tidal landscapes in Suisun Marsh',
      description:
        'Restoration around Grizzly Island changes how tidal energy moves through Suisun Bay, testing whether working wetlands can help limit inland salinity.',
    },
    {
      title: 'Build vegetated landforms in Franks Tract',
      description:
        'New land use interrupts a major route for saltwater intrusion while creating habitat, recreation, and eco-cultural opportunities.',
    },
  ],
  'new-green-watershed': [
    {
      title: 'Keep peat soils wet',
      description:
        'Rice, paludiculture, floating wetlands, and managed wetlands help slow land subsidence while supporting habitat and carbon storage.',
    },
    {
      title: 'Reconnect Delta habitats',
      description:
        'Tidal wetlands, floodplains, side channels, riverbanks, and higher ground form connected spaces for water, fish, plants, and wildlife.',
    },
    {
      title: 'Restore the upstream watershed',
      description:
        'Forest stewardship, meadow restoration, and reconnected floodplains help landscapes hold water and release it more gradually.',
    },
  ],
  'calling-on-reserves': [
    {
      title: 'Reoperate Shasta Reservoir',
      description:
        'Managers change when water is stored and released, balancing a drought reserve against freshwater flows needed downstream.',
    },
    {
      title: 'Send differently timed flows toward the Delta',
      description:
        'Releases travel down the Sacramento River to resist salinity intrusion and support habitats connected to freshwater inflow.',
    },
  ],
  'bolster-and-fortify': [
    {
      title: 'Operate new gates at Franks Tract',
      description:
        'Two drought-time salinity-control gates regulate movement through the northeastern and southeastern corners of the tract.',
    },
    {
      title: 'Reconstruct levees to direct freshwater',
      description:
        'Reclaimed levees inside Franks Tract direct San Joaquin River water south into Old River.',
    },
    {
      title: 'Fortify the Old River corridor',
      description:
        'Strengthened levees protect the freshwater route toward Clifton Court Forebay and the southern pumping plants.',
    },
  ],
  'a-tunnel': [
    {
      title: 'Divert water at northern Delta intakes',
      description:
        'Some Sacramento River water enters a new conveyance route before traveling through the Delta channel network.',
    },
    {
      title: 'Carry water beneath the Delta',
      description:
        'An underground route moves water directly toward Bethany Reservoir while changing the freshwater remaining in Delta channels.',
    },
  ],
}
