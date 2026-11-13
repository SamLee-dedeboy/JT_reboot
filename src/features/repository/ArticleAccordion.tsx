// The research articles as an accordion, one open at a time; the open one reads as a card.
import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { ArticleAccordionCard, ScrollReveal } from '@/ui'
import { ARTICLES, type Article } from './data/resources'
import { jtSpacing } from '@/theme'

/** "Jess Rudnick, Kenji Tomari, et. al, 2023" → authors and year. */
function splitMeta(meta: string) {
  const match = /^(.*?),?\s*(\d{4})$/.exec(meta)
  return match ? { authors: match[1], year: match[2] } : { authors: meta, year: undefined }
}

function Abstract({ article }: { article: Article }) {
  return (
    <>
      {article.paras.map((para, index) => (
        <Typography
          key={index}
          variant="body1"
          sx={{ color: 'base.100', '& + &': { mt: jtSpacing.component.sm } }}
        >
          {para}
        </Typography>
      ))}
      {article.list && (
        <Box component="ol" sx={{ m: 0, mt: jtSpacing.component.sm, pl: jtSpacing.gap.lg }}>
          {article.list.map((item) => (
            <Typography
              key={item}
              component="li"
              variant="body1"
              sx={{ color: 'base.100', '& + &': { mt: jtSpacing.component.xs } }}
            >
              {item}
            </Typography>
          ))}
        </Box>
      )}
    </>
  )
}

export default function ArticleAccordion() {
  const [open, setOpen] = useState(0)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: jtSpacing.gap.sm }}>
      {ARTICLES.map((article, index) => {
        const { authors, year } = splitMeta(article.meta)
        return (
          <ScrollReveal key={article.title} delay={Math.min(index, 4) * 0.04}>
            <ArticleAccordionCard
              number={String(index + 1).padStart(2, '0')}
              title={article.title}
              source={article.source}
              authors={authors}
              year={year}
              kicker={article.kicker}
              href={article.href}
              open={open === index}
              onToggle={() => setOpen(open === index ? -1 : index)}
            >
              <Abstract article={article} />
            </ArticleAccordionCard>
          </ScrollReveal>
        )
      })}
    </Box>
  )
}
