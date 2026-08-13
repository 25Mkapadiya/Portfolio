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
    subtitle: 'Light and Checkmate',
    year: '2026',
    category: 'Game Systems',
    role: 'Developer · Team Project',
    collaborators: ['Allen Huang', 'Milind Kapadiya', 'Mason Mifflin'],
    interactive: true,
    summary: 'A local two-player Java chess game that turns one familiar board into four different rule systems.',
    book: {
      color: '#03346a',
      accent: '#990000',
      paper: '#f7f1e7',
      theme: 'chess',
      height: 1.88,
      width: 1.18,
      thickness: 0.34,
    },
    tech: ['Java', 'Swing', 'OOP', 'CardLayout', '8×8 board logic'],
    visuals: [
      {
        src: 'https://raw.githubusercontent.com/25Mkapadiya/Chess-3-Different-Versions-Lux-et-Mat-/main/blue_knight.png',
        alt: 'Blue knight artwork used in Lux et Mat',
      },
      {
        src: 'https://raw.githubusercontent.com/25Mkapadiya/Chess-3-Different-Versions-Lux-et-Mat-/main/red_king.png',
        alt: 'Red king artwork used in Lux et Mat',
      },
    ],
    links: [
      {
        label: 'View source',
        href: 'https://github.com/25Mkapadiya/Chess-3-Different-Versions-Lux-et-Mat-',
      },
      {
        label: 'Mac build',
        href: 'https://github.com/25Mkapadiya/Chess-3-Different-Versions-Lux-et-Mat-/raw/refs/heads/main/downloads/Lux-et-Mat-Mac-Compatible.zip',
      },
      {
        label: 'Windows build',
        href: 'https://github.com/25Mkapadiya/Chess-3-Different-Versions-Lux-et-Mat-/raw/refs/heads/main/downloads/Lux-et-Mat-Windows.zip',
      },
    ],
    pages: [
      {
        kicker: 'PROJECT 02 · JAVA DESKTOP GAME',
        title: 'Lux et Mat',
        body: 'Lux et Mat, meaning Light and Checkmate, is a graphical two-player chess game designed to run locally on one computer. Players use simple click-based controls and choose between four game modes from the main menu.',
        tone: '#f7f1e7',
        items: [
          'Four playable rule sets from one shared chess system',
          'Mouse or trackpad input with click-to-select and click-to-move controls',
          'Custom red and blue chess-piece artwork',
        ],
      },
      {
        kicker: 'FOUR GAME MODES',
        title: 'One board. Four ways to play.',
        body: 'Each mode keeps the same board and piece vocabulary while changing the win condition or what happens during a turn.',
        tone: '#f2eadc',
        items: [
          'Normal Chess · traditional check, checkmate and stalemate rules',
          'Bomb Chess · every capture clears the captured square and its surrounding 3×3 area',
          'Full Capture · win by removing every opposing piece from the board',
          'Bulldog Chess · after a normal move, the same player must relocate a neutral bulldog to an empty square',
        ],
        visual: {
          src: 'https://raw.githubusercontent.com/25Mkapadiya/Chess-3-Different-Versions-Lux-et-Mat-/main/bulldog.png',
          alt: 'Bulldog piece used in the Bulldog Chess game mode',
        },
      },
      {
        kicker: 'SYSTEM DESIGN',
        title: 'Reusable rules underneath the variants.',
        body: 'The game is organized around an 8×8 Board, a shared Piece class, individual piece subclasses, scene navigation, and separate classes for each game mode. The variants reuse the normal chess foundation and override the rules that make them different.',
        tone: '#f7f1e7',
        items: [
          '16 Java source files documented in the project',
          'Piece inheritance for Pawn, Bishop, Knight, Rook, King, Queen and Bulldog',
          'Swing UI with CardLayout for the menu and game scenes',
          'Board-level helpers for legal moves, check, checkmate and variant win conditions',
        ],
      },
      {
        kicker: 'PLAY THE ORIGINAL',
        title: 'A desktop game you can still run.',
        body: 'The repository includes packaged builds for Mac and Windows. The game itself runs locally as a Java Swing application rather than inside the browser, and the project documentation specifies Java 8 or newer.',
        tone: '#f2eadc',
        items: [
          'Mac-compatible downloadable build',
          'Windows downloadable build with a run script',
          'Original source code and project documentation on GitHub',
        ],
        showLinks: true,
      },
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
