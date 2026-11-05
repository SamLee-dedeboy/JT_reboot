// Env Justice water-age table (Nov 2026): change from each scenario's baseline,
// averaged over the months reported by both runs. Eco Machine, Bolster & Fortify,
// and New Green Watershed use Base; Calling on Reserves and A Tunnel use CalSim base.
type ByRegion = Record<string, Record<string, number>>

export const EJ_WATER_AGE_DAYS: ByRegion = {
  em: {
    suisun: 3.4,
    franksTract: -0.9,
    southDelta: -4.9,
    mcCormackWilliamson: 0.4,
    lindseyCache: 0,
  },
  bf: {
    suisun: 0.1,
    franksTract: 2.4,
    southDelta: -1.1,
    mcCormackWilliamson: 0,
    lindseyCache: 0,
  },
  ngw: {
    suisun: 3.3,
    franksTract: -0.9,
    southDelta: -4.9,
    mcCormackWilliamson: 0.5,
    lindseyCache: 3.6,
  },
  cor: {
    suisun: 0,
    franksTract: -0.1,
    southDelta: 0.1,
    mcCormackWilliamson: 0.1,
    lindseyCache: 0,
  },
  tunnel: {
    suisun: 0.1,
    franksTract: -0.1,
    southDelta: 0.5,
    mcCormackWilliamson: 0.2,
    lindseyCache: -0.4,
  },
}

export const EJ_WATER_AGE_DAYS_SLR: ByRegion = {
  em: {
    suisun: 5.2,
    franksTract: 0.7,
    southDelta: -4.1,
    mcCormackWilliamson: 0.5,
    lindseyCache: -0.3,
  },
  bf: {
    suisun: 0.1,
    franksTract: 2.4,
    southDelta: -0.9,
    mcCormackWilliamson: 0,
    lindseyCache: 0,
  },
  ngw: {
    suisun: 5.2,
    franksTract: 0.7,
    southDelta: -4.1,
    mcCormackWilliamson: 0.7,
    lindseyCache: 3.6,
  },
  cor: {
    suisun: 0,
    franksTract: 0,
    southDelta: 0.2,
    mcCormackWilliamson: 0.1,
    lindseyCache: 0,
  },
  tunnel: {
    suisun: 0,
    franksTract: -0.1,
    southDelta: 0.3,
    mcCormackWilliamson: 0.2,
    lindseyCache: -0.3,
  },
}
