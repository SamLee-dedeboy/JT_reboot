import { describe, expect, it } from 'vitest'
import { scenarioCodeForLabel, scenarioName, teamBySlug, teamShortName } from './names'

describe('scenarioCodeForLabel', () => {
  it('abbreviates the dataset labels the explorer shows', () => {
    expect(scenarioCodeForLabel('Eco Machine')).toBe('ECO')
    expect(scenarioCodeForLabel('Bolster & Fortify (SLR)')).toBe('B&F SLR')
    expect(scenarioCodeForLabel('Baseline (SLR)')).toBe('BAU SLR')
    expect(scenarioCodeForLabel('Business as Usual (CalSim)')).toBe('BAU CalSim')
    expect(scenarioCodeForLabel('Business as Usual (CalSim, SLR)')).toBe('BAU CalSim SLR')
    expect(scenarioCodeForLabel('Business As Usual')).toBe('BAU')
  })

  it('drops the SLR mark when asked', () => {
    expect(scenarioCodeForLabel('New Green Watershed (SLR)', { keepSlr: false })).toBe('NGW')
  })

  it('leaves labels it does not know, and the SCHISM "Baseline", unchanged', () => {
    expect(scenarioCodeForLabel('Baseline')).toBe('Baseline')
    expect(scenarioCodeForLabel('Run 15 · Reference Outflow')).toBe('Run 15 · Reference Outflow')
  })
})

describe('variants', () => {
  it('uses a place’s own wording where it has one', () => {
    expect(scenarioName('bf')).toBe('Bolster & Fortify')
    expect(scenarioName('bf', 'scenarioStory')).toBe('Bolster and Fortify')
    expect(scenarioName('more', 'rankingTable')).toBe('Increased Delta outflow')
    expect(scenarioName('em', 'rankingTable')).toBe('Eco Machine')
    expect(teamShortName('environmentalJustice', 'weightPresets')).toBe('Justice')
    expect(teamBySlug('ecocultural-restoration')?.key).toBe('ecoCultural')
  })
})
