import { Box } from '@mui/material'
import { useState } from 'react'
import ChoiceCards from '@/features/scenario-modeling/components/ChoiceCards'
import { jtSpacing } from '@/theme'
import {
  AccentPlateCard,
  ArticleAccordionCard,
  Icon,
  NotchTabCard,
  ResourceReportCard,
  SideGlowCard,
  SimpleCard,
  SplitRailCard,
  StudioFeatureCard,
} from '@/ui'
import DesignSection from '../parts/DesignSection'
import Specimen, { UsageTag } from '../parts/Specimen'

const lead =
  'Scenarios are models and depictions of possible futures and the pathways through which they could manifest.'
const body =
  'Participatory scenario planning works directly with public contributors to create and evaluate future scenarios for a particular place.'

const notUsed = <UsageTag used={false}>Not used yet</UsageTag>

const choiceGroups = [
  {
    id: 'adaptation',
    title: 'Adaptation scenarios',
    options: [
      { id: 'eco', label: 'Eco Machine' },
      { id: 'ngw', label: 'New Green Watershed' },
      { id: 'bf', label: 'Bolster & Fortify' },
    ],
  },
] as const

/** All eight cards in src/ui/cards, plus the modeling page's choice cards. */
export default function CardsSection() {
  const [choice, setChoice] = useState('eco')
  const [articleOpen, setArticleOpen] = useState(true)

  return (
    <DesignSection
      id="cards"
      eyebrow="Components"
      title="Cards"
      intro="Every card in src/ui/cards. Only two are used by a feature today; the tag on each says where."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: jtSpacing.section.sm,
          alignItems: 'start',
        }}
      >
        <Specimen name="SimpleCard" spec="surface, border.subtle, radius 4." usage={notUsed}>
          <SimpleCard
            number="01"
            icon={<Icon name="compass" size={28} />}
            title="What are scenarios?"
            lead={lead}
          />
        </Specimen>
        <Specimen name="AccentPlateCard" spec="Green plate over a base.700 body." usage={notUsed}>
          <AccentPlateCard
            eyebrow="Foundations"
            number="01"
            title="What are scenarios?"
            lead={lead}
            body={body}
          />
        </Specimen>
        <Specimen
          name="NotchTabCard"
          spec="Green tab on a base.700 card with a green top edge."
          usage={notUsed}
        >
          <NotchTabCard
            eyebrow="Foundations"
            number="01"
            title="What are scenarios?"
            icon={<Icon name="compass" size={30} />}
            lead={lead}
            body={body}
          />
        </Specimen>
        <Specimen
          name="SplitRailCard"
          spec="Number on a base.900 rail beside a base.500 panel."
          usage={notUsed}
        >
          <SplitRailCard
            eyebrow="Foundations"
            number="01"
            title="What are scenarios?"
            icon={<Icon name="compass" size={40} />}
            lead={lead}
            body={body}
          />
        </Specimen>
        <Specimen
          name="SideGlowCard"
          spec="Glass panel with a glowing green (or blue) edge."
          usage={notUsed}
        >
          <SideGlowCard
            number="02"
            title="More Delta outflow"
            label="Variation I"
            body="A square glass panel with a left status bar."
          />
        </Specimen>
        <Specimen
          name="ArticleAccordionCard"
          spec="Closed: one row of number, title, source · year. Open: a reading card with a source / authors / year table and the abstract. The height eases open; the chevron turns."
          usage={<UsageTag>repository · ArticleAccordion</UsageTag>}
        >
          <ArticleAccordionCard
            number="01"
            title="Delta Adapts"
            source="Delta Stewardship Council"
            authors="Delta Stewardship Council staff"
            year="2021"
            open={articleOpen}
            onToggle={() => setArticleOpen(!articleOpen)}
          >
            Why the source matters opens below the title row.
          </ArticleAccordionCard>
        </Specimen>
        <Specimen
          name="ResourceReportCard"
          spec="Raised panel: full-bleed 16:10 cover, type label, title, description, then a footer of download / view links. Hover lifts it and zooms the cover."
          usage={<UsageTag>repository · Timeline</UsageTag>}
        >
          <ResourceReportCard
            badge="Report"
            title="Workshop report"
            image="/images/repo/workbook.png"
            description="Hover lifts the edge to green."
            actions={[{ label: 'Download', kind: 'download' }]}
          />
        </Specimen>
        <Specimen
          name="ChoiceCards"
          spec="One choice among groups; the chosen card gets the green edge and check."
          usage={<UsageTag>scenario-modeling</UsageTag>}
        >
          <ChoiceCards groups={choiceGroups} value={choice} onChange={setChoice} />
        </Specimen>
      </Box>
      <Specimen
        name="StudioFeatureCard"
        spec="Raised panel: 16:10 image with the studio number over a scrim, place, title, description and a Download button. Laid out two to a row."
        usage={<UsageTag>repository · StudioShowcase</UsageTag>}
      >
        <StudioFeatureCard
          number="01"
          title="Studio project"
          image="/images/repo/studio-isleton.png"
          imageAlt="Studio project specimen"
          place="Isleton"
          body="Hover lifts the card and zooms the image."
        />
      </Specimen>
    </DesignSection>
  )
}
