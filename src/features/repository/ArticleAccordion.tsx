// Expandable article list for repository/resource pages, with one open
// publication summary at a time.
import { useState } from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Typography } from '@mui/material'
import ScrollReveal from '../../ui/animation/ScrollReveal'
import { ARTICLES, type Article } from './data/resources'
import { jtSpacing } from '../../theme'

function AbstractBody({ a }: { a: Article }) {
  return (
    <>
      <Box
        sx={{
          typography: 'eyebrow',
          color: 'secondary.main',
          pt: jtSpacing.component.md,
          mb: jtSpacing.component.sm,
        }}
      >
        {a.kicker}
      </Box>
      {a.paras.map((p, i) => (
        <Typography
          key={i}
          variant="body1"
          sx={{ color: 'base.100', mb: jtSpacing.component.sm, '&:last-of-type': { mb: 0 } }}
        >
          {p}
        </Typography>
      ))}
      {a.list && (
        <Box
          component="ol"
          sx={{
            pl: jtSpacing.gap.lg,
            mt: jtSpacing.component.xs,
            mb: jtSpacing.component.sm,
          }}
        >
          {a.list.map((li, i) => (
            <Box
              component="li"
              key={i}
              sx={{ typography: 'body1', color: 'base.100', mb: jtSpacing.component.xs }}
            >
              {li}
            </Box>
          ))}
        </Box>
      )}
    </>
  )
}

function AccordionItem({
  a,
  n,
  open,
  onToggle,
}: {
  a: Article
  n: number
  open: boolean
  onToggle: () => void
}) {
  return (
    <Box
      sx={{
        bgcolor: 'surface',
        border: '1px solid',
        borderColor: open ? 'translucent.primaryGreen' : 'border.subtle',
        borderRadius: 1,
        overflow: 'hidden',
        transition: 'border-color 200ms ease',
      }}
    >
      <Box
        component="button"
        onClick={onToggle}
        aria-expanded={open}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr) auto',
          gap: { xs: jtSpacing.gap.sm, sm: jtSpacing.gap.md },
          alignItems: 'center',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          px: { xs: jtSpacing.component.md, sm: jtSpacing.gap.lg },
          py: { xs: jtSpacing.component.sm, sm: jtSpacing.component.md },
          color: 'common.white',
        }}
      >
        <Typography
          variant="numberArticle"
          component="span"
          sx={{ width: (theme) => theme.numbering.article.width }}
        >
          {String(n).padStart(2, '0')}
        </Typography>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="cardTitle"
            component="h3"
            sx={{ color: 'common.white', mb: jtSpacing.component.xs }}
          >
            {a.title}
          </Typography>
          <Box
            sx={{
              typography: 'meta',
              color: 'base.200',
              display: 'flex',
              flexWrap: 'wrap',
              gap: jtSpacing.gap.xs,
            }}
          >
            <Box component="span" sx={{ color: 'primary.main', typography: 'navigationLabel' }}>
              {a.source}
            </Box>
            <Box component="span">{a.meta}</Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
            color: 'primary.main',
          }}
        >
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 320ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Box sx={{ overflow: 'hidden' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto minmax(0, 1fr) auto',
              gap: { xs: jtSpacing.gap.sm, sm: jtSpacing.gap.md },
              px: { xs: jtSpacing.component.md, sm: jtSpacing.gap.lg },
              pb: jtSpacing.component.lg,
              borderTop: 1,
              borderColor: 'border.subtle',
            }}
          >
            <Box sx={{ width: (theme) => theme.numbering.article.width }} />
            <Box
              sx={{
                gridColumn: 2,
                minWidth: 0,
              }}
            >
              <AbstractBody a={a} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

/** Research-articles reading list: accordion, one open at a time. */
export default function ArticleAccordion() {
  const [open, setOpen] = useState(0)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: jtSpacing.gap.sm }}>
      {ARTICLES.map((a, i) => (
        <ScrollReveal key={a.title} delay={Math.min(i, 4) * 0.04}>
          <AccordionItem
            a={a}
            n={i + 1}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        </ScrollReveal>
      ))}
    </Box>
  )
}
