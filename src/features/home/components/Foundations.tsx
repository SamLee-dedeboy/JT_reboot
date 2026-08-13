// Landing-page foundations section that introduces the research premise and
// supporting context cards.
import { Box } from '@mui/material'
import Section from '../../../ui/Section'
import SectionHead from '../../../ui/SectionHead'
import ScrollReveal from '../../../ui/animation/ScrollReveal'
import Icon from '../../../ui/Icon'
import SimpleCard from '../../../ui/cards/SimpleCard'
import { FOUNDATIONS } from '../content/homeContent'
import { splitLead } from '../../../utils/highlightText'

export default function Foundations() {
  return (
    <Section id="foundations">
      <SectionHead eyebrow="Foundations" title="The Idea Behind the Work" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: '1.6rem', md: '2.25rem' },
        }}
      >
        {FOUNDATIONS.map((f, n) => {
          const [lead, rest] = splitLead(f.text)
          return (
            <ScrollReveal key={f.n} delay={n * 0.08}>
              <SimpleCard
                number={f.n}
                title={f.title}
                icon={<Icon name={f.icon} size={28} stroke="var(--mui-palette-primary-main)" />}
                lead={lead}
                body={rest}
              />
            </ScrollReveal>
          )
        })}
      </Box>
    </Section>
  )
}
