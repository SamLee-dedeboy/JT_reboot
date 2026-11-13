// The frame every home narrative panel shares: a full-width colored section, its content
// in the rail grid's content column, and the panel's eyebrow and title. Each panel brings
// its own body.
import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import type { ReactNode } from 'react'
import type { HomeSection } from '@/content/home'
import { RailGrid, SectionHead } from '@/ui'

export default function HomePanel({
  section,
  bg,
  maxWidth,
  headSx,
  sx,
  children,
}: {
  section: HomeSection
  /** The panel's background; the slants above and below it use the same color. */
  bg: string
  /** How wide the panel's text column may grow. */
  maxWidth: string | number
  /** Overrides for the eyebrow-and-title block, e.g. its space below. */
  headSx?: SxProps<Theme>
  /** Overrides for the section itself, e.g. a shorter panel. */
  sx?: SxProps<Theme>
  children: ReactNode
}) {
  return (
    <Box
      component="section"
      id={section.id}
      sx={[
        (theme) => ({
          position: 'relative',
          zIndex: 1,
          minHeight: '100dvh',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          py: { xs: theme.jtSpacing.section.lg, md: theme.jtSpacing.section.xl },
          bgcolor: bg,
          color: 'common.white',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <RailGrid
        sx={(theme) => ({
          width: '100%',
          pl: 'var(--home-rail-inset)',
          pr: { xs: theme.jtSpacing.gap.lg, md: theme.jtSpacing.section.md },
        })}
      >
        <Box sx={{ width: '100%', maxWidth }}>
          <SectionHead
            eyebrow={section.eyebrow}
            title={section.title}
            titleColor="common.white"
            sx={headSx}
          />
          {children}
        </Box>
      </RailGrid>
    </Box>
  )
}
