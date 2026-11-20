// The "How to read this" panel each view opens with: a plain title, a few how-to-read points with a glyph each, a "Try it" tip and a
// button to start. The words are in howToReadContent.ts.
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { HowToReadContent } from './howToReadContent'

export type HowToReadGlyph =
  'blocks' | 'ribbons' | 'key' | 'list' | 'network' | 'zoom' | 'split' | 'size' | 'wheels' | 'rings'

const TITLE_ID = 'co-design-how-to-read-title'

// Small stroke drawings, one per kind of point. Decorative: the text says it all.
const glyphs: Record<HowToReadGlyph, ReactNode> = {
  blocks: (
    <>
      <rect x="3" y="3" width="6" height="11" rx="1" />
      <rect x="3" y="17" width="6" height="4" rx="1" />
      <rect x="15" y="3" width="6" height="7" rx="1" />
      <rect x="15" y="13" width="6" height="8" rx="1" />
    </>
  ),
  ribbons: (
    <>
      <path d="M3 6c9 0 9 12 18 12" />
      <path d="M3 12c9 0 9-6 18-6" />
    </>
  ),
  key: (
    <>
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="6" cy="17" r="2.5" />
      <path d="M12 7h9M12 17h9" />
    </>
  ),
  list: (
    <>
      <path d="M4 6h10M4 12h10M4 18h10" />
      <path d="M17 11l2 2 3-4" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="7" r="2.5" />
      <circle cx="17" cy="19" r="1.8" />
      <path d="M9.5 10.5L6.5 7.5M14.5 10.8l2.6-2M13.8 14.5l2.2 3" />
    </>
  ),
  zoom: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-5-5M8 11h6M11 8v6" />
    </>
  ),
  split: (
    <>
      <path d="M3 12h18" />
      <circle cx="8" cy="6" r="2" />
      <circle cx="16" cy="5" r="1.5" />
      <circle cx="10" cy="18" r="2" />
      <circle cx="17" cy="18" r="1.5" />
    </>
  ),
  size: (
    <>
      <circle cx="8" cy="14" r="5" />
      <circle cx="18" cy="8" r="2.5" />
    </>
  ),
  wheels: (
    <>
      <circle cx="7" cy="12" r="4.5" />
      <circle cx="17" cy="12" r="4.5" />
    </>
  ),
  rings: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 3v4.5M21 12h-4.5" />
    </>
  ),
}

function Glyph({ name, size = 22 }: { name: HowToReadGlyph | 'hand'; size?: number }) {
  return (
    <Box
      component="svg"
      aria-hidden
      viewBox="0 0 24 24"
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
    >
      {name === 'hand' ? (
        <>
          <path d="M9 11V5a2 2 0 0 1 4 0v6" />
          <path d="M13 9a2 2 0 0 1 4 0v3" />
          <path d="M17 11a2 2 0 0 1 4 0v4a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.4L4 14.5a2 2 0 0 1 3.3-2.2L9 14" />
        </>
      ) : (
        glyphs[name]
      )}
    </Box>
  )
}

export default function HowToReadDialog({
  open,
  onClose,
  content,
}: {
  open: boolean
  onClose: () => void
  content: HowToReadContent | null
}) {
  return (
    <Dialog
      open={open && content !== null}
      onClose={onClose}
      transitionDuration={200}
      aria-labelledby={TITLE_ID}
      slotProps={{
        backdrop: { sx: (theme) => ({ bgcolor: theme.coDesign.shell.dialog.backdrop }) },
        paper: {
          sx: (theme) => ({
            width: '90%',
            maxWidth: theme.coDesign.shell.dialog.maxWidth,
            maxHeight: '88vh',
            m: 0,
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            color: 'common.white',
            bgcolor: theme.coDesign.shell.dialog.background,
            border: theme.coDesign.shell.dialog.border,
            borderRadius: theme.coDesign.shell.dialog.radius,
            boxShadow: theme.coDesign.shell.dialog.shadow,
          }),
        },
      }}
    >
      {content && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
            <Typography id={TITLE_ID} variant="editorialEmphasis" component="h2">
              {content.title}
            </Typography>
            <IconButton
              aria-label="Close"
              onClick={onClose}
              sx={(theme) => ({
                width: 40,
                height: 40,
                flexShrink: 0,
                color: 'base.100',
                border: `1px solid ${theme.coDesign.shell.dialog.closeBorder}`,
              })}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {content.questions && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                variant="takeawayLabel"
                component="p"
                sx={(theme) => ({ color: theme.coDesign.shell.dialog.label })}
              >
                {content.questions.label}
              </Typography>
              {content.questions.items.map((question) => (
                <Typography
                  key={question}
                  variant="cardBody"
                  sx={(theme) => ({
                    px: 1.75,
                    py: 1.25,
                    borderRadius: '10px',
                    bgcolor: theme.coDesign.shell.dialog.quoteBackground,
                  })}
                >
                  {question}
                </Typography>
              ))}
            </Box>
          )}

          <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 0, p: 0 }}>
            {content.points.map((point) => (
              <Box
                component="li"
                key={point.lead}
                sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', listStyle: 'none' }}
              >
                <Box
                  sx={(theme) => ({
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    color: 'primary.main',
                    bgcolor: theme.coDesign.shell.dialog.glyphBackground,
                  })}
                >
                  <Glyph name={point.glyph} />
                </Box>
                <Typography variant="cardBody">
                  <Box component="strong">{point.lead}</Box>{' '}
                  <Box component="span" sx={{ color: 'base.100' }}>
                    {point.detail}
                  </Box>
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={(theme) => ({
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-start',
              p: 2,
              borderRadius: '10px',
              color: 'primary.main',
              bgcolor: theme.coDesign.shell.dialog.tipBackground,
            })}
          >
            <Glyph name="hand" size={20} />
            <Typography variant="cardBody" sx={{ color: 'common.white' }}>
              <Box component="strong">Try it:</Box> {content.tryIt}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography
              variant="meta"
              sx={(theme) => ({ color: theme.coDesign.shell.dialog.label })}
            >
              Reopen anytime with “How to read this”
            </Typography>
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                typography: 'tableValueStrong',
                textTransform: 'none',
                borderRadius: 999,
                px: 2.75,
                minHeight: 44,
              }}
            >
              Start exploring
            </Button>
          </Box>
        </>
      )}
    </Dialog>
  )
}
