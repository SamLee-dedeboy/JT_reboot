// What each view's "How to read this" panel says. One entry per view path;
// HowToReadDialog lays it out. Keep each point to one short sentence.
import type { HowToReadGlyph } from './HowToReadDialog'

export type HowToReadContent = {
  title: string
  /** The interview questions a view is built from, when it helps to name them. */
  questions?: { label: string; items: string[] }
  points: { glyph: HowToReadGlyph; lead: string; detail: string }[]
  tryIt: string
}

export const howToRead: Record<string, HowToReadContent> = {
  '/flow': {
    title: 'Answer along with the interviewees',
    points: [
      {
        glyph: 'blocks',
        lead: 'Each column is a question; each block is an answer.',
        detail: 'Taller blocks were given by more people.',
      },
      {
        glyph: 'ribbons',
        lead: 'Bands join answers from the same people.',
        detail: "A band's color is the group those people belong to.",
      },
      {
        glyph: 'key',
        lead: 'Groups share the same salinity strategies.',
        detail: 'The key beside the chart names each group.',
      },
    ],
    tryIt: 'click a block to give your own answer and see how many people agree.',
  },
  '/linking': {
    title: 'See what went into each scenario',
    points: [
      {
        glyph: 'list',
        lead: 'Pick a scenario on the left.',
        detail: 'Its description opens beside it.',
      },
      {
        glyph: 'network',
        lead: 'Bubbles are the values and concerns it drew on.',
        detail: 'Bigger bubbles came up in more interviews.',
      },
      {
        glyph: 'zoom',
        lead: 'Zoom with + and −,',
        detail: 'or drag to move around the diagram.',
      },
    ],
    tryIt: 'hover a bubble to see how many people raised it and how they talked about it.',
  },
  '/mental-model': {
    title: 'How participants picture salinity',
    questions: {
      label: 'Built from two questions',
      items: [
        'What has the most influence on Delta salinity management?',
        'What is most at risk if salinity increases?',
      ],
    },
    points: [
      {
        glyph: 'split',
        lead: 'Drivers sit above, impacts below.',
        detail: 'Salinity is at the center.',
      },
      {
        glyph: 'size',
        lead: 'Bigger bubbles were named more often.',
        detail: 'The number is how many times.',
      },
    ],
    tryIt: 'hover a bubble to read what participants said about it.',
  },
  '/sunburst': {
    title: 'Compare mental models side by side',
    points: [
      {
        glyph: 'wheels',
        lead: "Each wheel is one group's mental model,",
        detail: 'such as an age group or residents.',
      },
      {
        glyph: 'rings',
        lead: 'Inner ring: themes. Outer ring: the ideas within them.',
        detail: 'Wider slices came up more.',
      },
    ],
    tryIt: 'click a theme to zoom into it; click the center to zoom back out.',
  },
}
