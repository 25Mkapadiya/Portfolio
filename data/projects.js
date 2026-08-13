export const projects = [
  {
    id: 'yale-housing',
    slug: 'yale-housing',
    title: 'Yale Housing',
    year: '2026',
    category: 'Product + Data',
    role: 'Developer',
    interactive: true,
    book: { color: '#b14f66', accent: '#f4d9dc', height: 1.72, width: 1.08, thickness: 0.28 },
    pages: [
      { kicker: 'PROJECT 01', title: 'Yale Housing', body: 'A housing-focused digital product built around clearer discovery and decision-making.', tone: '#f5e7df' },
      { kicker: 'THE IDEA', title: 'Make the search feel human.', body: 'The prototype explores how structured information and approachable interaction can reduce friction in a complicated search.', tone: '#ead3c7' },
      { kicker: 'PROTOTYPE', title: 'Built to be explored.', body: 'This placeholder spread will later hold screenshots, system diagrams, process notes and live-product details.', tone: '#f3eee6' },
    ],
  },
  {
    id: 'chess',
    slug: 'chess',
    title: 'Lux et Mat',
    year: '2026',
    category: 'Game Systems',
    role: 'Developer',
    interactive: true,
    book: { color: '#6e2632', accent: '#f0c59d', height: 1.92, width: 1.14, thickness: 0.34 },
    pages: [
      { kicker: 'PROJECT 02', title: 'Lux et Mat', body: 'Three interpretations of chess, treated as a system-design and interface experiment.', tone: '#efe3d4' },
      { kicker: 'SYSTEM', title: 'Same rules. Different worlds.', body: 'The project studies how presentation, interaction and constraints can change the feeling of a familiar game.', tone: '#dfc8b3' },
      { kicker: 'DETAILS', title: 'A reusable game foundation.', body: 'Final case-study spreads can include board states, architecture, motion studies and playable links.', tone: '#f2e9df' },
    ],
  },
  {
    id: 'deed-filings',
    slug: 'deed-filings',
    title: 'County Filings',
    year: '2026',
    category: 'Data Tooling',
    role: 'Developer',
    interactive: true,
    book: { color: '#c96b38', accent: '#f6dfbf', height: 1.58, width: 0.98, thickness: 0.24 },
    pages: [
      { kicker: 'PROJECT 03', title: 'County Filings', body: 'A data workflow for organizing and working with county deed-of-trust filing information.', tone: '#f3e0c9' },
      { kicker: 'PROCESS', title: 'Turn raw records into something usable.', body: 'The case study will document ingestion, cleanup, structure and the interface around the resulting information.', tone: '#ead2b7' },
      { kicker: 'OUTPUT', title: 'Useful data, not just more data.', body: 'This prototype page will eventually show examples, code decisions and practical outcomes.', tone: '#f5ebe0' },
    ],
  },
  { id: 'archive-01', slug: 'archive-01', title: 'Archive 01', year: '2026', category: 'Archive', interactive: false, book: { color: '#8b9077', accent: '#dfe0cf', height: 1.48, width: 0.92, thickness: 0.2 } },
  { id: 'playground', slug: 'playground', title: 'Playground', year: '2026', category: 'Experiments', interactive: false, book: { color: '#466a57', accent: '#cfe0d4', height: 1.78, width: 1.0, thickness: 0.3 } },
  { id: 'workout', slug: 'workout', title: 'Workout Tracker', year: '2026', category: 'Application', interactive: false, book: { color: '#b79032', accent: '#f0e4b5', height: 1.64, width: 1.02, thickness: 0.25 } },
  { id: 'systems', slug: 'systems', title: 'Systems', year: '2026', category: 'Notes', interactive: false, book: { color: '#655f91', accent: '#d9d5ec', height: 1.86, width: 1.12, thickness: 0.32 } },
  { id: 'about-book', slug: 'about-book', title: 'About Me', year: '2026', category: 'Index', interactive: false, book: { color: '#d5c7ad', accent: '#4d463d', height: 1.5, width: 0.9, thickness: 0.19 } },
  { id: 'notes', slug: 'notes', title: 'Notes', year: '2026', category: 'Writing', interactive: false, book: { color: '#7d4f3d', accent: '#e7d4c7', height: 1.7, width: 0.98, thickness: 0.26 } },
  { id: 'lab', slug: 'lab', title: 'Lab', year: '2026', category: '3D', interactive: false, book: { color: '#3d6575', accent: '#d0e3e8', height: 1.9, width: 1.06, thickness: 0.31 } },
  { id: 'archive-02', slug: 'archive-02', title: 'Archive 02', year: '2025', category: 'Archive', interactive: false, book: { color: '#a8806b', accent: '#eadbd0', height: 1.56, width: 0.94, thickness: 0.23 } },
  { id: 'mystery', slug: 'mystery', title: '???', year: '', category: 'Unknown', interactive: false, book: { color: '#252423', accent: '#d8d2c7', height: 1.74, width: 1.0, thickness: 0.28 } },
]

export const interactiveProjects = projects.filter((project) => project.interactive)

export function findProject(slug) {
  return projects.find((project) => project.slug === slug) ?? null
}
