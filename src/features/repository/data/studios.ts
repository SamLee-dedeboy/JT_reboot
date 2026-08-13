/* Service Learning & Design Studios — content ported verbatim from the
   design handoff (repo-learning.jsx `STUDIOS`). */

const IMG = '/images/repo/'

export interface Studio {
  n: string
  title: string
  place: string
  img: string
  desc: string
}

export const STUDIOS: Studio[] = [
  {
    n: '01',
    title: 'Futures for Isleton',
    place: 'Town of Isleton',
    img: IMG + 'studio-isleton.png',
    desc: 'Applying sustainable strategies to the town of Isleton using Scenario Planning.',
  },
  {
    n: '02',
    title: 'Feral by Design',
    place: 'Delta Meadows State Park',
    img: IMG + 'studio-feral-meadows.png',
    desc: 'Site planning design concepts envisioned for the Delta Meadows State Park.',
  },
  {
    n: '03',
    title: 'Feral by Design',
    place: 'Cosumnes River Corridor',
    img: IMG + 'studio-feral-cosumnes.png',
    desc: 'Public access and multi-benefit design concepts for the Cosumnes River Corridor.',
  },
]
