'use client'

function ChessCaseStudy({ project, onClose }) {
  const knight = project.visuals?.[0]
  const king = project.visuals?.[1]
  const bulldog = project.pages?.find((page) => page.visual)?.visual
  const links = project.links ?? []

  return (
    <section className="project-case-study chess-case-study" aria-label="Lux et Mat case study">
      <button className="case-close" onClick={onClose} aria-label="Close project">× CLOSE</button>

      <div className="case-sheet">
        <header>
          <p className="case-kicker">Project 02 · Java desktop game</p>
          <h1 className="case-title">Lux et<br />Mat</h1>
          <p className="case-subtitle">Light and Checkmate</p>
          <p className="case-lead">
            A local two-player chess game built in Java and Swing that turns one familiar 8×8 board into four different rule systems.
          </p>
          <div className="case-meta" aria-label="Project details">
            <span>{project.year}</span>
            <span>{project.role}</span>
            <span>{project.category}</span>
          </div>
        </header>

        <div className="chess-hero" aria-label="Lux et Mat chess artwork">
          <div className="chess-board" aria-hidden="true">
            {Array.from({ length: 64 }, (_, index) => <span key={index} />)}
          </div>
          {knight && <img className="chess-piece piece-knight" src={knight.src} alt={knight.alt} />}
          {king && <img className="chess-piece piece-king" src={king.src} alt={king.alt} />}
        </div>

        <div className="case-sections">
          <section className="case-section">
            <p className="case-section-label">The project</p>
            <h2>One board.<br />Four ways to play.</h2>
            <p>
              Players use click-to-select and click-to-move controls, then choose a ruleset from the main menu. The variants share the same chess foundation while changing captures, win conditions, or what happens during a turn.
            </p>

            <div className="mode-grid" aria-label="Game modes">
              <article className="mode-card">
                <strong>Normal Chess</strong>
                <span>Traditional movement, check, checkmate and stalemate rules.</span>
                <em>♔</em>
              </article>
              <article className="mode-card">
                <strong>Bomb Chess</strong>
                <span>A capture clears the captured square and its surrounding 3×3 area.</span>
                <em>✦</em>
              </article>
              <article className="mode-card">
                <strong>Full Capture</strong>
                <span>Victory comes from removing every opposing piece from the board.</span>
                <em>×</em>
              </article>
              <article className="mode-card mode-bulldog">
                <strong>Bulldog Chess</strong>
                <span>After a normal move, the same player relocates a neutral bulldog to an empty square.</span>
                {bulldog && <img src={bulldog.src} alt="" aria-hidden="true" />}
              </article>
            </div>
          </section>

          <section className="case-section run-panel">
            <p className="case-section-label">System + run it</p>
            <h2>Built as a reusable chess system.</h2>
            <p>
              The project uses an 8×8 Board, a shared Piece base class, individual piece subclasses, Swing scene navigation with CardLayout, and separate mode classes that reuse the core chess logic.
            </p>

            <div className="case-tech" aria-label="Technologies used">
              {project.tech?.map((tech) => <span key={tech}>{tech}</span>)}
            </div>

            <div className="case-links" aria-label="Project links">
              {links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>
              ))}
            </div>

            <div className="run-grid">
              <article className="run-card">
                <strong>Run on Mac</strong>
                <ol>
                  <li>Download and unzip the Mac build.</li>
                  <li>Keep the JAR and resources folder together.</li>
                  <li>Confirm Java 8+ with <code>java -version</code>.</li>
                  <li>Run <code>java -jar Lux-et-Mat.jar</code>.</li>
                </ol>
              </article>
              <article className="run-card">
                <strong>Run on Windows</strong>
                <ol>
                  <li>Download and unzip the Windows build.</li>
                  <li>Keep the included files together.</li>
                  <li>Make sure Java 8+ is installed.</li>
                  <li>Open <code>Run-Lux-et-Mat.bat</code>.</li>
                </ol>
              </article>
            </div>
          </section>
        </div>

        <footer className="case-footer">
          <span>Team · {project.collaborators?.join(' · ')}</span>
          <span>Java · Swing · Desktop game</span>
        </footer>
      </div>
    </section>
  )
}

function GenericCaseStudy({ project, onClose }) {
  const details = project.pages?.flatMap((page) => page.items ?? []).slice(0, 6) ?? []
  const summary = project.summary ?? project.pages?.[0]?.body ?? ''

  return (
    <section className="project-case-study generic-case" aria-label={`${project.title} case study`}>
      <button className="case-close" onClick={onClose} aria-label="Close project">× CLOSE</button>
      <div className="case-sheet">
        <p className="case-kicker">{project.category} · {project.year}</p>
        <h1 className="case-title">{project.title}</h1>
        <p className="case-subtitle">{project.role}</p>
        <div className="generic-summary case-section">
          <p>{summary}</p>
          {details.length > 0 && <ul>{details.map((item) => <li key={item}>{item}</li>)}</ul>}
        </div>
      </div>
    </section>
  )
}

export default function ProjectOverlay({ activeProject, hoveredProject, onClose }) {
  if (!activeProject) {
    return (
      <>
        <div className="projects-title-block">
          <p>Selected work / 2026</p>
          <h1>Projects</h1>
          <span>Pick a book.</span>
        </div>
        <div className={`hover-label ${hoveredProject ? 'is-visible' : ''}`} aria-live="polite">
          {hoveredProject && (
            <>
              <span>{hoveredProject.category}</span>
              <strong>{hoveredProject.title}</strong>
            </>
          )}
        </div>
        <div className="projects-instruction">Scroll to move one book at a time · Click to enter a project</div>
      </>
    )
  }

  if (activeProject.id === 'chess') {
    return <ChessCaseStudy project={activeProject} onClose={onClose} />
  }

  return <GenericCaseStudy project={activeProject} onClose={onClose} />
}
