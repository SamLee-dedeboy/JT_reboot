// Eco-cultural's measured values: the rows beneath each metric in the By criterion table.
// Change a number here and the table and its maps follow. The scores on the metric rows
// themselves are in ../scores.ts. See ./types.ts for how to read this file.
import type { TeamValues } from './types'

export const ECO_CULTURAL_VALUES: TeamValues = {
  adaptation: {
    // Ecosystem Restoration › Tidal wetlands (acres)
    'ec-restoration-tidal': {
      values: {
        ngw: { inDelta: { '*': 67000 } },
        em: { inDelta: { '*': 43100 } },
        bf: { inDelta: { '*': 0 } },
        cor: { inDelta: { '*': 0 } },
        tunnel: { inDelta: { '*': 0 } },
        bau: { inDelta: { '*': 0 } },
      },
    },
    // Ecosystem Restoration › Managed wetlands (acres)
    'ec-restoration-managed': {
      values: {
        ngw: { inDelta: { '*': 102982 } },
        em: { inDelta: { '*': 0 } },
        bf: { inDelta: { '*': 0 } },
        cor: { inDelta: { '*': 0 } },
        tunnel: { inDelta: { '*': 0 } },
        bau: { inDelta: { '*': 0 } },
      },
    },
    // Ecosystem Restoration › Wet-soil agriculture (acres)
    'ec-restoration-rice': {
      values: {
        ngw: { inDelta: { '*': 145833 } },
        em: { inDelta: { '*': 0 } },
        bf: { inDelta: { '*': 0 } },
        cor: { inDelta: { '*': 0 } },
        tunnel: { inDelta: { '*': 0 } },
        bau: { inDelta: { '*': 0 } },
      },
    },
    // Ecosystem Restoration › Forests (acres)
    'ec-restoration-uplandWetland': {
      values: {
        ngw: { upper: { '*': 48213 } },
        em: { upper: { '*': 0 } },
        bf: { upper: { '*': 0 } },
        cor: { upper: { '*': 0 } },
        tunnel: { upper: { '*': 0 } },
        bau: { upper: { '*': 0 } },
      },
    },
    // Ecosystem Restoration › Meadows (acres)
    'ec-restoration-meadow': {
      values: {
        ngw: { upper: { '*': 11586 } },
        em: { upper: { '*': 0 } },
        bf: { upper: { '*': 0 } },
        cor: { upper: { '*': 0 } },
        tunnel: { upper: { '*': 0 } },
        bau: { upper: { '*': 0 } },
      },
    },
    // Ecosystem Restoration › Floodplains (acres)
    'ec-restoration-floodplain': {
      values: {
        ngw: { upper: { '*': 6360 } },
        em: { upper: { '*': 0 } },
        bf: { upper: { '*': 0 } },
        cor: { upper: { '*': 0 } },
        tunnel: { upper: { '*': 0 } },
        bau: { upper: { '*': 0 } },
      },
    },
    // Ecosystem Restoration › Potential for functional flow (arrows or score)
    'ec-restoration-functional-flow': {
      steps: { em: 0, ngw: 0, bf: 0, cor: 2, tunnel: -2, more: 3 },
    },
  },
  outflow: {
    // Restoration ›  (acres)
    'ec-restoration-tidal': { values: { hist: 0, more: 0, less: 0 } },
    // Restoration ›  (acres)
    'ec-restoration-managed': { values: { hist: 0, more: 0, less: 0 } },
    // Restoration ›  (acres)
    'ec-restoration-rice': { values: { hist: 0, more: 0, less: 0 } },
    // Restoration ›  (acres)
    'ec-restoration-uplandWetland': { values: { hist: 0, more: 0, less: 0 } },
    // Restoration ›  (acres)
    'ec-restoration-meadow': { values: { hist: 0, more: 0, less: 0 } },
    // Restoration ›  (acres)
    'ec-restoration-floodplain': { values: { hist: 0, more: 0, less: 0 } },
    // Restoration › Potential for functional flow (arrows or score)
    'ec-restoration-functional-flow': {
      values: { hist: 0, more: 3, less: 0 },
      steps: { hist: 0, more: 3, less: -2 },
    },
  },
}
