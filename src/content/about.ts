// Everything the About us page says. Layout stays in features/background; change the words
// here. Add a bio to a person in `TEAM.members` and they move from the names list into the
// bios.

const IMAGES = '/images'

export const ABOUT_HERO = {
  title: 'About us',
  lede: 'Just Transitions in the Delta is a University of California research project about participatory scenario planning for equitable water management in the Sacramento–San Joaquin Delta.',
  image: `${IMAGES}/workshop-session.jpg`,
}

export const ABOUT_PROJECT = {
  id: 'project',
  eyebrow: 'The Project',
  title: 'What we do',
  lead: 'We work with Delta communities, researchers and practitioners to envision equitable futures for water management amid drought, salinity, and sea-level rise.',
  body: 'Through interviews, workshops, exhibitions and UC courses, public participants help define the future scenarios we study and the criteria used to compare them. The research team then models and evaluates each scenario so that its tradeoffs can be weighed side by side, in public.',
}

export interface TeamMember {
  /** The name as the person wants it shown, credentials included. */
  name: string
  /** The bio after the name, starting with its own punctuation (", is a…" or " is a…"). */
  bio?: string
}

export const TEAM: {
  id: string
  eyebrow: string
  title: string
  lead: string
  /** Heading over the people whose bios aren't in yet, and the line under it. */
  pendingTitle: string
  pendingNote: string
  members: TeamMember[]
} = {
  id: 'team',
  eyebrow: 'The Team',
  title: 'Who we are',
  lead: 'A multidisciplinary research team, with participatory scenario planning at its center, linked to parallel research units across the state.',
  pendingTitle: 'Also on the team',
  pendingNote: 'Their bios are forthcoming.',
  members: [
    { name: 'Brett Milligan, MLA' },
    {
      name: 'Ana M. Zepeda, Ph.D.',
      bio: ', is a Postdoctoral Scholar at UC Davis, where she earned her PhD in Geography with a designated emphasis in Feminist Theory and Methodology. She brings social science perspectives and qualitative research approaches to multidisciplinary projects that examine the social dimensions of environmental change.',
    },
    { name: 'Maggie Gallagher' },
    {
      name: 'Ashley N. DePew, Ph.D.',
      bio: ' is a Postdoctoral Scholar at University of California, Davis, where she earned her Ph.D. in Energy Systems. She focuses on energy and climate change solutions, with special attention to environmental justice, decision-making strategy, and life cycle assessment (LCA).',
    },
    {
      name: 'K Tomari, MS. MA.',
      bio: ' is a Ph.D. candidate in Geography at UC Davis. They study the role of agricultural drones in reshaping Maya peasant economies in Central America, focusing on Indigenous data sovereignty and autonomy. As part of Just Transitions, they examined scenario governance using social network analysis.',
    },
    { name: 'Jessica Rudnick, Ph.D.' },
    { name: 'Kwan-Liu Ma, Ph.D.' },
    {
      name: 'Yun-Hsin Kuo',
      bio: ' is a Ph.D. candidate in Computer Science at the University of California, Davis, specializing in visual communication and high-dimensional data visualization. For Just Transitions, she designs visualizations and develops the project website to make scenario modeling and evaluation more accessible to researchers, stakeholders, and the public.',
    },
    { name: 'Sam YuTe Lee' },
    { name: 'Josue Medellin-Azuara, Ph.D.' },
    { name: 'Jeffrey Jenkins, Ph.D.' },
    { name: 'Isaac Sanchez Terrazas' },
    { name: 'Daniel Cayan, Ph.D.' },
    { name: 'Justin Marsh' },
    { name: 'John Durand, Ph.D.' },
    { name: 'Lynette Williams Duman' },
    { name: 'Elsie Platzer' },
    { name: 'Jenna Israel, Ph.D.' },
    { name: 'Laurel Larsen, Ph.D.' },
    { name: 'Steve Culberson, Ph.D.' },
    { name: 'Yu Cai, Ph.D.' },
  ],
}
