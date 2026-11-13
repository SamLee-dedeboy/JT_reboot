// Sample text and use for each typography variant, in display groups. A variant added to
// src/theme/typography.ts without an entry here still shows, under "Other".

export interface TypeSample {
  sample: string
  use: string
}

export const typeGroups: Array<{ label: string; variants: Record<string, TypeSample> }> = [
  {
    label: 'Headings',
    variants: {
      h1: { sample: 'Future scenarios', use: 'Page titles' },
      h2: { sample: 'How the futures were modeled', use: 'Section titles' },
      h3: { sample: 'Three baselines', use: 'Sub-section titles' },
      h4: { sample: 'Adaptation scenarios', use: 'Panel and group titles' },
      h5: { sample: 'Who it looks at', use: 'Small headings' },
      editorialEmphasis: { sample: 'Who gains, and who loses', use: 'Pull-out lines' },
      eyebrow: { sample: 'Evaluation · 02', use: 'Above titles; top-level rail items' },
    },
  },
  {
    label: 'Reading',
    variants: {
      body1: {
        sample: 'Each scenario changes how much fresh water reaches the Delta.',
        use: 'Page copy and section intros',
      },
      bodyLarge: { sample: 'A hero lead line.', use: 'Not for page content or section intros' },
      body2: { sample: 'Supporting copy inside cards and panels.', use: 'Secondary copy' },
      caption: { sample: 'Map legends and figure notes.', use: 'Captions' },
      captionSmall: {
        sample: 'See how salinity changes under each future',
        use: 'Menu captions, sources',
      },
      placeholderNote: {
        sample: 'This section is still being written.',
        use: 'Unfinished content',
      },
      meta: { sample: 'Updated with the second workshop', use: 'Dates and small facts' },
      captionProse: {
        sample: 'Browse project documentation, references, and related projects.',
        use: 'Caption-size prose over several lines; menu descriptions, source notes',
      },
      factDate: { sample: 'Jun 2024 – Aug 2025', use: 'Dates listed under a fact' },
      citationMark: { sample: '[3]', use: 'Raised citation numbers' },
      chapterTitle: { sample: 'Two rivers meet', use: 'Scroll-story chapter titles' },
      cardHeading: {
        sample: 'Full report',
        use: 'Raised document card titles (ResourceReportCard)',
      },
      cardTitle: { sample: 'Who bears the change', use: 'Card titles' },
      cardBody: { sample: 'Card copy at a fixed size so cards line up.', use: 'Card copy' },
      accentCardTitle: { sample: 'Eco Machine', use: 'Accent-plate card titles' },
    },
  },
  {
    label: 'Navigation and controls',
    variants: {
      navigationLabel: { sample: 'Future Scenarios', use: 'Navbar items, menu links' },
      navigationSubLabel: { sample: 'Historical baseline', use: 'Nested and criterion rail items' },
      navigationShortcut: { sample: 'Salinity Pattern Explorer', use: 'Nested menu shortcuts' },
      button: { sample: 'Compare the scenarios', use: 'Buttons and tab labels' },
      controlLabel: { sample: 'Weight', use: 'Labels over inputs' },
      controlValue: { sample: 'Business as Usual', use: 'Values in selects and toggles' },
      columnHead: { sample: 'What it represents', use: 'Table column heads' },
      controlValueSelected: { sample: 'Business as Usual', use: 'The chosen option in a select' },
      chipLabel: { sample: 'Ecology', use: 'Filled tag chip labels' },
      chipQualifier: { sample: 'juvenile', use: 'Lighter qualifier after a chip label' },
    },
  },
  {
    label: 'Numbers',
    variants: {
      displayNumber: { sample: '05', use: 'One large number on a panel' },
      statNumber: { sample: '+3.4', use: 'Headline stats' },
      statNumberCompact: { sample: '+3.4', use: 'Stats stacked in rows' },
      statInline: { sample: '42%', use: 'A figure inside a sentence' },
      statValue: { sample: '12 of 20', use: 'Stats inside cards' },
      numberTimeline: { sample: '2009', use: 'Timeline years' },
      numberGhost: { sample: '03', use: 'Quiet step numbers' },
      numberScore: { sample: '−2.0', use: 'Scores' },
      numberArticle: { sample: '01', use: 'Numbered article heads' },
      numberRank: { sample: '1st', use: 'Ranks' },
      numberBadge: { sample: '02', use: 'Tab and badge numbers' },
    },
  },
  {
    label: 'Charts and tables',
    variants: {
      chartTitle: { sample: 'Overall ranking', use: 'Chart titles' },
      chartUnit: { sample: '(µS/cm)', use: 'A unit beside a chart title; keeps its case' },
      chartLabel: { sample: 'Ecology', use: 'Series labels' },
      chartAxis: { sample: '−5   0   +5', use: 'Axis ticks (base.300: below 4.5:1 on the ground)' },
      chartValue: { sample: '+2.5', use: 'Values on bars' },
      chartValueLarge: { sample: '+2.5', use: 'Values on large bars' },
      chartSentenceValue: { sample: 'Eco Machine', use: 'Values in a chart sentence' },
      sentenceValueLarge: { sample: 'New Green Watershed', use: 'Large sentence values' },
      tableValueStrong: { sample: 'Historical Baseline', use: 'Table row heads' },
    },
  },
  {
    label: 'Takeaways',
    variants: {
      takeawayScenario: { sample: 'Calling on Reserves', use: 'Scenario over its takeaways' },
      takeawayLead: { sample: 'The first line of a takeaway.', use: 'Takeaway lead' },
      takeawayBody: { sample: 'The rest of the takeaway.', use: 'Takeaway copy' },
      takeawayBodyStrong: { sample: 'Habitat', use: 'Takeaway table row head' },
      takeawayLabel: { sample: 'What changes', use: 'Takeaway labels' },
    },
  },
  {
    label: 'Brand marks',
    variants: {
      logo: { sample: 'Just Transitions in the Delta', use: 'Navbar wordmark' },
      logoHero: { sample: 'Just Transitions in the Delta', use: 'Home hero wordmark' },
      footerLogo: { sample: 'Just Transitions in the Delta', use: 'Footer wordmark' },
      scenarioPanelTitle: { sample: 'Bolster & Fortify', use: 'Landing scenario panel titles' },
    },
  },
]
