import { Box, Tab, Tabs } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'

export interface StageTab {
  /** Sketch id, e.g. "1a"; shown as the tab's badge. */
  id: string
  label: string
  /** How to read this design; shown in the step's text block, not on the chart. */
  note: string
  content: ReactNode
}

interface TabBarProps {
  label: string
  tabs: StageTab[]
  active: string
  onChange: (id: string) => void
}

/** Pill tabs switching between one step's alternative designs. */
export function StageTabBar({ label, tabs, active, onChange }: TabBarProps) {
  return (
    <Tabs
      value={active}
      onChange={(_, value: string) => onChange(value)}
      aria-label={label}
      variant="scrollable"
      scrollButtons={false}
      sx={(theme) => ({
        minHeight: 0,
        '& .MuiTabs-flexContainer': { gap: theme.jtSpacing.gap.xs },
        '& .MuiTabs-indicator': { display: 'none' },
        '& .MuiTab-root': {
          minHeight: theme.spacing(5),
          px: theme.jtSpacing.component.sm,
          py: 0,
          borderRadius: 999,
          border: 1,
          borderColor: 'border.strong',
          color: 'common.white',
          opacity: 1,
          transition: 'background-color 180ms ease, border-color 180ms ease, color 180ms ease',
          '&:hover, &.Mui-focusVisible': {
            bgcolor: alpha(theme.palette.brand.primaryGreen, 0.14),
            borderColor: alpha(theme.palette.brand.primaryGreen, 0.4),
          },
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            borderColor: 'primary.main',
            color: 'common.black',
          },
        },
      })}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          value={tab.id}
          id={`design-tab-${tab.id}`}
          aria-controls={`design-panel-${tab.id}`}
          label={
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 1 }}>
              <Box component="span" sx={{ typography: 'numberBadge', color: 'inherit' }}>
                {tab.id}
              </Box>
              {tab.label}
            </Box>
          }
        />
      ))}
    </Tabs>
  )
}

/**
 * Tab panels for one step. Every panel stays mounted (inactive ones are
 * hidden) so each design keeps its own weights when the user flips tabs.
 */
export function StagePanels({ tabs, active }: { tabs: StageTab[]; active: string }) {
  return (
    <>
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          role="tabpanel"
          id={`design-panel-${tab.id}`}
          aria-labelledby={`design-tab-${tab.id}`}
          hidden={tab.id !== active}
        >
          {tab.content}
        </Box>
      ))}
    </>
  )
}
